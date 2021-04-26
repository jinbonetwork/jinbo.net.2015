<article class="inputset-complete hidden <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="content">
		<h1>후원 회원 정보 수정이 완료되었습니다.</h1>
		<p>회비는 매달 <span class="strong">25일</span> 출금되며, 미납시 다음 달 <span class="strong">10일</span>에 재출금됩니다.</p>
		<p>자본과 국가 권력에 맞서는 네트워크로, 사회 운동과 개인들의 소통과 연대의 끈을 이어가겠습니다.</p>
		<p>감사합니다.</p>
		<button type="button" name="back-to-home" data-href="<?php echo JFE_URI; ?>">홈으로</button>
		<button type="button" name="view-cms-license">CMS 출금이체 신청서 보기</button>
	</div>
	<div class="cms-license hidden">
		<div>
			<button type="button" name="download">다운로드</button>
			<button type="button" name="close">닫기</button>
		</div>
		<div id="license-img" data-src="<?php echo JFE_RESOURCE_URI.'/cms_license'; ?>"></div>
	</div>
</article>
