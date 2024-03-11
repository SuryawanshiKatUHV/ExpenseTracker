import { ReactNode, useState } from 'react';
import './App.css'
import Layout from './components/Layout';
import LoginForm from './components/functional/LoginForm';
import RegistrationForm from './components/functional/RegistrationForm';
import {VIEW, post} from './Common';
import Alert from './components/Alert';
import { END_POINTS } from './Common';

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
    setView(VIEW.LoginForm);
  }

  const LoginClicked = async (USER_EMAIL : string, USER_PASSWORD: string) => {
    try {
      const payload = {USER_EMAIL, USER_PASSWORD};
      const user = await post(END_POINTS.Login, payload);

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
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', textAlign: 'center' }}>
        <h1>Expense Tracker</h1>
      </div>
      {error && (<Alert subject="Error" message={error} closeHandler={ErrorClosed}/>)}
      {info && (<Alert subject="Information" message={info} closeHandler={InfoClosed}/>)}
      {loadContent()}
    </>
  );
}

export default App;