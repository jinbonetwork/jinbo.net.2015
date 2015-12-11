(function($){
	function $iq(selector, $obj){
		if($obj){
			return $obj.closest('.inputset-question').find(selector);
		} else {
			return $('.inputset-question').find(selector);
		}
	}
	$(document).ready(function(){
		$iq('input[type="text"][name="question"]').blur(function(){
			$(this).removeClass('focused');
			$iq('.head', $(this)).removeClass('focused');
		}).focus(function(){
			$(this).addClass('focused');
			$iq('.head', $(this)).addClass('focused');
		});
	});
})(jQuery);
