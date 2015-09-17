<article class="article-gallery component <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="article-gallery-wrapper">
		<ul class="article-gallery-container">
<?php	for($i=0; $i<@count($data['data']); $i++) {?>
			<li class="article-gallery-article">
				<div class="article-gallery-article-content">
					<h4><?php print $data['data'][$i]['subject']; ?></h4>
					<div class="alternative">
						<div class="description">
							<?php print $data['data'][$i]['description']; ?>
						</div>
						<div class="over-link">
							<div class="link">
								<ul>
									<li><a href="<?php print $data['data'][$i]['url']['href']; ?>" target="<?php print $data['data'][$i]['url']['target']; ?>"><?php print $data['data'][$i]['url']['label']; ?></a></li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</li>
<?php	}?>
		</ul>
	</div>
</article>
