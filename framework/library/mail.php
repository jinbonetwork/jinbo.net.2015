<?php
function sendEmail($senderName, $senderEmail, $receivers, $subject, $message, $logging=0) {
	require_once( JFE_CONTRIBUTE_PATH."/PHPMailer/class.smtp.php" );
	require_once( JFE_CONTRIBUTE_PATH."/PHPMailer/class.phpmailer.php" );

	$context = Model_Context::instance();
	$service = $context->getProperty('service.*');

	$mail = new PHPMailer();
	$mail->SetLanguage( 'en', JFE_CONTRIBUTE_PATH."/PHPMailer/language/" );
	$mail->IsHTML(true);
	if($service['useSMTP']) {
		$mail->IsSMTP();
		$mail->Host		= ($service['smtpHost'] ? $service['smtpHost'] : '127.0.0.1');
		$mail->Port		= ($service['smtpPort'] ? $service['smtpPort'] : 25);
		if($service['smtpSecure'])
			$mail->SMTPSecure = $service['smtpSecure'];
		if($service['smtpUsername'] && $service['smtpPassword']) {
			$mail->SMTPAuth	= true;
			$mail->Username = $service['smtpUsername'];
			$mail->Password = $service['smtpPassword'];
		}
	} else {
		$mail->IsMail();
	}
	$mail->CharSet  = 'utf-8';
	$mail->setFrom($senderEmail, "=?UTF-8?B?".base64_encode($senderName)."?=");
	$mail->Subject  = "=?UTF-8?B?".base64_encode($subject)."?=";
	$mail->msgHTML($message,dirname(__FILE__));
	$mail->AltBody  = strip_tags($message);
//	$mail->addAddress( $senderEmail, $senderName );
	if($receivers && @count($receivers) > 0) {
		foreach($receivers as $receiver) {
			$mail->addAddress( $receiver['email'], "=?UTF-8?B?".base64_encode($receiver['name'])."?=" );
		}
		$ret = $mail->send();
		if($logging && !$ret) {
			return array(false,$mail->ErrorInfo);
		}
	}

	return true;
}

function makeLetter($variables) {
	$context = Model_Context::instance();

	@extract($variables);
	$base_uri = "http://".$context->getProperty('service.domain').base_uri();
	ob_start();
	include_once JFE_RESOURCE_PATH."/html/letter.html.php";
	$html = ob_get_contents();
	ob_end_clean();

	return $html;
}

function sendRegistMail($email_id,$name,$authtoken) {
	$context = Model_Context::instance();
	if (empty($email_id))
		return array(1,'이메일을 입력하세요.');
	if (!preg_match('/^[^@]+@([-a-zA-Z0-9]+\.)+[-a-zA-Z0-9]+$/', $email_id))
		return array(1,'이메일 형식이 아닙니다');

	$variables['title'] = $name." 님 ".$context->getProperty('service.title')." 가입을 환영합니다.";
	$variables['content'] = "<p>".$context->getProperty('service.title')."는 소셜펀치(SocialFunch)와 회원 정보를 공유합니다.</p>";
	$variables['content'] .= "<p>회원 가입을 완료하시려면, 아래 첫 로그인을 위한 링크를 클릭해주세요.</p>";
	if($context->getProperty('service.ssl') == true) {
		$variables['link'] = "https://".$context->getProperty('service.domain').base_uri()."login/?email_id=".rawurlencode($email_id)."&authtoken=".$authtoken;
	} else {
		$variables['link'] = "http://".$context->getProperty('service.domain').base_uri()."login/?email_id=".rawurlencode($email_id)."&authtoken=".$authtoken;
	}
	$variables['link_title'] = "첫로그인 하기";
	$variables['sender'] = $context->getProperty('service.senderName');

	$mailMessage = makeLetter($variables);

	$receiver = array();
	$receiver[] = array('name'=>$name, 'email'=>$email_id);
	$ret = sendEmail($context->getProperty('service.senderName'), $context->getProperty('service.senderEmail'), $receiver, $variables['title'], $mailMessage,1);
	if($ret != true) {
		array(1,$ret[1]);
	}
	return true;
}

function sendChangeMail($uid,$email_id,$name,$authtoken) {
	$context = Model_Context::instance();
	if (empty($email_id))
		return array(1,'이메일을 입력하세요.');
	if (!preg_match('/^[^@]+@([-a-zA-Z0-9]+\.)+[-a-zA-Z0-9]+$/', $email_id))
		return array(1,'이메일 형식이 아닙니다');

	$variables['title'] = $name." 님 ".$context->getProperty('service.title')." 의 로그인 E-Mail 을 수정합니다.";
	$variables['content'] = "<p>".$context->getProperty('service.title')."는 소셜펀치(SocialFunch)와 회원 정보를 공유합니다. 로그인 E-Mail을 변경하시면 소셜펀치 로그인 E-Mail 아이디도 변경됩니다.</p>";
	$variables['content'] .= "<p>로그인 이메일 수정을 완료하시려면, 아래 인증을 위한 링크를 클릭해주세요.</p>";
	if($context->getProperty('service.ssl') == true) {
		$variables['link'] = "https://".$context->getProperty('service.domain').base_uri()."login/authemail?uid=".$uid."&email_id=".rawurlencode($email_id)."&authtoken=".$authtoken;
	} else {
		$variables['link'] = "http://".$context->getProperty('service.domain').base_uri()."login/authemail?uid=".$uid."&email_id=".rawurlencode($email_id)."&authtoken=".$authtoken;
	}
	$variables['link_title'] = "로그인 E-mail 변경하기";
	$variables['sender'] = $context->getProperty('service.senderName');

	$mailMessage = makeLetter($variables);

	$receiver = array();
	$receiver[] = array('name'=>$name, 'email'=>$email_id);
	$ret = sendEmail($context->getProperty('service.senderName'), $context->getProperty('service.senderEmail'), $receiver, $variables['title'], $mailMessage,1);
	if($ret != true) {
		array(1,$ret[1]);
	}
	return true;
}
?>
