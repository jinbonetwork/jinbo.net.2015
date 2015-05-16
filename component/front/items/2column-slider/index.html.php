	<div class="2column-slider-wrapper">
		<div class="swiper-container 2column-gallery">
			<div class="swiper-wrapper">
<?php		for($i=0; $i<@count($data['data']); $i++) {?>
				<div class="swiper-slide">
					<article class="memeber-slider-content">
						<div class="background"></div>
						<div class="featured"><img src="<?php print $data['data'][$i]['media']; ?>"></div>
						<h3><?php print $data['data'][$i]['subject']; ?></h3>
						<p><a href="<?php print $data['data'][$i]['url']['href']; ?>" target="<?php print $data['data'][$i]['url']['target']; ?>"><?php print $data['data'][$i]['description']; ?></a></p>
						<div class="link">
							<ul>
<?php						if($data['data'][$i]['url']) {?>
								<li class="uri"><a href="<?php print $data['data'][$i]['url']['href']; ?>" target="<?php print $data['data'][$i]['url']['target']; ?>"><?php print $data['data'][$i]['url']['label']; ?></a></li>
<?php						}?>
<?php						if($data['data'][$i]['url2']) {?>
								<li class="uri2"><a href="<?php print $data['data'][$i]['url2']['href']; ?>" target="<?php print $data['data'][$i]['url2']['target']; ?>"><?php print $data['data'][$i]['url2']['lable']; ?></a></li>
<?php						}?>
							</ul>
						</div>
					</article>
				</div>
<?php		}?>
			</div>
			<div class="swiper-button-prev"></div>
			<div class="swiper-button-next"></div>
		</div>
	</div>
