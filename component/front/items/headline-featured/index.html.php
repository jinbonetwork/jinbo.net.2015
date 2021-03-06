<?php importResource("app-feature-align"); ?>
<a class="headline-featured component" href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>" class="<?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="header">
		<h3><?php print $data['subject']; ?></h3>
<?php if($data['description']) {?>
		<p><?php print $data['description']; ?></p>
<?php }?>
	</div>
	<div class="featured featured-align auto-size" data-align="<?php print $data['media']['align']; ?>">
<?php if($data['media']) {
		print Items::getMedia($data['media']['url'],array('alt'=>$data['subject']));
	}?>
	</div>
</a>
