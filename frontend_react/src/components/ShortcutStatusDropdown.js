import React from "react";
import { useState } from "react";
import { Dropdown } from "primereact/dropdown";

export default function ShortcutStatusDropdown({ status, onChange, shortcut }) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [selectedStatus, setSelectedStatus] = useState(status);

  function onStatusChange(newValue) {
    setSelectedStatus(newValue);
    onChange(currentStatus, newValue, shortcut);
    setCurrentStatus(newValue);
  }

  const statuses = ["New", "Saved", "Learning", "Mastered", "Not Relevant"];

  return (
    <div className="card flex justify-content-center">
      <Dropdown
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.value)}
        options={statuses}
        placeholder="New"
        className="w-full md:w-14rem"
      />
    </div>
  );
}
