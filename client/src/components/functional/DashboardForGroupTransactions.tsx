import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

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
                                    top: 20,
                                    right: 20,
                                    left: 20,
                                    bottom: 20,
                                }}
                                barSize={20}
                                >
                                <XAxis dataKey="name" scale="point" padding={{ left: 50, right: 50 }} angle={30}/>
                                <YAxis />
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="pv" fill="green">
                                    <LabelList dataKey="pv" position="top"/>
                                </Bar>
                            </BarChart>
                        </td>
                        <td>
                            <BarChart
                                width={500}
                                height={300}
                                data={data}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 20,
                                    bottom: 20,
                                }}
                                barSize={20}
                                >
                                <XAxis dataKey="name" scale="point" padding={{ left: 50, right: 50 }} angle={30}/>
                                <YAxis />
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="pv" fill="red">
                                    <LabelList dataKey="pv" position="top"/>
                                </Bar>
                            </BarChart>
                        </td>
                    </tr>
                </tbody>
            </table> 
        </>
    );
}

export default DashboardForGroupTransactions;