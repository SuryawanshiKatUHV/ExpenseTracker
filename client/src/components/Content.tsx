import { ReactNode } from "react";
import { FUNCTIONS} from "../Common";
import BudgetTable from "./functional/BudgetTable";
import CategoryTable from "./functional/CatagoryTable";
import Dashboard from "./functional/Dashboard";
import GroupTable from "./functional/GroupTable";
import GroupTransactionTable from "./functional/GroupTransactionTable";
import TransactionTable from "./functional/TransactionTable";

interface Props {
  selectedFunction: string;  
}

const Content = ({ selectedFunction }: Props) => {
  
  /**
   * Following code of listing the users should be removed afterwards
   */
  // const [users, setUsers] = useState<any[]>([]);
  // useEffect(() =>{ 
  //   async function fetchUsers() {
  //     const users = await get(END_POINTS.Users);
  //     setUsers(users);
  //   }
  //   fetchUsers();
  // }, []);

  /**
   * Operations
   */
  const loadContent = () : ReactNode => {
    switch(selectedFunction) {
      case FUNCTIONS.Dashboard: return <Dashboard/>;
      case FUNCTIONS.Categories: return <CategoryTable/>;
      case FUNCTIONS.Budgets: return <BudgetTable/>;
      case FUNCTIONS.Transactions: return <TransactionTable/>;
      case FUNCTIONS.Groups: return <GroupTable/>;
      case FUNCTIONS.GroupTransactions: return <GroupTransactionTable/>;
    }
    
    return "Clicked unknown item.";
  }

  return (
    <>
      <div style={{ flex: 1, padding: '20px' }}>
        {loadContent()}
      </div>
      {/* <br/>
      <table className="table table-hover">
          <thead>
              <tr>
                  <th scope="col">ID</th>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Email</th>
              </tr>
          </thead>
          <tbody>
              {users.map((user)=> (
                  <tr>
                      <td>{user.USER_ID}</td>
                      <td>{user.USER_FNAME}</td>
                      <td>{user.USER_LNAME}</td>
                      <td>{user.USER_EMAIL}</td>
                  </tr>                
              ))}
          </tbody>
      </table> */}
    </>
  );
};

export default Content;