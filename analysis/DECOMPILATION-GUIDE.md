# Decompilation Guide for Overlord/Supremacy

This guide provides comprehensive options for decompiling and analyzing the C64 and MS-DOS versions of Overlord/Supremacy.

## Archive Files (DO NOT EDIT)
- `C64-remake/` - Commodore 64 EasyFlash cartridge and SID music
- `MS-Dos/` - MS-DOS executable and game data files

---

## C64 Version Decompilation

**File:** `Supremacy_aka_Overlord_+8D_[ExCeSs].crt` (EasyFlash cartridge, 615KB)
**Architecture:** MOS 6502/6510 CPU
**File Type:** Commodore 64 cartridge ROM image

### Recommended Tools

#### 1. **da65** (Part of cc65 toolkit) - RECOMMENDED
- **Website:** https://cc65.github.io/
- **Type:** Free, open-source
- **Purpose:** 6502 disassembler with label generation
- **Installation:** `apt-get install cc65` (Linux) or download from website
- **Usage:**
  ```bash
  # Extract ROM banks from .crt first (see below)
  da65 --cpu 6502 -o supremacy.asm rom_bank.bin
  ```
- **Pros:** Excellent for 6502 code, can generate labels, supports info files for better disassembly
- **Cons:** Manual work needed to extract ROM from .crt container

#### 2. **CCS64 Debugger**
- **Website:** http://www.ccs64.com/
- **Type:** Commercial C64 emulator with debugger
- **Purpose:** Interactive debugging and disassembly
- **Features:** Real-time debugging, memory inspection, breakpoints
- **Usage:** Load cartridge and use built-in debugger

#### 3. **VICE Emulator with Monitor**
- **Website:** https://vice-emu.sourceforge.io/
- **Type:** Free, open-source
- **Purpose:** C64 emulator with powerful monitor/debugger
- **Installation:** Download from website or `apt-get install vice`
- **Usage:**
  ```bash
  x64sc Supremacy_aka_Overlord_+8D_[ExCeSs].crt
  # Press Alt+H to open monitor
  # Commands: d (disassemble), m (memory dump), break (set breakpoint)
  ```
- **Pros:** Free, actively maintained, excellent debugging features
- **Cons:** Requires understanding of C64 memory map

#### 4. **Ghidra** (Universal)
- **Website:** https://ghidra-sre.org/
- **Type:** Free, open-source (NSA)
- **Purpose:** Multi-architecture reverse engineering suite
- **CPU Module:** 6502 supported
- **Usage:**
  1. Extract ROM banks from .crt (use cartconv or manual extraction)
  2. Import raw binary with base address (typically $8000 or $A000 for cartridges)
  3. Analyze with 6502 processor
- **Pros:** Professional-grade, decompiler pseudo-code, cross-references
- **Cons:** Steep learning curve, need to know C64 memory layout

#### 5. **IDA Pro/IDA Free**
- **Website:** https://hex-rays.com/ida-free/
- **Type:** IDA Free (limited), IDA Pro (commercial)
- **Purpose:** Industry standard disassembler
- **Pros:** Excellent 6502 support, powerful analysis
- **Cons:** IDA Free has limitations, Pro is expensive

### Extracting ROM from EasyFlash .crt

EasyFlash cartridges contain multiple ROM banks. You'll need to extract them first:

**Option A: cartconv (from VICE):**
```bash
cartconv -t easyflash -i Supremacy_aka_Overlord_+8D_[ExCeSs].crt -o extracted/
```

**Option B: Manual extraction (hex editor):**
- .crt format: 64-byte header + CHIP packets
- Each CHIP packet: 16-byte header + ROM data
- EasyFlash uses 8KB banks at addresses $8000-$9FFF and $A000-$BFFF

### C64-Specific Resources

- **C64 Memory Map:** Essential for understanding code context
  - $0000-$00FF: Zero page
  - $0100-$01FF: Stack
  - $8000-$9FFF: Cartridge ROM low
  - $A000-$BFFF: Cartridge ROM high
  - $D000-$DFFF: I/O area (VIC, SID, CIA)
- **C64 Wiki:** https://www.c64-wiki.com/
- **6502.org:** http://www.6502.org/ - 6502 assembly reference
- **Lemon64:** https://www.lemon64.com/ - Game-specific discussions

### SID File Analysis

**File:** `Supremacy.sid` (Jeroen Tel, 1991)
- **Tool:** SIDDump (https://csdb.dk/)
- **Purpose:** Extract player code and analyze music routine
- **Player:** PlaySID v2.2+ format
- **Usage:**
  ```bash
  siddump Supremacy.sid > supremacy_music.asm
  ```

---

## MS-DOS Version Decompilation

**File:** `game.exe` (MS-DOS MZ executable, 147KB)
**Architecture:** x86 16-bit (real mode)
**File Type:** MZ executable

### Recommended Tools

#### 1. **Ghidra** - RECOMMENDED ⭐
- **Website:** https://ghidra-sre.org/
- **Type:** Free, open-source (NSA tool, pre-built binaries)
- **Purpose:** Complete reverse engineering suite with decompiler
- **CPU Module:** x86 16-bit supported (and 6502 for C64!)
- **Setup:** See **GHIDRA-SETUP-GUIDE.md** for step-by-step installation (no compilation needed!)
- **Usage:**
  1. Create new project
  2. Import `game.exe`
  3. Select "MS-DOS MZ Executable" format (auto-detected)
  4. Analyze with x86:Real Mode (16-bit)
  5. Use decompiler window for C-like pseudocode
- **Pros:**
  - FREE decompiler (rare for quality tools)
  - ONE program handles BOTH C64 and DOS
  - No compilation - just download and run
  - Excellent x86 and 6502 support
  - Generates C-like pseudocode
  - Cross-references, graphs, scripting
- **Cons:** Requires Java 17+, learning curve (but setup guide available)

#### 2. **IDA Pro/IDA Free**
- **Website:** https://hex-rays.com/ida-free/
- **Type:** IDA Free (limited), IDA Pro + Hex-Rays (commercial)
- **Purpose:** Industry standard
- **Usage:**
  1. Open game.exe
  2. IDA auto-detects MZ format
  3. Analyze
  4. View assembly (F5 for decompiler in Pro version only)
- **Pros:** Best-in-class analysis, excellent UI
- **Cons:**
  - Decompiler ONLY in expensive Pro version
  - IDA Free limited to x86-64 (may not work well with 16-bit)

#### 3. **Radare2/Cutter**
- **Website:** https://rada.re/ (r2) and https://cutter.re/ (GUI)
- **Type:** Free, open-source
- **Purpose:** Reverse engineering framework
- **Usage:**
  ```bash
  r2 game.exe
  aaa  # analyze all
  pdf @ main  # print disassembly function
  VV  # visual mode (graphs)
  ```
  **Or use Cutter GUI:** More user-friendly interface
- **Pros:** Free, powerful, scriptable, includes Ghidra decompiler
- **Cons:** Command-line heavy, steeper learning curve

#### 4. **Binary Ninja**
- **Website:** https://binary.ninja/
- **Type:** Commercial (Personal ~$150, Commercial ~$500)
- **Purpose:** Modern reverse engineering platform
- **Pros:** Clean UI, built-in decompiler, good x86-16 support
- **Cons:** Commercial license required for decompiler

#### 5. **Relyze**
- **Website:** https://www.relyze.com/
- **Type:** Commercial
- **Purpose:** Interactive software analysis
- **Pros:** Excellent for older executables like DOS
- **Cons:** Commercial

#### 6. **DOSBox Debugger**
- **Website:** https://www.dosbox.com/wiki/Debugger
- **Type:** Free
- **Purpose:** Dynamic analysis and debugging
- **Usage:**
  ```bash
  dosbox -c "debug game.exe"
  # Or use DOSBox-X with integrated debugger
  ```
- **Pros:** See code execute in real-time, set breakpoints
- **Cons:** Assembly only, no decompilation

#### 7. **Reko Decompiler**
- **Website:** https://github.com/uxmal/reko
- **Type:** Free, open-source
- **Purpose:** Machine code decompiler
- **Pros:** Supports DOS executables, generates C-like output
- **Cons:** Less mature than Ghidra/IDA

### DOS-Specific Challenges

- **Segmented Memory:** x86 real mode uses segment:offset addressing
  - Need to track DS, ES, CS segment registers
  - Address = segment * 16 + offset
- **Interrupts:** DOS uses INT 21h for system calls
  - Function determined by AH register
  - Reference: http://www.ctyme.com/intr/int-21.htm (Ralf Brown's Interrupt List)
- **Graphics:** Game loads .bin/.gph files for different video modes
  - Direct hardware access (VGA/EGA registers)
  - May contain mode-setting code worth analyzing separately

### Recommended Workflow

1. **Static Analysis First:**
   - Load game.exe into Ghidra or IDA
   - Let auto-analysis run
   - Identify entry point and main loops
   - Look for string references (error messages, etc.)

2. **Dynamic Analysis:**
   - Run in DOSBox debugger
   - Set breakpoints at interesting functions found in static analysis
   - Trace execution flow
   - Dump memory regions

3. **Combine Findings:**
   - Update Ghidra/IDA with information from dynamic analysis
   - Add function names, comments, structure definitions

---

## My Capabilities (Claude Code)

### What I CAN Do:

1. **Read and analyze disassembly output:**
   - If you run da65, Ghidra, etc. and save the output, I can read and explain it
   - I can help interpret 6502 or x86 assembly
   - I can explain what code sections do

2. **Binary file analysis:**
   - I can read hex dumps and explain file structures
   - I can help parse file formats (MZ header, .crt format, etc.)
   - I can identify patterns and signatures

3. **Tool guidance:**
   - Help you set up and use decompilation tools
   - Explain tool options and workflows
   - Troubleshoot tool issues

4. **Documentation:**
   - Create documentation of findings
   - Generate annotated disassembly listings
   - Map out program structure

5. **Scripting:**
   - Write Ghidra scripts (Python/Java) to automate analysis
   - Create IDA scripts (Python/IDC)
   - Write tools to parse extracted data

### What I CANNOT Do:

1. **Direct decompilation:**
   - I cannot directly decompile binaries myself
   - You need to use external tools first (Ghidra, IDA, etc.)

2. **Execute binaries:**
   - I cannot run the game or debuggers directly
   - You need to run DOSBox, VICE, etc. on your system

3. **Binary editing:**
   - I cannot modify binary files directly
   - I can guide you on using hex editors or patching tools

### Recommended Workflow with Claude:

1. **You:** Run decompilation tool (Ghidra/da65/IDA)
2. **You:** Export disassembly or decompiled code to text file
3. **You:** Share the file with me
4. **Me:** Analyze code, explain functionality, identify patterns
5. **Together:** Document findings, reverse engineer algorithms
6. **Me:** Generate documentation, create architecture diagrams

---

## Recommended Approach

### For Maximum Understanding:

**1. Start with Ghidra (Free & Powerful):**
   - Best tool for both platforms (after extracting C64 ROM)
   - Has decompiler for both 6502 and x86
   - Free and well-documented

**2. Complement with Dynamic Analysis:**
   - VICE monitor for C64 (watch code execute)
   - DOSBox debugger for DOS (trace system calls)

**3. Use Claude for Analysis:**
   - Export sections of interest from Ghidra
   - I'll help explain what the code does
   - Together we'll document the game's internals

### Preservation Best Practices:

1. **Never modify original archive folders**
2. **Create working directories:**
   ```
   /analysis/
     /c64/
       /disassembly/
       /notes/
     /dos/
       /disassembly/
       /notes/
   ```
3. **Version control your analysis:**
   - Git track your disassembly annotations
   - Keep original binaries in read-only archive folders
4. **Document everything:**
   - Function purposes
   - Data structure layouts
   - Memory maps
   - File formats

---

## Quick Start Commands

### C64 Path:
```bash
# Install VICE emulator
# Run game with monitor
x64sc C64-remake/Supremacy_aka_Overlord_+8D_[ExCeSs].crt
# Alt+H opens monitor
# Use 'd' command to disassemble
```

### DOS Path:
```bash
# Download Ghidra from https://ghidra-sre.org/
# Import MS-Dos/Overlord_DOS_EN/game.exe
# Let it analyze
# Press 'F5' on functions to see decompiled C code
```

---

## Additional Resources

- **Ralf Brown's Interrupt List:** http://www.ctyme.com/intr/rb-0000.htm
- **OSDev Wiki:** https://wiki.osdev.org/ (x86 hardware reference)
- **C64 KERNAL ROM Disassembly:** https://skoolkid.github.io/sk6502/c64rom/
- **6502 Instruction Reference:** http://www.6502.org/tutorials/6502opcodes.html
- **x86 Instruction Reference:** https://www.felixcloutier.com/x86/

---

## Next Steps

1. Choose your platform (C64 or DOS, or both)
2. Install recommended tools
3. Extract/analyze a small section first
4. Share your findings with Claude for interpretation
5. Build up documentation iteratively
