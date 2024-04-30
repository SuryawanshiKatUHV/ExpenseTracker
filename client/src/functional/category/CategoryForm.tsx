import { useState } from "react";
import { END_POINTS, post, put } from "../../common/Utilities";
import { toast } from 'react-toastify';

interface Props {
    userId: number;
    saveHandler: () => void;
    cancelHandler: () => void;
    editingCategory?: { CATEGORY_ID: number; CATEGORY_TITLE: string; CATEGORY_DESCRIPTION: string }; 
}

const CategoryForm = (props : Props) => {

    // State for category input form
    const [categoryTitle, setCategoryTitle] = useState(props.editingCategory?.CATEGORY_TITLE);
    const [categoryDescription, setCategoryDescription] = useState(props.editingCategory?.CATEGORY_DESCRIPTION);
    const [validationErrors, setValidationErrors] = useState({categoryTitle: '', categoryDescription: ''});
    const [error, setError] = useState('');

    // Validate category input
    const validateInput = () => {
        let isValid = true;
        let validationErrors = {categoryTitle: '', categoryDescription: ''};

        if (!categoryTitle) {
            toast.error('Category title is required', { autoClose: false})
            isValid = false;
        }
        if (!categoryDescription) {
            toast.error('Category description is required', { autoClose: false})
            isValid = false;
        }

        setValidationErrors(validationErrors);
        return isValid;
    };


    const SaveClicked = async () => {
        if(validateInput()) {

            const categoryData = {
                OWNER_ID: props.userId,
                CATEGORY_TITLE: categoryTitle,
                CATEGORY_DESCRIPTION: categoryDescription
            };
    
            try {

                if (props.editingCategory?.CATEGORY_ID) {
                    // Update the existing category
                    await put(`${END_POINTS.Categories}/${props.editingCategory.CATEGORY_ID}`, categoryData);
                    toast.info(`Category updated with id ${props.editingCategory.CATEGORY_ID}`, {position: "top-right"});
                } else {
                    // Create a new category
                    const result = await post(END_POINTS.Categories, categoryData);
                    toast.success(`Category created with id ${result.CATEGORY_ID}`, {position: "top-right"});
                }

                props.saveHandler();
            } 
            catch (error : any) {
                // setError(error.message);
                toast.error(error.message, { autoClose: false})
            }
        }
    }

    const CancelClicked = () => {
        props.cancelHandler();
    }


    return (
        <>
        <h5 className="m-5">{props.editingCategory?"Edit category":"Add category"}</h5>

        <div className="card" style={{border:1}}>

            <div className="form-floating mb-3">
              <input type="string" className="form-control" id="categoryTitle" value={categoryTitle} onChange={(e) => setCategoryTitle(e.target.value)}/>
              <label htmlFor="categoryTitle">Title</label>
              {/* {validationErrors.categoryTitle && <p style={{color:'red'}}>{validationErrors.categoryTitle}</p>} */}
            </div>
    
            <div className="form-floating mb-3">
              <input type="string" className="form-control" id="categoryDescription" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)}/>
              <label htmlFor="categoryDescription">Description</label>
              {/* {validationErrors.categoryDescription && <p style={{color:'red'}}>{validationErrors.categoryDescription}</p>} */}
            </div>
    
            <div>
                <button className="btn btn-success" onClick={SaveClicked}>Save</button> &nbsp; 
                <button className="btn btn-danger" onClick={CancelClicked}>Cancel</button>
            </div>

            {/* {error && <p style={{color:'red'}}>{error}</p>} */}
        </div>
        </>
    );
};


export default CategoryForm;

