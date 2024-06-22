import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState } from "react";

import { UserShortcutAPI } from "../api/UserShortcutAPI";
import ShortcutStatusDropdown from "./ShortcutStatusDropdown";

export default function UserShortcutTable({ shortcuts }) {
  // TODO: Add delete button to remove user shortcut from the table
  // TODO: Fix top status dropdown to filter by status
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    "application.name": { value: null, matchMode: FilterMatchMode.CONTAINS },
    command: { value: null, matchMode: FilterMatchMode.CONTAINS },
    mac: { value: null, matchMode: FilterMatchMode.CONTAINS },
    description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const onStatusChange = (oldStatus, newStatus, userShortcut) => {
    if (oldStatus === newStatus) return;
    else if (oldStatus == null) {
      const newUserShortcut = { shortcut_id: userShortcut.shortcut.id, status: newStatus };
      UserShortcutAPI.create(newUserShortcut).then((res) => {
        userShortcut.id = res.data.id;
      });
    } else if (newStatus !== null) {
      const payload = { shortcut_id: userShortcut.shortcut.id, status: newStatus };
      UserShortcutAPI.patch(userShortcut.id, payload);
    } else {
      UserShortcutAPI.delete(userShortcut.id);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <ShortcutStatusDropdown shortcut={rowData} status={rowData.status} onChange={onStatusChange} />
      </>
    );
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <ShortcutStatusDropdown
        status="Saved"
        onChange={(oldValue, newValue, shortcut) => options.filterApplyCallback(newValue)}
      />
    );
  };

  return (
    // TODO: Make sure all fields are mapped correctly and intuitively
    <div className="card">
      <DataTable
        value={shortcuts}
        filters={filters}
        filterDisplay="row"
        globalFilterFields={["shortcut.application.name", "shortcut.command", "shortcut.mac", "shortcut.description"]}
        tableStyle={{ minWidth: "60rem" }}
      >
        <Column
          field="shortcut.application.name"
          filter
          filterPlaceholder="Filter application"
          header="Application"
        ></Column>
        <Column field="shortcut.command" filter filterPlaceholder="Search by command" header="Command"></Column>
        <Column field="shortcut.mac" header="Shortcut (Mac)" filter filterPlaceholder="Filter shortcut"></Column>
        <Column
          field="shortcut.description"
          header="Description"
          filter
          filterPlaceholder="Search by description"
        ></Column>
        <Column
          header="Status"
          body={actionBodyTemplate}
          exportable={false}
          style={{ minWidth: "12rem" }}
          filter
          filterElement={statusRowFilterTemplate}
        ></Column>
      </DataTable>
    </div>
  );
}
