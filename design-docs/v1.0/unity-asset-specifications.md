# Unity Asset Specifications

**Version:** 1.0
**Last Updated:** 2025-12-06
**Status:** Asset Requirements

## Table of Contents

1. [Overview](#overview)
2. [Technical Standards](#technical-standards)
3. [Visual Assets](#visual-assets)
4. [Audio Assets](#audio-assets)
5. [UI Assets](#ui-assets)
6. [Animation Assets](#animation-assets)
7. [Particle Effects](#particle-effects)
8. [Asset Organization](#asset-organization)

---

## Overview

This document specifies all art and audio assets required for the Overlord Unity remake. Assets are organized by **priority tiers** to enable phased implementation.

**Priority Levels:**
- **P0:** Minimum Viable Product (required for basic gameplay)
- **P1:** Enhanced Experience (polish and feedback)
- **P2:** Full Polish (advanced visual effects)
- **P3:** Stretch Goals (optional enhancements)

---

## Color Palette & Style Guide

### Master Color Palette

**Faction Colors:**
- Player Blue: `#3080C0` (primary), `#2060A0` (dark), `#60A0E0` (light)
- AI Red: `#C03030` (primary), `#A02020` (dark), `#E06060` (light)
- Neutral Gray: `#808080` (primary), `#606060` (dark), `#A0A0A0` (light)

**Resource Colors:**
- Credits: `#FFD700` (gold)
- Minerals: `#8040FF` (purple)
- Fuel: `#FF8040` (orange)
- Food: `#80FF40` (green)
- Energy: `#40FFFF` (cyan)

**UI Colors:**
- Background: `#202020` (90% opacity panels)
- Header: `#303030` (95% opacity)
- Border: `#404040` (2px outlines)
- Text Primary: `#FFFFFF` (white)
- Text Secondary: `#A0A0A0` (light gray)
- Button Normal: `#404040`
- Button Hover: `#606060`
- Button Pressed: `#303030`
- Button Disabled: `#404040` (50% opacity)
- Success/Positive: `#40FF40` (green)
- Warning: `#FFA040` (yellow-orange)
- Error/Critical: `#FF4040` (red)

**Planet Type Colors:**
- Rocky: `#8B7355` (brown-gray base)
- Desert: `#D2B48C` (tan base)
- Ocean: `#4682B4` (steel blue base)
- Ice: `#E0F6FF` (pale blue base)
- Volcanic: `#8B0000` (dark red base) with `#FF4500` (orange-red lava)

**Space Background:**
- Base: `#000000` (pure black)
- Stars: `#FFFFFF`, `#C0D0FF` (blue-white), `#FFF0C0` (yellow-white)
- Nebula 1: `#4B0082` (indigo, 20-30% opacity)
- Nebula 2: `#8B008B` (dark magenta, 20-30% opacity)
- Nebula 3: `#00CED1` (dark cyan, 20-30% opacity)

### Visual Style Guide

**Overall Aesthetic:** Classic sci-fi strategy game with clean, iconic designs. Think FTL meets Stellaris meets Master of Orion II, but simplified for 2D top-down view.

**Key Principles:**
1. **Clarity Over Detail:** Readable at all zoom levels, no unnecessary complexity
2. **High Contrast:** All sprites must be clearly visible against black space background
3. **Consistent Lighting:** Single overhead light source for all sprites (top-left at 45° angle)
4. **Limited Palette:** Use master color palette, avoid gradients except for glows
5. **No Realism:** Stylized, iconic representation (think board game pieces)

**Reference Games:**
- **FTL: Faster Than Light** - Planet sprites, clean UI, icon style
- **Stellaris** - Strategic overview, galaxy map composition
- **Master of Orion II** - Building icons, classic sci-fi aesthetic
- **Into the Breach** - Minimal, readable design, clear visual hierarchy
- **Sword of the Stars** - Galaxy map style, planet variety

**Art Style Examples:**

```
PLANET STYLE REFERENCE:
- FTL planet sprites: https://ftl.fandom.com/wiki/Planets
- Simple circular forms, top-down view
- 2-3 colors max per planet
- Subtle surface texture (craters, clouds, ice caps)
- NO 3D rendering, keep flat 2D with shading

UI STYLE REFERENCE:
- FTL UI panels: Clean, functional sci-fi panels
- Into the Breach buttons: Minimalist, clear interaction states
- Flat design with subtle bevels (not skeuomorphic)
- Sans-serif fonts only

ICON STYLE REFERENCE:
- Isometric angle (~30° from top)
- Simple geometric shapes
- 2-3 colors per icon max
- Clear readable silhouette at small sizes
```

### Mockups & Composition Examples

**Main Menu Composition:**
```
┌─────────────────────────────────────────────┐
│                                             │
│              OVERLORD                       │ <- Title (Exo 2 Bold, 72pt)
│         (tagline if desired)                │
│                                             │
│                                             │
│         [    NEW GAME     ]                 │ <- Primary button (blue)
│         [    LOAD GAME    ]                 │ <- Disabled (gray)
│         [      QUIT       ]                 │ <- Standard button
│                                             │
│                                             │
└─────────────────────────────────────────────┘
Background: Starfield with subtle nebula
```

**Galaxy Map HUD:**
```
┌─────────────────────────────────────────────┐
│ 💰1000 ⛏️500 ⚡300 🌾200 🔋150   Turn 1    │ <- Top bar (resources + turn)
├─────────────────────────────────────────────┤
│                                             │
│     *  Planet A                             │ <- Galaxy view (planets as circles)
│                                             │
│                Planet B                     │
│         *           *  Planet C (selected)  │
│                                             │
│  Planet D                                   │
│            *                                │
├─────────────────────┬───────────────────────┤
│                     │   Phase: Action       │
│  [Planet Panel]     │   [  END TURN  ]      │ <- Bottom bar
│  (when selected)    │                       │
└─────────────────────┴───────────────────────┘
```

**Planet Panel Layout:**
```
┌─────────────────────┐
│  Planet: Earth      │ <- Header (planet name)
│  Owner: Player      │
├─────────────────────┤
│ Population: 5000    │
│ Morale: 75%         │
├─────────────────────┤
│ Resources:          │
│  💰 +100/turn       │ <- Resource icons + production
│  ⛏️ +50/turn        │
│  ⚡ +30/turn        │
├─────────────────────┤
│ Buildings: 3/6      │
│  [Mine]  [Farm]     │ <- Building icons (48x48)
│  [Lab]              │
├─────────────────────┤
│ Fleet: 2 ships      │
│  [🚀] [🚀]          │ <- Fleet icons
└─────────────────────┘
```

**Planet Sprite Mockup (128x128 each):**
```
Rocky Planet:          Desert Planet:         Ocean Planet:
    ___                   ___                    ___
  /     \               /     \                /     \
 |  ∙∙∙  |             | ~~~~  |              | ≈≈≈≈  |
 | ∙ ∙ ∙ |             |  ~~~~  |             |≈ ≈≈≈ ≈|
  \ ∙∙∙ /               \ ~~~  /               \ ≈≈≈ /
    ---                   ---                    ---
Gray/brown            Tan/orange              Blue/teal
Crater texture        Sand dune texture       Wave texture
```

---

## Technical Export Settings

### Photoshop/GIMP Export Settings

**For All Sprites:**
1. Create at **double resolution** (e.g., 256x256 for 128x128 target)
2. Export at target resolution using "Nearest Neighbor" downsampling
3. PNG-24 with transparency
4. Remove color profile (use sRGB working space)
5. No interlacing
6. Compression level: 9 (maximum, but keep under 100KB per sprite)

**For 9-Slice UI Elements:**
1. Mark slice guides in source file
2. Export full image + slice metadata JSON
3. Border sizes:
   - Button: 8px borders (left, right, top, bottom)
   - Panel: 16px borders
4. Center section should be tileable

**For Icon Sets:**
1. Create on artboard/grid for alignment
2. Export all icons in single batch (same settings)
3. Name sequentially: `icon_mine_01.png`, `icon_refinery_02.png`, etc.
4. Include 2px transparent padding on all sides

### Unity Import Settings

**Sprites:**
- Texture Type: Sprite (2D and UI)
- Sprite Mode: Single (or Multiple for sheets)
- Pixels Per Unit: 100 (standard)
- Mesh Type: Tight
- Max Size: 1024 (or native resolution if smaller)
- Format: RGBA Compressed DXT5 (PC) or ASTC (mobile)
- Compression: Normal Quality
- Use Mip Maps: No (for sprites)

**UI Images:**
- Texture Type: Sprite (2D and UI)
- Sprite Mode: Single
- Pixels Per Unit: 100
- Max Size: 2048 (for 9-slice panels)
- Format: RGBA Compressed DXT5
- Use Mip Maps: No

**Backgrounds:**
- Texture Type: Default
- Max Size: 2048
- Format: RGB Compressed DXT1 (no transparency needed)
- Use Mip Maps: Yes
- Wrap Mode: Repeat (for tileable)

### Audio Export Settings

**Sound Effects (WAV source):**
- Sample Rate: 48kHz
- Bit Depth: 24-bit
- Channels: Mono
- Format: Uncompressed PCM
- Normalize: Peak at -3dB (leave headroom)
- Fade: 5ms fade-in, 10ms fade-out
- Remove DC offset and silence at ends

**Music (WAV source):**
- Sample Rate: 48kHz
- Bit Depth: 24-bit
- Channels: Stereo
- Format: Uncompressed PCM
- Normalize: Peak at -3dB
- Loop Points: Mark in metadata (sample-accurate)
- Crossfade: 100ms for seamless loop

**Unity Import (Runtime OGG):**
- Unity will convert to OGG Vorbis automatically
- SFX: Quality 70, Mono, Load Type: Decompress On Load
- Music: Quality 80, Stereo, Load Type: Streaming
- Preload Audio Data: True (for SFX), False (for music)

### File Naming Conventions

**Sprites:**
- Format: `category_descriptor_variation.png`
- Examples:
  - `planet_rocky_01.png`
  - `ui_button_normal.png`
  - `icon_credits.png`
  - `effect_explosion_frame01.png`

**Audio:**
- Format: `type_action_variation.wav`
- Examples:
  - `sfx_button_click.wav`
  - `sfx_laser_fire_01.wav`
  - `music_menu_theme.wav`

**Prefabs (Unity):**
- Format: `PascalCase.prefab`
- Examples:
  - `Planet.prefab`
  - `ResourceDisplay.prefab`
  - `UIPanel.prefab`

### Folder Structure (Source Files)

```
SourceAssets/
├── Sprites/
│   ├── Planets/
│   │   ├── planet_rocky.psd (working file, 256x256)
│   │   ├── planet_rocky.png (export, 128x128)
│   │   └── ...
│   ├── UI/
│   │   ├── ui_button.psd (with slice guides)
│   │   └── ui_button.png (96x32, 9-slice)
│   └── Icons/
│       └── icon_sheet.psd (all icons on artboard)
│
├── Audio/
│   ├── SFX/
│   │   └── sfx_button_click.wav (48kHz 24-bit)
│   └── Music/
│       └── music_menu_theme.wav (48kHz 24-bit stereo)
│
└── Fonts/
    ├── Orbitron-Regular.ttf
    └── Exo2-Bold.ttf
```

---

## Technical Standards

### General Requirements

**Sprites:**
- Format: PNG with transparency
- Color space: sRGB
- Compression: None for source files
- Naming: lowercase_snake_case.png

**Textures:**
- Format: PNG or TGA
- Power-of-two dimensions preferred (256x256, 512x512, 1024x1024)
- Mipmaps: Generate in Unity

**Audio:**
- Format: WAV (source), OGG Vorbis (runtime)
- Sample rate: 44.1kHz or 48kHz
- Bit depth: 16-bit or 24-bit (source)
- Mono for SFX, Stereo for music

**Fonts:**
- Format: TrueType (.ttf) or OpenType (.otf)
- Include SDF assets for TextMeshPro

---

## Visual Assets

### 1. Galaxy Map Assets (P0)

#### 1.1 Planet Sprites

**Planet Base Sprites**
- **Quantity:** 5 variations
- **Size:** 128x128 pixels
- **Style:** Top-down/orthographic circular planets
- **Variations:**
  1. Rocky planet (gray/brown tones)
  2. Desert planet (tan/orange tones)
  3. Ocean planet (blue/teal tones)
  4. Ice planet (white/light blue tones)
  5. Volcanic planet (red/orange/black tones)
- **Format:** PNG with transparency
- **Details:** Simple, clean designs with minimal detail
- **Reference:** Similar to FTL planet sprites but simpler

**Technical Notes:**
- Single sprite, no animation needed
- Clear silhouette
- High contrast against black space background
- No atmosphere effects (P1 feature)

---

**Planet Overlay Sprites (P0)**

**Selection Ring:**
- **Size:** 140x140 pixels (outer ring around planet)
- **Style:** Bright glowing ring (cyan/white)
- **Animation:** Optional pulsing glow (shader)
- **Format:** PNG with transparency, additive blend

**Ownership Indicators:**
- **Size:** 32x32 pixels
- **Style:** Flag/banner icon overlaid on planet
- **Variations:**
  1. Player flag (blue)
  2. AI flag (red)
- **Format:** PNG with transparency
- **Position:** Top-right of planet sprite

---

**Planet Atmosphere/Halo (P1)**
- **Size:** 160x160 pixels
- **Style:** Soft glow around planet edge
- **Color:** Tinted by planet type
- **Format:** PNG with transparency, additive blend
- **Usage:** Shader-based glow (optional)

---

#### 1.2 Space Background

**Background Texture (P0)**
- **Size:** 2048x2048 pixels (tileable)
- **Style:** Black with subtle star field
- **Details:**
  - Tiny white/blue/yellow dots for stars
  - Sparse (20-30 stars per 512x512 region)
  - No nebulae or complex effects
- **Format:** PNG
- **Usage:** Tiled across galaxy map

**Nebula Overlays (P1)**
- **Quantity:** 3 variations
- **Size:** 1024x1024 pixels
- **Style:** Subtle purple/blue/red gas clouds
- **Opacity:** 20-30%
- **Format:** PNG with transparency
- **Usage:** Randomly placed on map for visual interest

---

#### 1.3 Fleet Icons (P0)

**Craft Type Icons:**

**Scout Icon:**
- **Size:** 32x32 pixels
- **Style:** Small, fast-looking spacecraft silhouette
- **Color:** Tinted by owner (blue/red)
- **Details:** Minimal, arrow-like shape
- **Format:** PNG with transparency

**Battle Cruiser Icon:**
- **Size:** 48x48 pixels
- **Style:** Large, imposing spacecraft silhouette
- **Color:** Tinted by owner (blue/red)
- **Details:** Blocky, powerful-looking
- **Format:** PNG with transparency

**Bomber Icon:**
- **Size:** 40x40 pixels
- **Style:** Medium spacecraft with visible weapon bays
- **Color:** Tinted by owner (blue/red)
- **Details:** Angular, aggressive design
- **Format:** PNG with transparency

**Technical Notes:**
- Icons appear next to planets when fleets are present
- Stacked vertically if multiple craft types
- Quantity badge: small number overlay (e.g., "x5")

---

#### 1.4 Platoon Icons (P0)

**Ground Force Icon:**
- **Size:** 32x32 pixels
- **Style:** Military ground unit symbol (tank/soldier silhouette)
- **Color:** Tinted by owner (blue/red)
- **Format:** PNG with transparency
- **Usage:** Displayed in planet panel UI

---

### 2. UI Assets (P0)

#### 2.1 Button Sprites

**Standard Button (9-Slice):**
- **Size:** 96x32 pixels (9-slice borders: 8px each side)
- **Style:** Sci-fi panel with slight gradient
- **States:**
  1. Normal: Medium gray (#404040)
  2. Hover: Lighter gray (#606060)
  3. Pressed: Darker gray (#303030)
  4. Disabled: Dark gray with 50% opacity
- **Format:** PNG
- **Border Style:** Beveled edge, subtle inner shadow

**Primary Button (Action):**
- Same as Standard Button but:
- **Color:** Blue tint (#2060A0 normal, #3080C0 hover)
- **Usage:** "New Game", "End Turn", "Confirm"

**Danger Button:**
- Same as Standard Button but:
- **Color:** Red tint (#A02020 normal, #C03030 hover)
- **Usage:** "Delete", "Scrap", "Self-Destruct"

---

#### 2.2 Panel Backgrounds

**Main Panel Background (9-Slice):**
- **Size:** 128x128 pixels (9-slice borders: 16px each side)
- **Style:** Dark semi-transparent panel
- **Color:** #202020 with 90% opacity
- **Border:** Subtle outline (#404040, 2px)
- **Format:** PNG with transparency

**Header Panel (9-Slice):**
- **Size:** 128x32 pixels (9-slice borders: 8px sides, 4px top/bottom)
- **Style:** Lighter panel for headers
- **Color:** #303030 with 95% opacity
- **Format:** PNG with transparency

---

#### 2.3 Resource Icons

**Credits Icon:**
- **Size:** 24x24 pixels
- **Style:** Coin/currency symbol
- **Color:** Gold (#FFD700)
- **Format:** PNG with transparency

**Minerals Icon:**
- **Size:** 24x24 pixels
- **Style:** Crystal/gem symbol
- **Color:** Purple (#8040FF)
- **Format:** PNG with transparency

**Fuel Icon:**
- **Size:** 24x24 pixels
- **Style:** Fuel canister/drop symbol
- **Color:** Orange (#FF8040)
- **Format:** PNG with transparency

**Food Icon:**
- **Size:** 24x24 pixels
- **Style:** Wheat/grain symbol
- **Color:** Green (#80FF40)
- **Format:** PNG with transparency

**Energy Icon:**
- **Size:** 24x24 pixels
- **Style:** Lightning bolt/battery symbol
- **Color:** Cyan (#40FFFF)
- **Format:** PNG with transparency

**Usage:** Displayed next to resource numbers in UI panels

---

#### 2.4 Building Icons (P0)

**Quantity:** 9 building types
**Size:** 48x48 pixels each
**Style:** Isometric building icons
**Format:** PNG with transparency

1. **Mine Icon:** Pickaxe over rock, brown/gray tones
2. **Refinery Icon:** Factory with smokestacks, gray/orange tones
3. **Farm Icon:** Barn with crops, green/brown tones
4. **Solar Panel Icon:** Solar array, blue/silver tones
5. **Factory Icon:** Industrial building, gray/red tones
6. **Lab Icon:** Science facility with flask, white/cyan tones
7. **Training Facility Icon:** Military building, gray/green tones
8. **Barracks Icon:** Soldier quarters, gray/tan tones
9. **Spaceport Icon:** Launch pad with rocket, white/orange tones

**Technical Notes:**
- Simple, clear silhouettes
- High contrast against dark UI background
- Consistent isometric angle (30-45 degrees)

---

#### 2.5 Defense Icons (P0)

**Quantity:** 3 defense types
**Size:** 48x48 pixels each
**Format:** PNG with transparency

1. **Shield Generator Icon:** Dome/barrier, cyan/blue tones
2. **Missile Battery Icon:** Missile silo, gray/red tones
3. **Laser Battery Icon:** Laser turret, white/orange tones

---

#### 2.6 Progress Bars

**Health/Production Bar Fill:**
- **Size:** 256x32 pixels
- **Style:** Gradient fill, left-to-right
- **Color:** Green (#40FF40 to #208020)
- **Format:** PNG

**Progress Bar Background:**
- **Size:** 256x32 pixels
- **Style:** Inset, dark background
- **Color:** #101010
- **Border:** #404040, 2px
- **Format:** PNG

**Alternate Fill Colors:**
- Health: Green
- Production: Blue (#4080FF)
- Damage: Red (#FF4040)
- Energy: Cyan (#40FFFF)

---

### 3. Effects Assets (P1)

#### 3.1 Combat Effects

**Explosion Sprite Sheet (P1):**
- **Size:** 512x512 pixels (8x8 grid = 64 frames)
- **Frame Size:** 64x64 pixels
- **Style:** Pixel art or hand-drawn explosion
- **Animation:** 16 frames, 60 fps (0.27s total)
- **Format:** PNG sprite sheet

**Laser Beam Sprite (P1):**
- **Size:** 256x16 pixels
- **Style:** Glowing energy beam
- **Color:** Red or cyan (tint by faction)
- **Format:** PNG with transparency
- **Usage:** Stretched between attacker and target

**Missile Trail (P1):**
- **Size:** 32x32 pixels
- **Style:** Smoke/fire trail particle
- **Format:** PNG with transparency
- **Usage:** Particle system

---

#### 3.2 UI Effects

**Button Glow (P1):**
- **Size:** 128x64 pixels
- **Style:** Soft glow overlay
- **Color:** White with radial gradient
- **Format:** PNG with transparency
- **Usage:** Additive blend on button hover

**Selection Pulse (P1):**
- **Size:** 256x256 pixels
- **Style:** Expanding ring
- **Animation:** Sprite sheet or shader
- **Format:** PNG with transparency

---

### 4. Typography (P0)

#### 4.1 Fonts

**Primary UI Font:**
- **Name:** "Orbitron" or similar sci-fi sans-serif
- **Weights:** Regular (400), Bold (700)
- **Usage:** All UI text, buttons, labels
- **Fallback:** Arial, sans-serif
- **Format:** TrueType (.ttf)

**Header Font:**
- **Name:** "Exo 2" or similar futuristic font
- **Weights:** Bold (700)
- **Usage:** Titles, headers, planet names
- **Format:** TrueType (.ttf)

**Monospace Font (Optional P1):**
- **Name:** "Roboto Mono" or similar
- **Usage:** Resource numbers, stats, debug
- **Format:** TrueType (.ttf)

**TextMeshPro Assets:**
- Generate SDF (Signed Distance Field) assets in Unity
- Atlas Size: 2048x2048
- Character Set: ASCII + Extended Latin
- Padding: 5px

---

## Audio Assets

### 1. Music (P1)

#### 1.1 Background Music Tracks

**Main Menu Theme:**
- **Duration:** 2-3 minutes (loopable)
- **Style:** Ambient, mysterious, space-themed
- **Tempo:** Slow (60-80 BPM)
- **Instruments:** Synth pads, atmospheric effects
- **Reference:** FTL menu theme, Mass Effect ambient
- **Format:** OGG Vorbis (runtime), WAV (source)

**Galaxy Map Theme:**
- **Duration:** 3-5 minutes (loopable)
- **Style:** Strategic, contemplative
- **Tempo:** Medium (90-110 BPM)
- **Layers:**
  - Base: Synth pads, strings
  - Mid: Subtle percussion
  - High: Melodic synth lead (sparse)
- **Reference:** Stellaris, XCOM 2 strategy layer
- **Format:** OGG Vorbis (runtime), WAV (source)

**Combat Theme (P2):**
- **Duration:** 2-3 minutes (loopable)
- **Style:** Tense, action-oriented
- **Tempo:** Fast (120-140 BPM)
- **Instruments:** Drums, bass, aggressive synths
- **Reference:** FTL combat, StarCraft battle themes
- **Format:** OGG Vorbis (runtime), WAV (source)

---

### 2. Sound Effects (P0-P1)

#### 2.1 UI Sounds (P0)

**Button Click:**
- **Duration:** 0.1-0.2 seconds
- **Style:** Short, crisp beep/click
- **Pitch:** Medium-high
- **Format:** WAV (mono)

**Button Hover:**
- **Duration:** 0.05 seconds
- **Style:** Subtle tone/whoosh
- **Pitch:** Higher than click
- **Format:** WAV (mono)

**Panel Open:**
- **Duration:** 0.3-0.5 seconds
- **Style:** Mechanical slide/whoosh
- **Format:** WAV (stereo)

**Panel Close:**
- **Duration:** 0.2-0.3 seconds
- **Style:** Reverse of panel open
- **Format:** WAV (stereo)

**Error/Invalid Action:**
- **Duration:** 0.2 seconds
- **Style:** Buzzer/negative beep
- **Pitch:** Low
- **Format:** WAV (mono)

**Confirm/Success:**
- **Duration:** 0.3 seconds
- **Style:** Positive chime
- **Pitch:** High
- **Format:** WAV (mono)

---

#### 2.2 Gameplay Sounds (P1)

**Turn End:**
- **Duration:** 0.5 seconds
- **Style:** Transitional whoosh/chime
- **Format:** WAV (stereo)

**Resource Gain:**
- **Duration:** 0.2 seconds
- **Style:** Positive coin/crystal sound
- **Pitch:** Varies by resource type
- **Format:** WAV (mono)

**Resource Deficit:**
- **Duration:** 0.3 seconds
- **Style:** Warning beep
- **Format:** WAV (mono)

**Building Constructed:**
- **Duration:** 0.5 seconds
- **Style:** Construction complete chime
- **Format:** WAV (mono)

**Unit Trained:**
- **Duration:** 0.4 seconds
- **Style:** Military ready sound
- **Format:** WAV (mono)

**Planet Captured:**
- **Duration:** 1.0 seconds
- **Style:** Triumphant fanfare (short)
- **Format:** WAV (stereo)

---

#### 2.3 Combat Sounds (P1)

**Laser Fire:**
- **Duration:** 0.3 seconds
- **Style:** Sci-fi laser "pew" sound
- **Variations:** 3-5 for variety
- **Format:** WAV (mono)

**Explosion:**
- **Duration:** 0.5-1.0 seconds
- **Style:** Boom/blast
- **Variations:** 3-5 for variety
- **Format:** WAV (stereo)

**Missile Launch:**
- **Duration:** 0.4 seconds
- **Style:** Whoosh/ignition
- **Format:** WAV (stereo)

**Shield Hit:**
- **Duration:** 0.3 seconds
- **Style:** Energy impact/deflection
- **Format:** WAV (stereo)

**Hull Damage:**
- **Duration:** 0.4 seconds
- **Style:** Metallic impact
- **Format:** WAV (stereo)

---

#### 2.4 Ambient Sounds (P2)

**Space Ambience:**
- **Duration:** 30-60 seconds (loopable)
- **Style:** Subtle hum, distant sounds
- **Volume:** Very quiet (background)
- **Format:** OGG Vorbis (stereo)

**Planet Ambience (varies by type):**
- **Duration:** 30 seconds (loopable)
- **Variations:**
  1. Rocky: Wind, rocks falling
  2. Ocean: Waves, water
  3. Desert: Wind, sand
  4. Ice: Wind, cracking ice
  5. Volcanic: Lava, rumbling
- **Format:** OGG Vorbis (stereo)

---

## Animation Assets

### 1. UI Animations (P1)

**Panel Slide In:**
- **Type:** Position animation
- **Duration:** 0.3 seconds
- **Easing:** Ease out
- **Keyframes:**
  - 0s: Off-screen (x + 1000)
  - 0.3s: On-screen (x + 0)

**Fade In/Out:**
- **Type:** Alpha animation
- **Duration:** 0.2 seconds
- **Easing:** Linear
- **Keyframes:**
  - 0s: Alpha 0
  - 0.2s: Alpha 1

**Button Pulse (on hover):**
- **Type:** Scale animation
- **Duration:** 0.5 seconds (looping)
- **Easing:** Ease in-out
- **Keyframes:**
  - 0s: Scale 1.0
  - 0.25s: Scale 1.05
  - 0.5s: Scale 1.0

---

### 2. Gameplay Animations (P1)

**Planet Selection Pulse:**
- **Type:** Ring scale animation
- **Duration:** 1.0 seconds (looping)
- **Easing:** Ease out
- **Keyframes:**
  - 0s: Scale 1.0, Alpha 1.0
  - 1.0s: Scale 1.3, Alpha 0.0

**Fleet Movement (P2):**
- **Type:** Position animation
- **Duration:** Varies (based on distance)
- **Easing:** Linear or ease in-out
- **Path:** Bezier curve between planets

---

## Particle Effects

### 1. Explosion Particles (P1)

**Explosion Burst:**
- **Count:** 20-30 particles
- **Lifetime:** 0.5-1.0 seconds
- **Size:** 8-16 pixels
- **Color:** Orange → Red → Black (gradient over lifetime)
- **Velocity:** Radial burst (speed: 50-100)
- **Sprite:** Small circle or spark texture

---

### 2. Engine Trail (P1)

**Craft Engine Glow:**
- **Count:** 5-10 particles/second
- **Lifetime:** 0.3-0.5 seconds
- **Size:** 4-8 pixels
- **Color:** Cyan/Blue (by faction)
- **Velocity:** Opposite to movement direction
- **Sprite:** Soft circle texture

---

### 3. Ambient Particles (P2)

**Space Dust:**
- **Count:** 50-100 particles (always active)
- **Lifetime:** Infinite (looping)
- **Size:** 1-2 pixels
- **Color:** White with low opacity
- **Velocity:** Very slow drift
- **Sprite:** Single pixel

---

## Asset Organization

### Folder Structure

```
Assets/
├── Art/
│   ├── Sprites/
│   │   ├── Planets/
│   │   │   ├── planet_rocky.png
│   │   │   ├── planet_desert.png
│   │   │   ├── planet_ocean.png
│   │   │   ├── planet_ice.png
│   │   │   └── planet_volcanic.png
│   │   ├── UI/
│   │   │   ├── Buttons/
│   │   │   │   ├── button_normal.png
│   │   │   │   ├── button_hover.png
│   │   │   │   └── button_pressed.png
│   │   │   ├── Panels/
│   │   │   │   ├── panel_background.png
│   │   │   │   └── panel_header.png
│   │   │   └── Icons/
│   │   │       ├── Resources/
│   │   │       │   ├── icon_credits.png
│   │   │       │   ├── icon_minerals.png
│   │   │       │   ├── icon_fuel.png
│   │   │       │   ├── icon_food.png
│   │   │       │   └── icon_energy.png
│   │   │       ├── Buildings/
│   │   │       │   ├── icon_mine.png
│   │   │       │   ├── icon_refinery.png
│   │   │       │   └── ... (9 total)
│   │   │       └── Defenses/
│   │   │           ├── icon_shield.png
│   │   │           ├── icon_missiles.png
│   │   │           └── icon_lasers.png
│   │   ├── Fleet/
│   │   │   ├── icon_scout.png
│   │   │   ├── icon_cruiser.png
│   │   │   └── icon_bomber.png
│   │   └── Effects/
│   │       ├── explosion_sheet.png
│   │       ├── laser_beam.png
│   │       └── selection_ring.png
│   ├── Textures/
│   │   ├── space_background.png
│   │   ├── nebula_01.png
│   │   ├── nebula_02.png
│   │   └── nebula_03.png
│   └── Materials/
│       ├── Planet.mat
│       ├── UI.mat
│       └── Particle.mat
│
├── Audio/
│   ├── Music/
│   │   ├── menu_theme.ogg
│   │   ├── galaxy_theme.ogg
│   │   └── combat_theme.ogg
│   ├── SFX/
│   │   ├── UI/
│   │   │   ├── button_click.wav
│   │   │   ├── button_hover.wav
│   │   │   ├── panel_open.wav
│   │   │   └── panel_close.wav
│   │   ├── Gameplay/
│   │   │   ├── turn_end.wav
│   │   │   ├── resource_gain.wav
│   │   │   └── building_complete.wav
│   │   └── Combat/
│   │       ├── laser_fire_01.wav
│   │       ├── explosion_01.wav
│   │       └── missile_launch.wav
│   └── Ambient/
│       └── space_ambience.ogg
│
├── Fonts/
│   ├── Orbitron-Regular.ttf
│   ├── Orbitron-Bold.ttf
│   ├── Exo2-Bold.ttf
│   └── TextMeshPro/
│       └── (generated SDF assets)
│
└── Prefabs/
    ├── Planet.prefab
    ├── FleetIcon.prefab
    └── UI/
        ├── Button.prefab
        ├── Panel.prefab
        └── ResourceDisplay.prefab
```

---

### Naming Conventions

**Sprites:**
- `noun_descriptor.png` (e.g., `planet_rocky.png`, `button_normal.png`)

**Icons:**
- `icon_name.png` (e.g., `icon_credits.png`, `icon_mine.png`)

**Audio:**
- `category_action.wav` (e.g., `button_click.wav`, `laser_fire_01.wav`)

**Prefabs:**
- `PascalCase.prefab` (e.g., `Planet.prefab`, `ResourceDisplay.prefab`)

---

## Asset Creation Guidelines

### For Artists

**Style Consistency:**
- All assets should match a cohesive sci-fi aesthetic
- Use limited color palette: Blues, reds, grays, oranges
- Avoid realistic textures; prefer clean, iconic designs
- High contrast for readability on dark backgrounds

**Technical Requirements:**
- All sprites: PNG with transparency
- No anti-aliasing artifacts on edges
- Centered pivot points (unless specified)
- Leave 10% padding around sprite edges

**Deliverables:**
- Source files (PSD, AI, etc.)
- Exported PNGs at specified resolutions
- Sprite sheets with metadata JSON (if applicable)

---

### For Sound Designers

**Style Consistency:**
- Sci-fi theme: Synth-heavy, electronic sounds
- Avoid overly realistic sounds
- Clear, punchy SFX with distinct attacks
- Ambient music should not distract from gameplay

**Technical Requirements:**
- Source: WAV, 48kHz, 24-bit
- Runtime: OGG Vorbis (Unity will convert)
- Normalize peaks to -3dB
- Remove DC offset and silences

**Deliverables:**
- Source WAV files
- Mixing notes (if layered)
- License information (if using samples)

---

## Priority Summary

### P0 (Minimum Viable Product)

**Visual:**
- 5 planet sprites
- Selection ring sprite
- 2 ownership flags
- Space background texture
- 3 fleet icons
- 1 platoon icon
- 9 building icons
- 3 defense icons
- 5 resource icons
- UI panels and buttons
- 2 fonts (UI and header)

**Audio:**
- 6 UI sounds (click, hover, open, close, error, success)

**Total:** ~30 visual assets, 6 audio assets

---

### P1 (Enhanced Experience)

**Visual:**
- Planet atmosphere/halo sprites
- 3 nebula overlays
- Explosion sprite sheet
- Laser beam sprite
- Button glow effect
- Progress bar variations

**Audio:**
- 2 music tracks (menu, galaxy)
- 6 gameplay sounds
- 5 combat sounds

**Total:** +8 visual assets, +13 audio assets

---

### P2 (Full Polish)

**Visual:**
- Missile trail particles
- Fleet movement animations

**Audio:**
- Combat theme music
- 5 ambient loops

**Total:** +2 visual assets, +6 audio assets

---

### P3 (Stretch Goals)

**Visual:**
- Advanced particle effects
- Animated planet surfaces
- Shader effects (glow, pulse)

**Audio:**
- Voice-over (UI confirmation)
- Additional music variations

---

## Asset Commissioning Notes

### Estimated Scope

**Visual Assets (P0):** 30 sprites/textures → ~20-30 hours (artist)
**Visual Assets (P1):** +8 assets → +10 hours
**Audio Assets (P0):** 6 SFX → ~5 hours (sound designer)
**Audio Assets (P1):** 2 music + 11 SFX → ~20 hours

**Total (P0+P1):** ~55-65 hours (mixed disciplines)

---

### Freelancer Brief Template

```
Project: Overlord (Unity Remake)
Asset Category: [Visual/Audio]
Priority: [P0/P1/P2]
Deliverable Count: [X assets]
Style Reference: [FTL, Stellaris, retro sci-fi]
Technical Specs: See unity-asset-specifications.md
Timeline: [2-4 weeks recommended]
Budget: [Negotiate per asset or package]
License: Exclusive, buyout for commercial use
```

---

## Placeholder Assets (Temporary)

For initial development, use these placeholders:

**Planets:** Unity primitive circles with solid colors
**UI Buttons:** Unity default UI sprites
**Icons:** Unicode symbols or FontAwesome
**Music:** Royalty-free tracks from OpenGameArt
**SFX:** BFXR-generated placeholder sounds

**IMPORTANT:** Tag all placeholders clearly for replacement.

---

## Next Steps

1. Review asset requirements with team
2. Prioritize P0 assets for MVP
3. Commission or create P0 visual assets
4. Source or create P0 audio assets
5. Integrate into Unity using folder structure above
6. Test in-game appearance and performance
7. Iterate based on feedback
8. Proceed to P1 assets after MVP validation

**Remember:** Start with placeholders, replace incrementally, test frequently.
