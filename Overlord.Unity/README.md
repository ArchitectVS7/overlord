# Overlord.Unity

Unity 6 game client for Overlord v1.0.

## Requirements

- Unity 6000.3.0f1 or later
- .NET 8.0 SDK (for Overlord.Core library)

## Opening the Project

1. Open Unity Hub
2. Click "Add" → "Add project from disk"
3. Navigate to `C:\dev\GIT\Overlord\Overlord.Unity`
4. Select the folder and click "Add Project"
5. Unity will import all packages and set up the project

## Project Structure

```
Overlord.Unity/
├── Assets/
│   ├── Scenes/          # Unity scenes (Main Menu, Galaxy View, Planet View)
│   ├── Scripts/         # C# scripts (wrappers for Overlord.Core)
│   │   ├── Core/        # References to Overlord.Core DLL
│   │   ├── UI/          # UI controllers
│   │   ├── Rendering/   # 3D rendering logic
│   │   └── Input/       # Input handling
│   ├── Prefabs/         # Reusable game objects
│   ├── Materials/       # Shaders and materials
│   ├── Models/          # 3D models (.fbx, .obj)
│   └── Audio/           # Sound effects and music
├── ProjectSettings/     # Unity project settings
└── Packages/            # Package dependencies (URP, Input System, etc.)
```

## Dependencies

This project depends on **Overlord.Core** (.NET 8.0 class library) for all game logic.

To reference Overlord.Core:
1. Build the Overlord.Core project: `dotnet build Overlord.Core/Overlord.Core/Overlord.Core.csproj`
2. Copy `Overlord.Core.dll` to `Assets/Plugins/Overlord.Core/`
3. Unity will automatically detect and reference the DLL

## Next Steps

1. **Set up Core DLL reference** (see above)
2. **Create initial scene** (Main Menu or Galaxy View)
3. **Implement GameManager** singleton to interface with Overlord.Core
4. **Set up URP Renderer** for low-poly 3D graphics
5. **Implement input handlers** using Unity's New Input System

## Architecture

Overlord uses a **platform-agnostic architecture**:

- **Overlord.Core**: All game logic (turns, combat, AI, resources) - platform-independent
- **Overlord.Unity**: Rendering, input, UI, audio - Unity-specific

Unity scripts act as **thin wrappers** that call into Overlord.Core and render the results.

## Conventions

- Use **C# 12** features (.NET 8.0 compatible with Unity 6)
- Follow Unity's **component-based architecture**
- Keep Unity scripts **lightweight** - delegate logic to Overlord.Core
- Use **TextMeshPro** for all UI text
- Use **Universal Render Pipeline (URP)** for rendering
- Use **New Input System** for cross-platform input

## Build Targets

- PC (Windows/Mac/Linux) - Primary target
- Mobile (Android/iOS) - Secondary target
- WebGL - Stretch goal

---

**Status:** ⚠️ Project created, awaiting initial setup
**Version:** Unity 6000.3.0f1
**Created:** December 6, 2025
