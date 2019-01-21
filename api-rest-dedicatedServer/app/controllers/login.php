<?php
if(isset($_POST['username']) && isset($_POST['password'])) {
	$username = htmlentities(htmlspecialchars($_POST['username']));
	$password = htmlentities(htmlspecialchars($_POST['password']));

	if(strtolower($username)=="elanis" && Security::hashV1($password) == "b5b2577d5439e32efcbf2ca61fbc5e60de856ebf3b7e2ad61b09a08efff02a86eb465190d06c92a78f4609c17e0d7f53c6019796b5f6030328ab5eead0606b58") {

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