# Art Requirements Document

**Version:** 1.1
**Last Updated:** December 6, 2025
**Status:** Updated (Post Design Review)
**Art Style:** Prodeus-Inspired Low-Poly 3D
**Render Pipeline:** Universal Render Pipeline (URP) 17.3.0+
**Engine:** Unity 6000 LTS

---

## Art Direction

### Visual Style

**Prodeus-Style Low-Poly Aesthetic:**
- Hard-edged polygonal geometry (no smooth shading)
- High-contrast lighting with colored shadows
- Pixel-art textures on 3D models (64×64 to 512×512)
- Emissive materials for glowing elements (engines, weapons, UI)
- Minimal triangle count: 100-500 tris per model (ships), 50-200 tris (buildings)

**Color Palette:**
- **Player Faction (Blue)**: #0066FF (primary), #003399 (dark), #66B2FF (light)
- **Enemy Faction (Red)**: #FF0033 (primary), #990000 (dark), #FF6699 (light)
- **Neutral (Gray)**: #666666 (primary), #333333 (dark), #999999 (light)
- **UI Accent (Gold)**: #FFD700 (highlights), #FFA500 (buttons)
- **Space (Black/Blue)**: #000033 (space), #003366 (nebula accents)

---

## 3D Models

### Spacecraft

1. **Battle Cruiser**
   - **Triangle Count:** 300-400 tris
   - **Textures:** 256×256 diffuse (gray hull + blue accent stripes)
   - **Emissive:** Engine glow (blue), weapon hardpoints (red)
   - **LOD:** 3 levels (400 tris, 200 tris, 50 tris)
   - **Variations:** Player (blue), AI (red)

2. **Cargo Cruiser**
   - **Triangle Count:** 200-300 tris
   - **Textures:** 256×256 (utilitarian gray, cargo containers)
   - **Emissive:** Navigation lights (green/red)
   - **LOD:** 3 levels

3. **Solar Satellite**
   - **Triangle Count:** 100-150 tris
   - **Textures:** 128×128 (solar panels, metallic core)
   - **Emissive:** Solar panels (yellow glow)
   - **LOD:** 2 levels

4. **Atmosphere Processor**
   - **Triangle Count:** 150-200 tris
   - **Textures:** 128×128 (industrial machinery)
   - **Emissive:** Processing vents (cyan glow)
   - **LOD:** 2 levels

### Planets

1. **Volcanic Planet**
   - **Triangle Count:** 200 tris (icosphere)
   - **Textures:** 512×512 (lava rivers, dark rock)
   - **Shader:** Pulsing emissive for lava
   - **Atmosphere:** Red-orange glow (shader)

2. **Desert Planet**
   - **Triangle Count:** 200 tris
   - **Textures:** 512×512 (sand dunes, canyons)
   - **Shader:** Matte, no emissive
   - **Atmosphere:** Yellow haze

3. **Tropical Planet**
   - **Triangle Count:** 200 tris
   - **Textures:** 512×512 (oceans, continents, clouds)
   - **Shader:** Water reflections (fake cubemap)
   - **Atmosphere:** Blue-green glow

4. **Metropolis Planet**
   - **Triangle Count:** 200 tris
   - **Textures:** 512×512 (city lights, continents)
   - **Shader:** City lights emissive (yellow)
   - **Atmosphere:** Gray-blue haze

### Buildings

1. **Docking Bay** (Orbital Platform)
   - **Triangle Count:** 150 tris
   - **Textures:** 128×128 (metal scaffolding)
   - **Emissive:** Docking lights (blue)

2. **Mining Station**
   - **Triangle Count:** 200 tris
   - **Textures:** 128×128 (industrial machinery, drill)
   - **Emissive:** Status lights (green)

3. **Horticultural Station**
   - **Triangle Count:** 150 tris
   - **Textures:** 128×128 (greenhouse, biodomes)
   - **Emissive:** Grow lights (cyan)

4. **Orbital Defense Platform**
   - **Triangle Count:** 200 tris
   - **Textures:** 128×128 (weapon turrets, armor)
   - **Emissive:** Targeting laser (red)

---

## UI Art

### Icons

**Size:** 64×64 pixels (pixel art)
**Style:** High-contrast, 3-color maximum

**Resource Icons:**
- 💰 Credits: Gold coin
- ⛏️ Minerals: Gray crystal
- ⚡ Fuel: Lightning bolt
- 🌾 Food: Wheat grain
- 🔋 Energy: Battery

**Building Icons:**
- Docking Bay: Platform with ship silhouette
- Mining Station: Drill + rocks
- Horticultural Station: Dome + plant
- Orbital Defense: Turret + crosshair

**Craft Icons:**
- Battle Cruiser: Warship silhouette
- Cargo Cruiser: Boxy transport
- Solar Satellite: Solar panel array
- Atmosphere Processor: Smokestack machine

### UI Elements

**Buttons:**
- **Size:** 200×50 pixels (normal), 240×60 (large)
- **States:** Normal, Hover (glow), Pressed (darker), Disabled (gray)
- **Corners:** 5px rounded corners
- **Border:** 2px solid outline

**Panels:**
- **Background:** Semi-transparent dark (#000000 @ 80% opacity)
- **Border:** 3px solid (#FFD700 for active, #666666 for inactive)
- **Header:** Gradient (#003366 → #000033)

**Progress Bars:**
- **Background:** Dark gray (#333333)
- **Fill:** Green (#00FF00) for health, Blue (#0066FF) for progress, Red (#FF0000) for danger
- **Height:** 20px
- **Border:** 1px solid (#666666)

---

## Visual Effects

### Particle Effects

**Explosion:**
- **Texture:** 32×32 pixel smoke/fire sprite
- **Color:** Orange → Red → Black gradient
- **Particle Count:** 50-100 (PC), 25-50 (mobile)
- **Duration:** 1 second

**Laser Beam:**
- **Type:** Line renderer
- **Color:** Blue (player), Red (enemy)
- **Width:** 0.1m
- **Glow:** Bloom shader

**Engine Trail:**
- **Texture:** 16×16 smoke sprite
- **Color:** Cyan glow
- **Particle Count:** 10-20
- **Duration:** 0.5 seconds

### Post-Processing

**Bloom:**
- **Intensity:** 0.5
- **Threshold:** 1.0
- **Blur:** 3 passes

**Color Grading:**
- **Space:** Cool (blue tint +10%)
- **Combat:** Desaturated (-20%)
- **Victory:** Warm (gold tint +15%)

---

## Animation

### Ship Animations

**Idle:**
- Gentle bobbing (sin wave, 0.1m amplitude, 2s period)

**Movement:**
- Engine glow pulse (0.8 → 1.0 intensity, 0.5s)
- Slight forward tilt (5 degrees)

**Destroyed:**
- Spin tumble (random axis, 180 deg/s)
- Explosion VFX trigger
- Debris scatter (5-10 pieces)

### UI Animations

**Panel Slide:**
- Duration: 300ms
- Easing: Ease-out cubic

**Button Click:**
- Scale: 1.0 → 0.95 → 1.0 (100ms total)
- Flash: White overlay (50ms)

**Construction Progress:**
- Scaffold fade-in (10% per turn)
- Rotating parts (slow, 10 deg/s)

---

## Technical Specifications

### Universal Render Pipeline (URP) Requirements

**Render Pipeline:** URP 17.3.0+ (Unity 6000 LTS)

**Shader Strategy:**
- **Primary Method:** URP Shader Graph for all custom shaders
- **No Legacy Shaders:** All shaders must be URP-compatible (no Built-in RP shaders)
- **Mobile Optimization:** Use URP Mobile-optimized shader variants for mobile builds

**Material Types:**
1. **Lit Materials** (for most 3D models)
   - URP/Lit shader or custom Shader Graph
   - Supports normal maps, emissive maps, smoothness
   - Mobile variant: Simplified lighting calculations

2. **Unlit Materials** (for UI, particles, special effects)
   - URP/Unlit shader or custom Shader Graph
   - No lighting calculations (performance-optimized)
   - Used for: HUD elements, particle effects, flat-shaded objects

3. **Particle Materials** (for VFX)
   - URP/Particles/Lit or URP/Particles/Unlit
   - Additive, Alpha-blended, or Multiply blend modes
   - Used for: Explosions, laser beams, engine trails

**Post-Processing:**
- Use URP Volume system for all post-processing
- Volume profiles: Space, Combat, Victory/Defeat
- Effects: Bloom, Color Grading, Vignette (see AFS-082 for details)

**Lighting:**
- **Baked Lighting:** Mixed mode for static objects (planets, stations)
- **Realtime Lights:** Point lights for ship engines, explosions
- **Shadows:** Enabled on PC (medium quality), disabled on mobile
- **Ambient Lighting:** Skybox-based with subtle gradient

### Texture Formats

**PC:**
- **Format:** PNG (source), DXT5 (Unity compressed)
- **Sizes:** 64×64, 128×128, 256×256, 512×512

**Mobile:**
- **Format:** ASTC 6×6 (Android), PVRTC 4bpp (iOS)
- **Sizes:** Max 512×512 (reduce for performance)

### Model Formats

**Source:** .fbx or .obj
**Unity Import:** Mesh compression enabled, Read/Write disabled

### Performance Budgets

**PC:**
- **Total Tris On-Screen:** <100,000 tris
- **Texture Memory:** <500MB
- **Draw Calls:** <500

**Mobile:**
- **Total Tris On-Screen:** <50,000 tris
- **Texture Memory:** <200MB
- **Draw Calls:** <100

---

## Asset List

### Priority 1 (MVP)

**3D Models (24 total):**
- 4× Spacecraft (Battle Cruiser, Cargo, Solar, Processor)
- 4× Planets (Volcanic, Desert, Tropical, Metropolis)
- 4× Buildings (Docking Bay, Mining, Horticultural, Defense)
- 12× LOD variants

**Textures (16 total):**
- 4× Ship textures
- 4× Planet textures
- 4× Building textures
- 4× UI texture atlases

**VFX (6 total):**
- Explosion, Laser, Engine trail, Debris, Shield, Warp

**UI Icons (20 total):**
- 5× Resources, 4× Buildings, 4× Craft, 7× Misc

### Priority 2 (Post-MVP)

- Platoon unit models (soldiers, vehicles)
- Additional planet types
- Animated portraits for AI opponents
- Cinematic camera paths

---

**Document Owner:** Art Director
**Review Status:** Approved
