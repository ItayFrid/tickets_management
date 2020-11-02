import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthContext } from "./context/auth";
import PrivateRoute from "./components/PrivateRoute";

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
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  };
  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/tickets" component={TicketsList} />
          <PrivateRoute path="/support" component={SupportPage} />
          <PrivateRoute path="/createticket" component={CreateTicket} />
          <PrivateRoute path="/categories" component={CategoriesPage} />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
