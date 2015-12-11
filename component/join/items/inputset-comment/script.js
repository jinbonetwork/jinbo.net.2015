(function($){
	function $ic(selector){
		return $('.inputset-comment').find(selector);
	}
	function $tic($obj, selector){
		return $obj.closest('.inputset-comment').find(selector);
	}
	$(document).ready(function(){
		$ic('textarea[name="comment"]').focus(function(){
			$(this).addClass('focused');
			$tic($(this), '.head').addClass('focused');
		}).blur(function(){
			$(this).removeClass('focused');
			$tic($(this), '.head').removeClass('focused');
		});
	});
})(jQuery);
