(function($){
	function $imt(selector){
		return $('.inputset-member-type').find(selector);
	}
	$(document).ready(function(){
		$imt('input[type="radio"]').change(function(){
			$imt('.radio-button .inner').removeClass('focused');
			$(this).siblings('.radio-button').find('.inner').addClass('focused');
			$imt('.radio-label').removeClass('focused');
			$(this).siblings('.radio-label').addClass('focused');
		}).focus(function(){
			$(this).siblings('.radio-button').addClass('focused');
		}).blur(function(){
			$(this).siblings('.radio-button').removeClass('focused');
		});
	});
})(jQuery);
