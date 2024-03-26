import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
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

     const data02 = [
        {
            name: 'Suryawanshi, Kapil',
            pv: 2400,
        },
        {
          name: 'Odera, Suraj',
          pv: 1398,
        },
        {
          name: 'Ali, Shayan',
          pv: 9800,
        },
        {
          name: 'Sharma, Aaradhana',
          pv: 3908,
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
                                <Pie data={data01} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="green" label/>
                            </PieChart>
                        </td>
                        <td>
                            <PieChart width={500} height={300}>
                                <Pie data={data01} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="red" label/>
                            </PieChart>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <BarChart
                                width={500}
                                height={300}
                                data={data02}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                                barSize={20}
                                >
                                <XAxis dataKey="name" scale="point" padding={{ left: 50, right: 50 }} />
                                <YAxis />
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="pv" fill="orange"/>
                                <Bar dataKey="pv" fill="green"/>
                            </BarChart>
                        </td>
                        <td>
                            <BarChart
                                width={500}
                                height={300}
                                data={data02}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                                barSize={20}
                                >
                                <XAxis dataKey="name" scale="point" padding={{ left: 50, right: 50 }} />
                                <YAxis />
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="pv" fill="orange"/>
                                <Bar dataKey="pv" fill="red"/>
                            </BarChart>
                        </td>
                    </tr>
                </tbody>
            </table> 
        </>
    );
}

export default DashboardForTransactions;