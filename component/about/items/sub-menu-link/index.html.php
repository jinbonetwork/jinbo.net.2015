<?php
importResource("app-overlay-link",true);
?>
<article class="sub-menu-link component  <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="sub-menu-link-container link">
		<ul>
<?php foreach($data['data'] as $k => $links) {
		if($links['url']) {?>
			<li class="link<?php print ($k+1); ?>"><a href="<?php print url($links['url']['href']); ?>" target="<?php print $links['url']['target']; ?>"><?php print $links['url']['label']; ?></a></li>
<?php	} else {?>
			<li class="link<?php print ($k+1); ?> overlay-link">
				<a href="javascript://" class="overlay-button"><?php print $links['subject']; ?></a>
				<div class="overlay-content">
					<div>
						<i class="icon-close close"></i>
						<div class="content-style-overlay">
							<h3><?php print $links['subject']; ?></h3>
							<?php print $links['description']; ?>
						</div>
						<div class="close-box"><button class="close">닫기</button></div>
					</div>
				</div>
			</li>
<?php	}
	}?>
		</ul>
	</div>
</article>
