<?php
require_once('config.php');

$url = $_POST['url'];
$path = JFEE_APP_PATH.$url;
$dh = opendir($path);
$profiles = array();
if($dh){
	for($i = 0; $compName = readdir($dh);){
		if($compName != '.' && $compName != '..'){
			$file = $path.'/'.$compName.'/profile.json';
			$fp = @fopen($file, 'r');
			if($fp){
				$profiles[$compName] = json_decode(@stream_get_contents($fp));
				if(@fopen($path.'/'.$compName.'/icon.png', 'r'))
					$profiles[$compName]->icon = JFEE_APP_DIR.$url.'/'.$compName.'/icon.png';
				else
					$profiles[$compName]->icon = '';
				fclose($fp);
				$i++;
			}
		}
	}
	closedir($dh);
	echo json_encode($profiles, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
}
?>
