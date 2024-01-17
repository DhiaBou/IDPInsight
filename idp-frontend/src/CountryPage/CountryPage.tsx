import React from 'react'
import CountryDatasets from './CountryDatasets'
import PipelineTriggerComponent from './PipelineTriggerComponent'
import CountryDetails from './CountryDetails'

const CountryPage: React.FC = () => {
   return (
      <>
         <CountryDetails />
         <PipelineTriggerComponent />
         <CountryDatasets />
      </>
   )
}

export default CountryPage
