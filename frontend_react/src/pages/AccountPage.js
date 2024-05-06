import React from "react";
import { useState, useEffect } from "react";
import { AuthAPI } from "../api/AuthAPI";
import UserAPI from "../api/UserAPI";
import { Button } from "primereact/button";

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const onLogoutPressed = (e) => {
    e.preventDefault();
    AuthAPI.logout();
  };

  useEffect(() => {
    UserAPI.getProfile()
      .then((res) => {
        setIsLoading(false);
        setUserInfo(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <div>
          <h1>Account</h1>
          <p>Username: {userInfo.username}</p>
          <p>Email: {userInfo.email}</p>
          <div className="flex flex-wrap gap-2">
            <Button label="Logout" icon="pi pi-sign-out" severity="success" onClick={onLogoutPressed} />
          </div>
        </div>
      )}
    </>
  );
}
