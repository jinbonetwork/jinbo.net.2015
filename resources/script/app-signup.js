(function($){
	function $is(selector, $obj){
		if(selector && $obj) return $obj.closest('.inputset-submit').find(selector);
		else if(selector) return $('.inputset-submit').find(selector);
		else return $('.inputset-submit');
	}

	$(document).ready(function(){
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
					console.log('app-signup.js를 수정하세요.');
					//if(result){
					if(!result){
						result = $.parseJSON(result);
						var name = result[0];
						var message = result[1];
						var $input = $('input[name="'+name+'"]');
						if(name === 'agreePrivate' || name === 'agreeService'){
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
					} else {
						$('#signup-section2').hide();
						$('#signup-section3').show();
					}//end fo if(result)
				}//end of success:
			});//end of $.ajax()
		});//end of click()
	});
})(jQuery);
