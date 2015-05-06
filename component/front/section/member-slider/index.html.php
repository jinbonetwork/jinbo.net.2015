<div id="<?php print $section['id']; ?>" class="member-slider <?php print $section['class']; ?>" <?php print $section['style']; ?> <?php print $section['attr']; ?>>
	<div class="container">
		<div class="indicator-wrapper">
			<div class="swiper-container slider-indicator">
				<ul class="swiper-wrapper">
				</ul>
			</div>
			<div class="cursor"></div>
		</div>
		<div class="swiper-container slider-gallery">
<?php		print $section['content']; ?>
			<div class="swiper-button-prev"></div>
			<div class="swiper-button-next"></div>
		</div>
		<div class="subscribe-banner">
			<a href="/join/">후원회원 가입하기</a>
		</div>
	</div>
</div>
