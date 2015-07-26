<?php
importResource("app-feature-align");
?>
<article class="bottom-headline-icon-background component" class="<?php print $classes; ?>" style="<?php print $style; ?><?php if($data['background']['color']) print ' background-color: '.$data['background']['color']; ?>">
	<div class="header">
		<h3><a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print $data['subject']; ?></a></h3>
<?php if($data['description']) {?>
		<p><a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print $data['description']; ?></a></p>
<?php }?>
	</div>
	<div class="featured featured-align" data-align="<?php print $data['media']['align']; ?>">
<?php if($data['media']) {?>
		<a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print Items::getMedia($data['media']['url'],array('alt'=>$data['subject'])); ?></a>
<?php }?>
		<div class="overlay"></div>
	</div>
<?php if($data['background']['url']) {?>
	<div class="background" style="background-image: url(<?php print $data['background']['url']; ?>); background-repeat: <?php print ($data['background']['repeat'] ? $data['background']['repeat'] : 'no-repeat'); ?>; background-position: <?php print $data['background']['position']; ?>"></div>
<?php }?>
</article>
