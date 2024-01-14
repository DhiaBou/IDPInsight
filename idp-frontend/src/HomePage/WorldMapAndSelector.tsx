import React, { useState } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import { ComposableMap, Geographies, Geography, Graticule, Sphere, ZoomableGroup } from 'react-simple-maps'

import { useNavigate } from 'react-router-dom'

// URL to a JSON file containing the geographical features to draw the world map
const geoUrl = './world.json'

// @ts-ignore
type HighlightedWorldMapProps = {
   countryISOs: string[]
}

export const WorldMapAndSelector: React.FC<HighlightedWorldMapProps> = ({ countryISOs }) => {
   const navigate = useNavigate()

   const [selectedCountry, setSelectedCountry] = useState<string>('')
   const [selectedCountryId, setSelectedCountryId] = useState<string>('')
   const [geographies, setGeographies] = useState<any[]>([])

   const handleCountryClick = (countryName: string, id: string) => {
      setSelectedCountry(countryName)
      setSelectedCountryId(id)
   }
   const navigateToCountryDetails = () => {
      navigate('/${selectedCountryId}')
   }

   const handleDropdownSelect = (eventKey: any) => {
      const selectedGeo = geographies.find(geo => geo.id === eventKey)
      handleCountryClick(selectedGeo.properties.name, selectedGeo.id)
   }

   function SelectCountryComponent() {
      return (
         <div className='mt-3'>
            <h4 style={{ display: 'inline-block', marginRight: '10px', fontSize: '20px' }}>Select a Country:</h4>
            <Dropdown onSelect={handleDropdownSelect} style={{ display: 'inline-block' }}>
               <Dropdown.Toggle
                  variant='outline-primary'
                  id='dropdown-basic'
                  style={{ fontSize: '18px', borderRadius: '5px' }}
               >
                  <i className='fas fa-globe'></i> {selectedCountry || ''}
               </Dropdown.Toggle>

               <Dropdown.Menu style={{ maxHeight: '15em', overflowY: 'auto', borderRadius: '5px' }}>
                  {geographies.map((geo, index) => (
                     <React.Fragment key={geo.id}>
                        <Dropdown.Item eventKey={geo.id} style={{ fontSize: '16px' }}>
                           {geo.properties.name}
                        </Dropdown.Item>
                     </React.Fragment>
                  ))}
               </Dropdown.Menu>
            </Dropdown>{' '}
            <div />
            <Button
        variant='primary'
        onClick={navigateToCountryDetails}
        style={{
            fontSize: '18px',
            borderRadius: '5px',
            backgroundColor: selectedCountry ? '#007bff' : 'grey', // Assuming 'selectedCountry' holds the selected country state
            pointerEvents: selectedCountry ? 'auto' : 'none', // Disables click events when the button is greyed out
            opacity: selectedCountry ? 1 : 0.5 // Makes the button look disabled
        }}
    >
        Details
    </Button>
         </div>
      )
   }
   return (
      <>
         {SelectCountryComponent()}{' '}
         <ComposableMap
            projectionConfig={{
               rotate: [0, 0, 0],
               scale: 150
            }}
            height={400}
         >
            <ZoomableGroup>
               <Sphere stroke='#E4E5E6' strokeWidth={0.5} fill={'#FEFEFE'} id={''} />
               <Graticule stroke='#E4E5E6' strokeWidth={0.5} />

               <Geographies geography={geoUrl}>
                  {({ geographies }) => {
                     setGeographies(geographies)
                     return geographies.map(geo => (
                        <Geography
                           key={geo.rsmKey}
                           geography={geo}
                           onClick={() => handleCountryClick(geo.properties.name, geo.id)}
                           style={{
                              default: {
                                 fill: countryISOs.includes(geo.id)
                                    ? '#FF5722'
                                    : geo.id === selectedCountryId
                                      ? '#1565c0'
                                      : '#DDD', // Use your chosen colors here
                                 outline: 'none'
                              },
                              hover: {
                                 fill: '#42a5f5',
                                 outline: 'none'
                              },
                              pressed: {
                                 fill: '#1565c0',
                                 outline: 'none'
                              }
                           }}
                        />
                     ))
                  }}
               </Geographies>
            </ZoomableGroup>
         </ComposableMap>{' '}
      </>
   )
}
