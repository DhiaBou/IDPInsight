import boto3
import openpyxl
import pandas as pd
import io

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

    new_df = pd.concat([df, df])

    # new_df = rename_columns(df=df)
    # new_df.dropna(inplace=True)  # drop nul values
    # new_df = remove_rows_where_idps_zero(df=new_df)  # Remove rows where 'Affected IDPs Individuals' is 0

    # Write to new bucket
    output = io.StringIO()
    new_df.to_csv(output, index=False)
    s3.put_object(Bucket='devgurus-processed-data', Key=file_key, Body=output.getvalue())


def rename_columns(df):
    new_column_names = {
        '#adm1+name': 'Name of State',
        '#adm1+pcode': 'Post code of State',
        '#adm2+name': 'Name of City',
        '#adm2+pcode': 'Post code of City',
        '#affected+idps+ind': 'Affected IDPs Individuals',
        '#affected+idps+hh': 'Affected IDPs Households',
        '#adm1+origin+name': 'Origin Name of State',
        '#adm1+origin+pcode': 'Origin post code of State',
        '#adm2+origin+name': 'Origin Name of City',
        '#adm2+origin+pcode': 'Origin post code of City'
    }

    # Rename the columns that exist
    df.rename(columns={k: v for k, v in new_column_names.items() if k in df.columns}, inplace=True)

    return df


def remove_rows_where_idps_zero(df):
    if 'Affected IDPs Individuals' in df.columns:
        df = df[df['Affected IDPs Individuals'] != 0]
    return df
