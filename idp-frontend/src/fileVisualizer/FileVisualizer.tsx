import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { ENDPOINTS } from '../utils/apiEndpoints'
import DatasetOfAFileComponent from './DatasetOfAFileComponent'
import FileDetailsComponent from './FileDetailsComponent'
import CsvVisualizer from './CsvVisualizer'

interface RouteParams {
   dataset: string
   country: string
   file: string
}

const FileVisualizer: React.FC = () => {
   // @ts-ignore
   const { dataset, file, country } = useParams<RouteParams>()
   const [data, setData] = useState<any>(null)

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get(`${ENDPOINTS.datasetsForACountry}/${country}/${dataset}/${file}`)
            setData(response.data)
         } catch (error) {
            console.error('Error fetching data', error)
         }
      }

      fetchData()
   }, [dataset, file, country])

   if (!data) {
      return <div>Loading...</div>
   }

   return (
      <div>
         <DatasetOfAFileComponent
            title={data.dataset_metadata.title}
            description={data.dataset_metadata.notes}
            source={data.dataset_metadata.dataset_source}
            lastModified={data.dataset_metadata.last_modified}
         />
         <div style={{ height: '20px' }} />
         <h5>File: {file}</h5>

         <FileDetailsComponent
            name={data.original_file_metadata.name}
            downloadUrl={data.original_file_metadata.download_url}
            cdvDownloadUrl={data.download_url}
            description={data.original_file_metadata.description}
            lastModified={data.original_file_metadata.last_modified}
         />
         <div style={{ height: '20px' }} />
         <CsvVisualizer url={data.download_url} />
      </div>
   )
}
export default FileVisualizer
