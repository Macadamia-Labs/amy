#!/usr/bin/env python3

import os
import argparse
from pathlib import Path

def merge_markdown_files(input_dir: str, output_file: str, file_pattern: str = "*.md") -> None:
    """
    Merge all markdown files in the input directory into a single markdown file.
    
    Args:
        input_dir (str): Path to the directory containing markdown files
        output_file (str): Path to the output merged file
        file_pattern (str): Pattern to match markdown files (default: "*.md")
    """
    input_path = Path(input_dir)
    
    # Get all markdown files and sort them
    markdown_files = sorted(list(input_path.glob(file_pattern)))
    
    if not markdown_files:
        print(f"No markdown files found in {input_dir}")
        return
    
    print(f"Found {len(markdown_files)} markdown files to merge")
    
    # Create the output file and merge content
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for i, file_path in enumerate(markdown_files):
            print(f"Processing {file_path.name}")
            
            with open(file_path, 'r', encoding='utf-8') as infile:
                content = infile.read()
                
                # Add a separator between files (except for the first file)
                if i > 0:
                    outfile.write("\n\n---\n\n")
                
                outfile.write(content)
    
    print(f"\nSuccessfully merged files into {output_file}")

def main():
    parser = argparse.ArgumentParser(description="Merge multiple markdown files into a single file")
    parser.add_argument("input_dir", help="Directory containing markdown files")
    parser.add_argument("output_file", help="Path for the merged output file")
    parser.add_argument("--pattern", default="*.md", help="File pattern to match (default: *.md)")
    
    args = parser.parse_args()
    
    merge_markdown_files(args.input_dir, args.output_file, args.pattern)

if __name__ == "__main__":
    main() 