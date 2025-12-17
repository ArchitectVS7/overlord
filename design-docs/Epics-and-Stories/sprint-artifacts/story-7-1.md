# Story 7-1: AI Strategic Decision-Making (Notifications)

**Epic:** 7 - AI Opponent System
**Status:** drafted
**Complexity:** Low
**Implementation Tag:** [CORE-DONE] - AIDecisionSystem complete, needs notification UI

## Story Description

As a player, I want to see notifications when the AI opponent makes strategic decisions (building structures, training military, launching attacks), so that I'm aware of enemy activity and can respond strategically.

## Acceptance Criteria

- [ ] AC1: AI turn start/end notifications displayed
  - Verification: See "AI is taking their turn..." message, then completion message

- [ ] AC2: AI building construction shows notification
  - Verification: AI builds structure, see "[AI] constructed [Building] on [Planet]"

- [ ] AC3: AI attack warning displayed
  - Verification: AI targets player planet, see "Enemy fleet detected near [Planet]!"

- [ ] AC4: Hidden AI actions not revealed (fog of war)
  - Verification: AI actions on unscouted planets not shown

- [ ] AC5: Notification log persists in message panel
  - Verification: AI notifications added to scrollable message log

- [ ] AC6: Notifications fire via event subscription
  - Verification: GalaxyMapScene subscribes to AIDecisionSystem events

## Architecture Context

**Core Integration (Already Complete):**
- `AIDecisionSystem.onAITurnStarted` - Fires when AI turn begins
- `AIDecisionSystem.onAITurnCompleted` - Fires when AI turn ends
- `AIDecisionSystem.onAIBuilding` - Fires with (planetID, buildingType)
- `AIDecisionSystem.onAIAttacking` - Fires with (targetPlanetID)

**UI Pattern:**
- Create AINotificationManager or use existing notification system
- Subscribe to AIDecisionSystem events in GalaxyMapScene
- Display toast notifications for visible AI actions
- Add to persistent message log panel

**Dependencies:**
- `AIDecisionSystem.ts` - Events already implemented (no changes)
- `GalaxyMapScene.ts` - Subscribe to AI events
- Notification/Toast component (may need creation)

## Task Breakdown

### Task 1: Create NotificationToast Component
**File:** `src/scenes/ui/components/NotificationToast.ts`
**Duration:** ~15 min
**Description:**
- Extend Phaser.GameObjects.Container
- Display text message with background
- Auto-dismiss after 3-5 seconds
- Stack multiple toasts vertically
- Support different styles (info, warning, danger)

**Tests Required:** 4 unit tests
- Toast displays message
- Auto-dismiss timing works
- Multiple toasts stack
- Style variants applied

### Task 2: Create MessageLog Component
**File:** `src/scenes/ui/components/MessageLog.ts`
**Duration:** ~15 min
**Description:**
- Scrollable text log container
- Add messages with timestamp
- Support message categories (AI, Combat, Economy)
- Toggle visibility (collapse/expand)
- Maximum message limit with oldest removal

**Tests Required:** 4 unit tests
- Messages added to log
- Scroll works when full
- Categories filter correctly
- Oldest messages removed at limit

### Task 3: Subscribe to AI Events
**File:** `src/scenes/GalaxyMapScene.ts`
**Duration:** ~10 min
**Description:**
- Import notification components
- Subscribe to `onAITurnStarted` → show "AI thinking..."
- Subscribe to `onAITurnCompleted` → show "AI turn complete"
- Subscribe to `onAIBuilding` → show building notification
- Subscribe to `onAIAttacking` → show attack warning

**Tests Required:** 4 integration tests
- AI turn events trigger notifications
- Building event shows correct planet/building
- Attack event shows warning
- Events only fire for visible actions

### Task 4: Implement Fog of War Filter
**File:** `src/scenes/GalaxyMapScene.ts`
**Duration:** ~10 min
**Description:**
- Check if player has scouted target planet
- Only show AI notifications for visible planets
- Attack warnings always shown (player is target)
- Building notifications hidden on unscouted planets

**Tests Required:** 2 tests
- Scouted planets show notifications
- Unscouted planets hide notifications

### Task 5: Visual Polish
**File:** `src/scenes/ui/components/NotificationToast.ts`
**Duration:** ~10 min
**Description:**
- Fade in/out animations
- Color coding (blue=info, orange=warning, red=danger)
- Icon support (optional)
- Sound trigger hooks (for future audio)

**Tests Required:** Manual visual testing

## Implementation Notes

**Event Subscription Pattern:**
```typescript
// In GalaxyMapScene.create()
this.aiSystem.onAITurnStarted = () => {
  this.showToast('AI is taking their turn...', 'info');
};

this.aiSystem.onAIBuilding = (planetID, buildingType) => {
  const planet = this.gameState.planetLookup.get(planetID);
  if (this.isPlayerVisible(planetID)) {
    this.showToast(`[AI] built ${buildingType} on ${planet?.name}`, 'warning');
  }
};

this.aiSystem.onAIAttacking = (targetPlanetID) => {
  const planet = this.gameState.planetLookup.get(targetPlanetID);
  this.showToast(`Enemy fleet approaching ${planet?.name}!`, 'danger');
};
```

**Toast Stacking:**
```typescript
private toasts: NotificationToast[] = [];
private readonly TOAST_OFFSET = 60;

showToast(message: string, style: 'info' | 'warning' | 'danger'): void {
  const y = 50 + this.toasts.length * this.TOAST_OFFSET;
  const toast = new NotificationToast(this, 640, y, message, style);
  this.toasts.push(toast);
  toast.on('dismissed', () => this.removeToast(toast));
}
```

## Definition of Done

- [ ] All 5 tasks completed
- [ ] NotificationToast component working
- [ ] MessageLog component working
- [ ] AI events trigger notifications
- [ ] Fog of war filters hidden actions
- [ ] 14+ unit/integration tests passing
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] Visual verification: AI turn shows notifications
- [ ] All acceptance criteria verified
- [ ] Code committed to epic/7-ai branch

---

## Pre-Planning (Game Dev)

### Data Schemas

```typescript
// Toast configuration
interface ToastConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  message: string;
  style: 'info' | 'warning' | 'danger';
  duration?: number;  // Default: 4000ms
}

// Message log entry
interface LogEntry {
  timestamp: number;
  category: 'ai' | 'combat' | 'economy' | 'system';
  message: string;
}
```

### Dependencies Verification

| File | Status | Notes |
|------|--------|-------|
| `src/core/AIDecisionSystem.ts` | ✅ EXISTS | All 4 events implemented |
| `src/scenes/GalaxyMapScene.ts` | ✅ EXISTS | Add event subscriptions |
| `src/scenes/ui/components/` | ✅ EXISTS | Add Toast and MessageLog |

### Critical Code Examples

**NotificationToast structure:**
```typescript
export class NotificationToast extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, message: string, style: string) {
    super(scene, x, y);
    this.createBackground(style);
    this.createText(message);
    this.animateIn();
    this.scheduleRemoval();
    scene.add.existing(this);
  }

  private scheduleRemoval(): void {
    this.scene.time.delayedCall(4000, () => {
      this.animateOut(() => this.emit('dismissed'));
    });
  }
}
```

### Test Strategy

| File | Test Count | Coverage |
|------|-----------|----------|
| `tests/unit/NotificationToast.test.ts` | 4 | Display, dismiss, stack, styles |
| `tests/unit/MessageLog.test.ts` | 4 | Add, scroll, filter, limit |
| `tests/integration/AINotifications.test.ts` | 6 | Event subscription, fog of war |

### Integration Points

1. **GalaxyMapScene.ts** (create): Create notification components
2. **GalaxyMapScene.ts** (create): Subscribe to all 4 AI events
3. **GalaxyMapScene.ts** (new methods): showToast(), addToLog(), isPlayerVisible()
4. **NotificationToast.ts** (new file): Toast UI component
5. **MessageLog.ts** (new file): Persistent message log
