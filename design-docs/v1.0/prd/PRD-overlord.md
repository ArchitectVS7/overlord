# Product Requirements Document: Overlord Remake

**Version:** 1.0
**Date:** December 6, 2025
**Status:** Design Phase
**Owner:** Project Lead
**Target Release:** TBD (Post-Implementation Planning)

---

## 1. Executive Summary

### Overview
Overlord is a modern reimagining of the classic 1990 4X strategy game "Overlord" (aka "Supremacy"), rebuilt in Unity with Prodeus-inspired low-poly 3D graphics for PC and mobile platforms. Players compete against an AI opponent to control a star system through resource management, colony development, military conquest, and strategic warfare.

### Business Objectives
- Preserve and modernize a classic strategy game for contemporary audiences
- Create cross-platform 4X experience accessible on PC and mobile
- Demonstrate capability to remake classic titles with modern technology
- Build foundation for potential multiplayer expansion and additional content

### Success Criteria
- Core gameplay loop functional and engaging
- 60 FPS on PC, 30 FPS on mobile devices
- Complete single-player campaign against AI
- Positive reception from strategy game community
- Technical foundation supports future expansion

---

## 2. Product Vision

### Vision Statement
**"Bring the strategic depth of classic 4X games to modern platforms with accessible controls, stunning low-poly visuals, and respect for player time."**

### Design Pillars

**1. Strategic Depth**
- Meaningful choices at every turn
- Multiple paths to victory
- Risk/reward decision-making
- Long-term planning rewarded

**2. Modern Accessibility**
- Intuitive UI/UX following contemporary conventions
- Touch-first control design
- Clear information hierarchy
- Tutorial system for newcomers

**3. Visual Clarity**
- Prodeus-style low-poly aesthetic
- Clean, readable interface
- Distinct visual language for factions
- Performance-optimized art style

**4. Respect for Player Time**
- Auto-save and cloud sync
- Skip/fast-forward options
- Save anywhere functionality
- Clear progress indicators

---

## 3. Target Audience

### Primary Audience
**Strategy Enthusiasts (Ages 25-45)**
- Played original Overlord/Supremacy or similar classics
- Enjoy turn-based strategy and 4X games
- Value depth over graphics
- Play on PC during dedicated gaming sessions
- Willing to invest 30-90 minutes per session

### Secondary Audience
**Mobile Strategy Players (Ages 20-40)**
- Casual strategy game fans
- Play during commute or breaks (10-30 minute sessions)
- Prefer touchscreen interfaces
- May not have PC gaming setup
- Looking for deeper experience than typical mobile games

### Tertiary Audience
**New Strategy Players (Ages 18-30)**
- Curious about 4X genre
- Attracted by unique visual style
- Need tutorial and guidance
- May graduate to more complex 4X titles
- Prefer shorter sessions initially

---

## 4. Core Gameplay Loop

### High-Level Loop
```
Resource Collection → Colony Development → Military Production →
Strategic Deployment → Combat Resolution → Territory Expansion →
Resource Collection (Enhanced)
```

### Turn Structure

**1. Income Phase**
- Resources generated based on colony infrastructure
- Population growth calculated
- Tax revenue collected
- Maintenance costs deducted

**2. Action Phase**
- Build structures on colonies
- Commission military units
- Move fleets between planets
- Adjust tax rates and policies
- Deploy Atmosphere Processors

**3. Combat Phase**
- Resolve space battles
- Execute planetary invasions
- Calculate casualties and equipment loss
- Determine territory control

**4. End Phase**
- Check victory conditions
- Trigger random events (optional)
- Auto-save game state
- Prepare next turn

### Player Progression Arc

**Early Game (Turns 1-10)**
- Establish first colony beyond starting planet
- Build resource infrastructure (Mining/Farming stations)
- Train initial platoons
- Purchase first Battle Cruiser

**Mid Game (Turns 11-30)**
- Control 2-3 planets
- Field multiple platoons with upgraded equipment
- Engage in first major battles
- Expand fleet to 10-15 craft

**Late Game (Turns 31+)**
- Siege enemy home planet
- Field elite platoons with best equipment
- Manage large empire (4+ planets)
- Execute final offensive or defend from AI assault

---

## 5. Feature Requirements

### FR-CORE: Core Systems

**FR-CORE-001: Game State Management**
- System shall maintain complete game state including all entities, resources, and turn number
- System shall support save/load at any point during player turn
- System shall persist settings and preferences separately from game saves
- Priority: P0 (Critical)

**FR-CORE-002: Turn-Based System**
- System shall execute turns in fixed sequence (Player → AI → Resolution)
- System shall allow player unlimited time during their turn
- System shall provide "End Turn" button to advance
- System shall auto-advance after combat resolution
- Priority: P0 (Critical)

**FR-CORE-003: Save/Load System**
- System shall support minimum 10 save slots
- System shall auto-save at start of each player turn
- System shall support cloud save synchronization (PC/Mobile)
- System shall display save metadata (turn number, date, preview image)
- Priority: P0 (Critical)

**FR-CORE-004: Settings Management**
- System shall support graphics quality presets (Low/Medium/High/Ultra)
- System shall support audio volume controls (Master/Music/SFX)
- System shall support control remapping (PC) and sensitivity (Mobile)
- System shall persist settings across sessions
- Priority: P1 (Important)

**FR-CORE-005: Input Abstraction**
- System shall support mouse + keyboard (PC)
- System shall support touchscreen gestures (Mobile)
- System shall support gamepad (PC, optional)
- System shall provide consistent interaction model across input methods
- Priority: P0 (Critical)

### FR-GALAXY: Galaxy and Map Systems

**FR-GALAXY-001: Star System Generation**
- System shall generate star system with 4-6 planets
- System shall place player starting planet (Starbase) and enemy planet (Hitotsu)
- System shall distribute 2-4 neutral planets randomly
- System shall assign planet types (Volcanic/Desert/Tropical/Metropolis)
- Priority: P0 (Critical)

**FR-GALAXY-002: Planet Properties**
- Each planet shall have type determining resource bonuses
- Volcanic: 5x Mineral yield, 3x Fuel yield from Mining
- Desert: Enhanced Energy from Solar Satellites
- Tropical: Enhanced Food from Horticultural Stations
- Metropolis: Enhanced Credit income from taxation
- Priority: P0 (Critical)

**FR-GALAXY-003: Galaxy View Interface**
- System shall display all planets in orbital layout
- System shall show planet ownership (Player/Enemy/Neutral)
- System shall indicate planet under terraforming (pulsing/animated)
- System shall show craft in orbit and docked
- System shall support click-to-select planet
- Priority: P0 (Critical)

**FR-GALAXY-004: Navigation System**
- System shall calculate travel time between planets
- System shall display ETA (Estimated Days to Arrival) before journey
- System shall consume Fuel during travel
- System shall support journey abortion mid-flight
- Priority: P0 (Critical)

### FR-ECON: Economic Systems

**FR-ECON-001: Resource Types**
- System shall implement 4 resource types: Food, Minerals, Fuel, Energy
- Resources shall have storage caps based on infrastructure
- Resources shall be transferable between planets via cargo ships
- Resources shall display current/maximum in UI
- Priority: P0 (Critical)

**FR-ECON-002: Income Calculation**
- System shall calculate resource income per turn
- Horticultural Stations produce Food (base rate × planet modifier)
- Mining Stations produce Minerals and Fuel (base rate × planet modifier)
- Solar Satellites produce Energy (base rate × planet modifier)
- Priority: P0 (Critical)

**FR-ECON-003: Population System**
- Planets shall have population count
- Population growth rate based on morale (function of tax rate)
- Population consumes Food each turn
- Population provides crew for ships
- Population generates tax revenue
- Priority: P0 (Critical)

**FR-ECON-004: Taxation System**
- Players shall set tax rate (0%-100%) per colony
- Higher tax rates reduce morale and population growth
- Tax revenue calculated: Population × Tax Rate × Planet Multiplier
- Metropolis planets provide enhanced tax revenue
- Priority: P0 (Critical)

**FR-ECON-005: Cost System**
- All purchases require Credits (converted from resources)
- Platoon equipment costs: 20,000-109,000 Credits (based on gear)
- Craft costs vary by type (documented in AFS-061)
- Building costs vary by type (documented in AFS-062)
- Priority: P0 (Critical)

### FR-ENTITY: Entity and Fleet Management

**FR-ENTITY-001: Entity System**
- System shall support up to 32 simultaneous craft
- Each entity shall have type, position, owner, and state
- Entities shall include: Battle Cruiser, Cargo Cruiser, Solar Satellite, Atmosphere Processor
- Priority: P0 (Critical)

**FR-ENTITY-002: Platoon System**
- Players shall create up to 24 platoons
- Platoons shall contain 1-200 troops
- Platoons shall have equipment (body armor, weapons)
- Platoons shall have training level (0-100%)
- Training increases over time on Starbase
- Priority: P0 (Critical)

**FR-ENTITY-003: Fleet Roster**
- System shall display all craft in fleet (max 32)
- UI shall show craft location (orbit, docked, in transit)
- UI shall show craft cargo and passenger capacity
- UI shall support craft selection and command issuing
- Priority: P0 (Critical)

**FR-ENTITY-004: Planet Capacity**
- Each planet shall have 3 Docking Bays
- Each planet shall have 6 surface platforms
- Maximum 9 craft per planet (3 docked + 6 surface)
- Attempting to exceed capacity displays warning
- Priority: P0 (Critical)

### FR-COLONY: Colony Development

**FR-COLONY-001: Terraforming**
- Players shall purchase Atmosphere Processors
- Processors shall be sent to neutral planets via Navigation Screen
- Processors shall land and format planet automatically
- Formatting time based on planet size
- Formatted planets become player colonies
- Priority: P0 (Critical)

**FR-COLONY-002: Building Placement**
- Players shall place buildings on colony surface via Buy Screen
- Mining Stations produce Minerals and Fuel
- Horticultural Stations produce Food
- Solar Satellites orbit and produce Energy
- Buildings require crew before activation
- Priority: P0 (Critical)

**FR-COLONY-003: Resource Storage**
- Each colony shall store resources locally
- Storage capacity increases with infrastructure
- Resources shall transfer between colonies via Cargo Cruisers
- Starbase acts as central depot
- Priority: P0 (Critical)

**FR-COLONY-004: Colony HUD**
- System shall display colony status: population, resources, military strength
- System shall show buildings and their production
- System shall show tax rate and morale
- System shall support building/unit purchase from colony view
- Priority: P1 (Important)

### FR-COMBAT: Combat Systems

**FR-COMBAT-001: Space Combat**
- Battles occur when fleets meet at same planet
- Combat resolves using military strength comparison
- Military strength = Σ(Platoon troops × Equipment quality × Training level)
- Higher aggression setting increases strength but casualties
- Winner gains planet control
- Priority: P0 (Critical)

**FR-COMBAT-002: Ground Combat**
- Platoons land on enemy planets via Battle Cruisers
- Garrison vs Invader strength comparison
- Combat animation displays force comparison
- Casualties calculated based on strength differential
- Equipment lost when platoons eliminated
- Priority: P0 (Critical)

**FR-COMBAT-003: Aggression Control**
- Players adjust aggression slider during combat
- Higher aggression: More strength, faster resolution, more casualties
- Lower aggression: Less strength, slower resolution, fewer casualties
- Optimal use: High aggression when winning, low when losing
- Priority: P1 (Important)

**FR-COMBAT-004: Combat Resolution**
- System displays battle progress via Video Window
- System shows military strength bars (player=green, enemy=red)
- System shows troop count decline
- System displays victory/defeat animation
- System updates planet ownership
- Priority: P0 (Critical)

**FR-COMBAT-005: Retreat Mechanic**
- Players may retreat platoons mid-battle (return to Battle Cruiser)
- Retreating saves remaining troops but concedes planet
- System calculates partial casualties during retreat
- Priority: P1 (Important)

### FR-AI: Artificial Intelligence

**FR-AI-001: AI Opponent**
- AI shall control enemy faction (Hitotsu)
- AI shall execute full game loop during AI turn
- AI shall build infrastructure, train units, attack player
- AI actions execute automatically without player input
- Priority: P0 (Critical)

**FR-AI-002: AI Decision Making**
- AI shall prioritize resource production early game
- AI shall build military when threatened
- AI shall attack when military advantage exists
- AI shall defend planets under assault
- Priority: P0 (Critical)

**FR-AI-003: Difficulty Levels**
- System shall support 3 difficulty levels: Easy, Normal, Hard
- Easy: AI has resource/production penalties
- Normal: AI plays at equal capability
- Hard: AI has resource/production bonuses
- Priority: P1 (Important)

**FR-AI-004: AI Personalities (Future)**
- Placeholder for AI personality system
- Aggressive: Prioritizes military, attacks frequently
- Economic: Prioritizes resource production, defends
- Balanced: Mixed strategy
- Priority: P2 (Nice to Have)

### FR-MILITARY: Military Management

**FR-MILITARY-001: Platoon Training**
- Civilians drafted from population to form platoons
- Training occurs on Starbase only
- Training time until 100% (equivalent to Five-Star General)
- Training can be interrupted by deploying partially-trained platoons
- Priority: P0 (Critical)

**FR-MILITARY-002: Equipment System**
- Players purchase body armor and weapons separately
- Equipment quality affects combat strength
- Better equipment costs more Credits
- Equipment catalog displays costs and stats
- Priority: P0 (Critical)

**FR-MILITARY-003: Platoon Commissioning**
- Platoons commissioned when fully trained and equipped
- Commissioned platoons available for deployment
- Platoons load onto Battle Cruisers (4 platoons per ship)
- Priority: P0 (Critical)

**FR-MILITARY-004: Platoon Decommissioning**
- Players can decommission platoons to recover troops
- Equipment cannot be sold back (design decision)
- Decommissioned troops return to civilian population
- Used to redistribute forces or cut costs
- Priority: P1 (Important)

### FR-CRAFT: Spacecraft

**FR-CRAFT-001: Battle Cruiser**
- Carries up to 4 platoons
- Requires Fuel to travel between planets
- Requires crew before operation
- Used for planetary assault and defense
- Priority: P0 (Critical)

**FR-CRAFT-002: Cargo Cruiser**
- Carries large quantities of resources (Food/Minerals/Fuel/Energy)
- Carries civilian passengers
- Requires Fuel to travel between planets
- Requires crew before operation
- Priority: P0 (Critical)

**FR-CRAFT-003: Solar Satellite Generator**
- Orbits planet and generates Energy
- Nuclear powered (no crew required)
- Automatically activated when in orbit
- Transfers Energy to planet surface storage
- Priority: P0 (Critical)

**FR-CRAFT-004: Atmosphere Processor**
- Terraforms neutral planets into colonies
- Nuclear powered (no crew required)
- Single-use device (consumed during terraforming)
- Cannot own more than one at a time
- Priority: P0 (Critical)

**FR-CRAFT-005: Mining Station**
- Placed on planet surface
- Produces Minerals and Fuel
- Requires crew before activation
- Can travel between planets if needed
- Priority: P0 (Critical)

**FR-CRAFT-006: Horticultural Station**
- Placed on planet surface
- Produces Food
- Requires crew before activation
- Can travel between planets if needed
- Priority: P0 (Critical)

### FR-UI: User Interface

**FR-UI-001: Main Screen**
- Central hub showing star system map
- Control panel with icons for all subscreens
- Video Window showing current planet view
- Message log displaying events and alerts
- Pause and sound controls
- Priority: P0 (Critical)

**FR-UI-002: Government Screen**
- Displays colony statistics (population, resources, morale, tax rate)
- Supports switching between colonies
- Shows resource bars and numeric values
- Supports tax rate adjustment
- Priority: P0 (Critical)

**FR-UI-003: Buy Screen**
- Catalog of purchasable items (buildings, ships, equipment)
- Displays item costs and player resources
- Supports item purchase and automatic delivery to Starbase
- Shows availability based on resources and docking bay space
- Priority: P0 (Critical)

**FR-UI-004: Navigation Screen**
- Fleet roster showing all 32 craft slots
- Craft detail panel showing location, cargo, crew
- Command buttons: Launch, Journey, Land, Abort
- Heading panel showing destination and EDA
- Priority: P0 (Critical)

**FR-UI-005: Platoon Management Screen**
- Platoon roster (24 slots)
- Equipment selection for armor and weapons
- Training progress indicator
- Commission and decommission buttons
- Cost display
- Priority: P0 (Critical)

**FR-UI-006: Cargo Bay Screen**
- Displays planet docking bays (3) and current craft
- Shows planet stores and craft cargo holds
- Supports resource transfer (load/unload)
- Supports passenger embarkation
- Supports craft crewing
- Priority: P0 (Critical)

**FR-UI-007: Planet Surface Screen**
- Shows 6 surface platforms
- Displays craft on surface
- Supports moving craft between docking bays and surface
- Displays Mining/Horticultural Stations with ON/OFF toggles
- Priority: P0 (Critical)

**FR-UI-008: Combat Control Screen**
- Shows planet surface grid with platoons
- Displays military strength comparison (player vs enemy)
- Aggression slider control
- Battle progress indicators
- Video Window with battle animations
- Priority: P0 (Critical)

**FR-UI-009: Mobile UI Adaptations**
- All screens must support touch input
- Larger touch targets (minimum 44×44 points)
- Swipe gestures for navigation
- Context menus for secondary actions
- Simplified layouts for smaller screens
- Priority: P0 (Critical)

### FR-AUDIO: Audio and Music

**FR-AUDIO-001: Music System**
- Background music during gameplay
- Distinct tracks for: Main Menu, Galaxy View, Combat
- Music volume control in settings
- Seamless looping
- Priority: P1 (Important)

**FR-AUDIO-002: Sound Effects**
- UI interaction sounds (button clicks, selections)
- Combat sounds (weapons fire, explosions)
- Ambient sounds (engine hum for spaceships, planet atmospheres)
- Alert sounds (new message, low resources, combat initiated)
- Priority: P1 (Important)

**FR-AUDIO-003: Audio Mixing**
- Master volume control
- Separate Music and SFX volume controls
- Mute option
- Priority: P1 (Important)

### FR-VFX: Visual Effects

**FR-VFX-001: Planet Shaders**
- PSX-style dithering and color banding
- Rotation animations
- Atmospheric effects (clouds, storms)
- Terraforming visual effects (energy waves)
- Priority: P1 (Important)

**FR-VFX-002: Space Effects**
- Starfield background (parallax scrolling)
- Ship engine trails
- Weapon fire effects (lasers, projectiles)
- Explosion effects (ship destruction, planetary bombardment)
- Priority: P1 (Important)

**FR-VFX-003: UI Effects**
- Screen transitions (fade, slide)
- Button hover/press states
- Progress bar animations
- Alert pulsing
- Priority: P2 (Nice to Have)

### FR-PLATFORM: Platform-Specific Features

**FR-PLATFORM-001: PC Features**
- Windowed and fullscreen modes
- Multiple resolution support (720p to 4K)
- Graphics quality settings
- Keyboard shortcuts for all actions
- Mouse hover tooltips
- Priority: P0 (Critical)

**FR-PLATFORM-002: Mobile Features**
- Portrait and landscape orientation support
- Dynamic resolution scaling
- Battery-saving mode
- Touch gesture tutorial
- Pause on app background
- Priority: P0 (Critical)

**FR-PLATFORM-003: Cloud Services**
- Cloud save synchronization (PC ↔ Mobile)
- Achievement system (Steam/Google Play/Apple Game Center)
- Leaderboards (optional, future)
- Priority: P1 (Important)

### FR-TUTORIAL: New Player Experience

**FR-TUTORIAL-001: Tutorial Mode**
- Guided tutorial covering core mechanics
- Step-by-step instructions for first colony
- Prompts for first platoon creation
- Guidance through first combat
- Skippable for experienced players
- Priority: P1 (Important)

**FR-TUTORIAL-002: In-Game Help**
- Context-sensitive tooltips
- Glossary of game terms
- Help button on each screen
- FAQ section
- Priority: P1 (Important)

### FR-VICTORY: Victory Conditions

**FR-VICTORY-001: Military Victory**
- Eliminate all enemy platoons
- Capture all enemy planets
- Control enemy home planet (Hitotsu)
- Priority: P0 (Critical)

**FR-VICTORY-002: Defeat Condition**
- Player loses all planets
- Player has no remaining military units
- Player cannot recover (resource deadlock)
- Priority: P0 (Critical)

---

## 6. Non-Functional Requirements

### NFR-PERF: Performance

**NFR-PERF-001: Frame Rate**
- PC: Maintain 60 FPS minimum at 1080p on mid-range hardware
- Mobile: Maintain 30 FPS minimum on devices from 2020+
- UI interactions shall respond within 100ms

**NFR-PERF-002: Load Times**
- Game launch to main menu: <5 seconds
- Save load time: <3 seconds
- Screen transitions: <1 second

**NFR-PERF-003: Memory Usage**
- PC: <2GB RAM usage
- Mobile: <500MB RAM usage
- No memory leaks during extended play sessions

### NFR-SCALE: Scalability

**NFR-SCALE-001: Entity Limits**
- Support 32 concurrent craft (original design limit)
- Support 24 platoons maximum
- Support 6 planets per star system

**NFR-SCALE-002: Session Length**
- Support continuous play for 4+ hours without performance degradation
- Support save files up to 100 turns

### NFR-COMPAT: Compatibility

**NFR-COMPAT-001: Platform Support**
- PC: Windows 10/11, macOS 12+, Ubuntu 20.04+
- Mobile: iOS 14+, Android 10+

**NFR-COMPAT-002: Input Devices**
- Mouse + Keyboard (PC)
- Touchscreen (Mobile)
- Gamepad (PC, optional support)

### NFR-ACCESS: Accessibility

**NFR-ACCESS-001: Visual Accessibility**
- Colorblind modes (Deuteranopia, Protanopia, Tritanopia)
- UI scaling options (80%, 100%, 120%)
- High contrast mode

**NFR-ACCESS-002: Audio Accessibility**
- Subtitles for any narration
- Visual indicators for audio cues
- Separate volume controls

### NFR-MAINTAIN: Maintainability

**NFR-MAINTAIN-001: Code Quality**
- C# code follows Unity best practices
- All public APIs documented with XML comments
- Unit test coverage >70% for core systems

**NFR-MAINTAIN-002: Data-Driven Design**
- All game balance values in ScriptableObjects
- Unit stats, building costs, resource rates configurable without code changes
- Support for modding via JSON data files (future)

---

## 7. Success Metrics

### Launch Metrics (First 30 Days)

**Player Engagement**
- Average session length: 45+ minutes
- Return rate (Day 7): >40%
- Tutorial completion rate: >60%

**Technical Performance**
- Crash rate: <0.1% of sessions
- Average frame rate: >55 FPS (PC), >28 FPS (Mobile)
- Save/load success rate: >99.9%

**Player Satisfaction**
- Steam review score: >75% positive
- Mobile app store rating: >4.0 stars
- Critical review scores: >70/100

### Long-Term Metrics (First 6 Months)

**Retention**
- Monthly active users (MAU): Target TBD based on marketing
- Average games played per player: >5
- Completion rate (victory achieved): >30%

**Community Health**
- Active Discord/forum members: Target TBD
- User-generated content (if mod support): >10 mods
- Bug report response time: <48 hours

---

## 8. Timeline Overview

### Phase 0: Pre-Production ✅ COMPLETE
- Decompilation analysis
- Feasibility assessment
- Art direction research

### Phase 1: Design Documentation (Current Phase)
- Executive Summary ✅
- PRD (this document)
- AFS specifications (~35 documents)
- Traceability matrix
- Art requirements
- Implementation plan

### Phase 2: Prototyping (Future)
- Core game loop prototype
- Combat system validation
- Art style proof-of-concept
- Mobile control testing

### Phase 3: Production (Future)
- Full implementation per AFS specifications
- Asset creation
- Iteration based on playtesting

### Phase 4: Polish & Release (Future)
- Bug fixing
- Performance optimization
- Platform certification
- Marketing and launch

---

## 9. Risks and Mitigations

### Technical Risks

**Risk: Mobile Performance Below Target**
- Mitigation: Enforce polygon budgets, dynamic LOD, resolution scaling
- Contingency: Reduce visual effects, limit simultaneous craft rendering

**Risk: Combat Balance Difficulty**
- Mitigation: Use original formulas as baseline, extensive playtesting
- Contingency: Add difficulty modifiers, balance patches post-launch

**Risk: Cross-Platform Save Corruption**
- Mitigation: Robust serialization with version checking, backups
- Contingency: Local-only saves, cloud sync disabled until fixed

### Design Risks

**Risk: Core Loop Not Engaging**
- Mitigation: Early prototype testing, rapid iteration
- Contingency: Add quality-of-life features, streamline pacing

**Risk: UI Too Complex for Mobile**
- Mitigation: Design touch-first, simplify information density
- Contingency: Mobile-specific simplified UI mode

**Risk: AI Too Weak or Too Strong**
- Mitigation: Difficulty levels, AI testing across skill levels
- Contingency: Balance patches, AI behavior tuning

### Business Risks

**Risk: Scope Creep**
- Mitigation: Strict Core/Enhanced/Expansion tier enforcement
- Contingency: Cut Enhanced features, focus on Core MVP

**Risk: Extended Development Time**
- Mitigation: Agile sprints, regular milestone reviews
- Contingency: Delay non-Core features to post-launch updates

---

## 10. Out of Scope

### Explicitly Excluded from Version 1.0

**Multiplayer Features**
- Online multiplayer
- Local hot-seat multiplayer
- Asynchronous play
- *Reason:* Complexity and testing burden. Evaluate for future expansion.

**Extended Content**
- Additional star systems beyond 1
- Campaign mode with narrative
- More than 4 planet types
- More than 2 factions (Player + AI)
- *Reason:* Scope management. Core experience must be solid first.

**Advanced Modding**
- Scenario editor
- Custom faction creation
- Steam Workshop integration
- *Reason:* Post-launch feature once community interest validated.

**Social Features**
- In-game chat
- Friend lists
- Spectator mode
- *Reason:* No multiplayer in v1.0, premature.

**Analytics and Telemetry**
- Detailed player behavior tracking
- Heatmaps and session recording
- *Reason:* Privacy concerns, focus on core functionality first.

**Procedural Generation Beyond Planets**
- Procedurally generated galaxy layouts
- Random events system
- Dynamic story elements
- *Reason:* Fixed galaxy ensures balanced experience.

---

## 11. Dependencies

### External Dependencies

**Technology Stack**
- Unity 6000 LTS (aligned with company warzones project)
- Universal Render Pipeline (URP) 17.3.0+
- Unity New Input System 1.16.0+
- Dual-library architecture (Overlord.Core + Unity presentation layer)
- System.Text.Json for serialization (checksum validation)
- xUnit + Unity Test Framework for comprehensive testing
- Unity Cloud Save (if cloud features implemented)

**Third-Party Assets**
- Audio middleware (FMOD or similar) - TBD
- Analytics SDK (if implemented) - TBD

**Platform SDKs**
- Steam SDK (PC)
- Google Play Services (Android)
- Apple Game Center (iOS)

### Internal Dependencies

**Art Assets**
- 3D models (low-poly style)
- Textures (256×256 to 512×512)
- UI sprites and icons
- Shader materials

**Audio Assets**
- Music tracks (6 minimum)
- Sound effects (80+ minimum)

**Documentation**
- AFS specifications for all features
- Traceability matrix
- Art requirements document
- Implementation plan

---

## 12. Approval and Sign-Off

### Review Status

| Role | Name | Status | Date |
|------|------|--------|------|
| Project Lead | TBD | ⏳ Pending | - |
| Lead Developer | TBD | ⏳ Pending | - |
| Art Director | TBD | ⏳ Pending | - |
| QA Lead | TBD | ⏳ Pending | - |

### Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Dec 6, 2025 | Initial PRD created | Project Lead |

---

**Document Status:** Draft - Awaiting Review
**Next Review Date:** Upon AFS Completion
**Related Documents:**
- Executive Summary: `design-docs/v1.0/planning/executive-summary.md`
- AFS Index: `design-docs/v1.0/afs/README.md` (to be created)
- Traceability Matrix: `design-docs/v1.0/traceability/traceability-matrix.md` (to be created)
