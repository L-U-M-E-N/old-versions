<?php
if(isset($_POST['username']) && isset($_POST['password'])) {
	$username = htmlentities(htmlspecialchars($_POST['username']));
	$password = htmlentities(htmlspecialchars($_POST['password']));

	if(strtolower($username)=="elanis" && Security::hashV1($password) == "***REMOVED***") {

		$_SESSION['connected'] = true;
		header('Location: home');
		die();	
	}
} else {
	if(isset($_SESSION['connected'])) {
		//echo '<script>window.location.href = "home";</script>';
		//die();
	}
}