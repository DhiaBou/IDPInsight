import React from 'react'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import { COLORS } from './utilities'

//the properties for the pie chart
interface PieChartData {
   name: string
   value: number
}

interface PieChartProps {
   data: PieChartData[]
}

// returns a pie chart
export const GroupedPieChart: React.FC<PieChartProps> = ({ data }) => {
   const LABEL_THRESHOLD = 0.02

   return (
      <PieChart width={1200} height={500}>
         <Pie
            data={data}
            cx='50%'
            cy='50%'
            labelLine={false}
            label={({ name, percent }) =>
               percent > LABEL_THRESHOLD ? `${name} (${(percent * 100).toFixed(0)}%)` : null
            }
            outerRadius={200}
            fill='#8884d8'
            dataKey='value'
         >
            {data.map((entry, index) => (
               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
         </Pie>
         <Tooltip />
      </PieChart>
   )
}
