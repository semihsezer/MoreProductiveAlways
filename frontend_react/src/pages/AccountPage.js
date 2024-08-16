import React from "react";
import { useState, useEffect } from "react";
import { getAuthAPI } from "../api/Base";
import UserAPI from "../api/UserAPI";
import UserPreferenceAPI from "../api/UserPreferenceAPI";
import { Button } from "primereact/button";
import UserPreferencesForm from "../components/UserPreferencesForm";

const AuthAPI = getAuthAPI();

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [userPreferences, setUserPreferences] = useState({});
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
        setUserInfo(res.data);
      })
      .then((res) => {
        UserPreferenceAPI.get()
          .then((res) => {
            setIsLoggedIn(true);
            setIsLoading(false);
            setUserPreferences(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
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
        <div style={{ textAlign: "left" }}>
          <h1>Account</h1>
          <p>Email: {userInfo.email}</p>
          {isLoggedIn && (
            <>
              <div className="flex flex-wrap gap-2">
                <h1>Preferences</h1>
                <UserPreferencesForm userPreferences={userPreferences} />
                <br />
                <br />
                <Button label="Logout" icon="pi pi-sign-out" severity="secondary" onClick={onLogoutPressed} />
              </div>
            </>
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
