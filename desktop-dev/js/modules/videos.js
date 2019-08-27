class Videos {
	static init() {
		if(currentWindow === 'index') {
			document.getElementById('module-videos-more').addEventListener('click', () => {
				remote.getGlobal('createWindow')('Videos', 'views/videos.html');
			});
		}
	}
}