# OpenSupremacy – Starter Design Pack

Version: 0.1 (Draft)
Author: Thursian Lab (Personal Project)

---

## 1. Roadmap – OpenSupremacy Modern Engine

**Goal:** Create a legally clean, modern, open-source engine that faithfully reproduces the gameplay of *Supremacy / Overlord*, while remaining portable across desktop and web.

### Phase 0 – Framing & Scope

* Define project goals:

  * “Playable clone that feels like the original” vs “Reimagined edition”.
  * Web-playable demo vs desktop-first.

* Legal stance:

  * Engine is 100% new code.
  * No redistribution of original commercial assets.
  * Provide new community-made assets that merely evoke the original.

* Deliverables:

  * README with clear legal statement and scope.
  * Initial repo + license (MIT or GPL, your choice).

### Phase 1 – Gameplay & System Decomposition

* Play the original (DOS and/or C64 30th Anniversary Edition) and document:

  * Core loop: colonize → develop → build fleets → attack → advance to next system.
  * Economic model: resource types, production rates, upkeep, morale, food, etc.
  * Tech / upgrades: weapons, defenses, special items.
  * AI behaviour: aggression levels, expansion patterns, difficulty scaling.

* Produce a **Game Design Spec (GDS)** for OpenSupremacy:

  * Entities: system, planet, colony, fleet, battle, faction.
  * Turn/step model and timing.
  * Win/loss conditions.
  * Difficulty tiers.
* Deliverables:

  * `/docs/open_supremacy_gds.md`
  * Flowcharts for: strategic turn, colony update, battle resolution.

### Phase 2 – Data & Asset Model

* Define **data formats** (TOML/JSON/YAML) for:

  * Planet definitions (size, atmosphere, habitability, base resources).
  * Factions and AI configs.
  * Weapons, units, buildings.
  * System layouts (8/16/32 planets, etc.).
* Define **asset pipeline**:

  * Where sprites / tiles / UI art live.
  * Audio format (OGG/MP3 for desktop, possibly WAV/OGG for web).
* Deliverables:

  * `/data/` folder with example configs.
  * Schema docs (even if informal) describing each config field.

### Phase 3 – Engine Core MVP

Focus: reproduce the **solar-system campaign layer** first, with minimal graphics.

* Implement core engine as a headless simulation module:

  * Types for: `Planet`, `System`, `Colony`, `Fleet`, `Faction`, `GameState`.
  * Deterministic update loop (pure functions where possible).
  * Save/load state (serialize to JSON or binary format).
* Implement a **debug UI**:

  * Could be a simple CLI or bare-bones web UI.
  * Buttons / commands for: colonize planet, pass time, adjust tax, build unit.
* Deliverables:

  * Engine library crate/module (e.g. `engine/` folder or `lib/` package).
  * First automated tests: colony growth, resource caps, simple AI expansion.

### Phase 4 – Tactical / Battle Layer

* Implement battle resolution logic:

  * Fleet composition, weapon stats, defense values.
  * Combat rounds and RNG.
  * Retreat, destruction, or capture.
* Decide **visual level** for battles:

  * Minimalist: abstract icons and health bars.
  * Fancy: side-view or top-down small battlefield.
* Deliverables:

  * Battle simulation module with deterministic tests.
  * Basic visual representation of battles.

### Phase 5 – Full UX & Presentation

* Design UI with the original layout as inspiration:

  * System view: line of planets from home to enemy.
  * Planet view: colony stats, construction, morale, etc.
  * Strategic overlays: resource summary, fleet positions.
* Add QoL improvements:

  * Tooltips, keyboard shortcuts, configurable speed.
  * In-game help/tutorial overlay.
* Deliverables:

  * “Playable alpha” that covers one system (8-planet scenario).
  * UX polish list for beta.

### Phase 6 – Testing, Balancing, and Compatibility

* Create a **regression test suite** for core rules.
* Implement difficulty presets matching the original feel.
* Verify consistent behavior across:

  * Desktop builds (Windows / macOS / Linux).
  * Web build (if targeting browser via WebAssembly).
* Deliverables:

  * v0.9 “feature complete” release.
  * Changelog and balancing notes.

### Phase 7 – Release & Future Enhancements

* Public releases:

  * Tag v1.0.
  * Provide prebuilt binaries (desktop) and a hosted web demo.
* Optional extensions:

  * New factions, random map generation.
  * Modding support via data files.
  * Achievements, ironman mode, accessibility options.

---

## 2. Reference – C64 30th Anniversary Edition

**Purpose:** Use the C64 30th Anniversary Edition as a reference for mechanics, pacing, and UI, without bundling it directly in the project.

### What It Is

* A 2021 enhanced release of the C64 version by the group **Excess**, celebrating 30 years of both the game and the group.
* Key enhancements (high level):

  * Mouse support.
  * Animated intro inspired by the Amiga version.
  * Extra animations and visual polish in starbase / training screens.
  * Quality-of-life tweaks and trainers.

### Where to Get It

* **Lemon64 entry**: "Supremacy: 30th Anniversary Edition" (points to the revised game and notes that it is downloadable from CSDb).
* **CSDb (Commodore Scene Database)**:

  * Look up: "Supremacy aka Overlord +8DF" by Excess (EasyFlash release, 6 Nov 2021).
  * Download the EasyFlash CRT or related image from that release.
* Indie Retro News has feature articles titled along the lines of:

  * "Supremacy 30th Anniversary Edition – A 30 year anniversary special…"
  * These give additional context and screenshots.

> Note: For legal and ethical reasons, OpenSupremacy should **not** redistribute this image. Instead, document how a user can legally download it themselves from the above fan/scene sites.

### How to Use It as a Reference

* Run it via a C64 emulator (e.g., VICE):

  * Configure joystick/mouse as needed.
  * Capture screenshots of key screens (for personal design reference, not redistribution).
* While playing, record:

  * Planet and system parameters.
  * AI behavior at each difficulty.
  * Timing and pacing: how fast resources accumulate, how long sieges last.
* Store your notes in the OpenSupremacy repo:

  * `/research/c64_30th_play_notes.md`
  * `/research/c64_ui_reference/` (local images only for you; do not commit copyrighted art).

### Practical Reference Checklist

* [ ] Document the exact start state for each system size (8/16/32 planets).
* [ ] Note how morale, population, and resources interact.
* [ ] Record fleet compositions used by AI at each aggression level.
* [ ] Compare C64 30th vs original DOS/Amiga pacing to decide which feel you want to emulate.

---

## 3. Architecture & Deployment Proposal

### 3.1 High-Level Architecture

**Core principle:** Separate the **game simulation engine** from the **presentation layer**, so you can target both desktop and web with the same rules.

Recommended layers:

1. **Engine Core (Logic)**

   * Language: Rust or modern C++.
   * Responsibilities:

     * Game state types and rule systems.
     * Deterministic update loop.
     * Save/load.
     * AI routines.
   * Expose a clean API to front-ends (e.g. a C FFI, Rust `wasm-bindgen`, or a shared library).

2. **Rendering & UI Layer**

   * Option A (Desktop-first):

     * Use **SDL2** or **Raylib** with C++/Rust.
     * Pros: Low overhead, fine-grained control, easy packaging for Windows/macOS/Linux.
   * Option B (Engine + Game Framework):

     * Use **Godot 4** as the front-end, and either:

       * Reimplement logic in Godot scripts, or
       * Call into a native module (GDExtension) that wraps your engine.
     * Pros: Very fast iteration on UI and UX, built-in web export.

3. **Data Layer**

   * Human-editable config files (e.g. TOML or YAML) for:

     * Units, weapons, buildings, planets, AI personalities.
   * Serialization library:

     * Rust: `serde`.
     * C++: `nlohmann/json` or similar.

4. **Tooling / Dev Experience**

   * Unit tests for core rules.
   * Replay/debugging tools:

     * Log game states per turn.
     * Optional “seed + script” system to replay AI matches.

### 3.2 Vercel & Deployment Strategy

You mentioned using Vercel. That can absolutely fit into this plan.

**Recommended deployment model:**

* Treat OpenSupremacy’s web build as a **static WebAssembly app**:

  * Build the game (engine + UI) as a WASM + HTML/JS bundle.
  * Deploy that bundle as a static site on Vercel.
  * No heavy server-side logic required.

* Vercel use cases here:

  * Host the static web build and assets.
  * Optionally add small serverless functions for:

    * Online leaderboards.
    * Cloud save sync (if you want accounts).
    * Telemetry/analytics (opt-in).

**Concrete options:**

1. **Godot 4 Web Export + Vercel**

   * Develop game in Godot (C#/GDScript).
   * Export to HTML5/WebAssembly.
   * Push build artifacts to a `web-build/` folder.
   * Deploy via Vercel as a static site.
   * Also export native desktop builds for itch.io or direct download.

2. **Rust + Bevy → WASM + Vercel**

   * Engine & rendering written in Rust with Bevy.
   * Use `wasm-bindgen` or Bevy’s web support for browser build.
   * Build outputs: `index.html + wasm + JS glue`.
   * Host those on Vercel.

3. **C++/SDL2 Desktop-first, Web Later**

   * Start with a C++/SDL2 desktop build to move quickly on logic.
   * Later, if desired, port to Emscripten/WebAssembly for a Vercel-hosted demo.

### 3.3 Suggested “Goldilocks” Stack

For your background and goals, a good balance might be:

* **Engine Core:** Rust

  * Pros: Safety, great tooling, good WASM story.
* **Framework:** Bevy or macroquad (if you want something lighter).
* **Data:** TOML or YAML with `serde`.
* **Deployment:**

  * Desktop: Cargo builds (Windows/macOS/Linux), optionally distributed via itch.io.
  * Web: WASM build hosted on Vercel as a static app.

This gives you:

* A **single codebase** for both desktop and browser.
* Strong separation of concerns (engine vs. rendering vs. data).
* Fast iteration and modern tooling.

---

### 4. Next Steps Checklist

1. Create the Git repo and add this design pack to `/docs/`.
2. Decide on engine language (Rust vs C++ vs Godot-only).
3. Write the initial data schemas for planets, factions, and units.
4. Implement a minimal headless engine that can simulate one turn.
5. Spin up a tiny web prototype (even just text-based) and deploy to Vercel to prove the build pipeline.
