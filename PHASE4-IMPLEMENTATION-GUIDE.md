# Phase 4 Implementation Guide: Galaxy Map Visualization

**Estimated Time:** 30 minutes (with scripts created)
**Goal:** Display planets from Core.GameState on the galaxy map

**Files Created:**
- ✅ `Assets/Scripts/Galaxy/PlanetVisual.cs` (134 lines)
- ✅ `Assets/Scripts/Galaxy/PlanetFactory.cs` (70 lines)
- ✅ `Assets/Scripts/Galaxy/GalaxyMapManager.cs` (156 lines)

---

## Prerequisites

1. ✅ Phase 2 completed (Main Menu UI working)
2. ✅ Phase 3 completed (GalaxyMap scene exists)
3. ✅ GameManager singleton functional
4. ✅ All 5 DLLs present in `Assets/Plugins/Overlord.Core/`

---

## Step-by-Step Instructions

### Step 1: Wait for Scripts to Compile (2 minutes)

1. Unity should auto-detect the new scripts in `Assets/Scripts/Galaxy/`
2. Watch the bottom-right corner - wait for "Compiling..." to finish
3. **Check Console for errors:**
   - ✅ **0 errors** = Success! Continue to Step 2
   - ❌ **Any errors** = STOP and report them

**Expected:** Console shows 0 errors after compilation

---

### Step 2: Create Planet Prefab (10 minutes)

**Create Prefab:**

1. In Hierarchy, right-click → `Create Empty`
2. Rename to: `Planet`
3. Select `Planet` GameObject

**Add SpriteRenderer:**

1. With `Planet` selected, click `Add Component`
2. Search for: `Sprite Renderer`
3. Click to add
4. In Inspector, Sprite Renderer:
   - **Sprite:** Click circle → Select `Knob` (Unity built-in circle sprite)
   - **Color:** White `#FFFFFF`
   - **Sorting Layer:** Default
   - **Order in Layer:** 0

**Add CircleCollider2D:**

1. Click `Add Component`
2. Search for: `Circle Collider 2D`
3. Click to add
4. In Inspector, Circle Collider 2D:
   - **Radius:** 0.5 (matches sprite)
   - **Is Trigger:** Unchecked

**Add PlanetVisual Script:**

1. Click `Add Component`
2. Search for: `PlanetVisual`
3. Click to add
4. In Inspector, PlanetVisual script:
   - **Planet Sprite:** Drag the `SpriteRenderer` component into this field
   - **Base Scale:** 1.0
   - **Player Color:** `#3080C0` (blue)
   - **AI Color:** `#C03030` (red)
   - **Neutral Color:** `#808080` (gray)
   - **Selection Ring:** Leave empty for now (we'll add this in Phase 5)

**Create Selection Ring (Optional for Phase 5):**

1. Right-click `Planet` in Hierarchy → `Create Empty`
2. Rename child to: `SelectionRing`
3. Select `SelectionRing`, click `Add Component` → `Sprite Renderer`
4. In Inspector:
   - **Sprite:** `Knob` (same as planet)
   - **Color:** Yellow `#FFFF00`
   - **Scale:** Set Transform scale to `(1.2, 1.2, 1.2)` (larger than planet)
5. In PlanetVisual script, drag `SelectionRing` GameObject into the **Selection Ring** field

**Save as Prefab:**

1. In Project window, navigate to `Assets/Prefabs/` (create folder if needed)
2. Drag `Planet` GameObject from Hierarchy into `Assets/Prefabs/` folder
3. You should see a blue cube icon = prefab created
4. Delete `Planet` from Hierarchy (prefab is saved)

**Result:** Planet prefab in `Assets/Prefabs/Planet.prefab`

---

### Step 3: Setup GalaxyMap Scene (10 minutes)

**Open GalaxyMap Scene:**

1. In Project window: `Assets/Scenes/GalaxyMap.unity`
2. Double-click to open

**Create Containers:**

1. In Hierarchy, right-click → `Create Empty`
2. Rename to: `PlanetsContainer`
3. Set Transform Position to `(0, 0, 0)`

**Add GalaxyMapManager:**

1. In Hierarchy, find existing `GameManager` GameObject
2. Right-click `GameManager` → `Create Empty`
3. Rename to: `GalaxyMapManager`
4. With `GalaxyMapManager` selected, click `Add Component`
5. Search for: `GalaxyMapManager`
6. Click to add

**Add PlanetFactory:**

1. With `GalaxyMapManager` still selected, click `Add Component`
2. Search for: `PlanetFactory`
3. Click to add

**Wire Up References:**

1. Select `GalaxyMapManager` in Hierarchy
2. In Inspector, find `GalaxyMapManager (Script)`:
   - **Planet Factory:** Drag `GalaxyMapManager` GameObject into this field (it has PlanetFactory component)
   - **Planets Container:** Drag `PlanetsContainer` GameObject into this field

3. In Inspector, find `Planet Factory (Script)`:
   - **Planet Prefab:** Drag `Assets/Prefabs/Planet.prefab` into this field
   - **Planets Container:** Drag `PlanetsContainer` GameObject into this field

**Result:** GalaxyMapManager configured with PlanetFactory and prefab

---

### Step 4: Save and Test (8 minutes)

**Save:**

1. Save scene: `Ctrl+S` or `File > Save`
2. Save project: `File > Save Project`

**Test in Play Mode:**

1. Make sure `GalaxyMap` scene is open
2. Press **Play** button
3. Check Console for initialization messages:

**Expected Console Output:**

```
GameManager initialized
GalaxyMapManager awakened
GalaxyMapManager initialized successfully
PlanetVisual initialized: <Planet Name> at (<X>, <Y>)
PlanetVisual initialized: <Planet Name> at (<X>, <Y>)
...
Spawned <N> planet visuals
```

4. **Visual Check in Game View:**
   - You should see 4-6 colored circles (planets)
   - Blue circles = Player-owned planets
   - Red circles = AI-owned planets
   - Gray circles = Neutral planets

5. **Click Test:**
   - Click on a planet
   - Console should show: `Planet clicked: <Planet Name>`
   - Selection ring should appear (if you created it)

6. Press **Play** again to exit

---

## Validation Checklist

After completing all steps:

- [ ] All 3 Galaxy scripts compiled without errors
- [ ] Planet prefab exists with SpriteRenderer, Collider, and PlanetVisual
- [ ] GalaxyMapManager GameObject exists in GalaxyMap scene
- [ ] PlanetFactory component has prefab reference assigned
- [ ] Play mode: 4-6 planets appear in Game view
- [ ] Play mode: Planets are colored correctly (blue/red/gray)
- [ ] Play mode: Clicking planet logs message to Console
- [ ] Console shows 0 errors

---

## Expected Results

### Console Output

**On Scene Load:**
```
GameManager initialized
GalaxyMapManager awakened
GalaxyMapManager initialized successfully
PlanetVisual initialized: Alpha Centauri at (5, 3)
PlanetVisual initialized: Rigel at (-4, -2)
PlanetVisual initialized: Betelgeuse at (0, 5)
PlanetVisual initialized: Sirius at (-3, -5)
Spawned 4 planet visuals
```

**On Planet Click:**
```
Planet clicked: Alpha Centauri
```

### Visual Appearance

- **Game View:** Black background with 4-6 colored circles
- **Colors:**
  - Blue `#3080C0` = Player planets
  - Red `#C03030` = AI planets
  - Gray `#808080` = Neutral planets
- **Positions:** Varied (procedurally generated by Core)

---

## Troubleshooting

### Problem: "PlanetVisual script not found"

**Solution:**
1. Check `Assets/Scripts/Galaxy/` folder exists
2. Verify all 3 .cs files are in that folder
3. Wait for Unity to finish compiling
4. Check Console for compilation errors

---

### Problem: "Planet prefab not assigned"

**Solution:**
1. Select `GalaxyMapManager` in Hierarchy
2. Find `Planet Factory (Script)` component
3. Drag `Assets/Prefabs/Planet.prefab` into **Planet Prefab** field

---

### Problem: No planets appear

**Causes & Solutions:**

1. **GameState is null:**
   - Check Console for "GameState is null" error
   - GameManager should auto-create game, but verify GameManager exists in scene

2. **Prefab missing components:**
   - Open `Assets/Prefabs/Planet.prefab`
   - Verify it has: SpriteRenderer, CircleCollider2D, PlanetVisual script
   - Verify PlanetVisual has Planet Sprite field assigned

3. **Camera not positioned:**
   - Select Main Camera
   - Set Position to `(0, 0, -10)`
   - Verify Orthographic = true
   - Verify Size = 10

---

### Problem: Planets wrong color

**Solution:**
1. Select planet prefab: `Assets/Prefabs/Planet.prefab`
2. Find `Planet Visual (Script)` component
3. Verify colors:
   - Player Color: `#3080C0` (blue)
   - AI Color: `#C03030` (red)
   - Neutral Color: `#808080` (gray)

---

### Problem: Can't click planets

**Causes & Solutions:**

1. **Missing Collider:**
   - Planet prefab needs CircleCollider2D
   - Radius should be 0.5

2. **EventSystem conflict:**
   - Only one EventSystem should exist
   - If both MainMenu and GalaxyMap have EventSystems, disable one

3. **Camera misconfigured:**
   - Main Camera must have tag "MainCamera"

---

## Success Criteria

✅ **Phase 4 Complete When:**
1. 4-6 planets visible on galaxy map
2. Planets colored correctly by owner (blue/red/gray)
3. Clicking planet logs message to Console
4. Console shows 0 errors
5. All planets positioned at different coordinates
6. Selection ring appears on click (if implemented)

---

## What's Next?

**Phase 5:** Planet Selection System
- Formal selection manager
- Only one planet selected at a time
- Selection ring toggle
- OnSelectionChanged event for UI panels

**Phase 6:** Planet Panel UI
- Display planet details when selected
- Show resources, buildings, fleets
- Hook up to Core.GameState data

---

## Git Commit (After Successful Test)

```bash
cd C:\dev\GIT\Overlord
git add Overlord.Unity/Assets/Scripts/Galaxy/
git add Overlord.Unity/Assets/Prefabs/Planet.prefab
git add Overlord.Unity/Assets/Scenes/GalaxyMap.unity
git commit -m "feat(unity): add galaxy map visualization with planets (Phase 4)"
```

---

## Time Breakdown

- Step 1: Compilation (2 min)
- Step 2: Create Planet prefab (10 min)
- Step 3: Setup GalaxyMap scene (10 min)
- Step 4: Testing (8 min)

**Total:** ~30 minutes

---

**END OF PHASE 4 GUIDE**

When ready, proceed to: Phase 5 (Planet Selection System)
