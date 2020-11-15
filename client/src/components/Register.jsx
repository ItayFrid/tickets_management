import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey, faIdCard } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../context/auth";
import { addUser } from "../actions/userAction";
import axios from "axios";

export default class Register extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      errors: "",
      message: "",
      user: {
        username: "",
        password: "",
        passwordValid: "",
        name: "",
        role: "user",
      },
      usernameMessage: "",
    };
    this.checkUsername = this.checkUsername.bind(this);
    this.formIsValid = this.formIsValid.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  checkUsername() {
    if (!this.state.user.username)
      this.setState({
        errors: { ...this.state.errors, username: "Username is required" },
      });
    else {
      const url = "http://tickets/users/".concat(this.state.user.username);
      axios.get(url).then((res) => {
        if (res.data.error) {
          this.setState({ usernameMessage: res.data.text });
          this.setState({
            errors: { ...this.state.errors, userExists: res.data.text },
          });
        } else this.setState({ usernameMessage: res.data.text });
      });
    }
  }

  formIsValid() {
    const errors = {};

    if (!this.state.user.username) errors.username = "Username is required";
    if (!this.state.user.password) errors.password = "Password is required";
    if (this.state.user.password !== this.state.user.passwordValid)
      errors.passwordValid = "Passwords do not match";
    if (!this.state.user.name) errors.name = "Name is required";

    this.setState(errors);
    // Form is valid if the errors object has no properties
    return Object.keys(errors).length === 0;
  }

  handleChange(e) {
    this.setState({
      user: { ...this.state.user, [e.target.name]: e.target.value },
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.formIsValid()) return;
    addUser(this.state.user);
    this.setState({
      user: {
        username: "",
        password: "",
        passwordValid: "",
        name: "",
        role: "user",
      },
    });
    this.setState({ message: "User Registered" });
  }

  render() {
    const { user, errors, message, usernameMessage } = this.state;
    return (
      <div className="container">
        <h1 className="display-3">Register</h1>
        <hr />
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group row">
              <label htmlFor="username" className="col-sm-1 col-form-label">
                <FontAwesomeIcon icon={faUser} />
              </label>
              <div className="col-sm-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Username"
                  name="username"
                  id="username"
                  onChange={this.handleChange}
                  value={user.username}
                />
                {errors.username && (
                  <div className="text-danger">{errors.username}</div>
                )}
                {errors.userExists && (
                  <div className="text-danger">{errors.username}</div>
                )}
              </div>
              <div className="col-sm-6">
                <button
                  className="btn btn-sm btn-outline-info"
                  onClick={this.checkUsername}
                >
                  Check Username
                </button>{" "}
                {usernameMessage}
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
                  name="password"
                  id="password"
                  onChange={this.handleChange}
                  value={user.password}
                />
                {errors.password && (
                  <div className="text-danger">{errors.password}</div>
                )}
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="passwordValid"
                className="col-sm-1 col-form-label"
              >
                <FontAwesomeIcon icon={faKey} />
              </label>
              <div className="col-sm-5">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Again"
                  name="passwordValid"
                  id="passwordValid"
                  onChange={this.handleChange}
                  value={user.passwordValid}
                />
                {errors.passwordValid && (
                  <div className="text-danger">{errors.passwordValid}</div>
                )}
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="name" className="col-sm-1 col-form-label">
                <FontAwesomeIcon icon={faIdCard} />
              </label>
              <div className="col-sm-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Full Name"
                  name="name"
                  id="name"
                  onChange={this.handleChange}
                  value={user.name}
                />
                {errors.name && (
                  <div className="text-danger">{errors.name}</div>
                )}
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-5 offset-sm-1">
                <input
                  type="submit"
                  value="Register"
                  className="btn btn-outline-primary"
                />
                {message && (
                  <div className="text-success text-center">{message}</div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
