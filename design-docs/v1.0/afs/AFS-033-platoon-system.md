# AFS-033: Platoon System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-ENTITY-002, FR-MILITARY-001, FR-MILITARY-003, FR-MILITARY-004

---

## Summary

Military ground forces system that creates platoons (1-200 troops) with equipment (body armor) and weapons, manages training progression (0-100%), handles commissioning/decommissioning, calculates military strength for combat, and provides platoon transport via Battle Cruisers.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Platoon entity storage
- **AFS-031 (Entity System)**: Platoon entity base structure
- **AFS-032 (Craft System)**: Battle Cruiser transport
- **AFS-023 (Population System)**: Crew recruitment from population
- **AFS-041 (Combat System)**: Military strength calculations

---

## Requirements

### Platoon Creation

1. **Commissioning Process**
   - **Step 1**: Draft troops from population (1-200 troops)
   - **Step 2**: Purchase equipment (body armor level)
   - **Step 3**: Purchase weapons (weapon level)
   - **Step 4**: Begin training on Starbase (0% → 100%)
   - **Step 5**: Commission when ready (deploy or garrison)

2. **Troop Count**
   - **Range**: 1-200 troops per platoon
   - **Cost per troop**: Varies by equipment level
   - **Recruitment**: Deducted from planet population
   - **Display**: "Platoon 01 (150 troops)"

3. **Equipment Levels** (Body Armor)
   - **Civilian** (20,000 Credits): 0.5x combat modifier (no armor)
   - **Basic** (35,000 Credits): 1.0x combat modifier (light armor)
   - **Standard** (55,000 Credits): 1.5x combat modifier (medium armor)
   - **Advanced** (80,000 Credits): 2.0x combat modifier (heavy armor)
   - **Elite** (109,000 Credits): 2.5x combat modifier (power armor)

4. **Weapon Levels**
   - **Pistol** (5,000 Credits): 0.8x combat modifier
   - **Rifle** (10,000 Credits): 1.0x combat modifier
   - **Assault Rifle** (18,000 Credits): 1.3x combat modifier
   - **Plasma** (30,000 Credits): 1.6x combat modifier

5. **Total Cost Formula**
   - `Total Cost = Equipment Cost + Weapon Cost`
   - Example: 100 troops, Standard armor, Assault Rifle = 55,000 + 18,000 = **73,000 Credits**
   - Cost is one-time (not per-troop)

### Training System

1. **Training Mechanics**
   - **Location**: Starbase only (player's starting planet)
   - **Duration**: 10 turns (0% → 100% at 10%/turn)
   - **Interruption**: Can deploy partially-trained platoons
   - **Training bonus**: 100% = Five-Star General equivalent
   - **Concurrent training**: Multiple platoons can train simultaneously

2. **Training Progression**
   - Turn 1: 10% trained
   - Turn 2: 20% trained
   - ...
   - Turn 10: 100% trained (fully combat-ready)

3. **Training State**
   - **Under Training**: State = UnderConstruction, TurnsRemaining > 0
   - **Partially Trained**: Can be deployed early (e.g., 50% trained)
   - **Fully Trained**: 100%, maximum combat effectiveness

4. **Training Location Restriction**
   - Only Starbase can train platoons
   - Other planets cannot train (limited facilities)
   - Platoons deployed elsewhere cannot resume training

### Military Strength Calculation

1. **Strength Formula**
   - `Military Strength = Troops × Equipment Modifier × Weapon Modifier × Training Modifier`
   - **Example**: 100 troops, Standard (1.5x), Rifle (1.0x), 100% (1.0x) = **150 strength**

2. **Modifiers**
   - **Equipment Modifier**: 0.5x to 2.5x (Civilian to Elite)
   - **Weapon Modifier**: 0.8x to 1.6x (Pistol to Plasma)
   - **Training Modifier**: (TrainingLevel ÷ 100) = 0.0 to 1.0
   - All modifiers multiplicative

3. **Combat Example**
   - **Elite Platoon**: 200 troops, Elite (2.5x), Plasma (1.6x), 100% (1.0x) = **800 strength**
   - **Basic Platoon**: 100 troops, Basic (1.0x), Rifle (1.0x), 50% (0.5x) = **50 strength**
   - Elite platoon is 16× stronger than basic half-trained platoon

### Platoon Lifecycle

1. **Commission**
   - Validate: Credits, Population (troops), Platoon limit (24)
   - Deduct cost from planet resources
   - Draft troops from planet population
   - Create platoon entity (State = UnderConstruction)
   - Begin training (if at Starbase)
   - Add to platoon roster

2. **Training**
   - Execute during Income Phase (each turn)
   - Increment TrainingLevel by 10% per turn
   - Complete at 100% (State = Active)
   - Display training progress: "Platoon 01: 60% trained"

3. **Deployment**
   - Embark onto Battle Cruiser (max 4 per ship)
   - Transport to target planet
   - Disembark for garrison or invasion
   - Participate in ground combat

4. **Decommission**
   - Player decision to disband platoon
   - Equipment cannot be sold back (design decision)
   - Troops return to civilian population
   - Remove from platoon roster
   - Strategic use: Redistribute forces, cut costs

### Platoon Management UI

1. **Platoon Roster**
   - List all platoons (max 24)
   - Display columns:
     - Name (e.g., "Platoon 01 (150 troops)")
     - Equipment (Civilian / Basic / Standard / Advanced / Elite)
     - Weapon (Pistol / Rifle / Assault / Plasma)
     - Training (0-100%)
     - Location (Planet name or "Aboard USCS Cruiser 02")
     - Strength (calculated military power)
   - Sort by: Strength, Training, Location
   - Filter by: All, Training, Deployed, Garrisoned

2. **Commission Panel**
   - Troop count slider: 1-200
   - Equipment dropdown: Civilian → Elite
   - Weapon dropdown: Pistol → Plasma
   - Cost preview: "Total: 73,000 Credits"
   - Strength preview: "Est. Strength: 150 (at 100% training)"
   - Commission button (validates resources, limit)

3. **Training Progress**
   - Progress bar: 0-100%
   - ETA: "6 turns remaining"
   - Deploy early button: "Deploy Now (60% trained)"
   - Warning: "Partially trained platoons are less effective!"

---

## Acceptance Criteria

### Functional Criteria

- [ ] Platoons created with 1-200 troops
- [ ] Equipment levels (Civilian to Elite) apply correct modifiers
- [ ] Weapon levels (Pistol to Plasma) apply correct modifiers
- [ ] Training progresses 10%/turn at Starbase
- [ ] Training completes at 100% after 10 turns
- [ ] Military strength formula calculates correctly
- [ ] Platoon limit (24) enforced
- [ ] Decommissioning returns troops to population
- [ ] Platoons can embark/disembark from Battle Cruisers
- [ ] Platoon roster displays all platoons with correct info

### Performance Criteria

- [ ] Platoon creation executes in <50ms
- [ ] Training updates execute in <100ms per turn
- [ ] Strength calculations execute in <1ms

### Integration Criteria

- [ ] Integrates with Entity System (AFS-031) for platoon entities
- [ ] Uses Craft System (AFS-032) for Battle Cruiser transport
- [ ] Uses Population System (AFS-023) for troop recruitment
- [ ] Provides strength to Combat System (AFS-041)
- [ ] Triggered by Turn System (AFS-002) for training updates

---

## Technical Notes

### Implementation Approach

```csharp
public class PlatoonSystem : MonoBehaviour
{
    private static PlatoonSystem _instance;
    public static PlatoonSystem Instance => _instance;

    public event Action<int> OnPlatoonCommissioned; // platoonID
    public event Action<int> OnPlatoonDecommissioned; // platoonID
    public event Action<int, int> OnTrainingProgress; // platoonID, newTrainingLevel

    // Commission new platoon
    public int CommissionPlatoon(int troops, EquipmentLevel equipment, WeaponLevel weapon, int planetID, FactionType owner)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
        {
            Debug.LogError("Invalid planet!");
            return -1;
        }

        // Validate platoon limit
        if (!EntitySystem.Instance.CanCreatePlatoon())
        {
            UIManager.Instance.ShowError("Platoon limit reached (24/24)!");
            return -1;
        }

        // Calculate cost
        var cost = GetPlatoonCost(equipment, weapon);

        // Validate resources
        if (!ResourceSystem.Instance.CanAfford(planetID, cost))
        {
            UIManager.Instance.ShowError("Insufficient Credits!");
            return -1;
        }

        // Validate population (troop count)
        if (planet.Population < troops)
        {
            UIManager.Instance.ShowError($"Insufficient population! Need {troops} people.");
            return -1;
        }

        // Deduct cost
        ResourceSystem.Instance.RemoveResources(planetID, cost);

        // Draft troops from population
        planet.Population -= troops;

        // Create platoon
        int platoonID = EntitySystem.Instance.CreatePlatoon(troops, equipment, weapon, planetID, owner);

        var platoon = GameStateManager.Instance.GetPlatoonByID(platoonID);
        platoon.TrainingLevel = 0;
        platoon.State = EntityState.UnderConstruction;

        OnPlatoonCommissioned?.Invoke(platoonID);
        Debug.Log($"Commissioned {platoon.Name} with {troops} troops, {equipment} armor, {weapon} weapons for {cost.Credits} Credits");

        return platoonID;
    }

    // Decommission platoon (disband, return troops)
    public void DecommissionPlatoon(int platoonID)
    {
        var platoon = GameStateManager.Instance.GetPlatoonByID(platoonID);
        if (platoon == null)
            return;

        var planet = GameStateManager.Instance.GetPlanetByID(platoon.LocationPlanetID);
        if (planet == null)
        {
            UIManager.Instance.ShowError("Platoon must be at planet to decommission!");
            return;
        }

        // Return troops to population
        planet.Population += platoon.Troops;

        // Equipment is NOT refunded (design decision)

        // Destroy platoon
        EntitySystem.Instance.DestroyPlatoon(platoonID);

        OnPlatoonDecommissioned?.Invoke(platoonID);
        Debug.Log($"Decommissioned {platoon.Name}, returned {platoon.Troops} troops to {planet.Name}");
    }

    // Update training for all platoons (called each turn)
    public void UpdateTraining()
    {
        var starbase = GameStateManager.Instance.GetPlanets(FactionType.Player)
            .FirstOrDefault(p => p.Name == "Starbase");

        if (starbase == null)
            return;

        var platoons = GameStateManager.Instance.GetPlatoonsAtPlanet(starbase.ID);

        foreach (var platoon in platoons)
        {
            if (platoon.State == EntityState.UnderConstruction && platoon.TrainingLevel < 100)
            {
                // Train at 10% per turn
                platoon.TrainingLevel = Mathf.Min(100, platoon.TrainingLevel + 10);

                OnTrainingProgress?.Invoke(platoon.ID, platoon.TrainingLevel);

                if (platoon.TrainingLevel >= 100)
                {
                    // Training complete
                    platoon.State = EntityState.Active;
                    UIManager.Instance.ShowMessage($"{platoon.Name} training complete! 100% combat ready.");
                    Debug.Log($"{platoon.Name} training complete (100%)");
                }
                else
                {
                    Debug.Log($"{platoon.Name} training progress: {platoon.TrainingLevel}%");
                }
            }
        }
    }

    // Get platoon cost
    private ResourceCost GetPlatoonCost(EquipmentLevel equipment, WeaponLevel weapon)
    {
        int equipmentCost = GetEquipmentCost(equipment);
        int weaponCost = GetWeaponCost(weapon);

        return new ResourceCost
        {
            Credits = equipmentCost + weaponCost
        };
    }

    private int GetEquipmentCost(EquipmentLevel equipment)
    {
        switch (equipment)
        {
            case EquipmentLevel.Civilian: return 20000;
            case EquipmentLevel.Basic: return 35000;
            case EquipmentLevel.Standard: return 55000;
            case EquipmentLevel.Advanced: return 80000;
            case EquipmentLevel.Elite: return 109000;
            default: return 0;
        }
    }

    private int GetWeaponCost(WeaponLevel weapon)
    {
        switch (weapon)
        {
            case WeaponLevel.Pistol: return 5000;
            case WeaponLevel.Rifle: return 10000;
            case WeaponLevel.AssaultRifle: return 18000;
            case WeaponLevel.Plasma: return 30000;
            default: return 0;
        }
    }

    // Get estimated strength for preview
    public int GetEstimatedStrength(int troops, EquipmentLevel equipment, WeaponLevel weapon, int trainingLevel)
    {
        float equipmentMod = GetEquipmentModifier(equipment);
        float weaponMod = GetWeaponModifier(weapon);
        float trainingMod = trainingLevel / 100f;

        return Mathf.FloorToInt(troops * equipmentMod * weaponMod * trainingMod);
    }

    private float GetEquipmentModifier(EquipmentLevel equipment)
    {
        switch (equipment)
        {
            case EquipmentLevel.Civilian: return 0.5f;
            case EquipmentLevel.Basic: return 1.0f;
            case EquipmentLevel.Standard: return 1.5f;
            case EquipmentLevel.Advanced: return 2.0f;
            case EquipmentLevel.Elite: return 2.5f;
            default: return 1.0f;
        }
    }

    private float GetWeaponModifier(WeaponLevel weapon)
    {
        switch (weapon)
        {
            case WeaponLevel.Pistol: return 0.8f;
            case WeaponLevel.Rifle: return 1.0f;
            case WeaponLevel.AssaultRifle: return 1.3f;
            case WeaponLevel.Plasma: return 1.6f;
            default: return 1.0f;
        }
    }
}
```

### Equipment Cost Summary

**Body Armor:**
| Level | Cost (Credits) | Combat Modifier |
|-------|----------------|-----------------|
| Civilian | 20,000 | 0.5x |
| Basic | 35,000 | 1.0x |
| Standard | 55,000 | 1.5x |
| Advanced | 80,000 | 2.0x |
| Elite | 109,000 | 2.5x |

**Weapons:**
| Level | Cost (Credits) | Combat Modifier |
|-------|----------------|-----------------|
| Pistol | 5,000 | 0.8x |
| Rifle | 10,000 | 1.0x |
| Assault Rifle | 18,000 | 1.3x |
| Plasma | 30,000 | 1.6x |

### Platoon Examples

**Example 1: Basic Infantry**
```
Troops: 100
Equipment: Basic (35,000 Credits, 1.0x)
Weapon: Rifle (10,000 Credits, 1.0x)
Training: 100%

Total Cost: 45,000 Credits
Military Strength: 100 × 1.0 × 1.0 × 1.0 = 100
```

**Example 2: Elite Shock Troops**
```
Troops: 200
Equipment: Elite (109,000 Credits, 2.5x)
Weapon: Plasma (30,000 Credits, 1.6x)
Training: 100%

Total Cost: 139,000 Credits
Military Strength: 200 × 2.5 × 1.6 × 1.0 = 800
```

**Example 3: Half-Trained Militia**
```
Troops: 150
Equipment: Civilian (20,000 Credits, 0.5x)
Weapon: Pistol (5,000 Credits, 0.8x)
Training: 50% (deployed early!)

Total Cost: 25,000 Credits
Military Strength: 150 × 0.5 × 0.8 × 0.5 = 30
```

**Example 4: Cost-Effective Force**
```
Troops: 120
Equipment: Standard (55,000 Credits, 1.5x)
Weapon: Assault Rifle (18,000 Credits, 1.3x)
Training: 100%

Total Cost: 73,000 Credits
Military Strength: 120 × 1.5 × 1.3 × 1.0 = 234
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Platoon storage
- **AFS-031 (Entity System)**: Platoon entity structure
- **AFS-023 (Population System)**: Troop recruitment

### Depended On By
- **AFS-032 (Craft System)**: Platoon transport on Battle Cruisers
- **AFS-041 (Combat System)**: Military strength for battles
- **AFS-002 (Turn System)**: Training updates each turn
- **AFS-071 (UI State Machine)**: Platoon roster UI

### Events Published
- `OnPlatoonCommissioned(int platoonID)`: New platoon created
- `OnPlatoonDecommissioned(int platoonID)`: Platoon disbanded
- `OnTrainingProgress(int platoonID, int newTrainingLevel)`: Training increased

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
