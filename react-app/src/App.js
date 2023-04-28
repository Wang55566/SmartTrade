import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";

import Assets from "./components/Assets";
import Home from "./components/Home";
import Login from "./components/LoginPage";
import Signup from "./components/SignupPage";
import SearchResult from "./components/SearchResult";

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
          <Route path="/search/:symbol">
            <Navigation isLoaded={isLoaded} />
            <SearchResult/>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
