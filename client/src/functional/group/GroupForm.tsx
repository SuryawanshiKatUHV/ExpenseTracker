import { useState, useEffect } from "react";
import { END_POINTS, get, post, put } from "../../common/Utilities";
import { Display } from "react-bootstrap-icons";

interface Props {
    userId: number;
    saveHandler: () => void;
    cancelHandler: () => void;
    editingGroup?: { USER_GROUP_ID: number; OWNER_ID: number; USER_GROUP_DATE: Date; USER_GROUP_TITLE: string; USER_GROUP_DESCRIPTION: string; USER_GROUP_MEMBERS: Array<String>;}; 
}

const GroupForm = (props:Props) => {

    // State for category input form
    const [groupDate, setGroupDate] = useState(props.editingGroup?.USER_GROUP_DATE ? new Date(props.editingGroup?.USER_GROUP_DATE) : new Date());
    const [groupTitle, setGroupTitle] = useState(props.editingGroup?.USER_GROUP_TITLE);
    const [groupDescription, setGroupDescription] = useState(props.editingGroup?.USER_GROUP_DESCRIPTION);
    const [groupMembers, setGroupMembers] = useState(props.editingGroup?.USER_GROUP_MEMBERS);
    const [groupOwnerId, setGroupOwnerId] = useState(props.editingGroup?.OWNER_ID);
    const [validationErrors, setValidationErrors] = useState({groupDate: '', groupTitle: '', groupDescription: ''});
    const [users, setUsers] = useState<any[]>([]);
    const [checkedState, setCheckedState] = useState(new Array(users.length).fill(false));
    const [error, setError] = useState('');

    // Validate category input
    const validateInput = () => {
      let isValid = true;
      let validationErrors = {groupDate: '', groupTitle: '', groupDescription: '', groupMembers: []};

      if (!groupDate) {
          validationErrors.groupDate = 'Group Date is required.';
          isValid = false;
      }
      if (!groupTitle) {
          validationErrors.groupTitle = 'Group Title is required.';
          isValid = false;
      }
      if (!groupDescription) {
        validationErrors.groupDescription = 'Group Description is required.';
        isValid = false;

    //   if (!groupMembers) {
    //     validationErrors.groupMembers = 'Group member is required.';
    //     isValid = false;
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
        }
    }

    useEffect(() =>{ 
    async function fetchData() {
        await loadUsers();
    }
        fetchData();
    }, []);

    const handleOnChange = (position: number) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
    
        setCheckedState(updatedCheckedState); // Update state
    };

    //code for getting previous checked state
    // useEffect(() => {

            
    //         if (users.length > 0 && props.editingGroup) {
    //             console.log('Editing Group:', props.editingGroup);
    //         console.log('Users List:', users);
    //             const memberIds = props.editingGroup.USER_GROUP_MEMBERS || []; 
    //             const updatedCheckedState = users.map(user => memberIds.includes(user.USER_ID));
    //             setCheckedState(updatedCheckedState);
    //             console.log('Updated Checked State:', updatedCheckedState);
    //         } else {
    //             setCheckedState(new Array(users.length).fill(false));
    //         }
        
    // }, [users, props.editingGroup]); // Depend on both users and editingGroup
    
    
    const SaveClicked = async () => {
        
        const selectedUserIds = users.filter((item, index) => checkedState[index]).map(user => user.USER_ID);
        
    
        if (validateInput()) {
            const groupData = {
                USER_GROUP_DATE: formatDate(groupDate),
                OWNER_ID: props.userId,
                USER_GROUP_TITLE: groupTitle, 
                USER_GROUP_DESCRIPTION: groupDescription,
                USER_GROUP_MEMBERS: selectedUserIds
            };
    
            try {
                if (props.editingGroup?.USER_GROUP_ID) {
                    await put(`${END_POINTS.Groups}/${props.editingGroup.USER_GROUP_ID}`, groupData);
                    console.log(`Budget updated with id ${props.editingGroup.USER_GROUP_ID}`);
                } else {
                    const result = await post(END_POINTS.Groups, groupData);
                    console.log(`Group created with id ${result.USER_GROUP_ID}`);
                }
    
                props.saveHandler();
            } catch (error : any) {
                setError(error.message);
                console.error("Error during save:", error.message);
            }
        }
    };
    

    const CancelClicked = () => {
        props.cancelHandler();
    }


    // Formats date into to yyyy/mm/dd 
    const formatDate = (date: Date) => {
        let year = date.getUTCFullYear();
        // Pad month and day with leading zeros if necessary
        let month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        let day = date.getUTCDate().toString().padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    };


    return (
        <div  style={{border:1}}>
        <h5 className="m-5">Add new group</h5>

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
                <label htmlFor="UserId" style={{textAlign: "left", paddingLeft: "1em"}}>Members</label>
                {users.map((user, index) => (
                    <li key={user.USER_ID} className="list-group-item" style={{ textAlign: "left", height: "3em" }}>
                        <input
                            type="checkbox"
                            className="form-check-input me-1"
                            id={`custom-checkbox-${index}`}
                            name={user.USER_ID}
                            value={user.USER_ID}
                            checked={checkedState[index]}
                            onChange={() => handleOnChange(index)}
                            style={{ height: "1em" }}
                        />
                        <label className="form-check-label" htmlFor={`custom-checkbox-${index}`}>
                            {user.USER_LNAME} {user.USER_FNAME}
                        </label>
                    </li>
                ))}
            </ul>
                
        </div>
            {/* {validationErrors.categoryId && <p style={{color:'red'}}>{validationErrors.categoryId}</p>} */}

        <div>
            <button className="btn btn-success" onClick={SaveClicked}>Save</button> &nbsp; 
            <button className="btn btn-danger" onClick={CancelClicked}>Cancel</button>
        </div>

        {error && <p style={{color:'red'}}>{error}</p>}
    </div>
    );
}

export default GroupForm;