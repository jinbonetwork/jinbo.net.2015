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
	<title>소통과 연대의 즐거움 : 진보넷</title>

<?php	echo $this->header(); ?>

	<meta property="fb:app_id" content="497213570307119"/>
	<meta property="og:title" content="진보네트워크센터"/>
	<meta property="og:type" content="website"/>
	<meta property="og:url" content="http://www.jinbo.net"/>
	<meta property="og:image" content="https://www.jinbo.net<?php print url("resources/images/og.png"); ?>"/>
	<meta property="og:description" content="검열과 감시에 맞서 정보인권을 지키고 자본과 국가로부터 독립적인 네트워크를 구축하는 정보인권단체 진보넷의 활동을 안내합니다.">
	<meta property="og:site_name" content="진보네트워크센터"/>
	<meta property="og:updated_time" content="2015-08-18"/>

	<meta name="twitter:card" content="summary"/>
	<meta name="twitter:title" content="진보네트워크센터"/>
	<meta name="twitter:description" content="검열과 감시에 맞서 정보인권을 지키고 자본과 국가로부터 독립적인 네트워크를 구축하는 정보인권단체 진보넷의 활동을 안내합니다."/>
	<meta name="twitter:creator" content="jinbonet"/>
	<meta name="twitter:image:src" content="https://www.jinbo.net<?php print url("resources/images/og.png"); ?>"/>
	<meta name="twitter:url" content="http://www.jinbo.net"/>
</head>
<body class="jinbo-net <?php print $breadcrumbs_class; ?>">
	<div id="site-main-container">
<?php	print $content; ?>
	</div>
<?php $this->footer(); ?>
</body>
</html>
