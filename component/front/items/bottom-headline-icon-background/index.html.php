<?php
importResource("app-feature-align");
?>
<a class="bottom-headline-icon-background component" href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>" class="<?php print $classes; ?>" style="<?php print $style; ?><?php if($data['background']['color']) print ' background-color: '.$data['background']['color']; ?>">
	<div class="header">
		<h3><?php print $data['subject']; ?></h3>
<?php if($data['description']) {?>
		<p><?php print $data['description']; ?></p>
<?php }?>
	</div>
	<div class="featured featured-align" data-align="<?php print $data['media']['align']; ?>">
<?php if($data['media']) {
		print Items::getMedia($data['media']['url'],array('alt'=>$data['subject']));
	}?>
		<div class="overlay"></div>
	</div>
<?php if($data['background']['url']) {?>
	<div class="background" style="background-image: url(<?php print $data['background']['url']; ?>); background-repeat: <?php print ($data['background']['repeat'] ? $data['background']['repeat'] : 'no-repeat'); ?>; background-position: <?php print $data['background']['position']; ?>"></div>
<?php }?>
</a>
