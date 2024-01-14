import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatasetComponent from './DatasetComponent';
import { useParams } from 'react-router-dom';
import { ENDPOINTS } from '../utils/apiEndpoints';

const CountryDatasets: React.FC = () => {
  const { country } = useParams();
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedDate, setSelectedDate] = useState(''); // Added state for selected date

  const countryValue = country ?? '';

  const fetchData = async () => {
    try {
      const response = await axios.get(`${ENDPOINTS.datasetsForACountry}/${countryValue}`);
      setDatasets(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerRefresh = async () => {
    try {
      setLoading(true);
      const endpoint = `${ENDPOINTS.triggerRefresh}/${countryValue}/${selectedOrganization}/${selectedDate}`;
      await axios.get(endpoint);
      setLoading(false);
      // After triggering refresh, fetch the updated data
      await fetchData();
    } catch (error) {
      console.error('Error triggering refresh: ', error);
    }
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, [datasets]);

  const handleOrganizationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrganization = event.target.value;
    setSelectedOrganization(newOrganization);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
  };

  return (
    <div>
      <label htmlFor="organization">Choose Organization:</label>
      <select id="organization" value={selectedOrganization} onChange={handleOrganizationChange}>
        <option value="">Select</option>
        <option value="all">All Datasets</option>
        <option value="international-organization-for-migration">International Organization for Migration</option>
        {/* Add other organization options as needed */}
      </select>

      <label htmlFor="date">Select Date:</label>
      <input type="date" id="date" value={selectedDate} onChange={handleDateChange} />

      <button onClick={triggerRefresh} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh Data'}
      </button>
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
  );
};

export default CountryDatasets;
