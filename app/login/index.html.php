<div id="container">
	<div id="main">
		<div id="login_box">
			<form name="login_form" action="<?php print url("login/"); ?>" method="post" onsubmit="return check_login(this);" id="loginForm">
				<input type="hidden" name="requestURI" value="<?php print $this->params['requestURI']; ?>" id="requestURI">
				<fieldset>
					<legend>진보넷 로그인</legend>
					<div class="login_header">
						<div class="front">진보넷 로그인</div>
						<div class="back">
							<img src="<?php print url("resources/images/r-1.svg"); ?>" width="145" height="48">
						</div>
					</div>
<?php			if($_SESSION['user']['uid']) {?>
					<div class="inner">
						<div class="message">
							<?php print $_SESSION['user']['user_id']." (".$_SESSION['user']['name'].") 님은 이미 로그인된 상태입니다."; ?>
						</div>
					</div>
					<div class="form_foot">
						<a href="javascript://" onclick="history.back()">뒤로</a> 
					</div>
<?php			} else {?>
					<div class="inner">
						<div class="left">
							<fieldset class="fields">
								<label for="user_id">아이디</label>
								<input type="text" class="input_text form-control animated" name="user_id" id="user_id" tabindex="3">
							</fieldset>
							<fieldset class="fields">
								<label for="passwd">비밀번호</label>
								<input type="password" class="input_text form-control animated" name="passwd" id="passwd" tabindex="4">
							</fieldset>
						</div>
						<div class="right">
							<input type="submit" value="로그인" tabindex="5" id="bt_submit">
						</div>
					</div>
					<div class="form_foot">
						<a href="javascript://" onclick="find_passwd('http://go.jinbo.net/commune/find_passwd.php');">비밀번호 찾기</a> 
						<a href="http://center.jinbo.net/member/regist.php">회원가입</a>
					</div>
<?php			}?>
				</fieldset>
			</form>
		</div>
	</div>
</div>
