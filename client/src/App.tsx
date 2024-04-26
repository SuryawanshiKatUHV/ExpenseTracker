import { ReactNode, useState } from 'react';
import './App.css'
import Layout from './layout/Layout';
import LoginForm from './functional/user/LoginForm';
import RegistrationForm from './functional/user/RegistrationForm';
import {VIEW, post} from './common/Utilities';
import Alert from './common/Alert';
import { END_POINTS } from './common/Utilities';

function App() {
  
  const [view, setView] = useState(VIEW.LoginForm);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
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
  }

  const LoginClicked = async (USER_EMAIL : string, USER_PASSWORD: string) => {
    try {
      const payload = {USER_EMAIL, USER_PASSWORD};
      const user = await post(END_POINTS.Login, payload);

      localStorage.setItem('login_token', user.token);
      setLoggedInUser({USER_FULL_NAME:`${user.USER_LNAME}, ${user.USER_FNAME}`, USER_ID:user.USER_ID});
      setView(VIEW.AppHome);
    } catch (error : any) {
      setError(error.message);
    }
  }

  const RegisterClicked = async (USER_EMAIL: string, USER_FNAME: string, USER_LNAME: string, USER_PASSWORD: string) => {
    try {
      const payload = {USER_EMAIL, USER_FNAME, USER_LNAME, USER_PASSWORD};
      const data = await post(END_POINTS.Users, payload);

      setInfo('Registration is successful.');
      setView(VIEW.LoginForm);
    } catch (error : any) {
      setError(error.message);
    }
  }

  const ShowRegistrationClicked = () => {
    setView(VIEW.RegistrationForm);
  }

  const ShowLoginClicked = () => {
    setView(VIEW.LoginForm);
  }

  const ErrorClosed = () => {
    setError('');
  }

  const InfoClosed = () => {
    setInfo('');
  }

  return (
    <>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Expense Tracker</h1>
      </div>
      {error && (<Alert subject="Error" message={error} closeHandler={ErrorClosed}/>)}
      {info && (<Alert subject="Information" message={info} closeHandler={InfoClosed}/>)}
      {loadContent()}
    </>
  );
}

export default App;