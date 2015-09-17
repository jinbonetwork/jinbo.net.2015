<?php
require_once('config.php');

$dbLoc = JFEE_DB_LOC;
$dbId = JFEE_DB_ID;
$dbPw = JFEE_DB_PW;
$dbName = JFEE_DB_NAME;
$tableName = JFEE_TABLE_NAME;

$fieldSec = 'sections';
$fieldItem = 'items';

$dbc = @mysqli_connect($dbLoc, $dbId, $dbPw, $dbName) or die(false);

if(@mysqli_num_rows(@mysqli_query($dbc, 'SHOW TABLES LIKE "'.$tableName.'"')) == 0){
	$query = 	'CREATE TABLE IF NOT EXISTS '.$tableName.' ('.
					$fieldSec.' TEXT,'.
					$fieldItem.' TEXT'.
				')';
	mysqli_query($dbc, $query) or die(false);
	mysqli_query($dbc, 'INSERT INTO '.$tableName.' VALUES ("", "")') or die(false);
}

$mode = $_POST['mode'];
$which = $_POST['which'];
$data = $_POST['data'];

$field;
if($which == 'section') $field = $fieldSec;
else if($which == 'item') $field = $fieldItem;
else { echo false; exit; }

if($mode == 'write'){
	$data = @json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
	@mysqli_query($dbc, 'UPDATE '.$tableName.' SET '.$field.'=\''.$data.'\'') or die(false);
	echo true;
}
else if($mode == 'read'){
	$result = @mysqli_query($dbc, 'SELECT '.$field.' FROM '.$tableName);
	$data = @mysqli_fetch_array($result);
	echo $data[$field];
}
else echo false;

mysqli_close($dbc);
?>
