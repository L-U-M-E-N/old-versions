// Get files
global.pictureList = {};

fileScanner('G:/Pictures',/\.(png|jpg|jpeg|bmp|svg)$/,function(filename){
	let dirName  = filename.split("\\");
	let picName  = dirName.pop();
	dirName      = dirName.join("/");

	if(pictureList[dirName] === undefined) { pictureList[dirName] = []; }
	pictureList[dirName].push(picName);
});