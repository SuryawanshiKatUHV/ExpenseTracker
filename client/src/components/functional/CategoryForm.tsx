import { useEffect, useState } from "react";
import { END_POINTS, get } from "../../Common";

interface Props {
    userId: number;
    saveHandler: (categoryTitle: string, categoryDescription:string) => void;
    cancelHandler: () => void;
}

const CategoryForm = (props : Props) => {

    // State for category input form
    const [categoryTitle, setCategoryTitle] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categories, setCategories] = useState<any>([]);
    const [errors, setErrors] = useState({categoryTitle: '', categoryDescription: ''});
    const [showForm, setShowForm] = useState(false);

    // Validate category input
    const validateInput = () => {
        let isValid = true;
        let errors = {categoryTitle: '', categoryDescription: ''};

        if (!categoryTitle) {
            errors.categoryTitle = 'Category title is required.';
            isValid = false;
        }
        if (!categoryDescription) {
            errors.categoryDescription = 'Category description is required.';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const SaveClicked = () => {
        if(validateInput()) {
            props.saveHandler(categoryTitle, categoryDescription);
        }
    }

    const CancelClicked = () => {
        props.cancelHandler();
    }



    return (
        
        <div style={{border:1}}>
            <h5 className="m-5">Add new group transaction</h5>

            {/* <div className="form-floating mb-3">
              <input type="number" className="form-control" id="UserId" value={userId} onChange={(e) => setUserId(e.target.value)}/>
              <label htmlFor="UserId">Owner Id</label>
              {errors.userId && <p style={{color:'red'}}>{errors.userId}</p>}
            </div> */}
            
            <div className="form-floating mb-3">
              <input type="string" className="form-control" id="categoryTitle" value={categoryTitle} onChange={(e) => setCategoryTitle(e.target.value)}/>
              <label htmlFor="categoryTitle">Category Title</label>
              {errors.categoryTitle && <p style={{color:'red'}}>{errors.categoryTitle}</p>}
            </div>
    
            <div className="form-floating mb-3">
              <input type="string" className="form-control" id="categoryDescription" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)}/>
              <label htmlFor="categoryDescription">Category Description</label>
              {errors.categoryDescription && <p style={{color:'red'}}>{errors.categoryDescription}</p>}
            </div>
    

    
            <div>
                <button className="btn btn-success" onClick={SaveClicked}>Save</button> &nbsp; 
                <button className="btn btn-danger" onClick={CancelClicked}>Cancel</button>
            </div>
        </div>
        );
};


export default CategoryForm;

