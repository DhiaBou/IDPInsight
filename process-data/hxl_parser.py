import tempfile as tf
import os
import pandas as pd
import regex as re
from hxl import model

NUMERIC_PATTERN = r"[0-9]+((,|.)[0-9]*)*"

numeric_regex = re.compile(NUMERIC_PATTERN)

# Function to find indices of columns with HXL tags
def find_hxl_indices(row):
    return [(i, cell) for i, cell in enumerate(row) if model.Column.parse(cell)]

def numeric_row(df, row_index, cols):
    if row_index + 1 >= df.size:
        return None
    
    cols_numeric = list(filter(lambda x : numeric_regex.match(str(df[x].loc[row_index + 1])), cols.keys()))
     
    if len(cols_numeric) is 0:
        return None
    
    return cols_numeric

def clean_adm_cols(df):
    adm_cols = list(filter(lambda x : x.startswith("#adm"), df.columns.astype(str)))
    for col in adm_cols[: -1]:
        df[col] = df[col].ffill()
    return df.dropna(subset = adm_cols)

# Function to process an Excel file and extract data with HXL tags
def process_hxl_files(file_path):
    xlsx_file = pd.ExcelFile(file_path)
    processed_data_list = []

    for sheet_name in xlsx_file.sheet_names:
        sheet_data = pd.read_excel(file_path, sheet_name=sheet_name, header=None)
        clean_sheet = clean_one_sheet(sheet_data)
        if not clean_sheet is None:
            processed_data_list.append(clean_sheet)

    return processed_data_list

def contains_affected(numeric_cols, hxl_indices):
    # derived from https://stackoverflow.com/a/2364277
    return next((i for i, col_index in enumerate(numeric_cols) if hxl_indices[col_index].startswith("#affected")), None)


def clean_current_sheet(sheet_data, hxl_columns, i):
    hxl_indices = {index: header for index, header in hxl_columns}
    numeric_columns = numeric_row(sheet_data, i, hxl_indices)
    print(numeric_columns)
    if numeric_columns is None:
        return None

    aff_ind = contains_affected(numeric_columns, hxl_indices)
    if aff_ind is None:
        return None

    ii = i
    while(numeric_regex.match(str(sheet_data[numeric_columns[0]].loc[i - 1]))):
            i-=1

    if ii != i:
        file = file.drop(prev_index, axis = 'index')
    
    desired_columns = pd.Index(hxl_indices.keys())
    processed_data = sheet_data[desired_columns].drop(index=range(i + 1))
    processed_data.rename(columns=hxl_indices, inplace=True)
    return clean_adm_cols(processed_data)

def clean_one_sheet(sheet_data):
    processed_data = None
    for i, row in enumerate(sheet_data.values.astype(str)):
        hxl_columns = find_hxl_indices(row)
        if hxl_columns:
            processed_data = clean_current_sheet(sheet_data, hxl_columns, i)
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
