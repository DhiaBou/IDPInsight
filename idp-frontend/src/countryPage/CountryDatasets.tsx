import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DatasetComponent from './DatasetComponent'
import { useParams } from 'react-router-dom'
import { ENDPOINTS } from '../utils/apiEndpoints'
import PipelineTriggerComponent from './PipelineTriggerComponent'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const CountryDatasets: React.FC = () => {
   const { country } = useParams()
   const [datasets, setDatasets] = useState<any[]>([])

   const fetchData = () => {
      axios
         .get(`${ENDPOINTS.datasetsForACountry}/${country}`)
         .then(response => {
            setDatasets(response.data)
         })
         .catch(error => {
            console.error('Error fetching data: ', error)
         })
   }

   useEffect(() => {
      fetchData()
   }, [country])

   return (
      <div>
         <div style={{ height: '20px' }} />
         <Card>
            <Card.Body>
               <Card.Title>{'Available Datasets'}</Card.Title>
               <strong>Reload available datasets: </strong>
               <Button onClick={fetchData}>Reload</Button>
               <div style={{ height: '30px' }} />
               {country && Array.isArray(datasets) && (
                  <div>
                     {datasets.map(dataset => (
                        <div key={dataset.id} className='mb-3'>
                           <DatasetComponent
                              datasetFolderName={dataset.dataset_folder_name || 'Unknown'}
                              country={country}
                              title={dataset.title || 'Unknown'}
                              description={dataset.notes || 'Unknown'}
                              lastModified={dataset.last_modified || 'Unknown'}
                              source={dataset.dataset_source || 'Unknown'}
                              processedFiles={dataset.processed_files || 'Unknown'}
                           />
                        </div>
                     ))}
                  </div>
               )}
            </Card.Body>
         </Card>
      </div>
   )
}

export default CountryDatasets
