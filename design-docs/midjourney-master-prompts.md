# Overlord - Midjourney Master Prompts Document

**Project:** Overlord (4X Strategy Game)
**Purpose:** Complete asset generation guide for Midjourney
**Style:** Isometric 2D, painterly crisp edges, matte sci-fi metal
**Date:** 2025-12-12
**Version:** 1.0.0

---

## Table of Contents

1. [Overview & Style Guide](#overview--style-guide)
2. [Complete Asset Inventory](#complete-asset-inventory)
3. [Master Prompt Templates](#master-prompt-templates)
4. [Asset Categories](#asset-categories)
   - [Spacecraft](#spacecraft)
   - [Planets](#planets)
   - [Spaceports & Infrastructure](#spaceports--infrastructure)
   - [Alien Races & Leaders](#alien-races--leaders)
   - [Battle Scenes](#battle-scenes)
   - [Buildings & Structures](#buildings--structures)
   - [Military Units](#military-units)
   - [UI Elements & Icons](#ui-elements--icons)
   - [Backgrounds & Environments](#backgrounds--environments)
   - [Scenario Cards](#scenario-cards)
5. [Variant Generation Guidelines](#variant-generation-guidelines)
6. [Quality Control & Acceptance Criteria](#quality-control--acceptance-criteria)
7. [Troubleshooting & Modifiers](#troubleshooting--modifiers)

---

## Overview & Style Guide

### Unified Visual Language

**Core Style Principles:**
- **Perspective:** Isometric 2D illustration (not 3D renders)
- **Medium:** Painterly yet crisp linework, readable at 1080p
- **Surface Language:** Mix of retro-industrial plating (bolts, vents) and sleek aerospace curves
- **Lighting:** Cool rim lights + warm bounce to keep metal readable on dark backgrounds
- **Finish:** Matte/satin metals (avoid chrome or reflective surfaces)
- **Environment Tone:** Lived-in frontier ports, sparsely populated orbits, nebula backdrops

### Faction Color Palette

**Player Faction (Blue):**
- Primary: `#2563EB` (Royal Blue)
- Accent: `#60A5FA` (Sky Blue)
- Glow: `#DBEAFE` (Light Blue)

**AI Opponent (Red):**
- Primary: `#DC2626` (Crimson)
- Accent: `#F87171` (Coral Red)
- Glow: `#FEE2E2` (Light Red)

**Neutral (Gray):**
- Primary: `#6B7280` (Steel Gray)
- Accent: `#9CA3AF` (Light Gray)
- Glow: `#E5E7EB` (Off-White)

**Secondary Accents:**
- Tech: `#14B8A6` (Teal) - sensors, energy systems
- Alert: `#F59E0B` (Amber) - warnings, hazards
- Exotic: `#A855F7` (Violet) - alien tech, anomalies

### Technical Specifications

**Target Resolutions:**
- **Map Sprites:** 512×512 px (planets, small craft)
- **Detail Art:** 1024×1024 px (planet close-ups, portraits)
- **Key Art:** 1600×900 px (spaceports, battle scenes)
- **Wide Scenes:** 1920×1080 px (backgrounds, cinematics)
- **UI Icons:** 128×128 px (resources, buttons)
- **Scenario Cards:** 900×500 px (Flash Conflict cards)

**Aspect Ratios for Midjourney:**
- Square: `--ar 1:1` (planets, icons, portraits)
- Landscape: `--ar 16:9` (battle scenes, backgrounds)
- Portrait: `--ar 2:3` (alien leader portraits)
- Card: `--ar 9:5` (scenario cards)

---

## Complete Asset Inventory

### Essential Assets (Priority 1)

**Spacecraft (5 types × 3 variants = 15 assets):**
- Scout (clean, upgraded, damaged)
- Battle Cruiser (clean, upgraded, damaged)
- Bomber (clean, upgraded, damaged)
- Atmosphere Processor (clean, deployed, malfunctioning)
- Transport Ship (clean, loaded, damaged)

**Planets (8 types × 3 ownership states = 24 assets):**
- Terran (neutral, player, AI)
- Volcanic (neutral, player, AI)
- Gas Giant (neutral, player, AI)
- Ice World (neutral, player, AI)
- Ocean World (neutral, player, AI)
- Desert (neutral, player, AI)
- Tropical (neutral, player, AI)
- Metropolis (neutral, player, AI)

**Spaceports & Infrastructure (12 assets):**
- Orbital Spaceport (civilian clean, civilian damaged, military clean, military damaged)
- Surface Starbase (clean, damaged, upgraded, heavily fortified)
- Space Station (trading hub, military outpost, research facility, refinery)

**Alien Races (4 archetypes × 2 variants = 8 assets):**
- Warlike Commander (aggressive pose, diplomatic pose)
- Technocrat Leader (calm pose, scheming pose)
- Merchant Prince (welcoming pose, shrewd pose)
- Zealot Prophet (serene pose, fervent pose)

**Buildings (10 types):**
- Mining Station
- Factory
- Research Lab
- Defense Shield Generator
- Missile Battery
- Laser Battery
- Atmosphere Processor (ground facility)
- Population Habitat
- Energy Plant
- Spaceport Terminal

**Battle Scenes (6 compositions):**
- Space Fleet Engagement (cruisers vs cruisers)
- Orbital Bombardment (ships firing on planet)
- Ground Invasion (platoons landing)
- Starbase Defense (station under siege)
- Scout Dogfight (small craft combat)
- Planetary Siege (full assault composition)

**UI Icons & Resources (15 assets):**
- Credits (coin/currency icon)
- Minerals (ore/crystal icon)
- Fuel (energy cell icon)
- Food (agriculture icon)
- Energy (power icon)
- Population (people icon)
- Morale (happiness icon)
- Turn Indicator
- Build Button
- Attack Button
- Defend Button
- End Turn Button
- Save/Load Icons
- Settings Icon
- Help Icon

**Backgrounds (6 assets):**
- Galaxy Map Starfield (low-contrast grid overlay)
- Nebula Backdrop (teal accent)
- Nebula Backdrop (amber accent)
- Nebula Backdrop (violet accent)
- Deep Space (minimal stars)
- Asteroid Field (background layer)

**Scenario Cards (8 assets):**
- Tutorial Card Template (gold colorway)
- Tactical Card Template (blue colorway)
- Genesis Device 101 (tutorial)
- First Contact Combat (tutorial)
- Defend Starbase (tactical)
- Terraform Rush (tactical)
- Invasion Landing (tactical)
- Economic Warfare (tactical)

**Total Essential Assets:** ~120 unique images

### Extended Assets (Priority 2)

**Military Units (6 assets):**
- Platoon (Standard Equipment)
- Platoon (Elite Equipment)
- Platoon (Advanced Weapons)
- Mechanized Unit
- Drop Pod
- Garrison Troops

**Environmental Details (8 assets):**
- Space Debris Field
- Asteroid Cluster
- Comet/Ice Field
- Satellite Network
- Trade Route Markers
- Warp Gate
- Sensor Array
- Communication Relay

**VFX & Effects (10 assets):**
- Explosion (small)
- Explosion (large)
- Weapon Muzzle Flash
- Shield Impact
- Warp Trail
- Engine Glow
- Construction Sparks
- Damage Smoke
- Energy Beam
- Missile Trail

**Total Extended Assets:** ~24 additional images

**GRAND TOTAL:** ~144 unique assets

---

## Master Prompt Templates

### Midjourney Base Template

```
isometric 2D illustration, painterly yet crisp linework, matte sci-fi metal,
cool rimlight + warm bounce, {SUBJECT}, {FACTION_COLORS}, nebula parallax background,
clean composition, medium detail readable at 1080p, no typography --ar {RATIO}
```

### Subject-Specific Templates

**Spacecraft Template:**
```
isometric 2D {SHIP_TYPE} silhouette, {DESIGN_NOTES}, {FACTION_COLOR} accent lighting,
recessed turrets, matte armor plating, cool rim + warm bounce,
orbiting {PLANET_TYPE}, crisp edges, no text --ar 16:9
```

**Planet Template:**
```
isometric planet sprite, {PLANET_TYPE} with {SURFACE_FEATURES}, consistent rim lighting,
{FACTION_COLOR} orbital markers/stations, atmosphere glow, painterly clouds,
day/night terminator, crisp limb, deep space background --ar 1:1
```

**Portrait Template:**
```
isometric head-and-shoulders portrait of {ALIEN_TYPE}, {DISTINGUISHING_FEATURES},
{FACTION_COLOR} uniform/regalia, neutral gray backdrop, cool lighting,
painterly but crisp facial details, no background clutter --ar 2:3
```

**Battle Scene Template:**
```
isometric 2D fleet engagement, {UNIT_TYPES} exchanging fire, missile trails,
shield flare arcs, debris silhouettes, {FACTION_COLORS} for identification,
nebula backdrop with parallax depth, cinematic composition, clean foreground --ar 16:9
```

**UI Icon Template:**
```
simple isometric icon, {ICON_SUBJECT}, minimal shading, monochrome-friendly,
clean silhouette, 128×128 optimized, crisp edges, no text,
SVG-style clarity --ar 1:1
```

---

## Asset Categories

## Spacecraft

### 1. Scout Ship

**Purpose:** Fast reconnaissance craft, early exploration, cheap disposable unit

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
- Readable at 512×256 resolution

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

### 2. Battle Cruiser

**Purpose:** Main combat vessel, troop transport, orbital superiority

**Master Prompt:**
```
isometric 2D battle cruiser, armored prow, recessed turret hardpoints,
blue command bridge lighting, angular fins, matte battleship gray,
cool rim + warm engine glow, orbiting volcanic colony,
crisp edges, medium detail --ar 16:9
```

**Acceptance Criteria:**
- Clearly larger/heavier than Scout
- Multiple weapon emplacements visible
- Cargo bay section identifiable
- Blue faction identification clear
- Imposing military silhouette
- Readable at 512×256 resolution

**Variant: Battle Cruiser (Upgraded)**
```
isometric 2D battle cruiser, modular armor plates, extended sensor mast,
upgraded twin engine clusters, reinforced prow ram, blue dorsal stripe,
teal targeting arrays, matte finish, enhanced detail --ar 16:9
```

**Variant: Battle Cruiser (Damaged)**
```
isometric 2D battle cruiser, plasma scoring across hull, exposed internal structure,
destroyed turret emplacement, atmosphere venting, sparking conduits,
red emergency strobes, limping with one engine disabled --ar 16:9
```

**Variant: Battle Cruiser (Combat Firing)**
```
isometric 2D battle cruiser mid-broadside, missile salvos launching,
muzzle flashes from turrets, blue shield flare arcs, red incoming tracers,
debris trails, engaging enemy cruiser --ar 16:9
```

**Modifiers if proportions wrong:**
- Add: "heavy capital ship", "larger than escort vessels"
- Reduce: "simplified weapon details" if too cluttered
- Emphasize: "distinct command bridge", "cargo bay doors visible"

**Continuity Notes:**
- Hull shape must remain consistent (especially prow, bridge, engine cluster)
- Blue trim location locked (dorsal stripe, bridge windows)
- Damage appears on existing hull sections
- Upgraded version adds external modules, doesn't change base geometry

---

### 3. Bomber

**Purpose:** Planetary bombardment, anti-structure attacks

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
- Readable at 512×256 resolution

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

### 4. Atmosphere Processor (Genesis Device)

**Purpose:** Terraform neutral planets, convert to player ownership

**Master Prompt:**
```
isometric 2D atmosphere processor craft, spherical terraforming core,
radiating heat exchangers, blue chemical injection ports, industrial scaffolding,
matte utility yellow/gray panels, cool rim + warm core glow,
approaching barren planet, functional design --ar 16:9
```

**Acceptance Criteria:**
- Visually distinct from combat ships (civilian/industrial aesthetic)
- Spherical or cylindrical core component obvious
- "Terraforming equipment" recognizable
- Blue faction trim minimal (utilitarian)
- Non-threatening silhouette
- Readable at 512×256 resolution

**Variant: Atmosphere Processor (Deployed on Surface)**
```
isometric 2D atmosphere processor deployed, rooted to planet surface,
processing towers extending upward, blue energy field dome,
atmospheric clouds forming, steam vents, ground facility mode --ar 1:1
```

**Variant: Atmosphere Processor (Malfunctioning)**
```
isometric 2D atmosphere processor, core overheating, red warning strobes,
venting excess gas, sparking heat exchangers, emergency shutdown in progress,
amber hazard lights --ar 16:9
```

**Modifiers if looks too militarized:**
- Add: "civilian industrial design", "utility vehicle aesthetic"
- Remove: weapon hardpoints, aggressive angles
- Emphasize: "exposed machinery", "scaffolding", "chemical tanks"

**Continuity Notes:**
- Core sphere/cylinder shape must remain constant
- Heat exchanger configuration locked
- Blue trim only on functional systems (ports, monitoring equipment)
- Deployed variant shows same core in vertical ground installation

---

### 5. Transport Ship (Cargo Hauler)

**Purpose:** Resource transport, civilian trade, non-combat logistics

**Master Prompt:**
```
isometric 2D cargo transport, modular shipping containers, exposed cargo racks,
minimal armor, blue navigation lights, matte civilian gray/white,
bulk freighter proportions, cool rim + warm running lights,
docking at orbital station --ar 16:9
```

**Acceptance Criteria:**
- Clearly non-military (civilian aesthetic)
- Cargo containers/modules visible
- Larger than combat ships (bulk hauler)
- Minimal/no weapons
- Blue faction trim subtle (company logo area)
- Readable at 512×256 resolution

**Variant: Transport Ship (Loaded - Full Containers)**
```
isometric 2D cargo transport, fully loaded container racks,
stacked modular cargo pods, blue manifest holograms,
heavily laden, low thrust maneuvering --ar 16:9
```

**Variant: Transport Ship (Damaged - Pirate Raid)**
```
isometric 2D cargo transport, breached hull, cargo containers floating free,
venting atmosphere, emergency beacons, disabled engines,
distress signal active --ar 16:9
```

**Modifiers if too sleek:**
- Add: "industrial freighter", "bulk hauler aesthetic"
- Emphasize: "boxy proportions", "modular containers"
- Remove: elegant curves, streamlined design

**Continuity Notes:**
- Container rack configuration consistent
- Engine placement unchanged
- Containers can vary in color (cargo type) but rack geometry fixed
- Damage shows on containers AND hull

---

## Planets

### General Planet Guidelines

**All planets need 3 variants:**
1. **Neutral** - Gray orbital markers, no faction infrastructure
2. **Player-Owned** - Blue orbital stations, player color glow
3. **AI-Owned** - Red orbital markers, AI color glow

**Shared Planet Specifications:**
- 512×512 px for map sprites
- 1024×1024 px for detail views
- Day/night terminator line visible
- Consistent rim lighting (cool blue-white)
- Painterly cloud layers
- Crisp limb edge

---

### 6. Terran (Earth-like) Planet

**Purpose:** Balanced resources, human-habitable, starter planet type

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
- Readable at 512×512 resolution

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
- Terminator line position consistent (45° from viewer)
- Only orbital elements change color (planet surface identical)

---

### 7. Volcanic Planet

**Purpose:** High minerals, harsh environment, military importance

**Master Prompt (Neutral):**
```
isometric planet sprite, volcanic world, dark basalt continents,
red-orange lava fissures, ash gray atmosphere, glowing lava flows,
day/night terminator, gray neutral orbital markers, consistent rim lighting,
heat distortion subtle, crisp limb --ar 1:1
```

**Acceptance Criteria:**
- Lava flows clearly visible (red-orange glow)
- Dark surface (basalt/obsidian appearance)
- Volcanic activity obvious (not just "red planet")
- Heat signatures visible
- Neutral gray orbital markers
- Readable at 512×512 resolution

**Variant: Volcanic (Player-Owned)**
```
isometric volcanic planet, lava fissures, ash atmosphere,
blue mining orbital stations, blue heat-resistant infrastructure,
blue faction beacons, industrial mining operations --ar 1:1
```

**Variant: Volcanic (AI-Owned)**
```
isometric volcanic planet, lava rivers, dark continents,
red orbital military fortresses, red faction industrial complexes,
red warning strobes, heavily militarized --ar 1:1
```

**Modifiers if lava not prominent:**
- Add: "bright lava rivers", "glowing magma fissures"
- Emphasize: "volcanic activity", "heat signatures"
- Increase: lava brightness, glowing cracks

**Continuity Notes:**
- Lava flow patterns locked across variants
- Dark surface color consistent
- Only orbital infrastructure changes
- Heat glow constant (not affected by ownership)

---

### 8. Gas Giant Planet

**Purpose:** Fuel harvesting, no surface settlements, atmospheric mining

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
- Readable at 512×512 resolution

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

### 9. Ice World

**Purpose:** Water resources (frozen), cold environment, defensive value

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
- Readable at 512×512 resolution

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

### 10. Ocean World

**Purpose:** Food production, water abundance, trade importance

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
- Readable at 512×512 resolution

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

### 11. Desert Planet

**Purpose:** Harsh environment, mineral wealth, low food production

**Master Prompt (Neutral):**
```
isometric planet sprite, desert world, orange-tan sand dunes,
rocky badlands, dust storm bands, minimal water (polar ice caps only),
day/night terminator, gray neutral orbital shelters,
consistent warm rim lighting, crisp dune details --ar 1:1
```

**Acceptance Criteria:**
- Sand/dust dominant (orange-tan color)
- Dune patterns visible
- Minimal water (tiny polar caps acceptable)
- Dust storms present
- Neutral gray orbital stations
- Readable at 512×512 resolution

**Variant: Desert (Player-Owned)**
```
isometric desert planet, sand dunes, rocky terrain, dust storms,
blue orbital mining bases, blue faction moisture farms,
blue beacons, industrial extraction operations --ar 1:1
```

**Variant: Desert (AI-Owned)**
```
isometric desert planet, orange sands, badlands, dust bands,
red orbital military outposts, red faction resource extraction,
red warning strobes, fortified mining complexes --ar 1:1
```

**Modifiers if too Earth-like:**
- Add: "arid desert", "no oceans", "minimal vegetation"
- Emphasize: "sand dune patterns", "dust storm coverage"
- Remove: green areas, large water bodies

**Continuity Notes:**
- Dune field patterns consistent
- Dust storm bands stay in same latitudes
- Polar ice caps constant (if present)
- Only orbital infrastructure faction-colored

---

### 12. Tropical Planet

**Purpose:** High food production, dense vegetation, population growth

**Master Prompt (Neutral):**
```
isometric planet sprite, tropical jungle world, vibrant green continents,
blue-green shallow seas, white cloud coverage (50%),
lush vegetation visible, day/night terminator,
gray neutral orbital stations, consistent rim lighting,
painterly jungle texture --ar 1:1
```

**Acceptance Criteria:**
- Vibrant green dominant (vegetation)
- Water present (blue-green seas)
- Cloud coverage moderate
- "Lush" aesthetic obvious
- Neutral gray orbital platforms
- Readable at 512×512 resolution

**Variant: Tropical (Player-Owned)**
```
isometric tropical planet, green jungles, shallow seas, cloud bands,
blue orbital agricultural hubs, blue faction beacons,
blue settlement lights, farming infrastructure --ar 1:1
```

**Variant: Tropical (AI-Owned)**
```
isometric tropical planet, dense vegetation, seas, cloud coverage,
red orbital population centers, red faction industrial zones,
red warning lights, developed infrastructure --ar 1:1
```

**Modifiers if vegetation unclear:**
- Add: "dense jungle", "lush vegetation coverage"
- Emphasize: "vibrant green", "tropical climate"
- Increase: green saturation, vegetation detail

**Continuity Notes:**
- Continent shapes locked
- Vegetation coverage constant
- Cloud patterns vary slightly but same density
- Ocean color consistent (blue-green shallow water aesthetic)

---

### 13. Metropolis Planet (City World)

**Purpose:** High population, advanced infrastructure, economic center

**Master Prompt (Neutral):**
```
isometric planet sprite, metropolis city-world, urban sprawl covering continents,
city lights visible on night side, metallic structures,
industrial haze atmosphere, space elevator tethers,
gray neutral orbital trade stations, consistent rim lighting,
painterly city texture, heavily developed --ar 1:1
```

**Acceptance Criteria:**
- City lights obvious (especially on night side)
- Urbanized surface clear
- Industrial aesthetic (not natural)
- Space infrastructure visible (elevators, platforms)
- Neutral gray trade stations
- Readable at 512×512 resolution

**Variant: Metropolis (Player-Owned)**
```
isometric metropolis planet, city lights grid pattern, urban sprawl,
industrial zones, blue orbital commerce hubs,
blue faction skyscrapers, blue navigation beacons,
advanced player infrastructure --ar 1:1
```

**Variant: Metropolis (AI-Owned)**
```
isometric metropolis planet, dense city lights, urban coverage,
industrial districts, red orbital military command stations,
red faction fortress towers, red surveillance grid,
heavily fortified capital --ar 1:1
```

**Modifiers if looks natural:**
- Add: "completely urbanized", "city world", "no natural terrain"
- Emphasize: "city lights", "metallic structures", "industrial coverage"
- Remove: forests, oceans, natural features

**Continuity Notes:**
- City light grid pattern locked
- Urban density constant
- Space elevator positions consistent
- Only orbital and some city districts change faction colors

---

## Spaceports & Infrastructure

### 14. Orbital Spaceport (Civilian)

**Purpose:** Trade hub, civilian docking, economic center

**Master Prompt (Clean):**
```
isometric 2D orbital spaceport hub, concentric docking rings,
civilian cargo haulers docked, blue guidance landing strips,
matte gray/white civilian decks, soft shadows, maintenance crews visible,
clean condition, painterly details, nebula backdrop --ar 16:9
```

**Acceptance Criteria:**
- Docking rings obvious (concentric structure)
- Civilian ships present (not military)
- Blue civilian navigation lights
- Clean, maintained appearance
- Non-military aesthetic clear
- Readable at 1600×900 resolution

**Variant: Orbital Spaceport (Damaged)**
```
isometric 2D orbital spaceport, docking rings breached,
hull sections venting atmosphere, emergency repair crews,
amber hazard strobes, damaged solar panels, debris field,
civilian ships evacuating --ar 16:9
```

**Variant: Orbital Spaceport (Busy Trade Hub)**
```
isometric 2D orbital spaceport, multiple civilian ships docking,
cargo transfer in progress, blue trade beacons active,
crowded docking bays, merchant vessels queuing,
bustling commerce activity --ar 16:9
```

**Modifiers if too militarized:**
- Add: "civilian trade station", "commercial hub aesthetic"
- Remove: weapons, armor plating, military vessels
- Emphasize: "cargo docks", "merchant traffic", "trade beacons"

**Continuity Notes:**
- Docking ring configuration constant
- Central hub module unchanged
- Damage shows on existing structures
- Ship traffic varies by variant (clean=few, busy=many)

---

### 15. Military Starbase

**Purpose:** Fleet command, orbital defense, military production

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
- Readable at 1600×900 resolution

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

### 16. Space Station (Research Facility)

**Purpose:** Scientific research, technology development

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
- Readable at 1600×900 resolution

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

### 17. Space Station (Refinery)

**Purpose:** Resource processing, fuel production, industrial center

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
- Readable at 1600×900 resolution

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

## Alien Races & Leaders

### Portrait Specifications

**All alien portraits:**
- 1024×1536 resolution (vertical portrait)
- Head-and-shoulders framing
- Neutral gray backdrop
- Cool rimlight + slight fill
- Faction color in uniform/regalia elements
- Painterly but crisp facial details
- No background clutter

---

### 18. Warlike Commander (Aggressive Archetype)

**Purpose:** Military-focused AI personality, aggressive expansion

**Master Prompt (Aggressive Pose):**
```
isometric head-and-shoulders portrait, warlike alien commander,
scaled reptilian skin, bone crest helmet, scarred face,
red faction military sash, armor pauldrons, fierce expression,
glowing red eyes, neutral gray backdrop, cool lighting,
painterly details, imposing presence --ar 2:3
```

**Acceptance Criteria:**
- Clearly militaristic (armor, weapons, scars)
- Red faction identification (sash, insignia)
- Intimidating appearance
- Reptilian/harsh features
- Battle-hardened aesthetic
- Facial details readable at 1024×1536

**Variant: Warlike Commander (Diplomatic Pose)**
```
isometric portrait, warlike alien commander, scaled skin,
bone crest, controlled expression, red diplomatic robes,
formal military regalia, stern but negotiating,
neutral gray backdrop --ar 2:3
```

**Modifiers if not intimidating:**
- Add: "battle scars", "fierce expression", "warrior culture"
- Emphasize: "reptilian features", "armored appearance"
- Increase: red eye glow, aggressive posture

**Continuity Notes:**
- Facial structure constant (scales, bone crest)
- Red faction elements locked (sash, insignia placement)
- Pose/expression varies (aggressive vs diplomatic)
- Armor style consistent (even in diplomatic variant)

---

### 19. Technocrat Leader (Intellectual Archetype)

**Purpose:** Technology-focused AI personality, research-driven

**Master Prompt (Calm Pose):**
```
isometric head-and-shoulders portrait, technocrat alien,
bioluminescent circuitry on skin, sleek neural interface mask,
violet HUD reflections in eyes, blue faction lab coat,
calm analytical expression, smooth features,
neutral gray backdrop, cool lighting,
tech integration visible --ar 2:3
```

**Acceptance Criteria:**
- Technology integrated into body (cybernetics, implants)
- Blue faction identification (lab coat, badge)
- Intelligent/analytical appearance
- Violet tech accents (exotic technology)
- Smooth, cerebral features
- Readable at 1024×1536

**Variant: Technocrat (Scheming Pose)**
```
isometric portrait, technocrat alien, bioluminescent circuits,
neural mask, violet HUD active, blue faction coat,
calculating expression, data streaming across eyes,
plotting demeanor, neutral backdrop --ar 2:3
```

**Modifiers if tech unclear:**
- Add: "cybernetic implants visible", "neural interface active"
- Emphasize: "bioluminescent circuitry", "violet tech glow"
- Increase: HUD reflections, tech integration

**Continuity Notes:**
- Bioluminescent circuit pattern locked
- Neural mask design constant
- Blue faction coat unchanged
- Violet HUD always present
- Expression/posture varies

---

### 20. Merchant Prince (Economic Archetype)

**Purpose:** Trade-focused AI personality, economic expansion

**Master Prompt (Welcoming Pose):**
```
isometric head-and-shoulders portrait, alien merchant prince,
layered ornate fabrics, gold filigree tech jewelry,
blue faction trade guild pendant, welcoming smile,
smooth diplomatic features, calm expression,
neutral gray backdrop, warm accent lighting,
wealthy aesthetic --ar 2:3
```

**Acceptance Criteria:**
- Wealthy appearance (jewelry, fine clothes)
- Blue faction identification (guild pendant)
- Approachable/friendly demeanor
- Trade/commerce symbolism
- Sophisticated features
- Readable at 1024×1536

**Variant: Merchant Prince (Shrewd Pose)**
```
isometric portrait, merchant prince, ornate robes,
gold tech filigree, blue trade pendant,
calculating smile, appraising expression,
deal-making demeanor, neutral backdrop --ar 2:3
```

**Modifiers if not wealthy enough:**
- Add: "opulent jewelry", "fine fabrics", "gold accents"
- Emphasize: "merchant aesthetic", "trade symbols"
- Increase: gold filigree, ornate details

**Continuity Notes:**
- Facial structure unchanged
- Gold filigree pattern consistent
- Blue trade pendant locked in position
- Robes same design (different draping)
- Expression varies (welcoming vs shrewd)

---

### 21. Zealot Prophet (Religious Archetype)

**Purpose:** Ideological AI personality, fanatical expansion

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
- Readable at 1024×1536

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

## Battle Scenes

### Battle Scene Specifications

**All battle scenes:**
- 1920×1080 resolution (wide cinematic)
- Isometric perspective maintained
- Clear foreground/midground/background layers
- Faction colors for unit identification
- Nebula backdrop with parallax depth
- Missile trails, explosions, energy beams
- Debris and battle damage visible

---

### 22. Space Fleet Engagement (Cruiser vs Cruiser)

**Purpose:** Main battle visualization, campaign combat result backdrop

**Master Prompt:**
```
isometric 2D fleet engagement, blue battle cruisers exchanging fire with red enemy cruisers,
missile trails crisscrossing, shield flare impacts, turret muzzle flashes,
debris silhouettes floating, blue player ships on left, red AI ships on right,
nebula backdrop with teal parallax depth, cinematic composition,
clean foreground detail, medium background --ar 16:9
```

**Acceptance Criteria:**
- Blue and red factions clearly distinguishable
- Multiple ships engaged (4-6 total)
- Weapon fire obvious (missiles, beams, bullets)
- Shield impacts visible
- Debris field present
- Cinematic composition (not cluttered)
- Readable at 1920×1080

**Variant: Fleet Engagement (Player Winning)**
```
isometric 2D space battle, blue cruisers dominant position,
red enemy ships damaged and retreating, blue victory formation,
red ships venting atmosphere, debris favoring player,
blue shields strong, red shields failing --ar 16:9
```

**Variant: Fleet Engagement (Player Losing)**
```
isometric 2D space battle, red cruisers overwhelming blue player fleet,
blue ships heavily damaged, red dominant firepower,
blue vessels retreating, red missiles incoming,
defensive stance failing --ar 16:9
```

**Modifiers if too cluttered:**
- Add: "clean composition", "readable silhouettes"
- Reduce: number of ships (max 6 total)
- Emphasize: "clear foreground", "faction colors distinct"

**Continuity Notes:**
- Ship designs match previously established craft
- Blue always left/bottom, red always right/top (consistent orientation)
- Nebula backdrop same across battle variants
- Debris field density varies but same art style

---

### 23. Orbital Bombardment Scene

**Purpose:** Bomber attack visualization, bombardment mission result

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
- Readable at 1920×1080

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

### 24. Ground Invasion Scene

**Purpose:** Platoon landing visualization, invasion result backdrop

**Master Prompt:**
```
isometric 2D ground invasion, blue drop pods landing on planet surface,
blue platoons deploying from pods, red defending platoons in fortified positions,
ground combat exchange, explosions, blue battle cruiser overhead providing support,
planet surface terrain, smoke and debris, troops engaging --ar 16:9
```

**Acceptance Criteria:**
- Blue attackers landing (pods, troops)
- Red defenders in position
- Ground combat obvious
- Battle cruiser support visible overhead
- Planet surface terrain clear
- Troop engagement readable
- Readable at 1920×1080

**Variant: Invasion (Beachhead Secured)**
```
isometric 2D invasion, blue platoons established beachhead,
red defenders retreating, blue drop zone secured,
blue forces advancing, terrain controlled,
victory imminent --ar 16:9
```

**Variant: Invasion (Invasion Repelled)**
```
isometric 2D invasion, red defenders victorious,
blue platoons falling back to drop pods,
red positions held, blue retreat in progress,
defensive victory --ar 16:9
```

**Modifiers if troops unclear:**
- Add: "ground troops visible", "platoon formations"
- Emphasize: "drop pods landing", "infantry combat"
- Increase: troop count (show squads, not individuals)

**Continuity Notes:**
- Drop pod design consistent
- Battle cruiser matches established design
- Blue always invading, red always defending (per game logic)
- Terrain type varies (match planet being invaded)

---

### 25. Starbase Defense Scene

**Purpose:** Station under siege visualization, defense mission backdrop

**Master Prompt:**
```
isometric 2D starbase defense, blue military starbase firing all weapons,
red enemy fleet surrounding and attacking, blue shield dome flickering under fire,
blue defensive turrets active, red battle cruisers pressing assault,
missile exchanges, debris field, starbase damaged but fighting --ar 16:9
```

**Acceptance Criteria:**
- Blue starbase central (from infrastructure catalog)
- Red attackers surrounding
- Defensive fire obvious
- Shield impacts visible
- Station taking damage
- Cinematic siege composition
- Readable at 1920×1080

**Variant: Starbase Defense (Holding)**
```
isometric 2D starbase defense, blue station repelling red attackers,
red ships damaged and withdrawing, blue shields holding,
blue defensive victory, enemy fleet retreating --ar 16:9
```

**Variant: Starbase Defense (Falling)**
```
isometric 2D starbase defense, blue station heavily damaged,
shields failing, red fleet overwhelming, station sections exploding,
blue defenders evacuating, imminent capture --ar 16:9
```

**Modifiers if not dramatic:**
- Add: "intense battle", "desperate defense"
- Emphasize: "starbase under siege", "overwhelming attack"
- Increase: explosion count, weapon fire density

**Continuity Notes:**
- Starbase design matches established military starbase
- Red fleet uses established cruiser designs
- Shield effect consistent (blue hemisphere)
- Damage progression logical (light → heavy)

---

### 26. Scout Dogfight Scene

**Purpose:** Small craft combat visualization, scout mission backdrop

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
- Readable at 1920×1080

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

### 27. Planetary Siege (Full Assault Composition)

**Purpose:** Epic campaign climax visualization, final battle backdrop

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
- Readable at 1920×1080

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

## Buildings & Structures

### Building Specifications

**All buildings:**
- Isometric 2D view (not top-down)
- 512×512 px for sprites
- Faction-colored elements (blue for player, red for AI, gray for neutral/under construction)
- Matte industrial materials
- Functional design (purpose obvious from appearance)
- Background compatible (transparent or planet surface context)

---

### 28. Mining Station

**Purpose:** Mineral extraction, resource production

**Master Prompt:**
```
isometric 2D mining station, industrial drill equipment,
ore processing tower, mineral conveyor systems, blue faction lights,
matte gray/yellow industrial metal, excavation machinery,
ore piles visible, functional mining aesthetic,
planet surface context --ar 1:1
```

**Acceptance Criteria:**
- Drilling/excavation equipment visible
- Ore processing obvious
- Blue faction identification
- Industrial aesthetic
- Minerals visible (ore piles, conveyors)
- Readable at 512×512

**Variant: Mining Station (Under Construction)**
```
isometric 2D mining station, partial construction,
scaffolding visible, gray neutral materials,
construction equipment active, incomplete drill tower,
building in progress --ar 1:1
```

**Variant: Mining Station (High Output)**
```
isometric 2D mining station, drills at full capacity,
ore conveyors running, blue lights bright,
mineral piles large, maximum production --ar 1:1
```

**Modifiers if purpose unclear:**
- Add: "drill equipment prominent", "ore processing visible"
- Emphasize: "mining operation", "mineral extraction"
- Increase: drill size, ore pile detail

**Continuity Notes:**
- Drill tower design constant
- Conveyor configuration unchanged
- Blue faction lights locked position
- Under construction shows same design incomplete
- High output shows same design with activity

---

### 29. Factory

**Purpose:** Spacecraft and platoon production

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
- Readable at 512×512

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

### 30. Research Lab

**Purpose:** Technology upgrade research

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
- Readable at 512×512

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

### 31. Defense Shield Generator

**Purpose:** Planetary defense, damage reduction

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
- Readable at 512×512

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

### 32. Missile Battery

**Purpose:** Planetary defense, anti-ship attacks

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
- Readable at 512×512

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

### 33. Laser Battery

**Purpose:** Planetary defense, anti-ship attacks

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
- Readable at 512×512

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

### 34. Atmosphere Processor (Ground Facility)

**Purpose:** Terraforming infrastructure (post-deployment)

**Master Prompt:**
```
isometric 2D atmosphere processor facility, terraforming towers,
blue chemical injection vents, atmospheric converters,
blue faction lights, processing equipment, steam/gas vents,
industrial terraforming aesthetic, planet surface installation --ar 1:1
```

**Acceptance Criteria:**
- Terraforming equipment visible (towers, vents)
- Blue faction identification
- Industrial processing aesthetic
- Atmosphere conversion obvious
- Different from space-based processor
- Readable at 512×512

**Variant: Atmosphere Processor (Active Terraforming)**
```
isometric 2D processor facility, terraforming towers active,
blue energy field dome, atmospheric clouds forming,
steam vents releasing, conversion in progress --ar 1:1
```

**Modifiers if unclear purpose:**
- Add: "terraforming towers", "atmospheric conversion"
- Emphasize: "chemical vents", "gas processing"
- Increase: vent activity, steam effects

**Continuity Notes:**
- Tower configuration constant
- Vent positions locked
- Blue faction lights consistent
- Active variant shows same structure processing

---

### 35. Population Habitat

**Purpose:** Population capacity, morale improvement

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
- Readable at 512×512

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

### 36. Energy Plant

**Purpose:** Energy resource production

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
- Readable at 512×512

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

### 37. Spaceport Terminal (Ground Facility)

**Purpose:** Trade, spacecraft landing, economy

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
- Readable at 512×512

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

## Military Units

### Unit Specifications

**All military units:**
- Isometric 2D view
- 256×256 px sprites
- Faction-colored elements (blue/red/gray)
- Ground-based (not space units)
- Equipment level visually distinct
- Troop formation readable

---

### 38. Platoon (Standard Equipment)

**Purpose:** Basic ground forces, planetary defense/invasion

**Master Prompt:**
```
isometric 2D platoon formation, squad of 8-12 soldiers,
blue faction armor, standard equipment rifles,
matte gray/blue military gear, tactical formation,
ground troops visible, military unit aesthetic --ar 1:1
```

**Acceptance Criteria:**
- Individual soldiers visible (not abstract)
- Blue faction identification (armor color)
- Standard equipment obvious (rifles, basic gear)
- Formation clear (squad layout)
- Military appearance
- Readable at 256×256

**Variant: Platoon (Standard - Red Faction)**
```
isometric 2D platoon, 8-12 soldiers, red faction armor,
standard rifles, tactical formation, red military unit --ar 1:1
```

**Modifiers if soldiers unclear:**
- Add: "individual soldiers visible", "squad formation"
- Emphasize: "ground troops", "military personnel"
- Increase: soldier detail, armor clarity

**Continuity Notes:**
- Formation layout constant
- Equipment level locked (standard rifles, light armor)
- Faction color only difference between blue/red variants
- Soldier count consistent

---

### 39. Platoon (Elite Equipment)

**Purpose:** Advanced ground forces, stronger combat units

**Master Prompt:**
```
isometric 2D elite platoon formation, squad of 8-12 soldiers,
blue faction heavy armor, advanced weapons (heavy rifles/launchers),
matte dark blue/gray military gear, tactical formation,
elite troops visible, upgraded equipment obvious --ar 1:1
```

**Acceptance Criteria:**
- Heavier armor than Standard (visually bulkier)
- Advanced weapons visible (different from standard)
- Blue faction identification
- Elite aesthetic (more armored, better equipped)
- Formation clear
- Readable at 256×256

**Variant: Platoon (Elite - Red Faction)**
```
isometric 2D elite platoon, heavy armor, advanced weapons,
red faction gear, tactical formation, elite red troops --ar 1:1
```

**Modifiers if not distinct from Standard:**
- Add: "heavy armor plating", "advanced weapons visible"
- Emphasize: "elite troops", "upgraded equipment"
- Increase: armor bulk, weapon size

**Continuity Notes:**
- Formation matches Standard platoon layout
- Equipment clearly heavier/better
- Faction color system consistent
- Soldier count same as Standard (equipment is upgrade, not numbers)

---

### 40. Platoon (Advanced Weapons)

**Purpose:** Specialized combat units, anti-vehicle capability

**Master Prompt:**
```
isometric 2D advanced weapons platoon, squad of 8-12 soldiers,
blue faction tactical armor, heavy weapons (rocket launchers, cannons),
matte blue/gray military gear, specialized formation,
heavy weapons squad visible, anti-vehicle equipment --ar 1:1
```

**Acceptance Criteria:**
- Heavy weapons obvious (launchers, cannons)
- Different from Elite (weapons focus, not armor)
- Blue faction identification
- Specialized role clear
- Formation clear
- Readable at 256×256

**Variant: Platoon (Advanced Weapons - Red Faction)**
```
isometric 2D advanced weapons platoon, heavy weapons squad,
red faction gear, rocket launchers visible, specialized red troops --ar 1:1
```

**Modifiers if not distinct:**
- Add: "heavy weapons prominent", "rocket launchers", "anti-vehicle"
- Emphasize: "specialized weapons squad"
- Increase: weapon size, launcher detail

**Continuity Notes:**
- Formation matches other platoons
- Weapons are key differentiator (not armor)
- Faction color consistent
- Soldier count same

---

### 41. Mechanized Unit (Vehicles)

**Purpose:** Armored ground forces, high combat power

**Master Prompt:**
```
isometric 2D mechanized unit, 2-3 armored vehicles,
blue faction tank/APC design, matte military gray/blue,
vehicle turrets visible, ground combat vehicles,
armored formation --ar 1:1
```

**Acceptance Criteria:**
- Vehicles clearly visible (not infantry)
- Blue faction identification
- Armored aesthetic (tanks, APCs)
- Multiple vehicles (formation)
- Military ground vehicle design
- Readable at 256×256

**Variant: Mechanized Unit (Red Faction)**
```
isometric 2D mechanized unit, armored vehicles,
red faction tanks/APCs, turrets visible, red military vehicles --ar 1:1
```

**Modifiers if unclear:**
- Add: "armored vehicles", "tanks and APCs"
- Emphasize: "ground combat vehicles", "mechanized warfare"
- Increase: vehicle detail, turret prominence

**Continuity Notes:**
- Vehicle designs constant
- Formation layout consistent
- Faction color on vehicles
- Number of vehicles same

---

### 42. Drop Pod

**Purpose:** Orbital insertion, invasion delivery system

**Master Prompt:**
```
isometric 2D drop pod, single atmospheric entry pod,
blue faction markings, matte gray heat-resistant shell,
retro-rocket nozzles, compact troop carrier,
landing configuration visible --ar 1:1
```

**Acceptance Criteria:**
- Single pod unit (not multiple)
- Blue faction identification
- Heat shielding visible
- Retro rockets obvious
- Troop carrier purpose clear
- Readable at 256×256

**Variant: Drop Pod (Landing)**
```
isometric 2D drop pod landing, retro rockets firing,
blue exhaust, descent in progress, troops deploying --ar 1:1
```

**Modifiers if unclear:**
- Add: "atmospheric entry pod", "troop carrier"
- Emphasize: "landing configuration", "retro rockets"
- Increase: rocket detail, faction markings

**Continuity Notes:**
- Pod shell design constant
- Rocket positions locked
- Blue faction markings consistent
- Landing variant shows same pod descending

---

### 43. Garrison Troops (Defensive Posture)

**Purpose:** Planet defense forces, static defenders

**Master Prompt:**
```
isometric 2D garrison troops, squad of 8-12 soldiers in defensive positions,
blue faction armor, defensive emplacements (sandbags, barriers),
entrenched posture, static defense formation,
fortified position visible --ar 1:1
```

**Acceptance Criteria:**
- Defensive posture obvious (not advancing)
- Blue faction identification
- Fortifications present (barriers, cover)
- Static defense aesthetic
- Entrenched appearance
- Readable at 256×256

**Variant: Garrison Troops (Red Faction)**
```
isometric 2D garrison troops, defensive positions,
red faction armor, fortified emplacements, red defenders --ar 1:1
```

**Modifiers if looks like regular platoon:**
- Add: "defensive emplacements", "fortified positions"
- Emphasize: "entrenched", "static defense", "barriers"
- Increase: fortification detail

**Continuity Notes:**
- Soldier appearance matches platoon designs
- Formation is defensive (spread, in cover)
- Faction color consistent
- Barriers/emplacements constant

---

## UI Elements & Icons

### Icon Specifications

**All UI icons:**
- 128×128 px (some may need 256×256 for detail)
- Isometric or flat design (icon-appropriate)
- Monochrome-friendly (readable in grayscale)
- Clean silhouette (recognizable at small size)
- No text labels
- SVG-style clarity
- Faction colors where appropriate (blue/red/gray accents)

---

### 44. Credits Icon

**Purpose:** Currency/economy resource indicator

**Master Prompt:**
```
simple isometric icon, currency coin stack, metallic gold/silver,
minimal shading, clean silhouette, 128×128 optimized,
crisp edges, no text, SVG-style clarity --ar 1:1
```

**Acceptance Criteria:**
- Coin/currency obvious
- Metallic appearance
- Clean, simple design
- Readable at 128×128
- Monochrome-friendly (works in grayscale)

**Modifiers if too detailed:**
- Add: "simplified", "minimal detail"
- Reduce: texture, shading complexity
- Emphasize: "clean icon", "simple silhouette"

---

### 45. Minerals Icon

**Purpose:** Mineral resource indicator

**Master Prompt:**
```
simple isometric icon, mineral crystal cluster,
blue-teal crystalline structure, minimal shading,
clean geometric facets, 128×128 optimized,
crisp edges, no text --ar 1:1
```

**Acceptance Criteria:**
- Crystal/ore obvious
- Geometric facets visible
- Teal/blue mineral color
- Clean design
- Readable at 128×128

**Modifiers if unclear:**
- Add: "crystal facets", "gemstone appearance"
- Emphasize: "mineral ore", "crystalline structure"

---

### 46. Fuel Icon

**Purpose:** Fuel resource indicator

**Master Prompt:**
```
simple isometric icon, energy cell container,
glowing amber/orange core, minimal shading,
cylindrical fuel canister, 128×128 optimized,
crisp edges, no text --ar 1:1
```

**Acceptance Criteria:**
- Fuel cell/canister obvious
- Amber/orange glow (energy color)
- Container clear
- Clean design
- Readable at 128×128

**Modifiers if unclear:**
- Add: "fuel canister", "energy cell"
- Emphasize: "glowing core", "cylindrical container"

---

### 47. Food Icon

**Purpose:** Food resource indicator

**Master Prompt:**
```
simple isometric icon, agriculture symbol (wheat sheaf or food container),
green/organic color, minimal shading, clean silhouette,
128×128 optimized, crisp edges, no text --ar 1:1
```

**Acceptance Criteria:**
- Food/agriculture obvious
- Green/organic aesthetic
- Clean design
- Readable at 128×128

**Modifiers if unclear:**
- Try alternate: "food rations crate" if wheat unclear
- Emphasize: "agriculture", "food supply"

---

### 48. Energy Icon

**Purpose:** Energy resource indicator

**Master Prompt:**
```
simple isometric icon, electrical power symbol (lightning bolt or energy core),
teal/cyan electric glow, minimal shading, clean geometric shape,
128×128 optimized, crisp edges, no text --ar 1:1
```

**Acceptance Criteria:**
- Electrical/energy obvious
- Teal tech color
- Clean design
- Readable at 128×128

**Modifiers if unclear:**
- Try alternate: "power core" if lightning bolt unclear
- Emphasize: "electrical energy", "power symbol"

---

### 49. Population Icon

**Purpose:** Population count indicator

**Master Prompt:**
```
simple isometric icon, multiple person silhouettes (3-4 figures),
blue/neutral gray, minimal shading, clean group silhouette,
128×128 optimized, crisp edges, no text --ar 1:1
```

**Acceptance Criteria:**
- People obvious (silhouettes)
- Group clear (multiple figures)
- Clean design
- Readable at 128×128

---

### 50. Morale Icon

**Purpose:** Morale/happiness indicator

**Master Prompt:**
```
simple isometric icon, happiness symbol (smiling face or thumbs up),
green/positive color, minimal shading, clean silhouette,
128×128 optimized, crisp edges, no text --ar 1:1
```

**Acceptance Criteria:**
- Happiness/positive obvious
- Green positive color
- Clean design
- Readable at 128×128

---

### 51. Turn Indicator Icon

**Purpose:** Turn number display

**Master Prompt:**
```
simple isometric icon, circular arrow cycle symbol,
blue/neutral gray, minimal shading, clean rotation indicator,
128×128 optimized, crisp edges, no text --ar 1:1
```

**Acceptance Criteria:**
- Turn/cycle obvious
- Arrow rotation clear
- Clean design
- Readable at 128×128

---

### 52. Build Button Icon

**Purpose:** Construction action button

**Master Prompt:**
```
simple isometric icon, construction tools (hammer and wrench crossed),
blue faction color, minimal shading, clean tool silhouette,
128×128 optimized, crisp edges, no text --ar 1:1
```

**Acceptance Criteria:**
- Construction/building obvious
- Blue action color
- Clean design
- Readable at 128×128

---

### 53. Attack Button Icon

**Purpose:** Combat action button

**Master Prompt:**
```
simple isometric icon, crossed swords or missile symbol,
red aggressive color, minimal shading, clean weapon silhouette,
128×128 optimized, crisp edges, no text --ar 1:1
```

**Acceptance Criteria:**
- Combat/attack obvious
- Red aggressive color
- Clean design
- Readable at 128×128

---

### 54. Defend Button Icon

**Purpose:** Defense action button

**Master Prompt:**
```
simple isometric icon, shield symbol,
blue defensive color, minimal shading, clean shield silhouette,
128×128 optimized, crisp edges, no text --ar 1:1
```

**Acceptance Criteria:**
- Defense/protection obvious
- Blue defensive color
- Clean design
- Readable at 128×128

---

### 55. End Turn Button Icon

**Purpose:** Turn advancement action

**Master Prompt:**
```
simple isometric icon, forward arrow or play button,
green/blue proceed color, minimal shading, clean arrow silhouette,
128×128 optimized, crisp edges, no text --ar 1:1
```

**Acceptance Criteria:**
- Forward/proceed obvious
- Positive color (green or blue)
- Clean design
- Readable at 128×128

---

### 56-58. Save/Load/Settings/Help Icons

**Combined Prompt Template:**
```
simple isometric icon set, {SYMBOL} (floppy disk for save,
folder for load, gear for settings, question mark for help),
neutral gray/blue, minimal shading, clean silhouette,
128×128 optimized, crisp edges, no text --ar 1:1
```

---

## Backgrounds & Environments

### Background Specifications

**All backgrounds:**
- 1920×1080 or 3840×2160 resolution
- Low-contrast (don't compete with foreground UI)
- Parallax-friendly (multiple depth layers)
- Dark space aesthetic (preserve UI readability)
- Faction colors subtle or absent

---

### 59. Galaxy Map Starfield Background

**Purpose:** Main campaign screen backdrop

**Master Prompt:**
```
isometric galaxy map starfield, low-contrast star field,
subtle grid overlay (barely visible), dark space background (#0a0a0a),
white/blue pinpoint stars scattered, minimal nebula wisps,
corners reserved for UI (darker vignette),
painterly subtle details, 3840×2160 resolution --ar 16:9
```

**Acceptance Criteria:**
- Dark enough for UI readability
- Grid visible but subtle (not distracting)
- Stars present but low-density
- Corner vignette for UI panels
- No bright focal points (avoid player attention draw)
- Scalable to 1920×1080

**Modifiers if too bright:**
- Add: "low-contrast", "dark space", "subtle"
- Reduce: star brightness, nebula opacity
- Emphasize: "UI-friendly background", "non-distracting"

---

### 60. Nebula Backdrop (Teal Accent)

**Purpose:** Battle scene backdrop, scenario atmosphere

**Master Prompt:**
```
isometric space nebula backdrop, teal gas clouds,
deep space background, parallax depth layers,
dark background (#0f0f0f), teal (#14B8A6) accent wisps,
distant stars, painterly gas flows,
1920×1080 resolution --ar 16:9
```

**Acceptance Criteria:**
- Teal color dominant accent
- Dark space background (not bright nebula)
- Parallax depth implied (foreground/background layers)
- Painterly gas texture
- UI-friendly contrast
- Scalable

**Variant: Nebula Backdrop (Amber Accent)**
```
Replace teal (#14B8A6) with amber (#F59E0B) in prompt
```

**Variant: Nebula Backdrop (Violet Accent)**
```
Replace teal with violet (#A855F7) in prompt
```

**Modifiers if too bright:**
- Add: "dark background", "subtle gas clouds"
- Reduce: nebula opacity, brightness
- Emphasize: "backdrop only", "non-distracting"

---

### 61. Deep Space (Minimal Stars)

**Purpose:** Clean backdrop, minimal distraction

**Master Prompt:**
```
isometric deep space background, very dark (#050505),
sparse distant stars (pinpoints only), minimal detail,
clean empty space, 1920×1080 resolution --ar 16:9
```

**Acceptance Criteria:**
- Very dark (nearly black)
- Minimal star count
- No nebulae
- Clean, simple
- Maximum UI readability

---

### 62. Asteroid Field Background

**Purpose:** Battle scene environment layer

**Master Prompt:**
```
isometric asteroid field background layer,
scattered asteroid silhouettes (background depth),
dark space, gray/brown rocky asteroids,
low-contrast, painterly silhouettes,
1920×1080 resolution --ar 16:9
```

**Acceptance Criteria:**
- Asteroids clearly background (not foreground)
- Dark space dominant
- Asteroid silhouettes subtle
- No bright focal points
- UI-friendly

---

## Scenario Cards

### Card Specifications

**All scenario cards:**
- 900×500 px (9:5 aspect ratio)
- Two colorways: Tutorial (gold), Tactical (blue)
- Isometric or illustrated key art
- Clear title area (reserve top 100px for text overlay)
- Faction-appropriate styling
- Readable thumbnails

---

### 63. Tutorial Card Template (Gold Colorway)

**Purpose:** Tutorial Flash Conflict card design

**Master Prompt:**
```
isometric scenario card background, gold/amber theme (#F59E0B),
tutorial learning aesthetic, soft gray panel (#f5f5f5),
subtle stroke borders, gentle warm gradient,
top 100px reserved for text (darker overlay),
900×500 card format, clean composition --ar 9:5
```

**Acceptance Criteria:**
- Gold/amber accent dominant
- Tutorial aesthetic (welcoming, educational)
- Text area clear (top section)
- Clean, readable design
- 900×500 format

---

### 64. Tactical Card Template (Blue Colorway)

**Purpose:** Tactical Flash Conflict card design

**Master Prompt:**
```
isometric scenario card background, blue theme (#2563EB),
tactical challenge aesthetic, soft gray panel (#f5f5f5),
subtle stroke borders, cool blue gradient,
top 100px reserved for text (darker overlay),
900×500 card format, action-focused composition --ar 9:5
```

**Acceptance Criteria:**
- Blue accent dominant
- Tactical aesthetic (action, challenge)
- Text area clear
- Clean, readable design
- 900×500 format

---

### 65-70. Specific Scenario Cards

For each scenario (Genesis Device 101, First Contact Combat, Defend Starbase, Terraform Rush, Invasion Landing, Economic Warfare):

**Template:**
```
isometric scenario card, {SCENARIO_THEME} key art,
{COLORWAY} theme (gold for tutorial, blue for tactical),
{SCENARIO_ACTION} visible in composition,
top 100px darker for text overlay, 900×500 format,
clean readable composition --ar 9:5
```

**Example: Genesis Device 101**
```
isometric scenario card, atmosphere processor approaching barren planet,
gold tutorial theme, terraforming action visible,
blue energy field beginning, top 100px darker overlay,
welcoming educational composition --ar 9:5
```

---

## Variant Generation Guidelines

### How to Create Variants While Maintaining Continuity

**Core Principle:** Variants should be **immediately recognizable** as the same asset in a different state.

**Step 1: Lock Invariant Elements**

Identify which elements MUST remain constant:
- Base geometry/silhouette
- Faction color locations (blue trim, red accents)
- Core structural features (prow shape, engine configuration, etc.)
- Scale/proportions

**Step 2: Define Variant Differentiators**

Choose **one or two** elements to vary:
- **Clean → Damaged:** Add scorch marks, hull breaches, sparking systems
- **Clean → Upgraded:** Add external modules, enhanced equipment, reinforced plating
- **Idle → Active:** Add energy effects, weapon fire, movement trails
- **Neutral → Owned:** Add faction-colored orbital infrastructure (ships, stations, beacons)

**Step 3: Use Midjourney Image References**

Once you have a master image:

1. **Upload master to Midjourney**
2. **Use image reference with weight:**
   ```
   [IMAGE URL] {VARIANT PROMPT} --iw 1.5
   ```
   `--iw 1.5` gives strong weight to reference image (range: 0.5-2.0)

3. **Example:**
   ```
   https://midjourney.com/your-scout-ship.png
   isometric 2D scout ship, hull breach amidships, venting atmosphere,
   flickering engine, scorched plating, damaged variant --iw 1.5 --ar 16:9
   ```

**Step 4: Iterate with Remix Mode**

If using Midjourney Remix:
1. Generate master image
2. Click Vary (Strong) or Vary (Subtle)
3. In remix prompt, add variant description
4. Use `--iw` parameter to control similarity

**Step 5: Multi-Variant Consistency**

For 3+ variants (Clean, Upgraded, Damaged):
1. Generate Clean first (establish baseline)
2. Generate Upgraded from Clean reference
3. Generate Damaged from Clean reference
4. Check all three side-by-side for continuity
5. If Upgraded/Damaged diverged too much, re-generate with higher `--iw`

---

### Faction Color Variant Workflow

**For assets that need Blue/Red/Neutral versions:**

**Method 1: Recolor in Post-Processing**
- Generate neutral/gray base
- Recolor faction elements in Photoshop/GIMP
- Fastest, most consistent
- Best for simple color swaps

**Method 2: Midjourney Variants**
- Generate blue faction version first
- Use image reference + "red faction instead of blue" prompt
- Works well with `--iw 1.8-2.0` (high similarity)
- May require iteration

**Example:**
```
Master (Blue):
isometric 2D battle cruiser, blue faction markings, blue command bridge --ar 16:9

Variant (Red):
[BLUE IMAGE URL] same battle cruiser, red faction markings instead of blue,
red command bridge, identical design --iw 2.0 --ar 16:9
```

---

### Planet Ownership Variants

**Special workflow for planets (3 variants each):**

1. **Generate Neutral base:**
   - Gray orbital markers
   - No faction infrastructure
   - Clean planet surface

2. **Generate Player-Owned:**
   - Use Neutral image reference `--iw 1.8`
   - Add prompt: "blue orbital stations, blue faction beacons, blue infrastructure"
   - Planet surface MUST remain identical

3. **Generate AI-Owned:**
   - Use Neutral image reference `--iw 1.8`
   - Add prompt: "red orbital platforms, red faction beacons, red infrastructure"
   - Planet surface MUST remain identical

**Critical:** Only orbital elements change color. Planet surface (oceans, continents, clouds) stays identical across all three variants.

---

## Quality Control & Acceptance Criteria

### General Acceptance Standards

**All assets must meet these criteria before approval:**

1. **Resolution Compliance:**
   - Delivered at specified resolution (512, 1024, 1600, 1920 px)
   - No pixelation or blur when viewed at target size
   - Clean edges (no JPEG compression artifacts)

2. **Style Consistency:**
   - Isometric perspective maintained (not orthographic or 3D render)
   - Painterly yet crisp linework
   - Matte finish (no chrome or glossy reflections)
   - Cool rim light + warm bounce lighting

3. **Faction Color Accuracy:**
   - Blue: `#2563EB` (player)
   - Red: `#DC2626` (AI)
   - Gray: `#6B7280` (neutral)
   - Teal: `#14B8A6` (tech)
   - Amber: `#F59E0B` (alert)
   - Violet: `#A855F7` (exotic)

4. **Readability:**
   - Purpose/function obvious at target size
   - Silhouette distinct from other assets
   - Details clear (not muddy or over-detailed)

5. **No Typography:**
   - No embedded text, labels, watermarks
   - Clean for game UI text overlay

6. **Background Compatibility:**
   - Transparent PNG (for sprites) OR
   - Dark space background (for scenes)
   - No white/bright backgrounds

---

### Asset-Specific Checklists

**Spacecraft:**
- [ ] Faction color clearly visible
- [ ] Ship type identifiable (Scout vs Cruiser vs Bomber)
- [ ] Variant state obvious (Clean vs Damaged vs Upgraded)
- [ ] Weapons/equipment appropriate for role
- [ ] Scale relative to other ships correct

**Planets:**
- [ ] Planet type obvious (Terran vs Volcanic vs Gas Giant, etc.)
- [ ] Surface features visible (oceans, lava, clouds, ice)
- [ ] Day/night terminator present
- [ ] Rim lighting consistent
- [ ] Ownership variant only changes orbital elements (surface identical)

**Buildings:**
- [ ] Building purpose obvious (Mining vs Factory vs Lab)
- [ ] Faction color visible
- [ ] Functional equipment clear
- [ ] Isometric view (not top-down)
- [ ] Planet surface context appropriate

**Portraits:**
- [ ] Alien archetype clear (Warlike vs Technocrat vs Merchant vs Zealot)
- [ ] Facial features distinct
- [ ] Faction color in clothing/regalia
- [ ] Neutral gray backdrop
- [ ] Expression/pose matches variant (aggressive vs diplomatic)

**Battle Scenes:**
- [ ] Blue and red factions clearly distinguishable
- [ ] Combat action obvious (weapons firing, explosions, movement)
- [ ] Foreground/background layers clear
- [ ] Nebula backdrop present
- [ ] Composition cinematic (not cluttered)

**UI Icons:**
- [ ] Symbol/purpose obvious at 128×128 px
- [ ] Clean silhouette (works in monochrome)
- [ ] Minimal shading (not over-rendered)
- [ ] No text
- [ ] Appropriate color (resource type, action type)

---

## Troubleshooting & Modifiers

### Common Issues & Fixes

**Issue 1: Image looks 3D rendered instead of isometric 2D**

**Symptoms:**
- Photorealistic lighting
- Lens blur/depth of field
- 3D model appearance

**Modifiers to add:**
```
Add to prompt: "flat isometric 2D", "illustrated style", "painterly not photoreal"
Add to end: --no "3D render, photorealistic, lens blur"
```

---

**Issue 2: Image too detailed/cluttered**

**Symptoms:**
- Hard to read at target resolution
- Too many small elements
- Muddy appearance

**Modifiers to add:**
```
Add to prompt: "clean composition", "simplified detail", "medium detail readable at 1080p"
Remove: specific equipment callouts, "highly detailed"
Reduce: --s (stylize) parameter (try --s 50 instead of default)
```

---

**Issue 3: Faction colors wrong or missing**

**Symptoms:**
- Blue appears purple or cyan
- Red appears orange or pink
- Colors not in specified locations

**Modifiers to add:**
```
Add to prompt: "exact blue #2563EB faction markings", "precise red #DC2626 accents"
Emphasize: color location ("blue dorsal stripe", "red command bridge")
Use image reference from previous correct asset
```

---

**Issue 4: Background too bright (competes with foreground)**

**Symptoms:**
- Background draws attention
- UI elements hard to read over background
- Bright focal points

**Modifiers to add:**
```
Add to prompt: "low-contrast background", "dark space #0a0a0a", "subtle", "non-distracting"
Add to end: --no "bright nebula, focal points, high contrast"
```

---

**Issue 5: Asset purpose unclear**

**Symptoms:**
- Can't tell Scout from Cruiser
- Mining Station looks like Factory
- Alien archetype ambiguous

**Modifiers to add:**
```
Add to prompt: specific function keywords ("reconnaissance vessel", "ore processing equipment")
Emphasize: distinctive features ("compact angular hull for scout", "drill tower for mining")
Remove: elements that belong to other asset types
```

---

**Issue 6: Variants don't match master**

**Symptoms:**
- Silhouette changed
- Proportions different
- Key features moved/removed

**Modifiers to add:**
```
Increase: --iw parameter (try 1.8 or 2.0)
Add to prompt: "same design as reference", "identical base structure"
Use Vary (Subtle) instead of Vary (Strong)
Upload master image as reference
```

---

**Issue 7: Isometric perspective wrong**

**Symptoms:**
- Top-down view
- Side view
- Incorrect angle

**Modifiers to add:**
```
Add to prompt: "isometric 2D perspective", "30-degree angle view"
Add example: "like strategy game sprite"
Add to end: --no "top-down, side view, first-person"
```

---

**Issue 8: Text/watermarks appear**

**Symptoms:**
- Text labels embedded
- Logos visible
- Artist watermarks

**Modifiers to add:**
```
Add to prompt: "no typography", "no text", "no labels"
Add to end: --no "text, watermark, logo, labels"
```

---

**Issue 9: Wrong aspect ratio**

**Symptoms:**
- Square when should be 16:9
- Portrait when should be square

**Fix:**
```
Check --ar parameter:
Square: --ar 1:1
Landscape: --ar 16:9
Portrait: --ar 2:3
Card: --ar 9:5

Make sure parameter is at END of prompt
```

---

**Issue 10: Colors too saturated/vibrant**

**Symptoms:**
- Neon colors
- Over-saturated
- Cartoony appearance

**Modifiers to add:**
```
Add to prompt: "matte colors", "desaturated", "military gray palette"
Add to end: --no "vibrant, neon, saturated"
Reduce: --s (stylize) parameter
```

---

### Midjourney Parameter Quick Reference

**Aspect Ratios:**
- `--ar 1:1` - Square (planets, icons)
- `--ar 16:9` - Landscape (ships, battles, backgrounds)
- `--ar 2:3` - Portrait (alien leaders)
- `--ar 9:5` - Card (scenario cards)

**Image Weight:**
- `--iw 0.5-2.0` - Control similarity to reference image
  - 0.5: Loose inspiration
  - 1.0: Default
  - 1.5: Strong similarity (recommended for variants)
  - 2.0: Maximum similarity

**Stylization:**
- `--s 0-1000` - Control artistic interpretation
  - 0-50: Literal, less artistic
  - 100: Default (balanced)
  - 200+: More artistic, stylized

**Quality:**
- `--q 0.25, 0.5, 1` - Rendering quality
  - 0.25: Draft (fast, cheap)
  - 0.5: Standard
  - 1: High quality (slower, default)

**Negative Prompts:**
- `--no {terms}` - Exclude unwanted elements
  - Example: `--no "text, 3D render, photorealistic"`

**Chaos:**
- `--c 0-100` - Variation between results
  - 0: Very similar results
  - 50: Moderate variation
  - 100: Maximum variation

---

## Workflow Summary

### Asset Generation Process

**For each new asset:**

1. **Select appropriate prompt** from this document
2. **Customize** faction colors, variant type, specific details
3. **Add Midjourney parameters** (`--ar`, `--s`, `--q`)
4. **Generate** 4 initial options
5. **Select** best option (check acceptance criteria)
6. **Upscale** to target resolution
7. **Create variants** using image reference + `--iw 1.5`
8. **Quality check** against acceptance criteria
9. **Export** PNG with transparency (sprites) or dark background (scenes)
10. **Organize** into asset library folders

**Folder Structure Recommendation:**
```
/assets/
  /sprites/
    /ships/ (512×256 PNGs)
      scout-clean-blue.png
      scout-damaged-blue.png
      cruiser-clean-blue.png
      ...
    /planets/ (512×512 PNGs)
      terran-neutral.png
      terran-player.png
      terran-ai.png
      ...
    /buildings/ (512×512 PNGs)
    /units/ (256×256 PNGs)
  /portraits/ (1024×1536 PNGs)
    warlike-aggressive.png
    warlike-diplomatic.png
    ...
  /scenes/ (1920×1080 PNGs)
    battle-fleet-engagement.png
    ...
  /ui/ (128×128 PNGs)
    icon-credits.png
    icon-minerals.png
    ...
  /backgrounds/ (1920×1080 or 3840×2160 PNGs)
    galaxy-map-starfield.png
    nebula-teal.png
    ...
  /cards/ (900×500 PNGs)
    tutorial-genesis-device.png
    ...
```

---

## Version Control & Iteration

**Naming Convention:**
```
{asset-name}-{variant}-{faction}-v{version}.png

Examples:
scout-clean-blue-v1.png
scout-damaged-blue-v2.png
terran-neutral-v1.png
warlike-aggressive-v3.png
```

**Change Log Template:**
```
## v2 Changes
- Increased faction blue saturation to match #2563EB exactly
- Added hull breach detail to damaged variant
- Fixed rim lighting to cool tone

## v1 Initial
- Base asset generated from master prompt
```

---

## Final Notes

**This document is a living reference.**

As assets are generated and feedback is gathered:
1. Update acceptance criteria based on what works
2. Add new modifiers that solve issues
3. Refine prompts for better consistency
4. Document successful parameter combinations

**Prioritize consistency over perfection.**

It's better to have 144 assets that match each other than 10 perfect assets and 134 mismatched ones.

**Use this document as a checklist.**

When generating assets, work through categories in order, checking off completed assets and variants.

**Master images are your foundation.**

Once a master image is approved, use it as the reference for all variants. Don't regenerate from scratch unless absolutely necessary.

---

## Contact & Feedback

**For questions or iterations:**
- Review acceptance criteria first
- Check troubleshooting section
- Try modifier suggestions
- Document new issues for future reference

**Success metric:** When all 144 essential assets are generated with visual consistency, clear faction identification, and readable purpose.

---

**End of Document**
