import { useState, useEffect } from "react";
import { END_POINTS, get, post, put, formatDate } from "../../common/Utilities";
import { Display } from "react-bootstrap-icons";
import { toast } from 'react-toastify';

interface Member {
    USER_GROUP_ID: number,
    MEMBER_ID: number;
    USER_FULLNAME: string;
}

interface Props {
    userId: number;
    saveHandler: () => void;
    cancelHandler: () => void;
    editingGroup?: { USER_GROUP_ID: number; OWNER_ID: number; USER_GROUP_DATE: Date; USER_GROUP_TITLE: string; USER_GROUP_DESCRIPTION: string; members: Member[];}; 
}

const GroupForm = (props:Props) => {

    // State for group input form
    const [groupOwnerId, setGroupOwnerId] = useState(props.editingGroup ? props.editingGroup.OWNER_ID : props.userId);
    const [groupDate, setGroupDate] = useState(props.editingGroup?.USER_GROUP_DATE ? new Date(props.editingGroup?.USER_GROUP_DATE) : new Date());
    const [groupTitle, setGroupTitle] = useState(props.editingGroup?.USER_GROUP_TITLE);
    const [groupDescription, setGroupDescription] = useState(props.editingGroup?.USER_GROUP_DESCRIPTION);
    const [groupMembers, setGroupMembers] = useState(props.editingGroup?.members);
    const [settlementSummary, setSettlementSummary] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [checkedBoxState, setCheckedBoxState] = useState(new Array(users.length).fill(false));
    const [validationErrors, setValidationErrors] = useState({groupDate: '', groupTitle: '', groupDescription: '', groupMembers: ''});
    const [error, setError] = useState('');
    
    // Validate group input
    const validateInput = () => {
        let isValid = true;
        let validationErrors = {groupDate: '', groupTitle: '', groupDescription: '', groupMembers: ''};

        if (!groupDate || isNaN(groupDate.getDate())) {
            toast.error("Group Date is required.", {position: "top-center", autoClose: false});
            isValid = false;
        } 
        else {
            groupDate.setHours(0, 0, 0, 0);
            
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            if (groupDate > currentDate) {
                toast.error("Date must not be in future.", {position: "top-center", autoClose: false});
                isValid = false;
            }
        }
        
        if (!groupTitle) {
            toast.error("Group Title is required", {position: "top-center", autoClose: false});
            isValid = false;
        }
        if (!groupDescription) {
            toast.error("Group Description is required.", {position: "top-center", autoClose: false});
            isValid = false;
        }
        if (checkedBoxState.every(state => !state)) {
            toast.error("Must select at least one member", {position: "top-center", autoClose: false});
            isValid = false;
        } 

        setValidationErrors(validationErrors);
        return isValid;
    };

    async function loadUsers() {
        try {
            const response = await get(`${END_POINTS.Users}`);
            setUsers(response);
        } catch (error:any) {
            console.error("Failed to load users:", error);
            setError(error.message);
            toast.error(error.message, {position: "top-center", autoClose: false});
        }
    }
    
    async function loadSettlementSummary() {
        try {
            if (props.editingGroup?.USER_GROUP_ID) {
                const settlementSummaryData = await get(`${END_POINTS.Groups}/${props.editingGroup?.USER_GROUP_ID}/settlementSummary`);
                setSettlementSummary(settlementSummaryData);
            } else {
                setSettlementSummary([]);
            }
        }
        catch (error:any) {
            console.error("Failed to load settlement summary:", error);
            setError(error.message);
        }
    }

    useEffect(() =>{ 
        async function fetchData() {
            await loadUsers();
            await loadSettlementSummary();
        }
        fetchData();
    }, []);

    // set checkboxes to empty state for creating groups or pre-selected state for editing groups
    useEffect(() => {
        if (groupMembers && users.length > 0) {
            const initialCheckedState = users.map(user =>
                groupMembers.some(member => member.MEMBER_ID === user.USER_ID)
            );
            setCheckedBoxState(initialCheckedState);
        }
        else {
            setCheckedBoxState(new Array(users.length).fill(false));
        }

    }, [groupMembers, users]);

    const handleCheckBoxStates = (position: number) => {
        const updatedCheckedBoxState = checkedBoxState.map((item, index) =>
            index === position ? !item : item
        );
    
        setCheckedBoxState(updatedCheckedBoxState); // Update state
    };
    
    const SaveClicked = async () => {
        const memberIdsList = users.filter((_, index) => checkedBoxState[index]).map(user => user.USER_ID);
    
        if (validateInput()) {
            const groupData = {
                USER_GROUP_DATE: formatDate(groupDate),
                OWNER_ID: groupOwnerId,
                USER_GROUP_TITLE: groupTitle, 
                USER_GROUP_DESCRIPTION: groupDescription,
                USER_GROUP_MEMBERS: memberIdsList
            };
    
            try {
                if (props.editingGroup?.USER_GROUP_ID) {
                    await put(`${END_POINTS.Groups}/${props.editingGroup.USER_GROUP_ID}`, groupData);
                    toast.info(`Group updated with id: ${props.editingGroup.USER_GROUP_ID}`, {position: "top-center"});
                } else {
                    const result = await post(END_POINTS.Groups, groupData);
                    toast.success(`Group created with id: ${result.USER_GROUP_ID}`, {position: "top-center"});
                }
    
                props.saveHandler();
            } catch (error : any) {
                setError(error.message);
                toast.error(error.message, {position: "top-center", autoClose: false});
                console.error("Error during save:", error.message);
            }
        }
    };
    
    const CancelClicked = () => {
        props.cancelHandler();
    }

    return (
        <>
        <h5 className="m-5">{props.editingGroup?"Edit group":"Add group"}</h5>
        <div className="card" style={{border:1}}>

        <div className="form-floating mb-3">
          <input type="date" className="form-control" id="groupDate" value={formatDate(groupDate)} onChange={(e) => setGroupDate(new Date(e.target.value))}/>
          <label htmlFor="groupDate">Date</label>
          {validationErrors.groupDate && <p style={{color:'red'}}>{validationErrors.groupDate}</p>}
        </div>

        <div className="form-floating mb-3">
          <input type="string" className="form-control" id="groupTitle" value={groupTitle} onChange={(e) => setGroupTitle(e.target.value)}/>
          <label htmlFor="groupTitle">Group Title</label>
          {validationErrors.groupTitle && <p style={{color:'red'}}>{validationErrors.groupTitle}</p>}
        </div>

        <div className="form-floating mb-3">
          <input type="string" className="form-control" id="groupDescription" value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)}/>
          <label htmlFor="groupDescription">Group Description</label>
          {validationErrors.groupDescription && <p style={{color:'red'}}>{validationErrors.groupDescription}</p>}
        </div>

        <div className="form-floating mb-3">
            <ul className="list-group">
                <label htmlFor="UserId" style={{ textAlign: "left", paddingLeft: "1em" }}>Members</label>
                {users.map((user, index) => {
                    // Check if the user is the owner
                    const isOwner = user.USER_ID === groupOwnerId;
                    // Check if the user besides owner has pending transactions based on unsettled dues
                    const hasPendingTransactions = settlementSummary.some((summary) => summary.USER_ID === user.USER_ID && parseFloat(summary.UNSETTLED_DUE) !== 0.00);

                    // Render checkbox for members only
                    if (!isOwner) {
                        return (
                            <li key={user.USER_ID} className="list-group-item" style={{ textAlign: "left", height: "3em" }}>
                                <input
                                    type="checkbox"
                                    className="form-check-input me-1"
                                    id={`custom-checkbox-${index}`}
                                    name={user.USER_ID}
                                    value={user.USER_ID}
                                    checked={checkedBoxState[index]}
                                    onChange={() => handleCheckBoxStates(index)}
                                    disabled={hasPendingTransactions}  // cannot deselect/remove members that has group transactions
                                    style={{ height: "1em" }}
                                />
                                <label className="form-check-label" htmlFor={`custom-checkbox-${index}`}>
                                    {user.USER_LNAME} {user.USER_FNAME}
                                </label>
                            </li>
                        );
                    }
                })}
            </ul>
            {validationErrors.groupMembers && <p style={{ color: 'red' }}>{validationErrors.groupMembers}</p>}
        </div>

        <div>
            <button className="btn btn-success" onClick={SaveClicked}>Save</button> &nbsp; 
            <button className="btn btn-danger" onClick={CancelClicked}>Cancel</button>
        </div>

        {error && <p style={{color:'red'}}>{error}</p>}
    </div>
    </>
    );
}

export default GroupForm;