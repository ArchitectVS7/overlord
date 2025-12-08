# AFS-082: Visual Effects System

**Status:** Updated (Post Design Review)
**Priority:** P2 (Medium)
**Owner:** Lead Developer
**PRD Reference:** FR-VFX-001
**Design Review:** Updated to specify URP shaders (aligned with warzones project)

---

## Summary

Visual effects system implementing particle effects, animations, and visual feedback for combat (explosions, laser fire, ship destruction), UI interactions (button clicks, panel transitions), and environmental effects (planet atmospheres, space dust), using Prodeus-style low-poly aesthetic with impactful VFX.

---

## Dependencies

- **AFS-041 (Combat System)**: Combat triggers
- **AFS-042 (Space Combat)**: Ship combat events
- **AFS-013 (Galaxy View)**: 3D scene rendering

---

## Requirements

### VFX Categories

1. **Combat Effects**
   - **Laser Fire**: Red/blue beam particle trail (200ms duration)
   - **Missile Launch**: Smoke trail + projectile (500ms)
   - **Explosion**: Orange fireball + shockwave (1s)
   - **Ship Destruction**: Large explosion + debris (2s)
   - **Bombardment**: Impact flash + crater (500ms)

2. **UI Effects**
   - **Button Hover**: Glow outline (instant)
   - **Button Click**: Flash + scale bounce (100ms)
   - **Panel Slide**: Motion blur trail (300ms)
   - **Construction Complete**: Success sparkles (500ms)
   - **Error**: Red flash + shake (200ms)

3. **Environmental Effects**
   - **Planet Atmosphere**: Rotating cloud layer shader
   - **Space Dust**: Slow-moving particles (always visible)
   - **Star Field**: Parallax background (depth illusion)
   - **Warp Travel**: Speed lines + screen shake (1s)

### Particle Systems

1. **Explosion Effect**
   - **Particle Count**: 50-100 particles
   - **Lifetime**: 1 second
   - **Color**: Orange → Red → Black (gradient)
   - **Size**: 0.5m → 2m (growth curve)
   - **Velocity**: Radial outward (random 5-10 m/s)
   - **Shader**: Additive blend (glowing effect)

2. **Laser Beam Effect**
   - **Type**: Line renderer with trail
   - **Width**: 0.1m
   - **Color**: Red (enemy), Blue (player)
   - **Duration**: 200ms fade-out
   - **Emission**: Bloom post-processing

3. **Debris Effect**
   - **Particle Count**: 20-30 pieces
   - **Lifetime**: 3 seconds
   - **Physics**: Rigidbody + gravity
   - **Models**: Low-poly chunks (Prodeus-style)
   - **Rotation**: Random tumbling

### Animation System

1. **Ship Animations**
   - **Idle**: Gentle bobbing motion (sine wave)
   - **Movement**: Forward thrust (engine glow)
   - **Combat**: Recoil on weapon fire
   - **Destroyed**: Spin + explosion sequence

2. **Building Animations**
   - **Construction**: Scaffold fade-in (per-turn progress)
   - **Active**: Blinking lights, rotating parts
   - **Destroyed**: Collapse + smoke

3. **UI Animations**
   - **Panel Transitions**: Slide + fade (300ms ease-out)
   - **Resource Update**: Number count-up (500ms)
   - **Alert**: Pulse glow (1s loop)

### Universal Render Pipeline (URP) Integration

**Render Pipeline:** Universal Render Pipeline (URP) 17.3.0+ (aligned with warzones project)

1. **URP Shader Graph Usage**
   - Particle systems use URP Lit/Unlit Particle shaders
   - Custom VFX shaders created using Shader Graph (not legacy shaders)
   - Supports URP rendering features: depth texture, color grading, bloom

2. **URP Post-Processing Stack**
   - All post-processing effects use URP Volume system
   - Volume profiles for different game states (Space, Combat, Victory)
   - Global Volume for base effects, local volumes for specific areas

3. **URP Renderer Features**
   - Forward rendering path (mobile-friendly)
   - HDR enabled for bloom and glow effects
   - MSAA (2x/4x) for anti-aliasing (PC only, FXAA on mobile)

### Post-Processing Effects (URP Volume System)

1. **Bloom** (Glow Effect)
   - **Intensity**: 0.5 (default)
   - **Threshold**: 1.0 (bright pixels only)
   - **Usage**: Laser beams, explosions, engines
   - **URP Component**: Bloom override in Volume profile

2. **Color Grading** (URP)
   - **Space**: Cool blue tint (Lift +10% blue)
   - **Combat**: Desaturated (-20% saturation) + high contrast
   - **Victory**: Warm golden tint (Lift +15% orange)
   - **URP Component**: Color Adjustments + Tonemapping overrides

3. **Vignette** (URP)
   - **Intensity**: 0.2 (subtle)
   - **Usage**: Focus attention on center
   - **URP Component**: Vignette override

### Performance Optimization

1. **Particle Pooling**
   - **Pre-instantiate**: 50 particle systems at start
   - **Reuse**: Reset and replay instead of destroying
   - **Cleanup**: Auto-destroy after 10 seconds idle

2. **LOD (Level of Detail)**
   - **Close**: Full particle count (100)
   - **Medium**: Half particle count (50)
   - **Far**: Quarter particle count (25)
   - **Culling**: Disable if off-screen

3. **Mobile Optimizations**
   - **Reduced Particles**: 50% particle count on mobile
   - **Simplified Shaders**: Mobile-optimized (no shadows)
   - **Disabled Post-Processing**: Bloom disabled on low-end devices

---

## Acceptance Criteria

### Functional Criteria

- [ ] Combat VFX play on laser fire, explosions, ship destruction
- [ ] UI VFX play on button clicks, panel transitions
- [ ] Environmental VFX visible in Galaxy View (space dust, stars)
- [ ] Particle systems pool and reuse correctly
- [ ] VFX scale with graphics quality settings
- [ ] Mobile VFX reduced for performance

### Performance Criteria

- [ ] VFX maintain 60 FPS on PC (1080p)
- [ ] VFX maintain 30 FPS on mobile
- [ ] Particle count adapts to device performance
- [ ] No memory leaks from VFX pooling

---

## Technical Notes

```csharp
public class VFXSystem : MonoBehaviour
{
    private static VFXSystem _instance;
    public static VFXSystem Instance => _instance;

    [Header("VFX Prefabs")]
    public GameObject explosionVFX;
    public GameObject laserVFX;
    public GameObject debrisVFX;

    private ObjectPool<ParticleSystem> _explosionPool;

    private void Awake()
    {
        _instance = this;
        InitializePools();
    }

    private void InitializePools()
    {
        _explosionPool = new ObjectPool<ParticleSystem>(
            () => Instantiate(explosionVFX).GetComponent<ParticleSystem>(),
            ps => ps.gameObject.SetActive(true),
            ps => ps.gameObject.SetActive(false),
            ps => Destroy(ps.gameObject),
            defaultCapacity: 50
        );
    }

    public void PlayExplosion(Vector3 position)
    {
        var ps = _explosionPool.Get();
        ps.transform.position = position;
        ps.Play();

        StartCoroutine(ReturnToPool(ps, 2f));
    }

    private IEnumerator ReturnToPool(ParticleSystem ps, float delay)
    {
        yield return new WaitForSeconds(delay);
        _explosionPool.Release(ps);
    }
}
```

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
