import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import { clearTickets } from "../actions/ticketAction";

export default function NavBar() {
  const { authTokens, setAuthTokens } = useAuth();

  function logOut() {
    clearTickets();
    setAuthTokens("");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <span className="navbar-brand" href="#">
        iTicket
      </span>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            {authTokens.role === "support" ? (
              <Link to="/support" className="nav-link">
                Support Page
              </Link>
            ) : (
              <Link to="/tickets" className="nav-link">
                Tickets
              </Link>
            )}
          </li>
          {authTokens.role === "support" ? (
            <li className="nav-item">
              <Link to="/categories" className="nav-link">
                Manage Categories
              </Link>
            </li>
          ) : (
            ""
          )}
        </ul>
        {authTokens ? (
          <div>
            <ul className="navbar-nav">
              <li className="nav-item">
                <button
                  className="btn btn-outline-danger mr-1"
                  onClick={logOut}
                >
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            {" "}
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/register" className="btn btn-outline-info mr-1">
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="btn btn-outline-success mr-1">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
    </nav>
  );
}
