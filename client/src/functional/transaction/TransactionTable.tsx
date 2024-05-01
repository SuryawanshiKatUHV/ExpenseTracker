import { useEffect, useState } from "react";
import TransactionForm from "./TransactionForm";
import { END_POINTS, get, del, stringToYearMonth, YearMonthRange } from "../../common/Utilities";
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

interface Props {
    userId: number;
}

const TransactionTable = ({userId} : Props) => {
    const [yearMonthRange, setYearMonthRange] = useState<YearMonthRange[]>([]);
    const [selectedYearMonth, setSelectedYearMonth] = useState<YearMonthRange>(defaultYearMonth());
    const [formDisplayed, setFormDisplayed] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [editingTransaction, setEditingTransaction] = useState<any>([]);
    const [error, setError] = useState('');

    function defaultYearMonth() : YearMonthRange {
        let currentDate = new Date();
        let yearMonth:YearMonthRange = {Year:currentDate.getFullYear(), Month:currentDate.getMonth()+1};
        return yearMonth;
    }

    async function loadTransactions() {
        try {
            const transactions = await get(`${END_POINTS.Users}/${userId}/transactions/${selectedYearMonth?.Year}/${selectedYearMonth?.Month}`);
            setTransactions(transactions);
        } catch (error:any) {
            toast.error(`Failed to load transactions. ${error.message}`, { autoClose: false});
        }
    }

    async function loadYearMonthRange() {
        try {
            const yearMonthRange = await get(`${END_POINTS.Users}/${userId}/transactions/yearMonthRange`);
            setYearMonthRange(yearMonthRange);
            if (yearMonthRange && yearMonthRange.length > 0) {
                setSelectedYearMonth(yearMonthRange[0]);
            }
        } catch (error:any) {
            toast.error(`Failed to load Year-Month range. ${error.message}`, { autoClose: false});
        }
    }

    async function refresh() {
        await loadYearMonthRange();
        await loadTransactions();
    }
    
    /**
     * In the begining load the initial view
     */
    useEffect(() =>{ 
        async function fetchData() {
            await loadYearMonthRange();
        }
        fetchData();
    }, []);

    /**
     * When the Year-Month selection changes then reload the transactions
     */
    useEffect(() =>{ 
        async function fetchData() {
            await loadTransactions();
        }
        fetchData();
    }, [selectedYearMonth]);

    const AddNewClicked = () => {
        setEditingTransaction(null);
        setFormDisplayed(true);
    }

    const SaveClicked = async () => {
        try {
            setFormDisplayed(false);
            await refresh(); // Refresh the table
        } 
        catch (error : any) {
            toast.error(error.message, { autoClose: false});
        }
    }

    const EditClicked = (transactions: any) => {
        setEditingTransaction(transactions);
        setFormDisplayed(true);
    }

    const DeleteClicked = async (transactionId: number) => {
        // Simple confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to delete?");
        if (isConfirmed) {
            try {
                await del(`${END_POINTS.Transactions}/${transactionId}`);
                await refresh(); // Refresh the list after deleting
                toast.success("Transaction deleted", {position: "top-right"});
            } catch (error:any) {
                console.error("Failed to delete the item:", error);
                toast.error(error.message, { autoClose: false}); 
            }
        } else {
            toast.info("Delete operation cancelled.");
        }
    };

    const CancelClicked = () => {
        setFormDisplayed(false);
        setEditingTransaction(null);
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
            {formDisplayed && <TransactionForm userId={userId} saveHandler={SaveClicked} cancelHandler={CancelClicked} editingTransaction={editingTransaction}/>}

            {error && <p style={{color:'red'}}>{error}</p>}

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Type</th>
                        <th scope="col">Category</th>
                        <th scope="col">Amount</th>
                        <th scope="col">GroupTx</th>
                        <th scope="col">Notes</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((item) => (
                        <tr>
                            <td>{item.TRANSACTION_DATE}</td>
                            <td>{item.TRANSACTION_TYPE}</td>
                            <td>{item.CATEGORY_TITLE}</td>
                            <td>{item.TRANSACTION_AMOUNT}</td>
                            <td>{item.TOTAL_USER_GROUP_TRANSACTIONS>0?item.TOTAL_USER_GROUP_TRANSACTIONS:''}</td>
                            <td>{item.TRANSACTION_NOTES}</td>
                            <td>
                                {/* If there are group transactions associated with this transaction then do not allow to edit this transaction, because then we need
                                additional processing to distribute the amount among the group transactions. */}
                                {item.TOTAL_USER_GROUP_TRANSACTIONS > 0 && <small>*</small>}
                                {item.TOTAL_USER_GROUP_TRANSACTIONS === 0 && <PencilSquare onClick={() => EditClicked(item)} style={{cursor: 'pointer', marginRight: '10px'}} />}
                                {item.TOTAL_USER_GROUP_TRANSACTIONS === 0 && <TrashFill onClick={() => DeleteClicked(item.TRANSACTION_ID)} style={{cursor: 'pointer'}}/>}
                            </td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>

            {transactions.length == 0 && <p>No records found.</p>}

            {transactions.length > 0 && <small><i>* The consolidated transactions which are result of the group tranasactions cannot be edited or deleted.</i></small>}
        </div>
        </>
    );
}

export default TransactionTable;