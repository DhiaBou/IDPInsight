import "../styles/SideMenu.css"

import React, { useEffect } from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import {getCountries, getDatasets} from "../utils/fetch_data";
import RefreshContainer from "./RefreshButton";

import { SideMenuProps } from "../utils/types";


function SideMenu({ selectedCountry, setSelectedCountry }: SideMenuProps) {
    const [selectedDataset, setDataset] = React.useState('');

    const [countries, setCountries] = React.useState<JSX.Element[]>([]);
    const [datasetNames, setDatasetNames] = React.useState<JSX.Element[]>([]);
    
    const [refreshCountryKey, setRefreshCountryKey] = React.useState(0);
    const [refreshDatasetKey, setRefreshDatasetKey] = React.useState(0);

    //Get all countries and update the dropdown menu
    const updateCountries = async () => {
        const countries = await getCountries(new URL('https://ixmk8bqo29.execute-api.eu-west-1.amazonaws.com/dev/get-countries'));
        setCountries(createCountryMenuItems(countries));
      };

    useEffect(() => {
        updateCountries();
    }, [refreshCountryKey]);

    //----------------------------------------------
    const updateDatasetNames = async () => {
        const datasets = await getDatasets(selectedCountry, new URL('https://ixmk8bqo29.execute-api.eu-west-1.amazonaws.com/dev/get-datasets-for-a-country'));
       
        const datasetNames = datasets.map(dataset => dataset.name);
        setDatasetNames(createDatasetMenuItems(datasetNames));

        console.log(datasets);
    }

    useEffect(()=> {
        updateDatasetNames();
    }, [refreshDatasetKey]);

 
    //Action handlers
    const handleCountryChange = (event: SelectChangeEvent) => {
        setSelectedCountry(event.target.value);
        setRefreshDatasetKey(oldKey=>oldKey + 1);
    };

    const handleDatasetChange = (event: SelectChangeEvent) => {
        if(selectedCountry.length !== 0 && event.target.value.length !== 0) {
            updateDatasetNames();
        }
    };

    const triggerCountryDropdown = () => {
        setRefreshCountryKey(oldKey => oldKey + 1); 
    };

    const triggerDatasetDropdown = () => {
        console.log(setDataset);
        setRefreshDatasetKey(oldKey => oldKey + 1);
    }

    //------------------------------------------------
    // Helpers
    //------------------------------------------------
    const createCountryMenuItems = (countries: string[]) => {
        const countryMenuItems = countries.map(country => 
            <MenuItem key={country} value={country}>{country}</MenuItem>
        );
        return countryMenuItems;
    }

    const createDatasetMenuItems = (datasetNames: string[]) => {
        const datasetsMenuItems = datasetNames.map(dataset => 
            <MenuItem key={dataset} value={dataset}>{dataset}</MenuItem>
        );
        return datasetsMenuItems;
    }

    return (
        <div className="side-menu-container">
            <RefreshContainer onRefresh={ triggerCountryDropdown }></RefreshContainer>

            <FormControl>
                <InputLabel id="select-country-label">Country</InputLabel>
                    <Select
                        labelId="select-country-label"
                        id="select-country"
                        value={selectedCountry}
                        label="Country"
                        onChange={handleCountryChange}
                        onClick={triggerCountryDropdown}
                    >
                    <MenuItem key="" value="">None</MenuItem>
                    {countries}
                    </Select>
            </FormControl>

            {selectedCountry.length !== 0 &&
                <FormControl>
                    <InputLabel id="select-dataset-label">Dataset</InputLabel>
                    <Select
                        labelId="select-dataset-label"
                        id="select-dataset"
                        value={selectedDataset}
                        label="Dataset"
                        onChange={handleDatasetChange}
                        onClick={triggerDatasetDropdown}
                    >
                    <MenuItem key="" value="">None</MenuItem>
                    {datasetNames}
                    </Select>
                </FormControl>
            }
        </div>
    );
}

export default SideMenu;