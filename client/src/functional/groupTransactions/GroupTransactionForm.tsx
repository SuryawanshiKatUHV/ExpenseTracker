import { useEffect, useState } from "react";
import { END_POINTS, get, post } from "../../common/Utilities";

interface Props {
    userId: number;
    groupId : number;
    saveHandler: () => void;
    cancelHandler: () => void;
}

const GroupTransactionForm = (props : Props) => {
    console.log(`GroupTransactionForm received userId=${props.userId}, groupId=${props.groupId}`);

    /**
     * State
     */
    const [txCategoryId, setTxCategoryId] = useState(0);
    const [txDate, setTxDate] = useState('');
    const [txAmount, setTxAmount] = useState(0.00);
    const [txNotes, setTxNotes] = useState('');
    const [txMembers, setTxMembers] = useState<number[]>([]);

    const [validationErrors, setValidationErrors] = useState({txDate:'', txAmount:'', txMembers:'', txNotes:''});
    const [error, setError] = useState('');

    const [categories, setCategories] = useState<any[]>([]);
    const [availableGroupMembers, setAvailableGroupMembers] = useState<any[]>([]);

    async function loadCategories() {
        await get(`${END_POINTS.Users}/${props.userId}/categories`)
        .then((availableCategories) =>{
            setCategories(availableCategories);
            // Select the first property by default
            if (availableCategories && availableCategories.length > 0) {
                setTxCategoryId(availableCategories[0].CATEGORY_ID);
            }
        });
    }

    async function loadGroupMembers() {
        await get(`${END_POINTS.Groups}/${props.groupId}/members`)
        .then((groupMembers) => {
            setAvailableGroupMembers(groupMembers);
        });
    }

    useEffect(() =>{ 
        async function fetchData() {
            await loadCategories();
            await loadGroupMembers();
        }
        fetchData();
    }, []);

    /**
     * Operations
     */
    const validateInput = () : boolean => {
        let validationErrors = {txDate:'', txAmount:'', txMembers:'', txNotes:''};

        if (txDate == "") {
            validationErrors["txDate"] = "Date is required.";
        }
        else {
            // Future date is not allowed check
            const selectedDate = new Date(`${txDate}T00:00:00`);
            const currentDate = new Date();

            // Remove timezone information from the dates
            const selectedDateWithoutTimezone = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate()
            );
            const currentDateWithoutTimezone = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate()
            );

            //TODO Can the above code be written as below?
            // selectedDate.setHours(0, 0, 0, 0);
            // currentDate.setHours(0, 0, 0, 0);

            if (selectedDateWithoutTimezone > currentDateWithoutTimezone) {
                validationErrors["txDate"] = "Date must not be in future.";
            }
        }

        if (!txAmount || txAmount <= 0) {
            validationErrors.txAmount = txAmount === 0 ? "Amount is required." : "Amount cannot be negative value.";
        }

        if (txMembers.length == 0) {
            validationErrors['txMembers'] = "Must select at least one member.";
        }

        if (!txNotes) {
            validationErrors.txNotes = "Transaction notes are required.";
        }

        setValidationErrors(validationErrors);
        return !(validationErrors.txDate || validationErrors.txAmount || validationErrors.txMembers || validationErrors.txNotes);

        // I did check if the above return statement be written as below
        // return Object.keys(validationErrors).length === 0;
        //
        // - No I cannot do that as, the Object.keys would return 4 even if none of the keys have values assigned
        // let validationErrors = {txDate:'', txAmount:'', txMembers:'', txNotes:''};
        // undefined
        // validationErrors
        // {txDate: '', txAmount: '', txMembers: '', txNotes: ''}
        // Object.keys(validationErrors).length
        // 4
    }

    /**
     * Event Handlers
     */
    const SaveClicked = async () => {
        if(validateInput()) {
            try {
                const payload = {
                    USER_GROUP_ID: props.groupId, 
                    CATEGORY_ID: txCategoryId, 
                    TRANSACTION_DATE: txDate, 
                    TRANSACTION_AMOUNT: txAmount, 
                    TRANSACTION_NOTES: txNotes, 
                    PAID_BY_USER_ID: props.userId, 
                    PAID_TO_USER_IDS:txMembers
                };
                await post(END_POINTS.GroupTransactions, payload)
                .then(() => {
                    props.saveHandler();
                });
            }
            catch (error : any) {
                setError(error.message);
            }
        }
    }

    const CancelClicked = () => {
        props.cancelHandler();
    }

    const handleMemberSelect = (memberId:number) => {
        if (txMembers.includes(memberId)) {
            setTxMembers(txMembers.filter(id => id !== memberId));
          } else {
            setTxMembers([...txMembers, memberId]);
          }
    }

    return (
        
    <div style={{border:1}}>
        <h5 className="m-5">Add new group transaction</h5>
        
        {error && <p style={{color:'red'}}>{error}</p>}

        <div className="form-floating mb-3">
          <select className="form-select" id="txCategoryId" onChange={(e) => setTxCategoryId(parseInt(e.target.value))} value={txCategoryId}>
            {categories.map((category) => (
                <option key={category.CATEGORY_ID} value={category.CATEGORY_ID}>{category.CATEGORY_TITLE}</option>
            ))}
          </select>
          <label htmlFor="txCategoryId">Category</label>
        </div>
        
        <div className="form-floating mb-3">
          <input type="date" className="form-control" id="txDate" value={txDate} onChange={(e) => setTxDate(e.target.value)}/>
          <label htmlFor="txDate">Date</label>
          {validationErrors.txDate && <p style={{color:'red'}}>{validationErrors.txDate}</p>}
        </div>

        <div className="form-floating mb-3">
          <input type="number" className="form-control" id="txAmount" value={txAmount} onChange={(e) => setTxAmount(parseFloat(e.target.value))}/>
          <label htmlFor="txAmount">Amount ($)</label>
          {validationErrors.txAmount && <p style={{color:'red'}}>{validationErrors.txAmount}</p>}
        </div>

        <div className="form-floating mb-3">
          <textarea className="form-control" id="txNotes" onChange={(e) => setTxNotes(e.target.value)} value={txNotes}></textarea>
          <label htmlFor="txNotes">Notes</label>
          {validationErrors.txNotes && <p style={{color:'red'}}>{validationErrors.txNotes}</p>}
        </div>

        <div>Paid for members</div>
        {availableGroupMembers.map((availableGroupMember) => (
            <div className="form-check form-check-inline">
                <input className="form-check-input" 
                    type="checkbox" 
                    id={"paidForMember" + availableGroupMember.MEMBER_ID}
                    value={availableGroupMember.MEMBER_ID}
                    checked={txMembers.includes(availableGroupMember.MEMBER_ID)}
                    onChange={() => handleMemberSelect(availableGroupMember.MEMBER_ID)}/>
                <label className="form-check-label" htmlFor={"paidForMember" + availableGroupMember.MEMBER_ID}>{availableGroupMember.USER_FULLNAME}</label>
            </div>    
        ))}
        {validationErrors.txMembers && <p style={{color:'red'}}>{validationErrors.txMembers}</p>}

        <div>
            <button className="btn btn-success" onClick={SaveClicked}>Save</button> &nbsp; 
            <button className="btn btn-danger" onClick={CancelClicked}>Cancel</button>
        </div>
    </div>
    );
}

export default GroupTransactionForm;