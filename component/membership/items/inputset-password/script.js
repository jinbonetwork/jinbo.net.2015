(function($){
	function $ip(selector, $obj){
		if($obj)
			return $obj.closest('.inputset-password').find(selector);
		else
			return $('.inputset-password').find(selector);
	}
	$(document).ready(function(){
		$ip('input[type="password"][name="pw"]').blur(function(){
			$(this).removeClass('focused');
			$ip('.head', $(this)).removeClass('focused');
			if($('input[type="radio"][name="signinType"]:checked').val() === 'user_id') return;
		}).focus(function(){
			$(this).addClass('focused');
			$ip('.head', $(this)).addClass('focused');
		});
		$ip('button[name="id-login"]').blur(function(){
			$(this).removeClass('focused');
		}).focus(function(){
			$(this).addClass('focused');
		}).click(function(){
			var $login = $(this);
			var $pw = $('input[type="password"][name="pw"]');
			var $id = $('input[type="text"][name="id"]');
			$.ajax({
				url: $(location).attr('href'), type: 'post',
				async: false,
				data: { todo: 'login', id: $id.val(), pw: $pw.val() },
				success: function(result){
					if(!result){
						$('#membership-section-container"').addClass('isLogin');
						$.ajax({
							url: $(location).attr('href'), type: 'post',
							async: false,
							data: {todo: 'is-logged-in'},
							success: function(result){
								if(result){
									result = $.parseJSON(result);
									if(result.isMember){
										$('#membership-section-container"').addClass('isMember');
									} else {
										$('#membership-section-container"').addClass('isNotMember');
									}
								}
							}
						});
					} else {
						$login.removeClass('focused');
						if(result.match(/아이디/ig)){
							$id.closest('article').find('span.error-message').text(result);
							$id.focus();
						} else {
							$pw.closest('article').find('span.error-message').text(result);
							$pw.focus();
						}
					}
				}
			});
		});
	});
})(jQuery);
