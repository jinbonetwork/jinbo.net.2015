<article class="inputset-complete hidden <?php print $classes; ?>" style="<?php print $style; ?>">
	<div class="content">
		<h1>후원 회원 신청이 완료되었습니다.</h1>
		<p>회비는 매달 <span class="strong">25일</span> 출금되며, 미납시 다음 달 <span class="strong">10일</span>에 재출금됩니다.</p>
		<p>스팸 방지를 위해 수동으로 작업하고 있어서 회원 등록 완료까지 잠시 시간이 걸리지만(최대 2일 소요) 급하신 분들은 전화를 주시면 바로 처리해 드립니다(<span class="strong">02-774-4551</span>).</p>
		<p>등록하신 메일로 안내 메일을 보내드립니다. <span class="strong">안내 메일</span>에 따라서 호스팅, 메일링리스트 등을 신청해 주세요.</p>
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
