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
		//inputset-id-mode
		$iim('input[type="radio"]').change(function(){
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
		//inputset-submit
		$is('button[type="submit"]').click(function(event){
			event.preventDefault();

			var data = $is().closest('form').serializeArray();
			var dataObj = {};
			for(var i = 0, len = data.length; i < len; i++){
				dataObj[data[i].name] = data[i].value;
			}
			dataObj.todo = 'submit';

			$.ajax({
				url: $(location).attr('href'), type: 'post', async: false,
				data: dataObj,
				success: function(result){
					if(result){
						result = $.parseJSON(result);
						var name = result[0];
						var message = result[1];
						var $input = $('input[name="'+name+'"]');
						if(name === 'etc_youMember'){
							$('input[name="userId"]').focus();
						}
						else if(name === 'etc_login_youMember'){
							$('button[name="login"]').click();
							$('input[name="userId"]').focus();
						}
						else if(name === 'agreePrivate' || name === 'agreeService' || name === 'agreeCms'){
							$input.focus();
						}
						else if(name === 'etc_error'){
							alert(message);
						} else {
							$input.focus();
							$input.closest('article').find('span.error-message').text(message);
							$input.keyup(function(){
								$(this).closest('article').find('span.error-message').text('');
							});
						}
					}
					else {
						$('#join-section2').hide();

						var date = new Date(); date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
						var params = '?name='+dataObj.name+'&request_fee='+dataObj.donation+'&phone='+dataObj.phone+
							'&bank='+dataObj.bank+'&acct_id='+dataObj.acctnum+'&acct_name='+dataObj.acctowner+
							'&acct_personal_id='+dataObj.registnum+'&request_date='+date;
						var lclEvent = $.Event('load-cms-license');
						lclEvent.params = params;

						$('.inputset-complete').trigger(lclEvent);
					}//end fo if(result)
				}//end of success:
			});//end of $.ajax()
		});//end of click()
	});//end of ready()
	function $iim(selector, $obj){
		if($obj) return $obj.closest('.inputset-id-mode').find(selector);
		else return $('.inputset-id-mode').find(selector);
	}
	function $is(selector, $obj){
		if(selector && $obj) return $obj.closest('.inputset-submit').find(selector);
		else if(selector) return $('.inputset-submit').find(selector);
		else return $('.inputset-submit');
	}
})(jQuery);
