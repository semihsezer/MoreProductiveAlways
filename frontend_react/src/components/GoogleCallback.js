import React, { useEffect } from "react";
import { AuthAPI } from "../api/AuthAPI";

const GoogleCallback = (redirect_url) => {
  useEffect(() => {
    // get code from the query string
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

  return (
    <div>
      <h2>Google Callback</h2>
    </div>
  );
};

export default GoogleCallback;
