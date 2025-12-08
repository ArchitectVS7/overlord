# AFS-091: Platform Support

**Status:** Updated (Post Design Review)
**Priority:** P1 (High)
**Owner:** Lead Developer
**PRD Reference:** FR-PLATFORM-001
**Design Review:** Updated to specify Unity 6000 LTS baseline (aligned with warzones project)

---

## Summary

Cross-platform support system implementing platform-specific optimizations, input handling, screen resolutions, and build configurations for PC (Windows, Mac, Linux), Mobile (iOS, Android), ensuring consistent gameplay experience across all target platforms.

**Engine Baseline:** Unity 6000 LTS with Universal Render Pipeline (URP) 17.3.0+ (aligned with company warzones project)

---

## Dependencies

- **AFS-005 (Input System)**: Cross-platform input
- **AFS-004 (Settings Manager)**: Platform-specific settings
- **AFS-071 (UI State Machine)**: Responsive UI layouts

---

## Requirements

### Supported Platforms

1. **PC (Primary Platform)**
   - **Windows**: Windows 10/11 (64-bit)
   - **Mac**: macOS 10.15+ (Intel and Apple Silicon)
   - **Linux**: Ubuntu 20.04+ (64-bit)
   - **Input**: Mouse + Keyboard, Gamepad (optional)
   - **Resolution**: 1920×1080 minimum, 4K supported

2. **Mobile (Secondary Platform)**
   - **iOS**: iPhone 8+ / iPad (iOS 14+)
   - **Android**: Android 8.0+ (API Level 26+)
   - **Input**: Touch (tap, swipe, pinch, drag)
   - **Resolution**: 720p minimum, supports various aspect ratios

3. **Console (Post-MVP)**
   - **Xbox**: Series X/S, One
   - **PlayStation**: PS5, PS4
   - **Nintendo Switch**
   - **Input**: Gamepad only

### Platform-Specific Features

1. **PC Platform**
   - **Graphics Quality**: Low, Medium, High, Ultra settings
   - **Resolution**: Windowed, Borderless, Fullscreen modes
   - **Frame Rate**: Unlocked (up to 144 FPS)
   - **Input**: Mouse precision, keyboard hotkeys
   - **Save Location**: Documents/My Games/Overlord/
   - **Cloud Save**: Steam Cloud, Epic Cloud (future)

2. **Mobile Platform**
   - **Graphics Quality**: Auto-adjust based on device performance
   - **Resolution**: Adaptive to device screen
   - **Frame Rate**: Locked at 30 FPS (battery optimization)
   - **Input**: Touch-optimized UI (larger buttons)
   - **Save Location**: App persistent data directory
   - **Cloud Save**: iCloud (iOS), Google Play Games (Android)

3. **Performance Targets**
   - **PC**: 60 FPS @ 1080p on mid-range GPU (GTX 1060 equivalent)
   - **Mobile**: 30 FPS on iPhone 8 / Galaxy S8 equivalent
   - **Loading Times**: < 5 seconds on SSD, < 15 seconds on HDD

### Input Handling

1. **PC Input**
   - **Mouse**: Click, drag, scroll for camera control
   - **Keyboard**: Hotkeys (Space = End Turn, ESC = Menu, F1 = Log)
   - **Gamepad**: Xbox/PlayStation controller support (optional)
   - **Cursor**: Custom cursor (crosshair for combat, pointer for UI)

2. **Mobile Input**
   - **Tap**: Select planet, tap building, tap button
   - **Swipe**: Pan camera (Galaxy View)
   - **Pinch**: Zoom in/out (Galaxy View)
   - **Long Press**: Show tooltip/context menu
   - **Two-Finger Rotation**: Rotate planet (Planet Management)

3. **Input Abstraction**
   - **Unity Input System**: New Input System package (not legacy)
   - **Action Mapping**: Abstract actions (Select, Cancel, Menu, EndTurn)
   - **Device Detection**: Auto-detect controller connection/disconnection
   - **Rebinding**: Allow players to rebind keys (PC only)

### Screen Resolutions & UI Scaling

1. **PC Resolutions**
   - **Minimum**: 1280×720 (720p)
   - **Recommended**: 1920×1080 (1080p)
   - **Supported**: 2560×1440 (1440p), 3840×2160 (4K)
   - **Aspect Ratios**: 16:9 (primary), 16:10, 21:9 (ultrawide)

2. **Mobile Resolutions**
   - **iPhone**: 1334×750 to 2778×1284 (various notches)
   - **iPad**: 2048×1536 to 2732×2048
   - **Android**: 720p to 1440p (wide variety)
   - **Aspect Ratios**: 16:9, 18:9, 19.5:9, 4:3 (tablets)

3. **UI Scaling**
   - **Canvas Scaler**: Scale with screen size (reference 1920×1080)
   - **Safe Area**: Respect notches and rounded corners (mobile)
   - **Dynamic Layout**: Responsive UI adapts to aspect ratio
   - **Text Scaling**: Minimum 12pt font size on all devices

### Graphics Settings

1. **PC Graphics Options**
   - **Resolution**: Dropdown (720p, 1080p, 1440p, 4K)
   - **Window Mode**: Fullscreen, Borderless, Windowed
   - **Quality Preset**: Low, Medium, High, Ultra
   - **Anti-Aliasing**: Off, FXAA, MSAA 2×/4×/8×
   - **Shadow Quality**: Off, Low, Medium, High
   - **Texture Quality**: Low, Medium, High
   - **VSync**: On/Off

2. **Mobile Graphics Options**
   - **Auto Quality**: Adjusts based on device performance
   - **Battery Saver**: Reduces FPS to 30, lowers quality
   - **Performance Mode**: Prioritizes frame rate over visuals
   - **Balanced Mode**: Default (30 FPS, medium quality)

3. **Quality Levels** (Unity Quality Settings)
   - **Low**: Minimal shadows, low texture resolution, 30 FPS
   - **Medium**: Simple shadows, medium textures, 60 FPS
   - **High**: Full shadows, high textures, 60 FPS
   - **Ultra**: Max shadows, max textures, unlocked FPS (PC only)

### Platform-Specific Optimizations

1. **PC Optimizations**
   - **Multithreading**: Leverage multi-core CPUs for AI calculations
   - **High-Res Textures**: 2K/4K textures for high-end GPUs
   - **Shader Quality**: Advanced shaders (PBR, real-time reflections)
   - **Draw Distance**: Increased view distance in Galaxy View

2. **Mobile Optimizations**
   - **Texture Compression**: ASTC (Android), PVRTC (iOS)
   - **Batching**: Static/dynamic batching for draw call reduction
   - **LOD**: Level-of-detail models for planets and ships
   - **Culling**: Frustum culling, occlusion culling
   - **Simplified Shaders**: Mobile-optimized shaders (fewer calculations)

3. **Memory Management**
   - **PC**: No hard limit (typically 4-8GB available)
   - **Mobile**: Strict limit (1-2GB on low-end devices)
   - **Asset Streaming**: Load/unload assets dynamically (mobile)
   - **Texture Pooling**: Reuse texture memory

### Build Configurations

1. **PC Build**
   - **Platform**: Windows (x64), Mac (Universal), Linux (x64)
   - **Graphics API**: DirectX 11/12 (Windows), Metal (Mac), Vulkan (Linux)
   - **Executable**: Overlord.exe (Windows), Overlord.app (Mac), Overlord.x86_64 (Linux)
   - **Distribution**: Steam, Epic Games Store, Itch.io

2. **Mobile Build**
   - **Platform**: iOS (arm64), Android (arm64-v8a, armeabi-v7a)
   - **Graphics API**: Metal (iOS), Vulkan/OpenGL ES 3.0 (Android)
   - **App Bundle**: .ipa (iOS), .aab (Android App Bundle)
   - **Distribution**: App Store, Google Play Store

3. **Build Pipeline**
   - **CI/CD**: Unity Cloud Build or Jenkins
   - **Automated Testing**: Unit tests, integration tests
   - **Version Control**: Git (GitHub)
   - **Versioning**: Semantic versioning (e.g., v1.0.0)

---

## Acceptance Criteria

### Functional Criteria

- [ ] Game runs on Windows, Mac, Linux (PC)
- [ ] Game runs on iOS and Android (Mobile)
- [ ] Input works correctly on all platforms (mouse, touch, gamepad)
- [ ] UI scales correctly across resolutions (720p to 4K)
- [ ] Graphics quality settings apply correctly on PC
- [ ] Mobile auto-adjusts quality based on device performance
- [ ] Safe area respected on notched devices (iPhone X+)
- [ ] Cloud save supported on PC (Steam) and Mobile (iCloud/Google Play)

### Performance Criteria

- [ ] PC: 60 FPS @ 1080p on GTX 1060 equivalent
- [ ] Mobile: 30 FPS on iPhone 8 / Galaxy S8 equivalent
- [ ] Loading times: <5 seconds on SSD, <15 seconds on HDD
- [ ] Memory usage: <2GB on mobile, <4GB on PC
- [ ] No crashes on any supported platform

### Integration Criteria

- [ ] Integrates with Input System (AFS-005) for cross-platform input
- [ ] Uses Settings Manager (AFS-004) for platform-specific settings
- [ ] UI adapts via UI State Machine (AFS-071)

---

## Technical Notes

### Implementation Approach

```csharp
public enum Platform
{
    PC,
    Mobile,
    Console
}

public enum PlatformType
{
    Windows,
    Mac,
    Linux,
    iOS,
    Android,
    XboxOne,
    PS4,
    Switch
}

public class PlatformManager : MonoBehaviour
{
    private static PlatformManager _instance;
    public static PlatformManager Instance => _instance;

    public Platform CurrentPlatform { get; private set; }
    public PlatformType CurrentPlatformType { get; private set; }

    private void Awake()
    {
        _instance = this;
        DetectPlatform();
        ApplyPlatformSettings();
    }

    private void DetectPlatform()
    {
#if UNITY_STANDALONE_WIN
        CurrentPlatform = Platform.PC;
        CurrentPlatformType = PlatformType.Windows;
#elif UNITY_STANDALONE_OSX
        CurrentPlatform = Platform.PC;
        CurrentPlatformType = PlatformType.Mac;
#elif UNITY_STANDALONE_LINUX
        CurrentPlatform = Platform.PC;
        CurrentPlatformType = PlatformType.Linux;
#elif UNITY_IOS
        CurrentPlatform = Platform.Mobile;
        CurrentPlatformType = PlatformType.iOS;
#elif UNITY_ANDROID
        CurrentPlatform = Platform.Mobile;
        CurrentPlatformType = PlatformType.Android;
#endif

        Debug.Log($"Platform detected: {CurrentPlatformType} ({CurrentPlatform})");
    }

    private void ApplyPlatformSettings()
    {
        switch (CurrentPlatform)
        {
            case Platform.PC:
                ApplyPCSettings();
                break;
            case Platform.Mobile:
                ApplyMobileSettings();
                break;
        }
    }

    private void ApplyPCSettings()
    {
        // Set default quality level
        QualitySettings.SetQualityLevel(2); // High quality

        // Unlock frame rate
        Application.targetFrameRate = -1; // Unlocked

        // Enable VSync (default)
        QualitySettings.vSyncCount = 1;

        Debug.Log("PC settings applied");
    }

    private void ApplyMobileSettings()
    {
        // Set mobile quality level
        QualitySettings.SetQualityLevel(0); // Low quality (mobile-optimized)

        // Lock frame rate for battery saving
        Application.targetFrameRate = 30;

        // Disable VSync (mobile uses fixed FPS)
        QualitySettings.vSyncCount = 0;

        // Enable texture compression
        EnableMobileTextureCompression();

        // Respect safe area (notches)
        ApplySafeArea();

        Debug.Log("Mobile settings applied");
    }

    private void EnableMobileTextureCompression()
    {
#if UNITY_ANDROID
        // ASTC compression (Android)
        // Configured in Unity build settings
#elif UNITY_IOS
        // PVRTC compression (iOS)
        // Configured in Unity build settings
#endif
    }

    private void ApplySafeArea()
    {
        // Get device safe area (excludes notches)
        Rect safeArea = Screen.safeArea;

        // Apply to Canvas
        var canvas = FindObjectOfType<Canvas>();
        if (canvas != null)
        {
            var rectTransform = canvas.GetComponent<RectTransform>();
            rectTransform.anchorMin = safeArea.position;
            rectTransform.anchorMax = safeArea.position + safeArea.size;
        }

        Debug.Log($"Safe area applied: {safeArea}");
    }

    public bool IsMobile()
    {
        return CurrentPlatform == Platform.Mobile;
    }

    public bool IsPC()
    {
        return CurrentPlatform == Platform.PC;
    }

    public bool IsTouchDevice()
    {
        return IsMobile() || Input.touchSupported;
    }
}
```

### Platform Detection Examples

```csharp
// Example: Adjust UI button size based on platform
if (PlatformManager.Instance.IsMobile())
{
    buttonSize = 80; // Larger buttons for touch
}
else
{
    buttonSize = 50; // Normal size for mouse
}

// Example: Enable gamepad support only on PC
if (PlatformManager.Instance.IsPC())
{
    InputSystem.EnableDevice(Gamepad.current);
}

// Example: Use different save path for each platform
string savePath = PlatformManager.Instance.IsPC()
    ? Application.persistentDataPath + "/saves/"
    : Application.persistentDataPath + "/";
```

---

## Integration Points

### Depends On
- **AFS-005 (Input System)**: Cross-platform input handling
- **AFS-004 (Settings Manager)**: Platform-specific settings

### Depended On By
- **All Systems**: Platform-specific behavior
- **AFS-071 (UI State Machine)**: Responsive UI
- **AFS-081 (Audio System)**: Platform audio optimizations

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
