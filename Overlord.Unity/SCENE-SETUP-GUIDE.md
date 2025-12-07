# Unity Scene Setup Guide - Quick Prototype

This guide will get you from empty scene to playable prototype in **5 minutes**.

---

## Step 1: Generate Planet Prefab (1 minute)

1. **In Unity Editor**, go to top menu: `Overlord → Generate Planet Prefab`
2. A dialog will appear: "Planet prefab generated successfully!" → Click **OK**
3. You should now see `Assets/Prefabs/Planet.prefab` in your Project window

**What this does:** Creates a simple circle sprite with a yellow selection ring for planets.

---

## Step 2: Setup Scene with Bootstrapper (2 minutes)

1. **In Unity Hierarchy**, right-click → `Create Empty`
2. Rename it to **"SceneBootstrapper"**
3. **In Inspector**, click `Add Component`
4. Search for **"Scene Bootstrapper"** and add it
5. **Assign Planet Prefab:**
   - In the SceneBootstrapper component, find **"Planet Prefab"** field
   - Drag `Assets/Prefabs/Planet.prefab` from Project window into this field
6. **Press Play** ▶️

**What happens:** The SceneBootstrapper will auto-create:
- GameManager (initializes game systems)
- Canvas with UI panels
- GalaxyMapManager (spawns planets)
- Main Camera
- Resource display (top-right)
- Action buttons (bottom-left)
- End Turn button (top-right)

---

## Step 3: Verify Everything Works (2 minutes)

### ✅ Check Console for Success Messages:
```
GameManager initialized
Galaxy generated: 6 planets
GalaxyMapManager initialized successfully
Spawned 6 planet visuals
✓ GameManager created
✓ Canvas created
✓ Basic UI created
✓ GalaxyMapManager created
✓ PlanetFactory created
✓ Camera created
```

### ✅ Check Scene View:
- You should see **4-6 colored circles** (planets):
  - **BLUE** = Player homeworld (Starbase)
  - **RED** = AI homeworld (Hitotsu)
  - **GRAY** = Neutral planets

### ✅ Check Game View (UI):
- **Top bar:** Turn counter + END TURN button
- **Top-right:** Resource display (Credits, Minerals, Fuel, Food, Energy)
- **Bottom-left:** Action menu with:
  - "Buy Battle Cruiser (150K)" button
  - "Buy Platoon (70K)" button

---

## Step 4: Test Full Gameplay Loop (5 minutes)

### **A. Purchase Battle Cruiser**
1. Click **"Buy Battle Cruiser (150K)"**
2. Check Console: `✓ Battle Cruiser purchased!`
3. Check Resources: Credits should drop by 150,000

### **B. Purchase Platoon**
1. Click **"Buy Platoon (70K)"**
2. Check Console: `✓ Platoon commissioned!`
3. Check Resources: Credits should drop by 70,000

### **C. Load Platoon onto Ship** (Manual via Console for now)
Run this in Unity Console (Window → General → Console):
```csharp
// Get the ship we just bought
var ship = GameManager.Instance.GameState.Craft[0];

// Get the platoon we just bought
var platoon = GameManager.Instance.GameState.Platoons[0];

// Load platoon onto ship
GameManager.Instance.CraftSystem.LoadPlatoons(ship.PlanetID, ship.ID, new System.Collections.Generic.List<int> { platoon.ID });

Debug.Log("Platoon loaded onto Battle Cruiser");
```

### **D. Navigate to Enemy Planet**
1. **Click BLUE planet** (Starbase) - your Battle Cruiser auto-selects
2. **Click RED planet** (Hitotsu - enemy homeworld)
3. Check Console for:
   ```
   Ship 0 moved to planet 1
   Battle at Hitotsu! {result}
   Planet 1 captured by Player
   ```
4. **Verify:** RED planet should turn BLUE (you captured it!)

### **E. Test Victory**
1. Navigate to remaining neutral planets and capture them (if any have platoons)
2. Click **"END TURN"**
3. Check Console for: `VICTORY! You have conquered all enemy planets!`
4. Try clicking END TURN again → Console should show: `Game is over - cannot advance turn`

---

## Troubleshooting

### Problem: No planets visible
**Solution:** Check Console for errors. Make sure Planet Prefab is assigned in SceneBootstrapper.

### Problem: "NullReferenceException" in Console
**Solution:** Make sure you pressed Play AFTER assigning the Planet Prefab to SceneBootstrapper.

### Problem: Buttons don't work
**Solution:** Make sure you have an EventSystem in the scene. SceneBootstrapper should create one automatically via Canvas → GraphicRaycaster.

### Problem: Can't click planets
**Solution:** Make sure Main Camera has Physics2DRaycaster component, or planets have colliders. Try clicking directly on the colored circles.

---

## What's Missing (Post-MVP Features)

This is a **minimal prototype**. Future enhancements:
- ✅ Load platoon onto ship UI (currently manual)
- ✅ Planet details panel (shows resources, platoons)
- ✅ Fleet management panel (shows ships at planet)
- ✅ Combat result popup (currently console only)
- ✅ Victory screen panel (currently console only)
- ✅ Planet names displayed on map
- ✅ Ship icons visible on planets
- ✅ Minimap/zoom controls

But for **prototype testing**, this setup proves:
- ✅ Galaxy generation works
- ✅ Resource management works
- ✅ Ship/platoon purchasing works
- ✅ Navigation works
- ✅ Combat auto-triggers
- ✅ Victory detection works

---

## Next Steps

Once testing is complete and Epic 1 is validated:
1. Mark all stories as **DONE** in `sprint-status.yaml`
2. Run `/bmad:bmm:workflows:retrospective` for Epic 1
3. Start Epic 2: Core Systems (Save/Load, Settings, Input)
4. Polish UI with proper panels from `Assets/Scripts/UI/Panels/`

**Celebrate the working prototype!** 🎉🚀
