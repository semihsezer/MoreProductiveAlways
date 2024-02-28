import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export default function ApplicationCard({application}) {
    const header = (
        <></>
    );
    
    const footer = (
        <>
            <Button label="Save" icon="pi pi-check" />
            <Button label="Cancel" severity="secondary" icon="pi pi-times" style={{ marginLeft: '0.5em' }} />
        </>
    );

    return (
        <div className="card flex justify-content-center">
            <Card title={application.name} subTitle={application.category}
                  footer={footer} header={header}>
                <p>{application.description}</p>
            </Card>
        </div>
    ) 
}
