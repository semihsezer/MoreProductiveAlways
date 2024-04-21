"use client";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useEffect, useState } from "react";

import { UserShortcutAPI } from "../api/UserShortcutAPI";
import UserShortcutTable from "../components/UserShortcutTable";

export default function UserShortcutsPage({ msg }) {
  const [shortcuts, setShortcuts] = useState([]);

  function callAPI() {
    try {
      UserShortcutAPI.getAll().then((res) => setShortcuts(res.data));
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <>
      <UserShortcutTable shortcuts={shortcuts} />
    </>
  );
}
