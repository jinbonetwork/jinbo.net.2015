<?php
importResource("app-feature-align");
?>
<div class="top-headline-halftone-featured-link component" href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>" class="<?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="header">
		<h3><?php print $data['subject']; ?></h3>
<?php if($data['description']) {?>
		<p><?php print $data['description']; ?></p>
<?php }?>
	</div>
	<div class="link">
		<ul>
<?php	if($data['url']) {?>
			<li class="link1" data-label="<?php print $data['url']['label']; ?>"><a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print $data['url']['label']; ?></a></li>
<?php	}   
		if($data['url2']) {?>
			<li class="link2" data-label="<?php print $data['url2']['label']; ?>"><a href="<?php print $data['url2']['href']; ?>" target="<?php print $data['url2']['target']; ?>"><?php print $data['url2']['label']; ?></a></li>
<?php	}?>
		</ul>
	</div>
	<div class="featured">
<?php if($data['media']) {?>
		<div class="featured-align" data-align="<?php print $data['media']['align']; ?>">
			<?php print Items::getMedia($data['media']['url'],array('alt'=>$data['subject'])); ?>
		</div>
<?php }?>
		<div class="halftone"></div>
	</div>
</div>
