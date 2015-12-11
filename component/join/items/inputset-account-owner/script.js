(function($){
	function $iao(selector, $obj){
		if($obj)
			return $obj.closest('.inputset-account-owner').find(selector);
		else
			return $('.inputset-account-owner').find(selector);
	}
	$(document).ready(function(){
		$iao('input[type="text"][name="acctowner"]').blur(function(){
			$(this).removeClass('focused');
			$iao('.head', $(this)).removeClass('focused');
		}).focus(function(){
			$(this).addClass('focused');
			$iao('.head', $(this)).addClass('focused');
		});
	});
})(jQuery);
