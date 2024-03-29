import tempfile as tf
import os
import pandas as pd
import regex as re
from hxl import model

# pattern for numeric data values
NUMERIC_PATTERN = r"[0-9]+((,|.)[0-9]*)*"

numeric_regex = re.compile(NUMERIC_PATTERN)


# Function to find indices of columns with HXL tags
def find_hxl_indices(row):
    return [(i, cell) for i, cell in enumerate(row) if model.Column.parse(cell)]


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


# check if the dataset contains aleast one row with numeric values
def numeric_row(df, i_row, cols):
    ii_row = i_row + 1 if i_row + 1 < len(df.index) else i_row - 1
    if ii_row < 0:
        return None
    
    cols_numeric = list(
        filter(
            lambda x: numeric_regex.match(str(df[x].loc[ii_row])),
            cols.keys()
        )
    )   

    if not cols_numeric:
        return None
    return cols_numeric


# remove aggregation on a specific state level
def clean_adm_cols(df):
    adm_cols = list(filter(lambda x: x.startswith("#adm"), df.columns.astype(str)))
    if not adm_cols:
        return df
    for col in adm_cols[:-1]:
        df[col] = df[col].ffill()
    return df.dropna(subset=adm_cols)


def contains_affected(numeric_cols, hxl_indices):
    # derived from https://stackoverflow.com/a/2364277
    return next(
        (i for i, col_index in enumerate(numeric_cols) if hxl_indices[col_index].startswith("#affected")),
        None,
    )


# add preceeding rows if tags are in the middle of the data frame
def add_preceeding_rows(df, aff_ind, i_tagrow, numeric_columns):
    # check if the tags are already in the first row
    if i_tagrow <= 0:
        return df, i_tagrow
    # traverse beginning from the row ahead of the row of tags
    ii_tagrow = i_tagrow - 1
    dat_val = df[numeric_columns[aff_ind]].loc[ii_tagrow]
    # go up until we reach a cell that look like a column description (not numeric and not nan)
    while ii_tagrow > 0 and (numeric_regex.match(str(dat_val)) or pd.isna(dat_val)):
        ii_tagrow -= 1
        dat_val = df[numeric_columns[aff_ind]].loc[ii_tagrow]
    # last row containing actual data
    ii_tagrow += 1
    if ii_tagrow != i_tagrow:
        df.drop(i_tagrow, axis="index", inplace=True)
        ii_tagrow -= 1  # hxl tags have already been removed
    return df, ii_tagrow


def adjust_date_format(df):
    # derived from https://stackoverflow.com/a/2364277
    date_cols = list(filter(lambda x: x.startswith("#date"), df.columns.astype(str)))
    if not date_cols:
        return df

    # adjust format of date in all columns featuring a date
    try:
        for col in date_cols:
            df[col] = pd.to_datetime(df[col], format="%Y-%m-%d")
    except ValueError as _:
        pass

    return df


def clean_current_sheet(sheet_data, hxl_columns, i):
    hxl_indices = {index: header for index, header in hxl_columns}
    numeric_columns = numeric_row(sheet_data, i, hxl_indices)
    
    if not numeric_columns is None:
        # use affected column is possible
        aff_ind = contains_affected(numeric_columns, hxl_indices)
        aff_ind = 0 if aff_ind is None else aff_ind
        sheet_data, i = add_preceeding_rows(sheet_data, aff_ind, i, numeric_columns)

    desired_columns = pd.Index(hxl_indices.keys())
    processed_data = sheet_data[desired_columns].drop(index=range(i + 1))
    processed_data.rename(columns=hxl_indices, inplace=True)
    processed_data = clean_adm_cols(processed_data)
    return adjust_date_format(processed_data)


def clean_one_sheet(sheet_data):
    processed_data = None
    for i, row in enumerate(sheet_data.values.astype(str)):
        hxl_columns = find_hxl_indices(row)
        if hxl_columns:
            processed_data = clean_current_sheet(sheet_data, hxl_columns, i)
            break  # Once the headers are found and processed, exit the loop

    return processed_data

#for testing
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
