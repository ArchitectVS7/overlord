# Lessons Learned - Overlord Decompilation Project

**Project:** Retro Game Decompilation (Overlord/Supremacy - C64 & MS-DOS)
**Date:** December 2025
**Team:** Developer + Claude Code (AI Assistant)

---

## Executive Summary

Successfully decompiled both C64 (6502) and MS-DOS (x86) versions of classic game using Ghidra with a combination of GUI and automated headless analysis.

**Key Achievement:** Demonstrated that AI-assisted headless tooling can be more efficient than manual GUI work.

---

## Project Setup Pattern

### Initial Repository Assessment

**Best Practice:** Start with exploration, not assumptions
- Use `/init` to create CLAUDE.md with project context
- Document archive directories as read-only
- Create separate `analysis/` workspace for all work
- Never modify original binaries

**Template Structure:**
```
project-root/
├── archives/           # Original files (READ ONLY)
│   ├── version-a/
│   └── version-b/
├── analysis/           # All work happens here
│   ├── version-a/
│   │   ├── extracted/
│   │   ├── decompiled/
│   │   └── notes/
│   └── version-b/
└── docs/              # Generated documentation
```

---

## Tool Selection & Setup

### Ghidra Headless vs GUI

**Lesson:** Don't assume GUI is better for everything.

**When to use GUI:**
- First-time exploration
- Single file, straightforward format
- Interactive analysis needed
- Learning the tool

**When to use Headless:**
- Multiple files to process
- Repeatable workflow
- Automation desired
- AI assistant can verify results immediately

**Pattern Discovered:**
1. User: "I'm intimidated by compilation"
2. Claude: "No compilation needed! Pre-built binaries"
3. User: "Manual clicking is tedious"
4. Claude: "Let's script it!"
5. Result: Faster, repeatable, verifiable

**Reusable Approach:**
- Create Python script for data extraction
- Create Ghidra Python/Jython script for analysis
- Use `analyzeHeadless.bat` with `-postScript`
- AI can read results and iterate if needed

---

## Architecture-Specific Patterns

### Multi-Architecture Projects

**Challenge:** Same game, two completely different CPUs (6502 vs x86)

**Solution Pattern:**
- Separate Ghidra projects per architecture
- Avoid memory space conflicts
- Use consistent directory structure
- Document differences in comparative analysis

**Why It Matters:**
- Trying to import both in one project causes conflicts
- Each architecture has different memory maps
- Keep analysis isolated, compare findings later

---

## Container Format Handling

### When Binaries Are Wrapped

**Pattern:** Proprietary container formats (like .crt cartridge files)

**Approach:**
1. **Don't fight the tool** - If Ghidra doesn't understand the format, extract first
2. **Write extraction script** - Python is perfect for binary parsing
3. **Document the format** - Future you (or AI) will thank you
4. **Automate everything** - Scripts are documentation

**Example:**
- .crt file = 64-byte header + multiple CHIP packets
- Each CHIP = 16-byte header + ROM data
- Extract to individual .bin files
- Import those into Ghidra

**Reusable Script Pattern:**
```python
def extract_container(input_file, output_dir):
    """Parse binary container, extract contents"""
    # Read header
    # Parse structure
    # Extract payloads
    # Save with meaningful names
    # Print summary
```

---

## Automation & AI Collaboration

### The "Fire Off Script" Pattern

**Discovery:** User preference for automation over manual steps

**Workflow:**
1. AI writes script
2. AI executes script
3. AI verifies results immediately
4. AI iterates if needed (without user intervention)

**Benefits:**
- Faster than GUI clicking
- Repeatable
- Verifiable
- Documented (the script IS documentation)

**Ghidra Headless Pattern:**
```bash
analyzeHeadless <project_dir> <project_name> \
  -import <file> \
  -processor <arch> \
  -loader <loader> \
  -loader-baseAddr <addr> \
  -postScript <script.py> \
  -deleteProject
```

**Key Parameters:**
- `-processor`: 6502:LE:16:default or x86:LE:16:default
- `-loader-baseAddr`: Memory address in hex (e.g., 0x8000)
- `-deleteProject`: Don't accumulate temp projects
- `-postScript`: Your analysis/export script

---

## Error Recovery Patterns

### Memory Block Conflicts

**Error:** "Failed to add language defined memory block due to conflict: ZERO_PAGE"

**Root Cause:** Trying to import different architectures in same project

**Solution:** Separate projects per architecture

**Reusable Fix:**
- One project: "ProjectName-x86"
- One project: "ProjectName-6502"
- Never mix architectures

### Import Option Checkboxes

**Error:** Same memory block error

**Root Cause:** "Apply Processor Defined Labels" checkbox creates standard memory regions

**Solution:** Uncheck these when importing raw binaries:
- ☐ Apply Processor Defined Labels
- ☐ Anchor Processor Defined Labels

**When to Use:** Only uncheck for raw binary imports at specific addresses

---

## Documentation Strategy

### Multi-Layered Documentation

**Pattern:** Different docs for different audiences

**Created:**
1. **CLAUDE.md** - AI assistant guidance (future sessions)
2. **DECOMPILATION-GUIDE.md** - Complete reference (humans)
3. **GHIDRA-SETUP-GUIDE.md** - Step-by-step tutorial (beginners)
4. **FILE-BREAKDOWN.md** - File-by-file analysis (both versions)
5. **DECOMPILATION-SUCCESS.md** - Results summary (stakeholders)
6. **LESSONS-LEARNED.md** - This file (knowledge transfer)

**Why Each Matters:**
- CLAUDE.md: Enables future AI to be productive immediately
- Guides: Reduce friction for new contributors
- Success doc: Shows what was accomplished
- Lessons: Captures institutional knowledge

---

## Common Pitfalls & Solutions

### 1. Java PATH Issues

**Problem:** Ghidra can't find Java
**Solution:** Set JAVA_HOME and PATH in script:
```bash
export JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-25.0.1.8-hotspot"
export PATH="$JAVA_HOME\bin:$PATH"
```

### 2. Empty Decompilation Output

**Problem:** Export produces tiny file (42 bytes vs expected KB)
**Cause:** No functions detected during analysis
**Solution:** Force disassembly and function creation in script:
```python
from ghidra.app.cmd.disassemble import DisassembleCommand
from ghidra.app.cmd.function import CreateFunctionCmd

disassemble_cmd = DisassembleCommand(start_addr, None, True)
disassemble_cmd.applyTo(currentProgram, monitor)

func_cmd = CreateFunctionCmd(start_addr)
func_cmd.applyTo(currentProgram, monitor)
```

### 3. Screenshot Communication

**Pattern:** User can't share screen, uses screenshots instead
**Solution:** Read screenshot files with Read tool
**Benefit:** AI can see exact UI state, provide precise guidance

---

## Success Metrics

### What Worked

✅ **Ghidra headless automation** - Faster than GUI
✅ **Python extraction scripts** - Reusable, documented
✅ **Iterative script refinement** - AI fixes errors automatically
✅ **Archive protection** - Never touched originals
✅ **Comprehensive docs** - Future-proofed the project

### What Could Improve

⚠️ **Initial intimidation** - User worried about "compilation"
- **Fix:** Better initial explanation of pre-built tools
- **Learning:** Assume less technical knowledge upfront

⚠️ **GUI-first assumption** - Started with manual clicking
- **Fix:** Assess automation potential earlier
- **Learning:** Ask "Would you prefer manual or automated?"

---

## Reusable Patterns for Future Projects

### 1. Multi-Platform Binary Analysis

**When:** Analyzing same software on different architectures

**Template:**
```
analysis/
├── platform-a/
│   ├── extracted/
│   ├── platform_a_main.c
│   └── notes.md
├── platform-b/
│   ├── extracted/
│   ├── platform_b_main.c
│   └── notes.md
└── comparative-analysis.md
```

### 2. Container Format Extraction

**When:** Binary wrapped in proprietary format

**Script Template:**
```python
#!/usr/bin/env python3
"""Extract contents from <format> container"""

def parse_header(data):
    """Parse container header"""
    pass

def extract_payload(data, offset, size):
    """Extract individual payload"""
    pass

def main(input_file, output_dir):
    """Main extraction logic"""
    # Read file
    # Parse header
    # Extract payloads
    # Save with meaningful names
    # Print summary
```

### 3. Headless Ghidra Analysis

**When:** Automating decompilation workflow

**Script Template:**
```python
# Ghidra headless analysis template

from ghidra.app.decompiler import DecompInterface
from ghidra.util.task import ConsoleTaskMonitor
from ghidra.app.cmd.disassemble import DisassembleCommand
from ghidra.app.cmd.function import CreateFunctionCmd

def analyze():
    monitor = ConsoleTaskMonitor()
    addr_factory = currentProgram.getAddressFactory()
    start_addr = addr_factory.getAddress("XXXX")  # Entry point

    # Force disassembly
    disassemble_cmd = DisassembleCommand(start_addr, None, True)
    disassemble_cmd.applyTo(currentProgram, monitor)

    # Create entry function
    func_cmd = CreateFunctionCmd(start_addr)
    func_cmd.applyTo(currentProgram, monitor)

    # Decompile
    decompiler = DecompInterface()
    decompiler.openProgram(currentProgram)

    # Export results
    # ... (custom export logic)

analyze()
```

### 4. Archive Protection Pattern

**When:** Working with irreplaceable original files

**Structure:**
```
archives/          # READ ONLY - Git tracked
  ├── .gitignore   # Ensure contents tracked
  └── originals/
analysis/          # WORK HERE - Can be regenerated
  ├── .gitignore   # Don't commit large decompiled files
  └── work/
.gitignore         # Root level
```

**Root .gitignore:**
```
analysis/*/decompiled/*.c   # Too large
analysis/*/temp/            # Temporary
!archives/**                # Force include archives
```

---

## Knowledge Transfer Checklist

For future similar projects:

- [ ] Create CLAUDE.md from day one
- [ ] Establish archive vs work directories upfront
- [ ] Ask about automation preference early
- [ ] Use screenshots for UI troubleshooting
- [ ] Write extraction scripts in Python
- [ ] Use Ghidra headless when appropriate
- [ ] Create layered documentation
- [ ] Separate projects per architecture
- [ ] Verify results immediately after automation
- [ ] Document lessons learned

---

## Technology Stack Reference

**For retro game/software decompilation:**

**Essential:**
- Ghidra (free, multi-architecture decompiler)
- Python 3 (scripting, extraction)
- Java 17+ (Ghidra runtime)

**Platform-Specific:**
- DOSBox (MS-DOS emulation/debugging)
- VICE (C64 emulation/debugging)

**Documentation:**
- Markdown (GitHub-flavored)
- Git (version control)

**AI Collaboration:**
- Claude Code (CLI)
- Screenshot sharing (Read tool)
- Automated scripting

---

## ROI Analysis

**Time Investment:**
- Setup: ~1 hour (Ghidra install, Java setup)
- DOS decompilation: ~30 minutes (mostly waiting)
- C64 extraction: ~1 hour (script writing, debugging)
- C64 decompilation: ~30 minutes (automation)
- Documentation: ~2 hours (comprehensive docs)
**Total:** ~5 hours

**Value Delivered:**
- Complete source code access (both platforms)
- Reusable automation scripts
- Comprehensive documentation
- Knowledge transfer artifacts
- Foundation for further analysis

**Multiplier Effect:**
- Scripts reusable for other ROMs/executables
- Patterns applicable to any binary analysis
- Documentation template for future projects

---

## Next Project Recommendations

**Apply These Patterns To:**
1. Other retro game decompilation
2. Firmware analysis (IoT, embedded)
3. Proprietary file format reverse engineering
4. Legacy software understanding
5. Security vulnerability research

**Key Insight:**
The combination of AI assistance + headless automation + comprehensive documentation creates a force multiplier for reverse engineering work.

---

## Contact & Continuation

**For Future AI Sessions:**
Read CLAUDE.md first - it contains:
- Project structure
- Archive protection rules
- Tool locations
- Decompilation status
- Next steps

**For Humans:**
Start with DECOMPILATION-GUIDE.md for complete reference.

**For New Similar Projects:**
Use this LESSONS-LEARNED.md as template - adapt patterns to your specific needs.
