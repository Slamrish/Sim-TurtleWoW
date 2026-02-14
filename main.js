const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        icon: path.join(__dirname, 'favicon.ico')
    });

    // Load the main HTML file
    mainWindow.loadFile('turtle.html');

    // Open DevTools in development mode
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    // Create application menu
    const menuTemplate = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Save Configuration',
                    accelerator: 'CmdOrCtrl+S',
                    click: async () => {
                        const { filePath } = await dialog.showSaveDialog(mainWindow, {
                            title: 'Save Character Configuration',
                            defaultPath: 'character-config.json',
                            filters: [
                                { name: 'JSON Files', extensions: ['json'] },
                                { name: 'All Files', extensions: ['*'] }
                            ]
                        });

                        if (filePath) {
                            mainWindow.webContents.send('save-config', filePath);
                        }
                    }
                },
                {
                    label: 'Load Configuration',
                    accelerator: 'CmdOrCtrl+O',
                    click: async () => {
                        const { filePaths } = await dialog.showOpenDialog(mainWindow, {
                            title: 'Load Character Configuration',
                            filters: [
                                { name: 'JSON Files', extensions: ['json'] },
                                { name: 'All Files', extensions: ['*'] }
                            ],
                            properties: ['openFile']
                        });

                        if (filePaths && filePaths.length > 0) {
                            try {
                                const configData = fs.readFileSync(filePaths[0], 'utf-8');
                                mainWindow.webContents.send('load-config', configData);
                            } catch (err) {
                                dialog.showErrorBox('Error Loading Configuration', err.message);
                            }
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        mainWindow.reload();
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'CmdOrCtrl+Shift+I',
                    click: () => {
                        mainWindow.webContents.toggleDevTools();
                    }
                },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About Turtle WoW DPS Simulator',
                            message: 'Turtle WoW DPS Simulator',
                            detail: 'A multi-class DPS simulation tool for Turtle WoW\n\nVersion: 1.0.0'
                        });
                    }
                },
                {
                    label: 'GitHub Repository',
                    click: async () => {
                        const { shell } = require('electron');
                        await shell.openExternal('https://github.com/Slamrish/Sim-TurtleWoW');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

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
