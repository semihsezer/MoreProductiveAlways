import React, { useState, useEffect } from "react";
import { getAuthAPI } from "../api/Base";

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

    AuthAPI.google_callback(code).then(() => {
      window.location = redirect_url;
    });
  }, []);

  return <div>{isLoading && <p>We are redirecting you...</p>}</div>;
};

export default GoogleCallback;
