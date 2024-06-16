import React, { useState } from "react";
import { getAuthAPI } from "../api/Base";
import { onGoogleLogin } from "../auth/GoogleLogin";

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
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
