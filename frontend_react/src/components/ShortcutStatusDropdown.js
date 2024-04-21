import React from "react";
import { useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

export default function ShortcutStatusDropdown({ status, onChange, shortcut }) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [selectedStatus, setSelectedStatus] = useState(status);

  function onStatusChange(newValue) {
    setSelectedStatus(newValue);
    onChange(currentStatus, newValue, shortcut);
    setCurrentStatus(newValue);
  }

  const statuses = [
    { name: "New", value: null },
    { name: "Saved", value: "Saved" },
    { name: "Learning", value: "Learning" },
    { name: "Mastered", value: "Mastered" },
    { name: "Not Relevant", value: "Not Relevant" },
  ];

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        {rowData.status === "Open" && (
          <Button icon="pi pi-check" rounded outlined className="mr-2" />
        )}
        {rowData.status === "Closed" && (
          <Button icon="pi pi-check-square" rounded outlined className="mr-2" />
        )}
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" />
        <Button icon="pi pi-trash" rounded outlined severity="danger" />
      </>
    );
  };

  return (
    <div className="card flex justify-content-center">
      <Dropdown
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.value)}
        options={statuses}
        optionLabel="name"
        placeholder="New"
        className="w-full md:w-14rem"
      />
    </div>
  );
}
