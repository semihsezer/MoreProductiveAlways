import React, { useState } from "react";
import { getAuthAPI } from "../api/Base";
import { onGoogleLogin } from "../auth/GoogleLogin";

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
    <div>
      <h2>Sign up</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>Email:</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={onGoogleLogin}>Sign up with Google</button>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
