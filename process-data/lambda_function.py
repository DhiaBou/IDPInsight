import boto3
import pandas as pd
import io
from openpyxl import Workbook

s3 = boto3.client('s3')

def lambda_handler(event, context):
    # Get bucket name and file key from the event
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    file_key = event['Records'][0]['s3']['object']['key']

    # Determine file type
    if file_key.endswith('.xlsx'):
        process_xlsx(bucket_name, file_key)
    elif file_key.endswith('.csv'):
        process_csv(bucket_name, file_key)

def process_xlsx(bucket_name, file_key):
    # Read the xlsx file
    obj = s3.get_object(Bucket=bucket_name, Key=file_key)
    wb = openpyxl.load_workbook(io.BytesIO(obj['Body'].read()))

    # Add a new sheet with '1' in it
    new_sheet = wb.create_sheet(title="NewSheet")
    new_sheet['A1'] = 1

    # Write to new bucket
    output = io.BytesIO()
    wb.save(output)
    s3.put_object(Bucket='devgurus-processed-data', Key=file_key, Body=output.getvalue())

def process_csv(bucket_name, file_key):
    # Read the csv file
    obj = s3.get_object(Bucket=bucket_name, Key=file_key)
    df = pd.read_csv(io.BytesIO(obj['Body'].read()))

    # Duplicate its content
    new_df = pd.concat([df, df])

    # Write to new bucket
    output = io.StringIO()
    new_df.to_csv(output, index=False)
    s3.put_object(Bucket='devgurus-processed-data', Key=file_key, Body=output.getvalue())
