<article class="inputset-user-agreement hide-when-user <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="private-agreement">
		<div class="check-wrap">
			<div class="checkbox">
				<input type="checkbox" id="agree-private" name="agreePrivate" value="agree-private">
				<label for="agree-private" class="checkbox-check" style="display: none;"><i class="fa fa-check-square-o"></i></label>
				<label for="agree-private" class="checkbox-uncheck"><i class="fa fa-square-o"></i></label>
			</div>
			<label for="agree-private" class="label">개인정보 보호정책 및 이용 동의</label>
		</div>
		<div class="agreement"><?php require_once('private_agree.html');?></div>
	</div>
	<div class="service-agreement">
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
