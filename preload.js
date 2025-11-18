const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  saveToCache: (key, data) => ipcRenderer.invoke('save-to-cache', { key, data }),
  getFromCache: (key) => ipcRenderer.invoke('get-from-cache', key),
  clearCache: () => ipcRenderer.invoke('clear-cache'),
});
