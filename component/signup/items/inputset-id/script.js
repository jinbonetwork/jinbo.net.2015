(function($){
	function $ii(selector, $obj){
		if(selector && $obj) return $obj.closest('.inputset-id').find(selector);
		else if(selector) return $('.inputset-id').find(selector);
		else return $('.inputset-id');
	}
	$(document).ready(function(){
		$ii('input[name="id"]').blur(function(){
			var event = $.Event('fill-in-id');
			event.id = $(this).val();
			$(document).trigger(event);
		});
	});
})(jQuery);
