const imgCount = 4;
const picList = remote.getGlobal('pictureList');

class Pictures {
	static init() {
		if(currentWindow === 'index') {
			const imgDOM = document.getElementsByClassName('module-pictures')[0];

			Pictures.drawRandomImg(imgDOM);

			imgDOM.innerHTML += '<br/><br/><span id="module-pictures-more">Plus d\'images</span>';

			document.getElementById('module-pictures-more').addEventListener('click', () => {
				remote.getGlobal('createWindow')('Images', 'views/pictures.html');
			});
		} else {
			const listDOM = document.getElementById('main-pictures-list');
			let htmlContent = '';
			for(const i in picList) {
				const folders = i.split('/');
				htmlContent += '<li class="tile" style="background-image: url(\'' + Pictures.normalizeFileName(i + '/' + picList[i][0]) + '\');" folder="' + i + '">' +
					'<p>' + folders[folders.length - 1] + '</p>' +
				'</li>';
			}
			listDOM.innerHTML = htmlContent;

			const tilesDOM = listDOM.getElementsByClassName('tile');
			Array.from(tilesDOM).forEach((elt) => {
				elt.addEventListener('click', () => {
					Pictures.openFolder(elt.getAttribute('folder'));
				});
			});

			document.getElementById('main-pictures-folder-close').addEventListener('click', () => {
				Pictures.closeFolder();
			});

			document.getElementById('main-pictures-file-view-close').addEventListener('click', () => {
				Pictures.closeFile();
			});
		}
	}

	static drawRandomImg(imgDOM) {
		const blacklist = [
			'Archives',
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

		let content = '';
		for(const item of imgMain) {
			content += '<img src="' + Pictures.normalizeFileName(item) + '">';
		}
		imgDOM.innerHTML = content;
	}

	static openFolder(folderName) {
		document.getElementById('main-pictures-list').style.display = 'none';
		document.getElementById('main-pictures-folder-close').style.display = 'block';
		const listDOM = document.getElementById('main-pictures-folder');
		listDOM.style.display = 'block';

		while(listDOM.firstChild) {
			listDOM.removeChild(listDOM.firstChild);
		}

		function loadPicture(i=0) {
			if(i >= picList[folderName].length) {
				const tilesDOM = listDOM.getElementsByClassName('tile');
				Array.from(tilesDOM).forEach((elt) => {
					elt.addEventListener('click', () => {
						Pictures.openFile(elt.style.backgroundImage.slice(4, -1).replace(/"/g, ''));
					});
				});

				return;
			}

			const elt = document.createElement('li');

			const bgImg = new Image();
			bgImg.onload = () => {
				elt.classList.add('tile');
				elt.style.backgroundImage = 'url(\'' + bgImg.src + '\')';

				listDOM.appendChild(elt);

				loadPicture(++i);
			};
			bgImg.onerror = () => {
				loadPicture(++i);
			};

			bgImg.src = Pictures.normalizeFileName(folderName + '/' + picList[folderName][i]);
		}
		loadPicture();
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