class Router:
    def __init__(self, raw_data_bucket_name, processed_data_bucket_name, s3_client):
        self.raw_data_bucket = raw_data_bucket_name
        self.processed_data_bucket = processed_data_bucket_name
        self.s3_client = s3_client

    def route(self, path):
        if path == '/get-countries':
            return self.get_countries_names(), 200
        elif path == '/':
            return self.get_health() , 200
        else:
            return "Not Found", 404

    def get_countries_names(self):
        folders = self.list_folders(self.processed_data_bucket, 'tmp/')
        return folders

    def get_health(self):
        return "I am healthy :-)"

    def list_folders(self, bucket_name, prefix):
        # Your existing logic for list_folders
        paginator = self.s3_client.get_paginator('list_objects_v2')
        folder_names = set()

        for page in paginator.paginate(Bucket=bucket_name, Prefix=prefix, Delimiter='/'):
            for prefix_info in page.get('CommonPrefixes', []):
                folder_name = prefix_info.get('Prefix')[len(prefix):].strip('/')
                folder_names.add(folder_name)

        return list(folder_names)
