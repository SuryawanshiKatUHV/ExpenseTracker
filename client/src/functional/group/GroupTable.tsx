import { useEffect, useState } from "react";
import GroupForm from "./GroupForm";
import { END_POINTS, get, del } from "../../common/Utilities";
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';

interface Props {
    userId: number;
}

const GroupTable = ({userId} : Props) => {

    const [formDisplayed, setFormDisplayed] = useState(false);
    const [editingGroup, setEditingGroup] = useState<any>([]);
    const [group, setGroup] = useState<any[]>([]);
    const [error, setError] = useState('');

    async function loadGroups() {
        const group = await get(`${END_POINTS.Users}/${userId}/groups`);
        setGroup(group);
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
            console.error("Failed to save:", error);
            setError(error.message);
        }
    };

    const CancelClicked = () => {
        setFormDisplayed(false);
        setEditingGroup(null);
    }

    const EditClicked =  (group: any) => {
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
                console.log("group deleted");
                await loadGroups(); // Refresh the list after deleting
                setError("");
            } catch (error) {
                console.error("Failed to delete the item:", error);
                setError('Failed to delete group'); 
            }
        } else {
            console.log("Delete operation cancelled");
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
                        <th scope="col">Group Title</th>
                        <th scope="col">Group Description</th>
                    </tr>
                </thead>
                <tbody>
                    {group.map((item) => (
                        <tr>
                            <td>{item.USER_GROUP_DATE}</td>
                            <td>{item.USER_GROUP_TITLE}</td>
                            <td className="descriptionCat">{item.USER_GROUP_DESCRIPTION}
                                <div>
                                    <PencilSquare onClick={() => EditClicked(item)} style={{cursor: 'pointer', marginRight: '10px'}} /> {/* Edit icon */}
                                    <TrashFill onClick={() => DeleteClicked(item.USER_GROUP_ID)} style={{cursor: 'pointer'}}/> {/* Delete icon */}
                                </div>        
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>




        </div>

       
    );
}

export default GroupTable;