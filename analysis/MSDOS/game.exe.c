typedef unsigned char   undefined;

typedef unsigned char    undefined1;
typedef unsigned int    undefined2;
typedef unsigned int    word;
typedef struct OLD_IMAGE_DOS_HEADER OLD_IMAGE_DOS_HEADER, *POLD_IMAGE_DOS_HEADER;

struct OLD_IMAGE_DOS_HEADER {
    char e_magic[2]; // Magic number
    word e_cblp; // Bytes of last page
    word e_cp; // Pages in file
    word e_crlc; // Relocations
    word e_cparhdr; // Size of header in paragraphs
    word e_minalloc; // Minimum extra paragraphs needed
    word e_maxalloc; // Maximum extra paragraphs needed
    word e_ss; // Initial (relative) SS value
    word e_sp; // Initial SP value
    word e_csum; // Checksum
    word e_ip; // Initial IP value
    word e_cs; // Initial (relative) CS value
    word e_lfarlc; // File address of relocation table
    word e_ovno; // Overlay number
};



int DAT_1000_1c03;
char DAT_1000_19ac;
undefined FUN_1000_1c7e;
int DAT_1000_1fce;
char DAT_1000_1c79;
undefined2 DAT_1000_1c25;
undefined2 LAB_1000_1c68+1;
undefined1 LAB_1000_1c7a;
char LAB_1000_1c84;
byte DAT_1000_002e;
byte UNK_1000_0015;
char UNK_1000_363f;
undefined DAT_4000_89ee;
undefined DAT_4000_89ec;
int DAT_338b_0004;
int DAT_338b_000c;
int DAT_338b_0006;

undefined2 __cdecl16near FUN_1000_0cee(undefined4 param_1)

{
  int iVar1;
  undefined2 uVar2;
  undefined2 unaff_DS;
  
  if (*(char *)0x836 != '\0') {
    uVar2 = (undefined2)((ulong)param_1 >> 0x10);
    iVar1 = (int)param_1;
    if (*(char *)(iVar1 + 4) == '\x02') {
      if (((*(int *)(iVar1 + 0x10) != *(int *)0x25ca) || (*(int *)(iVar1 + 0x12) != *(int *)0x25cc))
         && ((*(int *)(iVar1 + 0x10) != *(int *)0x2470 || (*(int *)(iVar1 + 0x12) != *(int *)0x2472)
             ))) {
        if (*(int *)(iVar1 + 0x10) != *(int *)0x17be) {
          return 0;
        }
        if (*(int *)(iVar1 + 0x12) != *(int *)0x17c0) {
          return 0;
        }
      }
      return 1;
    }
  }
  return 0;
}



// WARNING: Control flow encountered bad instruction data

void FUN_1000_0dfc(void)

{
  byte bVar1;
  byte bVar2;
  undefined2 in_AX;
  char cVar3;
  char in_DL;
  char in_DH;
  char *in_BX;
  char cVar4;
  int unaff_BP;
  char *unaff_SI;
  int unaff_DI;
  char *pcVar5;
  undefined2 unaff_SS;
  undefined2 unaff_DS;
  undefined2 in_FS;
  byte in_AF;
  
  *(char *)(unaff_BP + -0x7200) = *(char *)(unaff_BP + -0x7200) + in_DL;
  bVar2 = (byte)in_AX;
  *(char *)(unaff_BP + 0x7f00) = *(char *)(unaff_BP + 0x7f00) + bVar2;
  *in_BX = *in_BX + in_DH;
  *in_BX = *in_BX + (char)in_BX;
  *unaff_SI = *unaff_SI + in_DL;
  *(undefined1 *)(unaff_BP + unaff_DI) = *(undefined1 *)(unaff_BP + unaff_DI);
  pcVar5 = (char *)(unaff_DI + 1);
  pcVar5[unaff_BP] = pcVar5[unaff_BP] + bVar2;
  bVar1 = 9 < (bVar2 & 0xf) | in_AF;
  bVar2 = bVar2 + bVar1 * -6 & 0xf;
  cVar3 = (char)((uint)in_AX >> 8) - bVar1;
  cVar4 = (char)((uint)in_BX >> 8);
  *unaff_SI = *unaff_SI + cVar4;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + cVar4;
  *pcVar5 = *pcVar5 + in_DH;
  unaff_SI[unaff_BP] = unaff_SI[unaff_BP] + in_DH;
  *in_BX = *in_BX;
  *pcVar5 = *pcVar5;
  unaff_SI[unaff_BP] = unaff_SI[unaff_BP];
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI];
  *(char *)0x2400 = *(char *)0x2400 + cVar3;
  unaff_SI[unaff_BP] = unaff_SI[unaff_BP] + cVar3;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + cVar3;
  *(char *)0x1c00 = *(char *)0x1c00 + (char)in_BX;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  (in_BX + (int)unaff_SI)[0x80] = (in_BX + (int)unaff_SI)[0x80] + in_DL;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  (in_BX + (int)unaff_SI)[0xa0] = (in_BX + (int)unaff_SI)[0xa0] + in_DH;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar2;
  cVar3 = bVar2 + in_DL;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI];
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + cVar3;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + cVar3;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + cVar3;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + cVar3;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + cVar3;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + cVar3;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + cVar3;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + cVar3;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + cVar3;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + cVar3;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + cVar3;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + cVar3;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + cVar3;
                    // WARNING: Bad instruction - Truncating control flow here
  halt_baddata();
}



undefined2 __cdecl16near FUN_1000_1c54(undefined4 param_1)

{
  int iVar1;
  undefined2 uVar2;
  undefined2 unaff_DS;
  
  uVar2 = (undefined2)((ulong)param_1 >> 0x10);
  iVar1 = (int)param_1;
  if (((*(char *)(iVar1 + 4) == '\x02') && (*(int *)(iVar1 + 0x10) == *(int *)0x2470)) &&
     (*(int *)(iVar1 + 0x12) == *(int *)0x2472)) {
    return 1;
  }
  return 0;
}



void __cdecl16near FUN_1000_1c7e(void)

{
  undefined2 unaff_DS;
  
  *(int *)0x26f0 = *(int *)0x7a4 + 1;
  FUN_1000_0dfc(0x11ba);
  FUN_1000_0dfc(0x11e4);
  *(undefined2 *)0x222a = *(undefined2 *)0x7a4;
  return;
}



void FUN_1000_1ca6(void)

{
  char cVar1;
  int iVar2;
  undefined2 unaff_DS;
  
  FUN_1000_a990(0,*(byte *)0x270a - 1);
  iVar2 = FUN_1000_a990(0,*(int *)0x275a + -1);
  iVar2 = iVar2 * 2;
  if (*(int *)0x2226 == 1) {
    FUN_1000_1e40();
    return;
  }
  cVar1 = FUN_1000_1d82(0x2474,0x184c,0xffff);
  *(char *)(iVar2 + 0x1d1e) = *(char *)(iVar2 + 0x1d1e) + cVar1;
  *(char *)(iVar2 + 0x1d1e) = *(char *)(iVar2 + 0x1d1e) + cVar1;
  *(undefined1 *)(iVar2 + 0x1d1e) = 0xe9;
  FUN_1000_2081();
  return;
}



undefined2 FUN_1000_1d82(void)

{
  char in_AL;
  undefined2 uVar1;
  undefined2 unaff_ES;
  
  if (in_AL == '\0') {
    uVar1 = func_0x00012d3b();
  }
  else {
    uVar1 = func_0x000127cf();
  }
  if (((char)uVar1 != '\0') && ((char)((uint)unaff_ES >> 8) == '\0')) {
    func_0x00012952();
  }
  return uVar1;
}



undefined2 __cdecl16far FUN_1000_1e40(void)

{
  int *piVar1;
  undefined1 in_AL;
  int in_CX;
  int in_BX;
  int unaff_SI;
  undefined2 unaff_DS;
  byte in_CF;
  undefined2 in_stack_00000012;
  
  piVar1 = (int *)(in_BX + unaff_SI + 0xb1e);
  *piVar1 = (*piVar1 - in_CX) - (uint)in_CF;
  *(undefined2 *)0x19fb = 0x118;
  *(undefined1 *)0x19ff = in_AL;
  *(undefined1 *)0x1c05 = (char)in_BX;
  return in_stack_00000012;
}



void __cdecl16near FUN_1000_206a(void)

{
  int iVar1;
  byte bVar2;
  byte *pbVar3;
  undefined2 unaff_DS;
  
  pbVar3 = (byte *)0x168b;
  iVar1 = 0x7f;
  bVar2 = 0;
  do {
    if (bVar2 <= *pbVar3) {
      bVar2 = *pbVar3;
    }
    pbVar3 = pbVar3 + 1;
    iVar1 = iVar1 + -1;
  } while (iVar1 != 0);
  return;
}



// WARNING: Globals starting with '_' overlap smaller symbols at the same address

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
  byte in_CF;
  byte in_PF;
  byte in_AF;
  byte in_ZF;
  byte in_SF;
  byte in_TF;
  byte in_IF;
  byte in_OF;
  byte in_NT;
  
  puVar6 = (undefined1 *)0x1673;
  for (iVar3 = 0x118; iVar3 != 0; iVar3 = iVar3 + -1) {
    puVar2 = puVar6;
    puVar6 = puVar6 + 1;
    puVar1 = unaff_SI;
    unaff_SI = unaff_SI + 1;
    *puVar2 = *puVar1;
  }
  puVar6 = (undefined1 *)0x178c;
  for (iVar3 = 0x200; iVar3 != 0; iVar3 = iVar3 + -1) {
    puVar2 = puVar6;
    puVar6 = puVar6 + 1;
    puVar1 = unaff_SI;
    unaff_SI = unaff_SI + 1;
    *puVar2 = *puVar1;
  }
  DAT_1000_1c03 = unaff_DS;
  if (DAT_1000_19ac != -1) {
    FUN_1000_206a((uint)(in_NT & 1) * 0x4000 | (uint)(in_OF & 1) * 0x800 | (uint)(in_IF & 1) * 0x200
                  | (uint)(in_TF & 1) * 0x100 | (uint)(in_SF & 1) * 0x80 | (uint)(in_ZF & 1) * 0x40
                  | (uint)(in_AF & 1) * 0x10 | (uint)(in_PF & 1) * 4 | (uint)(in_CF & 1));
    FUN_1000_1c7e = *(int *)((uint)(byte)(extraout_DL + 1) * 2 + 0x178c) + DAT_1000_1c03;
    if (DAT_1000_19ac != '\0') {
      FUN_1000_2104();
    }
    pcVar5 = (char *)0x170b;
    iVar3 = 0;
    iVar4 = 0x20;
    do {
      if (*pcVar5 != '\0') {
        iVar3 = iVar3 + 0x100;
      }
      pcVar5 = pcVar5 + 2;
      iVar4 = iVar4 + -1;
    } while (iVar4 != 0);
    DAT_1000_1fce = iVar3 + 0x122;
  }
  return in_AX;
}



void __cdecl16near FUN_1000_2104(void)

{
  int iVar1;
  int iVar2;
  char *pcVar3;
  undefined2 unaff_DS;
  
  iVar2 = 0x20;
  iVar1 = 0;
  pcVar3 = (char *)0x170b;
  do {
    if ((*pcVar3 != '\0') && (pcVar3[1] != '\0')) {
      FUN_1000_214f(iVar2,pcVar3,iVar1);
    }
    pcVar3 = pcVar3 + 2;
    iVar1 = iVar1 + 1;
    iVar2 = iVar2 + -1;
  } while (iVar2 != 0);
  iVar1 = 0;
  do {
    FUN_1000_290e(iVar1);
    FUN_1000_290e();
    iVar1 = iVar1 + 1;
  } while (iVar1 != 0x20);
  return;
}



// WARNING: Globals starting with '_' overlap smaller symbols at the same address

undefined4 __cdecl16near FUN_1000_214f(void)

{
  char *pcVar1;
  char *pcVar2;
  undefined2 uVar3;
  uint in_AX;
  uint uVar4;
  char cVar5;
  int iVar6;
  undefined2 in_DX;
  char *pcVar7;
  char *pcVar8;
  undefined2 unaff_DS;
  byte in_CF;
  byte in_PF;
  byte in_AF;
  byte in_ZF;
  byte in_SF;
  byte in_TF;
  byte in_IF;
  byte in_OF;
  byte in_NT;
  uint uVar9;
  
  uVar9 = (uint)(in_NT & 1) * 0x4000 | (uint)(in_OF & 1) * 0x800 | (uint)(in_IF & 1) * 0x200 |
          (uint)(in_TF & 1) * 0x100 | (uint)(in_SF & 1) * 0x80 | (uint)(in_ZF & 1) * 0x40 |
          (uint)(in_AF & 1) * 0x10 | (uint)(in_PF & 1) * 4 | (uint)(in_CF & 1);
  pcVar7 = (char *)(CONCAT11((char)in_AX,(char)(in_AX >> 8)) + 0x118);
  cVar5 = '\0';
  for (uVar4 = (in_AX & 0xff) << 3; 0x7f < uVar4; uVar4 = uVar4 - 0x80) {
    cVar5 = cVar5 + '\x01';
  }
  *(undefined2 *)0x1c77 = CONCAT11((char)uVar4,cVar5);
  pcVar8 = (char *)0x1c79;
  iVar6 = 8;
  uVar3 = *(undefined2 *)0x1c81;
  if (*pcVar7 != ' ') {
    for (; iVar6 != 0; iVar6 = iVar6 + -1) {
      pcVar2 = pcVar8;
      pcVar8 = pcVar8 + 1;
      pcVar1 = pcVar7;
      pcVar7 = pcVar7 + 1;
      *pcVar2 = *pcVar1;
    }
    if (DAT_1000_1c79 != '\x03') {
                    // WARNING: Read-only address (ram,0x00011c7a) is written
      uRam00011c7a = (char)in_AX;
    }
    uVar4 = in_AX;
    FUN_1000_28b9();
    uVar3 = FUN_1000_1c7e;
    FUN_1000_1c7e_6 = (char)uVar4 << 1;
    FUN_1000_1c7e = 10;
    pcVar7 = pcVar7 + 10;
    uRam00011c69 = CONCAT11(10,FUN_1000_1c7e_6);
                    // WARNING: Read-only address (ram,0x00011c69) is written
    pcVar8 = (char *)0x1c6b;
    for (iVar6 = 4; iVar6 != 0; iVar6 = iVar6 + -1) {
      pcVar2 = pcVar8;
      pcVar8 = pcVar8 + 1;
      pcVar1 = pcVar7;
      pcVar7 = pcVar7 + 1;
      *pcVar2 = *pcVar1;
    }
    FUN_1000_28b9(pcVar7,uVar9);
    FUN_1000_228c();
    uVar3 = FUN_1000_1c7e;
    DAT_1000_1c25 = CONCAT11(FUN_1000_1c7e,FUN_1000_1c7e_6);
    pcVar8 = (char *)0x1c27;
    for (iVar6 = 0x3a; iVar6 != 0; iVar6 = iVar6 + -1) {
      pcVar2 = pcVar8;
      pcVar8 = pcVar8 + 1;
      pcVar1 = pcVar7;
      pcVar7 = pcVar7 + 1;
      *pcVar2 = *pcVar1;
    }
    FUN_1000_28b9(pcVar7,uVar9);
    FUN_1000_228c();
    uVar3 = FUN_1000_1c7e;
    DAT_1000_1c25 = CONCAT11(FUN_1000_1c7e,FUN_1000_1c7e_6);
    pcVar8 = (char *)0x1c27;
    for (iVar6 = 0x3a; iVar6 != 0; iVar6 = iVar6 + -1) {
      pcVar2 = pcVar8;
      pcVar8 = pcVar8 + 1;
      pcVar1 = pcVar7;
      pcVar7 = pcVar7 + 1;
      *pcVar2 = *pcVar1;
    }
    FUN_1000_28b9();
    FUN_1000_228c();
    uVar3 = FUN_1000_1c7e;
    DAT_1000_1c25 = CONCAT11(FUN_1000_1c7e,FUN_1000_1c7e_6);
    pcVar8 = (char *)0x1c27;
    for (iVar6 = 0x3a; iVar6 != 0; iVar6 = iVar6 + -1) {
      pcVar2 = pcVar8;
      pcVar8 = pcVar8 + 1;
      pcVar1 = pcVar7;
      pcVar7 = pcVar7 + 1;
      *pcVar2 = *pcVar1;
    }
    FUN_1000_28b9();
    FUN_1000_228c();
    uVar3 = FUN_1000_1c7e;
    DAT_1000_1c25 = CONCAT11(FUN_1000_1c7e,FUN_1000_1c7e_6);
    pcVar8 = (char *)0x1c27;
    for (iVar6 = 0x3a; iVar6 != 0; iVar6 = iVar6 + -1) {
      pcVar2 = pcVar8;
      pcVar8 = pcVar8 + 1;
      pcVar1 = pcVar7;
      pcVar7 = pcVar7 + 1;
      *pcVar2 = *pcVar1;
    }
    FUN_1000_28b9(pcVar7);
    FUN_1000_228c();
    return CONCAT22(in_DX,in_AX);
  }
  return CONCAT22(in_DX,in_AX);
}



void __cdecl16near FUN_1000_228c(void)

{
  char in_BL;
  undefined2 unaff_DS;
  
  *(char *)0x1c83 = *(char *)0x1c83 + in_BL;
  if (0x7f < *(byte *)0x1c83) {
    *(byte *)0x1c83 = *(byte *)0x1c83 & 0x7f;
    *(char *)0x1c84 = *(char *)0x1c84 + '\x01';
  }
  return;
}



void __cdecl16near FUN_1000_28b9(void)

{
  uint uVar1;
  
  FUN_1000_28c8();
  uVar1 = 0;
  do {
    uVar1 = uVar1 + 1;
  } while (uVar1 < 0xff);
  return;
}



void FUN_1000_28c8(void)

{
  uint uVar1;
  byte *unaff_SI;
  byte *pbVar2;
  undefined2 unaff_DS;
  
  uVar1 = (uint)*unaff_SI;
  pbVar2 = unaff_SI + 1;
  do {
    FUN_1000_290e();
    pbVar2 = pbVar2 + 1;
    uVar1 = uVar1 - 1;
  } while (uVar1 != 0);
  uVar1 = (uint)*pbVar2;
  do {
    FUN_1000_290e();
    uVar1 = uVar1 - 1;
  } while (uVar1 != 0);
  FUN_1000_290e();
  FUN_1000_290e();
  return;
}



void __cdecl16near FUN_1000_290e(void)

{
  undefined1 in_AL;
  byte bVar1;
  
  do {
    bVar1 = in(0x331);
  } while ((bVar1 & 0x40) != 0);
  out(0x330,in_AL);
  return;
}



// WARNING: Control flow encountered bad instruction data

void FUN_1000_a990(undefined2 param_1,undefined2 param_2,undefined2 param_3,undefined2 param_4,
                  undefined2 param_5,undefined2 param_6,undefined2 param_7,undefined2 param_8,
                  undefined2 param_9)

{
  byte *pbVar1;
  uint *puVar2;
  byte bVar3;
  byte bVar4;
  byte bVar5;
  char cVar6;
  byte bVar7;
  byte bVar8;
  byte bVar9;
  byte bVar10;
  byte bVar11;
  byte bVar12;
  byte bVar13;
  undefined2 in_AX;
  byte bVar19;
  byte bVar20;
  uint uVar14;
  int iVar15;
  uint uVar16;
  uint uVar17;
  uint uVar18;
  byte bVar21;
  undefined2 in_CX;
  byte bVar22;
  byte bVar23;
  undefined2 in_DX;
  byte bVar24;
  byte bVar25;
  char cVar26;
  byte bVar27;
  char cVar28;
  byte *in_BX;
  byte *pbVar29;
  uint *puVar30;
  byte bVar31;
  byte bVar32;
  int unaff_BP;
  uint uVar33;
  int iVar34;
  char *unaff_SI;
  byte *pbVar35;
  uint *puVar36;
  char *pcVar37;
  uint *unaff_DI;
  undefined2 unaff_ES;
  undefined2 unaff_SS;
  undefined2 unaff_DS;
  byte in_CF;
  bool bVar38;
  bool bVar39;
  bool bVar40;
  byte in_AF;
  
  bVar3 = (byte)in_AX - 0x18;
  bVar38 = (byte)in_AX < 0x18 || bVar3 < in_CF;
  bVar5 = (byte)((uint)in_AX >> 8);
  bVar3 = bVar3 - in_CF;
  bVar4 = bVar3 - 0x18;
  bVar39 = bVar3 < 0x18 || bVar4 < bVar38;
  bVar4 = bVar4 - bVar38;
  bVar3 = bVar4 + 0x18;
  bVar38 = 0xe7 < bVar4 || CARRY1(bVar3,bVar39);
  bVar3 = bVar3 + bVar39;
  bVar4 = bVar3 + 0x10;
  bVar3 = bVar4 + bVar38 + '\x10' + (0xef < bVar3 || CARRY1(bVar4,bVar38)) | 0x18;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] & bVar5;
  bVar19 = (byte)in_DX;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar19;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar3;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar3;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar3;
  pbVar1 = in_BX + (int)unaff_SI;
  bVar3 = *pbVar1;
  bVar25 = (byte)in_BX;
  *pbVar1 = *pbVar1 - bVar25;
  bVar4 = in_BX[(int)unaff_SI];
  in_BX[(int)unaff_SI] = bVar4 - (bVar3 < bVar25);
  bVar11 = (byte)in_CX;
  *unaff_SI = (*unaff_SI - bVar11) - (bVar4 < (bVar3 < bVar25));
  *unaff_SI = *unaff_SI + bVar25;
  *unaff_SI = *unaff_SI;
  *unaff_SI = *unaff_SI + bVar11;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI];
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI];
  *unaff_SI = *unaff_SI;
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI];
  bVar24 = (byte)((uint)in_DX >> 8);
  in_BX[(int)unaff_SI] = in_BX[(int)unaff_SI] + bVar24;
  pbVar35 = (byte *)((uint)unaff_SI ^ *(uint *)(in_BX + (int)unaff_SI));
  *in_BX = *in_BX ^ bVar5;
  *pbVar35 = *pbVar35 & bVar25;
  pbVar1 = in_BX + (int)pbVar35;
  bVar38 = *pbVar1 < bVar25 || (byte)(*pbVar1 - bVar25) == '\0';
  *pbVar1 = (*pbVar1 - bVar25) - 1;
  pbVar1 = pbVar35;
  bVar39 = *pbVar1 < bVar19 || (byte)(*pbVar1 - bVar19) < bVar38;
  *pbVar1 = (*pbVar1 - bVar19) - bVar38;
  bVar38 = 7 < bVar39;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  bVar4 = *pbVar1;
  *pbVar1 = bVar4 + bVar19 + bVar38;
  *pbVar35 = *pbVar35 + bVar11 + (CARRY1(bVar3,bVar19) || CARRY1(bVar4 + bVar19,bVar38));
  bVar4 = bVar39 - 8U | 0xc;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar11;
  *pbVar35 = *pbVar35 | bVar4;
  bVar4 = bVar4 + 4;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar4;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar11 + CARRY1(bVar3,bVar4);
  *pbVar35 = *pbVar35 + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar4;
  *pbVar35 = *pbVar35 - bVar11;
  *in_BX = *in_BX + bVar24;
  bVar4 = bVar4 ^ 0x34;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar4;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar4) - CARRY1(bVar3,bVar4);
  *pbVar35 = *pbVar35 + bVar19;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar4;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar4 + CARRY1(bVar3,bVar4);
  *pbVar35 = *pbVar35 + bVar11;
  bVar12 = 9 < (bVar4 & 0xf) | in_AF;
  bVar3 = bVar4 + bVar12 * '\x06' & 0xf;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar5 + bVar12;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar3;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar3;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar3;
  bVar13 = (byte)((uint)in_BX >> 8);
  *pbVar35 = *pbVar35 + bVar13;
  bVar4 = bVar3 + 0xbc;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar25) - ((byte)(bVar3 - 0x2c) < 0x18);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar4;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar4;
  bVar22 = (byte)((uint)in_CX >> 8);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar22;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar4;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] ^ bVar24;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar22;
  uVar16 = CONCAT11(bVar5 + bVar12,(bVar4 ^ 4) + 0xac) & 0xff20;
  bVar7 = (byte)(uVar16 >> 8);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar7;
  bVar3 = (byte)uVar16;
  bVar38 = (byte)(bVar3 - 0x1c) < 0x18 || (byte)(bVar3 - 0x34) < (bVar3 < 0x1c);
  bVar4 = (bVar3 - 0x34) - (bVar3 < 0x1c);
  pbVar1 = in_BX + (int)pbVar35;
  bVar39 = *pbVar1 < bVar25 || (byte)(*pbVar1 - bVar25) < bVar38;
  *pbVar1 = (*pbVar1 - bVar25) - bVar38;
  bVar3 = bVar4 + 0x14;
  bVar38 = 0xeb < bVar4 || CARRY1(bVar3,bVar39);
  bVar3 = bVar3 + bVar39;
  bVar4 = bVar3 + 0x10;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19 + (0xef < bVar3 || CARRY1(bVar4,bVar38));
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  *pbVar35 = *pbVar35 + bVar11;
  bVar3 = (bVar4 + bVar38 | 0xc) + 4 | 0x24;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar3;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar22;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar7;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar3;
  cVar6 = bVar3 + 0x14;
  *pbVar35 = *pbVar35 + bVar7;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar7;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  *pbVar35 = *pbVar35 + bVar13;
  bVar38 = (byte)(bVar3 - 0x18) < 0x18;
  pbVar1 = in_BX + (int)pbVar35;
  bVar39 = *pbVar1 < bVar25 || (byte)(*pbVar1 - bVar25) < bVar38;
  *pbVar1 = (*pbVar1 - bVar25) - bVar38;
  bVar38 = 0xeb < (byte)(bVar3 - 0x30) || CARRY1(bVar3 - 0x1c,bVar39);
  bVar4 = (bVar3 - 0x1c) + bVar39;
  bVar3 = bVar4 + 0x10;
  bVar5 = bVar3 + bVar38;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19 + (0xef < bVar4 || CARRY1(bVar3,bVar38));
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + (bVar5 | 0xc);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] ^ bVar24;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar22;
  *pbVar35 = *pbVar35 - bVar7;
  uVar16 = ((CONCAT11(bVar7,bVar5) | 0xc) ^ 4) & 0xff24;
  bVar7 = (byte)(uVar16 >> 8);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar7;
  *pbVar35 = *pbVar35 & bVar25;
  bVar4 = (byte)uVar16;
  bVar3 = bVar4 - 0x1c;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar3 + (bVar4 < 0x1c);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar3;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar3;
  *pbVar35 = *pbVar35 + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar3;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar3;
  *pbVar35 = *pbVar35 + bVar24;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar3;
  *pbVar35 = *pbVar35 + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar24;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] ^ bVar3 & 0x18;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - CARRY1(bVar3,bVar25);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar7;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + 0xc;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + 0xc;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + 0xc;
  *pbVar35 = *pbVar35 + bVar13;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 - bVar25;
  pbVar1 = in_BX + (int)pbVar35;
  bVar4 = *pbVar1;
  bVar5 = *pbVar1;
  *pbVar1 = bVar5 + bVar19 + (bVar3 < bVar25);
  *pbVar35 = *pbVar35 + bVar11 + (CARRY1(bVar4,bVar19) || CARRY1(bVar5 + bVar19,bVar3 < bVar25));
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar11;
  *pbVar35 = *pbVar35 | 0xcc;
  *pbVar35 = *pbVar35 + bVar24;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] ^ 0xd0;
  *pbVar35 = *pbVar35 - bVar7;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar25;
  pbVar1 = in_BX + (int)pbVar35;
  bVar4 = *pbVar1;
  bVar5 = *pbVar1;
  *pbVar1 = (bVar5 + 0x30) - CARRY1(bVar3,bVar25);
  in_BX[(int)pbVar35] =
       in_BX[(int)pbVar35] + bVar19 + (bVar4 < 0xd0 || (byte)(bVar5 + 0x30) < CARRY1(bVar3,bVar25));
  *pbVar35 = *pbVar35 + bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar22;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 - 0x30;
  cVar6 = -0x30 - (0x2f < bVar3);
  *pbVar35 = *pbVar35 + bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar19;
  cVar6 = cVar6 + CARRY1(bVar3,bVar19) + '\x04';
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar7;
  *pbVar35 = *pbVar35 & bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - cVar6;
  uVar16 = CONCAT11(bVar7,cVar6) & 0xff18;
  *pbVar35 = *pbVar35 + bVar19;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar25;
  bVar5 = (byte)(uVar16 >> 8);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar5;
  bVar3 = ((char)uVar16 + -0x20) - CARRY1(bVar3,bVar25) ^ 0x34;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar3;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar5;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar3;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar3;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar3;
  *pbVar35 = *pbVar35 + bVar13;
  bVar38 = (byte)(bVar3 - 0x2c) < 0x18;
  pbVar1 = in_BX + (int)pbVar35;
  bVar39 = *pbVar1 < bVar25 || (byte)(*pbVar1 - bVar25) < bVar38;
  *pbVar1 = (*pbVar1 - bVar25) - bVar38;
  bVar38 = 0xeb < (byte)(bVar3 + 0xbc) || CARRY1(bVar3 - 0x30,bVar39);
  bVar4 = (bVar3 - 0x30) + bVar39;
  bVar3 = bVar4 + 0x10;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19 + (0xef < bVar4 || CARRY1(bVar3,bVar38));
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar11;
  *pbVar35 = *pbVar35 + bVar5;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] ^ bVar24;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar22;
  *pbVar35 = *pbVar35 - bVar5;
  uVar16 = ((CONCAT11(bVar5,bVar3 + bVar38) | 0xc) ^ 0x34) & 0xff24;
  bVar3 = (byte)(uVar16 >> 8);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar3;
  *pbVar35 = *pbVar35 & bVar25;
  uVar16 = (CONCAT11(bVar3,(char)uVar16 + -0x1c) ^ 0x38) & 0xff0c;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  bVar21 = (byte)(uVar16 >> 8);
  *pbVar1 = *pbVar1 - bVar21;
  pbVar1 = in_BX + (int)pbVar35;
  bVar4 = *pbVar1;
  bVar7 = (byte)uVar16;
  bVar5 = *pbVar1;
  *pbVar1 = (bVar5 - bVar7) - (bVar3 < bVar21);
  bVar3 = bVar7 + 0x2c + (bVar4 < bVar7 || (byte)(bVar5 - bVar7) < (bVar3 < bVar21));
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar3;
  *pbVar35 = *pbVar35 ^ bVar13;
  in_BX[(int)pbVar35] =
       (in_BX[(int)pbVar35] - bVar19) -
       (0xef < (byte)(bVar3 + 0x1c) || CARRY1(bVar3 + 0x2c,0xe3 < bVar3));
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar21;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar19;
  (in_BX + (int)unaff_DI)[-0x4dfe] = (in_BX + (int)unaff_DI)[-0x4dfe] + bVar22;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar21;
  bVar12 = bVar12 | 1;
  bVar3 = bVar12 * -6 + 0x3f & 0xf;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar3;
  *pbVar35 = *pbVar35 + bVar13;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar25) - ((byte)(bVar3 - 0x2c) < 0x18);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar13;
  uVar16 = CONCAT11(bVar21 - bVar12,bVar3 + 0xbc) & 0xff24;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar19;
  bVar8 = (byte)(uVar16 >> 8);
  bVar7 = (char)uVar16 + '<' + CARRY1(bVar3,bVar19);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar7;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar7;
  *pbVar35 = *pbVar35 + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar7;
  *pbVar35 = *pbVar35 + bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar7;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar7;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar25;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19 + CARRY1(bVar3,bVar19);
  bVar7 = bVar7 | 0xc;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar7;
  *pbVar35 = *pbVar35 + bVar11;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar19;
  pbVar1 = in_BX + (int)pbVar35;
  bVar4 = *pbVar1;
  bVar5 = *pbVar1;
  *pbVar1 = bVar5 + bVar7 + CARRY1(bVar3,bVar19);
  *pbVar35 = (*pbVar35 - bVar19) -
             (CARRY1(bVar4,bVar7) || CARRY1(bVar5 + bVar7,CARRY1(bVar3,bVar19)));
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar8;
  cVar6 = bVar7 - CARRY1(bVar3,bVar8);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - (cVar6 + -0x24);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6 + -8;
  *pbVar35 = *pbVar35 + bVar24;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar11;
  *pbVar35 = *pbVar35 + bVar8;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar8;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  *pbVar35 = *pbVar35 + bVar13;
  bVar7 = cVar6 + 0xbc;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar25) - ((byte)(cVar6 - 0x2cU) < 0x18);
  *pbVar35 = *pbVar35 + bVar22;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar7;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar25;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar19;
  pbVar1 = in_BX + (int)pbVar35;
  bVar4 = *pbVar1;
  bVar5 = *pbVar1;
  *pbVar1 = bVar5 + bVar7 + CARRY1(bVar3,bVar19);
  *pbVar35 = *pbVar35 + bVar11 + (CARRY1(bVar4,bVar7) || CARRY1(bVar5 + bVar7,CARRY1(bVar3,bVar19)))
  ;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar11;
  *pbVar35 = *pbVar35;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + 0xc;
  *pbVar35 = *pbVar35 | bVar24;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & 0xc;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar25;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar8;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar19) - (0xf3U < CARRY1(bVar3,bVar8));
  *pbVar35 = *pbVar35 + bVar19;
  bVar4 = CARRY1(bVar3,bVar8) + 0xcU | 4;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar4 + 0x20;
  *pbVar35 = *pbVar35 & bVar8;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 - bVar25;
  bVar38 = (byte)(bVar4 - 0x10) < 0x20 || (byte)(bVar4 - 0x30) < (bVar3 < bVar25);
  bVar4 = (bVar4 - 0x30) - (bVar3 < bVar25);
  bVar3 = bVar4 + 0x14;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar19) - (0xeb < bVar4 || CARRY1(bVar3,bVar38));
  bVar3 = bVar3 + bVar38 | 0x10;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar8;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar3;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar3;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar3;
  *pbVar35 = *pbVar35 + bVar13;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar25) - ((byte)(bVar3 - 0x2c) < 0x18);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar22;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35];
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar19;
  bVar4 = in_BX[(int)pbVar35];
  in_BX[(int)pbVar35] = bVar4 + CARRY1(bVar3,bVar19);
  *pbVar35 = *pbVar35 + CARRY1(bVar4,CARRY1(bVar3,bVar19));
  *pbVar35 = *pbVar35 + bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] ^ 0x3c;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar22;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - 0x1c) - CARRY1(bVar3,bVar22);
  *pbVar35 = *pbVar35 & bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar11;
  *pbVar35 = *pbVar35 + bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - 8;
  *pbVar35 = *pbVar35 + bVar25;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + 0x30;
  *pbVar35 = *pbVar35 + bVar25 + (bVar3 < 0xd0);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar8;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar8;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar19;
  *pbVar35 = *pbVar35 - 0x40;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - 0x40;
  *pbVar35 = *pbVar35 + bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar22;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35];
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar19;
  bVar4 = in_BX[(int)pbVar35];
  in_BX[(int)pbVar35] = bVar4 + CARRY1(bVar3,bVar19);
  *pbVar35 = *pbVar35 + bVar19;
  bVar4 = 0x38 - CARRY1(bVar4,CARRY1(bVar3,bVar19));
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] ^ bVar4;
  bVar4 = bVar4 ^ 0x20;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar22;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar4) - CARRY1(bVar3,bVar22);
  *pbVar35 = *pbVar35 & bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar11;
  *pbVar35 = *pbVar35 + bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - (bVar4 & 0x20 | 8);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar25;
  *pbVar35 = *pbVar35 + bVar25;
  *pbVar35 = *pbVar35 + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar11;
  *pbVar35 = *pbVar35 + bVar25;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 - bVar25;
  pbVar1 = in_BX + (int)pbVar35;
  bVar38 = *pbVar1 < bVar25 || (byte)(*pbVar1 - bVar25) < (bVar3 < bVar25);
  *pbVar1 = (*pbVar1 - bVar25) - (bVar3 < bVar25);
  pbVar1 = pbVar35;
  bVar39 = *pbVar1 < bVar19 || (byte)(*pbVar1 - bVar19) < bVar38;
  *pbVar1 = (*pbVar1 - bVar19) - bVar38;
  cVar6 = bVar39 + 'T';
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar8;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  *pbVar35 = *pbVar35 + bVar13;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar25) - ((byte)(bVar39 + 0x28U) < 0x18);
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar24;
  *pbVar35 = *pbVar35 + bVar39 + '\x10' + CARRY1(bVar3,bVar24);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35];
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar19;
  bVar4 = in_BX[(int)pbVar35];
  in_BX[(int)pbVar35] = bVar4 + CARRY1(bVar3,bVar19);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  bVar4 = 0x30 - CARRY1(bVar4,CARRY1(bVar3,bVar19));
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] ^ bVar4;
  bVar4 = bVar4 ^ 0x20;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar22;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar4) - CARRY1(bVar3,bVar22);
  *pbVar35 = *pbVar35 & bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19 + (bVar4 < 0x14);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar11;
  *pbVar35 = *pbVar35 + bVar25;
  bVar21 = bVar4 - 0x14 | 8;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar21;
  *pbVar35 = *pbVar35 ^ bVar13;
  *pbVar35 = *pbVar35 + bVar25;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 - bVar21;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar11;
  *pbVar35 = *pbVar35 + bVar8;
  *pbVar35 = *pbVar35 ^ bVar25;
  pbVar1 = in_BX + (int)pbVar35;
  bVar4 = *pbVar1;
  *pbVar1 = *pbVar1 - bVar25;
  pbVar1 = pbVar35;
  bVar5 = *pbVar1;
  bVar7 = *pbVar1;
  *pbVar1 = (bVar7 - bVar19) - (bVar4 < bVar25);
  cVar6 = (bVar21 + (bVar3 < bVar21) + 0x18 | 0x1c) + 0x38 +
          (bVar5 < bVar19 || (byte)(bVar7 - bVar19) < (bVar4 < bVar25));
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar8;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar19;
  *pbVar35 = *pbVar35 + cVar6;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  *pbVar35 = *pbVar35 + bVar13;
  bVar3 = cVar6 + 0xbc;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar25) - ((byte)(cVar6 - 0x2cU) < 0x18);
  *pbVar35 = *pbVar35 + bVar24;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar22;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar8;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar3;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar25;
  *pbVar35 = *pbVar35 + bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] ^ bVar8;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar22;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar3;
  uVar16 = CONCAT11(bVar8,bVar3) & 0xff1c;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar25;
  pbVar1 = in_BX + (int)pbVar35;
  bVar4 = *pbVar1;
  bVar7 = (byte)uVar16;
  bVar5 = *pbVar1;
  *pbVar1 = (bVar5 - bVar7) - CARRY1(bVar3,bVar25);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar11;
  uVar16 = CONCAT11((char)(uVar16 >> 8),
                    bVar7 + 0x14 + (bVar4 < bVar7 || (byte)(bVar5 - bVar7) < CARRY1(bVar3,bVar25)))
           & 0xff20;
  bVar21 = (byte)(uVar16 >> 8);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar21;
  cVar6 = (char)uVar16;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar19;
  bVar5 = cVar6 + '\x14' + CARRY1(bVar3,bVar19) | 0x2c;
  *pbVar35 = *pbVar35 & bVar11;
  bVar38 = 0xeb < (byte)(bVar5 - 0x3c);
  bVar7 = bVar5 - 0x28;
  pbVar1 = in_BX + (int)pbVar35;
  bVar39 = CARRY1(*pbVar1,bVar19) || CARRY1(*pbVar1 + bVar19,bVar38);
  *pbVar1 = *pbVar1 + bVar19 + bVar38;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  bVar4 = *pbVar1;
  *pbVar1 = bVar4 + bVar7 + bVar39;
  in_BX[(int)pbVar35] =
       (in_BX[(int)pbVar35] - bVar25) - (CARRY1(bVar3,bVar7) || CARRY1(bVar4 + bVar7,bVar39));
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar19;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar19) - CARRY1(bVar3,bVar19);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar7;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar21;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar7;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar7;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar7;
  *pbVar35 = *pbVar35 + bVar13;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar25) - ((byte)(bVar5 + 0xac) < 0x18);
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar24;
  *pbVar35 = *pbVar35 + bVar5 + 0x94 + CARRY1(bVar3,bVar24);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35];
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar19;
  bVar4 = in_BX[(int)pbVar35];
  in_BX[(int)pbVar35] = bVar4 + CARRY1(bVar3,bVar19);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  bVar4 = 0x30 - CARRY1(bVar4,CARRY1(bVar3,bVar19));
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] ^ bVar4;
  bVar4 = bVar4 ^ 0x20;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar22;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar4) - CARRY1(bVar3,bVar22);
  *pbVar35 = *pbVar35 & bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19 + (bVar4 < 0x14);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar11;
  *pbVar35 = *pbVar35 + bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - (bVar4 - 0x14 | 8);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar25;
  *pbVar35 = *pbVar35 + bVar25;
  *pbVar35 = *pbVar35 + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar11;
  *pbVar35 = *pbVar35 + bVar25;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 - bVar25;
  pbVar1 = in_BX + (int)pbVar35;
  bVar38 = *pbVar1 < bVar25 || (byte)(*pbVar1 - bVar25) < (bVar3 < bVar25);
  *pbVar1 = (*pbVar1 - bVar25) - (bVar3 < bVar25);
  pbVar1 = pbVar35;
  bVar39 = *pbVar1 < bVar19 || (byte)(*pbVar1 - bVar19) < bVar38;
  *pbVar1 = (*pbVar1 - bVar19) - bVar38;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar21;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar19;
  *pbVar35 = *pbVar35 + bVar39 + 'T';
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar39 + 'T';
  *pbVar35 = *pbVar35 + bVar13;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar25) - ((byte)(bVar39 + 0x28U) < 0x18);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar22;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar39 + '\x10';
  *pbVar35 = *pbVar35 + bVar13;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar13;
  *pbVar35 = *pbVar35 ^ bVar22;
  bVar5 = (bVar39 + -0x28) - CARRY1(bVar3,bVar13) ^ 0x14U | 0x28;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar25;
  bVar7 = bVar5 + 0x18;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  bVar4 = *pbVar1;
  *pbVar1 = bVar4 + bVar7 + (0xe7 < bVar5);
  in_BX[(int)pbVar35] =
       in_BX[(int)pbVar35] + bVar11 + (CARRY1(bVar3,bVar7) || CARRY1(bVar4 + bVar7,0xe7 < bVar5));
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar22;
  *pbVar35 = *pbVar35 + bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar24;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar7;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar7;
  bVar7 = bVar7 - CARRY1(bVar3,bVar7);
  *pbVar35 = *pbVar35 ^ bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar21;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] ^ bVar7;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar24;
  *pbVar35 = *pbVar35 - bVar19;
  bVar4 = (bVar7 - (bVar7 < 0x34)) + 0xb0 | 0x20;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar11;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar11) - CARRY1(bVar3,bVar11);
  cVar6 = bVar4 + 0x10;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar13 + CARRY1(bVar3,bVar19);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar21;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  *pbVar35 = *pbVar35 + bVar13;
  *pbVar35 = *pbVar35 + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] ^ bVar22;
  bVar4 = (bVar4 + ((byte)(bVar4 - 0x18) < 0x1c) + 0xc | 0x3c) ^ 0x14;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar25;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar4;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] ^ bVar24;
  uVar16 = CONCAT11(bVar21,bVar4 + CARRY1(bVar3,bVar4) + -0x30) & 0xff24;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar11;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar13;
  bVar7 = (byte)(uVar16 >> 8);
  *pbVar35 = *pbVar35 - bVar19;
  *pbVar35 = *pbVar35 | bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] ^ bVar22;
  bVar5 = (char)uVar16 + '\b' + CARRY1(bVar3,bVar13) | 0x1c;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar19;
  bVar4 = bVar5 + 0x14;
  bVar38 = 0xeb < bVar5 || CARRY1(bVar4,CARRY1(bVar3,bVar19));
  bVar4 = bVar4 + CARRY1(bVar3,bVar19);
  bVar3 = bVar4 + 0x18;
  bVar39 = 0xe7 < bVar4 || CARRY1(bVar3,bVar38);
  bVar3 = bVar3 + bVar38;
  pbVar1 = in_BX + (int)pbVar35;
  bVar38 = *pbVar1 < bVar25 || (byte)(*pbVar1 - bVar25) < bVar39;
  *pbVar1 = (*pbVar1 - bVar25) - bVar39;
  bVar4 = bVar3 - 0x1c;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar7;
  uVar16 = CONCAT11(bVar7,((bVar4 - bVar38) + -0x20) - (bVar3 < 0x1c || bVar4 < bVar38)) & 0xff20;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar22;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] ^ bVar24;
  *pbVar35 = *pbVar35 ^ bVar24;
  uVar18 = uVar16 ^ 0x34;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + (char)uVar18;
  cVar6 = (char)(uVar16 >> 8);
  *(byte *)((int)unaff_DI + 3) = *(byte *)((int)unaff_DI + 3) + cVar6;
  *(uint *)(in_BX + (int)pbVar35) = *(uint *)(in_BX + (int)pbVar35) | uVar18;
  *pbVar35 = *pbVar35 | 0x3c;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar25 + (0xf7U < CARRY1(bVar3,bVar11));
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | 0x3c;
  pbVar1 = pbVar35;
  bVar4 = *pbVar1;
  *pbVar1 = *pbVar1 - bVar11;
  uVar16 = (CONCAT11(cVar6,CARRY1(bVar3,bVar11) + ',' + (bVar4 < bVar11)) | 0x14) & 0xff18;
  cVar28 = (char)(uVar16 >> 8);
  *pbVar35 = *pbVar35 - cVar28;
  bVar4 = (byte)uVar16;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar4;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar4;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + 0x3c;
  cVar6 = (bVar4 - 0x2c) - (0xc3 < bVar3);
  *pbVar35 = *pbVar35 + bVar25 + (bVar4 < 0x2c || (byte)(bVar4 - 0x2c) < (0xc3 < bVar3));
  pbVar35[unaff_BP + 0x303f] = pbVar35[unaff_BP + 0x303f] + bVar24;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar24;
  *pbVar35 = *pbVar35 + bVar13;
  bVar4 = cVar6 + 0x98;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar25) - ((byte)(cVar6 + 0xb0U) < 0x18);
  *pbVar35 = *pbVar35 + cVar28;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar4;
  *pbVar35 = *pbVar35 + bVar24;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar4;
  uVar16 = CONCAT11(cVar28,cVar6 + 0xacU + CARRY1(bVar3,bVar4) +
                           (0xeb < bVar4 || CARRY1(cVar6 + 0xacU,CARRY1(bVar3,bVar4))) + '0') &
           0xff04;
  bVar4 = (char)uVar16 + 0x20;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar4;
  bVar4 = bVar4 - CARRY1(bVar3,bVar4);
  *pbVar35 = *pbVar35 + 0x3c;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar4;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar4 + CARRY1(bVar3,bVar4);
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar25;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar22;
  *pbVar35 = *pbVar35 - bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - (((bVar4 - 0x1c) - CARRY1(bVar3,bVar25) | 0x1c) - 8);
  *pbVar35 = *pbVar35 + bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + 0x3c;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar24;
  bVar4 = (byte)(uVar16 >> 8);
  cVar6 = -CARRY1(bVar3,bVar24);
  *pbVar35 = *pbVar35 - bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar4;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & 0x3c;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + cVar6;
  *pbVar35 = *pbVar35 + bVar13;
  in_BX[(int)pbVar35] = (in_BX[(int)pbVar35] - bVar25) - ((byte)(cVar6 - 0x2cU) < 0x18);
  uVar16 = CONCAT11(bVar4,((cVar6 - ((byte)(cVar6 + 0xbcU) < 0x30)) + 0x6cU ^ 0x28) + 0x2c) & 0xff10
  ;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  bVar19 = (byte)(uVar16 >> 8);
  *pbVar1 = *pbVar1 - bVar19;
  pbVar1 = pbVar35;
  bVar38 = CARRY1(*pbVar1,bVar19) || CARRY1(*pbVar1 + bVar19,bVar3 < bVar19);
  *pbVar1 = *pbVar1 + bVar19 + (bVar3 < bVar19);
  bVar4 = (byte)uVar16;
  bVar3 = bVar4 - 0xc;
  *pbVar35 = *pbVar35 | 0x3c;
  bVar4 = ((bVar3 - bVar38) + -0x14) - (bVar4 < 0xc || bVar3 < bVar38) | 4;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] - bVar11;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + 0x3c;
  bVar5 = bVar4 - 0x10;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar25 + (bVar4 < 0x10 || bVar5 < (0xc3 < bVar3));
  *pbVar35 = *pbVar35 | bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] | bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar11;
  pbVar1 = in_BX + (int)pbVar35;
  bVar4 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar25;
  *pbVar35 = *pbVar35 + (((bVar5 - (0xc3 < bVar3) | 0xc) + 8 | 0x18) ^ 0x2c) + CARRY1(bVar4,bVar25);
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar25;
  *pbVar35 = *pbVar35 | 0x3c;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + 0x3c;
  pbVar1 = in_BX + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar24;
  bVar8 = -CARRY1(bVar3,bVar24);
  *pbVar35 = *pbVar35 - bVar11;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar13;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & bVar19;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] & 0x3c;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar8;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar8;
  in_BX[(int)pbVar35] = in_BX[(int)pbVar35] + bVar8;
  bVar25 = bVar25 + bVar8;
  iVar15 = CONCAT11(bVar13,bVar25);
  pbVar35[unaff_BP + 0x93c] = pbVar35[unaff_BP + 0x93c] + bVar24;
  pbVar35[iVar15 + 0x1000] = pbVar35[iVar15 + 0x1000] + bVar24;
  bVar7 = pbVar35[iVar15];
  pbVar35[unaff_BP] = pbVar35[unaff_BP] + bVar11;
  pbVar35[iVar15] = pbVar35[iVar15] | bVar25;
  bVar21 = bVar11 + pbVar35[iVar15];
  pbVar35[unaff_BP] = (pbVar35[unaff_BP] - 0x3c) - CARRY1(bVar11,pbVar35[iVar15]);
  bVar11 = bVar8 | bVar7 | 0x1e;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 - bVar21;
  pbVar35[iVar15] = (pbVar35[iVar15] - bVar25) - (bVar3 < bVar21);
  bVar25 = bVar25 - *(char *)0x2a18;
  pbVar29 = (byte *)CONCAT11(bVar13,bVar25);
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar11;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar11;
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar11;
  pbVar1 = (byte *)0x1018;
  bVar4 = *pbVar1;
  bVar5 = *pbVar1;
  *pbVar1 = bVar5 + bVar19 + CARRY1(bVar3,bVar11);
  *pbVar35 = (*pbVar35 - bVar19) -
             (CARRY1(bVar4,bVar19) || CARRY1(bVar5 + bVar19,CARRY1(bVar3,bVar11)));
  pbVar35[unaff_BP + 0x3300] = pbVar35[unaff_BP + 0x3300] + bVar24;
  (pbVar29 + (int)pbVar35)[0x2014] = (pbVar29 + (int)pbVar35)[0x2014] + bVar24;
  uVar16 = (CONCAT11(bVar19,bVar8 | bVar7) | 0x1e) & 0xff1c;
  *pbVar35 = *pbVar35 - bVar22;
  bVar3 = (byte)uVar16 | 0x18;
  bVar7 = (byte)(uVar16 >> 8);
  cVar6 = (bVar3 - 8) + (bVar3 < 8);
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] | 0x3c;
  bVar5 = cVar6 + 0x1c;
  *pbVar35 = *pbVar35 | bVar21;
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar5;
  *pbVar35 = *pbVar35 + bVar25 + CARRY1(bVar3,bVar5);
  *pbVar35 = *pbVar35 & bVar7;
  *pbVar35 = *pbVar35 ^ bVar24;
  *pbVar35 = *pbVar35 + bVar25;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar5;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  bVar4 = *pbVar1;
  *pbVar1 = bVar4 + bVar7 + (0xf3 < bVar5);
  bVar3 = (cVar6 + '(') - (CARRY1(bVar3,bVar7) || CARRY1(bVar4 + bVar7,0xf3 < bVar5));
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar25;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] | bVar3;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] | bVar22;
  *pbVar35 = *pbVar35 - bVar21;
  bVar4 = bVar3 + 8 | 0xc;
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + 0x3c;
  pbVar1 = pbVar35;
  bVar38 = 0xc3 < *pbVar1 || CARRY1(*pbVar1 + 0x3c,0xc3 < bVar3);
  *pbVar1 = *pbVar1 + 0x3c + (0xc3 < bVar3);
  bVar5 = bVar4 + 0x14;
  bVar39 = 0xeb < bVar4 || CARRY1(bVar5,bVar38);
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar40 = *pbVar1 < bVar25 || (byte)(*pbVar1 - bVar25) < bVar39;
  *pbVar1 = (*pbVar1 - bVar25) - bVar39;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  bVar4 = *pbVar1;
  *pbVar1 = (bVar4 - bVar25) - bVar40;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] & bVar7;
  *pbVar35 = *pbVar35 & bVar7;
  uVar16 = CONCAT11(bVar7,(bVar5 + bVar38 + -0x1c) -
                          (bVar3 < bVar25 || (byte)(bVar4 - bVar25) < bVar40)) & 0xff24;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] - bVar22;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] - bVar24;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] ^ bVar24;
  bVar11 = (byte)(uVar16 >> 8);
  bVar5 = (byte)uVar16 ^ 0xc;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar5;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] ^ bVar24;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] - bVar22;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] - bVar11;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] & bVar11;
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 - bVar25;
  pbVar1 = pbVar35;
  bVar38 = *pbVar1 < 0x3c || (byte)(*pbVar1 - 0x3c) < (bVar3 < bVar25);
  *pbVar1 = (*pbVar1 - 0x3c) - (bVar3 < bVar25);
  bVar39 = 0xeb < bVar5 || CARRY1(bVar5 + 0x14,bVar38);
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar3 = *pbVar1;
  bVar4 = *pbVar1;
  *pbVar1 = bVar4 + 0x3c + bVar39;
  *pbVar35 = *pbVar35 + bVar21 + (0xc3 < bVar3 || CARRY1(bVar4 + 0x3c,bVar39));
  bVar4 = bVar5 + 0x14 + bVar38 | 0xc;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] | bVar21;
  *pbVar35 = *pbVar35 | bVar4;
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar24;
  bVar7 = bVar4 + 4 + CARRY1(bVar3,bVar24) ^ 0x34;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar22;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] - bVar7;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] & bVar11;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar25;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] | bVar21;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] - bVar21;
  *pbVar35 = *pbVar35 | bVar25;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] | bVar21;
  *pbVar35 = *pbVar35 | bVar21;
  bVar4 = bVar7 + 0xc;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar4;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] | bVar4;
  *pbVar35 = *pbVar35 + bVar21;
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar4;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + 0x3c + CARRY1(bVar3,bVar4);
  bVar8 = bVar7 + 0x10;
  pbVar29[(int)pbVar35] = (pbVar29[(int)pbVar35] - bVar8) - (0xfb < bVar4);
  *pbVar35 = *pbVar35 - 0x3c;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar11;
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar4 = *pbVar1;
  bVar5 = *pbVar1;
  *pbVar1 = bVar5 + bVar8 + CARRY1(bVar3,bVar11);
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar25;
  bVar7 = (bVar7 - (CARRY1(bVar4,bVar8) || CARRY1(bVar5 + bVar8,CARRY1(bVar3,bVar11)))) + 8;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + 0x3c;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] ^ bVar7;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar7;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] ^ bVar24;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] & bVar11;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] & bVar25;
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 - bVar25;
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar4 = *pbVar1;
  bVar5 = *pbVar1;
  *pbVar1 = bVar5 + 0x3c + (bVar3 < bVar25);
  *pbVar35 = *pbVar35 + bVar21 + (0xc3 < bVar4 || CARRY1(bVar5 + 0x3c,bVar3 < bVar25));
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar25;
  bVar3 = (bVar7 | 0x3c) - 0x1c ^ 0x24;
  uVar16 = CONCAT11(bVar11,(bVar3 + 0x20) - (0xd3 < bVar3)) & 0xff14;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] | bVar25;
  bVar4 = (byte)uVar16 | 8;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] | 0x3c;
  bVar20 = (byte)(uVar16 >> 8);
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 - 0x3c;
  *pbVar35 = *pbVar35 + bVar25 + (bVar3 < 0x3c);
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] | bVar21;
  *pbVar35 = *pbVar35 - bVar25;
  pbVar29[(int)pbVar35] =
       pbVar29[(int)pbVar35] + bVar21 + (0xe3 < (bVar4 + 0x48 + (0xcb < bVar4) & 4));
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar21;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] | bVar21;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar22;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] - bVar22;
  *pbVar35 = *pbVar35 + 0x3c;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar22;
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + 0x3c;
  bVar4 = -(0xc3 < bVar3) - 8;
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar24;
  pbVar29[(int)unaff_DI] = (pbVar29[(int)unaff_DI] - bVar4) - CARRY1(bVar3,bVar24);
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] | bVar4;
  pbVar29[(int)pbVar35] = (pbVar29[(int)pbVar35] - bVar25) - 1;
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar24;
  *pbVar35 = (*pbVar35 - 8) + CARRY1(bVar3,bVar24);
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35];
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar25;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35];
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35];
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35];
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35];
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] ^ 0x30;
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar22;
  pbVar29[(int)pbVar35] = (pbVar29[(int)pbVar35] - 0x10) - CARRY1(bVar3,bVar22);
  *pbVar35 = *pbVar35 & bVar25;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + 1;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar21;
  *pbVar35 = *pbVar35 + bVar25;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + 4;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar25;
  *pbVar35 = *pbVar35 + bVar25;
  *pbVar35 = *pbVar35;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] & bVar21;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] | bVar21;
  *pbVar35 = *pbVar35 + bVar25;
  pbVar1 = pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 - bVar25;
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar38 = *pbVar1 < bVar25 || (byte)(*pbVar1 - bVar25) < (bVar3 < bVar25);
  *pbVar1 = (*pbVar1 - bVar25) - (bVar3 < bVar25);
  bVar3 = *pbVar35;
  *pbVar35 = bVar3 - bVar38;
  bVar3 = (bVar3 < bVar38) + 0x54;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] & bVar20;
  pbVar29[(int)pbVar35] = 0;
  *pbVar35 = *pbVar35 + bVar3;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35];
  bVar12 = 9 < (bVar3 & 0xf) | bVar12;
  bVar4 = bVar3 + bVar12 * -6 & 0xf;
  bVar3 = 9 < bVar4 | bVar12;
  bVar5 = bVar4 + bVar3 * -6 & 0xf;
  bVar4 = 9 < bVar5 | bVar3;
  bVar7 = bVar5 + bVar4 * -6 & 0xf;
  bVar5 = 9 < bVar7 | bVar4;
  bVar7 = bVar7 + bVar5 * '\x06';
  bVar5 = 9 < (bVar7 & 0xf) | bVar5;
  bVar7 = bVar7 + bVar5 * '\x06';
  bVar5 = 9 < (bVar7 & 0xf) | bVar5;
  bVar8 = bVar7 + bVar5 * -6 & 0xf;
  bVar7 = 9 < bVar8 | bVar5;
  bVar11 = bVar8 + bVar7 * -6 & 0xf;
  bVar8 = 9 < bVar11 | bVar7;
  bVar19 = bVar11 + bVar8 * -6 & 0xf;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar8;
  bVar11 = 9 < bVar19 | bVar8;
  bVar9 = bVar19 + bVar11 * -6 & 0xf;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] | bVar21;
  bVar19 = 9 < bVar9 | bVar11;
  bVar9 = bVar9 + bVar19 * -6;
  bVar10 = bVar9 & 0xf;
  uVar16 = CONCAT11((((((((bVar20 - bVar12) - bVar3) - bVar4) - bVar5) - bVar7) - bVar8) - bVar11) -
                    bVar19,bVar9) & 0xff0f;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar10;
  *(byte *)(unaff_BP + (int)unaff_DI) = *(byte *)(unaff_BP + (int)unaff_DI) + bVar24;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar10;
  bVar4 = (byte)uVar16;
  bVar19 = 9 < bVar4 | bVar19;
  cVar6 = (char)(uVar16 >> 8);
  bVar4 = bVar4 + bVar19 * '\x06';
  bVar4 = bVar4 + (0x90 < (bVar4 & 0xf0) | bVar19 * (0xf9 < bVar4)) * '`';
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar4;
  *(uint *)(pbVar29 + (int)pbVar35) = *(uint *)(pbVar29 + (int)pbVar35) & CONCAT11(cVar6,bVar4);
  *pbVar35 = *pbVar35 + bVar25;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar4;
  pbVar1 = pbVar29 + (int)pbVar35;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar4;
  pbVar29[(int)pbVar35] = pbVar29[(int)pbVar35] + bVar4 + CARRY1(bVar3,bVar4);
  *pbVar29 = *pbVar29 + bVar13;
  bVar19 = 9 < (bVar4 & 0xf) | bVar19;
  bVar3 = bVar4 + bVar19 * -6 & 0xf;
  bVar4 = *pbVar29;
  bVar5 = 9 < bVar3 | bVar19;
  bVar3 = bVar3 + bVar5 * -6 & 0xf;
  bVar7 = 9 < bVar3 | bVar5;
  bVar3 = bVar3 + bVar7 * -6 & 0xf;
  bVar23 = -*pbVar29;
  bVar12 = 9 < bVar3 | bVar7;
  bVar11 = bVar3 + bVar12 * -6 & 0xf;
  *pbVar29 = *pbVar29 + bVar13 + bVar12;
  bVar21 = bVar21 & pbVar29[(int)pbVar35];
  bVar8 = 9 < bVar11 | bVar12;
  pbVar1 = pbVar29 + (int)unaff_DI;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar13;
  uVar14 = ((CONCAT11(((((cVar6 - bVar19 ^ bVar4) - bVar5) - bVar7) - bVar12) - bVar8,
                      bVar11 + bVar8 * -6) & 0xff0f) - *(int *)(pbVar29 + (int)pbVar35)) -
           (uint)CARRY1(bVar3,bVar13);
  puVar30 = (uint *)((uint)pbVar29 ^ *(uint *)(pbVar29 + (int)pbVar35));
  puVar2 = unaff_DI;
  uVar16 = *puVar2;
  *(byte *)puVar2 = (byte)*puVar2 + bVar22;
  uVar16 = (uint)CARRY1((byte)uVar16,bVar22);
  uVar18 = uVar14 + 0x2700;
  iVar15 = uVar18 + uVar16 + *(int *)(byte *)((int)puVar30 + (int)pbVar35) +
           (uint)(0xd8ff < uVar14 || CARRY2(uVar18,uVar16));
  *(uint *)((int)puVar30 + (int)pbVar35) =
       *(uint *)((int)puVar30 + (int)pbVar35) & CONCAT11(bVar24,bVar23);
  cVar26 = (char)puVar30;
  *pbVar35 = *pbVar35 + cVar26;
  pbVar1 = (byte *)0xb;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar23;
  *(byte *)((int)puVar30 + (int)pbVar35) =
       *(byte *)((int)puVar30 + (int)pbVar35) + bVar21 + CARRY1(bVar3,bVar23);
  bVar31 = (byte)((uint)puVar30 >> 8);
  *(byte *)puVar30 = (byte)*puVar30 + bVar31;
  bVar3 = (byte)iVar15;
  bVar8 = 9 < (bVar3 & 0xf) | bVar8;
  bVar4 = bVar3 + bVar8 * -6 & 0xf;
  bVar3 = 9 < bVar4 | bVar8;
  bVar5 = bVar4 + bVar3 * -6 & 0xf;
  bVar4 = 9 < bVar5 | bVar3;
  bVar7 = bVar5 + bVar4 * -6 & 0xf;
  bVar5 = 9 < bVar7 | bVar4;
  bVar12 = bVar7 + bVar5 * -6 & 0xf;
  bVar7 = 9 < bVar12 | bVar5;
  bVar11 = bVar12 + bVar7 * -6 & 0xf;
  bVar12 = 9 < bVar11 | bVar7;
  bVar11 = bVar11 + bVar12 * '\x06';
  bVar12 = 9 < (bVar11 & 0xf) | bVar12;
  bVar19 = bVar11 + bVar12 * -6 & 0xf;
  bVar11 = 9 < bVar19 | bVar12;
  bVar9 = bVar19 + bVar11 * -6 & 0xf;
  bVar19 = 9 < bVar9 | bVar11;
  bVar10 = bVar9 + bVar19 * -6 & 0xf;
  bVar9 = 9 < bVar10 | bVar19;
  uVar16 = CONCAT11((((((((((char)((uint)iVar15 >> 8) - bVar8) - bVar3) - bVar4) - bVar5) - bVar7) -
                      bVar12) - bVar11) - bVar19) - bVar9,bVar10 + bVar9 * -6) & 0xff0f;
  *(byte *)(unaff_BP + (int)unaff_DI) = *(byte *)(unaff_BP + (int)unaff_DI) + bVar24;
  *(uint *)((int)puVar30 + (int)pbVar35) = *(uint *)((int)puVar30 + (int)pbVar35) ^ uVar16;
  bVar4 = (byte)(uVar16 - 0x2b);
  bVar9 = 9 < (bVar4 & 0xf) | bVar9;
  cVar28 = (char)(uVar16 - 0x2b >> 8);
  bVar4 = bVar4 + bVar9 * '\x06';
  bVar3 = 0x90 < (bVar4 & 0xf0) | uVar16 < 0x2b | bVar9 * (0xf9 < bVar4);
  bVar4 = bVar4 + bVar3 * '`';
  bVar9 = 9 < (bVar4 & 0xf) | bVar9;
  bVar4 = bVar4 + bVar9 * '\x06';
  cVar6 = bVar4 + (0x90 < (bVar4 & 0xf0) | bVar3 | bVar9 * (0xf9 < bVar4)) * '`';
  *(byte *)((int)puVar30 + (int)unaff_DI) = *(byte *)((int)puVar30 + (int)unaff_DI) + cVar28;
  *(uint *)((int)puVar30 + (int)pbVar35) =
       *(uint *)((int)puVar30 + (int)pbVar35) & CONCAT11(cVar28,cVar6);
  bVar3 = cVar6 - 0x1b;
  bVar38 = CARRY1(bRam00010015,bVar23);
  bRam00010015 = bRam00010015 + bVar23;
  *(byte *)((int)puVar30 + (int)pbVar35) = *(byte *)((int)puVar30 + (int)pbVar35) + bVar23 + bVar38;
  cRam0001363f = cRam0001363f + bVar31;
  bVar9 = 9 < (bVar3 & 0xf) | bVar9;
  bVar3 = bVar3 + bVar9 * '\x06' ^ 0x3f;
  *puVar30 = *puVar30 ^ (uint)unaff_DI;
  *(byte *)unaff_DI = (byte)*unaff_DI + bVar22;
  bVar9 = 9 < (bVar3 & 0xf) | bVar9;
  bVar3 = bVar3 + bVar9 * -6 & 0xf;
  *(byte *)((int)puVar30 + (int)pbVar35) = *(byte *)((int)puVar30 + (int)pbVar35) | bVar22;
  bVar4 = 9 < bVar3 | bVar9;
  cVar6 = (cVar28 - bVar9) - bVar4;
  uVar16 = CONCAT11(cVar6,bVar3 + bVar4 * -6) & 0xff0f;
  *pbVar35 = *pbVar35 + cVar6;
  *(byte *)(unaff_BP + (int)unaff_DI) = *(byte *)(unaff_BP + (int)unaff_DI) & bVar24;
  *(byte *)unaff_DI = (byte)*unaff_DI + cVar26;
  iVar15 = uVar16 + 0xe800;
  bVar5 = (byte)iVar15;
  bVar4 = 9 < (bVar5 & 0xf) | bVar4;
  cVar6 = (char)((uint)iVar15 >> 8);
  bVar5 = bVar5 + bVar4 * '\x06';
  bVar5 = bVar5 + (0x90 < (bVar5 & 0xf0) | uVar16 < 0x1800 | bVar4 * (0xf9 < bVar5)) * '`';
  *pbVar35 = *pbVar35 + bVar23;
  *(uint *)((int)puVar30 + (int)pbVar35) =
       *(uint *)((int)puVar30 + (int)pbVar35) & CONCAT11(cVar6,bVar5);
  *(byte **)pbVar35 = (byte *)(*(int *)pbVar35 + (int)puVar30);
  *(byte *)unaff_DI = (byte)*unaff_DI + bVar21;
  pbVar1 = pbVar35 + unaff_BP;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar21;
  *(byte *)((int)puVar30 + (int)pbVar35) =
       *(byte *)((int)puVar30 + (int)pbVar35) + bVar5 + CARRY1(bVar3,bVar21);
  bVar4 = 9 < (bVar5 & 0xf) | bVar4;
  bVar3 = bVar5 + bVar4 * -6 & 0xf;
  bVar5 = 9 < bVar3 | bVar4;
  bVar3 = bVar3 + bVar5 * -6;
  bVar5 = 9 < (bVar3 & 0xf) | bVar5;
  bVar3 = bVar3 + bVar5 * -6 & 0xf;
  bVar7 = 9 < bVar3 | bVar5;
  bVar3 = bVar3 + bVar7 * '\x06';
  bVar7 = 9 < (bVar3 & 0xf) | bVar7;
  bVar8 = bVar3 + bVar7 * -6 & 0xf;
  bVar12 = 9 < bVar8 | bVar7;
  bVar8 = bVar8 + bVar12 * '\x06';
  *(byte *)puVar30 = (byte)*puVar30 & bVar31;
  puVar2 = puVar30;
  bVar38 = (byte)*puVar2 < bVar31;
  *(byte *)puVar2 = (byte)*puVar2 - bVar31;
  puVar2 = puVar30;
  uVar16 = *puVar2;
  bVar3 = (byte)*puVar2 + bVar31;
  *(byte *)puVar2 = bVar3 + bVar38;
  *(byte *)((int)puVar30 + (int)pbVar35) =
       *(byte *)((int)puVar30 + (int)pbVar35) + bVar21 +
       (CARRY1((byte)uVar16,bVar31) || CARRY1(bVar3,bVar38));
  bVar12 = 9 < (bVar8 & 0xf) | bVar12;
  bVar3 = bVar8 + bVar12 * -6 & 0xf;
  *(byte *)((int)puVar30 + (int)pbVar35) = *(byte *)((int)puVar30 + (int)pbVar35) | bVar3;
  bVar8 = 9 < bVar3 | bVar12;
  bVar3 = bVar3 + bVar8 * -6;
  bVar11 = bVar3 & 0xf;
  uVar16 = CONCAT11(((((cVar6 - bVar4) - bVar5) - bVar7) - bVar12) - bVar8,bVar3) & 0xff0f;
  *(byte *)((int)puVar30 + (int)pbVar35) = *(byte *)((int)puVar30 + (int)pbVar35) + bVar11;
  *(byte **)(byte *)(unaff_BP + (int)unaff_DI) =
       pbVar35 + *(int *)(byte *)(unaff_BP + (int)unaff_DI);
  *(byte *)((int)puVar30 + (int)unaff_DI) = *(byte *)((int)puVar30 + (int)unaff_DI) + bVar11;
  iVar15 = uVar16 - 0x100;
  bVar4 = (byte)iVar15;
  bVar8 = 9 < (bVar4 & 0xf) | bVar8;
  cVar6 = (char)((uint)iVar15 >> 8);
  bVar4 = bVar4 + bVar8 * '\x06';
  bVar4 = bVar4 + (0x90 < (bVar4 & 0xf0) | uVar16 < 0x100 | bVar8 * (0xf9 < bVar4)) * '`';
  pbVar35[unaff_BP] = pbVar35[unaff_BP] + bVar4;
  *(uint *)((int)puVar30 + (int)pbVar35) =
       *(uint *)((int)puVar30 + (int)pbVar35) & CONCAT11(cVar6,bVar4);
  *(byte **)pbVar35 = (byte *)(*(int *)pbVar35 + (int)puVar30);
  *(byte *)((int)puVar30 + (int)unaff_DI) = *(byte *)((int)puVar30 + (int)unaff_DI) + bVar4;
  pbVar1 = (byte *)((int)puVar30 + (int)unaff_DI);
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar4;
  *(byte *)((int)puVar30 + (int)pbVar35) =
       *(byte *)((int)puVar30 + (int)pbVar35) + bVar4 + CARRY1(bVar3,bVar4);
  bVar8 = 9 < (bVar4 & 0xf) | bVar8;
  bVar4 = bVar4 + bVar8 * -6 & 0xf;
  bVar3 = 9 < bVar4 | bVar8;
  bVar5 = bVar4 + bVar3 * -6 & 0xf;
  bVar4 = 9 < bVar5 | bVar3;
  bVar7 = bVar5 + bVar4 * -6 & 0xf;
  bVar5 = 9 < bVar7 | bVar4;
  bVar12 = bVar7 + bVar5 * -6 & 0xf;
  bVar7 = 9 < bVar12 | bVar5;
  bVar12 = bVar12 + bVar7 * '\x06';
  bVar7 = 9 < (bVar12 & 0xf) | bVar7;
  bVar11 = bVar12 + bVar7 * -6 & 0xf;
  bVar12 = 9 < bVar11 | bVar7;
  bVar19 = bVar11 + bVar12 * -6 & 0xf;
  bVar11 = 9 < bVar19 | bVar12;
  bVar9 = bVar19 + bVar11 * -6 & 0xf;
  bVar19 = 9 < bVar9 | bVar11;
  bVar10 = bVar9 + bVar19 * -6 & 0xf;
  bVar9 = 9 < bVar10 | bVar19;
  bVar20 = bVar10 + bVar9 * -6 & 0xf;
  *(byte *)puVar30 = (byte)*puVar30 + bVar31 + bVar9;
  bVar10 = 9 < bVar20 | bVar9;
  bVar25 = bVar20 + bVar10 * -6 & 0xf;
  *(byte *)puVar30 = (byte)*puVar30 | bVar31;
  bVar20 = 9 < bVar25 | bVar10;
  bVar13 = bVar25 + bVar20 * -6 & 0xf;
  *(byte *)puVar30 = (byte)*puVar30 + bVar31;
  bVar25 = 9 < bVar13 | bVar20;
  uVar16 = CONCAT11((((((((((((cVar6 - bVar8) - bVar3) - bVar4) - bVar5) - bVar7) - bVar12) - bVar11
                        ) - bVar19) - bVar9) - bVar10) - bVar20) - bVar25,bVar13 + bVar25 * -6) &
           0xff0f;
  *(byte *)((int)puVar30 + (int)unaff_DI) = *(byte *)((int)puVar30 + (int)unaff_DI) + bVar31;
  puVar36 = (uint *)((uint)pbVar35 ^ *(uint *)(unaff_BP + (int)unaff_DI));
  *(byte *)unaff_DI = (byte)*unaff_DI + bVar22;
  iVar15 = uVar16 + 0xd900;
  bVar3 = (byte)iVar15;
  bVar25 = 9 < (bVar3 & 0xf) | bVar25;
  cVar28 = (char)((uint)iVar15 >> 8);
  bVar3 = bVar3 + bVar25 * '\x06';
  cVar6 = bVar3 + (0x90 < (bVar3 & 0xf0) | uVar16 < 0x2700 | bVar25 * (0xf9 < bVar3)) * '`';
  *(byte *)((int)puVar30 + (int)unaff_DI) = *(byte *)((int)puVar30 + (int)unaff_DI) + cVar28;
  *(uint *)((int)puVar30 + (int)puVar36) =
       *(uint *)((int)puVar30 + (int)puVar36) & CONCAT11(cVar28,cVar6);
  bVar4 = cVar6 - 0x1c;
  pbVar1 = (byte *)0x16;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar23;
  *(byte *)((int)puVar30 + (int)puVar36) =
       *(byte *)((int)puVar30 + (int)puVar36) + bVar23 + CARRY1(bVar3,bVar23);
  bVar25 = 9 < (bVar4 & 0xf) | bVar25;
  uVar16 = CONCAT11(cVar28,bVar4 + bVar25 * '\x06') ^ 7999;
  bVar31 = bVar31 ^ (byte)*puVar30;
  pbVar29 = (byte *)CONCAT11(bVar31,cVar26);
  bVar3 = (byte)uVar16;
  bVar25 = 9 < (bVar3 & 0xf) | bVar25;
  bVar3 = bVar3 + bVar25 * -6;
  bVar25 = 9 < (bVar3 & 0xf) | bVar25;
  bVar4 = bVar3 + bVar25 * -6 & 0xf;
  *(byte *)puVar36 = (char)*puVar36 + bVar22 + bVar25;
  bVar3 = 9 < bVar4 | bVar25;
  bVar5 = bVar4 + bVar3 * -6 & 0xf;
  *(byte *)(unaff_BP + (int)puVar36) = *(byte *)(unaff_BP + (int)puVar36) | bVar22;
  bVar4 = 9 < bVar5 | bVar3;
  bVar5 = bVar5 + bVar4 * -6 & 0xf;
  cVar6 = (((char)(uVar16 >> 8) - bVar25) - bVar3) - bVar4;
  *pbVar29 = *pbVar29 + cVar6;
  bVar4 = 9 < bVar5 | bVar4;
  cVar6 = cVar6 - bVar4;
  *(byte *)(unaff_BP + (int)unaff_DI) = *(byte *)(unaff_BP + (int)unaff_DI) + cVar6;
  uVar16 = CONCAT11(cVar6,bVar5 + bVar4 * -6) & 0xff0f ^ *(uint *)(pbVar29 + (int)puVar36);
  uVar33 = unaff_BP - *unaff_DI;
  pbVar1 = pbVar29;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar23;
  bVar5 = (byte)uVar16;
  bVar4 = 9 < (bVar5 & 0xf) | bVar4;
  cVar6 = (char)(uVar16 >> 8);
  bVar5 = bVar5 + bVar4 * '\x06';
  bVar5 = bVar5 + (0x90 < (bVar5 & 0xf0) | CARRY1(bVar3,bVar23) | bVar4 * (0xf9 < bVar5)) * '`';
  *(byte *)(uVar33 + (int)unaff_DI) = *(byte *)(uVar33 + (int)unaff_DI) + bVar23;
  *(uint *)(pbVar29 + (int)puVar36) = *(uint *)(pbVar29 + (int)puVar36) & CONCAT11(cVar6,bVar5);
  *(char *)puVar36 = (char)*puVar36 + cVar26;
  *(byte *)puVar36 = (char)*puVar36 + bVar21;
  pbVar1 = pbVar29 + (int)unaff_DI;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar21;
  *(char *)0x3f36 = *(char *)0x3f36 + bVar24 + CARRY1(bVar3,bVar21);
  bVar4 = 9 < (bVar5 & 0xf) | bVar4;
  bVar5 = bVar5 + bVar4 * -6;
  bVar4 = 9 < (bVar5 & 0xf) | bVar4;
  bVar3 = bVar5 + bVar4 * -6 & 0xf;
  bVar5 = 9 < bVar3 | bVar4;
  bVar3 = bVar3 + bVar5 * '\x06';
  bVar5 = 9 < (bVar3 & 0xf) | bVar5;
  bVar3 = bVar3 + bVar5 * '\x06';
  bVar5 = 9 < (bVar3 & 0xf) | bVar5;
  bVar7 = bVar3 + bVar5 * -6 & 0xf;
  *pbVar29 = *pbVar29 & bVar31;
  pbVar1 = pbVar29;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 - bVar31;
  pbVar29[(int)puVar36] = pbVar29[(int)puVar36] + bVar23 + (bVar3 < bVar31);
  bVar3 = 9 < bVar7 | bVar5;
  bVar12 = bVar7 + bVar3 * -6 & 0xf;
  pbVar29[(int)unaff_DI] = pbVar29[(int)unaff_DI] | bVar21;
  bVar7 = 9 < bVar12 | bVar3;
  bVar8 = bVar12 + bVar7 * -6 & 0xf;
  pbVar29[(int)unaff_DI] = pbVar29[(int)unaff_DI] + bVar8;
  bVar12 = 9 < bVar8 | bVar7;
  bVar8 = bVar8 + bVar12 * -6;
  bVar11 = bVar8 & 0xf;
  uVar16 = CONCAT11(((((cVar6 - bVar4) - bVar5) - bVar3) - bVar7) - bVar12,bVar8) & 0xff0f;
  pbVar29[(int)unaff_DI] = pbVar29[(int)unaff_DI] + bVar11;
  *(char **)(byte *)(uVar33 + (int)unaff_DI) =
       (char *)(*(int *)(byte *)(uVar33 + (int)unaff_DI) + (int)puVar36);
  pbVar29[(int)puVar36] = pbVar29[(int)puVar36] + bVar11;
  bVar4 = (byte)uVar16;
  bVar12 = 9 < bVar4 | bVar12;
  cVar6 = (char)(uVar16 >> 8);
  bVar4 = bVar4 + bVar12 * '\x06';
  bVar4 = bVar4 + (0x90 < (bVar4 & 0xf0) | bVar12 * (0xf9 < bVar4)) * '`';
  pbVar29[(int)puVar36] = pbVar29[(int)puVar36] + bVar4;
  *(uint *)(pbVar29 + (int)puVar36) = *(uint *)(pbVar29 + (int)puVar36) & CONCAT11(cVar6,bVar4);
  *(char *)puVar36 = (char)*puVar36 + cVar26;
  pbVar29[(int)puVar36] = pbVar29[(int)puVar36] + bVar4;
  pbVar1 = pbVar29 + (int)puVar36;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar4;
  *(byte *)puVar36 = (char)*puVar36 + bVar31 + CARRY1(bVar3,bVar4);
  bVar12 = 9 < (bVar4 & 0xf) | bVar12;
  bVar4 = bVar4 + bVar12 * -6 & 0xf;
  bVar3 = 9 < bVar4 | bVar12;
  bVar4 = bVar4 + bVar3 * '\x06';
  bVar3 = 9 < (bVar4 & 0xf) | bVar3;
  bVar5 = bVar4 + bVar3 * -6 & 0xf ^ 0x1f;
  bVar4 = 9 < (bVar5 & 0xf) | bVar3;
  bVar7 = bVar5 + bVar4 * -6 & 0xf;
  bVar23 = bVar23 ^ *pbVar29;
  bVar5 = 9 < bVar7 | bVar4;
  bVar11 = bVar7 + bVar5 * -6 & 0xf;
  bVar7 = 9 < bVar11 | bVar5;
  bVar11 = bVar11 + bVar7 * -6;
  bVar8 = 0x9f < bVar11 | bVar5 | bVar7 * (bVar11 < 6);
  *pbVar29 = *pbVar29 + bVar31 + bVar8;
  iVar15 = CONCAT11((((cVar6 - bVar12) - bVar3) - bVar4) - bVar5,bVar11 + bVar8 * -0x60) + -0x3f08;
  bVar3 = (char)iVar15 - pbVar29[(int)puVar36];
  bVar7 = 9 < (bVar3 & 0xf) | bVar7;
  bVar12 = bVar3 + bVar7 * -6 & 0xf;
  pbVar29[(int)unaff_DI] = pbVar29[(int)unaff_DI] + bVar31;
  pbVar29[(int)puVar36] = pbVar29[(int)puVar36] & bVar12;
  puVar30 = (uint *)((uint)pbVar29 ^ *unaff_DI);
  puVar2 = unaff_DI;
  bVar38 = CARRY1((byte)*puVar2,bVar22);
  *(byte *)puVar2 = (byte)*puVar2 + bVar22;
  pbVar1 = (byte *)((int)puVar30 + (int)puVar36);
  bVar3 = *pbVar1;
  bVar4 = *pbVar1;
  *pbVar1 = (bVar4 - bVar12) - bVar38;
  bVar5 = 9 < bVar12 | bVar7;
  bVar8 = bVar12 + bVar5 * '\x06';
  *(uint *)((int)puVar30 + (int)unaff_DI) =
       *(uint *)((int)puVar30 + (int)unaff_DI) & CONCAT11(bVar24,bVar23);
  bVar27 = (byte)puVar30;
  *(byte *)puVar36 = (char)*puVar36 + bVar27;
  bVar3 = bVar8 + (0x90 < (bVar8 & 0xf0) |
                  (bVar3 < bVar12 || (byte)(bVar4 - bVar12) < bVar38) | bVar5 * (0xf9 < bVar8)) *
                  'a' | *(byte *)((int)puVar30 + (int)puVar36);
  bVar32 = (byte)((uint)puVar30 >> 8);
  *(byte *)puVar30 = (byte)*puVar30 + bVar32;
  bVar5 = 9 < (bVar3 & 0xf) | bVar5;
  bVar4 = bVar3 + bVar5 * -6 & 0xf;
  bVar3 = 9 < bVar4 | bVar5;
  bVar12 = bVar4 + bVar3 * -6 & 0xf;
  bVar4 = 9 < bVar12 | bVar3;
  bVar8 = bVar12 + bVar4 * -6 & 0xf;
  bVar12 = 9 < bVar8 | bVar4;
  bVar11 = bVar8 + bVar12 * -6 & 0xf;
  bVar8 = 9 < bVar11 | bVar12;
  bVar11 = bVar11 + bVar8 * '\x06';
  bVar8 = 9 < (bVar11 & 0xf) | bVar8;
  bVar19 = bVar11 + bVar8 * -6 & 0xf;
  bVar11 = 9 < bVar19 | bVar8;
  bVar9 = bVar19 + bVar11 * -6 & 0xf;
  bVar19 = 9 < bVar9 | bVar11;
  bVar10 = bVar9 + bVar19 * -6 & 0xf;
  bVar9 = 9 < bVar10 | bVar19;
  bVar20 = bVar10 + bVar9 * -6 & 0xf;
  bVar10 = 9 < bVar20 | bVar9;
  bVar25 = bVar20 + bVar10 * -6 & 0xf;
  bVar20 = 9 < bVar25 | bVar10;
  bVar13 = bVar25 + bVar20 * -6 & 0xf;
  *(byte *)puVar30 = (byte)*puVar30 + bVar32 + bVar20;
  bVar25 = 9 < bVar13 | bVar20;
  bVar31 = bVar13 + bVar25 * -6 & 0xf;
  *(byte *)puVar30 = (byte)*puVar30 | bVar32;
  bVar13 = 9 < bVar31 | bVar25;
  uVar16 = CONCAT11((((((((((((((char)((uint)iVar15 >> 8) - bVar7 | 0x16) - bVar5) - bVar3) - bVar4)
                           - bVar12) - bVar8) - bVar11) - bVar19) - bVar9) - bVar10) - bVar20) -
                    bVar25) - bVar13,bVar31 + bVar13 * -6) & 0xff0f;
  *(byte *)puVar30 = (byte)*puVar30 + bVar32;
  *(byte *)(uVar33 + (int)unaff_DI) = *(byte *)(uVar33 + (int)unaff_DI) + bVar24;
  iVar15 = uVar16 + 0xd300;
  bVar4 = (byte)iVar15;
  bVar13 = 9 < (bVar4 & 0xf) | bVar13;
  cVar6 = (char)((uint)iVar15 >> 8);
  bVar4 = bVar4 + bVar13 * '\x06';
  bVar4 = bVar4 + (0x90 < (bVar4 & 0xf0) | uVar16 < 0x2d00 | bVar13 * (0xf9 < bVar4)) * '`';
  *(byte *)puVar30 = (byte)*puVar30 + cVar6;
  *(uint *)((int)puVar30 + (int)puVar36) =
       *(uint *)((int)puVar30 + (int)puVar36) & CONCAT11(cVar6,bVar4);
  *(uint *)(uVar33 + (int)unaff_DI) = *(uint *)(uVar33 + (int)unaff_DI) & (uint)puVar30;
  *(byte *)puVar36 = (char)*puVar36 + bVar27;
  pbVar1 = (byte *)0x10;
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar23;
  *(byte *)puVar30 = (byte)*puVar30 + bVar32 + CARRY1(bVar3,bVar23);
  bVar13 = 9 < (bVar4 & 0xf) | bVar13;
  bVar4 = bVar4 + bVar13 * -6 & 0xf;
  bVar3 = 9 < bVar4 | bVar13;
  *puVar30 = *puVar30 ^ (uint)unaff_DI;
  uVar16 = CONCAT11((cVar6 - bVar13) - bVar3,bVar4 + bVar3 * -6) & 0xff0f ^ 0x3f2f;
  uVar33 = uVar33 ^ *puVar36;
  bVar4 = (byte)uVar16;
  bVar3 = 9 < (bVar4 & 0xf) | bVar3;
  bVar5 = bVar4 + bVar3 * -6 & 0xf;
  *(uint *)((int)puVar30 + (int)unaff_DI) = *(uint *)((int)puVar30 + (int)unaff_DI) ^ uVar33;
  bVar4 = 9 < bVar5 | bVar3;
  bVar7 = bVar5 + bVar4 * -6 & 0xf;
  bVar5 = 9 < bVar7 | bVar4;
  bVar7 = bVar7 + bVar5 * -6;
  bVar5 = 9 < (bVar7 & 0xf) | bVar5;
  bVar7 = bVar7 + bVar5 * '\x06';
  bVar5 = 9 < (bVar7 & 0xf) | bVar5;
  bVar12 = (bVar7 + bVar5 * -6 & 0xf) - 0x20;
  bVar7 = 9 < (bVar12 & 0xf) | bVar5;
  bVar8 = bVar12 + bVar7 * -6 & 0xf;
  *puVar36 = *puVar36 - (int)puVar30;
  bVar12 = 9 < bVar8 | bVar7;
  bVar11 = bVar8 + bVar12 * -6 & 0xf;
  bVar8 = 9 < bVar11 | bVar12;
  bVar11 = bVar11 + bVar8 * '\x06';
  *(byte *)puVar36 =
       ((char)*puVar36 - bVar32) - (0x90 < (bVar11 & 0xf0) | bVar12 | bVar8 * (0xf9 < bVar11));
  uVar17 = CONCAT11((((((char)(uVar16 >> 8) - bVar3) - bVar4) - bVar5) - bVar7) - bVar12,bVar11) &
           0x3a17;
  uVar18 = *(uint *)0x2237;
  bVar4 = (byte)(uVar17 + 0x2034);
  bVar3 = bVar4 + 0x32;
  uVar16 = (uint)(0xcd < bVar4 || CARRY1(bVar3,0xdfcb < uVar17));
  uVar14 = uVar33 + *puVar30;
  bVar38 = CARRY2(uVar33,*puVar30) || CARRY2(uVar14,uVar16);
  iVar34 = uVar14 + uVar16;
  bVar4 = bVar22 + (byte)*unaff_DI;
  bVar7 = bVar4 + bVar38;
  bVar5 = (bVar3 + (0xdfcb < uVar17) + -0x11) -
          (CARRY1(bVar22,(byte)*unaff_DI) || CARRY1(bVar4,bVar38));
  bVar38 = bVar27 < *(byte *)(iVar34 + (int)puVar36);
  cVar28 = bVar27 - *(byte *)(iVar34 + (int)puVar36);
  puVar30 = (uint *)CONCAT11(bVar32,cVar28);
  pbVar1 = (byte *)((int)puVar30 + (int)puVar36);
  bVar3 = *pbVar1;
  bVar4 = *pbVar1;
  *pbVar1 = bVar4 + bVar7 + bVar38;
  puVar2 = puVar30;
  uVar14 = (uint)(CARRY1(bVar3,bVar7) || CARRY1(bVar4 + bVar7,bVar38));
  uVar16 = *puVar2;
  uVar33 = *puVar2 - CONCAT11(bVar7,bVar21);
  *puVar2 = uVar33 - uVar14;
  bVar8 = 9 < (bVar5 & 0xf) | bVar8;
  bVar5 = bVar5 + bVar8 * '\x06';
  bVar3 = 0x90 < (bVar5 & 0xf0) |
          (uVar16 < CONCAT11(bVar7,bVar21) || uVar33 < uVar14) | bVar8 * (0xf9 < bVar5);
  *(char *)0x1724 = (*(char *)0x1724 - bVar21) - bVar3;
  uVar16 = CONCAT11((char)(uVar17 + 0x2034 >> 8),bVar5 + bVar3 * '`') | 0x1622;
  bVar3 = (byte)uVar16 | 0x20;
  uVar33 = CONCAT11((char)(uVar16 >> 8),bVar3 + 0xb);
  uVar16 = (uint)(0xf4 < bVar3);
  uVar14 = uVar33 - 0xa13;
  uVar17 = uVar14 - uVar16;
  uVar14 = ((CONCAT11(bVar24,bVar23) & uVar18) - *(int *)(iVar34 + (int)puVar36)) -
           (uint)(uVar33 < 0xa13 || uVar14 < uVar16);
  *puVar30 = *puVar30 | uVar14;
  pbVar1 = (byte *)((int)puVar30 + (int)puVar36);
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar21;
  uVar16 = uVar17 + 0x70f;
  uVar18 = uVar16 + CARRY1(bVar3,bVar21) | 6 | *unaff_DI;
  bVar5 = bVar21 + *(char *)0x1006 + (0xf8f0 < uVar17 || CARRY2(uVar16,(uint)CARRY1(bVar3,bVar21)))
          | *(byte *)((int)puVar30 + (int)puVar36);
  pcVar37 = (char *)((int)puVar36 + *puVar30);
  *(char *)((int)puVar30 + (int)pcVar37) = *(char *)((int)puVar30 + (int)pcVar37) + (char)uVar18;
  pbVar1 = (byte *)(pcVar37 + iVar34);
  bVar3 = *pbVar1;
  bVar21 = (byte)(uVar14 >> 8);
  *pbVar1 = *pbVar1 + bVar21;
  iVar15 = *(int *)((int)puVar30 + (int)pcVar37);
  *(uint *)((int)puVar30 + (int)pcVar37) = *(uint *)((int)puVar30 + (int)pcVar37) ^ (uint)puVar30;
  pbVar1 = (byte *)((int)puVar30 + (int)pcVar37);
  bVar4 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar21;
  iVar15 = (((uVar18 ^ 0xb) + iVar15 + (uint)CARRY1(bVar3,bVar21) + -0x2f00) -
            (uint)CARRY1(bVar4,bVar21) & *(uint *)((int)puVar30 + (int)pcVar37)) - 0x27;
  cVar6 = (char)((uint)iVar15 >> 8);
  uVar16 = CONCAT11(cVar6,(char)iVar15 + -0x2b);
  *(char *)((int)puVar30 + (int)pcVar37) = *(char *)((int)puVar30 + (int)pcVar37) + cVar6;
  iVar15 = uVar16 - *(uint *)((int)puVar30 + (int)pcVar37);
  iVar34 = iVar34 + *(int *)(pcVar37 + iVar34) +
           (uint)(uVar16 < *(uint *)((int)puVar30 + (int)pcVar37));
  cVar6 = (char)iVar15;
  *(char *)puVar30 = (char)*puVar30 + cVar6;
  uVar16 = CONCAT11((char)((uint)iVar15 >> 8),cVar6 - *(char *)((int)puVar30 + (int)pcVar37));
  *(byte *)((int)puVar30 + (int)unaff_DI) = *(byte *)((int)puVar30 + (int)unaff_DI) + bVar7;
  uVar18 = uVar16 + 0x2800;
  *(char *)((int)puVar30 + (int)pcVar37) =
       *(char *)((int)puVar30 + (int)pcVar37) + (char)uVar18 + (0xd7ff < uVar16);
  *pcVar37 = *pcVar37 - cVar28;
  *(char *)((int)puVar30 + (int)pcVar37) = *(char *)((int)puVar30 + (int)pcVar37) + bVar7;
  uVar18 = uVar18 & 0x2300;
  puVar2 = (uint *)((int)puVar30 + (int)pcVar37);
  uVar16 = *puVar2;
  *puVar2 = *puVar2 - uVar18;
  iVar15 = (iVar34 - *(int *)(pcVar37 + iVar34)) - (uint)(uVar16 < uVar18);
  bVar4 = (byte)uVar14;
  pcVar37[iVar15] = pcVar37[iVar15] + bVar4;
  uVar16 = CONCAT11((char)(uVar18 >> 8),-*(char *)((int)puVar30 + (int)pcVar37));
  bVar3 = *(byte *)(iVar15 + (int)unaff_DI);
  uVar16 = ((uVar16 + *(uint *)((int)puVar30 + (int)pcVar37)) -
           *(int *)((int)puVar30 + (int)pcVar37)) -
           (uint)CARRY2(uVar16,*(uint *)((int)puVar30 + (int)pcVar37));
  *(uint *)((int)puVar30 + (int)pcVar37) = *(uint *)((int)puVar30 + (int)pcVar37) & uVar16;
  *(int *)((int)puVar30 + (int)pcVar37) = *(int *)((int)puVar30 + (int)pcVar37) - uVar16;
  *(byte *)(iVar15 + (int)unaff_DI) = *(byte *)(iVar15 + (int)unaff_DI) + (bVar7 | bVar3);
  *(byte *)(iVar15 + (int)unaff_DI) = *(byte *)(iVar15 + (int)unaff_DI) + (char)(uVar16 >> 8);
  *(byte *)unaff_DI = (byte)*unaff_DI + cVar28;
  bVar38 = CARRY1(DAT_1000_002e,bVar4);
  DAT_1000_002e = DAT_1000_002e + bVar4;
  bVar8 = 9 < ((byte)uVar16 & 0xf) | bVar8;
  bVar4 = (byte)uVar16 + bVar8 * -6;
  bVar4 = bVar4 + (0x9f < bVar4 | bVar38 | bVar8 * (bVar4 < 6)) * -0x60;
  pbVar1 = (byte *)((int)puVar30 + (int)pcVar37);
  bVar3 = *pbVar1;
  *pbVar1 = *pbVar1 + bVar5;
  bVar8 = 9 < (bVar4 & 0xf) | bVar8;
  bVar4 = bVar4 + bVar8 * -6;
  bVar4 = bVar4 + (0x9f < bVar4 | CARRY1(bVar3,bVar5) | bVar8 * (bVar4 < 6)) * -0x60;
  *(char *)((int)puVar30 + (int)pcVar37) = *(char *)((int)puVar30 + (int)pcVar37) + bVar4;
  bVar8 = 9 < (bVar4 & 0xf) | bVar8;
  bVar3 = bVar4 + bVar8 * -6 & 0xf;
  bVar8 = 9 < bVar3 | bVar8;
  bVar3 = bVar3 + bVar8 * -6 & 0xf;
  pbVar1 = (byte *)((int)unaff_DI + iVar15 + -3);
  *pbVar1 = *pbVar1 + bVar32;
  *(char *)((int)puVar30 + (int)pcVar37) =
       *(char *)((int)puVar30 + (int)pcVar37) + (bVar3 + (9 < bVar3 | bVar8) * -6 & 0xf);
  *(char *)((int)puVar30 + (int)pcVar37) = *(char *)((int)puVar30 + (int)pcVar37) + '\x01';
  *(char *)0x1d = *(char *)0x1d + cVar28;
  *(char *)0x1d = *(char *)0x1d + cVar28;
  *(char *)0x1d = *(char *)0x1d + cVar28;
  *(char *)0x1d = *(char *)0x1d + cVar28;
  *(int *)((int)puVar30 + (int)pcVar37) = *(int *)((int)puVar30 + (int)pcVar37) + 1;
  *(char *)0x1d = *(char *)0x1d + cVar28;
  *(int *)((int)puVar30 + (int)pcVar37) = *(int *)((int)puVar30 + (int)pcVar37) + 1;
  *(char *)0x1d = *(char *)0x1d + cVar28;
  *(int *)((int)puVar30 + (int)pcVar37) = *(int *)((int)puVar30 + (int)pcVar37) + 1;
  *(char *)0x1d = *(char *)0x1d + cVar28;
  *(int *)((int)puVar30 + (int)pcVar37) = *(int *)((int)puVar30 + (int)pcVar37) + 1;
  *(char *)0x1d = *(char *)0x1d + cVar28;
  *(int *)((int)puVar30 + (int)pcVar37) = *(int *)((int)puVar30 + (int)pcVar37) + 1;
  *(char *)0x1d = *(char *)0x1d + cVar28;
  *(int *)((int)puVar30 + (int)pcVar37) = *(int *)((int)puVar30 + (int)pcVar37) + 1;
  *(char *)0x1d = *(char *)0x1d + cVar28;
                    // WARNING: Bad instruction - Truncating control flow here
  halt_baddata();
}



// WARNING: Globals starting with '_' overlap smaller symbols at the same address

void __cdecl16far entry(void)

{
  undefined1 *puVar1;
  undefined1 *puVar2;
  int iVar3;
  undefined1 *puVar4;
  undefined1 *puVar5;
  int unaff_ES;
  
  DAT_338b_0004 = unaff_ES + 0x10;
  _DAT_4000_89ee = DAT_338b_0004 + DAT_338b_000c;
  puVar4 = (undefined1 *)(DAT_338b_0006 + -1);
  puVar5 = puVar4;
  for (iVar3 = DAT_338b_0006; iVar3 != 0; iVar3 = iVar3 + -1) {
    puVar2 = puVar5;
    puVar5 = puVar5 + -1;
    puVar1 = puVar4;
    puVar4 = puVar4 + -1;
    *puVar2 = *puVar1;
  }
  _DAT_4000_89ec = 0x32;
  return;
}


