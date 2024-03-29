import json
import urllib.parse

BASE_ROUTE = "tmp"


class Router:
    def __init__(self, raw_data_bucket_name, processed_data_bucket_name, s3_client):
        # Initialize Router with S3 bucket names and client
        self.raw_data_bucket = raw_data_bucket_name
        self.processed_data_bucket = processed_data_bucket_name
        self.s3_client = s3_client

    def route(self, event):
        # Route the incoming event to the appropriate method based on the resource
        resource = event["resource"]
        path = event.get("path")
        path_parameters = event.get("pathParameters", {})

        if resource == "/get-countries":
            return self.get_countries()
        elif resource == "/":
            return self.get_health()
        elif resource == "/get-datasets-for-a-country/{isocode}":
            country_isocode = path_parameters["isocode"]
            return self.get_datasets_for_a_country(country_isocode)
        elif resource == "/get-datasets-for-a-country/{isocode}/{datasetid}/{fileid}":
            country_isocode = path_parameters["isocode"]
            file = path_parameters["fileid"]
            dataset = path_parameters["datasetid"]
            return self.get_file_content_and_metadata(country_isocode, file, dataset)
        else:
            return "Path Not Found", 404

    def get_file_content_and_metadata(self, country_isocode, file_name, dataset):
        # Get content and metadata for a specific file within a dataset
        decoded_file_name = urllib.parse.unquote_plus(file_name)
        decoded_dataset_name = urllib.parse.unquote_plus(dataset)

        file_key = f"tmp/{country_isocode}/{decoded_dataset_name}/{decoded_file_name}"
        file_url = self.generate_presigned_url(self.processed_data_bucket, file_key)
        file_id = self.get_file_id(self.processed_data_bucket, file_key)
        dataset_metadata = self.get_metadata_for_a_dataset(country_isocode, dataset)
        file_metadata = next(
            (resource for resource in dataset_metadata["resources"] if resource["id"] == file_id), {}
        )
        ineteresting_metdata_fields = [
            "created",
            "description",
            "download_url",
            "id",
            "last_modified",
            "name",
        ]
        filtered_file_metadata = {
            tag: file_metadata[tag] for tag in ineteresting_metdata_fields if tag in file_metadata
        }
        return {
            "download_url": file_url,
            "original_file_metadata": filtered_file_metadata,
            "dataset_metadata": self.extract_metadata(dataset_metadata),
        }

    def generate_presigned_url(self, bucket_name, file_key, expiration=3600):
        # Generate a presigned URL for downloading an object from S3
        return self.s3_client.generate_presigned_url(
            "get_object", Params={"Bucket": bucket_name, "Key": file_key}, ExpiresIn=expiration
        )

    def get_file_id(self, bucket_name, file_key):
        # Get the file ID from the object metadata
        obj = self.s3_client.get_object(Bucket=bucket_name, Key=file_key)
        original_metadata = obj.get("Metadata", {})

        return original_metadata.get("id", "")

    def read_csv_file(self, bucket_name, file_key):
        # Read the content of a CSV file from S3
        try:
            response = self.s3_client.get_object(Bucket=bucket_name, Key=file_key)
            csv_content = response["Body"].read().decode("utf-8")
            return csv_content
        except Exception as e:
            print(f"Error reading {file_key}: {e}")
            return None

    def get_datasets_for_a_country(self, country_isocode):
        # Get metadata for all datasets within a specific country
        datasets = self.list_folders(self.processed_data_bucket, f"tmp/{country_isocode}/")
        country_datasets = []

        for dataset in datasets:
            metadata_content = self.get_metadata_for_a_dataset(country_isocode, dataset)
            if metadata_content:
                interesting_metadata = self.extract_metadata(metadata_content)
                csv_files_and_their_date = self.list_files_and_their_date(
                    self.processed_data_bucket, f"tmp/{country_isocode}/{dataset}/", file_extension=".csv"
                )
                interesting_metadata["processed_files"] = csv_files_and_their_date
                dataset_folder_name = urllib.parse.quote_plus(dataset)
                interesting_metadata["dataset_folder_name"] = dataset_folder_name
                country_datasets.append(interesting_metadata)
        return country_datasets

    def get_metadata_for_a_dataset(self, country_isocode, dataset):
        # Get metadata for a specific dataset within a country
        metadata_file_key = f"tmp/{country_isocode}/{dataset}/metadata.json"
        metadata_content = self.read_json_file(self.processed_data_bucket, metadata_file_key)
        return metadata_content

    def get_countries(self):
        # Get a list of countries (folders) within the processed data bucket
        countries_folders = self.list_folders(self.processed_data_bucket, "tmp/")
        return countries_folders

    def get_countries_datasets(self):
        # Get metadata for all datasets within all countries
        countries_folders = self.list_folders(self.processed_data_bucket, "tmp/")
        country_datasets = {}

        for country in countries_folders:
            country_datasets[country] = self.get_datasets_for_a_country(country)

        return country_datasets

    def list_files_and_their_date(self, bucket_name, prefix, file_extension=".csv"):
        # List files and their last modified date within a specific prefix
        paginator = self.s3_client.get_paginator("list_objects_v2")
        files_and_their_date = []

        for page in paginator.paginate(Bucket=bucket_name, Prefix=prefix):
            for obj in page.get("Contents", []):
                if obj["Key"].endswith(file_extension):
                    file_name = obj["Key"][len(prefix) :]
                    # Retrieve the metadata for the object
                    metadata = self.s3_client.head_object(Bucket=bucket_name, Key=obj["Key"])["Metadata"]
                    last_modified = metadata.get("last_modified", "")
                    encoded_file_name = urllib.parse.quote_plus(file_name)
                    files_and_their_date.append(
                        {"file_name": encoded_file_name, "last_modified": last_modified}
                    )

        return files_and_their_date

    def read_json_file(self, bucket_name, file_key):
        # Read the content of a JSON file from S3
        try:
            response = self.s3_client.get_object(Bucket=bucket_name, Key=file_key)
            metadata_json = json.loads(response["Body"].read().decode("utf-8"))
            return metadata_json
        except Exception as e:
            print(f"Error reading {file_key}: {e}")
            return None

    def extract_metadata(self, metadata_json):
        # Extract specific metadata fields of interest
        tags_of_interest = [
            "id",
            "last_modified",
            "organization",
            "dataset_source",
            "license_title",
            "name",
            "notes",
            "title",
        ]
        filtered_metadata = {tag: metadata_json[tag] for tag in tags_of_interest if tag in metadata_json}
        return filtered_metadata

    def list_folders(self, bucket_name, prefix):
        # List folders
        paginator = self.s3_client.get_paginator("list_objects_v2")
        folder_names = set()

        for page in paginator.paginate(Bucket=bucket_name, Prefix=prefix, Delimiter="/"):
            for prefix_info in page.get("CommonPrefixes", []):
                folder_name = prefix_info.get("Prefix")[len(prefix) :].strip("/")
                folder_names.add(folder_name)

        return list(folder_names)

    def get_health(self):
        return "I am healthy :-)"
