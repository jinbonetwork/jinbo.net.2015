(function($){
	function $ie(selector, $obj){
		if(selector && $obj) return $obj.closest('.inputset-email').find(selector);
		else if(selector) return $('.inputset-email').find(selector);
		else return $('.inputset-email');
	}
	function modiInputWidth(){
		var $this = $ie('input[name="email"]');
		var $dummy = $('<span style="position: absolute; z-index: -100;"></span>').insertAfter($this);
		var mailId = $this.val();
		var fontSize = $this.css('font-size');
		if(!mailId){
			mailId = $this.siblings('.placeholder').text();
			fontSize = $this.siblings('.placeholder').css('font-size');
		}
		var inputWidth = $dummy.css('font-size', fontSize).text(mailId).width() + 10;
		$this.outerWidth(inputWidth);
		if(!$this.val()) $this.siblings('.placeholder').outerWidth(inputWidth);
		$dummy.remove();
		var inputW = $this.outerWidth();
		var spanW = $ie('span#mail-server').outerWidth();
		var wrapW = $ie('.input-with-placeholder').width();
		var wDiff = wrapW - (inputW + spanW);
		$ie('span#mail-server').outerWidth(spanW + wDiff);
	}
	$(document).ready(function(){
		var d_id;
		modiInputWidth();
		$ie('input[name="email"]').keyup(function(){
			modiInputWidth();
		}).keydown(function(){
			modiInputWidth();
		}).focus(function(){
			$(this).parent().addClass('focused');
			if(!$(this).val()){
				$(this).val(d_id);
				modiInputWidth();
			}
		}).blur(function(){
			$(this).parent().removeClass('focused');
		});
		$(document).on('fill-in-id', function(event){
			d_id = event.id;
		});
	});
})(jQuery);
