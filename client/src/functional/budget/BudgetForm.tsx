import { useEffect, useState } from "react";
import { END_POINTS, get, del } from "../../common/Utilities";

interface Props {
    userId: number;
    saveHandler: () => void;
    cancelHandler: () => void;
}

const BudgetForm = (props :Props) => {

    const [categories, setCategories] = useState<any[]>([]);
    const [budgetDate, setbudgetDate] = useState("");
    const [budgetAmount, setbudgetAmount] = useState("");
    const [validationErrors, setValidationErrors] = useState({budgetAmount: '', budgetDate: ''});
    const [error, setError] = useState('');

     // Validate category input
     const validateInput = () => {
        let isValid = true;
        let validationErrors = {budgetAmount: '', budgetDate: ''};

        if (!budgetAmount) {
            validationErrors.budgetAmount = 'Budget Amount is required.';
            isValid = false;
        }
        if (!budgetDate) {
            validationErrors.budgetDate = 'Date is required.';
            isValid = false;
        }

        setValidationErrors(validationErrors);
        return isValid;
    };

    async function loadCategories() {
        const categories = await get(`${END_POINTS.Users}/${props.userId}/categories`);
        setCategories(categories);
    }

    useEffect(() =>{ 
        async function fetchData() {
            await loadCategories();
        }
        fetchData();
    }, []);

    const CancelClicked = () => {
        props.cancelHandler();
    }

    const SaveClicked = () => {
        if (validateInput()) {
            try {
                //TODO Save the data

                // Call the parents' event handler
                props.saveHandler();
            } 
            catch (error : any) {
                setError(error.message);
            }
        }
    }
    
    return (

        <div  style={{border:1}}>
            <h5 className="m-5">Add Budget</h5>

            <select className="form-select" aria-label="Default select example" style={{ marginBottom: '18px' }}>
                <option selected>Select Category</option>
                {categories.map((item, index) => (
                    <option key={index} value={item.CATEGORY_ID || index}>
                        {item.CATEGORY_TITLE}
                    </option>
                ))}
            </select>

            <div className="form-floating mb-3">
              <input type="number" className="form-control" id="budgetAmount" value={budgetAmount} onChange={(e) => setbudgetAmount(e.target.value)}/>
              <label htmlFor="budgetAmount">Budget Amount</label>
              {validationErrors.budgetAmount && <p style={{color:'red'}}>{validationErrors.budgetAmount}</p>}
            </div>
    
            <div className="form-floating mb-3">
              <input type="date" className="form-control" id="budgetDate" value={budgetDate} onChange={(e) => setbudgetDate(e.target.value)}/>
              <label htmlFor="budgetDate">Date</label>
              {validationErrors.budgetDate && <p style={{color:'red'}}>{validationErrors.budgetDate}</p>}
            </div>

            <div>
                <button className="btn btn-success" onClick={SaveClicked}>Save</button> &nbsp; 
                <button className="btn btn-danger" onClick={CancelClicked}>Cancel</button>
            </div>
            {error && <p style={{color:'red'}}>{error}</p>}
        </div>

    );

}

export default BudgetForm;