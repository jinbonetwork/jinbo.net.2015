(function($){
	$(document).ready(function(){
		$('input[type="text"]').keydown(function(event){
			if(event.which == 13) event.preventDefault();
		});
		$('input').focus(function(){
			var offset = $(this).parents('article').offset();
			var menuHeight = 55;
			if($(document).scrollTop() > offset.top - menuHeight) $(document).scrollTop(offset.top - menuHeight);
		});
		$ist('input[type="radio"]').change(function(e) {
			if($(this).val() === 'user_id') {
				$('.loginbyaccount').addClass('hidden');
				$('.loginbyid').removeClass('hidden');
			} else {
				$('.loginbyid').addClass('hidden');
				$('.loginbyaccount').removeClass('hidden');
			}
		});
	});

	function $ist(selector, $obj){
		if($obj) return $obj.closest('.inputset-signin-type').find(selector);
		else return $('.inputset-signin-type').find(selector);
	}
})(jQuery);
