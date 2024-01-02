import os

import boto3
import requests
from hdx.api.configuration import Configuration, ConfigurationError
from hdx.data.dataset import Dataset
from hdx.utilities.easy_logging import setup_logging

s3_bucket = "devgurus-raw-data"
s3 = boto3.client("s3")
s3_resource = boto3.resource("s3")


def lambda_handler(event, context):
    setup_logging()
    # Extract location (iso3) from the event
    locations = event["locations"]
    # Extract organization from the event
    organization = event["organization"]
    try:
        Configuration.create(hdx_site="stage", user_agent="WFP_Project", hdx_read_only=True)
    except ConfigurationError:
        pass
    fetch_datasets(locations, organization)

    return {
        "statusCode": 200,
        "body": "Files downloaded and uploaded to S3 successfully",
    }


def fetch_datasets(locations, organization):
    # Obtain all datasets by the organization, specified as paramater
    datasets = Dataset.search_in_hdx(q="internally displaced persons-idp", fq=f"organization:{organization}")

    for dataset in datasets:
        dataset_id = dataset.get_name_or_id(False)
        dataset_name = dataset.get_name_or_id(True)
        dataset_tags = dataset.get_tags()

        dataset_locations = dataset.get_location_iso3s()

        if "internally displaced persons-idp" in dataset_tags:
            if "hxl" in dataset_tags:
                if check_locations(locations, dataset_locations):
                    download_all_resources_for_dataset(dataset_id, dataset_name, dataset_locations)


def check_locations(locations, dataset_locations):
    for dataset_location in dataset_locations:
        if dataset_location not in locations:
            return False

    return True


def download_all_resources_for_dataset(dataset_id, dataset_name, dataset_locations):
    dataset = Dataset.read_from_hdx(dataset_id)
    resources = Dataset.get_all_resources([dataset])

    # Assuming each dataset is associated with one location
    # TODO: Consider datasets with multiple locations
    location = dataset_locations[0]

    # Data stored under /tmp/country/dataset_name
    path = "tmp/" + location + "/" + dataset_name

    for resource in resources:
        download_url = resource.data.get("url", None)
        file_name = resource.data.get("name", None)
        file_type = resource.get_file_type()
        file_extension = "." + file_type

        # Check if file type is contained in the name
        # If not the case, then add it
        if not file_extension in file_name:
            file_name = file_name + file_extension

        file_path = os.path.join(path, file_name)

        response = requests.get(download_url)
        if response.status_code == 200:
            s3_resource.Object(s3_bucket, file_path).put(Body=response.content)
