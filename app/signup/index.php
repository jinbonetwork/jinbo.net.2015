<?php
$Acl = "anonymous";
importLibrary('auth');
class signup_index extends Controller {
	public function index() {
		importResource('app-signup');
		$section = Section::instance();
		$this->content = $section->buildPage('signup', 2);

		switch($this->params['todo']){
			/*
			case 'login':
				echo $this->login(trim($this->params['id']), $this->params['pw']);
				exit;
			case 'is-logged-in':
				$result = $this->isLoggedIn();
				if($result) echo json_encode($result);
				exit;
			*/
			case 'submit':
				$result = $this->submit();
				if($result) echo json_encode($result);
				exit;
			default:
		}
	}
	private function checkName($name){
		if(!$name) return '이름을 입력하세요.';
	}
	private function checkEmail($email){
		// 입력값이 있는지 확인
		if(!$email) return '이메일을 입력하세요';
		// 형식이 올바른지 확인
		if(preg_replace("/^[^.][^@]+@[^@]+$/", "", $email) != "") return '형식이 잘못되었습니다';
	}
	private function checkId($id, $option = 'id'){
		// 입력값이 있는지 확인
		if(!$id) return '아이디를 입력하세요.';
		//아이디 길이 확인
		$len = strLen($id);
		if($len < 4 || $len > 40) return '글자수를 조정해주세요.';
		//사용 중인 아이디인지 아닌지 확인
		$context = Model_Context::instance();
		$JinboSession = new Model_Session();
		$search_url = $context->getProperty('service.jinbo_api_url').'/search/'.($option == 'id' ? 'user_id/' : 'email_id/');
		$api_key = $context->getProperty('service.jinbo_api_key');
		$params = "s_arg=".rawurlencode($id)."&remote_addr=".$_SERVER['REMOTE_ADDR']."&api_key=".$api_key;
		$result = $JinboSession->request($search_url, $params);
		if($result['user_id']) return '이미 사용중인 아이디입니다.';
	}
	private function checkPw($pw){
		// 입력값이 있는지 확인
		if(!$pw) return '비밀번호를 입력하세요.';
		//아이디 길이 확인
		$len = strLen($pw);
		if($len < 4 || $len > 20) return '글자수를 조정해주세요.';
	}
	private function checkRepw($pw, $repw){
		// 입력값이 있는지 확인
		if(!$repw) return '비밀번호를 입력하세요.';
		// 먼저 입력한 비밀번호와 같은지 확인
		if($pw != $repw) return '다시 입력하세요';
	}
	private function checkQuestion($question){
		if(!$question) return '질문을 입력하세요.';
	}
	private function checkAnswer($answer){
		if(!$answer) return '답변을 입력하세요.';
	}
	private function checkAgreePrivate($agreePrivate){
		if(!$agreePrivate) return '개인정보 보호정책 및 이용 동의에 동의해주세요.';
	}
	private function checkAgreeService($agreeService){
		if(!$agreeService) return '웹서비스 이용약관에 동의해주세요.';
	}
	private function checkAll(){
		$result = $this->checkId(trim($this->params['id'])); if($result) return array('id', $result);
		$result = $this->checkName(trim($this->params['name'])); if($result) return array('name', $result);
		$result = $this->checkEmail(trim($this->params['email']).'@jinbo.net'); if($result) return array('email', $result);
		$result = $this->checkId(trim($this->params['email']), 'email'); if($result) return array('email', $result);
		$result = $this->checkPw($this->params['pw']); if($result) return array('pw', $result);
		$result = $this->checkRepw($this->params['pw'], $this->params['repw']); if($result) return array('repw', $result);
		$result = $this->checkQuestion($this->params['question']); if($result) return array('question', $result);
		$result = $this->checkAnswer($this->params['answer']); if($result) return array('answer', $result);
		if($this->params['extraEmail']){
			$result = $this->checkEmail(trim($this->params['extraEmail'])); if($result) return array('extraEmail', $result);
		}
		$result = $this->checkAgreePrivate($this->params['agreePrivate']); if($result) return array('agreePrivate', $result);
		$result = $this->checkAgreeService($this->params['agreeService']); if($result) return array('agreeService', $result);
	}
	private function login($id, $pw){
		if(!$id) return '아이디를 입력하세요';
		if(!$pw) return '비밀번호를 입력하세요';
		$result = Login($id, $pw);
		if($result == 0) return;
		else if($result == '-1') return '존재하지 않는 아이디입니다.';
		else if($result == '-2') return '올바르지 않는 비밀번호입니다.';
	}
	private function isLoggedIn(){
		if($_SESSION['user']['uid'] > 0){
			if($_SESSION['user']['jinbonet_member']) $isMember = true; //후원회원
			else $isMember = false; //이용자
			return array('isMember'=>$isMember, 'id'=>$_SESSION['user']['user_id']);
		}
		else return false; //로그인 되지 않았음.
	}
	private function adaptArgs(){
		$args = [
			'user_id' => addslashes(trim($this->params['id'])),
			'email_id' => trim($this->params['email']),
			'password' => $this->params['pw'],
			'question' => addslashes($this->params['question']),
			'answer' => addslashes($this->params['answer']),
			'name' => addslashes(trim($this->params['name'])),
			'email' => trim($this->params['extraEmail']),
			'level' => 5,
			'reg_date' => time(0)
		];
		foreach($args as $key => $value){
			$args[$key] = mb_convert_encoding($value,'euckr', 'utf-8');
		}
		return $args;
	}
	private function saveToDB($args){
		extract($args);

		$context = Model_Context::instance();
		$user_db_name = $context->getProperty('service.user_db_name');
		$user_db_user = $context->getProperty('service.user_db_user');
		$user_db_passwd = $context->getProperty('service.user_db_passwd');
		$user_db = $context->getProperty('service.user_db');
		$user_table = $context->getProperty('service.user_db_table');
		$user_db_port = $context->getProperty('service.user_db_port');

		$conn = @mysqli_connect($user_db_name, $user_db_user, $user_db_passwd, $user_db, $user_db_port);
		@mysqli_query($conn, 'set names euckr');
		$que = "INSERT INTO $user_table (user_id,password,is_new_passwd,name,email_id,domain,level,email,job,zip,address,phone,birth,birth_type,reg_date,question,answer,last_login) ".
			"VALUES ('$user_id',password('$password'),'1','$name','$email_id','jinbo.net','$level','$email','','','','','','',$reg_date,'$question','$answer',$reg_date)";
		if(!@mysqli_query($conn, $que)){
			@mysqli_close($conn);
			return '데이터베이스에 작성중 장애가 발생했습니다.';
		} else {
			@mysqli_close($conn);
		}
	}
	private function submit(){
		//데이터 유효성 확인
		$result = $this->checkAll();
		if($result) return $result;

		//데이터를 DB에 저장
		$args = $this->adaptArgs();
		$result = $this->saveToDB($args);
		if($result) return array('etc_error', $result);

		//로그인
		$this->login(trim($this->params['id']), $this->params['pw']);
		
		return;
	}//end of submit()

}
?>
