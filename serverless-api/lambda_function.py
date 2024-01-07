import json
import boto3


def lambda_handler(event, context):
    # Common headers for all responses
    common_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'  # Add this line for CORS
    }
    path = event.get('path')

    # Check the path and return the appropriate response
    if path == '/get-countries':
        return {
            'statusCode': 200,
            'headers': common_headers,
            'body': json.dumps(get_countries_names())
        }
    elif path == '/':
        return {
            'statusCode': 200,
            'headers': common_headers,
            'body': json.dumps("Hello World")
        }
    else:
        # Fallback for other paths
        return {
            'statusCode': 404,
            'headers': common_headers,
            'body': json.dumps("Not Found")
        }


# Your existing functions (list_folders and get_countries_names) remain the same


def list_folders(bucket_name, prefix):
    s3_client = boto3.client('s3')
    paginator = s3_client.get_paginator('list_objects_v2')
    folder_names = set()

    for page in paginator.paginate(Bucket=bucket_name, Prefix=prefix, Delimiter='/'):
        for prefix_info in page.get('CommonPrefixes', []):
            # Extracting just the folder name
            folder_name = prefix_info.get('Prefix')[len(prefix):].strip('/')
            folder_names.add(folder_name)

    return list(folder_names)


def get_countries_names():
    bucket_name = 'devgurus-processed-data'
    prefix = 'tmp/'

    folders = list_folders(bucket_name, prefix)
    return folders
