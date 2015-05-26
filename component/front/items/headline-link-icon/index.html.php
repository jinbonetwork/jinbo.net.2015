<?php importResource("app-feature-align"); ?>
<article class="headline-link-icon" class="<?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="header">
		<h3><a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print $data['subject']; ?></a></h3>
<?php if($data['description']) {?>
		<p><a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print $data['description']; ?></a></p>
<?php }?>
	</div>
	<div class="link">
		<ul>
<?php	if($data['url']) {?>
			<li class="link1"><a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print $data['url']['label']; ?></a></li>
<?php	}
		if($data['url2']) {?>
			<li class="link2"><a href="<?php print $data['url2']['href']; ?>" target="<?php print $data['url2']['target']; ?>"><?php print $data['url2']['label']; ?></a></li>
<?php	}?>
		</ul>
	</div>
	<div class="featured featured-align" data-align="<?php print $data['media']['align']; ?>">
<?php if($data['media']) {?>
		<a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print Items::getMedia($data['media']['url'],array('alt'=>$data['subject'])); ?></a>
<?php }?>
	</div>
</article>
