<article class="relative-org component <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="relative-org-wrapper">
		<div class="left">
			<div class="wrapper">
				<ul class="org cell">
<?php			for($i=0; $i<@count($data['data'][0]['data']); $i++) {?>
					<li>
						<a href="<?php print $data['data'][0]['data'][$i]['href']; ?>" target="<?php print $data['data'][0]['data'][$i]['target']; ?>"><?php print $data['data'][0]['data'][$i]['label']; ?></a>
					</li>
<?php			}?>
				</ul>
				<div class="brackets cell"><img src="<?php print url("resources/images/bracket.png"); ?>" class="bracket"><img src="<?php print url("resources/images/bracket2.png"); ?>" class="bracket2"></div>
				<div class="label cell">
					<h4><?php print $data['data'][0]['subject']; ?></h4>
				</div>
			</div>
		</div>
		<div class="center">
			<p class="icon">
				<i class="j-logos-jinbonet"></i>
			</p>
			<p>
				진보네트워크센터
			</p>
		</div>
		<div class="right">
			<div class="wrapper">
				<div class="label cell">
					<h4><?php print $data['data'][1]['subject']; ?></h4>
				</div>
				<div class="brackets cell"><img src="<?php print url("resources/images/bracket.png"); ?>" class="bracket"><img src="<?php print url("resources/images/bracket2.png"); ?>" class="bracket2"></div>
				<ul class="org cell">
<?php			for($i=0; $i<@count($data['data'][1]['data']); $i++) {?>
					<li>
						<a href="<?php print $data['data'][1]['data'][$i]['href']; ?>" target="<?php print $data['data'][1]['data'][$i]['target']; ?>"><?php print $data['data'][1]['data'][$i]['label']; ?></a>
					</li>
<?php			}?>
				</ul>
			</div>
		</div>
	</div>
</article>
