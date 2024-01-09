import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatasetComponent from './DatasetComponent';
import { useParams } from "react-router-dom";
import { ENDPOINTS } from "../apiEndpoints";

const CountryDatasets: React.FC = () => {
  const { country } = useParams();
  const [datasets, setDatasets] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${ENDPOINTS.datasetsForACountry}/${country}`)
      .then(response => {
        setDatasets(response.data);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }, [country]);

  return country  ? (
    <div>
      {datasets.map((dataset: any) => (
        <div key={dataset.id} className="mb-3">
          <DatasetComponent
            datasetFolderName={dataset.dataset_folder_name}
            country={country}
            title={dataset.title}
            description={dataset.notes}
            lastModified={dataset.last_modified}
            id={dataset.id}
            source={dataset.dataset_source}
            fileNames={dataset.csv_files}
          />
        </div>
      ))}
    </div>
  ): <div/>;
};

export default CountryDatasets;