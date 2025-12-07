# Automated Unity Setup Guide

**Last Updated:** 2025-12-07
**Purpose:** Rapid Unity setup using Editor automation scripts

---

## Overview

Instead of manual UI setup, we use **Unity Editor scripts** that automate everything:
- ✅ Create GameObjects
- ✅ Configure components
- ✅ Assign references
- ✅ Save scenes
- ✅ Validate setup (UAT)

**Time Savings:**
- Manual: ~90 minutes for Phase 2
- Automated: **~5 minutes** for Phase 2

---

## Prerequisites

### 1. Scripts Must Compile First

The automation scripts are in `Assets/Editor/` folder. Unity must compile them before they appear in the menu.

**Check Compilation:**
1. Open Unity Editor
2. Look at bottom-right corner
3. Wait for "Compiling..." to finish
4. **If you see errors**, copy them and report

**Expected Files:**
```
Assets/Editor/
├── Phase2AutoSetup.cs
├── Phase3AutoSetup.cs
└── SetupValidator.cs
```

### 2. Verify DLLs Are Present

Before any automation, ensure all 5 DLLs are in `Assets/Plugins/Overlord.Core/`:
1. Overlord.Core.dll
2. System.Text.Json.dll
3. System.Text.Encodings.Web.dll
4. Microsoft.Bcl.AsyncInterfaces.dll
5. System.Runtime.CompilerServices.Unsafe.dll

**Run quick check:**
```bash
ls -lh Overlord.Unity/Assets/Plugins/Overlord.Core/
```

Should show all 5 DLLs.

---

## Automated Workflow

### Phase 2: Main Menu UI (5 minutes)

#### Step 1: Open MainMenu Scene
1. In Project window: `Assets/Scenes/MainMenu.unity`
2. Double-click to open
3. Verify scene name in Hierarchy shows "MainMenu"

#### Step 2: Run Auto Setup
1. Top Unity menu: **Tools > Overlord > Setup Phase 2 - Main Menu**
2. Click **"Yes, Setup Main Menu"** in dialog
3. Wait ~5 seconds
4. Success dialog appears

**What It Does:**
- ✅ Creates Canvas with proper scaling
- ✅ Creates EventSystem
- ✅ Creates TitleText ("OVERLORD")
- ✅ Creates 3 buttons (New Game, Load Game, Quit)
- ✅ Configures all colors, positions, sizes
- ✅ Adds MainMenuUI script to Canvas
- ✅ Assigns all button references
- ✅ Disables Load Game button
- ✅ Saves scene

#### Step 3: Validate Setup (UAT)
1. Top Unity menu: **Tools > Overlord > Validate Setup (UAT)**
2. Check validation report in Console
3. Look for: **"✓ PASS: X"** (all green)

**Expected Results:**
```
✓ PASS: 15-20 tests
⚠ WARN: 0-2 warnings (optional items)
✗ FAIL: 0
```

#### Step 4: Test in Play Mode
1. Press **Play** button
2. Verify:
   - Title shows "OVERLORD"
   - 3 buttons visible and centered
   - Hovering changes button color
   - Clicking "NEW GAME" logs message
   - Clicking "QUIT" exits Play mode
3. Press Play again to stop

**Time:** 5 minutes vs. 90 minutes manual

---

### Phase 3: Galaxy Map Scene (3 minutes)

#### Step 1: Run Auto Setup
1. Top Unity menu: **Tools > Overlord > Setup Phase 3 - Galaxy Scene**
2. **Save current scene** if prompted
3. Click **"Yes, Create Scene"**
4. Wait ~3 seconds

**What It Does:**
- ✅ Creates new scene
- ✅ Configures Main Camera (orthographic, black background)
- ✅ Adds GameManager GameObject
- ✅ Saves scene as `Assets/Scenes/GalaxyMap.unity`
- ✅ Adds scene to Build Settings

#### Step 2: Validate
1. **Tools > Overlord > Validate Setup (UAT)**
2. Check for passes

#### Step 3: Test Scene Transition
1. Open `MainMenu` scene
2. Press Play
3. Click "NEW GAME"
4. **Should load GalaxyMap scene** (no error now!)
5. Verify black screen with GameManager initialized in Console

**Time:** 3 minutes vs. 90 minutes manual

---

## Validation (UAT)

### Running UAT

**From Unity Menu:**
```
Tools > Overlord > Validate Setup (UAT)
```

**What It Checks:**

**DLL Dependencies:**
- ✓ All 5 DLLs present
- ✓ Correct file sizes

**Scripts:**
- ✓ GameManager.cs exists
- ✓ MainMenuUI.cs exists
- ✓ UIManager.cs exists

**Phase 1 (MainMenu Scene):**
- ✓ MainMenu scene open
- ✓ GameManager GameObject exists
- ✓ GameManager script attached
- ✓ Scene in Build Settings

**Phase 2 (Main Menu UI):**
- ✓ Canvas exists
- ✓ MainMenuUI script attached
- ✓ All buttons assigned
- ✓ Load Game button disabled
- ✓ EventSystem exists
- ✓ All UI elements present (TitleText, buttons)

**Phase 3 (GalaxyMap Scene):**
- ✓ GalaxyMap scene open
- ✓ Camera orthographic
- ✓ Camera background black
- ✓ GameManager exists
- ✓ Scene in Build Settings

### Reading UAT Results

**Console Output Example:**
```
=== OVERLORD UNITY SETUP VALIDATION REPORT ===

Current Scene: MainMenu

--- DLL Dependencies ---
✓ PASS: DLL present: Overlord.Core.dll
✓ PASS: DLL present: System.Text.Json.dll
✓ PASS: DLL present: System.Text.Encodings.Web.dll
✓ PASS: DLL present: Microsoft.Bcl.AsyncInterfaces.dll
✓ PASS: DLL present: System.Runtime.CompilerServices.Unsafe.dll

--- Core Scripts ---
✓ PASS: Script present: GameManager.cs
✓ PASS: Script present: MainMenuUI.cs
✓ PASS: Script present: UIManager.cs

--- Phase 1: MainMenu Scene ---
✓ PASS: MainMenu scene is open
✓ PASS: GameManager GameObject exists
✓ PASS: GameManager script attached
✓ PASS: MainMenu scene in Build Settings (enabled)

--- Phase 2: Main Menu UI ---
✓ PASS: Canvas exists
✓ PASS: MainMenuUI script attached to Canvas
✓ PASS: New Game button assigned
✓ PASS: Load Game button assigned
✓ PASS: Load Game button is disabled (correct)
✓ PASS: Quit button assigned
⚠ WARN: Title text not assigned (optional)
✓ PASS: EventSystem exists
✓ PASS: GameObject 'TitleText' exists
✓ PASS: GameObject 'NewGameButton' exists
✓ PASS: GameObject 'LoadGameButton' exists
✓ PASS: GameObject 'QuitButton' exists

============================================================
VALIDATION SUMMARY
============================================================
✓ PASS: 22
⚠ WARN: 1
✗ FAIL: 0

Status: ALL TESTS PASSED
```

**Interpreting Results:**

- **✓ PASS:** Everything correct, proceed
- **⚠ WARN:** Non-critical, usually optional features
- **✗ FAIL:** Critical error, must fix before proceeding

---

## Troubleshooting

### Problem: Menu items don't appear (Tools > Overlord)

**Cause:** Editor scripts didn't compile

**Solution:**
1. Check Console for compilation errors
2. Verify `Assets/Editor/` folder exists
3. Verify all 3 .cs files are in Editor folder
4. Wait for Unity to finish compiling
5. Restart Unity if needed

---

### Problem: "Canvas already exists" dialog

**Cause:** Canvas from previous setup attempt

**Options:**
1. Click **"Use Existing"** to reuse canvas
2. Click **"Create New"** to make fresh canvas
3. Or manually delete old Canvas in Hierarchy first

**Recommendation:** Use existing if unsure

---

### Problem: Auto setup completes but UAT fails

**Cause:** Partial setup or naming mismatch

**Solution:**
1. Read UAT report carefully
2. Note which specific tests failed
3. Check GameObject names in Hierarchy
4. Verify Inspector field assignments
5. Re-run auto setup if needed

---

### Problem: "GameManager script not found"

**Cause:** GameManager.cs hasn't compiled

**Solution:**
1. Verify `Assets/Scripts/GameManager.cs` exists
2. Check Console for script errors
3. Wait for compilation to finish
4. Restart Unity

---

### Problem: Buttons don't respond to clicks

**Cause:** EventSystem missing or broken

**Solution:**
1. Run UAT validator
2. Check for "EventSystem exists" PASS
3. If fails, manually create: `GameObject > UI > Event System`
4. Or re-run Phase 2 auto setup

---

### Problem: Scene load fails ("GalaxyMap couldn't be loaded")

**Cause:** GalaxyMap scene not in Build Settings

**Solution:**
1. Run Phase 3 auto setup (adds to build settings)
2. Or manually: `File > Build Profiles > Add Open Scenes`
3. Verify both MainMenu and GalaxyMap are listed

---

## Manual Override

If automation fails, you can fall back to manual setup:

**Phase 2 Manual:** See `PHASE2-IMPLEMENTATION-GUIDE.md`
**Phase 3 Manual:** See `PHASE3-IMPLEMENTATION-GUIDE.md`

**But report automation failures so we can fix the scripts!**

---

## Git Workflow with Automation

**After successful auto setup:**

```bash
cd C:\dev\GIT\Overlord

# Phase 2
git add Overlord.Unity/Assets/Scenes/MainMenu.unity
git add Overlord.Unity/Assets/Editor/
git commit -m "feat(unity): automated Phase 2 Main Menu setup"

# Phase 3
git add Overlord.Unity/Assets/Scenes/GalaxyMap.unity
git commit -m "feat(unity): automated Phase 3 Galaxy scene setup"
```

---

## Summary: Automation vs Manual

| Task | Manual Time | Automated Time | Savings |
|------|-------------|----------------|---------|
| Phase 2 Setup | 90 min | 5 min | 85 min |
| Phase 3 Setup | 90 min | 3 min | 87 min |
| UAT Validation | 15 min | 30 sec | 14.5 min |
| **Total** | **195 min** | **8.5 min** | **186.5 min** |

**With automation: ~3 hours saved per setup cycle!**

---

## Next Steps

1. ✅ Run Phase 2 auto setup
2. ✅ Run UAT validation
3. ✅ Test in Play mode
4. ✅ Run Phase 3 auto setup
5. ✅ Run UAT validation
6. ✅ Test scene transition
7. Proceed to Phase 4 (coming next)

---

**END OF AUTOMATED SETUP GUIDE**
