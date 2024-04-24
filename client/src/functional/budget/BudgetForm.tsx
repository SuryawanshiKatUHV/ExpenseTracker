import { useState, useEffect } from "react";
import { END_POINTS, get, post, put } from "../../common/Utilities";

interface Props {
    userId: number;
    saveHandler: () => void;
    cancelHandler: () => void;
    editingBudget?: { BUDGET_ID: number; CATEGORY_ID: number; BUDGET_DATE: Date; BUDGET_AMOUNT: number;}; 
}

const BudgetForm = (props : Props) => {

    const [categories, setCategories] = useState<any[]>([]);
    const [categoryId, setCategoryId] = useState(props.editingBudget?.CATEGORY_ID);
    const [budgetDate, setBudgetDate] = useState(props.editingBudget?.BUDGET_DATE ? new Date(props.editingBudget.BUDGET_DATE) : new Date());
    const [budgetAmount, setBudgetAmount] = useState(props.editingBudget?.BUDGET_AMOUNT);
    const [validationErrors, setValidationErrors] = useState({categoryId: '', budgetDate: '', budgetAmount: ''});
    const [error, setError] = useState('');
    
     // Validate budget input
     const validateInput = () => {
        let isValid = true;
        let validationErrors = {categoryId: '', budgetDate: '', budgetAmount: ''};

        if (!categoryId) {
            validationErrors.categoryId = 'A category is required.';
            isValid = false;
        }
        if (!budgetDate || isNaN(budgetDate.getDate())) {
            validationErrors.budgetDate = 'A valid date is required.';
            isValid = false;
        }
        if (!budgetAmount) {
            validationErrors.budgetAmount = 'Budget Amount is required.';
            isValid = false;
        }

        setValidationErrors(validationErrors);
        return isValid;
    };

    async function loadCategories() {
        try {
            const response = await get(`${END_POINTS.Users}/${props.userId}/categories`);
            setCategories(response);
        } catch (error:any) {
            console.error("Failed to load categories:", error);
            setError(error.message);
        }
    }

    useEffect(() =>{ 
        async function fetchData() {
            await loadCategories();
        }
        fetchData();
    }, []);

    const SaveClicked = async () => {
        console.log("Selected category for budget:", categoryId); 
        
        if (validateInput()) {
            const budgetData = {
                CATEGORY_ID: categoryId,
                BUDGET_DATE: formatDate(budgetDate), 
                BUDGET_AMOUNT: budgetAmount,
                BUDGET_NOTES: "None for now"
            };

            try {
                
                if (props.editingBudget?.BUDGET_ID) {
                    // Update the existing budget
                    await put(`${END_POINTS.Budgets}/${props.editingBudget.BUDGET_ID}`, budgetData);
                    console.log(`Budget updated with id ${props.editingBudget.BUDGET_ID}`);
                } else {
                    // Create a new budget
                    const result = await post(END_POINTS.Budgets, budgetData);
                    console.log(`Budget created with id ${result.BUDGET_ID}`);
                }

                // Call the parents' event handler
                props.saveHandler();
            } 
            catch (error : any) {
                setError(error.message);
            }
        }
    }

    const CancelClicked = () => {
        props.cancelHandler();
    }

    // Formats date into to yyyy/mm/dd 
    const formatDate = (date: Date) => {
        let year = date.getUTCFullYear();
        // Pad month and day with leading zeros if necessary
        let month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        let day = date.getUTCDate().toString().padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    };
    
    return (

        <div  style={{border:1}}>
            <h5 className="m-5">Add Budget</h5>

            <select className="form-select" aria-label="Default select example" style={{ marginBottom: '18px' }} value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} disabled={props.editingBudget ? true : false}>
                <option value="">Select Category</option>
                {categories.map((item, index) => (
                    <option key={index} value={item.CATEGORY_ID}>
                        {item.CATEGORY_TITLE}
                    </option>
                ))}
            </select>
            {validationErrors.categoryId && <p style={{color:'red'}}>{validationErrors.categoryId}</p>}

            <div className="form-floating mb-3">
              <input type="number" className="form-control" id="budgetAmount" value={budgetAmount} onChange={(e) => setBudgetAmount(Number(e.target.value))}/>
              <label htmlFor="budgetAmount">Budget Amount</label>
              {validationErrors.budgetAmount && <p style={{color:'red'}}>{validationErrors.budgetAmount}</p>}
            </div>
    
            <div className="form-floating mb-3">
              <input type="date" className="form-control" id="budgetDate" value={formatDate(budgetDate)} onChange={(e) => setBudgetDate(new Date(e.target.value))}/>
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