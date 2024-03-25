import { ReactNode, useState } from "react";
import { FUNCTIONS } from "../../Common";
import DashboardForTransactions from "./DashboardForTransactions";
import DashboardForGroupTransactions from "./DashboardForGroupTransactions";

interface Props {
  userId: number;
}

function Dashboard({userId} : Props) {
  const [currentDashboard, setCurrentDashboard] = useState(FUNCTIONS.DashboardForTransactions);

  /**
   * Operations
   */
  const loadDashboard = () : ReactNode => {
    if (currentDashboard == FUNCTIONS.DashboardForTransactions)
      return <DashboardForTransactions userId={userId}/>;

    return <DashboardForGroupTransactions userId={userId}/>;
  }

  /**
   * Event Handlers
   */

  const DashboardForGroupTransactionsClicked = () : void => {
    setCurrentDashboard(FUNCTIONS.DashboardForGroupTransactions);
  }

  const DashboardForTransactionsClicked = () : void => {
    setCurrentDashboard(FUNCTIONS.DashboardForTransactions);
  }

  return (
    <div>
        <button className="btn btn-link" onClick={DashboardForTransactionsClicked}>Transactions</button> | <button className="btn btn-link" onClick={DashboardForGroupTransactionsClicked}>Group Transactions</button>
        <hr/>
        {loadDashboard()}
    </div>
  );
}

export default Dashboard;