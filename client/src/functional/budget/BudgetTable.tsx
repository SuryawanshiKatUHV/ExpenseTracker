import { useEffect, useState } from "react";
import BudgetForm from "./BudgetForm";
import { END_POINTS, get, del, YearMonthRange, stringToYearMonth } from "../../common/Utilities";
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

interface Props {
    userId: number;
}

const BudgetTable = ({userId} : Props) => {
    const [yearMonthRange, setYearMonthRange] = useState<YearMonthRange[]>([]);
    const [selectedYearMonth, setSelectedYearMonth] = useState<YearMonthRange>(defaultYearMonth());

    const [formDisplayed, setFormDisplayed] = useState(false);
    const [budgets, setBudgets] = useState<any[]>([]);
    const [editingBudget, setEditingBudget] = useState<any>([]);
    
    function defaultYearMonth() : YearMonthRange {
        let currentDate = new Date();
        let yearMonth:YearMonthRange = {Year:currentDate.getFullYear(), Month:currentDate.getMonth()+1};
        return yearMonth;
    }
    async function loadYearMonthRange() {
        try {
            const yearMonthRange = await get(`${END_POINTS.Users}/${userId}/budgets/yearMonthRange`);
            setYearMonthRange(yearMonthRange);
            if (yearMonthRange && yearMonthRange.length > 0) {
                setSelectedYearMonth(yearMonthRange[0]);
            }
        } catch (error:any) {
            toast.error(`Failed to load Year-Month range. ${error.message}`, { autoClose: false});
        }
    }

    async function loadBudgets() {
        try {
            const response = await get(`${END_POINTS.Users}/${userId}/budgets/${selectedYearMonth?.Year}/${selectedYearMonth?.Month}`);
            setBudgets(response);
        } catch (error:any) {
            toast.error(`Failed to load budget. ${error.message}`, { autoClose: false})
        }
    }

    async function refresh() {
        await loadYearMonthRange();
        await loadBudgets();
    }

    /**
     * In the begining load the initial view
     */
    useEffect(() =>{ 
        async function fetchData() {
            await refresh();
        }
        fetchData();
    }, []);

    /**
     * When the Year-Month selection changes then reload the budgets
     */
    useEffect(() =>{ 
        async function fetchData() {
            await loadBudgets();
        }
        fetchData();
    }, [selectedYearMonth]);

    const AddNewClicked = () => {
        setEditingBudget(null);
        setFormDisplayed(true);
    }

    const SaveClicked = async () => {
        try {
            await refresh(); // Refresh the table
            setFormDisplayed(false);
        } catch (error:any) {
            toast.error(error.message, { autoClose: false});
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
                await refresh(); // Refresh the list after deleting
                toast.success("Budget deleted successfully", {position: "top-right"})
            } catch (error:any) {
                toast.error(`Failed to delete budget. ${error.message}`, { autoClose: false});
            }
        } else {
            toast.info("Delete operation cancelled.");
        }
    };

    const CancelClicked = () => {
        setFormDisplayed(false);
        setEditingBudget(null);
    }

    return (
        <>
            <div className="form-floating mb-3">
                <select 
                    className="form-select" 
                    id="selectedYearMonth" 
                    style={{ marginBottom: '18px' }} 
                    value={`${selectedYearMonth?.Year}-${selectedYearMonth?.Month}`}
                    onChange={(e) => setSelectedYearMonth(stringToYearMonth(e.target.value))}>
                    {yearMonthRange.map((yearMonth, index) => <option key={index} value={`${yearMonth.Year}-${yearMonth.Month}`}>{`${yearMonth.Year}-${yearMonth.Month}`}</option>)}
                </select>
                <label htmlFor="selectedYearMonth">Year-Month</label>
            </div>

            <div className="form-floating mb-3">
                {/* Show add new button when the form is not shown*/}
                {!formDisplayed && <button className="btn btn-success" onClick={AddNewClicked}>Add New</button>}

                {/* Show the add new form*/}
                {formDisplayed && <BudgetForm userId={userId} saveHandler={SaveClicked} cancelHandler={CancelClicked} editingBudget={editingBudget}/>}

                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Category</th>
                            <th scope="col">Budget</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgets.map((item) => (
                            <tr>
                                <td>{item.BUDGET_DATE}</td>
                                <td>{item.CATEGORY_TITLE}</td>
                                <td>{item.BUDGET_AMOUNT}</td>
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
        </>
    );
}

export default BudgetTable;