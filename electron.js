const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

// Determine if we're in development or production
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

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
    show: false, // Don't show until ready
  });

  // Show window when ready to avoid visual flicker
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
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
  if (!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'EPUB Books', extensions: ['epub'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    try {
      const fileBuffer = await fs.readFile(filePath);
      return {
        path: filePath,
        data: Array.from(fileBuffer),
      };
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }

  return null;
});

// Cache management
const getCachePath = () => {
  return path.join(app.getPath('userData'), 'image-cache');
};

ipcMain.handle('save-to-cache', async (event, { key, data }) => {
  try {
    const cachePath = getCachePath();
    await fs.mkdir(cachePath, { recursive: true });
    await fs.writeFile(path.join(cachePath, `${key}.json`), JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to cache:', error);
    return false;
  }
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
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
});

ipcMain.handle('get-cache-stats', async () => {
  try {
    const cachePath = getCachePath();
    await fs.mkdir(cachePath, { recursive: true });
    const files = await fs.readdir(cachePath);

    let totalSize = 0;
    for (const file of files) {
      const stats = await fs.stat(path.join(cachePath, file));
      totalSize += stats.size;
    }

    return {
      fileCount: files.length,
      totalSize: totalSize,
      path: cachePath,
    };
  } catch {
    return {
      fileCount: 0,
      totalSize: 0,
      path: getCachePath(),
    };
  }
});
