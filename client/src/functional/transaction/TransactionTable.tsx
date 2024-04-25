import { useEffect, useState } from "react";
import TransactionForm from "./TransactionForm";
import { END_POINTS, get, del } from "../../common/Utilities";
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';

interface Props {
    userId: number;
}

const TransactionTable = ({userId} : Props) => {
    const [formDisplayed, setFormDisplayed] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [editingTransaction, setEditingTransaction] = useState<any>([]);
    const [error, setError] = useState('');

    async function loadTransactions() {
        const transactions = await get(`${END_POINTS.Users}/${userId}/transactions`);
        setTransactions(transactions);
    }

    useEffect(() =>{ 
        async function fetchData() {
            await loadTransactions();
        }
        fetchData();
    }, []);

    const AddNewClicked = () => {
        setEditingTransaction(null);
        setFormDisplayed(true);
    }

    const SaveClicked = async () => {
        try {
            await loadTransactions(); // Refresh the table
            setFormDisplayed(false);
        } 
        catch (error : any) {
            setError(error.message);
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
                console.log("Transaction deleted");
                await loadTransactions(); // Refresh the list after deleting
                setError("");
            } catch (error) {
                console.error("Failed to delete the item:", error);
                setError('Failed to delete transaction'); 
            }
        } else {
            console.log("Delete operation cancelled");
        }
    };

    const CancelClicked = () => {
        setFormDisplayed(false);
        setEditingTransaction(null);
    }

    return (
        <div className="form-floating mb-3">
            {/* Show add new button when the form is not shown*/}
            {!formDisplayed && <button className="btn btn-success" onClick={AddNewClicked}>Add New</button>}

            {/* Show the add new form*/}
            {formDisplayed && <TransactionForm userId={userId} saveHandler={SaveClicked} cancelHandler={CancelClicked} editingTransaction={editingTransaction}/>}

            {error && <p style={{color:'red'}}>{error}</p>}

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Type</th>
                        <th scope="col">Category</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Date</th>
                        <th scope="col">Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((item) => (
                        <tr>
                            <td>{item.TRANSACTION_TYPE}</td>
                            <td>{item.CATEGORY_TITLE}</td>
                            <td>{item.TRANSACTION_AMOUNT}</td>
                            <td>{item.TRANSACTION_DATE}</td>
                            <td>{item.TRANSACTION_NOTES}</td>
                            <td>
                                <PencilSquare onClick={() => EditClicked(item)} style={{cursor: 'pointer', marginRight: '10px'}} /> {/* Edit icon */}
                                <TrashFill onClick={() => DeleteClicked(item.TRANSACTION_ID)} style={{cursor: 'pointer'}}/> Delete icon
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {transactions.length == 0 && <p>No records found.</p>}
        </div>
    );
}

export default TransactionTable;