import io
import boto3
import hdx
import requests
import os
from hdx.api.configuration import Configuration
from hdx.data.dataset import Dataset
from hdx.utilities.downloader import Download
from hdx.utilities.easy_logging import setup_logging


s3_bucket = "devgurus-raw-data"
s3 = boto3.client("s3")
s3_resource = boto3.resource("s3")

# def stream_path(self, path: str, errormsg: str):
#    try:
#        for chunk in self.response.iter_content(chunk_size=10240):
#            if chunk:
#                s3.upload_fileobj(io.BytesIO(chunk), s3_bucket, path)
#        return path
#    except Exception:
#        pass


# hdx.utilities.downloader.Download.stream_path = stream_path


def lambda_handler(event, context):
    setup_logging()
    Configuration.create(hdx_site="stage", user_agent="WFP_Project", hdx_read_only=True)

    fetch_all_relevant_datasets()

    return {
        "statusCode": 200,
        "body": "Files downloaded and uploaded to S3 successfully",
    }


def fetch_all_relevant_datasets():
    african_iso3 = [
        "DZA",
        "AGO",
        "BEN",
        "BWA",
        "BFA",
        "BDI",
        "CPV",
        "CMR",
        "CAF",
        "TCD",
        "COM",
        "COD",
        "COG",
        "DJI",
        "EGY",
        "GNQ",
        "ERI",
        "SWZ",
        "ETH",
        "GAB",
        "GMB",
        "GHA",
        "GIN",
        "GNB",
        "CIV",
        "KEN",
        "LSO",
        "LBR",
        "LBY",
        "MDG",
        "MWI",
        "MLI",
        "MRT",
        "MUS",
        "MAR",
        "MOZ",
        "NAM",
        "NER",
        "NGA",
        "RWA",
        "STP",
        "SEN",
        "SYC",
        "SLE",
        "SOM",
        "ZAF",
        "SSD",
        "SDN",
        "TZA",
        "TGO",
        "TUN",
        "UGA",
        "ZMB",
        "ZWE",
    ]

    relevant_datasets = []


def download_all_resources_for_dataset(dataset_id, country_name):
    dataset = Dataset.read_from_hdx(dataset_id)
    resources = Dataset.get_all_resources([dataset])
    path = "/tmp/" + country_name + "/"
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

        # url, path = resource.download(path)
        # print("Resource URL %s downloaded to %s\n" % (download_url, path))
