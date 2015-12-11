<?php
$Acl = "anonymous";
importLibrary('auth');
class support_index extends Controller {
	public function index() {
		importResource('app-support');
		$context = Model_Context::instance();
		$section = Section::instance();
		$this->content = $section->buildPage('support', 2);

		$this->service = $context->getProperty('service.*');
		$this->bankList = $this->bankList();

		switch($this->params['todo']){
			/*
			case 'check-name':
				echo $this->checkName(trim($this->params['name']));
				exit;
			case 'check-phone':
				echo $this->checkPhone(trim($this->params['phone']));
				exit;
			case 'check-email':
				echo $this->checkEmail(trim($this->params['email']));
				exit;
			case 'check-id':
				echo $this->checkId(trim($this->params['id']));
				exit;
			case 'check-pw':
				echo $this->checkPw($this->params['pw']);
				exit;
			case 'check-repw':
				echo $this->checkRepw($this->params['pw'], $this->params['repw']);
				exit;
			case 'check-question':
				echo $this->checkQuestion($this->params['question']);
				exit;
			case 'check-answer':
				echo $this->checkAnswer($this->params['answer']);
				exit;
			case 'check-bank-code':
				echo $this->checkBankCode($this->params['bankCode']);
				exit;
			case 'check-all':
				$result = $this->checkAll();
				if($result) echo json_encode($result);
				exit;
			*/
			case 'zip-search':
				echo $this->zipSearch(trim($this->params['keyword']), $this->params['curPage']);
				exit;
			case 'get-bank-list':
				echo $this->getBankList();
				exit;
			case 'get-bank-digit':
				echo $this->getBankDigit($code);
				exit;
			case 'login':
				echo $this->login(trim($this->params['id']), $this->params['pw']);
				exit;
			case 'is-logged-in':
				$result = $this->isLoggedIn();
				if($result) echo json_encode($result);
				exit;
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
	private function checkPhone($phone){
		//입력값이 있는지 확인
		if(!$phone) return '전화번호를 입력하세요';
		//형식이 올바른지 확인
		$phone = preg_replace('/-/', '', $phone);
		if(preg_match('/[^\d]/', $phone) || preg_replace('/^\d{9,11}$/', '', $phone) != '') return '형식이 잘못되었습니다';
	}
	private function checkEmail($email){
		// 입력값이 있는지 확인
		if(!$email) return '이메일을 입력하세요';
		// 형식이 올바른지 확인
		if(preg_replace("/^[^.][^@]+@[^@]+$/", "", $email) != "") return '형식이 잘못되었습니다';
	}
	private function checkId($id){
		// 입력값이 있는지 확인
		if(!$id) return '아이디를 입력하세요.';
		//아이디 길이 확인
		$len = strLen($id);
		if($len < 4 || $len > 40) return '글자수를 조정해주세요.';
		//사용 중인 아이디인지 아닌지 확인
		$context = Model_Context::instance();
		$JinboSession = new Model_Session();
		$search_url = $context->getProperty('service.jinbo_api_url')."/search/user_id/";
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
	private function checkBankCode($bankCode){
		if(!$bankCode) return '은행을 입력하세요.';
	}
	private function checkAcctNum($bankCode, $acctnum){
		if(!$bankCode) return '은행을 입력하세요.';
		if(!$acctnum) return '계좌번호를 입력하세요';
		$acctnum = preg_replace("/-/", "", $acctnum);
		if(preg_match("/[^\d]/", $acctnum)) return '잘못된 형식입니다.';
		$digits = $this->getBankDigit($bankCode);
		$result = false;
		$len = strlen($acctnum);
		foreach($digits as $digit){
			if($len == $digit){
				$result = true; break;
			}
		}
		if($result == false) return '다시 입력하세요.';
	}
	private function checkAcctOwner($acctowner){
		if(!$acctowner) return '예금주명을 입력하세요.';
	}
	private function checkRegistNum($registnum){
		if(!$registnum) return '입력하세요';
		$registnum = preg_replace("/-/", "", $registnum);
		if(preg_match("/[^\d]/", $registnum)) return '잘못된 형식입니다.';
		if(preg_replace("/^\d{6}$/", "", $registnum) != "" && preg_replace("/^\d{10}$/", "", $registnum) != "")
			return '다시 입력하세요';
	}
	private function checkDonation($donation){
		if(!$donation) return '월회비를 입력하세요';
		$donation = preg_replace("/,/", "", $donation);
		if(preg_match("/[^\d]/", $donation)) return '잘못된 형식입니다.';
		if($donation < 10000) return '1만원 이상 입력해주세요.';
	}
	private function checkAgreeCms($agreeCms){
		if(!$agreeCms) return 'CMS 출금이체 약관에 동의해주세요.';
	}
	private function zipSearch($keyword, $curPage){
		if(!$keyword) return $this->errMsg('검색어를 입력하세요');

		$apiUrl = $this->service['zip_api_url'];
		$confmKey = $this->service['zip_api_key'];
		$countPerPage = 20;
		$url = $apiUrl.'?confmKey='.$confmKey.'&keyword='.rawurlencode($keyword).'&countPerPage='.$countPerPage.'&currentPage='.$curPage;

		$request = new HTTPRequest($url);
		$request->timeout = 3;
		$request->acceptLanguage = "ko-KR";
		if(!$request->send()) return $this->errMsg('데이터를 전송하는데 문제가 발생했습니다');

		$xml = $request->responseText;
		$xmls = new XMLStruct();
		if(!$xmls->open($xml, 'utf-8')) return $this->errMsg('데이터를 전송하는데 문제가 발생했습니다');

		$errorCode = $xmls->getValue('/results/common/errorCode');
		if($errorCode == '-999') return $this->errMsg('검색시스템에 오류가 발생했습니다');
		else if($errorCode == 'P0001') return $this->errMsg('검색결과가 너무 많습니다. 검색어를 다시 입력해주세요');

		$totalCount = $xmls->getValue('/results/common/totalCount');
		if($totalCount != 0) $lastPage = (int)(($totalCount - 1) / $countPerPage) + 1; else $lastPage = 0;

		$result = array('lastPage'=>$lastPage, 'list'=>array());
		for($i = 0; $postcd = $xmls->getValue('/results/juso['.$i.']/zipNo'); $i++) {
			$addrRoad = $xmls->getValue('/results/juso['.$i.']/roadAddrPart1');
			$addrJibun = $xmls->getValue('/results/juso['.$i.']/jibunAddr');
			array_push($result['list'], array('code'=>$postcd,'addr'=>$addrRoad));
			array_push($result['list'], array('code'=>$postcd,'addr'=>$addrJibun));
		}
		return json_encode($result);
	}
	private function errMsg($error){
		return json_encode(array('error'=>$error));
	}
	private function checkAll(){
		$loggedIn = $this->isLoggedIn();
		if($this->params['idMode'] == 'old' && $loggedIn && $loggedIn['isMember']){
			return array('etc_youMember', '이미 후원회원이십니다');
		}
		$result = $this->checkName(trim($this->params['name'])); if($result) return array('name', $result);
		$result =  $this->checkPhone(trim($this->params['phone'])); if($result) return array('phone', $result);
		$result = $this->checkEmail(trim($this->params['email'])); if($result) return array('email', $result);
		if($this->params['idMode'] == 'old'){
			if(!$loggedIn){
				$result = $this->login(trim($this->params['id']), $this->params['pw']);
				if($result){
					if(preg_match('/아이디/', $result)) return array('id', $result);
					else return array('pw', $result);
				} else {
					$loggedIn = $this->isLoggedIn();
					if($loggedIn && $loggedIn['isMember']) return array('etc_login_youMember', '이미 후원회원이십니다');
				}
			}
		}
		else {
			$result = $this->checkId(trim($this->params['id'])); if($result) return array('id', $result);
			$result = $this->checkPw($this->params['pw']); if($result) return array('pw', $result);
			$result = $this->checkRepw($this->params['pw'], $this->params['repw']); if($result) return array('repw', $result);
			$result = $this->checkQuestion($this->params['question']); if($result) return array('question', $result);
			$result = $this->checkAnswer($this->params['answer']); if($result) return array('answer', $result);
			$result = $this->checkAgreePrivate($this->params['agreePrivate']); if($result) return array('agreePrivate', $result);
			$result = $this->checkAgreeService($this->params['agreeService']); if($result) return array('agreeService', $result);
		}
		$result = $this->checkBankCode($this->params['bankCode']); if($result) return array('bank', $result);
		$result = $this->checkAcctNum($this->params['bankCode'], trim($this->params['acctnum'])); if($result) return array('acctnum', $result);
		$result = $this->checkAcctOwner($this->params['acctowner']); if($result) return array('acctowner', $result);
		$result = $this->checkRegistNum($this->params['registnum']); if($result) return array('registnum', $result);
		$result = $this->checkDonation(trim($this->params['donation'])); if($result) return array('donation', $result);
		$result = $this->checkAgreeCms($this->params['agreeCms']); if($result) return array('agreeCms', $result);
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
	private function bankList(){
		$apiUrl = $this->service['cms_api_url'];
		$secretid = $this->service['cms_api_id'];
		$apiKey = $this->service['cms_api_key'];
		$url = $apiUrl.'?secretid='.$secretid.'&apikey='.$apiKey.'&action=bank-list';
		$list = json_decode(file_get_contents($url), true);
		return $list[1];
	}
	private function getBankList(){
		$list = '';
		foreach($this->bankList as $code => $bank){
			$list .= '<li data-bank-code="'.$code.'">'.$bank['name'].' ('.str_pad($code, 3, '0', STR_PAD_LEFT).')</li>';
		}
		return $list;
	}
	private function getBankDigit($code){
		return explode(',', $this->bankList[$code]['digit']);
	}
	private function convPhone($phone){
		$phone_len = strlen($phone);
		$phone_first = '';
		$phone_second = '';
		$phone_third = '';
		if($phone_len <= 4){
		    $phone_third = $phone;
		}
		else if($phone_len <= 8){
		    $phone_third = substr($phone, -4, 4);
		    $phone_second = substr($phone, 0, $phone_len - 4);
		}
		else if($phone_len <= 10){
		    $phone_third = substr($phone, -4, 4);
		    $phone_second = substr($phone, -7, 3);
		    $phone_first = substr($phone, 0, $phone_len - 7);
		}
		else if($phone_len > 10){
		    $phone_third = substr($phone, -4, 4);
		    $phone_second = substr($phone, -8, 4);
		    $phone_first = substr($phone, 0, $phone_len - 8);
		}
		return $phone_first. '-'. $phone_second .'-'. $phone_third;
	}
	private function adaptCmsArgs(){
		$cmsArgs = [
			'name' => addslashes(trim($this->params['name'])),
			'level' => trim($this->params['memberType']),
			'zip' => trim($this->params['zip']),
			'addr' => addslashes(trim($this->params['address'])),
			'phone' => $this->convPhone(preg_replace('/-/', '', trim($this->params['phone']))),
			'agree_sms' => ($this->params['agreeSms'] ? '1' : '0'),
			'email' => trim($this->params['email']),
			'jinbo_opt' => ($this->params['idMode'] == 'new' ? '1' : '2'),
			'id1' => addslashes(trim($this->params['id'])),
			'idpw' => $this->params['pw'],
			'question' => addslashes($this->params['question']),
			'answer' => addslashes($this->params['answer']),
			'jinboid' => addslashes($_SESSION['user']['user_id']),
			'bank' => trim($this->params['bankCode']),
			'regid' => trim($this->params['registnum']),
			'acctname' => addslashes(trim($this->params['acctowner'])),
			'acctid' => preg_replace('/-/', '', trim($this->params['acctnum'])),
			'fee' => preg_replace('/[\s|,]/', '', trim($this->params['donation'])),
			'comment' => addslashes($this->params['comment']),
			'reg_date' => date("Y-m-d")
		];
		return $cmsArgs;
	}
	private function saveToDB($cmsArgs){
		$apiUrl = $this->service['cms_api_url'];
		$secretid = $this->service['cms_api_id'];
		$apiKey = $this->service['cms_api_key'];
		$url = $apiUrl.'?secretid='.$secretid.'&apikey='.$apiKey.'&action=ready';
		foreach($cmsArgs as $k => $v) {
			if( !is_numeric($v) ) {
				$url .= "&".$k."=".rawurlencode(mb_convert_encoding($v,'euckr','utf-8'));
			} else {
				$url .= "&".$k."=".$v;
			}
		}
		$result = json_decode(file_get_contents($url), true);
		return $result;
	}
	private function sendEmail($cmsArgs){
		$header = "From: center@center.jinbo.net\r\n";
		$to = "truesig@jinbo.net";
		$content =
			"신규회원신청 - ".$cmsArgs['name']."님이 ".$cmsArgs['level']."으로 회원신청을 하셨습니다. 이용자 정보는 다음과 같습니다.\r\n\r\n".
			"주소: [".$cmsArgs['zip']."] ".$cmsArgs['addr']."\r\n".
			"전화번호: ".$cmsArgs['phone']."\r\n".
			"이메일: ".$cmsArgs['email']."\r\n";
		if($jinbo_opt == 2) {
			$content .= "이용자 아이디 사용: ".$cmsArgs['jinboid']."\r\n";
		} else {
			$content .=
				"아이디: ".$cmsArgs['id1']."\r\n".
				"비밀번호: ".$cmsArgs['idpw']."\r\n";
		}
		$content .=
			"거래은행: ".$this->bankList[$cmsArgs['bank']]['name']."\r\n".
			"계좌번호: ".$cmsArgs['acctid']."\r\n".
			"예금주명: ".$cmsArgs['acctname']."\r\n".
			"예금주 생년월일: ".$cmsArgs['regid']."\r\n".
			"회비: ".$cmsArgs['fee']."원\r\n".
			"하고싶은말: ".stripslashes($cmsArgs['comment'])."\r\n\r\n".
			"http://cms.jinbo.net에 가셔서 가입처리해주시기 바랍니다.";
		mail($to, mb_convert_encoding("회원가입 신청", 'euckr', 'utf-8'), mb_convert_encoding($content, 'euckr', 'utf-8'), $header);
	}
	private function submit(){
		//데이터 유효성 확인
		$result = $this->checkAll();
		if($result) return $result;

		//데이터를 임시 DB에 저장
		$cmsArgs = $this->adaptCmsArgs();
		$result = $this->saveToDB($cmsArgs);
		if($result[0] != '0') return array('etc_error', $result[1]);

		//메일보내기
		$this->sendEmail($cmsArgs);

		return;
	}//end of submit()
}

?>
