import { useState, useEffect } from "react";
import { END_POINTS, get, post, put, formatDate } from "../../common/Utilities";
import { toast } from 'react-toastify';

interface Props {
    userId: number;
    saveHandler: () => void;
    cancelHandler: () => void;
    editingBudget?: { BUDGET_ID: number; CATEGORY_ID: number; BUDGET_DATE: Date; BUDGET_AMOUNT: number;}; 
}

const BudgetForm = (props : Props) => {
    // Find the first date of the current month
    const currentMonthStart = new Date();
    currentMonthStart.setHours(0, 0, 0, 0);
    currentMonthStart.setDate(1);

    const [categories, setCategories] = useState<any[]>([]);
    const [categoryId, setCategoryId] = useState(props.editingBudget?.CATEGORY_ID);
    const [budgetDate, setBudgetDate] = useState(props.editingBudget?.BUDGET_DATE ? new Date(props.editingBudget.BUDGET_DATE) : currentMonthStart);
    const [budgetAmount, setBudgetAmount] = useState(props.editingBudget?.BUDGET_AMOUNT);
    
     // Validate budget input
     const validateInput = () => {
        let isValid = true;

        if (!categoryId) {
            toast.error('A category is required');
            isValid = false;
        }
        if (!budgetDate || isNaN(budgetDate.getDate())) {
            toast.error('A valid date is required');
            isValid = false;
        }
        if (!budgetAmount) {
            toast.error('Budget Amount is required');
            isValid = false;
        }

        return isValid;
    };

    async function loadCategories() {
        try {
            const response = await get(`${END_POINTS.Users}/${props.userId}/categories`);
            setCategories(response);
        } catch (error:any) {
            console.error("Failed to load categories:", error);
            toast.error(error.message, { autoClose: false});
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
                    toast.success(`Budget updated with id ${props.editingBudget.BUDGET_ID}`, {position: "top-right"});
                } else {
                    // Create a new budget
                    const result = await post(END_POINTS.Budgets, budgetData);
                    toast.success(`Budget created with id ${result.BUDGET_ID}`, {position: "top-right"});
                }

                // Call the parents' event handler
                props.saveHandler();
            } 
            catch (error : any) {
                toast.error(error.message, { autoClose: false});
            }
        }
    }

    const CancelClicked = () => {
        props.cancelHandler();
    }

    /**
     * Converts date string to date object
     * @param dateString Date in format "yyyy-mm-dd"
     * @returns Date object
     */
    const stringToDate = (dateString: string) => {
        const dateTokens : string[] = dateString.split("-");
        const dateWithoutTime = new Date(Number(dateTokens[0]), Number(dateTokens[1]) - 1, 1);
        return dateWithoutTime;
    }
    
    return (
        <>
        <h5 className="m-5">{props.editingBudget?"Edit budget":"Add budget"}</h5>
        <div className="card" style={{border:1}}>

            <div className="form-floating mb-3">
                <select className="form-select" id="txCategoryId" style={{ marginBottom: '18px' }} value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} disabled={props.editingBudget ? true : false}>
                    <option value=""></option>
                    {categories.map((item, index) => (
                        <option key={index} value={item.CATEGORY_ID}>
                            {item.CATEGORY_TITLE}
                        </option>
                    ))}
                </select>
                <label htmlFor="txCategoryId">Category</label>
            </div>

            <div className="form-floating mb-3">
              <input type="number" className="form-control" id="budgetAmount" value={budgetAmount} onChange={(e) => setBudgetAmount(Number(e.target.value))}/>
              <label htmlFor="budgetAmount">Budget Amount</label>
            </div>
    
            <div className="form-floating mb-3">
              <input type="date" className="form-control" id="budgetDate" value={formatDate(budgetDate)} onChange={(e) => setBudgetDate(stringToDate(e.target.value))}/>
              <label htmlFor="budgetDate">Date</label>
              <small><i>* Selecting a date in a month will reset to the first day in a month. You can create only one budget per category per month.</i></small>
            </div>

            <div>
                <button className="btn btn-success" onClick={SaveClicked}>Save</button> &nbsp; 
                <button className="btn btn-danger" onClick={CancelClicked}>Cancel</button>
            </div>
        </div>
        </>
    );
}

export default BudgetForm;