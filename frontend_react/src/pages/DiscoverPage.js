"use client";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useEffect, useState } from "react";

import { ShortcutAPI } from "../api/ShortcutAPI";
import ShortcutTable from "../components/ShortcutTable";

export default function DiscoverPage({ msg }) {
  const [shortcuts, setShortcuts] = useState([]);

  useEffect(() => {
    try {
      ShortcutAPI.getAll().then((res) => setShortcuts(res.data));
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      <p>Discover</p>
      <div style={{ padding: "25px" }}>
        <ShortcutTable shortcuts={shortcuts} />
      </div>
    </>
  );
}
