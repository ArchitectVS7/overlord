# 🏗️ GALAXY MAP SCENE - COMPLETE REBUILD GUIDE

**When to use this:** If you deleted GameObjects and need to recreate the scene structure.

**Time required:** 5 minutes

---

## 📋 SCENE STRUCTURE CHECKLIST

Your GalaxyMap scene should have this exact structure:

```
GalaxyMap (Scene)
├── Main Camera          [Camera, Audio Listener]
├── Directional Light    [Light]
├── GameManager          [Game Manager (Script)]
├── GalaxyMapManager     [Galaxy Map Manager (Script)]
├── PlanetFactory        [Planet Factory (Script)]
└── Planets              [NO COMPONENTS - Just empty GameObject!]
```

---

## 🔨 STEP-BY-STEP REBUILD

### Step 1: Clean Up (if needed)

If your scene is messy, start fresh:

1. **Select ALL GameObjects** in Hierarchy (Ctrl+A)
2. **Delete** (Delete key)
3. You should now have an empty scene

---

### Step 2: Create Core GameObjects

#### A. Main Camera

**If you DON'T have a Main Camera:**

1. **Hierarchy** → Right-click → **Camera**
2. Rename to: **Main Camera**
3. In Inspector, set:
   - **Tag:** MainCamera
   - **Transform Position:** (0, 0, -10)
   - **Projection:** Orthographic
   - **Size:** 10
   - ✓ Ensure **Audio Listener** component is present

**If you already have Main Camera:** Skip this step

---

#### B. Directional Light (Optional)

**For better visibility:**

1. **Hierarchy** → Right-click → **Light** → **Directional Light**
2. Default settings are fine

**If you already have lighting:** Skip this step

---

### Step 3: Create Game System GameObjects

#### C. GameManager

1. **Hierarchy** → Right-click → **Create Empty**
2. Rename to: **GameManager**
3. In Inspector, click **Add Component**
4. Search: **Game Manager**
5. Select: **Game Manager (Script)**

**Inspector should show:**
```
📄 Game Manager (Script)
Script: GameManager
(No configurable fields - all managed via code)
```

---

#### D. GalaxyMapManager

1. **Hierarchy** → Right-click → **Create Empty**
2. Rename to: **GalaxyMapManager**
3. In Inspector, click **Add Component**
4. Search: **Galaxy Map Manager**
5. Select: **Galaxy Map Manager (Script)**

**Inspector should show:**
```
📄 Galaxy Map Manager (Script)
Script: GalaxyMapManager

Components:
  ⚠️ Planet Factory: None (Requires Assignment)

Containers:
  ⚠️ Planets Container: None (Requires Assignment)
```

**DON'T assign these yet** - we'll wire them up in Step 4!

---

#### E. PlanetFactory

1. **Hierarchy** → Right-click → **Create Empty**
2. Rename to: **PlanetFactory**
3. In Inspector, click **Add Component**
4. Search: **Planet Factory**
5. Select: **Planet Factory (Script)**

**Inspector should show:**
```
📄 Planet Factory (Script)
Script: PlanetFactory

Prefabs:
  ⚠️ Planet Prefab: None (Requires Assignment)

Settings:
  ⚠️ Planets Container: None (Requires Assignment)
```

**DON'T assign these yet** - we'll wire them up in Step 4!

---

#### F. Planets (Container)

1. **Hierarchy** → Right-click → **Create Empty**
2. Rename to: **Planets**
3. **DO NOT add any components!**

**Inspector should show:**
```
📄 Planets
Tag: Untagged
Layer: Default

Transform
  Position: (0, 0, 0)
  Rotation: (0, 0, 0)
  Scale: (1, 1, 1)

[NO OTHER COMPONENTS]
```

✅ **This is just an empty container - NO scripts needed!**

---

### Step 4: Wire Up References

Now we connect everything together!

#### A. Wire GalaxyMapManager

1. **Select** GalaxyMapManager in Hierarchy
2. In **Inspector**, find **Galaxy Map Manager (Script)** component
3. **Drag & Drop:**
   - **Planet Factory field** ← Drag **PlanetFactory** GameObject from Hierarchy
   - **Planets Container field** ← Drag **Planets** GameObject from Hierarchy

**After wiring, Inspector should show:**
```
📄 Galaxy Map Manager (Script)

Components:
  ✓ Planet Factory: PlanetFactory

Containers:
  ✓ Planets Container: Planets (Transform)
```

---

#### B. Wire PlanetFactory

1. **Select** PlanetFactory in Hierarchy
2. In **Inspector**, find **Planet Factory (Script)** component
3. **Drag & Drop:**
   - **Planet Prefab field** ← Drag **Planet.prefab** from **Assets/Prefabs** folder
   - **Planets Container field** ← Drag **Planets** GameObject from Hierarchy

**After wiring, Inspector should show:**
```
📄 Planet Factory (Script)

Prefabs:
  ✓ Planet Prefab: Planet (UnityEngine.GameObject)

Settings:
  ✓ Planets Container: Planets (Transform)
```

---

### Step 5: Verify Setup

**Check your Hierarchy looks like this:**

```
✓ Main Camera
✓ Directional Light
✓ GameManager              [Game Manager (Script)]
✓ GalaxyMapManager         [Galaxy Map Manager (Script)]
  ✓ Planet Factory: PlanetFactory
  ✓ Planets Container: Planets
✓ PlanetFactory            [Planet Factory (Script)]
  ✓ Planet Prefab: Planet
  ✓ Planets Container: Planets
✓ Planets                  [Empty - NO components]
```

**Total GameObjects: 6**

---

### Step 6: CRITICAL - Remove SceneBootstrapper!

⚠️ **IMPORTANT:** Make sure there's NO "SceneBootstrapper" GameObject!

**Check Hierarchy:**
- Search for "Bootstrap" or "Scene"
- If found → Delete it!
- If NOT found → Perfect! ✓

---

### Step 7: Save Scene

1. **File** → **Save** (or Ctrl+S / Cmd+S)
2. Confirm save location: **Assets/Scenes/GalaxyMap.unity**

---

## 🧪 TEST THE SETUP

### Test 1: Basic Compilation

1. **Check Console** (Window → General → Console)
2. Should show **0 errors, 0 warnings**
3. If you see errors about missing references, double-check Step 4 wiring

### Test 2: Manual Initialization (RECOMMENDED)

**If you have SimpleInitializer:**

1. **Press Play** ▶️
2. **Click the "Initialize Galaxy" button** in Game view
3. **Check Console** - should see:
   ```
   GameManager initialized
   === Manual Initialization Started ===
   Creating new game...
   Galaxy generated: 5 planets
   New game initialized - Turn 1
   Initializing galaxy map...
   Spawned 5 planet visuals
   PlanetVisual initialized: Starbase at (X, Y)
   PlanetVisual initialized: Hitotsu at (X, Y)
   ...
   === Initialization Complete ===
   ```
4. **Check Hierarchy** - under "Planets" you should see:
   ```
   Planets
   ├── Planet_Starbase
   ├── Planet_Hitotsu
   ├── Planet_Planet A
   ├── Planet_Planet B
   └── Planet_Planet C
   ```
   (4-6 planets total, depending on difficulty)

5. **Check Game View** - should see 4-6 colored circles (planets)!

### Test 3: Verify No Infinite Loop

1. While in Play mode, **watch the Console**
2. Messages should appear **ONCE**, not repeating!
3. **Watch the Hierarchy** - Planets folder should NOT be expanding infinitely
4. After initialization completes, **no new planets** should spawn

✅ **Success criteria:**
- Exactly 4-6 planets spawn
- No repeating console messages
- No infinite hierarchy expansion
- Game View shows colored planet circles

---

## ❌ COMMON MISTAKES

### Mistake 1: Planets has components

**Problem:** You added scripts to the "Planets" GameObject
**Fix:** Select Planets → Remove all components except Transform

### Mistake 2: References not wired

**Problem:** Planet Factory or Planets Container shows "None"
**Fix:** Re-do Step 4 carefully, drag & drop from Hierarchy

### Mistake 3: Planet.prefab missing

**Problem:** Planet Prefab field shows "Missing (GameObject)"
**Fix:**
1. Check if `Assets/Prefabs/Planet.prefab` exists
2. If missing, you need to recreate it (separate guide needed)
3. If exists, drag it into the Planet Prefab field

### Mistake 4: SceneBootstrapper still exists

**Problem:** Scene still has SceneBootstrapper GameObject
**Fix:** Delete it! (See Step 6)

### Mistake 5: Multiple GameManagers

**Problem:** Multiple GameManager GameObjects in scene
**Fix:** Delete all but one (keep the one with Game Manager script)

---

## 🎯 QUICK CHECKLIST

Before pressing Play, verify:

- [ ] Main Camera exists with Orthographic projection
- [ ] GameManager exists with Game Manager (Script) component
- [ ] GalaxyMapManager exists with Galaxy Map Manager (Script)
  - [ ] Planet Factory field = PlanetFactory
  - [ ] Planets Container field = Planets
- [ ] PlanetFactory exists with Planet Factory (Script)
  - [ ] Planet Prefab field = Planet (prefab)
  - [ ] Planets Container field = Planets
- [ ] Planets exists (empty GameObject, NO components except Transform)
- [ ] NO SceneBootstrapper GameObject in scene
- [ ] Scene saved (Ctrl+S)

---

## 🚨 IF IT STILL DOESN'T WORK

If you followed all steps and planets still spawn infinitely:

1. **Take a screenshot** of:
   - Full Hierarchy
   - GalaxyMapManager Inspector
   - PlanetFactory Inspector
   - Console messages

2. **Check for missing Planet.prefab:**
   - Navigate to Assets/Prefabs in Project window
   - Verify Planet.prefab exists
   - If missing, ask for help creating it

3. **Run the cleanup script:**
   - Menu: **Overlord** → **Fix** → **Remove Missing Scripts from GalaxyMap Scene**
   - Check Console for results

4. **Contact support** with screenshots and describe what happened

---

## 📚 RELATED GUIDES

- **INFINITE-PLANETS-FIX.md** - How to fix infinite spawning bug
- **SIMPLE-MANUAL-SETUP.md** - Original manual setup guide
- **UNITY-DLL-DEPENDENCIES.md** - If you get DLL errors

---

**Generated by:** Dr. Quinn, Master Problem Solver 🔬
**Date:** 2025-12-08
**Status:** Tested and verified working
