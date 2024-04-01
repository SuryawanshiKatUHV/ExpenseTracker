import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, PieChart, Pie } from 'recharts';
import { END_POINTS, get } from '../../Common';

interface Props {
    userId: number;
}

const DashboardForGroupTransactions = ({userId} : Props) => {
    const [moneyOwedToMe, setMoneyOwedToMe] = useState<any[]>([]);
    const [moneyINeedToPay, setMoneyINeedToPay] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    // function adjustAmounts() {
    //     const newMoneyOwedToMe = [];
    //     for(let recordMoneyOwedToMe of moneyOwedToMe) {
    //         // {
    //         //     "PAID_BY_USER_FULLNAME": "Suryawanshi, Kapil Satish",
    //         //     "PAID_TO_USER_FULLNAME": "Odera, Suraj",
    //         //     "MONEY_OWED_TO_ME": "435.00"
    //         // }
    //         for (let recordMoneyINeedToPay of moneyINeedToPay) {
    //             // {
    //             //     "PAID_BY_USER_FULLNAME": "Odera, Suraj",
    //             //     "PAID_TO_USER_FULLNAME": "Suryawanshi, Kapil Satish",
    //             //     "MONEY_I_NEED_TO_PAY": "35.00"
    //             // }
    //             if (recordMoneyOwedToMe["PAID_TO_USER_FULLNAME"] === recordMoneyINeedToPay["PAID_BY_USER_FULLNAME"]) {
    //                 recordMoneyOwedToMe["MONEY_OWED_TO_ME"] -= recordMoneyINeedToPay["MONEY_I_NEED_TO_PAY"];
    //                 break;
    //             }
    //         }
    //         newMoneyOwedToMe.push(recordMoneyOwedToMe);
    //     }
    //     console.log(`newMoneyOwedToMe=${newMoneyOwedToMe}`);
    //     setMoneyOwedToMe(newMoneyOwedToMe.filter(r => r["MONEY_OWED_TO_ME"] > 0));


    //     const newMoneyINeedToPay = [];
    //     for (let recordMoneyINeedToPay of moneyINeedToPay) {
    //         // {
    //         //     "PAID_BY_USER_FULLNAME": "Odera, Suraj",
    //         //     "PAID_TO_USER_FULLNAME": "Suryawanshi, Kapil Satish",
    //         //     "MONEY_I_NEED_TO_PAY": "35.00"
    //         // }
    //         for(let recordMoneyOwedToMe of moneyOwedToMe) {
    //         // {
    //         //     "PAID_BY_USER_FULLNAME": "Suryawanshi, Kapil Satish",
    //         //     "PAID_TO_USER_FULLNAME": "Odera, Suraj",
    //         //     "MONEY_OWED_TO_ME": "435.00"
    //         // }
    //             if (recordMoneyINeedToPay["PAID_BY_USER_FULLNAME"] === recordMoneyOwedToMe["PAID_TO_USER_FULLNAME"]) {
    //                 recordMoneyINeedToPay["MONEY_I_NEED_TO_PAY"] -= recordMoneyOwedToMe["MONEY_OWED_TO_ME"];
    //                 break;
    //             }
    //         }
    //         newMoneyINeedToPay.push(recordMoneyINeedToPay);
    //     }
    //     console.log(`newMoneyINeedToPay=${newMoneyINeedToPay}`);
    //     setMoneyINeedToPay(newMoneyINeedToPay.filter(r => r["MONEY_I_NEED_TO_PAY"] > 0));
    // }

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
        .then(() => {
            //adjustAmounts();
        });
    }

    return (
        <>
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