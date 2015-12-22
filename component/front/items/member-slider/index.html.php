<?php
	importResource("swiper");
	importResource("imagefill.js");
?>
	<div class="member-slider component">
		<div class="swiper-container slider-gallery">
			<div class="swiper-wrapper">
<?php		for($i=0; $i<@count($data['data']); $i++) {?>
				<div class="swiper-slide">
					<article class="memeber-slider-content">
						<div class="inner">
							<div class="portrait"><a href="<?php print $data['data'][$i]['url']['href']; ?>" target="<?php print $data['data'][$i]['url']['target']; ?>"><img src="<?php print url($data['data'][$i]['media']['url']); ?>"></a></div>
							<h3 class="subject"><a href="<?php print $data['data'][$i]['url']['href']; ?>" target="<?php print $data['data'][$i]['url']['target']; ?>"><?php print $data['data'][$i]['subject']; ?></a></h3>
							<p><a href="<?php print $data['data'][$i]['url']['href']; ?>" target="<?php print $data['data'][$i]['url']['target']; ?>"><?php print $data['data'][$i]['description']; ?></a></p>
							<div class="date"><p><span><?php print $data['data'][$i]['month']; ?></span></p></div>
						</div>
						<div class="overlay"></div>
					</article>
				</div>
<?php		}?>
			</div>
			<div class="swiper-button-prev"></div>
			<div class="swiper-button-next"></div>
		</div>
	</div>
	<div class="subscribe-banner">
		<a href=<?php print url("join"); ?>><span>후원회원 되기!</span></a>
	</div>
