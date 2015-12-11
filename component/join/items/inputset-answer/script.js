(function($){
	function $ia(selector, $obj){
		if($obj){
			return $obj.closest('.inputset-answer').find(selector);
		} else {
			return $('.inputset-answer').find(selector);
		}
	}
	$(document).ready(function(){
		$ia('input[type="text"][name="answer"]').blur(function(){
			$(this).removeClass('focused');
			$ia('.head', $(this)).removeClass('focused');
		}).focus(function(){
			$(this).addClass('focused');
			$ia('.head', $(this)).addClass('focused');
		});
	});
})(jQuery);
