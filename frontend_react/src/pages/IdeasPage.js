import React from "react";
import { useState, useEffect } from "react";
import IdeaTable from "../components/IdeaTable";
import { IdeaAPI } from "../api/IdeaAPI";

export default function IdeasPage({}) {
  const [openIdeas, setOpenIdeas] = useState([]);
  const [closedIdeas, setClosedIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // TODO: Row click should show idea detail modal
  // LATER: Option + N opens new idea dialog

  function onIdeaCreated(idea) {
    setOpenIdeas((openIdeas) => [idea, ...openIdeas]);
  }

  function onIdeaClosed(idea) {
    setOpenIdeas((openIdeas) => openIdeas.filter((i) => i.id !== idea.id));
    setClosedIdeas((closedIdeas) => [idea, ...closedIdeas]);
  }

  function onIdeaReopened(idea) {
    setClosedIdeas((closedIdeas) => closedIdeas.filter((i) => i.id !== idea.id));
    setOpenIdeas((openIdeas) => [idea, ...openIdeas]);
  }

  function onOpenIdeaDeleted(idea) {
    setOpenIdeas((openIdeas) => openIdeas.filter((i) => i.id !== idea.id));
  }

  function onClosedIdeaDeleted(idea) {
    setClosedIdeas((closedIdeas) => closedIdeas.filter((i) => i.id !== idea.id));
  }

  useEffect(() => {
    IdeaAPI.getIdeas("Open")
      .then((res) => {
        setOpenIdeas(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));

    IdeaAPI.getIdeas("Closed")
      .then((res) => {
        setClosedIdeas(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <div>
          <IdeaTable
            ideas={openIdeas}
            setIdeas={setOpenIdeas}
            mode="open"
            onIdeaCreated={onIdeaCreated}
            onIdeaClosed={onIdeaClosed}
            onIdeaDeleted={onOpenIdeaDeleted}
          ></IdeaTable>
          <IdeaTable
            ideas={closedIdeas}
            setIdeas={setClosedIdeas}
            mode="closed"
            onIdeaReopened={onIdeaReopened}
            onIdeaDeleted={onClosedIdeaDeleted}
          ></IdeaTable>
        </div>
      )}
    </>
  );
}
