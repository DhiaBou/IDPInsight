import os

import boto3
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

    df = pd.DataFrame()

    if file_key.startswith('/tmp/Sudan/DTM Sudan - Weekly displacement snapshot 11.xlsx'):
        # Read the first sheet into a DataFrame using pandas
        # Note: No need to use openpyxl here
        df = pd.read_excel(io.BytesIO(obj['Body'].read()), sheet_name='MASTER LIST (ADMIN1)', header=1)

        # Perform additional processing with df
        # drop line with comments
        df = df.drop(0)
        df = df.reset_index(drop=True)

        # rename unclear features
        df = df.rename(columns={'HHs': 'Households'})

        # replace nan values to 0
        state_origin_columns = df.columns[4:-2]  # Selecting columns between 'HHs' and 'SUDANESE'
        df[state_origin_columns] = df[state_origin_columns].fillna(0)
    elif file_key.startswith('/tmp/Colombia/Colombia_Desplazamientos_Jan2008_oct2023 .xlsx'):
        df = pd.read_excel(io.BytesIO(obj['Body'].read()), header=1)
        df = df.reset_index(drop=True)
        df = df.drop(['age', 'gender', 'Category', 'ethnic_group', 'ID'], axis=1)

        # Rename the column 'Victims' to 'IDPs'
        df.rename(columns={'Victims': 'IDPs'}, inplace=True)

        df = df[df['IDPs'] != 0]

    # Write to new bucket
    output = io.StringIO()
    df.to_csv(output, encoding='utf-8', index=False)
    s3.put_object(Bucket='devgurus-processed-data', Key=file_key, Body=output.getvalue())


def process_csv(bucket_name, file_key):
    # Read the csv file
    obj = s3.get_object(Bucket=bucket_name, Key=file_key)
    new_df = pd.read_csv(io.BytesIO(obj['Body'].read()))

    new_df = rename_columns(df=new_df)
    new_df.dropna(inplace=True)  # drop nul values
    new_df = remove_rows_where_idps_zero(df=new_df)  # Remove rows where 'Affected IDPs Individuals' is 0

    # Write to new bucket
    output = io.StringIO()
    new_df.to_csv(output, index=False)
    s3.put_object(Bucket='devgurus-processed-data', Key=file_key, Body=output.getvalue())


def rename_columns(df):
    new_column_names = {
        'affected+idps+ind': 'Affected IDPs Individual Count',
        'adm1+name': 'Administrative Level 1 Name',
        'date+survey': 'Survey Date',
        'adm0+pcode': 'Country Code',
        'adm2+name': 'Administrative Level 2 Name',
        'adm1+origin+pcode': 'Origin Administrative Level 1 Code',
        'affected+idps+hh': 'Affected IDPs Household Count',
        'adm0+name': 'Country Name',
        'adm2+origin+name': 'Origin Administrative Level 2 Name',
        'adm2+pcode': 'Administrative Level 2 Code',
        'date+reported': 'Reported Date',
        'adm2+origin+pcode': 'Origin Administrative Level 2 Code',
        'adm1+pcode': 'Administrative Level 1 Code',
        'adm1+origin+name': 'Origin Administrative Level 1 Name'
    }

    # Rename the columns that exist
    df.rename(columns={k: v for k, v in new_column_names.items() if k in df.columns}, inplace=True)

    return df


def remove_rows_where_idps_zero(df):
    if 'Affected IDPs Individual Count' in df.columns:
        df = df[df['Affected IDPs Individual Count'] != 0]
    return df


def process_test(path):
    df = pd.read_csv(path)  # Read the CSV file

    new_df = rename_columns(df=df)
    new_df.dropna(inplace=True)  # drop nul values
    new_df = remove_rows_where_idps_zero(df=new_df)  # Remove rows where 'Affected IDPs Individuals' is 0

    output_folder = 'processed_data/sudan'  # Replace with the path to your output folder

    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Define the file path for the new CSV file
    filename = os.path.basename(path)

    csv_file_path = os.path.join(output_folder, "_processed_" + filename)

    # Write the DataFrame to a CSV file
    new_df.to_csv(csv_file_path, index=False, encoding='utf-8')


def process_all_csv_files(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".csv"):
            file_path = os.path.join(directory, filename)
            process_test(file_path)
