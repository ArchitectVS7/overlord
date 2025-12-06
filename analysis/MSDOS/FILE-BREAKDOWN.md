# MS-DOS File Breakdown

## Overview

The MS-DOS version consists of 36 files total. Here's what each type contains:

---

## Executable Code Files (DECOMPILE THESE)

### 1. **game.exe** (147 KB) - PRIORITY 1
- **Type:** MS-DOS MZ executable
- **Contains:** Main game logic, AI, game rules, file loading code
- **This is the "brain" of the game**
- **Decompile in Ghidra:** YES - this is what you want to understand!

### 2. **install.com** (3.9 KB) - OPTIONAL
- **Type:** MS-DOS COM executable
- **Contains:** Installation/setup program
- **Less interesting** unless you want to see how it configured the game
- **Decompile in Ghidra:** Optional, lower priority

---

## Graphics Data Files (DATA, NOT CODE)

These are **NOT executable code** - they're pure graphics data loaded by game.exe.

### File Naming Pattern:
`[VIDEO_MODE][SCREEN_TYPE].bin` + `[VIDEO_MODE][SCREEN_TYPE].gph`

### Video Modes (4 total):
- **cga** - CGA (4 colors, 320x200)
- **ega** - EGA (16 colors, 320x200)
- **mcg** - MCGA (256 colors, 320x200)
- **tga** - Tandy Graphics Adapter (16 colors)

### Screen Types (4 per mode):
- **(no suffix)** - Main game graphics (largest files)
- **dth** - Death/game over screen
- **in** - Intro/title screen
- **win** - Victory/win screen

### File Extensions:
- **.bin** - Binary graphics data (pixel/bitmap data)
- **.gph** - Graphics header/palette/metadata

### Examples:
- `cga.bin` (115 KB) - CGA main game graphics
- `cga.gph` (4.2 KB) - CGA palette/header info
- `egain.bin` (45 KB) - EGA intro screen graphics
- `mcgwin.gph` (264 bytes) - MCGA victory screen metadata

---

## How to Analyze Each Type

### For game.exe (THE MAIN TARGET):

1. **Import into Ghidra**
   - File → Import File
   - Select: `MS-Dos/Overlord_DOS_EN/game.exe`
   - Format: MS-DOS Executable (auto-detected)
   - Click OK

2. **Analyze**
   - Double-click game.exe in project
   - Click "Yes" to analyze
   - Wait 1-2 minutes

3. **Explore the decompiled code**
   - Look for main() function
   - Find graphics loading routines (will reference .bin/.gph filenames)
   - Find game logic, AI code, etc.
   - Press F5 on any function to see C-like pseudocode

### For Graphics Data Files (.bin/.gph):

**Option A: Understand the format from game.exe code**
- The BEST way is to decompile game.exe
- Find the functions that LOAD these files
- The loading code will tell you the exact data format
- This is detective work - finding code like:
  ```c
  load_graphics("cga.bin", "cga.gph");
  ```

**Option B: Import raw data into Ghidra (advanced)**
- Import as "Raw Binary"
- Try to reverse engineer the data structure
- Much harder without knowing the format

**Option C: Use graphics extraction tools**
- Search for DOS graphics tools online
- Many old games have specific format extractors
- Community may have already figured out the format

**Recommendation:** Focus on game.exe first. Once you understand the loading code, the data file format will become clear.

---

## Analysis Priority

### Must Decompile:
1. ✅ **game.exe** - Start here! This contains all the game logic.

### Optional:
2. **install.com** - Only if curious about the installer
3. **Graphics data** - Analyze AFTER understanding game.exe's loading code

---

## What You'll Learn from game.exe

By decompiling game.exe, you'll discover:

- **Game logic:** How turns work, combat calculations, AI decisions
- **Graphics system:** How it loads and displays .bin/.gph files
- **Input handling:** Keyboard and mouse code
- **Sound system:** How it talks to AdLib/Roland hardware
- **File I/O:** How all the data files are structured and loaded
- **Memory management:** How it uses DOS memory
- **Main game loop:** The core "tick" of the game

The .bin/.gph files are just assets - the code in game.exe is what brings them to life!

---

## Next Steps

1. **Import game.exe into Ghidra** (I'll guide you step by step)
2. **Run analysis**
3. **Explore the entry point** and main functions
4. **Find interesting functions** (graphics loader, game logic, AI)
5. **Export sections** to share with Claude for explanation
6. **Document findings** in this analysis/ directory

Ready to start with game.exe?
