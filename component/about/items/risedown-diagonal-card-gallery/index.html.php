<?php importResource("app-triangle"); ?>
<article class="risedown-diagonal-card-gallery component triangle outer-before outer-after <?php print $classes; ?>" style="<?php print $style; ?>" data-triangle-outer-before-ratio="0.20" data-triangle-outer-before-shape="bottom-right" data-triangle-outer-after-ratio="0.12" data-triangle-outer-after-shape="top-right">
	<div class="header">
		<h3 class="subject"><?php print $data['subject']; ?></h3>
		<h4 class="subtitle"><?php print $data['subtitle']; ?></h4>
		<p class="description"><?php print $data['description']; ?></p>
<?php if($data['url'] || $data['url2']) {?>
		<ul class="url">
<?php	if($data['url']['href']) {?>
			<li class="<?php print $data['url']['class']; ?>"><a href="<?php print $data['url']['href']; ?>" target="<?php print $data['url']['target']; ?>"><?php print $data['url']['label']; ?></a></li>
<?php	}
		if($data['url2']['href']) {?>
			<li class="<?php print $data['url2']['class']; ?>"><a href="<?php print $data['url2']['href']; ?>" target="<?php print $data['url2']['target']; ?>"><?php print $data['url2']['label']; ?></a></li>
<?php	}?>
		</ul>
<?php }?>
	</div>
	<div class="gallery">
		<ul>
<?php	for($i=0; $i<@count($data['data']); $i++) {?>
			<li class="featured gallery<?php print ($i+1); if($data['data'][$i]['class']) print ' '.$data['data'][$i]['class']; ?>">
<?php		if($data['data'][$i]['media']['url']) {?>
				<div class="featured-inner triangle inner-before inner-after" data-triangle-inner-before-ratio="0.10" data-triangle-inner-before-shape="top-right" data-triangle-inner-after-ratio="0.10" data-triangle-inner-after-shape="bottom-left">
<?php				print Items::getMedia($data['data'][$i]['media']['url'],array('alt'=>$data['data'][$i]['subject'])); ?>
					<div class="overlay"></div>
				</div>
<?php		}
			if(count($data['data'][$i]['sns']) > 0) {?>
				<div class="sns">
<?php			foreach($data['data'][$i]['sns'] as $sns => $url) {?>
					<a href="<?php print $url; ?>" target="_blank" class="<?php print $sns; ?>" title="<?php print $data['data'][$i]['subject'].' '.$sns; ?>"><span><?php print $sns; ?></span></a>
<?php			}?>
				</div>
<?php		}?>
				<div class="meta">
					<h5 class="name"><?php print $data['data'][$i]['subject']; ?></h5>
					<p class="role"><?php print $data['data'][$i]['description']; ?></p>
				</div>
			</li>
<?php	}?>
		</ul>
	</div>
</article>
