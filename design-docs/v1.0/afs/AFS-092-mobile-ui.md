# AFS-092: Mobile UI Adaptations

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-UI-009, FR-PLATFORM-002

---

## Summary

Mobile-specific user interface adaptations for touch input, responsive layouts, gesture controls, and performance optimizations ensuring seamless gameplay on iOS (iPhone/iPad) and Android devices with screen sizes ranging from 5" phones to 12" tablets.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Cross-platform state management
- **AFS-005 (Input System)**: Touch input abstraction
- **AFS-071-079 (All UI Screens)**: Desktop UI screens to adapt
- **AFS-091 (Platform Integration)**: Mobile platform features

---

## Requirements

### Mobile Platform Support (FR-PLATFORM-002)

#### 1. Supported Devices

**iOS Devices:**
- **Minimum:** iPhone 8 / iPad (5th Gen) running iOS 14+
- **Recommended:** iPhone 12 / iPad Pro running iOS 15+
- **Screen Sizes:** 4.7" (iPhone SE) to 12.9" (iPad Pro)
- **Aspect Ratios:** 16:9, 19.5:9, 4:3 (iPad)

**Android Devices:**
- **Minimum:** Android 10+ with 3GB RAM
- **Recommended:** Android 12+ with 4GB+ RAM
- **Screen Sizes:** 5.5" (small phones) to 12.4" (tablets)
- **Aspect Ratios:** 16:9, 18:9, 19:9, 20:9

**Performance Targets:**
- **Frame Rate:** 30 FPS minimum (60 FPS on high-end devices)
- **Memory:** <500MB RAM usage
- **Battery:** <10% drain per hour of gameplay
- **Storage:** <2GB installation size

#### 2. Touch Input Requirements (FR-UI-009)

**Touch Targets:**
- **Minimum Size:** 44×44 points (iOS), 48×48 dp (Android)
- **Spacing:** 8-point minimum gap between interactive elements
- **Hit Area Expansion:** Invisible padding around small targets

**Gesture Controls:**
- **Tap:** Select entities, press buttons, open menus
- **Double-Tap:** Quick actions (toggle building ON/OFF)
- **Long-Press:** Context menus, detailed info panels
- **Swipe:** Navigate between screens, scroll lists
- **Pinch:** Zoom galaxy map (2-finger pinch in/out)
- **Two-Finger Drag:** Pan galaxy map

**Visual Feedback:**
- **Tap Ripple:** Material Design ripple effect on button press
- **Highlight:** Selected items highlighted with border
- **Haptic Feedback:** Vibration on important actions (iOS/Android)

---

## Mobile UI Adaptations

### 1. Responsive Layout System

**Breakpoints:**
- **Small Phone:** <600px width (portrait)
- **Large Phone:** 600-900px width (landscape)
- **Tablet:** >900px width

**Layout Rules:**

**A. Small Phone (Portrait):**
- **Single Column:** All panels stack vertically
- **Full-Screen Dialogs:** Dialogs occupy entire screen
- **Bottom Navigation:** Navigation bar at bottom (thumb-reachable)
- **Collapsible Panels:** Sections collapse to save space
- **Example (Cargo Bay):**
  ```
  ┌─────────────────┐
  │ Header Bar      │ (Fixed top)
  ├─────────────────┤
  │ Docked Craft    │ (Scrollable)
  │ List            │
  ├─────────────────┤
  │ [Tap to expand  │ (Collapsed by default)
  │  Craft Details] │
  ├─────────────────┤
  │ [Tap to expand  │
  │  Resources]     │
  ├─────────────────┤
  │ Action Buttons  │ (Fixed bottom)
  └─────────────────┘
  ```

**B. Tablet (Landscape):**
- **Desktop-Like:** Multi-column layout similar to PC
- **Side-by-Side Panels:** Roster + Details + Resources
- **Floating Dialogs:** Dialogs centered, not full-screen
- **Persistent Navigation:** Always visible

**C. Safe Area Handling:**
- **iPhone Notch:** Content avoids notch/Dynamic Island
- **Android Cutouts:** Content avoids camera cutouts
- **Home Indicator:** Bottom buttons above iOS home indicator (34pt inset)

### 2. Galaxy Map Mobile Adaptations

**Touch Controls:**
- **Single Tap:** Select planet
- **Double-Tap:** Open Planet Surface screen
- **Pinch:** Zoom in/out (0.5× to 3× zoom)
- **Two-Finger Drag:** Pan camera (no mouse required)
- **Long-Press Planet:** Quick info popup (name, owner, resources)

**Mobile-Specific UI:**
- **Zoom Buttons:** +/− buttons in corner (alternative to pinch)
- **Center Button:** Re-center camera on player home planet (Starbase)
- **Planet Labels:** Scale with zoom (hidden when zoomed out <1×)
- **Craft Icons:** Larger (64×64) for easier tapping
- **HUD Simplification:** Reduced info density, key stats only

**Performance Optimizations:**
- **LOD (Level of Detail):** Lower poly models on mobile
- **Occlusion Culling:** Hide planets outside view frustum
- **Reduced Particle Effects:** Fewer particles in space background
- **30 FPS Target:** Cap frame rate to save battery

### 3. Navigation Screen Mobile

**Simplified Layout:**
```
┌─────────────────────────────────┐
│ Navigation: BC-01               │
├─────────────────────────────────┤
│ Current: Starbase               │
│ Destination: [Select Planet ▼] │
│                                 │
│ [Volcanic]  [Desert]  [Hitotsu] │
│  5 days     3 days     7 days   │
│                                 │
│ Fuel Required: 50 Fuel          │
│ Current Fuel: 180/200 ✓         │
│                                 │
│ [Launch Journey]                │
└─────────────────────────────────┘
```

**Touch Optimizations:**
- **Large Planet Buttons:** 120×100 touch targets for destination selection
- **Swipe to Select Craft:** Swipe left/right through docked craft list
- **Fuel Gauge:** Large visual gauge (not just numbers)
- **Journey Confirmation:** Full-screen dialog with large "Confirm" button

### 4. Platoon Management Mobile

**Collapsed View (Default):**
```
┌─────────────────────────────────┐
│ Platoons (8/24)                 │
├─────────────────────────────────┤
│ ▼ Platoon 01 (150 troops)      │
│   100% trained | Starbase       │
│                                 │
│ ▼ Platoon 02 (200 troops)      │
│   95% trained | BC-01           │
│                                 │
│ ▼ Platoon 03 (175 troops)      │
│   100% trained | Starbase       │
│                                 │
│ [+ Commission New Platoon]      │
└─────────────────────────────────┘
```

**Expanded View (Tap to Expand):**
```
┌─────────────────────────────────┐
│ ▲ Platoon 01 (150 troops)      │
├─────────────────────────────────┤
│ Training: 100% ████████████     │
│ Equipment: Level 2              │
│ Weapons: Level 3                │
│ Combat Strength: 675            │
│                                 │
│ [Upgrade Equipment] [Assign]    │
└─────────────────────────────────┘
```

**Mobile-Specific Features:**
- **Accordion Expansion:** Tap platoon to expand/collapse details
- **Swipe Actions:** Swipe left to reveal Decommission, right for Assign
- **Quick Upgrade Button:** One-tap to upgrade (no confirmation for small actions)
- **Bottom Sheet Dialogs:** Commission dialog slides up from bottom

### 5. Cargo Bay Mobile

**Tabbed Interface:**
```
┌─────────────────────────────────┐
│ [Docked] [Cargo] [Crew] [Fuel] │ (Tabs)
├─────────────────────────────────┤
│ BC-01 (Battle Cruiser)          │
│   3/4 platoons                  │
│   Crew: 20/20 ✓                 │
│   Fuel: 180/200 ⚠               │
│                                 │
│ CC-01 (Cargo Cruiser)           │
│   2,500 cargo                   │
│   Crew: 15/15 ✓                 │
│   Fuel: 200/200 ✓               │
│                                 │
│ [Launch Selected]               │
└─────────────────────────────────┘
```

**Cargo Tab:**
```
┌─────────────────────────────────┐
│ [Docked] [Cargo] [Crew] [Fuel] │
├─────────────────────────────────┤
│ CC-01 Cargo Hold (2,500/4,000)  │
│                                 │
│ Food:     ████████░░ 1,000      │
│           [−100] [+100]         │
│                                 │
│ Minerals: ████░░░░░░ 500        │
│           [−100] [+100]         │
│                                 │
│ [Load Selected] [Unload All]    │
└─────────────────────────────────┘
```

**Mobile Optimizations:**
- **Tabbed Sections:** Separate tabs instead of side-by-side panels
- **Large +/− Buttons:** 60×60 touch targets for resource adjustment
- **Preset Amounts:** Buttons for +100, +500, +1000 (faster than slider)
- **Long-Press +/−:** Hold to continuously increment/decrement

### 6. Planet Surface Mobile

**Simplified 2D Grid:**
```
┌─────────────────────────────────┐
│ Planet: Starbase (Metropolis)   │
├─────────────────────────────────┤
│ ┌─────┬─────┬─────┐             │
│ │[1]  │[2]  │[3]  │             │
│ │MINE │HORT │SOLAR│             │
│ │⚡   │⚡   │⚡   │             │
│ └─────┴─────┴─────┘             │
│ ┌─────┬─────┬─────┐             │
│ │[4]  │[5]  │[6]  │             │
│ │EMPTY│LAB  │FACT │             │
│ │⚪   │🔬   │🏭   │             │
│ └─────┴─────┴─────┘             │
│                                 │
│ [Tap platform to manage]        │
└─────────────────────────────────┘
```

**Selected Platform:**
```
┌─────────────────────────────────┐
│ Platform 1: Mining Station      │
├─────────────────────────────────┤
│ Status: ⚡ Active                │
│ Output: +150 Minerals, +75 Fuel │
│ Crew: 10 (-5 Food/turn)         │
│                                 │
│ [Toggle OFF] [Demolish]         │
│                                 │
│ [Close]                         │
└─────────────────────────────────┘
```

**Mobile Features:**
- **2D Grid View:** Flat 2×3 grid instead of 3D planet (performance)
- **Toggle 3D/2D:** Button to switch between views (default 2D)
- **Bottom Sheet Details:** Platform details slide up from bottom
- **Large Platform Buttons:** 100×100 touch targets
- **Icon-Based:** Emoji/icons for building types (language-independent)

### 7. Combat Control Mobile

**Simplified Layout:**
```
┌─────────────────────────────────┐
│ PLANETARY ASSAULT: Hitotsu      │
│ Turn: 3/10                      │
├─────────────────────────────────┤
│ Player:  450 troops | 1,350 STR │
│ Enemy:   350 troops | 1,050 STR │
│ Advantage: +28% PLAYER          │
├─────────────────────────────────┤
│       ⚔️ BATTLE ⚔️              │
│                                 │
│   Player: ████████░░ 80%        │
│   Enemy:  ██████░░░░ 60%        │
│                                 │
│   Casualties:                   │
│   Player: -20 | Enemy: -80      │
├─────────────────────────────────┤
│ ○ Continue  ○ Bombard  ○ Retreat│
│                                 │
│ [Execute Action]                │
├─────────────────────────────────┤
│ 📜 Combat Log (Tap to expand)   │
└─────────────────────────────────┘
```

**Mobile Optimizations:**
- **Stacked Layout:** Single column, combat viz + actions below
- **Simplified Visualization:** Static health bars instead of animations (performance)
- **Collapsible Log:** Combat log hidden by default, tap to expand
- **Large Action Buttons:** Radio buttons replaced with 3 large (120×60) buttons
- **Auto-Resolve Option:** "Skip Animation" button for faster combat

### 8. Buy Screen Mobile

**Card-Based Layout:**
```
┌─────────────────────────────────┐
│ Buy Screen                      │
├─────────────────────────────────┤
│ ┌───────────────────────────┐   │
│ │ Battle Cruiser            │   │
│ │ 150,000 Credits           │   │
│ │ 5 turns build time        │   │
│ │                           │   │
│ │ [Purchase]                │   │
│ └───────────────────────────┘   │
│ ┌───────────────────────────┐   │
│ │ Cargo Cruiser             │   │
│ │ 100,000 Credits           │   │
│ │ 3 turns build time        │   │
│ │                           │   │
│ │ [Purchase]                │   │
│ └───────────────────────────┘   │
│ (Scroll for more...)            │
└─────────────────────────────────┘
```

**Mobile Features:**
- **Vertical Cards:** One item per card, scroll vertically
- **Large Images:** Craft/building preview images (256×256)
- **Tap Card to Expand:** Show full details in bottom sheet
- **Quick Purchase:** Tap [Purchase] directly from card
- **Filter Chips:** "Craft" "Buildings" "Upgrades" filter buttons at top

---

## Acceptance Criteria

### Device Support Criteria

- [ ] Game runs on iPhone 8+ (iOS 14+) and iPad (5th Gen+)
- [ ] Game runs on Android 10+ devices with 3GB+ RAM
- [ ] 30 FPS minimum on all supported devices
- [ ] <500MB RAM usage on mobile
- [ ] <2GB installation size

### Touch Input Criteria

- [ ] All interactive elements ≥44×44 points (iOS) / 48×48 dp (Android)
- [ ] Tap gesture selects entities, opens menus
- [ ] Long-press gesture displays context menus
- [ ] Pinch gesture zooms galaxy map (0.5×-3× range)
- [ ] Two-finger drag pans galaxy map
- [ ] Haptic feedback on important actions (iOS/Android)
- [ ] Ripple effect on button taps

### Responsive Layout Criteria

- [ ] Panels stack vertically on screens <600px width
- [ ] Multi-column layout on tablets >900px width
- [ ] Dialogs full-screen on phones, floating on tablets
- [ ] Content avoids notch/cutout areas (safe area insets)
- [ ] Bottom navigation bar above iOS home indicator (34pt inset)

### Screen-Specific Criteria

- [ ] Galaxy Map: Pinch-zoom, two-finger pan, zoom buttons, center button
- [ ] Navigation: Large planet buttons (120×100), swipe to select craft
- [ ] Platoon Mgmt: Accordion expansion, swipe actions, bottom sheet dialogs
- [ ] Cargo Bay: Tabbed interface, large +/− buttons (60×60), preset amounts
- [ ] Planet Surface: 2D grid view, 100×100 platform buttons, bottom sheet details
- [ ] Combat: Stacked layout, collapsible log, auto-resolve option
- [ ] Buy Screen: Vertical card layout, tap to expand, filter chips

### Performance Criteria

- [ ] Galaxy Map renders at 30+ FPS
- [ ] UI transitions <200ms
- [ ] Touch response <100ms (tap to visual feedback)
- [ ] Battery drain <10% per hour

---

## Implementation Notes

### Responsive UI Manager

**Screen Size Detection:**
```csharp
enum DeviceType {
    SmallPhone,    // <600px
    LargePhone,    // 600-900px
    Tablet         // >900px
}

class ResponsiveUIManager : MonoBehaviour {
    DeviceType currentDeviceType;

    void Start() {
        DetectDeviceType();
        ApplyLayout();
    }

    void DetectDeviceType() {
        int width = Screen.width;

        if (width < 600) {
            currentDeviceType = DeviceType.SmallPhone;
        } else if (width < 900) {
            currentDeviceType = DeviceType.LargePhone;
        } else {
            currentDeviceType = DeviceType.Tablet;
        }
    }

    void ApplyLayout() {
        if (currentDeviceType == DeviceType.SmallPhone) {
            // Stack panels vertically
            SetLayoutMode(LayoutMode.SingleColumn);
            EnableCollapsiblePanels(true);
            UseFullScreenDialogs(true);
        } else if (currentDeviceType == DeviceType.Tablet) {
            // Desktop-like layout
            SetLayoutMode(LayoutMode.MultiColumn);
            EnableCollapsiblePanels(false);
            UseFullScreenDialogs(false);
        }
    }
}
```

### Touch Input Handling

**Gesture Recognition:**
```csharp
class TouchInputManager : MonoBehaviour {
    Vector2 touchStartPos;
    float touchStartTime;

    void Update() {
        if (Input.touchCount == 1) {
            Touch touch = Input.GetTouch(0);

            if (touch.phase == TouchPhase.Began) {
                touchStartPos = touch.position;
                touchStartTime = Time.time;
            } else if (touch.phase == TouchPhase.Ended) {
                float touchDuration = Time.time - touchStartTime;
                float touchDistance = Vector2.Distance(touch.position, touchStartPos);

                if (touchDuration < 0.3f && touchDistance < 50f) {
                    // Tap
                    OnTap(touch.position);
                } else if (touchDuration > 0.5f && touchDistance < 50f) {
                    // Long-press
                    OnLongPress(touch.position);
                }
            }
        } else if (Input.touchCount == 2) {
            // Pinch-to-zoom
            Touch touch0 = Input.GetTouch(0);
            Touch touch1 = Input.GetTouch(1);

            if (touch0.phase == TouchPhase.Moved || touch1.phase == TouchPhase.Moved) {
                float prevDistance = Vector2.Distance(
                    touch0.position - touch0.deltaPosition,
                    touch1.position - touch1.deltaPosition
                );
                float currentDistance = Vector2.Distance(touch0.position, touch1.position);

                float deltaDistance = currentDistance - prevDistance;
                OnPinch(deltaDistance);
            }
        }
    }

    void OnTap(Vector2 position) {
        // Tap action
        HapticFeedback.LightImpact();
    }

    void OnLongPress(Vector2 position) {
        // Long-press action
        HapticFeedback.MediumImpact();
    }

    void OnPinch(float deltaDistance) {
        // Zoom galaxy map
        GalaxyCamera.Zoom(deltaDistance * 0.01f);
    }
}
```

### Safe Area Insets

**Handle Notch/Cutouts:**
```csharp
class SafeAreaHandler : MonoBehaviour {
    RectTransform panel;

    void Start() {
        panel = GetComponent<RectTransform>();
        ApplySafeArea();
    }

    void ApplySafeArea() {
        Rect safeArea = Screen.safeArea;

        Vector2 anchorMin = safeArea.position;
        Vector2 anchorMax = safeArea.position + safeArea.size;

        anchorMin.x /= Screen.width;
        anchorMin.y /= Screen.height;
        anchorMax.x /= Screen.width;
        anchorMax.y /= Screen.height;

        panel.anchorMin = anchorMin;
        panel.anchorMax = anchorMax;
    }
}
```

### Performance Optimizations

**Mobile-Specific Settings:**
```csharp
void ConfigureMobileSettings() {
    // Target 30 FPS
    Application.targetFrameRate = 30;

    // Reduce quality
    QualitySettings.SetQualityLevel(1);  // Low-Medium quality

    // Disable shadows on mobile
    if (Application.isMobilePlatform) {
        QualitySettings.shadows = ShadowQuality.Disable;
    }

    // Reduce particle count
    ParticleSystem[] particles = FindObjectsOfType<ParticleSystem>();
    foreach (var ps in particles) {
        ps.maxParticles = Mathf.RoundToInt(ps.maxParticles * 0.5f);
    }
}
```

---

## Testing Scenarios

### Device Tests

1. **iPhone SE (Small Screen):**
   - Given 4.7" screen (1334×750)
   - When game launches
   - Then single-column layout, full-screen dialogs, bottom navigation

2. **iPad Pro (Tablet):**
   - Given 12.9" screen (2732×2048)
   - When game launches
   - Then multi-column layout, floating dialogs, persistent navigation

3. **Android Notch Handling:**
   - Given device with camera notch
   - When game displays
   - Then content avoids notch area, no UI elements hidden

### Touch Input Tests

1. **Tap Selection:**
   - Given Galaxy Map open
   - When player taps planet
   - Then planet selected, details displayed

2. **Pinch Zoom:**
   - Given Galaxy Map at 1× zoom
   - When player pinches out (two fingers apart)
   - Then map zooms to 2×, planet details remain readable

3. **Long-Press Context Menu:**
   - Given platoon in roster
   - When player long-presses platoon entry
   - Then context menu displays (Upgrade, Decommission, Assign)

### Performance Tests

1. **Frame Rate:**
   - Given game running on iPhone 8
   - When Galaxy Map displayed with 6 planets, 32 craft
   - Then frame rate ≥30 FPS

2. **Battery Drain:**
   - Given 1 hour gameplay session
   - When game active continuously
   - Then battery drain <10%

---

## Future Enhancements

**Advanced Mobile Features:**
- Tablet-specific UI (split-screen, keyboard support)
- Apple Pencil support (drawing routes, annotations)
- Android stylus support
- Landscape-only mode for phones (force rotation)

**Accessibility:**
- Voice commands (iOS Siri, Android Google Assistant)
- Screen reader support (VoiceOver, TalkBack)
- High contrast mode
- Enlarged text option (200% scale)

**Cloud Integration:**
- iCloud save sync (iOS)
- Google Play Games save sync (Android)
- Cross-device play (start on iPad, continue on iPhone)

---

**Document Owner:** Lead Developer
**Review Status:** Awaiting Review
**Related AFS:** AFS-005 (Input System), AFS-071-079 (All UI Screens), AFS-091 (Platform Integration)
