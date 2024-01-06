import io

import boto3
import pandas as pd
import urllib.parse

from hxl_parser import clean_one_sheet

s3 = boto3.client("s3")


def lambda_handler(event, context):
    print(event)
    # Get bucket name and file key from the event
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    file_key = urllib.parse.unquote_plus(event["Records"][0]["s3"]["object"]["key"])

    # Determine file type
    process_xlsx(bucket_name, file_key)


def process_xlsx(bucket_name, file_key):
    # Read the xlsx file
    obj = s3.get_object(Bucket=bucket_name, Key=file_key)
    excel_data = io.BytesIO(obj["Body"].read())
    xlsx_file = pd.ExcelFile(excel_data)
    processed_data_list = []

    for sheet_name in xlsx_file.sheet_names:
        df = pd.read_excel(xlsx_file, sheet_name=sheet_name, header=None)
        clean_one_sheet(processed_data_list, df)
    file_counter = 0
    logs = ""
    for df in processed_data_list:
        logs += f"Processing file: {file_key}, Sheet: {file_counter}\n"
        new_df, logs = rename_columns(df=df, logs=logs)
        new_df, logs = drop_null_values(df=new_df, logs=logs)  # drop nul values
        new_df, logs = remove_rows_where_idps_zero(df=new_df,
                                                   logs=logs)  # Remove rows where 'Affected IDPs Individuals' is 0
        # Write to new bucket
        output = io.StringIO()
        new_df.to_csv(output, index=False)
        new_filename = file_key.replace(".xlsx", f"_processed_{str(file_counter)}.csv")
        file_counter += 1
        s3.put_object(Bucket="devgurus-processed-data", Key=new_filename, Body=output.getvalue())

    # Write logs to StringIO and upload to S3
    log_file = io.StringIO(logs)
    log_filename = file_key.replace(".xlsx", "_logs.txt")
    s3.put_object(Bucket="devgurus-processed-data", Key=log_filename, Body=log_file.getvalue())


def drop_null_values(df, logs):
    null_rows = df[df.isnull().any(axis=1)]

    logs += f"Rows dropped due to null values:\n{null_rows}\n"

    df.dropna(inplace=True)
    return df, logs


def rename_columns(df, logs):
    new_column_names = {
        "affected+idps+ind": "Affected IDPs Individual Count",
        "adm1+name": "Administrative Level 1 Name",
        "date+survey": "Survey Date",
        "adm0+pcode": "Country Code",
        "adm2+name": "Administrative Level 2 Name",
        "adm1+origin+pcode": "Origin Administrative Level 1 Code",
        "affected+idps+hh": "Affected IDPs Household Count",
        "adm0+name": "Country Name",
        "adm2+origin+name": "Origin Administrative Level 2 Name",
        "adm2+pcode": "Administrative Level 2 Code",
        "date+reported": "Reported Date",
        "adm2+origin+pcode": "Origin Administrative Level 2 Code",
        "adm1+pcode": "Administrative Level 1 Code",
        "adm1+origin+name": "Origin Administrative Level 1 Name",
    }

    for old_name, new_name in new_column_names.items():
        if old_name in df.columns:
            # Log the old and new column names
            logs += f"Renaming column '{old_name}' to '{new_name}'\n"

    # Rename the columns that exist
    df.rename(columns={k: v for k, v in new_column_names.items() if k in df.columns}, inplace=True)

    return df, logs


def remove_rows_where_idps_zero(df, logs):
    if "Affected IDPs Individual Count" in df.columns:
        zero_idp_rows = df[df["Affected IDPs Individual Count"] == 0]

        logs += f"Rows  dropped where 'Affected IDPs Individual Count' is zero:\n{zero_idp_rows}\n"

        df = df[df["Affected IDPs Individual Count"] != 0]

    return df, logs
