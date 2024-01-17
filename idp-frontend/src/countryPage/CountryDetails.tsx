import React from 'react'
import ReactCountryFlag from 'react-country-flag'
import { useParams } from 'react-router-dom'

const CountryDetails: React.FC = () => {
   const { country } = useParams()
   const getCountryISO2 = require('country-iso-3-to-2')
   const CountryData = require('country-data')

   return (
      <>
         {' '}
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1em' }}>
            <h1>{CountryData.countries[getCountryISO2(country)].name}</h1>
            <ReactCountryFlag
               countryCode={getCountryISO2(country)}
               svg
               style={{
                  width: '8em',
                  height: 'auto'
               }}
            />
         </div>{' '}
         <div style={{ height: '20px' }} />
      </>
   )
}
export default CountryDetails
