# Story 1-6: Scenario Completion History Tracking

**Epic:** 1 - Player Onboarding & Tutorials
**Status:** drafted
**Complexity:** Medium
**Implementation Tag:** [CORE-PARTIAL] - SaveSystem exists, needs Supabase integration

## Story Description

As a player, I want the system to track my Flash Conflict completion history across sessions and devices, so that my progress is saved and I can see my best times and completion status.

## Acceptance Criteria

- [ ] AC1: Completion saved to Supabase on victory
  - Verification: Complete scenario, data in scenario_completions table

- [ ] AC2: Save includes: user_id, scenario_id, time, attempts
  - Verification: Check database record has all fields

- [ ] AC3: Best time updated on faster completion
  - Verification: Complete faster, best_time_seconds updated

- [ ] AC4: Attempts counter incremented
  - Verification: Retry scenario, attempts increases

- [ ] AC5: Offline completions queued in LocalStorage
  - Verification: Complete offline, see "saved locally" message

- [ ] AC6: Queued records sync when online
  - Verification: Reconnect, see "progress synced" message

## Architecture Context

**Backend Integration:**
- Supabase `scenario_completions` table
- Auth integration for user_id
- Offline queue in LocalStorage

**Core System:**
- ScenarioProgressService handles persistence
- Works with both online/offline modes
- Syncs on reconnect

**Dependencies:**
- Supabase client configuration
- User authentication (may stub for now)
- LocalStorage API

## Task Breakdown

### Task 1: Create ScenarioProgressService
**File:** `src/core/services/ScenarioProgressService.ts`
**Duration:** ~20 min
**Description:**
- Save completion record to Supabase
- Load completion history for user
- Handle offline queue
- Sync queued records

**Tests Required:** 5 unit tests
- Saves to Supabase correctly
- Loads history correctly
- Queues when offline
- Syncs on reconnect
- Updates best time

### Task 2: Define Supabase Schema
**File:** `supabase/migrations/scenario_completions.sql`
**Duration:** ~10 min
**Description:**
- Create scenario_completions table
- Fields: id, user_id, scenario_id, completed, completion_time_seconds, completed_at, attempts, best_time_seconds
- Indexes for performance

**Tests Required:** Schema validation (manual)

### Task 3: Implement Offline Queue
**File:** `src/core/services/OfflineQueueService.ts`
**Duration:** ~15 min
**Description:**
- Store pending records in LocalStorage
- Queue structure with timestamps
- Check queue on app start
- Process queue when online

**Tests Required:** 4 tests
- Queues record offline
- Retrieves queued records
- Processes queue correctly
- Handles empty queue

### Task 4: Connect to Scenario Completion Flow
**File:** `src/scenes/ScenarioGameScene.ts`
**Duration:** ~15 min
**Description:**
- On victory: call ScenarioProgressService.saveCompletion()
- Handle save success/failure
- Show "saved locally" if offline
- Trigger sync check on reconnect

**Tests Required:** 3 integration tests
- Saves on victory
- Handles offline correctly
- Syncs on reconnect

### Task 5: Display Saved Progress
**File:** `src/scenes/FlashConflictsScene.ts`
**Duration:** ~15 min
**Description:**
- Load completion history on scene start
- Display completed/attempts/best time
- Update after sync completes
- Handle loading state

**Tests Required:** 3 tests
- Loads history correctly
- Displays completion data
- Updates after sync

### Task 6: Sync Status Notifications
**File:** `src/scenes/ui/components/SyncStatusIndicator.ts`
**Duration:** ~10 min
**Description:**
- Show "Saving..." indicator
- Show "Saved locally" for offline
- Show "Progress synced" on sync
- Error handling display

**Tests Required:** 3 tests
- Shows correct status
- Transitions between states
- Handles errors

## Implementation Notes

**Supabase Table Schema:**
```sql
CREATE TABLE scenario_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  scenario_id VARCHAR(50) NOT NULL,
  completed BOOLEAN DEFAULT false,
  completion_time_seconds INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER DEFAULT 1,
  best_time_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, scenario_id)
);

CREATE INDEX idx_completions_user ON scenario_completions(user_id);
CREATE INDEX idx_completions_scenario ON scenario_completions(scenario_id);
```

**ScenarioProgressService:**
```typescript
export class ScenarioProgressService {
  private supabase: SupabaseClient;
  private offlineQueue: OfflineQueueService;

  async saveCompletion(result: ScenarioResults): Promise<boolean> {
    if (!navigator.onLine) {
      this.offlineQueue.enqueue('completion', result);
      return false; // Saved locally
    }

    const { error } = await this.supabase
      .from('scenario_completions')
      .upsert({
        user_id: this.getCurrentUserId(),
        scenario_id: result.scenarioId,
        completed: result.completed,
        completion_time_seconds: result.completionTime,
        completed_at: new Date().toISOString(),
        attempts: { increment: 1 },
        best_time_seconds: result.completionTime // UPDATE only if better
      });

    return !error;
  }

  async syncOfflineRecords(): Promise<void> {
    const queued = this.offlineQueue.getAll('completion');
    for (const record of queued) {
      await this.saveCompletion(record);
    }
    this.offlineQueue.clear('completion');
  }
}
```

**Offline Queue:**
```typescript
export class OfflineQueueService {
  private readonly STORAGE_KEY = 'overlord_offline_queue';

  enqueue(type: string, data: unknown): void {
    const queue = this.getQueue();
    queue.push({ type, data, timestamp: Date.now() });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
  }

  getAll(type: string): unknown[] {
    return this.getQueue()
      .filter(item => item.type === type)
      .map(item => item.data);
  }
}
```

## Definition of Done

- [ ] All 6 tasks completed
- [ ] ScenarioProgressService saves to Supabase
- [ ] Offline queue works correctly
- [ ] Progress loads and displays
- [ ] Sync notifications shown
- [ ] Best time updates work
- [ ] 18+ unit/integration tests passing
- [ ] Supabase schema created
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] All acceptance criteria verified
- [ ] Code committed to epic/1-tutorials branch

---

## Pre-Planning (Game Dev)

### Data Schemas

```typescript
// Completion record
interface CompletionRecord {
  userId: string;
  scenarioId: string;
  completed: boolean;
  completionTimeSeconds: number;
  completedAt: Date;
  attempts: number;
  bestTimeSeconds: number;
}

// Offline queue item
interface QueueItem {
  type: 'completion';
  data: ScenarioResults;
  timestamp: number;
}
```

### Dependencies Verification

| File | Status | Notes |
|------|--------|-------|
| `src/config/supabase.ts` | ⚠️ CHECK | Supabase client config |
| `src/core/services/ScenarioProgressService.ts` | ❌ CREATE | Persistence service |
| `src/core/services/OfflineQueueService.ts` | ❌ CREATE | Offline handling |
| `supabase/migrations/` | ⚠️ CHECK | Schema migrations |

### Human Intervention Points

- **Supabase project setup** - Project URL and API keys
- **Database schema deployment** - Run migrations
- **Auth configuration** - User identification strategy

### Test Strategy

| File | Test Count | Coverage |
|------|-----------|----------|
| `tests/unit/ScenarioProgressService.test.ts` | 5 | Save, load, queue, sync, best time |
| `tests/unit/OfflineQueueService.test.ts` | 4 | Enqueue, retrieve, process, clear |
| `tests/integration/ProgressPersistence.test.ts` | 4 | Full save/load flow |
