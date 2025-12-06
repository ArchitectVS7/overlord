# AFS-024: Taxation System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-ECON-004

---

## Summary

Player-controlled taxation system that generates Credit income from planetary populations, allows per-planet tax rate adjustment (0-100%), balances revenue against morale impact, and applies Metropolis planet bonuses for enhanced tax efficiency.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Planet tax rate storage
- **AFS-012 (Planet System)**: Planet multipliers (Metropolis bonus)
- **AFS-021 (Resource System)**: Credit income addition
- **AFS-023 (Population System)**: Population count and morale impact

---

## Requirements

### Tax Rate Mechanics

1. **Tax Rate Range**
   - **Range**: 0-100%
   - **Default**: 50% (balanced)
   - **Adjustable**: Player can set per planet
   - **UI Control**: Slider or buttons (±10%, ±1%)
   - **Real-time preview**: Show estimated income and morale impact

2. **Tax Rate Impact on Morale**
   - **High taxes (>75%)**:
     - Morale penalty: -5%/turn
     - Higher income, lower growth
     - Strategic use: Short-term cash injection
   - **Moderate taxes (25-75%)**:
     - Morale: No change
     - Balanced income and growth
     - Default strategy
   - **Low taxes (<25%)**:
     - Morale bonus: +2%/turn
     - Lower income, higher growth
     - Strategic use: Population boom

3. **Tax Rate Persistence**
   - Tax rate saved per planet
   - Persists across save/load
   - Displayed in planet details panel
   - Can change any time during Action Phase

### Tax Revenue Calculation

1. **Base Formula**
   - `TaxRevenue = (Population ÷ 10) × (TaxRate ÷ 100) × PlanetMultiplier`
   - **Examples**:
     - 1,000 population, 50% tax, 1.0x multiplier → (1,000 ÷ 10) × 0.5 × 1.0 = **50 Credits/turn**
     - 5,000 population, 75% tax, 2.0x multiplier → (5,000 ÷ 10) × 0.75 × 2.0 = **750 Credits/turn**

2. **Planet Multipliers**
   - **Metropolis**: 2.0x Credits (urban centers, large economies)
   - **All other types**: 1.0x Credits
   - Multiplier applied after base calculation

3. **Revenue Timing**
   - Calculated during Income Phase (after population growth)
   - Added to planet Credit resources
   - Displayed in income report: "Starbase: +500 Credits (tax, 50%)"

### Tax Rate UI

1. **Planet Details Panel**
   - Current tax rate: "50%" (large display)
   - Slider control: 0-100% (5% increments)
   - Quick buttons: "0%", "25%", "50%", "75%", "100%"
   - Estimated income: "~500 Credits/turn"
   - Morale impact: "No change" (green), "-5%/turn" (red), "+2%/turn" (blue)

2. **Tax Rate Warnings**
   - Yellow warning if tax > 75%: "High taxes will reduce morale!"
   - Green indicator if tax < 25%: "Low taxes will boost morale!"
   - Real-time preview updates as slider moves

3. **Income Breakdown**
   - Population breakdown: "1,000 people"
   - Base income: "100 Credits (before tax)"
   - Tax rate: "50%"
   - Planet multiplier: "2.0x (Metropolis)"
   - **Total**: "100 Credits/turn"

### Strategic Tax Management

1. **Economic Strategy**
   - **High tax colonies**: Metropolis planets for maximum Credits
   - **Low tax colonies**: Growth-focused planets for population boom
   - **Balanced tax**: Most planets at 50% for steady income

2. **Emergency Taxation**
   - Player can raise taxes temporarily for cash injection
   - Example: 100% tax for 1-2 turns to afford critical purchase
   - Risk: Morale tanks, population growth stops

3. **Tax Rate Recommendations** (UI hints)
   - Metropolis: 50-75% (high income, less growth needed)
   - Volcanic/Desert: 25-50% (specialist planets, less population)
   - Tropical: 25-50% (food surplus, encourage growth)

### Tax Revenue Display

1. **Income Report**
   - Per-planet breakdown:
     - "Starbase (Metropolis): +750 Credits (5,000 pop, 75% tax, 2.0x)"
     - "Vulcan Prime: +150 Credits (2,000 pop, 50% tax, 1.0x)"
   - Total tax revenue: "Total: +900 Credits"

2. **Message Log**
   - Turn summary: "Tax revenue: +900 Credits across all colonies"
   - Warning: "Starbase morale declining (high taxes)!"

---

## Acceptance Criteria

### Functional Criteria

- [ ] Tax rate adjustable from 0-100% per planet
- [ ] Tax revenue formula: (Population ÷ 10) × (TaxRate ÷ 100) × Multiplier
- [ ] Metropolis planets give 2x Credits
- [ ] High taxes (>75%) reduce morale by 5%/turn
- [ ] Low taxes (<25%) increase morale by 2%/turn
- [ ] Tax rate persists across save/load
- [ ] Income report displays per-planet tax breakdown
- [ ] UI warns player of high tax morale impact

### Performance Criteria

- [ ] Tax calculations complete in <50ms per turn
- [ ] UI slider updates smooth (<16ms per frame)
- [ ] Real-time income preview updates instantly

### Integration Criteria

- [ ] Integrates with Game State Manager (AFS-001) for tax rate storage
- [ ] Uses Planet System (AFS-012) for Metropolis multiplier
- [ ] Adds Credits via Resource System (AFS-021)
- [ ] Coordinates with Population System (AFS-023) for morale impact
- [ ] Triggered by Income System (AFS-022) during Income Phase

---

## Technical Notes

### Implementation Approach

```csharp
public class TaxationSystem : MonoBehaviour
{
    private static TaxationSystem _instance;
    public static TaxationSystem Instance => _instance;

    public event Action<int, int> OnTaxRateChanged; // planetID, newTaxRate
    public event Action<int, int> OnTaxRevenueGenerated; // planetID, credits

    // Calculate tax revenue for all player planets
    public void CalculateTaxRevenue()
    {
        var planets = GameStateManager.Instance.GetPlanets(FactionType.Player);

        foreach (var planet in planets)
        {
            if (!planet.Habitable || planet.Population == 0)
                continue;

            int revenue = CalculatePlanetTaxRevenue(planet);
            if (revenue > 0)
            {
                var delta = new ResourceDelta { Credits = revenue };
                ResourceSystem.Instance.AddResources(planet.ID, delta);
                OnTaxRevenueGenerated?.Invoke(planet.ID, revenue);

                Debug.Log($"{planet.Name}: Tax revenue +{revenue} Credits (Pop: {planet.Population}, Rate: {planet.TaxRate}%)");
            }
        }
    }

    // Calculate tax revenue for single planet
    private int CalculatePlanetTaxRevenue(PlanetEntity planet)
    {
        // Base income: Population ÷ 10
        int baseIncome = planet.Population / 10;

        // Tax rate multiplier (0-100% → 0.0-1.0)
        float taxMultiplier = planet.TaxRate / 100f;

        // Planet multiplier (Metropolis: 2.0x, Others: 1.0x)
        var multipliers = planet.GetResourceMultipliers();
        float planetMultiplier = multipliers.Credits;

        // Total revenue
        int revenue = Mathf.FloorToInt(baseIncome * taxMultiplier * planetMultiplier);

        return revenue;
    }

    // Set tax rate for planet
    public void SetTaxRate(int planetID, int taxRate)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
        {
            Debug.LogError($"Planet {planetID} not found!");
            return;
        }

        // Clamp tax rate to 0-100%
        taxRate = Mathf.Clamp(taxRate, 0, 100);

        int oldRate = planet.TaxRate;
        planet.TaxRate = taxRate;

        OnTaxRateChanged?.Invoke(planetID, taxRate);

        // Display morale impact warning
        if (taxRate > 75 && oldRate <= 75)
        {
            UIManager.Instance.ShowWarning($"{planet.Name}: High taxes will reduce morale!");
        }
        else if (taxRate < 25 && oldRate >= 25)
        {
            UIManager.Instance.ShowMessage($"{planet.Name}: Low taxes will boost morale!");
        }

        Debug.Log($"{planet.Name}: Tax rate changed from {oldRate}% to {taxRate}%");
    }

    // Get estimated tax revenue for preview
    public int GetEstimatedRevenue(int planetID, int taxRate)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
            return 0;

        int baseIncome = planet.Population / 10;
        float taxMultiplier = taxRate / 100f;
        var multipliers = planet.GetResourceMultipliers();
        float planetMultiplier = multipliers.Credits;

        return Mathf.FloorToInt(baseIncome * taxMultiplier * planetMultiplier);
    }

    // Get morale impact for tax rate
    public string GetMoraleImpact(int taxRate)
    {
        if (taxRate > 75)
            return "-5%/turn (High taxes)";
        else if (taxRate < 25)
            return "+2%/turn (Low taxes)";
        else
            return "No change";
    }

    // Get recommended tax rate for planet
    public int GetRecommendedTaxRate(PlanetEntity planet)
    {
        if (planet.Type == PlanetType.Metropolis)
            return 75; // High income, morale less critical
        else if (planet.Type == PlanetType.Tropical)
            return 25; // Encourage growth for food production
        else
            return 50; // Balanced
    }
}
```

### Tax UI Controller

```csharp
public class TaxRateUI : MonoBehaviour
{
    [SerializeField] private Slider _taxSlider;
    [SerializeField] private Text _taxRateLabel;
    [SerializeField] private Text _estimatedIncomeLabel;
    [SerializeField] private Text _moraleImpactLabel;
    [SerializeField] private Button _btnQuickTax0;
    [SerializeField] private Button _btnQuickTax25;
    [SerializeField] private Button _btnQuickTax50;
    [SerializeField] private Button _btnQuickTax75;
    [SerializeField] private Button _btnQuickTax100;

    private int _currentPlanetID;

    private void Start()
    {
        _taxSlider.onValueChanged.AddListener(OnTaxSliderChanged);
        _btnQuickTax0.onClick.AddListener(() => SetQuickTax(0));
        _btnQuickTax25.onClick.AddListener(() => SetQuickTax(25));
        _btnQuickTax50.onClick.AddListener(() => SetQuickTax(50));
        _btnQuickTax75.onClick.AddListener(() => SetQuickTax(75));
        _btnQuickTax100.onClick.AddListener(() => SetQuickTax(100));
    }

    public void ShowForPlanet(int planetID)
    {
        _currentPlanetID = planetID;
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);

        if (planet == null)
            return;

        // Set slider value (without triggering event)
        _taxSlider.SetValueWithoutNotify(planet.TaxRate);

        UpdatePreview(planet.TaxRate);
    }

    private void OnTaxSliderChanged(float value)
    {
        int taxRate = Mathf.RoundToInt(value);
        UpdatePreview(taxRate);

        // Apply to planet (real-time)
        TaxationSystem.Instance.SetTaxRate(_currentPlanetID, taxRate);
    }

    private void SetQuickTax(int taxRate)
    {
        _taxSlider.value = taxRate;
        // OnTaxSliderChanged will handle the rest
    }

    private void UpdatePreview(int taxRate)
    {
        _taxRateLabel.text = $"{taxRate}%";

        int estimatedIncome = TaxationSystem.Instance.GetEstimatedRevenue(_currentPlanetID, taxRate);
        _estimatedIncomeLabel.text = $"~{estimatedIncome} Credits/turn";

        string moraleImpact = TaxationSystem.Instance.GetMoraleImpact(taxRate);
        _moraleImpactLabel.text = $"Morale: {moraleImpact}";

        // Color-code morale impact
        if (taxRate > 75)
            _moraleImpactLabel.color = Color.red;
        else if (taxRate < 25)
            _moraleImpactLabel.color = Color.cyan;
        else
            _moraleImpactLabel.color = Color.white;
    }
}
```

### Tax Revenue Examples

**Example 1: Metropolis (High Income)**
```
Planet: "Starbase"
Type: Metropolis (2.0x Credits)
Population: 5,000
Tax Rate: 75%

Revenue Calculation:
  Base Income = 5,000 ÷ 10 = 500
  Tax Multiplier = 75 ÷ 100 = 0.75
  Planet Multiplier = 2.0 (Metropolis)
  Revenue = 500 × 0.75 × 2.0 = 750 Credits/turn

Morale Impact: -5%/turn (high taxes)
Strategy: High income, accept morale penalty
```

**Example 2: Volcanic (Specialist, Lower Population)**
```
Planet: "Vulcan Prime"
Type: Volcanic (1.0x Credits)
Population: 2,000
Tax Rate: 50%

Revenue Calculation:
  Base Income = 2,000 ÷ 10 = 200
  Tax Multiplier = 0.5
  Planet Multiplier = 1.0
  Revenue = 200 × 0.5 × 1.0 = 100 Credits/turn

Morale Impact: No change
Strategy: Balanced, specialist mining planet
```

**Example 3: Tropical (Growth-Focused)**
```
Planet: "Paradise"
Type: Tropical (1.0x Credits)
Population: 3,000
Tax Rate: 20% (low)

Revenue Calculation:
  Base Income = 3,000 ÷ 10 = 300
  Tax Multiplier = 0.2
  Planet Multiplier = 1.0
  Revenue = 300 × 0.2 × 1.0 = 60 Credits/turn

Morale Impact: +2%/turn (low taxes)
Strategy: Encourage population growth for food production
```

**Example 4: Emergency Taxation**
```
Planet: "Starbase"
Type: Metropolis (2.0x)
Population: 10,000
Tax Rate: 100% (emergency!)

Revenue Calculation:
  Base Income = 10,000 ÷ 10 = 1,000
  Tax Multiplier = 1.0
  Planet Multiplier = 2.0
  Revenue = 1,000 × 1.0 × 2.0 = 2,000 Credits/turn

Morale Impact: -5%/turn (high taxes)
Strategy: Short-term cash injection for critical purchase
Risk: Morale crash, population growth stops
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Tax rate storage
- **AFS-012 (Planet System)**: Metropolis multiplier
- **AFS-021 (Resource System)**: Credit income addition
- **AFS-023 (Population System)**: Population count and morale

### Depended On By
- **AFS-002 (Turn System)**: Tax revenue during Income Phase
- **AFS-022 (Income System)**: Tax revenue after resource production
- **AFS-071 (UI State Machine)**: Tax rate UI panel

### Events Published
- `OnTaxRateChanged(int planetID, int newTaxRate)`: Tax rate adjusted
- `OnTaxRevenueGenerated(int planetID, int credits)`: Tax revenue calculated

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
