const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#0a0a0a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset',
    frame: true,
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'EPUB Books', extensions: ['epub'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const fileBuffer = await fs.readFile(filePath);
    return {
      path: filePath,
      data: Array.from(fileBuffer),
    };
  }

  return null;
});

// Cache management
const getCachePath = () => {
  return path.join(app.getPath('userData'), 'image-cache');
};

ipcMain.handle('save-to-cache', async (event, { key, data }) => {
  const cachePath = getCachePath();
  await fs.mkdir(cachePath, { recursive: true });
  await fs.writeFile(path.join(cachePath, `${key}.json`), JSON.stringify(data));
  return true;
});

ipcMain.handle('get-from-cache', async (event, key) => {
  try {
    const cachePath = getCachePath();
    const data = await fs.readFile(path.join(cachePath, `${key}.json`), 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
});

ipcMain.handle('clear-cache', async () => {
  try {
    const cachePath = getCachePath();
    const files = await fs.readdir(cachePath);
    await Promise.all(files.map(file => fs.unlink(path.join(cachePath, file))));
    return true;
  } catch {
    return false;
  }
});
