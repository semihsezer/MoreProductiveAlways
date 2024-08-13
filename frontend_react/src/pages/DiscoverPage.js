"use client";
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
      <div>
        <UserShortcutTable shortcuts={shortcuts} defaultStatusFilter="New" />
      </div>
    </>
  );
}
