# C64 ROM Extraction Summary

## Status: ✅ Successfully Extracted!

**Date:** December 6, 2025
**Source:** Supremacy_aka_Overlord_+8D_[ExCeSs].crt (EasyFlash cartridge)
**Output:** 75 ROM banks in `extracted_rom/`
**Total Size:** 600 KB

---

## Extracted ROM Banks

The EasyFlash cartridge contains 75 ROM banks:
- Each bank: 8KB (8192 bytes)
- Two load addresses: $8000 and $A000

### Memory Layout

**C64 Cartridge Memory Map:**
- `$8000-$9FFF` (8KB) - ROML (ROM Low bank)
- `$A000-$BFFF` (8KB) - ROMH (ROM High bank)

EasyFlash can bank-switch between multiple 8KB banks at these addresses.

### File Naming

Files are named: `bank_XX_$YYYY.bin`
- `XX` = Bank number (00-48)
- `YYYY` = Load address ($8000 or $A000)

**Examples:**
- `bank_00_$8000.bin` - Bank 0, loads at $8000 (ROML)
- `bank_00_$A000.bin` - Bank 0, loads at $A000 (ROMH)

---

## Entry Point

C64 cartridges typically start at **$8000** in **bank 0**.

When the C64 boots with a cartridge:
1. Checks for cartridge signature at $8004
2. Jumps to cold start vector at $8000 or address in ROM header
3. Game initialization begins

**Start your analysis with:** `bank_00_$8000.bin`

---

## Next Steps: Import into Ghidra

### Step 1: Return to Ghidra

Your Ghidra project should still be open from the MS-DOS analysis.

### Step 2: Import First ROM Bank

1. **In Ghidra:** File → Import File
2. **Navigate to:** `C:\dev\GIT\Overlord\analysis\c64\extracted_rom\`
3. **Select:** `bank_00_$8000.bin`
4. **Format:** Raw Binary
5. **Language:** 6502 (NOT x86!)
6. **Options:**
   - **Base Address:** `8000` (hex) or `0x8000`
   - This tells Ghidra the code is meant to run at address $8000

### Step 3: Analyze

Same as before:
1. Double-click the imported file
2. Click "Yes" to analyze
3. Wait for analysis to complete

### Step 4: Export Decompiled Code

1. File → Export Program
2. Format: C/C++
3. Save to: `analysis/c64/bank_00_decompiled.c`

---

## Understanding C64 Code

### Key Differences from x86:

**Architecture:**
- 8-bit CPU (MOS 6502)
- 3 registers: A (accumulator), X, Y (index registers)
- Very limited compared to x86

**Memory-Mapped I/O:**
- `$D000-$DFFF` - Hardware registers
  - `$D000-$D3FF` - VIC-II (graphics chip)
  - `$D400-$D7FF` - SID (sound chip)
  - `$D800-$DBFF` - Color RAM
  - `$DC00-$DCFF` - CIA #1 (keyboard, joystick)
  - `$DD00-$DDFF` - CIA #2 (serial, timers)

**Common Patterns:**
```asm
LDA #$00        ; Load accumulator with 0
STA $D020       ; Store to border color register
```

When you see addresses in $D000-$DFFF range, it's talking directly to hardware!

---

## Bank Switching

EasyFlash cartridges can switch between ROM banks:

**Bank switching registers:**
- `$DE00` - Select ROM bank at $8000 (ROML)
- `$DE01` - Select ROM bank at $A000 (ROMH)

Look for code that writes to `$DE00` or `$DE01` - this switches between ROM banks!

---

## Analysis Strategy

### 1. Start with Bank 0

Bank 0 is the entry point. Analyze this first to understand:
- Startup/initialization code
- Main game loop entry
- Bank switching logic

### 2. Follow Bank Switches

When you see code write to $DE00/$DE01, note which bank it switches to. Import and analyze that bank next.

### 3. Map Out Banks

As you analyze, document:
- What each bank contains (code, graphics data, game logic)
- How banks are connected (which bank switches to which)
- Build a mental map of the cartridge structure

### 4. Compare with DOS Version

The C64 and DOS versions implement the same game. Compare:
- Game logic algorithms
- Data structures
- How features differ between platforms

---

## Tools and Resources

### C64 Memory Map Reference:
- **$0000-$00FF** - Zero page (fast memory, used for pointers)
- **$0100-$01FF** - Stack
- **$0200-$9FFF** - RAM
- **$A000-$BFFF** - BASIC ROM (or cartridge ROM high)
- **$C000-$CFFF** - RAM
- **$D000-$DFFF** - I/O area (hardware registers)
- **$E000-$FFFF** - KERNAL ROM

### 6502 Instruction Reference:
- http://www.6502.org/tutorials/6502opcodes.html
- https://www.masswerk.at/6502/6502_instruction_set.html

### C64 Hardware:
- VIC-II graphics: https://www.c64-wiki.com/wiki/VIC
- SID sound: https://www.c64-wiki.com/wiki/SID
- CIA I/O: https://www.c64-wiki.com/wiki/CIA

---

## Expected Challenges

### 1. Less Readable Than x86

6502 decompilation is harder to read:
- Very limited registers
- Lots of memory operations
- Heavy use of zero page

### 2. Hardware-Specific Code

Lots of direct hardware access:
```c
*(byte*)0xD020 = 0;  // Set border color to black
```

You'll need to know what hardware is at each address.

### 3. Bank Switching Complexity

Following code flow across multiple banks is challenging. You need to:
1. Identify bank switches
2. Import the target bank
3. Continue analysis in new bank

### 4. Mixed Code and Data

ROM banks may contain both code and data. Ghidra might misinterpret data as code. You'll need to manually mark data regions.

---

## Current Status

✅ ROM banks extracted to: `analysis/c64/extracted_rom/`
⏳ Ready to import into Ghidra
⏳ Start with bank_00_$8000.bin

---

## Ready to Continue?

**Next:** Import `bank_00_$8000.bin` into Ghidra and analyze it!

I'll guide you through the import process step-by-step.
