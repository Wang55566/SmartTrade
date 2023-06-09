import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";

import login_picture from '../../login picture.png'
import * as assetActions from '../../store/asset';

import './LoginPage.css'

function Login() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) {
    dispatch(assetActions.getAll());
    return <Redirect to="/main" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  return (
    <>
      <div className='login-whole-page'>
      <div className="login-page">

        <div>
          <img src={login_picture} alt="login_picture" width='800px' height='800px' style={{ borderRadius: '10px', border:'1px solid lightgrey' }}/>
        </div>

        <div className="login-form">
          <h1>Log In</h1>
          <form onSubmit={handleSubmit}>
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
            <label>
              Email
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <div className='login-page-buttons'>
              <button type="submit" className='login-page-login-button'>Log In</button>
              <button
                    type='submit'
                    onClick={() => {
                      setEmail('demo2@aa.io');
                      setPassword('password');
                    }}
                    className="login-demo-user">
                    Log in as a Demo User
              </button>
              <NavLink to="/signup" className='login-page-signup-button'>Create your account</NavLink>
            </div>
          </form>
        </div>

      </div>
      </div>
    </>
  );
}

export default Login;
