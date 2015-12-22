<div id="container">
	<div id="main">
		<div id="login_box">
			<form name="login_form" action="<?php print url("login/"); ?>" method="post" onsubmit="return check_login(this);" id="loginForm">
				<input type="hidden" name="requestURI" value="<?php print $this->params['requestURI']; ?>" id="requestURI">
				<fieldset>
					<legend>진보넷 로그인</legend>
					<div class="login_header">
						<a href="<?php echo JFE_URI; ?>">
							<i class="j-logos-jinbonet"></i><span> 진보네트워크센터</span>
						</a>
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
								<div class="input-wrap">
									<input type="text" class="animated" name="user_id" id="user_id" tabindex="3">
								</div>
							</fieldset>
							<fieldset class="fields">
								<label for="passwd">비밀번호</label>
								<div class="input-wrap">
									<input type="password" class="animated" name="passwd" id="passwd" tabindex="4">
								</div>
							</fieldset>
						</div>
						<div class="right">
							<button id="bt_submit" type="submit" tabindex="5">
								<div class="background"></div>
								<div class="label">로그인</div>
							</button>
						</div>
					</div>
					<div class="form_foot">
						<a href="<?php echo JFE_URI; ?>/signup">이용자 가입</a>
						<a href="javascript://" onclick="find_passwd('http://go.jinbo.net/commune/find_passwd.php');">비밀번호 찾기</a>
					</div>
<?php			}?>
				</fieldset>
			</form>
		</div>
	</div>
</div>
