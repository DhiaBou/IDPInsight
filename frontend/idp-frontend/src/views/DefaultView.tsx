import React from 'react';

import NavBar from "../components/NavBar";
import SideMenu from "../components/SideMenu";
import ChartContainer from "../components/ChartContainer";

function DefaultView() {
    const [selectedCountry, setSelectedCountry] = React.useState('');
    
    return (
        <div className="main-container">
            <div className="top-container">
                <NavBar/>
            </div>

            <div className="bottom-container">
                <SideMenu selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
                <ChartContainer selectedCountry={selectedCountry}/>
            </div>
        </div>
        
    );
}

export default DefaultView;