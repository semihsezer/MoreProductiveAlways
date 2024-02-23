import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

export default function GenericDeletionDialog({visible, setVisible, onSubmit}) {

    const hideDialog = () => {
        setVisible(false);
    };

    function onConfirmDelete(){
        hideDialog();
        onSubmit();
    };

    const footer = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={onConfirmDelete} />
        </React.Fragment>
        )


    // TODO: Add item names to display
    return (
        <Dialog visible={visible} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={footer} onHide={hideDialog}>
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>Are you sure you want to delete the selected items?</span>
            </div>
        </Dialog>
    )

}
