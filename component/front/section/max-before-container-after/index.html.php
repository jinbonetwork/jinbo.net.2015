<div id="<?php print $section['id']; ?>" class="max-before-container-after <?php print $section['class']; ?>" <?php print $section['style']; ?> <?php print $section['attr']; ?>>
	<div class="before"></div>
	<div class="max-container-wrapper" style="max-width: <?php print ($section['max-width'] ? $section['max-width'] : 1280); ?>px;">
<?php	print $section['content']; ?>
	</div>
	<div class="after"></div>
</div>
