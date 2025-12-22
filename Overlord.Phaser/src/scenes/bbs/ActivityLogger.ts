/**
 * ActivityLogger - Logs all user and game engine actions for debugging
 * Writes to downloadable JSON/CSV format
 */

export interface ActivityLogEntry {
  timestamp: string;
  turn: number;
  actor: 'USER' | 'GAME' | 'AI' | 'SYSTEM';
  action: string;
  details: string;
  screen?: string;
}

export class ActivityLogger {
  private entries: ActivityLogEntry[] = [];
  private sessionId: string;
  private sessionStart: Date;
  private currentTurn: number = 0;
  private currentScreen: string = 'START_MENU';

  constructor() {
    this.sessionStart = new Date();
    this.sessionId = this.generateSessionId();
    this.log('SYSTEM', 'SESSION_START', `Session ${this.sessionId} started`);
  }

  private generateSessionId(): string {
    const now = this.sessionStart;
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  }

  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString();
  }

  /**
   * Set current turn number
   */
  public setTurn(turn: number): void {
    this.currentTurn = turn;
  }

  /**
   * Set current screen
   */
  public setScreen(screen: string): void {
    this.currentScreen = screen;
  }

  /**
   * Log an activity
   */
  public log(actor: 'USER' | 'GAME' | 'AI' | 'SYSTEM', action: string, details: string): void {
    const entry: ActivityLogEntry = {
      timestamp: this.getTimestamp(),
      turn: this.currentTurn,
      actor,
      action,
      details,
      screen: this.currentScreen,
    };
    this.entries.push(entry);

    // Also log to console for real-time debugging
    console.log(`[${entry.actor}] T${entry.turn} ${entry.action}: ${entry.details}`);
  }

  /**
   * Log user action
   */
  public logUser(action: string, details: string): void {
    this.log('USER', action, details);
  }

  /**
   * Log game engine action
   */
  public logGame(action: string, details: string): void {
    this.log('GAME', action, details);
  }

  /**
   * Log AI action
   */
  public logAI(action: string, details: string): void {
    this.log('AI', action, details);
  }

  /**
   * Get all entries
   */
  public getEntries(): ActivityLogEntry[] {
    return [...this.entries];
  }

  /**
   * Get recent entries (last N)
   */
  public getRecentEntries(count: number = 20): ActivityLogEntry[] {
    return this.entries.slice(-count);
  }

  /**
   * Export as JSON string
   */
  public exportJSON(): string {
    const data = {
      sessionId: this.sessionId,
      sessionStart: this.sessionStart.toISOString(),
      exportTime: new Date().toISOString(),
      totalEntries: this.entries.length,
      entries: this.entries,
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Export as CSV string
   */
  public exportCSV(): string {
    const headers = ['timestamp', 'turn', 'actor', 'action', 'details', 'screen'];
    const rows = this.entries.map(e => [
      e.timestamp,
      e.turn.toString(),
      e.actor,
      e.action,
      `"${e.details.replace(/"/g, '""')}"`,
      e.screen || '',
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Download log as file (browser)
   */
  public downloadLog(format: 'json' | 'csv' = 'json'): void {
    const content = format === 'json' ? this.exportJSON() : this.exportCSV();
    const mimeType = format === 'json' ? 'application/json' : 'text/csv';
    const filename = `overlord_debug_${this.sessionId}.${format}`;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.log('SYSTEM', 'LOG_EXPORTED', `Exported ${this.entries.length} entries as ${filename}`);
  }

  /**
   * Get session info
   */
  public getSessionInfo(): { id: string; start: Date; entryCount: number } {
    return {
      id: this.sessionId,
      start: this.sessionStart,
      entryCount: this.entries.length,
    };
  }
}
