import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { UserApplicationAPI } from "../api/UserApplicationAPI";
import { useState, useEffect } from "react";

export default function ApplicationsPage({}) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const onSave = (rowData) => {
    UserApplicationAPI.create(rowData.application.id)
      .then((res) => {
        getApplications();
      })
      .catch((err) => console.log(err));
  };

  const onDelete = (rowData) => {
    UserApplicationAPI.delete(rowData.id)
      .then(() => {
        getApplications();
      })
      .catch((err) => console.log(err));
  };

  function getApplications() {
    try {
      UserApplicationAPI.getAll("all")
        .then((res) => {
          setApplications(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getApplications();
  }, []);

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        {rowData.user ? (
          <Button
            label="Remove"
            severity="secondary"
            icon="pi pi-times"
            style={{ marginLeft: "0.5em" }}
            onClick={() => onDelete(rowData)}
          />
        ) : (
          <Button label="Save" icon="pi pi-check" onClick={() => onSave(rowData)} />
        )}
      </>
    );
  };

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <DataTable value={applications} dataKey="id" tableStyle={{ minWidth: "60rem" }} scrollable scrollHeight="400px">
          <Column field="application.name" header="Title"></Column>
          <Column field="application.description" header="Description"></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: "12rem" }}></Column>
        </DataTable>
      )}
    </>
  );
}
