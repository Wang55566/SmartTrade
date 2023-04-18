import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import './LoginForm.css';

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  let history = useHistory();

  if (sessionUser) return <Redirect to="/app/all" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      history.push('/app/all')
    }
  };

  return (
    <div className="grid-1-1">
      <div className="bg-blue-fcc color-white height-88vh">
        <blockquote>
          <p className="fontS-200rem fontW-600 width-max-450p mrg-lr-auto">
            "Hope you enjoy your journey with us"
          </p>
          <footer className="txt-ali-center fontS-125rem">
            -- Group 5
          </footer>

        </blockquote>
      </div>
      <div>
        <div className="txt-ali-center">
          <h1>Log In</h1>
          <h3>Been here before? Welcome back!</h3>
        </div>
        <form onSubmit={handleSubmit} className="flx-col flx-wrap flx-ac-center gap15p">
          <ul className="color-red fontS-115rem">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>

          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="fontS-125rem border-gray-9d9 pad10p borderR-5p"
          />


          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="fontS-125rem border-gray-9d9 pad10p borderR-5p"
          />

          <button type="submit" className="bg-blue-dff color-white cursor-p border-0 pad-tb-10p fontS-115rem borderR-5p">
            Log In
          </button>
          <button
            type='submit'
            onClick={() => {
              setEmail('demo@aa.io');
              setPassword('password');
            }}
            className="bg-blue-dff color-white cursor-p border-0 pad-tb-10p fontS-115rem borderR-5p">
            Log in as Demo User
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginFormPage;
