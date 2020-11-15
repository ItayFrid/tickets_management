import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthContext from "../context/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default class Login extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      errors: {},
      username: "",
      password: "",
      role: "",
      userDetails: {},
    };
    this.formIsValid = this.formIsValid.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  formIsValid() {
    const _errors = {};
    if (!this.state.username) _errors.username = "Username is required";
    if (!this.state.password) _errors.password = "Password is required";
    this.setState({ errors: _errors });
    // Form is valid if the errors object has no properties
    return Object.keys(_errors).length === 0;
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (!this.formIsValid()) return;
    else {
      let username = this.state.username;
      let password = this.state.password;
      axios
        .post("http://tickets/users/login", {
          username,
          password,
        })
        .then((result) => {
          if (!result.data.error) {
            this.context.setAuthTokens(result.data);
            this.setState({ isLoggedIn: true });
          } else {
            this.setState({ errors: { loginFailed: result.data.error } });
          }
        });
    }
  }

  render() {
    const { username, password } = this.state;
    if (this.state.isLoggedIn) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <h1 className="display-3">Login</h1>
        <hr />
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group row">
              <label htmlFor="username" className="col-sm-1 col-form-label">
                <FontAwesomeIcon icon={faUser} />
              </label>
              <div className="col-sm-5">
                <input
                  value={username}
                  className="form-control"
                  onChange={(e) => {
                    this.setState({ username: e.target.value });
                  }}
                  type="text"
                  placeholder="username"
                />
                {this.state.errors.username && (
                  <div className="text-danger">
                    {this.state.errors.username}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="password" className="col-sm-1 col-form-label">
                <FontAwesomeIcon icon={faKey} />
              </label>
              <div className="col-sm-5">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => {
                    this.setState({ password: e.target.value });
                  }}
                />
                {this.state.errors.password && (
                  <div className="text-danger">
                    {this.state.errors.password}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group row">
              {" "}
              <div className="col-sm-5 offset-sm-1">
                <input
                  type="submit"
                  value="Login"
                  className="btn btn-outline-success"
                />
                {this.state.errors.loginFailed && (
                  <div className="text-danger my-1">
                    {this.state.errors.loginFailed}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
