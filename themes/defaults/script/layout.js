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

	var siteHeader = jQuery('header#site-header');
	var headerHeight = siteHeader.outerHeight();
	var curScroll = jQuery(window).scrollTop();
	var curTouches = 0;
	if(Modernizr.touch) {
		if( window.pageYOffset > headerHeight) {
			siteHeader.addClass('fixed');
		} else {
			siteHeader.removeClass('fixed');
		}
		jQuery(document).bind('touchstart.jinbonet',function(e) {
			var point;
			var touches = e.originalEvent.touches;
			if(touches && touches.length > 0) {
				point = touches[0];
			}
			else {
				return false;
			}
			curTouches = point.clientY;

			jQuery(document).bind('touchmove.jinbonet',function(e) {
				var point2;

				var mtouches = e.originalEvent.touches;
				if(mtouches.length > 1) {
					return false;
				}

				point2 = mtouches[0];
				if( window.pageYOffset > headerHeight ) {
					if(!siteHeader.hasClass('fixed'))
						siteHeader.addClass('fixed');
					if(point2.clientY < curTouches) {
						if(!siteHeader.hasClass('slideUp'))
							siteHeader.addClass('slideUp');
					} else {
						if(siteHeader.hasClass('slideUp'))
							siteHeader.removeClass('slideUp');
					}
				} else {
					siteHeader.removeClass('fixed');
				}
			});
			jQuery(document).bind('touchend.jinbonet',function(e) {
				jQuery(document).unbind('touchmove.jinbonet');
				jQuery(document).unbind('touchend.jinbonet');
			});
		});
	} else {
		if(curScroll > headerHeight) {
			siteHeader.addClass('fixed');
		} else {
			siteHeader.removeClass('fixed');
		}
		jQuery(window).scroll(function(e) {
			var sT = jQuery(window).scrollTop();
			if(sT > headerHeight) {
				if(!siteHeader.hasClass('fixed'))
					siteHeader.addClass('fixed');
				if(sT > curScroll) {
					if(!siteHeader.hasClass('slideUp'))
						siteHeader.addClass('slideUp');
				} else {
					if(siteHeader.hasClass('slideUp'))
						siteHeader.removeClass('slideUp');
				}
			} else {
				siteHeader.removeClass('slideUp').removeClass('fixed');
			}
			curScroll = sT;
		});
	}
});
