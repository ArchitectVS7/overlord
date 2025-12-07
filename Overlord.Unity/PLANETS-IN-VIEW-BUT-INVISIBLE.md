# 🔧 PLANETS IN CAMERA VIEW BUT INVISIBLE

**Problem:** Diagnostic says "5/5 planets are within camera viewport" but Game view shows nothing.

**This means:** Planets exist at correct positions, camera can see them, but **SpriteRenderer has an issue**.

---

## ✅ IMMEDIATE ACTION - RUN THIS NOW:

### Step 1: Deep Inspection

1. **Make sure you're in Play mode** ▶️
2. **Menu:** `Overlord` → `Debug` → `Inspect Planet Sprite Details (PLAY MODE)`
3. **Read the Console output** - it will tell you EXACTLY what's wrong with each sprite

Look for these red flags:
- ❌ `Sprite: NULL` - Sprite not assigned
- ❌ `SpriteRenderer Enabled: false` - Renderer is disabled
- ❌ `Color: (X, X, X, 0.0)` - Alpha is 0 (invisible)
- ❌ `Is Visible: false` - Culling or layer issue

### Step 2: Auto-Fix Attempt

Still in Play mode:

1. **Menu:** `Overlord` → `Debug` → `Force Enable All Sprite Renderers (PLAY MODE)`
2. **Immediately look at Game View** - Do you see planets now?

This will:
- Enable all disabled SpriteRenderers
- Set alpha to 1.0 (full opacity)
- Activate any inactive GameObjects

---

## 🔍 MOST LIKELY CAUSES:

### Cause 1: Sprite is NULL (Despite "Success" Message)

**Symptom:** Inspection shows `Sprite: NULL`

**Why it happens:** The auto-fix script ran on the prefab BEFORE it was instantiated. The instantiated planets don't have the sprite.

**Fix:**
1. **Exit Play mode** ⏹️
2. **In Project window**, go to `Assets/Prefabs`
3. **Select Planet.prefab**
4. **Inspector** → `Sprite Renderer` → `Sprite` field
5. **Manually assign** the "Knob" sprite:
   - Click the circle (⊙) next to Sprite field
   - Search for "Knob"
   - Double-click it
6. **Save** (Ctrl+S)
7. **Press Play** again - should work now!

---

### Cause 2: SpriteRenderer Disabled

**Symptom:** Inspection shows `SpriteRenderer Enabled: false`

**Why it happens:** Something is disabling the renderer after instantiation.

**Fix:**
- The "Force Enable" tool should fix this
- If it comes back disabled, check PlanetVisual.cs for any `enabled = false` calls

---

### Cause 3: Alpha = 0 (Transparent)

**Symptom:** Inspection shows `Color: (R, G, B, 0.0)`

**Why it happens:** Color's alpha channel is set to 0.

**Fix:**
- The "Force Enable" tool sets alpha to 1.0
- If it comes back to 0, check PlanetVisual.UpdateVisual() for color assignment

---

### Cause 4: Wrong Layer / Culling Mask

**Symptom:** Inspection shows `Is Visible: false` but position is correct

**Why it happens:** Planet is on a layer that the camera doesn't render.

**Fix:**
1. **Check planet layer** (Inspection shows this)
2. **Should be:** Layer 0 (Default)
3. **Check camera culling mask:**
   - Select Main Camera
   - Culling Mask should include "Default" layer
   - Should show "Everything" or include layer 0

---

### Cause 5: Material Issue

**Symptom:** Inspection shows `Material: NULL` or wrong material

**Why it happens:** SpriteRenderer has no material or wrong material.

**Fix:**
1. **Exit Play mode**
2. **Select Planet.prefab**
3. **Inspector** → `Sprite Renderer`
4. **Material:** Should be `Sprites-Default` or similar
5. If NULL, assign: Drag `Sprites-Default` material

---

## 🧪 MANUAL VERIFICATION (If tools don't work):

### Check 1: Select a Planet in Play Mode

1. **Press Play** ▶️
2. **Hierarchy** → Expand "Planets"
3. **Click on "Planet_Starbase"**
4. **Look at Inspector** - check these values:

```
Transform:
  Position: (should match console coordinates)

Sprite Renderer:
  Sprite: [Should show a sprite name, NOT "None"]
  Color: [Should be blue-ish, NOT transparent]
  Material: [Should be "Sprites-Default" or similar]
  Sorting Layer: Default
  Order in Layer: 0

Planet Visual (Script):
  Planet Sprite: [Should reference the SpriteRenderer]
  Base Scale: 1
```

### Check 2: Scene View During Play

1. **While in Play mode**, click **Scene tab**
2. **Do you see sprite icons** for the planets?
3. If YES → Camera/layer issue
4. If NO → Sprite/renderer issue

### Check 3: Frame Selected Planet

1. **While in Play mode**, select a planet in Hierarchy
2. **Scene view**, press **F** key (Frame Selected)
3. Camera centers on that planet
4. **Can you see a sprite in Scene view?**
5. If YES but not in Game view → Camera issue
6. If NO → Sprite renderer definitely broken

---

## 🔧 NUCLEAR OPTION: Recreate Planet Prefab

If nothing else works, the prefab might be corrupted:

### Step 1: Delete Old Prefab

1. **Exit Play mode** ⏹️
2. **In Project**, go to `Assets/Prefabs`
3. **Right-click `Planet.prefab`** → Delete
4. Confirm deletion

### Step 2: Create New Prefab

1. **In Hierarchy**, create empty GameObject: "Planet"
2. **Add Component** → `Sprite Renderer`
3. **Sprite Renderer** settings:
   - Sprite: "Knob" (or any circle sprite)
   - Material: Sprites-Default
   - Color: White (255, 255, 255, 255)
   - Sorting Layer: Default
   - Order: 0

4. **Add Component** → `Circle Collider 2D`
   - Radius: 0.5

5. **Add Component** → `Planet Visual (Script)`

6. **Create child GameObject:** "SelectionRing"
   - Add `Sprite Renderer`
   - Sprite: "Knob"
   - Color: Yellow
   - Scale: (1.3, 1.3, 1)
   - Disable it (uncheck in Inspector)

7. **Wire up Planet Visual:**
   - Planet Sprite: Drag Planet's SpriteRenderer
   - Selection Ring: Drag SelectionRing GameObject

8. **Drag** "Planet" from Hierarchy to `Assets/Prefabs` folder

9. **Delete** "Planet" from Hierarchy

10. **Wire up PlanetFactory:**
    - Select PlanetFactory
    - Drag new Planet.prefab into "Planet Prefab" field

11. **Press Play** - should work now!

---

## 📊 EXPECTED INSPECTION OUTPUT (Working):

When you run "Inspect Planet Sprite Details", you should see:

```
--- Planet_Starbase ---
  GameObject Active: True
  SpriteRenderer Enabled: True
  Sprite: Knob
    Sprite Texture: Knob
    Sprite Rect: Rect(0, 0, 256, 256)
  Color: RGBA(0.19, 0.50, 0.75, 1.00) (A=1)
  Material: Sprites-Default (Instance)
  Sorting Layer: 'Default' (ID:0)
  Order in Layer: 0
  Layer Mask: Default (0)
  Is Visible: True
```

If you see `Is Visible: True` but still nothing on screen → **Very rare Unity bug, try restarting Unity**

---

## 🎯 DIAGNOSTIC FLOWCHART:

```
Planets in view but invisible?
  │
  ├─ Run "Inspect Planet Sprite Details"
  │    │
  │    ├─ Sprite: NULL?
  │    │    └─> Manually assign sprite to prefab
  │    │
  │    ├─ Enabled: false?
  │    │    └─> Run "Force Enable All Sprite Renderers"
  │    │
  │    ├─ Color alpha = 0?
  │    │    └─> Run "Force Enable All Sprite Renderers"
  │    │
  │    ├─ Is Visible: false?
  │    │    └─> Check layer/culling mask
  │    │
  │    └─ Everything looks correct?
  │         └─> Try Scene view Frame Selected test
  │
  └─ Still broken after all checks?
       └─> Nuclear option: Recreate prefab from scratch
```

---

## 🚨 IF NOTHING WORKS:

If you've tried EVERYTHING and planets still invisible:

1. **Restart Unity Editor** (sometimes required for sprite changes)

2. **Check Unity version:**
   - Help → About Unity
   - If using Unity 6 Beta, try Unity 6.0.0 stable

3. **Reimport sprites:**
   - Assets → Reimport All

4. **Create a test sprite manually:**
   ```
   1. Create new GameObject in scene
   2. Add SpriteRenderer
   3. Assign Knob sprite
   4. Position at (0, 0, 0)
   5. Press Play
   6. Can you see THIS sprite?
      - If YES: Planet prefab is broken
      - If NO: Unity sprite rendering is broken
   ```

5. **Screenshot for support:**
   - Planet.prefab Inspector (showing Sprite Renderer)
   - Inspector output from "Inspect Planet Sprite Details"
   - Scene view during Play (with planet selected)
   - Game view during Play

---

**Next Steps:** Run the inspection tool NOW and tell me what it says! 🔍

---

**Generated by:** Dr. Quinn, Master Problem Solver 🔬
**Date:** 2025-12-08
**Status:** Diagnostic tools ready
