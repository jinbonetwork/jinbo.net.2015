<article class="year-calendar component <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="year-calendar-wrapper">
		<h3><?php print $data['subject']; ?></h3>
		<ul class="year-calendar-container">
<?php	for($i=0; $i<@count($data['data']); $i++) {?>
			<li class="year-calendar-article">
				<div class="year-calendar-article-content">
					<a href="<?php print $data['data'][$i]['url']['href']; ?>" target="<?php print $data['data'][$i]['url']['target']; ?>"><?php print $data['data'][$i]['url']['label']; ?></a>
				</div>
			</li>
<?php	}?>
	</div>
</article>
