
import Header from './Header';
import Navigation from './Navigation';
import Content from './Content';
import { useState } from 'react';
import { FUNCTIONS } from '../common/Utilities';

interface Props {
  userId : number;
  userFullName: string;
  logoutHandler : () => void;
}

const Layout = ({ userId, userFullName, logoutHandler } : Props) => {
  const [currentFunction, setCurrentFunction] = useState(FUNCTIONS.Dashboard);

  /**
   * Operations
   */


  /**
   * Event Handlers
   */

  const ItemClicked = (item:string) => {
    setCurrentFunction(item);
  }

  return (
    <div>
      <Header userFullName={userFullName} logoutHandler={logoutHandler}/>
      <div style={{ display: 'flex' }}>
        <Navigation itemClickHandler={ItemClicked}/>
        <Content userId={userId} selectedFunction={currentFunction}/>
      </div>
    </div>
  );
};

export default Layout;