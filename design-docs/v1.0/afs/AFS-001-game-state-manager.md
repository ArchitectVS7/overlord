# AFS-001: Game State Manager

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-CORE-001

---

## Summary

Central state container that maintains complete game state including all entities, resources, colonies, turn number, and player/AI data, providing persistence and state queries for all game systems.

---

## Dependencies

- None (Foundation component)

---

## Requirements

### State Storage

1. **Game State Container**
   - Single source of truth for all game data
   - Serializable to JSON for save/load operations
   - Immutable during turn resolution to prevent race conditions
   - Supports deep copy for undo functionality (future)

2. **Entity Collection**
   - Array of all craft entities (max 32)
   - Array of all platoon entities (max 24)
   - Array of all planet entities (4-6 per game)
   - Entity lookups by ID in O(1) time

3. **Resource Tracking**
   - Per-planet resource stores (Food, Minerals, Fuel, Energy)
   - Global resource tallies for UI display
   - Resource change history for last 5 turns (analytics)

4. **Turn Management**
   - Current turn number (starts at 1)
   - Turn phase (Income/Action/Combat/End)
   - Last action timestamp for auto-save timing

5. **Player Data**
   - Player faction state (resources, owned planets, military strength)
   - AI faction state (resources, owned planets, military strength)
   - Settings and preferences (separate from game state)

### State Queries

1. **Entity Queries**
   - GetAllCraft() → List<CraftEntity>
   - GetCraftByID(int id) → CraftEntity
   - GetCraftAtPlanet(int planetID) → List<CraftEntity>
   - GetPlatoons() → List<PlatoonEntity>
   - GetPlanetByID(int id) → PlanetEntity

2. **Resource Queries**
   - GetPlanetResources(int planetID) → ResourceCollection
   - GetTotalResources(FactionType faction) → ResourceCollection
   - CanAfford(Cost cost, int planetID) → bool

3. **Game State Queries**
   - GetCurrentTurn() → int
   - GetCurrentPhase() → TurnPhase
   - IsVictory() → VictoryResult
   - GetPlanetOwner(int planetID) → FactionType

### State Mutations

1. **Controlled Mutations**
   - All state changes through manager methods (no direct access)
   - Validation before mutation (e.g., can't exceed 32 craft limit)
   - Event dispatched after mutation for UI update
   - Transaction support (begin/commit/rollback for combat resolution)

2. **Entity Lifecycle**
   - AddCraft(CraftData data) → int craftID
   - RemoveCraft(int craftID) → void
   - AddPlatoon(PlatoonData data) → int platoonID
   - RemovePlatoon(int platoonID) → void

3. **Resource Mutations**
   - AddResources(int planetID, ResourceDelta delta) → void
   - RemoveResources(int planetID, ResourceDelta delta) → bool
   - TransferResources(int fromPlanet, int toPlanet, ResourceDelta delta) → bool

---

## Acceptance Criteria

### Functional Criteria

- [ ] Game state persists all required data for complete game restoration
- [ ] State queries execute in <1ms for 99% of calls
- [ ] State mutations trigger UI update events
- [ ] Cannot exceed entity limits (32 craft, 24 platoons)
- [ ] Cannot perform invalid mutations (e.g., negative resources)
- [ ] Supports multiple save slots (minimum 10)

### Performance Criteria

- [ ] Serialization time: <500ms for full game state
- [ ] Deserialization time: <1s for full game state
- [ ] Memory footprint: <50MB for game state data
- [ ] No memory leaks during 100+ turn sessions

### Integration Criteria

- [ ] Integrates with Save/Load System (AFS-003)
- [ ] Provides events for UI updates (AFS-071)
- [ ] Supports Turn System state transitions (AFS-002)
- [ ] Validates victory conditions each turn (AFS-002)

---

## Technical Notes

### Implementation Approach

```csharp
public class GameStateManager : MonoBehaviour
{
    private static GameStateManager _instance;
    public static GameStateManager Instance => _instance;

    [SerializeField] private GameState _currentState;

    public event Action<GameStateChangedEvent> OnStateChanged;

    // State Queries
    public List<CraftEntity> GetAllCraft() => _currentState.Craft;
    public CraftEntity GetCraftByID(int id) => _currentState.CraftLookup[id];

    // State Mutations
    public int AddCraft(CraftData data)
    {
        if (_currentState.Craft.Count >= 32)
            throw new InvalidOperationException("Fleet limit exceeded");

        var craft = new CraftEntity(data);
        _currentState.Craft.Add(craft);
        _currentState.CraftLookup[craft.ID] = craft;

        OnStateChanged?.Invoke(new GameStateChangedEvent
        {
            Type = ChangeType.CraftAdded,
            EntityID = craft.ID
        });

        return craft.ID;
    }
}

[Serializable]
public class GameState
{
    public int CurrentTurn;
    public TurnPhase CurrentPhase;
    public List<CraftEntity> Craft = new List<CraftEntity>(32);
    public List<PlatoonEntity> Platoons = new List<PlatoonEntity>(24);
    public List<PlanetEntity> Planets = new List<PlanetEntity>(6);

    [NonSerialized] public Dictionary<int, CraftEntity> CraftLookup;

    public void RebuildLookups()
    {
        CraftLookup = Craft.ToDictionary(c => c.ID);
    }
}
```

### Serialization Strategy

- Use Unity's JsonUtility for simplicity and performance
- Separate serialization for game state vs settings
- Include version number in save file for migration support
- Validate deserialized data before applying to live state

### Performance Considerations

- Use dictionary lookups for O(1) entity access
- Avoid LINQ queries in hot paths
- Pre-allocate collections with known max sizes
- Pool event objects to reduce GC pressure

---

## Integration Points

### Depends On
- None (Foundation component)

### Depended On By
- **AFS-002 (Turn System)**: Reads/writes turn number and phase
- **AFS-003 (Save/Load System)**: Serializes/deserializes game state
- **AFS-011 (Galaxy Generation)**: Initializes planet entities
- **AFS-031 (Entity System)**: Stores all entity data
- **AFS-071 (UI State Machine)**: Queries state for display

### Events Published
- `OnStateChanged(GameStateChangedEvent)`: Any state mutation
- `OnTurnChanged(int newTurn)`: Turn number incremented
- `OnResourcesChanged(int planetID, ResourceDelta delta)`: Resource mutation
- `OnCraftAdded/Removed(int craftID)`: Fleet changes
- `OnPlatoonAdded/Removed(int platoonID)`: Platoon changes

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
