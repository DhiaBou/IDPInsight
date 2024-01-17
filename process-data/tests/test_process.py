import pandas as pd
import importlib
import hxl_parser as parser

def test_fill():
    test_file = pd.read_excel("tests/test-data/test_fill.xlsx", sheet_name = "Summary Analysis", header=None)
    processed_data = parser.clean_one_sheet(test_file)
    verif_data = pd.read_csv("tests/validation-data/test_fill.csv")
    processed_data.reset_index(drop=True, inplace=True)

    assert processed_data.compare(verif_data).empty 

def test_edge_hxl_first_row():
    test_file = pd.read_excel("tests/test-data/test_edge_hxl_first_row.xlsx", sheet_name = "EET Emergency Event Tracking", header=None)
    processed_data = parser.clean_one_sheet(test_file)
    verif_data = pd.read_csv("tests/validation-data/test_edge_hxl_first_row.csv")
    processed_data.reset_index(drop=True, inplace=True)

    assert processed_data.compare(verif_data).empty

def test_row_at_end():
    test_file = pd.read_excel("tests/test-data/test_row_at_end.xlsx", sheet_name = "EET Emergency Event Tracking", header=None)
    processed_data = parser.clean_one_sheet(test_file)
    verif_data = pd.read_csv("tests/validation-data/test_row_at_end.csv")
    processed_data.reset_index(drop=True, inplace=True)

    assert processed_data.compare(verif_data).empty