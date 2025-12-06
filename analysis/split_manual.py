import os
from PyPDF2 import PdfReader, PdfWriter

def split_pdf(file_path, chunk_size=10):
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    # Create output directory
    output_dir = os.path.join(os.path.dirname(file_path), "overlord_manual_chunks")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created output directory: {output_dir}")

    try:
        reader = PdfReader(file_path)
        total_pages = len(reader.pages)
        print(f"Total pages: {total_pages}")

        for start_page in range(0, total_pages, chunk_size):
            end_page = min(start_page + chunk_size, total_pages)
            writer = PdfWriter()

            for i in range(start_page, end_page):
                writer.add_page(reader.pages[i])

            chunk_number = (start_page // chunk_size) + 1
            output_filename = f"Overlord_Manual_Part_{chunk_number:02d}.pdf"
            output_path = os.path.join(output_dir, output_filename)

            with open(output_path, "wb") as output_file:
                writer.write(output_file)
            
            print(f"Created {output_filename} (Pages {start_page+1}-{end_page})")

        print("PDF splitting complete.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Path relative to where we will run the script (repo root)
    # Using absolute path to be safe based on previous exploration
    pdf_path = r"c:\dev\GIT\Overlord\analysis\MSDOS-binaries-no-edits\Overlord_Manual_DOS_EN.pdf"
    split_pdf(pdf_path)
