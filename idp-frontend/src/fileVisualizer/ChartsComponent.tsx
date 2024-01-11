import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

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

interface SelectorProps {
   id: string
   label: string
   value: string
   options: string[]
   onChange: (value: string) => void
}

const Selector: React.FC<SelectorProps> = ({ id, label, value, options, onChange }) => (
   <div className='mb-3' style={{ fontSize: '0.8rem' }}>
      <label htmlFor={id} className='form-label'>
         {label}
      </label>
      <select className='form-select' id={id} value={value} onChange={e => onChange(e.target.value)}>
         <option value=''>Select an option</option>
         {options.map(option => (
            <option key={option} value={option}>
               {option}
            </option>
         ))}
      </select>
   </div>
)
interface BarChartProps {
   data: any[]
}

const GroupedBarChart: React.FC<BarChartProps> = ({ data }) => (
   <BarChart width={500} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey='value' fill='#8884d8' />
   </BarChart>
)
const MyGroupedBarChart: React.FC<MyGroupedBarChartProps> = ({ data }) => {
   const [groupByKey, setGroupByKey] = useState<string>('')
   const [valueKey, setValueKey] = useState<string>('')
   const [processedData, setProcessedData] = useState<any[]>([])

   const keys = data.length > 0 ? Object.keys(data[0]) : []

   const handleGenerateChart = () => {
      if (groupByKey && valueKey) {
         const newData = aggregateData(data, groupByKey, valueKey)
         setProcessedData(newData)
      }
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
            <div className='col'>
               <button className='btn btn-primary btn-sm my-4' onClick={handleGenerateChart}>
                  Generate Chart
               </button>
            </div>
         </div>
         {processedData.length > 0 && <GroupedBarChart data={processedData} />}
      </div>
   )
}

export default MyGroupedBarChart
