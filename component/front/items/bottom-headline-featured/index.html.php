<?php
importResource("app-feature-align");
?>
<article class="bottom-headline-featured component" class="<?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="header">
		<div class="header-wrap">
			<div class="header-inner">
				<h3><a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print $data['subject']; ?></a></h3>
<?php		if($data['description']) {?>
				<p><a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print $data['description']; ?></a></p>
<?php		}?>
			</div>
		</div>
	</div>
	<div class="featured featured-align" data-align="<?php print $data['media']['align']; ?>">
<?php if($data['media']) {
		print Items::getMedia($data['media']['url'],array('alt'=>$data['subject']));
	}?>
		<div class="overlay"></div>
	</div>
</article>
