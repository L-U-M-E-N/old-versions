<?php
if(!isset($_SESSION['connected']) || $_SESSION['connected'] != true) {
	header('Location: login');
	die();
}

// Verif du client sur mongo
$manager = new MongoDB\Driver\Manager("mongodb://mongo-server:27017");

$filter = array();
$options = [
    'limit' => 35000,
    'sort' => ['_id' => -1],
];

$query = new MongoDB\Driver\Query($filter, $options);
$cursor = $manager->executeQuery('stats.visits', $query);

$results = $cursor->toArray();
?>
<head>
	<title>Elanis' Analytics</title>

	<style>
	body {
		text-align: center;
		background-color: #ffffff;
	}
	.graphs {
		width: calc(100% - 200px);
	}
	.graphs .camembert {
		width: 33%;
		display: inline-block;
		height: calc(100vh - 5vh - 300px);
	}
	#visits {
		width: 100%;
		margin-top: 5vh;
		height: 250px;
	}
	.settings {
		position: fixed;
		top: 0;
		right: 0;
		width: 200px;
		height: 100%;
		overflow-y: auto;
		margin: 0;
		padding: 0;
		background-color: #eeeeee;
	}
	.settings a {
		display: block;
		margin: 0px 15px;
		text-decoration: none;
		color: #333333;
	}
	.settings a:hover {
		text-decoration: underline;
		color: black;
	}
	</style>

	<link rel="shortcut icon" type="image/png" href="./img/webstats-favicon.png"/>

	<meta name="viewport" content="width=device-width, initial-scale=1">

	<script src="js/chartkick.js"></script>
	<script src="js/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.6.0/Chart.bundle.js"></script>
</head>
<body>
	<div class="graphs">
		<div id="ips" class="camembert"></div>
		<div id="pages" class="camembert"></div>
		<div id="origins" class="camembert"></div>
		<br/>
		<br/>
		<div id="visits" class="graphs"></div>
	</div>

	<div class="settings">
		<?php 
		$content = [
			["Tout",""],
			["Assistant personnel","https://webos.elanis.eu"],
			["Dehash","https://dehash.me"],
			["Galactae (Site)","https://galactae.eu"],
			["Galactae (Client de jeu)","Galactae (Client)"],
			["Gaspar","https://gaspar.ovh"],
			["Getiny Link","https://getiny.link"],
			["Portfolio","https://elanis.eu"],
			["Randomeme","https://randomeme.xyz"],
			["Scifi","https://scifi.elanis.eu"],
		];

		for($i=0; $i<count($content); $i++) {
			echo '<a href="#" url="'.$content[$i][1].'">'.$content[$i][0].'</a>';
		}
		?>
		<br/>
		<p>Periode :</p>
		<select id="days-range">
			<option value="7">7 derniers jours</option>
			<option value="30" selected>30 derniers jours</option>
			<option value="90">3 derniers mois</option>
			<option value="183">6 derniers mois</option>
			<option value="365">12 derniers mois</option>
			<option value="100000">Toute la periode</option>
		</select>
	</div>

	<script type="text/javascript">
		var visits = <?php echo json_encode($results); ?>

		/* Listes pour chaque categories */
		var ipsGraph = new Array();
		var pagesGraph = new Array();
		var originsGraph = new Array();

		var ips;
		var pages;
		var origins;
		var visitsPerDay;

		var domain="";

		function tri() {
			ips = new Array();
			pages = new Array();
			origins = new Array();
			visitsPerDay = new Array();

			var days = parseInt($('#days-range').val());

			for(var i=0; i<visits.length; i++) {
				/* Fix some bugs */
				if(visits[i]["url"]==null || visits[i]["url"]==undefined || visits[i]["url"]=="") {
					visits[i]["url"] = "Inconnu";
				}
				if(visits[i]["origin"]==null || visits[i]["origin"]==undefined || visits[i]["origin"]=="") {
					visits[i]["origin"] = "Inconnu";
				}
				if(visits[i]["ip"]==null || visits[i]["ip"]==undefined || visits[i]["ip"]=="") {
					visits[i]["ip"] = "Inconnu";
				}

				/* Local NDD vers Web NDD */
				if(visits[i]["url"]!=undefined) {
					visits[i]["url"] = visits[i]["url"].replace("http://elanis","https://elanis.eu");
					visits[i]["url"] = visits[i]["url"].replace("http://galactaewebsite","https://galactae.eu");
					visits[i]["url"] = visits[i]["url"].replace("http://randomeme","https://randomeme.xyz");
					visits[i]["url"] = visits[i]["url"].replace("http://gaspar","https://gaspar.ovh");
					visits[i]["url"] = visits[i]["url"].replace("http://liink","https://getiny.link");
					visits[i]["url"] = visits[i]["url"].replace("http://scifi","https://scifi.elanis.eu");
					visits[i]["url"] = visits[i]["url"].replace("http://assistant_personnel","https://webos.elanis.eu");
					visits[i]["url"] = visits[i]["url"].replace("http://dehash-me","https://dehash.me");

					if(visits[i]["url"].substr(0,16)=="http://galactae-") {
						visits[i]["url"] = "Galactae (Client)";
					}
				}

				if(visits[i]["origin"]!=undefined) {
					visits[i]["origin"] = visits[i]["origin"].replace("http://elanis","https://elanis.eu");
					visits[i]["origin"] = visits[i]["origin"].replace("http://galactaewebsite","https://galactae.eu");
					visits[i]["origin"] = visits[i]["origin"].replace(".spacegame.elanistudio.eu","Galactae (Client)");
					visits[i]["origin"] = visits[i]["origin"].replace(".galactae.elanis.eu","Galactae (Client)");
					visits[i]["origin"] = visits[i]["origin"].replace(".galactae.eu","Galactae (Client)");
					visits[i]["origin"] = visits[i]["origin"].replace("http://randomeme","https://randomeme.xyz");
					visits[i]["origin"] = visits[i]["origin"].replace("http://gaspar","https://gaspar.ovh");
					visits[i]["origin"] = visits[i]["origin"].replace("http://liink","https://getiny.link");
					visits[i]["origin"] = visits[i]["origin"].replace("http://scifi","https://scifi.elanistudio.eu");
					visits[i]["origin"] = visits[i]["origin"].replace("http://assistant_personnel","https://webos.elanis.eu");
					visits[i]["origin"] = visits[i]["origin"].replace("http://dehash-me","https://dehash.me");

					visits[i]["origin"] = visits[i]["origin"].replace("assistant.elanistudio.eu","webos.elanis.eu");
					visits[i]["origin"] = visits[i]["origin"].replace("spacegame.elanistudio.eu","galactae.eu");
					visits[i]["origin"] = visits[i]["origin"].replace("galactae.elanis.eu","galactae.eu");

					//if(visits[i]["origin"].substr(0,17)=="Galactae (Client)") {
					if(visits[i]["origin"].split("Galactae (Client)").join("")!=visits[i]["origin"]) {
						visits[i]["origin"] = "Galactae (Client)";
					}
				}

				var time = Date.now()/1000;
				if(visits[i]["url"].substr(0,domain.length)==domain && visits[i]["time"] > (time - time%(24 * 60 * 60) - (days * 24 * 60 * 60))) {
					/* Search Engine detection */
					if(visits[i]["url"].substr(0,30)=="http://yandex.ru/clck/jsredir?") { visits[i]["url"] = "Yandex.ru Search Engine"; }
					if(visits[i]["origin"].substr(0,30)=="http://yandex.ru/clck/jsredir?") { visits[i]["origin"] = "Yandex.ru Search Engine"; }

					if(visits[i]["url"].substr(0,39)=="https://webcache.googleusercontent.com/") { visits[i]["url"] = "Google Web Cache"; }
					if(visits[i]["origin"].substr(0,39)=="https://webcache.googleusercontent.com/") { visits[i]["origin"] = "Google Web Cache"; }

					/* Ip detection */
					if(visits[i]["ip"]=="88.181.214.139" || visits[i]["ip"]=="163.172.87.69" || visits[i]["ip"]=="163.172.46.202" || visits[i]["ip"]=="172.17.0.1" || visits[i]["ip"]=="127.0.0.1") { 
						visits[i]["ip"]="Elanis"; 
					}

					/* Ajout aux tableaux */
					ips[visits[i]["ip"]] = (ips[visits[i]["ip"]]!=undefined)?ips[visits[i]["ip"]]+1:1;
					pages[visits[i]["url"]] = (pages[visits[i]["url"]]!=undefined)?pages[visits[i]["url"]]+1:1;
					origins[visits[i]["origin"]] = (origins[visits[i]["origin"]]!=undefined)?origins[visits[i]["origin"]]+1:1;

					visitsPerDay[convertDate(visits[i]["time"])] = (visitsPerDay[convertDate(visits[i]["time"])]!=undefined)?visitsPerDay[convertDate(visits[i]["time"])]+1:1;
				}
			}

			ips = decroissant(ips);
			pages = decroissant(pages);
			origins = decroissant(origins);
		}

		function decroissant(temp) {
			//Tri du tableau page
			var output = new Array();
			var taille = 0;
			for (o in temp) ++taille;

			var maxCurrValue;
			var maxCurrIndex;
			var already = new Array();

			for(var i=0; i<taille; i++) {
				maxCurrValue = 0;
				maxCurrIndex = "";


				for(var index in temp) {
					var value = temp[index];

					if((value>maxCurrValue) && (already.indexOf(value) === -1)) {
						maxCurrValue = value;
						maxCurrIndex = index;
					}
				}

				already.push(maxCurrValue);
				output[i] = [maxCurrIndex,maxCurrValue];

			}

			return output;
		}

		

		function drawCharts() {
			tri();

			ipsGraph[10] = ["Autre",0]
			for(var i=0; i<ips.length; i++) {
				if(i<10) {
					ipsGraph[i] = ips[i];
				} else {
					ipsGraph[10][1] += ips[i][1];
				}
			}

			pagesGraph[10] = ["Autre",0]
			for(var i=0; i<pages.length; i++) {
				if(i<10) {
					pagesGraph[i] = pages[i];
				} else {
					pagesGraph[10][1] += pages[i][1];
				}
			}

			originsGraph[10] = ["Autre",0]
			for(var i=0; i<origins.length; i++) {
				if(i<10) {
					originsGraph[i] = origins[i];
				} else {
					originsGraph[10][1] += origins[i][1];
				}
			}

			var temp = visitsPerDay;
			var i = 0;
			visitsPerDay = new Array();
			for(var key in temp) {
				visitsPerDay[i] = [key,temp[key]];
				i++;
			}

			var visitsChart = new Chartkick.AreaChart("visits", [ { name: "Visites", data: visitsPerDay } ]);
			var ipChart = new Chartkick.PieChart("ips", ipsGraph, { legend: 'bottom' });
			var pageChart = new Chartkick.PieChart("pages", pagesGraph, { legend: 'bottom' });
			var originChart = new Chartkick.PieChart("origins", originsGraph,{ legend: 'bottom' });
		}

		function convertDate(inputFormat) {
			function pad(s) { return (s < 10) ? '0' + s : s; }
			var d = new Date(inputFormat*1000);
			return [pad(d.getFullYear()), pad(d.getMonth()+1), d.getDate()].join('-');
		}

		window.addEventListener('load', function() {
			drawCharts();
		});

		$('.settings a').click(function() {
			domain = $(this).attr('url');
			drawCharts();
		});
		$('#days-range').change(function() {
			drawCharts();
		});
	</script>