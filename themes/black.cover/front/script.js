
(function ($) {

	function jinboFront(options) {
		var self = this;

		this.settings = jQuery.extend({}, options);

		this.windowWidth = 0;
		this.windowHeight = 0;
		this.title_translatePos = 0;
		this.currentScrollTop=0;

		this.section_container;
		this.isFrontHeaderAnimating = false;

		var transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
			'MozTransition'    : 'transitionend',      // only for FF < 15
			'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
		}

		this.transitionEnd = transEndEventNames[ Modernizr.prefixed('transition') ];
		this.transition = Modernizr.prefixed('transition');
		this.transform = Modernizr.prefixed('transform');
		this.section_subtitle_svg_animate = [];

		Modernizr.addTest('hires', function() {
			// starts with default value for modern browsers
			var dpr = window.devicePixelRatio ||

			// fallback for IE
			(window.screen.deviceXDPI / window.screen.logicalXDPI) ||

			// default value
			1;

			return !!(dpr > 1);
		});

		if(Modernizr.hires) {
			jQuery('body').addClass('retina');
		}
		if(!jQuery('html').hasClass('is-ie') && Modernizr.svgclippaths) {
			jQuery('body').addClass('supportClipPath');
		}

		this.site_container = jQuery('#site-main-container');
		this.video_wrap = jQuery('.animateheader-container');
		this.video = jQuery('.animateheader-container .animateheader-wrap .animate-header-background-video');
		this.loading = jQuery('.animateheader-container .animateheader-wrap .loading');
		this.logo_image = jQuery('img#jinbonet-logo-image');
		this.title = jQuery('h1#jinbonet-main-logo');
		this.frontHeader = jQuery('#front-header');
		this.openBtn = this.frontHeader.find('#jinbonet-scroll-door');

		this.openBtn.click(function(e) {
			self.scrollFrontHeader('slideDown');
		});

		this.section_container = jQuery('#front-section-container');
		this.sections = this.section_container.find('.section');

		jQuery(window).resize(function(e) {
			self.front_resize();
		});
		this.front_resize();

		if(Modernizr.csstransitions) {
			var wow = new WOW().init();
		}

		if(Modernizr.hasEvent('scroll', window)) {
			jQuery(window).on('scroll', function(e) {
				self.scrollAnimation();
			});
		} else {
			jQuery('body').bind('touchmove',function(e) {
				self.scrollAnimation();
			});
		}

		this.videoPlay();
	}

	jinboFront.prototype = {

		detectScrollbarWidthHeight: function() {
		    var div = document.createElement("div");
			div.style.overflow = "scroll";
			div.style.visibility = "hidden";
			div.style.position = 'absolute';
			div.style.width = '100px';
			div.style.height = '100px';
			document.body.appendChild(div);

			return {
				width: div.offsetWidth - div.clientWidth,
				height: div.offsetHeight - div.clientHeight
			};
		},

		front_resize: function() {
			var self = this;
			this.windowWidth = jQuery(window).width();
			this.windowHeight = jQuery(window).height();
			if( jQuery(document).width() > jQuery(window).width() ) {
				var x_scroll_size = this.detectScrollbarWidthHeight();
				this.windowHeight = this.windowHeight + x_scroll_size.height;
			}
			this.currentScrollTop = jQuery(window).scrollTop();
			if(this.currentScrollTop >= this.windowHeight) {
				this.site_container.addClass('slideCrack');
				this.site_container.addClass('slideDown');
				this.frontHeader.addClass('hide');
			} else {
				if(!this.site_container.hasClass('slideDown')) {
					this.scrollFrontHeader('slideUp');
				}
			}

			jQuery('#front-header .up-door .door-wrapper .diagonal-background').css({
				'width': ( this.windowWidth + this.settings.frontHeadercrack.width )+'px',
				'left': '-'+this.settings.frontHeadercrack.width+'px',
				'top': '-'+this.settings.frontHeadercrack.height+'px',
				'height': Math.ceil( this.windowHeight - ( ( this.windowWidth + this.settings.frontHeadercrack.width ) * this.settings.header_diagonal_ratio) - 22 + this.settings.frontHeadercrack.height )+'px'
			});
			jQuery('#front-header .up-door .door-wrapper .diagonal-background .diagonal').css({
				'border-top-width': Math.ceil( ( this.windowWidth + this.settings.frontHeadercrack.width ) * this.settings.header_diagonal_ratio) + 'px',
				'border-left-width': ( this.windowWidth + this.settings.frontHeadercrack.width ) + 'px',
				'bottom': '-' + Math.ceil( ( this.windowWidth + this.settings.frontHeadercrack.width ) * this.settings.header_diagonal_ratio) + 'px'
			});
			jQuery('#front-header .down-door .door-wrapper .diagonal-background').css({
				'width': ( this.windowWidth + this.settings.frontHeadercrack.width )+'px',
				'height': ( 22 - this.settings.frontHeadercrack.height )+'px',
				'bottom': '-'+this.settings.frontHeadercrack.height+'px'
			});
			jQuery('#front-header .down-door .door-wrapper .diagonal-background .diagonal').css({
				'border-bottom-width': Math.ceil( ( this.windowWidth + this.settings.frontHeadercrack.width ) * this.settings.header_diagonal_ratio) + 'px',
				'border-right-width': ( this.windowWidth + this.settings.frontHeadercrack.width ) + 'px',
				'top': '-' + Math.ceil( ( this.windowWidth + this.settings.frontHeadercrack.width ) * this.settings.header_diagonal_ratio) + 'px'
			});

			if( this.windowHeight < this.settings.originHeader.height) {
				var h_height = this.windowHeight;
				var h_width = parseInt( ( h_height * this.settings.originHeader.width ) / this.settings.originHeader.height );
			} else {
				var h_height = 0, h_width = 0;
			}

			var width = 0, height = 0;
			if(this.windowWidth > this.settings.originHeader.width) {
				width = this.settings.originHeader.width;
				height = this.settings.originHeader.height;
			} else if( this.windowWidth <= this.settings.originHeader.width && this.windowWidth >= this.settings.resizeLimit.width) {
				width = this.settings.originHeader.width;
				height = this.settings.originHeader.height;
			} else {
				height = parseInt( ( this.windowWidth * this.settings.resizeLimit.height ) / this.settings.resizeLimit.width );
				width = parseInt( ( height * this.settings.originHeader.width ) / this.settings.originHeader.height );
			}

			if(h_height && h_height < height) {
				width = h_width;
				height = h_height;
				if(width < this.windowWidth) {
					width = this.windowWidth;
					height = parseInt( width * h_height / h_width );
				}
			}

			var leftPos = parseInt( ( this.windowWidth - width ) / 2 );
			var topPos = parseInt( ( this.windowHeight - height) / 2 );
			this.video.css({
				'width': width+'px',
				'height': height+'px',
				'left': leftPos+'px',
				'top': topPos+'px'
			});
			this.video.find('source').attr('width',width+'px').attr('height',height+'px');
			this.loading.css({
				'left': parseInt( ( this.windowWidth - this.loading.outerWidth() ) / 2 )+'px',
				'top': parseInt( ( this.windowHeight - this.loading.outerHeight() ) / 2 )+'px'
			});
			var logo_image_pos = parseInt( height * 0.216 ) + topPos;
			if(this.logo_image.length > 0) {
				var logo_image_height = Math.ceil( ( this.settings.imageLogo.height * height ) / this.settings.originHeader.height );
				this.logo_image.css({
					'width': Math.ceil( ( logo_image_height * this.settings.imageLogo.width ) / this.settings.imageLogo.height )+'px',
					'height': logo_image_height+'px',
					'margin-top': logo_image_pos+'px'
				});
				var title_top_pos = parseInt( this.windowHeight / 2 ) + parseInt( ( this.windowHeight / 2 ) * 0.22 );
			} else {
				var title_top_pos = parseInt(height * 0.61);
			}

			if(this.title.length > 0) {
				var v_w = this.title.outerWidth();
				this.title_translatePos = this.windowHeight - parseInt( ( ( this.windowWidth * this.settings.header_diagonal_ratio ) / 2 ) + 22 ) - parseInt( this.title.outerHeight() / 2 ) - title_top_pos;
				this.title.css({
					'top': ( title_top_pos + ( Modernizr.csstransitions ? 0 : this.title_translatePos ) )+'px',
					'left': parseInt( ( this.windowWidth - v_w ) / 2)+'px'
				});
				if(this.title.hasClass('showIn')) {
					this.title.css({
						'transform': 'translateY('+this.title_translatePos+'px)',
						'-webkit-transform': 'translateY('+this.title_translatePos+'px)',
						'-moz-transform': 'translateY('+this.title_translatePos+'px)',
						'-ms-transform': 'translateY('+this.title_translatePos+'px)',
						'-o-transform': 'translateY('+this.title_translatePos+'px)',
					});
				}
			}

			var openBtn_pos = parseInt( this.windowHeight * 0.534 );
			if( openBtn_pos < ( logo_image_pos + logo_image_height ) ) {
				openBtn_pos = ( logo_image_pos + logo_image_height ) + 20;
			}
			if( ( openBtn_pos + this.settings.openBtn_size.height ) > title_top_pos) {
				openBtn_pos = parseInt( ( title_top_pos + this.title_translatePos + logo_image_pos + logo_image_height - this.settings.openBtn_size.height ) / 2 );
			}
			this.openBtn.css({
				'left': parseInt( ( this.windowWidth - this.settings.openBtn_size.width ) / 2 )+'px',
				'top': openBtn_pos+'px'
			});
			this.section_container.css({
				'margin-top': ( this.windowHeight * 1.5 )+'px'
			});

			this.front_section_resize();

			var s_services = jQuery('.section.jinbonet-services');
			var s_services_width = s_services.outerWidth();
			var s_services_height = s_services.outerHeight() - ( isNaN(parseInt(s_services.css('margin-bottom'))) ? 0 : parseInt(s_services.css('margin-bottom')) ) - ( isNaN(parseInt(s_services.css('margin-top'))) ? 0 : parseInt(s_services.css('margin-top')) );
			s_services.find('.before').css({
				'top': '-'+parseInt(s_services_height * 0.057)+'px',
				'border-bottom-width': parseInt(s_services_height * 0.057)+'px',
				'border-right-width': s_services_width+'px'
			});

			var s_movement = jQuery('.section.movement-projects');
			var s_movement_width = s_movement.outerWidth();
			var s_movement_height = s_movement.outerHeight() - ( isNaN(parseInt(s_movement.css('margin-bottom'))) ? 0 : parseInt(s_movement.css('margin-bottom')) ) - ( isNaN(parseInt(s_movement.css('margin-top'))) ? 0 : parseInt(s_movement.css('margin-top')) );
			s_movement.find('.before').css({
				'top': '-'+parseInt(s_movement_height * 0.05)+'px',
				'border-bottom-width': parseInt(s_movement_height * 0.05)+'px',
				'border-left-width': s_movement_width+'px'
			});
			s_movement.find('.after').css({
				'bottom': '-'+parseInt(s_movement_width * 0.085)+'px',
				'border-top-width': parseInt(s_movement_width * 0.085)+'px',
				'border-left-width': s_movement_width+'px'
			});
		},

		front_section_resize: function() {
			var self = this;
			this.sections = jQuery('.section');
			var subtitle_svg_cnt = 0;
			this.sections.each(function(idx) {
				$this = jQuery(this);
				if($this.find('.headline-subheadline').length > 0) {
					var _section_pos = parseInt($this.offset().top - self.windowHeight) + parseInt($this.css('padding-top')) + $this.find('.headline-subheadline').outerHeight();
					var _section_height = self.windowHeight;
					if(Modernizr.canvas) {
						var _svg_element = $this.find('svg#'+$this.attr('id')+'-svg');
						if(_svg_element.length < 1) {
							var _svg_element = jQuery('<svg id="'+$this.attr('id')+'-svg" class="sub-title-animate"></svg>');
							_svg_element.prependTo($this);
						}
						var svg_width = ( self.windowWidth >= 1024 ? 700 : parseInt( 700 * self.windowWidth / 1024 ) );
						var svg_height = parseInt(300 * svg_width / 700);
						_svg_element.css({
							'left': parseInt( ( self.windowWidth - svg_width ) / 2)+'px'
						});
						if(subtitle_svg_cnt <= ( self.section_subtitle_svg_animate.length - 1 ) ) {
							var items = self.section_subtitle_svg_animate[subtitle_svg_cnt];
							var _svg = self.section_subtitle_svg_animate[subtitle_svg_cnt].svg;
							_svg.attr({
								'width': svg_width,
								'height': svg_height
							});

							var _polygon = self.section_subtitle_svg_animate[subtitle_svg_cnt].polygon;
							var _pattern = self.section_subtitle_svg_animate[subtitle_svg_cnt].pattern;
						} else {
							var items = {};
							var _svg = Snap('#'+$this.attr('id')+'-svg');
							_svg.attr({
								'width': svg_width,
								'height': svg_height
							});
							var _polygon = _svg.polygon([0,0,0,0,0,0,0,0]);
							var _pattern = _svg.image('themes/black.cover/images/halftone_background.png',0,0,700,300).pattern(0, 0, svg_width, svg_height);
							items.svg = _svg;
							items.polygon = _polygon;
							items.pattern = _pattern;
						}
						_polygon.attr({
							fill: _pattern
						});

						items.position = [];
						items.position.push({
							'pos' : _section_pos,
							'attr' : [
								[0,0],
								[parseInt( 623 * svg_width / 700 ),parseInt( 40 * svg_height / 300 )],
								[parseInt( 675 * svg_width / 700 ),parseInt( 234 * svg_height / 300 )],
								[parseInt( 160 * svg_width / 700 ),parseInt( 163 * svg_height / 300 )]
							]
						});
						items.position.push({
							'pos' : ( _section_pos + parseInt( _section_height / 4 ) ),
							'attr' : [
								[parseInt( 146 * svg_width / 700 ),0],
								[parseInt( 692 * svg_width / 700 ),parseInt( 20 * svg_height / 300 )],
								[parseInt( 643 * svg_width / 700 ),parseInt( 198 * svg_height / 300 )],
								[parseInt( 8 * svg_width / 700 ),parseInt( 273 * svg_height / 300 )]
							]
						});
						items.position.push({
							'pos' : ( _section_pos + parseInt( ( _section_height * 3 ) / 4 ) ),
							'attr' : [
								[parseInt( 289 * svg_width / 700 ),parseInt( 120 * svg_height / 300 )],
								[parseInt( 456 * svg_width / 700 ),parseInt( 148 * svg_height / 300 )],
								[parseInt( 325 * svg_width / 700 ),parseInt( 172 * svg_height / 300 )],
								[parseInt( 223 * svg_width / 700 ),parseInt( 132 * svg_height / 300 )]
							]
						});
						items.position.push({
							'pos' : ( _section_pos + _section_height ),
							'attr' : [
								[parseInt( 350 * svg_width / 700 ),parseInt( 140 * svg_height / 300 )],
								[parseInt( 350 * svg_width / 700 ),parseInt( 140 * svg_height / 300 )],
								[parseInt( 350 * svg_width / 700 ),parseInt( 140 * svg_height / 300 )],
								[parseInt( 350 * svg_width / 700 ),parseInt( 140 * svg_height / 300 )]
							]
						});
						if(subtitle_svg_cnt <= ( self.section_subtitle_svg_animate.length - 1 ) ) {
							self.section_subtitle_svg_animate[subtitle_svg_cnt] = items;
						} else {
							self.section_subtitle_svg_animate.push(items);
						}
					} else {
						var alternative_image_idx = ( (subtitle_svg_cnt % 3) +1 );
						if( $this.find('img.subtitle-background').length > 0 ) {
							var alternative_image = $this.find('img.subtitle-background');
							var alt_img_width = ( self.windowWidth >= 1024 ? alternative_image.attr('data-origin-width') : parseInt( alternative_image.attr('data-origin-width') * self.windowWidth / 1024 ) );
							var alt_img_height = parseInt(alternative_image.attr('data-origin-height') * alt_img_width / alternative_image.attr('data-origin-width') );
							alternative_image.css({
								'width': alt_img_width+'px',
								'height': alt_img_height+'px',
								'left': parseInt( (windowWidth - alt_img_width) / 2 )+'px'
							});
						} else {
							var alternative_image = jQuery('<img src="./themes/black.cover/images/halftone_background-ie-'+alternative_image_idx+'.png" class="subtitle-background">');
							alternative_image.prependTo($this);
							alternative_image.imagesLoaded( function(instance) {
								jQuery(instance.elements).each(function(im) {
									var alt_img_width = ( self.windowWidth >= 1024 ? jQuery(this).width() : parseInt( jQuery(this).width() * self.windowWidth / 1024 ) );
									var alt_img_height = parseInt(jQuery(this).height() * alt_img_width / jQuery(this).width() );
									alternative_image.attr({
										'data-origin-width': jQuery(this).width(),
										'data-origin-height': jQuery(this).height()
									});
									alternative_image.css({
										'width': alt_img_width+'px',
										'height': alt_img_height+'px',
										'left': parseInt( (self.windowWidth - alt_img_width) / 2 )+'px'
									});
								});
							});
						}
					}
					subtitle_svg_cnt++;
				}
			});
		},


		scrollFrontHeader: function(opt) {
			var self = this;
			if(opt == 'slideDown') {
				this.isFrontHeaderAnimating = true;
				if(Modernizr.csstransitions) {
					this.site_container.addClass('slideCrack');
					setTimeout(function() {
						self.site_container.addClass('slideDown');
						jQuery('html,body').animate({'scrollTop': parseInt( self.windowHeight * 1.5 )+'px' },800,'swing',function() { self.isFrontHeaderAnimating = false; self.frontHeader.addClass('hide'); });
					},500);
				} else {
					this.site_container.addClass('slideCrack');
					setTimeout(function() {
						self.frontHeader.find('.up-door').animate({'top': '-'+self.windowHeight+'px'},800);
						self.frontHeader.find('.down-door').animate({'bottom': '-'+self.windowHeight+'px'},800);
						jQuery('html,body').animate({'scrollTop': parseInt( self.windowHeight * 1.5 )+'px' },800,'swing',function() { self.isFrontHeaderAnimating = false; self.frontHeader.addClass('hide'); });
					},100);
				}
			} else if(opt == 'slideUp') {
				this.frontHeader.removeClass('hide');
				this.isFrontHeaderAnimating = true;
				if(Modernizr.csstransitions) {
					setTimeout(function() {
						self.site_container.removeClass('slideDown');
						jQuery('html,body').animate({'scrollTop': '0px' },800,'swing');
						setTimeout(function() {
							self.site_container.removeClass('slideCrack');
							self.isFrontHeaderAnimating = false;
						},900);
					},20);
				} else {
					this.frontHeader.find('.up-door').animate({'top': '0px'},800);
					this.frontHeader.find('.down-door').animate({'bottom': '0px'},800);
					setTimeout(function() {
						self.site_container.removeClass('slideCrack');
						self.isFrontHeaderAnimating = false;
					},900);
				}
			}
		},

		scrollAnimation: function() {
			var preScrollTop = (this.currentScrollTop ? this.currentScrollTop : 0);
			if(jQuery(window).scrollTop() >= this.windowHeight) {
				if(this.site_container.hasClass('slideDown')) {
					this.site_container.addClass('slideDown');
					this.frontHeader.addClass('hide');
				}
			} else {
				if(this.isFrontHeaderAnimating !== true) {
					if(jQuery(window).scrollTop() < preScrollTop) {
						this.scrollFrontHeader('slideUp');
					} else {
						this.scrollFrontHeader('slideDown');
					}
				}
			}
			this.currentScrollTop = jQuery(window).scrollTop();
			if(Modernizr.canvas) {
				this.scrollSvnAnimation(this.currentScrollTop, parseInt( Math.abs( this.currentScrollTop - preScrollTop ) * 3 ) );
			}
		},

		scrollSvnAnimation: function(pos,duration) {
			var self = this;
			if(this.section_subtitle_svg_animate.length < 1) return;
			for(var i=0; i<this.section_subtitle_svg_animate.length; i++) {
				var item = this.section_subtitle_svg_animate[i];
				if(item.position.length > 0) {
					if( item.position[0].pos >= pos ) {
						var attrs = [];
						for(var k=0; k<item.position[0].attr.length; k++) {
							attrs.push(item.position[0].attr[k][0]);
							attrs.push(item.position[0].attr[k][1]);
						}
						item.polygon.attr("points",attrs);
					} else if( item.position[(item.position.length-1)].pos <= pos ){
						var attrs = [];
						for(var k=0; k<item.position[(item.position.length-1)].attr.length; k++) {
							attrs.push(item.position[(item.position.length-1)].attr[k][0]);
							attrs.push(item.position[(item.position.length-1)].attr[k][1]);
						}
						item.polygon.attr("points",attrs);
					} else {
						for(var j=0; j<item.position.length; j++) {
							if( j > 0 && item.position[j].pos > pos && item.position[j-1].pos < pos ) {
								var attrs = [];
								var ratio = ( pos - item.position[(j-1)].pos ) / ( item.position[j].pos - item.position[(j-1)].pos );
								for(var k=0; k<item.position[j].attr.length; k++) {
									attrs.push( parseInt( item.position[(j-1)].attr[k][0] + ( ( item.position[j].attr[k][0] - item.position[(j-1)].attr[k][0] ) * ratio ) ) );
									attrs.push( parseInt( item.position[(j-1)].attr[k][1] + ( ( item.position[j].attr[k][1] - item.position[(j-1)].attr[k][1] ) * ratio ) ) );
								}
								item.polygon.animate({'points': attrs},duration,mina.linear);
							} else if( item.position[j].pos == pos ) {
								var attrs = [];
								for(var k=0; k<item.position[j].attr.length; k++) {
									attrs.push(item.position[j].attr[k][0]);
									attrs.push(item.position[j].attr[k][1]);
								}
								item.polygon.animate({"points": attrs},duration,mina.linear);
							}
						}
					}
				}
			}
		},

		videoPlay: function() {
			var self = this;
			var CanVideoPlay = false;
			if(this.video.length > 0) {
				this.video.find('source').each(function(i) {
					var type = jQuery(this).attr('type');
					switch(type) {
						case 'video/webm':
							CanVideoPlay = (CanVideoPlay || Modernizr.video.webm);
							break;
						case 'video/mp4':
							CanVideoPlay = (CanVideoPlay || Modernizr.video.h264);
							break;
						case 'video/ogg':
							CanVideoPlay = (CanVideoPlay || Modernizr.video.ogg);
							break;
						default:
							break;
					}
				});
			}
			if(this.video.length > 0 && Modernizr.video && CanVideoPlay && !Modernizr.mobile ) {
				this.loading.addClass('show');
				if(this.video[0].readyState == 4) {
					this.loading.removeClass('show');
					this.video.addClass('display');
					this.video[0].play();
					setTimeout(function() {
						self.video_wrap.addClass('fadeOut');
						self.initCoverTitle();
					},4200);
				} else {
					this.video[0].onloadeddata  = function(e) {
						self.loading.removeClass('show');
						jQuery(this).addClass('display');
						this.play();
						setTimeout(function() {
							self.video_wrap.addClass('fadeOut');
							self.initCoverTitle();
						},4200);
					};
				}
				this.video[0].onended = function(e) {
					self.video_wrap.addClass('hidden');
				};
			} else {
				this.video_wrap.addClass('fadeOut');
				this.video_wrap.addClass('hidden');
				this.initCoverTitle();
			}
		},

		initCoverTitle: function() {
			var self = this;
			this.video_wrap.addClass('fadeOut');
			this.title.addClass('showIn');
			this.title.find('#jinbonet-slogan .slogan').addClass('animated bounceInUp');
			this.title.find('#jinbonet-title .letter').addClass('flip');
			if(Modernizr.csstransitions) {
				setTimeout(function() {
					self.openBtn.addClass('zoomIn');
					self.title.css({
						'transform': 'translate(0px,'+self.title_translatePos+'px)',
						'-webkit-transform': 'translate(0px,'+self.title_translatePos+'px)',
						'-moz-transform': 'translate(0px,'+self.title_translatePos+'px)',
						'-ms-transform': 'translate(0px,'+self.title_translatePos+'px)',
						'-o-transform': 'translate(0px,'+self.title_translatePos+'px)',
					})
					.attr('data-translate',self.title_translatePos);
					setTimeout(function() {
						self.title.addClass('clipped');
					},800);
				}, 2500);
			} else {
				this.openBtn.addClass('zoomIn');
				this.title.addClass('showIn').addClass('clipped');
			}
		}
	}

	$.fn.jinbo_front = function(options) {
		var jinbo_front = new jinboFront(options);
		return jinbo_front;
	};

})(jQuery);

jQuery(document).ready(function(e){
	jQuery.fn.jinbo_front({
		originHeader: {
			'width': 1920,
			'height': 1080
		},
		resizeLimit: {
			'width': 768,
			'height': 768
		},
		originTitle: {
			'width': 432,
			'height': 112
		},
		imageLogo: {
			'width': 341,
			'height': 242
		},
		frontHeadercrack: {
			'width': 15,
			'height': 2
		},
		header_diagonal_ratio: 0.259,
		openBtn_size: {
			'width': 150,
			'height': 85
		}
	});
});
