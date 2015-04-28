/* layout.js */
jQuery(document).ready(function() {
	var transEndEventNames = {
		'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
		'MozTransition'    : 'transitionend',      // only for FF < 15
		'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
	},
	transitionEnd = transEndEventNames[ Modernizr.prefixed('transition') ];

	function showMenuLayer() {
		jQuery('#site-navigation').removeClass('collapsed').css('height',jQuery(window).height()+'px');
		if(transitionEnd) {
			jQuery('#site-navigation').bind(transitionEnd,function(e) {
				jQuery(this).addClass('overflow');
				jQuery('html,body').addClass('noScroll');
				if(jQuery(this).data('init-event') !== 1) {
					jQuery(window).on('keydown.jinbonet',function(event) {
						var code = event.charCode || event.keyCode;
						if(code == 27 && !jQuery('#site-navigation').hasClass('collapsed')) {
							hideMenuLayer();
						}
					});
					jQuery(this).data('init-event',1);
				}
				jQuery(this).unbind(transitionEnd);
			});
		} else {
			jQuery('#site-navigation').addClass('overflow').css('height',jQuery(window).height()+'px');
			jQuery('html,body').addClass('noScroll');
			if(jQuery('#site-navigation').data('init-event') !== 1) {
				jQuery(window).on('keydown.jinbonet',function(event) {
					var code = event.charCode || event.keyCode;
					if(code == 27 && !jQuery('#site-navigation').hasClass('collapsed')) {
						hideMenuLayer();
					}
				});
				jQuery('#site-navigation').data('init-event',1);
			}
		}
	}

	function hideMenuLayer() {
		jQuery('#site-navigation').removeClass('overflow').addClass('collapsed').css('height','0px');
		if(transitionEnd === true) {
			jQuery('#site-navigation').bind(transitionEnd,function(e) {
				jQuery('html,body').removeClass('noScroll');
			});
		} else {
			jQuery('html,body').removeClass('noScroll');
		}
	}

	jQuery('#site-header .menu a').click(function(e) {
		e.preventDefault();
		showMenuLayer();
	});
	jQuery('#site-navigation .close').click(function(e) {
		e.preventDefault();
		hideMenuLayer();
	});
});
