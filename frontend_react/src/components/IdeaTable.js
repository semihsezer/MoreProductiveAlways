import React from "react";
import { useState, useEffect } from "react";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import GenericDeletionDialog from "./GenericDeletionDialog";
import IdeaDialog from "./IdeaDialog";
import { IdeaAPI } from "../api/IdeaAPI";
import axios from "axios";

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default function IdeaTable({
  ideas,
  setIdeas,
  onIdeaCreated,
  onIdeaClosed,
  onIdeaReopened,
  onIdeaDeleted,
  mode = "open",
}) {
  // TODO: Add pagination
  const [selectedIdeas, setSelectedIdeas] = useState(null);
  const emptyIdea = {
    title: "",
    description: "",
    application: null,
    status: "Open",
  };

  if (mode != "open" && mode != "closed") {
    throw new Error("Invalid mode for IdeaTable. Must be 'open' or 'closed'");
  }

  const isOpenMode = mode === "open";
  const title = isOpenMode ? "Your Ideas" : "Completed Ideas";
  const placeholder = isOpenMode ? "No open ideas found. Click 'New' to create one!" : "No completed ideas yet.";

  const [idea, setIdea] = useState(emptyIdea);
  const [newIdeaDilogVisible, setNewIdeaDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [ideaEditDialogVisible, setIdeaEditDialogVisible] = useState(false);

  const openNewIdeaDialog = () => {
    setIdea(emptyIdea);
    setNewIdeaDialogVisible(true);
  };

  const editIdea = (rowData) => {
    setIdea(rowData);
    setIdeaEditDialogVisible(true);
  };

  function updateIdea(idea) {
    let _ideas = [...ideas];
    const index = _ideas.findIndex((item) => item.id === idea.id);
    _ideas[index] = idea;
    setIdeas(_ideas);
  }

  function closeIdea(idea) {
    idea.status = "Closed";
    IdeaAPI.updateIdea(idea).then(() => {
      onIdeaClosed(idea);
    });
  }

  function deleteIdea() {
    IdeaAPI.deleteIdea(idea).then(() => {
      onIdeaDeleted(idea);
    });
  }

  function reOpenIdea(idea) {
    idea.status = "Open";
    IdeaAPI.updateIdea(idea).then(() => {
      onIdeaReopened(idea);
    });
  }

  function onDeleteIdeaPressed(idea) {
    setIdea(idea);
    setDeleteDialogVisible(true);
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        {rowData.status === "Open" && (
          <Button icon="pi pi-check" rounded outlined className="mr-2" onClick={() => closeIdea(rowData)} />
        )}
        {rowData.status === "Closed" && (
          <Button icon="pi pi-check-square" rounded outlined className="mr-2" onClick={() => reOpenIdea(rowData)} />
        )}
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editIdea(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => onDeleteIdeaPressed(rowData)} />
      </>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNewIdeaDialog} />
      </div>
    );
  };

  return (
    <>
      <h3>{title}</h3>
      {isOpenMode && <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>}
      <DataTable
        value={ideas}
        dataKey="id"
        tableStyle={{ minWidth: "60rem" }}
        selection={selectedIdeas}
        onSelectionChange={(e) => setSelectedIdeas(e.value)}
        emptyMessage={placeholder}
        scrollable
        scrollHeight="400px"
      >
        <Column field="title" header="Title"></Column>
        <Column field="description" header="Description"></Column>
        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: "12rem" }}></Column>
      </DataTable>
      <GenericDeletionDialog
        visible={deleteDialogVisible}
        setVisible={setDeleteDialogVisible}
        onSubmit={(idea) => deleteIdea(idea)}
      ></GenericDeletionDialog>
      <IdeaDialog
        mode="create"
        idea={idea}
        setIdea={setIdea}
        visible={newIdeaDilogVisible}
        setVisible={setNewIdeaDialogVisible}
        onSubmit={(idea) => onIdeaCreated(idea)}
      ></IdeaDialog>
      <IdeaDialog
        mode="edit"
        idea={idea}
        setIdea={setIdea}
        visible={ideaEditDialogVisible}
        setVisible={setIdeaEditDialogVisible}
        onSubmit={(idea) => updateIdea(idea)}
      ></IdeaDialog>
    </>
  );
}
