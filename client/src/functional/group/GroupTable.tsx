import { useEffect, useState } from "react";
import GroupForm from "./GroupForm";
import { END_POINTS, get, del } from "../../common/Utilities";
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

interface Props {
    userId: number;
}

const GroupTable = ({userId} : Props) => {

    const [formDisplayed, setFormDisplayed] = useState(false);
    const [editingGroup, setEditingGroup] = useState<any>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [error, setError] = useState('');

    async function loadGroups() {
        try {
            const groups = await get(`${END_POINTS.Users}/${userId}/groups`);
            const groupsWithMembers = await Promise.all(groups.map(async (group: any) => {
                const members = await get(`${END_POINTS.Groups}/${group.USER_GROUP_ID}/members`);
                return { ...group, members };
            }));
            setGroups(groupsWithMembers);
        } catch (error:any) {
            toast.error(`Failed to load groups. ${error.message}`, { autoClose: false});
        }
    }

    useEffect(() =>{ 
        async function fetchData() {
            await loadGroups();
        }
        fetchData();
    }, []);

    const AddNewClicked = () => {
        setEditingGroup(null);
        setFormDisplayed(true);
    }

    const SaveClicked = async () => {
        try {
            await loadGroups(); // Refresh the table
            setFormDisplayed(false);
            setError('');
        } catch (error:any) {
            toast.error(error.message, { autoClose: false});
        }
    };

    const CancelClicked = () => {
        setFormDisplayed(false);
        setEditingGroup(null);
    }

    const EditClicked =  (group: any) => {
        // console.log("Editing Group:", group); 
        setEditingGroup(group);
        setFormDisplayed(true);
    }

    const DeleteClicked = async (groupId: number) => {
        // Simple confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to delete?");
        if (isConfirmed) {
            try {
                await del(`${END_POINTS.Groups}/${groupId}`);
                console.log({groupId});
                toast.success("Group deleted successfully", {position: "top-right"});
                await loadGroups(); // Refresh the list after deleting
            } catch (error:any) {
                toast.error(`Failed to delete group. ${error.message}`, { autoClose: false});
            }
        } else {
            toast.info('Delete operation cancelled.');
        }
    };


    return (
        <div>
            {/* Show add new button when the form is not shown*/}
            {!formDisplayed && <button className="btn btn-success" onClick={AddNewClicked}>Add New</button>}

            {/* Show the add new form*/}
            {formDisplayed && <GroupForm userId={userId} saveHandler={SaveClicked} cancelHandler={CancelClicked} editingGroup={editingGroup}/>}

            {error && <p style={{color:'red'}}>{error}</p>}

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Title</th>
                        <th scope="col">Owner</th>
                        {/* <th scope="col">Settled</th> */}
                        <th scope="col">Members</th>
                        <th scope="col">Description</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((item) => (
                        <tr>
                            <td>{item.USER_GROUP_DATE}</td>
                            <td>{item.USER_GROUP_TITLE} {(item.TOTAL_USER_GROUP_TRANSACTIONS > 0 || item.OWNER_ID !== userId) && <small>*</small>}</td>
                            <td>{item.OWNER_NAME}</td>
                            <td>{item.members.map((member: any) => (
                                <div key={member.MEMBER_ID}>{member.USER_FULLNAME}</div>
                            ))}</td>
                            <td className="descriptionCat">{item.USER_GROUP_DESCRIPTION}</td>
                            <td>
                                <div>
                                    {/* Only owner of the group can edit the group */}
                                    {item.OWNER_ID === userId && <PencilSquare onClick={() => EditClicked(item)} style={{cursor: 'pointer', marginRight: '10px'}} />} {/* Edit icon */}
                                    
                                    {/* Only owner of the group can delete the group. The group which has group transactions cannot be deleted. */}
                                    {(item.TOTAL_USER_GROUP_TRANSACTIONS === 0 && item.OWNER_ID === userId) && <TrashFill onClick={() => DeleteClicked(item.USER_GROUP_ID)} style={{cursor: 'pointer'}}/>} {/* Delete icon */}
                                </div>        
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {groups.length === 0 && <p>No records found.</p>}

            {groups.length > 0 && <small><i>You would see the groups you owned as well as the one you are member of. <br/>* A group having transactions against it OR you are not owner of, cannot be deleted. <br/> * You may only edit the groups which you own.</i></small>}

        </div>

       
    );
}

export default GroupTable;