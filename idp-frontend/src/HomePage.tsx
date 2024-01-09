import React, { useEffect, useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { ENDPOINTS } from './apiEndpoints';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Button } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';

// URL to a JSON file containing the geographical features to draw the world map
const geoUrl = "./world.json";

// @ts-ignore
type HighlightedWorldMapProps = {
  countryISOs: string[];
};

type CountryDetailsProps = {
  countryISO: string;
  countryName: string;
};

const SelectCountryComponent: React.FC<CountryDetailsProps> = ({ countryName, countryISO }) => {
    const navigate = useNavigate();
  const navigateToCountryDetails = () => {
    navigate(`/${countryISO}`);
  };


  return (
    <div className="mt-3">
      <h4>Selected Country: {countryName}</h4>
      <Button variant="primary" onClick={navigateToCountryDetails}>details</Button>
    </div>
  );
};

const HighlightedWorldMap: React.FC<HighlightedWorldMapProps> = ({ countryISOs }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  console.log(countryISOs)
  const handleCountryClick = (countryName: string, id: string) => {
    setSelectedCountry(countryName);
    setSelectedCountryId(id);
  };

  return (
    <>
             <SelectCountryComponent countryName={selectedCountry} countryISO = {selectedCountryId} />
      <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleCountryClick(geo.properties.name, geo.id)}
  style={{
    default: {
      fill: countryISOs.includes(geo.id) ?"#FF5722"  : geo.id === selectedCountryId ? "#1565c0" : "#DDD", // Use your chosen colors here
      outline: "none"
    },
    hover: {
      fill: "#42a5f5",
      outline: "none"
    },
    pressed: {
      fill: "#1565c0",
      outline: "none"
    }
  }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </>
  );
};

export const fetchData = async (): Promise<any> => {
  try {
    const response = await fetch(ENDPOINTS.getCountries);
    if (!response.ok) {
      console.error('Network response was not ok');
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return [];
  }
};
const MyComponent = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    getData();
  }, []);
  return (
    <HighlightedWorldMap countryISOs={data} />
  );
};


const HomePage: React.FC = () => {
  return (
    <Container>
      <h1>Welcome to the Main Page</h1>
      <MyComponent/>
    </Container>
  );
};

export default HomePage;
