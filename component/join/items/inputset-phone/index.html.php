<article class="inputset-phone <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="title">
		<h3 class="head">전화번호</h3>
		<div class="check-wrap">
			<div class="checkbox">
				<input type="checkbox" id="agree-sms" name="agreeSms" value="agree-sms">
				<label for="agree-sms" class="checkbox-check" style="display: none;"><i class="fa fa-check-square-o"></i></label>
				<label for="agree-sms" class="checkbox-uncheck"><i class="fa fa-square-o"></i></label>
			</div>
			<label for="agree-sms" class="label">SMS로 소식 받기</label>
		</div>
		<span class="error-message"></span>
	</div>
	<div class="content">
		<div class="input-with-placeholder">
			<span class="placeholder">예) 02-345-2632</span>
			<input type="text" class="required" name="phone">
		</div>
	</div>
</article>
