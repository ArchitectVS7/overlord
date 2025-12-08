# SIMPLE MANUAL SETUP - No Scripts Required

Let's bypass the SceneBootstrapper issues and do a simple manual setup.

## Step 1: Disable SceneBootstrapper

1. In Hierarchy, select **SceneBootstrapper**
2. In Inspector, **UNCHECK** the checkbox next to "Scene Bootstrapper" component (disable it)
3. This prevents it from running

## Step 2: Manual Setup (2 minutes)

### A. Create GameManager
1. Hierarchy → Right-click → Create Empty → Name: **GameManager**
2. Inspector → Add Component → Search: **Game Manager**
3. Press Play briefly to initialize it, then Stop

### B. Create Camera (if needed)
1. If no Main Camera exists:
   - Hierarchy → Right-click → Camera → Name: **Main Camera**
   - Tag: MainCamera
   - Position: (0, 0, -10)
   - Projection: Orthographic
   - Size: 10

### C. Create GalaxyMapManager
1. Hierarchy → Create Empty → Name: **GalaxyMapManager**
2. Add Component → Search: **Galaxy Map Manager**

### D. Create PlanetFactory
1. Hierarchy → Create Empty → Name: **PlanetFactory**
2. Add Component → Search: **Planet Factory**
3. In Inspector:
   - Drag **Planet.prefab** (from Assets/Prefabs) into "Planet Prefab" field

### E. Create Planets Container
1. Hierarchy → Create Empty → Name: **Planets**

### F. Wire Up References
1. Select **GalaxyMapManager** in Hierarchy
2. In Inspector, find the GalaxyMapManager component:
   - Drag **PlanetFactory** GameObject into "Planet Factory" field
   - Drag **Planets** GameObject into "Planets Container" field

3. Select **PlanetFactory** in Hierarchy
4. In Inspector:
   - Drag **Planets** GameObject into "Planets Container" field
   - Verify **Planet Prefab** is assigned

## Step 3: Test

1. **Press Play** ▶️
2. Check Console - should see:
   ```
   GameManager initialized
   Galaxy generated: 6 planets
   GalaxyMapManager awakened
   GalaxyMapManager initialized successfully
   Spawned 6 planet visuals
   ```
3. Check Game view - should see 4-6 colored planets!

## Step 4: Add Simple UI (Optional)

For now, just test with console commands. To buy ships/platoons, use the Console window:

```csharp
// Buy Battle Cruiser
GameManager.Instance.CraftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

// Buy Platoon
GameManager.Instance.PlatoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
```

This manual setup should work with NO infinite loops!
