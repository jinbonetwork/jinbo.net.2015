<?php
if(isset($_GET['source'])){
	require_once dirname(__FILE__).'/jframework/contrib/lessphp/0.4.0/lessc.inc.php';
	$source = $_GET['source'];
	$lessc = new lessc;
	header('Content-type:text/css;charset=utf-8');
	echo $lessc->compile(file_get_contents($source));
}
?>
