"use client";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useEffect, useState } from "react";

import { UserShortcutAPI } from "../api/UserShortcutAPI";
import UserShortcutTable from "../components/UserShortcutTable";

export default function UserShortcutsPage({ msg }) {
  const [shortcuts, setShortcuts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function callAPI() {
    UserShortcutAPI.getAll()
      .then((res) => {
        setShortcuts(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {!isLoading && <UserShortcutTable shortcuts={shortcuts} />}
    </>
  );
}
