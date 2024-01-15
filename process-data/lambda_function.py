import io
import logging

import boto3
import pandas as pd
import urllib.parse

from hxl_parser import clean_one_sheet

s3 = boto3.client("s3")


def lambda_handler(event, context):
    logging.basicConfig(level=logging.INFO)
    # Get bucket name and file key from the event
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    file_key = urllib.parse.unquote_plus(event["Records"][0]["s3"]["object"]["key"])

    if file_key.endswith(".json"):
        process_json(bucket_name, file_key)
    elif file_key.endswith(".xlsx"):
        process_xlsx(bucket_name, file_key)
    else:
        logging.info(f"File type not supported for file {file_key}")


def process_json(bucket_name, file_key):
    response = s3.get_object(Bucket=bucket_name, Key=file_key)
    file_content = response["Body"].read()
    destination_bucket = "devgurus-processed-data"
    s3.put_object(Bucket=destination_bucket, Key=file_key, Body=file_content)


def process_xlsx(bucket_name, file_key):
    # Read the xlsx file and its metadata
    obj = s3.get_object(Bucket=bucket_name, Key=file_key)
    original_metadata = obj.get("Metadata", {})
    excel_data = io.BytesIO(obj["Body"].read())
    xlsx_file = pd.ExcelFile(excel_data)
    processed_data_dict = {}
    sheet_count = 0
    # Process each sheet
    for sheet_name in xlsx_file.sheet_names:
        df = pd.read_excel(xlsx_file, sheet_name=sheet_name, header=None)
        clean_sheet = clean_one_sheet(df)
        if clean_sheet is not None:
            processed_data_dict[f"{sheet_name}_{sheet_count}"] = clean_sheet
            sheet_count += 1

    logs = []
    file_counter = 0
    for sheet_name, df in processed_data_dict.items():
        modified_metadata = original_metadata.copy()
        modified_metadata["sheet_name"] = sheet_name

        new_df = rename_columns(df=df, logs=logs)
        new_df = handle_null_values(new_df)

        # Convert logs list to a string with line breaks and add to metadata
        log_str = "\n".join(logs)
        modified_metadata["processing_logs"] = log_str

        # Write to new bucket with updated metadata
        output = io.StringIO()
        new_df.to_csv(output, index=False)
        new_filename = file_key.replace(".xlsx", f"_processed_{file_counter}.csv")
        file_counter += 1
        s3.put_object(
            Bucket="devgurus-processed-data",
            Key=new_filename,
            Body=output.getvalue(),
            Metadata=modified_metadata,
        )


def handle_null_values(new_df):
    new_df = new_df.apply(lambda col: col.fillna(0) if col.dtype.kind in 'biufc' else col.fillna(''))
    return new_df


def rename_columns(df, logs):
    new_column_names = {col_name: col_name.strip('#').replace('+', '-') for col_name in df.columns.astype(str)}
    changes = {k: v for k, v in new_column_names.items() if k in df.columns and k != v}

    # Rename the columns that exist
    df.rename(columns=changes, inplace=True)

    # Write changes to log
    for original, new in changes.items():
        logs.append(f"Column renamed from '{original}' to '{new}'")

    return df






