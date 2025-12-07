# Phase 1 Implementation Guide: Scene Foundation

**Estimated Time:** 30 minutes
**Goal:** Create MainMenu scene with GameManager singleton working

---

## Prerequisites

Before starting, ensure:
- [ ] Overlord.Core.dll is in `Assets/Plugins/Overlord.Core/` (118 KB, netstandard2.1)
- [ ] System.Text.Json.dll is in `Assets/Plugins/Overlord.Core/` (351 KB)
- [ ] Unity project opens without errors
- [ ] GameManager.cs exists at `Assets/Scripts/GameManager.cs`

---

## Step-by-Step Instructions

### Step 1: Create Scenes Folder (2 minutes)

1. Open Unity Editor (Overlord.Unity project)
2. In Project window, right-click `Assets` folder
3. Select `Create > Folder`
4. Name it: `Scenes`

**Result:** `Assets/Scenes/` folder created

---

### Step 2: Create MainMenu Scene (5 minutes)

1. In top menu: `File > New Scene`
2. Choose template: `Basic (Built-In)` or `Basic (URP)`
3. Save immediately:
   - `File > Save As...`
   - Navigate to `Assets/Scenes/`
   - Name: `MainMenu`
   - Click `Save`

**Result:** `Assets/Scenes/MainMenu.unity` created and open

---

### Step 3: Add GameManager GameObject (5 minutes)

1. In Hierarchy window, right-click empty space
2. Select `Create Empty`
3. Rename it to: `GameManager`
4. With `GameManager` selected, in Inspector:
   - Click `Add Component`
   - Search for: `GameManager`
   - Select `GameManager` script

**Result:** GameObject with GameManager component in scene

**Verification:**
- Hierarchy shows `GameManager` GameObject
- Inspector shows `GameManager (Script)` component attached

---

### Step 4: Configure Main Camera (Optional, 3 minutes)

If the scene has a Main Camera:

1. Select `Main Camera` in Hierarchy
2. In Inspector, Camera component:
   - Projection: `Orthographic` (for 2D)
   - Size: `10` (can adjust later)
   - Background Type: `Solid Color`
   - Background: Black `#000000`

**Note:** We'll add proper camera controller in Phase 3

---

### Step 5: Add Scene to Build Settings (5 minutes)

1. Top menu: `File > Build Settings...`
2. In Build Settings window:
   - Click `Add Open Scenes` button
3. Verify `MainMenu` appears in "Scenes In Build" list
4. Ensure Scene Index = 0 (it should be first/only scene)
5. Close Build Settings window

**Result:** MainMenu scene is now buildable

---

### Step 6: Test the Scene (10 minutes)

1. **Save scene:** `Ctrl+S` (Windows) or `Cmd+S` (Mac)
2. **Save project:** `File > Save Project`
3. **Press Play button** (top center of Unity Editor)

**Expected Console Output:**
```
GameManager initialized
```

**If you see errors:**
- Check Console window (bottom panel)
- Common issues:
  - `CS1705` error → Overlord.Core.dll built for wrong .NET version
  - `NullReferenceException` → Normal at this stage (no UI yet)
  - Missing DLL → Copy both Overlord.Core.dll and System.Text.Json.dll to Plugins folder

**To Fix CS1705 Error:**
```bash
cd C:\dev\GIT\Overlord\Overlord.Core
dotnet build Overlord.Core/Overlord.Core.csproj --configuration Release

# Copy DLL
cp Overlord.Core/bin/Release/netstandard2.1/Overlord.Core.dll ../Overlord.Unity/Assets/Plugins/Overlord.Core/

# Restart Unity
```

4. **Press Play again** to stop Play mode

---

## Validation Checklist

- [ ] MainMenu scene exists at `Assets/Scenes/MainMenu.unity`
- [ ] GameManager GameObject in Hierarchy
- [ ] GameManager script component attached
- [ ] Scene added to Build Settings (Index 0)
- [ ] Console shows "GameManager initialized" when Play pressed
- [ ] No errors in Console (0 errors, 0 warnings is ideal)
- [ ] Play mode can be entered and exited cleanly

---

## Troubleshooting

### Problem: GameManager script not found

**Solution:**
1. Check `Assets/Scripts/GameManager.cs` exists
2. In Unity, select GameManager.cs
3. Wait for Unity to compile (bottom-right corner shows progress)
4. Try adding component again

---

### Problem: "The type or namespace name 'Overlord' could not be found"

**Solution:**
1. Verify both DLLs in `Assets/Plugins/Overlord.Core/`:
   - Overlord.Core.dll (118 KB)
   - System.Text.Json.dll (351 KB)
2. In Unity Project window, select one of the DLLs
3. In Inspector, check "Any Platform" is selected
4. Click Apply
5. Restart Unity

---

### Problem: Console shows many errors on Play

**Solution:**
1. **DON'T PANIC** - this is expected at Phase 1
2. Most errors will be "NullReferenceException" because:
   - No UI exists yet
   - GameManager tries to access non-existent scenes
3. The ONLY thing that matters now:
   - Console shows "GameManager initialized"
   - Play mode doesn't crash Unity
4. We'll add UI in Phase 2 to fix these errors

---

## Success Criteria

✅ **Phase 1 Complete When:**
1. MainMenu scene opens without errors
2. GameManager GameObject exists in scene
3. "GameManager initialized" appears in Console on Play
4. You can enter/exit Play mode successfully

---

## Next Steps

Once Phase 1 is complete:
- **Phase 2:** Create Main Menu UI with buttons
- **Phase 3:** Create GalaxyMap scene with camera

**Estimated completion time for Phase 1:** 30 minutes

---

## Notes for Later Phases

- Keep MainMenu scene open in Unity
- We'll add Canvas and UI elements in Phase 2
- GameManager will persist across scenes (DontDestroyOnLoad)
- All future scenes will also need GameManager GameObject

---

## Git Commit (After Successful Test)

```bash
cd C:\dev\GIT\Overlord
git add Overlord.Unity/Assets/Scenes/MainMenu.unity
git add Overlord.Unity/Assets/Scenes/MainMenu.unity.meta
git commit -m "feat(unity): add MainMenu scene with GameManager (Phase 1)"
```

---

**END OF PHASE 1 GUIDE**

When ready, proceed to: `PHASE2-IMPLEMENTATION-GUIDE.md`
