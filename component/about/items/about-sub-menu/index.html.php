<?php
importResource("app-overlay-link",true);
?>
<article class="about-sub-menu component  <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="about-sub-menu-container link">
		<ul>
			<li class="link1 overlay-link url">
				<a href="<?php print url("about/purpose"); ?>" class="overlay-button" target=".component.about-purpose-content" data-subject="설립 목적과 취지">설립목적과 취지</a>
			</li>
			<li class="link2 overlay-link url">
				<a href="<?php print url("about/articles"); ?>" class="overlay-button" target=".component.about-articles-content" data-subject="진보네트워크센터 정관">정관</a>
			</li>
			<li class="link3 overlay-link url">
				<a href="<?php print url("about/meeting"); ?>" class="overlay-button" target=".component.about-meeting-content" data-subject="진보네트워크센터 총회" data-max-width="95%" data-defendency-component="<?php print url('component/about/items/article-gallery'); ?>" data-callback="jQuery('.overlay-content ul.article-gallery-container').article_gallery_resize();">총회</a></li>
			<li class="link4 overlay-link url">
				<a href="<?php print url("about/board"); ?>" class="overlay-button" target=".column.about-board-content" data-subject="진보네트워크센터 임원들" data-defendency-component="<?php print url('component/about/items/dl-component'); ?>">임원들</a>
			</li>
			<li class="link5"><a href="<?php print url("join"); ?>" target="_self">후원회원 되기</a></li>
		</ul>
	</div>
</article>
