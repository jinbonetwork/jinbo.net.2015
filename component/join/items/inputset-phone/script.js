(function($){
	function $ip(selector, $obj){
		if($obj){
			return $obj.closest('.inputset-phone').find(selector);
		} else {
			return $('.inputset-phone').find(selector);
		}
	}
	$(document).ready(function(){
		//체크박스
		$ip('input[type="checkbox"]').change(function(){
			if($(this).prop('checked')){
				$(this).closest('.checkbox').find('.checkbox-check').show();
				$(this).closest('.checkbox').find('.checkbox-uncheck').hide();
			} else {
				$(this).closest('.checkbox').find('.checkbox-check').hide();
				$(this).closest('.checkbox').find('.checkbox-uncheck').show();
			}
		}).focus(function(){
			$(this).parent().next('.label').addClass('focused');
		}).blur(function(){
			$(this).parent().next('.label').removeClass('focused');
		});
		//데이터 유효성 검사
		$ip('input[type="text"][name="phone"]').blur(function(){
			$(this).removeClass('focused');
			$ip('.head', $(this)).removeClass('focused');
		}).focus(function(){
			$(this).addClass('focused');
			$ip('.head', $(this)).addClass('focused');
		});
	});
})(jQuery);
