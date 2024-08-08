const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const url = require('url');
const fs = require('fs');
const path = require('path');

const oneWindow = app.requestSingleInstanceLock();
if (!oneWindow) {
  app.quit();
  return;
}

let mainWindow = null;

function createMainWindow () {
  mainWindow = new BrowserWindow({
    title: 'MamoTracker',
    width: 800,
    height: 600,
    minWidth: 640,
    minHeight: 480,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });

  const startUrl = url.format({
    pathname: path.join(__dirname, './app/build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);
  mainWindow.setMenuBarVisibility(false)
}

app.whenReady().then(() => {
  createMainWindow();

  ipcMain.handle('createSave', async () => {
    const result = await dialog.showSaveDialog({
      title: 'Create Save File',
      defaultPath: path.join(app.getPath('documents'), 'save.json'),
      filters: [
        { name: 'JSON Files', extensions: ['json'] }
      ]
    });
    if (result.canceled) return;
    const filePath = result.filePath;

    const template = {
      "a": [
        
      ],
      "m": [
        
      ],
      "o": [
        
      ]
    };

    try {
      fs.writeFileSync(filePath, JSON.stringify(template, null, 2), 'utf8');
      console.log('save file created successfully');
      return filePath;
    } catch (error) {
      console.error('error creating save file', error);
      return null;
    }
  });

  ipcMain.handle('openSave', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'JSON Files', extensions: ['json'] }
        ]
    });
    if (result.canceled) return;
    return result.filePaths[0];
  });

  ipcMain.handle('readSave', async (event, filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        console.log('saved loaded successfully');
        return JSON.parse(data);
    } catch (error) {
        console.error('error loading save', error);
        return null;
    }
  });

  ipcMain.handle('writeSave', async (event, filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  });

  ipcMain.handle('openURL', (event, url) => {
    shell.openExternal(url);
  });

  ipcMain.handle('revealSave', (event, filePath) => {
    shell.showItemInFolder(filePath);
  });
});

app.on('second-instance', (event, commandLine, workingDirectory) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});