import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList} from 'recharts';
import { PieChart, Pie} from 'recharts';
import { END_POINTS, get, stringToYearMonth, YearMonthRange } from '../../common/Utilities';

interface Props {
    userId: number;
}

interface TransactionSummary {
    Name: string;
    Category: string;
    Budget: number;
    Total: number;
    Percentage: number;
}

const DashboardForTransactions = ({userId} : Props) => {
    const [yearMonthRange, setYearMonthRange] = useState<YearMonthRange[]>([]);
    const [selectedYearMonth, setSelectedYearMonth] = useState<YearMonthRange>();
    const [incomeSummary, setIncomeSummary] = useState<TransactionSummary[]>([]);
    const [expenseSummary, setExpenseSummary] = useState<TransactionSummary[]>([]);
    const [error, setError] = useState('');
   
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
        })
        .catch((error) => {
            setError(error.message?error.message:error)
        });;
    }, []);

    useEffect(() => {
        fetchData();    
    }, [selectedYearMonth]);

    function fetchData() {
        if (selectedYearMonth) {
            // Fetch both income and expense summaries
            const incomeRequest = get(`${END_POINTS.Users}/${userId}/transactions/Income/${selectedYearMonth.Year}/${selectedYearMonth.Month}/summary`);
            const expenseRequest = get(`${END_POINTS.Users}/${userId}/transactions/Expense/${selectedYearMonth.Year}/${selectedYearMonth.Month}/summary`);
            
            // Wait for both requests to finish and continue to then
            Promise.all([incomeRequest, expenseRequest])
            .then(([incomeData, expenseData]) => {
                // Iterate though list of incomes/expenses, and calculate the categories total amount with the reduce function
                const totalIncome = incomeData.reduce((sum: number, item: TransactionSummary) => sum + item.Total, 0);
                const totalExpense = expenseData.reduce((sum: number, item: TransactionSummary) => sum + item.Total, 0);

                // Set income summary with percentages
                setIncomeSummary(incomeData.map((item: TransactionSummary) => ({
                    // spread operator 
                    ...item,
                    Percentage: item.Total / totalIncome * 100
                })));

                // Set expense summary with percentages
                setExpenseSummary(expenseData.map((item: TransactionSummary) => ({
                    ...item,
                    Percentage: item.Total / totalExpense * 100
                })));
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setError(error.message? error.message: error);
            });
        }
    }

    return (
        <>
            {error && <p style={{color:'red'}}>{error}</p>}
            
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
                            <PieChart width={500} height={400}>
                                <Pie
                                    dataKey="Percentage"
                                    isAnimationActive={false}
                                    data={incomeSummary}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="green"
                                    label={({ Percentage, Category}) => `${Category} ${Percentage.toFixed(2)}%`}
                                />
                                <Pie dataKey="Percentage" data={incomeSummary} cx="50%" cy="50%" innerRadius={50} outerRadius={80} fill="#82CA9D" />
                                <Tooltip formatter={(value, name, props) => [`${props.payload.Category}: ${props.payload.Percentage.toFixed(2)}%`]}/>
                            </PieChart>
                        </td>
                        <td>
                            <PieChart width={500} height={400}>
                                <Pie
                                    dataKey="Percentage"
                                    isAnimationActive={false}
                                    data={expenseSummary}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="red"
                                    label={({ Percentage, Category }) => `${Category} ${Percentage.toFixed(2)}%`}
                                />
                                <Pie dataKey="Percentage" data={expenseSummary} cx="50%" cy="50%" innerRadius={50} outerRadius={80} fill="#FF9999" />
                                <Tooltip formatter={(value, name, props) => [`${props.payload.Category}: ${props.payload.Percentage.toFixed(2)}%`]}/>
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
                                <Tooltip/>
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="Budget" fill="orange">
                                    <LabelList dataKey="Budget" position="top" />
                                </Bar>
                                <Bar dataKey="Total" fill="green" name="Income">
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
                                <Bar dataKey="Total" fill="red" name="Expense">
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