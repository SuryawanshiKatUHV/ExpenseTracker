import { useEffect, useState } from "react";
import CategoryForm from "./CategoryForm";
import { END_POINTS, get, del } from "../../common/Utilities";
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';
// import './category.css';

interface Props {
    userId: number;
}

const CategoryTable = ({userId} : Props) => {

    const [formDisplayed, setFormDisplayed] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [editingCategory, setEditingCategory] = useState<any>([]);
    const [error, setError] = useState('');

    async function loadCategories() {
        const categories = await get(`${END_POINTS.Users}/${userId}/categories`);
        setCategories(categories);
    }

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

    const DeleteClicked = async (categoryId: number) => {
        // Simple confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to delete?");
        if (isConfirmed) {
            try {
                await del(`${END_POINTS.Categories}/${categoryId}`);
                console.log("Item deleted");
                await loadCategories(); // Refresh the list after deleting
                setError("");
            } catch (error) {
                console.error("Failed to delete the item:", error);
                setError('Failed to delete category'); 
            }
        } else {
            console.log("Delete operation cancelled");
        }
    };

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
                        <th scope="col">Category Title</th>
                        <th scope="col">Category Description</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((item) => (
                        <tr>
                            <td>{item.CATEGORY_TITLE}</td>
                            <td className="descriptionCat">{item.CATEGORY_DESCRIPTION}
                                <div>
                                    <PencilSquare onClick={() => EditClicked(item)} style={{cursor: 'pointer', marginRight: '10px'}} /> {/* Edit icon */}
                                    <TrashFill onClick={() => DeleteClicked(item.CATEGORY_ID)} style={{cursor: 'pointer'}}/> {/* Delete icon */}
                                </div>        
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryTable;

