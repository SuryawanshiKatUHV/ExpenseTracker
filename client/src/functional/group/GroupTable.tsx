/**
 * Module: GroupTable
 * Description: This module is a React component that displays a table of groups and provides functionality to add, edit, and delete groups.
 */

import { useEffect, useState } from "react";
import GroupForm from "./GroupForm";
import { END_POINTS, get, del } from "../../common/Utilities";
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

/**
 * Interface: Props
 * Description: Defines the shape of the props object passed to the GroupTable component.
 */
interface Props {
    userId: number;
}

/**
 * Component: GroupTable
 * Description: A React component that displays a table of groups and provides functionality to add, edit, and delete groups.
 * Props:
 * - userId: The id of the current user.
 */
const GroupTable = ({userId} : Props) => {

    /**
     * State: formDisplayed
     * Description: A boolean value that determines whether the GroupForm component is displayed.
     */
    const [formDisplayed, setFormDisplayed] = useState(false);

    /**
     * State: editingGroup
     * Description: An object that represents the group currently being edited, or an empty array if no group is being edited.
     */
    const [editingGroup, setEditingGroup] = useState<any>([]);

    /**
     * State: groups
     * Description: An array of group objects, where each group object includes a 'members' property that is an array of member objects.
     */
    const [groups, setGroups] = useState<any[]>([]);

    /**
     * State: error
     * Description: A string that represents any error message that occurs during the component's lifecycle.
     */
    const [error, setError] = useState('');

    /**
     * Function: loadGroups
     * Description: Loads the groups for the current user and sets the 'groups' state.
     */
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

    /**
     * Effect: loadGroups
     * Description: Calls the 'loadGroups' function when the component mounts.
     */
    useEffect(() =>{
        async function fetchData() {
            await loadGroups();
        }
        fetchData();
    }, []);

    /**
     * Function: AddNewClicked
     * Description: Sets the 'editingGroup' state to null and the 'formDisplayed' state to true, which displays the GroupForm component for adding a new group.
     */
    const AddNewClicked = () => {
        setEditingGroup(null);
        setFormDisplayed(true);
    }

    /**
     * Function: SaveClicked
     * Description: Calls the 'loadGroups' function to refresh the table, sets the 'formDisplayed' state to false, and clears any error message.
     */
    const SaveClicked = async () => {
        try {
            await loadGroups(); // Refresh the table
            setFormDisplayed(false);
            setError('');
        } catch (error:any) {
            toast.error(error.message, { autoClose: false});
        }
    };

    /**
     * Function: CancelClicked
     * Description: Sets the 'formDisplayed' state to false and the 'editingGroup' state to null, which hides the GroupForm component.
     */
    const CancelClicked = () => {
        setFormDisplayed(false);
        setEditingGroup(null);
    }

    /**
     * Function: EditClicked
     * Description: Sets the 'editingGroup' state to the group object passed as an argument and the 'formDisplayed' state to true, which displays the GroupForm component for editing the selected group.
     */
    const EditClicked =  (group: any) => {
        setEditingGroup(group);
        setFormDisplayed(true);
    }

    /**
     * Function: DeleteGroupClicked
     * Description: Deletes the group with the specified id and refreshes the group list.
     */
    const DeleteGroupClicked = async (groupId: number) => {
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

    /**
     * Function: LeaveGroupClicked
     * Description: Removes the current user from the specified group and refreshes the group list.
     */
    const LeaveGroupClicked = async (groupId: number, memberId: number) => {
        const isConfirmed = window.confirm("Are you sure you want to leave this group?");
        if (isConfirmed) {
            try {
                await del(`${END_POINTS.Groups}/${groupId}/${memberId}`);
                console.log({groupId});
                console.log({memberId});
                toast.success("You have left the group successfully", {position: "top-right"});
                await loadGroups(); // Refresh the list after deleting
            } catch (error:any) {
                toast.error(`Failed to leave the group. ${error.message}`, { autoClose: false});
            }
        } else {
            toast.info('Delete operation cancelled.');
        }
    };

    /**
     * Render:
     * Description: Renders the GroupTable component, which includes an "Add New" button, the GroupForm component (if 'formDisplayed' is true), an error message (if there is one), a table of groups, and some helper text.
     */
    return (
        <div>
            {/* Show add new button when the form is not shown*/}
            {!formDisplayed && <button className="btn btn-success" onClick={AddNewClicked}>Add New</button>}

            {/* Show the add new form*/}
            {formDisplayed && <GroupForm userId={userId} saveHandler={SaveClicked} cancelHandler={CancelClicked} editingGroup={editingGroup}/>}

            {error && <p style={{color:'red'}}>{error}</p>}

            <table className="table table-hover">
                {/* Table headers */}
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Title</th>
                        <th scope="col">Owner</th>
                        <th scope="col">Members</th>
                        <th scope="col">Description</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                {/* Table body */}
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
                                    {(item.TOTAL_USER_GROUP_TRANSACTIONS === 0 && item.OWNER_ID === userId) && <TrashFill onClick={() => DeleteGroupClicked(item.USER_GROUP_ID)} style={{cursor: 'pointer'}}/>} {/* Delete icon */}
                                    {(item.TOTAL_USER_GROUP_TRANSACTIONS === 0 && item.OWNER_ID !== userId) && <TrashFill onClick={() => LeaveGroupClicked(item.USER_GROUP_ID, userId)} style={{cursor: 'pointer'}}/>} {/* Leave icon */}
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

/**
 * Exports: The GroupTable component.
 */
export default GroupTable;
