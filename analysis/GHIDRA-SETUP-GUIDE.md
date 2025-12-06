check my java version# Ghidra Setup Guide - Simple Step-by-Step

**Don't be intimidated!** Ghidra is pre-built and ready to use. No compilation required.

## What You Need

- **Java 17 or newer** (Ghidra runs on Java)
- **Ghidra download** (one program handles both C64 and DOS)
- **About 1GB of disk space**
- **Windows/Mac/Linux** (works on all platforms)

---

## Step 1: Install Java (if you don't have it)

### Check if you already have Java:

Open Command Prompt (Windows) or Terminal (Mac/Linux) and type:
```bash
java -version
```

**If you see version 17 or higher:** ✅ You're good, skip to Step 2

**If you get an error or version is older than 17:**

1. Go to: https://adoptium.net/
2. Click the big download button for your operating system
3. Run the installer (it's straightforward - just click "Next")
4. Verify installation: `java -version` (should now show 17+)

---

## Step 2: Download Ghidra (Pre-Built - No Compilation!)

1. **Go to:** https://github.com/NationalSecurityAgency/ghidra/releases
2. **Find the latest release** (currently 11.2.1 or newer)
3. **Download:** `ghidra_11.x.x_PUBLIC_xxxxxxxx.zip`
   - This is a ZIP file, NOT source code
   - It's already built and ready to run
   - Size: ~500MB

4. **Extract the ZIP:**
   - Right-click → Extract All
   - Put it somewhere convenient like `C:\Tools\ghidra` or `~/Tools/ghidra`

---

## Step 3: Run Ghidra

### Windows:
```bash
cd C:\Tools\ghidra_11.x.x_PUBLIC
ghidraRun.bat
```

Or just double-click `ghidraRun.bat` in File Explorer

### Mac/Linux:
```bash
cd ~/Tools/ghidra_11.x.x_PUBLIC
./ghidraRun
```

**First launch:** Might take 30 seconds to start. A window will appear asking you to agree to license - click "I Agree"

✅ **You're now running Ghidra!** It supports both 6502 (C64) and x86 (DOS) automatically.

---

## Step 4: Create Your First Project

When Ghidra opens:

1. **File → New Project**
2. Choose "Non-Shared Project" → Next
3. **Project Name:** `Overlord-Analysis`
4. **Project Directory:** `C:\dev\GIT\Overlord\analysis\ghidra-project`
5. Click **Finish**

---

## Step 5: Import the DOS Game (Easiest First)

1. **In Ghidra:** Click the **dragon icon** (Import File) or press **I**
2. **Navigate to:** `C:\dev\GIT\Overlord\MS-Dos\Overlord_DOS_EN\game.exe`
3. **Select it** and click **Select File to Import**

**Ghidra automatically detects:**
- Format: MS-DOS Executable (MZ)
- Language: x86:Real Mode:16:default ✅

4. Click **OK** (accept defaults)
5. **Import Results Summary** appears → Click **OK**

---

## Step 6: Analyze the DOS Game

1. **Double-click** `game.exe` in the project window
2. A **"Analyze" dialog** appears asking if you want to analyze now
3. Click **Yes**
4. **Analysis Options** window appears with many checkboxes
   - **Just click "Analyze"** (defaults are fine for now)
5. Wait 30 seconds - 2 minutes while it analyzes
6. **Green progress bar** at bottom-right shows progress

✅ **Done! You can now explore the disassembly**

---

## Step 7: Your First Look at the Code

After analysis completes:

### Left Panel (Program Trees):
- Shows memory layout and sections

### Center Panel (Listing):
- Shows disassembly - this is the actual game code in assembly!
- Scroll through to see x86 assembly instructions

### Right Panel (Decompiler):
- This is the magic! Shows C-like pseudocode
- **To use it:**
  1. In the center panel, click on any function name (shown in blue)
  2. Press **F5** or click Window → Decompiler
  3. See the code translated to C-like syntax!

### Example:
If you see assembly like:
```asm
MOV AX, 0x1234
PUSH AX
CALL FUN_1000
```

The decompiler might show:
```c
void some_function(void) {
    call_function(0x1234);
}
```

---

## Step 8: Export Code to Share with Me

Once you find interesting sections:

1. **Right-click in the Decompiler window** (right panel)
2. **Copy** or **Export**
3. Paste into a text file like `analysis/dos/interesting_function_1.txt`
4. Share with me and I'll explain what it does!

Or:

1. **File → Export Program**
2. Choose format: **ASCII** or **HTML**
3. Exports entire disassembly to file
4. Share sections with me

---

## For C64 (Slightly More Steps)

The C64 version requires extracting ROM from the cartridge first. Don't worry about this yet - let's start with DOS since it's simpler. Once you're comfortable with Ghidra on the DOS version, I'll guide you through the C64 extraction.

---

## Common Issues and Solutions

### "Java not found" error:
- Make sure Java 17+ is installed
- Windows: Add Java to PATH (installer usually does this)
- Try closing and reopening Command Prompt

### Ghidra won't start:
- Make sure you extracted the ZIP completely
- Check you're running `ghidraRun.bat` not something else
- Try running as Administrator (Windows)

### "Out of memory" error:
- Edit `support/launch.properties`
- Find line: `MAXMEM=2G`
- Change to: `MAXMEM=4G` (if you have 8GB+ RAM)

### Can't find decompiler window:
- Press **F5** or go to **Window → Decompiler**
- Make sure you've clicked on a function first

---

## What to Explore First

1. **Look for strings:**
   - Search → For Strings
   - You'll see game text, error messages, etc.
   - Double-click any string to see where it's used

2. **Find the entry point:**
   - Look for `entry` label in the Listing
   - This is where the program starts
   - Press F5 to see decompiled version

3. **Explore functions:**
   - Window → Functions
   - Lists all detected functions
   - Click any to jump to it

---

## Next Steps After Setup

1. ✅ Get Ghidra running
2. ✅ Import game.exe
3. ✅ Run analysis
4. 🔍 Explore the code
5. 📤 Export interesting sections
6. 💬 Share with Claude (me!) for explanation

---

## I Can Help With:

- **Installation problems:** Share error messages and I'll troubleshoot
- **Step-by-step guidance:** Tell me where you're stuck
- **Understanding the UI:** Describe what you see and I'll explain
- **Finding interesting code:** Tell me what you want to understand (AI logic? Graphics? Sound?)
- **Explaining disassembly:** Share code snippets and I'll interpret them
- **Writing Ghidra scripts:** Automate repetitive analysis tasks

---

## Alternative: Even Simpler Option

If Ghidra still feels like too much, we can start with:

**DOSBox Debugger** (simpler but less powerful):
1. Download DOSBox-X: https://dosbox-x.com/
2. Run: `dosbox-x game.exe`
3. Press Alt+Pause to enter debugger
4. See code execute in real-time
5. Much simpler but only shows assembly (no decompiler)

Let me know which approach you prefer!

---

## My Commitment

I will guide you through **every single step**. Just tell me:
- Where you are in the process
- What you see on screen
- Any error messages

We'll get this working together!
