import { useEffect, useState } from "react";
import CategoryForm from "./CategoryForm";
import { END_POINTS, get, del } from "../../common/Utilities";
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

interface Props {
    userId: number;
}

/**
 * Functional component representing the category table.
 * @param {number} userId - The ID of the user for whom the category table is displayed.
 */
const CategoryTable = ({userId} : Props) => {
    const [formDisplayed, setFormDisplayed] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [editingCategory, setEditingCategory] = useState<any>([]);
    const [error, setError] = useState('');

    async function loadCategories() {
        try {
            const categories = await get(`${END_POINTS.Users}/${userId}/categories`);
            setCategories(categories);
        } catch (error:any) {
            toast.error(error.message, { autoClose: false});
        }
    }

    /**
     * Loads categories when the CategoryTable component mounts.
     */
    useEffect(() =>{ 
        async function fetchData() {
            await loadCategories();
        }
        fetchData();
    }, []);

    const AddNewClicked = () => {
        setEditingCategory(null);
        setFormDisplayed(true);
    }

    const SaveClicked = async () => {
        try {
            await loadCategories(); // Refresh the table
            setFormDisplayed(false);
        } 
        catch (error : any) {
            setError(error.message);
            toast.error(error.message, { autoClose: false});
        }
    }

    const CancelClicked = () => {
        setFormDisplayed(false);
        setEditingCategory(null);
    }

    const EditClicked =  (categories: any) => {
        setEditingCategory(categories);
        setFormDisplayed(true);
    }

        
    /**
     * Event handler for the "Delete" button click.
     * Deletes the specified category and refreshes the table.
     * @param {number} categoryId - The ID of the category to delete.
     */
    const DeleteClicked = async (categoryId: number) => {
        // Simple confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to delete?");
        if (isConfirmed) {
            try {
                await del(`${END_POINTS.Categories}/${categoryId}`);
                await loadCategories(); // Refresh the list after deleting
                toast.success(`Category with id ${categoryId} deleted successfully`, {position: "top-right"});
            } catch (error: any) {
                toast.error(error.message, { autoClose: false});
            }
        } else {
            toast.info("Delete operation cancelled.");
        }
    };

    /**
     * Renders the CategoryTable component.
     * This component displays an add new button when the form is not displayed,
     * and a category form when the form is displayed. It also renders a table to display category data including
     * tile and description, and icons for editing and deleting category entries.
     */
    return (
        <div className="form-floating mb-3">

            {/* Show add new button when the form is not shown*/}
            {!formDisplayed && <button className="btn btn-success" onClick={AddNewClicked}>Add New</button>}

            {/* Show the add new form*/}
            {formDisplayed && <CategoryForm userId={userId} saveHandler={SaveClicked} cancelHandler={CancelClicked} editingCategory={editingCategory}/>}
            
            {error && <p style={{color:'red'}}>{error}</p>}

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((item) => (
                        <tr>
                            <td>{item.CATEGORY_TITLE} {(item.TOTAL_TRANSACTIONS > 0 || item.TOTAL_BUDGETS > 0) && <small>*</small>}</td>
                            <td className="descriptionCat">{item.CATEGORY_DESCRIPTION}</td>
                            <td>
                                <div>
                                    <PencilSquare onClick={() => EditClicked(item)} style={{cursor: 'pointer', marginRight: '10px'}} /> {/* Edit icon */}
                                    {(item.TOTAL_TRANSACTIONS === 0 && item.TOTAL_BUDGETS === 0) && <TrashFill onClick={() => DeleteClicked(item.CATEGORY_ID)} style={{cursor: 'pointer'}}/>} {/* Delete icon */}
                                </div> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {categories.length === 0 && <p>No records found.</p>}
            {categories.length > 0 && <small><i>* A category having transactions and/or budgets define against it, cannot be deleted.</i></small>}
        </div>
    );
};

export default CategoryTable;

