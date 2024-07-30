import React, { useState, useEffect } from "react";
import styles from "./other.module.css";
import { FiPlus, FiTrash2 } from "react-icons/fi";


const Other = () => {
  const [jsonData, setJsonData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteCounter, setDeleteCounter] = useState(0);

  const openLink = (url) => {
    try {
      new URL(url);
      window.electron.openURL(url);
    } catch {
      return;
    }
  };

  useEffect(() => {
    (async () => {
      const savedFilePath = localStorage.getItem('jsonFilePath');
      if (savedFilePath) {
        const data = await window.electron.readSave(savedFilePath);
        setJsonData(data);
      }
    })();
  }, []);

  const handleContentChange = (e, entry, area) => {
    const newVal = e.target.innerText;
    const updatedJsonData = { ...jsonData };
    const i = updatedJsonData.o.findIndex(item => item === entry);
    updatedJsonData.o[i][area] = newVal;
    setJsonData(updatedJsonData);
  };

  const handleNewContent = () => {
    const newEntry = {
      name: 'New Other',
      link: ''
    };

    const updatedJsonData = { ...jsonData };
    updatedJsonData.o = [...updatedJsonData.o, newEntry];
    setJsonData(updatedJsonData);
  };

  const handleDelete = (entry) => {
    const updatedJsonData = { ...jsonData };
    updatedJsonData.o = updatedJsonData.o.filter(item => item !== entry);
    setJsonData(updatedJsonData);
    setDeleteCounter(i => i+1);
  };

  const handleEdit = () => {
    setIsEdit(true);
  }

  const handleCancel = async () => {
    const savedFilePath = localStorage.getItem('jsonFilePath');
    if (savedFilePath) {
      const data = await window.electron.readSave(savedFilePath);
      setJsonData(data);
    }
    setIsEdit(false);
  }

  const handleSave = async () => {
    if (deleteCounter > 0) {
      const userD = window.confirm("You're deleting multiple entry, are you sure?");
      if (!userD) {
        handleCancel();
        return;
      }
    }
    const savedFilePath = localStorage.getItem('jsonFilePath');
    await window.electron.writeSave(savedFilePath, jsonData);
    setIsEdit(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.title}>
          <h1>Other</h1>
          <div className={styles.titleB}>
            {isEdit ? (
              <>
                <button className={styles.nButton} onClick={handleCancel}>Cancel</button>
                <button className={styles.sButton} onClick={handleSave}>Save</button>
              </>
            ) : (
              jsonData && (<button className={styles.sButton} onClick={handleEdit}>Edit</button>)
            )}
          </div>
        </div>
        <hr className={styles.break} />
        <div className={styles.content}>
          <div className={isEdit ? styles.table : styles.tableV}>
            {jsonData ? (
              <div className={styles.topRow}>
                <div className={styles.topContent}>Name</div>
                <div className={styles.topContent}>Link</div>
                {isEdit && <div className={styles.topContent}></div>}
              </div>
            ) : <h3>You need to create a save file first!</h3>}
            {jsonData ? (jsonData.o.map((entry, index) => (
              <>
                <div key={index} className={styles.entry}>
                  <div className={styles.tableContent} contentEditable={isEdit} suppressContentEditableWarning onBlur={(e) => handleContentChange(e, entry, 'name')}>{entry.name}</div>
                  <div className={styles.tableContent} contentEditable={isEdit} suppressContentEditableWarning onBlur={(e) => handleContentChange(e, entry, 'link')}><a href="" onClick={(e) => {e.preventDefault(); openLink(entry.link);}}>{entry.link}</a></div>
                  {isEdit && (<div className={styles.tableContent} style={{ textOverflow: 'clip', paddingRight: '30px' }}><button onClick={() => handleDelete(entry)}><FiTrash2 size={15}/></button></div>)}
                </div>
              </>
            ))) : null}
          </div>
          {isEdit && (<button className={styles.add} style={{ paddingTop: '5px' }} onClick={handleNewContent}><FiPlus size={20}/></button>)}
        </div>
      </div>
    </div>
  );
}

export default Other;