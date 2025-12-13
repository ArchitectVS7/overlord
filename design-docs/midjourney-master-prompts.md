# Overlord - Midjourney Master Prompts Document

**Project:** Overlord (4X Strategy Game)
**Purpose:** Asset generation guide for current game specification ONLY
**Style:** Isometric 2D, painterly crisp edges, matte sci-fi metal
**Date:** 2025-12-13
**Version:** 2.0.0 - Cleaned to match Enums.ts

> **Note:** Expansion assets (Scout, Bomber, Terran planet, etc.) moved to `midjourney-expansion-prompts.md`

---

## Table of Contents

1. [Overview & Style Guide](#overview--style-guide)
2. [Complete Asset Inventory](#complete-asset-inventory)
3. [Master Prompt Templates](#master-prompt-templates)
4. [Asset Categories](#asset-categories)
   - [Spacecraft](#spacecraft)
   - [Planets](#planets)
   - [Buildings & Structures](#buildings--structures)
   - [AI Leaders](#ai-leaders)
   - [Battle Scenes](#battle-scenes)
   - [UI Elements & Icons](#ui-elements--icons)
   - [Backgrounds & Environments](#backgrounds--environments)
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

### Current Game Specification (from Enums.ts)

**Spacecraft (CraftType enum - 4 types × 3 variants = 12 assets):**
- Battle Cruiser (clean, upgraded, damaged)
- Cargo Cruiser (clean, loaded, damaged)
- Solar Satellite (deployed, active production, damaged)
- Atmosphere Processor (clean, deployed, malfunctioning)

**Planets (PlanetType enum - 4 types × 3 ownership states = 12 assets):**
- Volcanic (neutral, player, AI)
- Desert (neutral, player, AI)
- Tropical (neutral, player, AI)
- Metropolis (neutral, player, AI)

**Buildings (BuildingType enum - 7 structures):**
- DockingBay (orbital platform, 3 variants)
- SurfacePlatform (generic surface slot)
- MiningStation (minerals/fuel production)
- HorticulturalStation (food production)
- OrbitalDefense (defense platform)
- SolarSatellite (deployed craft visualization)
- AtmosphereProcessor (deployed craft visualization)

**AI Leaders (AIPersonality enum - 4 archetypes × 2 variants = 8 assets):**
- Commander Kratos - Aggressive (hostile pose, diplomatic pose)
- Overseer Aegis - Defensive (cautious pose, fortified pose)
- Magistrate Midas - Economic (welcoming pose, shrewd pose)
- General Nexus - Balanced (tactical pose, commanding pose)

**Battle Scenes (4 compositions using current assets):**
- Cruiser Fleet Engagement (Battle Cruisers vs Battle Cruisers)
- Planetary Invasion (Battle Cruisers deploying ground forces)
- Orbital Defense (Battle Cruisers vs Orbital Defense platforms)
- Supply Line Raid (Cargo Cruisers under attack)

**UI Icons & Resources (10 assets from resource systems):**
- Credits (coin/currency icon)
- Minerals (ore/crystal icon)
- Fuel (energy cell icon)
- Food (agriculture icon)
- Energy (power icon)
- Population (people icon)
- Morale (happiness icon)
- Build Button
- Attack Button
- End Turn Button

**Backgrounds (4 assets):**
- Galaxy Map Starfield
- Nebula Backdrop (teal accent)
- Deep Space (minimal stars)
- Asteroid Field Background

**Scenario Cards (4 tactical scenarios):**
- Tutorial Card Template
- Tactical Card Template
- Defend Starbase (tactical scenario)
- Terraform Rush (tactical scenario)

**TOTAL CURRENT ASSETS:** ~70 unique images

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

### 1. Battle Cruiser

**Purpose:** Main combat vessel, troop transport (4 platoons max), orbital superiority

**Game Stats (from Enums.ts):**
- CraftType: BattleCruiser
- Role: Combat + Transport
- Platoon Capacity: 4

**Master Prompt:**
```
isometric 2D battle cruiser, armored prow, recessed turret hardpoints,
blue command bridge lighting, angular fins, matte battleship gray,
cool rim + warm engine glow, orbiting volcanic colony,
crisp edges, medium detail --ar 16:9
```

**Acceptance Criteria:**
- Capital ship appearance (larger than Cargo Cruiser)
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

### 2. Cargo Cruiser

**Purpose:** Resource transport (1,000 per resource type), civilian trade, non-combat logistics

**Game Stats (from Enums.ts):**
- CraftType: CargoCruiser
- Role: Resource Transport
- Capacity: 1,000 units per resource type

**Master Prompt:**
```
isometric 2D cargo cruiser, modular shipping containers, exposed cargo racks,
minimal armor, blue navigation lights, matte civilian gray/white,
bulk freighter proportions, cool rim + warm running lights,
docking at orbital station --ar 16:9
```

**Acceptance Criteria:**
- Clearly non-military (civilian aesthetic)
- Cargo containers/modules visible
- Larger than Battle Cruiser (bulk hauler)
- Minimal/no weapons
- Blue faction trim subtle (company logo area)
- Readable at 512×256 resolution

**Variant: Cargo Cruiser (Loaded - Full Containers)**
```
isometric 2D cargo cruiser, fully loaded container racks,
stacked modular cargo pods, blue manifest holograms,
heavily laden, low thrust maneuvering --ar 16:9
```

**Variant: Cargo Cruiser (Damaged)**
```
isometric 2D cargo cruiser, breached hull, cargo containers floating free,
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

### 3. Solar Satellite

**Purpose:** Energy production (80 energy per turn), orbital power generation

**Game Stats (from Enums.ts):**
- CraftType: SolarSatellite
- Role: Energy Production
- Output: 80 energy/turn

**Master Prompt (Deployed):**
```
isometric 2D solar satellite, large solar panel array unfolded,
blue faction energy collectors, compact central hub,
matte gray/white civilian structure, teal energy conduits glowing,
solar panels catching starlight, orbiting metropolis planet --ar 16:9
```

**Acceptance Criteria:**
- Solar panels clearly dominant feature
- Blue faction identification (minimal, utility)
- Civilian/industrial aesthetic (not military)
- Energy collection obvious (panels, conduits)
- Compact hub with extended arrays
- Readable at 512×256 resolution

**Variant: Solar Satellite (Active Production)**
```
isometric 2D solar satellite, solar arrays fully deployed,
teal energy conduits bright, power flowing to hub,
blue collection beams active, maximum output,
energy transfer visible --ar 16:9
```

**Variant: Solar Satellite (Damaged)**
```
isometric 2D solar satellite, solar panels torn/broken,
missing array sections, sparking power conduits,
reduced energy output, emergency repair drones,
limping power generation --ar 16:9
```

**Modifiers if unclear:**
- Add: "solar panel array", "energy collection satellite"
- Emphasize: "extended solar wings", "power generation"
- Increase: solar panel size, teal energy glow

**Continuity Notes:**
- Solar panel configuration locked (same array pattern)
- Central hub unchanged
- Teal energy glow consistent
- Damage shows on panels (torn, missing sections)

---

### 4. Atmosphere Processor

**Purpose:** Terraforms neutral planets to player ownership (10 turn deployment)

**Game Stats (from Enums.ts):**
- CraftType: AtmosphereProcessor
- Role: Terraforming
- Deployment Time: 10 turns

**Master Prompt (Clean):**
```
isometric 2D atmosphere processor, massive atmospheric processors,
blue faction environmental tech, cylindrical core module,
atmospheric diffuser arrays, matte industrial white/gray,
teal chemical reaction glow, compact transport configuration,
deep space transit --ar 16:9
```

**Acceptance Criteria:**
- Large-scale equipment (planet-affecting)
- Blue faction identification
- Atmospheric processing equipment visible
- Industrial/scientific aesthetic
- Teal chemical/reaction glow
- Readable at 512×256 resolution

**Variant: Atmosphere Processor (Deployed on Planet)**
```
isometric 2D atmosphere processor, deployed on planet surface,
diffuser arrays extended upward into atmosphere,
teal atmospheric conversion beams active,
blue faction terraforming in progress,
planetary transformation visible --ar 16:9
```

**Variant: Atmosphere Processor (Malfunctioning)**
```
isometric 2D atmosphere processor, chemical leak visible,
teal energy flickering, diffuser arrays misaligned,
amber warning indicators, partial deployment,
terraforming stalled --ar 16:9
```

**Modifiers if unclear:**
- Add: "planetary terraforming equipment", "atmospheric converter"
- Emphasize: "large scale industrial", "planet-affecting machinery"
- Increase: diffuser array size, teal chemical glow

**Continuity Notes:**
- Core module design constant
- Diffuser array configuration locked
- Teal chemical glow always present
- Deployed variant shows same equipment in surface configuration

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

### 5. Volcanic Planet

**Purpose:** High minerals, harsh environment, military importance

**Game Stats (from Enums.ts):**
- PlanetType: Volcanic
- Resource Specialty: Minerals

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

**Modifiers if not volcanic enough:**
- Add: "active lava flows", "volcanic fissures glowing"
- Emphasize: "molten surface features", "heat glow visible"
- Increase: lava brightness, contrast with dark rock

**Continuity Notes:**
- Lava pattern locations locked
- Dark basalt continents unchanged
- Terminator line position consistent (45° from viewer)
- Only orbital elements change color (planet surface identical)

---

### 6. Desert Planet

**Purpose:** Balanced resources, arid environment, strategic location

**Game Stats (from Enums.ts):**
- PlanetType: Desert
- Resource Specialty: Balanced

**Master Prompt (Neutral):**
```
isometric planet sprite, desert world, tan/beige sandy continents,
sparse vegetation patches, white polar ice caps, thin atmosphere,
day/night terminator, gray neutral orbital markers, consistent rim lighting,
crisp limb, minimal clouds --ar 1:1
```

**Acceptance Criteria:**
- Sandy/arid appearance (tan/beige dominant)
- Minimal water visible
- Polar ice caps present
- Sparse cloud coverage
- Neutral gray orbital markers
- Readable at 512×512 resolution

**Variant: Desert (Player-Owned)**
```
isometric desert planet, sandy continents, sparse vegetation,
blue orbital water extraction stations, blue faction infrastructure,
blue beacons, resource mining operations --ar 1:1
```

**Variant: Desert (AI-Owned)**
```
isometric desert planet, arid surface, polar caps,
red orbital military installations, red faction bases,
red warning strobes, fortified positions --ar 1:1
```

**Modifiers if too wet:**
- Add: "arid surface", "minimal water coverage"
- Reduce: cloud density, water features
- Emphasize: "desert terrain dominant", "sandy continents"

**Continuity Notes:**
- Desert terrain pattern locked
- Polar cap positions unchanged
- Terminator line consistent
- Only orbital elements change faction colors

---

### 7. Tropical Planet

**Purpose:** High food production, lush environment, population growth

**Game Stats (from Enums.ts):**
- PlanetType: Tropical
- Resource Specialty: Food

**Master Prompt (Neutral):**
```
isometric planet sprite, tropical world, dense green vegetation continents,
blue-green oceans, thick white cloud bands, warm atmosphere,
day/night terminator, gray neutral orbital markers, consistent rim lighting,
lush appearance, crisp limb --ar 1:1
```

**Acceptance Criteria:**
- Lush vegetation dominant (green landmasses)
- Oceans visible (blue-green)
- Thick cloud coverage (tropical storms)
- Warm/humid atmosphere implied
- Neutral gray orbital markers
- Readable at 512×512 resolution

**Variant: Tropical (Player-Owned)**
```
isometric tropical planet, lush green continents, oceans, clouds,
blue orbital agricultural stations, blue faction beacons,
blue farming infrastructure, food production visible --ar 1:1
```

**Variant: Tropical (AI-Owned)**
```
isometric tropical planet, dense vegetation, ocean surface,
red orbital installations, red faction resource extraction,
red warning beacons, militarized agriculture --ar 1:1
```

**Modifiers if not lush enough:**
- Add: "dense vegetation coverage", "jungle continents"
- Emphasize: "green landmasses dominant", "tropical cloud bands"
- Increase: vegetation brightness, cloud thickness

**Continuity Notes:**
- Vegetation pattern locked
- Ocean/land ratio constant
- Cloud patterns consistent (tropical distribution)
- Only orbital elements change colors

---

### 8. Metropolis Planet

**Purpose:** High population, urban development, economic center

**Game Stats (from Enums.ts):**
- PlanetType: Metropolis
- Resource Specialty: Credits/Economy

**Master Prompt (Neutral):**
```
isometric planet sprite, metropolis city world, urban sprawl visible,
gray-silver cityscape covering continents, sparse green zones,
atmospheric haze, orbital traffic lanes, gray neutral stations,
consistent rim lighting, city lights on night side, crisp limb --ar 1:1
```

**Acceptance Criteria:**
- Urban development obvious (city lights, structures)
- Minimal natural terrain visible
- City lights on night side
- Orbital traffic/stations present
- Gray-silver cityscape dominant
- Readable at 512×512 resolution

**Variant: Metropolis (Player-Owned)**
```
isometric metropolis planet, urban sprawl, city lights,
blue orbital trade stations, blue faction beacons,
blue city lighting, economic infrastructure visible --ar 1:1
```

**Variant: Metropolis (AI-Owned)**
```
isometric metropolis planet, cityscape coverage, lights,
red orbital control stations, red faction infrastructure,
red city illumination, militarized urban zones --ar 1:1
```

**Modifiers if not urban enough:**
- Add: "city lights visible", "urban sprawl coverage"
- Emphasize: "metropolitan development", "cityscape dominant"
- Increase: city light brightness, urban coverage

**Continuity Notes:**
- Urban pattern locked (same city distribution)
- City light positions constant
- Terminator line consistent
- Orbital traffic lanes unchanged
- Only faction colors vary

---

## Buildings & Structures

### 9. DockingBay

**Purpose:** Orbital platform for spacecraft (max 3 per planet)

**Game Stats (from Enums.ts):**
- BuildingType: DockingBay
- Location: Orbital
- Capacity: 3 platforms per planet

**Master Prompt:**
```
isometric 2D orbital docking bay, three docking cradles,
blue faction navigation beacons, matte gray structure,
spacecraft berths visible, orbital platform design,
cool rim + warm interior lights, orbiting planet --ar 1:1
```

**Acceptance Criteria:**
- Three distinct docking positions
- Blue faction identification
- Spacecraft berths clearly sized for cruisers
- Orbital platform aesthetic
- Industrial/functional design
- Readable at 512×512

**Variant: DockingBay (Occupied)**
```
isometric orbital docking bay, Battle Cruisers docked,
blue beacons active, loading/unloading in progress,
busy port activity --ar 1:1
```

**Variant: DockingBay (Damaged)**
```
isometric orbital docking bay, structural damage,
one cradle destroyed, venting atmosphere,
blue emergency lights, partial operation --ar 1:1
```

---

### 10. SurfacePlatform

**Purpose:** Generic surface construction slot

**Game Stats (from Enums.ts):**
- BuildingType: SurfacePlatform
- Location: Surface

**Master Prompt:**
```
isometric 2D surface platform, flat foundation pad,
blue faction markers, matte gray construction base,
modular design ready for building placement,
crisp edges, industrial foundation --ar 1:1
```

**Acceptance Criteria:**
- Flat construction surface
- Blue faction markings
- Generic/modular appearance
- Foundation aesthetic
- Readable at 512×512

---

### 11. MiningStation

**Purpose:** Produces Minerals and Fuel resources

**Game Stats (from Enums.ts):**
- BuildingType: MiningStation
- Production: Minerals + Fuel

**Master Prompt:**
```
isometric 2D mining station, ore extraction towers,
blue faction industrial lights, matte gray/brown structures,
mining equipment visible, ore conveyors, fuel refineries,
functional industrial aesthetic, surface installation --ar 1:1
```

**Acceptance Criteria:**
- Mining equipment obvious (drills, conveyors)
- Blue faction identification
- Ore processing visible
- Fuel refinery sections
- Industrial aesthetic
- Readable at 512×512

**Variant: MiningStation (Peak Production)**
```
isometric mining station, ore extraction at maximum,
blue lights bright, conveyors running,
active mining operations --ar 1:1
```

---

### 12. HorticulturalStation

**Purpose:** Produces Food resources

**Game Stats (from Enums.ts):**
- BuildingType: HorticulturalStation
- Production: Food

**Master Prompt:**
```
isometric 2D horticultural station, agricultural domes,
blue faction growing lights, white/green structures,
crop growth visible through transparencies,
farming equipment, food production aesthetic --ar 1:1
```

**Acceptance Criteria:**
- Agricultural domes/greenhouses
- Blue faction markings
- Crops/vegetation visible
- Farming equipment present
- Civilian/agricultural aesthetic
- Readable at 512×512

**Variant: HorticulturalStation (Harvest Season)**
```
isometric horticultural station, crops at peak growth,
blue lights bright, harvest equipment active,
maximum food production --ar 1:1
```

---

### 13. OrbitalDefense

**Purpose:** Defense platform (+20% defense bonus)

**Game Stats (from Enums.ts):**
- BuildingType: OrbitalDefense
- Bonus: +20% planetary defense

**Master Prompt:**
```
isometric 2D orbital defense platform, weapon turrets,
blue faction targeting systems, matte battleship gray,
defensive emplacements, missile batteries,
fortified military aesthetic, orbiting planet --ar 1:1
```

**Acceptance Criteria:**
- Weapon turrets obvious
- Blue faction identification
- Military fortification clear
- Defensive posture
- Orbital platform design
- Readable at 512×512

**Variant: OrbitalDefense (Combat Active)**
```
isometric orbital defense platform, turrets firing,
blue weapon discharge, missile launch,
active defense engagement --ar 1:1
```

---

## AI Leaders

### 14. Commander Kratos (Aggressive Personality)

**Purpose:** Warmonger AI, military-focused expansion

**Game Stats (from Enums.ts):**
- AIPersonality: Aggressive
- Archetype: Commander Kratos
- Strategy: Warmonger

**Master Prompt (Hostile Pose):**
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

**Variant: Commander Kratos (Diplomatic Pose)**
```
isometric portrait, warlike alien commander, scaled skin,
bone crest, controlled expression, red diplomatic robes,
formal military regalia, stern but negotiating,
neutral gray backdrop --ar 2:3
```

---

### 15. Overseer Aegis (Defensive Personality)

**Purpose:** Turtle/defensive AI, fortification-focused

**Game Stats (from Enums.ts):**
- AIPersonality: Defensive
- Archetype: Overseer Aegis
- Strategy: Turtle/Fortification

**Master Prompt (Cautious Pose):**
```
isometric head-and-shoulders portrait, alien overseer,
armored exoskeleton, defensive shield integrated,
blue faction fortification insignia, vigilant expression,
armored carapace features, neutral gray backdrop,
cool lighting, protective presence --ar 2:3
```

**Acceptance Criteria:**
- Defensive armor prominent
- Blue faction identification
- Cautious/vigilant appearance
- Fortification symbolism (shield, armor)
- Protected aesthetic
- Readable at 1024×1536

**Variant: Overseer Aegis (Fortified Pose)**
```
isometric portrait, alien overseer, armored exoskeleton,
shield raised, blue fortification tech,
defensive stance, entrenched demeanor,
neutral backdrop --ar 2:3
```

---

### 16. Magistrate Midas (Economic Personality)

**Purpose:** Trade-focused AI, economic expansion

**Game Stats (from Enums.ts):**
- AIPersonality: Economic
- Archetype: Magistrate Midas
- Strategy: Expansionist

**Master Prompt (Welcoming Pose):**
```
isometric head-and-shoulders portrait, alien merchant magistrate,
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

**Variant: Magistrate Midas (Shrewd Pose)**
```
isometric portrait, merchant magistrate, ornate robes,
gold tech filigree, blue trade pendant,
calculating smile, appraising expression,
deal-making demeanor, neutral backdrop --ar 2:3
```

---

### 17. General Nexus (Balanced Personality)

**Purpose:** Tactical AI, balanced strategy

**Game Stats (from Enums.ts):**
- AIPersonality: Balanced
- Archetype: General Nexus
- Strategy: Tactical

**Master Prompt (Tactical Pose):**
```
isometric head-and-shoulders portrait, alien general,
tactical HUD visor, balanced military/civilian uniform,
blue faction command insignia, analytical expression,
strategic presence, neural interface visible,
neutral gray backdrop, cool lighting --ar 2:3
```

**Acceptance Criteria:**
- Balanced military/diplomatic aesthetic
- Blue faction identification
- Analytical/tactical appearance
- Command presence
- Strategic symbolism
- Readable at 1024×1536

**Variant: General Nexus (Commanding Pose)**
```
isometric portrait, alien general, tactical HUD active,
command uniform, blue faction insignia,
authoritative stance, strategic demeanor,
neutral backdrop --ar 2:3
```

---

## Battle Scenes

### 18. Cruiser Fleet Engagement

**Purpose:** Battle Cruiser vs Battle Cruiser combat visualization

**Uses Current Assets:** Battle Cruiser only

**Master Prompt:**
```
isometric 2D fleet engagement, blue Battle Cruisers vs red Battle Cruisers,
turret fire exchanges, missile salvos, shield impacts,
debris trails, blue and red faction identification clear,
nebula backdrop, cinematic composition --ar 16:9
```

**Acceptance Criteria:**
- Battle Cruisers from established design
- Blue vs red factions clear
- Weapon fire visible
- Shield effects present
- Dynamic composition
- Readable at 1920×1080

---

### 19. Planetary Invasion

**Purpose:** Battle Cruiser deploying ground forces

**Uses Current Assets:** Battle Cruiser, any planet type

**Master Prompt:**
```
isometric 2D planetary invasion, blue Battle Cruisers in orbit,
deploying ground forces to planet surface,
planet type visible below (volcanic/desert/tropical/metropolis),
orbital bombardment support, invasion in progress --ar 16:9
```

**Acceptance Criteria:**
- Battle Cruisers in assault configuration
- Planet surface visible
- Ground force deployment implied
- Blue faction attacking
- Epic scale
- Readable at 1920×1080

---

### 20. Orbital Defense Battle

**Purpose:** Battle Cruisers attacking Orbital Defense platforms

**Uses Current Assets:** Battle Cruiser, OrbitalDefense

**Master Prompt:**
```
isometric 2D orbital defense battle, blue Battle Cruisers attacking,
red Orbital Defense platforms firing back,
planet visible in background, defensive engagement,
turret fire, missile exchanges --ar 16:9
```

**Acceptance Criteria:**
- Battle Cruisers vs defense platforms
- Blue attacking, red defending
- Orbital platform design matches building asset
- Dynamic combat
- Readable at 1920×1080

---

### 21. Supply Line Raid

**Purpose:** Cargo Cruisers under attack

**Uses Current Assets:** Cargo Cruiser, Battle Cruiser

**Master Prompt:**
```
isometric 2D supply raid, blue Cargo Cruisers under attack,
red Battle Cruisers intercepting, cargo containers,
defensive escort blue Battle Cruisers,
asteroid field backdrop, commerce raiding --ar 16:9
```

**Acceptance Criteria:**
- Cargo Cruisers clearly civilian
- Battle Cruisers in combat
- Blue supply convoy, red raiders
- Containers visible
- Readable at 1920×1080

---

## UI Elements & Icons

### Resource Icons (128×128 px)

**22. Credits Icon**
```
simple isometric icon, coin/credit chip, metallic gold,
clean silhouette, 128×128 optimized, no text --ar 1:1
```

**23. Minerals Icon**
```
simple isometric icon, ore crystal cluster, gray/blue minerals,
clean silhouette, 128×128 optimized, no text --ar 1:1
```

**24. Fuel Icon**
```
simple isometric icon, energy cell canister, blue-white glow,
clean silhouette, 128×128 optimized, no text --ar 1:1
```

**25. Food Icon**
```
simple isometric icon, agriculture/wheat symbol, green/gold,
clean silhouette, 128×128 optimized, no text --ar 1:1
```

**26. Energy Icon**
```
simple isometric icon, power bolt/lightning, teal glow,
clean silhouette, 128×128 optimized, no text --ar 1:1
```

**27. Population Icon**
```
simple isometric icon, silhouette group of people, blue,
clean silhouette, 128×128 optimized, no text --ar 1:1
```

**28. Morale Icon**
```
simple isometric icon, happiness/smile symbol, gold/yellow,
clean silhouette, 128×128 optimized, no text --ar 1:1
```

### Action Buttons (128×128 px)

**29. Build Button**
```
simple isometric icon, construction/hammer symbol, blue,
clean silhouette, 128×128 optimized, no text --ar 1:1
```

**30. Attack Button**
```
simple isometric icon, crosshairs/target symbol, red,
clean silhouette, 128×128 optimized, no text --ar 1:1
```

**31. End Turn Button**
```
simple isometric icon, forward arrow/next symbol, blue,
clean silhouette, 128×128 optimized, no text --ar 1:1
```

---

## Backgrounds & Environments

### 32. Galaxy Map Starfield Background

**Purpose:** Main galaxy map backdrop

**Master Prompt:**
```
isometric galaxy map starfield, sparse stars, deep space,
subtle blue grid overlay, minimal visual noise,
dark navy/black background, painterly stars,
clean readability --ar 16:9
```

**Acceptance Criteria:**
- Sparse star distribution
- Dark background (not distracting)
- Grid overlay subtle
- Readable at 1920×1080

---

### 33. Nebula Backdrop (Teal Accent)

**Purpose:** Battle scene/menu background

**Master Prompt:**
```
isometric space nebula, teal accent glow, painterly gases,
parallax depth layers, dark space background,
low contrast for UI readability --ar 16:9
```

**Acceptance Criteria:**
- Teal color accent
- Painterly nebula style
- Not visually distracting
- Readable at 1920×1080

---

### 34. Deep Space (Minimal Stars)

**Purpose:** Clean background for UI overlays

**Master Prompt:**
```
isometric deep space, minimal star field, pure black,
sparse distant stars, clean backdrop,
maximum UI contrast --ar 16:9
```

**Acceptance Criteria:**
- Very minimal stars
- Pure black background
- Maximum contrast for UI
- Readable at 1920×1080

---

### 35. Asteroid Field Background

**Purpose:** Environmental backdrop for space scenes

**Master Prompt:**
```
isometric asteroid field, gray rocky asteroids,
scattered distribution, background layer,
no foreground clutter, depth parallax --ar 16:9
```

**Acceptance Criteria:**
- Asteroids background layer only
- Gray/brown coloring
- Scattered distribution
- Readable at 1920×1080

---

## Variant Generation Guidelines

### Ownership Variants (Planets)

**Neutral → Player → AI:**
1. Keep planet surface IDENTICAL (same terrain, clouds, features)
2. ONLY change orbital infrastructure:
   - Neutral: Gray orbital markers
   - Player: Blue orbital stations, blue beacons
   - AI: Red orbital platforms, red beacons
3. Maintain terminator line position
4. Keep rim lighting consistent

### Condition Variants (Spacecraft)

**Clean → Upgraded → Damaged:**
1. **Clean:** Base design, standard configuration
2. **Upgraded:** ADD external modules, enhanced systems (don't change core hull)
3. **Damaged:** SHOW damage on existing features (don't add new elements)
4. Keep hull shape, faction colors, engine positions constant

### Pose Variants (Leaders)

**Standard → Variant Pose:**
1. Keep facial structure, faction colors, regalia IDENTICAL
2. Change expression, body posture, mood only
3. Maintain neutral gray backdrop
4. Keep lighting consistent

---

## Quality Control & Acceptance Criteria

### Resolution Standards

- **Map Sprites:** Must be readable at 512×512 px
- **Detail Art:** Must be readable at 1024×1024 px
- **Battle Scenes:** Must be readable at 1920×1080 px
- **UI Icons:** Must be readable at 128×128 px

### Faction Color Consistency

- **Player (Blue):** #2563EB primary, #60A5FA accent
- **AI (Red):** #DC2626 primary, #F87171 accent
- **Neutral (Gray):** #6B7280 primary, #9CA3AF accent

### Silhouette Test

All assets must pass silhouette test:
1. Convert to pure black silhouette
2. Asset must still be identifiable by shape alone
3. Different asset types must have distinct silhouettes

### Cross-Asset Consistency

- Planet rim lighting direction consistent across all planets
- Spacecraft hull proportions maintain hierarchy (Battle Cruiser > Cargo Cruiser)
- Leader portraits use same backdrop, lighting setup
- UI icons share same level of detail/simplification

---

## Troubleshooting & Modifiers

### Common Issues & Fixes

**Issue: Too much detail/clutter**
- Add: "simplified silhouette", "clean design", "minimal detail"
- Remove: specific equipment callouts
- Emphasize: "readable at 1080p", "clean composition"

**Issue: Wrong proportions**
- Add: size comparisons ("larger than...", "smaller than...")
- Emphasize: "capital ship scale", "bulk hauler proportions"

**Issue: Faction colors unclear**
- Add: "blue faction trim obvious", "blue markings clear"
- Emphasize: "faction identification", "blue accent lighting"
- Increase: faction color brightness, coverage area

**Issue: Style inconsistency**
- Add: "isometric 2D", "painterly crisp edges", "matte finish"
- Remove: "3D render", "photorealistic", "chrome"
- Emphasize: "consistent with existing assets"

**Issue: Background too busy**
- Add: "neutral gray backdrop", "minimal background", "clean composition"
- Remove: background elements, environmental detail
- Emphasize: "subject focus", "foreground clarity"

---

**Document Version:** 2.0.0
**Last Updated:** 2025-12-13
**Source:** Cleaned to match Overlord.Phaser/src/core/models/Enums.ts
**Expansion Assets:** See midjourney-expansion-prompts.md
