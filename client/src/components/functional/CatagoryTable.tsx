import { useEffect, useState } from "react";
import CategoryForm from "./CategoryForm";
import { END_POINTS, get } from "../../Common";

interface Props {
    userId: number;
}

const CategoryTable = ( {userId} : Props) => {

    const [formDisplayed, setFormDisplayed] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
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
    }

    return (
        <div className="form-floating mb-3">

            {/* Show add new button when the form is not shown*/}
            {!formDisplayed && <button className="btn btn-success" onClick={AddNewClicked}>Add New</button>}

            {/* Show the add new form*/}
            {formDisplayed && <CategoryForm userId={userId} saveHandler={SaveClicked} cancelHandler={CancelClicked}/>}
            
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
                            <td>{item.CATEGORY_DESCRIPTION}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryTable;

