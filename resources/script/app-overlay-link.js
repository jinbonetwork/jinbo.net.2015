(function($) {
	function overlayLink(element,options) {
		var self = this;

		this.settings = jQuery.extend({}, options);
		this.root = jQuery(element);
		if(this.root.hasClass('url')) {
			this.type = 'get-ajax';
		} else {
			this.type = 'inner';
		}
		this.button = this.root.find(this.settings.button);
		this.overlay = jQuery('<div id="'+this.unique_ID(6)+'" class="overlay-content"></div>');
		var iv = jQuery('<div><i class="icon-close close"></i><div class="overlay-content-box"></div><div class="close-box"><button class="close btn btn-default" data-toggle="tooltip" data-class="default" data-placement="top" data-title="닫기">닫기</button></div></div>');
		iv.appendTo(this.overlay);
		this.overlay.appendTo('body');

		this.root.addClass('overlay-link');
		this.button.addClass('overlay-button');
		this.overlay.addClass('overlay-content');

		var ua = navigator.userAgent.toLowerCase();
		var isAndroid = ua.indexOf("android") > -1;
		if(isAndroid) {
			this.isOldAndroid = ua.indexOf('android 4.0') > -1;
		} else {
			this.isOldAndroid = 0;
		}

		var transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
			'MozTransition'    : 'transitionend',      // only for FF < 15
			'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, S
		}

		this.transitionEnd = transEndEventNames[ Modernizr.prefixed('transition') ];

		this.init();
		jQuery(window).resize(function(e) {
			self.setSize();
		});
		jQuery(window).scroll(function(e) {
			self.setSize();
		});
		this.setSize();
	}

	overlayLink.prototype = {
		unique_ID: function(size) {
			var getRandomNumber = function(range) {
				return Math.floor(Math.random() * range);
			};

			var getRandomChar = function() {
				var chars = "abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
				return chars.substr( getRandomNumber(62), 1 );
			};

			var randomID = function(size) {
				var str = "";
				for(var i = 0; i < size; i++) {
					str += getRandomChar();
				}
				return str;
			};

			return randomID(size);
		},
		init: function() {
			var self = this;
			this.button.click(function(e) {
				e.preventDefault();

				if( self.type == 'get-ajax' ) {
					self.load();
				} else {
					self.open();
				}
			});
		},

		load: function() {
			var self = this;
			var url = this.button.attr('href');
			var target = this.button.attr('target');

			jQuery.ajax({
				url: url,
				method: 'GET',
				dataType: 'html',
				beforeSend: function(jqXHR) {
					jQuery('body').jfLoading({'position':'overlay'});
				},
				success: function(html) {
					self.overlay.find('.overlay-content-box').html(jQuery(html).find(target).html());
					if(self.button.attr('data-subject')) {
						self.overlay.find('.overlay-content-box').prepend('<h3>'+self.button.attr('data-subject')+'</h3>');
					}
					jQuery('body').isLoading('hide');
					self.type = 'inner';
				},
				complete: function() {
					self.open();
				}
			});
		},

		open: function() {
			var self = this;
			if( this.settings.onclick && typeof( this.settings.onclick ) === 'function' ) {
				this.settings.onclick();
			}
			if(this.isOldAndroid) {
				jQuery('body').data('scrollTop',jQuery(window).scrollTop());
				this.overlay.css({ 'position':'absolute' });
			}
			this.root.addClass('open');
			this.overlay.addClass('open');

			if(Modernizr.csstransitions) {
				var transitionEnd = this.transitionEnd;
				this.overlay.bind(transitionEnd,function(e) {
					jQuery('body').addClass('noscroll');
					jQuery('html').addClass('noscroll');
					self.overlay.addClass('scroll');
					jQuery(this).scrollTop(0);
					self.bindclose();
					jQuery(this).unbind(transitionEnd);
				});
			} else {
				jQuery('body').addClass('noscroll');
				this.overlay.addClass('scroll');
				this.overlay.scrollTop(0);
				this.bindclose();
			}
		},

		bindclose: function() {
			var self = this;
			if(this.overlay.data('event-handle') != true) {
				this.overlay.find('.close').click(function(e) {
					e.preventDefault();
					self.root.removeClass('open');
					self.overlay.removeClass('open');
					self.overlay.removeClass('scroll');
					if(Modernizr.csstransitions) {
						var transitionEnd = self.transitionEnd;
						self.overlay.bind(transitionEnd,function(e) {
							jQuery('body').removeClass('noscroll');
							jQuery('html').removeClass('noscroll');
							if(self.isOldAndroid) {
								jQuery(window).scrollTop(jQuery('body').data('scrollTop'));
							}
							jQuery(this).unbind(transitionEnd);
						});
					} else {
						jQuery('body').removeClass('noscroll');
					}
				});
				this.overlay.data('event-handle',true);
			}
		},

		setSize: function() {
			var self = this;
			var t = this.root.offset().top;
			var l = this.root.offset().left;
			var w = this.root.outerWidth();
			var h = this.root.outerHeight();
			var s = jQuery(window).scrollTop();

			if(!this.overlay.hasClass('open')) {
				this.overlay.css({
					'top': (t-s)+'px',
					'left': l+'px',
					'width': w+'px',
					'height': h+'px'
				});
			}
		}
	}

	jQuery.fn.overlay_link = function(options) {
		return this.each(function() {
			var overlay_link = new overlayLink(this,options);
			jQuery(this).data('overlayLink',overlay_link);
		});
	}
})(jQuery);
