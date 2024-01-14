import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { COLORS } from './utilities'; // Import COLORS from utilities

// Define the shape of data items
interface PieChartData {
    name: string;
    value: number;
}

// Define props for the GroupedPieChart component
interface PieChartProps {
    data: PieChartData[]; // Array of data items
}

export const GroupedPieChart: React.FC<PieChartProps> = ({ data }) => {
    const LABEL_THRESHOLD = 0.02; // Threshold for displaying labels

    return (
        <PieChart width={1200} height={800}>
            <Pie
                data={data}
                cx={350}
                cy={300}
                labelLine={false}
                label={({ name, percent }) => percent > LABEL_THRESHOLD ? `${name} (${(percent * 100).toFixed(0)}%)` : null}
                outerRadius={200}
                fill="#8884d8"
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    );
};
