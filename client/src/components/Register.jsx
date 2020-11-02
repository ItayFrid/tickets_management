import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey, faIdCard } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/auth";
import { addUser } from "../actions/userAction";
import axios from "axios";

export default function Register() {
  const { authTokens } = useAuth();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState();
  const [user, setUser] = useState({
    username: "",
    password: "",
    passwordValid: "",
    name: "",
    role: "user",
  });

  function checkUsername() {
    if (!user.username)
      setErrors({ ...errors, username: "Username is required" });
    else {
      const url = "http://tickets/users/username/".concat(user.username);
      axios.get(url).then((res) => {
        if (res.data.error) {
          alert(res.data.text);
          setErrors({ ...errors, userExists: res.data.text });
        } else alert(res.data.text);
      });
    }
  }

  function formIsValid() {
    const _errors = {};

    if (!user.username) _errors.username = "Username is required";
    if (!user.password) _errors.password = "Password is required";
    if (user.password !== user.passwordValid)
      _errors.passwordValid = "Passwords do not match";
    if (!user.name) _errors.name = "Name is required";

    setErrors(_errors);
    // Form is valid if the errors object has no properties
    return Object.keys(_errors).length === 0;
  }

  function handleChange({ target }) {
    setUser({ ...user, [target.name]: target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    addUser(user);
    setUser({
      username: "",
      password: "",
      passwordValid: "",
      name: "",
      role: "user",
    });
    setMessage("User Registered");
  }
  // If user is logged in
  if (authTokens) return <Redirect to="/" />;

  return (
    <div className="container">
      <h1 className="display-3">Register</h1>
      <hr />
      <div className="container">
        <form onSubmit={handleSubmit}>
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
                onChange={handleChange}
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
                onClick={checkUsername}
              >
                Check Username
              </button>
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
                onChange={handleChange}
                value={user.password}
              />
              {errors.password && (
                <div className="text-danger">{errors.password}</div>
              )}
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="passwordValid" className="col-sm-1 col-form-label">
              <FontAwesomeIcon icon={faKey} />
            </label>
            <div className="col-sm-5">
              <input
                type="password"
                className="form-control"
                placeholder="Enter Again"
                name="passwordValid"
                id="passwordValid"
                onChange={handleChange}
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
                onChange={handleChange}
                value={user.name}
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
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
