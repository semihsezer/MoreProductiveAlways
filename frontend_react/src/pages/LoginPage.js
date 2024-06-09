import React, { useState } from "react";
import { AuthAPI, getCSRFToken } from "../api/AuthAPI";

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

  function postForm(action, data) {
    const f = document.createElement("form");
    f.method = "POST";
    f.action = action;

    for (const key in data) {
      const d = document.createElement("input");
      d.type = "hidden";
      d.name = key;
      d.value = data[key];
      f.appendChild(d);
    }
    document.body.appendChild(f);
    f.submit();
  }

  const onGoogleLogin = () => {
    const process = "login";
    postForm("/_allauth/browser/v1/auth/provider/redirect", {
      provider: "google",
      callback_url: "http://localhost:3000/discover", //TODO: change to URL of site
      process,
      csrfmiddlewaretoken: getCSRFToken(),
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
    </div>
  );
};

export default Login;
