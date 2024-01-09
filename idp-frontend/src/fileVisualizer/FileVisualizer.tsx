import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import {ENDPOINTS} from "../apiEndpoints";
import DatasetOfAFileComponent from "./DatasetOfAFileComponent";
import FileDetailsComponent from "./FileDetailsComponent";

const OriginalFileMetadata: React.FC<any> = ({ data }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{data.name}</Card.Title>
        <Card.Text>{data.description}</Card.Text>
        {/* Add more fields as needed */}
      </Card.Body>
    </Card>
  );
};
const DownloadUrl: React.FC<any> = ({ url }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{url}</Card.Title>
      </Card.Body>
    </Card>
  );
};

interface RouteParams {
  dataset: string;
  country: string;
  file: string;
}

const FileVisualizer: React.FC = () => {
  // @ts-ignore
  const { dataset, file, country } = useParams<RouteParams>();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ENDPOINTS.datasetsForACountry}/${country}/${dataset}/${file}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [dataset, file, country]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DatasetOfAFileComponent title={data.dataset_metadata.title} description={data.dataset_metadata.notes} id={data.dataset_metadata.id} source={data.dataset_metadata.dataset_source} lastModified={data.dataset_metadata.last_modified} />
      <h3>File: {file}</h3>

        <FileDetailsComponent name={data.original_file_metadata.name}
                            downloadUrl={data.original_file_metadata.download_url}
                            created={data.original_file_metadata.created}
                            description={data.original_file_metadata.description}
                            id={data.original_file_metadata.id}
                            source={data.original_file_metadata.source}
                            lastModified={data.original_file_metadata.last_modified} />
      <DownloadUrl url={data.download_url} />
    </div>
  );
};
export default FileVisualizer;

