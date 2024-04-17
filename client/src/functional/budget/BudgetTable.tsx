import { useEffect, useState } from "react";
import { END_POINTS, get, del } from "../../common/Utilities";
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';
import BudgetForm from "./BudgetForm";

interface Props {
    userId: number;
}

const BudgetTable = ({userId}:Props) => {

    const [formDisplayed, setFormDisplayed] = useState(false);
    const [error, setError] = useState('');

    const AddNewClicked = () => {
        setFormDisplayed(true);
    }

    const CancelClicked = () => {
        setFormDisplayed(false);
    }

    const SaveClicked = () => {
        setFormDisplayed(false);
    }


    return (
        <div className="form-floating mb-3">
            {/* Show add new button when the form is not shown*/}
            {!formDisplayed && <button className="btn btn-success" onClick={AddNewClicked}>Add New</button>}

            {/* Show the add new form*/}
            {formDisplayed && <BudgetForm userId={userId} saveHandler={SaveClicked} cancelHandler={CancelClicked} />}

            {error && <p style={{color:'red'}}>{error}</p>}

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Category</th>
                        <th scope="col">Budget</th>
                        <th scope="col">Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Grocery</td>
                        <td>500</td>
                        <td>4/17/2024</td>
                        <td>
                            <PencilSquare  style={{cursor: 'pointer', marginRight: '10px'}} /> {/* Edit icon */}
                            <TrashFill  style={{cursor: 'pointer'}}/> 
                        </td>
                    </tr>

                    <tr>
                        <td>Food</td>
                        <td>200</td>
                        <td>4/15/2024</td>
                        <td>
                            <PencilSquare  style={{cursor: 'pointer', marginRight: '10px'}} /> {/* Edit icon */}
                            <TrashFill  style={{cursor: 'pointer'}}/> 
                        </td>
                    </tr>

                    <tr>
                        <td>Shopping</td>
                        <td>100</td>
                        <td>4/12/2024</td>
                        <td>
                            <PencilSquare  style={{cursor: 'pointer', marginRight: '10px'}} /> {/* Edit icon */}
                            <TrashFill  style={{cursor: 'pointer'}}/> 
                        </td>
                    </tr>

                    <tr>
                        <td>Subscriptions</td>
                        <td>150</td>
                        <td>4/11/2024</td>
                        <td>
                            <PencilSquare  style={{cursor: 'pointer', marginRight: '10px'}} /> {/* Edit icon */}
                            <TrashFill  style={{cursor: 'pointer'}}/> 
                        </td>
                    </tr>
                    
                </tbody>
            </table>

        </div>
    );
}

export default BudgetTable;