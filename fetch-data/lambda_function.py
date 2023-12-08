import mimetypes
import io
import boto3
import requests

s3_bucket = "devgurus-raw-data"
s3 = boto3.client("s3")
dataset_id = "0d36e8ad-d2e8-4646-babd-61a41f99159a"


def download_hdx_resources(dataset_id):
    api_url = f"https://data.humdata.org/api/3/action/package_show?id={dataset_id}"
    response = requests.get(api_url)

    if response.status_code == 200:
        data = response.json()
        if data["success"]:
            resources = data["result"]["resources"]
            for resource in resources:
                url = resource["url"]
                filename = resource.get("name")
                format = resource.get("format").lower() if resource.get("format") else ""

                # Determine the file extension
                extension = (
                    mimetypes.guess_extension(resource.get("mimetype")) if resource.get("mimetype") else ""
                )
                if not extension and format:
                    extension = f".{format}"
                if extension and not filename.endswith(extension):
                    filename += extension
                filename = "/tmp/" + filename
                # Download the file
                r = requests.get(url, stream=True)
                if r.status_code == 200:
                    with open(filename, "wb") as f:
                        for chunk in r.iter_content(chunk_size=1024):
                            if chunk:
                                s3.upload_fileobj(io.BytesIO(chunk), s3_bucket, filename)
                    print(f"Downloaded {filename}")
                else:
                    print(f"Failed to download {filename}")
        else:
            print("Failed to find dataset")
    else:
        print("Failed to connect to HDX API")


def lambda_handler(event, context):
    download_hdx_resources(dataset_id)

    return {
        "statusCode": 200,
        "body": "Files downloaded and uploaded to S3 successfully",
    }
