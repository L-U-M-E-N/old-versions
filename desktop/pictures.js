// Get files
global.pictureList = {};

fileScanner('PATHTOPICTURES',/\.(png|jpg|jpeg|bmp|svg)$/,function(filename){
	let dirName  = filename.split('\\');
	const picName  = dirName.pop();
	dirName      = dirName.join('/');

	if(pictureList[dirName] === undefined) { pictureList[dirName] = []; }
	pictureList[dirName].push(picName);
});