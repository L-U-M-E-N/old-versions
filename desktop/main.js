const { app, BrowserWindow, ipcMain } = require('electron');
global.app = app;
global.BrowserWindow = BrowserWindow;
global.ipcMain = ipcMain;

require('./windowManager');

// Init app
function init() {
	global.mainWindow = createWindow('Projet L.U.M.E.N - Learned United Machines of Elanis Network', 'views/index.html', 1920, 1080);
}

app.on('ready', init);