import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../utils/apiEndpoints'
import Card from 'react-bootstrap/Card'
import { useParams } from 'react-router-dom'

function hasTags(tags: any[], requiredTags: any[]) {
   return requiredTags.every(requiredTag => tags.some(tag => tag.display_name === requiredTag))
}

async function findOrganizations(country: string) {
   const query = 'internally displaced persons-idp'
   const filterQuery = `groups:${country}`
   const url = `https://data.humdata.org/api/action/package_search?q=${query}&fq=${filterQuery}&start=0&rows=1000`

   try {
      const response = await fetch(url)
      if (!response.ok) {
         console.error('Network response was not ok')
         return []
      }

      const data = await response.json()
      const datasets = data.result.results
      const requiredTags = ['hxl', 'internally displaced persons-idp']

      const organizations = new Set()

      for (const dataset of datasets) {
         if (hasTags(dataset.tags, requiredTags)) {
            organizations.add(dataset.organization.name)
         }
      }

      let organizationsArray = Array.from(organizations)
      if (organizationsArray.length > 0) {
         organizationsArray = ['all', ...organizationsArray]
      }

      return organizationsArray
   } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
      return []
   }
}

const PipelineTriggerComponent: React.FC = () => {
   const { country } = useParams()

   const [selectedOrganization, setSelectedOrganization] = useState('')
   const [selectedDate, setSelectedDate] = useState('')
   const [error, setError] = useState(null)
   const [success, setSuccess] = useState(false)
   const [isLoading, setIsLoading] = useState(false)

   const [organizations, setOrganizations] = useState([])
   useEffect(() => {
      const loadOrganizations = async () => {
         if (country) {
            const orgs = await findOrganizations(country.toLowerCase())
            // @ts-ignore
            setOrganizations(orgs)
         }
      }

      loadOrganizations()
   }, [country])

   const handleOrganizationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedOrganization(event.target.value)
   }

   const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedDate(event.target.value)
   }

   const triggerRefresh = async () => {
      try {
         setIsLoading(true)
         const organization = selectedOrganization == 'all' ? '' : selectedOrganization
         const endpoint = `${ENDPOINTS.triggerRefresh}/${country}?organization=${organization}&startlastmodified=${selectedDate}`
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
   const dismissError = () => {
      setError(null)
   }

   const dismissSuccess = () => {
      setSuccess(false)
   }

   return (
      <Card style={{ backgroundColor: '#f5f5f5' }}>
         <Card.Body>
            <Card.Title>{'Trigger the pipeline'}</Card.Title>
            <div className='container my-4'>
               <li>
                  Select an <strong>Organization</strong> from the dropdown to fetch the data from.
               </li>
               <li>
                  Choose a <strong>Date</strong> to fetch and process datasets that are newer than the specified date.
               </li>
               <li>
                  Leave the date field or the Organization field <strong>empty</strong> to retrieve all datasets
                  regardless of that parameter.
               </li>
               <br />
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
                        {organizations.map(option => (
                           <option key={option} value={option}>
                              {option}
                           </option>
                        ))}
                     </select>
                  </div>
                  <div className='col-md-4'>
                     <label htmlFor='date' className='form-label'>
                        Select Date:
                     </label>
                     <input
                        type='date'
                        id='date'
                        className='form-control'
                        value={selectedDate}
                        onChange={handleDateChange}
                     />
                  </div>
                  <div className='col-md-4 d-flex align-items-end'>
                     <button onClick={triggerRefresh} className='btn btn-primary' disabled={isLoading}>
                        {isLoading ? (
                           <>
                              <span
                                 className='spinner-border spinner-border-sm'
                                 role='status'
                                 aria-hidden='true'
                              ></span>
                              {' Loading...'}
                           </>
                        ) : (
                           'Trigger Pipeline'
                        )}
                     </button>
                  </div>
               </div>

               {error && (
                  <>
                     <div style={{ height: '20px' }} />
                     <div className='alert alert-dismissible alert-danger'>
                        <button
                           type='button'
                           className='btn-close'
                           data-bs-dismiss='alert'
                           onClick={dismissError}
                        ></button>
                        <a> Error triggering the Pipeline </a>
                     </div>
                  </>
               )}
               {success && (
                  <>
                     <div style={{ height: '20px' }} />
                     <div className='alert alert-dismissible alert-success'>
                        <button
                           type='button'
                           className='btn-close'
                           data-bs-dismiss='alert'
                           onClick={dismissSuccess}
                        ></button>
                        <strong> Refresh triggered successfully! </strong> <br />
                        <a>
                           Please wait a few moments and then reload. If no datasets appeared, try adjusting the date.
                        </a>
                     </div>
                  </>
               )}
            </div>
         </Card.Body>
      </Card>
   )
}

export default PipelineTriggerComponent
