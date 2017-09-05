<?php
if(!is_object($browser)) $browser = new Browser();
?>
<!DOCTYPE html>
<html id="jinbo-net"<?php if($browser->getBrowser() == Browser::BROWSER_IE) print ' class="is-ie"'; ?>>
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width,user-scalable=0,initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
	<link rel="shortcut icon" href="<?php print url("resources/images/favicon.ico"); ?>">
	<title>소통과 연대의 즐거움 : 진보네트워크센터</title>

<?php	echo $this->header(); ?>

	<meta property="fb:app_id" content="497213570307119"/>
	<meta property="og:title" content="진보네트워크센터"/>
	<meta property="og:type" content="website"/>
	<meta property="og:url" content="<?php print site_url(); ?>"/>
	<meta property="og:image" content="<?php print full_url("resources/images/og.png"); ?>"/>
	<meta property="og:description" content="검열과 감시에 맞서 정보인권을 지키고 자본과 국가로부터 독립적인 네트워크를 구축하는 정보인권단체 진보넷의 활동을 안내합니다.">
	<meta property="og:site_name" content="진보네트워크센터"/>
	<meta property="og:updated_time" content="2015-08-18"/>

	<meta name="twitter:card" content="summary"/>
	<meta name="twitter:title" content="진보네트워크센터"/>
	<meta name="twitter:description" content="검열과 감시에 맞서 정보인권을 지키고 자본과 국가로부터 독립적인 네트워크를 구축하는 정보인권단체 진보넷의 활동을 안내합니다."/>
	<meta name="twitter:creator" content="jinbonet"/>
	<meta name="twitter:image:src" content="<?php print full_url("resources/images/og.png"); ?>"/>
	<meta name="twitter:url" content="<?php print site_url(); ?>"/>
</head>
<body class="jinbo-net <?php print $breadcrumbs_class; ?>">
	<header id="site-header">
		<div class="logo"><a href="<?php print base_uri(); ?>"><span>진보네트워크센터</span></a></div>
		<ul class="quickLink">
			<li class="mail"><a href="https://mail.jinbo.net">메일</a></li>
			<li class="cool"><a href="http://go.jinbo.net/cool">속보게시판</a></li>
			<li class="newscham"><a href="http://www.newscham.net">참세상</a></li>
		</ul>
		<ul class="menuLink">
			<li class="menu"><a href="javascript://"><span class="j-misc-list-boxed" title="메뉴"></span></a></li>
		</ul>
	</header>
	<aside id="site-navigation" class="collapsed">
		 <div class="navi-wrap">
		 	<div class="left"></div>
		 	<button type="button" class="menu-close"><span class="j-misc-close-boxed" title="닫기"></span></button>
			<div class="navi-content">
				<dl class="navi-menu">
					<dt><a href="<?php print base_uri(); ?>"><span class="j-logos-jinbonet-thin"></span></a></dt>
					<dd class="home"><a href="<?php print base_uri(); ?>" data-letters="처음으로" data-path-id="home"><span>처음으로</span></a></dd>
					<dd class="about"><a href="<?php print url("about"); ?>" data-letters="단체 소개"data-path-id="about"><span>단체 소개</span></a></dd>
					<dd class="join"><a href="<?php print url("join",array('ssl'=>true)); ?>" data-letters="후원하기" data-path-id="join"><span>후원하기</span></a></dd>
					<dd class="sitemap"><a href="<?php print url("sitemap"); ?>" data-letters="사이트 맵" data-path-id="sitemap"><span>사이트 맵</span></a></dd>
				</dl>
				<ul class="site-share">
					<li class="twitter"><a href="https://twitter.com/jinbonetwork" target="_blank"><span>twitter</span></a></li>
					<li class="facebook"><a href="https://facebook.com/jinbonetwork" target="_blank"><span>facekbook</span></a></li>
					<li class="github"><a href="https://www.github.com/jinbonetwork" target="_blank"><span>github</span></a></li>
					<li class="vimeo"><a href="https://vimeo.com/jinbonet" target="_blank"><span>vimeo</span></a></li>
				<ul>
			</div>
		 </div>
	</aside>
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
<?php			include_once JFRAMEWORK_PATH."/html/global-footer/sitemap.html"; ?>
			</div>
		</div>
		<div id="site-footer-footer">
			<div class="background"></div>
			<div class="max-container">
<?php			include_once JFRAMEWORK_PATH."/html/global-footer/contact.html"; ?>
				<div class="privacy"><div class="overlay-link url"><a href="<?php print url("privacy/v2"); ?>" class="overlay-button" target=".component.privacy-content" data-subject="개인정보 취급방침" data-defendency-component="<?php print url('component/privacy/items/terms'); ?>">개인정보취급방침</a></div></div>
<?php			include_once JFRAMEWORK_PATH."/html/global-footer/license.html"; ?>
			</div>
		</div>
	</footer>
</body>
</html>
