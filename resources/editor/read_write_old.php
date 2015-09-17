<?php
$secPath = '../../files/cache/front_section.json';
$itemPath = '../../files/cache/front_items.json';

$mode = $_POST['mode'];
$which = $_POST['which'];
$data = $_POST['data'];

if(!$mode || !$which){ echo false; exit; }

$path;
if($which == 'section') $path = $secPath;
else if($which == 'item') $path = $itemPath;
else echo false;
if($mode == 'write'){
	$data = json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
	$file = @fopen($path, 'w');
	if($file){
		if(@fwrite($file, $data)) echo true;
		else echo false;
		fclose($file);
	} else echo false;
}
else if($mode == 'read'){
	$file = fopen($path, 'r');
	if($file){
		$data = @fread($file, filesize($path));
		if($data) echo $data;
		else echo false;
		fclose($file);
	} else echo false;
}
else {
	echo false;
}
exit;
?>
