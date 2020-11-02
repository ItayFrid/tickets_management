import React from "react";
import { useAuth } from "../context/auth";

export default function Home() {
  const { authTokens } = useAuth();

  return (
    <div className="container">
      <h1 className="display-3">Home</h1>
      <blockquote className="blockquote text-center">
        <p className="mb-0">
          {authTokens ? "Go to tickets page" : "Login/Register to continue."}
        </p>
      </blockquote>
    </div>
  );
}
