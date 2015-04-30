<div id="hodoug-test">
toolbar
</div>
<?php
if(file_exists(JFE_PATH."/themes/".$themes."/front/index.html.php")) {
	include_once JFE_PATH."/themes/".$themes."/front/index.html.php";
} else {
	print $content;
}
?>
