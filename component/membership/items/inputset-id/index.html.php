<article class="inputset-id <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="title">
		<h3 class="head">아이디</h3>
		<span class="error-message"></span>
	</div>
	<div class="content">
		<div class="input-with-placeholder">
			<span class="placeholder">영문 4~40자(한글2~20자)</span>
			<input type="text" class="required hide-when-loggedin" name="id">
		</div>
		<input type="text" class="font-black show-when-loggedin" name="userId" style="display: none;" readonly>
		<p class="font-black show-when-loggedin hide-when-loggedin-member" style="display: none;">로그인중이십니다.</p>
		<p class="font-black show-when-loggedin-member" style="display: none;">이미 후원회원이세요.</p>
	</div>
</article>
