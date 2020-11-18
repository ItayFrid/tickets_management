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
      user: { username: "", password: "" },
      message: "",
      counter: 1,
      disabled: false,
    };
    this.formIsValid = this.formIsValid.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleButton = this.handleButton.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
  }
  onUsernameChange(e) {
    axios
      .post("http://tickets/checks/username", { text: e.target.value })
      .then((res) => {
        this.setState({
          user: { ...this.state.user, username: res.data.text },
        });
      });
  }
  handleChange(e) {
    axios
      .post("http://tickets/checks/password", { text: e.target.value })
      .then((res) => {
        this.setState({
          user: { ...this.state.user, [e.target.name]: res.data.text },
        });
      });
    // this.setState({
    //   user: { ...this.state.user, [e.target.name]: e.target.value },
    // });
  }

  formIsValid() {
    const _errors = {};
    if (!this.state.user.username) _errors.username = "Username is required";
    if (!this.state.user.password) _errors.password = "Password is required";
    this.setState({ errors: _errors });
    // Form is valid if the errors object has no properties
    return Object.keys(_errors).length === 0;
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.formIsValid()) return;
    else {
      const username = this.state.user.username;
      const password = this.state.user.password;
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

  handleButton() {
    this.setState({ counter: this.state.counter + 1 });
    this.setState({
      message: `attemp ${this.state.counter} of 3.`,
    });
    if (this.state.counter >= 3) {
      this.setState({
        message: `attemp ${this.state.counter} of 3. Button disabled.`,
        disabled: true,
      });
    }
  }
  render() {
    const { user, disabled } = this.state;
    if (this.props.userDetails.role === "user") {
      return <Redirect to="/tickets" />;
    }
    if (this.props.userDetails.role === "support") {
      return <Redirect to="/support" />;
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
                  className="form-control"
                  onChange={this.onUsernameChange}
                  name="username"
                  id="username"
                  value={user.username}
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
                  value={user.password}
                  name="password"
                  id="password"
                  onChange={this.handleChange}
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
                  onClick={this.handleButton}
                  disabled={disabled}
                />
                {this.state.errors.loginFailed && (
                  <div className="text-danger my-1">
                    {this.state.errors.loginFailed}
                  </div>
                )}
              </div>
              {this.state.message}
            </div>
          </form>
        </div>
      </div>
    );
  }
}
