import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState } from "react";

import { UserShortcutAPI } from "../api/UserShortcutAPI";
import ShortcutStatusDropdown from "./ShortcutStatusDropdown";
import ShortcutStatusFilterDropdown from "./ShortcutStatusFilterDropdown";

export default function UserShortcutTable({ shortcuts, defaultStatusFilter }) {
  // TODO: Add delete button to remove user shortcut from the table
  // TODO: Fix top status dropdown to filter by status
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    "shortcut.application.name": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "shortcut.command": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "shortcut.mac": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "shortcut.description": { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const onStatusChange = (oldStatus, newStatus, userShortcut) => {
    if (oldStatus === newStatus) return;
    else if (oldStatus == null) {
      const newUserShortcut = { shortcut_id: userShortcut.shortcut.id, status: newStatus };
      UserShortcutAPI.create(newUserShortcut).then((res) => {
        userShortcut.id = res.data.id;
      });
    } else if (newStatus !== "New") {
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
      <ShortcutStatusFilterDropdown
        onChange={(oldValue, newValue) => {
          options.filterApplyCallback(newValue);
        }}
      />
    );
  };

  return (
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
          showFilterMenu={false}
          filterPlaceholder="Filter application"
          header="Application"
        ></Column>
        <Column
          field="shortcut.command"
          filter
          showFilterMenu={false}
          filterPlaceholder="Search by command"
          header="Command"
        ></Column>
        <Column
          field="shortcut.mac"
          header="Shortcut (Mac)"
          filter
          showFilterMenu={false}
          filterPlaceholder="Filter shortcut"
        ></Column>
        <Column
          field="shortcut.description"
          header="Description"
          filter
          showFilterMenu={false}
          filterPlaceholder="Search by description"
        ></Column>
        <Column
          field="status"
          header="Status"
          body={actionBodyTemplate}
          exportable={false}
          style={{ minWidth: "12rem" }}
          filter
          showFilterMenu={false}
          filterElement={statusRowFilterTemplate}
        ></Column>
      </DataTable>
    </div>
  );
}
