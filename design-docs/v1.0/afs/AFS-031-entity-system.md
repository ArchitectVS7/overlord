# AFS-031: Entity System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-ENTITY-001, NFR-SCALE-001

---

## Summary

Foundation entity system that provides base structure for all game objects (Craft, Platoons, Planets), enforces entity limits (32 craft, 24 platoons), manages entity lifecycle (creation, destruction), and provides entity queries for gameplay systems.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Entity storage and persistence
- **AFS-012 (Planet System)**: Planet entities

---

## Requirements

### Entity Types

1. **Craft Entities** (max 32)
   - Battle Cruiser (combat vessel)
   - Cargo Cruiser (resource transport)
   - Solar Satellite (energy production)
   - Atmosphere Processor (terraforming equipment)
   - Stored in GameState.Craft list

2. **Platoon Entities** (max 24)
   - Ground troops for combat
   - 1-200 soldiers per platoon
   - Equipment and training levels
   - Stored in GameState.Platoons list

3. **Planet Entities** (4-6 per game)
   - Star system planets
   - Fixed count (generated at game start)
   - Stored in GameState.Planets list

### Entity Base Structure

1. **Common Properties**
   - **ID**: Unique identifier (int, auto-incremented)
   - **Type**: Entity type enum
   - **Owner**: FactionType (Player, AI, Neutral)
   - **Name**: Display name (string)
   - **Position**: World position (Vector3, for spatial entities)
   - **State**: Entity state enum (Active, Destroyed, InTransit, etc.)

2. **Serialization**
   - All entities must be serializable (JSON)
   - No non-serializable fields (like Unity Transform)
   - Use [Serializable] attribute
   - Support deep copy for undo (future feature)

3. **Lifecycle**
   - Creation: AddEntity() → Assigns ID, validates limits
   - Update: Entities update during turn phases
   - Destruction: RemoveEntity() → Cleanup, event published
   - Persistence: Save/load via GameStateManager

### Entity Limits

1. **Craft Limit: 32**
   - Hard limit from original game design
   - Performance optimization for mobile
   - Prevent creation if limit reached
   - Display error: "Fleet limit reached (32/32)"

2. **Platoon Limit: 24**
   - Strategic limit for military management
   - Balanced for gameplay (not too many units)
   - Prevent creation if limit reached
   - Display error: "Platoon limit reached (24/24)"

3. **Planet Limit: 4-6**
   - Fixed at galaxy generation
   - Cannot create or destroy planets
   - Ownership can change (via conquest)

### Entity Queries

1. **Get Entity by ID**
   - `GetCraftByID(int id)` → CraftEntity
   - `GetPlatoonByID(int id)` → PlatoonEntity
   - `GetPlanetByID(int id)` → PlanetEntity
   - O(1) lookup via dictionary

2. **Get Entities by Owner**
   - `GetCraft(FactionType owner)` → List<CraftEntity>
   - `GetPlatoons(FactionType owner)` → List<PlatoonEntity>
   - `GetPlanets(FactionType owner)` → List<PlanetEntity>

3. **Get Entities by Location**
   - `GetCraftAtPlanet(int planetID)` → List<CraftEntity>
   - `GetPlatoonsAtPlanet(int planetID)` → List<PlatoonEntity>
   - Filters by LocationPlanetID

4. **Get Entities by State**
   - `GetCraftInTransit()` → List<CraftEntity>
   - `GetActivePlatoons()` → List<PlatoonEntity>
   - Filters by State property

### Entity Events

1. **Lifecycle Events**
   - `OnEntityCreated(Entity entity)`: New entity added
   - `OnEntityDestroyed(Entity entity)`: Entity removed
   - `OnEntityStateChanged(Entity entity, EntityState newState)`: State transition

2. **Ownership Events**
   - `OnEntityOwnerChanged(Entity entity, FactionType newOwner)`: Ownership transfer
   - Used for planet conquest, craft capture

3. **Position Events**
   - `OnEntityMoved(Entity entity, Vector3 newPosition)`: Spatial movement
   - Used for fleet navigation, galaxy view updates

---

## Acceptance Criteria

### Functional Criteria

- [ ] Entity system supports 32 craft, 24 platoons, 4-6 planets
- [ ] Entity creation validates limits and rejects if exceeded
- [ ] Each entity has unique ID (auto-incremented)
- [ ] Entity queries execute in O(1) time (ID lookup)
- [ ] Entities serialize/deserialize for save/load
- [ ] Entity destruction triggers cleanup and events
- [ ] Entity state changes publish events for UI updates

### Performance Criteria

- [ ] Entity queries execute in <1ms
- [ ] Entity creation/destruction in <5ms
- [ ] No memory leaks during 100+ turn sessions
- [ ] Entity list iteration efficient (<1ms for 32 craft)

### Integration Criteria

- [ ] Integrates with Game State Manager (AFS-001) for storage
- [ ] Provides entity structure for Craft System (AFS-032)
- [ ] Provides entity structure for Platoon System (AFS-033)
- [ ] Provides entity structure for Planet System (AFS-012)

---

## Technical Notes

### Implementation Approach

```csharp
[Serializable]
public abstract class Entity
{
    public int ID;
    public string Name;
    public FactionType Owner;
    public EntityState State;

    public abstract EntityType GetEntityType();
}

public enum EntityType
{
    Craft,
    Platoon,
    Planet
}

public enum EntityState
{
    Active,
    Inactive,
    InTransit,
    UnderConstruction,
    Destroyed
}

public enum FactionType
{
    Player,
    AI,
    Neutral
}

[Serializable]
public class CraftEntity : Entity
{
    public CraftType Type;
    public Vector3 Position; // Current location (or last known if in transit)
    public int LocationPlanetID; // -1 if in transit
    public bool InTransit;
    public bool Active; // For Solar Satellites
    public ResourceDelta CargoHold; // For Cargo Cruisers
    public List<int> CarriedPlatoonIDs; // For Battle Cruisers (max 4)

    public override EntityType GetEntityType() => EntityType.Craft;
}

public enum CraftType
{
    BattleCruiser,
    CargoCruiser,
    SolarSatellite,
    AtmosphereProcessor
}

[Serializable]
public class PlatoonEntity : Entity
{
    public int Troops; // 1-200
    public EquipmentLevel Equipment; // Body Armor quality
    public WeaponLevel Weapon; // Weapon quality
    public int TrainingLevel; // 0-100%
    public int LocationPlanetID; // -1 if embarked on craft
    public int CarriedByCraftID; // -1 if on planet surface

    public override EntityType GetEntityType() => EntityType.Platoon;

    public int GetMilitaryStrength()
    {
        // Military strength = Troops × Equipment Modifier × Weapon Modifier × Training Modifier
        float equipmentMod = GetEquipmentModifier();
        float weaponMod = GetWeaponModifier();
        float trainingMod = TrainingLevel / 100f;

        return Mathf.FloorToInt(Troops * equipmentMod * weaponMod * trainingMod);
    }

    private float GetEquipmentModifier()
    {
        switch (Equipment)
        {
            case EquipmentLevel.Civilian: return 0.5f;
            case EquipmentLevel.Basic: return 1.0f;
            case EquipmentLevel.Standard: return 1.5f;
            case EquipmentLevel.Advanced: return 2.0f;
            case EquipmentLevel.Elite: return 2.5f;
            default: return 1.0f;
        }
    }

    private float GetWeaponModifier()
    {
        switch (Weapon)
        {
            case WeaponLevel.Pistol: return 0.8f;
            case WeaponLevel.Rifle: return 1.0f;
            case WeaponLevel.AssaultRifle: return 1.3f;
            case WeaponLevel.Plasma: return 1.6f;
            default: return 1.0f;
        }
    }
}

public enum EquipmentLevel
{
    Civilian, // No armor (cheapest)
    Basic, // Light armor
    Standard, // Medium armor
    Advanced, // Heavy armor
    Elite // Power armor (most expensive)
}

public enum WeaponLevel
{
    Pistol, // Weakest
    Rifle,
    AssaultRifle,
    Plasma // Strongest
}

// (PlanetEntity already defined in AFS-012)
```

### Entity System Manager

```csharp
public class EntitySystem : MonoBehaviour
{
    private static EntitySystem _instance;
    public static EntitySystem Instance => _instance;

    private const int MaxCraft = 32;
    private const int MaxPlatoons = 24;

    public event Action<Entity> OnEntityCreated;
    public event Action<Entity> OnEntityDestroyed;
    public event Action<Entity, EntityState> OnEntityStateChanged;

    // Create craft (validates limit)
    public int CreateCraft(CraftType type, int locationPlanetID, FactionType owner)
    {
        var craft = GameStateManager.Instance.GetAllCraft();
        if (craft.Count >= MaxCraft)
        {
            UIManager.Instance.ShowError("Fleet limit reached (32/32)!");
            return -1;
        }

        var newCraft = new CraftEntity
        {
            ID = GameStateManager.Instance.GetNextCraftID(),
            Type = type,
            Owner = owner,
            LocationPlanetID = locationPlanetID,
            InTransit = false,
            State = EntityState.Active,
            Name = GenerateCraftName(type, owner)
        };

        GameStateManager.Instance.AddCraft(newCraft);
        OnEntityCreated?.Invoke(newCraft);

        Debug.Log($"Created {newCraft.Name} (ID: {newCraft.ID}) at planet {locationPlanetID}");
        return newCraft.ID;
    }

    // Create platoon (validates limit)
    public int CreatePlatoon(int troops, EquipmentLevel equipment, WeaponLevel weapon, int locationPlanetID, FactionType owner)
    {
        var platoons = GameStateManager.Instance.GetAllPlatoons();
        if (platoons.Count >= MaxPlatoons)
        {
            UIManager.Instance.ShowError("Platoon limit reached (24/24)!");
            return -1;
        }

        var newPlatoon = new PlatoonEntity
        {
            ID = GameStateManager.Instance.GetNextPlatoonID(),
            Troops = troops,
            Equipment = equipment,
            Weapon = weapon,
            TrainingLevel = 0, // Start untrained
            Owner = owner,
            LocationPlanetID = locationPlanetID,
            CarriedByCraftID = -1,
            State = EntityState.UnderConstruction,
            Name = GeneratePlatoonName(owner, troops)
        };

        GameStateManager.Instance.AddPlatoon(newPlatoon);
        OnEntityCreated?.Invoke(newPlatoon);

        Debug.Log($"Created {newPlatoon.Name} (ID: {newPlatoon.ID}) with {troops} troops");
        return newPlatoon.ID;
    }

    // Destroy craft
    public void DestroyCraft(int craftID)
    {
        var craft = GameStateManager.Instance.GetCraftByID(craftID);
        if (craft == null)
            return;

        craft.State = EntityState.Destroyed;
        GameStateManager.Instance.RemoveCraft(craftID);
        OnEntityDestroyed?.Invoke(craft);

        Debug.Log($"Destroyed {craft.Name} (ID: {craftID})");
    }

    // Destroy platoon
    public void DestroyPlatoon(int platoonID)
    {
        var platoon = GameStateManager.Instance.GetPlatoonByID(platoonID);
        if (platoon == null)
            return;

        platoon.State = EntityState.Destroyed;
        GameStateManager.Instance.RemovePlatoon(platoonID);
        OnEntityDestroyed?.Invoke(platoon);

        Debug.Log($"Destroyed {platoon.Name} (ID: {platoonID})");
    }

    // Change entity state
    public void SetEntityState(Entity entity, EntityState newState)
    {
        var oldState = entity.State;
        entity.State = newState;

        OnEntityStateChanged?.Invoke(entity, newState);
        Debug.Log($"{entity.Name} state changed: {oldState} → {newState}");
    }

    // Generate craft name
    private string GenerateCraftName(CraftType type, FactionType owner)
    {
        string prefix = owner == FactionType.Player ? "USCS" : "HICS"; // United Space / Hostile Imperial
        int number = GameStateManager.Instance.GetAllCraft().Count + 1;

        switch (type)
        {
            case CraftType.BattleCruiser:
                return $"{prefix} Cruiser {number:D2}";
            case CraftType.CargoCruiser:
                return $"{prefix} Cargo {number:D2}";
            case CraftType.SolarSatellite:
                return $"Solar Satellite {number:D2}";
            case CraftType.AtmosphereProcessor:
                return $"Atmosphere Processor {number:D2}";
            default:
                return $"Craft {number:D2}";
        }
    }

    // Generate platoon name
    private string GeneratePlatoonName(FactionType owner, int troops)
    {
        string prefix = owner == FactionType.Player ? "Platoon" : "Enemy Platoon";
        int number = GameStateManager.Instance.GetAllPlatoons().Count + 1;
        return $"{prefix} {number:D2} ({troops} troops)";
    }
}
```

### Entity Limit Validation

```csharp
// Validate before creating new craft
if (!EntitySystem.Instance.CanCreateCraft())
{
    UIManager.Instance.ShowError("Fleet limit reached! Cannot purchase more craft.");
    return;
}

// Validate before creating new platoon
if (!EntitySystem.Instance.CanCreatePlatoon())
{
    UIManager.Instance.ShowError("Platoon limit reached! Cannot commission more platoons.");
    return;
}

public bool CanCreateCraft()
{
    return GameStateManager.Instance.GetAllCraft().Count < 32;
}

public bool CanCreatePlatoon()
{
    return GameStateManager.Instance.GetAllPlatoons().Count < 24;
}
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Entity storage

### Depended On By
- **AFS-032 (Craft System)**: Craft entity structure
- **AFS-033 (Platoon System)**: Platoon entity structure
- **AFS-012 (Planet System)**: Planet entity structure
- **AFS-041 (Combat System)**: Entity destruction in combat
- **AFS-062 (Unit Production)**: Entity creation

### Events Published
- `OnEntityCreated(Entity entity)`: New entity added
- `OnEntityDestroyed(Entity entity)`: Entity removed
- `OnEntityStateChanged(Entity entity, EntityState newState)`: State transition
- `OnEntityOwnerChanged(Entity entity, FactionType newOwner)`: Ownership transfer
- `OnEntityMoved(Entity entity, Vector3 newPosition)`: Position update

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
