import React from "react";
import { useState, useEffect } from "react";
import { getAuthAPI } from "../api/Base";
import UserAPI from "../api/UserAPI";
import { Button } from "primereact/button";

const AuthAPI = getAuthAPI();

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const onLogoutPressed = (e) => {
    e.preventDefault();
    AuthAPI.logout();
  };
  const onLoginPressed = (e) => {
    e.preventDefault();
    window.location.href = "/login";
  };

  useEffect(() => {
    UserAPI.getProfile()
      .then((res) => {
        setIsLoading(false);
        setUserInfo(res.data);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        setIsLoggedIn(false);
        console.log(err);
      });
  }, []);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <div>
          <h1>Account</h1>
          <p>Email: {userInfo.email}</p>
          {isLoggedIn && (
            <div className="flex flex-wrap gap-2">
              <Button label="Logout" icon="pi pi-sign-out" severity="success" onClick={onLogoutPressed} />
            </div>
          )}
          {!isLoggedIn && (
            <div className="flex flex-wrap gap-2">
              <Button label="Login" icon="pi pi-sign-out" severity="success" onClick={onLoginPressed} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
