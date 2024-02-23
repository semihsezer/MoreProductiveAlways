import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';


export default function IdeaCreationDialog({idea, setIdea, visible, setVisible, onSubmit, mode = "create"}) {
    const [submitted, setSubmitted] = useState(false);
    if (mode != "create" && mode != "edit") {
        throw new Error("Invalid mode for IdeaCreationDialog. Must be 'create' or 'edit'");
    }

    const hideDialog = () => {
        setVisible(false);
    };

    const isEditMode = mode === "edit";

    function createNewIdea(){
        if (idea.title.length > 0){
            axios.post('/api/user/ideas', idea)
              .then((response) => {
                console.log(response);
                hideDialog();
                onSubmit();
                // TODO: call parent callback
            });
        }
    }

    function updateIdea(){
        if (idea.title.length > 0){
            axios.put(`/api/user/ideas`, idea)
              .then((response) => {
                console.log(response);
                hideDialog();
                onSubmit();
            }
            );}
    }

    function onSave(){
        if (isEditMode){
            updateIdea();
        } else {
            createNewIdea();
        }
    }

    const updateIdeaField = (e, field) => {
        const val = (e.target && e.target.value) || '';
        let _idea = { ...idea };
        _idea[`${field}`] = val;
        setIdea(_idea);
    };


    const footer = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={onSave} />
        </React.Fragment>
        )

    // TODO: How to return new idea? Leave it up to the parent?
        // Option 1: Get Idea from parent and update it
        // Option 2:
    // TODO: Add application dropdown
    // TODO: Add status dropdown
    return (
        <Dialog visible={visible} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={footer} onHide={hideDialog}>
        <div className="field">
            <label htmlFor="title" className="font-bold">
                Title
            </label>
            <InputText id="title" value={idea.title} 
                onChange={(e) => updateIdeaField(e, 'title')} required autoFocus 
                className={classNames({ 'p-invalid': submitted && !idea.title })} />
            {submitted && !idea.title && <small className="p-error">Title is required.</small>}
        </div>
        <div className="field">
            <label htmlFor="description" className="font-bold">
                Description
            </label>
            <InputTextarea id="description" value={idea.description} onChange={(e) => updateIdeaField(e, 'description')} required rows={3} cols={20} />
        </div>
    </Dialog>
    )

}