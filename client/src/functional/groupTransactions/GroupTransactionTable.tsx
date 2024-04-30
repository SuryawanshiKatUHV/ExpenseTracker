import { useEffect, useState } from "react";
import GroupTransactionForm from "./GroupTransactionForm";
import { END_POINTS, del, get } from "../../common/Utilities";
import { TrashFill } from "react-bootstrap-icons";
import { toast } from 'react-toastify';

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
           toast.error(error.message, {position: "top-center", autoClose: false});
        });
    }

    async function SaveClicked() {
        await refresh();
    }

    async function CancelClicked() {
        await refresh();
    }

    async function DeleteClicked(transactionId:number) {
        console.log(`Delete Clicked with transaction id ${transactionId}`);
        // Simple confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to delete?");
        if (isConfirmed) {
            try {
                await del(`${END_POINTS.Transactions}/${transactionId}`);
                console.log("Transaction deleted");
                await refresh();
                toast.success("Transaction deleted successfully", {position: "top-center"})
            } catch (error:any) {
                console.error("Failed to delete the item:", error);
               toast.error("Failed to delete transaction" + error.message, {position: "top-center", autoClose: false})
            }
        } else {
            toast.error("Delete operation cancelled", {position: "top-center", autoClose: false})
        }
    }

    return (<>
        <div className="form-floating mb-3">
            <select className="form-select" id="selectedGroupId" onChange={(e) => setSelectedGroupId(parseInt(e.target.value))} value={selectedGroupId}>
                <option key="0" value="0"></option>
                {groups.map(group => (
                    <option key={group.USER_GROUP_ID} value={group.USER_GROUP_ID}>{group.USER_GROUP_DATE} {group.USER_GROUP_TITLE} ({group.USER_GROUP_DESCRIPTION})</option>
                ))}
            </select>
          <label htmlFor="selectedGroupId">Group</label>
        </div>

        {groups.length == 0 && <p style={{color:'red'}}>No groups found.</p>}

        {/* Show add new button when the form is not shown*/}
        {!formDisplayed && groups.length > 0 && <button className="btn btn-success" onClick={AddNewClicked}>Add New</button>}

        {/* Show the add new form*/}
        {formDisplayed && <GroupTransactionForm userId={props.userId} groupId={selectedGroupId} saveHandler={SaveClicked} cancelHandler={CancelClicked}/>}

        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Total Amount</th>
                    <th scope="col">Notes</th>
                    <th scope="col">Paid By</th>
                    <th scope="col">Paid To</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {groupTransactions.map((item)=> (
                    <tr>
                        <td>{item.TRANSACTION_DATE}</td>
                        <td>${item.TRANSACTION_AMOUNT}</td>
                        <td>{item.TRANSACTION_NOTES}</td>
                        <td>{item.PAID_BY_USER_FULLNAME}</td>
                        <td>{item.PAID_TO_USER_FULLNAME.split(";").map((user:string) =>(<div key={user}>{user}</div>))}</td>
                        <td>
                            {props.userId == item.PAID_BY_USER_ID && <TrashFill onClick={() => DeleteClicked(item.TRANSACTION_ID)} style={{cursor: 'pointer'}}/>}
                        </td>
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

        <small><i>* Negative unsettled due indicates that the member needs to pay to other member.</i></small>
    </>);
}

export default GroupTransactionTable;