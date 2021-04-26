<article class="inputset-donate-once <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="top-background"></div>
	<div class="article-wrap">
		<div class="content">
			<?php
				$browser = new Browser();
				$url = 'socialfunch.org/jinbonetwork/donate/jinbonet';
				$url = 'https://'.($browser->isMobile() ? 'm.'.$url : 'www.'.$url);
			?>
			<iframe src="<?php echo $url; ?>" width="100%" frameborder="no" scrolling="no"></iframe>
		</div>
	</div>
</article>
