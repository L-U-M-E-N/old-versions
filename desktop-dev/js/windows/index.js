currentWindow = "index";

window.addEventListener('load', function() {
	document.querySelector("#module-music-more")
		.addEventListener("click", function() {
			if(!remote.getGlobal("window").music) {
				remote.getGlobal("createWindow")("Musique", 'views/music.html');
				remote.getGlobal("window").music = true;
			}
	});
});