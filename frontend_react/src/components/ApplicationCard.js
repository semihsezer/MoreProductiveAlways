import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { UserApplicationAPI } from "../api/UserApplicationAPI";
import { useState } from "react";

export default function ApplicationCard({ userApplication }) {
  const [saved, setSaved] = useState(userApplication.user ? true : false);
  const header = <></>;

  const onSave = (applicationId) => {
    UserApplicationAPI.create(applicationId)
      .then((res) => {
        setSaved(true);
        userApplication.id = res.data.id;
      })
      .catch((err) => console.log(err));
  };

  const onDelete = (userApplicationId) => {
    UserApplicationAPI.delete(userApplicationId)
      .then(() => setSaved(false))
      .catch((err) => console.log(err));
  };

  const footer = (
    <>
      {saved ? (
        <Button
          label="Remove"
          severity="secondary"
          icon="pi pi-times"
          style={{ marginLeft: "0.5em" }}
          onClick={() => onDelete(userApplication.id)}
        />
      ) : (
        <Button label="Save" icon="pi pi-check" onClick={() => onSave(userApplication.application.id)} />
      )}
    </>
  );

  return (
    <div className="card flex justify-content-center">
      <Card
        title={userApplication.application.name}
        subTitle={userApplication.application.category}
        footer={footer}
        header={header}
      >
        <p>{userApplication.application.description}</p>
      </Card>
    </div>
  );
}
