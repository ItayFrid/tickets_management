import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/auth";
import { clearTickets } from "../actions/ticketAction";
import axios from "axios";

export default class NavBar extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    clearTickets();
    axios.post("users/logout", this.context.authTokens).then(() => {});
    this.context.setAuthTokens("");
  }

  render() {
    const { userDetails } = this.props;
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
              {userDetails.role === "support" ? (
                <Link to="/support" className="nav-link">
                  Support Page
                </Link>
              ) : (
                ""
              )}
              {userDetails.role === "user" ? (
                <Link to="/tickets" className="nav-link">
                  Tickets
                </Link>
              ) : (
                ""
              )}
            </li>
            {userDetails.role === "support" ? (
              <li className="nav-item">
                <Link to="/categories" className="nav-link">
                  Manage Categories
                </Link>
              </li>
            ) : (
              ""
            )}
          </ul>
          {this.context.authTokens ? (
            <div>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger mr-1"
                    onClick={this.logOut}
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
}
