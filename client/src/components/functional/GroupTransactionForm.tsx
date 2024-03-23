import { useEffect, useState } from "react";
import { END_POINTS, get } from "../../Common";

interface Props {
    groupId : number;
    saveHandler: (txCategoryId:number, txDate:string, txAmount:number, txMembers:number[], txNotes:string) => void;
    cancelHandler: () => void;
}

const GroupTransactionForm = (props : Props) => {
    /**
     * State
     */
    const [txCategoryId, setTxCategoryId] = useState(0);
    const [txDate, setTxDate] = useState('');
    const [txAmount, setTxAmount] = useState(0.00);
    const [txNotes, setTxNotes] = useState('');
    const [txMembers, setTxMembers] = useState<number[]>([]);
    const [errors, setErrors] = useState({txDate:'', txAmount:'', txMembers:''});

    const [categories, setCategories] = useState<any[]>([]);
    const [availableGroupMembers, setAvailableGroupMembers] = useState<any[]>([]);

    useEffect(() =>{ 
        async function fetchData() {
            const categories = await get(END_POINTS.Categories);
            setCategories(categories);

            const selectedGroup = await get(`${END_POINTS.Groups}/${props.groupId}`);
            setAvailableGroupMembers(selectedGroup.USER_GROUP_MEMBERS);
        }
        fetchData();
    }, []);

    /**
     * Operations
     */
    const validateInput = () : boolean => {
        let errors = {txDate:'', txAmount:'', txMembers:''};

        if (txDate == "") {
            errors["txDate"] = "Date is required.";
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

            if (selectedDateWithoutTimezone > currentDateWithoutTimezone) {
                errors["txDate"] = "Date must not be in future.";
            }
        }

        if (txAmount + '' == '' || txAmount == 0) {
            errors["txAmount"] = "Amount is required.";
        }
        else if (txAmount < 0) {
            errors["txAmount"] = "Amount cannot be negative value.";
        }

        if (txMembers.length == 0) {
            errors['txMembers'] = "Must select at least one member.";
        }

        setErrors(errors);
        return !(errors.txDate || errors.txAmount || errors.txMembers);
    }

    /**
     * Event Handlers
     */
    const SaveClicked = () => {
        if(validateInput()) {
            props.saveHandler(txCategoryId, txDate, txAmount, txMembers, txNotes);
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
        {new Date().toISOString()}
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
          {errors.txDate && <p style={{color:'red'}}>{errors.txDate}</p>}
        </div>

        <div className="form-floating mb-3">
          <input type="number" className="form-control" id="txAmount" value={txAmount} onChange={(e) => setTxAmount(parseFloat(e.target.value))}/>
          <label htmlFor="txAmount">Amount ($)</label>
          {errors.txAmount && <p style={{color:'red'}}>{errors.txAmount}</p>}
        </div>

        <div className="form-floating mb-3">
          <textarea className="form-control" id="txNotes" onChange={(e) => setTxNotes(e.target.value)} value={txNotes}></textarea>
          <label htmlFor="txNotes">Notes</label>
        </div>

        <div>Paid for members</div>
        {availableGroupMembers.map((availableGroupMember) => (
            <div className="form-check form-check-inline">
                <input className="form-check-input" 
                    type="checkbox" 
                    id={"paidForMember" + availableGroupMember.USER_ID}
                    value={availableGroupMember.USER_ID}
                    checked={txMembers.includes(availableGroupMember.USER_ID)}
                    onChange={() => handleMemberSelect(availableGroupMember.USER_ID)}/>
                <label className="form-check-label" htmlFor={"paidForMember" + availableGroupMember.USER_ID}>{`${availableGroupMember.USER_LNAME}, ${availableGroupMember.USER_FNAME}`}</label>
            </div>    
        ))}
        {errors.txMembers && <p style={{color:'red'}}>{errors.txMembers}</p>}

        <div>
            <button className="btn btn-success" onClick={SaveClicked}>Save</button> &nbsp; 
            <button className="btn btn-danger" onClick={CancelClicked}>Cancel</button>
        </div>
    </div>
    );
}

export default GroupTransactionForm;