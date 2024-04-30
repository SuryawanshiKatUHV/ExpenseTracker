import { useState, useEffect } from "react";
import { END_POINTS, get, post, put, formatDate } from "../../common/Utilities";
import { toast } from 'react-toastify';

interface Props {
    userId: number;
    saveHandler: () => void;
    cancelHandler: () => void;
    editingTransaction?: { TRANSACTION_ID: number, CATEGORY_ID: number; TRANSACTION_TYPE: string; TRANSACTION_DATE: Date; TRANSACTION_AMOUNT: number; TRANSACTION_NOTES: string}; 
}
const TransactionForm  = (props : Props) => {
    const [categories, setCategories] = useState<any[]>([]);
    const [categoryId, setCategoryId] = useState(props.editingTransaction?.CATEGORY_ID);
    const [transactionType, setTransactionType] = useState(props.editingTransaction?.TRANSACTION_TYPE);
    const [transactionDate, setTransactionDate] = useState(props.editingTransaction?.TRANSACTION_DATE ? new Date(props.editingTransaction.TRANSACTION_DATE) : new Date());
    const [transactionAmount, setTransactionAmount] = useState(props.editingTransaction?.TRANSACTION_AMOUNT?props.editingTransaction?.TRANSACTION_AMOUNT: 0.0);
    const [transactionNotes, setTransactionNotes] = useState(props.editingTransaction?.TRANSACTION_NOTES);
    
    // Validate transaction input
    const validateInput = () => {
        let isValid = true;

        if (!categoryId) {
            toast.error("A category is required");
            isValid = false;
        }
        if (!transactionType) {
            toast.error("A transaction type is required");
            isValid = false;
        }
        if (!transactionDate || isNaN(transactionDate.getDate())) {
            toast.error("A valid date is required");
            isValid = false;
        }
        else {
            transactionDate.setHours(0, 0, 0, 0);
            
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            if (transactionDate > currentDate) {
                toast.error("Date must not be in future")
                isValid = false;
            }
        }

        if (!transactionAmount) {
            toast.error("A transaction amount is required")
            isValid = false;
        }
        if (!transactionNotes) {
            toast.error("Transactio notes are required")
            isValid = false;
        }

        return isValid;
    };

    
    async function loadCategories() {
        try {
            const categories = await get(`${END_POINTS.Users}/${props.userId}/categories`);
            setCategories(categories);
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
        console.log("Selected category for transaction:", categoryId); 
        
        if (validateInput()) {
            const transactionData = {
                CATEGORY_ID: categoryId,
                TRANSACTION_TYPE: transactionType,
                TRANSACTION_DATE: formatDate(transactionDate),
                TRANSACTION_AMOUNT: transactionAmount,
                TRANSACTION_NOTES: transactionNotes
            };

            try {
                
                if (props.editingTransaction?.TRANSACTION_ID) {
                    // Update the existing transaction
                    await put(`${END_POINTS.Transactions}/${props.editingTransaction.TRANSACTION_ID}`, transactionData);
                    toast.info(`Transaction updated with id ${props.editingTransaction.TRANSACTION_ID}`, {position: "top-right"})
                } else {
                    // Create a new transaction
                    const result = await post(END_POINTS.Transactions, transactionData);
                    toast.success(`Transaction created with id ${result.TRANSACTION_ID}`, {position: "top-right"})
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
        const dateWithoutTime = new Date(Number(dateTokens[0]), Number(dateTokens[1]) - 1, Number(dateTokens[2]));
        return dateWithoutTime;
    }

    return (
        <>
        <h5 className="m-5">{props.editingTransaction?"Edit transaction":"Add transaction"}</h5>
        <div className="card" style={{border:1}}>
            
            <div className="form-floating mb-3">
              <input type="date" className="form-control" id="transactionDate" value={formatDate(transactionDate)} onChange={(e) => {setTransactionDate(stringToDate(e.target.value))}}/>
              <label htmlFor="transactionDate">Date</label>
            </div>

            <div className="form-floating mb-3">
                <select className="form-select" id="txTransactionType" value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                    <option key="blank" value=""></option>
                    <option key="Expense" value="Expense">Expense</option>
                    <option key="Income" value="Income">Income</option>
                </select>
                <label htmlFor="txTransactionType">Type</label>
            </div>

            <div className="form-floating mb-3">
                <select className="form-select" id="txCategoryId" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
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
              <input type="number" className="form-control" id="transactionAmount" value={transactionAmount} onChange={(e) => setTransactionAmount(Number(e.target.value))}/>
              <label htmlFor="transactionAmount">Transaction Amount</label>
            </div>
                    
            <div className="form-floating mb-3">
              <input type="string" className="form-control" id="transactionNotes" value={transactionNotes} onChange={(e) => setTransactionNotes(e.target.value)}/>
              <label htmlFor="transactionNotes">Transaction Notes</label>
            </div>
                    

            <div>
                <button className="btn btn-success" onClick={SaveClicked}>Save</button> &nbsp; 
                <button className="btn btn-danger" onClick={CancelClicked}>Cancel</button>
            </div>
        </div>
        </>
    );

}

export default TransactionForm;