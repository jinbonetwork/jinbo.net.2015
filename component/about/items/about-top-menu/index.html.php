<?php
importResource("app-overlay-link",true);
?>
<article class="about-top-menu component  <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="about-top-menu-container link">
		<ul>
			<li class="link1 overlay-link url">
				<a href="<?php print url("about/history"); ?>" class="overlay-button" target=".column.about-history-content" data-subject="진보넷이 걸어온 길" data-max-width="95%" data-defendency-component="<?php print url('component/about/items/year-calendar'); ?>" data-callback="jQuery('.overlay-content .iframe.component').height(jQuery('.overlay-content .iframe.component').width() * 0.778); jQuery('.overlay-content ul.year-calendar-container').year_calendar_resize();">진보넷이 걸어온 길</a>
			</li>
		</ul>
	</div>
</article>
