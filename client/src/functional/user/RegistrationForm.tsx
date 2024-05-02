import { useState } from "react";
import './login.css';
import { toast } from 'react-toastify';

interface Props {
    registerHandler: (email:string, firstName: string, lastName: string, password: string) => void;
    showLoginHandler: () => void;
}

/**
 * Component for user registration.
 */
function RegistrationForm({registerHandler, showLoginHandler}:Props) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

    /**
     * Validate user input.
     */
    const validateInput = () : boolean => {
      let isValid = true;

      if (email == "") {
        toast.error('Email is required');
        isValid = false;
      }
      else if (email.indexOf('@') == -1 || email.indexOf('.') == -1) {
        toast.error('Email should be in format name@domain.com.');
        isValid = false;
      }
      
      if (firstName == '') {
        toast.error('First Name is required.');
        isValid = false;
      }
      else if (firstName.length < 3 || firstName.length > 50) {
        toast.error('First Name should be between 3 to 50 characters.');
        isValid = false;
      }
      
      if (lastName == '') {
        toast.error('Last Name is required.');
        isValid = false;
      }
      else if (lastName.length < 3 || lastName.length > 50) {
        toast.error('Last Name should be between 3 to 50 characters.');
        isValid = false;
      }

      if (password == '') {
        toast.error('Password is required.');
        isValid = false;
      }

      if (confirmedPassword == '') {
        toast.error('Confirmed Password is required.');
        isValid = false;
      }

      if (password && confirmedPassword && password != confirmedPassword) {
        toast.error('Password and Confirmed password does not match.');
        isValid = false;
      }

      return isValid;
    }

    /**
     * Event handler for the register button click
     */
    const RegisterClicked = () => {
      
      if (validateInput()) {
        registerHandler(email, firstName, lastName, password);
      }
    }

  /**
   * Renders the registration form.
   */
  return (
    <div className="card">
        <h2 className="m-5">Register a new account</h2>
        
        <div className="form-floating mb-3">
          <input type="email" className="form-control" id="inputEmail" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <label htmlFor="inputEmail">Email address</label>
        </div>
        
        <div className="form-floating mb-3">
          <input type="text" className="form-control" id="inputFirstName" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
          <label htmlFor="inputFirstName">First Name</label>
        </div>
        <div className="form-floating mb-3">
          <input type="text" className="form-control" id="inputLastName" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
          <label htmlFor="inputLastName">Last Name</label>
        </div>
        
        <div className="form-floating mb-3">
          <input type="password" className="form-control" id="inputPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <label htmlFor="inputPassword">Password</label>
        </div>
        <div className="form-floating mb-3">
          <input type="password" className="form-control" id="inputConfirmPassword" placeholder="Confirm Password" value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)}/>
          <label htmlFor="inputConfirmPassword">Confirm Password</label>
        </div>

        <button className="registerBtn" onClick={RegisterClicked}>Register</button>
        <br/>
        <button className="btn btn-link" onClick={showLoginHandler}>Back to Login</button>
    </div>
  );
}

export default RegistrationForm;
