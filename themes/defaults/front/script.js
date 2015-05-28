/* front theme */
jQuery(document).ready(function(e){
	var originHeaderWidth = 1920;
	var originHeaderHeight = 500;
	var resizeLimitWidth = 768;
	var resizeLimitHeight = 500;
	var originTitleWidth = 427;
	var originTitleHeight = 107;
	var windowHeight, width, height, largeHeader, video, title, canvas, canvas_width, bgimg, openBtn, loading, ctx, points, target, animateHeader = true, currentScrollTop=0;
	var frontHeader;
	var section_container;
	var isFrontHeaderAnimating = false;
	var transEndEventNames = {
		'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
		'MozTransition'    : 'transitionend',      // only for FF < 15
		'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
	},
	transitionEnd = transEndEventNames[ Modernizr.prefixed('transition') ];
	transition = Modernizr.prefixed('transition');
	transform = Modernizr.prefixed('transform');

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

	function front_resize() {
		var w_w = jQuery(window).width();
		var w_h = jQuery(window).height();
		windowHeight = w_h;
		currentScrollTop = jQuery(window).scrollTop();

		var top_door_points = "0 0,"+w_w+" 0,"+w_w+" "+parseInt(jQuery('#front-header .up-door').outerHeight() * 0.78)+",0 "+jQuery('#front-header .up-door').outerHeight();
		jQuery('svg clipPath#top-door-clip polygon').attr('points',top_door_points);
		jQuery('#front-header .down-door .before').css({
			'top': '-'+parseInt(jQuery('#front-header .up-door').outerHeight() * 0.22)+'px',
			'border-bottom': parseInt(jQuery('#front-header .up-door').outerHeight() * 0.22)+'px solid #fff',
			'border-left': w_w+'px solid transparent'
		});

		if(w_w > originHeaderWidth) {
			width = originHeaderWidth;
			height = originHeaderHeight;
			var leftPos = 0;
		} else if( w_w <= originHeaderWidth && w_w >= resizeLimitWidth) {
			width = originHeaderWidth;
			height = originHeaderHeight;
			var leftPos = parseInt( ( w_w - originHeaderWidth ) / 2 );
		} else {
			height = parseInt( ( w_w * resizeLimitHeight ) / resizeLimitWidth );
			width = parseInt( ( height * originHeaderWidth ) / originHeaderHeight );
			var leftPos = parseInt( ( w_w - width ) / 2 );
		}
		jQuery('.animateheader-container').css({'height': height+'px'});
		jQuery('.animateheader-container .animateheader-wrap').css({
			'width': width+'px',
			'height': height+'px',
			'left': leftPos+'px'
		});
		loading.css({
			'left': parseInt( ( width - loading.outerWidth() ) / 2 )+'px',
			'top': parseInt( ( height - loading.outerHeight() ) / 2 )+'px'
		});
		if(title.length > 0) {
			var v_w = title.outerWidth();
			title.css({
				'left': parseInt( ( w_w - v_w ) / 2)+'px'
			});
		}
		if(bgimg.length > 0) {
			bgimg.css({ 'width': width+'px', 'height': height+'px' });
		}
		if(Modernizr.canvas) {
			canvas_width = (w_w > width ? width : w_w);
			canvas = document.getElementById('header-canvas');
			canvas.width = canvas_width;
			canvas.height = height;
			jQuery(canvas).css({
				'width': canvas_width+'px',
				'height': height+'px',
				'left': ( ( w_w > width ) ? 0 : parseInt( ( width - canvas_width ) / 2 ) )+'px'
			});
		}

		openBtn.css({
			'left': parseInt( ( w_w - openBtn.outerWidth() ) / 2 )+'px',
			'top': parseInt( ( w_h - openBtn.outerHeight() ) / 2 )+'px'
		});
		section_container.css({
			'margin-top': windowHeight+'px'
		});
		var sections = jQuery('.section');
		sections.each(function(i) {
			$this = jQuery(this);
			if($this.find('.sub-title').length > 0) {
				var _section_pos = parseInt($this.offset().top - windowHeight) + parseInt($this.css('padding-top')) + $this.find('.sub-title').outerHeight();
				var _section_height = windowHeight;
				if(Modernizr.canvas) {
					var _svg_element = $this.find('svg#'+$this.attr('id')+'-svg');
					if(_svg_element.length < 1) {
						var _svg_element = jQuery('<svg id="'+$this.attr('id')+'-svg"></svg>');
						var _svg_element_wrapper = jQuery('<div class="sub-title-animate"></div>');
						_svg_element.appendTo(_svg_element_wrapper);
						_svg_element_wrapper.prependTo($this);
					} else {
						var _svg_element_wrapper = $this.find('.sub-title-animate');
					}
					svg_width = ( w_w >= 1024 ? 700 : parseInt( 700 * w_w / 1024 ) );
					svg_height = parseInt(300 * svg_width / 700);
					_svg_element_wrapper.css({
						'left': parseInt( ( w_w - svg_width ) / 2)+'px'
					});
					var _svg = SVG($this.attr('id')+'-svg').size( svg_width, svg_height );
					var _polygon = _svg.polygon('0,0 0,0 0,0 0,0');
					var _pattern = _svg.image('themes/defaults/images/halftone_background.png');
					_pattern.size( svg_width, svg_height ).y(0);
					_pattern.clipWith(_polygon);
					_polygon_attr = {};
					_polygon_attr["data-"+_section_pos] = "@points:	0,0 "+parseInt( 623 * svg_width / 700 )+","+parseInt( 40 * svg_height / 300 )+" "+parseInt( 675 * svg_width / 700 )+","+parseInt( 234 * svg_height / 300 )+" "+parseInt( 160 * svg_width / 700 )+","+parseInt( 163 * svg_height / 300 );
					_polygon_attr["data-"+( _section_pos + parseInt( _section_height / 4 ) )] = "@points:	"+parseInt( 146 * svg_width / 700 )+",0 "+parseInt( 692 * svg_width / 700 )+","+parseInt( 20 * svg_height / 300 )+" "+parseInt( 643 * svg_width / 700 )+","+parseInt( 198 * svg_height / 300 )+" "+parseInt( 8 * svg_width / 700 )+","+parseInt( 273 * svg_height / 300 );
					_polygon_attr["data-"+( _section_pos + parseInt( ( _section_height * 2 ) / 4 ) )] = "@points:	"+parseInt( 26 * svg_width / 700 )+",0 "+parseInt( 700 * svg_width / 700 )+","+parseInt( 83 * svg_height / 300 )+" "+parseInt( 608 * svg_width / 700 )+","+parseInt( 234 * svg_height / 300 )+" "+parseInt( 90 * svg_width / 700 )+","+parseInt( 202 * svg_height / 300 );
					_polygon_attr["data-"+( _section_pos + parseInt( ( _section_height * 3 ) / 4 ) )] = "@points:	"+parseInt( 289 * svg_width / 700 )+","+parseInt( 120 * svg_height / 300 )+" "+parseInt( 456 * svg_width / 700 )+","+parseInt( 148 * svg_height / 300 )+" "+parseInt( 325 * svg_width / 700 )+","+parseInt( 172 * svg_height / 300 )+" "+parseInt( 223 * svg_width / 700 )+","+parseInt( 132 * svg_height / 300 );
					_polygon_attr["data-"+( _section_pos + _section_height )] = "@points: "+parseInt( 350 * svg_width / 700 )+","+parseInt( 140 * svg_height / 300 )+" "+parseInt( 350 * svg_width / 700 )+","+parseInt( 140 * svg_height / 300 )+" "+parseInt( 350 * svg_width / 700 )+","+parseInt( 140 * svg_height / 300 )+" "+parseInt( 350 * svg_width / 700 )+","+parseInt( 140 * svg_height / 300 );
					_polygon.attr(_polygon_attr);
				} else {
				}
			}
		});
		var s_services = jQuery('.section.jinbonet-services');
		var s_services_width = s_services.outerWidth();
		var s_services_height = s_services.outerHeight() - parseInt(s_services.css('margin-bottom')) - parseInt(s_services.css('margin-top'));
		s_services.find('.before').css({
			'top': '-'+parseInt(s_services_height * 0.05)+'px',
			'border-bottom': parseInt(s_services_height * 0.05)+'px solid #F7F7F5',
			'border-left': s_services_width+'px solid transparent'
		});

		var s_movement = jQuery('.section.movement-projects');
		var s_movement_width = s_movement.outerWidth();
		var s_movement_height = s_movement.outerHeight() - parseInt(s_movement.css('margin-bottom')) - parseInt(s_movement.css('margin-top'));
		s_movement.find('.before').css({
			'top': '-'+parseInt(s_movement_height * 0.05)+'px',
			'border-bottom': parseInt(s_movement_height * 0.05)+'px solid #FFFA9F',
			'border-left': s_movement_width+'px solid transparent'
		});
		s_movement.find('.after').css({
			'bottom': '-'+parseInt(s_movement_height * 0.05)+'px',
			'border-top': parseInt(s_movement_height * 0.05)+'px solid #FFFA9F',
			'border-left': s_movement_width+'px solid transparent'
		});
	}

	video = jQuery('#large-header .animate-header-background-video');
	loading = jQuery('#large-header .loading');
	title = jQuery('h1#jinbonet-main-logo');
	bgimg = jQuery('#large-header .animate-header-background-image');
	frontHeader = jQuery('#front-header');
	openBtn = frontHeader.find('.open-door');
	openBtn.click(function(e) {
		scrollFrontHeader('slideDown');
	});
	section_container = jQuery('#front-section-container');

	jQuery(window).resize(function(e) {
		front_resize();
	});
	front_resize();

	if(transform) {
		var skr = skrollr.init();
		var wow = new WOW().init();
	}

	jQuery(window).on('scroll', function(e) {
		scrollAnimation();
	});

	function scrollFrontHeader(opt) {
		if(opt == 'slideDown') {
			if(!jQuery('#site-main-container').hasClass('slideDown')) {
				isFrontHeaderAnimating = true;
				setFrontHeader(windowHeight,800,function() { jQuery('#site-main-container').addClass('slideDown'); frontHeader.addClass('hide'); isFrontHeaderAnimating = false; });
				jQuery('html,body').animate({'scrollTop': (windowHeight + 20)+'px' },800,'swing',function() { isFrontHeaderAnimating = false; });
			}
		} else if(opt == 'slideUp') {
			frontHeader.removeClass('hide');
			isFrontHeaderAnimating = true;
			setTimeout(function() {
				setFrontHeader(0,800,function() { jQuery('#site-main-container').removeClass('slideDown'); isFrontHeaderAnimating = false; });
				jQuery('html,body').animate({'scrollTop': '0px' },800,'swing',function() { isFrontHeaderAnimating = false; });
			},20);
		}
	}

	function setFrontHeader(pos,duration,callback) {
		if(transform) {
			frontHeader.find('.up-door').css({
				transition : Modernizr.prefixed('transform')+' '+duration+'ms',
				transform : 'translateY(-'+pos+'px)'
			});
			frontHeader.find('.down-door').css({
				transition: Modernizr.prefixed('transform')+' '+duration+'ms',
				transform: 'translateY('+pos+'px)'
			});
			if(typeof callback === 'function') {
				setTimeout(function() {
					callback();
				},duration);
			}
		} else {
			if(duration) {
				frontHeader.find('.up-door').animate({'top': '-'+pos+'px'},duration,function() {
					if(typeof callback === 'function') {
						callback();
					}
				});
				frontHeader.find('.down-door').animate({'bottom': '-'+pos+'px'},duration,function() {
					if(typeof callback === 'function') {
						callback();
					}
				});
			} else {
				frontHeader.find('.up-door').css({
					'top': '-'+pos+'px'
				});
				frontHeader.find('.down-door').css({
					'bottom': '-'+pos+'px'
				});
				if(typeof callback === 'function') {
					callback();
				}
			}
		}
		frontHeader.find('.door-background').css({
			transition : 'opacity '+duration+'ms',
			'opacity' : (1 - (pos / windowHeight)),
			'filter': 'alpha(opacity='+( 100 - parseInt( ( pos / windowHeight ) * 100 ) )+')',
			'-ms-filter': '"progid:DXImageTransform.Microsoft.Alpha(Opacity='+( 100 - parseInt( ( pos / windowHeight ) * 100 ) )+')"'
		});
		openBtn.css({
			transition : 'opacity '+duration+'ms',
			'opacity' : (1 - (pos / windowHeight)),
			'filter': 'alpha(opacity='+( 100 - parseInt( ( pos / windowHeight ) * 100 ) )+')',
			'-ms-filter': '"progid:DXImageTransform.Microsoft.Alpha(Opacity='+( 100 - parseInt( ( pos / windowHeight ) * 100 ) )+')"'
		});
		section_container.css({
			transition : 'opacity '+duration+'ms',
			'opacity': (pos / windowHeight),
			'filter': 'alpha(opacity='+parseInt( ( pos / windowHeight ) * 100 )+')',
			'-ms-filter': '"progid:DXImageTransform.Microsoft.Alpha(Opacity='+parseInt( ( pos / windowHeight ) * 100 )+')"'
		});
	}

	function scrollAnimation() {
		if(isFrontHeaderAnimating !== true) {
			if(jQuery(window).scrollTop() > windowHeight) {
				jQuery('#site-main-container').addClass('slideDown');
				frontHeader.addClass('hide');
			} else {
				jQuery('#site-main-container').removeClass('slideDown');
				frontHeader.removeClass('hide');
				setFrontHeader(jQuery(window).scrollTop(),0,null);
			}
		}
		currentScrollTop = jQuery(window).scrollTop();
	}

	var scrollSpeedMonitor = new ScrollSpeedMonitor(function (speedInPxPerMs, timeStamp, newDirection)
	{
		if(currentScrollTop < windowHeight) {
			if(isFrontHeaderAnimating !== true) {
				if(speedInPxPerMs >= 2) {
					if(newDirection === 'up') {
						scrollFrontHeader('slideDown');
					} else if(newDirection === 'down') {
						scrollFrontHeader('slideUp');
					}
				}
			}
		}
	});

	var CanVideoPlay = false;
	if(video.length > 0) {
		var CanVideoPlay
		video.find('source').each(function(i) {
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
	if(video.length > 0 && Modernizr.video && CanVideoPlay && !Modernizr.mobile ) {
		loading.addClass('show');
//		bgimg.addClass('hidden');
		if(video[0].readyState == 4) {
			loading.removeClass('show');
			video.addClass('display');
			video[0].play();
		} else {
			video[0].onloadeddata  = function(e) {
				loading.removeClass('show');
				jQuery(this).addClass('display');
				this.play();
			};
		}
		video[0].onended = function(e) {
			video.addClass('hidden');
//			bgimg.removeClass('hidden');
			initHeaderCanvasEvent();
			title.addClass('show');
			title.find('#jinbonet-slogan .slogan').addClass('animated bounceInUp');
			title.find('#jinbonet-title .letter').addClass('flip');
			setTimeout(function() {
				openBtn.addClass('zoomIn');
				title.addClass('slideDown');
			}, 2200);
		};
	} else {
		video.addClass('hidden');
		initHeaderCanvasEvent();
		title.addClass('show');
		title.find('#jinbonet-slogan .slogan').addClass('animated bounceInUp');
		title.find('#jinbonet-title .letter').addClass('flip');
		setTimeout(function() {
			openBtn.addClass('zoomIn');
			title.addClass('slideDown');
		}, 2200);
	}

	function initHeaderCanvasEvent() {
		if(Modernizr.canvas) {
			initHeader();
			initAnimation();
			addListeners();
		}
	}

	function initHeader() {
		largeHeader = document.getElementById('large-header');
		target = {x: canvas_width/2, y: height/2};

		canvas = document.getElementById('header-canvas');
		ctx = canvas.getContext('2d');

		// create points
		points = [];
		for(var x = 0; x < canvas_width; x = x + canvas_width/20) {
			for(var y = 0; y < height; y = y + height/20) {
				var px = x + Math.random()*canvas_width/20;
				var py = y + Math.random()*height/20;
				var p = {x: px, originX: px, y: py, originY: py };
				points.push(p);
			}
		}

		// for each point find the 5 closest points
		for(var i = 0; i < points.length; i++) {
			var closest = [];
			var p1 = points[i];
			for(var j = 0; j < points.length; j++) {
				var p2 = points[j]
				if(!(p1 == p2)) {
					var placed = false;
					for(var k = 0; k < 5; k++) {
						if(!placed) {
							if(closest[k] == undefined) {
								closest[k] = p2;
								placed = true;
							}
						}
					}

					for(var k = 0; k < 5; k++) {
						if(!placed) {
							if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
								closest[k] = p2;
								placed = true;
							}
						}
					}
				}
			}
			p1.closest = closest;
		}

		// assign a circle to each point
		for(var i in points) {
			var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
			points[i].circle = c;
		}
	}

	// Event handling
	function addListeners() {
		if(('onmousemove' in window)) {
			window.addEventListener('mousemove', mouseMove);
		}
		if(('ontouchstart' in window)) {
			window.addEventListener('touchstart', mouseMove);
		}
		window.addEventListener('scroll', scrollCheck);
	}

	function mouseMove(e) {
		var posx = posy = 0;
		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY)    {
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		target.x = posx;
		target.y = posy;
	}

	function scrollCheck() {
		if(document.body.scrollTop > height) animateHeader = false;
		else animateHeader = true;
	}

	// animation
	function initAnimation() {
		animate();
		for(var i in points) {
			shiftPoint(points[i]);
		}
	}

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,canvas_width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(255,255,255,'+ p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255,255,255,'+ _this.active+')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
});
