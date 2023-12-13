import boto3
import openpyxl
import pandas as pd
import io

s3 = boto3.client('s3')


def lambda_handler(event, context):
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    file_key = event['Records'][0]['s3']['object']['key']
    print(event)

    if file_key.endswith('.xlsx'):
        process_xlsx(bucket_name, file_key)
    elif file_key.endswith('.csv'):
        process_csv(bucket_name, file_key)


def process_xlsx(bucket_name, file_key):
    obj = s3.get_object(Bucket=bucket_name, Key=file_key)

    df = pd.DataFrame()

    if file_key.startswith('/tmp/Sudan/DTM Sudan - Weekly displacement snapshot 11.xlsx'):
        df = pd.read_excel(io.BytesIO(obj['Body'].read()), sheet_name='MASTER LIST (ADMIN1)', header=1)

        df = df.drop(0)
        df = df.reset_index(drop=True)
        df = df.rename(columns={'HHs': 'Households'})
        state_origin_columns = df.columns[4:-2]
        df[state_origin_columns] = df[state_origin_columns].fillna(0)
        write_file(df, '/tmp/Sudan/DTM_Sudan_Weekly_displacement_snapshot_11_processed.csv')

    elif file_key.startswith('/tmp/Colombia/Colombia_Desplazamientos_Jan2008_oct2023 .xlsx'):
        df = pd.read_excel(io.BytesIO(obj['Body'].read()), header=5)
        df = df.reset_index(drop=True)
        df = df.drop(['age', 'gender', 'Category', 'ethnic_group', 'ID'], axis=1)
        df.rename(columns={'Victims': 'IDPs'}, inplace=True)
        df = df[df['IDPs'] != 0]

        write_file(df, '/tmp/Colombia/Colombia_IDP_Jan2008_oct2023_processed.csv')


def write_file(df, file_key):
    output = io.StringIO()
    df.to_csv(output, encoding='utf-8', index=False)
    s3.put_object(Bucket='devgurus-processed-data', Key=file_key, Body=output.getvalue())


def process_csv(bucket_name, file_key):
    pass

