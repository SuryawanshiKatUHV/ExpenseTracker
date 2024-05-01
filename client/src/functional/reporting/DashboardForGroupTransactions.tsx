import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList} from 'recharts';
import { END_POINTS, get } from '../../common/Utilities';

interface Props {
    userId: number;
}

interface SettlementSummary {
    USER_ID : number;
    USER_FULLNAME: string;
    TOTAL_AMOUNT_PAID: number;
    TOTAL_AMOUNT_RECEIVED: number;
    UNSETTLED_DUE: number;
}

const DashboardForGroupTransactions = ({userId} : Props) => {
    const [groups, setGroups] = useState<any[]>([]);    // All the groups this user is member of
    const [selectedGroupId, setSelectedGroupId] = useState(0);  // The selected group from the list for displaying the information
    const [settlementSummary, setSettlementSummary] = useState<SettlementSummary[]>([]);  // The settlement summary data for the selected group
    const [error, setError] = useState('');

    useEffect(() => {
        loadGroups();
    }, []);

    useEffect(() => {
        loadSettlementSummary();
    }, [selectedGroupId]);

    async function loadGroups() {
        try {
            const groups = await get(`${END_POINTS.Users}/${userId}/groups`)
            setGroups(groups);
            // First in the list of group is a selected group
            if (groups && groups.length > 0) {
                setSelectedGroupId(groups[0].USER_GROUP_ID);
            }
        } catch (error:any) {
            setError(error.message);
        }
    }

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
    
    let { positiveUnsettled, negativeUnsettled } = separateSettlements(settlementSummary);

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

export default DashboardForGroupTransactions;