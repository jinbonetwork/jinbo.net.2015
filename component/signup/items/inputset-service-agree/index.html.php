<article class="inputset-service-agree <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="title"></div>
	<div class="content">
		<div class="check-wrap">
			<div class="checkbox">
				<input type="checkbox" id="agree-service" name="agreeService" value="agree-service">
				<label for="agree-service" class="checkbox-check" style="display: none;"><i class="fa fa-check-square-o"></i></label>
				<label for="agree-service" class="checkbox-uncheck"><i class="fa fa-square-o"></i></label>
			</div>
			<label for="agree-service" class="label">웹서비스 이용약관 동의</label>
		</div>
		<div class="agreement"><?php require_once('service_agree.html');?></div>
	</div>
</article>
