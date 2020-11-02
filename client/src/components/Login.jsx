import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Login() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { authTokens, setAuthTokens } = useAuth();

  function formIsValid() {
    const _errors = {};
    if (!username) _errors.username = "Username is required";
    if (!password) _errors.password = "Password is required";
    setErrors(_errors);
    // Form is valid if the errors object has no properties
    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    else {
      axios
        .post("http://tickets/users/login", {
          username,
          password,
        })
        .then((result) => {
          console.log(result.data);
          if (!result.data.error) {
            setAuthTokens(result.data);
            setLoggedIn(true);
          } else {
            setErrors({ loginFailed: result.data.error });
          }
        });
    }
  }

  if (isLoggedIn) {
    if (authTokens.role === "support") return <Redirect to="/support" />;
    else return <Redirect to="/tickets" />;
  }

  return (
    <div className="container">
      <h1 className="display-3">Login</h1>
      <hr />
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group row">
            <label htmlFor="username" className="col-sm-1 col-form-label">
              <FontAwesomeIcon icon={faUser} />
            </label>
            <div className="col-sm-5">
              <input
                value={username}
                className="form-control"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                type="text"
                placeholder="username"
              />
              {errors.username && (
                <div className="text-danger">{errors.username}</div>
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
                  setPassword(e.target.value);
                }}
              />
              {errors.password && (
                <div className="text-danger">{errors.password}</div>
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
              {errors.loginFailed && (
                <div className="text-danger my-1">{errors.loginFailed}</div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
