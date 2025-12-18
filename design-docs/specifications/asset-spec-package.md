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

