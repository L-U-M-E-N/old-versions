<?php
if(!isset($_SESSION['connected']) || $_SESSION['connected'] != true) {
	header('Location: login');
	die();
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="initial-scale=1,  width=device-width">
        <link rel="stylesheet" type="text/css" href="css/style.css">
        <title>Elanis WebOS</title>
    </head>
    <body>
        <img id="hamburger" src="https://03.cdn.elanis.eu/website/img/hamburger.png" alt="menu">
        
    	<section id="menu">
    		<h1>Menu</h1>
    		<ul>
    			<li id="menu-music">
                    <img src="img/menu-icons/music.png">
                    <span id="menu-desc">Musique</span>
                </li>
    			<li id="menu-pictures">
                    <img src="img/menu-icons/pictures.png">
                    <span id="menu-desc">Images</span>
                </li>
    			<li id="menu-videos">
                    <img src="img/menu-icons/videos.png">
                    <span id="menu-desc">Videos</span>
                </li>
    			<li id="menu-monitoring">
                    <img src="img/menu-icons/monitoring.png">
                    <span id="menu-desc">Monitoring</span>
                </li>
    			<li id="menu-analytics">
                    <img src="img/menu-icons/analytics.png">
                    <span id="menu-desc">Analytics</span>
                </li>
    			<li id="menu-sql">
                    <img src="img/menu-icons/sql.png">
                    <span id="menu-desc">SQL WebUI</span>
                </li>
    			<li id="menu-galactaeConsole">
                    <img src="img/menu-icons/galactaeConsole.png">
                    <span id="menu-desc">Console Admin Galactae</span>
                </li>
                <li id="menu-mongo">
                    <img src="img/menu-icons/mongo.png">
                    <span id="menu-desc">Mongo WebUI</span>
                </li>
                <li id="menu-search">
                    <img src="img/menu-icons/search.png">
                    <span id="menu-desc">Search Engine</span>
                </li>
                <li id="menu-notepad">
                    <img src="img/menu-icons/notepad.png">
                    <span id="menu-desc">Bloc note</span>
                </li>
            </ul>
    	</section>

    	<section id="windows">
            <div id="windows-home" class=".windows-show"></div>
            <div id="windows-music"></div>
            <div id="windows-pictures"></div>
            <div id="windows-videos"></div>
            <div id="windows-monitoring"></div>
            <div id="windows-analytics"></div>
            <div id="windows-sql"></div>
            <div id="windows-galactaeConsole"></div>
            <div id="windows-mongo"></div>
            <div id="windows-notepad"></div>
            <div id="windows-search"></div>
    	</section>

        <script type="text/javascript" src="js/jquery.min.js"></script>
        <script type="text/javascript" src="js/load.js"></script>
    </body>
</html>
