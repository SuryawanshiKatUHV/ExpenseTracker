import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList} from 'recharts';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';


interface Props {
    userId: number;
}

const DashboardForTransactions = ({userId} : Props) => {
     /**
     * Dummy data
     */
     const data01 = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
      ];

     const expenseData = [
        {
            category: 'Utilities',
            budget: 700,
            expense: 100,
        },
        {
            category: 'Travel',
            budget: 300,
            expense: 400,
        },
        {
            category: 'Education',
            budget: 1500,
            expense: 1100,
        },
        {
            category: 'Food',
            budget: 500,
            expense: 450,
        }
      ];

      const incomeData = [
        {
            category: 'Salary',
            budget: 2500,
            income: 2500,
        },
        {
            category: 'Business',
            budget: 3000,
            income: 2500,
        },
        {
            category: 'Real Estate',
            budget: 15000,
            income: 11000,
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
                                <Pie data={data01} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="green" label/>
                            </PieChart>
                        </td>
                        <td>
                            <PieChart width={500} height={300}>
                                <Tooltip />
                                <Pie data={data01} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="red" label/>
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
                                <XAxis dataKey="category" scale="point" padding={{ left: 50, right: 50}} angle={30}/>
                                <YAxis />
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="budget" fill="orange">
                                    <LabelList dataKey="budget" position="top" />
                                </Bar>
                                <Bar dataKey="income" fill="green">
                                    <LabelList dataKey="income" position="top" />
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
                                <XAxis dataKey="category" scale="point" padding={{ left: 50, right: 50}} angle={30}/>
                                <YAxis />
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="budget" fill="orange">
                                    <LabelList dataKey="budget" position="top" />
                                </Bar>
                                <Bar dataKey="expense" fill="red">
                                    <LabelList dataKey="expense" position="top" />
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