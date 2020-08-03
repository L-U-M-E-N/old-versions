const remote = require('electron').remote;

window.addEventListener('load', function() {
	const closebtn = document.querySelector('#window-close-button');

	if(!closebtn) {
		return;
	}

	closebtn.addEventListener('click', function() {
		if(typeof currentWindow === 'undefined') {
			console.log('Impossible de connaitre la fenetre courant - abandon');
			return;
		}

		if(currentWindow !== 'index') {
			remote.getCurrentWindow().close();
		} else {
			remote.getGlobal('exitPopup')();
		}
	});

	document.addEventListener('keydown', function(e) {
		if (e.which === 123) {
			remote.getCurrentWindow().toggleDevTools();
		}
	});
});

const viewNames = {
	music: 'Musique',
	pictures: 'Images',
};

window.addEventListener('beforeunload', function() {
	remote.getGlobal('console').log('Closing ' + currentWindow);
	remote.getGlobal('closeWindow')(viewNames[currentWindow]);
});