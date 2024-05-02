import { ReactNode, useState } from "react";
import { FUNCTIONS } from "../../common/Utilities";
import DashboardForTransactions from "./DashboardForTransactions";
import DashboardForGroupTransactions from "./DashboardForGroupTransactions";

interface Props {
  userId: number;
}

/**
 * Dashboard component that displays different dashboards based on user selection.
 * @param {number} userId - The ID of the current user.
 */
function Dashboard({userId} : Props) {
  const [currentDashboard, setCurrentDashboard] = useState(FUNCTIONS.DashboardForTransactions);

  /**
   * Loads the selected dashboard based on the currentDashboard state.
   * @returns {ReactNode} - The selected dashboard component.
   */
  const loadDashboard = () : ReactNode => {
    if (currentDashboard == FUNCTIONS.DashboardForTransactions)
      return <DashboardForTransactions userId={userId}/>;

    return <DashboardForGroupTransactions userId={userId}/>;
  }

  /**
   * Event Handlers
   */

  /**
   * Sets the currentDashboard state to show the Dashboard for Group Transactions.
   */
  const DashboardForGroupTransactionsClicked = () : void => {
    setCurrentDashboard(FUNCTIONS.DashboardForGroupTransactions);
  }

  /**
   * Sets the currentDashboard state to show the Dashboard for Transactions.
   */
  const DashboardForTransactionsClicked = () : void => {
    setCurrentDashboard(FUNCTIONS.DashboardForTransactions);
  }

  return (
    <div>
        <button className={currentDashboard === FUNCTIONS.DashboardForTransactions? "btn btn-primary":"btn btn-link"} onClick={DashboardForTransactionsClicked}>Transactions</button> | <button className={currentDashboard === FUNCTIONS.DashboardForGroupTransactions? "btn btn-primary":"btn btn-link"} onClick={DashboardForGroupTransactionsClicked}>Group Transactions</button>
        <hr/>
        {loadDashboard()}
    </div>
  );
}

export default Dashboard;