<?php
require_once('config.php');

$mode = $_POST['mode'];
$which = $_POST['which'];
$data = $_POST['data'];
if(!$mode || !$which){ echo false; exit; }

$dbLoc = JFEE_DB_LOC;
$dbId = JFEE_DB_ID;
$dbPw = JFEE_DB_PW;
$dbName = JFEE_DB_NAME;
$tableName = JFEE_TABLE_NAME;
$cacheSection = JFEE_CACHE_SECTION;
$cacheItem = JFEE_CACHE_ITEM;
$fieldSec = 'sections';
$fieldItem = 'items';

$dbc = @mysqli_connect($dbLoc, $dbId, $dbPw, $dbName) or die(false);
if(@mysqli_num_rows(@mysqli_query($dbc, 'SHOW TABLES LIKE "'.$tableName.'"')) == 0){
	$query = 	'CREATE TABLE IF NOT EXISTS '.$tableName.' ('.
					$fieldSec.' TEXT,'.
					$fieldItem.' TEXT'.
				')';
	if(!mysqli_query($dbc, $query)){ echo false; mysqli_close($dbc); }
	if(!mysqli_query($dbc, 'INSERT INTO '.$tableName.' VALUES ("", "")')){ echo false; mysqli_close($dbc); }
}

$field;
$path;
if($which == 'section'){
	$field = $fieldSec;
	$path = $cacheSection;
}
else if($which == 'item'){
	$field = $fieldItem;
	$path = $cacheItem;
}
else { echo false; mysqli_close($dbc); }

if($mode == 'write'){
	$data = @json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
	$file = fopen($path, 'w');
	if($file){
		if(!fwrite($file, $data)){ echo false; mysqli_close($dbc); };
		fclose($file);
	} else { echo false; mysqli_close($dbc); };

	$data = preg_replace('/\\\"/', '\\\\\\"', $data);
	$data = preg_replace('/\'/', '\\\'', $data);
	if(!@mysqli_query($dbc, 'UPDATE '.$tableName.' SET '.$field.'=\''.$data.'\'')){ echo false; mysqli_close($dbc); }

	echo true;
}
else if($mode == 'read'){
	$result = @mysqli_query($dbc, 'SELECT '.$field.' FROM '.$tableName);
	if(!$result){ echo false; mysqli_close($dbc); }
	$data = @mysqli_fetch_array($result);
	if(!$data){ echo false; mysqli_close($dbc); }
	echo $data[$field];
}
else { echo false; mysqli_close($dbc); };
?>
