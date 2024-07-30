const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    openSave: () => ipcRenderer.invoke('openSave'),
    createSave: () => ipcRenderer.invoke('createSave'),
    readSave: (filePath) => ipcRenderer.invoke('readSave', filePath),
    writeSave: (filePath, data) => ipcRenderer.invoke('writeSave', filePath, data),
    openURL: (url) => ipcRenderer.invoke('openURL', url),
    revealSave: (filePath) => ipcRenderer.invoke('revealSave', filePath)
});