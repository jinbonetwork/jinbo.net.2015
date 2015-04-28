<!DOCTYPE html>
<html id="jinbo-net">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width,user-scalable=0,initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
	<title>소통과 연대의 즐거움 : 진보넷</title>
<?php	echo $this->header(); ?>

	<style>
		[class^="col-"]{
			box-sizing: border-box;
			outline: 5px solid white;
			background-color: #eeeeee;
		}
	</style>

</head>
<body class="jinbo-net">
	<header id="site-header">
		<div class="logo"><a href="http://www.jinbo.net"><span>진보네트워크센터</span></a></div>
		<ul class="quickLink">
			<li class="mail"><a href="http://mail.jinbo.net">메일</a></li>
			<li class="cool"><a href="http://go.jinbo.net/cool">속보게시판</a></li>
			<li class="newscham"><a href="http://www.newscham.net">참세상</a></li>
			<li class="menu"><a href="javascript://"><span>메뉴</span></a></li>
		</ul>
		<div id="site-navigation" class="collapsed">
			 <div class="navi-wrap">
			 	<button type="button" class="close"><span>닫기</span></button>
			 </div>
		</div>
	</header>
	<div id="site-main-container">
<?php	print $content; ?>
	</div>
<?php $this->footer(); ?>
	<footer id="site-footer">
	</footer>
</body>
</html>
