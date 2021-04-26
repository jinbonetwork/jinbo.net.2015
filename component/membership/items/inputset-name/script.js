(function($){
	function $in(selector, $obj){
		if($obj){
			return $obj.closest('.inputset-name').find(selector);
		} else {
			return $('.inputset-name').find(selector);
		}
	}

	$(document).ready(function(){
		$in('input[type="text"][name="name"]').blur(function(){
			$(this).removeClass('focused');
			$in('.head', $(this)).removeClass('focused');
		}).focus(function(){
			$(this).addClass('focused');
			$in('.head', $(this)).addClass('focused');
		});
	});
})(jQuery);
