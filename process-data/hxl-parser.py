from hdx.utilities.easy_logging import setup_logging
from hdx.api.configuration import Configuration
from hdx.data.dataset import Dataset
from hdx.data.organization import Organization
from hdx.api.locations import Locations
import pandas as pd
import regex as re
import tempfile as tf
import io
import os


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
    print(file_path)
        
    # iterate over sheets
    for name in names:
        file = pd.read_excel(file_path, sheet_name = name, header = None)
        
        print(name)
        # check if HXL appears 
        for i,r in enumerate(file.values.astype(str), start=0):
            header_cols = search_rows(list(r))
            print(header_cols)
                
            if header_cols:
                indices = {ii:h for ii,h in header_cols}
                index_header = pd.Index(indices.keys())
                    
                #drop first <i> rows and returns columns with HXL tag
                clean = file[index_header].drop(index = [ii for ii in range(i + 1)])
                clean.rename(columns = indices, inplace = True)
                yield clean
                break
                # continue with next sheet after 10 rows
            if i == 9:
                break    

def match_hxl_list(file_path):
    return list(match_hxl(file_path))


# transform HXL to csv
def to_file(file_path: str, dir: str):

    for clean in match_hxl(file_path):

        outname = file_path.split('/')[-1].replace('.', '-')

        _,path = tf.mkstemp(suffix = '.csv', prefix=outname, dir = dir)

        clean.to_csv(path, index = None)

# clean all files in directory
def parse_all(dirname, outdir):
    for _, _, files in os.walk(dirname):
        for f in files:
            fullpath = dirname + '/' + f
            to_file(fullpath, outdir)
    
    
    
    

    
    
    
    

    
