const DEFAULT_WIDTH = 1366;
const DEFAULT_HEIGHT = 768;

global.window = {
	Musique: false,
	Images: false,
};

global.createWindow = function(title,
						documentURL, 
						width=DEFAULT_WIDTH,
						height=DEFAULT_HEIGHT,
						options={}) {

	if(window[title] === true) { return {}; }

	if(window[title] === false) {
		window[title] = true;
	}

	let externalURL = (documentURL.substr(0,4) == "http");

	let windowData = {
		width,
		height,
		frame: externalURL,
		autoHideMenuBar: externalURL,
		icon: 'img/icon.png',
		webPreferences: {
			nodeIntegration: true,
		},
		title,
	};

	if(options !== undefined) {
		for(var i in options) {
			windowData[i] = options[i];
		}
	}

	let win = new BrowserWindow(windowData);

	// et charge le index.html de l'application.
	if(externalURL) {
		win.loadURL(documentURL);
	} else {
		win.loadFile(documentURL);
	}

	return win;
};

global.closeWindow = function(title) {
	window[title] = false;
};

global.exitPopup = function() {
	var options = {
		parent: mainWindow,
		modal: true,
		resizable: false,
	};

	createWindow("Confirmation de fermeture", 'views/exitPopup.html',300,150, options);
};