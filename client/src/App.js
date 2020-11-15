import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthContext } from "./context/auth";
import PrivateRoute from "./components/PrivateRoute";
import { getUserDetails } from "./actions/userAction";

import NavBar from "./components/NavBar";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import TicketsList from "./components/TicketsList";
import CreateTicket from "./components/CreateTicket";
import SupportPage from "./components/SupportPage";
import CategoriesPage from "./components/CategoriesPage";

function App() {
  // Authentication Tokens
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  const [userDetails, setUserDetails] = useState({});
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  };
  useEffect(() => {
    if (authTokens) {
      getUserDetails(authTokens).then((res) => {
        setUserDetails(res.data);
      });
    } else {
      setUserDetails({});
    }
    return () => {};
  }, [authTokens]);
  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Router>
        <NavBar userDetails={userDetails} />
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Home userDetails={userDetails} />}
          />
          <Route path="/register" component={Register} />
          <Route
            path="/login"
            render={() => <Login userDetails={userDetails} />}
          />
          <PrivateRoute
            path="/tickets"
            component={TicketsList}
            userDetails={userDetails}
            props={{ userDetails: userDetails }}
          />
          <PrivateRoute
            path="/support"
            component={SupportPage}
            userDetails={userDetails}
            props={{ userDetails: userDetails }}
          />
          <PrivateRoute
            path="/createticket"
            component={CreateTicket}
            userDetails={userDetails}
            props={{ userDetails: userDetails }}
          />
          <PrivateRoute
            path="/categories"
            component={CategoriesPage}
            props={{ userDetails: userDetails }}
          />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
