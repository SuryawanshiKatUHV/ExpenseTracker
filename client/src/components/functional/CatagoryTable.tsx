import { useEffect, useState } from "react";
import CategoryForm from "./CategoryForm";
import { END_POINTS, get } from "../../Common";


const CategoryTable = () => {

    const [formDisplayed, setFormDisplayed] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState(0);

    useEffect(() =>{ 
        async function fetchData() {
            const categories = await get(END_POINTS.Categories);
            setCategories(categories);

        }
        fetchData();
    }, []);

    const AddNewClicked = () => {
        setFormDisplayed(true);
    }

    const SaveClicked = async (categoryTitle:string, categoryDescription:string) => {
        console.log(`SaveClicked(CategoryTitle:${categoryTitle}, CategoryDescription:${categoryDescription}), OwnerId:${selectedUserId}`);
        //TODO: Do the actual saving

        const r = categories.map(item => item.OWNER_ID);

        const categoryData = {
            OWNER_ID: r[0],
            CATEGORY_TITLE: categoryTitle,
            CATEGORY_DESCRIPTION: categoryDescription
        };

        try {
            const token = localStorage.getItem('login_token');
            const response = await fetch(END_POINTS.Categories, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(categoryData),
              
            });
        
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
        
            // Optionally, fetch categories again to update the list
            // fetchData();
        
          } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
          }

        setFormDisplayed(false);
    }

    const CancelClicked = () => {
        setFormDisplayed(false);
    }


    return (
        <div className="form-floating mb-3">

            <h5>Categories</h5>

            {/* Show add new button when the form is not shown*/}
            {!formDisplayed && <button className="btn btn-success" onClick={AddNewClicked}>Add New</button>}
            {/* Show the add new form*/}
            {formDisplayed && <CategoryForm userId={selectedUserId} saveHandler={SaveClicked} cancelHandler={CancelClicked}/>}
            
            
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

