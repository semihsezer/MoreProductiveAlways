import React, { useState } from "react";
import { getAuthAPI } from "../api/Base";
import { onGoogleLogin } from "../auth/GoogleLogin";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import GoogleButton from "react-google-button";

const AuthAPI = getAuthAPI();

const Login = (redirect_url) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    AuthAPI.login(username, password)
      .then(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const next = urlParams.get("next");
        redirect_url = next || "/discover";
        window.location.href = redirect_url;
      })
      .catch((error) => {
        setErrorMessage(error.response.data.non_field_errors);
      });
  };

  return (
    <div style={{ display: "inline-block", maxWidth: "300px" }}>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <InputText
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ display: "block", width: "100%" }}
        />
        <Password
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          feedback={false}
          inputStyle={{ display: "block", width: "100%", minWidth: "300px", marginTop: "15px" }}
          helpText="test"
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <Button
          type="submit"
          label="Login"
          icon="pi pi-sign-in"
          severity="success"
          style={{ display: "block", width: "100%", minWidth: "300px", marginTop: "15px" }}
        />
      </form>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <GoogleButton style={{ textAlign: "-webkit-center", marginTop: "15px" }} onClick={onGoogleLogin} />
      </div>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
