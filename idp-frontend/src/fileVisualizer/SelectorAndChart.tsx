import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'

interface SelectorProps {
   id: string
   label: string
   value: string
   options: string[]
   onChange: (value: string) => void
}

export const Selector: React.FC<SelectorProps> = ({ id, label, value, options, onChange }) => (
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

export const GroupedBarChart: React.FC<BarChartProps> = ({ data }) => (
   <BarChart width={500} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey='value' fill='#8884d8' />
   </BarChart>
)
