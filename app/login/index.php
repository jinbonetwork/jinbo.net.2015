<?php
importLibrary('auth');

$IV = array(
	'GET' => array(
		'user_id' => array('string', 'mandatory' => false ),
		'passwd' => array('string', 'default' => null),
		'requestURI' => array('string', 'default' => null ),
	),
	'POST' => array(
		'user_id' => array('string', 'default' => null),
		'passwd' => array('string', 'default' => null),
		'requestURI' => array('string', 'default' => null ),
	)
);

class login_index extends Controller {
	public function index() {

		$context = Model_Context::instance();
		$redirect_uri = "https://".$context->getProperty('service.domain').base_uri().'login/fb';
		if($this->params['request_URI'])
			$redirect_uri .= "?requestURI=".$this->params['request_URI'];

		if($this->params['output'] != "json") {
			importResource("app-login");
		}
		if(doesHaveMembership()) {
			if($this->params['output'] == "json") {
				RespondJson::ResultPage(array(2,"이미 로그인하셨습니다"));
			} else {
				Error("이미 로그인하셨습니다.");
			}
		}
		if( !empty($this->params['user_id']) && !empty($this->params['passwd']) ) {
			$isLogin = Login($this->params['user_id'],$this->params['passwd']);
			switch($isLogin) {
				case 0:
					if($this->params['requestURI']) {
						$message = rawurldecode($this->params['requestURI']);
					} else {
						$message = base_uri();
					}
					break;
				case -1:
					$message = "존재하지 않는 아이디입니다.";
					break;
				case -2:
					$message = "비밀번호가 일치하지 않습니다.";
					break;
				case -2:
					$message = "로그인 서비스에 장애가 있습니다. 잠시후에 다시 시도해주세요.";
					break;
			}
			RespondJson::ResultPage(array($isLogin,$message));
		}
		$this->title = JFE_NAME." 로그인";
	}
}
