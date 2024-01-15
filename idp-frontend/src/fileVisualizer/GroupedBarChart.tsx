import React from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

interface BarChartProps {
    data: any[]
}

export const GroupedBarChart: React.FC<BarChartProps> = ({data}) => (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <BarChart width={800} height={600} data={data}>
            <CartesianGrid strokeDasharray='3 3'/>
            <XAxis dataKey='name'/>
            <YAxis/>
            <Tooltip/>
            <Legend/>
            <Bar dataKey='value' fill='#8884d8'/>
        </BarChart>
    </div>
);