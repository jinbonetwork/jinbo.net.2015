(function($){
	function $iim(selector, $obj){
		if($obj){
			return $obj.closest('.inputset-id-mode').find(selector);
		} else {
			return $('.inputset-id-mode').find(selector);
		}
	}
	$(document).ready(function(){
		$iim('input[type="radio"]').focus(function(){
			$(this).siblings('.radio-button').addClass('focused');
		}).blur(function(){
			$(this).siblings('.radio-button').removeClass('focused');
		}).change(function(){
			$iim('.radio-button').removeClass('checked');
			$(this).siblings('.radio-button').addClass('checked');
			if($(this).val() === 'old'){
				$('.hide-when-user').hide();
				$('.show-when-user').show();
				$.ajax({
					url: $(location).attr('href'), type: 'post',
					async: false,
					data: {todo: 'is-logged-in'},
					success: function(result){
						if(result){
							result = $.parseJSON(result);
							$('.hide-when-loggedin').hide();
							$('.show-when-loggedin').show();
							$('input[type="text"][name="userId"]').val(result.id);
							if(result.isMember){
								$('.hide-when-loggedin-member').hide();
								$('.show-when-loggedin-member').show();
							}
						}
					}
				});
			} else {
				$('.hide-when-user').show();
				$('.show-when-user').hide();
				$('.hide-when-loggedin-member').show();
				$('.show-when-loggedin-member').hide();
				$('.hide-when-loggedin').show();
				$('.show-when-loggedin').hide();
			}
		});
	});
})(jQuery);
