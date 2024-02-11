'use client';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useState, useEffect } from 'react';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


export function Shortcut({shortcut}) {
  return (
    <p>{shortcut.application.name} - {shortcut.command} - {shortcut.mac} - {shortcut.description}</p>
  );
}

export default function DiscoverPage({msg}) {
	const [shortcuts, setShortcuts] = useState([]);
    const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'application.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
    command: { value: null, matchMode: FilterMatchMode.CONTAINS },
    mac: { value: null, matchMode: FilterMatchMode.CONTAINS },
    description: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

  function callAPI(){
		try {
      fetch(`/api/shortcut`)
        .then((res) => 
            res.json())
        .then((data) => 
            setShortcuts(data));
		} catch (err) {
			console.log(err);
		}
	};

  useEffect(() => {
    callAPI();
  }, []);

  function prepareShortcuts(){
    return (
      <div className="card">
        <p>Discover</p>
        <DataTable value={shortcuts} filters={filters} filterDisplay="row" 
          globalFilterFields={['application.name', 'command', 'mac', 'description']} tableStyle={{ minWidth: '60rem' }}>
          <Column field="application.name" filter filterPlaceholder="Search by application" header="Application"></Column>
          <Column field="command" filter filterPlaceholder="Search by command" header="Command"></Column>
          <Column field="mac" header="Shortcut (Mac)" filter filterPlaceholder="Search by shortcut"></Column>
          <Column field="description" header="Description" filter filterPlaceholder="Search by description" ></Column>
        </DataTable>
      </div>
    )
  }

	return (
		<div>
            {prepareShortcuts()}
		</div>
	);
}