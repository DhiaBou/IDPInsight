import io
import boto3
import hdx
from hdx.api.configuration import Configuration
from hdx.data.dataset import Dataset
from hdx.utilities.downloader import Download
from hdx.utilities.easy_logging import setup_logging
from hdx.api.locations import Locations

import requests
import os

s3_bucket = "devgurus-raw-data"
s3 = boto3.client("s3")
s3_resource = boto3.resource("s3")


def lambda_handler(event, context):
    setup_logging()
    Configuration.create(hdx_site="stage", user_agent="WFP_Project", hdx_read_only=True)
    download_datasets()

    return {
        "statusCode": 200,
        "body": "Files downloaded and uploaded to S3 successfully",
    }


def download_datasets():
    """
    Choose datasets with tags 'internally displaced persons-idp' and 'hxl'
    Download only resources (excel files) of this datasets
    """
    datasets = Dataset.search_in_hdx(
        q="internally displaced persons-idp", fq=f"organization:{'international-organization-for-migration'}"
    )

    for dataset in datasets:
        tags = Dataset.get_tags(dataset)
        if "internally displaced persons-idp" in tags:
            if "hxl" in tags:
                download_all_resources_for_dataset(dataset)


def download_all_resources_for_dataset(dataset):
    try:
        # Obtain dataset id and name
        dataset_id = dataset.data.get("id")
        dataset_name = dataset.data.get("name")

        # Determine location code and thus country
        location_code = dataset.get_location_iso3s()
        location = Locations.get_location_from_HDX_code(location_code[0])

        # Create path to country and dataset
        path_country = os.path.join("/", "temp", "/", location)
        path_dataset = os.path.join(path_country, dataset_name)

        # Download all resources for this dataset
        resources = Dataset.get_all_resources([dataset])

        for resource in resources:
            download_url = resource.data.get("url", None)

            file_name = resource.data.get("name", None)
            file_type = resource.get_file_type()
            file_extension = "." + file_type

            # Check if file type is contained in the name
            # If not the case, then add it
            if not file_extension in file_name:
                file_name = file_name + file_extension

            response = requests.get(download_url)
            path_file = os.path.join(path_dataset, file_name)
            if response.status_code == 200:
                s3_resource.Object(s3_bucket, path_file).put(Body=response.content)

    except requests.exceptions.HTTPError as http_error:
        print(f"HTTP Error occurred: {http_error}")
        pass


# def download_data_south_america():
#     download_all_resources_for_dataset("ccb9dfdf-b432-4d50-bd19-ac5616a0447b", "Colombia")


# def download_data_africa():
#     download_all_resources_for_dataset("319dd40f-c0f8-4f6d-9a8e-9acf31007dd5", "Sudan")
