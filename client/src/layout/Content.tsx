import { ReactNode } from "react";
import { FUNCTIONS} from "../common/Utilities";
import BudgetTable from "../functional/budget/BudgetTable";
import CategoryTable from "../functional/category/CatagoryTable";
import Dashboard from "../functional/reporting/Dashboard";
import GroupTable from "../functional/group/GroupTable";
import GroupTransactionTable from "../functional/groupTransactions/GroupTransactionTable";
import TransactionTable from "../functional/transaction/TransactionTable";

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