window.addEventListener('load', function() {
	document.querySelector("#module-tools-devdocs")
		.addEventListener("click", function() {
			remote.getGlobal("createWindow")("Devdocs", 'https://devdocs.io');
	});

	document.querySelector("#module-tools-dehash")
		.addEventListener("click", function() {
			remote.getGlobal("createWindow")("Dehash.me", '***REMOVED***');
	});

	document.querySelector("#module-tools-galactae")
		.addEventListener("click", function() {
			remote.getGlobal("createWindow")("Galactae Admin Console", '***REMOVED***/secret42');
	});

	document.querySelector("#module-tools-mongo")
		.addEventListener("click", function() {
			remote.getGlobal("createWindow")("Mongo Admin Console", 'http://localhost:1234');
	}); 

	document.querySelector("#module-tools-sonar")
		.addEventListener("click", function() {
			remote.getGlobal("createWindow")("Sonar", 'http://172.17.0.9:9000');
	});

	document.querySelector("#module-tools-howtoopenme")
		.addEventListener("click", function() {
			remote.getGlobal("createWindow")("How to open me ?", 'https://howtoopen.me');
	});

	document.querySelector("#module-tools-todoist")
		.addEventListener("click", function() {
			remote.getGlobal("createWindow")("Todoist ?", 'https://todoist.com');
	});
});