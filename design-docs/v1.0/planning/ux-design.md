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

### 1. Main Screen (Galaxy Map)

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
│ [Battle continues...]                                         │
└──────────────────────────────────────────────────────────────┘
```

### 9. Victory/Defeat Screen

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│                      ✅ VICTORY!                              │
│                                                               │
│             You have conquered the star system                │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ STATISTICS                                               │ │
│  │                                                          │ │
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

| Token | Value | Usage |
|-------|-------|-------|
| `z-index-base` | 0 | Default layer |
| `z-index-dropdown` | 100 | Dropdown menus |
| `z-index-modal` | 200 | Modal dialogs |
| `z-index-tooltip` | 300 | Tooltips |
| `z-index-notification` | 400 | Toast notifications |
| `z-index-tutorial` | 500 | Tutorial overlays (highest) |

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
