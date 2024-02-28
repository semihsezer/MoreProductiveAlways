import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect } from 'react';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';
import axios from 'axios';
import GenericDeletionDialog from '../components/GenericDeletionDialog';
import IdeaDialog from '../components/IdeaDialog';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default function IdeasPage({}){
    const [ideas, setIdeas] = useState([]);
    // TODO: Extract IdeaTable to a new component
    // TODO: Add second table to display completed ideas
    // TODO: Add other edit fields to IdeaDialog
    // TODO: display toast on delete success/failure
    // TODO: Row click should show idea detail modal
    // TODO: get IdeaTypes from API
    // TODO: Escape should disable edit mode
    // TODO: fix width-shift on edit
    // TODO: Add & Implement Delete Button
    // TODO: call API to save row
    const emptyIdea = {
        title: '',
        description: '',
        type: '',
        application: null,
        status: 'Open'
    }
    const [idea, setIdea] = useState(emptyIdea);

    const [selectedIdeas, setSelectedIdeas] = useState(null);
    const [newIdeaDilogVisible, setNewIdeaDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ideaEditDialogVisible, setIdeaEditDialogVisible] = useState(false);


    function getIdeas(){
		try {
            fetch(`/api/user/ideas`)
                .then((res) => 
                    res.json())
                .then((data) => 
                    setIdeas(data));
        } catch (err) {
            console.log(err);
        }
	};

    function deleteIdeas(ideas){
        const ideaIDs = ideas.map((idea) => idea.id);
        const payload = { data: {ids: ideaIDs }};
        try {
            axios.delete(`/api/user/ideas`, payload)
              .then((response) => {
                console.log(response);
                getIdeas();
            }).catch((err) => {
                console.log(err);
            });
        } catch (err) {
            console.log(err);
        }
    }

    function updateIdea(rowData){
        axios.put(`/api/user/ideas`, rowData)
            .then((response) => {
                console.log(response);
                getIdeas();
            });
    }

    function completeIdea(rowData){
        rowData.status = 'Closed';
        updateIdea(rowData);
    }

    function reOpenIdea(rowData){
        rowData.status = 'Open';
        updateIdea(rowData);
    }

    const openNewIdeaDialog = () => {
        setIdea(emptyIdea);
        setNewIdeaDialogVisible(true)
    };

    const openDeleteDialog = (rowData) => {
        setIdea(rowData);
        setDeleteDialogVisible(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNewIdeaDialog} />
            </div>  
        );
    };

    const onIdeaCreateSubmit = () => {
        setIdea(emptyIdea);
        getIdeas();
    }

    const onIdeaDeleteSubmit = (e) => {
        deleteIdeas([idea]);
    }

    const onIdeaEditSubmit = (e) => {
        setIdea(emptyIdea);
        getIdeas();
    }

    const editIdea = (rowData) => {
        setIdea(rowData);
        setIdeaEditDialogVisible(true);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData.status === 'Open' &&
                    <Button icon="pi pi-check" rounded outlined className="mr-2" onClick={() => completeIdea(rowData)} />
                }
                {rowData.status === 'Closed' &&
                    <Button icon="pi pi-check-square" rounded outlined className="mr-2" onClick={() => reOpenIdea(rowData)} />
                }
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editIdea(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => openDeleteDialog(rowData)} />
            </React.Fragment>
        );
    };

    useEffect(() => {
        getIdeas();
    }, []);

    return (
        <div>
            <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
            <DataTable value={ideas} dataKey="id" tableStyle={{ minWidth: '60rem' }}
                selection={selectedIdeas} onSelectionChange={(e) => setSelectedIdeas(e.value)}
                emptyMessage="No ideas found. Click 'New' to create one!">
                <Column field="title" header="Title"></Column>
                <Column field="description" header="Description"></Column>
                <Column field="status" header="Status"></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
            <GenericDeletionDialog 
                visible={deleteDialogVisible} setVisible={setDeleteDialogVisible} 
                onSubmit={onIdeaDeleteSubmit}>
            </GenericDeletionDialog>
            <IdeaDialog 
                mode="create" idea={idea} setIdea={setIdea} 
                visible={newIdeaDilogVisible} setVisible={setNewIdeaDialogVisible} 
                onSubmit={onIdeaCreateSubmit}>
            </IdeaDialog>
            <IdeaDialog 
                mode="edit" idea={idea} setIdea={setIdea} 
                visible={ideaEditDialogVisible} setVisible={setIdeaEditDialogVisible} 
                onSubmit={onIdeaEditSubmit}>
            </IdeaDialog>
        </div>
    )
}