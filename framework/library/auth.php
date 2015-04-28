<?php
function Login($loginid, $password) {
	$context = Model_Context::instance();
	$result = Auth::authenticate($loginid,$password);
	if(!$result) {
		$err = Auth::error();
		if(preg_match("/비밀번호/i",$err)) {
			$ret = -2;
		} else if(preg_match("/아이디/i",$err)) {
			$ret = -1;
		} else {
			$ret = -3;
		}
	} else {
		$ret = 0;
	}

	return $ret;
}

function Logout() {
	Auth::logout();
}

function requireLogin() {
	$context = Model_Context::instance();
	$service = $context->getProperty('service.*');
	$requestURI = ($_SERVER['HTTPS'] == 'on' ? "https://" : "http://").$service['domain'].$_SERVER['REQUEST_URI'];
	RedirectURL('login',array('ssl'=>true,'query'=>array('requestURI'=>$requestURI)));
}

function doesHaveMembership() {
	return Acl::getIdentity('jinbo') !== null;
}

function requireMembership() {
	if(Acl::getIdentity('jinbo') !== null) {
		return true;
	}
	requireLogin();
}
?>
