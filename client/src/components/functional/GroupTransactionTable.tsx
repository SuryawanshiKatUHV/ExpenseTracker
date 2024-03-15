interface Props {
    userId: number;
}

const GroupTransactionTable = ({userId}:Props) => {
    const data = [
        {
            USER_GROUP_TRANSACTION_DATE:"2-Mar-2024", 
            USER_GROUP_TRANSACTION_AMOUNT:"$10.00", 
            PAID_BY_USER:"Kapil Suryawanshi", 
            PAID_TO_USER:"Shayan Ali", 
            USER_GROUP_TRANSACTION_NOTES:"Dining out at Taco Bell"
        },
        {
            USER_GROUP_TRANSACTION_DATE:"2-Mar-2024", 
            USER_GROUP_TRANSACTION_AMOUNT:"$10.00", 
            PAID_BY_USER:"Kapil Suryawanshi", 
            PAID_TO_USER:"Aaradhana Sharma", 
            USER_GROUP_TRANSACTION_NOTES:"Dining out at Taco Bell"
        },
        {
            USER_GROUP_TRANSACTION_DATE:"3-Mar-2024", 
            USER_GROUP_TRANSACTION_AMOUNT:"$5.00", 
            PAID_BY_USER:"Aaradhana Sharma", 
            PAID_TO_USER:"Kapil Suryawanshi", 
            USER_GROUP_TRANSACTION_NOTES:"Partial refund of dining out share"
        },
        {
            USER_GROUP_TRANSACTION_DATE:"4-Mar-2024", 
            USER_GROUP_TRANSACTION_AMOUNT:"$10.00", 
            PAID_BY_USER:"Suraj Odera", 
            PAID_TO_USER:"Kapil Suryawanshi", 
            USER_GROUP_TRANSACTION_NOTES:"Refund of dining out share"
        },
        {
            USER_GROUP_TRANSACTION_DATE:"5-Mar-2024", 
            USER_GROUP_TRANSACTION_AMOUNT:"$20.00", 
            PAID_BY_USER:"Shayan Ali", 
            PAID_TO_USER:"Kapil Suryawanshi", 
            USER_GROUP_TRANSACTION_NOTES:"Refund and overpayment of dining out share"
        },
    ];

    const settlementSummary = [
        {
            Member:"Kapil Suryawanshi",
            TotalPaid:"$30.00",
            TotalReceived: "$35.00",
            UnsettledDue:-5.00
        },
        {
            Member:"Shayan Ali",
            TotalPaid:"$20.00",
            TotalReceived: "$10.00",
            UnsettledDue:10.00
        },
        {
            Member:"Aaradhana Sharma",
            TotalPaid:"$5.00",
            TotalReceived: "$10.00",
            UnsettledDue:-5.00
        },
        {
            Member:"Suraj Odera",
            TotalPaid:"$10.00",
            TotalReceived: "$10.00",
            UnsettledDue:0.00
        }
    ];
    return (<>
        <div>
            <b>Group: </b>
            <select>
                <option>2-Mar-24 Movie Night</option>
                <option>5-Dec-23 Trip to San Antonio</option>
                <option>10-Feb-24 Dining out</option>
            </select>
        </div>
        <hr/>
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Paid By</th>
                    <th scope="col">Paid To</th>
                    <th scope="col">Notes</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {data.map((item)=> (
                    <tr>
                        <td>{item.USER_GROUP_TRANSACTION_DATE}</td>
                        <td>{item.USER_GROUP_TRANSACTION_AMOUNT}</td>
                        <td>{item.PAID_BY_USER}</td>
                        <td>{item.PAID_TO_USER}</td>
                        <td>{item.USER_GROUP_TRANSACTION_NOTES}</td>
                        <td><button className="btn btn-link">Edit</button><button className="btn btn-link">Delete</button></td>
                    </tr>                
                ))}
            </tbody>
        </table>
        <button className="btn btn-success">Add New</button>
        <hr/>
        <h5>Settlement Summary</h5>
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Member</th>
                    <th scope="col">Total Paid</th>
                    <th scope="col">Total Received</th>
                    <th scope="col">Unsettled Due</th>
                </tr>
            </thead>
            <tbody>
                {settlementSummary.map((item)=> (
                    <tr>
                        <td>{item.Member}</td>
                        <td>{item.TotalPaid}</td>
                        <td>{item.TotalReceived}</td>
                        <td>{item.UnsettledDue}</td>
                    </tr>                
                ))}
            </tbody>
        </table>
        <i>* Negative unsettled due indicates that the member needs to pay to other member.</i>
    </>);
}

export default GroupTransactionTable;