import tempfile as tf
import os
import pandas as pd
import regex as re
import json

#generate regex using top level identifiers
def generate_regex(file_name):
    suffix = r"(\+.*)*"
    with open(file_name, 'r') as file:
        tags = json.load(file)
    prefix = '({})'.format('|'.join(tags['tags']))

    return prefix + suffix

# Regular expression pattern for matching HXL tags
hxl_pattern = generate_regex("tags.json")

# Function to find indices of columns with HXL tags
def find_hxl_indices(row):
    pattern = re.compile(hxl_pattern)
    return [(i, cell) for i, cell in enumerate(row) if pattern.match(cell)]


# Function to process an Excel file and extract data with HXL tags
def process_hxl_files(file_path):
    xlsx_file = pd.ExcelFile(file_path)
    processed_data_list = []

    for sheet_name in xlsx_file.sheet_names:
        sheet_data = pd.read_excel(file_path, sheet_name=sheet_name, header=None)
        clean_sheet = clean_one_sheet(sheet_data)
        if clean_sheet:
            processed_data_list.append(clean_sheet)

    return processed_data_list


def clean_one_sheet(sheet_data):
    processed_data = None
    for i, row in enumerate(sheet_data.values.astype(str)):
        hxl_columns = find_hxl_indices(row)
        if hxl_columns:
            hxl_indices = {index: header for index, header in hxl_columns}
            desired_columns = pd.Index(hxl_indices.keys())
            processed_data = sheet_data[desired_columns].drop(index=range(i + 1))
            processed_data.rename(columns=hxl_indices, inplace=True)
            break  # Once the headers are found and processed, exit the loop

    return processed_data


def convert_to_csv(file_path, output_dir):
    for data_frame in process_hxl_files(file_path):
        file_name = os.path.basename(file_path).replace(".", "-")
        _, temp_file_path = tf.mkstemp(suffix=".csv", prefix=file_name, dir=output_dir)
        data_frame.to_csv(temp_file_path, index=False)


def process_directory(input_dir, output_dir):
    for root, _, files in os.walk(input_dir):
        for file in files:
            full_path = os.path.join(root, file)
            convert_to_csv(full_path, output_dir)
