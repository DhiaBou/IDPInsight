import json


class Router:
    def __init__(self, raw_data_bucket_name, processed_data_bucket_name, s3_client):
        self.raw_data_bucket = raw_data_bucket_name
        self.processed_data_bucket = processed_data_bucket_name
        self.s3_client = s3_client

    def route(self, event):
        path = event.get("path")
        path_parameters = event.get("pathParameters", {})

        if path == "/get-countries":
            return self.get_countries(), 200
        elif path == "/":
            return self.get_health(), 200
        elif path.startswith("/get-datasets-for-a-country"):
            country_isocode = path_parameters["isocode"]
            return self.get_datasets_for_a_country(country_isocode), 200
        else:
            return "Path Not Found", 404

    def get_datasets_for_a_country(self, country_isocode):
        datasets = self.list_folders(self.processed_data_bucket, f"tmp/{country_isocode}/")
        country_datasets = []

        for dataset in datasets:
            metadata_file_key = f"tmp/{country_isocode}/{dataset}/metadata.json"
            metadata_content = self.read_json_file(self.processed_data_bucket, metadata_file_key)
            if metadata_content:
                interesting_metadata = self.extract_metadata(metadata_content)
                csv_files = self.list_files(
                    self.processed_data_bucket, f"tmp/{country_isocode}/{dataset}/", file_extension=".csv"
                )
                interesting_metadata["csv_files"] = csv_files

                country_datasets.append(interesting_metadata)
        return country_datasets

    def get_countries(self):
        countries_folders = self.list_folders(self.processed_data_bucket, "tmp/")
        return countries_folders

    def get_countries_datasets(self):
        countries_folders = self.list_folders(self.processed_data_bucket, "tmp/")
        country_datasets = {}

        for country in countries_folders:
            country_datasets[country] = self.get_datasets_for_a_country(country)

        return country_datasets

    def list_files(self, bucket_name, prefix, file_extension=".csv"):
        paginator = self.s3_client.get_paginator("list_objects_v2")
        file_names = []

        for page in paginator.paginate(Bucket=bucket_name, Prefix=prefix):
            for obj in page.get("Contents", []):
                if obj["Key"].endswith(file_extension):
                    file_name = obj["Key"][len(prefix) :]
                    file_names.append(file_name)

        return file_names

    def read_json_file(self, bucket_name, file_key):
        try:
            response = self.s3_client.get_object(Bucket=bucket_name, Key=file_key)
            metadata_json = json.loads(response["Body"].read().decode("utf-8"))
            return metadata_json
        except Exception as e:
            print(f"Error reading {file_key}: {e}")
            return None

    def extract_metadata(self, metadata_json):
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
        paginator = self.s3_client.get_paginator("list_objects_v2")
        folder_names = set()

        for page in paginator.paginate(Bucket=bucket_name, Prefix=prefix, Delimiter="/"):
            for prefix_info in page.get("CommonPrefixes", []):
                folder_name = prefix_info.get("Prefix")[len(prefix) :].strip("/")
                folder_names.add(folder_name)

        return list(folder_names)

    def get_health(self):
        return "I am healthy :-)"
