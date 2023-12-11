from hdx.utilities.easy_logging import setup_logging
from hdx.api.configuration import Configuration
from hdx.data.dataset import Dataset
from hdx.data.organization import Organization
from hdx.api.locations import Locations
import pandas as pd
import regex as re
import boto3
import io

#pattern for HXL
pattern = r"#.*\+"

#find fitting rows via pattern match
def search_rows(row):
    reg = re.compile(pattern)
    indices = [i for i in range(len(row))]
    to_filter = list(zip(indices, row))

    filtered = list(filter(lambda x : reg.match(x[1]), to_filter))
    return filtered


# transform xslx to csv using HLX
def transform(file_buffer, cl, bucket, key):
    
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
                    
                    # drop first <i> rows and returns columns with HXL tag
                    clean = file[index_header].drop(index = [ii for ii in range(i)])
                    return clean
                
                # continue with next sheet after 5 rows
                if i == 4:
                    break
        return None
    
    
    clean_data = match_hxl(file_buffer)
    if clean_data is None:
        return

    # generate file name
    outname = key.split('/')[-1].replace('.xlsx', '') + ".csv"

    # write to S3 bucket
    buffer = io.BytesIO()
    clean_data.to_csv(buffer, index = None, header = False)
    cl.put_object(Body = buffer, Bucket = bucket, Key = outname)
    
