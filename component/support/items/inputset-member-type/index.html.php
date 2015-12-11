<article class="inputset-member-type <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="radio-row">
		<div class="radio-col">
			<input type="radio" id="member-type-0" name="memberType" value="개인회원" checked>
			<label for="member-type-0" class="radio-button"><i class="inner focused"></i></label>
			<label for="member-type-0" class="radio-label font-black focused">개인회원</label>
		</div>
		<div class="radio-col">
			<input type="radio" id="member-type-1" name="memberType" value="단체회원">
			<label for="member-type-1" class="radio-button"><i class="inner"></i></label>
			<label for="member-type-1" class="radio-label font-black">단체회원</label>
		</div>
	</div>
	<p><?php echo $data['comment']; ?></p>
</article>
