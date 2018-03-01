<?php
if(isset($_SESSION['connected']) && $_SESSION['connected'] == true) {
	header('Location: home');
	die();
}

if(isset($_POST['username']) && isset($_POST['password'])) {
	$username = htmlentities(htmlspecialchars($_POST['username']));
	$password = htmlentities(htmlspecialchars($_POST['password']));

	if(strtolower($username)=="elanis" && encrypt($password) == "b5b2577d5439e32efcbf2ca61fbc5e60de856ebf3b7e2ad61b09a08efff02a86eb465190d06c92a78f4609c17e0d7f53c6019796b5f6030328ab5eead0606b58") {

		$_SESSION['connected'] = true;
		header('Location: home');
		die();	
	}
}
?>

<style>
	/**
	 * Login
	 */
	#login {
		position: fixed;

		top: calc(50% - 75px);
		left: calc(50% - 150px);

		width: 300px;
		height: 150px;
	}
	#login input {
		display: inline-block;

		/*margin: 0.5em calc((300px - 4px - 1em - 225px)/2); /* Total - border - padding */
		margin: 0.5em calc(37.5px - 0.5em);

		padding: 0.5em;
		border: 0;

		background-color: #191919;
		color: #eee;
	}
	#login input[type="password"], #login input[type="text"] {
		width: 225px;
	}
	#login input[type="submit"] {
		width: calc(225px + 1em);
	}
</style>

<section id="login">
	<form method="post" action="login">
		<input type="text" name="username" id="username" placeholder="Username">
		<input type="password" name="password" id="password" placeholder="Password">

		<input type="submit" value="Connect">
	</form>
</section>