var app = {
    currentWindow: "",
    alreadyLoaded: [],

    // Application Constructor
    initialize: function() {
    	$(document).ready(function() {
    		// Menu
			$('#menu ul li').click(function() {
				app.openWindow($(this).attr('id'));
                
                $('#menu .active').removeClass('active');

                CloseMenu();

                if(app.currentWindow==$(this).attr('id').substr(5)) {
                    $(this).addClass('active');
                }
			});

            $('#windows-home').css('display','block');
   		});
    },

    openProgram: function(id) {
        if(this.alreadyLoaded[id] == undefined || !this.alreadyLoaded[id]) {
            this.alreadyLoaded[id] = true;

            var replace = true;
            var url = "";

            switch(id) {
                case "music":
                    url = "music.php";
                    break;
                case "pictures":
                    url = "pictures.php";
                    break;
                case "videos":
                    url = ""; // Add when project begin
                    break;  
                case "monitoring":
                    url = "monitoring.php";
                    break;                   
                case "analytics":
                    url = "analytics.php";
                    break;
                case "sql":
                    url = "https://172.17.0.11";
                    break;
                case "galactaeConsole":
                    url = "***REMOVED***/secret42";
                    break;
                case "mongo":
                    url = "https://localhost:8081";
                    break;
                case "notepad":
                    url = "https://todoist.com";
                    break;
                case "search":
                    url = ""; // Add when project begin
                    break;
                default:
            }

            if(replace && url !="") {
                $("#windows-" + id).html("<iframe id=\"window-frame\" src=\""+url+"\"></iframe>");
            } else if(url !="") {
                $("#windows-" + id).append("<iframe id=\"window-frame\" src=\""+url+"\"></iframe>");
            }

        }
    },

    openWindow: function(id) {
        id = id.substr(5);
        var oldWindow = this.currentWindow;

        var same = false;
        if(this.currentWindow==id) {
            same=true;
            this.currentWindow = "home";
        } else {
            this.currentWindow = id;      
        }

        if(!same) {
           this.openProgram(id);
           $('#windows-' + id).css('display','block');
        } else {
            $('#windows-home').css('display','block');
        }

        $("#windows-" + oldWindow).css('display','none');
    },

    closeWindow: function() {
        $('#windows-' + this.currentWindow).css('display','none');
    }
};

app.initialize();