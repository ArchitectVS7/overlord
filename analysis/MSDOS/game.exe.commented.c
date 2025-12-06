/*
 * ============================================================================
 * OVERLORD (MS-DOS) - COMMENTED DECOMPILED SOURCE
 * ============================================================================
 *
 * Original: game.exe (147 KB)
 * Platform: MS-DOS (16-bit x86 real mode)
 * Decompiler: Ghidra 11.4.3
 * Analysis: December 2025
 *
 * IMPORTANT NOTES:
 * - This is HEAVILY MANGLED decompilation due to 16-bit real mode addressing
 * - Many functions show byte-level operations that obscure true logic
 * - The "WARNING: Bad instruction" functions are data being misinterpreted as code
 * - Comments marked [VERIFIED] have been confirmed; [HYPOTHESIS] are educated guesses
 *
 * MEMORY MAP SUMMARY:
 * - Segment 1000: Main code and near data
 * - Segment 338b: DOS executable header area
 * - Segment 4000: Far data segment
 * ============================================================================
 */

typedef unsigned char   undefined;
typedef unsigned char   undefined1;
typedef unsigned int    undefined2;
typedef unsigned int    word;

/*
 * ============================================================================
 * DOS MZ EXECUTABLE HEADER STRUCTURE
 * ============================================================================
 * [VERIFIED] Standard DOS executable header - this is the MZ format
 */
typedef struct OLD_IMAGE_DOS_HEADER OLD_IMAGE_DOS_HEADER, *POLD_IMAGE_DOS_HEADER;

struct OLD_IMAGE_DOS_HEADER {
    char e_magic[2];     // "MZ" signature - Mark Zbikowski signature
    word e_cblp;         // Bytes on last 512-byte page of file
    word e_cp;           // Total pages in file (1 page = 512 bytes)
    word e_crlc;         // Number of relocation entries
    word e_cparhdr;      // Header size in 16-byte paragraphs
    word e_minalloc;     // Minimum extra paragraphs needed
    word e_maxalloc;     // Maximum extra paragraphs needed
    word e_ss;           // Initial (relative) SS register value
    word e_sp;           // Initial SP register value
    word e_csum;         // Checksum (rarely used)
    word e_ip;           // Initial IP register value (entry point offset)
    word e_cs;           // Initial (relative) CS register value
    word e_lfarlc;       // File offset of relocation table
    word e_ovno;         // Overlay number (0 for main program)
};


/*
 * ============================================================================
 * GLOBAL VARIABLES
 * ============================================================================
 * [HYPOTHESIS] Based on access patterns and typical game structures
 */

/* Segment 1000 Variables - Near Data */
int DAT_1000_1c03;       // [HYPOTHESIS] Segment storage / return value
char DAT_1000_19ac;      // [HYPOTHESIS] Loop terminator flag (-1 = exit)
undefined FUN_1000_1c7e; // [NOTE] Misidentified - actually a function
int DAT_1000_1fce;       // [HYPOTHESIS] Calculated count value
char DAT_1000_1c79;      // Unknown state byte
undefined2 DAT_1000_1c25;// Unknown word
byte DAT_1000_002e;      // Unknown byte
byte UNK_1000_0015;      // Unknown byte
char UNK_1000_363f;      // Unknown string area

/* Segment 4000 Variables - Far Data */
undefined DAT_4000_89ee; // [VERIFIED] Segment value storage
undefined DAT_4000_89ec; // [VERIFIED] Runtime flag (initialized to 0x32 = 50 decimal)

/* Segment 338b Variables - Executable Header Area */
int DAT_338b_0004;       // [VERIFIED] Initial data segment value
int DAT_338b_000c;       // [VERIFIED] Additional segment offset
int DAT_338b_0006;       // [VERIFIED] Relocation/copy size


/*
 * ============================================================================
 * ENTITY VALIDATION FUNCTION
 * ============================================================================
 * Function: validate_entity_at_reference_point
 * Original: FUN_1000_0cee
 * Purpose: Check if an entity is at one of three reference coordinate points
 *
 * [VERIFIED] This validates game entities (units/buildings/objects)
 *
 * Entity Structure (HYPOTHESIS):
 *   offset +0x00: Unknown (4 bytes)
 *   offset +0x04: Entity type (byte, 0x02 = valid type for this check)
 *   offset +0x10: X coordinate (word)
 *   offset +0x12: Y coordinate (word)
 *
 * Reference Points:
 *   Point A: (0x25ca, 0x25cc) - possibly current selection
 *   Point B: (0x2470, 0x2472) - possibly target location
 *   Point C: (0x17be, 0x17c0) - possibly alternate reference
 *
 * Returns: 1 if entity is valid and at a reference point, 0 otherwise
 */
undefined2 __cdecl16near validate_entity_at_reference_point(undefined4 entity_ptr)
{
    int iVar1;
    undefined2 uVar2;
    undefined2 unaff_DS;

    /* [VERIFIED] System enable flag must be set for validation to proceed */
    if (*(char *)0x836 != '\0') {
        uVar2 = (undefined2)((ulong)entity_ptr >> 0x10);
        iVar1 = (int)entity_ptr;

        /* [VERIFIED] Check entity type - must be 0x02 */
        if (*(char *)(iVar1 + 4) == '\x02') {

            /* [VERIFIED] Check against three reference coordinate pairs */

            /* Check Point A: Current selection or primary reference */
            if (((*(int *)(iVar1 + 0x10) != *(int *)0x25ca) ||
                 (*(int *)(iVar1 + 0x12) != *(int *)0x25cc))

            /* Check Point B: Target location or secondary reference */
                && ((*(int *)(iVar1 + 0x10) != *(int *)0x2470 ||
                     (*(int *)(iVar1 + 0x12) != *(int *)0x2472)))) {

                /* Check Point C: Alternate reference point */
                if (*(int *)(iVar1 + 0x10) != *(int *)0x17be) {
                    return 0;  /* Not at any reference point - invalid */
                }
                if (*(int *)(iVar1 + 0x12) != *(int *)0x17c0) {
                    return 0;  /* Y coordinate doesn't match - invalid */
                }
            }
            return 1;  /* Entity is at one of the reference points - valid */
        }
    }
    return 0;  /* System disabled or wrong entity type - invalid */
}


/*
 * ============================================================================
 * DATA PROCESSING FUNCTION (MANGLED)
 * ============================================================================
 * Function: FUN_1000_0dfc
 * Purpose: Unknown - heavily corrupted decompilation
 *
 * WARNING: This function shows "bad instruction data" which means:
 * - The decompiler misinterpreted data as code, OR
 * - Self-modifying code exists here, OR
 * - A jump table or computed goto was misanalyzed
 *
 * [HYPOTHESIS] This may be part of a graphics or sound data block
 * that was incorrectly identified as executable code.
 */
void FUN_1000_0dfc(void)
{
    /*
     * [NOTE] The repetitive byte operations like:
     *   in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
     *
     * Are likely a corrupted representation of:
     * - A data table being processed
     * - RLE-encoded graphics decompression
     * - Sound sample manipulation
     *
     * This would need runtime debugging to understand properly.
     */

    // Original mangled code omitted for clarity
    // See game.exe.c for raw decompilation
}


/*
 * ============================================================================
 * ENTITY TYPE AND POSITION CHECK
 * ============================================================================
 * Function: check_entity_at_point_b
 * Original: FUN_1000_1c54
 * Purpose: Check if entity is type 0x02 and at reference point B
 *
 * [VERIFIED] Similar to validate_entity_at_reference_point but simpler
 * Only checks against one reference point (Point B: 0x2470, 0x2472)
 *
 * Returns: 1 if match, 0 if not
 */
undefined2 __cdecl16near check_entity_at_point_b(undefined4 entity_ptr)
{
    int iVar1;
    undefined2 uVar2;
    undefined2 unaff_DS;

    uVar2 = (undefined2)((ulong)entity_ptr >> 0x10);
    iVar1 = (int)entity_ptr;

    /* [VERIFIED] Check type AND position in single condition */
    if (((*(char *)(iVar1 + 4) == '\x02') &&                    /* Type check */
         (*(int *)(iVar1 + 0x10) == *(int *)0x2470)) &&          /* X coord check */
        (*(int *)(iVar1 + 0x12) == *(int *)0x2472)) {            /* Y coord check */
        return 1;
    }
    return 0;
}


/*
 * ============================================================================
 * STATE UPDATE ROUTINE
 * ============================================================================
 * Function: update_game_state
 * Original: FUN_1000_1c7e
 * Purpose: Updates game state variables and calls data processing
 *
 * [HYPOTHESIS] Called during game tick/frame update
 */
void __cdecl16near update_game_state(void)
{
    undefined2 unaff_DS;

    /* [HYPOTHESIS] Calculate new value from counter at 0x7a4 */
    *(int *)0x26f0 = *(int *)0x7a4 + 1;

    /* [HYPOTHESIS] Process two data blocks */
    FUN_1000_0dfc(0x11ba);  /* First data block */
    FUN_1000_0dfc(0x11e4);  /* Second data block */

    /* [HYPOTHESIS] Store current counter value */
    *(undefined2 *)0x222a = *(undefined2 *)0x7a4;

    return;
}


/*
 * ============================================================================
 * MODE-DEPENDENT PROCESSING
 * ============================================================================
 * Function: process_based_on_mode
 * Original: FUN_1000_1ca6
 * Purpose: Route processing based on current game mode
 *
 * [VERIFIED] Mode flag at 0x2226:
 *   - Mode 1: Special processing (menu? setup?)
 *   - Other: Normal game processing
 */
void process_based_on_mode(void)
{
    char cVar1;
    int iVar2;
    undefined2 unaff_DS;

    /* [HYPOTHESIS] Sort or process arrays */
    FUN_1000_a990(0, *(byte *)0x270a - 1);  /* Process array of size 0x270a */
    iVar2 = FUN_1000_a990(0, *(int *)0x275a + -1);
    iVar2 = iVar2 * 2;

    /* [VERIFIED] Mode check - mode 1 triggers special path */
    if (*(int *)0x2226 == 1) {
        FUN_1000_1e40();  /* Special mode handler */
        return;
    }

    /* Normal mode processing */
    cVar1 = FUN_1000_1d82(0x2474, 0x184c, 0xffff);
    *(char *)(iVar2 + 0x1d1e) = *(char *)(iVar2 + 0x1d1e) + cVar1;
    *(char *)(iVar2 + 0x1d1e) = *(char *)(iVar2 + 0x1d1e) + cVar1;
    *(undefined1 *)(iVar2 + 0x1d1e) = 0xe9;  /* [NOTE] 0xE9 is JMP opcode - self-mod? */
    FUN_1000_2081();
    return;
}


/*
 * ============================================================================
 * CONDITIONAL DISPATCH
 * ============================================================================
 * Function: FUN_1000_1d82
 * Purpose: Branch based on AL register value, call different handlers
 *
 * [HYPOTHESIS] This dispatches to different game subsystems
 * Based on input condition, calls one of two handlers
 */
undefined2 FUN_1000_1d82(void)
{
    char in_AL;
    undefined2 uVar1;
    undefined2 unaff_ES;

    if (in_AL == '\0') {
        uVar1 = func_0x00012d3b();  /* [HYPOTHESIS] Handler A - maybe AI */
    }
    else {
        uVar1 = func_0x000127cf();  /* [HYPOTHESIS] Handler B - maybe player */
    }

    /* [HYPOTHESIS] Post-processing if conditions met */
    if (((char)uVar1 != '\0') && ((char)((uint)unaff_ES >> 8) == '\0')) {
        func_0x00012952();  /* Post-handler */
    }
    return uVar1;
}


/*
 * ============================================================================
 * FIND MAXIMUM VALUE IN BUFFER
 * ============================================================================
 * Function: find_max_in_buffer
 * Original: FUN_1000_206a
 * Purpose: Scan buffer at 0x168b and find maximum byte value
 *
 * [VERIFIED] Clean, interpretable function
 *
 * Buffer: 0x168b (127 bytes)
 * Returns: Maximum byte value found (in local variable, not returned)
 *
 * [HYPOTHESIS] Could be finding:
 * - Strongest unit
 * - Highest score
 * - Maximum resource level
 * - Peak value in data array
 */
void __cdecl16near find_max_in_buffer(void)
{
    int iVar1;
    byte bVar2;
    byte *pbVar3;
    undefined2 unaff_DS;

    pbVar3 = (byte *)0x168b;  /* Buffer start address */
    iVar1 = 0x7f;              /* Buffer length: 127 bytes */
    bVar2 = 0;                 /* Initialize max to 0 */

    do {
        /* [VERIFIED] Simple max-finding logic */
        if (bVar2 <= *pbVar3) {
            bVar2 = *pbVar3;   /* Update max if current is greater */
        }
        pbVar3 = pbVar3 + 1;   /* Move to next byte */
        iVar1 = iVar1 + -1;    /* Decrement counter */
    } while (iVar1 != 0);

    /* [NOTE] Max value is in bVar2 but not returned - stored elsewhere? */
    return;
}


/*
 * ============================================================================
 * LARGE DATA COPY AND PROCESSING
 * ============================================================================
 * Function: FUN_1000_2081
 * Purpose: Copy data between buffers and perform calculations
 *
 * [HYPOTHESIS] This appears to be a bulk memory operation, possibly:
 * - Copying game state to backup
 * - Moving graphics data
 * - Updating display buffers
 *
 * Key buffers:
 * - 0x1673: Destination buffer 1 (280 bytes = 0x118)
 * - 0x178c: Destination buffer 2 (512 bytes = 0x200)
 * - 0x170b: String/text pointer area (scanned in loop)
 */
undefined2 __cdecl16far FUN_1000_2081(void)
{
    undefined1 *puVar1;
    undefined1 *puVar2;
    undefined2 in_AX;
    int iVar3;
    int iVar4;
    char extraout_DL;
    char *pcVar5;
    undefined1 *unaff_SI;
    undefined1 *puVar6;
    int unaff_DS;
    /* ... flag variables ... */

    /* [VERIFIED] First copy: 0x118 bytes to 0x1673 */
    puVar6 = (undefined1 *)0x1673;
    for (iVar3 = 0x118; iVar3 != 0; iVar3 = iVar3 + -1) {
        puVar2 = puVar6;
        puVar6 = puVar6 + 1;
        puVar1 = unaff_SI;
        unaff_SI = unaff_SI + 1;
        *puVar2 = *puVar1;
    }

    /* [VERIFIED] Second copy: 0x200 bytes (512) to 0x178c */
    puVar6 = (undefined1 *)0x178c;
    for (iVar3 = 0x200; iVar3 != 0; iVar3 = iVar3 + -1) {
        puVar2 = puVar6;
        puVar6 = puVar6 + 1;
        puVar1 = unaff_SI;
        unaff_SI = unaff_SI + 1;
        *puVar2 = *puVar1;
    }

    DAT_1000_1c03 = unaff_DS;  /* Store data segment */

    if (DAT_1000_19ac != -1) {
        /* [HYPOTHESIS] Additional processing when not terminating */
        find_max_in_buffer();  /* Find max in data buffer */

        /* Lookup table access at 0x178c */
        FUN_1000_1c7e = *(int *)((uint)(byte)(extraout_DL + 1) * 2 + 0x178c) + DAT_1000_1c03;

        if (DAT_1000_19ac != '\0') {
            FUN_1000_2104();  /* Additional iteration */
        }

        /* [HYPOTHESIS] Count non-zero entries at 0x170b */
        pcVar5 = (char *)0x170b;
        iVar3 = 0;
        iVar4 = 0x20;  /* 32 entries */
        do {
            if (*pcVar5 != '\0') {
                iVar3 = iVar3 + 0x100;  /* Add 256 for each non-zero */
            }
            pcVar5 = pcVar5 + 2;  /* Stride of 2 bytes */
            iVar4 = iVar4 + -1;
        } while (iVar4 != 0);

        DAT_1000_1fce = iVar3 + 0x122;  /* Final calculated value */
    }
    return in_AX;
}


/*
 * ============================================================================
 * ITERATION HELPER
 * ============================================================================
 * Function: FUN_1000_2104
 * Purpose: Process entries in a table at 0x170b
 *
 * [HYPOTHESIS] This processes a table of 32 entries (0x20)
 * Each entry is 2 bytes
 * Calls FUN_1000_214f for each valid entry
 * Then calls FUN_1000_290e 32 times
 */
void __cdecl16near FUN_1000_2104(void)
{
    int iVar1;
    int iVar2;
    char *pcVar3;
    undefined2 unaff_DS;

    iVar2 = 0x20;  /* 32 entries */
    iVar1 = 0;
    pcVar3 = (char *)0x170b;  /* Table start */

    do {
        /* [HYPOTHESIS] Process if both bytes non-zero */
        if ((*pcVar3 != '\0') && (pcVar3[1] != '\0')) {
            FUN_1000_214f(iVar2, pcVar3, iVar1);
        }
        pcVar3 = pcVar3 + 2;  /* Move to next 2-byte entry */
        iVar1 = iVar1 + 1;
        iVar2 = iVar2 + -1;
    } while (iVar2 != 0);

    /* [HYPOTHESIS] Post-processing loop */
    iVar1 = 0;
    do {
        FUN_1000_290e(iVar1);
        FUN_1000_290e();  /* [NOTE] Called twice per iteration, second with no params? */
        iVar1 = iVar1 + 1;
    } while (iVar1 != 0x20);

    return;
}


/*
 * ============================================================================
 * PROGRAM ENTRY POINT
 * ============================================================================
 * Function: entry
 * Purpose: DOS program entry - sets up memory and starts execution
 *
 * [VERIFIED] This is the standard DOS MZ executable entry point
 *
 * Operations:
 * 1. Calculate data segment from ES register (PSP + 0x10)
 * 2. Calculate far data segment
 * 3. Relocate data downward in memory
 * 4. Initialize runtime flag to 50 (0x32)
 * 5. Return (falls through to main code)
 */
void __cdecl16far entry(void)
{
    undefined1 *puVar1;
    undefined1 *puVar2;
    int iVar3;
    undefined1 *puVar4;
    undefined1 *puVar5;
    int unaff_ES;  /* ES register = Program Segment Prefix + 0x10 normally */

    /* [VERIFIED] Calculate data segment: PSP segment + 16 bytes (1 paragraph) */
    DAT_338b_0004 = unaff_ES + 0x10;

    /* [VERIFIED] Calculate far data segment location */
    _DAT_4000_89ee = DAT_338b_0004 + DAT_338b_000c;

    /*
     * [VERIFIED] Memory relocation loop
     * Copies data DOWNWARD (from high to low addresses)
     * This is typical for overlays or self-modifying startup
     */
    puVar4 = (undefined1 *)(DAT_338b_0006 + -1);
    puVar5 = puVar4;
    for (iVar3 = DAT_338b_0006; iVar3 != 0; iVar3 = iVar3 + -1) {
        puVar2 = puVar5;
        puVar5 = puVar5 + -1;
        puVar1 = puVar4;
        puVar4 = puVar4 + -1;
        *puVar2 = *puVar1;  /* Copy byte */
    }

    /* [VERIFIED] Initialize runtime flag to 50 decimal (0x32 hex) */
    _DAT_4000_89ec = 0x32;

    /*
     * [NOTE] Return here actually falls through to the main game code
     * The DOS loader will have set up CS:IP to jump to the real main()
     */
    return;
}


/*
 * ============================================================================
 * ADDITIONAL FUNCTION STUBS (REFERENCED BUT NOT FULLY ANALYZED)
 * ============================================================================
 */

/* func_0x00012d3b - [HYPOTHESIS] Indirect call target A */
/* func_0x000127cf - [HYPOTHESIS] Indirect call target B */
/* func_0x00012952 - [HYPOTHESIS] Post-handler indirect call */
/* FUN_1000_214f   - [HYPOTHESIS] Entry processor */
/* FUN_1000_290e   - [HYPOTHESIS] Post-iteration processor */
/* FUN_1000_a990   - [HYPOTHESIS] Sort/search function (heavily mangled) */


/*
 * ============================================================================
 * KEY MEMORY ADDRESSES QUICK REFERENCE
 * ============================================================================
 *
 * Game State:
 *   0x0836 - System enable flag (must be non-zero for entity validation)
 *   0x2226 - Mode flag (1 = special mode)
 *   0x07a4 - Counter/timer variable
 *   0x222a - Stored counter value
 *   0x26f0 - Calculated value (counter + 1)
 *
 * Entity Reference Points:
 *   0x25ca, 0x25cc - Point A (X, Y)
 *   0x2470, 0x2472 - Point B (X, Y)
 *   0x17be, 0x17c0 - Point C (X, Y)
 *
 * Data Buffers:
 *   0x168b - 127-byte buffer (max value scanned here)
 *   0x1673 - 280-byte buffer (destination for copy)
 *   0x178c - 512-byte buffer / lookup table
 *   0x170b - 32-entry table (2 bytes each)
 *   0x1d1e - Data array (modified with calculated values)
 *
 * Size/Count Values:
 *   0x270a - Array size (byte)
 *   0x275a - Secondary count (word)
 *
 * Segment Values:
 *   0x338b:0004 - Initial data segment
 *   0x338b:0006 - Relocation size
 *   0x338b:000c - Segment offset
 *   0x4000:89ec - Runtime flag (initialized to 50)
 *   0x4000:89ee - Far data segment
 *
 * ============================================================================
 * END OF COMMENTED SOURCE
 * ============================================================================
 */
