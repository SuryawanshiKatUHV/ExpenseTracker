import { useEffect, useState } from "react";
import GroupTransactionForm from "./GroupTransactionForm";
import { END_POINTS, get } from "../../Common";

interface Props {
    userId: number;
}

const GroupTransactionTable = ({userId} : Props) => {
    
    /**
     * Dummy data
     */

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

    /**
     * State
     */
    const [formDisplayed, setFormDisplayed] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(0);
    const [groups, setGroups] = useState<any[]>([]);
    const [groupTransactions, setGroupTransactions] = useState<any[]>([]);

    useEffect(() =>{ 
        async function fetchData() {
            const groups = await get(END_POINTS.Groups);
            setGroups(groups);

            // First in the list of group is a selected group
            if (groups && groups.length > 0) {
                setSelectedGroupId(groups[0].USER_GROUP_ID);
            }
        }
        fetchData();
    }, []);

    useEffect(() =>{
        async function fetchGroupTransactions() {
            const groupTransactions = await get(`${END_POINTS.GroupTransactions}?groupId=${selectedGroupId}`);
            setGroupTransactions(groupTransactions);
        }
        fetchGroupTransactions();
    }, [selectedGroupId]);
    

    /**
     * Operations
     */

    /**
     * Event handlers
     */

    const AddNewClicked = () => {
        setFormDisplayed(true);
    }

    const SaveClicked = (txCategoryId:number, txDate:string, txAmount:number, txMembers:number[], txNotes:string) => {
        console.log(`SaveClicked(txCategoryId:${txCategoryId}, txDate:${txDate}, txAmount:${txAmount}, txMembers:${txMembers}, txNotes:${txNotes})`);
        //TODO: Do the actual saving
        setFormDisplayed(false);
    }

    const CancelClicked = () => {
        setFormDisplayed(false);
    }

    return (<>
        {new Date().toISOString()}

        <div className="form-floating mb-3">
            <select className="form-select" id="selectedGroupId" onChange={(e) => setSelectedGroupId(parseInt(e.target.value))} value={selectedGroupId}>
                {groups.map(group => (
                    <option key={group.USER_GROUP_ID} value={group.USER_GROUP_ID}>{group.USER_GROUP_DATE}-{group.USER_GROUP_TITLE}</option>
                ))}
            </select>
          <label htmlFor="selectedGroupId">Group</label>
          <div>
            <b>Group Members:</b>
            {JSON.stringify(groups.filter(group => group.USER_GROUP_ID == selectedGroupId))}
          </div>
        </div>

        {/* Show add new button when the form is not shown*/}
        {!formDisplayed && <button className="btn btn-success" onClick={AddNewClicked}>Add New</button>}

        {/* Show the add new form*/}
        {formDisplayed && <GroupTransactionForm groupId={selectedGroupId} saveHandler={SaveClicked} cancelHandler={CancelClicked}/>}

        <h5>Group transactions</h5>
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Paid By</th>
                    <th scope="col">Paid To</th>
                    <th scope="col">Notes</th>
                </tr>
            </thead>
            <tbody>
                {groupTransactions.map((item)=> (
                    <tr>
                        <td>{item.USER_GROUP_TRANSACTION_DATE}</td>
                        <td>{item.USER_GROUP_TRANSACTION_AMOUNT}</td>
                        <td>{item.PAID_BY_USER_FULLNAME}</td>
                        <td>{item.PAID_TO_USER_FULLNAME}</td>
                        <td>{item.USER_GROUP_TRANSACTION_NOTES}</td>
                    </tr>                
                ))}
            </tbody>
        </table>

        <h5>Settlement Summary (dummy data)</h5>
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