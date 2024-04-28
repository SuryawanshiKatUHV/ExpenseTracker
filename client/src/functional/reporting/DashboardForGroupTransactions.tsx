import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, PieChart, Pie } from 'recharts';
import { END_POINTS, get } from '../../common/Utilities';

interface Props {
    userId: number;
}

const DashboardForGroupTransactions = ({userId} : Props) => {
    const [moneyOwedToMe, setMoneyOwedToMe] = useState<any[]>([]);
    const [moneyINeedToPay, setMoneyINeedToPay] = useState<any[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        get(`${END_POINTS.Users}/${userId}/groupTransactions/moneyOwedToMe`)
        .then(data => {
            setMoneyOwedToMe(data);
        })
        .then(() =>{
            return get(`${END_POINTS.Users}/${userId}/groupTransactions/moneyINeedToPay`);
        })
        .then((data) => {
            setMoneyINeedToPay(data);
        })
        .catch((error) => {
            setError(error.message?error.message:error)
        });
    }

    return (
        <>
            {error && <p style={{color:'red'}}>{error}</p>}
            
            <table width="100%">
                <thead>
                    <tr>
                        <th>Money owed to me</th>
                        <th>Money I need to pay</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <BarChart
                                width={500}
                                height={300}
                                data={moneyOwedToMe}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 20,
                                    bottom: 20,
                                }}
                                barSize={20}
                                >
                                <XAxis dataKey="PAID_TO_USER_FULLNAME" scale="point" padding={{ left: 50, right: 50 }} angle={30}/>
                                <YAxis type="number" domain={['auto', 'auto']}/>
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="MONEY_OWED_TO_ME" fill="green">
                                    <LabelList dataKey="MONEY_OWED_TO_ME" position="top"/>
                                </Bar>
                            </BarChart>
                        </td>
                        <td>
                            <BarChart
                                width={500}
                                height={300}
                                data={moneyINeedToPay}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 20,
                                    bottom: 20,
                                }}
                                barSize={20}
                                >
                                <XAxis dataKey="PAID_BY_USER_FULLNAME" scale="point" padding={{ left: 50, right: 50 }} angle={30}/>
                                <YAxis type="number" domain={['auto', 'auto']}/>
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="MONEY_I_NEED_TO_PAY" fill="red">
                                    <LabelList dataKey="MONEY_I_NEED_TO_PAY" position="top"/>
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