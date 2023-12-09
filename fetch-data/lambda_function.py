import io
import boto3
import hdx
from hdx.api.configuration import Configuration
from hdx.data.dataset import Dataset
from hdx.utilities.downloader import Download
from hdx.utilities.easy_logging import setup_logging

s3_bucket = "devgurus-raw-data"
s3 = boto3.client("s3")


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
    download_data_south_america()

    return {
        "statusCode": 200,
        "body": "Files downloaded and uploaded to S3 successfully",
    }


def download_data_south_america():
    download_all_resources_for_dataset("ccb9dfdf-b432-4d50-bd19-ac5616a0447b", "Colombia")


def download_data_africa():
    download_all_resources_for_dataset("319dd40f-c0f8-4f6d-9a8e-9acf31007dd5", "Sudan")


def download_all_resources_for_dataset(dataset_id, country_name):
    dataset = Dataset.read_from_hdx(dataset_id)
    resources = Dataset.get_all_resources([dataset])
    path = "/tmp/" + country_name + "/"
    for resource in resources:
        url, path = resource.download(path)
        url_components = path.split("/")
        file_name = url_components[len(url_components) - 1]
        s3.Object(s3_bucket, file_name).upload_file(path)

        print("Resource URL %s downloaded to %s\n" % (url, path))
