<?php
importResource('swiper');
?>
<div id="<?php print $section['id']; ?>" class="title-gallery <?php print $section['class']; ?>" <?php print $section['style']; ?> <?php print $section['attr']; ?>>
	<h2 class="title"><?php print $section['title']; ?></h2>
	<div class="title-gallery-container">
<?php print $section['content']; ?>
	</div>
</div>
