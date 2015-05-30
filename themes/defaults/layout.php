<!DOCTYPE html>
<html id="jinbo-net">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width,user-scalable=0,initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
	<title>소통과 연대의 즐거움 : 진보넷</title>
<?php	echo $this->header(); ?>

</head>
<body class="jinbo-net <?php print $breadcrumbs_class; ?>">
	<header id="site-header">
		<div class="logo"><a href="<?php print base_uri(); ?>"><span>진보네트워크센터</span></a></div>
		<ul class="quickLink">
			<li class="mail"><a href="http://mail.jinbo.net">메일</a></li>
			<li class="cool"><a href="http://go.jinbo.net/cool">속보게시판</a></li>
			<li class="newscham"><a href="http://www.newscham.net">참세상</a></li>
		</ul>
		<ul class="menuLink">
			<li class="menu"><a href="javascript://"><span class="j-misc-list-boxed" title="메뉴"></span></a></li>
		</ul>
		<div id="site-navigation" class="collapsed">
			 <div class="navi-wrap">
			 	<div class="left"></div>
			 	<button type="button" class="close"><span class="j-misc-close-boxed" title="닫기"></span></button>
				<dl class="navi-menu">
					<dt><a href="<?php print base_uri(); ?>"><span class="j-logos-jinbonet-thin"></span></a></dt>
					<dd class="home"><a href="<?php print base_uri(); ?>">처음으로</a></dd>
					<dd class="about"><a href="<?php print url("about"); ?>">단체 소개</a></dd>
					<dd class="support"><a href="<?php print url("support"); ?>">후원하기</a></dd>
					<dd class="sitemap"><a href="<?php print url("sitemap"); ?>">사이트 맵</a></dd>
				</dl>
			 </div>
		</div>
	</header>
	<div id="site-main-container">
<?php	print $content; ?>
	</div>
<?php $this->footer(); ?>
	<footer id="site-footer">
		<div class="before"></div>
		<div class="greencover">
			<div class="inner">
				<div class="top">
				</div>
				<div class="right">
				</div>
			</div>
		</div>
		<div id="site-footer-content">
			<div class="max-container">
				<div class="site-share float">
					<h3><a href="http://www.jinbo.net">진보네트워크센터</a></h3>
					<ul class="sns">
						<li class="twitter"><a href="https://twitter.com/jinbonetwork" target="_blank"><span>twitter</span></a></li>
						<li class="facebook"><a href="https://facebook.com/jinbonetwork" target="_blank"><span>facekbook</span></a></li>
						<li class="github"><a href="https://www.github.com/jinbonetwork" target="_blank"><span>github</span></a></li>
						<li class="support"><a href="https://www.jinbo.net/support" target="_blank"><span>후원하기</span></a></li>
					</ul>
				</div>
				<div class="jinbonet-team float">
					<ul>
						<li class="act"><a href="http://act.jinbo.net">정보운동 ACT</a></li>
						<li class="lab"><a href="http://lab.jinbo.net">독립네트워크</a></li>
					</ul>
				</div>
				<div class="jinbonet-sites float">
					<ul>
						<li class="myinfo"><a href="http://mycham.jinbo.net">내 정보</a></li>
						<li class="mail"><a href="http://mail.jinbo.net">메일</a></li>
						<li class="cool"><a href="http://go.jinbo.net/cool">속보</a></li>
						<li class="job"><a href="http://go.jinbo.net/job">구인/구직</a></li>
						<li class="blog"><a href="http://blog.jinbo.net">진보블로그</a></li>
					</ul>
				</div>
				<div class="jinbonet-service float">
					<ul>
						<li class="taogi"><a href="http://www.taogi.net">따오기</a></li>
						<li class="socialfunch"><a href="https://www.socialfunch.org">소셜펀치</a></li>
						<li class="hosting"><a href="https://hosting.jinbo.net">회원호스팅</a></li>
						<li class="maillist"><a href="http://list.jinbo.net">메일링리스트</a></li>
					</ul>
				</div>
			</div>
		</div>
		<div id="site-footer-footer">
			<div class="background"></div>
			<div class="max-container">
				<div class="contact">
					서울시 서대문구 충정로3가 227-1 우리타워 3층 / 02-774-4551 / truesig@jinbo.net
				</div>
				<div class="license">
					No CopyRight! Just COPYLEFT!
				</div>
			</div>
		</div>
	</footer>
</body>
</html>
