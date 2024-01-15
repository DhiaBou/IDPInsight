import React, { useEffect, useState } from 'react'
import { Button, Card, Dropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ComposableMap, Geographies, Geography, Graticule, Sphere, ZoomableGroup } from 'react-simple-maps'

// URL to a JSON file containing the geographical features to draw the world map
const geoUrl = './world.json'

// @ts-ignore
type HighlightedWorldMapProps = {
   countryISOs: string[]
}

const MapContainer: React.FC<
   HighlightedWorldMapProps & { selectedCountryId: string; onCountryClick: (countryName: string, id: string) => void }
> = ({ countryISOs, selectedCountryId, onCountryClick }) => (
   <Card>
      {' '}
      <Card.Body>
         <ComposableMap projectionConfig={{ rotate: [0, 0, 0], scale: 145 }} height={400}>
            <ZoomableGroup>
               <Sphere stroke='#E4E5E6' strokeWidth={0.5} fill={'#FEFEFE'} id={''} />
               <Graticule stroke='#E4E5E6' strokeWidth={0.5} />
               <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                     geographies.map(geo => (
                        <Geography
                           key={geo.rsmKey}
                           geography={geo}
                           onClick={() => onCountryClick(geo.properties.name, geo.id)}
                           style={{
                              default: {
                                 fill: countryISOs.includes(geo.id)
                                    ? '#FF5722'
                                    : geo.id === selectedCountryId
                                      ? '#1565c0'
                                      : '#DDD',
                                 outline: 'none'
                              },
                              hover: { fill: '#42a5f5', outline: 'none' },
                              pressed: { fill: '#1565c0', outline: 'none' }
                           }}
                        />
                     ))
                  }
               </Geographies>
            </ZoomableGroup>
         </ComposableMap>{' '}
      </Card.Body>
   </Card>
)

const CountrySelector: React.FC<{ geographies: any[]; selectedCountry: string; onSelect: (eventKey: any) => void }> = ({
   geographies,
   selectedCountry,
   onSelect
}) => (
   <Dropdown onSelect={onSelect} style={{ display: 'inline-block' }}>
      <Dropdown.Toggle variant='outline-primary' id='dropdown-basic' style={{ fontSize: '18px', borderRadius: '5px' }}>
         <i className='fas fa-globe'></i> {selectedCountry || ''}
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ maxHeight: '15em', overflowY: 'auto', borderRadius: '5px' }}>
         {geographies
            .sort((a, b) => a.properties.name.localeCompare(b.properties.name))
            .map(geo => (
               <Dropdown.Item key={geo.id} eventKey={geo.id} style={{ fontSize: '16px' }}>
                  {geo.properties.name}
               </Dropdown.Item>
            ))}
      </Dropdown.Menu>
   </Dropdown>
)

const CountryDetailsButton: React.FC<{ selectedCountry: string; onClick: () => void }> = ({
   selectedCountry,
   onClick
}) => (
   <Button
      variant='primary'
      onClick={onClick}
      style={{
         fontSize: '18px',
         borderRadius: '5px',
         backgroundColor: selectedCountry ? '#007bff' : 'grey',
         pointerEvents: selectedCountry ? 'auto' : 'none',
         opacity: selectedCountry ? 1 : 0.5,
         border: selectedCountry ? '' : '1px solid grey'
      }}
   >
      Details
   </Button>
)

export const WorldMapAndSelector: React.FC<HighlightedWorldMapProps> = ({ countryISOs }) => {
   const navigate = useNavigate()
   const [selectedCountry, setSelectedCountry] = useState<string>('')
   const [selectedCountryId, setSelectedCountryId] = useState<string>('')
   const [geographies, setGeographies] = useState<any[]>([])

   useEffect(() => {
      fetch(geoUrl)
         .then(response => response.json())
         .then(data => setGeographies(data.objects.world.geometries))
         .catch(error => console.error('Error fetching data:', error))
   }, [])

   const handleCountryClick = (countryName: string, id: string) => {
      setSelectedCountry(countryName)
      setSelectedCountryId(id)
   }

   const navigateToCountryDetails = () => {
      navigate(`/${selectedCountryId}`)
   }

   const handleDropdownSelect = (eventKey: any) => {
      const selectedGeo = geographies.find(geo => geo.id === eventKey)
      handleCountryClick(selectedGeo.properties.name, selectedGeo.id)
   }

   return (
      <>
         <div className='mt-3'>
            <h4 style={{ display: 'inline-block', marginRight: '10px', fontSize: '20px' }}>Select a Country:</h4>
            <CountrySelector
               geographies={geographies}
               selectedCountry={selectedCountry}
               onSelect={handleDropdownSelect}
            />
            <div style={{ height: '10px' }} />
            <CountryDetailsButton selectedCountry={selectedCountry} onClick={navigateToCountryDetails} />
         </div>
         <div style={{ height: '10px' }} />
         <MapContainer
            countryISOs={countryISOs}
            selectedCountryId={selectedCountryId}
            onCountryClick={handleCountryClick}
         />
      </>
   )
}
