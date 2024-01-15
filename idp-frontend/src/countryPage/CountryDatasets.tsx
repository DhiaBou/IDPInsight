import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DatasetComponent from './DatasetComponent'
import { useParams } from 'react-router-dom'
import { ENDPOINTS } from '../utils/apiEndpoints'
import DatasetFiltersComponent from './DatasetFiltersComponent'

const CountryDatasets: React.FC = () => {
   const { country } = useParams()
   const [datasets, setDatasets] = useState<any[]>([])
   const [loading, setLoading] = useState(false)

   const countryValue = country ?? ''

   const fetchData = async () => {
      try {
         const response = await axios.get(`${ENDPOINTS.datasetsForACountry}/${countryValue}`)
         setDatasets(response.data)
      } catch (error) {
         console.error('Error fetching data: ', error)
      } finally {
         setLoading(false)
      }
   }

   const triggerRefresh = async (organization: string, date: string) => {
      try {
         setLoading(true)
         const endpoint = `${ENDPOINTS.triggerRefresh}/${countryValue}?organization=${organization}&startlastmodified=${date}`
         await axios.get(endpoint)
         setLoading(false)
         // After triggering refresh, fetch the updated data
         await fetchData()
      } catch (error) {
         console.error('Error triggering refresh: ', error)
      }
   }

   useEffect(() => {
      // Fetch data when the component mounts
      fetchData()
   }, [datasets])

   return (
      <div>
         <DatasetFiltersComponent onTriggerRefresh={triggerRefresh} loading={loading} />
         <div style={{ marginTop: '20px' }}></div>
         {loading && <p>Loading...</p>}
         {datasets.map((dataset: any) => (
            <div key={dataset.id} className='mb-3'>
               <DatasetComponent
                  datasetFolderName={dataset.dataset_folder_name}
                  country={countryValue}
                  title={dataset.title}
                  description={dataset.notes}
                  lastModified={dataset.last_modified}
                  source={dataset.dataset_source}
                  processedFiles={dataset.processed_files}
               />
            </div>
         ))}
      </div>
   )
}

export default CountryDatasets
