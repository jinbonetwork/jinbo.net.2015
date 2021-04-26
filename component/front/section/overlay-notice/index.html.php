<div id="<?php print $section['id']; ?>" class="overlay-notice <?php print $section['class']; ?>" style="<?php print $section['style']; ?>" <?php print $section['attr']; ?>>
	<div class="overlay-notice-wrapper" style="max-width: <?php print ($section['max-width'] ? $section['max-width'] : 600); ?>px;">
<?php	print $section['content']; ?>
		<div class="overlay-notice-button"><input type="button" class="btn btn-default" value="닫기"></div>
	</div>
</div>
