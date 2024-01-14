import React, { useState } from 'react'
import { GroupedBarChart, Selector } from './SelectorAndChart'

interface MyGroupedBarChartProps {
   data: { [key: string]: any }[]
}

const aggregateData = (data: { [key: string]: any }[], groupByKey: string, valueKey: string) => {
   const result: { [key: string]: number } = {}

   data.forEach(item => {
      const key = item[groupByKey]
      const value = parseInt(item[valueKey], 10) || 0

      if (result[key]) {
         result[key] += value
      } else {
         result[key] = value
      }
   })

   return Object.entries(result).map(([name, value]) => ({ name, value }))
}

const MyGroupedBarChart: React.FC<MyGroupedBarChartProps> = ({ data }) => {
   const [groupByKey, setGroupByKey] = useState<string>('')
   const [valueKey, setValueKey] = useState<string>('')
   const [processedData, setProcessedData] = useState<any[]>([])
   const maxNumberOfGroupedBars = 100

   const keys = data.length > 0 ? Object.keys(data[0]) : []

   const [showAlert, setShowAlert] = useState<boolean>(true)

   const handleGenerateChart = () => {
      if (groupByKey && valueKey) {
         const newData = aggregateData(data, groupByKey, valueKey)
         setProcessedData(newData)
         if (newData.length > 50) {
            setShowAlert(true)
         }
      }
   }

   const handleCloseAlert = () => {
      setShowAlert(false)
   }

   return (
       <div>
    <div className='row'>
        <div className='col'>
            <Selector
                id='groupBySelect'
                label='Group by:'
                value={groupByKey}
                options={keys}
                onChange={setGroupByKey}
            />
        </div>
        <div className='col'>
            <Selector
                id='valueKeySelect'
                label='Value key:'
                value={valueKey}
                options={keys}
                onChange={setValueKey}
            />
        </div>
        <div className='col d-flex align-items-end'>
            <button
                className='btn btn-primary btn-sm my-4'
                onClick={handleGenerateChart}
                style={{ padding: '12px 15px' }}  // Inline style to increase height
            >
                Generate chart
            </button>
        </div>
    </div>
         {showAlert && processedData.length > maxNumberOfGroupedBars ? (
            <div
               className='alert alert-dismissible alert-danger'
               style={{ position: 'fixed', bottom: '0', right: '0' }}
            >
               <button type='button' className='btn-close' data-bs-dismiss='alert' onClick={handleCloseAlert}></button>
               <strong>Oh snap!</strong> <br />
               Chart can not be rendered. Try choosing other labels.
            </div>
         ) : (
            processedData.length > 0 &&
            processedData.length <= maxNumberOfGroupedBars && <GroupedBarChart data={processedData} />
         )}{' '}
      </div>
   )
}

export default MyGroupedBarChart
