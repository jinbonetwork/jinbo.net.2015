<?
Class Auth extends Objects {

	public static $error;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	protected function __construct() {
	}

	public static function authenticate($user_id,$passwd) {
		$context = Model_Context::instance();
		$JinboSession = new Model_Session();
		$login_url = $context->getProperty('service.jinbo_api_url')."/login/";
		$api_key = $context->getProperty('service.jinbo_api_key');
		$params = "user_id=".rawurlencode($user_id)."&passwd=".base64_encode($passwd)."&method=post&remote_addr=".$_SERVER['REMOTE_ADDR']."&api_key=".$api_key;
		$_j_sess_id = $_COOKIE[$context->getProperty('service.jinbonet_session_name')];
		list($jinbo_sess_id,$jinbo_domain) = explode("/",$_j_sess_id);
		if($jinbo_sess_id) $params .= "&sessionid=".$jinbo_sess_id;
		$jinbo_session = $JinboSession->request($login_url,$params);
		if($jinbo_session) {
			$uid = $jinbo_session[uid];
			if($uid) $_SESSION['identity']['jinbo'] = $row['uid'];
			$user_id = $jinbo_session['user_id'];
			$blogid = $jinbo_session['blogid'];
			$jinbo_sessionid = $jinbo_session['sessionid'];
			$JinboSession->refreshSess("user",$jinbo_session);
			$JinboSession->refreshGroup($jinbo_session['uid'],"","session");
			$JinboSession->refreshCookie($jinbo_session['sessionid']);
			setcookie($context->getProperty('service.jinbonet_session_name'),$jinbo_sessionid."/".$_SERVER[SERVER_NAME], 0, '/', 'jinbo.net');
			return $jinbo_session;
		} else {
			self::$error = $JinboSession->error();
			return NULL;
		}
	}

	public static function logout() {
		$context = Model_Context::instance();
		$JinboSession = new Model_Session();
		$logout_url = $context->getProperty('service.jinbo_api_url')."/logout/";
		$api_key = $context->getProperty('service.jinbo_api_key');
		$_j_sess_id = $_COOKIE[$context->getProperty('service.jinbonet_session_name')];
		list($jinbo_sess_id,$jinbo_domain) = explode("/",$_j_sess_id);
		if(!$_SESSION['user'][uid] && !$jinbo_sess_id) return false;
		$params = "remote_addr=".$_SERVER['REMOTE_ADDR']."&api_key=".$api_key;
		if($_SESSION['user'][uid]) $params .= "&uid=".$_SESSION['user'][uid];
		if($jinbo_sess_id) $params .= "&sessionid=".$jinbo_sess_id;
		$jinbo_session = $JinboSession->request($logout_url,$params);
		unset($_SESSION);
		session_destroy();
		return true;
	}

	public static function error() {
		return self::$error;
	}
}
