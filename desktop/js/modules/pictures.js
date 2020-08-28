const picList = remote.getGlobal('pictureList');

class Pictures {
	static init() {
		if(currentWindow === 'index') {
			const imgDOM = document.getElementsByClassName('module-pictures')[0];

			Pictures.drawRandomImg(imgDOM);
		}
	}

	static drawRandomImg(imgDOM) {
		const tmpList = [];
		for(const i in picList) {
			for(let j=0; j<picList[i].length; j++) {
				tmpList.push(i + '/' + picList[i][j]);
			}
		}

		const elt = tmpList[Math.floor(tmpList.length * Math.random())];
		imgDOM.innerHTML = '<img src="' + Pictures.normalizeFileName(elt) + '">';
	}

	static normalizeFileName(fname) {
		return fname.replace(/ /g, '%20').replace(/'/g,'\\\'').replace(/#/g,'%23');
	}
}

window.addEventListener('load', Pictures.init);
