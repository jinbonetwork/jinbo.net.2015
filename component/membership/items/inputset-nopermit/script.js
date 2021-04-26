(function($){
	function $inp(selector, $obj){
		if(selector && $obj)
			return $obj.closest('.inputset-nopermit').find(selector);
		else if(selector)
			return $('.inputset-nopermit').find(selector);
		else
			return $('.inputset-nopermit');
	}
	$(document).ready(function(){
		$inp('button[name="back-to-home"]').click(function(){
			$(location).attr('href', $(this).attr('data-href'));
		});
	});
})(jQuery);
