# Overlord - UX Design Specification

**Version:** 1.0
**Date:** 2025-12-08
**Status:** Draft
**Owner:** Lead Designer

---

## Table of Contents

1. [User Flows](#user-flows)
2. [Screen Wireframes](#screen-wireframes)
3. [Mobile Interaction Patterns](#mobile-interaction-patterns)
4. [Accessibility Specifications](#accessibility-specifications)
5. [Responsive Design System](#responsive-design-system)
6. [Design Tokens](#design-tokens)

---

## User Flows

### 1. New Game Flow

```
Start Screen
    ↓ [Click "New Game"]
Game Setup Screen
    ├─ Select Difficulty (Easy/Normal/Hard)
    ├─ Set Player Name
    └─ [Click "Start"]
        ↓
Tutorial Welcome (if first time)
    ├─ [Skip Tutorial] → Galaxy Map
    └─ [Begin Tutorial] → Mission 1
        ↓
Galaxy Map (Main View)
    ├─ Tutorial overlays guide initial actions
    └─ Free play after tutorial complete
```

**Key Interactions:**
- Back button available at all stages before "Start"
- Settings accessible from Start Screen
- Tutorial can be disabled in Settings

### 2. Expand Territory Flow

```
Galaxy Map
    ↓ [Click Planet Icon]
Planet Quick Info Popup
    ├─ Name, Owner, Resources
    └─ [Click "View Details"]
        ↓
Planet Surface Screen
    ├─ View 6 platform slots
    ├─ [Click Platform] → Building Options
    └─ [Click "Buy Screen" tab]
        ↓
Buy Screen
    ├─ Select "Atmosphere Processor"
    ├─ Cost: 200,000 Credits
    └─ [Click "Purchase"]
        ↓
Construction Queue
    ├─ 8 turns remaining
    └─ [End Turn] × 8
        ↓
Cargo Bay Screen
    ├─ Atmosphere Processor complete
    ├─ [Assign Crew] (not required)
    └─ [Click "Launch"]
        ↓
Navigation Screen
    ├─ Select neutral planet destination
    ├─ ETA: 3 days
    └─ [Launch Journey]
        ↓
[End Turn] × 3
    ↓
Automatic Terraforming Begins
    ├─ 3-8 turns based on planet size
    └─ [End Turn] × terraforming duration
        ↓
Notification: "Planet [Name] Colonized!"
    ↓
Galaxy Map (updated with new colony)
```

**Decision Points:**
- Which neutral planet to terraform (strategic choice based on type bonuses)
- When to purchase Atmosphere Processor (save Credits first)
- Whether to build production buildings on new colony immediately

### 3. Combat Flow

```
Galaxy Map
    ↓ [Navigate Battle Cruiser to enemy planet]
Combat Initiation
    ├─ Force comparison displayed
    └─ [Automatically enters Combat Control Screen]
        ↓
Combat Control Screen
    ├─ Turn 1: Select action
    │   ├─ Continue Battle (default)
    │   ├─ Orbital Bombardment (if available)
    │   └─ Retreat
    ├─ [Execute Action]
    └─ Combat resolves turn-by-turn
        ↓
Victory/Defeat Screen
    ├─ Victory: Planet captured
    │   ├─ Casualties displayed
    │   └─ [Continue] → Galaxy Map (planet now player-owned)
    └─ Defeat: Forces retreat
        ├─ Casualties displayed
        └─ [Return to Galaxy Map]
```

**Combat Strategies:**
- Use bombardment early to weaken enemy (3-turn cooldown)
- Retreat if losing badly to preserve platoons
- Upgrade equipment/weapons before assault for better chances

### 4. Resource Management Flow

```
Galaxy Map
    ↓ [Click "Government" button]
Government Screen
    ├─ View all 5 resources (Credits, Minerals, Fuel, Food, Energy)
    ├─ View income/turn for each
    ├─ Adjust tax rate (10-50%)
    └─ View population morale
        ↓
[Identify low resources]
    ↓
Planet Surface Screen
    ├─ Build Mining Station (+Minerals, +Fuel)
    ├─ Build Horticultural Station (+Food)
    └─ Build Solar Satellite (+Energy)
        ↓
[Wait for construction]
    ↓
[Toggle buildings ON]
    ↓
Government Screen (verify income increased)
```

**Optimization Loop:**
- Monitor resource stockpiles (aim for >500 of each)
- Build production stations on planets with type bonuses
- Adjust tax rate to balance Credits vs. morale

### 5. Military Buildup Flow

```
Government Screen
    ↓ [Check Credits ≥ 45,000]
Platoon Management Screen
    ↓ [Click "Commission New Platoon"]
Commission Dialog
    ├─ Set troop count (1-200)
    ├─ Set equipment level (1-10)
    ├─ Set weapons level (1-10)
    └─ [Confirm] (Cost displayed)
        ↓
Construction Queue (4 turns)
    ↓ [End Turn] × 4
Platoon Complete
    ↓ [Assign to Battle Cruiser]
Cargo Bay Screen
    ├─ Load platoon onto Battle Cruiser
    └─ [Launch] → Combat Flow
```

**Strategic Considerations:**
- Commission multiple platoons early game (3-4 recommended)
- Upgrade equipment/weapons to Level 2-3 before first assault
- Keep 2-3 platoons garrisoned for defense

---

## Screen Wireframes

### 1. Galaxy View

```
┌──────────────────────────────────────────────────────────────┐
│  [≡ Menu]  Overlord              Turn: 15  [End Turn]        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│                        ⭐ [Starbase]                          │
│                       (Player Home)                           │
│                                                               │
│         🌋 [Volcanic]                    🏜️ [Desert]         │
│         (Neutral)                       (Neutral)             │
│                                                               │
│                   🔴 [Hitotsu]                                │
│                  (Enemy Home)                                 │
│                                                               │
│    🌴 [Tropical]                    🌋 [Volcanic 2]          │
│    (Neutral)                        (Player Controlled)       │
│                                                               │
│  Legend:                                                      │
│  ⭐ = Player Home    🔴 = Enemy    ⚪ = Neutral               │
│  🚀 = Spacecraft (hover for details)                          │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│ [Government] [Buy] [Navigation] [Platoons] [Settings] [Help] │
└──────────────────────────────────────────────────────────────┘
```

**Interaction Zones:**
- **Planet Icons:** Click to select, double-click for Planet Surface screen
- **Spacecraft Icons:** Click to select, right-click for quick actions
- **Zoom Controls:** Mouse wheel or pinch gesture (mobile)
- **Pan:** Click-drag or two-finger drag (mobile)
- **Quick Info:** Hover over planet/craft for tooltip

**Visual Hierarchy:**
- Player-controlled planets highlighted in blue
- Enemy planets highlighted in red
- Neutral planets in gray
- Turn counter and End Turn button prominently placed

### 2. Government Screen

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]  Government Screen                   Turn: 15      │
├──────────────────────────────────────────────────────────────┤
│  RESOURCE SUMMARY                                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Credits:   45,000   (+5,000/turn)  💰                   │ │
│  │ Minerals:  1,200    (+150/turn)    ⛏️                    │ │
│  │ Fuel:      800      (+75/turn)     ⛽                    │ │
│  │ Food:      2,500    (+200/turn)    🌾                    │ │
│  │ Energy:    650      (+100/turn)    ⚡                    │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  TAXATION & MORALE                                           │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Tax Rate:  [████░░░░░░] 20%        [−] [+]             │ │
│  │ Morale:    [████████░░] 80% (Happy) 😊                  │ │
│  │                                                          │ │
│  │ Population: 1,500 civilians                              │ │
│  │ Tax Income: +5,000 Credits/turn                          │ │
│  │                                                          │ │
│  │ ⚠️ Higher tax reduces morale                             │ │
│  │ ⚠️ Low morale (<30%) causes production penalties         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  PLANET SUMMARY (3 controlled)                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Starbase (Metropolis) - Home Planet                      │ │
│  │   Population: 1,500  |  Income: +3,500 Cr/turn          │ │
│  │                                                          │ │
│  │ Desert Colony - Colonized Turn 8                         │ │
│  │   Population: 100    |  Income: +1,000 Cr/turn          │ │
│  │                                                          │ │
│  │ Volcanic 2 - Captured Turn 14                            │ │
│  │   Population: 250    |  Income: +500 Cr/turn (damaged)  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│ [Close]                                                       │
└──────────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Resource Bars:** Visual bars show current/max, green if >1,000, yellow if 500-1,000, red if <500
- **Tax Slider:** +/− buttons or drag slider to adjust 10-50%
- **Morale Indicator:** Emoji changes based on morale level
- **Planet Cards:** Click to navigate to Planet Surface screen

### 3. Buy Screen

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]  Buy Screen                        Credits: 45,000 │
├──────────────────────────────────────────────────────────────┤
│  [Spacecraft] [Buildings] [Upgrades] [Platoons]              │
├──────────────────────────────────────────────────────────────┤
│  SPACECRAFT                                                   │
│  ┌──────────────────────────────────┐                        │
│  │  🚀 Battle Cruiser                                        │
│  │  150,000 Credits | 5 turns                                │
│  │  • Carries 4 platoons                                     │
│  │  • 20 crew required                                       │
│  │  • 10 Fuel/day consumption                                │
│  │                                                            │
│  │  [Purchase] [View Details]                                │
│  └──────────────────────────────────┘                        │
│  ┌──────────────────────────────────┐                        │
│  │  📦 Cargo Cruiser                                         │
│  │  100,000 Credits | 3 turns                                │
│  │  • Carries 4,000 cargo units                              │
│  │  • 15 crew required                                       │
│  │  • 8 Fuel/day consumption                                 │
│  │                                                            │
│  │  [Purchase] [View Details]                                │
│  └──────────────────────────────────┘                        │
│  ┌──────────────────────────────────┐                        │
│  │  🌐 Atmosphere Processor                                  │
│  │  200,000 Credits | 8 turns                                │
│  │  • Single-use terraforming                                │
│  │  • No crew required                                       │
│  │  • Maximum 1 owned                                        │
│  │                                                            │
│  │  [Purchase] [View Details]  ⚠️ Already own 1              │
│  └──────────────────────────────────┘                        │
│                                                               │
│  (Scroll for more items...)                                  │
├──────────────────────────────────────────────────────────────┤
│ [Close]                                                       │
└──────────────────────────────────────────────────────────────┘
```

**Purchase Flow:**
1. User selects tab (Spacecraft/Buildings/Upgrades/Platoons)
2. User clicks [Purchase] on desired item
3. Confirmation dialog displays cost and build time
4. User confirms, Credits deducted, item added to construction queue
5. Queue displays "X turns remaining" during construction

**Visual Feedback:**
- Grayed out [Purchase] button if insufficient Credits
- Warning icon if maximum owned (e.g., Atmosphere Processor)
- [View Details] expands card to show full specifications

### 4. Navigation Screen

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]  Navigation                          Turn: 15      │
├──────────────────────────────────────────────────────────────┤
│  SPACECRAFT SELECTION                                         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ ○ BC-01 (Battle Cruiser) - Starbase Orbit               │ │
│  │   Crew: 20/20 ✓  |  Fuel: 180/200 ⚠                     │ │
│  │   Platoons: 3/4  |  Ready to launch                      │ │
│  │                                                          │ │
│  │ ○ CC-01 (Cargo Cruiser) - Starbase Docking Bay          │ │
│  │   Crew: 15/15 ✓  |  Fuel: 200/200 ✓                     │ │
│  │   Cargo: 2,500/4,000  |  Ready to launch                │ │
│  │                                                          │ │
│  │ ● BC-02 (Battle Cruiser) - TRAVELING                    │ │
│  │   Destination: Hitotsu  |  ETA: 2 days                  │ │
│  │   [Abort Journey]                                        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  DESTINATION (Select planet)                                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ ○ Volcanic Planet    (5 days)   50 Fuel required        │ │
│  │ ○ Desert Planet      (3 days)   30 Fuel required        │ │
│  │ ● Hitotsu (Enemy)    (7 days)   70 Fuel required        │ │
│  │ ○ Tropical Planet    (4 days)   40 Fuel required        │ │
│  │ ○ Starbase           (0 days)   0 Fuel (return home)    │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  JOURNEY SUMMARY                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ From: Starbase                                           │ │
│  │ To: Hitotsu (Enemy planet)                               │ │
│  │                                                          │ │
│  │ Distance: 7 days                                         │ │
│  │ Fuel Required: 70 Fuel                                   │ │
│  │ Fuel Available: 180 Fuel ✓                               │ │
│  │                                                          │ │
│  │ ⚠️ Combat will begin upon arrival                        │ │
│  │                                                          │ │
│  │ [Launch Journey] [Cancel]                                │ │
│  └─────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────┤
│ [Close]                                                       │
└──────────────────────────────────────────────────────────────┘
```

**Navigation Steps:**
1. Select spacecraft (must be in Starbase orbit/docking bay)
2. Select destination planet
3. Journey summary calculates ETA and fuel cost
4. [Launch Journey] button enabled if sufficient fuel
5. Confirmation dialog displays final details
6. Craft state → Traveling, advances each turn until arrival

**Validation:**
- Cannot launch if crew < minimum required
- Cannot launch if fuel < journey cost
- Cannot launch if spacecraft already traveling
- Warning displayed if destination is enemy planet (combat warning)

### 5. Platoon Management Screen

*(Detailed in AFS-076, condensed wireframe:)*

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]  Platoon Management              Platoons: 8/24    │
├──────────────────────────────────────────────────────────────┤
│  PLATOON ROSTER                │  PLATOON DETAILS             │
│  ┌──────────────────────────┐  │  ┌───────────────────────┐ │
│  │ ☑ Platoon 01              │  │  │ Platoon 03            │ │
│  │   150 troops, 100% trained│  │  │ ─────────────────     │ │
│  │                           │  │  │ Troops: 175           │ │
│  │ ☑ Platoon 02              │  │  │ Training: 100%        │ │
│  │   200 troops, 95% trained │  │  │ Equipment: Level 2    │ │
│  │                           │  │  │ Weapons: Level 3      │ │
│  │ ☐ Platoon 03              │  │  │ Location: Starbase    │ │
│  │   175 troops, 100% trained│  │  │                       │ │
│  │                           │  │  │ Combat Strength: 787  │ │
│  │ [+ Commission New]        │  │  │                       │ │
│  └──────────────────────────┘  │  │ [Upgrade Equipment]   │ │
│                                │  │ [Upgrade Weapons]     │ │
│                                │  │ [Assign to BC]        │ │
│                                │  └───────────────────────┘ │
├──────────────────────────────────────────────────────────────┤
│ [Close]                                                       │
└──────────────────────────────────────────────────────────────┘
```

### 6. Cargo Bay Screen

*(Detailed in AFS-077, condensed wireframe:)*

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]  Cargo Bay - Starbase            Docking: 3/3      │
├──────────────────────────────────────────────────────────────┤
│  DOCKED CRAFT     │  CRAFT DETAILS      │  PLANET RESOURCES  │
│  ┌─────────────┐  │  ┌───────────────┐  │  ┌──────────────┐ │
│  │ ☐ BC-01     │  │  │ BC-01         │  │  │ Food: 2,500  │ │
│  │   3/4 plat. │  │  │ Battle Cruiser│  │  │ Minerals: 1,200│
│  │             │  │  │ ───────────── │  │  │ Fuel: 800    │ │
│  │ ☑ CC-01     │  │  │ Crew: 20/20 ✓ │  │  │ Energy: 650  │ │
│  │   2,500 cargo│ │  │ Fuel: 180/200 │  │  │              │ │
│  │             │  │  │               │  │  │ GARRISON     │ │
│  │ ☐ CC-02     │  │  │ Platoons (3): │  │  │ Plat. 02     │ │
│  │   Empty     │  │  │ • Plat. 01    │  │  │ Plat. 05     │ │
│  └─────────────┘  │  │ • Plat. 03    │  │  │              │ │
│                   │  │ • Plat. 04    │  │  │ [Load →]     │ │
│                   │  │               │  │  └──────────────┘ │
│                   │  │ [Unload Plat.]│  │                   │
│                   │  │ [Load Plat.]  │  │                   │
│                   │  │ [Launch]      │  │                   │
│                   │  └───────────────┘  │                   │
├──────────────────────────────────────────────────────────────┤
│ [Close]                                                       │
└──────────────────────────────────────────────────────────────┘
```

### 7. Planet Surface Screen

*(Detailed in AFS-078, condensed wireframe:)*

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]  Planet: Starbase (Metropolis)      Turn: 15      │
├──────────────────────────────────────────────────────────────┤
│  3D PLANET VIEW       │  SURFACE PLATFORMS │ BUILDING DETAILS│
│  ┌─────────────────┐  │  ┌──────────────┐  │ ┌────────────┐ │
│  │                 │  │  │ 1: [MINE] ⚡ │  │ │ Mining Stn │ │
│  │      🌍         │  │  │ +150 Min/turn│  │ │ ────────── │ │
│  │   (rotating)    │  │  │              │  │ │ Status: ON │ │
│  │                 │  │  │ 2: [HORT] ⚡ │  │ │ Output:    │ │
│  │  [1] [2] [3]    │  │  │ +200 Food/tn │  │ │  150 Min/t │ │
│  │  [4] [5] [6]    │  │  │              │  │ │  75 Fuel/t │ │
│  │                 │  │  │ 3: [SOLAR] ⚡│  │ │            │ │
│  │ [Zoom +/−]      │  │  │ +100 Energy  │  │ │ [Toggle OFF│ │
│  └─────────────────┘  │  │              │  │ │ [Demolish] │ │
│                       │  │ 4: [EMPTY] ⚪│  │ └────────────┘ │
│                       │  │ Available    │  │                │
│                       │  │              │  │                │
│                       │  │ 5: [LAB] 🔬  │  │                │
│                       │  │ +Tech prog   │  │                │
│                       │  │              │  │                │
│                       │  │ 6: [FACT] 🏭 │  │                │
│                       │  │ +Production  │  │                │
│                       │  └──────────────┘  │                │
├──────────────────────────────────────────────────────────────┤
│ [Build] [Demolish] [Close]                                   │
└──────────────────────────────────────────────────────────────┘
```

### 8. Combat Control Screen

*(Detailed in AFS-079, condensed wireframe:)*

```
┌──────────────────────────────────────────────────────────────┐
│  PLANETARY ASSAULT: Hitotsu   │  Turn: 3/10  │ Status: Active│
├──────────────────────────────────────────────────────────────┤
│  Player: 450 troops (1,350 STR)  │  Enemy: 350 troops (1,050)│
│  Advantage: PLAYER (+28%)                                     │
├──────────────────────────────────────────────────────────────┤
│  ACTIONS       │  COMBAT VIZ        │  COMBAT LOG             │
│  ┌──────────┐  │  ┌──────────────┐  │  ┌──────────────────┐  │
│  │ ○ Continue│  │  │   ⚔️ BATTLE  │  │  │ Turn 1:          │  │
│  │ ○ Bombard │  │  │              │  │  │  Player attacks  │  │
│  │ ○ Retreat │  │  │ 🔫 [Player]  │  │  │  for 45 dmg      │  │
│  │           │  │  │      ↓↓↓     │  │  │                  │  │
│  │ [Execute] │  │  │ 💥 [Explosions│  │ │  Enemy retaliates│  │
│  │           │  │  │      ↑↑↑     │  │  │  for 30 dmg      │  │
│  │ Bombard:  │  │  │ 🛡️ [Enemy]   │  │  │                  │  │
│  │ Available │  │  │              │  │  │ Turn 2:          │  │
│  │ -50 troops│  │  │ Player: ████ │  │  │  Bombardment...  │  │
│  │ 3-tn cool.│  │  │ Enemy:  ███  │  │  │                  │  │
│  └──────────┘  │  └──────────────┘  │  └──────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│ AGGRESSION (Player Only):                                     │
│ Cautious [████████░░░░░░░░░░] Aggressive                      │
│ 50% (Balanced) - More strength = more casualties              │
│ [Confirm Engagement]                                          │
├──────────────────────────────────────────────────────────────┤
│ [Battle continues...]                                         │
└──────────────────────────────────────────────────────────────┘
```

**Combat Features:**
- **Aggression Slider (Player Only):** 0-100% (Cautious → Aggressive)
  - Low aggression: 0.8× strength, fewer casualties
  - Balanced (50%): 1.0× strength, normal casualties
  - High aggression: 1.2× strength, more casualties
- **Action Buttons:** Continue (standard attack), Bombard (orbital strike, cooldown), Retreat (save troops, concede planet)
- **Combat Visualization:** Animated battle with force bars showing relative strength
- **Combat Log:** Turn-by-turn text display of actions and damage
- **AI Aggression:** Fixed at 50% (Easy: 30%, Normal: 50%, Hard: 70%)

### 9. Victory/Defeat Screen

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│                      ✅ VICTORY!                              │
│                                                               │
│                   MILITARY VICTORY ACHIEVED                   │
│             You captured all enemy planets and                │
│              eliminated all opposing military forces          │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ STATISTICS                                               │ │
│  │                                                          │ │
│  │ Victory Type: Military Conquest                          │ │
│  │ Total Turns: 42                                          │ │
│  │ Planets Controlled: 6/6                                  │ │
│  │ Enemy Forces Destroyed: 24 platoons                      │ │
│  │ Total Resources Accumulated: 125,000 Credits             │ │
│  │                                                          │ │
│  │ Final Military Strength: 2,400 troops                    │ │
│  │ Casualties: 8 platoons lost (800 troops)                 │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│              [Return to Main Menu]                            │
│              [View Detailed Statistics]                       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Victory Screen Features:**
- Large, celebratory header ("VICTORY!" in gold text)
- Animated confetti/fireworks particle effects
- Statistics summary with key achievements
- Victory music plays (triumphant fanfare)
- [Return to Main Menu] navigates to Start Screen
- [View Detailed Statistics] shows turn-by-turn breakdown

### 10. Save/Load Screen

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]  Save/Load Game               [Sort: Recent ▼]     │
├──────────────────────────────────────────────────────────────┤
│  SAVE SLOTS (10 minimum, expandable):                         │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 1. [AUTOSAVE] ☁️  Turn 42 - Military Victory          │  │
│  │    Dec 8, 2025 10:23 PM    [💾 Save] [🗑️ Delete]      │  │
│  │    [Preview: Starbase with 6 planets controlled]       │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 2. Campaign Playthrough    Turn 38 - In Progress       │  │
│  │    Dec 8, 2025 9:15 PM     [📂 Load] [🗑️ Delete]      │  │
│  │    [Preview: 4/6 planets, building fleet]              │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 3. Hard Difficulty         Turn 25 - In Progress       │  │
│  │    Dec 7, 2025 8:42 PM     [📂 Load] [🗑️ Delete]      │  │
│  │    [Preview: 3/6 planets, defensive position]          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 4. [EMPTY SLOT]                                         │  │
│  │    No save data            [💾 Save to this slot]      │  │
│  │                                                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 5-10: [Additional slots below, scroll to view]         │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│ Cloud Sync: ☁️ Enabled (Last sync: 2 min ago)               │
│ [Refresh Cloud Saves] [Manage Storage]                       │
└──────────────────────────────────────────────────────────────┘
```

**Save/Load Features:**
- **10+ Save Slots:** Minimum 10 (PR FR-CORE-003), expandable to 20 on PC
- **Autosave Slot:** Slot 1 reserved for autosave (created each turn start)
- **Save Metadata:**
  - Turn number and game state (e.g., "Turn 42 - Military Victory")
  - Date and time of save
  - Preview text (planet count, strategic position)
  - Optional: Thumbnail screenshot (64×64 galaxy view snapshot)
- **Cloud Sync Indicator:** ☁️ icon shows cloud save status
  - Green ☁️ = synced
  - Orange ⚠️ = sync pending
  - Red ❌ = sync failed (offline)
- **Actions:**
  - **[Save]**: Overwrite slot with current game state
  - **[Load]**: Load game from slot (with confirmation if unsaved changes)
  - **[Delete]**: Delete save (with confirmation)
  - **[Rename]**: Rename save slot (optional)
- **Sorting:**
  - Recent (default)
  - Turn number (ascending/descending)
  - Alphabetical
- **Quick Save/Load Hotkeys (PC):**
  - F5 = Quick Save (saves to last used slot)
  - F9 = Quick Load (loads from last used slot)

### 11. Pause Menu

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│                         ⏸️ PAUSED                            │
│                                                               │
│                   ┌──────────────────────┐                    │
│                   │                      │                    │
│                   │  [▶️ Resume Game]    │                    │
│                   │                      │                    │
│                   │  [💾 Save Game]      │                    │
│                   │                      │                    │
│                   │  [📂 Load Game]      │                    │
│                   │                      │                    │
│                   │  [⚙️ Settings]        │                    │
│                   │                      │                    │
│                   │  [📖 Help]           │                    │
│                   │                      │                    │
│                   │  [🏠 Main Menu]      │                    │
│                   │                      │                    │
│                   │  [❌ Quit to Desktop]│                    │
│                   │                      │                    │
│                   └──────────────────────┘                    │
│                                                               │
│            (Galaxy View dimmed in background)                 │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Pause Menu Features:**
- **Modal Overlay:** Dims Galaxy View background (z-index: modal layer)
- **Accessible via ESC Key:** From Galaxy View only (AFS-071)
- **Menu Options:**
  1. **Resume Game**: Close pause menu, return to Galaxy View
  2. **Save Game**: Opens Save/Load screen (save mode)
  3. **Load Game**: Opens Save/Load screen (load mode, warns about unsaved changes)
  4. **Settings**: Opens Settings screen (graphics, audio, controls)
  5. **Help**: Opens in-game help/tutorial menu
  6. **Main Menu**: Return to title screen (with "Save before quitting?" confirmation)
  7. **Quit to Desktop**: Exit game (with confirmation)
- **Input:**
  - **ESC Key**: Toggle pause menu (open/close)
  - **Mouse/Touch**: Click buttons
  - **Gamepad**: D-pad navigation, A/B buttons
- **Auto-Pause Triggers:**
  - ESC key pressed during Galaxy View
  - Window loses focus (PC only, optional setting)
  - Home button pressed (mobile)

---

## Mobile Interaction Patterns

### Touch Target Sizes

**Minimum Touch Targets:**
- **iOS:** 44×44 points (minimum per Apple HIG)
- **Android:** 48×48 dp (minimum per Material Design)
- **Recommended:** 60×60 for primary actions (easier tapping)

**Spacing:**
- **Minimum Gap:** 8pt/dp between interactive elements
- **Recommended Gap:** 16pt/dp for closely positioned buttons

### Gesture Controls

#### 1. Galaxy Map Gestures

| Gesture | Action | Visual Feedback |
|---------|--------|-----------------|
| **Tap** | Select planet/craft | Highlight outline |
| **Double-Tap** | Open Planet Surface screen | Zoom animation |
| **Long-Press** | Quick info popup | Tooltip appears |
| **Pinch In** | Zoom out (0.5× min) | Scale animation |
| **Pinch Out** | Zoom in (3× max) | Scale animation |
| **Two-Finger Drag** | Pan camera | Map scrolls |
| **Swipe Left/Right** | Navigate between planets (when selected) | Slide transition |

#### 2. List/Menu Gestures

| Gesture | Action | Visual Feedback |
|---------|--------|-----------------|
| **Tap** | Select item | Highlight background |
| **Long-Press** | Context menu | Popup menu appears |
| **Swipe Left** | Delete/Remove action | Red background reveals |
| **Swipe Right** | Quick action (e.g., Assign) | Green background reveals |
| **Pull-to-Refresh** | Reload data (future feature) | Spinner appears |

#### 3. Slider/Stepper Gestures

| Gesture | Action | Visual Feedback |
|---------|--------|-----------------|
| **Tap +/− Button** | Increment/decrement value | Number updates |
| **Long-Press +/−** | Continuous increment/decrement | Rapid value change |
| **Drag Slider** | Adjust value smoothly | Slider thumb moves |
| **Pinch Slider** | Adjust sensitivity (advanced) | Slider precision changes |

### Responsive Layouts

#### Breakpoints

| Device Type | Width | Layout Mode |
|-------------|-------|-------------|
| Small Phone | <600px | Single column, full-screen dialogs |
| Large Phone | 600-900px | Single/dual column, bottom sheets |
| Tablet | >900px | Multi-column, floating dialogs |

#### Layout Adaptations

**Small Phone (<600px):**
- All panels stack vertically
- Navigation bar at bottom (thumb-reachable)
- Dialogs occupy full screen
- Collapsible sections (accordion expansion)
- Reduced font sizes (12-16pt)

**Tablet (>900px):**
- Side-by-side panels (Roster | Details | Resources)
- Floating dialogs (centered, 60% screen width)
- Persistent navigation bar at top
- Standard font sizes (14-18pt)
- Multi-column grids where appropriate

### Safe Area Handling

**iOS Notch/Dynamic Island:**
```css
/* Top safe area (status bar + notch) */
padding-top: env(safe-area-inset-top);

/* Bottom safe area (home indicator) */
padding-bottom: env(safe-area-inset-bottom);
```

**Android Cutouts:**
- Use `WindowInsets` API to detect cutout regions
- Avoid placing interactive elements in cutout areas
- Center critical content in safe zone

### Haptic Feedback

| Action | Haptic Type | Platforms |
|--------|-------------|-----------|
| Button Tap | Light Impact | iOS, Android |
| Important Confirmation | Medium Impact | iOS, Android |
| Error/Warning | Heavy Impact + Vibration | iOS, Android |
| Success Notification | Success Haptic | iOS only |
| Slider Value Change | Selection Haptic (continuous) | iOS only |

---

## Accessibility Specifications

### 1. Colorblind Modes

**Supported Modes:**
- **Protanopia (Red-Blind):** Red → Orange substitution
- **Deuteranopia (Green-Blind):** Green → Blue substitution
- **Tritanopia (Blue-Blind):** Blue → Purple substitution

**Implementation:**
- Settings option: "Colorblind Mode: [None | Protanopia | Deuteranopia | Tritanopia]"
- Affects UI colors, planet icons, faction colors
- Maintains contrast ratios (WCAG AA minimum)

**Color Palette Alternatives:**

| Standard | Protanopia | Deuteranopia | Tritanopia |
|----------|------------|--------------|------------|
| Red (#FF0000) | Orange (#FF8800) | Orange (#FF8800) | Red (#FF0000) |
| Green (#00FF00) | Blue (#0088FF) | Blue (#0088FF) | Green (#00FF00) |
| Blue (#0000FF) | Blue (#0000FF) | Blue (#0000FF) | Purple (#8800FF) |

### 2. UI Scaling

**Scale Levels:**
- **80%:** Compact mode (more content visible)
- **100%:** Default mode (balanced)
- **120%:** Large mode (improved readability)
- **150%:** Extra-large mode (vision impaired)

**Implementation:**
- Settings option: "UI Scale: [80% | 100% | 120% | 150%]"
- All fonts, icons, and spacing scale proportionally
- Touch targets maintain minimum 44×44pt at all scales
- Layout adapts to prevent overflow

### 3. High Contrast Mode

**Contrast Levels:**
- **Normal:** WCAG AA (4.5:1 text, 3:1 UI elements)
- **High Contrast:** WCAG AAA (7:1 text, 4.5:1 UI elements)

**Implementation:**
- Settings option: "High Contrast Mode: [Off | On]"
- Increases border thickness (1px → 2px)
- Uses pure black/white for maximum contrast
- Removes subtle gradients and shadows

**High Contrast Palette:**
- Background: #000000 (pure black)
- Foreground: #FFFFFF (pure white)
- Primary: #FFFF00 (bright yellow)
- Secondary: #00FFFF (bright cyan)
- Error: #FF0000 (bright red)
- Success: #00FF00 (bright green)

### 4. Screen Reader Support

**Platform APIs:**
- **iOS:** VoiceOver integration via UIAccessibility
- **Android:** TalkBack integration via AccessibilityService

**Accessibility Labels:**
- All interactive elements have descriptive labels
- Images include alt-text descriptions
- Dynamic content announces changes (e.g., "Resources updated")

**Example Labels:**
```swift
// iOS (Swift)
button.accessibilityLabel = "Purchase Battle Cruiser for 150,000 Credits"
button.accessibilityHint = "Adds Battle Cruiser to construction queue, builds in 5 turns"

// Android (Kotlin)
button.contentDescription = "Purchase Battle Cruiser for 150,000 Credits"
```

**Announcement Examples:**
- "Turn 15 complete. Your income this turn: 5,000 Credits, 150 Minerals, 75 Fuel, 200 Food, 100 Energy."
- "Combat victory! Enemy defeated. Hitotsu captured. Casualties: 75 troops lost."
- "Warning: Low fuel. Battle Cruiser BC-01 has 30 fuel remaining. Cannot launch without refueling."

### 5. Keyboard Navigation (PC/Tablet)

**Keyboard Shortcuts:**

| Key | Action |
|-----|--------|
| **Spacebar** | End Turn |
| **Tab** | Cycle through interactive elements |
| **Enter** | Activate selected element |
| **Esc** | Close dialog / Back to previous screen |
| **F1** | Open Help menu |
| **1-9** | Navigate to screen (1=Galaxy Map, 2=Government, etc.) |
| **Arrow Keys** | Navigate map (Galaxy Map only) |
| **+/−** | Zoom in/out (Galaxy Map only) |

**Focus Indicators:**
- Visible focus outline (2px blue border) on keyboard navigation
- Focus order follows logical reading order (top-to-bottom, left-to-right)
- Skip-to-content link for screen readers

### 6. Subtitles and Visual Indicators

**Audio Cues Replacement:**
- **Combat Sounds:** Visual explosion effects + damage numbers
- **Victory Music:** Visual confetti + "VICTORY!" text
- **Notification Sounds:** Visual toast notification + icon
- **Turn Complete Sound:** Visual "Turn 15 → Turn 16" animation

**Settings Option:**
- "Reduce Audio Dependence: [Off | On]"
- Enhances visual feedback when enabled
- Useful for deaf/hard-of-hearing players

---

## Responsive Design System

### Breakpoint Management

```css
/* CSS Media Queries */
@media (max-width: 599px) {
  /* Small Phone */
  .panel-container {
    flex-direction: column;
  }
  .dialog {
    width: 100%;
    height: 100%;
  }
}

@media (min-width: 600px) and (max-width: 899px) {
  /* Large Phone */
  .panel-container {
    flex-direction: column;
  }
  .dialog {
    width: 80%;
    max-width: 600px;
  }
}

@media (min-width: 900px) {
  /* Tablet/Desktop */
  .panel-container {
    flex-direction: row;
  }
  .dialog {
    width: 60%;
    max-width: 800px;
  }
}
```

### Component Scaling

```csharp
// Unity C# Example
public class ResponsiveUIManager : MonoBehaviour {
    enum ScreenSize { SmallPhone, LargePhone, Tablet }
    ScreenSize currentSize;

    void DetectScreenSize() {
        int width = Screen.width;
        if (width < 600) currentSize = ScreenSize.SmallPhone;
        else if (width < 900) currentSize = ScreenSize.LargePhone;
        else currentSize = ScreenSize.Tablet;

        ApplyLayout();
    }

    void ApplyLayout() {
        switch (currentSize) {
            case ScreenSize.SmallPhone:
                panelContainer.flexDirection = Flex.Direction.Column;
                navigationBar.position = Position.Bottom;
                break;
            case ScreenSize.Tablet:
                panelContainer.flexDirection = Flex.Direction.Row;
                navigationBar.position = Position.Top;
                break;
        }
    }
}
```

---

## Design Tokens

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `font-family-primary` | "Roboto", sans-serif | Body text, UI labels |
| `font-family-header` | "Orbitron", monospace | Headers, titles |
| `font-size-xs` | 12px | Small labels, captions |
| `font-size-sm` | 14px | Body text |
| `font-size-md` | 16px | Buttons, inputs |
| `font-size-lg` | 18px | Section headers |
| `font-size-xl` | 24px | Screen titles |
| `font-size-xxl` | 36px | "VICTORY!" header |
| `font-weight-normal` | 400 | Body text |
| `font-weight-bold` | 700 | Buttons, headers |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-xs` | 4px | Tight padding |
| `spacing-sm` | 8px | Default padding |
| `spacing-md` | 16px | Section spacing |
| `spacing-lg` | 24px | Panel spacing |
| `spacing-xl` | 32px | Screen margin |

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `color-primary` | #0077FF | Player-controlled elements |
| `color-secondary` | #FF4400 | Enemy-controlled elements |
| `color-neutral` | #888888 | Neutral elements |
| `color-success` | #00CC66 | Success states, positive actions |
| `color-warning` | #FFAA00 | Warnings, low resources |
| `color-error` | #FF0000 | Errors, critical states |
| `color-background` | #1A1A1A | Dark background |
| `color-surface` | #2A2A2A | Panel backgrounds |
| `color-text-primary` | #FFFFFF | Primary text color |
| `color-text-secondary` | #AAAAAA | Secondary text color |

### Z-Index Layers

*Aligned with AFS-071 Panel Stacking (5 layers):*

| Token | Value | Usage | Canvas Layer |
|-------|-------|-------|--------------|
| `z-index-base` | 0 | 3D Galaxy View, default layer | Layer 0 |
| `z-index-hud` | 100 | Resource bars, turn counter, persistent HUD | Layer 1 |
| `z-index-panel` | 200 | Planet Management, screens, dropdowns | Layer 2 |
| `z-index-modal` | 300 | Modal dialogs, confirmations, tutorial overlays | Layer 3 |
| `z-index-tooltip` | 400 | Tooltips, toast notifications (always on top) | Layer 4 |

---

## Error States & Validation

### Error State Philosophy

**Empathy Over Blame:** Errors are opportunities to GUIDE players, not punish them. Every error message should:
1. **Explain WHAT went wrong** (clear problem statement)
2. **Explain WHY it matters** (context and consequences)
3. **Show HOW to fix it** (actionable next steps)

### Error Dialog Template

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│                      ❌ [ERROR TITLE]                         │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  [CLEAR PROBLEM STATEMENT]                               │ │
│  │                                                          │ │
│  │  Why this matters:                                       │ │
│  │  [CONTEXT EXPLAINING IMPACT]                             │ │
│  │                                                          │ │
│  │  How to fix:                                             │ │
│  │  • [ACTIONABLE STEP 1]                                   │ │
│  │  • [ACTIONABLE STEP 2]                                   │ │
│  │                                                          │ │
│  │                 [Dismiss] [Go to Solution]               │ │
│  │                                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Common Error Scenarios

#### 1. Insufficient Credits

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│              ❌ Insufficient Credits                          │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  You need 150,000 Credits to purchase a Battle Cruiser  │ │
│  │  but only have 45,000 Credits available.                │ │
│  │                                                          │ │
│  │  Why this matters:                                       │ │
│  │  Battle Cruisers are essential for planetary assault    │ │
│  │  and transporting platoons between planets.             │ │
│  │                                                          │ │
│  │  How to earn more Credits:                               │ │
│  │  • Wait 21 turns (+5,000 Credits/turn)                  │ │
│  │  • Increase tax rate in Government Screen               │ │
│  │  • Colonize more planets for income boost               │ │
│  │                                                          │ │
│  │           [Dismiss] [Go to Government Screen]            │ │
│  │                                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Key UX Patterns:**
- Shows exact shortfall (105,000 Credits needed)
- Calculates turns to wait (21 turns × 5,000 = 105,000)
- Offers [Go to Government Screen] quick action button
- Red error color (#FF0000) for icon, neutral text for readability

#### 2. Insufficient Crew

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│              ⚠️ Cannot Launch - Insufficient Crew             │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  Battle Cruiser BC-01 requires 20 crew but currently    │ │
│  │  has 0 crew assigned.                                   │ │
│  │                                                          │ │
│  │  Why this matters:                                       │ │
│  │  Unmanned spacecraft cannot navigate or operate systems.│ │
│  │  Your platoons would be stranded without a crew.        │ │
│  │                                                          │ │
│  │  How to assign crew:                                     │ │
│  │  1. Go to Cargo Bay Screen                              │ │
│  │  2. Select BC-01                                         │ │
│  │  3. Click [Assign Crew] button                          │ │
│  │  4. Transfer 20 civilians from planet population        │ │
│  │                                                          │ │
│  │  Available crew on Starbase: 1,500 civilians ✓          │ │
│  │                                                          │ │
│  │           [Dismiss] [Go to Cargo Bay]                    │ │
│  │                                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Key UX Patterns:**
- Shows available crew (1,500) with checkmark (✓) to reassure player
- Numbered steps for clarity
- Orange warning color (#FFAA00) - serious but fixable

#### 3. Insufficient Fuel

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│              ⛽ Insufficient Fuel for Journey                 │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  Journey to Hitotsu requires 70 Fuel, but BC-01 only    │ │
│  │  has 30 Fuel remaining.                                 │ │
│  │                                                          │ │
│  │  Shortfall: 40 Fuel needed                               │ │
│  │                                                          │ │
│  │  How to refuel:                                          │ │
│  │  1. Return to Starbase (0 Fuel cost)                    │ │
│  │  2. Go to Cargo Bay Screen                              │ │
│  │  3. Transfer Fuel from planet stores (800 available)    │ │
│  │                                                          │ │
│  │  Alternative: Build Mining Stations for +75 Fuel/turn   │ │
│  │                                                          │ │
│  │           [Dismiss] [Return to Starbase]                 │ │
│  │                                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 4. Maximum Limit Reached

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│              ⚠️ Atmosphere Processor Limit Reached            │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  You can only own 1 Atmosphere Processor at a time.     │ │
│  │  Currently owned: 1 (traveling to Volcanic Planet)      │ │
│  │                                                          │ │
│  │  Why this limit exists:                                  │ │
│  │  Atmosphere Processors are single-use terraforming      │ │
│  │  devices. Wait for current processor to complete its    │ │
│  │  mission before purchasing another.                     │ │
│  │                                                          │ │
│  │  Current processor status:                               │ │
│  │  • Destination: Volcanic Planet                          │ │
│  │  • ETA: 2 days                                           │ │
│  │  • Terraforming time: ~5 turns after arrival            │ │
│  │                                                          │ │
│  │  You can purchase another in ~7 turns.                  │ │
│  │                                                          │ │
│  │                    [Dismiss]                             │ │
│  │                                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Key UX Patterns:**
- Shows WHERE the existing item is (traveling to Volcanic Planet)
- Calculates WHEN they can buy another (7 turns)
- Explains WHY the limit exists (single-use device)

#### 5. Construction Queue Full

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│              🏗️ Construction Queue Full                       │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  Your Starbase construction queue is at maximum         │ │
│  │  capacity (5/5 items).                                  │ │
│  │                                                          │ │
│  │  Current queue:                                          │ │
│  │  1. Battle Cruiser (3 turns remaining)                  │ │
│  │  2. Cargo Cruiser (5 turns remaining)                   │ │
│  │  3. Mining Station (2 turns remaining)                  │ │
│  │  4. Platoon 04 (4 turns remaining)                      │ │
│  │  5. Solar Satellite (6 turns remaining)                 │ │
│  │                                                          │ │
│  │  Next available slot: 2 turns (when Mining Stn done)    │ │
│  │                                                          │ │
│  │  Options:                                                │ │
│  │  • Wait 2 turns for a slot to free up                   │ │
│  │  • Cancel an existing queue item (refund 50%)           │ │
│  │                                                          │ │
│  │           [Dismiss] [View Queue]                         │ │
│  │                                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Inline Validation (Prevent Errors Before They Happen)

#### Purchase Button States

**Enabled (Sufficient Credits):**
```
┌──────────────────────────────────┐
│  🚀 Battle Cruiser                │
│  150,000 Credits | 5 turns        │
│                                   │
│  [Purchase]                       │  ← Blue, clickable
└──────────────────────────────────┘
```

**Disabled with Tooltip (Insufficient Credits):**
```
┌──────────────────────────────────┐
│  🚀 Battle Cruiser                │
│  150,000 Credits | 5 turns        │
│                                   │
│  [Purchase]                       │  ← Grayed out
│  ↑                                │
│  💡 Need 105,000 more Credits     │  ← Tooltip on hover
└──────────────────────────────────┘
```

**Warning State (Low Resources After Purchase):**
```
┌──────────────────────────────────┐
│  🚀 Battle Cruiser                │
│  150,000 Credits | 5 turns        │
│                                   │
│  [Purchase] ⚠️                    │  ← Yellow warning icon
│                                   │
│  💡 This will leave you with only │  ← Tooltip
│     5,000 Credits. Consider       │
│     waiting for more income.      │
└──────────────────────────────────┘
```

### Confirmation Dialogs (High-Stakes Actions)

#### Purchase Confirmation (Expensive Items)

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│              Confirm Purchase                                 │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  Battle Cruiser                                          │ │
│  │  ─────────────────────────────────────────────────────   │ │
│  │                                                          │ │
│  │  Cost: 150,000 Credits                                   │ │
│  │  Build Time: 5 turns                                     │ │
│  │                                                          │ │
│  │  Your Credits after purchase: 45,000 → -105,000 ❌       │ │
│  │                                                          │ │
│  │  ⚠️ WARNING: This purchase will exceed your budget.      │ │
│  │  You need to earn 105,000 more Credits first.           │ │
│  │                                                          │ │
│  │                [Cancel] [Confirm]                        │ │
│  │                                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### Decommission Platoon Confirmation (Irreversible)

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│              ⚠️ Confirm Decommission                          │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  Platoon 03 (175 troops, Level 2 Equipment)             │ │
│  │                                                          │ │
│  │  This action will:                                       │ │
│  │  ✓ Return 175 troops to civilian population             │ │
│  │  ✗ Lose equipment investment (55,000 Credits)           │ │
│  │  ✗ Lose weapon investment (18,000 Credits)              │ │
│  │  ✗ Lose 100% training progress                          │ │
│  │                                                          │ │
│  │  Total value lost: 73,000 Credits (non-refundable)      │ │
│  │                                                          │ │
│  │  ⚠️ This action cannot be undone.                        │ │
│  │                                                          │ │
│  │          [Cancel] [Yes, Decommission]                    │ │
│  │                                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Key UX Patterns:**
- Uses ✓/✗ to show gains vs. losses
- Calculates total value lost
- Red text for irreversible warning
- [Yes, Decommission] button uses action verb (not just "OK")

---

## First-Time User Experience

### Onboarding Philosophy

**Progressive Disclosure:** Don't overwhelm new players with everything at once. Reveal features as they become relevant.

**Contextual Tooltips:** Teach through discovery, not lectures. Show tooltips WHEN players interact, not before.

**Empty State Guidance:** When a screen has no data yet, use it as a teaching moment.

### First-Time Tutorial Flow

```
Start Screen (First Launch)
    ↓
[New Game] clicked
    ↓
Game Setup Screen
    ├─ Player Name: [________]
    ├─ Difficulty: ○ Easy  ● Normal  ○ Hard
    └─ [Start]
        ↓
Tutorial Welcome Screen
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│                  Welcome to Overlord!                         │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  You're about to command a galactic empire, managing    │ │
│  │  resources, building fleets, and conquering planets.    │ │
│  │                                                          │ │
│  │  🎓 Tutorial (Recommended for first-time players)       │ │
│  │     Learn the basics through guided missions            │ │
│  │     Time: ~10 minutes                                   │ │
│  │                                                          │ │
│  │     [Begin Tutorial]                                     │ │
│  │                                                          │ │
│  │  ──────────────────────────────────────────────────      │ │
│  │                                                          │ │
│  │  🚀 Skip Tutorial (Jump right in)                       │ │
│  │     Tooltips will guide you as you explore              │ │
│  │                                                          │ │
│  │     [Skip to Galaxy Map]                                 │ │
│  │                                                          │ │
│  │  You can replay the tutorial anytime from Settings.     │ │
│  │                                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Tutorial Missions (Guided Path)

**Mission 1: Explore Your Empire**
```
┌──────────────────────────────────────────────────────────────┐
│  Tutorial Mission 1/5: Explore Your Empire      [Skip →]     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  💡 This is your Galaxy Map. From here you can see all       │
│     planets, spacecraft, and control your empire.            │
│                                                               │
│                        ⭐ [Starbase]  ← CLICK ME!            │
│                       (Player Home)                           │
│                                                               │
│  👆 Click on your home planet (Starbase) to continue.        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

*After clicking Starbase:*

```
┌──────────────────────────────────────────────────────────────┐
│  Tutorial Mission 1/5: Explore Your Empire      [Skip →]     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ✓ Great! You've selected your home planet.                  │
│                                                               │
│  💡 At the bottom of the screen, you'll see 6 buttons:       │
│     • Government - View resources and income                 │
│     • Buy - Purchase ships, buildings, platoons              │
│     • Navigation - Move spacecraft between planets           │
│     • Platoons - Manage your military forces                 │
│     • Settings - Adjust game settings                        │
│     • Help - Access this tutorial anytime                    │
│                                                               │
│  👆 Click [Government] to see your resources.                │
│                                                               │
│  [Government] [Buy] [Navigation] [Platoons] [Settings] [Help]│
│      ↑ CLICK                                                  │
└──────────────────────────────────────────────────────────────┘
```

**Mission 2: Understand Resources**
**Mission 3: Build Your First Structure**
**Mission 4: Create a Platoon**
**Mission 5: Your First Turn**

### Contextual Tooltips (Skip Tutorial Path)

When a player skips the tutorial, show ONE tooltip per interaction for the first 5 interactions:

**First Interaction: Hover over Starbase**
```
┌─────────────────────────────────────┐
│  💡 Your Home Planet                │
│  ─────────────────────────────      │
│  This is Starbase, your starting    │
│  planet. Click to view details or   │
│  double-click to see the surface.   │
│                                     │
│  [Got it, don't show again]         │
└─────────────────────────────────────┘
```

**Second Interaction: Hover over End Turn**
```
┌─────────────────────────────────────┐
│  💡 Advance to Next Turn             │
│  ─────────────────────────────      │
│  Click here when you're done with   │
│  your actions. Resources will be    │
│  generated and construction will    │
│  progress.                          │
│                                     │
│  Shortcut: Spacebar                 │
│  [Got it]                           │
└─────────────────────────────────────┘
```

**Third Interaction: First visit to Buy Screen**
```
┌─────────────────────────────────────┐
│  💡 Purchase Screen                  │
│  ─────────────────────────────      │
│  Here you can buy spacecraft,       │
│  buildings, and military units.     │
│  Items are added to a construction  │
│  queue and take several turns.      │
│                                     │
│  Current Credits: 195,000           │
│  [Got it]                           │
└─────────────────────────────────────┘
```

### Empty State Screens

#### Navigation Screen (No Spacecraft)

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]  Navigation                          Turn: 1       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│                                                               │
│                   🚀 No Spacecraft Yet                        │
│                                                               │
│  You don't own any spacecraft yet. Visit the Buy Screen      │
│  to purchase your first Battle Cruiser or Cargo Cruiser.     │
│                                                               │
│  Recommended first purchase:                                  │
│  • Battle Cruiser (150,000 Credits, 5 turns)                 │
│    Carries platoons for planetary assault                    │
│                                                               │
│  Current Credits: 195,000 ✓ (enough to purchase)             │
│                                                               │
│              [Go to Buy Screen] [Dismiss]                     │
│                                                               │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Key UX Patterns:**
- Friendly icon (🚀) not error icon (❌)
- Shows recommended action
- Checks if player can afford it (✓)
- Quick action button [Go to Buy Screen]

#### Platoon Management (No Platoons)

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]  Platoon Management              Platoons: 0/24    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│                                                               │
│                   ⚔️ No Platoons Commissioned                 │
│                                                               │
│  Platoons are ground forces used to capture and defend       │
│  planets. You can commission up to 24 platoons.              │
│                                                               │
│  To create your first platoon:                               │
│  1. Click [Commission New Platoon] below                     │
│  2. Set troop count (50-100 recommended for first)           │
│  3. Choose equipment level (Level 1 is fine to start)        │
│  4. Choose weapon level (Level 1 is fine to start)           │
│  5. Confirm purchase (~25,000-35,000 Credits)                │
│  6. Wait 4 turns for training to complete                    │
│                                                               │
│  Current Credits: 195,000 ✓                                  │
│                                                               │
│              [Commission New Platoon]                         │
│                                                               │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### Cargo Bay (No Craft Docked)

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]  Cargo Bay - Starbase            Docking: 0/3      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│                                                               │
│                   📦 Docking Bays Empty                       │
│                                                               │
│  No spacecraft are currently docked at Starbase.             │
│                                                               │
│  Spacecraft automatically dock when:                          │
│  • You purchase them from Buy Screen                         │
│  • They complete a journey and return to Starbase            │
│  • You manually land them from Navigation Screen             │
│                                                               │
│  Once docked, you can:                                        │
│  • Load/unload cargo (resources, crew)                       │
│  • Assign platoons to Battle Cruisers                        │
│  • Refuel spacecraft                                         │
│  • Launch them to other planets                              │
│                                                               │
│              [Go to Buy Screen] [Dismiss]                     │
│                                                               │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Progressive Feature Unlocking

Certain UI elements are HIDDEN until prerequisites are met:

**Turn 1-3:**
- Show: Government, Buy, Settings, Help
- Hide: Navigation (no spacecraft), Platoons (no platoons), Cargo Bay

**After First Purchase:**
- Unlock: Navigation Screen (when first spacecraft purchased)
- Show tooltip: "🎉 Navigation unlocked! Visit Navigation to move your spacecraft."

**After First Platoon:**
- Unlock: Platoon Management Screen
- Show tooltip: "🎉 Platoon Management unlocked! Train and equip your forces here."

**Turn 5+:**
- Unlock: Cargo Bay (assume player has docked craft by now)

### Hint System (Gentle Nudges)

After 3 turns of inactivity on a key action, show a gentle hint:

**No Purchases After 5 Turns:**
```
┌─────────────────────────────────────┐
│  💡 Tip: Start Building!             │
│  ─────────────────────────────      │
│  You have 195,000 Credits but       │
│  haven't purchased anything yet.    │
│  Consider buying a Battle Cruiser   │
│  or building infrastructure.        │
│                                     │
│  [Go to Buy Screen] [Dismiss]       │
└─────────────────────────────────────┘
```

**No Platoons After 10 Turns:**
```
┌─────────────────────────────────────┐
│  ⚔️ Tip: Build Your Army!            │
│  ─────────────────────────────      │
│  You'll need platoons to capture    │
│  enemy planets. Consider creating   │
│  2-3 platoons before attacking.     │
│                                     │
│  [Go to Platoons] [Dismiss]         │
└─────────────────────────────────────┘
```

---

## Loading & Progress States

### Loading Philosophy

**Transparency Over Mystery:** Players should ALWAYS know:
1. **What** is loading/processing
2. **How long** it will take
3. **What happens next**

**Perceived Performance:** Use progress indicators and animations to make waits feel shorter.

### Construction Queue Display

**Location:** Persistent banner at top of Buy Screen

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]  Buy Screen                        Credits: 45,000 │
├──────────────────────────────────────────────────────────────┤
│  🏗️ CONSTRUCTION QUEUE (3/5)              [View Full Queue] │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Battle Cruiser    [████████░░░░░] 3 turns  |  Mining Stn│ │
│  │                   (67% complete)            |  2 turns   │ │
│  └─────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────┤
│  [Spacecraft] [Buildings] [Upgrades] [Platoons]              │
│  ...
```

**Expanded Queue View:**

```
┌──────────────────────────────────────────────────────────────┐
│              Construction Queue (3/5 slots)                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. 🚀 Battle Cruiser                                         │
│     [████████████░░░░░] 60% (3/5 turns)                      │
│     Started: Turn 12  |  Completes: Turn 17                  │
│                                                [Cancel 50%]   │
│                                                               │
│  2. ⛏️ Mining Station                                         │
│     [███████████████░] 75% (2/4 turns)                       │
│     Started: Turn 13  |  Completes: Turn 17                  │
│                                                [Cancel 50%]   │
│                                                               │
│  3. ⚔️ Platoon 04 (150 troops, Lvl 2 Equipment)               │
│     [██████░░░░░░░░░] 33% (1/3 turns)                        │
│     Started: Turn 14  |  Completes: Turn 17                  │
│                                                [Cancel 50%]   │
│                                                               │
│  📌 All items complete Turn 17 (2 turns from now)            │
│                                                               │
│  Available slots: 2/5                                         │
│                                                               │
│                           [Close]                             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Key UX Patterns:**
- Progress bars with percentage AND turn count
- Shows start turn and completion turn
- Groups items completing on same turn
- [Cancel 50%] offers 50% refund for cancellations

### Turn Processing Screen

**Triggered:** When player clicks [End Turn]

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│                    ⏳ Processing Turn 15...                   │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  ✓ Generating resources                                 │ │
│  │  ✓ Calculating tax income                               │ │
│  │  ✓ Updating construction queue                          │ │
│  │  ⏳ Processing AI turn...                                │ │
│  │  ░ Resolving combat                                      │ │
│  │  ░ Updating planet ownership                             │ │
│  │                                                          │ │
│  │  [████████████░░░░░] 67%                                 │ │
│  │                                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│                    Estimated time: 2 seconds                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Micro-Animation:**
- Checkmarks (✓) appear as each step completes
- Current step shows spinner (⏳)
- Pending steps show empty box (░)
- Progress bar fills smoothly

**Performance Optimization:**
- If turn processing < 500ms, skip this screen entirely (instant transition)
- If turn processing > 2 seconds, show estimated time

### Journey Progress Indicator

**Location:** Appears when spacecraft is traveling

**Galaxy Map Overlay:**
```
┌──────────────────────────────────────────────────────────────┐
│  [≡ Menu]  Overlord              Turn: 15  [End Turn]        │
├──────────────────────────────────────────────────────────────┤
│  🚀 TRAVELING: BC-01 → Hitotsu            [View Details]     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ [Starbase]━━━━━🚀━━━━━━━━[Hitotsu]  ETA: 2 days (40%)  │ │
│  └─────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│                        ⭐ [Starbase]                          │
│                                                               │
│                                          🔴 [Hitotsu]         │
│                                          ↑ BC-01 approaching  │
│  ...
```

**Detailed Journey View:**
```
┌──────────────────────────────────────────────────────────────┐
│              Journey in Progress                              │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Spacecraft: BC-01 (Battle Cruiser)                          │
│  From: Starbase                                               │
│  To: Hitotsu (Enemy planet)                                  │
│                                                               │
│  Progress:                                                    │
│  [Starbase]━━━━━━━🚀━━━━━━━━━━━━[Hitotsu]                   │
│   Day 1      Day 3 ↑      Day 5           Day 7              │
│            (You are here)                                     │
│                                                               │
│  Status: On schedule  |  ETA: 2 days (Turn 17)               │
│  Fuel consumed: 30/70 (40 remaining) ✓                       │
│                                                               │
│  ⚠️ Combat will begin automatically upon arrival              │
│     Platoons onboard: 3/4                                    │
│     Combined strength: 450 troops (1,350 combat power)       │
│                                                               │
│                    [Abort Journey]                            │
│                    (Return to Starbase)                       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Terraforming Progress

**Galaxy Map Planet Indicator:**
```
     🌋 [Volcanic]
     ⚡⚡⚡ Terraforming (3/8 turns)
     (Neutral → Player)
```

**Detailed Terraforming View:**
```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]  Planet: Volcanic            Status: Terraforming  │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│                   ⚡ Terraforming in Progress                 │
│                                                               │
│  🌍 Planet Type: Volcanic                                     │
│  🔧 Atmosphere Processor: Active                             │
│                                                               │
│  Progress:                                                    │
│  [██████░░░░░░░░░░] 38% (3/8 turns)                          │
│                                                               │
│  Phase 1: Oxygen generation     ✓ Complete                   │
│  Phase 2: Atmospheric pressure  ✓ Complete                   │
│  Phase 3: Temperature regulation ⏳ In progress (2 turns)     │
│  Phase 4: Water cycle           ░ Pending (3 turns)          │
│                                                               │
│  Completion: Turn 23 (5 turns from now)                      │
│                                                               │
│  Upon completion:                                             │
│  • Planet becomes habitable                                  │
│  • Ownership transfers to you                                │
│  • You can build infrastructure                              │
│                                                               │
│                          [Close]                              │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Visual Animations:**
- Planet slowly rotates with particle effects (energy waves)
- Progress bar fills 1/8th each turn
- Current phase shows spinner (⏳)

### Research Progress (If Upgrade System Implemented)

```
┌──────────────────────────────────────────────────────────────┐
│  🔬 RESEARCH: Missile Upgrade            [View Details]      │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ [████████░░░░░░░░] 40% (2/5 turns)  |  Completion: T20  │ │
│  └─────────────────────────────────────────────────────────┘ │
```

### Combat Processing

**Real-time Combat Display:**
```
┌──────────────────────────────────────────────────────────────┐
│  PLANETARY ASSAULT: Hitotsu   │  Turn: 3/10  │ Status: Active│
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  💥 COMBAT IN PROGRESS...                                    │
│                                                               │
│  Player: 450 troops (1,350 STR)  [████████░░] 80%           │
│  Enemy:  280 troops (840 STR)    [██████░░░] 60%            │
│                                                               │
│  ⏳ Calculating casualties...                                │
│                                                               │
│  Recent events:                                               │
│  • Player dealt 45 damage                                    │
│  • Enemy dealt 30 damage                                     │
│  • Player casualties: 30 troops                              │
│  • Enemy casualties: 70 troops                               │
│                                                               │
│  [Retreating] [████░░░░░░░░] 33%                             │
│  (Escape in 2 turns)                                         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Completion Notifications

**Toast Notification (Non-Intrusive):**
```
┌─────────────────────────────────────────┐
│  ✅ Battle Cruiser Complete!            │
│  ─────────────────────────────────      │
│  BC-02 is ready at Starbase.            │
│  Visit Cargo Bay to assign crew.        │
│                                         │
│  [View] [Dismiss]        5 seconds ago  │
└─────────────────────────────────────────┘
```

**Position:** Top-right corner of screen
**Duration:** Auto-dismiss after 10 seconds OR user clicks [Dismiss]
**Stack:** Up to 3 notifications visible at once

**Modal Notification (Important Events):**
```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│                  🎉 Planet Colonized!                         │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  Volcanic Planet has been successfully terraformed!      │ │
│  │                                                          │ │
│  │  New colony details:                                     │ │
│  │  • Name: Volcanic Colony                                 │ │
│  │  • Type: Volcanic (5× Mineral, 3× Fuel bonus)           │ │
│  │  • Population: 0 (send civilians to populate)            │ │
│  │  • Platforms: 6 available for construction               │ │
│  │                                                          │ │
│  │  What to do next:                                        │ │
│  │  1. Build Mining Stations (utilize 5× Mineral bonus)    │ │
│  │  2. Send civilians via Cargo Cruiser                    │ │
│  │  3. Garrison platoons for defense                       │ │
│  │                                                          │ │
│  │              [View Planet] [Continue]                    │ │
│  │                                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Loading Skeleton Screens

**When loading screen data (e.g., transitioning to Government Screen):**

```
┌──────────────────────────────────────────────────────────────┐
│  [← Back]  Government Screen                   Turn: 15      │
├──────────────────────────────────────────────────────────────┤
│  RESOURCE SUMMARY                                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Credits:   ░░░░░   (░░░░░/turn)  💰                     │ │
│  │ Minerals:  ░░░░░   (░░░░░/turn)  ⛏️                      │ │
│  │ Fuel:      ░░░░░   (░░░░░/turn)  ⛽                      │ │
│  │ ...loading...                                            │ │
│  └─────────────────────────────────────────────────────────┘ │
```

**Micro-animation:** Gray boxes (░) pulse with shimmer effect

---

## Landscape Orientation (Mobile)

### Breakpoint Detection

```css
@media (orientation: landscape) and (max-height: 600px) {
  /* Phone landscape mode */
}
```

### Galaxy Map Adaptation

**Portrait Mode (Default):**
```
┌───────────────────┐
│    [≡] Overlord   │ ← Header (compact)
├───────────────────┤
│                   │
│    🌍 Galaxy      │
│    (Square)       │
│                   │
├───────────────────┤
│ [Gov] [Buy] [Nav] │ ← Bottom nav
└───────────────────┘
```

**Landscape Mode:**
```
┌────────────────────────────────────────────────┐
│ [≡] Turn: 15     Galaxy Map        [End Turn] │ ← Compact header
├────────────────────────────────────────────────┤
│ [G] │                                          │
│ [B] │         🌍 Galaxy                        │
│ [N] │       (Wide view)                        │ ← Side nav
│ [P] │                                          │
│ [S] │                                          │
└─────┴──────────────────────────────────────────┘
```

**Key Changes:**
- Navigation moves from bottom to LEFT SIDE (easier thumb access)
- Header shrinks to single line
- Galaxy map gets more horizontal space
- Buttons become icon-only: [G]overnment, [B]uy, etc.

### Button Adaptation

**Portrait:** Full text buttons
```
[Government] [Buy] [Navigation]
```

**Landscape:** Icon + letter
```
[💰 G] [🛒 B] [🚀 N]
```

### Dialog Positioning

**Portrait:** Center-aligned, 80% width
**Landscape:** Left-aligned, 60% width (leaves space for map visible in background)

---

## Conclusion

This UX design specification provides comprehensive guidelines for implementing consistent, accessible, and user-friendly interfaces across all platforms (PC, mobile, tablet). All wireframes, interaction patterns, and accessibility features are designed to support the core gameplay mechanics while ensuring an intuitive experience for players of all skill levels.

**Next Steps:**
1. Implement responsive layouts using breakpoint system
2. Add accessibility features (colorblind modes, UI scaling, screen reader support)
3. Create high-fidelity mockups in Figma (optional)
4. Conduct usability testing with target audience
5. Iterate based on feedback

---

**Document Owner:** Lead Designer
**Review Status:** Awaiting Review
**Related Documents:** PRD-overlord.md, art-requirements.md, AFS-071 through AFS-092
