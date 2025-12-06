#!/usr/bin/env python3
"""
Extract ROM banks from C64 EasyFlash .crt cartridge file

.CRT file format:
- 64-byte header
- Multiple CHIP packets:
  - 16-byte CHIP header
  - ROM data (8KB per bank)
"""

import sys
import os

def extract_crt(crt_file, output_dir):
    """Extract ROM banks from .crt cartridge file"""

    if not os.path.exists(crt_file):
        print(f"Error: File not found: {crt_file}")
        return False

    # Create output directory
    os.makedirs(output_dir, exist_ok=True)

    with open(crt_file, 'rb') as f:
        # Read 64-byte header
        header = f.read(64)

        if len(header) < 64:
            print("Error: Invalid .crt file (too small)")
            return False

        # Check magic signature "C64 CARTRIDGE"
        if header[0:16].decode('ascii', errors='ignore').strip('\x00') != "C64 CARTRIDGE":
            print("Warning: Missing C64 CARTRIDGE signature")

        print(f"CRT Header: {header[0:16].decode('ascii', errors='ignore').strip()}")
        print(f"File version: {header[20]:02x}.{header[21]:02x}")

        # Get cartridge type
        cart_type = (header[22] << 8) | header[23]
        print(f"Cartridge type: {cart_type} (32 = EasyFlash)")

        bank_num = 0
        total_bytes = 0

        # Read CHIP packets
        while True:
            # Read CHIP header (16 bytes)
            chip_header = f.read(16)

            if len(chip_header) == 0:
                break  # End of file

            if len(chip_header) < 16:
                print(f"Warning: Incomplete CHIP header at end of file")
                break

            # Check CHIP signature
            chip_sig = chip_header[0:4].decode('ascii', errors='ignore')
            if chip_sig != "CHIP":
                print(f"Warning: Expected 'CHIP' signature, got '{chip_sig}'")
                # Try to continue anyway

            # Get packet length (includes header)
            packet_len = (chip_header[4] << 24) | (chip_header[5] << 16) | \
                        (chip_header[6] << 8) | chip_header[7]

            # Get chip type and bank number
            chip_type = (chip_header[8] << 8) | chip_header[9]
            bank = (chip_header[10] << 8) | chip_header[11]
            load_addr = (chip_header[12] << 8) | chip_header[13]
            rom_size = (chip_header[14] << 8) | chip_header[15]

            print(f"\nBank {bank_num}:")
            print(f"  CHIP packet length: {packet_len} bytes")
            print(f"  Bank number: {bank}")
            print(f"  Load address: ${load_addr:04X}")
            print(f"  ROM size: {rom_size} bytes ({rom_size // 1024}KB)")

            # Calculate ROM data size (packet_len includes 16-byte header)
            rom_data_size = packet_len - 16

            if rom_data_size != rom_size:
                print(f"  Warning: ROM size mismatch ({rom_data_size} vs {rom_size})")
                rom_data_size = min(rom_data_size, rom_size)

            # Read ROM data
            rom_data = f.read(rom_data_size)

            if len(rom_data) < rom_data_size:
                print(f"  Error: Could only read {len(rom_data)} of {rom_data_size} bytes")
                break

            # Save ROM bank to file
            output_file = os.path.join(output_dir, f"bank_{bank:02d}_${load_addr:04X}.bin")
            with open(output_file, 'wb') as out:
                out.write(rom_data)

            print(f"  Saved to: {output_file}")

            bank_num += 1
            total_bytes += len(rom_data)

        print(f"\n✅ Extraction complete!")
        print(f"   Total banks: {bank_num}")
        print(f"   Total ROM data: {total_bytes} bytes ({total_bytes / 1024:.1f} KB)")

        return True

if __name__ == "__main__":
    # Default paths
    crt_file = "../../C64-remake/Supremacy_aka_Overlord_+8D_[ExCeSs].crt"
    output_dir = "./extracted_rom"

    # Allow command line arguments
    if len(sys.argv) > 1:
        crt_file = sys.argv[1]
    if len(sys.argv) > 2:
        output_dir = sys.argv[2]

    print("C64 EasyFlash .crt ROM Extractor")
    print("=" * 50)
    print(f"Input:  {crt_file}")
    print(f"Output: {output_dir}/")
    print("=" * 50)
    print()

    success = extract_crt(crt_file, output_dir)

    sys.exit(0 if success else 1)
