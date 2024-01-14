import React, {useState} from 'react';
import {GroupedBarChart} from './GroupedBarChart';
import {GroupedPieChart} from './GroupedPieChart';
import {StackedBarChart} from './StackedBarChart';
import {aggregateData, aggregateDataForStackedBarChart} from './utilities';

interface ChartGeneratorProps {
    data: { [key: string]: any }[];
}

interface SelectorProps {
    id: string;
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}

const Selector: React.FC<SelectorProps> = ({id, label, value, options, onChange}) => (
    <div className='mb-3' style={{fontSize: '0.8rem'}}>
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
);

const ChartGenerator: React.FC<ChartGeneratorProps> = ({data}) => {
    const chartTypes = ['Bar Chart', 'Pie Chart', 'Stacked Bar Chart'];
    const [chartType, setChartType] = useState<string>(chartTypes[0]);
    const [stackByKey, setStackByKey] = useState<string>('');
    const [groupByKey, setGroupByKey] = useState<string>('')
    const [valueKey, setValueKey] = useState<string>('')
    const [shouldRenderChart, setShouldRenderChart] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [processedData, setProcessedData] = useState<any[]>([])
    const keys = data.length > 0 ? Object.keys(data[0]) : []
    const MAX_STACKED_BAR_GROUP_ITEMS = 50;

    const handleChartTypeChange = (newChartType: string) => {
        setChartType(newChartType);
        setShouldRenderChart(false);
    };

    const handleParameterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
        setter(value);
        setShouldRenderChart(false);
    };
    const handleGenerateChart = () => {
        setErrorMessage('');
        if (chartType === 'Stacked Bar Chart' && stackByKey) {
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
                        <div style={{color: 'red'}}>
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
        if (chartType === 'Grouped Bar Chart') {
            chartData = aggregateData(data, groupByKey, valueKey);
            return <GroupedBarChart data={chartData}/>;
        } else if (chartType === 'Pie Chart') {
            chartData = aggregateData(data, groupByKey, valueKey);
            return <GroupedPieChart data={chartData}/>;
        } else if (chartType === 'Stacked Bar Chart' && stackByKey) {
            chartData = aggregateDataForStackedBarChart(data, groupByKey, valueKey, stackByKey);
            return <StackedBarChart data={chartData}/>;
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
                        onChange={handleParameterChange(setGroupByKey)}
                    />
                </div>
                <div className='col'>
                    <Selector
                        id='valueKeySelect'
                        label='Value key:'
                        value={valueKey}
                        options={keys}
                        onChange={handleParameterChange(setValueKey)}
                    />
                </div>
                {chartType === 'StackedBarChart' && (
                    <div className='col'>
                        <Selector
                            id='stackByKeySelect'
                            label='Stack by:'
                            value={stackByKey}
                            options={keys.filter(key => key !== groupByKey && key !== valueKey)}
                            onChange={handleParameterChange(setStackByKey)}
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
            {errorMessage && <div style={{color: 'red', marginTop: '10px'}}>{errorMessage}</div>}
            {!errorMessage && processedData.length > 0 && renderChart()}
        </div>
    )
};

export default ChartGenerator;


