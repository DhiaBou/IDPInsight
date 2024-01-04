# AWS Lambda Function: Data Fetching

## Overview
This AWS Lambda function is designed to download datasets related to internally displaced persons (IDP) from the Humanitarian Data Exchange (HDX) and upload them to an AWS S3 bucket. The function is triggered by an event that specifies a location (ISO3 code) and an organization. It's particularly configured for datasets that have both 'internally displaced persons-idp' and 'hxl' tags.

## Functionality
- **Event Triggered**: The function starts upon receiving an event containing `locations` and `organization` parameters.
- **Data Fetching**: Searches for datasets on HDX related to 'internally displaced persons-idp' under the specified organization.
- **Data Filtering**: Filters datasets based on location and tags ('internally displaced persons-idp' and 'hxl').
- **Data Download and Upload**: Downloads the datasets from HDX and uploads them to a specified S3 bucket.

## Requirements
- Python environment with packages: `boto3`, `hdx`, `requests`, `os`.
- AWS Lambda environment setup.
- Access to HDX API and AWS S3.

## Event Parameter Structure
The event triggering this function should have the following JSON structure:

```json
{
  "locations": ["ISO3_Code1", "ISO3_Code2"],
  "organization": "Organization_Name"
}
```

### Example of Event Parameters
```json
{
  "locations": ["SOM", "SUD"],
  "organization": "international-organization-for-migration" # IOM
}
```

## Usage
1. Deploy this function in AWS Lambda.
2. Trigger the function with an event having the required parameters.
3. The function will log its progress, download the filtered datasets, and upload them to the specified S3 bucket.

## Note
- The current configuration is tailored for datasets related to IDP and tagged with 'hxl'.
- The function assumes each dataset is associated with a single location. Multi-location datasets require additional handling.

For further customization or troubleshooting, refer to the function's comments and AWS Lambda's documentation.