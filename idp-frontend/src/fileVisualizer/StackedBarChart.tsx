import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { COLORS, BarData } from './utilities';

interface StackedBarChartProps {
    data: BarData[];
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
    const stackKeySet = new Set<string>();
    data.forEach(item => {
        Object.keys(item).forEach(key => {
            if (key !== 'name') {
                stackKeySet.add(key);
            }
        });
    });

    const MAX_STACK_KEYS = 100;
    const stackKeys = Array.from(stackKeySet);

    if (stackKeys.length > MAX_STACK_KEYS) {
        return (
            <div style={{ color: 'red' }}>
                The number of parameters is too high. Please refine your selection.
            </div>
        );
    }

    return (
        <BarChart width={800} height={600} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {stackKeys.map((key, index) => (
                <Bar key={key} dataKey={key} stackId="a" fill={COLORS[index % COLORS.length]} />
            ))}
        </BarChart>
    );
};

export default StackedBarChart;
