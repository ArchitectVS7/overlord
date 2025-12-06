# Overlord MS-DOS Technical Manual

**Game:** Overlord (Supremacy)
**Platform:** MS-DOS
**File:** game.exe (147 KB)
**Decompiled:** game.exe.c (88 KB, 2,272 lines)

---

## Executive Summary

This document provides technical analysis of the decompiled MS-DOS version of Overlord. The analysis identifies key data structures, memory addresses, functions, and I/O patterns.

**Analysis Status:** Phase 2 Complete (Static Pattern Recognition + Commented Source)
**Confidence Level:** Low-Medium (decompilation is heavily mangled)
**Commented Source:** `game.exe.commented.c` - Annotated version with inline analysis

---

## Table of Contents

1. [Program Structure](#1-program-structure)
2. [Memory Map](#2-memory-map)
3. [Data Structures](#3-data-structures)
4. [Function Catalog](#4-function-catalog)
5. [I/O Patterns](#5-io-patterns)
6. [Game Systems](#6-game-systems)
7. [Known Unknowns](#7-known-unknowns)

---

## 1. Program Structure

### 1.1 Entry Point

**Location:** Line 2247-2270
**Function:** `entry()`

```c
void __cdecl16far entry(void) {
    // DOS segment initialization
    DAT_338b_0004 = unaff_ES + 0x10;
    _DAT_4000_89ee = DAT_338b_0004 + DAT_338b_000c;

    // Memory copy operation (relocates data)
    for (iVar3 = DAT_338b_0006; iVar3 != 0; iVar3 = iVar3 + -1) {
        *puVar2 = *puVar1;  // Copy bytes downward
    }

    _DAT_4000_89ec = 0x32;  // Initialize counter/flag (50 decimal)
    return;
}
```

**Analysis:**
- Standard DOS MZ executable entry
- Sets up segment registers (ES, DS)
- Relocates data to final memory locations
- Initializes runtime flag (0x32 = 50)

### 1.2 Overall Architecture

**Code Segments:**
- Segment 1000: Main game code
- Segment 338b: Executable header area
- Segment 4000: Data/variable area

**Characteristics:**
- 16-bit real mode code
- Heavy use of segment:offset addressing
- Many functions have decompilation artifacts (byte manipulations)

---

## 2. Memory Map

### 2.1 Identified Memory Addresses

| Address | Size | Description | Confidence |
|---------|------|-------------|------------|
| 0x0836 | byte | System state flag | Medium |
| 0x07a4 | word | Counter/index variable | Medium |
| 0x168b | byte* | Data buffer (128 bytes) | Medium |
| 0x1673 | byte* | Secondary buffer | Low |
| 0x170b | char* | String/text pointer | Medium |
| 0x178c | word[] | Lookup table | Low |
| 0x17be | word | Coordinate X? | Low |
| 0x17c0 | word | Coordinate Y? | Low |
| 0x19fb | word | Parameter storage | Low |
| 0x1c00 | byte | State flag | Low |
| 0x1c03 | word | DAT_1000_1c03 | Low |
| 0x1d1e | byte[] | Data array | Low |
| 0x2226 | word | Mode flag (1 = special) | Medium |
| 0x222a | word | Stored value | Low |
| 0x2400 | byte | Control variable | Medium |
| 0x2470 | word | Reference X coordinate | Medium |
| 0x2472 | word | Reference Y coordinate | Medium |
| 0x25ca | word | Comparison X value | Medium |
| 0x25cc | word | Comparison Y value | Medium |
| 0x26f0 | word | Calculated value | Low |
| 0x270a | byte | Count/size value | Medium |
| 0x275a | word | Secondary count | Low |

### 2.2 Segment Organization

```
Segment 1000: (Code + Near Data)
├── 0x0000-0x0FFF: Low memory / variables
├── 0x1000-0x1FFF: Primary data structures
├── 0x2000-0x2FFF: Game state variables
└── 0x3000+: Extended data

Segment 338b: (EXE Header Area)
├── 0x0004: Initial data segment
├── 0x0006: Relocation size
└── 0x000c: Additional segment offset

Segment 4000: (Far Data)
├── 0x89ec: Runtime flag (byte)
└── 0x89ee: Segment value (word)
```

---

## 3. Data Structures

### 3.1 Entity Structure (Hypothesis)

Based on field access patterns at offsets +4, +0x10, +0x12:

```c
typedef struct Entity {
    byte unknown_0[4];      // 0x00-0x03
    byte type;              // 0x04 - Entity type (0x02 = specific type)
    byte unknown_5[11];     // 0x05-0x0F
    word coord_x;           // 0x10 - X coordinate
    word coord_y;           // 0x12 - Y coordinate
    // Additional fields unknown
} Entity;
```

**Evidence:** FUN_1000_0cee and FUN_1000_1c54 both check:
- `*(char *)(entity + 4) == '\x02'` (type check)
- `*(int *)(entity + 0x10)` (X coordinate)
- `*(int *)(entity + 0x12)` (Y coordinate)

### 3.2 DOS Executable Header

```c
struct OLD_IMAGE_DOS_HEADER {
    char e_magic[2];        // "MZ" signature
    word e_cblp;            // Bytes on last page
    word e_cp;              // Pages in file
    word e_crlc;            // Relocations
    word e_cparhdr;         // Header size in paragraphs
    word e_minalloc;        // Minimum extra memory
    word e_maxalloc;        // Maximum extra memory
    word e_ss;              // Initial SS value
    word e_sp;              // Initial SP value
    word e_csum;            // Checksum
    word e_ip;              // Initial IP value
    word e_cs;              // Initial CS value
    word e_lfarlc;          // Relocation table offset
    word e_ovno;            // Overlay number
};
```

---

## 4. Function Catalog

### 4.1 Identified Functions

| Function | Lines | Description | Confidence |
|----------|-------|-------------|------------|
| entry | 2247-2270 | Program entry point | High |
| FUN_1000_0cee | 45-70 | Entity validation | Medium |
| FUN_1000_0dfc | 76-180 | Data processing (mangled) | Low |
| FUN_1000_1c54 | 184-198 | Entity type check | Medium |
| FUN_1000_1c7e | 202-212 | State update routine | Medium |
| FUN_1000_1ca6 | 216-236 | Mode-dependent processing | Medium |
| FUN_1000_1d82 | 240-257 | Conditional dispatch | Low |
| FUN_1000_1e40 | 261-279 | Parameter setup | Low |
| FUN_1000_206a | 283-300 | Max value finder | High |
| FUN_1000_a990 | (ref only) | Called with (0, count-1) | Low |
| FUN_1000_2081 | 308-369 | Bulk memory copy | Medium |
| FUN_1000_2104 | 373-398 | Table iteration | Medium |
| FUN_1000_228c | 527+ | Unknown | Low |
| FUN_1000_28b9 | 543+ | Unknown | Low |
| FUN_1000_28c8 | 558+ | Unknown | Low |
| FUN_1000_290e | 585+ | Post-iteration processor | Low |

### 4.2 Function Details

#### FUN_1000_0cee - Entity Validation

```c
// Purpose: Check if entity is valid for current context
// Returns: 1 if valid, 0 if invalid
// Parameters: 4-byte pointer to entity structure

undefined2 FUN_1000_0cee(undefined4 param_1) {
    // Checks:
    // 1. System flag at 0x836 must be non-zero
    // 2. Entity type (offset +4) must be 0x02
    // 3. Entity coordinates must match one of three reference points:
    //    - Point A: (0x25ca, 0x25cc)
    //    - Point B: (0x2470, 0x2472)
    //    - Point C: (0x17be, 0x17c0)
}
```

**Hypothesis:** This validates whether an entity (unit/building?) is within bounds or at a valid position.

#### FUN_1000_206a - Find Maximum Value

```c
// Purpose: Find maximum byte value in buffer
// Buffer: Starting at 0x168b, length 0x7f (127 bytes)

void FUN_1000_206a(void) {
    byte* buffer = (byte*)0x168b;
    int length = 0x7f;
    byte max_value = 0;

    for (int i = length; i != 0; i--) {
        if (max_value <= *buffer) {
            max_value = *buffer;
        }
        buffer++;
    }
    // max_value now contains highest byte in buffer
}
```

**Hypothesis:** Could be finding strongest unit, highest score, or maximum resource in a data array.

#### FUN_1000_2081 - Bulk Memory Copy

```c
// Purpose: Copy data between buffers and calculate values
// Buffer 1: 0x118 bytes (280) copied to 0x1673
// Buffer 2: 0x200 bytes (512) copied to 0x178c
// Also: Scans table at 0x170b (32 entries, 2 bytes each)

void FUN_1000_2081(void) {
    // Copy 280 bytes to buffer at 0x1673
    for (int i = 0x118; i != 0; i--) {
        *dst++ = *src++;  // Source from unaff_SI
    }

    // Copy 512 bytes to lookup table at 0x178c
    for (int i = 0x200; i != 0; i--) {
        *dst++ = *src++;
    }

    // If not terminating, do additional processing
    if (DAT_1000_19ac != -1) {
        find_max_in_buffer();  // Find max in 0x168b

        // Count non-zero entries at 0x170b
        for (int i = 32; i != 0; i--) {
            if (*ptr != 0) count += 256;
            ptr += 2;  // Stride of 2 bytes
        }
        DAT_1000_1fce = count + 0x122;
    }
}
```

**Hypothesis:** This is a state snapshot/restore function. Possibly:
- Saving game state to buffer
- Loading graphics data
- Swapping display pages

#### FUN_1000_2104 - Table Iteration

```c
// Purpose: Process 32-entry table at 0x170b
// Entry format: 2 bytes per entry
// Calls FUN_1000_214f for each valid (non-zero) entry
// Then calls FUN_1000_290e 64 times (32 pairs)

void FUN_1000_2104(void) {
    for (int i = 32; i != 0; i--) {
        if (entry[0] != 0 && entry[1] != 0) {
            FUN_1000_214f(i, entry, index);
        }
        entry += 2;
        index++;
    }

    for (int i = 0; i < 32; i++) {
        FUN_1000_290e(i);
        FUN_1000_290e();  // Called twice per iteration
    }
}
```

**Hypothesis:** Processes active game entities from a fixed-size table. The double FUN_1000_290e call suggests paired processing (X/Y coordinates, or before/after states).

---

## 5. I/O Patterns

### 5.1 Identified I/O (Limited)

The decompilation does not clearly show DOS interrupt calls, which suggests:
1. I/O is handled through indirect calls (`func_0xXXXXXXXX`)
2. I/O code may be in sections not yet analyzed
3. Graphics/input may use direct hardware access

### 5.2 Indirect Function Calls

| Call Address | Likely Purpose |
|--------------|----------------|
| func_0x00012d3b | Branch A of conditional |
| func_0x000127cf | Branch B of conditional |
| func_0x00012952 | Post-condition handler |

### 5.3 Expected I/O (Not Yet Found)

**DOS Interrupts (INT 21h):**
- File operations (open, read, close .BIN/.GPH files)
- Get/Set file attributes
- Directory operations

**BIOS Interrupts (INT 10h):**
- Video mode setup (13h for MCGA, etc.)
- Palette configuration
- Screen buffer access

**Mouse Interrupt (INT 33h):**
- Mouse position
- Button state

**Keyboard (INT 16h/09h):**
- Key scan codes
- Input buffer

---

## 6. Game Systems

### 6.1 Coordinate System

**Evidence:** Multiple coordinate pairs found:
- Entity coordinates at offsets +0x10, +0x12
- Reference points: (0x25ca,0x25cc), (0x2470,0x2472), (0x17be,0x17c0)

**Hypothesis:** 16-bit coordinate system, likely for map grid or screen positions.

### 6.2 Entity System

**Evidence:** FUN_1000_0cee and FUN_1000_1c54

```
Entity Structure:
- Type field at offset +4 (value 0x02 has special meaning)
- Position at offset +0x10, +0x12 (X, Y)
- Unknown fields at other offsets
```

**Hypothesis:** Units, buildings, or map tiles use this structure.

### 6.3 Mode System

**Evidence:** FUN_1000_1ca6 checks mode flag:
```c
if (*(int *)0x2226 == 1) {
    FUN_1000_1e40();  // Special mode processing
    return;
}
// Normal mode processing
```

**Hypothesis:** Game has multiple modes (menu, gameplay, combat, etc.)

---

## 7. Known Unknowns

### 7.1 Decompilation Limitations

**Problem:** Much of the code appears as byte manipulations:
```c
in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
```

**Cause:** 16-bit x86 real mode code with complex addressing modes decompiles poorly.

**Impact:** True program logic is obscured; many functions are not interpretable.

### 7.2 Missing Information

- [ ] Main game loop location
- [ ] Graphics loading routines
- [ ] Sound/music code
- [ ] AI decision making
- [ ] Combat calculations
- [ ] Save/load functionality
- [ ] User input handling

### 7.3 Requires Runtime Verification

To progress further, runtime debugging (DOSBox) needed to:
1. Trace execution flow
2. Map function calls to actions
3. Understand data structure usage
4. Verify static analysis hypotheses

---

## Appendix A: Reference Addresses Quick Lookup

```
0x0836 - System enable flag
0x07a4 - Counter/timer
0x168b - Data buffer start
0x2226 - Mode flag
0x2400 - Control byte
0x2470/0x2472 - Reference point B
0x25ca/0x25cc - Reference point A
0x270a - Array size
```

---

## Appendix B: Analysis Notes

### Decompilation Quality

- **Entry function:** Clean, understandable
- **Entity check functions:** Mostly clear
- **Data processing functions:** Heavily mangled
- **Game logic:** Not yet identified

### Recommended Next Steps

1. **Find graphics loading:** Search for file operations
2. **Identify main loop:** Look for timer/event handling
3. **Map input handling:** Find keyboard/mouse code
4. **Runtime trace:** Use DOSBox debugger

---

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| Dec 6, 2025 | 0.1 | Initial static analysis |
| Dec 6, 2025 | 0.2 | Added FUN_1000_2081 and FUN_1000_2104 analysis; created commented source file |

---

## Related Files

- `game.exe.c` - Raw Ghidra decompilation output (88 KB)
- `game.exe.commented.c` - Annotated version with inline analysis comments
- `FILE-BREAKDOWN.md` - File structure analysis
- `DECOMPILATION-SUMMARY.md` - Decompilation process notes

---

*This document will be updated as analysis progresses.*
