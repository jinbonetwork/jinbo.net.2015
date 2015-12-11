<div id="<?php print $section['id']; ?>" class="max-container <?php print $section['class']; ?>" style="<?php print $section['style']; ?>" <?php print $section['attr']; ?>>
	<div class="max-container-wrapper" style="max-width: <?php print ($section['max-width'] ? $section['max-width'] : 1280); ?>px;">
<?php	print $section['content']; ?>
	</div>
</div>
