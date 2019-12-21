// Npm libs
let electron = {app, BrowserWindow, ipcMain} = require('electron');
global.app = electron.app;
global.BrowserWindow = electron.BrowserWindow;
global.ipcMain = electron.ipcMain;

let fork = require('child_process').fork;

// Local libs
global.fileScanner = require('./fileScanner');

// windowManager
require('./windowManager');

// TTS & SST & Cmd
global.tts = require('./tts');


// Music
require('./music');

// Pictures
require('./pictures');

// Videos & Movies
require('./videos');

// Init app
function init() {
	global.mainWindow = createWindow("Projet L.U.M.E.N - Learned United Machines of Elanis Network", 'views/index.html', 1920, 1080);
}

app.on('ready', init);