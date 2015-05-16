<div id="<?php print $section['id']; ?>" class="member-slider <?php print $section['class']; ?>" <?php print $section['style']; ?> <?php print $section['attr']; ?>>
	<div class="max_container" style="max-width: <?php print ($section['max-width'] ? $section['max-width'] : 1280); ?>px;">
		<h3><?php print $section['title']; ?></h3>
		<div class="max-container-wrapper">
<?php		print $section['content']; ?>
		</div>
	</div>
</div>
