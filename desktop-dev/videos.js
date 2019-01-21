// Get files
global.videoList = {};
let extensions = /\.(mp4|mkv|avi)$/;

fileScanner('s:\\', extensions, function(filename){
	let dirName  = filename.split("\\");
	let vidName  = dirName.pop();
	dirName      = dirName.join("/");

	if(videoList[dirName] === undefined) { videoList[dirName] = []; }
	videoList[dirName].push(vidName);
});
fileScanner('C:\\Users\\elani\\Videos', extensions, function(filename){
	let dirName  = filename.split("\\");
	let vidName  = dirName.pop();
	dirName      = dirName.join("/");

	if(videoList[dirName] === undefined) { videoList[dirName] = []; }
	videoList[dirName].push(vidName);
});