export const COLORS = [
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

export const aggregateData = (data: { [key: string]: any }[], groupByKey: string, valueKey: string) => {
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

    return Object.entries(result).map(([name, value]) => ({name, value}))
};

export interface BarData {
    name: string;

    [key: string]: string | number;
}

export const aggregateDataForStackedBarChart = (
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
        const barData: BarData = {name};
        for (const stack in stacks) {
            barData[stack] = stacks[stack];
        }
        return barData;
    });
};
