import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList} from 'recharts';
import { PieChart, Pie} from 'recharts';
import { END_POINTS, get } from '../../common/Utilities';


interface Props {
    userId: number;
}

interface YearMonthRange {
    Year:number;
    Month:number;
}

interface TransactionSummary {
    name:string;
    Category: string
    Budget:number;
    Total:number;
}

const DashboardForTransactions = ({userId} : Props) => {
    const [yearMonthRange, setYearMonthRange] = useState<YearMonthRange[]>([]);
    const [selectedYearMonth, setSelectedYearMonth] = useState<YearMonthRange>();
    const [incomeSummary, setIncomeSummary] = useState<TransactionSummary[]>([]);
    const [expenseSummary, setExpenseSummary] = useState<TransactionSummary[]>([]);
   
    useEffect(() =>{ 
        get(`${END_POINTS.Users}/${userId}/transactions/yearMonthRange`)
        .then((data) => {
            setYearMonthRange(data);
            return data;
        })
        .then((data) => {
            if (data && data.length > 0) {
                setSelectedYearMonth(data[0]);
                console.log(`Selected year and month: ${JSON.stringify(selectedYearMonth)}`);
            }
        });
    }, []);

    useEffect(() => {
        fetchData();    
    }, [selectedYearMonth]);

    function fetchData() {
        get(`${END_POINTS.Users}/${userId}/transactions/Expense/${selectedYearMonth?.Year}/${selectedYearMonth?.Month}/summary`)
        .then(data => {
            setExpenseSummary(data);
        });

        get(`${END_POINTS.Users}/${userId}/transactions/Income/${selectedYearMonth?.Year}/${selectedYearMonth?.Month}/summary`)
        .then(data => {
            setIncomeSummary(data);
        });
    }

    /**
     * Parses a string to YearMonthRange object
     * 
     * @param stringYearMonth A string in the format 'yyyy-mm'
     * @returns YearMonthRange object
     */
    function stringToYearMonth(stringYearMonth : string) : YearMonthRange {
        if (!stringToYearMonth) {
            throw new Error(`stringToYearMonth is required.`);
        }
        const tokens = stringYearMonth?stringYearMonth.split("-"):[];
        if (tokens.length != 2) {
            throw new Error(`stringToYearMonth '${stringToYearMonth}' is not in required format of 'yyyy-mm'`)
        }

        return {Year:Number(tokens[0]), Month:Number(tokens[1])};
    }

    return (
        <>
            <div className="form-floating mb-3">
                <select 
                    className="form-select" 
                    id="selectedYearMonth" 
                    style={{ marginBottom: '18px' }} 
                    value={`${selectedYearMonth?.Year}-${selectedYearMonth?.Month}`}
                    onChange={(e) => setSelectedYearMonth(stringToYearMonth(e.target.value))}>
                    {yearMonthRange.map((yearMonth, index) => <option key={index} value={`${yearMonth.Year}-${yearMonth.Month}`}>{`${yearMonth.Year}-${yearMonth.Month}`}</option>)}
                </select>
                <label htmlFor="selectedYearMonth">Year-Month</label>
            </div>

            {yearMonthRange.length == 0 && <p>There are no transactions to show the charts.</p>}

            <table width="100%">
                <thead>
                    <tr>
                        <th>Income</th>
                        <th>Expense</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <PieChart width={400} height={400}>
                                <Pie
                                    dataKey="Total"
                                    isAnimationActive={false}
                                    data={incomeSummary}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="green"
                                    label
                                />
                                <Pie dataKey="Total" data={expenseSummary} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" />
                                <Tooltip />
                            </PieChart>
                        </td>
                        <td>
                            <PieChart width={400} height={400}>
                                <Pie
                                    dataKey="Total"
                                    isAnimationActive={false}
                                    data={expenseSummary}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="red"
                                    label
                                />
                                <Pie dataKey="Total" data={expenseSummary} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" />
                                <Tooltip />
                            </PieChart>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <BarChart
                                width={500}
                                height={300}
                                data={incomeSummary}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 20,
                                    bottom: 20,
                                }}
                                barSize={20}
                                >
                                <XAxis dataKey="Category" scale="point" padding={{ left: 50, right: 50}} angle={30}/>
                                <YAxis />
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="Budget" fill="orange">
                                    <LabelList dataKey="Budget" position="top" />
                                </Bar>
                                <Bar dataKey="Total" fill="green">
                                    <LabelList dataKey="Total" position="top" />
                                </Bar>
                                <Legend/>
                            </BarChart>
                        </td>
                        <td>
                            <BarChart
                                width={500}
                                height={300}
                                data={expenseSummary}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 20,
                                    bottom: 20,
                                }}
                                barSize={20}
                                >
                                <XAxis dataKey="Category" scale="point" padding={{ left: 50, right: 50}} angle={30}/>
                                <YAxis />
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="Budget" fill="orange">
                                    <LabelList dataKey="Budget" position="top" />
                                </Bar>
                                <Bar dataKey="Total" fill="red">
                                    <LabelList dataKey="Total" position="top" />
                                </Bar>
                                <Legend/>
                            </BarChart>
                        </td>
                    </tr>
                </tbody>
            </table> 
        </>
    );
}

export default DashboardForTransactions;