<article class="inputset-cms-agreement <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="check-wrap">
		<div class="checkbox">
			<input type="checkbox" id="agree-cms" name="agreeCms" value="agree-cms">
			<label for="agree-cms" class="checkbox-check" style="display: none;"><i class="fa fa-check-square-o"></i></label>
			<label for="agree-cms" class="checkbox-uncheck"><i class="fa fa-square-o"></i></label>
		</div>
		<label for="agree-cms" class="label">CMS 출금이체 약관 동의</label>
	</div>
	<div class="agreement"><?php require_once('cms_agree.html');?></div>
</article>
