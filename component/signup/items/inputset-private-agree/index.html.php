<article class="inputset-private-agree <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="title"></div>
	<div class="content">
		<div class="check-wrap">
			<div class="checkbox">
				<input type="checkbox" id="agree-private" name="agreePrivate" value="agree-private">
				<label for="agree-private" class="checkbox-check" style="display:none;"><i class="fa fa-check-square-o"></i></label>
				<label for="agree-private" class="checkbox-uncheck"><i class="fa fa-square-o"></i></label>
			</div>
			<label for="agree-private" class="label">개인정보 보호정책 및 이용 동의</label>
		</div>
		<div class="agreement"><?php require_once('private_agree.html');?></div>
	</div>
</article>
