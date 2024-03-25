import { useEffect, useState } from "react";
import GroupTransactionForm from "./GroupTransactionForm";
import { END_POINTS, get } from "../../Common";

interface Props {
    userId: number;
}

const GroupTransactionTable = (props : Props) => {
    /**
     * State
     */
    const [groups, setGroups] = useState<any[]>([]);    // All the groups this user is member of
    const [selectedGroupId, setSelectedGroupId] = useState(0);  // The selected group from the list for displaying the information
    const [formDisplayed, setFormDisplayed] = useState(false);  // Flag to display the create form
    const [groupTransactions, setGroupTransactions] = useState<any[]>([]);  // All the group transactions from the selected group
    const [settlementSummary, setSettlementSummary] = useState<any[]>([]);  // The settlement summary data for the selected group
    const [error, setError] = useState(''); // Any error captured during the processing

    /**
     * Opertions
     */
    async function loadGroups() {
        await get(`${END_POINTS.Users}/${props.userId}/groups`)
        .then(groups => {
            setGroups(groups);
            // First in the list of group is a selected group
            if (groups && groups.length > 0) {
                setSelectedGroupId(groups[0].USER_GROUP_ID);
                loadTables();
            }
        })
    }

    async function loadGroupTransactions() {
        if (selectedGroupId == 0) {
            setGroupTransactions([]);
        }
        else {
            await get(`${END_POINTS.Groups}/${selectedGroupId}/transactions`)
            .then((groupTransactions) =>{
                setGroupTransactions(groupTransactions);
            });
        }
    }

    async function loadSettlementSummary() {
        if (selectedGroupId == 0) {
            setSettlementSummary([]);
        }
        else {
            await get(`${END_POINTS.Groups}/${selectedGroupId}/settlementSummary`)
            .then((settlementSummary) =>{
                setSettlementSummary(settlementSummary);
            });
        }
        
    }

    async function loadTables() {
        await loadGroupTransactions();
        await loadSettlementSummary();
    }

    useEffect(() =>{ 
        loadGroups();
    }, []);

    useEffect(() =>{
        loadTables();
    }, [groups, selectedGroupId]);
    
    /**
     * Event handlers
     */

    const AddNewClicked = () => {
        setFormDisplayed(true);
    }

    const refresh = async () => { 
        await loadTables() // Refresh the table
        .then(() => {
            setFormDisplayed(false);
        })
        .catch((error) => {
            setError(error.message);
        });
    }

    return (<>
        <div className="form-floating mb-3">
            <select className="form-select" id="selectedGroupId" onChange={(e) => setSelectedGroupId(parseInt(e.target.value))} value={selectedGroupId}>
                <option key="0" value="0">Select group</option>
                {groups.map(group => (
                    <option key={group.USER_GROUP_ID} value={group.USER_GROUP_ID}>{group.USER_GROUP_DATE} {group.USER_GROUP_TITLE} ({group.USER_GROUP_DESCRIPTION})</option>
                ))}
            </select>
          <label htmlFor="selectedGroupId">Group</label>
        </div>

        {/* Show add new button when the form is not shown*/}
        {!formDisplayed && <button className="btn btn-success" onClick={AddNewClicked}>Add New</button>}

        {/* Show the add new form*/}
        {formDisplayed && <GroupTransactionForm userId={props.userId} groupId={selectedGroupId} saveHandler={refresh} cancelHandler={refresh}/>}

        {error && <p style={{color:'red'}}>{error}</p>}

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
                        <td>${item.USER_GROUP_TRANSACTION_AMOUNT}</td>
                        <td>{item.PAID_BY_USER_FULLNAME}</td>
                        <td>{item.PAID_TO_USER_FULLNAME}</td>
                        <td>{item.USER_GROUP_TRANSACTION_NOTES}</td>
                    </tr>                
                ))}
            </tbody>
        </table>

        {groupTransactions.length == 0 && <p>No records found.</p>}

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
                        <td>{item.USER_FULLNAME}</td>
                        <td>${item.TOTAL_AMOUNT_PAID}</td>
                        <td>${item.TOTAL_AMOUNT_RECEIVED}</td>
                        {item.UNSETTLED_DUE < 0 && <td style={{color:'red'}}>${item.UNSETTLED_DUE}</td>}
                        {item.UNSETTLED_DUE == 0 && <td></td>}
                        {item.UNSETTLED_DUE > 0 && <td>${item.UNSETTLED_DUE}</td>}
                    </tr>                
                ))}
            </tbody>
        </table>
        
        {settlementSummary.length == 0 && <p>No records found.</p>}

        <i>* Negative unsettled due indicates that the member needs to pay to other member.</i>
    </>);
}

export default GroupTransactionTable;