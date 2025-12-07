# Phase 2 Implementation Guide: Main Menu UI

**Estimated Time:** 90 minutes
**Goal:** Create functional main menu with buttons that start a new game

**Files Created:**
- ✅ `Assets/Scripts/UI/MainMenuUI.cs` (109 lines)
- ✅ `Assets/Scripts/UI/UIManager.cs` (76 lines)

---

## Step-by-Step Instructions

### Step 1: Wait for Unity to Compile Scripts (2 minutes)

1. Unity should auto-detect the new scripts in `Assets/Scripts/UI/`
2. Watch the bottom-right corner of Unity - it will show "Compiling..."
3. **Wait until compilation finishes** (no spinning icon)
4. Check Console for errors:
   - ✅ **0 errors** = Success! Continue to Step 2
   - ❌ **Any errors** = STOP and report them

**Expected:** Console shows 0 errors after compilation

---

### Step 2: Create Canvas in MainMenu Scene (5 minutes)

1. Make sure `MainMenu` scene is open (double-click it in Project window if not)
2. In Hierarchy window, right-click empty space
3. Select: `UI > Canvas`
4. A Canvas GameObject should appear with:
   - Canvas
   - EventSystem (created automatically)

**Configure Canvas:**
1. Select `Canvas` in Hierarchy
2. In Inspector, Canvas component:
   - Render Mode: `Screen Space - Overlay` (should be default)
   - UI Scale Mode: `Scale With Screen Size`
   - Reference Resolution: `1920 x 1080`

**Result:** Canvas and EventSystem in Hierarchy

---

### Step 3: Add MainMenuUI Script to Canvas (3 minutes)

1. Select `Canvas` in Hierarchy
2. In Inspector, click `Add Component`
3. Search for: `MainMenuUI`
4. Click to add the script

**Result:** Canvas now has MainMenuUI (Script) component in Inspector

---

### Step 4: Create Title Text (10 minutes)

1. Right-click `Canvas` in Hierarchy
2. Select: `UI > Text - TextMeshPro`
3. **If prompted to "Import TMP Essentials":**
   - Click "Import TMP Essentials" button
   - Wait for import to finish
4. Rename the text object to: `TitleText`

**Configure TitleText:**
1. Select `TitleText` in Hierarchy
2. In Inspector, Rect Transform:
   - **Anchor Preset:** Top-Center (click the square grid icon, hold Alt+Shift, click top-center)
   - **Pos Y:** `-150` (moves down from top)
   - **Width:** `600`
   - **Height:** `100`

3. TextMeshPro component:
   - **Text:** `OVERLORD`
   - **Font Style:** Bold
   - **Font Size:** `72`
   - **Alignment:** Center (horizontal and vertical)
   - **Color:** White `#FFFFFF`

**Result:** "OVERLORD" title centered near top of screen

---

### Step 5: Create New Game Button (15 minutes)

1. Right-click `Canvas` in Hierarchy
2. Select: `UI > Button - TextMeshPro`
3. Rename button to: `NewGameButton`

**Configure NewGameButton:**
1. Select `NewGameButton` in Hierarchy
2. In Inspector, Rect Transform:
   - **Anchor Preset:** Middle-Center
   - **Pos X:** `0`
   - **Pos Y:** `50`
   - **Width:** `300`
   - **Height:** `60`

3. Button component:
   - **Interactable:** Checked ✓
   - **Transition:** Color Tint
   - **Normal Color:** `#3080C0` (blue)
   - **Highlighted Color:** `#60A0E0` (light blue)
   - **Pressed Color:** `#2060A0` (dark blue)

4. Expand `NewGameButton` in Hierarchy to see `Text (TMP)` child
5. Select the `Text (TMP)` child
6. In Inspector, TextMeshPro component:
   - **Text:** `NEW GAME`
   - **Font Size:** `28`
   - **Alignment:** Center
   - **Color:** White

**Result:** Blue "NEW GAME" button in center of screen

---

### Step 6: Create Load Game Button (10 minutes)

1. Right-click `Canvas` in Hierarchy
2. Select: `UI > Button - TextMeshPro`
3. Rename to: `LoadGameButton`

**Configure LoadGameButton:**
1. Rect Transform:
   - Anchor: Middle-Center
   - Pos X: `0`
   - Pos Y: `-30` (below New Game)
   - Width: `300`
   - Height: `60`

2. Button component:
   - Normal Color: `#404040` (gray - will be disabled)

3. Text child:
   - Text: `LOAD GAME`
   - Font Size: `28`
   - Alignment: Center

**Result:** Gray "LOAD GAME" button below "NEW GAME"

---

### Step 7: Create Quit Button (10 minutes)

1. Right-click `Canvas` in Hierarchy
2. Select: `UI > Button - TextMeshPro`
3. Rename to: `QuitButton`

**Configure QuitButton:**
1. Rect Transform:
   - Anchor: Middle-Center
   - Pos X: `0`
   - Pos Y: `-110` (below Load Game)
   - Width: `300`
   - Height: `60`

2. Button component:
   - Normal Color: `#404040` (gray)
   - Highlighted Color: `#606060`
   - Pressed Color: `#303030`

3. Text child:
   - Text: `QUIT`
   - Font Size: `28`
   - Alignment: Center

**Result:** Three buttons stacked vertically

---

### Step 8: Wire Up MainMenuUI Script (10 minutes)

1. Select `Canvas` in Hierarchy
2. In Inspector, find `MainMenuUI (Script)` component
3. You'll see fields under "UI References":

**Assign Button References (drag and drop):**
1. **New Game Button:** Drag `NewGameButton` from Hierarchy into this field
2. **Load Game Button:** Drag `LoadGameButton` into this field
3. **Quit Button:** Drag `QuitButton` into this field
4. **Title Text:** Drag `TitleText` into this field

**Verify Settings Section:**
- **Galaxy Map Scene Name:** Should show `GalaxyMap` (default)

**Result:** All fields in MainMenuUI component are filled (no "None" values)

---

### Step 9: Save Everything (2 minutes)

1. Save scene: `Ctrl+S` or `File > Save`
2. Save project: `File > Save Project`

---

### Step 10: Test Main Menu (15 minutes)

**Test 1: Visual Check**
1. Make sure MainMenu scene is open
2. Look at Game view (tab next to Scene view)
3. You should see:
   - "OVERLORD" title at top
   - Three buttons stacked vertically
   - Blue "NEW GAME" button
   - Gray "LOAD GAME" button (disabled looking)
   - Gray "QUIT" button

**Test 2: Play Mode - Button Hover**
1. Press **Play** button
2. Move mouse over "NEW GAME" button
   - Should change to lighter blue
3. Move mouse over "QUIT" button
   - Should change to lighter gray
4. "LOAD GAME" should NOT respond to hover (disabled)

**Test 3: Console Messages**
1. While in Play mode, click "NEW GAME"
2. Check Console - should show:
   ```
   New Game clicked
   ```
3. **Expected:** Unity tries to load "GalaxyMap" scene but fails (scene doesn't exist yet - this is NORMAL)
4. Error will be something like: `Scene 'GalaxyMap' couldn't be loaded`

**Test 4: Quit Button**
1. Exit Play mode (press Play button again)
2. Re-enter Play mode
3. Click "QUIT" button
4. **In Editor:** Play mode should exit automatically
5. Console shows: `Quit clicked`

**Test 5: Load Game Button**
1. Enter Play mode
2. Click "LOAD GAME"
3. Console shows: `Load Game clicked (not implemented)`
4. Nothing else happens (correct - not implemented yet)

---

## Validation Checklist

After completing all steps:

- [ ] MainMenu scene has Canvas with MainMenuUI.cs script
- [ ] Three buttons visible in Game view
- [ ] All MainMenuUI script fields assigned (no "None" values)
- [ ] Play mode: Hovering buttons changes their color
- [ ] Play mode: Clicking "NEW GAME" logs message and tries to load GalaxyMap
- [ ] Play mode: Clicking "QUIT" exits Play mode (in Editor)
- [ ] Console shows 0 errors (scene load error is expected and OK)

---

## Expected Console Output

**When clicking NEW GAME:**
```
New Game clicked
Scene 'GalaxyMap' couldn't be loaded because it has not been added to the build settings or the AssetBundle has not been loaded.
```

**This error is EXPECTED and CORRECT!** We haven't created the GalaxyMap scene yet (that's Phase 3).

---

## Troubleshooting

### Problem: "MainMenuUI script not found"

**Solution:**
1. Check `Assets/Scripts/UI/` folder exists
2. Verify `MainMenuUI.cs` is in that folder
3. Wait for Unity to finish compiling
4. Check Console for compilation errors

---

### Problem: "TMP_Text does not exist"

**Solution:**
1. Select any TextMeshPro object
2. You'll see a prompt to "Import TMP Essentials"
3. Click the button
4. Wait for import to finish
5. Restart Unity if needed

---

### Problem: Buttons don't respond to clicks

**Solution:**
1. Check `EventSystem` exists in Hierarchy (created with Canvas)
2. Select buttons and verify `Interactable` is checked
3. Make sure MainMenuUI script fields are assigned
4. Check Console for errors

---

### Problem: "NEW GAME" doesn't call GameManager.NewGame()

**Solution:**
1. Check GameManager GameObject exists in scene
2. Press Play and check Console for "GameManager initialized"
3. The NewGame() call still happens even if GalaxyMap scene fails to load

---

### Problem: Scene won't save

**Solution:**
1. Check scene file isn't read-only
2. Make sure Unity has write permissions
3. Try: `File > Save As...` and save with new name

---

## Success Criteria

✅ **Phase 2 Complete When:**
1. Main menu displays with 3 buttons
2. Buttons respond to mouse hover (color changes)
3. "NEW GAME" button logs message and tries to load scene
4. "QUIT" button exits Play mode in Editor
5. "LOAD GAME" button is disabled/non-functional (correct)
6. Console shows expected messages (no red errors except scene load)

---

## What's Next?

**Phase 3:** Create GalaxyMap scene with camera controller
- This will fix the "GalaxyMap couldn't be loaded" error
- We'll add camera controls (WASD, zoom)
- Scene will be empty except for camera (planets come in Phase 4)

---

## Git Commit (After Successful Test)

```bash
cd C:\dev\GIT\Overlord
git add Overlord.Unity/Assets/Scripts/UI/
git add Overlord.Unity/Assets/Scenes/MainMenu.unity
git commit -m "feat(unity): add Main Menu UI with 3 buttons (Phase 2)"
```

---

## Time Breakdown

- Step 1: Compilation (2 min)
- Step 2: Create Canvas (5 min)
- Step 3: Add MainMenuUI script (3 min)
- Step 4: Title text (10 min)
- Steps 5-7: Create 3 buttons (35 min)
- Step 8: Wire up script (10 min)
- Step 9: Save (2 min)
- Step 10: Testing (15 min)

**Total:** ~82 minutes (within 90-minute estimate)

---

**END OF PHASE 2 GUIDE**

When ready, proceed to: `PHASE3-IMPLEMENTATION-GUIDE.md`
