<article class="map component  <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="map-container">
		<div class="featured">
<?php	if($data['media']['ie'] && $browser->getBrowser() == Browser::BROWSER_IE && $browser->getVersion() <= 9) {
			print Items::getMedia($data['media']['ie'],array('alt'=>$data['subject']));
		} else {
			print Items::getMedia($data['media']['url'],array('alt'=>$data['subject']));
		}?>
		</div>
		<div class="content">
			<div class="inner-container">
				<h2><?php print $data['subject']; ?></h2>
				<p class="address"><?php print $data['description']; ?></p>
				<dl class="public-transport">
<?php			for($i=0; $i<@count($data['data']); $i++) {?>
					<dt><?php print $data['data'][$i]['subject']; ?></dt>
					<dd><?php print $data['data'][$i]['description']; ?></dd>
<?php			}?>
				</dl>
				<div class="map-link">
					<div class="link">
						<ul>
<?php					if($data["link"]) {?>
							<li class="link1"><a href="<?php print $data['link']['href']; ?>" target="<?php print $data['link']['target']; ?>"><?php print $data['link']['label']; ?></a></li>
<?php					}
						if($data['link2']) {?>
							<li class="link2"><a href="<?php print $data['link2']['href']; ?>" target="<?php print $data['link2']['target']; ?>"><?php print $data['link2']['label']; ?></a></li>
<?php					}?>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</article>
