(function($){
	function $ii(selector, $obj){
		if($obj)
			return $obj.closest('.inputset-id').find(selector);
		else
			return $('.inputset-id').find(selector);
	}
	$(document).ready(function(){
		$ii('input[type="text"][name="id"]').blur(function(){
			$(this).removeClass('focused');
			$ii('.head', $(this)).removeClass('focused');
			if($('input[type="radio"][name="idMode"]:checked').val() === 'old') return;
		}).focus(function(){
			$(this).addClass('focused');
			$ii('.head', $(this)).addClass('focused');
		});
	});
})(jQuery);
