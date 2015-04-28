<?php
if(!defined('ROOT')) {
	define('ROOT',dirname(rtrim(dirname(__FILE__),"/")));
	$_tmp_base = strtok(ltrim(substr($_SERVER['SCRIPT_FILENAME'],strlen(ROOT)),"/"),"/");
	$_tmp_path = explode("/",ltrim($_SERVER['SCRIPT_NAME'],"/"));
	$_tmp_uri = "/";
	for($i=0; $i<count($_tmp_path); $i++) {
		if($_tmp_path[$i] == $_tmp_base) break;
		else $_tmp_uri .= $_tmp_path[$i]."/";
	}
	define('JFE_URI',$_tmp_uri);
}
if(!defined('__JFE__') && defined('ROOT')) {
	define('__JFE__',true);
	require_once ROOT."/config/config.php";

	global $context, $config;
	$context = Model_Context::instance();
	$context->setProperty('service.base_uri',$uri->uri['root']);
	$config = Model_Config::instance();
}
if($context->getProperty('session.memcached') == true) {
	global $memcache;
	$memcache = new Memcache();
	$memcache->connect((!is_null($context->getProperty('session.server')) ? $context->getProperty('session.server') : 'localhost'));
}
session_name(Session::getName());
Session::set();
session_set_save_handler( array('Session','open'), array('Session','close'), array('Session','read'), array('Session','write'), array('Session','destroy'), array('Session','gc') );
session_cache_expire(1);
session_set_cookie_params($context->getProperty('session.timeout'), '/', $context->getProperty('session.cookie_domain'));

$sess_cookie_params = session_get_cookie_params();
$context->setProperty('session.cookie_domain',$sess_cookie_params['domain']);
if (session_start() !== true) {
	header('HTTP/1.1 503 Service Unavailable');
	exit;
}

$_j_sess_id = $_COOKIE[$_jinbonet_session_name];
if($_j_sess_id) list($_jinbo_sess_id,$_jinbo_domain) = explode("/",$_j_sess_id);
if($_jinbo_sess_id && $_jinbo_domain) {
	if($_jinbo_domain != $_SERVER['SERVER_NAME']) {
		$JinboSession = new Model_Session();
		$JinboSession->refreshUser();
		if($_SESSION['user']['uid']) {
			$JinboSession->refreshGroup($_SESSION['user']['uid'],$_session_menu_server_array[0]);
		}
		$JinboSession->refreshCookie();
	}
}
?>
