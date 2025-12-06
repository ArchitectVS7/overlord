# Analysis Directory

This directory contains all decompilation and reverse engineering work.

**Original archives remain untouched in:**
- `../C64-remake/` - DO NOT EDIT
- `../MS-Dos/` - DO NOT EDIT

## Structure

- **c64/** - C64 analysis work
  - Extracted ROM files
  - Disassembly output
  - Documentation and notes

- **dos/** - MS-DOS analysis work
  - Disassembly output
  - Documentation and notes

- **ghidra-projects/** - Ghidra project files
  - Contains Ghidra's database and analysis data
  - Can be safely deleted and recreated if needed

## Workflow

1. Import binaries from archive directories (read-only)
2. All analysis work stays in this `analysis/` directory
3. Original files never modified
