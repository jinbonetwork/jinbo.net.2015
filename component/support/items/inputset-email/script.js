(function($){
	function $ie(selector, $obj){
		if($obj){
			return $obj.closest('.inputset-email').find(selector);
		} else {
			return $('.inputset-email').find(selector);
		}
	}
	$(document).ready(function(){
		//데이터 유효성 검사
		$ie('input[type="text"][name="email"]').blur(function(){
			$(this).removeClass('focused');
			$ie('.head', $(this)).removeClass('focused');
		}).focus(function(){
			$(this).addClass('focused');
			$ie('.head', $(this)).addClass('focused');
		});
	});
})(jQuery);
