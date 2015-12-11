(function($){
	function $ib(selector, $obj){
		if(selector && $obj){
			return $obj.closest('.inputset-bank').find(selector);
		} else if(selector) {
			return $('.inputset-bank').find(selector);
		} else {
			return $('.inputset-bank');
		}
	}
	$(document).ready(function(){
		$.ajax({
			url: $(location).attr('href'), type: 'post',
			data: {todo: 'get-bank-list'},
			success: function(result){
				if(result){
					$ib('.bank-list').append(result);
				}
			}
		});

		$ib('input[type="text"][name="bank"]').blur(function(event){
			$(this).removeClass('focused');
			$ib('.head', $(this)).removeClass('focused');
		}).focus(function(){
			$(this).addClass('focused');
			$ib('.head', $(this)).addClass('focused');
			$ib('.bank-list', $(this)).addClass('show');
		}).keydown(function(event){
			if(event.which != 9 && event.which != 13) return false;
		});

		$ib().on('click', '.bank-list > li', function(){
			$ib('input[name="bank"]', $(this)).val($(this).text()).prev('span').text('');
			$ib('input[name="bankCode"]', $(this)).attr('value', $(this).attr('data-bank-code'));
			$ib('.bank-list', $(this)).removeClass('show');
			$ib('span.error-message').text('');
		});
		$('input').focus(function(){
			if($(this).attr('name') !== 'bank') {
				$ib('.bank-list').removeClass('show');
			}
		});
		$('textarea').focus(function(){
			$ib('.bank-list').removeClass('show');
		});
		$('button').focus(function(){
			$ib('.bank-list').removeClass('show');
		});
		$(this).mousedown(function(event){
			if(!$(event.target).parent().hasClass('bank-list') && $(event.target).attr('name') !== 'bank'){
				$ib('.bank-list').removeClass('show');
			}
		});

	});
})(jQuery);
