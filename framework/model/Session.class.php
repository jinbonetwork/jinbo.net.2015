<?php
Class Model_Session {
	var $jinbonet_session_name;
	var $jinbonet_session_id;
	var $jinbonet_session_api_url;
	var $jinbonet_session_api_key;
	var $jinbonet_session_api_charset;
	var $jinbosession;
	var $err_msg;

	function Model_Session() {
		$context = Model_Context::instance();
		$this->jinbonet_session_name = $context->getProperty('service.jinbonet_session_name');
		$this->jinbonet_session_api_url = $context->getProperty('service.jinbo_api_url');
		$this->jinbonet_session_api_key = $context->getProperty('service.jinbo_api_key');
		$this->jinbonet_session_api_charset = $context->getProperty('service.jinbo_api_charset');
		$_j_sess_id = $_COOKIE[$this->jinbonet_session_name];
		if($_j_sess_id) list($jinbo_sess_id,$jinbo_domain) = explode("/",$_j_sess_id);
		if($jinbo_sess_id && $jinbo_domain) $this->jinbonet_session_id = $jinbo_sess_id;
	}

	function required() {
		$_j_sess_id = $_COOKIE[$this->jinbonet_session_name];
		if($_j_sess_id) list($jinbo_sess_id,$jinbo_domain) = explode("/",$_j_sess_id);
		if($jinbo_sess_id && $jinbo_domain) {
			if($jinbo_domain != $_SERVER['SERVER_NAME']) {
				return true;
			}
		}
		return false;
	}

	function isJinboAuthorized() {
		if(!$this->jinbonet_session_id) return NULL;
		$session_url = $this->jinbonet_session_api_url."/session/";
		$api_key = $this->jinbonet_session_api_key;
		$params = "sessionid=".$this->jinbonet_session_id."&remote_addr=".$_SERVER['REMOTE_ADDR']."&api_key=".$api_key."&charset=".$this->jinbonet_session_api_charset;

//		$request = new Jinbo_ApiRequest();
//		$result = $request->request($session_url,$params);
		$result = $this->request($session_url,$params);
		return $result;
	}

	/* Session Start 된 상태에서 */
	function refreshUser() {
		$this->jinbosession = $this->isJinboAuthorized();
		if($this->jinbosession == null || !$this->jinbosession['uid']) {
			unset($_SESSION);
		} else {
			$this->refreshSess("user",$this->jinbosession);
		}
	}

	function refreshSess($key,$sess_data) {
		$_key = explode("|",$key);
		while(list($_k,$_v) = each($sess_data)) {
			if($_k == "check_passwd") continue;
			if(is_array($_v)) $this->refreshSess($key."|".$_k,$_v);
			else {
				$eval_str = "\$_SESSION";
				for($i=0; $i<count($_key); $i++) {
					$eval_str .= "['".$_key[$i]."']";
				}
				$eval_str .= "['".$_k."'] = \$_v;";
				eval($eval_str);
			}
		}
	}

	function refreshGroup($uid,$host="",$mode="refresh") {
		if(!$uid) return;
		if(!$_SESSION['user']['uid']) return;
		if(!$this->jinbonet_session_id) $mode = "nosession";
		$group_url = $this->jinbonet_session_api_url."/group/";
		$group_url .= $mode."/";
		$api_key = $this->jinbonet_session_api_key;
		$params = "uid=".$uid."&sessionid=".$this->jinbonet_session_id."&remote_addr=".$_SERVER['REMOTE_ADDR']."&api_key=".$api_key;
		if($host) $params .= "&host=".$host;
		$result = $this->request($group_url,$params);
		if($result['uid']) {
			if($host) $_SESSION['user']['group'][$host] = unserialize($result['group']);
			else $_SESSION['user']['group'] = unserialize($result['group']);
		}
	}

	function refreshCookie($jinbonet_session_id="") {
		if(!$this->jinbonet_session_name) return;
		if($jinbonet_session_id) $this->jinbonet_session_id = $jinbonet_session_id;
		if(!$this->jinbonet_session_id) return;
		setcookie($this->jinbonet_session_name,$this->jinbonet_session_id."/".$_SERVER[SERVER_NAME], 0 ,'/','jinbo.net');
	}

	function request($url,$params,$method='POST') {
		if(!$url) return NULL;
		$request = new HTTPRequest($method,$url);
		$request->contentType = 'application/x-www-form-urlencoded; charset=utf-8';
		$request->content = $params;
		if($request->send()) {
			$xmls = new XMLStruct();
			if ($xmls->open($request->responseText)) {
				if (isset($xmls->struct['methodResponse'][0]['fault'][0]['value'])) {
					$this->err_msg = $xmls->struct['methodResponse'][0]['fault'][0]['value'][0]['struct'][0]['member'][1]['value'][0]['string'][0]['.value'];
					return NULL;
				} else if (isset($xmls->struct['methodResponse'][0]['params'][0]['param'][0]['value'])) {
					$rpc = new XMLRPC();
					$result = $rpc->_decodeValue($xmls->struct['methodResponse'][0]['params'][0]['param'][0]['value'][0]);
					return $result;
				} else
					return NULL;
			} else
				return NULL;
		} else {
			return NULL;
		}
	}

	function error() {
		return ($this->err_msg ? $this->err_msg : "서비스 장애");
	}
}
?>
