/* layout.js */
jQuery(document).ready(function() {
	var transEndEventNames = {
		'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
		'MozTransition'    : 'transitionend',      // only for FF < 15
		'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
	},
	transitionEnd = transEndEventNames[ Modernizr.prefixed('transition') ];

	function showMenuLayer() {
		var header_width = Math.max(505,parseInt(jQuery(window).width() * 0.35));
		if( ( header_width * 0.744 ) > jQuery(window).width() ) header_width = jQuery(window).width();
		jQuery('#site-navigation').addClass('overflow');
		if(jQuery(window).width() <= 480) {
			jQuery('html,body').addClass('noScroll');
		}
		siteHeader.addClass('posUp');
		if(transitionEnd) {
			jQuery('#site-navigation').removeClass('collapsed').css('width',header_width+'px');
			jQuery('#site-navigation .navi-wrap .left').css({
				'left': '-'+parseInt(header_width * 0.256)+'px',
				'border-left-width': parseInt(header_width * 0.256)+'px'
			});
			jQuery('#site-navigation').bind(transitionEnd,function(e) {
				afterShowMenuLayer();
				jQuery(this).unbind(transitionEnd);
			});
		} else {
			jQuery('#site-navigation').css({'width': header_width+'px'});
			jQuery('#site-navigation .navi-wrap .left').css({
				'left': '-'+parseInt(header_width * 0.256)+'px',
				'border-left-width': parseInt(header_width * 0.256)+'px'
			});
			afterShowMenuLayer();
		}
	}

	function afterShowMenuLayer() {
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

	function hideMenuLayer() {
		jQuery('#site-navigation').removeClass('overflow').addClass('collapsed').css('width','0px');
		jQuery('#site-navigation .navi-wrap .left').css({
			'left': '0px',
			'border-left-width': '0px'
		});
		siteHeader.removeClass('posUp');
		if(transitionEnd === true) {
			jQuery('#site-navigation').bind(transitionEnd,function(e) {
				jQuery('html,body').removeClass('noScroll');
			});
		} else {
			jQuery('html,body').removeClass('noScroll');
		}
	}

	function wait_layout_resize() {
		if(window.respond && window.respond.queue.length != 0){
			setTimeout(function() { wait_layout_resize(); }, 50);
		} else {
			setTimeout(function() { layout_resize(); }, 200);
		}
	}

	function layout_resize() {
		var sm = jQuery('#site-navigation');
		var sm_l = sm.find('.left');
		sm_l.css({
			'border-top-width': sm.outerHeight()+'px'
		});

		var sf = jQuery('#site-footer');
		var sf_width = sf.outerWidth();
		var sf_height = sf.outerHeight();
		var sfb_height = sf_width * 0.0965;
		var sfb = sf.find('.before');
		sfb.css({
			'top': '-'+parseInt(sfb_height)+'px',
			'border-bottom-width': sfb_height+'px',
			'border-left-width': sf_width+'px',
		});
		var gc = jQuery('#site-footer .greencover');
		var gc_width = gc.outerWidth();
		var gc_height = gc.outerHeight();
		var gc_t = gc.find('.top')
		var gc_t_height = gc_width * 0.0965;
		gc_t.css({
			'top': '-'+parseInt(gc_t_height)+'px',
			'border-bottom-width': gc_t_height+'px',
			'border-left-width': gc_width+'px',
		});
		var gc_r = gc.find('.right');
		var gc_r_height = sf_height + gc_t_height;
		var gc_r_width = parseInt(gc_width * 0.41);
		gc_r.css({
			'right': '-'+gc_r_width+'px',
			'top': '-'+gc_t_height+'px',
			'border-bottom-width': gc_r_height+'px',
			'border-right-width': gc_r_width+'px',
		});
	}

	jQuery('#site-header .menu a').click(function(e) {
		e.preventDefault();
		showMenuLayer();
	});
	jQuery('#site-navigation .menu-close').click(function(e) {
		e.preventDefault();
		hideMenuLayer();
	});

	jQuery(window).resize(function(e) {
		wait_layout_resize();
	});
	wait_layout_resize();

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
			if( sT > headerHeight ) {
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
