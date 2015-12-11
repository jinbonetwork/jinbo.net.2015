(function($){
	function $irn(selector, $obj){
		if($obj){
			return $obj.closest('.inputset-regist-number').find(selector);
		} else {
			return $('.inputset-regist-number').find(selector);
		}
	}
	$(document).ready(function(){
		$irn('input[type="text"][name="registnum"]').blur(function(){
			$(this).removeClass('focused');
			$irn('.head', $(this)).removeClass('focused');
		}).focus(function(){
			$(this).addClass('focused');
			$irn('.head', $(this)).addClass('focused');
		});
	});
})(jQuery);
