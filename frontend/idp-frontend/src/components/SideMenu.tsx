import "../styles/SideMenu.css"
import * as React from 'react';

import { SideMenuProps } from "../utils/types";


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import {getCountries, getDatasets} from "../utils/fetch_data";

async function SideMenu(props: SideMenuProps) {
    //TODO: Country dropdown related functionality
    //const [selectedCountry, setCountry] = React.useState('');
    //const [selectedDataset, setDataset] = React.useState('');

    //const [countryMenuItems, setCountryMenuItems] = React.useState<JSX.Element[]>([]);
    //const [datasetMenuItems, setDatasetMenuItems] = React.useState<JSX.Element[]>([]);

    
  
    const countries = await getCountries();

    console.log(countries.json())  

    // const countryMenuItems = countries.map(country => 
    //     <MenuItem value={country}>{country}</MenuItem>
    //     );


    //TODO: Dataset dropdown related functionality
    // const [dataset, setDataset] = React.useState('');
    
    // const datasets = getDatasets(country);


    // const datasetMenuItems = datasets.map(dataset =>
    //     <MenuItem value={dataset}>{dataset}</MenuItem>
    //     );

    
    
    //Action handlers
    // const handleCountryChange = (event: SelectChangeEvent) => {
    //     setCountry(event.target.value);
    //     //TODO: Dataset dropdown values should be updated
    // };

    // const handleDatasetChange = (event: SelectChangeEvent) => {
    //     setDataset(event.target.value);
    // };


    return (<div></div>
        // <div className="side-menu-container">
        //     <FormControl sx={{ m: 1, minWidth: 120 }}>
        //         <InputLabel id="select-country-label">Country</InputLabel>
        //             <Select
        //                 labelId="select-country-label"
        //                 id="select-country"
        //                 value={selectedCountry}
        //                 label="Country"
        //                 onChange={handleCountryChange}
        //             >
        //             {countryMenuItems}
        //             </Select>
        //     </FormControl>

        //     {selectedCountry.length !== 0 &&
        //         <FormControl sx={{m:1, minWidth: 120}}>
        //             <InputLabel id="select-dataset-label">Dataset</InputLabel>
        //             <Select
        //                 labelId="select-dataset-label"
        //                 id="select-dataset"
        //                 value={dataset}
        //                 label="Dataset"
        //                 onChange={handleDatasetChange}
        //             >
        //             {datasetMenuItems}
        //             </Select>
        //         </FormControl>
        //     }
        // </div>
    );
}


export default SideMenu