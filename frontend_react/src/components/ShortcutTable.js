import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState } from "react";

import { UserShortcutAPI } from "../api/UserShortcutAPI";
import ShortcutStatusDropdown from "./ShortcutStatusDropdown";

export default function ShortcutTable({ shortcuts }) {
  const [filters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    "application.name": { value: null, matchMode: FilterMatchMode.CONTAINS },
    command: { value: null, matchMode: FilterMatchMode.CONTAINS },
    mac: { value: null, matchMode: FilterMatchMode.CONTAINS },
    description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const onStatusChange = (oldStatus, newStatus, shortcut) => {
    if (oldStatus == null) {
      const userShortcut = { shortcut_id: shortcut.id, status: newStatus };
      UserShortcutAPI.create(userShortcut);
    } else {
      const userShortcut = { shortcut_id: shortcut.id, status: newStatus };
      UserShortcutAPI.update(userShortcut);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <ShortcutStatusDropdown shortcut={rowData} status={rowData.status} onChange={onStatusChange} />
      </>
    );
  };

  return (
    <div className="card">
      <DataTable
        value={shortcuts}
        filters={filters}
        filterDisplay="row"
        globalFilterFields={["application.name", "command", "user_mac", "description"]}
        tableStyle={{ minWidth: "60rem" }}
      >
        <Column field="application.name" filter filterPlaceholder="Filter application" header="Application"></Column>
        <Column field="command" filter filterPlaceholder="Search by command" header="Command"></Column>
        <Column field="mac" header="Shortcut (Mac)" filter filterPlaceholder="Filter shortcut"></Column>
        <Column field="description" header="Description" filter filterPlaceholder="Search by description"></Column>
        <Column header="Status" body={actionBodyTemplate} exportable={false} style={{ minWidth: "12rem" }}></Column>
      </DataTable>
    </div>
  );
}
