<?php
function init_fb_html_xmlns() {
	$xmlns = "\n\t".'xmlns:og="http://ogp.me/ns#"
	xmlns:fb="http://www.facebook.com/2008/fbml"';

	return $xmlns;
}

function init_fb_script($fb_app_id) {
	$script = "<div id=\"fb-root\"></div>
<script>";
	if($fb_app_id) {
		$script .="
	window.fbAsyncInit = function() {
		FB.init({
			appId      : '".$fb_app_id."',
			status     : true, 
			cookie     : true,
			xfbml      : true
		});
	};";
	}
	$script .="
	(function(d){
		var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
		js = d.createElement('script'); js.id = id; js.async = true;
		js.src = \"//connect.facebook.net/ko_KR/all.js\";
		d.getElementsByTagName('head')[0].appendChild(js);
	}(document));
</script>\n";

	return $script;
}

function init_fb_meta($fb_app_id,$subject,$uri,$favicon,$summary) {
	$meta = '<meta property="og:title" content="타임라인 따오기: '.htmlspecialchars($subject).'"/>
	<meta property="og:type" content="activity"/>
	<meta property="og:url" content="'.$uri.'"/>
	<meta property="og:image" content="'.$favicon.'"/>
	<meta property="og:site_name" content="타임라인 따오기(Taogi)"/>
	<meta property="fb:app_id" content="'.$fb_app_id.'"/>'."\n";
	if($summary) {
		$meta .= "\t".'<meta property="og:description"
		content="'.htmlspecialchars($summary).'"/>'."\n";
	}
	return $meta;
}
?>
