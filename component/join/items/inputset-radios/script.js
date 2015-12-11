(function($){
	$(document).ready(function(){

		//radio column width
		var numCol = Number($ir('.radio-wrap').attr('data-column'));
		$ir('.radio-col').width((100/numCol)+'%');

		//radio button
		$ir('.radio-button-o').hide();
		$ir('input[type="radio"]').change(function(){
			var id = $(this).attr('id');
			$ir('.radio-button-o').hide();
			$(this).siblings('label[for="'+id+'"]').find('.radio-button-o').show();
		});
	});
	function $ir(selector){
		return $('.inputset-radios').find(selector);
	}
})(jQuery);
