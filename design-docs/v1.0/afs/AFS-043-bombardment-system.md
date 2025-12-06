# AFS-043: Planetary Bombardment System

**Status:** Draft
**Priority:** P1 (High)
**Owner:** Lead Developer
**PRD Reference:** FR-COMBAT-002, FR-MILITARY-005

---

## Summary

Orbital bombardment system allowing Battle Cruisers to bombard enemy planets from orbit, destroying buildings and structures, reducing planetary defenses, and causing civilian casualties to weaken enemy colonies before ground invasion.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Planet and structure data
- **AFS-032 (Craft System)**: Battle Cruiser orbital position
- **AFS-042 (Space Combat)**: Orbital control requirement
- **AFS-061 (Building System)**: Structure destruction
- **AFS-023 (Population System)**: Civilian casualties

---

## Requirements

### Bombardment Mechanics

1. **Prerequisites**
   - **Orbital Control**: Attacker must control planet orbit (no enemy craft)
   - **Bombardment Craft**: Requires 1+ Battle Cruisers in orbit
   - **Turn Limit**: Can only bombard once per turn
   - **Strategic Choice**: Bombardment OR invasion (not both same turn)

2. **Bombardment Execution**
   - **Action Phase**: Player selects "Bombard Planet" action
   - **Target Selection**: Cannot bombard own planets
   - **Automatic**: All Battle Cruisers participate (fleet-wide action)
   - **Display**: "USCS Fleet 01 bombarding Zeta Reticuli..."

3. **Bombardment Strength**
   - **Formula**: `Bombardment Strength = Number of Battle Cruisers × 50`
   - **Example**: 3 Battle Cruisers = 150 bombardment strength
   - **Weapon Modifier**: Weapon level does NOT affect bombardment
   - **Damage Modifier**: Damaged craft still contribute full 50 strength

### Damage Resolution

1. **Target Priority**
   - **Primary Target**: Buildings and structures (random selection)
   - **Secondary**: Civilian population (collateral damage)
   - **Protected**: Docking Bays cannot be destroyed by bombardment (orbital structures)
   - **Random Targeting**: Structures destroyed randomly, not player-selected

2. **Structure Destruction**
   - **Damage Threshold**: Each structure has 100 HP
   - **Destruction Chance**: `(Bombardment Strength ÷ 100) × 100%`
   - **Example**: 150 strength = 150% chance = 1 structure destroyed, 50% chance of 2nd
   - **Maximum**: Can destroy up to 3 structures per bombardment (cap)
   - **Display**: "Mining Station destroyed by orbital bombardment!"

3. **Civilian Casualties**
   - **Collateral Damage**: 10% of Bombardment Strength = Population killed
   - **Example**: 150 strength = 15 population killed
   - **Morale Impact**: -20% morale per bombardment
   - **Strategic Cost**: Reduces potential workforce for conqueror
   - **Display**: "15 civilians killed, morale plummeting!"

4. **Bombardment Resistance**
   - **Planetary Shields** (Future Feature): Reduce bombardment damage by 50%
   - **MVP**: No planetary shields, all bombardments full effectiveness
   - **Strategic**: Makes undefended colonies vulnerable

### Strategic Considerations

1. **When to Bombard**
   - **Soften Defenses**: Destroy garrison structures before invasion
   - **Weaken Economy**: Destroy Mining/Horticultural Stations
   - **Terrorize**: Reduce morale to trigger surrender (future feature)
   - **Avoid**: If planning to capture intact infrastructure

2. **Bombardment vs Invasion**
   - **Bombardment**: Destroys structures, weakens colony, safe for attacker
   - **Invasion**: Captures intact, risky ground combat, gains functional colony
   - **Combined Strategy**: Bombard first, invade weakened target next turn

3. **Limitations**
   - **Cannot destroy**: Docking Bays (orbital structures, out of range)
   - **Random targets**: Player cannot select specific structures
   - **Collateral damage**: Always kills civilians
   - **One per turn**: Cannot repeatedly bombard same planet

### Bombardment Example

**Scenario: Player Fleet Bombards AI Colony**

**Attacker Fleet:**
- 2 Battle Cruisers (in orbit, orbital control secured)
- Bombardment Strength: 2 × 50 = 100

**Target Planet: Zeta Reticuli (AI Colony)**
- Structures: 2 Mining Stations, 1 Horticultural Station, 3 Docking Bays
- Population: 300
- Morale: 80%

**Bombardment Resolution:**
1. **Structure Damage**: 100 strength ÷ 100 = 1.0 → **1 structure destroyed**
2. **Random Selection**: Mining Station 1 destroyed
3. **Civilian Casualties**: 100 × 0.1 = **10 population killed**
4. **Morale Impact**: 80% - 20% = **60% morale**

**Result:**
- Mining Station destroyed (production reduced)
- Population: 300 → 290
- Morale: 80% → 60%
- Player message: "Zeta Reticuli bombarded! Mining Station destroyed, 10 civilians killed."

---

## Acceptance Criteria

### Functional Criteria

- [ ] Bombardment requires orbital control (no enemy craft)
- [ ] Bombardment strength calculates correctly (Battle Cruisers × 50)
- [ ] Structure destruction based on strength threshold
- [ ] Maximum 3 structures destroyed per bombardment
- [ ] Docking Bays immune to bombardment
- [ ] Civilian casualties = 10% of bombardment strength
- [ ] Morale reduced by 20% per bombardment
- [ ] Can only bombard once per turn per planet
- [ ] Cannot bombard own planets

### Performance Criteria

- [ ] Bombardment resolution executes in <50ms
- [ ] Structure selection (random) executes in <10ms
- [ ] UI displays bombardment results smoothly

### Integration Criteria

- [ ] Integrates with Craft System (AFS-032) for Battle Cruiser position
- [ ] Uses Space Combat System (AFS-042) to verify orbital control
- [ ] Destroys structures via Building System (AFS-061)
- [ ] Reduces population via Population System (AFS-023)
- [ ] Executes during Action Phase (AFS-002)

---

## Technical Notes

### Implementation Approach

```csharp
public class BombardmentSystem : MonoBehaviour
{
    private static BombardmentSystem _instance;
    public static BombardmentSystem Instance => _instance;

    public event Action<int, int> OnBombardmentStarted; // planetID, strength
    public event Action<int, int> OnStructureDestroyed; // structureID, planetID
    public event Action<int, int> OnCivilianCasualties; // planetID, casualties

    // Execute orbital bombardment
    public BombardmentResult BombardPlanet(int planetID, int attackerFactionID)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
        {
            Debug.LogError("Invalid planet!");
            return null;
        }

        // Validate: Cannot bombard own planets
        if (planet.Owner == attackerFactionID)
        {
            UIManager.Instance.ShowError("Cannot bombard your own planet!");
            return null;
        }

        // Validate: Must control orbit
        if (!HasOrbitalControl(planetID, attackerFactionID))
        {
            UIManager.Instance.ShowError("Must control orbit to bombard!");
            return null;
        }

        // Calculate bombardment strength
        var battleCruisers = GetBattleCruisersInOrbit(planetID, attackerFactionID);
        int bombardmentStrength = battleCruisers.Count * 50;

        OnBombardmentStarted?.Invoke(planetID, bombardmentStrength);
        Debug.Log($"Bombarding {planet.Name} with {bombardmentStrength} strength");

        // Destroy structures
        var destroyedStructures = DestroyStructures(planet, bombardmentStrength);

        // Cause civilian casualties
        int casualties = CauseCasualties(planet, bombardmentStrength);

        // Reduce morale
        planet.Morale = Mathf.Max(0, planet.Morale - 20);

        // Prepare result
        var result = new BombardmentResult
        {
            PlanetID = planetID,
            BombardmentStrength = bombardmentStrength,
            StructuresDestroyed = destroyedStructures.Count,
            CivilianCasualties = casualties,
            NewMorale = planet.Morale
        };

        UIManager.Instance.ShowMessage($"{planet.Name} bombarded! {destroyedStructures.Count} structures destroyed, {casualties} civilians killed.");

        return result;
    }

    // Destroy structures based on bombardment strength
    private List<Structure> DestroyStructures(Planet planet, int bombardmentStrength)
    {
        var destroyedStructures = new List<Structure>();

        // Calculate number of structures to destroy
        int structuresToDestroy = Mathf.Min(bombardmentStrength / 100, 3); // Max 3 per bombardment

        // Get vulnerable structures (exclude Docking Bays)
        var vulnerableStructures = planet.Structures
            .Where(s => s.Type != BuildingType.DockingBay && s.Status == BuildingStatus.Active)
            .ToList();

        if (vulnerableStructures.Count == 0)
        {
            Debug.Log("No vulnerable structures to destroy");
            return destroyedStructures;
        }

        // Randomly select structures to destroy
        for (int i = 0; i < structuresToDestroy && vulnerableStructures.Count > 0; i++)
        {
            int randomIndex = UnityEngine.Random.Range(0, vulnerableStructures.Count);
            var structure = vulnerableStructures[randomIndex];

            // Destroy structure
            planet.Structures.Remove(structure);
            destroyedStructures.Add(structure);
            vulnerableStructures.RemoveAt(randomIndex);

            OnStructureDestroyed?.Invoke(structure.ID, planet.ID);
            Debug.Log($"{structure.Type} destroyed on {planet.Name}");
        }

        return destroyedStructures;
    }

    // Cause civilian casualties (collateral damage)
    private int CauseCasualties(Planet planet, int bombardmentStrength)
    {
        int casualties = Mathf.FloorToInt(bombardmentStrength * 0.1f); // 10% of strength
        casualties = Mathf.Min(casualties, planet.Population); // Cannot kill more than population

        planet.Population -= casualties;

        OnCivilianCasualties?.Invoke(planet.ID, casualties);
        Debug.Log($"{casualties} civilians killed on {planet.Name}");

        return casualties;
    }

    // Check if faction controls orbit (no enemy craft)
    private bool HasOrbitalControl(int planetID, int factionID)
    {
        var craftInOrbit = GameStateManager.Instance.GetCraftAtPlanet(planetID);
        var enemyCraft = craftInOrbit.Where(c => c.Owner != factionID).ToList();

        return enemyCraft.Count == 0; // No enemy craft = orbital control
    }

    // Get Battle Cruisers in orbit for faction
    private List<Craft> GetBattleCruisersInOrbit(int planetID, int factionID)
    {
        var craftInOrbit = GameStateManager.Instance.GetCraftAtPlanet(planetID);
        return craftInOrbit
            .Where(c => c.Owner == factionID && c.Type == CraftType.BattleCruiser)
            .ToList();
    }
}

public class BombardmentResult
{
    public int PlanetID;
    public int BombardmentStrength;
    public int StructuresDestroyed;
    public int CivilianCasualties;
    public int NewMorale;
}
```

### Bombardment Damage Table

| Battle Cruisers | Bombardment Strength | Structures Destroyed | Civilian Casualties |
|-----------------|----------------------|----------------------|---------------------|
| 1 | 50 | 0-1 | 5 |
| 2 | 100 | 1 | 10 |
| 3 | 150 | 1-2 | 15 |
| 4 | 200 | 2 | 20 |
| 5+ | 250+ | 2-3 (max 3) | 25+ |

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Planet and structure data
- **AFS-032 (Craft System)**: Battle Cruiser orbital position
- **AFS-042 (Space Combat)**: Orbital control verification

### Depended On By
- **AFS-002 (Turn System)**: Action Phase execution
- **AFS-044 (Invasion System)**: Pre-invasion softening
- **AFS-071 (UI State Machine)**: Bombardment UI and results

### Events Published
- `OnBombardmentStarted(int planetID, int strength)`: Bombardment initiated
- `OnStructureDestroyed(int structureID, int planetID)`: Structure destroyed
- `OnCivilianCasualties(int planetID, int casualties)`: Civilians killed

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
