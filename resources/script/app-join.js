(function($){
	$(document).ready(function(){
		$('input[type="text"]').keydown(function(event){
			if(event.which == 13) event.preventDefault();
		});
	});
})(jQuery);
