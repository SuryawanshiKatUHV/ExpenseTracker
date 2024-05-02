import { useState, useEffect } from "react";
import { END_POINTS, get, post, put, formatDate, stringToDate } from "../../common/Utilities";
import { Modal } from 'react-bootstrap';
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

/**
 * Renders a form for adding or editing a group.
 * @param {Props} props - The component props.
 * @returns {JSX.Element} A JSX element representing the GroupForm component.
 */
const GroupForm = (props:Props) => {
    const [groupOwnerId, setGroupOwnerId] = useState(props.editingGroup ? props.editingGroup.OWNER_ID : props.userId);
    const [groupDate, setGroupDate] = useState(props.editingGroup?.USER_GROUP_DATE ? new Date(props.editingGroup?.USER_GROUP_DATE) : new Date());
    const [groupTitle, setGroupTitle] = useState(props.editingGroup?.USER_GROUP_TITLE);
    const [groupDescription, setGroupDescription] = useState(props.editingGroup?.USER_GROUP_DESCRIPTION);
    const [groupMembers, setGroupMembers] = useState(props.editingGroup?.members);
    const [activeMembers, setActiveMembers] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [checkedBoxState, setCheckedBoxState] = useState(new Array(users.length).fill(false));
    
    /**
     * Validate group input.
     */
    const validateInput = () => {
        let isValid = true;

        if (!groupDate || isNaN(groupDate.getDate())) {
            toast.error("Group Date is required.");
            isValid = false;
        } 
        else {
            groupDate.setHours(0, 0, 0, 0);
            
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            if (groupDate > currentDate) {
                toast.error("Date must not be in future.");
                isValid = false;
            }
        }
        
        if (!groupTitle) {
            toast.error("Group Title is required");
            isValid = false;
        }
        if (!groupDescription) {
            toast.error("Group Description is required.");
            isValid = false;
        }
        if (checkedBoxState.every(state => !state)) {
            toast.error("Must select at least one member");
            isValid = false;
        } 

        return isValid;
    };

    async function loadUsers() {
        try {
            const response = await get(`${END_POINTS.Users}`);
            setUsers(response);
        } catch (error:any) {
            console.error("Failed to load users:", error);
            toast.error(error.message, { autoClose: false});
        }
    }

    /**
     * Retrieve active members with group transactions from either ends.
     */
    async function loadActiveMembers() {
        try {
            if (props.editingGroup?.USER_GROUP_ID) {
                const activeMembersData = await get(`${END_POINTS.Groups}/${props.editingGroup?.USER_GROUP_ID}/activeMembers`);
                setActiveMembers(activeMembersData);
            } else {
                setActiveMembers([]);
            }
        }
        catch (error:any) {
            toast.error(error.message, { autoClose: false});
        }
    }

    
    /**
     * In the beginning, load the initial data
     */
    useEffect(() =>{ 
        async function fetchData() {
            await loadUsers();
            await loadActiveMembers();
        }
        fetchData();
    }, []);

    /**
     *  Set checkboxes to empty state for creating groups or pre-selected state for editing groups
     */
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

    /**
     * handleCheckBoxStates function updates the checked state of checkboxes for group members.
     */
    const handleCheckBoxStates = (position: number) => {
        const updatedCheckedBoxState = checkedBoxState.map((item, index) =>
            index === position ? !item : item
        );
    
        setCheckedBoxState(updatedCheckedBoxState); // Update state
    };
    
    /**
     * Handles the save action for the group form.
     */
    const SaveClicked = async () => {
        // Filter the list of users based on the checked state of checkboxes, then map to retrieve the IDs of selected users.
        const memberIdsList = users.filter((_, index) => checkedBoxState[index]).map(user => user.USER_ID);
                
        // Validates input, sends a request to save or update the group
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
                    // Update the existing group
                    await put(`${END_POINTS.Groups}/${props.editingGroup.USER_GROUP_ID}`, groupData);
                    toast.info(`Group updated with id: ${props.editingGroup.USER_GROUP_ID}`, {position: "top-right"});
                } else {
                    // Create a new group
                    const result = await post(END_POINTS.Groups, groupData);
                    toast.success(`Group created with id: ${result.USER_GROUP_ID}`, {position: "top-right"});
                }
                
                // Call the parents' event handler
                props.saveHandler();
            } catch (error : any) {
                toast.error(error.message, { autoClose: false});
            }
        }
    };
    
    const CancelClicked = () => {
        props.cancelHandler();
    }

    /**
     * Renders the GroupForm component.
     * This component displays a form for adding or editing a group.
     * The form includes fields for date, title, description, and list of members to select.
     */
    return (
        <>
            <Modal show={true}>
                <Modal.Header>
                    <Modal.Title>{props.editingGroup?"Edit group":"Add group"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-floating mb-3">
                        <input type="date" className="form-control" id="groupDate" value={formatDate(groupDate)} onChange={(e) => setGroupDate(stringToDate(e.target.value))}/>
                        <label htmlFor="groupDate">Date</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="string" className="form-control" id="groupTitle" value={groupTitle} onChange={(e) => setGroupTitle(e.target.value)}/>
                        <label htmlFor="groupTitle">Group Title</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="string" className="form-control" id="groupDescription" value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)}/>
                        <label htmlFor="groupDescription">Group Description</label>
                    </div>

                    <div className="form-floating mb-3">
                        <ul className="list-group">
                            <label htmlFor="UserId" style={{ textAlign: "left", paddingLeft: "1em" }}>Members</label>
                            {users.map((user, index) => {
                                // Check if the user is the owner
                                const isOwner = user.USER_ID === groupOwnerId;
                                const hasPaidToTransactions = activeMembers.some((member) => member.PAID_TO_USER_ID === user.USER_ID);
                                const hasPaidByTransactions = activeMembers.some((member) => member.PAID_BY_USER_ID === user.USER_ID);

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
                                                disabled={hasPaidToTransactions || hasPaidByTransactions}  // cannot deselect/remove members that has group transactions
                                                style={{ height: "1em" }}
                                            />
                                            <label className="form-check-label" htmlFor={`custom-checkbox-${index}`}>
                                                {user.USER_LNAME}, {user.USER_FNAME} {(hasPaidToTransactions || hasPaidByTransactions) && <small>*</small>}
                                            </label>
                                        </li>
                                    );
                                }
                            })}
                        </ul>

                        {props.editingGroup && <small><i>* Members involved in group transactions cannot be removed from the group.</i></small>}
                    </div>    
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-success" onClick={SaveClicked}>Save</button> &nbsp; 
                    <button className="btn btn-danger" onClick={CancelClicked}>Cancel</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default GroupForm;