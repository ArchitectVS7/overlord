# MS-DOS Decompilation Summary

## Status: ✅ Successfully Decompiled!

**Date:** December 6, 2025
**File:** game.exe (147 KB)
**Output:** game.exe.c (88 KB, 2,272 lines)
**Tool:** Ghidra with C/C++ export

---

## What We Have

### Decompiled Code Structure

The game.exe has been successfully decompiled into C-like pseudocode.

**Entry Point:** Line 2247
```c
void __cdecl16far entry(void)
{
  // DOS startup code
  // Sets up memory segments
  // Initializes data structures
  // Calls main game code
}
```

This is the DOS loader entry point - where the program starts executing.

### Code Statistics

- **Total lines:** 2,272
- **Functions:** Multiple (auto-named as FUN_1000_XXXX)
- **Data structures:** Various global variables and structures
- **Warnings:** Some sections have decompilation warnings (common with old DOS code)

### Function Naming

Ghidra auto-generates function names like:
- `FUN_1000_0cee` - Function at memory address 1000:0cee
- `FUN_1000_1c54` - Function at memory address 1000:1c54
- etc.

These are **not** the original function names (source was compiled without debug symbols). You'll need to reverse engineer what each function does and rename them appropriately.

---

## Next Steps for Analysis

### 1. Identify Key Functions

**Search for patterns to identify:**
- **Graphics loading code** - Look for functions that read files, allocate memory for graphics
- **Game loop** - Main loop that runs every frame/turn
- **Input handling** - Keyboard/mouse code
- **AI logic** - Computer player decision making
- **Combat calculations** - Battle resolution code

### 2. Rename Functions in Ghidra

As you identify what functions do:
1. Go back to Ghidra
2. Right-click on function name
3. "Rename Function"
4. Give it a meaningful name (e.g., `load_graphics_file`, `game_main_loop`)
5. Re-export to get updated decompilation

### 3. Find String References

**In Ghidra, try this:**
1. Search → For Strings
2. Look for:
   - File extensions (.BIN, .GPH)
   - Error messages
   - Game text
3. Click on interesting strings
4. See what functions reference them
5. Those are key functions!

### 4. Trace File I/O

The game loads graphics files (.bin/.gph). Finding this code tells you:
- File format structure
- How graphics are decoded
- Memory layout

**Look for:**
- DOS file I/O interrupts (INT 21h)
- File open/read/close operations
- Buffer allocation for file data

### 5. Understand Memory Layout

16-bit DOS uses segmented memory:
- Code addresses like `1000:XXXX` mean segment 1000, offset XXXX
- Understanding the memory map helps decode what code is doing

---

## Known Challenges

### 1. Decompilation Warnings

Some functions have warnings like:
```
// WARNING: Bad instruction data
// WARNING: Control flow encountered bad instruction data
```

**This means:**
- Ghidra couldn't fully understand the code flow
- Might be anti-debugging tricks, self-modifying code, or data mixed with code
- These sections need manual analysis

### 2. No Debug Symbols

The original source code variable/function names are lost. Everything is auto-named. This is normal for old DOS games compiled for release.

### 3. Indirect Function Calls

Old DOS code uses lots of function pointers and indirect calls. Ghidra might show these as `func_0x00012d3b()` - addresses rather than names.

---

## What to Look For

### High-Priority Targets

1. **Main game initialization**
   - Look for code near entry point that sets up the game
   - Might detect video mode, sound card, input devices

2. **Graphics system**
   - File loading for .BIN/.GPH files
   - Screen drawing routines
   - Sprite/tile rendering

3. **Game logic**
   - Turn processing
   - Unit movement
   - Combat resolution
   - AI decision making

4. **Input handling**
   - Keyboard scan codes
   - Mouse interrupt handlers
   - Command interpretation

5. **Sound system**
   - AdLib/Roland initialization
   - Music/sound effect playback

---

## How to Work with This File

### Option 1: Manual Reading

Open `game.exe.c` in a text editor and read through sections:
- Start with entry point (line 2247)
- Follow function calls
- Make notes about what you think functions do

### Option 2: Work with Claude

Share interesting function snippets with me:
1. Copy a function from game.exe.c
2. Paste it in chat
3. I'll explain what it's doing
4. Together we document the game's internals

### Option 3: Continue in Ghidra

The exported .c file is a snapshot. The real power is in Ghidra:
- Interactive navigation
- Cross-references
- Renaming and commenting
- Graph views of code flow
- Real-time analysis

**Best approach:** Use Ghidra for exploration, export sections for documentation.

---

## Current Understanding

### Entry Point (line 2247)

The `entry()` function is DOS startup code:
- Sets up segment registers
- Copies data to correct memory locations
- Initializes some global variables
- Then (presumably) calls the real main game code

This is **not** the interesting game logic - this is just boilerplate DOS startup.

### Next: Find the Real Main Function

After entry() runs, it must call the actual game code. To find it:
1. Look for the last function call in entry()
2. Or search for initialization patterns (setting up graphics, etc.)

---

## Questions to Answer

As you explore the code, try to answer:

1. **How does it load graphics files?**
   - What format are .BIN and .GPH files?
   - How does it choose which graphics set (CGA/EGA/MCGA/TGA)?

2. **How does the game loop work?**
   - What happens each turn/frame?
   - How is state maintained?

3. **How is AI implemented?**
   - What algorithms does the computer player use?
   - How does it make decisions?

4. **How does combat work?**
   - What are the formulas?
   - What factors affect outcomes?

5. **How does it interface with hardware?**
   - Direct VGA register access?
   - Sound card programming?

---

## Tools for Further Analysis

### In Ghidra:
- **Functions window** - List all functions
- **Strings window** - All text in the program
- **Call Tree** - See function call hierarchy
- **Data Type Manager** - Define structures
- **Script Manager** - Automate analysis

### External:
- **Ralf Brown's Interrupt List** - Decode DOS/BIOS interrupts
- **OSDev Wiki** - Hardware reference
- **DOSBox debugger** - Run and trace actual execution

---

## Success Criteria

You've successfully decompiled the game when you can:
- ✅ Export all code to readable C (DONE!)
- ⏳ Identify main game loop
- ⏳ Understand graphics file format
- ⏳ Document AI algorithms
- ⏳ Map out game state structures
- ⏳ Explain combat mechanics

---

## Ready to Dive Deeper?

**Next actions:**
1. Share a function you want explained
2. Return to Ghidra to search for strings/interesting code
3. Move on to C64 decompilation
4. Ask specific questions about the code

What would you like to explore next?
