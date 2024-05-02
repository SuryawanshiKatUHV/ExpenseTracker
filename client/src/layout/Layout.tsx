
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

/**
 * Layout component represents the overall structure of the application, including the header, navigation, and content sections.
 * @param {Props} userId - ID of the logged-in user.
 * @param {Props} userFullName - Full name of the logged-in user.
 * @param {Props} logoutHandler - Function to handle logout.
 * @returns {JSX.Element} The rendered Layout component.
 */
const Layout = ({ userId, userFullName, logoutHandler } : Props) => {
  const [currentFunction, setCurrentFunction] = useState(FUNCTIONS.Dashboard);

    /**
   * Handle click event on navigation items.
   * @param {string} item - The selected item.
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