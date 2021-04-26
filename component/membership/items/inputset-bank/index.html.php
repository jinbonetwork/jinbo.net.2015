<article class="inputset-bank <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="title">
		<h3 class="head">거래은행</h3>
		<span class="error-message"></span>
	</div>
	<div class="content">
		<div class="input-with-placeholder">
			<span class="placeholder"></span>
			<input type="text" class="required" name="bank">
			<input type="hidden" name="bankCode" value="">
		</div>
		<ul class="bank-list">
		</ul>
	</div>
</article>
