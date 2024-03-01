import React from 'react';
import { useState, useEffect } from 'react';
import IdeaTable from '../components/IdeaTable';
import {IdeaAPI} from '../api/IdeaAPI';

export default function IdeasPage({}){
    const [openIdeas, setOpenIdeas] = useState([]);
    const [closedIdeas, setClosedIdeas] = useState([]);
    // TODO: Extract dialog and API calls out of IdeaTable
    // TODO: display toast on delete success/failure
    // TODO: Row click should show idea detail modal
    // LATER: Option + N opens new idea dialog

    function closeIdea(idea){
        idea.status = "Closed";
        IdeaAPI.updateIdea(idea).then( () => {
            setClosedIdeas(closedIdeas => [idea, ...closedIdeas]);
            let filteredArray = openIdeas.filter(item => item.id !== idea.id);
            setOpenIdeas(filteredArray);
            }
        )
    }

    function createIdea(idea){
        setOpenIdeas(openIdeas => [idea, ...openIdeas]);
    }

    function reopenIdea(idea){
        idea.status = "Open";
        IdeaAPI.updateIdea(idea).then(() => {
            setOpenIdeas(openIdeas => [idea, ...openIdeas]);
            let filteredArray = closedIdeas.filter(item => item.id !== idea.id);
            setClosedIdeas(filteredArray);
        })
    }

    function deleteIdea(idea){
        IdeaAPI.deleteIdea(idea).then(() => {
            if (idea.status === "Open"){
                let filteredArray = openIdeas.filter(item => item.id !== idea.id);
                setOpenIdeas(filteredArray);
            } else {
                let filteredArray = closedIdeas.filter(item => item.id !== idea.id);
                setClosedIdeas(filteredArray);
            }
        })
    }

    function updateIdea(idea){
        
    }

    useEffect(() => {
        IdeaAPI.getIdeas("Open")
            .then((res) => {
                setOpenIdeas(res.data);
                }
            );
        
        IdeaAPI.getIdeas("Closed")
            .then((res) => {
                setClosedIdeas(res.data);
                }
            );
    }, []);

    return (
        <div>
            <IdeaTable ideas={openIdeas} mode="open" 
                onIdeaClosePressed={closeIdea} onIdeaEditSubmit={updateIdea}
                onIdeaCreateSubmit={createIdea} onIdeaDeleteSubmit={deleteIdea}></IdeaTable>
            <IdeaTable ideas={closedIdeas} mode="closed"
                onIdeaReopenPressed={reopenIdea} onIdeaEditSubmit={updateIdea}></IdeaTable>
        </div>
    )
}