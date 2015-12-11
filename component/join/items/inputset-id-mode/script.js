(function($){
	function $iim(selector, $obj){
		if($obj){
			return $obj.closest('.inputset-id-mode').find(selector);
		} else {
			return $('.inputset-id-mode').find(selector);
		}
	}
	$(document).ready(function(){
		$iim('input[type="radio"]').focus(function(){
			$(this).siblings('.radio-button').addClass('focused');
		}).blur(function(){
			$(this).siblings('.radio-button').removeClass('focused');
		}).change(function(){
			$iim('.radio-button').removeClass('checked');
			$(this).siblings('.radio-button').addClass('checked');
		});
	});
})(jQuery);
