import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect } from 'react';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from 'axios';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export function NewIdeaInputField({onSubmit}){
    const [title, setTitle] = useState('');

    function createNewIdea(){
        if (title.length > 0){
            axios.post('/api/user/ideas', {title: title})
              .then((response) => {
                console.log(response);
                setTitle('');
                onSubmit();
                // TODO: call parent callback
            });
        }
    }

    function onClick(e){
        e.preventDefault();
        createNewIdea();
    }

    return (
        <div>
            <p>New Idea</p>
            <form>
                <InputText value={title} placeholder="Type New Idea. Press Enter to save." onChange={(e) => setTitle(e.target.value)} />
                <Button type="Submit" aria-label="Submit" icon="pi pi-check" onClick={onClick} />
            </form>
        </div>
    )
}

export default function IdeasPage({}){
    const [ideas, setIdeas] = useState([]);

    function callAPI(){
		try {
      fetch(`/api/user/ideas`, )
        .then((res) => 
            res.json())
        .then((data) => 
            setIdeas(data));
		} catch (err) {
			console.log(err);
		}
	};
    
    function onNewIdea(){
        callAPI();
    };

    useEffect(() => {
        callAPI();
    }, []);

    return (
        <div>
            <NewIdeaInputField onSubmit={onNewIdea}/>
            <DataTable value={ideas} tableStyle={{ minWidth: '60rem' }}>
                <Column field="title" header="Title"></Column>
                <Column field="description" header="Description"></Column>
                <Column field="type" header="Type"></Column>
                <Column field="application" header="Application"></Column>
                <Column field="status" header="Status"></Column>
            </DataTable>
        </div>
    )
}