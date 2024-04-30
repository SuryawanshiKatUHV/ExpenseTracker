import { useState } from "react";
import './login.css';
import { toast } from 'react-toastify';

interface Props {
    loginHandler: (email : string, password: string) => void;
    showRegistrationHandler: () => void;
}

function LoginForm({loginHandler, showRegistrationHandler}:Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({email:'', password:''});

  /**
   * Operations
   */
  const validateInput = () : boolean => {
    let errors = {email:'', password:''};

    if (email == "") {
      toast.error('Email is required', {autoClose: false});
    }
    else if (email.indexOf('@') == -1 || email.indexOf('.') == -1) {
      toast.error('Email should be in format name@domain.com', { autoClose: false});
    }

    if (password == '') {
      toast.error('Password is required', {autoClose: false});
    }

    setErrors(errors);
    return !(errors.email || errors.password);
  }

  /**
   * Event Handler
   */
  const LoginClicked = () => {
    if (validateInput())
      loginHandler(email, password);
  }

  return (
    <div className="card">
        <h2 className="m-5">Login</h2>
        
        <div className="form-floating mb-3">
          <input type="email" className="form-control" id="inputEmail" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <label htmlFor="inputEmail">Email address</label>
          {/* {errors.email && <p style={{color:'red'}}>{errors.email}</p>} */}
        </div>
        
        <div className="form-floating mb-3">
          <input type="password" className="form-control" id="inputPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <label htmlFor="inputPassword">Password</label>
          {/* {errors.password && <p style={{color:'red'}}>{errors.password}</p>} */}
        </div>

        <button className="loginBtn" onClick={LoginClicked}>Login</button>
        <br/>
        <button className="btn btn-link" onClick={showRegistrationHandler}>Register new account</button>
    </div>
  );
}

export default LoginForm;
