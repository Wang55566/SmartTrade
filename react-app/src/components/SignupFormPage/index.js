import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { signUp } from "../../store/session";
import './SignupForm.css';

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  let history = useHistory();

  if (sessionUser) return <Redirect to="/app/all" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
        const data = await dispatch(signUp(username, email, password));
        if (data) {
          setErrors(data)
        } else {
          history.push('/app/all')
        }

    } else {
        setErrors(['Confirm Password field must be the same as the Password field']);
    }
  };

  return (
    <div className="grid-1-1">
      <div className="bg-blue-fcc color-gray-9d9 height-88vh">
        <p className="fontS-200rem fontW-600 width-max-450p mrg-lr-auto">
          Join millions of people getting more organized and productive!
        </p>
      </div>
      <div>
        <div className="txt-ali-center">
          <h1>Sign Up</h1>
          <h3>Sign up for free</h3>
        </div>
        <form onSubmit={handleSubmit} className="flx-col flx-wrap flx-ac-center gap15p">
          <ul className="color-red fontS-115rem">
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
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
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
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


          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
            className="fontS-125rem border-gray-9d9 pad10p borderR-5p"
          />

          <button type="submit"
            className="bg-blue-dff color-white cursor-p border-0 pad-tb-10p fontS-115rem borderR-5p">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupFormPage;
