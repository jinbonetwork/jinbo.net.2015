<?php
$fieldSec = 'sections';
$fieldItem = 'items';

function quit($dbc){
	echo 'Failure!!<br>';
	mysqli_close($dbc);
}

function write($dbc, $field, $path){
	$fp = fopen($path, 'r');
	if($fp){
		$data = stream_get_contents($fp);
		$data = preg_replace('/\\\"/', '\\\\\\"', $data);
		$data = preg_replace('/\'/', '\\\'', $data);
		mysqli_query($dbc, 'UPDATE '.JFEE_TABLE_NAME.' SET '.$field.'=\''.$data.'\'') or quit($dbc);
	}
	else quit($dbc);
}

require_once('config.php');
$dbc = mysqli_connect(JFEE_DB_LOC, JFEE_DB_ID, JFEE_DB_PW, JFEE_DB_NAME) or die(false);
write($dbc, $fieldSec, JFEE_CACHE_SECTION);
write($dbc, $fieldItem, JFEE_CACHE_ITEM);
echo 'Success';
?>
