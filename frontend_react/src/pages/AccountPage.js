import React from "react";
import { AuthAPI } from "../api/AuthAPI";
import { Button } from "primereact/button";

export default function AccountPage({}) {
  const onLogoutPressed = (e) => {
    e.preventDefault();
    AuthAPI.logout();
  };

  return (
    <div>
      <h1>Account</h1>
      <div className="flex flex-wrap gap-2">
        <Button label="Logout" icon="pi pi-plus" severity="success" onClick={onLogoutPressed} />
      </div>
    </div>
  );
}
