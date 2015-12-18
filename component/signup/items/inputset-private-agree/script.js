(function($){
	function $iua(selector, $obj){
		if($obj) return $obj.closest('.inputset-private-agree').find(selector);
		else return $('.inputset-private-agree').find(selector);
	}
	$(document).ready(function(){
		$iua('input[type="checkbox"]').change(function(){
			if($(this).prop('checked')){
				$(this).closest('.checkbox').find('.checkbox-check').show();
				$(this).closest('.checkbox').find('.checkbox-uncheck').hide();
			} else {
				$(this).closest('.checkbox').find('.checkbox-check').hide();
				$(this).closest('.checkbox').find('.checkbox-uncheck').show();
			}
		}).focus(function(){
			$(this).parent().next('.label').addClass('focused');
		}).blur(function(){
			$(this).parent().next('.label').removeClass('focused');
		});
	});
})(jQuery);
