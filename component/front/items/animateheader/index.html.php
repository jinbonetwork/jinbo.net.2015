<?php
importResource('animate-header');
importResource('modernizr');
importResource('mobile-detect.js');
importResource('jquery-easing');
?>
			<div class="animateheader-container">
				<div class="animateheader-wrap">
					<div id="large-header" class="animate-header">
						<canvas id="header-canvas"></canvas>
						<h1>
							<div id="jinbonet-slogan">
								<div class="slogan"></div>
							</div>
							<div id="jinbonet-title">
								<div class="letter letter1"><span class="black"></span></div>
								<div class="letter letter2"><span class="black"></span></div>
								<div class="letter letter3"><span class="black"></span></div>
								<div class="letter letter4"><span class="black"></span></div>
								<div class="letter letter5"><span class="black"></span></div>
								<div class="letter letter6"><span class="black"></span></div>
								<div class="letter letter7"><span class="black"></span></div>
								<div class="letter letter8"><span class="black"></span></div>
							</div>
						</h1>
<?php			if(preg_match("/\.(mp4|webm)$/i",$data['media'])) {?>
						<video class="animate-header-background-video">
<?php					$_media = explode(",",$data['media']);
						for($i=0; $i<@count($_media); $i++) {
							if(preg_match("/\.webm$/i",$_media[$i]))
								$media_type = "video/webm";
							else if(preg_match("/\.mp4$/i",$_media[$i]))
								$media_type = "video/mp4"; ?>
							<source src="<?php print $_media[$i]; ?>" type="<?php print $media_type; ?>">
<?php					}?>
						</video>
						<div class="loading"><span>로딩중</span></div>
<?php				if($data['alternative']) {?>
						<img class="animate-header-background-image" src="<?php print $data['alternative']; ?>">
<?php				}
				} else if($data['media']) {?>
						<img class="animate-header-background-image" src="<?php print $data['media']; ?>">
<?php			}
?>					</div>
				</div>
			</div>
