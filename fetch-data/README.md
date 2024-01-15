# AWS Lambda Function: Data Fetching

## Overview
This AWS Lambda function is designed to download datasets related to internally displaced persons (IDP) from the Humanitarian Data Exchange (HDX) and upload them to an AWS S3 bucket. The function is triggered by an event that specifies a location (ISO3 code), an organization and a start date. It's particularly configured for datasets that have both 'internally displaced persons-idp' and 'hxl' tags.

## Functionality
- **Event Triggered**: The function starts upon receiving an event containing `location`, `organization` and `startlastmodified` parameters.
- **Data Fetching**: Searches for datasets on HDX related to 'internally displaced persons-idp' under the specified organization.
- **Data Filtering**: Filters datasets based on location, tags ('internally displaced persons-idp' and 'hxl') and last modified date (>= startlastmodified).
- **Data Download and Upload**: Downloads the datasets from HDX and uploads them to a specified S3 bucket.

## Requirements
- Python environment with packages: `boto3`, `hdx`, `requests`, `os` and `datetime`.
- AWS Lambda environment setup.
- Access to HDX API and AWS S3.

## Event Parameter Structure
The event triggering this function should have the following JSON structure:

```json
{
  "locations": "ISO3_Code",
  "organization": "Organization_Name",
  "startlastmodified": "earliest last modified date"
}
```

### Example of Event Parameters
```json
{
  "locations": "SOM", #Somalia
  "organization": "international-organization-for-migration", # IOM
  "startlastmodified": "2023-10-01"
}
```

## Usage
1. Deploy this function in AWS Lambda.
2. Trigger the function with an event having the required parameters.
3. The function will log its progress, download the filtered datasets, and upload them to the specified S3 bucket.

## Note
- The current configuration is tailored for datasets related to IDP and tagged with 'hxl'.
- The function assumes each dataset is associated with a single location. Multi-location datasets require additional handling.
- Initiating the lambda through an event with an empty organization parameter leads to the retrieval of datasets from all organizations.
- Activating the lambda via an event with an empty startlastmodified parameter results in fetching datasets with all possible last modified dates.

For further customization or troubleshooting, refer to the function's comments and AWS Lambda's documentation.
