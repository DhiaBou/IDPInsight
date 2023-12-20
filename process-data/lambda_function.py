import os

import boto3
import pandas as pd
import io
from hxl_parser import clean_one_sheet

s3 = boto3.client("s3")


def lambda_handler(event, context):
    # Get bucket name and file key from the event
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    file_key = event["Records"][0]["s3"]["object"]["key"]

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
    i = 0
    for df in processed_data_list:
        new_df = rename_columns(df=df)
        new_df.dropna(inplace=True)  # drop nul values
        new_df = remove_rows_where_idps_zero(df=new_df)  # Remove rows where 'Affected IDPs Individuals' is 0

        # Write to new bucket
        output = io.StringIO()
        new_df.to_csv(output, index=False)
        new_filename = file_key.replace(".xlsx", str(str(i) + ".csv"))
        i += 1
        s3.put_object(Bucket="devgurus-processed-data", Key=new_filename, Body=output.getvalue())


def rename_columns(df):
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

    # Rename the columns that exist
    df.rename(columns={k: v for k, v in new_column_names.items() if k in df.columns}, inplace=True)

    return df


def remove_rows_where_idps_zero(df):
    if "Affected IDPs Individual Count" in df.columns:
        df = df[df["Affected IDPs Individual Count"] != 0]
    return df
