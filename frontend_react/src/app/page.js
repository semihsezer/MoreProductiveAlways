'use client';
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from 'react';

export function Shortcut({shortcut}) {
  return (
    <p>{shortcut.application.name} - {shortcut.command} - {shortcut.mac} - {shortcut.description}</p>
  );
}

export default function Home() {
	const [shortcuts, setShortcuts] = useState([]); 

  function callAPI(){
		try {
      fetch(`/api/shortcut/`)
        .then((res) => res.json())
        .then((data) => setShortcuts(data));
		} catch (err) {
			console.log(err);
		}
	};

  useEffect(() => {
    callAPI();
  });

  function prepareShortcuts(){
    return shortcuts.map((shortcut) => {
      return (
        <Shortcut key={shortcut.id} shortcut={shortcut} />
        );
    });
  }

	return (
		<div className={styles.container}>
			<main className={styles.main}>
				<button onClick={callAPI}>Make API Call</button>
        {prepareShortcuts()}
			</main>
		</div>
	);
}