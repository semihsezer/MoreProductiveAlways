import React, { useState } from "react";
import { getAuthAPI } from "../api/Base";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { onGoogleLogin } from "../auth/GoogleLogin";
import GoogleButton from "react-google-button";

const AuthAPI = getAuthAPI();

const Signup = (redirect_url) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    AuthAPI.signup(email, password, confirmPassword).then(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const next = urlParams.get("next");
      redirect_url = next || "/discover";
      window.location.href = redirect_url;
    });
  };

  return (
    <div style={{ display: "inline-block", maxWidth: "300px" }}>
      <form onSubmit={handleSignup}>
        <h2>Sign up</h2>
        <div>
          <InputText
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: "block", width: "100%" }}
          />
          <Password
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            feedback={false}
            inputStyle={{ display: "block", width: "100%", minWidth: "300px", marginTop: "15px" }}
            toggleMask
          />
          <Password
            value={confirmPassword}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            feedback={false}
            inputStyle={{ display: "block", width: "100%", minWidth: "300px", marginTop: "15px" }}
            toggleMask
          />
          <Button
            type="submit"
            label="Sign Up"
            icon="pi pi-sign-in"
            severity="success"
            style={{ display: "block", width: "100%", minWidth: "300px", marginTop: "15px" }}
          />
        </div>
      </form>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
        <GoogleButton label="Sign Up with Google" style={{ textAlign: "-webkit-center" }} onClick={onGoogleLogin} />
      </div>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
