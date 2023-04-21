import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";

import Assets from "./components/Assets";
import SingleAsset from "./components/SingleAsset";
import Home from "./components/Home";
import Login from "./components/LoginPage";
import Signup from "./components/SignupPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <Navigation isLoaded={isLoaded} />
            <Home />
          </Route>
          <Route path="/main">
            <Navigation isLoaded={isLoaded} />
            <Assets />
          </Route>
          <Route path="/login" >
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/assets/:id">
            <Navigation isLoaded={isLoaded} />
            <SingleAsset/>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
