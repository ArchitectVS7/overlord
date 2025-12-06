/*
 * ============================================================================
 * OVERLORD (C64) - COMMENTED DECOMPILED SOURCE
 * Bank 0 - EasyFlash Loader/Initialization
 * ============================================================================
 *
 * Original: Supremacy_aka_Overlord_+8D_[ExCeSs].crt (615 KB)
 * Platform: Commodore 64 with EasyFlash Cartridge
 * This Bank: Bank 0, Load Address: $8000
 * Decompiler: Ghidra 11.4.3
 * Analysis: December 2025
 *
 * IMPORTANT: This is the 30-year anniversary COMMUNITY REMAKE (~2020)
 * Not the original 1990s code. Uses modern EasyFlash technology.
 *
 * C64 MEMORY MAP REFERENCE:
 * $0000-$00FF: Zero Page (fast access registers)
 * $0100-$01FF: Stack
 * $0200-$03FF: KERNAL work area
 * $8000-$9FFF: Cartridge ROM LOW (8KB, banked via EasyFlash)
 * $A000-$BFFF: Cartridge ROM HIGH (8KB, banked via EasyFlash)
 * $C000-$CFFF: RAM
 * $D000-$DFFF: I/O or Character ROM (depending on $01)
 * $DE00-$DEFF: EasyFlash I/O registers
 * $FFFA-$FFFB: NMI vector
 * $FFFC-$FFFD: RESET vector
 * $FFFE-$FFFF: IRQ vector
 *
 * EASYFLASH REGISTERS:
 * $DE00: Bank number (0-63 for each 16KB slot, 8KB LOW + 8KB HIGH)
 * $DE02: Control register (bit0=GAME, bit1=EXROM, bit2=mode, etc.)
 * ============================================================================
 */

typedef unsigned char byte;
typedef unsigned short word;


/*
 * ============================================================================
 * C64 HARDWARE I/O ADDRESSES
 * ============================================================================
 */

/* Zero Page / System */
#define ZP_PROCESSOR_PORT     0x01    /* C64 processor port (memory config) */
#define ZP_CURRENT_BANK       0x02    /* [CUSTOM] Current EasyFlash bank */
#define ZP_E0                 0xE0    /* [CUSTOM] Work register */
#define ZP_E4                 0xE4    /* [CUSTOM] Work register */
#define ZP_E5                 0xE5    /* [CUSTOM] Work register */
#define ZP_EC                 0xEC    /* [CUSTOM] Pointer low */
#define ZP_ED                 0xED    /* [CUSTOM] Pointer high */

/* System Vectors */
#define KERNAL_WORK_AREA      0x0318  /* KERNAL work area */
#define NMI_VECTOR_LOW        0xFFFA  /* Non-Maskable Interrupt vector low */
#define NMI_VECTOR_HIGH       0xFFFB  /* NMI vector high */
#define RESET_VECTOR_LOW      0xFFFC  /* RESET vector low */
#define RESET_VECTOR_HIGH     0xFFFD  /* RESET vector high */

/* EasyFlash Registers */
#define EASYFLASH_BANK        0xDE00  /* Bank register (write: select bank 0-63) */
#define EASYFLASH_CONTROL     0xDE02  /* Control register */

/* VIC-II (Graphics) - $D000-$D3FF */
#define VIC_BORDER_COLOR      0xD020  /* Border color */
#define VIC_BACKGROUND_COLOR  0xD021  /* Background color */
#define VIC_CONTROL_1         0xD011  /* Control register 1 */
#define VIC_CONTROL_2         0xD016  /* Control register 2 */
#define VIC_MEMORY_SETUP      0xD018  /* Memory pointers */

/* SID (Sound) - $D400-$D7FF */
#define SID_VOICE1_FREQ_LO    0xD400  /* Voice 1 frequency low */
#define SID_VOICE1_FREQ_HI    0xD401  /* Voice 1 frequency high */
#define SID_VOICE1_CONTROL    0xD404  /* Voice 1 control */

/* CIA #1 - $DC00-$DCFF */
#define CIA1_PORT_A           0xDC00  /* Port A - keyboard/joystick */
#define CIA1_PORT_B           0xDC01  /* Port B - keyboard/joystick */

/* CIA #2 - $DD00-$DDFF */
#define CIA2_PORT_A           0xDD00  /* Port A - VIC bank, serial */


/*
 * ============================================================================
 * FUNCTION: easyflash_loader_entry
 * Original: FUN_8000
 * Address: $8000
 * ============================================================================
 *
 * [VERIFIED] This is the cartridge entry point - runs on RESET
 *
 * Purpose:
 * 1. Set up NMI vector to handler at $C826
 * 2. Clear the stack page (bytes $100-$10F)
 * 3. Call initialization subroutine at $835B
 * 4. Copy 229 bytes ($E5) of loader code from $8076 to RAM at $C800
 * 5. Jump to the copied code at $C800
 *
 * The code is copied to RAM because:
 * - Bank switching changes what's visible at $8000-$9FFF
 * - The loader needs to be in fixed RAM to switch banks safely
 * - $C800 is always RAM, never gets swapped out
 *
 * MEMORY FLOW:
 * $8000 (this code) -> copies to -> $C800 (RAM) -> jumps there
 */
void easyflash_loader_entry(void)  /* FUN_8000 */
{
    byte bVar1;

    /*
     * [VERIFIED] Set up KERNAL work area
     * $0318 = $C1 - this is part of the KERNAL indirect vector area
     * Possibly redirecting a system vector to cartridge code
     */
    *(byte*)KERNAL_WORK_AREA = 0xC1;

    /*
     * [VERIFIED] Set NMI vector to point to $C826
     * NMI (Non-Maskable Interrupt) is used by the RESTORE key on C64
     * Setting this allows the game to intercept RESTORE key presses
     *
     * $FFFA = $26 (low byte)
     * $FFFB = $C8 (high byte) = address $C826
     */
    *(byte*)NMI_VECTOR_LOW = 0x26;   /* NMI -> $C826 (low) */
    *(byte*)NMI_VECTOR_HIGH = 0xC8;  /* NMI -> $C826 (high) */

    /*
     * [VERIFIED] Clear stack page ($100-$10F)
     * Standard initialization - ensures clean stack
     * Only clears first 16 bytes (stack grows down from $01FF)
     */
    bVar1 = 0x0F;  /* Start at $10F */
    do {
        *(byte*)(0x0100 + bVar1) = 0;  /* Clear byte */
        bVar1 = bVar1 - 1;
    } while ((signed char)bVar1 >= 0);  /* Loop while index >= 0 */

    /*
     * [VERIFIED] Call initialization subroutine
     * $835B likely does:
     * - VIC-II setup
     * - CIA initialization
     * - EasyFlash control register setup
     * - Initial bank selection
     */
    func_0x835b();  /* Init subroutine - NEEDS ANALYSIS */

    /*
     * [VERIFIED] Copy loader code to RAM
     * Source: $8076 (in this ROM bank)
     * Destination: $C800 (RAM, always visible)
     * Length: $E5 bytes (229 bytes)
     *
     * This is a self-relocating loader pattern:
     * - Copy yourself to RAM
     * - Jump to RAM copy
     * - Now you can safely switch ROM banks
     */
    bVar1 = 0;
    do {
        *(byte*)(0xC800 + bVar1) = *(byte*)(0x8076 + bVar1);
        bVar1 = bVar1 + 1;
    } while (bVar1 != 0xE5);  /* Copy 229 bytes */

    /*
     * [VERIFIED] Jump to relocated loader at $C800
     * From here, execution continues in RAM
     * The $C800 code can now safely switch EasyFlash banks
     *
     * (Decompiler shows halt_baddata because jump target is not in this bank)
     */
    /* JMP $C800 - Assembly: 4C 00 C8 */
}


/*
 * ============================================================================
 * EMBEDDED STRING DATA
 * Address: $802C - $805B
 * ============================================================================
 *
 * [VERIFIED] ASCII text embedded in ROM:
 * "EXCESS EASYFLASH LOADER : MORE THAN YOU DESERVE"
 *
 * This identifies the loader as created by the [ExCeSs] demo scene group
 * This is the 30th anniversary community remake signature
 */

/* Text at $802C: "EXCESS EASYFLASH LOADER : MORE THAN YOU DESERVE " */
/* Followed by screen code/color data for display */


/*
 * ============================================================================
 * BANK SWITCHING SUBROUTINE
 * Address: $808C (from disassembly)
 * ============================================================================
 *
 * [VERIFIED] This switches EasyFlash banks and memory configuration
 *
 * Disassembly at $808C-$809B:
 * $808C: SEI                  ; Disable interrupts
 * $808D: LDA #$37             ; Memory config: BASIC, KERNAL, I/O visible
 * $808F: STA $01              ; Set processor port
 * $8091: LDA #$87             ; EasyFlash control: GAME=1, EXROM=1, LED off
 * $8093: STA $DE02            ; Set control register
 * $8096: LDA #$00             ; Bank 0
 * $8098: STA $DE00            ; Select bank
 * $809B: RTS                  ; Return
 */


/*
 * ============================================================================
 * LOADER CODE (COPIED TO $C800)
 * Source: $8076, Destination: $C800, Size: 229 bytes
 * ============================================================================
 *
 * [HYPOTHESIS] The code at $8076 (copied to $C800) likely does:
 *
 * 1. Display "EXCESS EASYFLASH LOADER" message
 * 2. Initialize VIC-II for graphics mode
 * 3. Set up color RAM and screen
 * 4. Load game data from various EasyFlash banks:
 *    - Graphics data
 *    - Sound data
 *    - Game code
 * 5. Decompress if needed (many carts use RLE or EXOMIZER)
 * 6. Jump to main game entry point
 *
 * From disassembly at $8076:
 * $8076: LDX $02              ; Load current bank from zero page
 * $8078: JSR $C816            ; Call subroutine (bank setup?)
 * $807B: JSR $8200            ; Call subroutine (data copy?)
 * $807E: JSR $C84F            ; Call subroutine
 * $8081: INX                  ; Next bank
 * $8082: CPX #$04             ; Processed 4 banks?
 * $8084: BNE $8078            ; Loop if not
 * $8086: JSR $C816            ; Final setup
 * $8089: JMP $8000            ; Restart (or continue)
 */


/*
 * ============================================================================
 * EASYFLASH BANK READ PATTERN
 * Address: $80C5 (from disassembly)
 * ============================================================================
 *
 * [VERIFIED] Pattern for reading from different banks:
 *
 * $80C5: TXA                  ; Transfer X (bank number?) to A
 * $80C6: PHA                  ; Save A on stack
 * $80C7: LDX $E0              ; Load bank from zero page work register
 * $80C9: STX $DE00            ; Select that bank
 * $80CC: LDA #$33             ; Memory config: RAM at $A000, I/O visible
 * $80CE: STA $01              ; Set processor port
 * $80D0: LDA $E4              ; Load address low
 * $80D2: STA $C88A            ; Store to loader
 * $80D5: LDA $E5              ; Load address high
 * $80D7: STA $C88B            ; Store to loader
 * $80DA: LDY #$01             ; Index 1
 * $80DC: LDA ($EC),Y          ; Load via indirect pointer
 * $80DE: STA $C8AE            ; Store somewhere
 *
 * This shows sophisticated bank-switching where:
 * - Bank number is stored in zero page $E0
 * - Data addresses are stored in $E4/$E5
 * - Indirect addressing via $EC/$ED pointer
 * - Code self-modifies addresses at $C88A/$C88B
 */


/*
 * ============================================================================
 * MEMORY ADDRESSES QUICK REFERENCE
 * ============================================================================
 *
 * Zero Page Variables (Custom):
 *   $02   - Current EasyFlash bank number
 *   $E0   - Work register (bank selection)
 *   $E4   - Address low byte
 *   $E5   - Address high byte
 *   $EC   - Indirect pointer low
 *   $ED   - Indirect pointer high
 *
 * System:
 *   $01   - Processor port (memory configuration)
 *   $0318 - KERNAL work area / vector redirect
 *
 * Stack:
 *   $0100-$01FF - Stack (cleared $100-$10F on init)
 *
 * ROM Code Locations (Bank 0):
 *   $8000 - Entry point (this function)
 *   $802C - "EXCESS EASYFLASH LOADER" string
 *   $8076 - Relocatable loader code (229 bytes)
 *   $835B - Initialization subroutine
 *   $808C - Bank switch subroutine
 *
 * RAM Destinations:
 *   $C800 - Relocated loader code
 *   $C816 - Bank setup routine (in RAM)
 *   $C826 - NMI handler (in RAM)
 *   $C84F - Subroutine (in RAM)
 *   $C88A/$C88B - Self-modifying address storage
 *
 * EasyFlash:
 *   $DE00 - Bank select (0-63)
 *   $DE02 - Control register
 *
 * Vectors:
 *   $FFFA/$FFFB - NMI vector -> $C826
 *
 * ============================================================================
 */


/*
 * ============================================================================
 * BANK ORGANIZATION (HYPOTHESIS)
 * ============================================================================
 *
 * EasyFlash cartridges have 64 banks of 16KB each (8KB LOW + 8KB HIGH)
 * Total: 1MB of ROM space
 *
 * This .crt file has 75 CHIP packets = 600KB of actual data
 * Extracted banks are stored in analysis/c64/extracted_rom/
 *
 * Likely Bank Usage:
 *   Bank 0:  Loader code (this file) + initialization
 *   Bank 1-3: Additional loader / decompression code
 *   Bank 4+:  Game data:
 *             - Graphics (sprites, character sets, screens)
 *             - Music (SID data)
 *             - Game code (main logic, AI, etc.)
 *             - Level data / map data
 *
 * To fully understand the game, need to:
 * 1. Analyze the $C800 loader code
 * 2. Trace bank switches ($DE00 writes)
 * 3. Identify which banks contain code vs data
 * 4. Decompile code banks
 *
 * ============================================================================
 */


/*
 * ============================================================================
 * ANALYSIS STATUS
 * ============================================================================
 *
 * [VERIFIED]:
 * - Entry point at $8000
 * - NMI vector setup ($FFFA/$FFFB -> $C826)
 * - Stack clearing ($100-$10F)
 * - Loader relocation ($8076 -> $C800, 229 bytes)
 * - "EXCESS EASYFLASH LOADER" signature
 * - Bank switch mechanism ($DE00, $DE02)
 * - Memory configuration via $01
 *
 * [NEEDS FURTHER ANALYSIS]:
 * - Function at $835B (initialization)
 * - Code at $C800 after relocation
 * - Remaining 74 ROM banks
 * - VIC-II graphics setup
 * - SID sound setup
 * - Main game entry point
 * - Input handling
 *
 * ============================================================================
 */
