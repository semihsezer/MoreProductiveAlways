"use client";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useEffect, useState } from "react";

import { UserShortcutAPI } from "../api/UserShortcutAPI";
import UserShortcutTable from "../components/UserShortcutTable";
import { TabMenu } from "primereact/tabmenu";

export default function UserShortcutsPage({ msg }) {
  // LEFT_HERE:
  // - Implement changing status between the tabs. At the moment if you change status
  // it doesn't correctly update the table state until you refresh.
  const [allShortcuts, setAllShortcuts] = useState([]);
  const [shortcuts, setShortcuts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const tabIndexMapping = {
    0: "Learning",
    1: "Saved",
    2: "Mastered",
    3: "Not Relevant",
  };

  const tabNotesMapping = {
    Learning: {
      description: "Shortcuts you are currently learning.",
      noData: "There is nothing here. Go to Discover page mark the shortcuts you want to learn next as 'Learning'.",
    },
    Saved: {
      description: "Shortcuts you have saved for later.",
      noData: "There is nothing here. Go to Discover page and mark some shortcuts as 'Saved'.",
    },
    Mastered: {
      description: "Shortcuts you have mastered.",
      noData:
        "It looks like you did not mark any shortcuts as mastered. Go to Discover page and mark the shortcuts you already use as 'Mastered'.",
    },
    "Not Relevant": {
      description: "Shortcuts you have marked as not relevant.",
      noData: "It looks like you did not mark any shortcuts as not relevant to you.",
    },
  };

  function selectedTabHasShortcuts() {
    return shortcuts.length > 0;
  }

  function getTabNote() {
    const tabName = tabIndexMapping[activeIndex];
    return tabNotesMapping[tabName].description;
  }

  function getTabNoDataNote() {
    const tabName = tabIndexMapping[activeIndex];
    return tabNotesMapping[tabName].noData;
  }

  const items = [
    {
      label: "Learning",
      icon: "pi pi-chart-line",
      command: () => {
        getShortcuts("Learning");
      },
    },
    {
      label: "Saved",
      icon: "pi pi-list",
      command: () => {
        getShortcuts("Saved");
      },
    },
    {
      label: "Mastered",
      icon: "pi pi-check",
      command: () => {
        getShortcuts("Mastered");
      },
    },
    {
      label: "Not Relevant",
      icon: "pi pi-times-circle",
      command: () => {
        getShortcuts("Not Relevant");
      },
    },
  ];

  function getShortcuts(status) {
    UserShortcutAPI.getAll(status)
      .then((res) => {
        setShortcuts(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getShortcuts("Learning");
  }, []);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <>
          <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
          <p style={{ textAlign: "left" }}>{getTabNote()}</p>
          {selectedTabHasShortcuts() && <UserShortcutTable shortcuts={shortcuts} defaultStatusFilter="Saved" />}
          {!selectedTabHasShortcuts() && <p style={{ textAlign: "left" }}>{getTabNoDataNote()}</p>}
        </>
      )}
    </>
  );
}
