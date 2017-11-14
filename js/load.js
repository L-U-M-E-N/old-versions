var app = {
    currentWindow: "",
    alreadyLoaded: [],

    // Application Constructor
    initialize: function() {
    	$(document).ready(function() {
    		// Menu
			$('#menu ul li').click(function() {
				app.openWindow($(this).attr('id'));
                $('#menu').addClass('.menu-hided');
                $('#hamburger').removeClass('.hamburger-hided');

                $('#menu .active').removeClass('active');

                if(app.currentWindow==$(this).attr('id').substr(5)) {
                    $(this).addClass('active');
                }
			});

            $('#windows-home').css('display','block');

            $('#hamburger').click(function() {
                $('#menu').removeClass('.menu-hided');
                $('#hamburger').addClass('.hamburger-hided');
            });
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
                    url = "https://galactae.eu/secret42";
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

            console.log(id);
            console.log("#windows-" + id);
            console.info($("#windows-" + id));

            if(replace && url !="") {
                $("#windows-" + id).html("<iframe id=\"window-frame\" src=\""+url+"\"></iframe>");
            } else if(url !="") {
                $("#windows-" + id).append("<iframe id=\"window-frame\" src=\""+url+"\"></iframe>");
            }

        }
    },

    openWindow: function(id) {
        id = id.substr(5);

        var same = false;
        if(this.currentWindow==id) {
            same=true;
            this.currentWindow = "home";
        } else {
            this.currentWindow = id;      
        }

        windowList=$('#windows *');

        for(var i=0; i<windowList.length; i++) {
            $(windowList[i]).css('display','none');
        }
        if(!same) {
           $('#windows-' + id).css('display','block');
           this.openProgram(id);
        } else {
            $('#windows-home').css('display','block');
        }
    },

    closeWindow: function() {
        $('#windows-' + this.currentWindow).css('display','none');
    }
};

app.initialize();