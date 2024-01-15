import React, { useState } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../utils/apiEndpoints'

interface PipelineTriggerComponentProps {
   country: string
}

const PipelineTriggerComponent: React.FC<PipelineTriggerComponentProps> = ({ country }) => {
   const [selectedOrganization, setSelectedOrganization] = useState('')
   const [selectedDate, setSelectedDate] = useState('')
   const [error, setError] = useState(null)
   const [success, setSuccess] = useState(false)
   const [isLoading, setIsLoading] = useState(false)

   const organizationOptions = [
      { value: '', label: 'Select' },
      { value: 'international-organization-for-migration', label: 'International Organization for Migration' }
   ]

   const handleOrganizationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedOrganization(event.target.value)
   }

   const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedDate(event.target.value)
   }

   const triggerRefresh = async () => {
      try {
         setIsLoading(true)
         const endpoint = `${ENDPOINTS.triggerRefresh}/${country}?organization=${selectedOrganization}&startlastmodified=${selectedDate}`
         await axios.get(endpoint)
         setSuccess(true)
         setError(null)
      } catch (error) {
         // @ts-ignore
         setError('Error triggering refresh: ' + error)
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <div className='container my-4'>
         <div className='row g-3'>
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
            <div className='col-md-4 d-flex align-items-end'>
               <button onClick={triggerRefresh} className='btn btn-primary' disabled={isLoading}>
                  {isLoading ? (
                     <>
                        <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
                        {' Loading...'}
                     </>
                  ) : (
                     'Trigger Refresh'
                  )}
               </button>
            </div>
         </div>
         {error && <div className='alert alert-danger mt-3'>{error}</div>}
         {success && <div className='alert alert-success mt-3'>Refresh triggered successfully!</div>}
      </div>
   )
}

export default PipelineTriggerComponent
