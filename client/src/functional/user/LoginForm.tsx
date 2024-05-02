import { useState } from "react";
import './login.css';
import { toast } from 'react-toastify';

interface Props {
    loginHandler: (email : string, password: string) => void;
    showRegistrationHandler: () => void;
}

/**
 * Component for user login.
 */
function LoginForm({loginHandler, showRegistrationHandler}:Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      toast.error('Email should be in format name@domain.com');
      isValid = false;
    }

    if (password == '') {
      toast.error('Password is required');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Handles the login button click event.
   * Calls the loginHandler function if input is valid.
   */
  const LoginClicked = () => {
    if (validateInput()) {
      loginHandler(email, password);
    }
  }

  /**
   * Renders the login form.
   */
  return (
    <div className="card">
        <h2 className="m-5">Login</h2>
        
        <div className="form-floating mb-3">
          <input type="email" className="form-control" id="inputEmail" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <label htmlFor="inputEmail">Email address</label>
        </div>
        
        <div className="form-floating mb-3">
          <input type="password" className="form-control" id="inputPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <label htmlFor="inputPassword">Password</label>
        </div>

        <button className="loginBtn" onClick={LoginClicked}>Login</button>
        <br/>
        <button className="btn btn-link" onClick={showRegistrationHandler}>Register new account</button>
    </div>
  );
}

export default LoginForm;
