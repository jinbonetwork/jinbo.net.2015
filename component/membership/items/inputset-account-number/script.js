(function($){
	function $ian(selector, $obj){
		if($obj)
			return $obj.closest('.inputset-account-number').find(selector);
		else
			return $('.inputset-account-number').find(selector);
	}
	$(document).ready(function(){
		$ian('input[type="text"][name="acctnum"]').blur(function(){
			$(this).removeClass('focused');
			$ian('.head', $(this)).removeClass('focused');
		}).focus(function(){
			$(this).addClass('focused');
			$ian('.head', $(this)).addClass('focused');
		});
	});
})(jQuery);
