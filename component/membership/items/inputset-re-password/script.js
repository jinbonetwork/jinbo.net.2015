(function($){
	function $irp(selector, $obj){
		if($obj)
			return $obj.closest('.inputset-re-password').find(selector);
		else
			return $('.inputset-re-password').find(selector);
	}
	$(document).ready(function(){
		$irp('input[type="password"][name="repw"]').blur(function(){
			$(this).removeClass('focused');
			$irp('.head', $(this)).removeClass('focused');
		}).focus(function(){
			$(this).addClass('focused');
			$irp('.head', $(this)).addClass('focused');
		});
	});
})(jQuery);
