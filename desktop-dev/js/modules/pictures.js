const imgCount = 4;
let picList = remote.getGlobal('pictureList');

class Pictures {
	static init() {
		if(currentWindow == 'index') {
			const imgDOM = document.getElementsByClassName('module-pictures')[0];

			Pictures.drawRandomImg(imgDOM);

			imgDOM.innerHTML += '<br/><br/><span id="module-pictures-more">Plus d\'images</span>';

			document.getElementById('module-pictures-more').addEventListener('click', function() {
				remote.getGlobal('createWindow')('Images', 'views/pictures.html');
			});
		} else {
			const listDOM = document.getElementById('main-pictures-list');
			listDOM.innerHTML = '';
			for(const i in picList) {
				const folders = i.split('/');
				listDOM.innerHTML += '<li class="tile" style="background-image: url(\'' + Pictures.normalizeFileName(i + '/' + picList[i][0]) + '\');" folder="' + i + '">' +
					'<p>' + folders[folders.length - 1] + '</p>' +
				'</li>';
			}

			const tilesDOM = listDOM.getElementsByClassName('tile');
			Array.from(tilesDOM).forEach((elt) => {
				elt.addEventListener('click', function() {
					Pictures.openFolder(this.getAttribute('folder'));
				});
			});

			document.getElementById('main-pictures-folder-close').addEventListener('click', function() {
				Pictures.closeFolder();
			});

			document.getElementById('main-pictures-file-view-close').addEventListener('click', function() {
				Pictures.closeFile();
			});
		}
	}

	static drawRandomImg(imgDOM) {
		const blacklist = [
			'MIA',
			'Moi',
			'Souvenirs'
		];
		const imgMain = new Set();
		const tmpList = [];
		for(const i in picList) {
			let blacklisted = false;
			for(const bl in blacklist) {
				if(i.includes(blacklist[bl])) {
					blacklisted = true;
					break;
				}
			}
			if(blacklisted) { continue; }

			for(let j=0; j<picList[i].length; j++) {
				tmpList.push(i + '/' + picList[i][j]);
			}
		}

		while(imgMain.size < imgCount) {
			const elt = tmpList[Math.floor(tmpList.length * Math.random())];

			imgMain.add(elt);
		}

		for(const item of imgMain) {
			imgDOM.innerHTML += '<img src="' + Pictures.normalizeFileName(item) + '">';
		}
	}

	static openFolder(folderName) {
		document.getElementById('main-pictures-list').style.display = 'none';
		document.getElementById('main-pictures-folder-close').style.display = 'block';
		const listDOM = document.getElementById('main-pictures-folder');
		listDOM.style.display = 'block';
		listDOM.innerHTML = '';

		for(let i=0; i<picList[folderName].length; i++) {
			listDOM.innerHTML += '<li class="tile" style="background-image: url(\'' + Pictures.normalizeFileName(folderName + '/' + picList[folderName][i]) + '\');"></li>';
		}

		const tilesDOM = listDOM.getElementsByClassName('tile');
		Array.from(tilesDOM).forEach((elt) => {
			elt.addEventListener('click', function() {
				Pictures.openFile(this.style.backgroundImage.slice(4, -1).replace(/"/g, ''));
			});
		});
	}

	static closeFolder() {
		document.getElementById('main-pictures-list').style.display = 'block';
		document.getElementById('main-pictures-folder-close').style.display = 'none';
		document.getElementById('main-pictures-folder').style.display = 'none';
	}

	static openFile(file) {
		document.getElementById('main-pictures-folder').style.display = 'none';
		document.getElementById('main-pictures-folder-close').style.display = 'none';

		document.getElementById('main-pictures-file-view').src = file;
		document.getElementById('main-pictures-file-view').style.display = 'block';
		document.getElementById('main-pictures-file-view-close').style.display = 'block';
	}

	static closeFile() {
		document.getElementById('main-pictures-folder').style.display = 'block';
		document.getElementById('main-pictures-folder-close').style.display = 'block';
		document.getElementById('main-pictures-file-view').style.display = 'none';
		document.getElementById('main-pictures-file-view-close').style.display = 'none';

	}

	static normalizeFileName(fname) {
		return fname.replace(/ /g, '%20').replace(/'/g,'\\\'').replace(/#/g,'%23');
	}
}
window.addEventListener('load', Pictures.init);