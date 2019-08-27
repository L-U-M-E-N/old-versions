/* Launch Chat */
function ChatLaunch()
{
 var chatext = document.getElementById('text-write');
 chatext.addEventListener('keydown',ChatAction);

 ChatPrint('Bonjour '+username+', bienvenue sur l\'interface de commande de l\'assistant personnel!','Assistant','boot');
}
window.addEventListener('load',ChatLaunch);

/* Command Detection */
function ChatAction()
{    
	// IE
    if(event.keyCode == 13) {
        event.returnValue = false;
        event.cancelBubble = true;
    }
    // DOM
    if(event.which == 13) {
        event.preventDefault();
        event.stopPropagation();
    }

	var chatext = document.getElementById('text-write');
	var cmd = chatext.innerHTML;

    // Send Message to AI
    if ((event.which == 13 || event.keyCode == 13) && cmd!="" ) {

		ChatPrint(cmd,username);

		answer = GenerateAnswer(cmd)

		Log(cmd);

		if(answer!="")
		{
			Log(answer);
			ChatPrint(answer,'Assistant');
		}
		chatext.innerHTML = "";
    }
}

/* Priting Chat */
function ChatPrint(text,user,type="")
{
	var chat = document.getElementById('text-logs');
	var intext = chat.innerHTML;

	if(type==""&&text!="")
	{
		intext = intext + '<b>'+user+' :</b> '+text+'<br />';
	}
	else if(type=="ping") 
	{
		intext = intext + '<b>'+user+' :</b> Ping : '+text+' ms<br />';
	}
	else if(type=="cpu") 
	{
		intext = intext + '<b>'+user+' :</b> CPU : '+text+' %<br />';
	}
	else if(type=="hdd") 
	{
		intext = intext + '<b>'+user+' :</b> Disque dur : '+text+' %<br />';
	}
	else if(type=="ram") 
	{
		intext = intext + '<b>'+user+' :</b> Mémoire vive: '+text+'<br />';
	}
	else if(type=="boot") 
	{
		intext = '<b>'+user+' :</b> '+text+'<br />';
	}
	chat.innerHTML = intext;
	chat.scrollIntoView(false); //Get the scrollbar down	
}

/* Keep it in logs */
function Log(text)
{

}

/* Generate an answer for a command */
function GenerateAnswer(cmd)
{
	//Do that fucking command
	var answer = "";
	var parts = cmd.split(" ");
	var blocked=0;

	for(var i=0;i<parts.length;i++)
	{
		switch(parts[i].toLowerCase())
		{
			case "coucou":
			case "salut":
			case "bonjour":
			case "yop":
			case "hello":
			case "yo":
			case "bijour":
				answer = answer + ChatRandomHello();
			break;
			case "ça":
			case "ca":
				if(parts[i+1]=="va")
				{
					if(parts[i+2]=="?"||parts[i+2]==null||parts[i+2]=="bien")
					{
						answer = answer + ChatRandomFeelings();
					}
				}
			break;
			case "42":
				ChatRandomEasterEgg();
				blocked==1;
			break;
			case "merci":
			case "thx":
			case "thanks":
				answer = answer + ChatRandomThanks();
			break;
			case "you":
			case "you?":
			case "you-":
				if(parts[i+1]==null||parts[i+1]=="?")
				{
					answer="Porn ?"
				}
			break;
			case "aurevoir":
			case "au":
			case "bye":
			case "a+":
				if(parts[i]=="au")
				{
					if(parts[i+1]=="revoir")
					{
						answer = answer + ChatRandomBye();
					}
				}
				else
				{
				answer = answer + ChatRandomBye();
				}
			break;
			case "media center":
				LaunchMediaCenter();
			break;
			case "ping":
				if(parts[i+1]==null||parts[i+1]=="?")
				{
					HyperspaceWindow("ping");
					blocked=1;
				}
			break;
			case "cpu":
				HyperspaceWindow("cpu");
				blocked=1;
			break;
			case "hdd":
				HyperspaceWindow("hdd");
				blocked=1;
			break;
			case "ram":
				HyperspaceWindow("ram");
				blocked=1;
			break;
			case "login":
				Login(parts[i+1],parts[i+2]);
			break;
			case "willy":
			case "call":
			case "cod":
				if(parts[i+1]==null||parts[i+1]=="gmod"||(parts[i+1]=="of"&&parts[i+2]=="duty"))
				{
				answer = "EEEEEEEEEEEENORME BLAGUE !";
				}
			break;
			case "sms":
				SendSMS(cmd.substring(3));
				blocked=1;
				return "";
			break;
			case "boot":
			case "reboot":
			case "clear":
				ChatLaunch();
				blocked=1;
			default:

		}
	}

	if(answer==""&&blocked==0&&parts.length>0)
	{
		answer = "Je n'ai pas compris votre phrase. Veuillez reformuler."
	}

	return answer;
}
/* Random Texts */
function ChatRandomHello()
{
	var text = ['Salut !','Coucou !','Bonjour !'];
	var answer = ' ' + text[Math.floor(Math.random()*text.length)];
	return answer;
}
function ChatRandomFeelings()
{
	var text = ['Bien !','Tranquille !','La notion de bien etre est subjective a l\'etre humain.'];
	var answer = ' ' + text[Math.floor(Math.random()*text.length)];
	return answer;
}
function ChatRandomBye()
{
	var text = ['Au revoir !','++','Bye !','Sayonara !'];
	var answer = ' ' + text[Math.floor(Math.random()*text.length)];
	return answer;
}
/* Random Actions */
function ChatRandomEasterEgg()
{
	var eastercount = 1;

	var choice = Math.round(Math.random()*eastercount);

	if(choice==1) //Xana come !
	{


	}
}
function ChatRandomThanks()
{
	var text = ['Mais de rien !','De rien','T\'inquietes','Pas de problemes !'];
	var answer = ' ' + text[Math.floor(Math.random()*text.length)];
	return answer;
}




//PHP Query
var hyperanswer = "";

function HyperspaceWindow(type)
{
	var hw = document.getElementById("hyperspacewindow");

	hw.src = "hyperspacewindow.php?t="+type;

	hw.onload = function(){ 

	hyperanswer = hw.contentWindow.document.body.innerHTML;
	ChatPrint(hyperanswer,"Assistant",type);

	}
}

//SMS
function SendSMS(sms)
{
	var hw = document.getElementById("hyperspacewindow");

	hw.src = "https://smsapi.free-mobile.fr/sendmsg?user=21251151&pass=BL9jFPxKUuUi0f&msg="+sms;

	hw.onload = function(){ 

	hyperanswer = hw.contentWindow.document.body.innerHTML;
	ChatPrint(hyperanswer,"Assistant",type);

	}
}