(function($){
	function $pt(selector, $obj){
		if($obj && selector) return $obj.closest('.page-title').find(selector);
		else if(selector) return $('.page-title').find(selector);
		else return $('.page-title');
	}
	function modBottAngle(){
		var h = $pt('.bottom1').outerHeight();
		var w = $pt('.bottom1').outerWidth();
		var angle = -1*Math.atan(h/w)*180/Math.PI;
		$pt('.bottom1').css({'-webkit-transform': 'skewY('+angle+'deg)', 'transform': 'skewY('+angle+'deg)'});

		h = $pt('.bottom1').outerHeight() - $pt('.bottom2').outerHeight();
		w = $pt('.bottom2').outerWidth();
		angle = -1*Math.atan(h/w)*180/Math.PI;
		$pt('.bottom2').css({'-webkit-transform': 'skewY('+angle+'deg)', 'transform': 'skewY('+angle+'deg)'});
	}
	$(document).ready(function(){
		modBottAngle();
		var oldWidth = $pt('.wrap').outerWidth();
		setInterval(function(){
			width = $pt('.wrap').outerWidth();
			if(width !== oldWidth){
				modBottAngle();
				oldWidth = $pt('.wrap').outerWidth();
			}
		}, 100);
	});
})(jQuery);
