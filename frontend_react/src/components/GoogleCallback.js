import React, { useState, useEffect } from "react";
import { getAuthAPI } from "../api/Base";
import { ProgressSpinner } from "primereact/progressspinner";

const AuthAPI = getAuthAPI();

const GoogleCallback = (redirect_url) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    let redirect_url = null;
    if (state && state !== "null") {
      redirect_url = state;
    } else {
      redirect_url = "/discover";
    }

    AuthAPI.googleCallback(code).then(() => {
      window.location = redirect_url;
    });
  }, []);

  return (
    <div style={{ "padding-top": "10em" }}>
      <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="8" fill="var(--surface-ground)" />
      <p>We are redirecting you...</p>
    </div>
  );
};

export default GoogleCallback;
