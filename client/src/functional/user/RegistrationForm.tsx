import { useState } from "react";
import './login.css';

interface Props {
    registerHandler: (email:string, firstName: string, lastName: string, password: string) => void;
    showLoginHandler: () => void;
}

function RegistrationForm({registerHandler, showLoginHandler}:Props) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errors, setErrors] = useState({email:'', firstName:'', lastName:'', password:'', confirmedPassword:''});

    /**
     * Operations
     */
 
    const validateInput = () : boolean => {
      let errors = {email:'', firstName:'', lastName:'', password:'', confirmedPassword:''};

      if (email == "") {
        errors["email"] = "Email is required.";
      }
      else if (email.indexOf('@') == -1 || email.indexOf('.') == -1) {
        errors["email"] = "Email should be in format name@domain.com.";
      }
      
      if (firstName == '') {
        errors["firstName"] = "First Name is required.";
      }
      else if (firstName.length < 3 || firstName.length > 50) {
        errors["firstName"] = "First Name should be between 3 to 50 characters.";
      }
      
      if (lastName == '') {
        errors["lastName"] = "Last Name is required.";
      }
      else if (lastName.length < 3 || lastName.length > 50) {
        errors["lastName"] = "Last Name should be between 3 to 50 characters.";
      }

      if (password == '') {
        errors["password"] = "Password is required.";
      }

      if (confirmedPassword == '') {
        errors["confirmedPassword"] = "Confirmed Password is required.";
      }

      if (password && confirmedPassword && password != confirmedPassword) {
        errors["password"] = "Password does not match with confirm password.";
        errors["confirmedPassword"] = "Confirmed Password does not match with password.";
      }

      setErrors(errors);
      return !(errors.email || errors.firstName || errors.lastName || errors.password || errors.confirmedPassword);
    }

    /**
     * Event handler
     */

    const RegisterClicked = () => {
      
      if (validateInput())
        registerHandler(email, firstName, lastName, password);
    }

  return (
    <div className="card">
        <h2 className="m-5">Register a new account</h2>
        
        <div className="form-floating mb-3">
          <input type="email" className="form-control" id="inputEmail" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <label htmlFor="inputEmail">Email address</label>
          {errors.email && <p style={{color:'red'}}>{errors.email}</p>}
        </div>
        
        <div className="form-floating mb-3">
          <input type="text" className="form-control" id="inputFirstName" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
          <label htmlFor="inputFirstName">First Name</label>
          {errors.firstName && <p style={{color:'red'}}>{errors.firstName}</p>}
        </div>
        <div className="form-floating mb-3">
          <input type="text" className="form-control" id="inputLastName" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
          <label htmlFor="inputLastName">Last Name</label>
          {errors.lastName && <p style={{color:'red'}}>{errors.lastName}</p>}
        </div>
        
        <div className="form-floating mb-3">
          <input type="password" className="form-control" id="inputPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <label htmlFor="inputPassword">Password</label>
          {errors.password && <p style={{color:'red'}}>{errors.password}</p>}
        </div>
        <div className="form-floating mb-3">
          <input type="password" className="form-control" id="inputConfirmPassword" placeholder="Confirm Password" value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)}/>
          <label htmlFor="inputConfirmPassword">Confirm Password</label>
          {errors.confirmedPassword && <p style={{color:'red'}}>{errors.confirmedPassword}</p>}
        </div>

        <button className="registerBtn" onClick={RegisterClicked}>Register</button>
        <br/>
        <button className="btn btn-link" onClick={showLoginHandler}>Back to Login</button>
    </div>
  );
}

export default RegistrationForm;
