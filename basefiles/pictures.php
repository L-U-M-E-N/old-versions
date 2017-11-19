<?php
if(!isset($_SESSION['connected']) || $_SESSION['connected'] != true) {
	header('Location: login');
	die();
}
?>

<style type="text/css">
	#image-full-div {
		position: fixed;
		display: none;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0,0,0,0.6);
		z-index: 1234;
	}
	#image-full {
		display: block;
		max-height: 90%;
		max-width: 90%;
	    width: auto;
	    height: auto;
	    position: absolute;  
	    top: 0;  
	    bottom: 0;  
	    left: 0;  
	    right: 0;  
	    margin: auto;
	}
	/* Safari 4.0 - 8.0 */
	@-webkit-keyframes fadeOut {
		from { opacity: 1; }
		to { opacity: 0; }
	}
	@-webkit-keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	/* Standard syntax */ 
	@keyframes fadeOut {
		from { opacity: 1; }
		to { opacity: 0; }
	}
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	.hidenShow  {
		display: block !important;
		/* Standard syntax */ 
		animation-name: fadeOut;
		animation-duration: .5s;
		/* Safari 4.0 - 8.0 */
		-webkit-animation-name: fadeOut;
		-webkit-animation-duration: .5s;
	}
	.showedShow {
		display: block !important;
		/* Standard syntax */ 
		animation-name: fadeIn;
		animation-duration: .5s;
		/* Safari 4.0 - 8.0 */
		-webkit-animation-name: fadeIn;
		-webkit-animation-duration: .5s;
	}
	#corps {
		width: 100%;
	}
	#corps img {
		width: 32%;
		margin: 0.5%;
		vertical-align: middle;
	}
</style>

<div id="image-full-div">
	<img src="?" id="image-full">
</div>
<section id="corps">
<?php
//Variables PHP
$filesAndFolder = File_Find(["files/Image"], ["png","jpg","jpeg"]);

for($i=0; $i<count($filesAndFolder['files']); $i++) {
	for($j=0; $j<count($filesAndFolder['files'][$i]); $j++) {
		echo '<img onclick="FullPictureShow(this.src)" src="'.$filesAndFolder['folder'][$i].'/'.$filesAndFolder['files'][$i][$j].'"/>';
	}
}
?>
</section>

<script type="text/javascript">
	/* Code d'affichage/masquage de l'apercu d'une image dans la gallerie.
	L'animation est faite en CSS directement */
	function FullPictureHide() {
		document.getElementById("image-full-div").className = "hidenShow";

		/* Remove class just before animation end */
		setTimeout(function() {
			document.getElementById("image-full-div").className = "";
		}, 490);
	}
	function FullPictureShow(newsrc) {
		document.getElementById("image-full").src = newsrc.replace("-min.jpg", ".png");

		document.getElementById("image-full-div").className = "showedShow";
	}

	/* Pour retirer l'image */
	window.addEventListener('load',function() {
		document.getElementById('image-full-div').addEventListener('click',FullPictureHide);
	});
</script>