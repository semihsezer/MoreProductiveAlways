import React from 'react';
import { useState, useEffect } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import GenericDeletionDialog from './GenericDeletionDialog';
import IdeaDialog from './IdeaDialog';
import axios from 'axios';

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default function IdeaTable({ideas, onIdeaCreateSubmit, onIdeaEditSubmit, 
    onIdeaClosePressed, onIdeaReopenPressed, onIdeaDeleteSubmit, mode="open"}) {
    const [selectedIdeas, setSelectedIdeas] = useState(null);
    const emptyIdea = {
        title: '',
        description: '',
        type: '',
        application: null,
        status: 'Open'
    }

    if (mode != "open" && mode != "closed") {
        throw new Error("Invalid mode for IdeaTable. Must be 'open' or 'closed'");
    }

    const isOpenMode = mode === "open";
    const title = isOpenMode ? "Your Ideas" : "Completed Ideas";
    const placeholder = isOpenMode ? "No open ideas found. Click 'New' to create one!" : "No closed ideas yet.";
    
    const [idea, setIdea] = useState(emptyIdea);
    const [newIdeaDilogVisible, setNewIdeaDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ideaEditDialogVisible, setIdeaEditDialogVisible] = useState(false);

    const openNewIdeaDialog = () => {
        setIdea(emptyIdea);
        setNewIdeaDialogVisible(true)
    };

    const editIdea = (rowData) => {
        setIdea(rowData);
        setIdeaEditDialogVisible(true);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData.status === 'Open' &&
                    <Button icon="pi pi-check" rounded outlined className="mr-2" onClick={() => onIdeaClosePressed(rowData)} />
                }
                {rowData.status === 'Closed' &&
                    <Button icon="pi pi-check-square" rounded outlined className="mr-2" onClick={() => onIdeaReopenPressed(rowData)} />
                }
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editIdea(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => onIdeaDeleteSubmit(rowData)} />
            </React.Fragment>
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
        <h2>{title}</h2>
        {isOpenMode && <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>}
        <DataTable value={ideas} dataKey="id" tableStyle={{ minWidth: '60rem' }}
            selection={selectedIdeas} onSelectionChange={(e) => setSelectedIdeas(e.value)}
            emptyMessage={placeholder}>
            <Column field="title" header="Title"></Column>
            <Column field="description" header="Description"></Column>
            <Column field="status" header="Status"></Column>
            <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
        <GenericDeletionDialog 
            visible={deleteDialogVisible} setVisible={setDeleteDialogVisible} 
            onSubmit={(idea) => onIdeaDeleteSubmit(idea)}>
        </GenericDeletionDialog>
        <IdeaDialog 
            mode="create" idea={idea} setIdea={setIdea} 
            visible={newIdeaDilogVisible} setVisible={setNewIdeaDialogVisible} 
            onSubmit={(idea) => onIdeaCreateSubmit(idea)}>
        </IdeaDialog>
        <IdeaDialog 
            mode="edit" idea={idea} setIdea={setIdea} 
            visible={ideaEditDialogVisible} setVisible={setIdeaEditDialogVisible} 
            onSubmit={(idea) => onIdeaEditSubmit(idea)}>
        </IdeaDialog>
        </>
    )
}