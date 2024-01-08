import json
import logging

import boto3
from router import Router

RAW_DATA_BUCKET_NAME = "devgurus-raw-data"
PROCESSED_DATA_BUCKET_NAME = "devgurus-processed-data"


def lambda_handler(event, context):
    s3_client = boto3.client("s3")

    router = Router(RAW_DATA_BUCKET_NAME, PROCESSED_DATA_BUCKET_NAME, s3_client)

    common_headers = {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}

    try:
        response_body = router.route(event)
        return {"statusCode": 200, "headers": common_headers, "body": json.dumps(response_body)}
    except Exception as e:
        logging.error(f"Error Occured")
        logging.error(str(e))
        return {"statusCode": 500, "headers": common_headers, "body": json.dumps("Internal Server Error")}
