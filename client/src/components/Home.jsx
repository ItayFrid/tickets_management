import React, { Component } from "react";

export default class Home extends Component {
  render() {
    const page =
      this.props.userDetails.role === "support" ? "support" : "tickets";
    return (
      <div className="container">
        <h1 className="display-3">Home</h1>
        <blockquote className="blockquote text-center">
          <p className="mb-0">
            {this.props.userDetails.user_id
              ? `Go to ${page} page`
              : "Login/Register to continue."}
          </p>
        </blockquote>
      </div>
    );
  }
}
