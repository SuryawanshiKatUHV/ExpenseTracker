import { useState, useEffect } from "react";
import { END_POINTS, get, post, put } from "../../common/Utilities";

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
    const [transactionAmount, setTransactionAmount] = useState(props.editingTransaction?.TRANSACTION_AMOUNT);
    const [transactionNotes, setTransactionNotes] = useState(props.editingTransaction?.TRANSACTION_NOTES);
    // without transaction notes atm
    const [validationErrors, setValidationErrors] = useState({categoryId: '', transactionType: '', transactionDate: '', transactionAmount: ''});
    const [error, setError] = useState('');
    
         // Validate category input
    const validateInput = () => {
        let isValid = true;
        let validationErrors = {categoryId: '', transactionType: '', transactionDate: '', transactionAmount: ''};

        if (!categoryId) {
            validationErrors.categoryId = 'A category is required.';
            isValid = false;
        }
        if (!transactionType) {
            validationErrors.transactionType = 'A transaction type is required.';
            isValid = false;
        }
        if (!transactionDate || isNaN(transactionDate.getDate())) {
            validationErrors.transactionDate = 'A valid date is required.';
            isValid = false;
        }
        if (!transactionAmount) {
            validationErrors.transactionAmount = 'Transaction Amount is required.';
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
                    console.log("editing ", transactionData.TRANSACTION_DATE);
                    await put(`${END_POINTS.Transactions}/${props.editingTransaction.TRANSACTION_ID}`, transactionData);
                    console.log(`Transaction updated with id ${props.editingTransaction.TRANSACTION_ID}`);
                } else {
                    // Create a new transaction
                    console.log("creating ", transactionData.TRANSACTION_DATE);
                    const result = await post(END_POINTS.Transactions, transactionData);
                    console.log(`Transaction created with id ${result.TRANSACTION_ID}`);
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
            <h5 className="m-5">Add Transaction</h5>

            <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px' }}>
            <label htmlFor="transactionType" style={{ marginRight: '20px' }}>Transaction Type:</label>
                <div className="radio-option" style={{ marginRight: '20px' }}>
                <input type="radio" id="income" name="transactionType" value="Income" checked={transactionType === "Income"} onChange={(e) => setTransactionType(e.target.value)} />
                <label htmlFor="income" style={{ marginLeft: '5px' }}>Income</label>
                </div>

                <div className="radio-option">
                <input type="radio" id="expense" name="transactionType" value="Expense" checked={transactionType === "Expense"} onChange={(e) => setTransactionType(e.target.value)} />
                <label htmlFor="expense" style={{ marginLeft: '5px' }}>Expense</label>
                </div>
            </div>
            {validationErrors.transactionType && <p style={{ color: 'red' }}>{validationErrors.transactionType}</p>}

            <select className="form-select" aria-label="Default select example" style={{ marginBottom: '18px' }} value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} disabled={props.editingTransaction ? true : false}>
                <option value="">Select Category</option>
                {categories.map((item, index) => (
                    <option key={index} value={item.CATEGORY_ID}>
                        {item.CATEGORY_TITLE}
                    </option>
                ))}
            </select>
            {validationErrors.categoryId && <p style={{color:'red'}}>{validationErrors.categoryId}</p>}


            <div className="form-floating mb-3">
              <input type="number" className="form-control" id="transactionAmount" value={transactionAmount} onChange={(e) => setTransactionAmount(Number(e.target.value))}/>
              <label htmlFor="transactionAmount">Transaction Amount</label>
              {validationErrors.transactionAmount && <p style={{color:'red'}}>{validationErrors.transactionAmount}</p>}
            </div>
                    
            <div className="form-floating mb-3">
              <input type="string" className="form-control" id="transactionNotes" value={transactionNotes} onChange={(e) => setTransactionNotes(e.target.value)}/>
              <label htmlFor="transactionNotes">Transaction Description</label>
              {/* {validationErrors.transactionNotes && <p style={{color:'red'}}>{validationErrors.transactionNotes}</p>} */}
            </div>
                    
            <div className="form-floating mb-3">
              <input type="date" className="form-control" id="transactionDate" value={formatDate(transactionDate)} onChange={(e) => setTransactionDate(new Date(e.target.value))}/>
              <label htmlFor="transactionDate">Date</label>
              {validationErrors.transactionDate && <p style={{color:'red'}}>{validationErrors.transactionDate}</p>}
            </div>

            <div>
                <button className="btn btn-success" onClick={SaveClicked}>Save</button> &nbsp; 
                <button className="btn btn-danger" onClick={CancelClicked}>Cancel</button>
            </div>
            {error && <p style={{color:'red'}}>{error}</p>}
        </div>
    );

}

export default TransactionForm;