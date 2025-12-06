# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an archive repository for the classic game "Overlord" (also known as "Supremacy"), a strategy game from the late 1980s/early 1990s. The repository contains abandonware preservation files for historical/archival purposes.

## Repository Structure

- **C64-remake/** ⚠️ ARCHIVE - DO NOT EDIT
  - `Supremacy_aka_Overlord_+8D_[ExCeSs].crt`: C64 EasyFlash cartridge image (615KB)
  - `Supremacy.sid`: C64 music file by Jeroen Tel (PlaySID v2.2+ format)

- **MS-Dos/** ⚠️ ARCHIVE - DO NOT EDIT
  - `Overlord_DOS_EN/`: Extracted game files
    - `game.exe`: Main DOS executable (MZ format, 147KB)
    - `*.bin`, `*.gph`: Graphics data files for different video modes (CGA, EGA, MCGA, TGA)
    - `readme`: Original game instructions
  - `Overlord_DOS_EN.zip`: Compressed game archive
  - `Overlord_Manual_DOS_EN.pdf`: Original game manual

- **analysis/** - Decompilation analysis work
  - Working directory for decompilation analysis
  - Keep original archives untouched

- **design-docs/v1.0/** - Game remake design documentation
  - `executive-summary.md` - Project overview
  - `PRD-overlord.md` - Product Requirements Document
  - `afs/` - Atomic Feature Specifications (AFS-001 to AFS-100)
  - Following warzones project documentation standards

## Running the MS-DOS Version

The MS-DOS version uses command-line switches to configure graphics, input, and sound:

```
GAME [GRAPHICS] [INPUT] [SOUND]
```

**Graphics options:**
- `M` - MCGA
- `E` - EGA
- `T` - Tandy 16
- `C` - CGA

**Input options:**
- `M` - Mouse
- `K` - Keyboard

**Sound options:**
- `R` - Roland MT-32 or LAPC-1
- `A` - AdLib or SoundBlaster
- (omit for no sound)

**Examples:**
- `GAME M M R` - MCGA graphics, mouse input, Roland sound
- `GAME E K A` - EGA graphics, keyboard input, AdLib sound
- `GAME C K` - CGA graphics, keyboard input, no sound

**Note:** Commands must be in UPPER CASE when running from floppy disk.

## Important Context

This repository serves three purposes:

1. **Preservation:** Original game files in `C64-remake/` and `MS-Dos/` are archived and must never be modified
2. **Analysis:** Decompilation and reverse engineering work to understand the source code and game mechanics
3. **Remake Development:** Modern Unity-based remake with comprehensive design documentation in `design-docs/`

### Archive Protection Rules

- **NEVER modify files in `C64-remake/` or `MS-Dos/` directories**
- These directories are read-only preservation archives
- All analysis work should be done in separate directories (e.g., `analysis/`)
- Original binary integrity must be maintained

### Decompilation and Analysis

**Status:** ✅ **BOTH VERSIONS SUCCESSFULLY DECOMPILED!**

See **analysis/DECOMPILATION-SUCCESS.md** for complete details.

**Decompiled Code:**
- MS-DOS: `analysis/dos/game.exe.c` (88 KB, 2,272 lines)
- C64: `analysis/c64/bank_00_headless.c` (4.8 KB, entry point + loader)
- C64 ROM banks: `analysis/c64/extracted_rom/` (75 banks, 600 KB total)

**Tools Used:**
- Ghidra 11.4.3 (GUI for DOS, headless for C64)
- Custom Python scripts for automation
- Java 25 runtime

**Methodology:**
- Manual GUI analysis for MS-DOS (straightforward)
- Automated headless analysis for C64 (scripted)
- Original archives never modified ✓

**Documentation:**
- `DECOMPILATION-GUIDE.md` - Complete reference
- `GHIDRA-SETUP-GUIDE.md` - Step-by-step setup
- `analysis/DECOMPILATION-SUCCESS.md` - Results and findings

**Claude Code's capabilities demonstrated:**
- Automated Ghidra headless analysis
- ROM extraction scripting
- Complete workflow automation
- Can read, analyze, and document decompiled code
- Cannot directly decompile (uses Ghidra as a tool)

## Game Remake Project

**Status:** ✅ **DESIGN DOCUMENTATION IN PROGRESS**

The repository now includes comprehensive design documentation for a modern Unity-based remake of Overlord.

**Design Documentation:**
- `design-docs/v1.0/` - Complete design documentation
  - `executive-summary.md` - High-level project overview
  - `PRD-overlord.md` - Product Requirements Document (750+ lines)
  - `afs/` - Atomic Feature Specifications (~35 documents)
    - Core Systems (AFS-001 to AFS-010)
    - Galaxy Map (AFS-011 to AFS-020)
    - Economy (AFS-021 to AFS-030)
    - Entities (AFS-031 to AFS-040)
    - Combat (AFS-041 to AFS-050)
    - AI (AFS-051 to AFS-060)
    - Units & Buildings (AFS-061 to AFS-070)
    - UI/UX (AFS-071 to AFS-080)
    - Audio/Visual (AFS-081 to AFS-090)
    - Platform (AFS-091 to AFS-100)

**Remake Architecture:**
- Unity 2022 LTS game engine
- Turn-based 4X strategy gameplay
- Prodeus-style low-poly 3D graphics
- Cross-platform (PC, Mobile, Mac)
- Event-driven architecture with C# singletons
- ScriptableObjects for game data

**Key Game Systems:**
- Turn-based gameplay (Income → Action → Combat → End phases)
- Resource management (Credits, Minerals, Fuel, Food, Energy)
- Fleet combat and planetary invasion
- AI opponents with difficulty levels
- Building construction and technology upgrades
- Galaxy map with 3D visualization

See `design-docs/v1.0/executive-summary.md` for complete project overview.
