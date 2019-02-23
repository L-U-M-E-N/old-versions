const ipcRenderer = require('electron').ipcRenderer;
let audioDOM;

let playlist           = [];
let playlistSrc        = [];
let orderedPlaylist    = [];
let orderedPlaylistSrc = [];
let playlistCurrent    = 0;
let playlistRandom     = false;
let lastRemove = 0;

class Music {
	/**
	 * Load
	 */
	static init() {
		if(localStorage.audioVolume == undefined) {
			localStorage.audioVolume = 50;
		}

		if(currentWindow == "index") {
			ipcRenderer.on('musicChanged', function() {
				Music.changeMusic();
			});

			// DOM
			audioDOM = document.querySelector('#audio');

			// Volume
			Music.updateVolume();
			document.querySelector("#module-music-incVol")
				.addEventListener('click', Music.increaseVolume);
			document.querySelector("#module-music-decVol")
				.addEventListener('click', Music.decreaseVolume);

			// Next/Prev
			document.querySelector("#module-music-prev")
				.addEventListener('click', Music.prevMusic);
			document.querySelector("#module-music-next")
				.addEventListener('click', Music.nextMusic);

			// Play/Pause
			document.querySelector("#module-music-playPause")
				.addEventListener('click', Music.togglePlayPause);

			// Next on end
			audioDOM.addEventListener('ended', Music.nextMusic);
			audioDOM.addEventListener('error', Music.nextMusic);
			audioDOM.addEventListener('stalled', Music.nextMusic);

			// Open window
			document.getElementById('module-music-more').addEventListener('click', function() {
				remote.getGlobal("createWindow")("Musique", 'views/music.html');
			});

			// Clavier
			document.addEventListener('keydown', function(e) {
				switch(e.which) {
					case 32: // Play/Pause
						Music.togglePlayPause();
						break;
					case 39: // Next music ( Right Arrow )
						Music.nextMusic();
						break;
					case 37: // Prev music ( Left Arrow )
						Music.prevMusic();
						break;
					case 38: // Up volume ( Up Arrow )
						Music.increaseVolume();
						break;
					case 40: // Down volume ( Down Arrow )
						Music.decreaseVolume();
						break;
					default:
					// Do nothing
				}
			});

			// Mise a jour du temps
			setInterval(function() {
				if(audioDOM.paused) { return; }

				let secCurr = parseInt(("" + audioDOM.currentTime).split('.')[0])%60;
				if(secCurr < 10) { secCurr = "0" + secCurr; }

				let secDuration = parseInt(("" + audioDOM.duration).split('.')[0])%60;
				if(secDuration < 10) { secDuration = "0" + secDuration; }

				document.querySelector("#module-music-time")
					.innerText = Math.floor(audioDOM.currentTime/60) + ":" + secCurr + 
						"/" + Math.floor(audioDOM.duration/60) + ":" + secDuration;
			}, 1000);
		} else if(currentWindow == "music") {
			Music.regenerateAlbumList();

			ipcRenderer.on('fileListUpdated', function() {
				window.location.reload();
			});

			if(remote.getGlobal("playlistRandom")) {
				document.querySelector('#playlist-random')
					.style.color = "red";
			}

			// Clavier
			document.addEventListener('keydown', function(e) {
				switch(e.which) {
					case 27: // Hide album details
						Music.hideAlbum(e);
						break;
					default:
					// Do nothing
				}
			});

			document.querySelector('#playlist-refresh')
				.addEventListener('click', Music.refreshList);
			document.querySelector('#playlist-random')
				.addEventListener('click', Music.toggleRandom);
			document.querySelector('#playlist-clear')
				.addEventListener('click', Music.clearPlayList);
			document.querySelector('#album-details')
				.addEventListener('contextmenu', Music.hideAlbum);
			document.querySelector('#album-details-close')
				.addEventListener('click', Music.hideAlbum);

			// Recuperation de la session precedente
			playlist = remote.getGlobal('playlist');
			playlistSrc = remote.getGlobal('playlistSrc');
			orderedPlaylist = remote.getGlobal('orderedPlaylist');
			orderedPlaylistSrc = remote.getGlobal('orderedPlaylistSrc');
			playlistCurrent = remote.getGlobal('playlistCurrent');
			playlistRandom = remote.getGlobal('playlistRandom');

			Music.drawPlaylist();
		}
	}

	/**
	 * Misc functions
	 */
	static scramblePlaylist() {
		let j, x;
		playlistCurrent = remote.getGlobal('playlistCurrent');

		for (let i = playlist.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));

			// Swap titles
			x = playlist[i];
			playlist[i] = playlist[j];
			playlist[j] = x;

			// Swap sources
			x = playlistSrc[i];
			playlistSrc[i] = playlistSrc[j];
			playlistSrc[j] = x; 

			if(i==playlistCurrent) { 
				playlistCurrent = j; 
			} else if(j==playlistCurrent) { 
				playlistCurrent = i; 
			}
		}
	}
	static updateVarsToMain() {
		ipcRenderer.send('updateVars', {
			playlist,
			playlistSrc,
			orderedPlaylist,
			orderedPlaylistSrc,
			playlistCurrent,
			playlistRandom
		});
	}
	static clearPlayList() {
		playlist           = [];
		playlistSrc        = [];
		orderedPlaylist    = [];
		orderedPlaylistSrc = [];
		playlistCurrent    = 0;

		Music.updateVarsToMain();
		Music.drawPlaylist();
		remote.getGlobal("musicEvents").musicChanged();
	}
	static refreshList() {
		remote.getGlobal("musicEvents").updateFiles();
	}

	/**
	 * Module on main window
	 */
	static changeMusic() {
		if(remote.getGlobal("playlistSrc").length == 0) {
			document.querySelector('#module-music-img')
				.src = 'G:/Musique/_icons/noimage.jpg';
			document.querySelector("#module-music-title").innerText = "Playlist vide";
			audioDOM.src = "";
			document.querySelector("#module-music-time").innerText = "0:00/0:00";
			return;
		}

		let musicURL = remote.getGlobal("playlistSrc")[remote.getGlobal("playlistCurrent")];
		if(musicURL == undefined) { return; }

		if(audioDOM.src == "file:///" + musicURL.split(" ").join("%20")) { return; }

		audioDOM.src = musicURL;
		document.querySelector("#module-music-title")
			.innerText = remote.getGlobal("playlist")[remote.getGlobal("playlistCurrent")];
		
		let albumName = musicURL.split("/");
		albumName = albumName[albumName.length - 2];
		if(albumName === undefined) { albumName = 'noimage'; }

		document.querySelector('#module-music-img')
			.src = 'G:/Musique/_icons/' + albumName +'.jpg';

		if(audioDOM.paused) {
			audioDOM.play();
			Music.drawPlayPause();
		}
	}

	static updateVolume() {
		audioDOM.volume = localStorage.audioVolume / 100;
		document.querySelector("#module-music-volume")
			.innerText = localStorage.audioVolume + "%";
	}

	static increaseVolume() {
		if(localStorage.audioVolume >= 100) { return; }
		
		localStorage.audioVolume = parseInt(localStorage.audioVolume) + 2;
		Music.updateVolume();
	}

	static decreaseVolume() {
		if(localStorage.audioVolume <= 0) { return; }
		
		localStorage.audioVolume = parseInt(localStorage.audioVolume) - 2;
		Music.updateVolume();
	}

	static prevMusic() {
		playlistCurrent = remote.getGlobal("playlistCurrent")-1;
		if(playlistCurrent < 0) {
			playlistCurrent = 
				remote.getGlobal("playlist").length;
		}

		ipcRenderer.send('updateCurrent', playlistCurrent);
		Music.changeMusic();
	}

	static nextMusic() {
		playlistCurrent = remote.getGlobal("playlistCurrent")+1;
		if(playlistCurrent > remote.getGlobal("playlist").length - 1) {
			playlistCurrent = 0;
		}
		ipcRenderer.send('updateCurrent', playlistCurrent);
		Music.changeMusic();
	}

	static togglePlayPause() {
		if(audioDOM.paused && remote.getGlobal("playlist")[remote.getGlobal("playlistCurrent")] !== undefined) {
			audioDOM.play();
		} else {
			audioDOM.pause();
		}

		Music.drawPlayPause();
	}

	static drawPlayPause() {
		if(audioDOM.paused) {
			document.querySelector("#module-music-playPause")
				.innerHTML = "&#9654;";
		} else {
			document.querySelector("#module-music-playPause")
				.innerHTML = "&#9208;";
		}
	}

	/**
	 * Music window
	 */
	static drawPlaylist() {
		let playlistHTML = "";

		for(let i=0; i<playlist.length; i++) {
			if(i==remote.getGlobal('playlistCurrent')) {
				playlistHTML += "<li id=\""+i+"\"><b>" + playlist[i] + "</b></li>";
			} else {
				playlistHTML += "<li id=\""+i+"\">" + playlist[i] + "</li>";
			}
		}

		document.querySelector("#music-list").innerHTML = playlistHTML;

		let musicsInPlaylist = document.querySelectorAll("#music-list li");
		for(let m=0; m<musicsInPlaylist.length; m++) {
			musicsInPlaylist[m].addEventListener("click", function() {
				playlistCurrent = parseInt(this.id);
				ipcRenderer.send('updateCurrent', playlistCurrent);
				remote.getGlobal("musicEvents").musicChanged();
				Music.drawPlaylist();
			});

			musicsInPlaylist[m].addEventListener("contextmenu", function() {
				if(Date.now() - lastRemove < 150) { return; }
				lastRemove = Date.now();

				let currId = parseInt(this.id);
				let orderedId = orderedPlaylist.indexOf(playlist[currId]);

				playlist.splice(currId,1);
				playlistSrc.splice(currId,1);

				orderedPlaylist.splice(orderedId,1);
				orderedPlaylistSrc.splice(orderedId,1);

				Music.updateVarsToMain();
				if(currId === playlistCurrent) {
					Music.nextMusic();
				}
				Music.drawPlaylist();
			});
		}
	}

	static drawAlbum(albumID) {
		let content = "";

		// Generer texte
		for(let i=0; i<remote.getGlobal("musicList")[albumID].length; i++) {
			content += '<li class="album-details-music" albumid="' + albumID +'" musicid="' + i +'">' + remote.getGlobal("musicList")[albumID][i] + '</li>';
		}

		document.querySelector('#album-details').innerHTML = content;

		let musicsDOM = document.querySelectorAll('.album-details-music');
		for(let m=0; m<musicsDOM.length; m++) {
			musicsDOM[m].addEventListener('click', function(e) {
				Music.addMusic(this.getAttribute('albumid'), this.getAttribute('musicid'));
			});
		}

		//Hide & show
		document.querySelector('#album-details').style.display = 'block';
		document.querySelector('#album-details-close').style.display = 'block';
		document.querySelector('#albumlist').style.display = 'none';
	}

	static hideAlbum(e) {
		document.querySelector('#album-details').style.display = 'none';
		document.querySelector('#album-details-close').style.display = 'none';
		document.querySelector('#albumlist').style.display = 'block';

		e.preventDefault();
	}

	static toggleRandom() {
		playlistRandom = !remote.getGlobal("playlistRandom");
		if(playlistRandom) {
			Music.scramblePlaylist();
			document.querySelector('#playlist-random')
				.style.color = "red";
		} else {
			playlistCurrent = remote.getGlobal('playlistCurrent');
			for(let i=0; i<orderedPlaylistSrc.length; i++) {
				if(orderedPlaylistSrc[i] === playlistSrc[playlistCurrent]) {
					playlistCurrent = i;
					break;
				}
			}

			playlist    = orderedPlaylist.slice();
			playlistSrc = orderedPlaylistSrc.slice();

			document.querySelector('#playlist-random')
				.style.color = "white";
		}

		Music.updateVarsToMain();
		Music.drawPlaylist();
		ipcRenderer.send('updateRandom', playlistRandom);
	}

	static regenerateAlbumList() {
		let albumHTML = "";

		for(let i in remote.getGlobal("musicList")) {
			let albumName = i.split("/");
			albumName = albumName[albumName.length - 1];
			if(albumName === undefined) { albumName = 'noimage'; }

			albumHTML += '<div class="tile" id="' + i + 
				'" style="background-image: url(\'G:/Musique/_icons/' + albumName +'.jpg\');">' + 
				'<span class="add-album">+</span></div>';
		}

		document.querySelector('#albumlist').innerHTML = albumHTML;

		let albumsDOM = document.querySelectorAll('.album-pic');
		for(let a=0; a<albumsDOM.length; a++) {
			albumsDOM[a].addEventListener('click', function(e) {

				if(e.target.classList.contains('add-album')) {
					// Add an album
					Music.addAlbum(this.id);
				} else {
					// Show an album details
					Music.drawAlbum(this.id);
				}
			});
		}
	}

	static addAlbum(albumID) {
		for(let i=0; i<remote.getGlobal("musicList")[albumID].length; i++) {
			let update = (i !== remote.getGlobal("musicList")[albumID].length - 1);

			Music.addMusic(albumID, i, update);
		}
	}

	static addMusic(albumID, musicID, albumAdd=false) {
		let newsrc = albumID + "/" + remote.getGlobal("musicList")[albumID][musicID];

		if(orderedPlaylistSrc.indexOf(newsrc) != -1) { return; }

		orderedPlaylistSrc.push(newsrc);

		let musicName = remote.getGlobal("musicList")[albumID][musicID].split('.');
		musicName.pop();
		orderedPlaylist.push(musicName.join('.'));

		if(!albumAdd) {
			playlist    = orderedPlaylist.slice();
			playlistSrc = orderedPlaylistSrc.slice();

			if(playlistRandom) {
				Music.scramblePlaylist();
			}

			Music.updateVarsToMain();
			Music.drawPlaylist();
		}
	}
}
window.addEventListener('load', Music.init);