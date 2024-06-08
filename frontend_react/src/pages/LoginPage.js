import React, { useState } from "react";
import { AuthAPI } from "../api/AuthAPI";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    AuthAPI.getNewToken(username, password).then(() => {
      window.location.href = "/discover";
    });
  };

  const constructGoogleLoginLink = () => {
    const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const clientId = "676704901081-i17eo6no2dqsj3eulf2dr7v191ftmu9p.apps.googleusercontent.com";
    const redirectUri = "http://localhost:8000/accounts/google/login/callback/";
    const scope = "email profile";
    const responseType = "code";
    const state = "djDUsTQ1zAXIIfz0"; // TODO: state needs to come from the backend

    return `${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&state=${state}`;
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
        <a href={constructGoogleLoginLink()}>Login with Google</a>
      </form>
    </div>
  );
};

export default Login;
