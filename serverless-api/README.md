### API Documentation

#### Base URL

The base URL is `https://ixmk8bqo29.execute-api.eu-west-1.amazonaws.com/dev/`.

#### API Endpoints

1. **GET `/`**
   - **Description**: Returns health or status of the service.
   - **Method**: `GET`
   - **Parameters**: None
   - **Response**: A string indicating the health status of the service.
     - **Example Response**: `"I am healthy :-)"`.

2. **GET `/get-countries`**
   - **Description**: Returns a list of countries for which datasets have been processed.
   - **Method**: `GET`
   - **Parameters**: None
   - **Response**: A list of countries in a specific format. Each country is represented by its ISO code.
     - **Example Response**: `['SND', 'LBN']`.


3. **GET `/get-datasets-for-a-country/{isocode}`**
   - **Description**: Retrieves available processed datasets for a specified country.
   - **Method**: `GET`
   - **Path Parameters**:
     - `isocode` (required): ISO code of the country.
   - **Response**: A list of datasets, each with details such as ID, organization information, dataset source, license, title, and processed files.
     - **Example Request**: `/get-datasets-for-a-country/SDN`
     - **Example Response**:
       ```json
        [
            {
                "id": "132c64c2-53e6-4e45-8364-35bf4e22987f",
                "last_modified": "2019-10-31T14:59:09.431932",
                "organization": {
                    "id": "f53d32cd-132c-4ef4-bc6d-058f94d08adf",
                    "name": "International Organization for Migration (IOM)",
                    "title": "International Organization for Migration (IOM)",
                    "type": "organization",
                    "description": "IOM is committed to the principle that humane and orderly migration benefits migrants and society.",
                    "image_url": "",
                    "created": "2014-07-16T13:02:25.371736",
                    "is_organization": true,
                    "approval_status": "approved",
                    "state": "active"
                },
                "dataset_source": "International Organization for Migration (IOM)",
                "license_title": "Other",
                "name": "sudan-registration-data-iom-dtm",
                "notes": "This dataset contains IDP numbers.",
                "title": "Sudan Displacement Data - Registration [IOM DTM]",
                "dataset_folder_name": "132c64c2-53e6-4e45-8364-35bf4e22987f__sudan-registration-data-iom-dtm",
                "processed_files": [
                    {
                        "file_name": "DTM_Sudan_Registration_processed.csv",
                        "last_modified": "2019-10-31T14:59:09.431932"
                    }
                ]
            }
        ]       
        ```
4. **GET `/trigger-pipeline/{isocode}`**
   - **Description**: Triggers the pipeline for the specified country.
   - **Method**: `GET`
   - **Path Parameters**:
     - `isocode` (required): ISO code of the country.
   - **Query Parameters**:
     - `organization` Organization to fetch the data from. Empty organization field will fetch data for that country from all available organizations.
     - `startlastmodified` The date starting from which the files are retrieved. Empty date field will fetch data for that country from any date.
   - **Response**: `200` if the pipeline is successfully triggered.
     - **Example Request**: `trigger-pipeline/LBY?organization=international-organization-for-migration&startlastmodified=2024-01-01`

4. **GET `/get-datasets-for-a-country/{isocode}/{datasetid}/{fileid}`**
   - **Description**: Provides content and metadata of a specific file within a dataset for a given country.
   - **Method**: `GET`
   - **Path Parameters**:
     - `isocode` (required): ISO code of the country.
     - `datasetid` (required): Identifier for the dataset.
     - `fileid` (required): Identifier for the file within the dataset.
   - **Response**: Detailed information about the specified file, including download URL, file metadata, and dataset metadata.
     - **Example Request**: `/get-datasets-for-a-country/SDN/132c64c2-53e6-4e45-8364-35bf4e22987f/DTM_Sudan_Registration_processed.csv`
     - **Example Response**:
       ```json
       {
           "download_url": "https://.../DTM_Sudan_Registration_processed.csv",
           "original_file_metadata": {
                    "created": "2018-03-12T11:50:26.171544",
        "description": "Aggregation of the registration exercises conducted in Sudan since 2010.",
        "download_url": "https://data.humdata.org/.../dtm-sudan-registration.xlsx",

               "id": "90ee46eb-ab51-4095-8c32-b9f8361364b5",
               "name": "DTM Sudan Registration",
               "last_modified": "2019-10-31T14:59:09.431932"
           },
        "dataset_metadata": {
            "id": "132c64c2-53e6-4e45-8364-35bf4e22987f",
            "last_modified": "2019-10-31T14:59:09.431932",
            "organization": {
                "id": "f53d32cd-132c-4ef4-bc6d-058f94d08adf",
                "name": "international-organization-for-migration",
                "title": "International Organization for Migration (IOM)",
                "type": "organization",
                "description": "IOM is committed to the principle that humane and orderly migration benefits migrants and society.",
                "image_url": "",
                "created": "2014-07-16T13:02:25.371736",
                "is_organization": true,
                "approval_status": "approved",
                "state": "active"
            },
            "dataset_source": "International Organization for Migration (IOM)",
            "license_title": "Other",
            "name": "sudan-registration-data-iom-dtm",
            "notes": "This dataset contains IDP numbers.",
            "title": "Sudan Displacement Data - Registration [IOM DTM]"
        }
       }
       ```

