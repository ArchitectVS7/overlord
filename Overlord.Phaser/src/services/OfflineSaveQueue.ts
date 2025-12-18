/**
 * OfflineSaveQueue - IndexedDB-based Offline Save Queue
 *
 * Queues saves when offline and syncs them when connectivity is restored.
 * Uses IndexedDB for persistence to survive browser restarts.
 */

import { SaveData } from '@core/SaveSystem';
import { getSaveService } from './SaveService';

const DB_NAME = 'overlord_offline_saves';
const DB_VERSION = 1;
const STORE_NAME = 'pending_saves';

interface QueuedSave {
  id: string;
  slotName: string;
  saveName: string;
  saveData: SaveData;
  queuedAt: string;
  retryCount: number;
}

/**
 * OfflineSaveQueue - Manages offline save persistence and sync
 */
export class OfflineSaveQueue {
  private static instance: OfflineSaveQueue | null = null;
  private db: IDBDatabase | null = null;
  private isInitialized = false;
  private isSyncing = false;

  /**
   * Callback fired when sync starts
   */
  public onSyncStarted?: () => void;

  /**
   * Callback fired when sync completes
   */
  public onSyncCompleted?: (successCount: number, failCount: number) => void;

  /**
   * Callback fired when a queued save is synced
   */
  public onSaveSynced?: (slotName: string) => void;

  private constructor() {
    // Setup online/offline listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
    }
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): OfflineSaveQueue {
    if (!OfflineSaveQueue.instance) {
      OfflineSaveQueue.instance = new OfflineSaveQueue();
    }
    return OfflineSaveQueue.instance;
  }

  /**
   * Reset the singleton instance (for testing)
   */
  public static resetInstance(): void {
    if (OfflineSaveQueue.instance) {
      OfflineSaveQueue.instance.close();
      OfflineSaveQueue.instance = null;
    }
  }

  /**
   * Initialize IndexedDB connection
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (typeof indexedDB === 'undefined') {
      console.warn('IndexedDB not available - offline queue disabled');
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create pending saves store
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('slotName', 'slotName', { unique: false });
          store.createIndex('queuedAt', 'queuedAt', { unique: false });
        }
      };
    });
  }

  /**
   * Queue a save for later sync
   */
  public async queueSave(
    saveData: SaveData,
    slotName: string,
    saveName: string,
  ): Promise<void> {
    if (!this.db) {
      await this.initialize();
    }

    if (!this.db) {
      throw new Error('IndexedDB not available');
    }

    const queuedSave: QueuedSave = {
      id: `${slotName}_${Date.now()}`,
      slotName,
      saveName,
      saveData,
      queuedAt: new Date().toISOString(),
      retryCount: 0,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // Remove any existing saves for this slot (we only keep latest per slot)
      const index = store.index('slotName');
      const range = IDBKeyRange.only(slotName);
      const cursorRequest = index.openCursor(range);

      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        }
      };

      transaction.oncomplete = () => {
        // Now add the new save
        const addTransaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const addStore = addTransaction.objectStore(STORE_NAME);
        const addRequest = addStore.add(queuedSave);

        addRequest.onsuccess = () => resolve();
        addRequest.onerror = () => reject(addRequest.error);
      };

      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Get all pending saves
   */
  public async getPendingSaves(): Promise<QueuedSave[]> {
    if (!this.db) {
      await this.initialize();
    }

    if (!this.db) {
      return [];
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get count of pending saves
   */
  public async getPendingCount(): Promise<number> {
    if (!this.db) {
      return 0;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Remove a save from the queue
   */
  public async removeSave(id: string): Promise<void> {
    if (!this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Sync all pending saves to the server
   */
  public async syncPendingSaves(): Promise<{ success: number; failed: number }> {
    if (this.isSyncing) {
      return { success: 0, failed: 0 };
    }

    const pendingSaves = await this.getPendingSaves();
    if (pendingSaves.length === 0) {
      return { success: 0, failed: 0 };
    }

    this.isSyncing = true;
    this.onSyncStarted?.();

    let successCount = 0;
    let failCount = 0;

    const saveService = getSaveService();

    for (const queuedSave of pendingSaves) {
      try {
        await saveService.saveGame(
          queuedSave.saveData,
          queuedSave.slotName,
          queuedSave.saveName,
        );

        await this.removeSave(queuedSave.id);
        successCount++;
        this.onSaveSynced?.(queuedSave.slotName);
      } catch (error) {
        console.error(`Failed to sync save ${queuedSave.slotName}:`, error);
        failCount++;

        // Update retry count
        await this.updateRetryCount(queuedSave.id, queuedSave.retryCount + 1);
      }
    }

    this.isSyncing = false;
    this.onSyncCompleted?.(successCount, failCount);

    return { success: successCount, failed: failCount };
  }

  /**
   * Update retry count for a queued save
   */
  private async updateRetryCount(id: string, retryCount: number): Promise<void> {
    if (!this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const save = getRequest.result;
        if (save) {
          save.retryCount = retryCount;
          const putRequest = store.put(save);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Handle coming back online
   */
  private async handleOnline(): Promise<void> {
    console.log('Network online - attempting to sync pending saves');

    const pendingCount = await this.getPendingCount();
    if (pendingCount > 0) {
      await this.syncPendingSaves();
    }
  }

  /**
   * Check if online
   */
  public isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  /**
   * Clear all pending saves
   */
  public async clearAll(): Promise<void> {
    if (!this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Close the database connection
   */
  public close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
    }
  }
}

/**
 * Get the singleton OfflineSaveQueue instance
 */
export function getOfflineSaveQueue(): OfflineSaveQueue {
  return OfflineSaveQueue.getInstance();
}
