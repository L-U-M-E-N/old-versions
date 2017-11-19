<?php
if(isset($_SESSION['connected']) && $_SESSION['connected'] == true) {
	header('Location: home');
	die();
}

if(isset($_POST['username']) && isset($_POST['password'])) {
	$username = htmlentities(htmlspecialchars($_POST['username']));
	$password = htmlentities(htmlspecialchars($_POST['password']));

	if(strtolower($username)=="elanis" && encrypt($password) == "***REMOVED***") {

		$_SESSION['connected'] = true;
		header('Location: home');
		die();	
	}
}
?>

<form method="post" action="login">
	<input type="text" name="username" id="username" placeholder="Username">
	<input type="password" name="password" id="password" placeholder="Password">

	<input type="submit" value="Connect">
</form>