import { useEffect, useState } from "react";
import BudgetForm from "./BudgetForm";
import { END_POINTS, get, del } from "../../common/Utilities";
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

interface Props {
    userId: number;
}

const BudgetTable = ({userId} : Props) => {
    const [formDisplayed, setFormDisplayed] = useState(false);
    const [budgets, setBudgets] = useState<any[]>([]);
    const [editingBudget, setEditingBudget] = useState<any>([]);
    const [error, setError] = useState('');
    
    async function loadBudgets() {
        try {
            const response = await get(`${END_POINTS.Users}/${userId}/budgets`);
            setBudgets(response);
        } catch (error) {
            console.error("Failed to load budgets:", error);
            setError('Failed to load budgets');
            toast.error('Failed to load budget', {position: "top-center", autoClose: false})
        }
    }

    useEffect(() =>{ 
        async function fetchData() {
            await loadBudgets();
        }
        fetchData();
    }, []);

    const AddNewClicked = () => {
        setEditingBudget(null);
        setFormDisplayed(true);
    }

    const SaveClicked = async () => {
        try {
            await loadBudgets(); // Refresh the table
            setFormDisplayed(false);
            setError('');
        } catch (error:any) {
            console.error("Failed to save:", error);
            setError(error.message);
            toast.error(error.message, {position: "top-center", autoClose: false});
        }
    };

    const EditClicked = (budgets: any) => {
        setEditingBudget(budgets);
        setFormDisplayed(true);
    }
    
    const DeleteClicked = async (budgetId: number) => {
        // Simple confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to delete?");
        if (isConfirmed) {
            try {
                await del(`${END_POINTS.Budgets}/${budgetId}`);
                await loadBudgets(); // Refresh the list after deleting
                toast.success("Budget deleted successfully", {position: "top-center"})
            } catch (error:any) {
                console.error("Failed to delete the item:", error);
                setError(error.message);
                toast.error("Failed to delete budget", {position: "top-center", autoClose: false});
                 
            }
        } else {
            toast.error("Delete operation cancelled", {position: "top-center", autoClose: false});
        }
    };

    const CancelClicked = () => {
        setFormDisplayed(false);
        setEditingBudget(null);
    }

    return (
        <div className="form-floating mb-3">
            {/* Show add new button when the form is not shown*/}
            {!formDisplayed && <button className="btn btn-success" onClick={AddNewClicked}>Add New</button>}

            {/* Show the add new form*/}
            {formDisplayed && <BudgetForm userId={userId} saveHandler={SaveClicked} cancelHandler={CancelClicked} editingBudget={editingBudget}/>}

            {error && <p style={{color:'red'}}>{error}</p>}

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Category</th>
                        <th scope="col">Budget</th>
                        <th scope="col">Date</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {budgets.map((item) => (
                        <tr>
                            <td>{item.CATEGORY_TITLE}</td>
                            <td>{item.BUDGET_AMOUNT}</td>
                            <td className="descriptionCat">{item.BUDGET_DATE}</td>
                            <td>
                                <div>
                                    <PencilSquare onClick={() => EditClicked(item)} style={{cursor: 'pointer', marginRight: '10px'}} /> {/* Edit icon */}
                                    <TrashFill onClick={() => DeleteClicked(item.BUDGET_ID)} style={{cursor: 'pointer'}}/>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {budgets.length == 0 && <p>No records found.</p>}
        </div>
    );
}

export default BudgetTable;