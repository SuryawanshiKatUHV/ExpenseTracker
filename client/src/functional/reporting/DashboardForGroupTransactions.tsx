// Import necessary hooks and components from 'react' and 'recharts' libraries, and utility functions from 'Utilities' module
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList} from 'recharts';
import { END_POINTS, get } from '../../common/Utilities';

// Define interface for component props
interface Props {
    userId: number;
}

// Define interface for settlement summary data
interface SettlementSummary {
    USER_ID : number;
    USER_FULLNAME: string;
    TOTAL_AMOUNT_PAID: number;
    TOTAL_AMOUNT_RECEIVED: number;
    UNSETTLED_DUE: number;
}

// Define the DashboardForGroupTransactions component which takes in userId as a prop
const DashboardForGroupTransactions = ({userId} : Props) => {
    // Initialize state variables for groups, selectedGroupId, settlementSummary, and error using the useState hook
    const [groups, setGroups] = useState<any[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState(0);
    const [settlementSummary, setSettlementSummary] = useState<SettlementSummary[]>([]);
    const [error, setError] = useState('');

    // Fetch groups data when the component mounts using the useEffect hook
    useEffect(() => {
        loadGroups();
    }, []);

    // Fetch settlement summary data when the selectedGroupId state variable changes using the useEffect hook
    useEffect(() => {
        loadSettlementSummary();
    }, [selectedGroupId]);

    // Define loadGroups function to fetch groups data for the user using the get utility function
    async function loadGroups() {
        try {
            const groups = await get(`${END_POINTS.Users}/${userId}/groups`)
            setGroups(groups);
            // Set the first group in the list as the selected group
            if (groups && groups.length > 0) {
                setSelectedGroupId(groups[0].USER_GROUP_ID);
            }
        } catch (error:any) {
            setError(error.message);
        }
    }

    // Define loadSettlementSummary function to fetch settlement summary data for the selected group using the get utility function
    async function loadSettlementSummary() {
        try {
            if (selectedGroupId == 0) {
                setSettlementSummary([]);
            }
            else {
                const data = await get(`${END_POINTS.Groups}/${selectedGroupId}/settlementSummary`)
                setSettlementSummary(data);
            }
        } catch(error:any) {
            setError(error.message);
        }
    }

    // Define separateSettlements function to separate settlement summary data into positive and negative unsettled amounts
    function separateSettlements(settlementSummary : SettlementSummary[]) {
        let positiveUnsettled : SettlementSummary[] = [];
        let negativeUnsettled : SettlementSummary[] = [];

        settlementSummary.forEach(object => {
            if (object.UNSETTLED_DUE > 0) {
                positiveUnsettled.push(object);
            } else if (object.UNSETTLED_DUE < 0) {
                let newObject = { ...object };
                newObject.UNSETTLED_DUE = Math.abs(newObject.UNSETTLED_DUE);
                negativeUnsettled.push(newObject);
            }
        });

        return { positiveUnsettled, negativeUnsettled };
    }

    // Separate settlement summary data into positive and negative unsettled amounts using the separateSettlements function
    let { positiveUnsettled, negativeUnsettled } = separateSettlements(settlementSummary);

    // Render a dropdown to select a group, error message if any, and two bar charts to display settlement summary data
    return (
        <>
            <div className="form-floating mb-3">
                <select className="form-select" id="selectedGroupId" onChange={(e) => setSelectedGroupId(parseInt(e.target.value))} value={selectedGroupId}>
                    <option key="0" value="0"></option>
                    {groups.map(group => (
                        <option key={group.USER_GROUP_ID} value={group.USER_GROUP_ID}>{group.USER_GROUP_DATE} {group.USER_GROUP_TITLE} ({group.USER_GROUP_DESCRIPTION})</option>
                    ))}
                </select>
                <label htmlFor="selectedGroupId">Group</label>
            </div>

            {groups.length == 0 && <p style={{color:'red'}}>No groups found.</p>}

            {error && <p style={{color:'red'}}>{error}</p>}

            <table width="100%">
                <thead>
                    <tr>
                        <th>Money to be received</th>
                        <th>Money to be paid</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <BarChart
                                width={500}
                                height={300}
                                data={positiveUnsettled}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 20,
                                    bottom: 20,
                                }}
                                barSize={20}
                                >
                                <XAxis dataKey="USER_FULLNAME" scale="point" padding={{ left: 50, right: 50 }} angle={30}/>
                                <YAxis type="number" domain={['auto', 'auto']}/>
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="UNSETTLED_DUE" fill="green">
                                    <LabelList dataKey="UNSETTLED_DUE" position="top"/>
                                </Bar>
                            </BarChart>
                        </td>
                        <td>
                            <BarChart
                                width={500}
                                height={300}
                                data={negativeUnsettled}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 20,
                                    bottom: 20,
                                }}
                                barSize={20}
                                >
                                <XAxis dataKey="USER_FULLNAME" scale="point" padding={{ left: 50, right: 50 }} angle={30}/>
                                <YAxis type="number" domain={['auto', 'auto']}/>
                                <Tooltip />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="UNSETTLED_DUE" fill="red">
                                    <LabelList dataKey="UNSETTLED_DUE" position="top"/>
                                </Bar>
                            </BarChart>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

// Export the DashboardForGroupTransactions component
export default DashboardForGroupTransactions;
