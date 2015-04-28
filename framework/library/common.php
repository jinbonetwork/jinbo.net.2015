<?php
function Error($msg,$errorcode=505) {
	if($_GET['output'] == "xml" || $_POST['output'] == "xml") {
		Respond::ResultPage(array(1,$msg));
	} else {
		Respond::MessagePage($errcode,$msg);
	}
}

function base_uri() {
	$context = Model_Context::instance();
	return $context->getProperty('service.base_uri');
}

function url($path,$opt=null) {
	$url="";
	if($opt['ssl'] && $_SERVER['HTTPS'] != 'on') {
		$context = Model_Context::instance();
		$service = $context->getProperty('service.*');
		if($service['ssl']) $url = "https://".(!preg_match("/:\/\//i",$path) ? $_SERVER['HTTP_HOST'] : "");
	} else if($opt['ssl'] == false && $_SERVER['HTTPS'] == 'on') {
		$url = (!preg_match("/:\/\//i",$path) ? "http://".$_SERVER['HTTP_HOST'] : "");
	}
	$url .= (!preg_match("/:\/\//i",$path) ? base_uri() : "").($path == base_uri() ? "" : $path);
	if($opt['query'])
		$url .= "?".(is_array($opt['query']) ? http_build_query($opt['query']) : $opt['query']);
	if(substr($url,0,2) == "//") $url = substr($url,1);
	return $url;
}

function RedirectURL($path,$opt=null) {
	header("Location: ".url($path,$opt));
	exit;
}

function login_url() {
	if($_GET['requestURI'])
		$requestURI = $_GET['requestURI'];
	else
		$requestURI = ($_SERVER['HTTPS'] == 'on' ? "https://" : "http://").$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
	return url('login',array('ssl'=>true,'query'=>array('requestURI'=>$requestURI)));
}

function logout_url() {
	return url('login/logout',array('query'=>array('requestURI'=>($_GET['requestURI'] ? $_GET['requestURI'] : $_SERVER['REQUEST_URI']))));
}

function load_view() {
	return JFE_APP_CALL_PATH;
}

function user_logged_in() {
	global $user;
	return $user['uid'];
}

function isMaster() {
	global $user;
	if($user['degree'] == BITWISE_ADMINISTRATOR) return 1;
	else return 0;
}

function isOwner() {
	global $user, $entry;
	if($user['uid'] && $entry['owner'] && $user['uid'] == $entry['owner']) return 1;
	else return 0;
}

function dateDiff($sStartTime, $sEndTime)
{

	if($sStartTime > $sEndTime)
		return false;

	$sDiffTime = $sEndTime - $sStartTime;

	$aReturnValue = floor($sDiffTime/60/60/24);
	return $aReturnValue;
}
//단어 단위로 문자열 짜르기
function cut_str($str, $n, $endChar = '..') 
{
	if (strlen($str) <= $n ) 
		return $str;

	while($str[$n] != " " && strlen($str) != $n ) 
		$n++;

	if ( strlen( $str) <= $n ) 
		return $str ;

	if( $str[$n-1] == ".")
		$endChar = "";
 
	return substr($str, 0, $n) . $endChar;
}
?>
