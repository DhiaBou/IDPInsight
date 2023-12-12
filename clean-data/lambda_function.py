from hdx.utilities.easy_logging import setup_logging
from hdx.api.configuration import Configuration
from hdx.data.dataset import Dataset
from hdx.data.organization import Organization
from hdx.api.locations import Locations
import pandas as pd
import regex as re
import boto3
import io
import os


s3_o = "devgurus-clean-data"
s3_cl = boto3.client("s3")

#pattern for HXL
pattern = r"#.*\+"

#find fitting rows via pattern match
def search_rows(row):
    reg = re.compile(pattern)
    indices = [i for i in range(len(row))]
    to_filter = list(zip(indices, row))

    filtered = list(filter(lambda x : reg.match(x[1]), to_filter))
    return filtered



    
def match_hxl(file_path):
        
    # get sheet names
    xlsx_file = pd.ExcelFile(file_path)
    names = xlsx_file.sheet_names
        
    # iterate over sheets
    for name in names:
        file = pd.read_excel(file_path, sheet_name = name, header = None)
            
        # check if HXL appears 
        for i,r in enumerate(file.values.astype(str), start=0):
            header_cols = search_rows(list(r))
                
            if header_cols != []:
                indices = [ii for ii,_ in header_cols]
                index_header = pd.Index(indices)
                    
                #drop first <i> rows and returns columns with HXL tag
                clean = file[index_header].drop(index = [ii for ii in range(i)])
                return clean
                
                # continue with next sheet after 5 rows
            if i == 4:
                break
    return None
    

def lambda_handler(event, context):
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    file_key = event['Records'][0]['s3']['object']['key']
    
    # not an .xlsx file
    if not file_key.endswith('.xlsx'):
        return
    
    file = s3.get_object(Bucket=bucket_name, Key=file_key)
        
    clean_data = match_hxl(io.BytesIO(obj['Body'].read()))
    
    # No columns found
    if clean_data is None:
        return
    
    output = io.StringIO()
    name = file_key.replace('.xlsx', '') + ".csv"
    clean_data.to_csv(output, index = None, header = False)
    s3_cl.put_object(Bucket=s3_o, Key=name, Body=output.getvalue())
    
    
    
    
    

    
    
    
    

    
