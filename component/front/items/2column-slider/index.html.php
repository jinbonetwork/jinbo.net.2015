<?php
importResource("swiper");
?>
<div class="two-column-slider-wrapper component">
	<div class="swiper-container two-column-gallery">
		<div class="swiper-wrapper">
<?php	for($i=0; $i<@count($data['data']); $i++) {?>
			<div class="swiper-slide">
				<article class="slider-content">
					<div class="featured"><div class="filter"></div><img src="<?php print $data['data'][$i]['media']['url']; ?>"></div>
					<div class="article">
						<h3><?php print $data['data'][$i]['subject']; ?></h3>
						<p class="description"><?php print $data['data'][$i]['description']; ?></p>
						<div class="link">
							<ul>
<?php						if($data['data'][$i]['url']) {?>
								<li class="uri"><a href="<?php print $data['data'][$i]['url']['href']; ?>" target="<?php print $data['data'][$i]['url']['target']; ?>"><?php print $data['data'][$i]['url']['label']; ?></a></li>
<?php						}?>
<?php						if($data['data'][$i]['url2']) {?>
								<li class="uri2"><a href="<?php print $data['data'][$i]['url2']['href']; ?>" target="<?php print $data['data'][$i]['url2']['target']; ?>"><?php print $data['data'][$i]['url2']['label']; ?></a></li>
<?php						}?>
							</ul>
						</div>
					</div>
				</article>
			</div>
<?php	}?>
		</div>
		<div class="swiper-button-prev"></div>
		<div class="swiper-button-next"></div>
	</div>
</div>
