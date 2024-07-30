import React, { useState, useEffect } from "react";
import styles from "./layout.module.css";
import { LuFilePlus2, LuFileSearch, LuFileCode2 } from "react-icons/lu";

const Layout = () => {
  const [haveSave, setHaveSave] = useState(false);

  const handleOpenFile = async () => {
    try {
      const selectedFilePath = await window.electron.openSave();
      if (selectedFilePath) {
        localStorage.setItem('jsonFilePath', selectedFilePath);
      }
    } catch (error) {
      console.error('error reading save:', error);
    }
  };

  const handleCreateFile = async () => {
    try {
      const saveFilePath = await window.electron.createSave('save.json');
      if (saveFilePath) {
        localStorage.setItem('jsonFilePath', saveFilePath);
      }
    } catch (error) {
      console.error('error creating save:', error);
    }
  };

  const handleRevealSave = async () => {
    try {
      const savedFilePath = localStorage.getItem('jsonFilePath');
      if (savedFilePath) {
        await window.electron.revealSave(savedFilePath);
      } else {
        console.error('no save file found');
      }
    } catch (error) {
      console.error('error opening save file:', error);
    }
  };

  useEffect(() => {
    (async () => {
      const savedFilePath = localStorage.getItem('jsonFilePath');
      if (savedFilePath) {
        const data = await window.electron.readSave(savedFilePath);
        setHaveSave(true);
      }
    })();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h1>Welcome!</h1>
        <hr className={styles.break} />
        <div className={styles.content}>
          <div className={styles.function}>
            <button onClick={handleCreateFile}><LuFilePlus2 size={20} className={styles.icon}/>Create Save File...</button>
            <button onClick={handleOpenFile}><LuFileSearch size={20} className={styles.icon}/>Import Save File...</button>
            <button onClick={handleRevealSave}><LuFileCode2 size={20} className={styles.icon}/>Reveal Save File...</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;