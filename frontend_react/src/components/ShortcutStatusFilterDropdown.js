import React from "react";
import { useState } from "react";
import { Dropdown } from "primereact/dropdown";

export default function ShortcutStatusFilterDropdown({ status, onChange }) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [selectedStatus, setSelectedStatus] = useState(status);

  function onStatusChange(e) {
    const newValue = e.value;
    setSelectedStatus(newValue);
    onChange(currentStatus, newValue);
    setCurrentStatus(newValue);
  }

  const statuses = ["Saved", "Learning", "Mastered", "Not Relevant"];

  return (
    <div className="card flex justify-content-center">
      <Dropdown
        value={selectedStatus}
        onChange={(e) => onStatusChange(e)}
        options={statuses}
        placeholder="Select"
        showClear={true}
        className="w-full md:w-14rem"
      />
    </div>
  );
}
