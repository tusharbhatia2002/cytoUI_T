from fcsparser import parse
import pandas as pd
import sys
import os


def convert_fcs_to_csv(fcs_file_path, csv_file):

    metadata, data = parse(
        fcs_file_path, meta_data_only=False, reformat_meta=True)

    df = pd.DataFrame(data)
    print(df.head())


    df.to_csv(csv_file, index=False)

    csv_file_path = os.path.abspath(csv_file)
    print(f"Conversion complete. CSV file saved at {csv_file_path}")


if __name__ == '__main__':
    
    if len(sys.argv) != 3:
        print("Usage: python fcs_to_csv.py <input_fcs_file> <output_csv_file>")
        sys.exit(1)

    input_fcs_file = sys.argv[1]
    output_csv_file = sys.argv[2]
    convert_fcs_to_csv(input_fcs_file, output_csv_file)
