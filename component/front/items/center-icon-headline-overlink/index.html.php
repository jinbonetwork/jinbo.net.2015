<?php importResource("app-feature-align"); ?>
<article class="center-icon-headline-overlink featured featured-align component <?php print $classes; ?>" style="<?php print $style; ?>" data-align="center middle">
	<div class="feature">
		<div class="inner">
			<div class="header">
<?php		if($data['media']['url']) {?>
				<div class="icon">
					<a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print Items::getMedia($data['media']['url'],array('alt'=>$data['subject'])); ?></a>
				</div>
<?php		}?>
				<h3><a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print $data['subject']; ?></a></h3>
			</div>
			<div class="overlink">
<?php		if($data['description']) {?>
				<p><a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print $data['description']; ?></a></p>
<?php		}?>
				<div class="link">
					<ul>
<?php				if($data['url']) {?>
						<li class="link1" data-label="<?php print $data['url']['label']; ?>"><a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print $data['url']['label']; ?></a></li>
<?php				}
					if($data['url2']) {?>
						<li class="link2" data-label="<?php print $data['url2']['label']; ?>"><a href="<?php print $data['url2']['href']; ?>" target="<?php print $data['url2']['target']; ?>"><?php print $data['url2']['label']; ?></a></li>
<?php				}?>
					</ul>
				</div>
			</div>
		</div>
	</div>
</article>
