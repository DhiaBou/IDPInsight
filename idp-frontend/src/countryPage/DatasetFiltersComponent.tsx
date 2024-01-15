import React, { useState } from 'react'

interface DatasetFiltersProps {
   onTriggerRefresh: (organization: string, date: string) => void
   loading: boolean
}

const DatasetFiltersComponent: React.FC<DatasetFiltersProps> = ({ onTriggerRefresh, loading }) => {
   const [selectedOrganization, setSelectedOrganization] = useState('')
   const [selectedDate, setSelectedDate] = useState('')
   const organizationOptions = [
      { value: '', label: 'Select' },
      { value: 'international-organization-for-migration', label: 'International Organization for Migration' }
      // Add other organization options as needed
   ]

   const handleOrganizationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newOrganization = event.target.value
      setSelectedOrganization(newOrganization)
   }

   const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = event.target.value
      setSelectedDate(newDate)
   }

   const triggerRefresh = () => {
      onTriggerRefresh(selectedOrganization, selectedDate)
   }

   return (
      <div className='container mt-3'>
         <div className='row'>
            <div className='col-md-4'>
               <label htmlFor='organization' className='form-label'>
                  Choose Organization:
               </label>
               <select
                  id='organization'
                  className='form-select'
                  value={selectedOrganization}
                  onChange={handleOrganizationChange}
               >
                  {organizationOptions.map(option => (
                     <option key={option.value} value={option.value}>
                        {option.label}
                     </option>
                  ))}
               </select>
            </div>
            <div className='col-md-4'>
               <label htmlFor='date' className='form-label'>
                  Select Date:
               </label>
               <input type='date' id='date' className='form-control' value={selectedDate} onChange={handleDateChange} />
            </div>
            <div className='col-md-4'>
               <label className='form-label invisible'>Trigger Refresh:</label>
               <button onClick={triggerRefresh} disabled={loading} className='btn btn-primary'>
                  {loading ? 'Refreshing...' : 'Refresh Data'}
               </button>
            </div>
         </div>
      </div>
   )
}

export default DatasetFiltersComponent
