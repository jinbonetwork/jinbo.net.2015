(function($){
	$(document).ready(function(){
		$('#site-header, #site-main-container, #site-footer').hide();
		$('.app-edit-front').editPage();
	});
})(jQuery);

(function($){
	$.fn.editPage = function(){
		console.log('test');
	}
})(jQuery);
