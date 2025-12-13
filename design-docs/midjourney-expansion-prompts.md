# Overlord - Midjourney Expansion Prompts

**Project:** Overlord (4X Strategy Game)
**Purpose:** Future expansion assets NOT in current game specification
**Status:** Creative expansion - for future development phases
**Date:** 2025-12-13
**Parent Document:** midjourney-master-prompts.md

---

## Overview

This document contains creative asset concepts generated during the design process that go BEYOND the current game specification. These assets are preserved for potential future expansion of the game.

**Current Game Specification (Enums.ts):**
- CraftType: BattleCruiser, CargoCruiser, SolarSatellite, AtmosphereProcessor
- PlanetType: Volcanic, Desert, Tropical, Metropolis
- BuildingType: DockingBay, SurfacePlatform, MiningStation, HorticulturalStation, SolarSatellite, AtmosphereProcessor, OrbitalDefense
- AIPersonality: Aggressive, Defensive, Economic, Balanced

Assets in this document are NOT in the current specification but represent valuable creative expansion opportunities.

---

## Table of Contents

1. [Expansion Spacecraft](#expansion-spacecraft)
2. [Expansion Planets](#expansion-planets)
3. [Expansion Buildings](#expansion-buildings)
4. [Expansion Infrastructure](#expansion-infrastructure)
5. [Expansion Alien Leaders](#expansion-alien-leaders)
6. [Expansion Battle Scenes](#expansion-battle-scenes)
7. [Extended Assets (Priority 2)](#extended-assets-priority-2)

---

## Expansion Spacecraft

### Scout Ship

**Purpose:** Fast reconnaissance craft, early exploration, cheap disposable unit

**Design Notes:** This ship type was invented to provide early-game exploration options and asymmetric fleet composition. Could enable fog-of-war mechanics.

**Master Prompt:**
```
isometric 2D scout ship, compact angular hull, single engine nacelle,
minimal weapons, blue sensor dome, matte gray plating, cool rim light,
warm engine glow, orbiting ice world, crisp edges, no text --ar 16:9
```

**Acceptance Criteria:**
- Clearly smaller/lighter than Battle Cruiser
- Single-person cockpit visible
- Recognizable as "fast and fragile"
- Blue faction markings clear
- Readable at 512x256 resolution

**Variant: Scout Ship (Upgraded)**
```
isometric 2D scout ship, extended sensor array, upgraded teal scanner dish,
reinforced bow plating, blue stripe accent, matte finish, cool rim + warm bounce,
deep space background, crisp details --ar 16:9
```

**Variant: Scout Ship (Damaged)**
```
isometric 2D scout ship, hull breach amidships, venting atmosphere,
flickering engine, scorched plating, amber warning lights,
debris trail, limping through asteroid field --ar 16:9
```

**Modifiers if too complex:**
- Add: "minimal detail", "simplified silhouette"
- Remove: specific equipment callouts
- Emphasize: "clean design", "single engine"

**Continuity Notes:**
- Use same base hull shape across variants
- Maintain blue faction trim position
- Keep engine nacelle configuration consistent
- Damage should show on existing features (don't add new elements)

---

### Bomber

**Purpose:** Planetary bombardment, anti-structure attacks

**Design Notes:** This ship type was invented to provide dedicated ground attack capability. Would require new combat mechanics for orbital bombardment gameplay.

**Master Prompt:**
```
isometric 2D bomber spacecraft, heavy ordnance bays, reinforced belly armor,
angular bomb bay doors, blue targeting reticle glow, matte dark gray,
twin engines, cool rim + warm exhaust, approaching planet surface,
crisp silhouette --ar 16:9
```

**Acceptance Criteria:**
- Visually distinct from Battle Cruiser (different role obvious)
- Bomb bay or payload section prominent
- Heavier/sturdier appearance than Scout
- Blue faction markings
- "Ground attack" aesthetic clear
- Readable at 512x256 resolution

**Variant: Bomber (Upgraded - Heavy Payload)**
```
isometric 2D bomber, expanded ordnance racks, reinforced structural ribs,
upgraded targeting computer (teal glow), additional armor plating,
blue squadron markings, matte finish --ar 16:9
```

**Variant: Bomber (Damaged - Post Mission)**
```
isometric 2D bomber, scorched underbelly, flak damage pockmarks,
one engine sputtering, bomb bay doors jammed open,
returning to starbase trailing smoke --ar 16:9
```

**Variant: Bomber (Ordnance Drop)**
```
isometric 2D bomber, bomb bay doors open, ordnance falling toward planet surface,
targeting laser beams, blue engine glow, releasing payload over volcanic world --ar 16:9
```

**Modifiers if unclear role:**
- Add: "ground attack craft", "heavy weapons platform"
- Emphasize: "visible payload", "bomb bay doors"
- Remove: elegant curves (favor blocky, armored aesthetic)

**Continuity Notes:**
- Bomb bay door design consistent across variants
- Engine configuration unchanged
- Damage shows on armor, not core structure
- Payload visible in "clean" version (ordnance stored), empty in "damaged" (expended)

---

## Expansion Planets

### Terran (Earth-like) Planet

**Purpose:** Balanced resources, human-habitable, starter planet type

**Design Notes:** Classic Earth-like world for familiarity. Would require new PlanetType enum value.

**Master Prompt (Neutral):**
```
isometric planet sprite, terran earth-like world, blue oceans, green continents,
white cloud bands, day/night terminator, gray neutral orbital markers,
consistent rim lighting, painterly clouds, crisp limb glow,
deep space background --ar 1:1
```

**Acceptance Criteria:**
- Recognizable as "Earth-like" (blue oceans dominant)
- Cloud patterns natural
- Continents visible (green/brown landmasses)
- Neutral gray orbital stations present
- Rim light consistent with other planets
- Readable at 512x512 resolution

**Variant: Terran (Player-Owned)**
```
isometric terran planet, blue oceans, green continents, white clouds,
blue orbital stations with player faction beacons, blue glow accents,
blue navigation grid lines, developed infrastructure --ar 1:1
```

**Variant: Terran (AI-Owned)**
```
isometric terran planet, blue oceans, continents, white clouds,
red orbital defense platforms, red warning beacons,
red faction infrastructure, militarized orbit --ar 1:1
```

**Modifiers if clouds obscure surface:**
- Add: "sparse cloud coverage", "visible landmasses"
- Reduce: cloud density slider
- Emphasize: "blue ocean dominant", "green continents clear"

**Continuity Notes:**
- Ocean/land ratio must remain constant across ownership variants
- Cloud pattern can vary slightly but keep same distribution
- Terminator line position consistent (45 degrees from viewer)
- Only orbital elements change color (planet surface identical)

---

### Gas Giant Planet

**Purpose:** Fuel harvesting, no surface settlements, atmospheric mining

**Design Notes:** Jupiter-like gas giant for fuel economy specialization. Would require atmospheric mining mechanics.

**Master Prompt (Neutral):**
```
isometric planet sprite, gas giant with blue-white cloud bands,
swirling storm systems, great red spot feature, no solid surface,
atmospheric layers, gray neutral orbital harvesting stations,
consistent rim lighting, painterly gas flows --ar 1:1
```

**Acceptance Criteria:**
- Clearly gaseous (no solid surface visible)
- Banded atmosphere (Jupiter-like)
- Storm systems present
- Larger appearance than rocky planets
- Neutral gray harvesting platforms
- Readable at 512x512 resolution

**Variant: Gas Giant (Player-Owned)**
```
isometric gas giant, swirling blue-white bands, storm systems,
blue orbital fuel harvesting rigs, blue atmospheric processors,
blue faction beacons, industrial collection infrastructure --ar 1:1
```

**Variant: Gas Giant (AI-Owned)**
```
isometric gas giant, cloud bands, storm vortex,
red orbital fuel monopoly platforms, red atmospheric mining,
red faction control, defensive satellite grid --ar 1:1
```

**Modifiers if looks solid:**
- Add: "no solid surface", "atmospheric layers visible"
- Emphasize: "swirling gases", "cloud band flow"
- Remove: hard surface features, continents

**Continuity Notes:**
- Cloud band pattern consistent (major bands don't move)
- Storm systems can vary in intensity but stay in same region
- Orbital platforms are the only faction-colored elements
- Gas flow direction constant

---

### Ice World

**Purpose:** Water resources (frozen), cold environment, defensive value

**Design Notes:** Frozen world for water economy and defensive terrain bonuses.

**Master Prompt (Neutral):**
```
isometric planet sprite, ice world, white-blue frozen surface,
polar ice sheets, aurora borealis shimmer, frozen ocean cracks,
day/night terminator, gray neutral orbital research stations,
consistent cool rim lighting, crisp ice details --ar 1:1
```

**Acceptance Criteria:**
- Clearly frozen (white-blue dominant)
- Ice sheet cracks visible
- Aurora effect present (subtle)
- Cold aesthetic obvious
- Neutral gray orbital stations
- Readable at 512x512 resolution

**Variant: Ice World (Player-Owned)**
```
isometric ice planet, frozen surface, ice sheet patterns, aurora glow,
blue orbital water extraction facilities, blue faction heating infrastructure,
blue beacons, ice mining operations --ar 1:1
```

**Variant: Ice World (AI-Owned)**
```
isometric ice planet, frozen continents, aurora shimmer,
red orbital resource monopoly, red faction industrial heaters,
red warning lights, militarized ice mining --ar 1:1
```

**Modifiers if not icy enough:**
- Add: "completely frozen surface", "ice sheet coverage"
- Emphasize: "white-blue color", "frozen ocean visible"
- Increase: ice crack details, aurora brightness

**Continuity Notes:**
- Ice crack patterns locked
- Aurora position consistent (polar regions)
- Surface temperature appearance constant
- Only orbital elements change faction colors

---

### Ocean World

**Purpose:** Food production, water abundance, trade importance

**Design Notes:** Water world for food economy specialization and trade route benefits.

**Master Prompt (Neutral):**
```
isometric planet sprite, ocean world, deep blue water covering 95% of surface,
small scattered island chains, white-blue cloud wisps, tropical storm systems,
day/night terminator, gray neutral orbital fishing platforms,
consistent rim lighting, water texture painterly --ar 1:1
```

**Acceptance Criteria:**
- Water dominant (>90% coverage)
- Small islands visible (proves not gas giant)
- Tropical cloud patterns
- Ocean texture obvious
- Neutral gray fishing/harvesting platforms
- Readable at 512x512 resolution

**Variant: Ocean World (Player-Owned)**
```
isometric ocean planet, deep blue seas, island archipelagos, cloud wisps,
blue orbital aquaculture stations, blue faction beacons,
blue underwater city lights visible, farming infrastructure --ar 1:1
```

**Variant: Ocean World (AI-Owned)**
```
isometric ocean planet, water surface, scattered islands, storm systems,
red orbital naval platforms, red faction fishing monopoly,
red underwater settlements glow, militarized fishing --ar 1:1
```

**Modifiers if islands too large:**
- Add: "minimal land", "95% water coverage"
- Reduce: island size
- Emphasize: "vast ocean", "deep blue water"

**Continuity Notes:**
- Island positions locked (same archipelago pattern)
- Ocean color consistent (deep blue)
- Storm systems can move but stay in tropical bands
- Underwater city lights (owned variants only) use faction colors

---

## Expansion Buildings

### Factory

**Purpose:** Spacecraft and platoon production

**Design Notes:** Manufacturing facility for unit production. Would require new BuildingType.

**Master Prompt:**
```
isometric 2D factory complex, assembly line structures,
spacecraft construction bays, blue faction lights,
matte gray industrial buildings, manufacturing equipment,
production towers, functional factory aesthetic --ar 1:1
```

**Acceptance Criteria:**
- Assembly/production equipment visible
- Large enough for ship construction
- Blue faction identification
- Industrial manufacturing aesthetic
- Multiple bays/sections
- Readable at 512x512

**Variant: Factory (Active Production)**
```
isometric 2D factory, assembly lines running,
blue lights bright, spacecraft partially built in bays,
sparks from welding, active manufacturing --ar 1:1
```

**Modifiers if looks like other buildings:**
- Add: "assembly line equipment", "construction bays"
- Emphasize: "manufacturing facility", "production complex"
- Increase: bay size (show ships can fit)

**Continuity Notes:**
- Bay configuration constant
- Assembly equipment unchanged
- Blue lights locked position
- Active variant shows same structure with activity

---

### Research Lab

**Purpose:** Technology upgrade research

**Design Notes:** Science facility for tech tree progression. Would enable research mechanics.

**Master Prompt:**
```
isometric 2D research laboratory, white/gray clean-room buildings,
large teal sensor dishes, blue faction lights, scientific equipment,
observatory dome, antenna arrays, research aesthetic,
high-tech appearance --ar 1:1
```

**Acceptance Criteria:**
- Scientific equipment visible (dishes, antennas)
- Teal tech accents (research color)
- Clean, sterile appearance
- Blue faction identification
- Observatory/lab aesthetic obvious
- Readable at 512x512

**Variant: Research Lab (Active Research)**
```
isometric 2D research lab, teal energy field active,
sensor dishes scanning, blue lights bright,
data transmission visible, research in progress --ar 1:1
```

**Modifiers if looks military:**
- Add: "scientific facility", "research equipment"
- Remove: weapons, armor
- Emphasize: "laboratory aesthetic", "clean-room design"

**Continuity Notes:**
- Sensor dish configuration constant
- Observatory dome unchanged
- Teal accents locked to equipment
- Blue faction lights consistent

---

### Defense Shield Generator

**Purpose:** Planetary defense, damage reduction

**Design Notes:** Shield projection facility for planetary protection. Would enhance defense mechanics.

**Master Prompt:**
```
isometric 2D shield generator facility, large energy projector dome,
blue shield field emanating upward, blue faction lights,
matte gray fortified structure, power conduits visible,
defensive architecture, energy core glowing --ar 1:1
```

**Acceptance Criteria:**
- Shield projector obvious (dome/dish)
- Blue shield field visible
- Blue faction identification
- Fortified appearance
- Energy systems visible
- Readable at 512x512

**Variant: Shield Generator (Under Fire)**
```
isometric 2D shield generator, blue shield flickering,
incoming fire impacts, shield dome strained,
power overload, defensive stress visible --ar 1:1
```

**Modifiers if shield unclear:**
- Add: "shield dome visible", "energy field active"
- Emphasize: "defensive shield", "force field projection"
- Increase: shield glow, blue energy effect

**Continuity Notes:**
- Projector dome design constant
- Shield effect consistent (blue hemisphere)
- Power conduits unchanged
- Stress variant shows same structure under load

---

### Missile Battery

**Purpose:** Planetary defense, anti-ship attacks

**Design Notes:** Ground-to-space missile defense system.

**Master Prompt:**
```
isometric 2D missile battery, vertical launch silos,
blue faction targeting systems, matte gray armored structure,
missile racks visible, military defensive aesthetic,
radar dishes, fortified emplacement --ar 1:1
```

**Acceptance Criteria:**
- Missile silos obvious (vertical tubes)
- Blue faction identification
- Military fortification clear
- Targeting systems visible
- Missiles visible (in racks/silos)
- Readable at 512x512

**Variant: Missile Battery (Firing)**
```
isometric 2D missile battery, missiles launching from silos,
blue exhaust trails, targeting lasers active,
launch sequence in progress, defensive fire --ar 1:1
```

**Modifiers if silos unclear:**
- Add: "vertical launch tubes", "missile silos prominent"
- Emphasize: "missile battery", "launch racks"
- Increase: silo detail, missile visibility

**Continuity Notes:**
- Silo configuration constant
- Radar dish positions locked
- Blue targeting systems consistent
- Firing variant shows missiles launching (same silos)

---

### Laser Battery

**Purpose:** Planetary defense, anti-ship attacks

**Design Notes:** Energy weapon defense emplacement.

**Master Prompt:**
```
isometric 2D laser battery, large focusing lens turret,
blue faction power conduits, matte gray fortified base,
energy capacitors visible, military defensive aesthetic,
targeting computer, beam weapon emplacement --ar 1:1
```

**Acceptance Criteria:**
- Laser lens/turret obvious (different from missile battery)
- Blue faction identification
- Energy systems visible (capacitors, conduits)
- Fortified appearance
- Beam weapon aesthetic clear
- Readable at 512x512

**Variant: Laser Battery (Firing)**
```
isometric 2D laser battery, blue energy beam firing upward,
targeting red enemy ship, power surge visible,
capacitors discharging, defensive laser active --ar 1:1
```

**Modifiers if looks like missile battery:**
- Add: "focusing lens turret", "energy weapon", "laser emitter"
- Remove: missile tubes
- Emphasize: "beam weapon", "energy capacitors"

**Continuity Notes:**
- Turret lens design constant
- Capacitor positions locked
- Blue energy conduits consistent
- Firing variant shows beam (same turret)

---

### Population Habitat

**Purpose:** Population capacity, morale improvement

**Design Notes:** Residential complex for population growth mechanics.

**Master Prompt:**
```
isometric 2D population habitat, residential tower blocks,
blue faction civic lights, civilian architecture,
living quarters visible, parks/green spaces,
civilian aesthetic, inhabited appearance,
comfortable living design --ar 1:1
```

**Acceptance Criteria:**
- Residential appearance (not industrial)
- Blue faction identification (minimal, civic)
- Civilian aesthetic (no weapons)
- Living spaces visible
- Population implied (lights, greenery)
- Readable at 512x512

**Variant: Population Habitat (High Morale)**
```
isometric 2D habitat, bright lights, green spaces thriving,
blue civic beacons, well-maintained buildings,
happy population implied, prosperous appearance --ar 1:1
```

**Modifiers if looks industrial:**
- Add: "residential towers", "civilian housing"
- Remove: industrial equipment
- Emphasize: "living quarters", "parks", "civic spaces"

**Continuity Notes:**
- Tower block layout constant
- Green space positions locked
- Blue civic lights consistent (not military blue)
- Morale level shown by lighting/maintenance quality

---

### Energy Plant

**Purpose:** Energy resource production

**Design Notes:** Power generation facility (alternative to SolarSatellite).

**Master Prompt:**
```
isometric 2D energy plant, power generation towers,
blue faction energy conduits, cooling towers,
matte gray industrial structure, energy core visible,
power distribution equipment, functional power plant aesthetic,
electrical discharge visible --ar 1:1
```

**Acceptance Criteria:**
- Power generation obvious (towers, core)
- Blue faction identification
- Energy systems visible (conduits, discharge)
- Industrial power aesthetic
- Different from other industrial buildings
- Readable at 512x512

**Variant: Energy Plant (Peak Output)**
```
isometric 2D energy plant, towers at maximum output,
blue energy arcs visible, core glowing bright,
power surging, maximum production --ar 1:1
```

**Modifiers if unclear:**
- Add: "power generation towers", "energy core"
- Emphasize: "electrical discharge", "power plant"
- Increase: energy effects, core glow

**Continuity Notes:**
- Tower configuration constant
- Core position locked
- Blue conduits consistent
- Output level shown by energy effect intensity

---

### Spaceport Terminal (Ground Facility)

**Purpose:** Trade, spacecraft landing, economy

**Design Notes:** Ground-based starport for trade mechanics.

**Master Prompt:**
```
isometric 2D spaceport terminal, landing pads visible,
blue faction navigation beacons, civilian control tower,
matte gray/white civilian structure, docked civilian ships,
trade terminal aesthetic, commercial spaceport --ar 1:1
```

**Acceptance Criteria:**
- Landing pads obvious
- Blue civilian navigation lights
- Control tower visible
- Civilian (not military) aesthetic
- Trade/commerce implied
- Readable at 512x512

**Variant: Spaceport Terminal (Busy Trade)**
```
isometric 2D spaceport terminal, multiple ships docked,
landing pads full, blue beacons active,
cargo transfer in progress, bustling commerce --ar 1:1
```

**Modifiers if looks military:**
- Add: "civilian terminal", "commercial landing pads"
- Remove: weapons, heavy armor
- Emphasize: "trade hub", "merchant vessels"

**Continuity Notes:**
- Landing pad layout constant
- Control tower design locked
- Blue beacon positions consistent
- Activity level varies (ships present/absent)

---

## Expansion Infrastructure

### Space Station (Research Facility)

**Purpose:** Scientific research, technology development

**Design Notes:** Orbital research platform for advanced tech mechanics.

**Master Prompt:**
```
isometric 2D research space station, laboratory modules,
large sensor arrays, teal scientific instrument glow,
white/gray clean-room aesthetic, observatory dish,
minimal weapons, civilian research crews,
orbiting gas giant, painterly details --ar 16:9
```

**Acceptance Criteria:**
- Scientific equipment visible (sensors, dishes)
- Teal accent lighting (tech color)
- Non-military appearance
- Laboratory modules identifiable
- Clean, sterile aesthetic
- Readable at 1600x900 resolution

**Variant: Research Station (Active Experiment)**
```
isometric 2D research station, teal energy field active,
experimental device charging, sensor arrays scanning,
blue research crews working, data streaming,
science in progress --ar 16:9
```

**Modifiers if looks military:**
- Add: "civilian research", "scientific facility", "no weapons"
- Emphasize: "lab modules", "sensor equipment", "observatory"
- Remove: armor, turrets, aggressive angles

**Continuity Notes:**
- Sensor array configuration constant
- Teal lighting locked to science equipment
- Module arrangement unchanged
- Research activity level varies by variant

---

### Space Station (Refinery)

**Purpose:** Resource processing, fuel production, industrial center

**Design Notes:** Industrial processing hub for resource conversion mechanics.

**Master Prompt:**
```
isometric 2D industrial refinery station, massive ore processors,
fuel tanks visible, mineral conveyor systems, amber processing glow,
matte industrial gray/yellow, smelting furnaces,
cargo ships loading, heavy industrial aesthetic,
asteroid field backdrop --ar 16:9
```

**Acceptance Criteria:**
- Industrial equipment obvious (processors, tanks)
- Amber/orange glow from furnaces
- Cargo infrastructure visible
- "Heavy industry" aesthetic
- Resource materials present (ore, fuel tanks)
- Readable at 1600x900 resolution

**Variant: Refinery (High Production)**
```
isometric 2D refinery station, furnaces at maximum capacity,
amber glow intense, multiple cargo ships docked,
ore conveyors running, fuel tanks filling,
industrial activity peak --ar 16:9
```

**Modifiers if too clean:**
- Add: "heavy industrial", "smelting operations", "dirty production"
- Emphasize: "ore processors", "fuel tanks", "conveyor systems"
- Increase: amber glow, industrial grime

**Continuity Notes:**
- Processing equipment layout constant
- Fuel tank positions locked
- Amber glow intensity varies (low/high production)
- Cargo ship traffic varies

---

### Military Starbase

**Purpose:** Fleet command, orbital defense, military production

**Design Notes:** Fortified military orbital station.

**Master Prompt (Clean):**
```
isometric 2D military starbase, reinforced armor ribs,
weapon turret emplacements, blue faction command tower,
defensive shield generators, matte battleship gray,
angular military architecture, docked battle cruisers,
clean fortification, cool rim + warm power core --ar 16:9
```

**Acceptance Criteria:**
- Clearly military (weapons visible)
- Blue faction identification obvious
- Fortified appearance
- Capital ship docks present
- Defensive emplacements clear
- Readable at 1600x900 resolution

**Variant: Military Starbase (Damaged - Under Siege)**
```
isometric 2D military starbase, hull breached, turrets destroyed,
venting atmosphere, sparking power conduits, red enemy fire incoming,
blue emergency shields flickering, battle damage extensive,
defenders evacuating --ar 16:9
```

**Variant: Military Starbase (Upgraded - Fortress)**
```
isometric 2D military starbase, heavy armor plating overlays,
additional weapon batteries, upgraded shield dome visible,
reinforced docking cradles, blue faction fortification,
advanced defensive systems, imposing military presence --ar 16:9
```

**Variant: Military Starbase (Active Combat)**
```
isometric 2D military starbase, firing all weapons,
blue turret muzzle flashes, missile volleys launching,
shield impacts, defending against red enemy fleet,
battle engagement active --ar 16:9
```

**Modifiers if not imposing enough:**
- Add: "heavy fortification", "fortress station"
- Emphasize: "weapon emplacements", "thick armor", "defensive posture"
- Increase: size relative to civilian stations

**Continuity Notes:**
- Core structure unchanged across variants
- Weapon positions locked
- Upgraded version adds external modules
- Damage appears on existing turrets/armor
- Blue faction markings stay on command tower

---

## Expansion Alien Leaders

### Zealot Prophet (Religious Archetype)

**Purpose:** Ideological AI personality, fanatical expansion

**Design Notes:** Fifth AI personality type for religious/ideological faction. Would require new AIPersonality enum value.

**Master Prompt (Serene Pose):**
```
isometric head-and-shoulders portrait, alien zealot prophet,
ethereal glowing markings on face, ceremonial headdress,
violet mystic energy aura, blue faction devotional robes,
serene but intense expression, glowing eyes,
neutral gray backdrop, mystical lighting,
spiritual presence --ar 2:3
```

**Acceptance Criteria:**
- Mystical/religious symbolism (markings, headdress)
- Blue faction identification (robes, symbols)
- Intense spiritual presence
- Violet mystic accents (exotic element)
- Otherworldly features
- Readable at 1024x1536

**Variant: Zealot Prophet (Fervent Pose)**
```
isometric portrait, zealot prophet, glowing face markings,
ceremonial headdress, violet energy intense, blue robes,
passionate expression, preaching demeanor,
fanatical presence, neutral backdrop --ar 2:3
```

**Modifiers if not mystical enough:**
- Add: "glowing religious markings", "ethereal aura"
- Emphasize: "ceremonial elements", "spiritual presence"
- Increase: violet glow, face markings brightness

**Continuity Notes:**
- Face marking pattern locked
- Headdress design constant
- Blue robes unchanged
- Violet aura always present
- Expression varies (serene vs fervent)

---

## Expansion Battle Scenes

### Scout Dogfight Scene

**Purpose:** Small craft combat visualization, scout mission backdrop

**Design Notes:** Requires Scout ship type to be implemented.

**Master Prompt:**
```
isometric 2D scout dogfight, blue scout ships engaged with red enemy scouts,
close-quarters maneuvering, laser fire exchanges, ships banking and turning,
asteroid field backdrop, high-speed chase, nimble combat,
debris trails, scout silhouettes clear --ar 16:9
```

**Acceptance Criteria:**
- Scout ships clearly smaller/faster than cruisers
- Close combat (not long range)
- High maneuverability obvious
- Asteroid field environment
- Blue and red scouts identifiable
- Dynamic composition (motion implied)
- Readable at 1920x1080

**Variant: Scout Dogfight (Ambush)**
```
isometric 2D scout combat, blue scouts ambushing red patrol,
surprise attack from asteroid cover, red scouts caught off-guard,
blue tactical advantage, close-range assault --ar 16:9
```

**Modifiers if looks like capital ship battle:**
- Add: "small craft combat", "nimble fighters"
- Reduce: ship size
- Emphasize: "scout vessels", "high-speed maneuvering"

**Continuity Notes:**
- Scout designs match established craft
- Asteroid field can vary but same art style
- Blue/red faction colors consistent
- Weapon scale appropriate for scouts (small lasers, not heavy turrets)

---

### Orbital Bombardment Scene

**Purpose:** Bomber attack visualization, bombardment mission result

**Design Notes:** Requires Bomber ship type to be implemented.

**Master Prompt:**
```
isometric 2D orbital bombardment, blue bomber squadron releasing ordnance,
missiles falling toward planet surface, targeting laser beams,
planetary defense fire (red tracers) shooting upward,
explosions on planet surface, blue bombers in attack formation,
planet limb visible below, space backdrop above --ar 16:9
```

**Acceptance Criteria:**
- Blue bombers clearly visible
- Ordnance falling (bombs/missiles)
- Planet surface receiving fire
- Defensive fire from surface (red tracers)
- Explosions visible on ground
- Cinematic angle (above planet)
- Readable at 1920x1080

**Variant: Bombardment (Heavy Defense)**
```
isometric 2D bombardment, blue bombers facing intense red anti-aircraft fire,
one bomber damaged, defensive missile batteries active,
red laser batteries firing, blue ordnance some intercepted,
heavy resistance --ar 16:9
```

**Modifiers if unclear action:**
- Add: "ordnance falling from bombers", "planet surface under attack"
- Emphasize: "bombing run in progress", "targeting lasers"
- Increase: explosion brightness, missile trails

**Continuity Notes:**
- Bomber designs match established craft
- Planet type can vary (use any planet from catalog)
- Blue faction always attacking from space
- Red defensive fire always from surface

---

### Planetary Siege (Full Assault Composition)

**Purpose:** Epic campaign climax visualization, final battle backdrop

**Design Notes:** Requires Bomber ship type for full composition.

**Master Prompt:**
```
isometric 2D planetary siege, blue fleet in orbit bombarding planet,
blue battle cruisers and bombers attacking, red orbital defenses firing back,
ground invasion in progress on surface, space battle overhead,
planetary shields flickering, multiple combat layers,
epic scale composition, blue assault overwhelming red defenses --ar 16:9
```

**Acceptance Criteria:**
- Multi-layered battle (space + orbit + surface)
- Blue assault forces dominant
- Red defenses visible
- Planet under siege obvious
- Multiple ship types engaged
- Epic scale (largest battle scene)
- Readable at 1920x1080

**Variant: Planetary Siege (Breaching Shields)**
```
isometric 2D siege, blue forces concentrating fire on red planetary shields,
shield dome cracking, blue bombers targeting shield generators,
red defenses weakening, breakthrough imminent --ar 16:9
```

**Modifiers if not epic enough:**
- Add: "massive assault", "epic scale battle"
- Increase: ship count, explosion density
- Emphasize: "multi-layer combat", "overwhelming force"

**Continuity Notes:**
- All ship types from established catalog
- Planet matches one of established types
- Blue always assaulting, red always defending
- Shield effect matches starbase shields (same visual language)

---

## Extended Assets (Priority 2)

These assets represent additional creative expansion for enhanced visual fidelity and gameplay variety.

### Military Units (6 assets)

Ground combat unit visualizations for enhanced invasion mechanics.

**38. Platoon (Standard Equipment)**
```
isometric 2D platoon formation, squad of 8-12 soldiers,
blue faction armor, standard equipment rifles,
matte gray/blue military gear, tactical formation,
ground troops visible, military unit aesthetic --ar 1:1
```

**39. Platoon (Elite Equipment)**
```
isometric 2D elite platoon formation, squad of 8-12 soldiers,
blue faction heavy armor, advanced weapons (heavy rifles/launchers),
matte dark blue/gray military gear, tactical formation,
elite troops visible, upgraded equipment obvious --ar 1:1
```

**40. Platoon (Advanced Weapons)**
```
isometric 2D advanced weapons platoon, squad of 8-12 soldiers,
blue faction tactical armor, heavy weapons (rocket launchers, cannons),
matte blue/gray military gear, specialized formation,
heavy weapons squad visible, anti-vehicle equipment --ar 1:1
```

**41. Mechanized Unit (Vehicles)**
```
isometric 2D mechanized unit, 2-3 armored vehicles,
blue faction tank/APC design, matte military gray/blue,
vehicle turrets visible, ground combat vehicles,
armored formation --ar 1:1
```

**42. Drop Pod**
```
isometric 2D drop pod, single atmospheric entry pod,
blue faction markings, matte gray heat-resistant shell,
retro-rocket nozzles, compact troop carrier,
landing configuration visible --ar 1:1
```

**43. Garrison Troops (Defensive Posture)**
```
isometric 2D garrison troops, squad of 8-12 soldiers in defensive positions,
blue faction armor, defensive emplacements (sandbags, barriers),
entrenched posture, static defense formation,
fortified position visible --ar 1:1
```

---

### Environmental Details (8 assets)

Space environment assets for enhanced visual variety.

**Space Debris Field**
```
isometric space debris field, scattered hull fragments,
destroyed ship sections, floating metal shards,
dark space background, subtle blue rim lights,
battle aftermath aesthetic --ar 16:9
```

**Asteroid Cluster**
```
isometric asteroid cluster, varied rocky asteroids,
gray/brown mineral composition, some with blue crystal deposits,
deep space background, mining potential implied --ar 16:9
```

**Comet/Ice Field**
```
isometric comet tail field, icy debris scattered,
blue-white ice crystals, frozen gas wisps,
cold space aesthetic, resource potential --ar 16:9
```

**Satellite Network**
```
isometric satellite constellation, multiple small satellites,
blue faction comm dishes, data relay network,
orbital grid pattern, communication aesthetic --ar 16:9
```

**Trade Route Markers**
```
isometric trade route beacons, navigation buoys,
blue commerce markers, shipping lane indicators,
trade path visualization --ar 16:9
```

**Warp Gate**
```
isometric warp gate structure, large ring portal,
blue energy swirl, dimensional gateway,
advanced technology aesthetic --ar 16:9
```

**Sensor Array**
```
isometric sensor array station, large radar dishes,
teal sensor glow, early warning system,
intelligence gathering aesthetic --ar 16:9
```

**Communication Relay**
```
isometric communication relay, antenna tower station,
blue signal indicators, message routing,
network infrastructure aesthetic --ar 16:9
```

---

### VFX & Effects (10 assets)

Visual effects for combat and gameplay enhancement.

**Explosion (Small)**
```
isometric small explosion sprite, orange/yellow fireball,
debris particles, smoke puff, weapon impact,
clean edges, transparent background --ar 1:1
```

**Explosion (Large)**
```
isometric large explosion, massive fireball,
ship destruction scale, debris field expanding,
shockwave ring, catastrophic damage --ar 1:1
```

**Weapon Muzzle Flash**
```
isometric muzzle flash sprite, bright white/yellow flash,
weapon firing effect, turret discharge,
clean edges, transparent background --ar 1:1
```

**Shield Impact**
```
isometric shield impact effect, blue hexagonal pattern,
energy absorption, ripple effect,
defensive block visualization --ar 1:1
```

**Warp Trail**
```
isometric warp trail effect, ship speed lines,
blue energy streaks, FTL travel,
motion blur aesthetic --ar 1:1
```

**Engine Glow**
```
isometric engine glow sprite, blue/orange exhaust,
thruster effect, propulsion visualization,
ship movement indicator --ar 1:1
```

**Construction Sparks**
```
isometric construction sparks, welding effect,
orange spark shower, building progress,
industrial activity --ar 1:1
```

**Damage Smoke**
```
isometric damage smoke trail, gray/black smoke,
ship damage indicator, system failure,
battle damage aesthetic --ar 1:1
```

**Energy Beam**
```
isometric energy beam sprite, blue laser line,
weapon discharge, continuous fire,
beam weapon visualization --ar 1:1
```

**Missile Trail**
```
isometric missile trail, white smoke exhaust,
projectile path, weapon tracking,
guided munition indicator --ar 1:1
```

---

## Implementation Notes

When implementing these expansion assets:

1. **Enum Extensions Required:**
   - Add new CraftType values: Scout, Bomber
   - Add new PlanetType values: Terran, GasGiant, IceWorld, OceanWorld
   - Add new BuildingType values: Factory, ResearchLab, DefenseShieldGenerator, MissileBattery, LaserBattery, PopulationHabitat, EnergyPlant, SpaceportTerminal
   - Add new AIPersonality value: Zealot

2. **Gameplay Systems Required:**
   - Scout reconnaissance mechanics (fog of war)
   - Bomber orbital bombardment mechanics
   - Research/tech tree system
   - Population growth mechanics
   - Advanced planetary defense system

3. **Asset Generation Priority:**
   - Generate spec-compliant assets first (see midjourney-master-prompts.md)
   - Add expansion assets in phases based on gameplay feature implementation
   - Maintain style consistency with core assets

---

**Document Version:** 1.0.0
**Created:** 2025-12-13
**Source:** Excised from midjourney-master-prompts.md
