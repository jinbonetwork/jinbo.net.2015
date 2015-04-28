<?php
importResource('animate-header');
importResource('modernizr');
importResource('mobile-detect.js');
?>
			<div id="large-header" class="animate-header">
				<canvas id="header-canvas"></canvas>
				<h1><?php print $data['subject']; ?></h1>
<?php	if(preg_match("/\.(mp4|webm)$/i",$data['media'])) {?>
				<video class="animate-header-background-video">
<?php			$_media = explode(",",$data['media']);
				for($i=0; $i<@count($_media); $i++) {
					if(preg_match("/\.webm$/i",$_media[$i]))
						$media_type = "video/webm";
					else if(preg_match("/\.mp4$/i",$_media[$i]))
						$media_type = "video/mp4"; ?>
					<source src="<?php print $_media[$i]; ?>" type="<?php print $media_type; ?>">
<?php			}?>
				</video>
				<div class="loading"><span>로딩중</span></div>
<?php		if($data['alternative']) {?>
				<img class="animate-header-background-image" src="<?php print $data['alternative']; ?>">
<?php		}
		} else if($data['media']) {?>
				<img class="animate-header-background-image" src="<?php print $data['media']; ?>">
<?php	}
?>			</div>
