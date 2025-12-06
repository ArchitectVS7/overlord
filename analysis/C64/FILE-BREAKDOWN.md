# C64 File Breakdown

## Overview

The C64 version consists of 2 files:

---

## Files

### 1. **Supremacy_aka_Overlord_+8D_[ExCeSs].crt** (615 KB) - DECOMPILE THIS
- **Type:** EasyFlash cartridge ROM image
- **Contains:** 6502 machine code (the actual game program)
- **Architecture:** MOS 6502 processor (8-bit CPU)
- **Format:** .crt container with multiple 8KB ROM banks inside

**What's inside:**
- 6502 assembly code (the game logic)
- Graphics data (character sets, sprites)
- Game data (possibly embedded, or loads from disk)
- Music/sound driver code

**Challenge:** Must extract ROM banks from .crt container before importing to Ghidra

### 2. **Supremacy.sid** (4.4 KB) - OPTIONAL
- **Type:** PlaySID music file
- **Contains:** Music player code + music data
- **Composer:** Jeroen Tel (famous C64 musician!)
- **Format:** SID (Sound Interface Device) format

**What's inside:**
- 6502 code that plays music
- Music note data
- Sound effect routines

**Note:** This is just the music/sound. The main game logic is in the .crt file.

---

## Analysis Approach

### For the Cartridge (.crt):

**Step 1: Extract ROM banks**
The .crt file is a container. Inside are multiple 8KB ROM banks. We need to extract them first.

**Tools to extract:**
- `cartconv` (from VICE emulator suite)
- Manual hex editor extraction
- Or I can guide you through extracting with simple tools

**Step 2: Import ROM into Ghidra**
- Import as "Raw Binary"
- Set processor: 6502
- Set base address: $8000 or $A000 (typical cartridge addresses)

**Step 3: Analyze**
- Ghidra will disassemble 6502 code
- Decompiler will generate C-like pseudocode
- More challenging than x86 due to C64-specific hardware

### For the SID file (.sid):

**Optional:** If you want to understand the music code
- Use SID dump tools to extract player code
- Less critical for understanding game logic

---

## C64-Specific Challenges

### Memory Map Knowledge Required:
The C64 has specific hardware addresses you need to know:
- `$D000-$DFFF` - I/O area (VIC-II graphics, SID sound, CIA I/O)
- `$0000-$00FF` - Zero page (fast memory)
- `$8000-$9FFF` - Cartridge ROM low bank
- `$A000-$BFFF` - Cartridge ROM high bank

When you see code accessing these addresses, you'll need to know what hardware it's talking to.

### Multiple ROM Banks:
EasyFlash cartridges can have many 8KB banks. The code can switch between them. You'll need to:
1. Extract all banks
2. Analyze each one
3. Find bank-switching code
4. Understand how they work together

---

## Analysis Priority

1. ✅ **Extract ROM from .crt** (I'll help with this)
2. ✅ **Import first ROM bank into Ghidra**
3. Find entry point (cartridge start address)
4. Explore code
5. Extract additional banks as needed

The .sid file is optional - focus on the cartridge first!

---

## Comparison: C64 vs MS-DOS Difficulty

**MS-DOS (game.exe):**
- ✅ Single executable file - easy to import
- ✅ x86 code - more familiar to modern developers
- ✅ No extraction needed
- **EASIER - Start here!**

**C64 (.crt):**
- ❌ Need to extract ROM banks first
- ❌ 6502 code - less familiar architecture
- ❌ Need C64 hardware knowledge
- ❌ Multiple banks to manage
- **HARDER - Do this second!**

---

## Recommendation

**Start with MS-DOS game.exe** to learn Ghidra and understand the game logic. Once you're comfortable, tackle the C64 version. The game logic should be similar, just implemented in different code.

Ready to begin with the DOS version?
