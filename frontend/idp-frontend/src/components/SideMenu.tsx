import "../styles/SideMenu.css"

import React, { useEffect } from 'react';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import {getCountries} from "../utils/fetch_data";
import RefreshContainer from "./RefreshButton";

function SideMenu() {
    //TODO: Country dropdown related functionality
    const [selectedCountry, setCountry] = React.useState('');
    const [selectedDataset, setDataset] = React.useState('');

    const [countryMenuItems, setCountryMenuItems] = React.useState<JSX.Element[]>([]);
    const [datasetMenuItems, setDatasetMenuItems] = React.useState<JSX.Element[]>([]);
    

    const [refreshKey, setRefreshKey] = React.useState(0);

    const fetchCountries = async () => {
        const countries = await getCountries();
        const countryMenuItemsBuf = countries.map(country => 
          <MenuItem key={country} value={country}>{country}</MenuItem>
        );
        setCountryMenuItems(countryMenuItemsBuf);
      };

    useEffect(() => {
        fetchCountries();
    }, [refreshKey]);


    useEffect(()=> {
        setDatasetMenuItems([]);
    }, [refreshKey]);

 
    //Action handlers
    const handleCountryChange = (event: SelectChangeEvent) => {
        setCountry(event.target.value);
        //TODO: Dataset dropdown values should be updated
    };

    const handleDatasetChange = (event: SelectChangeEvent) => {
        setDataset(event.target.value);
    };

    const handleRefresh = () => {
        //Refresh button clicked
        // Update the country list and dataset list
        setRefreshKey(oldKey => oldKey + 1); 
    };


    return (
        <div className="side-menu-container">
            <RefreshContainer onRefresh={ handleRefresh }></RefreshContainer>


            <FormControl>
                <InputLabel id="select-country-label">Country</InputLabel>
                    <Select
                        labelId="select-country-label"
                        id="select-country"
                        value={selectedCountry}
                        label="Country"
                        onChange={handleCountryChange}
                    >
                    {countryMenuItems}
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
                    >
                    {datasetMenuItems}
                    </Select>
                </FormControl>
            }
        </div>
    );
}


export default SideMenu;