<?php
importResource("app-triangle",true);
?>
<article class="topleft-head-link-right-featured-diagonal-bg component triangle inner-after <?php print $classes; ?>" style="<?php print $style; ?>" data-triangle-inner-after-ratio="0.067" data-triangle-inner-after-shape="bottom-right">
	<div class="header">
		<div class="description"><?php print $data['description']; ?></div>
		<h1 class="subject"><?php print $data['subject']; ?></h1>
		<?php print Component::get("about/items/about-top-menu",array(),0); ?>
	</div>
<?php if($data['media']['url']) {?>
	<div class="featured">
		<div class="featured-inner">
			<?php print Items::getMedia($data['media']['url'],array('alt'=>$data['subject'])); ?>
		</div>
	</div>
<?php }?>
	<div class="background">
		<div class="inner triangle outer-before" data-triangle-outer-before-ratio="0.067" data-triangle-outer-before-shape="bottom-right">
		</div>
	</div>
</article>
