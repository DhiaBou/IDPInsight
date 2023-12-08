import csv
import pandas
import boto3


def lambda_handler(event, context):
    s3 = boto3.client("s3")
    bucket_name = "devgurus-processed-data"
    file_name = "gothdx.csv"
    csv_content = [["4"]]

    with open("/tmp/" + file_name, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerows(csv_content)

    s3.upload_file("/tmp/" + file_name, bucket_name, file_name)
    return {"statusCode": 200, "body": "File created and uploaded successfully."}
