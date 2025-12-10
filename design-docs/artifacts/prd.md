---

documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 24
workflowType: 'prd'
lastStep: 11
project_name: 'Overlord'
user_name: 'Venomous'
date: '2025-12-09'
---

# Product Requirements Document - Overlord

**Author:** Venomous
**Date:** 2025-12-09

---

## Terminology Reference

**IMPORTANT:** This section defines key terminology used throughout this document. To rename terms in the future, update the definitions below and perform a global find-replace.

### Core Game Modes

- **Flash Conflict:** Quick-play tactical scenarios (5-15 minutes) that serve as both tutorials and standalone challenges. Inspired by Magic: The Gathering Arena's in-progress scenarios. Reuses existing game systems without introducing new mechanics.
  - **Find-Replace Pattern:** `Flash Conflict` (to change terminology, replace all instances)
  - **Alternative Names Considered:** Flash Conflict, Tactical Snapshots, Crisis Moments, Skirmish Protocols

- **Campaign Mode:** Full 4X strategy game (45-60 minutes) where players compete against AI opponents for galactic conquest.

- **Scenario Pack:** Data-driven JSON configuration defining AI personality, galaxy layout, faction lore, and resource settings. Enables hot-swappable content without code changes.

### Quick Reference

| Term | Type | Duration | Description |
|------|------|----------|-------------|
| Flash Conflict | Tactical Challenge | 5-15 min | Single scenario with pre-configured state and victory conditions |
| Campaign | Full Game | 45-60 min | Complete 4X experience with all 18 systems |
| Scenario Pack | Configuration | N/A | JSON-based AI and galaxy template |

**Usage Notes:**
- All instances of "Flash Conflict" in this document refer to the same feature
- If renaming is needed, use global find-replace: `Flash Conflict` → `New Name`
- Ensure consistency across PRD, Epics, Architecture, and code comments

---

## Executive Summary

### Project Context

**Overlord** is a turn-based 4X strategy game, a modern remake of the classic 1990 game "Overlord" (aka "Supremacy"). This PRD documents the **Phaser + TypeScript implementation** following a strategic pivot from Unity development.

**Technical Pivot Rationale:**
The original Unity 6000 + C# implementation proved incompatible with Claude Code-assisted development workflows. To maintain development velocity and leverage AI-assisted coding capabilities, the project has been rebuilt using Phaser 3 + TypeScript with a platform-agnostic core architecture.

**Migration Status:**
All 18 core game systems have been successfully ported to `Overlord.Phaser/src/core/` with 304 passing tests and 93.78% code coverage. The game logic is platform-independent and battle-tested.

### What Makes This Special

**1. Developer Experience as a First-Class Requirement**

Unlike traditional game development where tooling is secondary, this project prioritizes **AI-assisted development compatibility**. The Phaser + TypeScript architecture enables:
- Seamless Claude Code integration
- Rapid iteration with AI assistance
- Platform-agnostic testing (no editor required)
- Modern web development workflows

**2. Infinite Replayability Through Scenario Packs**

Building on the classic game's foundation, this version introduces **data-driven extensibility** that the original C64 hardware could never support:

- **Enemy Faction Profiles:** Alien races with unique lore, backstory, and visual themes
- **AI Configuration Matrices:** Personality types, aggression curves, economic strategies, difficulty modifiers
- **Galaxy Templates:** Configurable planet counts, type distributions, spatial layouts, resource abundance
- **JSON-Based Asset Loading:** New scenarios without code changes

This transforms a fixed single-player experience into a platform for unlimited strategic variations.

**3. Cloud-Native Architecture**

- **Deployment:** Vercel edge network (instant global access, zero-downtime deploys)
- **Persistence:** Supabase PostgreSQL backend
  - Compressed save game storage with checksum validation
  - User authentication and profiles
  - Scenario pack distribution and versioning
  - Leaderboards and player statistics
- **Web-First:** No downloads, instant access, cross-platform by default

### Target Audience

**Primary:** Desktop web players (modern browsers, mouse + keyboard)
**Secondary:** Mobile web players (tablets and phones, touch interface)

**Player Profile:**
- Strategy game enthusiasts (ages 25-45)
- Fans of classic 4X games (Master of Orion, Civilization, original Overlord)
- Players seeking deeper experiences than typical browser games
- Scenario creators interested in modding/customization

### Core Value Proposition

**For Players:** Classic 4X strategy depth meets modern web convenience, with unlimited replayability through community-created scenarios.

**For Developers:** A production example of AI-assisted game development using modern web technologies, demonstrating that complex strategy games can be built efficiently with Claude Code.

---

## Project Classification

**Technical Type:** Web Application (Browser-based game)
**Rendering Engine:** Phaser 3.85.2+ (WebGL/Canvas)
**Domain:** Strategy Gaming (4X genre)
**Complexity:** Medium-High
**Project Context:** Brownfield - reimplementation from Unity with architectural improvements

### Technical Characteristics

**Platform Targets:**
- **Desktop Web:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Web:** iOS Safari 14+, Chrome Mobile 90+
- **Performance Targets:**
  - Desktop: 60 FPS sustained gameplay
  - Mobile Web: 30 FPS sustained gameplay
  - Load time: <5 seconds to playable state

**Key Constraints (Phaser + Browser):**
- WebGL 2.0 availability for best performance (Canvas fallback)
- Audio context limitations (user gesture required for audio init)
- Mobile browser memory constraints (~500 MB budget)
- Local storage limits for offline save caching
- No filesystem access (Supabase for persistence)

**Architecture Pattern:**
- Platform-agnostic core (`Overlord.Core/`) in TypeScript
- Phaser presentation layer (rendering, input, UI)
- Event-driven communication (Core systems → Phaser subscribers)
- Zero Phaser dependencies in core game logic

### Strategic Differentiators from Unity PRD

**What's Preserved:**
- All 18 game systems (combat, economy, AI, etc.)
- Turn-based 4X gameplay mechanics
- Original game's strategic depth
- 4-6 planet galaxy system
- Player vs AI opponent structure

**What's New/Different:**
- ✨ **Scenario Pack System** (data-driven enemies and galaxies)
- 🌐 **Web-native deployment** (Vercel + Supabase)
- 🎨 **2D/Isometric rendering** instead of low-poly 3D (browser performance)
- 💾 **Cloud saves** with cross-device sync
- 📊 **Leaderboards and player stats** (Supabase integration)
- 🛠️ **Developer experience optimized** for AI-assisted development

**What's Deferred:**
- Native mobile apps (iOS/Android) - web-only for MVP
- 3D graphics and URP shaders - 2D/isometric sprites
- Desktop platform builds - browser-based only
- Offline play - requires Supabase connection

---

## Success Criteria

### User Success

**Core Victory Condition:**
A user succeeds when they **complete a full campaign game** (player vs AI, achieving military victory or defeat). This validates the core 4X gameplay loop.

**Secondary Success Metrics:**

1. **Session Engagement:**
   - **Full Campaign:** 45+ minute average session length (desktop web)
   - **Flash Conflicts:** 5-15 minute quick-play sessions (mobile web friendly)
   - Day 7 return rate: >40%
   - Tutorial completion rate: >60%

2. **Scenario Pack Adoption:**
   - **Primary Metric:** Average replays per scenario >2 (users finding scenarios worth replaying)
   - Scenario completion rate: >50% for Flash Conflicts, >30% for full campaigns
   - Scenario diversity: Users try >3 different scenario packs

3. **Cross-Device Experience:**
   - Save/load success rate: >99.9% (Supabase persistence)
   - Cross-device continuity: Users successfully resume games on different devices
   - Zero data loss incidents during device switches

**User Delight Moments:**
- **"Aha!" Moment:** First successful planetary invasion using Flash Conflict as training
- **Replayability Moment:** "I want to try that scenario again with a different strategy"
- **Convenience Moment:** "I can pick up exactly where I left off on my phone"

---

### Flash Conflicts (New Feature)

**Concept:** Isolated, scenario-driven mini-games inspired by Magic: The Gathering Arena's in-progress scenarios. These serve dual purposes:

1. **Interactive Tutorials:** Teach specific game mechanics (e.g., "Launch the Genesis Device on Hitotsu")
2. **Quick-Play Skirmishes:** 5-15 minute tactical challenges for shorter play sessions

**Design Philosophy:**
- Reuse existing game systems (no new mechanics)
- Focus on specific tactical situations
- Instant-action scenarios (no multi-turn buildup)
- Example scenarios:
  - "Defend Starbase" - Player has 2 platoons, AI attacking with 5 Battle Cruisers
  - "Terraform Rush" - Deploy Atmosphere Processor under time pressure
  - "Invasion Landing" - Execute ground assault with limited forces

**Success Metrics for Flash Conflicts:**
- Completion rate: >60% (higher than full campaign due to shorter commitment)
- Replay rate: >3 plays per scenario (replayability validation)
- Tutorial effectiveness: Users who complete Flash Conflict tutorials have >50% higher campaign completion rate

**Naming:** *(To be determined collaboratively - suggestions welcome)*
- **Flash Conflicts**
- **Tactical Snapshots**
- **Crisis Moments**
- **Skirmish Protocols**
- *(Open to better names that fit the sci-fi theme)*

---

### Business Success

**Deferred to Post-MVP Discussion:**
Business metrics, monetization strategy, and commercial viability will be evaluated after:
- Playable prototype validation
- Alpha testing feedback
- User engagement data from initial release

**Post-MVP Considerations:**
- Web analytics (unique visitors, bounce rate, engagement)
- Scenario pack distribution metrics
- Community feature adoption (user-created scenarios, leaderboards)
- Potential commercial pathways (premium scenario packs, ad-supported free tier, etc.)

---

### Technical Success

**Performance Targets:**
- **Desktop Web:** 60 FPS sustained gameplay (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Mobile Web:** 30 FPS sustained gameplay (iOS Safari 14+, Chrome Mobile 90+)
- **Load Time:** <5 seconds to playable state
- **Crash Rate:** <0.1% of sessions

**Reliability Targets:**
- Save/load success rate: >99.9%
- Supabase API uptime: >99.5%
- Zero save data corruption incidents
- Cross-browser compatibility: >98% success rate on target browsers

**Quality Targets:**
- Code coverage: >70% for core game systems (maintained from migration)
- Bug report response time: <48 hours
- Critical bug resolution: <7 days

**Platform Flexibility:**
- Tech stack remains flexible through prototype phase
- Core game engine architecture supports multiple rendering backends:
  - Current: Phaser 3 + TypeScript (web)
  - Future options: Unity (desktop/mobile native), Electron wrapper (Steam), React Native (mobile apps)
- Shared components: Game logic (`Overlord.Core`), assets, save format, user profiles

---

### Measurable Outcomes

**Prototype Phase (Weeks 1-4):**
- ✅ 5 planets render and are clickable
- ✅ Turn system advances correctly
- ✅ Core combat loop executes (space battle → ground invasion → victory)
- ✅ Save/load functional with Supabase
- ✅ At least 1 Flash Conflict playable start to finish

**Alpha Phase (Post-Prototype):**
- All 18 core systems integrated with Phaser rendering
- 3-5 scenario packs available (1 tutorial-focused, 2-4 tactical challenges)
- User feedback sessions validate Flash Conflict concept
- Cross-device save continuity verified

**Beta Phase:**
- Performance targets met on all target browsers
- Crash rate <0.1%
- Community feedback incorporated
- Scenario pack system polished based on user testing

**v1.0.0 Release:**
- Full campaign mode stable and engaging (45+ min sessions)
- 5-10 Flash Conflicts available
- Cross-device play seamless
- Tutorial completion rate >60%
- Day 7 retention >40%

---

## Product Scope

### MVP - Minimum Viable Product

**Core Requirement:** Validate that the 4X gameplay loop is fun and worth building on.

**MVP Includes:**
1. **Full Campaign Mode:**
   - All 18 game systems functional (already ported)
   - Player vs AI opponent (4 personalities × 3 difficulties)
   - 4-6 planet galaxy generation
   - Turn-based gameplay (Income → Action → Combat → End phases)
   - Victory/defeat conditions

2. **Flash Conflicts (3-5 scenarios):**
   - 1-2 tutorial scenarios (teach Genesis Device deployment, combat basics)
   - 2-3 tactical challenge scenarios (quick-play skirmishes)
   - Scenario selection UI

3. **Scenario Pack System (Foundation):**
   - JSON-based scenario data schema
   - Enemy faction profile loading (AI config, lore, visual theme)
   - Galaxy template loading (planet counts, types, layouts)
   - Basic scenario browser UI

4. **Persistence (Supabase):**
   - User authentication
   - Save game storage (compressed, checksummed)
   - Cross-device save sync
   - User profile (settings, progress)

5. **Rendering (Phaser):**
   - 2D/Isometric planet view
   - Galaxy map UI
   - Planet management UI
   - Combat resolution UI
   - Mobile-responsive touch controls

**MVP Excludes (Post-Launch):**
- Community features (scenario sharing, leaderboards, user-generated content)
- Advanced scenario editor UI
- Native mobile apps (web-only for MVP)
- Offline play mode
- Multiplayer (hot-seat or online)

---

### Growth Features (Post-MVP)

**Evaluated After v1.0.0 Release Based on User Feedback:**

1. **Community Features:**
   - User-created scenario packs
   - Scenario sharing/marketplace
   - Leaderboards (campaign victories, Flash Conflict speed runs)
   - Player ratings and reviews for scenarios

2. **Extended Content:**
   - 10-20 additional Flash Conflicts
   - 5-10 additional scenario packs (enemy factions with unique lore)
   - Campaign difficulty modes beyond current 3 levels

3. **Native Platforms:**
   - Electron wrapper for Steam/desktop distribution
   - React Native mobile apps (iOS/Android)
   - Shared engine/assets/saves across all platforms

4. **Advanced Features:**
   - Scenario editor UI (currently JSON-based only)
   - Replay system (watch previous battles)
   - Achievement system
   - Statistics dashboard (games played, win rate, favorite scenarios)

---

### Vision (Future)

**Long-Term Possibilities (Beyond First 6 Months):**

1. **Multiplayer Expansion:**
   - Hot-seat local multiplayer
   - Asynchronous online multiplayer (play-by-email style)
   - Real-time competitive modes

2. **Procedural Content:**
   - AI-generated scenario packs
   - Endless campaign mode with procedural galaxies
   - Dynamic events and narrative branching

3. **Modding Platform:**
   - Full scenario creation toolkit
   - Custom AI personalities and decision trees
   - Asset import pipeline (community-created alien races)

4. **Commercial Pathways:**
   - Premium scenario pack marketplace
   - Sponsored scenarios (brand integration)
   - Educational licensing (strategy/tactics training)

---

## User Journeys

### Journey 1: Alex Chen - Rediscovering Strategic Depth

**Opening Scene:**
Alex is a 34-year-old software engineer who grew up playing Master of Orion and Civilization on their family's 386. After years of shallow mobile games and quick-play shooters, they're craving the strategic depth they remember from their youth. Late one Friday evening, while browsing Reddit's r/4Xgaming, they see a post: *"Classic Overlord remake - web-based, plays like the C64 original but modernized."* The nostalgia hits hard. They click the link.

**Rising Action:**
Within 30 seconds, they're staring at a galaxy map with 5 planets - no download, no install, just instant play. They choose the "Balanced" AI personality (General Nexus) on Normal difficulty and start their first turn. The familiar rhythm returns immediately: building Mining Stations on their volcanic starter planet, commissioning their first platoon, watching resources tick up. But something feels different - better. The UI is clean, decisions are clear, and the game respects their time with smart defaults.

The breakthrough moment comes on Turn 18 when they launch their first invasion of the AI's planet. The ground combat resolution is tense - their 3 platoons with Standard equipment facing the AI's 4 platoons with Elite gear. They set aggression to 75% and watch the battle unfold. Victory! The planet is theirs. Alex realizes they've been playing for 52 minutes and completely lost track of time - in the best possible way.

**Climax:**
Three hours later (across two sessions - they had to step away for dinner but the game saved perfectly and they picked right back up), Alex achieves military victory by capturing Hitotsu. The satisfaction is immense. This isn't a watered-down mobile game pretending to be strategy - this is the real deal. They immediately start a new game to try the "Aggressive" AI personality.

**Resolution:**
Over the next week, Alex plays 6 complete campaigns, experimenting with different AI personalities and difficulty levels. They discover that "Defensive" AI on Hard is their favorite challenge - it forces them to build a strong economy before attacking. The game becomes their go-to evening unwind activity. When they mention it to their old college roommate (also a strategy game fan), the web link makes sharing effortless.

**What This Journey Reveals:**
- Instant-play web deployment (no download friction)
- Full campaign mode with all 18 systems functional
- 4 AI personalities × 3 difficulties (replayability)
- Save/load that works seamlessly (cross-session continuity)
- 45-60 minute average session length (deep engagement)
- Easy sharing via web URL

---

### Journey 2: Jordan Rivera - Reclaiming Dead Time

**Opening Scene:**
Jordan is a 28-year-old marketing manager with a 45-minute train commute each way. They've burned through every mobile game on the App Store - most are either mindless time-wasters or "free-to-play" cash grabs that interrupt gameplay every 30 seconds with ads. While scrolling Twitter during their morning commute, they see someone share a link to Overlord with the caption: *"Finally, a real strategy game I can play during my commute - Flash Conflicts are perfect for 10-minute sessions."* Jordan bookmarks it to try during lunch.

**Rising Action:**
During their lunch break, Jordan opens the link on their phone. The main menu shows two options: "Full Campaign" and "Flash Conflicts." Curious about the Flash Conflicts, they tap "Defend Starbase" - a 5-10 minute tactical challenge. The scenario drops them into an in-progress battle: Starbase under siege, 2 platoons defending, 5 AI Battle Cruisers incoming. No multi-turn buildup, just pure tactics.

Jordan sets their aggression to 60%, carefully positions their platoons, and watches the combat unfold. The first wave fails - the AI breaks through. Jordan tries again, this time using 40% aggression to minimize casualties while defending longer. Victory! The scenario completion screen shows their time: 8 minutes, 23 seconds. A small notification appears: *"Nice! Try 'Terraform Rush' next."*

**Climax:**
Over the next two weeks, Jordan completes all 5 Flash Conflicts multiple times during commutes and lunch breaks. Each scenario teaches a different tactical skill - deploying Genesis Devices, managing resources under pressure, executing planetary invasions. They never feel frustrated by running out of time mid-game because each scenario is self-contained. When Jordan's train arrives at their stop, they just close the browser tab - no save needed, the scenario completes or fails within the session.

The breakthrough comes when Jordan decides to try a "Full Campaign" on Saturday morning. Thanks to the Flash Conflicts, they already understand combat mechanics, resource management, and invasion tactics. The campaign feels natural, not overwhelming. They complete their first full campaign victory in one sitting (48 minutes) and immediately want to play another.

**Resolution:**
Jordan now has a ritual: Flash Conflicts during commutes (quick tactical hits), full campaigns on weekend mornings (deep strategy sessions). The game respects their time - short sessions when they're on-the-go, deep sessions when they have focus time. They recommend it to their coworker with: *"It's like having a real strategy game in your pocket, but it actually respects your time."*

**What This Journey Reveals:**
- Flash Conflicts system (3-5 tactical challenges, 5-15 minutes each)
- Mobile web optimization (touch controls, responsive UI)
- Session flexibility (no penalty for closing mid-Flash Conflict)
- Tutorial-through-gameplay (Flash Conflicts teach mechanics naturally)
- Flash → Campaign progression path (skills transfer)
- No save/load needed for Flash Conflicts (self-contained)

---

### Journey 3: Sam Taylor - From Curious to Confident

**Opening Scene:**
Sam is a 22-year-old graphic designer who's heard friends rave about 4X games like Civilization and Stellaris but feels intimidated by their complexity. They tried Civ VI once, got overwhelmed by the tutorial (which took 45 minutes and still left them confused), and gave up. While browsing gaming subreddits, they see a comment: *"If you're new to 4X games, try Overlord's Flash Conflicts - they teach you one mechanic at a time instead of dumping everything on you at once."* Intrigued, Sam clicks the link.

**Rising Action:**
The game's main menu shows "New to 4X games? Start here: Tutorial Flash Conflicts." Sam clicks and sees three tutorial scenarios:
1. **"Genesis Device 101"** - Learn planetary terraforming (5 min)
2. **"First Contact Combat"** - Learn basic ground combat (8 min)
3. **"Building Your Empire"** - Learn resource management (10 min)

Sam starts with Genesis Device 101. The scenario is simple: They have one Atmosphere Processor and need to deploy it on a neutral planet. Clear instructions walk them through selecting the craft, navigating to the target, and deploying. Success! The planet becomes theirs. The scenario took 4 minutes and Sam actually understood what happened.

Encouraged, Sam tries First Contact Combat. This time, they command 2 platoons defending against 1 AI platoon. The tutorial explains aggression settings, equipment modifiers, and casualty calculations. Sam experiments with different aggression levels and sees how it affects outcomes. By the third attempt, they win decisively. *"Oh, I get it now - aggression is risk vs reward!"*

**Climax:**
After completing all three tutorial Flash Conflicts, Sam feels confident enough to try a full campaign. They choose "Easy" difficulty and the "Defensive" AI personality (least aggressive). The first 10 turns feel manageable because they already understand the core mechanics from the tutorials. When they encounter their first real combat situation (Turn 15), they remember the lessons from First Contact Combat and execute a successful planetary invasion.

The breakthrough comes on Turn 28 when Sam achieves their first military victory. The feeling is incredible - they actually beat a 4X game! Sam immediately starts a second campaign on Normal difficulty to see if they can win again. This time, they complete it in 38 minutes (faster because they're more confident with decisions).

**Resolution:**
Two months later, Sam has completed 12 campaigns across different difficulty levels and AI personalities. They've become a vocal advocate for Overlord in their gaming Discord: *"If you've ever been curious about 4X games but thought they were too complex, try this. The Flash Conflicts teach you everything without making you feel stupid."* Sam has also introduced three friends to the game using the same tutorial path.

**What This Journey Reveals:**
- Tutorial Flash Conflicts (3 dedicated teaching scenarios)
- Clear learning progression (one mechanic at a time)
- Low-stakes practice environment (Flash Conflicts = safe experimentation)
- Difficulty settings that respect new players (Easy mode actually helps)
- Tutorial → Campaign confidence bridge
- Onboarding that doesn't gate access to full game (can skip tutorials if experienced)

---

### Journey Requirements Summary

These three journeys reveal the following capabilities needed for the playable prototype:

**Core Campaign System:**
- Full 18-system game loop (already ported ✓)
- 4 AI personalities (Aggressive, Defensive, Economic, Balanced) ✓
- 3 difficulty levels (Easy, Normal, Hard) ✓
- Save/load with Supabase persistence
- 45-60 minute average session length
- Victory/defeat conditions ✓

**Flash Conflict System:**
- 5-8 Flash Conflicts total:
  - 3 tutorial scenarios (Genesis Device, Combat, Empire Building)
  - 2-5 tactical challenge scenarios (Defend Starbase, Terraform Rush, Invasion Landing, etc.)
- 5-15 minute completion time per scenario
- Self-contained (no save/load needed within scenario)
- Scenario selection UI
- Completion tracking (which scenarios completed)

**Cross-Platform Web Experience:**
- Instant-play web deployment (Vercel)
- Desktop browser support (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Mobile web support (iOS Safari 14+, Chrome Mobile 90+)
- Touch controls for mobile
- Responsive UI (works on phone, tablet, desktop)

**Persistence & Continuity (Supabase):**
- User authentication (account creation, login)
- Campaign save/load (compressed, checksummed)
- Cross-device save sync (Alex plays on desktop, continues on laptop)
- User profile (settings, progress tracking)
- Flash Conflict completion history

**UI/UX Requirements:**
- Main menu (Campaign vs Flash Conflicts)
- Flash Conflict browser (list with difficulty indicators)
- Tutorial pathway signposting ("New to 4X? Start here")
- In-scenario instructions (for tutorial Flash Conflicts)
- Campaign UI (galaxy map, planet management, combat resolution) - already designed in Unity PRD
- Easy sharing (web URL, no friction)

**Post-MVP User Types (Deferred to Post-Alpha):**
- Flash Conflict Speedrunners (competitive leaderboards)
- Scenario Pack Curators (community discovery/rating)
- Content Moderators (flagged content review)
- System Administrators (operational monitoring)

---

## Innovation & Novel Patterns

This project introduces three strategic innovations that differentiate it from traditional 4X strategy games and demonstrate novel approaches to game design and development.

---

### Innovation 1: Flash Conflicts System

**What Makes It Novel:**

Traditional 4X games present a binary choice: either commit to a 2-4 hour campaign or skip the game entirely. Overlord introduces **Flash Conflicts** - isolated, tactical mini-games that deliver complete strategic experiences in 5-15 minutes. This innovation combines three traditionally separate systems into one unified feature:

1. **Tutorial System** - Teaching mechanics through playable scenarios instead of passive tutorials
2. **Quick-Play Mode** - Instant-action tactical challenges for shorter sessions
3. **Skill Training** - Practice environments that build confidence for full campaigns

**Inspiration & Market Context:**

- **Magic: The Gathering Arena** pioneered "scenario puzzles" where players resolve in-progress game states
- **Hearthstone's Solo Adventures** offered bite-sized PvE content as onboarding
- **Slay the Spire** demonstrated that roguelike "runs" could be satisfying in 30-45 minutes

**What Doesn't Exist Yet:**
No 4X strategy game has successfully adapted the "scenario puzzle" format to turn-based grand strategy. Most 4X tutorials are either:
- Passive tooltips that interrupt gameplay
- 60-90 minute "guided campaigns" that still feel overwhelming
- Simplified "baby modes" that don't transfer skills to full games

Flash Conflicts bridge this gap by reusing all existing game systems (combat, resources, AI) but starting mid-game with pre-configured tactical situations.

**Validation Approach:**

**Prototype Phase:**
- Build 2 Flash Conflicts: 1 tutorial ("Genesis Device 101"), 1 tactical challenge ("Defend Starbase")
- Measure: Completion rate (target: >60%), replay rate (target: >2), average completion time (target: 5-15 min)

**Alpha Phase:**
- Expand to 5 Flash Conflicts (3 tutorial + 2 tactical)
- A/B test: Users who complete tutorials vs users who skip → measure campaign completion rate difference (hypothesis: >50% higher completion for tutorial completers)
- Qualitative feedback: "Did Flash Conflicts help you learn the game?" (target: >70% yes)

**Beta Phase:**
- Add 3-5 more tactical challenge scenarios based on user requests
- Leaderboards for Flash Conflict completion times (measure: speedrun engagement)
- Cross-reference: Do Flash Conflict fans also play full campaigns, or are they separate audiences?

**Success Metrics:**
- **Primary:** Flash Conflict completion rate >60% (validates that format is engaging)
- **Secondary:** Users who complete tutorial Flash Conflicts have >50% higher campaign completion rate (validates educational effectiveness)
- **Tertiary:** Average >3 replays per tactical Flash Conflict (validates replayability)

**Risk Mitigation:**

**Risk 1: Flash Conflicts cannibalize full campaigns**
- *Mitigation:* Track conversion rate (Flash → Campaign). If <30% of Flash players try campaigns, add "progression hooks" (e.g., "You mastered this scenario! Try a full campaign with this AI personality").
- *Fallback:* Treat Flash Conflicts as standalone content (still valuable as mobile-friendly quick-play mode).

**Risk 2: Development cost too high (each scenario = custom setup)**
- *Mitigation:* Build scenario authoring tools early (JSON-based templates, save-state snapshots). Reuse existing game systems exclusively (no custom mechanics per scenario).
- *Fallback:* Ship MVP with 3-5 scenarios only; community creates additional scenarios post-launch.

**Risk 3: Players find scenarios too hard or too easy**
- *Mitigation:* Difficulty settings for Flash Conflicts (Easy/Normal/Hard presets). Telemetry on completion rates per scenario.
- *Fallback:* Adjust scenario parameters (troop counts, resources, AI aggression) via server-side JSON updates (no client updates needed).

---

### Innovation 2: Data-Driven Scenario Packs

**What Makes It Novel:**

Most 4X games ship with a fixed enemy faction. Mods may add variety, but they require code changes and are fragile across updates. Overlord treats **enemy factions, AI configurations, and galaxy templates as first-class data assets** loaded from JSON at runtime.

**Why This Matters:**
- **Original C64 Game:** Enemy faction hardcoded in 64KB ROM. No variation possible.
- **Modern Approach:** Enemy faction = JSON file with:
  - AI personality configuration (aggression curves, economic priorities, defense thresholds)
  - Lore and backstory (race name, leader name, diplomatic flavor text)
  - Visual theme (color palette, UI styling, craft appearances)
  - Galaxy template (planet count, type distribution, spatial layout, resource abundance)

**Example Scenario Pack JSON (Conceptual):**
```json
{
  "scenario_id": "krylon_empire",
  "faction": {
    "name": "Krylon Empire",
    "leader": "Overlord Vex",
    "aggression": 0.8,
    "economic_modifier": -0.2,
    "quote": "Your worlds will burn in plasma fire."
  },
  "galaxy": {
    "planet_count": 6,
    "types": ["volcanic", "volcanic", "desert", "tropical", "metropolis", "metropolis"],
    "resource_abundance": 1.5
  }
}
```

**Market Context:**

- **Existing Approach:** Games like Civilization, Stellaris have "leader packs" but require DLC purchases and engine updates
- **Modding Communities:** Skyrim, Minecraft demonstrate demand for user-generated content, but mods are fragile and hard to distribute
- **Asset Bundles:** Mobile games use server-delivered content updates, but rarely for core gameplay (usually cosmetics)

**What's Novel:**
Treating the **enemy faction itself as hot-swappable content** without code changes. Players can:
- Download community-created scenario packs
- Share custom enemy factions via JSON files
- Replay the same campaign with different AI personalities/difficulty curves

**Validation Approach:**

**Prototype Phase:**
- Ship with 1 default scenario pack (balanced AI, 5 planets)
- Architect JSON schema with extensibility (validate that new packs can be added without code changes)

**Alpha Phase:**
- Create 2 additional scenario packs (aggressive AI variant, defensive AI variant)
- Test loading/switching between packs seamlessly
- Measure: Do users try >2 different scenario packs? (validates variety is appealing)

**Beta Phase:**
- Community scenario pack creation tools (JSON editor or web form)
- Supabase-based scenario pack marketplace (upload/download/rate)
- Measure: How many user-created packs are downloaded? (validates creator interest)

**Success Metrics:**
- **Primary:** Users play >3 different scenario packs on average (validates variety demand)
- **Secondary:** Scenario pack completion rate >30% (validates packs are balanced/fun)
- **Tertiary:** Community-created packs account for >50% of total plays post-launch (validates creator ecosystem)

**Risk Mitigation:**

**Risk 1: JSON schema becomes outdated as game evolves**
- *Mitigation:* Version schema explicitly (`"schema_version": "1.0"`). Support backward compatibility for 2 versions.
- *Fallback:* Migration tool to auto-upgrade old packs to new schema.

**Risk 2: User-created packs are poorly balanced (too easy/hard)**
- *Mitigation:* Rating system (1-5 stars), difficulty tags (Easy/Medium/Hard), telemetry on completion rates.
- *Fallback:* Curated "official" packs only until community moderation tools exist.

**Risk 3: Low adoption (players stick with default pack)**
- *Mitigation:* Prompt to try new pack after campaign victory ("Try a harder challenge!"). Achievement for completing 3+ different packs.
- *Fallback:* Scenario packs remain a "power user" feature; core game works fine with defaults.

---

### Innovation 3: Developer Experience as Product Requirement

**What Makes It Novel:**

Game development traditionally treats tooling as secondary: "Pick the best engine for the game, then adapt workflows around it." Overlord inverts this: **developer productivity and AI-assisted development compatibility are first-class requirements** that influenced technology stack selection.

**The Problem:**
Unity 6000 + C# is a mature, powerful engine. However, it proved incompatible with Claude Code-assisted development:
- Unity's proprietary file formats (scenes, prefabs) are opaque to AI
- Build times and editor startup slow iteration cycles
- Platform-specific APIs create tight coupling

**The Solution:**
Phaser 3 + TypeScript was selected because:
- **AI-Readable Codebase:** Plain TypeScript files, no binary assets
- **Zero-Friction Iteration:** Edit → Save → Browser refresh (2 seconds)
- **Platform-Agnostic Core:** Game logic has zero rendering dependencies
- **Comprehensive Testing:** 304 tests with 93.78% coverage (run in <5 seconds)

**Why This Is Strategic, Not Just Practical:**

This isn't "we picked an easier tool" - it's "we picked a tool that amplifies developer leverage." With Claude Code:
- AI can read entire codebase and make surgical changes
- Iteration loops are seconds, not minutes
- Test-driven development is practical (fast feedback)
- Refactoring is safe (AI understands context)

**Market Context:**

- **Traditional Game Dev:** Unity/Unreal are industry standard, but developer velocity is constrained by build times and editor complexity
- **Indie Game Boom:** Itch.io, GameMaker, and web-first engines (Phaser, Godot) enable solo/small teams to ship faster
- **AI-Assisted Development:** GitHub Copilot, Cursor, Claude Code are transforming software development, but game dev hasn't adapted yet

**What's Novel:**
Treating **AI-assisted development compatibility as a hard requirement** that influences architecture decisions. This creates a precedent:
- Game engines should optimize for iteration speed, not just runtime performance
- Platform-agnostic architectures enable tool flexibility
- Comprehensive testing is mandatory for AI safety (AI can refactor confidently)

**Validation Approach:**

**Prototype Phase:**
- Measure: Time from "start implementing feature" to "feature working in browser"
- Hypothesis: Phaser + Claude Code can implement features 3-5× faster than Unity + manual development
- Track: Number of test failures caught by CI before merge (validates testing safety net)

**Alpha Phase:**
- Case study: Document time to implement a new Flash Conflict (target: <4 hours from idea to playable)
- Compare: Estimated effort in Unity vs actual effort in Phaser
- Qualitative: "How confident do you feel making changes to core systems?" (developer survey)

**Beta Phase:**
- Open-source the architecture pattern: Publish blog post on "Platform-Agnostic Game Dev with Claude Code"
- Measure: GitHub stars, community adoption, forks
- Validate: Can other developers replicate this workflow?

**Success Metrics:**
- **Primary:** Time to implement new Flash Conflict <4 hours (validates rapid iteration)
- **Secondary:** Test coverage remains >70% throughout development (validates AI safety)
- **Tertiary:** Zero "AI broke the game" incidents due to test coverage (validates architectural robustness)

**Risk Mitigation:**

**Risk 1: Phaser has limitations Unity doesn't (e.g., 3D rendering, native mobile)**
- *Mitigation:* Platform-agnostic core means we can swap rendering engines if needed. Core game logic (18 systems) runs independently.
- *Fallback:* Evaluate Unity/Godot/Native after prototype proves game is fun. Engine is replaceable; game logic is not.

**Risk 2: AI-assisted development introduces subtle bugs**
- *Mitigation:* Mandatory test coverage (>70%), CI/CD with automated testing, code review on all AI-generated changes.
- *Fallback:* Revert to manual development if AI regression rate exceeds human error rate.

**Risk 3: Developer workflow isn't transferable to teams**
- *Mitigation:* Document architecture patterns, publish open-source examples, create case studies.
- *Fallback:* Overlord remains a "solo dev + AI" success story; other teams adapt patterns incrementally.

---

### Innovation Summary Table

| Innovation | Problem Solved | Market Gap | Risk Level | MVP Priority |
|------------|----------------|------------|------------|--------------|
| **Flash Conflicts** | 4X tutorials are boring; quick-play modes don't teach skills | No 4X game has MTG Arena-style scenario puzzles | Medium | **HIGH** (Core MVP feature) |
| **Data-Driven Scenario Packs** | Fixed enemy factions limit replayability; mods are fragile | JSON-based enemy/galaxy configs don't exist in 4X | Low | **MEDIUM** (Foundation in MVP, full system post-Alpha) |
| **Developer Experience as Requirement** | Game dev tools slow AI-assisted development | No game has optimized architecture for Claude Code workflows | Low | **HIGH** (Already implemented) |

---

## Web Application Specific Requirements

### Technical Architecture

**Rendering Strategy:**
- **Primary:** WebGL 2.0 hardware acceleration (60 FPS target)
- **Fallback:** Canvas 2D rendering (30 FPS graceful degradation)
- **Detection:** Phaser.AUTO auto-selects best available renderer
- **Adaptation:** Reduce particle effects, disable shaders, lower sprite counts on Canvas fallback

**Browser Support Matrix:**

| Browser | Version | Renderer | FPS Target | Status |
|---------|---------|----------|------------|--------|
| Chrome Desktop | 90+ | WebGL 2.0 | 60 FPS | ✅ Primary |
| Firefox Desktop | 88+ | WebGL 2.0 | 60 FPS | ✅ Primary |
| Safari Desktop | 14+ | WebGL 2.0 | 60 FPS | ✅ Primary |
| Edge Desktop | 90+ | WebGL 2.0 | 60 FPS | ✅ Primary |
| Chrome Mobile | 90+ | WebGL 2.0 | 30 FPS | ✅ Secondary |
| iOS Safari | 14+ | WebGL 2.0 | 30 FPS | ✅ Secondary |
| Older Browsers | Any | Canvas 2D | 30 FPS | ⚠️ Compatibility |

**Performance Warning System:**
- Detect Canvas fallback on load
- Display banner: "Your browser is using compatibility mode. For best experience, update to Chrome 90+, Firefox 88+, or Safari 14+."
- User dismissible (don't block gameplay)
- Core turn-based gameplay unaffected by Canvas fallback (30 FPS sufficient)

---

### Audio System

**User Activation Required:**
- Web Audio Context requires user gesture (browser security policy)
- Display "Click to Start" splash screen on first load
- Initialize audio engine on user click/tap

**Audio Priority:**
- **Primary:** Sound effects (combat, construction, turn advance, UI feedback)
- **Secondary:** Background music (ambient space themes, battle music)
- **Graceful Degradation:** Audio permission denied → Game fully playable without audio (no gameplay impact)

**Audio Architecture:**
- Phaser sound manager with HTML5 audio fallback
- Preload critical SFX (<5 MB): UI clicks, combat sounds, alerts
- Lazy-load music tracks (stream from CDN, don't block gameplay)
- Volume controls: Master, SFX, Music (independently adjustable, persist to profile)

**Implementation Notes:**
- Use Web Audio API for SFX (low latency, precise timing)
- Use HTML5 `<audio>` for music (streaming, lower memory)
- Mute button always visible (accessibility requirement)

---

### Asset Loading & Memory Management

**Memory Budget:**
- **Desktop:** <500 MB total assets (includes all textures, sprites, audio)
- **Mobile:** <200 MB total assets (reduced quality textures, compressed audio)
- **Initial Load:** <10 MB critical assets (splash, UI framework, galaxy map background)
- **Target Load Time:** <5 seconds to playable state

**Lazy Loading Strategy:**

**Priority 1 (Initial Load - <10 MB):**
- UI framework (buttons, panels, fonts, icons)
- Galaxy map background and grid
- 5 planet placeholder sprites (low-res)
- Core sound effects (click, confirm, error, notification)

**Priority 2 (On-Demand - Load as needed):**
- Planet detail textures (load when player selects planet for first time)
- Craft sprites (load when player builds first craft of each type)
- Combat animations (load when first battle starts)
- Platoon/building sprites (load on first use)
- Background music tracks (stream, don't preload)

**Priority 3 (Cache for reuse):**
- Asset pool for frequently used sprites (platoons, buildings, effects)
- Reuse base sprites with color tinting for faction differentiation (Player=blue, AI=red, Neutral=gray)
- Texture atlases for efficient GPU memory usage
- Audio sprite sheets for SFX collections

**Mobile Optimization:**
- Detect screen resolution and device memory (`navigator.deviceMemory`)
- Load 50% resolution textures on devices with <4 GB RAM
- Disable particle effects on low-end devices (FPS < 25 sustained)
- Progressive quality degradation based on real-time FPS telemetry
- Aggressive texture compression (WebP for Chrome/Firefox, PNG fallback for Safari)

**Asset Delivery:**
- CDN distribution (Vercel Edge Network)
- Brotli compression for text assets (JSON, HTML, CSS, JS)
- Gzip fallback for older browsers
- Cache-Control headers for long-term caching (immutable assets with content hashes)

---

### Responsive Design & Input

**Desktop (Mouse + Keyboard):**

**Primary Input:** Mouse for point-and-click interactions
- Click planet → Select planet
- Click craft/unit → Select entity
- Click button → Execute action
- Click-and-drag → Pan galaxy map
- Mouse wheel → Zoom in/out

**Keyboard Shortcuts:**
- `Tab` → Cycle through planets (forward)
- `Shift+Tab` → Cycle through planets (backward)
- `Enter` → Select highlighted planet / Confirm action
- `Arrow Keys` → Pan galaxy map (8-directional)
- `Space` → End turn
- `Esc` → Close panels / Back navigation / Deselect
- `1-4` → Quick actions (1=Build, 2=Invade, 3=Move, 4=More)
- `+/-` → Zoom in/out (alternative to mouse wheel)
- `H` → Toggle help overlay (keyboard shortcuts reference)

**Screen Size Optimization:**
- Primary: 1920×1080 (Full HD)
- Minimum: 1280×720 (HD)
- Maximum: 3840×2160 (4K - UI scales proportionally)

---

**Mobile (Touch):**

**Direct Touch Interactions:**
- **Tap planet** → Select planet (highlight, show detail panel)
- **Tap craft/unit** → Select entity (show actions)
- **Tap button** → Execute action (build, invade, move, end turn)
- **Drag (single finger)** → Pan galaxy map
- **Tap empty space** → Deselect current selection

**Gesture Controls:**
- **Pinch-to-Zoom** → Zoom in/out on galaxy map (natural mobile map interaction)
- **Long-Press (800ms)** → Context menu for planets/units (replaces right-click)
  - Example: Long-press enemy planet → [Invade] [Send Scout] [Cancel]
- **Two-Finger Pan** → Alternative scroll method (prevents accidental planet selection while scrolling)

**Orientation:**
- **Recommended:** Landscape (optimal for strategy game, galaxy map visibility)
- **Supported:** Portrait (UI adapts with stacked panels, vertical layout)
- **Auto-Rotate:** Dynamic orientation changes supported (UI re-layouts smoothly)

**Screen Sizes:**
- **Phone (portrait):** 375×667 to 428×926 (iPhone 8 to iPhone 14 Pro Max)
- **Phone (landscape):** 667×375 to 926×428
- **Tablet:** 768×1024 to 1024×1366 (iPad Mini to iPad Pro)

**Touch UI Adaptations:**
- **Tap Targets:** Minimum 44×44 pixels (Apple HIG, WCAG 2.5.5)
- **Button Placement:** Bottom-aligned action buttons (thumb-friendly zone)
- **Side Panels:** Swipeable planet details and build menus (slide in from right)
- **Floating Controls:** "End Turn" button persistent and always accessible (bottom-right corner)
- **Touch Feedback:** Visual ripple effect on tap, haptic feedback on key actions (if supported)

---

### Accessibility

**Keyboard Navigation (WCAG 2.1 Level A Compliance):**
- ✅ **Full keyboard navigation** (no mouse required for all interactions)
- ✅ **Visible focus indicators** on all interactive elements (3px blue outline, high contrast)
- ✅ **Logical tab order** (galaxy map → planets → action panels → buttons → footer)
- ✅ **Keyboard shortcuts** for common actions (documented in help overlay, accessible via `H` key)
- ✅ **Skip navigation links** ("Skip to main content", "Skip to galaxy map" for screen readers)
- ✅ **Escape key functionality** (closes modals, deselects entities, backs out of menus)

**Visual Accessibility:**

**UI Scale (Adjustable):**
- **100% (Default):** Standard UI size (16px base font)
- **125% (Large):** Increased UI size (20px base font)
- **150% (Extra Large):** Maximum UI size (24px base font)
- **Scope:** Affects text size, button sizes, panel spacing, icon sizes
- **Exclusions:** Galaxy map scale unchanged (use pinch-to-zoom or mouse wheel)
- **Persistence:** Scale preference saved to user profile (Supabase)

**High Contrast Mode (Toggle):**
- **Border Thickness:** Increased from 2px → 4px (improved visual separation)
- **Text:** White text on dark backgrounds (no gray text, #FFFFFF on #000000)
- **Highlights:** Yellow for selected elements (#FFD700, not blue)
- **Backgrounds:** Pure black (#000000) or pure white (#FFFFFF, user choice)
- **Shadows/Gradients:** Disabled (flat design, sharp edges)
- **Icons:** Outlined icons with high contrast fills

**Colorblind Modes (Post-MVP):**
- **Deuteranopia (Red-Green):** Blue vs Orange faction colors
- **Protanopia (Red-Green):** Blue vs Yellow faction colors
- **Tritanopia (Blue-Yellow):** Red vs Green faction colors
- **Pattern Support:** Faction colors use patterns + colors (not color alone)
  - Player: Solid fill
  - AI: Diagonal stripes
  - Neutral: Dotted pattern

**Screen Reader Support (Post-MVP):**
- **ARIA Labels:** Semantic labels for game state ("Starbase selected", "50 minerals available", "Turn 15")
- **Live Regions:** ARIA live announcements for turn events ("Enemy attacked Hitotsu!", "Construction complete: Mining Station")
- **Descriptive Alt Text:** Icons and images have meaningful alt attributes
- **Landmarks:** Semantic HTML5 landmarks (header, main, aside, footer)

---

### Progressive Web App (PWA) Considerations

**Status:** Post-MVP (deferred to v1.1.0+)

**Offline Play Capability:**
- **Service Worker:** Caches all assets after first load
- **Offline Campaigns:** Game fully playable offline (all 18 systems run client-side)
- **Supabase Sync:** Save upload and profile sync on reconnection
- **Conflict Resolution:** Last-write-wins for save conflicts (simple strategy)

**Install Experience:**
- **Manifest.json:** App metadata (name, icons, theme color, display mode)
- **"Add to Home Screen":** Prompt on mobile (iOS Safari, Chrome Android) after 2nd visit
- **Splash Screen:** Branded loading screen on launch (logo, tagline, progress bar)
- **Standalone Mode:** No browser chrome (full-screen app feel)

**Update Strategy:**
- **Service Worker Lifecycle:** Check for updates on load, prompt user to refresh
- **Cache Invalidation:** Content-hash based asset URLs (automatic cache busting)
- **Background Sync:** Queue save uploads while offline, sync when online

**Deferred Rationale:**
- MVP focuses on instant web play (no install friction, one-click access)
- Service worker adds complexity (cache invalidation, update strategy, debugging)
- PWA benefits increase with larger install base (v1.0.0+ when retention proven)

---

### SEO Strategy

**Scope:** Minimal (game content not crawlable, focus on landing page)

**Landing Page Optimization:**
- **Server-Rendered HTML:** Static landing page (not inside Phaser canvas)
- **Meta Tags:**
  ```html
  <title>Overlord - Classic 4X Strategy Reimagined | Web-Based Space Strategy Game</title>
  <meta name="description" content="Conquer the galaxy in this classic 4X strategy game. Turn-based space conquest with AI opponents, planetary invasions, and fleet battles. Play instantly in your browser.">
  ```
- **Open Graph Tags:** Social sharing previews (Twitter cards, Facebook, Discord)
  ```html
  <meta property="og:title" content="Overlord - Classic 4X Strategy Game">
  <meta property="og:description" content="Browser-based space strategy game inspired by the 1990 classic. Conquer planets, build fleets, defeat AI opponents.">
  <meta property="og:image" content="/assets/og-image-1200x630.png">
  <meta property="og:type" content="website">
  ```
- **Schema.org Markup:** VideoGame entity type
  ```json
  {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": "Overlord",
    "description": "Turn-based 4X strategy game",
    "genre": "Strategy",
    "playMode": "SinglePlayer",
    "applicationCategory": "Game"
  }
  ```

**Game Content (Not SEO Indexed):**
- Phaser game canvas is not crawlable by search engines (JavaScript-rendered)
- Single-page app (SPA) architecture (minimal page transitions)
- Focus on landing page discoverability + community sharing (Reddit r/4Xgaming, Twitter, Discord)

**Content Marketing (Post-MVP):**
- Development blog (technical posts about Phaser + Claude Code workflow)
- YouTube devlog series (gameplay videos, Flash Conflicts tutorials)
- Press kit (screenshots, fact sheet, contact info)

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP

**Rationale:**
Overlord's MVP focuses on delivering the **core 4X strategy experience** with the **Flash Conflicts innovation** that differentiates it from traditional strategy games. This approach:
- Validates that classic 4X gameplay translates effectively to browser-based play
- Proves Flash Conflicts solve the tutorial/quick-play problem
- Demonstrates Phaser + TypeScript + Claude Code development velocity
- Delivers immediate user value (playable campaigns + tactical challenges)

**Critical Success Factor:**
The 18 core game systems are already implemented and tested (304 tests, 93.78% coverage). The MVP risk is **integration and presentation**, not game logic. Focus on proving the Phaser rendering layer and Flash Conflicts concept work.

**Resource Requirements:**
- **Development:** 1 developer with Claude Code (AI-assisted development)
- **Timeline:** 7-8 weeks to playable prototype
- **Infrastructure:** Vercel (free tier), Supabase (free tier), GitHub (version control)
- **Art Assets (Prototype):** Placeholder sprites, minimal UI (polish in Alpha/Beta)

---

### MVP Feature Set (Phase 1: Prototype)

**Core User Journeys Supported:**

1. **Alex Chen (Strategy Veteran):**
   - ✅ Full campaign mode (Player vs AI, 4-6 planet galaxy)
   - ✅ 4 AI personalities × 3 difficulty levels
   - ✅ 45-60 minute complete campaign gameplay
   - ✅ Save/load with Supabase (cross-session continuity)
   - ✅ Desktop browser (mouse + keyboard)

2. **Jordan Rivera (Mobile Commuter) - Partial:**
   - ✅ 3 Flash Conflicts (2 tutorial + 1 tactical challenge)
   - ✅ 5-15 minute quick-play sessions
   - ⚠️ Mobile touch controls (basic, polish in Alpha)
   - ⚠️ Mobile web optimization (30 FPS target, refine in Beta)

3. **Sam Taylor (Tutorial Learner):**
   - ✅ Tutorial Flash Conflicts teach core mechanics
   - ✅ Low-stakes practice environment
   - ✅ Easy difficulty mode for first campaign
   - ✅ Progression from tutorials → full campaign

**Must-Have Capabilities (MVP):**

**1. Full Campaign Mode (18 Systems Functional):**
- ✅ **Already Ported:** All game logic implemented in TypeScript
- Galaxy generation (4-6 planets, seeded procedural)
- Turn system (Income → Action → Combat → End phases)
- Resource economy (Credits, Minerals, Fuel, Food, Energy)
- Combat system (ground, space, bombardment, invasion)
- AI decision system (4 personalities, 3 difficulties, priority-based)
- Victory/defeat conditions

**2. Flash Conflicts System (3 Scenarios - Lean Validation):**
- **Architecture:** JSON-based scenario definitions (library loaded, NOT hardcoded)
- **Scenario 1 (Tutorial):** "Genesis Device 101" - Learn planetary terraforming (5 min)
- **Scenario 2 (Tutorial):** "First Contact Combat" - Learn ground combat mechanics (8 min)
- **Scenario 3 (Tactical):** "Defend Starbase" - Quick tactical challenge (10-15 min)
- **Extensibility:** Additional scenarios loaded via JSON (no code changes required)

**JSON Scenario Schema Example:**
```json
{
  "scenario_id": "genesis_device_101",
  "name": "Genesis Device 101",
  "type": "tutorial",
  "duration_minutes": 5,
  "initial_state": {
    "planets": [...],
    "player_resources": {...},
    "ai_config": {...}
  },
  "victory_conditions": {...},
  "tutorial_steps": [...]
}
```

**3. Scenario Pack System (3 Packs - Hot-Swap Validation):**
- **Default Pack:** Balanced AI (General Nexus), 5 planets, standard resources
- **Aggressive Pack:** Warmonger AI (Commander Kratos), 4 planets, high minerals
- **Economic Pack:** Builder AI (Magistrate Midas), 6 planets, abundant resources
- **Loading:** Runtime JSON loading (switch packs from main menu)
- **Validation Goal:** Prove users try >2 different packs (variety demand)

**4. Persistence (Supabase):**
- User authentication (email/password, OAuth deferred to Alpha)
- Save game storage (compressed JSON, checksummed)
- Cross-device save sync (desktop → mobile → desktop)
- User profile (settings, Flash Conflict completion tracking)

**5. Rendering (Phaser 3.85.2):**
- Galaxy map view (2D/isometric, planets clickable)
- Planet detail panel (resources, buildings, platoons)
- Combat resolution UI (battle results, casualties)
- Flash Conflict UI (tutorial instructions, completion screen)
- Desktop optimized (1920×1080 primary, 1280×720 minimum)

**6. Input (Desktop + Basic Mobile):**
- Desktop: Mouse + keyboard (full keyboard shortcuts)
- Mobile: Touch (tap, drag, pinch-to-zoom, long-press)
- Basic responsive UI (polish in Alpha/Beta)

---

### Prototype Development Timeline (7-8 Weeks)

**Week 1-2: Foundation**
- Phaser project scaffolding + TypeScript config
- Galaxy map renders (WebGL 2.0, Canvas fallback)
- Planets clickable, basic selection UI
- Core game loop integration (GameState → Phaser)

**Week 3-4: Core Gameplay**
- Combat/invasion flows work end-to-end
- Planet management UI (build, recruit, move craft)
- First Flash Conflict playable ("Genesis Device 101")
- Turn system integrated with rendering

**Week 5-6: Flash Conflicts + Persistence**
- 3 Flash Conflicts complete and tested
- Save/load with Supabase working
- Scenario pack switching functional (3 packs)
- Full campaign completable start-to-finish

**Week 7-8: Polish + Mobile**
- Performance optimization (60 FPS desktop, 30 FPS mobile)
- Mobile touch controls functional (pinch-to-zoom, long-press)
- Audio system (SFX + music, "Click to Start" gate)
- Bug fixes, edge case handling

**Prototype Success Criteria:**
- Can complete full campaign (Player vs AI, victory/defeat)
- 3 Flash Conflicts playable and completable
- Save/load works reliably (>99% success rate)
- 60 FPS on desktop (Chrome 90+, Firefox 88+)
- Zero critical bugs (game-breaking issues)

---

### Post-MVP Features

**Phase 2: Alpha (Post-Prototype)**

**Goals:** Expand Flash Conflicts, polish mobile, add community foundation

**Expanded Flash Conflicts (5 additional scenarios):**
- 1 additional tutorial: "Building Your Empire" (resource management)
- 4 tactical challenges: "Terraform Rush", "Invasion Landing", "Fleet Defense", "Economic Warfare"
- Total: 8 Flash Conflicts (3 tutorial + 5 tactical)

**Mobile Web Optimization:**
- Refined touch controls (gesture tuning, tap target sizing)
- Portrait orientation support (adapted UI layout)
- Asset streaming for mobile (reduced texture quality, lazy loading)
- 30 FPS sustained on mobile (iPhone 12+, Galaxy S10+)

**Community Foundation:**
- Scenario pack JSON schema finalized and documented
- Example scenario pack template for community creators
- GitHub repo for scenario pack contributions (curated by maintainers)

**Accessibility:**
- UI scale adjustments (100%, 125%, 150%)
- High contrast mode
- Full keyboard navigation polished

**Alpha Success Criteria:**
- 8 Flash Conflicts with >60% completion rate
- Mobile web playable (30 FPS sustained)
- Community scenario pack template published
- Accessibility features functional

---

**Phase 3: Beta (Pre-Launch)**

**Goals:** Community features, performance optimization, content expansion

**Community Features:**
- User-created scenario pack upload (Supabase storage)
- Scenario pack marketplace (browse, download, rate)
- Leaderboards (campaign victories, Flash Conflict completion times)
- User profiles (stats, achievements, favorite scenarios)

**Content Expansion:**
- 10-15 total Flash Conflicts (community + official)
- 5-8 scenario packs (varied AI personalities, galaxy configs)
- Background music tracks (ambient space, battle themes)
- Polished sprite art (replace placeholder assets)

**Performance & Quality:**
- Load time <5 seconds to playable
- Crash rate <0.1% of sessions
- Cross-browser compatibility verified (Chrome, Firefox, Safari, Edge)
- Comprehensive analytics (user behavior, session length, drop-off points)

**Beta Success Criteria:**
- Day 7 retention >40%
- Average >3 Flash Conflict replays per user
- Community-created packs account for >30% of plays
- No critical bugs (P0 issues)

---

**Phase 4: v1.0.0 Launch**

**Goals:** Stable, polished, production-ready

**Launch Readiness:**
- All Beta bugs triaged and resolved (P0/P1 fixed, P2+ documented)
- SEO-optimized landing page (meta tags, Open Graph, Schema.org)
- Press kit (screenshots, fact sheet, trailer video)
- Community documentation (scenario pack creation guide, API reference)

**Launch Metrics:**
- Tutorial completion rate >60%
- Campaign completion rate >30%
- Flash Conflict completion rate >60%
- Average session length: 45+ min (campaigns), 10-15 min (Flash Conflicts)

---

**Phase 5: Growth Features (Post-v1.0.0)**

**Deferred to User Demand:**

1. **Native Platforms:**
   - Electron wrapper for Steam/desktop distribution
   - React Native mobile apps (iOS/Android)
   - Shared engine/assets/saves across all platforms

2. **Advanced Community Features:**
   - Scenario editor UI (visual builder, no JSON required)
   - Community moderation tools (flagged content review)
   - Creator profiles and following system
   - Featured scenario packs (curated by maintainers)

3. **Extended Content:**
   - 20+ Flash Conflicts (official + community)
   - 15+ scenario packs (diverse AI personalities, galaxy types)
   - Campaign difficulty modes (Ironman, Speedrun, Custom rules)

4. **Progressive Web App (PWA):**
   - Offline play (service worker caching)
   - "Add to Home Screen" prompt
   - Background save sync

---

**Phase 6: Vision (Long-Term, 6+ Months)**

**Exploratory Features:**

1. **Multiplayer Expansion:**
   - Hot-seat local multiplayer (2-4 players)
   - Asynchronous online multiplayer (turn-based, play-by-email style)
   - Real-time competitive modes (1v1, tournament brackets)

2. **Procedural Content:**
   - AI-generated scenario packs (procedural enemies, galaxy layouts)
   - Endless campaign mode with procedural events
   - Dynamic narrative branching (procedural storytelling)

3. **Modding Platform:**
   - Full scenario creation toolkit (mod SDK)
   - Custom AI personality scripting (decision tree editor)
   - Asset import pipeline (community-created alien races, ships, planets)

4. **Commercial Pathways:**
   - Premium scenario pack marketplace (paid content)
   - Sponsored scenarios (brand integration, educational licensing)
   - Subscription tier (ad-free, exclusive scenarios, early access)

---

### Risk Mitigation Strategy

**Technical Risks:**

**Risk 1: Phaser + Supabase integration complexity**
- **Mitigation:** Prototype Week 5-6 validates save/load early
- **Contingency:** Use LocalStorage as fallback (no cross-device sync)
- **Status:** Low risk (Supabase has mature TypeScript SDK)

**Risk 2: Mobile web performance (30 FPS target)**
- **Mitigation:** Asset streaming, texture compression, progressive quality degradation
- **Contingency:** Desktop-only MVP, mobile in Alpha (reduces scope)
- **Status:** Medium risk (turn-based gameplay forgiving, but FPS metrics critical)

**Risk 3: Flash Conflicts not engaging (completion rate <40%)**
- **Mitigation:** User testing in Prototype/Alpha, iterate on difficulty/length
- **Contingency:** Treat Flash Conflicts as optional tutorials, not standalone feature
- **Fallback:** Focus on full campaigns, defer Flash Conflicts to post-MVP

**Market Risks:**

**Risk 1: Users prefer full campaigns over Flash Conflicts (cannibalization)**
- **Validation:** Track Flash → Campaign conversion rate (target: >30%)
- **Mitigation:** Add progression hooks ("You mastered this scenario! Try a full campaign")
- **Fallback:** Flash Conflicts become niche feature, campaigns remain core

**Risk 2: Scenario pack system unused (users stick with default)**
- **Validation:** Measure users trying >2 packs (target: >50% of players)
- **Mitigation:** Prompt to try new pack after victory ("Try a harder challenge!")
- **Fallback:** Scenario packs remain power-user feature, don't block v1.0.0

**Risk 3: Web-based strategy game market too niche**
- **Validation:** Alpha/Beta user feedback, retention metrics (Day 7 >40%)
- **Mitigation:** Community marketing (Reddit r/4Xgaming, Twitter, Discord)
- **Fallback:** Pivot to desktop/mobile native (engine already platform-agnostic)

**Resource Risks:**

**Risk 1: 7-8 week timeline too aggressive**
- **Mitigation:** 18 systems already implemented (reduces unknowns)
- **Contingency:** Extend to 10-12 weeks, cut mobile from Prototype
- **Status:** Low risk (AI-assisted development accelerates velocity)

**Risk 2: Art assets delay (placeholder art insufficient)**
- **Mitigation:** Functional gameplay > visual polish (Alex/Jordan journeys work with placeholders)
- **Contingency:** Use royalty-free asset packs (Kenney.nl, OpenGameArt.org)
- **Status:** Low risk (turn-based strategy forgiving on art quality)

**Risk 3: Solo developer bandwidth (no team support)**
- **Mitigation:** Claude Code AI assistance (3-5× velocity multiplier)
- **Contingency:** Reduce Flash Conflicts to 2 (1 tutorial + 1 tactical)
- **Status:** Medium risk (single point of failure, but AI-assisted workflow proven)

---

## Functional Requirements

### Campaign Gameplay

- **FR1:** Players can start a new campaign game with configurable difficulty (Easy/Normal/Hard)
- **FR2:** Players can select AI personality type for their opponent (Aggressive, Defensive, Economic, Balanced)
- **FR3:** Players can play turn-based campaigns against AI opponents
- **FR4:** Players can end their turn when ready to proceed
- **FR5:** Players can view current turn number and game phase (Income/Action/Combat/End)
- **FR6:** Players can achieve victory by conquering all AI-owned planets
- **FR7:** Players can experience defeat if all player-owned planets are lost

### Galaxy & Planet Management

- **FR8:** Players can view a generated galaxy with 4-6 planets
- **FR9:** Players can select planets to view detailed information
- **FR10:** Players can view planet attributes (type, owner, population, morale, resources)
- **FR11:** Players can manage planet resources (Credits, Minerals, Fuel, Food, Energy)
- **FR12:** Players can construct buildings on owned planets
- **FR13:** Players can view building construction progress and completion status
- **FR14:** Players can receive automated resource income per turn from owned planets

### Military & Combat

- **FR15:** Players can commission platoons with configurable equipment and weapons
- **FR16:** Players can view platoon details (troop count, equipment level, weapon level)
- **FR17:** Players can purchase spacecraft (Scouts, Battle Cruisers, Bombers, Atmosphere Processors)
- **FR18:** Players can load platoons onto Battle Cruisers for transport
- **FR19:** Players can navigate craft between planets
- **FR20:** Players can initiate planetary invasions when controlling orbit
- **FR21:** Players can configure combat aggression levels (0-100%) before battles
- **FR22:** Players can view combat results (casualties, victory/defeat, captured resources)
- **FR23:** AI opponents can make strategic decisions (build economy, train military, launch attacks)
- **FR24:** AI opponents can adapt behavior based on personality type and difficulty level

### Flash Conflicts

- **FR25:** Players can access a Flash Conflicts menu separate from campaign mode
- **FR26:** Players can select and start individual Flash Conflicts
- **FR27:** Players can complete tutorial Flash Conflicts that teach specific game mechanics
- **FR28:** Players can complete tactical Flash Conflicts as quick-play challenges
- **FR29:** Players can view Flash Conflict victory conditions before starting
- **FR30:** Players can view Flash Conflict completion results (success/failure, completion time)
- **FR31:** System can track Flash Conflict completion history per user

### Scenario Pack System

- **FR32:** Players can browse available scenario packs from the main menu
- **FR33:** Players can switch between scenario packs (changes AI config, galaxy layout, resources)
- **FR34:** System can load scenario pack configurations from JSON data files
- **FR35:** Players can view scenario pack metadata (name, difficulty, AI personality, planet count)

### Persistence & User Management

- **FR36:** Players can create user accounts with email/password authentication
- **FR37:** Players can log in to access their saved games and profile
- **FR38:** Players can save campaign progress at any time
- **FR39:** Players can load previously saved campaigns
- **FR40:** Players can access saved games from different devices (cross-device sync)
- **FR41:** System can persist user settings and preferences across sessions
- **FR42:** System can track user statistics (campaigns completed, Flash Conflicts completed, playtime)

### User Interface & Controls

- **FR43:** Players can interact with the game using mouse and keyboard (desktop)
- **FR44:** Players can interact with the game using touch gestures (mobile)
- **FR45:** Players can navigate the galaxy map by panning and zooming
- **FR46:** Players can use keyboard shortcuts for common actions
- **FR47:** Players can customize UI scale (100%, 125%, 150%)
- **FR48:** Players can enable high contrast mode for visual accessibility
- **FR49:** Players can navigate all game functions using only the keyboard
- **FR50:** Players can view help overlays for keyboard shortcuts and game mechanics

### Audio & Media

- **FR51:** Players can hear sound effects for game actions (combat, construction, UI interactions)
- **FR52:** Players can hear background music during gameplay
- **FR53:** Players can adjust audio volume levels independently (Master, SFX, Music)
- **FR54:** Players can mute audio entirely
- **FR55:** System can request user activation before enabling audio (browser security requirement)

---

## Non-Functional Requirements

### Performance

**NFR-P1: Frame Rate**
- Desktop browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) must sustain 60 FPS during gameplay
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+) must sustain 30 FPS during gameplay
- Turn-based gameplay must remain playable at 30 FPS minimum (Canvas fallback acceptable)

**NFR-P2: Load Time**
- Initial page load to playable state must complete within 5 seconds on desktop (3G connection)
- Flash Conflict start must complete within 2 seconds after selection
- Campaign load from save must complete within 3 seconds

**NFR-P3: Response Time**
- User interactions (button clicks, planet selection) must provide visual feedback within 100ms
- Turn processing (income calculation, AI turn) must complete within 2 seconds
- Combat resolution must complete within 5 seconds (excluding animations)

**NFR-P4: Asset Loading**
- Critical assets (UI framework, galaxy map) must load in first 10 MB
- On-demand assets (planet textures, craft sprites) must load within 500ms when needed
- Mobile devices must use reduced-quality assets (50% resolution) on <4 GB RAM devices

### Reliability

**NFR-R1: Save/Load Success Rate**
- Save operations must succeed >99.9% of the time
- Load operations must succeed >99.9% of the time
- Data corruption rate must be <0.01% (SHA256 checksum validation)

**NFR-R2: Crash Rate**
- Application crashes must occur in <0.1% of sessions
- Critical bugs (game-breaking, data loss) must be zero at launch
- Graceful error handling for network failures (Supabase disconnection)

**NFR-R3: Cross-Device Sync**
- Save data must sync across devices within 5 seconds of save operation
- Conflict resolution must use last-write-wins strategy (no data loss)
- Offline saves must queue and sync on reconnection

**NFR-R4: Uptime & Availability**
- Vercel deployment uptime: >99.9% (SLA guarantee)
- Supabase API uptime: >99.5% (external dependency)
- Graceful degradation if Supabase unavailable (LocalStorage fallback for saves)

### Accessibility

**NFR-A1: Keyboard Navigation (WCAG 2.1 Level A)**
- All game functions must be accessible via keyboard alone (no mouse required)
- Tab order must be logical (galaxy map → planets → actions → buttons)
- Visible focus indicators must be present on all interactive elements (3px outline)
- Keyboard shortcuts must be documented and accessible via help overlay (H key)

**NFR-A2: Visual Accessibility**
- UI scale must be adjustable (100%, 125%, 150%) and persist to user profile
- High contrast mode must be available (4px borders, white-on-black text, yellow highlights)
- Tap targets must be minimum 44×44 pixels (WCAG 2.5.5, Apple HIG)
- Color must not be the sole means of conveying information (use patterns + colors)

**NFR-A3: Screen Reader Support (Post-MVP)**
- ARIA labels must describe game state for screen readers
- Live regions must announce turn events (attacks, construction completion)
- Semantic HTML5 landmarks must structure page layout

### Security

**NFR-S1: Authentication**
- User passwords must be hashed using bcrypt (cost factor 12+) via Supabase Auth
- Sessions must use secure HTTP-only cookies (Supabase handles)
- Password reset must use time-limited tokens (15-minute expiration)

**NFR-S2: Data Protection**
- Save game data must be stored encrypted at rest (Supabase PostgreSQL)
- All API communication must use HTTPS/TLS 1.2+ (Vercel + Supabase enforce)
- User profile data must not be accessible to other users (Supabase RLS policies)

**NFR-S3: Input Validation**
- All user inputs must be validated client-side (type checking, range validation)
- All API requests must be validated server-side (Supabase Edge Functions)
- Scenario pack JSON must be validated against schema before loading

**NFR-S4: Privacy**
- No personally identifiable information (PII) collected beyond email/username
- User analytics must be anonymized (no IP addresses, aggregated only)
- Save game data must not contain PII (only game state)

### Usability

**NFR-U1: Learnability**
- Tutorial Flash Conflicts must teach core mechanics within 5-10 minutes
- First-time users must complete "Genesis Device 101" tutorial with >60% success rate
- Keyboard shortcuts must be discoverable via help overlay (H key)

**NFR-U2: Efficiency**
- Experienced users must complete Flash Conflicts 20-30% faster than first-time users
- Keyboard shortcuts must reduce common action time by 50% vs mouse-only
- Turn advancement must require single action (Space key or "End Turn" button)

**NFR-U3: Error Prevention**
- Destructive actions (delete save) must require confirmation dialog
- Invalid actions must provide clear error messages (not "Error 500")
- Undo functionality must be available for reversible actions (deferred to post-MVP)

**NFR-U4: Consistency**
- UI patterns must be consistent across all screens (button placement, color scheme)
- Keyboard shortcuts must not conflict with browser defaults
- Touch gestures must match platform conventions (pinch-to-zoom, long-press context menu)

### Compatibility

**NFR-C1: Browser Support**
- Desktop browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (95%+ of desktop users)
- Mobile browsers: iOS Safari 14+, Chrome Mobile 90+ (90%+ of mobile users)
- Canvas 2D fallback must support older browsers (30 FPS acceptable)

**NFR-C2: Device Support**
- Desktop: 1280×720 minimum resolution, 1920×1080 optimized
- Mobile phones: 375×667 minimum (iPhone 8), landscape recommended
- Tablets: 768×1024 minimum (iPad Mini), portrait and landscape supported

**NFR-C3: Input Methods**
- Mouse + keyboard must be fully supported (desktop primary)
- Touch gestures must be fully supported (mobile primary)
- Gamepad support deferred to post-MVP

**NFR-C4: Network Conditions**
- Game must load on 3G connections (3 Mbps minimum)
- Gameplay must function offline after initial load (Supabase sync on reconnection)
- Asset streaming must adapt to connection speed (reduce quality on slow connections)

### Scalability

**NFR-SC1: Concurrent Users**
- Supabase free tier supports 500 concurrent connections (sufficient for MVP)
- Save/load operations must handle 100 concurrent requests without degradation
- Vercel Edge Network must handle 1,000 simultaneous page loads (guaranteed by Vercel)

**NFR-SC2: Data Growth**
- Supabase free tier supports 500 MB database storage (estimated 10,000+ save games)
- Save game size must be <50 KB compressed (achievable with GZip)
- User profile size must be <5 KB (settings, stats, scenario completion tracking)

**NFR-SC3: Future Growth (Post-MVP)**
- Architecture must support upgrade to Supabase Pro tier (50,000 concurrent users)
- Platform-agnostic core must support multiple rendering engines (Phaser → Unity/Godot/Native)
- Scenario pack system must scale to 100+ packs without performance degradation

---

