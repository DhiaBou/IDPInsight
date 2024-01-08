import "../styles/ChartContainer.css"
import { ChartContainerProps } from "../utils/types";
import { BarChart } from '@mui/x-charts/BarChart';
import {LineChart} from '@mui/x-charts/LineChart';

function ChartContainer({selectedCountry}: ChartContainerProps) {
    return (
        <div className="country-container">
        {selectedCountry.length !== 0 ? (
            <div className="chart-container">
                <div>
                    Total number of IDPs: None
                </div>
                <div>
                    <BarChart
                        xAxis={[
                        {
                            id: 'barCategories',
                            data: ['bar A', 'bar B', 'bar C'],
                            scaleType: 'band',
                        },
                    ]}
                        series={[
                        {
                            data: [2, 5, 3],
                        },
                    ]}
                    width={500}
                    height={300}
                    /> 
                </div>
                <div>
                    <LineChart
                        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                        series={[
                        {
                            data: [2, 5.5, 2, 8.5, 1.5, 5],
                        },
                        ]}
                    width={500}
                    height={300}
                    />
                </div>
            </div>
        ) : (
          <p>Home page</p>
        )}
      </div>
    );
};

export default ChartContainer;