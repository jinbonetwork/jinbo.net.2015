<div id="<?php print $section['id']; ?>" class="max-before-title-container-after <?php print $section['class']; ?>" <?php print $section['style']; ?> <?php print $section['attr']; ?>>
	<div class="before"></div>
	<div class="max-container wow bounceInUp" style="max-width: <?php print ($section['max-width'] ? $section['max-width'] : 1280); ?>px;">
		<div class="sub-title">
			<div class="inner">
				<h2><?php print $section['title']; ?></h2>
				<h3><?php print $section['description']; ?></h3>
			</div>
		</div>
		<div class="max-container-wrapper wow fadeInUp">
<?php		print $section['content']; ?>
		</div>
	</div>
	<div class="after"></div>
</div>
