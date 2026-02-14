const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'electronAPI',
    {
        // Listen for save-config event from main process
        onSaveConfig: (callback) => {
            ipcRenderer.on('save-config', (event, filePath) => callback(filePath));
        },
        // Listen for load-config event from main process
        onLoadConfig: (callback) => {
            ipcRenderer.on('load-config', (event, configData) => callback(configData));
        },
        // Save configuration data
        saveConfig: (filePath, data) => {
            ipcRenderer.send('write-config', filePath, data);
        },
        // Platform information
        platform: process.platform,
        // Check if running in Electron
        isElectron: true
    }
);
