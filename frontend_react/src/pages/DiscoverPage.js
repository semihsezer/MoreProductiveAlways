"use client";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useEffect, useState } from "react";

import { UserShortcutAPI } from "../api/UserShortcutAPI";
import UserShortcutTable from "../components/UserShortcutTable";

export default function DiscoverPage({ msg }) {
  const [shortcuts, setShortcuts] = useState([]);

  useEffect(() => {
    try {
      UserShortcutAPI.discover().then((res) => setShortcuts(res.data));
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      <p>Discover</p>
      <div style={{ padding: "25px" }}>
        <UserShortcutTable shortcuts={shortcuts} />
      </div>
    </>
  );
}
