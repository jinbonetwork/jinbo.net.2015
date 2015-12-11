<article class="inputset-address <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="title">
		<h3 class="head">우편물 수령지</h3>
		<p class="comment">(필수아님)</p>
	</div>
	<div class="content">
		<div class="zip-wrap">
			<input type="text" name="zip">
			<button type="button" name="zip-search">
				<span class="border"></span>
				<span class="background"></span>
				<span class="label font-black">우편번호 검색</span>
			</button>
		</div>
		<div class="address-wrap">
			<textarea name="address"></textarea>
		</div>
	</div>
	<div class="zip-search-wrap">
		<div class="keyword-search-wrap">
			<button type="button" name="keyword-search">
				<span class="label font-black">검색</span>
				<span class="background"></span>
			</button>
		</div>
		<div class="zip-keyword-wrap">
			<div class="input-with-placeholder">
				<span class="placeholder">예) 도움5로 19, 어진동 307-9</span>
				<input type="text" name="zipKeyword">
			</div>
		</div>
		<ul class="address-list"></ul>
	</div>
</article>
