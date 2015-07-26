<article class="sub-menu-link component  <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="sub-menu-link-container link">
		<ul>
<?php	foreach($data['data'] as $k => $links) {?>
			<li class="link<?php print ($k+1); ?>"><a href="<?php print url($links['url']['href']); ?>" target="<?php print $links['url']['target']; ?>"><?php print $links['url']['label']; ?></a></li>
<?php	}?>
		</ul>
	</div>
</article>
