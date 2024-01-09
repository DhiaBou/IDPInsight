import json
import logging
import os

import boto3
import requests
from hdx.api.configuration import Configuration, ConfigurationError
from hdx.data.dataset import Dataset
from hdx.utilities.easy_logging import setup_logging

S3_BUCKET = "devgurus-raw-data"
S3_CLIENT = boto3.client("s3")
S3_RESOURCE = boto3.resource("s3")
IDP_TAG = "internally displaced persons-idp"


def lambda_handler(event, context):
    logging.basicConfig(level=logging.INFO)
    setup_logging()
    path_parameters = event.get("pathParameters", {})

    location = event.get("location", "")
    organization = event.get("organization", "")
    try:
        Configuration.create(hdx_site="stage", user_agent="WFP_Project", hdx_read_only=True)
    except ConfigurationError:
        pass
    fetch_datasets([location], organization)

    return {
        "statusCode": 200,
        "body": "Files downloaded and uploaded to S3 successfully",
    }


def fetch_datasets(locations, organization):
    # Obtain all datasets by the organization, specified as paramater
    datasets = Dataset.search_in_hdx(q=IDP_TAG, fq=f"organization:{organization}")

    for dataset in datasets:
        dataset_id = dataset.get_name_or_id(False)
        dataset_name = dataset.get_name_or_id(True)
        dataset_tags = dataset.get_tags()
        dataset_locations = dataset.get_location_iso3s()

        if IDP_TAG in dataset_tags and "hxl" in dataset_tags:
            if check_locations(locations, dataset_locations):
                download_all_resources_for_dataset(dataset_id, dataset_name, dataset_locations)


def check_locations(locations, dataset_locations):
    return all(loc in locations for loc in dataset_locations)


def download_all_resources_for_dataset(dataset_id, dataset_name, dataset_locations):
    dataset = Dataset.read_from_hdx(dataset_id)
    dataset_metadata = dataset.get_dataset_dict()
    if dataset_metadata["archived"]:
        logging.info(f"Dataset {dataset.get_name_or_id(True)} is archived, skipping...")
        return

    logging.info(f"Downloading ressources for {dataset_metadata['name']}...")
    resources = Dataset.get_all_resources([dataset])

    # Assuming each dataset is associated with one location
    # TODO: Consider datasets with multiple locations
    location = dataset_locations[0]

    # Data stored under /tmp/country/dataset_name
    path = "tmp/" + location + "/" + dataset_id + "__" + dataset_name
    # write_dataset_metadata(dataset_metadata, path)

    for resource in resources:
        write_resource_file(path, resource)


def write_resource_file(path, resource):
    download_url = resource.data.get("url", None)
    file_name = f'{resource.data.get("id", "")}__{resource.data.get("name", None)}'
    file_type = resource.get_file_type()
    file_extension = "." + file_type
    if not file_extension in file_name:
        file_name = file_name + file_extension
    file_path = os.path.join(path, file_name)
    response = requests.get(download_url)
    if response.status_code == 200:
        metadata = {
            "id": resource.get("id", "unknown"),
            "last_modified": resource.get("last_modified", "unknown"),
        }
        print(metadata)


def write_dataset_metadata(dataset_metadata, path):
    dataset_metadata_json = json.dumps(dataset_metadata)
    dataset_metadata_filename = "metadata.json"
    dataset_metadata_path = os.path.join(path, dataset_metadata_filename)
    S3_RESOURCE.Object(S3_BUCKET, dataset_metadata_path).put(Body=dataset_metadata_json)


print("Hi")
logging.basicConfig(level=logging.INFO)
setup_logging()
try:
    Configuration.create(hdx_site="stage", user_agent="WFP_Project", hdx_read_only=True)
except ConfigurationError:
    pass
fetch_datasets(["SOM"], "international-organization-for-migration")
print("Bye")
