# Admin UI Editor Mode Specification

**Version:** 1.0.0
**Date:** 2025-12-18
**Status:** Implemented

---

## Overview

The Admin UI Editor Mode allows authorized administrators to reposition UI panels in real-time during gameplay. Panel positions are persisted to Supabase, enabling layout customization without code deployments.

## Components

### AdminModeService (`src/services/AdminModeService.ts`)

**Purpose:** Manages admin mode state and authorization.

**Key Methods:**
- `isAdminMode(): boolean` - Returns current admin mode state
- `toggleAdminMode(): void` - Toggles edit mode on/off
- `isAuthorized(): boolean` - Checks if current user has admin role

**Authorization:**
- Requires `is_admin: true` flag in `user_profiles` table
- Falls back to `false` if not authenticated

### AdminUIEditorController (`src/services/AdminUIEditorController.ts`)

**Purpose:** Handles panel registration and drag-and-drop functionality.

**Key Methods:**
- `registerPanel(key: string, panel: Phaser.GameObjects.Container): void`
- `unregisterPanel(key: string): void`
- `enableDragging(): void`
- `disableDragging(): void`
- `getPendingChanges(): Map<string, {x: number, y: number}>`
- `savePendingChanges(): Promise<void>`
- `discardPendingChanges(): void`

**Behavior:**
- When admin mode is active, registered panels become draggable
- Changes are tracked as "pending" until explicitly saved
- Visual indicator (AdminEditModeIndicator) shows current mode

### UIPanelPositionService (`src/services/UIPanelPositionService.ts`)

**Purpose:** Persists panel positions to Supabase.

**Key Methods:**
- `loadPositions(): Promise<Map<string, {x: number, y: number}>>`
- `savePosition(panelKey: string, x: number, y: number): Promise<void>`
- `saveAllPositions(positions: Map<string, {x: number, y: number}>): Promise<void>`
- `resetToDefaults(): Promise<void>`

## Database Schema

### Table: `ui_panel_positions`

```sql
CREATE TABLE ui_panel_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  panel_key TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, panel_key)
);

-- RLS Policy: Users can only access their own positions
ALTER TABLE ui_panel_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own positions" ON ui_panel_positions
  FOR ALL USING (auth.uid() = user_id);
```

### Table: `user_profiles` (admin flag)

```sql
ALTER TABLE user_profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
```

## UI Component

### AdminEditModeIndicator (`src/scenes/ui/AdminEditModeIndicator.ts`)

**Purpose:** Visual indicator showing admin edit mode status.

**Features:**
- Displays "EDIT MODE" badge when active
- Shows pending changes count
- Provides Save/Discard buttons
- Positioned in top-right corner of screen

## Usage Flow

1. **Enable Admin Mode:**
   - Admin user clicks edit mode button (or keyboard shortcut)
   - `AdminModeService.toggleAdminMode()` called
   - `AdminUIEditorController.enableDragging()` activates
   - `AdminEditModeIndicator` appears

2. **Reposition Panels:**
   - Admin drags panels to new positions
   - Controller tracks changes in `pendingChanges` map
   - Indicator shows count of unsaved changes

3. **Save Changes:**
   - Admin clicks "Save" button
   - `AdminUIEditorController.savePendingChanges()` called
   - `UIPanelPositionService.saveAllPositions()` persists to Supabase
   - Mode exits automatically

4. **Discard Changes:**
   - Admin clicks "Discard" button
   - `AdminUIEditorController.discardPendingChanges()` called
   - Panels revert to previous positions
   - Mode exits automatically

## Panel Registration

Panels must register themselves to be repositionable:

```typescript
// In panel constructor or create()
const controller = this.scene.registry.get('adminUIController') as AdminUIEditorController;
controller.registerPanel('resource-hud', this);

// In panel destroy()
controller.unregisterPanel('resource-hud');
```

## Registered Panels

| Panel Key | Component | Description |
|-----------|-----------|-------------|
| `resource-hud` | ResourceHUD | Top resource display |
| `turn-hud` | TurnHUD | Turn phase indicator |
| `planet-info` | PlanetInfoPanel | Selected planet details |
| `building-menu` | BuildingMenuPanel | Construction options |
| `objectives` | ObjectivesPanel | Victory conditions |
| `opponent-info` | OpponentInfoPanel | AI opponent status |

## Security Considerations

- Admin mode requires authenticated user with `is_admin: true`
- RLS ensures users can only modify their own panel positions
- Panel keys are validated against registered list
- No code execution possible through position data

## Testing

E2E tests in `tests/e2e/admin-ui-editor.spec.ts`:
- Toggle admin mode on/off
- Drag panel to new position
- Save and verify persistence
- Discard and verify revert
- Verify non-admin cannot access

## Future Enhancements

- Per-user panel positions (currently admin-only)
- Panel resize support
- Layout presets (save/load named configurations)
- Panel visibility toggles
