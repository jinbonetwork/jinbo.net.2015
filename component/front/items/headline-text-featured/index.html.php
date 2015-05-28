<article class="headline-text-featured component <?php print (is_array($data['class']) ? implode(" ",$data['class']) : ''); ?>">
	<div class="header">
		<h3><a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print $data['subject']; ?></a></h3>
<?php if($data['description']) {?>
		<p><a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print $data['description']; ?></a></p>
<?php }?>
	</div>
	<div class="featured">
<?php if($data['media']) {?>
		<div class="halftone"></div>
		<img src="<?php print $data['media']['url']; ?>" alt="<?php print htmlspecialchars($data['subject']); ?>">
<?php }?>
	</div>
	<div class="link">
		<ul>
<?php	if($data['url']) {?>
			<li><a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print $data['url']['label']; ?></a></li>
<?php	}
		if($data['url2']) {?>
			<li><a href="<?php print $data['url2']['href']; ?>" target="<?php print $data['url2']['target']; ?>"><?php print $data['url2']['label']; ?></a></li>
<?php	}?>
		</ul>
	</div>
</article>
