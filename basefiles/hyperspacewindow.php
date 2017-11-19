<?php
if(!isset($_SESSION['connected']) || $_SESSION['connected'] != true) {
	header('Location: login');
	die();
}

switch($_GET['t'])
{
	case "ping":
		$answer=averagePing();
	break;
	case "cpu":
		$util = sys_getloadavg();
		$answer = $util[0]*100/4;
	break;
	case "hdd":
		$dd = DiskUsage();
		$answer=$dd['percent_used'];
	break;
	case "ram":
		$memory = Memorystats();
		$answer=$memory['percent_used'].'%';
	default:
		$answer=42;
}


echo $answer;