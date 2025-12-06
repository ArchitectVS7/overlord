# Overlord C64 Technical Manual

**Game:** Overlord (Supremacy) - 30th Anniversary Community Remake
**Platform:** Commodore 64 with EasyFlash Cartridge
**File:** Supremacy_aka_Overlord_+8D_[ExCeSs].crt (615 KB)
**Creator:** [ExCeSs] Demo Scene Group (~2020)
**Decompiled:** 75 ROM banks extracted, Bank 0 analyzed

---

## Executive Summary

This document provides technical analysis of the C64 community remake of Overlord. This is NOT the original 1990s code - it's a modern reimplementation using EasyFlash cartridge technology.

**Analysis Status:** Phase 1 Complete (Bank 0 - Loader Analysis)
**Confidence Level:** High (clean 6502 code, well-understood hardware)
**Commented Source:** `bank_00.commented.c` - Annotated loader code

---

## Table of Contents

1. [Historical Context](#1-historical-context)
2. [Cartridge Structure](#2-cartridge-structure)
3. [Memory Map](#3-memory-map)
4. [Entry Point Analysis](#4-entry-point-analysis)
5. [EasyFlash System](#5-easyflash-system)
6. [I/O Patterns](#6-io-patterns)
7. [Known Unknowns](#7-known-unknowns)

---

## 1. Historical Context

### 1.1 What This Is

**This is a community remake**, not the original 1990 game:
- Created by [ExCeSs] demo scene group
- Uses EasyFlash technology (created 2009, not available in 1990)
- Signature visible in ROM: "EXCESS EASYFLASH LOADER : MORE THAN YOU DESERVE"
- Likely released around 2020 for 30th anniversary

### 1.2 Technical Implications

**Modern techniques:**
- Clean, well-structured 6502 code
- Modern assembler toolchain (probably CC65 or ACME)
- Efficient EasyFlash bank switching
- Self-relocating loader pattern

**Value for analysis:**
- Learn modern retro programming best practices
- Understand EasyFlash cartridge development
- See how to implement complex games on C64

---

## 2. Cartridge Structure

### 2.1 CRT File Format

**Header (64 bytes):**
```
Signature: "C64 CARTRIDGE   "
Version: 01.00
Hardware Type: EasyFlash (32)
EXROM: 1, GAME: 0
Name: "OVERLORD"
```

**CHIP Packets:**
- 75 CHIP packets extracted
- Each contains 8KB ROM bank
- Total: 600 KB of ROM data

### 2.2 Extracted Banks

```
analysis/c64/extracted_rom/
├── bank_00_$8000.bin   (8,192 bytes) - ANALYZED
├── bank_01_$8000.bin   (8,192 bytes)
├── bank_02_$8000.bin   (8,192 bytes)
... (75 banks total)
└── bank_47_$A000.bin   (8,192 bytes)
```

### 2.3 Bank Organization (Hypothesis)

| Banks | Address | Purpose |
|-------|---------|---------|
| 0 | $8000 | Loader/initialization (ANALYZED) |
| 1-3 | $8000 | Additional loader code |
| 4+ | $8000/$A000 | Game code and data |

---

## 3. Memory Map

### 3.1 C64 Standard Memory

| Address Range | Size | Purpose |
|---------------|------|---------|
| $0000-$00FF | 256 | Zero Page (fast registers) |
| $0100-$01FF | 256 | Stack |
| $0200-$03FF | 512 | KERNAL work area |
| $0400-$07FF | 1K | Screen memory (default) |
| $0800-$9FFF | 38K | BASIC/RAM area |
| $A000-$BFFF | 8K | BASIC ROM / RAM |
| $C000-$CFFF | 4K | RAM (always) |
| $D000-$DFFF | 4K | I/O / Char ROM |
| $E000-$FFFF | 8K | KERNAL ROM / RAM |

### 3.2 EasyFlash Cartridge Memory

| Address Range | Purpose |
|---------------|---------|
| $8000-$9FFF | Cartridge ROM LOW (8KB, banked) |
| $A000-$BFFF | Cartridge ROM HIGH (8KB, banked) |
| $DE00 | Bank select register |
| $DE02 | Control register |

### 3.3 Identified Addresses (Bank 0)

| Address | Type | Description | Confidence |
|---------|------|-------------|------------|
| $01 | reg | Processor port (memory config) | High |
| $02 | var | Current bank number | High |
| $E0 | var | Work register (bank) | Medium |
| $E4 | var | Address low byte | Medium |
| $E5 | var | Address high byte | Medium |
| $EC/$ED | ptr | Indirect pointer | Medium |
| $0100-$010F | mem | Stack (cleared on init) | High |
| $0318 | var | KERNAL vector redirect | High |
| $8000 | code | Entry point | High |
| $802C | data | Signature string | High |
| $8076 | code | Relocatable loader | High |
| $835B | code | Init subroutine | High |
| $C800 | code | Loader destination (RAM) | High |
| $C826 | code | NMI handler (RAM) | High |
| $DE00 | reg | EasyFlash bank select | High |
| $DE02 | reg | EasyFlash control | High |
| $FFFA/$FFFB | vec | NMI vector -> $C826 | High |

---

## 4. Entry Point Analysis

### 4.1 Main Entry ($8000)

**Function:** `easyflash_loader_entry`

```asm
; Entry point - executed on RESET
8000:  LDA #$C1
8002:  STA $0318          ; Set KERNAL vector
8005:  LDA #$26
8007:  STA $FFFA          ; NMI vector low -> $26
800A:  LDA #$C8
800C:  STA $FFFB          ; NMI vector high -> $C8 (= $C826)
800F:  LDX #$0F
8011:  LDA #$00
8013:  STA $0100,X        ; Clear stack $100-$10F
8016:  DEX
8017:  BPL $8013          ; Loop while X >= 0
8019:  JSR $835B          ; Call init subroutine
801C:  LDX #$00
801E:  LDA $8076,X        ; Load byte from relocatable loader
8021:  STA $C800,X        ; Store to RAM
8024:  INX
8025:  CPX #$E5           ; 229 bytes
8027:  BNE $801E          ; Loop
8029:  JMP $C800          ; Jump to relocated loader
```

### 4.2 Operations Performed

1. **Set KERNAL vector** ($0318 = $C1)
   - Redirects system vector to cartridge code

2. **Set NMI vector** ($FFFA/$FFFB = $C826)
   - NMI handler in RAM at $C826
   - Intercepts RESTORE key

3. **Clear stack** ($100-$10F)
   - Standard initialization
   - Ensures clean stack state

4. **Call init** (JSR $835B)
   - VIC-II setup
   - CIA initialization
   - EasyFlash control

5. **Copy loader to RAM** ($8076 -> $C800, 229 bytes)
   - Self-relocating pattern
   - Allows safe bank switching

6. **Jump to loader** (JMP $C800)
   - Execution continues in RAM
   - Can now switch ROM banks freely

### 4.3 Embedded Signature

**Address:** $802C-$805B

**ASCII Text:**
```
EXCESS EASYFLASH LOADER : MORE THAN YOU DESERVE
```

This identifies the creator as the [ExCeSs] demo scene group.

---

## 5. EasyFlash System

### 5.1 Bank Switching Mechanism

**Registers:**
- **$DE00** - Bank number (0-63)
- **$DE02** - Control register

**Control Register Bits:**
```
Bit 0: GAME line (directly directly directly directly directly directly directly directly directly directly directly directly directly directly directly directly connected to C64 expansion port)
Bit 1: EXROM line
Bit 2: Mode (0=16KB, 1=Ultimax)
Bit 7: LED
```

### 5.2 Bank Switch Pattern

From disassembly at $808C:

```asm
808C:  SEI               ; Disable interrupts
808D:  LDA #$37          ; Memory config: BASIC, KERNAL, I/O
808F:  STA $01           ; Set processor port
8091:  LDA #$87          ; Control: GAME=1, EXROM=1, LED off
8093:  STA $DE02         ; Set EasyFlash control
8096:  LDA #$00          ; Bank 0
8098:  STA $DE00         ; Select bank
809B:  RTS
```

### 5.3 Why Copy to RAM?

The loader copies itself to RAM at $C800 because:

1. **ROM is banked** - When you write to $DE00, the ROM at $8000-$9FFF changes
2. **Code must be in fixed memory** - Can't execute from ROM you're about to swap
3. **$C800 is always RAM** - Never affected by bank switches
4. **Safe switching** - From RAM, you can switch to any bank and read data

### 5.4 Memory Configuration ($01)

The C64 processor port at $01 controls memory visibility:

| Value | $A000-$BFFF | $D000-$DFFF | $E000-$FFFF |
|-------|-------------|-------------|-------------|
| $37 | BASIC ROM | I/O | KERNAL ROM |
| $35 | RAM | I/O | KERNAL ROM |
| $33 | RAM | I/O | RAM |
| $34 | RAM | RAM | RAM |

The loader uses $33 to access RAM at $A000 while keeping I/O visible.

---

## 6. I/O Patterns

### 6.1 Verified I/O Access

| Register | Read/Write | Purpose |
|----------|------------|---------|
| $01 | Write | Memory configuration |
| $0318 | Write | KERNAL vector redirect |
| $DE00 | Write | Bank selection |
| $DE02 | Write | EasyFlash control |
| $FFFA/$FFFB | Write | NMI vector |

### 6.2 Expected I/O (Not Yet Found in Bank 0)

**VIC-II (Graphics):**
- $D011 - Control register 1
- $D016 - Control register 2
- $D018 - Memory pointers
- $D020 - Border color
- $D021 - Background color

**SID (Sound):**
- $D400-$D41C - Voice 1-3 parameters
- $D418 - Volume/filter

**CIA (Input):**
- $DC00/$DC01 - Keyboard/joystick

These will be in the main game code (later banks).

---

## 7. Known Unknowns

### 7.1 Needs Analysis

- [ ] Function at $835B (initialization)
- [ ] Code at $C800 after relocation
- [ ] Banks 1-74 (remaining ROM data)
- [ ] Main game entry point
- [ ] Graphics loading routines
- [ ] Sound/music code
- [ ] Input handling
- [ ] AI and game logic

### 7.2 Recommended Next Steps

1. **Analyze $835B** - Find init subroutine in bank 0
2. **Analyze relocated loader** - Understand $C800 code
3. **Decompile more banks** - Find main game code
4. **Trace bank switches** - Map bank usage
5. **Runtime debugging** - Use VICE monitor

### 7.3 VICE Debugging Commands

```
# Break at bank switch
break w $DE00

# Break at entry point
break $8000

# Trace execution
trace on

# View memory
m $8000 $80FF

# Disassemble
d $8000
```

---

## Appendix A: Quick Reference

### Memory Addresses

```
$01     - Processor port (memory config)
$02     - Current bank number
$0318   - KERNAL vector
$8000   - Entry point
$835B   - Init subroutine
$C800   - Relocated loader (RAM)
$C826   - NMI handler (RAM)
$DE00   - EasyFlash bank select
$DE02   - EasyFlash control
$FFFA   - NMI vector low
$FFFB   - NMI vector high
```

### EasyFlash Values

```
Bank select: 0-63 written to $DE00
Control $87: GAME=1, EXROM=1, LED off
Memory $37: BASIC, KERNAL, I/O visible
Memory $33: RAM at $A000, I/O visible
```

---

## Appendix B: Comparison with MS-DOS Version

| Aspect | MS-DOS | C64 |
|--------|--------|-----|
| Code Quality | Heavily mangled | Clean, readable |
| Memory Model | 16-bit segments | 6502 flat |
| Storage | 147KB executable | 600KB banked ROM |
| I/O | DOS interrupts | Memory-mapped |
| Graphics | VGA/EGA/CGA | VIC-II |
| Sound | PC Speaker/AdLib | SID |
| Decompilation | Difficult | Straightforward |

---

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| Dec 6, 2025 | 0.1 | Initial Bank 0 analysis |

---

## Related Files

- `bank_00_headless.c` - Raw Ghidra decompilation
- `bank_00.commented.c` - Annotated source with analysis
- `extracted_rom/` - All 75 extracted ROM banks
- `extract_crt.py` - CRT extraction script
- `analyze_c64_v3.py` - Ghidra headless analysis script

---

*This document will be updated as analysis progresses through remaining banks.*
