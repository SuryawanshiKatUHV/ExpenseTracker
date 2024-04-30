import { ReactNode, useState } from 'react';
import './App.css'
import Layout from './layout/Layout';
import LoginForm from './functional/user/LoginForm';
import RegistrationForm from './functional/user/RegistrationForm';
import {VIEW, post, END_POINTS} from './common/Utilities';
import { toast } from 'react-toastify';

function App() {
  
  const [view, setView] = useState(VIEW.LoginForm);
  const [loggedInUser, setLoggedInUser] = useState({USER_FULL_NAME:'', USER_ID:0});

  /**
   * Operations
   */
  const loadContent = () : ReactNode => {
    
    switch(view) {
    case VIEW.LoginForm:
      return <LoginForm loginHandler={LoginClicked} showRegistrationHandler={ShowRegistrationClicked}/>;
    case VIEW.RegistrationForm:
      return <RegistrationForm registerHandler={RegisterClicked} showLoginHandler={ShowLoginClicked}/>;
    case VIEW.AppHome:
      return (
        <Layout userId={loggedInUser.USER_ID} userFullName={loggedInUser.USER_FULL_NAME} logoutHandler={LogoutClicked}/>
      );
    }

    return <>Invalid view for the App component.</>;
  }

  /**
   * Event handler
   */

  const LogoutClicked = () => {
    localStorage.removeItem('login_token');
    setView(VIEW.LoginForm);
    toast.success("Successfully logged out.");
  }

  const LoginClicked = async (USER_EMAIL : string, USER_PASSWORD: string) => {
    try {
      const payload = {USER_EMAIL, USER_PASSWORD};
      const user = await post(END_POINTS.Login, payload);

      localStorage.setItem('login_token', user.token);
      setLoggedInUser({USER_FULL_NAME:`${user.USER_LNAME}, ${user.USER_FNAME}`, USER_ID:user.USER_ID});
      setView(VIEW.AppHome);
    } catch (error : any) {
      toast.error(error.message, {autoClose: false});
    }
  }

  const RegisterClicked = async (USER_EMAIL: string, USER_FNAME: string, USER_LNAME: string, USER_PASSWORD: string) => {
    try {
      const payload = {USER_EMAIL, USER_FNAME, USER_LNAME, USER_PASSWORD};
      const data = await post(END_POINTS.Users, payload);

      toast.success('Registration is successful.');
      setView(VIEW.LoginForm);
    } catch (error : any) {
      toast.error(error.message, {autoClose: false});
    }
  }

  const ShowRegistrationClicked = () => {
    setView(VIEW.RegistrationForm);
  }

  const ShowLoginClicked = () => {
    setView(VIEW.LoginForm);
  }

  return (
    <>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Expense Tracker</h1>
      </div>
      {loadContent()}
    </>
  );
}

export default App;