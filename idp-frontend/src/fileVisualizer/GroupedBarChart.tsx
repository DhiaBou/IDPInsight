import React from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

interface BarChartProps {
    data: any[]
}

export const GroupedBarChart: React.FC<BarChartProps> = ({data}) => (
    <BarChart width={800} height={600} data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
        <CartesianGrid strokeDasharray='3 3'/>
        <XAxis dataKey='name'/>
        <YAxis/>
        <Tooltip/>
        <Legend/>
        <Bar dataKey='value' fill='#8884d8'/>
    </BarChart>
);