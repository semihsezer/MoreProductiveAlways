import React, { useState } from "react";
import { getAuthAPI } from "../api/Base";

const AuthAPI = getAuthAPI();

const Login = (redirect_url) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    AuthAPI.login(username, password).then(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const next = urlParams.get("next");
      redirect_url = next || "/discover";
      window.location.href = redirect_url;
    });
  };

  const onGoogleLogin = () => {
    // TODO: figure out which of these workflows to pick
    // TODO: figure out how to pass next after Google login
    // TODO: Add refresh token workflow
    // TODO: Handle backend being down on GoogleCallback page
    // TODO: Add spinner to GoogleCallback page
    const urlParams = new URLSearchParams(window.location.search);
    const next = urlParams.get("next");
    // TODO: Fix URL
    const redirect_url = encodeURI("http://localhost:3000/social/google/callback");
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${redirect_url}&prompt=select_account&response_type=code&client_id=676704901081-i17eo6no2dqsj3eulf2dr7v191ftmu9p.apps.googleusercontent.com&scope=openid%20email%20profile&state=${next}`;
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
      </form>
      <button onClick={onGoogleLogin}>Google</button>
    </div>
  );
};

export default Login;
