
import boto3
import csv
import requests
from hdx.utilities.easy_logging import setup_logging
from hdx.api.configuration import Configuration
from hdx.data.dataset import Dataset


from pathlib import Path

def main():
    setup_logging()
    Configuration.create(hdx_site="stage", user_agent="WFP_Project", hdx_read_only=True)
      
    download_data_south_america()
    download_data_europa()
    download_data_africa()
    download_data_asia()


def download_data_south_america():
    #South America
    download_all_resources_for_dataset("ccb9dfdf-b432-4d50-bd19-ac5616a0447b", "Colombia")
    
    #No clearly seperated data about IDP movements in Venezuela
    #download_all_resources_for_dataset("", "")

def download_data_europa():
    #Europa
    download_all_resources_for_dataset("0d36e8ad-d2e8-4646-babd-61a41f99159a", "Ukraine")

def download_data_africa():
    #Africa
    download_all_resources_for_dataset("ea41f7c7-2ebe-456b-b5eb-e3e0ac8d708b", "Mali")
    download_all_resources_for_dataset("5a0dfc28-6fb6-4719-bff7-71fa35b87588", "Burkina Faso")
    download_all_resources_for_dataset("501a166f-9f7f-477c-85bc-06019f59ad88", "Niger")
    
    download_all_resources_for_dataset("4adf7874-ae01-46fd-a442-5fc6b3c9dff1", "Nigeria")
    
    #Download error for second dataset for Chad, ignore this country for now
    #download_all_resources_for_dataset("162936be-722b-4559-970d-204d8a704d5e", "Chad")
    
    download_all_resources_for_dataset("140a45e9-6563-47e7-89b1-9109d89a2211", "Cameroon")
    
    download_all_resources_for_dataset("c0ab1fef-323a-4f50-9fbb-a70462b3e644", "Central African Republic")
    download_all_resources_for_dataset("319dd40f-c0f8-4f6d-9a8e-9acf31007dd5", "Sudan")
    download_all_resources_for_dataset("03c95eef-e3c5-40f6-9c86-9dcdc692be03", "South Sudan")

    download_all_resources_for_dataset("4c5a3870-321d-45b0-8036-a22aeafde551", "Ethiopia")
    download_all_resources_for_dataset("b421e1e5-a8cc-48c1-8e85-dc2d01706584", "Somalia")
    download_all_resources_for_dataset("a4bbccf1-d5ae-4712-b378-29c1372c7a42", "Mozambique")


def download_data_asia():
    #Asia
    download_all_resources_for_dataset("daa955d0-fb67-402b-ae3a-4552a889b5bb","Syrian Arab Republic")
    download_all_resources_for_dataset("62cc626a-39c4-431d-964b-7a5600a4684b", "Yemen")
    download_all_resources_for_dataset("90deb235-1bf5-4bae-b231-3393222c2d00", "Afghanistan")
    
    #No clearly seperated data for IDP movement in Pakistan
    #Sdownload_all_resources_for_dataset("","Pakistan")
    
    download_all_resources_for_dataset("c22d14df-c1d3-4824-8b0e-23958c6fbf17", "Myanmar")



#-----------------------------------------------------------------
#Helpers
#-----------------------------------------------------------------
def download_all_resources_for_dataset(dataset_id, country_name):
    """
    Download all resources of the dataset with the specified dataset_id
    Create a subfolder ./data/country_name to store the data
    """
    path_to_data = Path("./data/") / country_name

    if not path_to_data.exists():
        path_to_data.mkdir(parents=True, exist_ok=True)
        print(f"Created folder for: {country_name}")

    dataset = Dataset.read_from_hdx(dataset_id)

    resources = Dataset.get_all_resources([dataset])
    for resource in resources:
        url, path = resource.download(path_to_data)
        print("Resource URL %s downloaded to %s\n" % (url, path))


if __name__ == "__main__":
    main()


def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = 'devgurus-raw-data'
    file_name = 'gothdx.csv'
    csv_content = [['4']]

    with open('/tmp/' + file_name, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(csv_content)

    s3.upload_file('/tmp/' + file_name, bucket_name, file_name)
    return {
        'statusCode': 200,
        'body': 'File created and uploaded successfully.'
    }