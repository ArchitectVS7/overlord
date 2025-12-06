# Interactive Analysis Plan - PLC-Style Debugging Approach

**Goal:** Incrementally understand and comment decompiled code by observing runtime behavior

**Inspired by:** Controls engineering - reverse engineering uncommented PLC ladder logic

---

## The PLC Analogy

### How PLC Reverse Engineering Works:

```
Known Input → Observe Logic → Identify Output → Comment All Three → Repeat
```

**Example:**
1. **Find:** Photoeye PE-1 (known hardware input)
2. **Trace:** Feeds into Timer T-1 (observe 500ms)
3. **Infer:** Debounce timer (from timing behavior)
4. **Trace:** Timer output enables Conveyor Motor (observe start)
5. **Comment:** All three with meaningful names
6. **Repeat:** Follow conveyor motor logic to next components

### Apply to Game Decompilation:

```
Known I/O → Observe Behavior → Map to Code → Comment → Expand Outward
```

**Example:**
1. **Action:** Click "Start Game" button (known input)
2. **Observe:** Game loads graphics, music starts (outputs)
3. **Debug:** Set breakpoint, see what code runs
4. **Map:** Function FUN_1000_1234 handles button click
5. **Comment:** Rename to "handle_start_button_click"
6. **Trace:** See it calls FUN_1000_5678 → "load_game_graphics"
7. **Repeat:** Follow each function call deeper

---

## Approach 1: Runtime Debugging + Manual Commenting

### Tools Needed

**For MS-DOS:**
- DOSBox-X (has integrated debugger)
- Or DOSBox + external debugger
- Decompiled source open in editor

**For C64:**
- VICE emulator with monitor
- Decompiled source open in editor

### Workflow

#### Phase 1: Map Known I/O

**Input Events:**
- Keyboard keys pressed
- Mouse clicks
- Joystick movements (C64)

**Output Events:**
- Graphics changes (screen updates)
- Sound effects / music
- Disk/file access

**Hardware Addresses:**
- DOS: INT calls (INT 21h file, INT 10h video, INT 16h keyboard)
- C64: Memory-mapped I/O ($D000-$DFFF ranges)

#### Phase 2: Interactive Session

**Process:**
```
1. Start game in debugger
2. Set breakpoint on known I/O
   - DOS: INT 21h for file read
   - C64: $DE00 for bank switch
3. Trigger event (click button, press key)
4. Debugger breaks → see code address
5. Find that address in decompiled code
6. Add comment: "// Triggered by: [action]"
7. Trace forward to outputs
8. Trace backward to inputs
9. Comment all related functions
10. Resume, trigger next event
```

---

## Approach 2: Static Analysis by AI (Me!)

### What I Can Identify Without Runtime

I can analyze the decompiled code and identify patterns:

#### MS-DOS I/O Patterns

**File I/O (INT 21h):**
```c
// I can find this pattern:
void some_function() {
    // ...
    func_0x00012345();  // Indirect call to DOS interrupt
    // ...
}

// And comment it as:
void load_graphics_file() {  // RENAMED
    // INT 21h, AH=3Dh - Open file
    // Likely loading .BIN or .GPH file
    func_0x00012345();
}
```

**Video Output (INT 10h):**
```c
// Pattern: Writing to video memory or BIOS calls
void update_screen() {  // RENAMED
    // INT 10h - Video services
    // Setting video mode or drawing graphics
}
```

**Keyboard Input (INT 16h):**
```c
// Pattern: Polling for keyboard
void check_keyboard() {  // RENAMED
    // INT 16h - Keyboard services
    // Returns scan code in AX
}
```

#### C64 I/O Patterns

**VIC-II Graphics ($D000-$D3FF):**
```c
// I can find memory writes to $D000 range:
void setup_graphics() {  // RENAMED
    *(byte*)0xD011 = 0x3B;  // VIC-II control register
    *(byte*)0xD016 = 0xC8;  // Horizontal scrolling
    *(byte*)0xD018 = 0x18;  // Memory pointers
    // This is configuring VIC-II graphics chip
}
```

**SID Sound ($D400-$D7FF):**
```c
void play_sound_effect() {  // RENAMED
    *(byte*)0xD400 = freq_low;   // SID voice 1 frequency low
    *(byte*)0xD401 = freq_high;  // SID voice 1 frequency high
    *(byte*)0xD404 = 0x21;        // SID voice 1 control
    // Playing sound effect on SID chip
}
```

**CIA Keyboard ($DC00):**
```c
byte read_keyboard() {  // RENAMED
    return *(byte*)0xDC00;  // CIA port A - keyboard matrix
    // Reading keyboard state
}
```

**EasyFlash Bank Switch ($DE00):**
```c
void switch_to_bank(byte bank_num) {  // RENAMED
    *(byte*)0xDE00 = bank_num;  // EasyFlash bank register
    // Switching ROM bank to access different code/data
}
```

---

## Systematic Analysis Process

### Step 1: I/O Inventory (Static Analysis)

Let me scan the decompiled code and create:

**DOS version - I/O Map:**
```
Function FUN_1000_1234:
  - Reads file at offset 0x5678
  - Pattern: INT 21h, AH=3Fh (Read File)
  - Comment: "// File read - likely .BIN graphics"

Function FUN_1000_5678:
  - Writes to video memory
  - Pattern: Direct memory write 0xB800:xxxx
  - Comment: "// VGA text mode output"

Function FUN_1000_9ABC:
  - Polls keyboard
  - Pattern: INT 16h, AH=01h
  - Comment: "// Check if key pressed"
```

**C64 version - Hardware Access Map:**
```
Function FUN_8000:
  - *(byte*)0xD020 writes
  - Comment: "// Border color change"

Function FUN_8123:
  - *(byte*)0xDE00 writes
  - Comment: "// Bank switching - loading new code/data"

Function FUN_8456:
  - *(byte*)0xD400 writes
  - Comment: "// SID sound initialization"
```

### Step 2: Trace Data Flow

**From I/O outward:**
```
Input:  Keyboard scan → FUN_check_key → FUN_process_input → FUN_game_logic
Output: Game state → FUN_render → FUN_write_screen → VGA memory

Comments added:
FUN_check_key       → "read_keyboard_state"
FUN_process_input   → "handle_user_input"
FUN_game_logic      → "update_game_state"
FUN_render          → "render_game_screen"
FUN_write_screen    → "write_to_vga_buffer"
```

### Step 3: Interactive Validation

**You can verify my analysis:**
```
1. I identify: "Function FUN_8456 writes to $D400 (SID)"
2. I comment: "// play_sound_effect_1"
3. You test: Run game in VICE, set breakpoint at 8456
4. You trigger: Do action that should play sound
5. Breakpoint hits? ✓ Correct!
6. No sound? → I misidentified, iterate
```

---

## Practical Implementation

### Automated Comment Generation Script

I can create a Ghidra script that:

```python
# analyze_io_patterns.py - Ghidra script

def analyze_dos_patterns():
    """Find DOS interrupt patterns and add comments"""

    # Find INT 21h calls
    for ref in find_interrupt_calls(0x21):
        addr = ref.getFromAddress()
        ah_value = get_register_value(addr, "AH")

        if ah_value == 0x3D:
            add_comment(addr, "DOS: Open file (INT 21h, AH=3Dh)")
            rename_function(addr, "open_file")

        elif ah_value == 0x3F:
            add_comment(addr, "DOS: Read file (INT 21h, AH=3Fh)")
            rename_function(addr, "read_file")

        # ... more patterns

def analyze_c64_patterns():
    """Find C64 hardware I/O and add comments"""

    # Find VIC-II writes
    for ref in find_memory_writes(0xD000, 0xD3FF):
        addr = ref.getFromAddress()
        target = ref.getToAddress().getOffset()

        if target == 0xD020:
            add_comment(addr, "VIC-II: Border color")

        elif target == 0xD021:
            add_comment(addr, "VIC-II: Background color")

        # ... more registers

    # Find SID writes
    for ref in find_memory_writes(0xD400, 0xD7FF):
        add_comment(addr, "SID: Sound chip access")
        rename_function(addr, "sound_routine")
```

### Interactive Debugging Guide

**DOSBox-X Setup:**
```bash
# 1. Install DOSBox-X (has built-in debugger)
# 2. Run game:
dosbox-x game.exe

# 3. Open debugger (Alt+Pause or from menu)
# 4. Set breakpoint:
bp 1000:1234

# 5. Continue execution:
c

# 6. When you click button/press key, debugger breaks
# 7. Note the address shown
# 8. Find that address in decompiled code
# 9. Add comment about what triggered it
```

**VICE Monitor Setup:**
```bash
# 1. Run VICE with cartridge
x64sc Supremacy_aka_Overlord_+8D_[ExCeSs].crt

# 2. Open monitor (Alt+H)
# 3. Set breakpoint:
break 8000

# 4. Continue:
x

# 5. When triggered, see:
# - PC (program counter) - where we are
# - Registers (A, X, Y)
# - Stack
# 6. Map PC address to decompiled code
# 7. Add comment
```

---

## Collaborative Workflow

### You + Me + Debugger

**Iterative Process:**

**Round 1: Static Analysis (Me)**
```
1. I scan decompiled code
2. I identify I/O patterns
3. I generate initial comments
4. I create "hypothesis" document:
   - "FUN_1234 probably loads graphics"
   - "FUN_5678 probably handles mouse clicks"
```

**Round 2: Runtime Verification (You)**
```
1. You run game in debugger
2. You test my hypotheses
3. You report back: "Correct!" or "Wrong, it actually does X"
4. We iterate
```

**Round 3: Refinement (Both)**
```
1. I update comments based on your findings
2. I trace deeper into confirmed functions
3. You test new hypotheses
4. We build up complete understanding
```

---

## Example Session

### DOS Game - Button Click Analysis

**My Static Analysis:**
```c
// From game.exe.c line 1234
void FUN_1000_1234(void) {
    int mouse_x = *(int*)0x2400;
    int mouse_y = *(int*)0x2402;

    if (mouse_x > 100 && mouse_x < 200 &&
        mouse_y > 50 && mouse_y < 100) {
        FUN_1000_5678();
    }
}

// My hypothesis: This checks if mouse clicked in rectangle
// Likely a button at screen position (100-200, 50-100)
```

**Your Verification:**
```
1. Run in DOSBox debugger
2. Set breakpoint: bp 1000:1234
3. Click "Start Game" button (you know where it is visually)
4. Breakpoint hits!
5. Confirm: Button IS at (100-200, 50-100) on screen
6. Report back: "Confirmed - this is Start Game button handler"
```

**My Refinement:**
```c
// UPDATED based on verification
void handle_start_button_click(void) {  // RENAMED
    int mouse_x = *(int*)0x2400;
    int mouse_y = *(int*)0x2402;

    // Start Game button bounds: (100,50) to (200,100)
    if (mouse_x > 100 && mouse_x < 200 &&
        mouse_y > 50 && mouse_y < 100) {
        initialize_new_game();  // RENAMED from FUN_1000_5678
    }
}
```

---

## Deliverables

### Commented Source Files

**Target output:**
```c
// === GAME INITIALIZATION ===

void game_entry_point(void) {  // Renamed from entry()
    setup_dos_memory();         // Renamed from FUN_1000_0001
    detect_video_hardware();    // Renamed from FUN_1000_0045
    load_graphics_for_mode();   // Renamed from FUN_1000_0123
    initialize_game_state();    // Renamed from FUN_1000_0789
    enter_main_game_loop();     // Renamed from FUN_1000_1000
}

// === VIDEO HARDWARE ===

void detect_video_hardware(void) {
    // INT 10h, AX=1A00h - Get display combination
    // Returns:
    //   BL = active display code
    //   BH = alternate display code

    byte display_type = bios_detect_video();  // INT 10h call

    if (display_type == 0x08) {
        current_mode = VIDEO_MODE_VGA;  // VGA detected
    } else if (display_type == 0x07) {
        current_mode = VIDEO_MODE_EGA;  // EGA detected
    }
    // ... etc
}
```

### I/O Map Document

**Hardware Access Reference:**
```markdown
# MS-DOS I/O Map

## File Access
| Address | Function | Purpose |
|---------|----------|---------|
| 1000:1234 | open_graphics_file | Opens .BIN file |
| 1000:5678 | read_graphics_data | Reads into buffer |

## Video Output
| Address | Function | Purpose |
|---------|----------|---------|
| 1000:9ABC | set_vga_mode | Mode 13h (320x200x256) |
| 1000:DEF0 | draw_sprite | Blits sprite to screen |

## Input Handling
| Address | Function | Purpose |
|---------|----------|---------|
| 1000:2345 | read_mouse_pos | INT 33h - mouse position |
| 1000:6789 | check_keyboard | INT 16h - key state |
```

---

## Next Steps - Ready to Start?

### Option A: I Start Static Analysis

**I can begin now:**
1. Scan both decompiled files
2. Identify all I/O patterns
3. Generate initial comments
4. Create hypothesis document
5. You verify with debugger

### Option B: You Start Runtime Analysis

**You lead:**
1. Run game in debugger
2. Document what happens when
3. Share findings with me
4. I map to decompiled code
5. I generate comments

### Option C: Hybrid Approach (Recommended)

**Best of both:**
1. **I do:** Static I/O pattern analysis
2. **You do:** High-level gameplay observation
3. **Together:** Map observations to code
4. **I do:** Generate commented version
5. **You do:** Verify with targeted debugging
6. **Iterate:** Refine until complete

---

## Tools I'll Create

**If you want to proceed, I can build:**

1. **io_analyzer.py** - Ghidra script to auto-comment I/O
2. **function_renamer.py** - Batch rename based on patterns
3. **debugger_guide.md** - Step-by-step DOSBox/VICE debugging
4. **hypothesis_map.md** - My guesses for you to verify
5. **commented_source/** - Fully annotated decompiled code

**Ready to start? Which approach do you prefer?**
