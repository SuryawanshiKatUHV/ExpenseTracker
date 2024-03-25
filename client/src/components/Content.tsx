import { ReactNode } from "react";
import { FUNCTIONS} from "../Common";
import BudgetTable from "./functional/BudgetTable";
import CategoryTable from "./functional/CatagoryTable";
import Dashboard from "./functional/Dashboard";
import GroupTable from "./functional/GroupTable";
import GroupTransactionTable from "./functional/GroupTransactionTable";
import TransactionTable from "./functional/TransactionTable";

interface Props {
  userId : number;
  selectedFunction: string;
}

const Content = ({userId, selectedFunction }: Props) => {

  /**
   * Operations
   */
  const loadContent = () : ReactNode => {
    switch(selectedFunction) {
      case FUNCTIONS.Dashboard: return <Dashboard userId={userId}/>;
      case FUNCTIONS.Categories: return <CategoryTable userId={userId}/>;
      case FUNCTIONS.Budgets: return <BudgetTable userId={userId}/>;
      case FUNCTIONS.Transactions: return <TransactionTable userId={userId}/>;
      case FUNCTIONS.Groups: return <GroupTable userId={userId}/>;
      case FUNCTIONS.GroupTransactions: return <GroupTransactionTable userId={userId}/>;
    }
    
    return "Clicked unknown item.";
  }

  return (
    <>
      <div style={{ flex: 1, padding: '20px' }}>
        {loadContent()}
      </div>
    </>
  );
};

export default Content;