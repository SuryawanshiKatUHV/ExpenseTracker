import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
    userId: number;
}

const DashboardForGroupTransactions = ({userId} : Props) => {
    /**
     * Dummy data
     */
    const data = [
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
                        <th>Receivable to me</th>
                        <th>Payable by me</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <BarChart
                                width={500}
                                height={300}
                                data={data}
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
                                <Bar dataKey="pv" fill="green"/>
                            </BarChart>
                        </td>
                        <td>
                            <BarChart
                                width={500}
                                height={300}
                                data={data}
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
                                <Bar dataKey="pv" fill="red"/>
                            </BarChart>
                        </td>
                    </tr>
                </tbody>
            </table> 
        </>
    );
}

export default DashboardForGroupTransactions;