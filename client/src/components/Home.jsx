import React, { Component } from "react";
import AuthContext from "../context/auth";

export default class Home extends Component {
  static contextType = AuthContext;

  render() {
    return (
      <div className="container">
        <h1 className="display-3">Home</h1>
        <blockquote className="blockquote text-center">
          <p className="mb-0">
            {this.props.userDetails
              ? "Go to tickets page"
              : "Login/Register to continue."}
          </p>
        </blockquote>
      </div>
    );
  }
}
