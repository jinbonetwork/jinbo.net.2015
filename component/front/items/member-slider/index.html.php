<?php importResource("swiper"); ?>
	<div class="member-slider">
		<div class="indicator-wrapper">
			<div class="swiper-container slider-indicator">
				<ul class="swiper-wrapper">
				</ul>
			</div>
			<div class="cursor"></div>
		</div>
		<div class="swiper-container slider-gallery">
			<div class="swiper-wrapper">
<?php		for($i=0; $i<@count($data['data']); $i++) {?>
				<div class="swiper-slide">
					<article class="memeber-slider-content">
						<div class="portrait"><a href="<?php print $data['data'][$i]['url']['href']; ?>" target="<?php print $data['data'][$i]['url']['target']; ?>"><img src="<?php print $data['data'][$i]['media']['url']; ?>"></a></div>
						<h3><?php print $data['data'][$i]['subject']; ?></h3>
						<h4><a href="<?php print $data['data'][$i]['url']['href']; ?>" target="<?php print $data['data'][$i]['url']['target']; ?>"><?php print $data['data'][$i]['subtitle']; ?></a></h3>
						<p><a href="<?php print $data['data'][$i]['url']['href']; ?>" target="<?php print $data['data'][$i]['url']['target']; ?>"><?php print $data['data'][$i]['description']; ?></a></p>
					</article>
				</div>
<?php		}?>
			</div>
			<div class="swiper-button-prev"></div>
			<div class="swiper-button-next"></div>
		</div>
		<div class="subscribe-banner">
			<a href="/join/"><span>후원회원 되기!</span></a>
		</div>
	</div>
