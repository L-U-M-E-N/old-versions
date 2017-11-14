var chatOpen = false;

function ToggleChat() {
	if(chatOpen) { 
		$("#chat").fadeOut(300);
		chatOpen=false;
	} else { 
		$("#chat").fadeIn(300);
		chatOpen=true;
	}
}

function taskbarClick(id) {
	if(document.getElementById(""+id+"-window") === null) {
		CreateWindow(id);
		AddWindowContent(id);
	}
}