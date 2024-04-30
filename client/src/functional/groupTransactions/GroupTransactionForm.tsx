import { useEffect, useState } from "react";
import { END_POINTS, get, post, formatDate } from "../../common/Utilities";
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';

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
    const [txDate, setTxDate] = useState(formatDate(new Date()));
    const [txAmount, setTxAmount] = useState(0.00);
    const [txNotes, setTxNotes] = useState('');
    const [txMembers, setTxMembers] = useState<number[]>([]);

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
        let isValid = true;

        if (txDate == "") {
            toast.error('A Date is required');
            isValid = false;
        }
        else {
            console.log(`txDate=${txDate}`);
            // Future date is not allowed check
            const selectedDate = new Date(`${txDate}T00:00:00`);
            const currentDate = new Date();

            selectedDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);

            if (selectedDate > currentDate) {
                toast.error('Date must not be in future');
                isValid = false;
            }
        }

        if (!txAmount || txAmount <= 0) {
            toast.error('A non-negative amount is required.');
            isValid = false;
        }

        if (!txNotes) {
            toast.error('Transaction notes are required.');
            isValid = false;
        }

        if (txMembers.length == 0) {
            toast.error('Must select at least one member.');
            isValid = false;
        }

        return isValid;
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
                    toast.success(`Transaction created for group id: ${props.groupId}`, {position: "top-right"});
                });
            }
            catch (error : any) {
                toast.error(error.message, { autoClose: false});
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
        <>
            <Modal show={true}>
                <Modal.Header>
                    <Modal.Title>Add group transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-floating mb-3">
                        <input type="date" className="form-control" id="txDate" value={txDate} onChange={(e) => setTxDate(e.target.value)}/>
                        <label htmlFor="txDate">Date</label>
                    </div>

                    <div className="form-floating mb-3">
                        <select className="form-select" id="txCategoryId" onChange={(e) => setTxCategoryId(parseInt(e.target.value))} value={txCategoryId}>
                            {categories.map((category) => (
                                <option key={category.CATEGORY_ID} value={category.CATEGORY_ID}>{category.CATEGORY_TITLE}</option>
                            ))}
                        </select>
                        <label htmlFor="txCategoryId">Category</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="number" className="form-control" id="txAmount" value={txAmount} onChange={(e) => setTxAmount(parseFloat(e.target.value))}/>
                        <label htmlFor="txAmount">Amount ($)</label>
                    </div>

                    <div className="form-floating mb-3">
                        <textarea className="form-control" id="txNotes" onChange={(e) => setTxNotes(e.target.value)} value={txNotes}></textarea>
                        <label htmlFor="txNotes">Notes</label>
                    </div>

                    <div className="form-floating mb-3">
                        <ul className="list-group">
                            <label htmlFor="UserId" style={{textAlign: "left", paddingLeft: "1em"}}>Paid for members</label>
                            {availableGroupMembers.map((availableGroupMember) => (
                                <li key={availableGroupMember.MEMBER_ID} className="list-group-item" style={{ textAlign: "left", height: "3em" }}>
                                    <input
                                        type="checkbox"
                                        className="form-check-input me-1"
                                        id={"paidForMember" + availableGroupMember.MEMBER_ID}
                                        name={availableGroupMember.MEMBER_ID}
                                        value={availableGroupMember.MEMBER_ID}
                                        checked={txMembers.includes(availableGroupMember.MEMBER_ID)}
                                        onChange={() => handleMemberSelect(availableGroupMember.MEMBER_ID)}
                                        style={{ height: "1em" }}
                                    />
                                    <label className="form-check-label" htmlFor={"paidForMember" + availableGroupMember.MEMBER_ID}>
                                        {availableGroupMember.USER_FULLNAME}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-success" onClick={SaveClicked}>Save</button> &nbsp; 
                    <button className="btn btn-danger" onClick={CancelClicked}>Cancel</button>
                </Modal.Footer>
            </Modal>
    </>
    );
}

export default GroupTransactionForm;