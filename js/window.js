var topBarDOM = "<div class=\"top-bar\">"+
				"<span id=\"frame-title\"></span>"+
				"<input type=\"button\" onclick=\"CloseWindow(this.parentNode.parentNode);\"value=\"X\">"+ // dunno why but need to switch them
				"<input type=\"button\" onclick=\"FullWindow(this.parentNode.parentNode);\"value=\"&#x2922;\">"+
				"</div>";

function CreateWindow(id) {
		$("body").append("<section class=\"window\" id="+id+"-window>"+
			topBarDOM+
			"</section>");

		$(".window").resizable({
			animate: true
		});
		$( ".window" ).draggable({
			containment: "body",
			scroll: false 
		});
}

function AddWindowContent(id) {
	var url;
	
	switch(id) {
		case "database":
			url = "http://163.172.46.202:409";
		break;
		case "notepad":
			url = "https://todoist.com";
		break;
		case "browser":
			url = "https://search.elanis.eu";
		default:
			url = id + ".php";
	}

	$("#"+id+"-window").append(
		"<iframe id=\"window-frame\" src=\""+url+"\"></iframe>");
}

function CloseWindow(node) {
	node.remove();
}

function FullWindow(node) {
	// Need to add it
}
