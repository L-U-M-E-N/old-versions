<?php
if(!isset($_SESSION['connected']) || $_SESSION['connected'] != true) {
	header('Location: login');
	die();
}

$services = [
	["Apache","Proxy reverse","***REMOVED***",80],
	["Apache","Portfolio","127.0.0.1",401],
	["Apache","Gaspar","***REMOVED***",402],
	["Apache","Getiny.link","***REMOVED***",403],
	["Apache","Dev42","***REMOVED***",404],
	["Apache","Randomeme","***REMOVED***",405],
	["Apache","Space-scifi","***REMOVED***",406],
	["Apache","Assistant Personnel","***REMOVED***",408],
	["Apache","phpmyadmin","***REMOVED***",409],
	["Apache","Galactae - Website","***REMOVED***",407],
	["Apache","Galactae - Milkyway Client","***REMOVED***",410],
	["Node","Galactae - Milkyway Server","***REMOVED***",42690],
	["Node","Galactae - Andromeda Server","***REMOVED***",42691],
	["Node","Galactae - Magellan Server","***REMOVED***",42692],
	["Node","Galactae - Pegasus Server","***REMOVED***",42693],
	["Nginx","CDN01 - Misc resources","***REMOVED***",412],
	["Nginx","CDN02 - Randomeme","***REMOVED***",413],
	["Nginx","CDN03 - Galactae resources","***REMOVED***",414],
	["Database","SQL01","mysql",3306],
	["Database","NOSQL01","mongo-server",27017],
	["Backup","Git","***REMOVED***",3042],
	["Backup","Cloud","***REMOVED***",8000],
];
?>
<style>
	body {
		background-color: rgba(220,220,220,0.5);
	}
	#stats, #services {
		width: 49%;
		vertical-align: top;
	}
	#services {
		position: absolute;
	    top: 0;
	    right: 0;
	}
	#services td:first-child, #services td:last-child {
		text-align: center;
	}
	#stats td:first-child {
		text-align: center;
	}
</style>
<script type="text/javascript" src="lib/graph/main.js"></script>
<link rel="stylesheet" type="text/css" href="lib/graph/style.css">
<?php
	//Variables
	$cpu = CpuStats();
	$ping = averagePing();
	$ip = ipConfig();
	$system = SystemStats();
	$memory = Memorystats();
	$swap = SwapStats();
	$disk = DiskUsage();
?>
<table id="stats">
	<tr><td></td><td><h1>Stats systeme</h1></td></tr>
	<tr>
		<td width="100px">
			<img height="70px" src="img/network-server.png" alt="systeme">
		</td>
		<td>
			<b>OS:</b> <?php echo $system['os']; ?><br/>
			<b>Dernier demarrage:</b> <?php echo $system['last_boot']; ?><br/>
		</td>
	</tr>
	<tr>
		<td width="100px">
			<img height="70px" src="img/internet.png" alt="systeme">
		</td>
		<td>
			<b>Ping:</b> <?php echo $ping; ?><br/>
			<b>IP Locale:</b> <?php echo $ip['lan']; ?><br/>
			<b>IP Web:</b> <?php echo $ip['wan']; ?><br/>
		</td>
	</tr>
	<tr>
		<td width="100px">
			<img height="70px" src="img/thermometre_schema.png" alt="temp">
		</td>
		<td>
			<b><?php echo $cpu['temp']; ?></b>
		</td>
	</tr>
	<tr>
		<td width="100px">Systeme</td>
		<td>
			<b>CPU:</b> <?php echo $cpu['model']." - ".$cpu['count']." cores"; ?><br/>
			<b>Utilisation CPU:</b> <?php echo ($cpu['util'][0]*100/4).'%'; ?><br/>
			<b>RAM:</b> <?php echo (round($memory['used']/1024,1)).'Mo/'.(round($memory['total']/1024,1)).'Mo ('.$memory['percent_used'].'%)'; ?><br/>
			<b>SWAP:</b> <?php echo (round($swap['used']/1024,1)).'Mo/'.(round($swap['total']/1024,1)).'Mo ('.$swap['percent_used'].'%)'; ?><br/>
			<b>Disque dur:</b> <?php echo (round($disk['used']/1024/1024/1024,2)).'Go/'.(round($disk['total']/1024/1024/1024,2)).'Go ('.$disk['percent_used'].'%)'; ?><br/>
		</td>
	</tr>
</table>
<table id="services">
	<tr><td></td><td><h1>Stats services</h1></td><td></td></tr>
	<tr><th>Type</th><th>Nom</th><th>Statut</th></tr>
	<?php
	for($i=0; $i<count($services); $i++) {
		echo "<tr>
		<td>".$services[$i][0]."</td>
		<td>".$services[$i][1]."</td>";
		if(serverStatus($services[$i][2],$services[$i][3])) {
			echo '<td style="color: green;">En Ligne</td>';
		} else {
			echo '<td style="color: red;">Hors Ligne</td>';
		}
		echo"</tr>";
	}
	?>
</table>