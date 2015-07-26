<?php
importResource("app-triangle",true);
?>
<article class="center-card component <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="header">
		<h3 class="subject"><?php print $data['subject']; ?></h3>
		<p class="description"><?php print $data['description']; ?></p>
	</div>
	<div class="gallery">
		<ul>
<?php	for($i=0; $i<@count($data['data']); $i++) {?>
			<li class="featured">
<?php		if($data['data'][$i]['media']['url']) {
				print Items::getMedia($data['data'][$i]['media']['url'],array('alt'=>$data['data'][$i]['subject']));
		}?>
			</li>
<?php	}?>
		</ul>
	</div>
	<div class="background">
		<div class="inner triangle outer-before" data-triangle-outer-before-ratio="0.20" data-triangle-outer-before-shape="top">
		</div>
	</div>
</article>
