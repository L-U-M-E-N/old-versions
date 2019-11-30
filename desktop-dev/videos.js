// Get files
global.videoList = {};
const extensions = /\.(mp4|mkv|avi)$/;

fileScanner('r:\\', extensions, function(filename){
	let dirName  = filename.split('\\');
	const vidName  = dirName.pop();
	dirName      = dirName.join('/');

	if(videoList[dirName] === undefined) { videoList[dirName] = []; }
	videoList[dirName].push(vidName);
});
fileScanner('C:\\Users\\elani\\Videos', extensions, function(filename){
	let dirName  = filename.split('\\');
	const vidName  = dirName.pop();
	dirName      = dirName.join('/');

	if(videoList[dirName] === undefined) { videoList[dirName] = []; }
	videoList[dirName].push(vidName);
});