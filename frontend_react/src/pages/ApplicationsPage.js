import React from "react";
import { DataScroller } from "primereact/datascroller";
import { UserApplicationAPI } from "../api/UserApplicationAPI";
import ApplicationCard from "../components/ApplicationCard";
import { useState, useEffect } from "react";

export default function ApplicationsPage({}) {
  const [applications, setApplications] = useState([]);

  function getApplications() {
    try {
      UserApplicationAPI.getAll("all")
        .then((res) => setApplications(res.data))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getApplications();
  }, []);

  const itemTemplate = (application) => {
    return <ApplicationCard userApplication={application} />;
  };

  return (
    <div className="card">
      <DataScroller
        value={applications}
        itemTemplate={itemTemplate}
        rows={5}
        buffer={0.4}
        header="List of Applications"
      />
    </div>
  );
}
