<?php
define('ROOT',dirname(rtrim(dirname(__FILE__),'/')));
$www_config['root_dir'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', ROOT); 
if(!defined('__JFE__')) {
    define('__JFE__',true);
    require_once ROOT.'/config/config.php';

    $context = Model_Context::instance();
    $config = Model_Config::instance();
}
require_once JFE_SESSION_PATH;
if($_SESSION['current']['mode'] == 'edit-front'){
	$www_config['dir'] = 'front';
}
else {
	echo '페이지가 존재하지 않습니다.';
	exit;
}
if(!file_exists(JFE_DATA_PATH.'/attach/'.$www_config['dir'])){
	mkdir(JFE_DATA_PATH.'/attach/'.$www_config['dir']);
	chmod(JFE_DATA_PATH.'/attach/'.$www_config['dir'], 0707);
	mkdir(JFE_DATA_PATH.'/attach/'.$www_config['dir'].'/source');
	chmod(JFE_DATA_PATH.'/attach/'.$www_config['dir'].'/source', 0707);
	mkdir(JFE_DATA_PATH.'/attach/'.$www_config['dir'].'/thumbs');
	chmod(JFE_DATA_PATH.'/attach/'.$www_config['dir'].'/thumbs', 0707);
}
?>
