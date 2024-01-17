import json
import logging
import os

import boto3
import requests
from datetime import datetime
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
    location = event["location"]
    organization = event.get("organization", "")
    if organization == "all":
        organization = ""
    start_last_modified = event.get("startlastmodified", "")
    try:
        Configuration.create(hdx_site="stage", user_agent="WFP_Project", hdx_read_only=True)
    except ConfigurationError:
        pass
    fetch_datasets(location, organization, start_last_modified)

    return {
        "statusCode": 200,
        "body": "Files downloaded and uploaded to S3 successfully",
    }


def parse_date(date_str, formats):
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None


def fetch_datasets(country_iso, organization, start_last_modified_str):
    # Obtain all datasets by the organization, specified as parameter
    datasets = Dataset.search_in_hdx(q=IDP_TAG, fq=f"groups:{country_iso.lower()}")

    date_formats = ["%Y-%m-%dT%H:%M:%S.%f", "%Y-%m-%dT%H:%M:%S", '%Y-%m-%d']

    for dataset in datasets:
        last_modified_str = dataset.get("last_modified", "")
        last_modified = parse_date(last_modified_str, date_formats)

        start_last_modified = parse_date(start_last_modified_str, date_formats)

        if last_modified is None or start_last_modified is None or last_modified >= start_last_modified:
            dataset_id = dataset.get_name_or_id(False)
            dataset_name = dataset.get_name_or_id(True)
            dataset_tags = dataset.get_tags()
            dataset_organization_name = dataset.get("organization", {}).get("name", "")
            if (
                IDP_TAG in dataset_tags
                and "hxl" in dataset_tags
                and (organization == "" or dataset_organization_name == organization)
            ):
                download_all_resources_for_dataset(dataset_id, dataset_name, country_iso)


def check_locations(locations, dataset_locations):
    return all(loc in locations for loc in dataset_locations)


def download_all_resources_for_dataset(dataset_id, dataset_name, location):
    dataset = Dataset.read_from_hdx(dataset_id)
    dataset_metadata = dataset.get_dataset_dict()
    if dataset_metadata["archived"]:
        logging.info(f"Dataset {dataset.get_name_or_id(True)} is archived, skipping...")
        return

    logging.info(f"Downloading ressources for {dataset_metadata['name']}...")
    resources = Dataset.get_all_resources([dataset])

    # Data stored under /tmp/country/dataset_name
    path = "tmp/" + location + "/" + dataset_id.replace("/", "_") + "__" + dataset_name.replace("/", "_")
    write_dataset_metadata(dataset_metadata, path)

    for resource in resources:
        write_resource_file(path, resource)


def write_resource_file(path, resource):
    download_url = resource.data.get("url", None)
    file_name = f'{resource.data.get("id", "")}__{resource.data.get("name", None)}'
    file_type = resource.get_file_type()
    file_extension = "." + file_type
    if not file_extension in file_name:
        file_name = file_name + file_extension
    file_name_formatted = file_name.replace("/", "_")
    file_path = os.path.join(path, file_name_formatted)
    response = requests.get(download_url)
    if response.status_code == 200:
        metadata = {
            "id": resource.get("id", "unknown"),
            "last_modified": resource.get("last_modified", "unknown"),
        }
        S3_RESOURCE.Object(S3_BUCKET, file_path).put(Body=response.content, Metadata=metadata)


def write_dataset_metadata(dataset_metadata, path):
    dataset_metadata_json = json.dumps(dataset_metadata)
    dataset_metadata_filename = "metadata.json"
    dataset_metadata_path = os.path.join(path, dataset_metadata_filename)
    S3_RESOURCE.Object(S3_BUCKET, dataset_metadata_path).put(Body=dataset_metadata_json)
