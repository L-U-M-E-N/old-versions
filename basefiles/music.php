<?php
if(!isset($_SESSION['connected']) || $_SESSION['connected'] != true) {
	header('Location: login');
	die();
}

//Variables PHP
$filesAndFolder = File_Find(["./files/Musique"], ["mp3"]);
?>
<style>
/* Fonts */
@import url('https://fonts.googleapis.com/css?family=News+Cycle');


body {
	width: 100%;
	height: calc(100% - 1px);
	margin: 0;
	padding: 0;
	border-top: 1px inset #aaa;
	color: white;
	font-family: 'News Cycle', sans-serif;
}
#audio {
	position: fixed;
	width: 100%;
	bottom: 0;
	left: 0;
	height: 32px;
}
#playlist {
	position: fixed;
	top: 0;
	right: 0;
	height: calc(100% - 32px);
	width: 20%;
	background-color: rgba(150,150,150,0.2);
	border-left: 1px solid #ccc;
}
#playlist-head, #playlist-cmd {
	text-align: center;
	margin: 0;
}
#playlist-cmd span, .album-details-music {
	cursor: pointer;
}
#playlist-cmd, #music-list {
	margin-top: 0.5em;
}
#music-list {
	list-style: none;
    font-size: 0.9em;
    padding: 10px;
    height: calc(100% - 32px - 4em);
    overflow: auto;
}

#albumlist, #album-details {
	position: fixed;
	top: 0;
	left: 0;
	height: calc(100% - 32px);
	width: 80%;
	margin: 0;
	padding: 0;
	overflow-y: scroll;
}
#album-details {
	display: none;
	list-style: none;
}
#album-details li {
	margin-left: 0.5em;
}
.album-pic {
	width: 22.5%;
	padding-top: 22.5%;
	margin: 1%;
	display: inline-block;
	background-size: 90%;
	background-position: 50% 15%;
	background-repeat: no-repeat;
	background-color: rgba(150,150,150,0.2);
	border-radius: 1%;
}
.album-pic:hover, #music-list li:hover {
	cursor: pointer;
}
.album-pic p {
	text-align: center;
}
</style>
<body>
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript">
<?php 
//Music Listing
$musiclist = json_encode($filesAndFolder['files']);
echo "var musiclist = ". $musiclist . ";\n";

//Folder Listing
$albumlist = json_encode($filesAndFolder['folder']);
echo "var albumlist = ". $albumlist . ";\n";
?>

var audioobj;

var playlist = [];
var playlistSrc = []
var orderedPlaylist = [];
var orderedPlaylistSrc = [];
var playlistCurrent = 0;
var playlistRandom;
var alreadyAdded = [];

function drawPlaylist() {
	var playlistHTML = "";

	for(var i=0; i<playlist.length; i++) {
		if(i==playlistCurrent) {
			playlistHTML += "<li id=\""+i+"\"><b>" + playlist[i].substr(0,playlist[i].length-4) + "</b></li>";
		} else {
			playlistHTML += "<li id=\""+i+"\">" + playlist[i].substr(0,playlist[i].length-4) + "</li>";
		}
	}

	$("#music-list").html(playlistHTML);

	$('#music-list li').click(function() {
		playlistCurrent = parseInt($(this).attr('id'));
		ChangeMusic();
		audioobj.play();
	});
}
function scramblePlaylist() {
	var j, x;
    for (var i = playlist.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));

        // Swap titles
        x = playlist[i];
        playlist[i] = playlist[j];
        playlist[j] = x;

        // Swap sources
        x = playlistSrc[i];
        playlistSrc[i] = playlistSrc[j];
        playlistSrc[j] = x; 
    }
}
function ChangeMusic() {
	audioobj.currentTime = 0;
	audioobj.src = playlistSrc[playlistCurrent];

	drawPlaylist();
}
function NextMusic() {
	playlistCurrent++;

	if(playlist[playlistCurrent]==undefined) { playlistCurrent = 0; }

	ChangeMusic();

	audioobj.play();
}
function PrevMusic() {
	playlistCurrent--;

	if(playlist[playlistCurrent]==undefined) { playlistCurrent = playlist.length-1; }

	ChangeMusic();

	audioobj.play();
}

function DownVolume() {
	var vol = audioobj.volume;
	vol -= 0.05;
	if(vol<0) { vol = 0; }
	audioobj.volume = vol;
}
function UpVolume() {
	var vol = audioobj.volume;
	vol += 0.05;
	if(vol>1) { vol = 1; }
	audioobj.volume = vol;
}

function addAlbum(albumID) {
	if(alreadyAdded[albumID]==undefined) {
		for(var i=0;i<musiclist[albumID].length;i++) {
			addMusic(albumID,i);
		}
	}
}
function addMusic(albumID,musicID) {
	if(alreadyAdded[albumID]==undefined) { alreadyAdded[albumID] = []; }
	if(alreadyAdded[albumID][musicID]==undefined) { 
		alreadyAdded[albumID][musicID] = true;

		orderedPlaylist.push(musiclist[albumID][musicID]);
		orderedPlaylistSrc.push(albumlist[albumID] + "/" + musiclist[albumID][musicID]);	

		playlist = orderedPlaylist;
		playlistSrc = orderedPlaylistSrc;

		if(playlistRandom) {
			scramblePlaylist();
		}

		drawPlaylist();
	}
}
function drawAlbum(albumID) {
	var content = "";

	// Generer texte
	for(var i=0; i<musiclist[albumID].length; i++) {
		content += '<li class="album-details-music" albumid="' + albumID +'" musicid="' + i +'">' + musiclist[albumID][i] + '</li>';
	}

	$('#album-details').html(content);

	$('.album-details-music').click(function() {
		addMusic(parseInt($(this).attr('albumid')) , parseInt($(this).attr('musicid')));
	});

	//Hide & show
	$('#album-details').css('display','block');
	$('#albumlist').css('display','none');
}
function hideAlbum() {
	$('#album-details').css('display','none');
	$('#albumlist').css('display','block');
}
function Load() {
	audioobj = document.getElementById("audio");

	// On music end
	$('#audio').on('ended', function() { NextMusic(); });
	// Add an album
	$('.album-pic').contextmenu(function(e) {
		addAlbum($(this).attr('id'));
		e.preventDefault();
	});
	// Show an album details
	$('.album-pic').click(function() {
		drawAlbum($(this).attr('id'));
	});
	$('#album-details').contextmenu(function(e) {
		hideAlbum();
		e.preventDefault();
	});
	// Keys
	$(window).keydown(function(e) {
		switch(e.which) {
			case 27: // Hide album details
				hideAlbum();
				break;
			case 32: // Play/Pause
			    if(audioobj.paused) {
			    	audioobj.play();
			    } else {
			    	audioobj.pause();
			    }
			    break;
			case 39: // Next music ( Right Arrow )
				NextMusic();
				break;
			case 37: // Prev music ( Left Arrow )
			    PrevMusic();
			    break;
			case 38: // Up volume ( Up Arrow )
			    UpVolume();
			    break;
			case 40: // Down volume ( Down Arrow )
			    DownVolume();
			    break;
			default:
			// Do nothing
		}
	});
	// Toggle random
	$('#playlist-random').click(function() {
		playlistRandom = !playlistRandom;
		if(playlistRandom) {
			scramblePlaylist();
			drawPlaylist();
			$('#playlist-random').css('color','red');
		} else {
			$('#playlist-random').css('color','white');
			playlist = orderedPlaylist;
			playlistSrc = orderedPlaylistSrc;
			drawPlaylist();
		}
	});
	// Clear playlist
	$('#playlist-clear').click(function() {
		playlist = [];
		playlistSrc = [];
		alreadyAdded = [];
		drawPlaylist();
	});
}
window.addEventListener("load",Load);
</script>
	<audio id="audio" src="" controls> 
	   Votre navigateur ne supporte pas cette fonction.
	</audio>
	<div id="albumlist">
		<?php
		for($i=0;$i<count($filesAndFolder['folder']);$i++)
		{
		$array = explode("/",$filesAndFolder['folder'][$i]);

		echo'<div class="album-pic" id="'.$i.'" style="background-image: url(\'files/Musique/_icons/'.$array[count($array)-1].'.jpg\');"><p>'.$array[count($array)-1].'</p></div>
		';
		}
		?>
	</div>
	<ul id="album-details">

	</ul>
	<div id="playlist">
		<p id="playlist-head">Liste de lecture</p>
		<p id="playlist-cmd"><span id="playlist-random">Aléatoire</span> - <span id="playlist-clear">Vider liste</span></p>
		<ul id="music-list">

		</ul>
	</div>
</body>