import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList} from 'recharts';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';


interface Props {
    userId: number;
}

const DashboardForTransactions = ({userId} : Props) => {
     /**
     * Dummy data
     */
     const expenseData = [
        {
            Category: 'Utilities',
            Budget: 700,
            Expense: 100,
        },
        {
            Category: 'Travel',
            Budget: 300,
            Expense: 400,
        },
        {
            Category: 'Education',
            Budget: 1500,
            Expense: 1100,
        },
        {
            Category: 'Food',
            Budget: 500,
            Expense: 450,
        }
      ];

      const incomeData = [
        {
            Category: 'Salary',
            Budget: 2500,
            Income: 2500,
        },
        {
            Category: 'Business',
            Budget: 3000,
            Income: 2500,
        },
        {
            Category: 'Real Estate',
            Budget: 15000,
            Income: 11000,
        }
      ];

    return (
        <>
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
                            <PieChart width={500} height={300}>
                                <Tooltip />
                                <Pie data={incomeData} dataKey="Income" cx="50%" cy="50%" outerRadius={80} fill="green" label/>
                            </PieChart>
                        </td>
                        <td>
                            <PieChart width={500} height={300}>
                                <Tooltip />
                                <Pie data={expenseData} dataKey="Expense" cx="50%" cy="50%" outerRadius={80} fill="red" label/>
                            </PieChart>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <BarChart
                                width={500}
                                height={300}
                                data={incomeData}
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
                                <Bar dataKey="Income" fill="green">
                                    <LabelList dataKey="Income" position="top" />
                                </Bar>
                                <Legend/>
                            </BarChart>
                        </td>
                        <td>
                        <BarChart
                                width={500}
                                height={300}
                                data={expenseData}
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
                                <Bar dataKey="Expense" fill="red">
                                    <LabelList dataKey="Expense" position="top" />
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