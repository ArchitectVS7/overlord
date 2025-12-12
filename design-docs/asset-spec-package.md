# Overlord Visual & Audio Asset Package

This document consolidates all art, UI, and sound requirements in one place and adds generation-ready prompts for three image platforms.

## Upstream design docs (for reference)
- [Product Requirements Document](./artifacts/prd.md)
- [Prototype wireframes (Excalidraw)](./artifacts/diagrams/wireframe-overlord-prototype-20251209.excalidraw)

## Canonical Requirements from Existing Specs
- Rendering approach: 2D/isometric presentation (sprites over 3D).【F:design-docs/artifacts/prd.md†L153-L164】
- Asset budgets and load strategy: <10 MB critical load (UI, galaxy background, 5 planet placeholders); on-demand craft/planet detail/combat assets; reuse base sprites with faction tinting (Player=blue, AI=red, Neutral=gray).【F:design-docs/artifacts/prd.md†L840-L864】
- Prototype → Beta asset quality path: placeholder sprites acceptable early, replaced with polished sprite art by Beta.【F:design-docs/artifacts/prd.md†L1080-L1080】【F:design-docs/artifacts/prd.md†L1249-L1254】
- Audio system: preload UI/core SFX (<5 MB), lazy-load music, master/SFX/music volume controls, WebAudio for SFX, HTML5 audio for music.【F:design-docs/artifacts/prd.md†L820-L833】
- UI wireframes: desktop 1920×1080 galaxy map canvas with header/resources panel; planet detail panel (800×540) with building/garrison lists; Flash Conflict selection cards with scenario metadata and start buttons.【F:design-docs/artifacts/diagrams/wireframe-overlord-prototype-20251209.excalidraw†L36-L119】【F:design-docs/artifacts/diagrams/wireframe-overlord-prototype-20251209.excalidraw†L603-L739】【F:design-docs/artifacts/diagrams/wireframe-overlord-prototype-20251209.excalidraw†L1141-L1307】【F:design-docs/artifacts/diagrams/wireframe-overlord-prototype-20251209.excalidraw†L1334-L1476】

## Visual Style Guide (unified universe)
- **Perspective & medium:** 2D isometric sprites and illustrated backgrounds; painterly-but-crisp edges for clarity at 4K downscale to 1080p.
- **Palette anchors:** Player blue, AI red, Neutral gray tints for ships/flags/outline glows; secondary accents teal (tech), amber (alerts), violet (exotic tech).【F:design-docs/artifacts/prd.md†L861-L862】
- **Lighting:** Cool rim lights plus warm bounce to keep metal readable on dark space backgrounds.
- **Surface language:** Mix of retro-industrial plating (bolts, vents) and sleek aerospace curves; avoid chrome (keep matte/satin).
- **Environment tone:** Lived-in frontier ports, sparsely populated orbits, nebula backdrops with subtle parallax.
- **UI framing:** Panels with soft gray fills (#f5f5f5) and subtle stroke; legible at 1080p per wireframe sizing.【F:design-docs/artifacts/diagrams/wireframe-overlord-prototype-20251209.excalidraw†L603-L739】

## Asset Catalog & Specs
| Category | Purpose | Base Resolution/Ratio | Notes |
|---|---|---|---|
| Galaxy map background | Full-screen starfield + grid | 3840×2160 (scales to 1920×1080) | Keep low-contrast grid; reserve corners for HUD. |
| Planets (terran, volcanic, gas, ice, ocean) | Map markers & planet detail | 512×512 for map; 1024×1024 detail | Provide day/night terminator; neutral, player, AI tint overlays. |
| Spaceports/starbases | Orbital & surface ports | 1600×900 key art; 512×512 sprite cutouts | Variants: civilian, military, damaged, upgraded. |
| Ships (scout, frigate, cruiser, carrier, transport) | Unit cards & combat | 1600×900 orthographic renders; 512×256 sprites | Provide clean, damaged, upgraded pass. |
| Alien species portraits | Diplomacy/flavor cards | 1024×1536 vertical | Distinct silhouettes; 4 archetypes (warlike, technocrat, merchant, zealot). |
| Battle scenes (space & ground) | Combat resolution backdrop | 1920×1080 | Clear foreground vs background layers for compositing. |
| UI icons (resources, morale, buttons) | HUD per wireframe | 128×128, monochrome SVG-friendly | Icons for Credits, Minerals, Fuel, Food, Energy; start/end turn; back buttons. |
| Scenario cards | Flash Conflict list | 900×500 cards | Two colorways (tutorial gold, tactical blue) matching wireframe cards.【F:design-docs/artifacts/diagrams/wireframe-overlord-prototype-20251209.excalidraw†L1170-L1476】 |
| Audio SFX | UI & gameplay | ≤5 MB preload pack; 44.1 kHz | UI click/confirm/error, construction, battle volley, explosion, alert. |
| Music loops | Ambient & battle | 2–3 min seamless loops | Streamed; space ambient, battle tense, victory/defeat stingers. |

## Master Prompt Framework
Use this shared structure, then platform-specific optimizations below:
1. Subject & role (e.g., “Battle cruiser in orbit over volcanic colony”).
2. Perspective/style (2D isometric, painterly crisp edges, matte metals).
3. Palette cues (player blue vs AI red accents; neutral gray base).
4. Lighting & mood (cool rim, warm bounce, distant nebula backdrop).
5. Detail level (medium-high detail readable at 1080p; minimal noise).
6. Variants (clean, upgraded, battle-damaged, docking, combat firing).
7. Negative cues (no photoreal lens blur, no text, no watermark).

## Platform-Optimized Prompts
Each platform gets a tuned template plus concrete category prompts.

### Google Nano Banana (text-to-image tuned for concise control)
- Style tags first, short clauses, avoid long run-ons.
- Use "flat isometric 2D" + "clean edges" to prevent 3D renders.

**Master template:**
`flat isometric 2D, painterly crisp edges, matte metals, cool rim light, warm bounce, {subject}, player-blue vs AI-red accents, distant nebula backdrop, medium detail for 1080p, no text, no watermark`

**Category prompts**
- Spaceport (clean): `flat isometric 2D spaceport hub, civilian docks, matte plating, player-blue beacons, soft gray decks, distant cargo ships, clean condition`
- Spaceport (damaged/upgraded): `flat isometric 2D starbase, reinforced armor ribs, smoke plumes, breached hull panels, AI-red hazard strobes, exposed wiring, battle damage`
- Battle cruiser (master): `flat isometric 2D battle cruiser, angular hull, teal sensor arrays, cool rim light, matte metal plates, player-blue fin stripes, orbiting volcanic planet`
- Battle cruiser (variants): `flat isometric 2D battle cruiser exchanging fire, muzzle flashes, red incoming tracers, shield flares`; `flat isometric 2D battle cruiser in drydock, scaffolding, maintenance drones`
- Alien portrait: `isometric bust portrait, warlike alien commander, scaled skin, bone crest helm, player-blue sash, neutral gray background`
- Planet set: `isometric planet sprites, terran with clouds, volcanic with lava fissures, gas giant with blue bands, ice world with aurora, consistent rim light`
- Battle scene: `isometric space battle tableau, cruisers and frigates, missile trails, bright explosions, debris silhouettes, nebula backdrop`

### Midjourney (favor cinematic color & stylized detail)
- Lead with medium and mood; use `--ar` for ratio when supported.

**Master template:**
`isometric 2D illustration, painterly yet crisp linework, matte sci-fi metal, cool rimlight + warm bounce, {subject}, unified blue/red/gray faction accents, nebula parallax background, clean composition, no typography --ar 16:9`

**Category prompts**
- Spaceport (clean): `isometric 2D illustration of a bustling orbital spaceport, layered docking rings, cargo haulers, glowing blue guidance strips, soft shadows, clean maintenance decks --ar 16:9`
- Spaceport (damaged/upgraded): `isometric 2D starbase under repair, fractured hull plates, sparking conduits, red warning beacons, exposed trusses, EVA crews patching damage --ar 16:9`
- Battle cruiser (master): `isometric 2D battle cruiser silhouette, armored prow, recessed turrets, blue command lighting, subtle weathering, orbiting a volcanic colony --ar 16:9`
- Battle cruiser (variants): `isometric 2D battle cruiser mid-broadside, missile salvos, shield flare arcs, debris trails --ar 16:9`; `isometric 2D battle cruiser with upgraded stealth plating, dark matte panels, teal sensor glow --ar 16:9`
- Alien portrait: `isometric head-and-shoulders portrait of a technocrat alien, bioluminescent circuitry, sleek mask, violet HUD reflections, neutral gray backdrop --ar 2:3`
- Planet set: `isometric set of five planets, distinct biomes (terran, volcanic, ice, ocean, gas giant), consistent rim lighting, crisp cloud bands --ar 1:1`
- Battle scene: `isometric 2D fleet engagement, cruisers and carriers, tracer fire, boarding pods launching, looming planet limb, cinematic lighting --ar 16:9`

### Local LoRA (wildcard; assume Stable Diffusion + LoRA for cohesion)
- Keep tokens explicit; include `lora:overlord-style:1` placeholder for future style LoRA.
- Mention `isometric sprite` to keep proportions game-ready.

**Master template:**
`lora:overlord-style:1, isometric sprite illustration, matte metal, crisp edges, {subject}, player-blue trims vs AI-red trims, neutral gray base coat, nebula sky, medium detail, game-ready, no text`

**Category prompts**
- Spaceport (clean): `lora:overlord-style:1 isometric sprite, orbital spaceport with concentric rings, blue landing lights, cargo pods, minimal grime`
- Spaceport (damaged/upgraded): `lora:overlord-style:1 isometric sprite, military starbase, reinforced armor, scorch marks, venting atmosphere, red hazard strobes`
- Battle cruiser (master): `lora:overlord-style:1 isometric sprite, heavy battle cruiser, angled fins, turret hardpoints, blue dorsal stripe`
- Battle cruiser (variants): `lora:overlord-style:1 isometric sprite, battle cruiser with plasma scoring and hull breach`; `lora:overlord-style:1 isometric sprite, upgraded cruiser with modular armor plates and extended engines`
- Alien portrait: `lora:overlord-style:1 isometric bust, alien merchant prince, layered fabrics, gold filigree tech, calm expression`
- Planet set: `lora:overlord-style:1 isometric sprite sheet, five planets with distinct biomes, uniform lighting, clean limb glow`
- Battle scene: `lora:overlord-style:1 isometric diorama, frigates and carriers exchanging fire, missile contrails, debris clouds`

## Workflow: Master to Variant
1. Generate **master image per category** (spaceport, cruiser, alien, planet, battle scene, UI icon set) using the master templates.
2. Align universe: apply the same palette anchors, rim/bounce lighting, matte finish, and nebula backdrop across masters.
3. Create a **style LoRA or Midjourney style** from masters; retarget prompts with `lora:overlord-style:1` or Midjourney style refs.
4. Produce **variants**: upgraded vs damaged vs docking vs combat; reuse camera angle and silhouette for consistency.
5. Export cutouts: downscale to sprite targets (512–1024) and atlas them per lazy-load buckets (Priority 1 UI, Priority 2 crafts/planets, Priority 3 caches).【F:design-docs/artifacts/prd.md†L847-L864】
6. Audio: render short (<1s) UI SFX set, longer (0.5–1.5s) combat/alert cues, and loopable 2–3 min ambient/battle tracks per streaming plan.【F:design-docs/artifacts/prd.md†L820-L833】
