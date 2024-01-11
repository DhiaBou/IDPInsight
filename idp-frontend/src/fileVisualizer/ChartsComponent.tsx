import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

interface MyGroupedBarChartProps {
   data: { [key: string]: any }[]
}

const COLORS = [
  '#0088FE', // Blue
  '#FFBB28', // Yellow
  '#00C49F', // Aqua Green
  '#C71585', // MediumVioletRed
  '#FF8042', // Orange
  '#6A5ACD', // SlateBlue
  '#D2691E', // Chocolate
  '#20B2AA', // LightSeaGreen
  '#FF6347', // Tomato
  '#B8860B', // DarkGoldenRod
  '#FF1493', // DeepPink
  '#2E8B57', // SeaGreen
  '#FF4500', // OrangeRed
  '#778899', // LightSlateGray
  '#A52A2A', // Brown
];
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

interface BarData {
    name: string;
    [key: string]: string | number; // Allows the 'name' key to be string, all others must be number
}

const aggregateDataForStackedBarChart = (
    data: any[],
    groupByKey: string,
    valueKey: string,
    stackByKey: string
): BarData[] => {
    const result: { [group: string]: { [stack: string]: number } } = {};

    data.forEach((item) => {
        const groupValue = item[groupByKey];
        const stackValue = item[stackByKey];
        const value = parseInt(item[valueKey], 10) || 0;

        if (!result[groupValue]) {
            result[groupValue] = {};
        }

        if (!result[groupValue][stackValue]) {
            result[groupValue][stackValue] = 0;
        }
        result[groupValue][stackValue] += value;
    });
    return Object.entries(result).map(([name, stacks]): BarData => {
        const barData: BarData = { name };
        for (const stack in stacks) {
            barData[stack] = stacks[stack];
        }
        return barData;
    });
};


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
   <BarChart width={800} height={600} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey='value' fill='#8884d8' />
   </BarChart>
)

const StackedBarChart: React.FC<BarChartProps> = ({ data }) => {
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

interface PieChartProps {
    data: any[];
}

const GroupedPieChart: React.FC<PieChartProps> = ({ data }) => {
    const LABEL_THRESHOLD = 0.02;
    return (
        <PieChart width={1200} height={800}>
            <Pie
                data={data}
                cx={350}
                cy={300}
                labelLine={false}
                label={({ name, percent }) => percent > LABEL_THRESHOLD ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
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


const MyGroupedBarChart: React.FC<MyGroupedBarChartProps> = ({ data }) => {
    const chartTypes = ['GroupedBarChart', 'PieChart', 'StackedBarChart'];
    const [chartType, setChartType] = useState<string>(chartTypes[0]);
    const [stackByKey, setStackByKey] = useState<string>('');
   const [groupByKey, setGroupByKey] = useState<string>('')
   const [valueKey, setValueKey] = useState<string>('')
    const [shouldRenderChart, setShouldRenderChart] = useState<boolean>(false);
   const [errorMessage, setErrorMessage] = useState('');
   const [processedData, setProcessedData] = useState<any[]>([])

   const keys = data.length > 0 ? Object.keys(data[0]) : []

    const handleChartTypeChange = (newChartType: string) => {
        setChartType(newChartType);
        setShouldRenderChart(false); // Reset the render flag when chart type changes
    };
   const handleGenerateChart = () => {
       const MAX_STACKED_BAR_GROUP_ITEMS = 30;
       if (chartType === 'StackedBarChart' && stackByKey) {
           if (groupByKey && valueKey && stackByKey) {
               let newData;
               newData = aggregateDataForStackedBarChart(data, groupByKey, valueKey, stackByKey);
               setProcessedData(newData);
               setShouldRenderChart(true);
               if (newData && newData.length > MAX_STACKED_BAR_GROUP_ITEMS) {
                   setErrorMessage(`Too many group items. Maximum allowed is ${MAX_STACKED_BAR_GROUP_ITEMS}. Please refine your selection.`);
                   setProcessedData([]);
               } else {
                   setProcessedData(newData);
                   setErrorMessage('');
               }
               if (errorMessage) {
                   return (
                       <div style={{ color: 'red' }}>
                           {errorMessage}
                       </div>
                   );
               }
           }
       } else {
           if (groupByKey && valueKey) {
               let newData;
               newData = aggregateData(data, groupByKey, valueKey);
               setProcessedData(newData);
               setShouldRenderChart(true);
           }
       }
   };


   const renderChart = () => {
       if (!shouldRenderChart) return null;
       let chartData = [];

       if (chartType === 'GroupedBarChart') {
           chartData = aggregateData(data, groupByKey, valueKey);
           return <GroupedBarChart data={chartData} />;
       } else if (chartType === 'PieChart') {
           chartData = aggregateData(data, groupByKey, valueKey);
           return <GroupedPieChart data={chartData} />;
       } else if (chartType === 'StackedBarChart' && stackByKey) {
           chartData = aggregateDataForStackedBarChart(data, groupByKey, valueKey, stackByKey);
           return <StackedBarChart data={chartData} />;
       }

       return null;
   };

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
             {chartType === 'StackedBarChart' && (
            <div className='col'>
                <Selector
                    id='stackByKeySelect'
                    label='Stack by:'
                    value={stackByKey}
                    options={keys.filter(key => key !== groupByKey && key !== valueKey)}
                    onChange={setStackByKey}
                />
            </div>
            )}
             <div className='col'>
                <Selector
                    id='chartTypeSelect'
                    label='Chart type:'
                    value={chartType}
                    options={chartTypes}
                    onChange={(value) => handleChartTypeChange(value)}
                />
             </div>
            <div className='col'>
               <button className='btn btn-primary btn-sm my-4' onClick={handleGenerateChart}>
                  Generate Chart
               </button>
            </div>
         </div>
         {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
        {!errorMessage && processedData.length > 0 && renderChart()}
      </div>
   )
}

export default MyGroupedBarChart
