/* front theme */
jQuery(document).ready(function(e){
	var originHeaderWidth = 1920;
	var originHeaderHeight = 500;
	var resizeLimitWidth = 768;
	var resizeLimitHeight = 500;
	var originTitleWidth = 427;
	var originTitleHeight = 107;
    var width, height, largeHeader, video, title, canvas, canvas_width, bgimg, loading, ctx, points, target, animateHeader = true;
	var transEndEventNames = {
		'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
		'MozTransition'    : 'transitionend',      // only for FF < 15
		'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
	},
	transitionEnd = transEndEventNames[ Modernizr.prefixed('transition') ];

	function supports_video() {
		return !!document.createElement('video').canPlayType;
	}

	function large_header_resize() {
		var w_w = jQuery(window).width();
		var w_h = jQuery(window).height();
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
			if( w_w < resizeLimitWidth) {
				var v_w = parseInt( originTitleWidth - ( ( resizeLimitWidth - w_w ) * 0.337 ) );
				var v_h = parseInt( ( v_w * originTitleHeight ) / originTitleWidth );
				var p_h = parseInt(292 * height / 500);
			} else {
				var v_w = originTitleWidth;
				var v_h = originTitleHeight;
				var p_h = 292;
			}
			var v_w = title.outerWidth();
			title.css({
				'left': parseInt( ( width - v_w ) / 2)+'px',
				'top': p_h+'px'
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
	}

	video = jQuery('#large-header .animate-header-background-video');
	loading = jQuery('#large-header .loading');
	title = jQuery('#large-header h1');
	bgimg = jQuery('#large-header .animate-header-background-image');

	jQuery(window).resize(function(e) {
		large_header_resize();
	});
	large_header_resize();

    // Main
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
		bgimg.addClass('hidden');
		video[0].onloadeddata  = function(e) {
			loading.removeClass('show');
			jQuery(this).addClass('display');
			this.play();
		};
		video[0].onended = function(e) {
			title.addClass('show');
			title.find('#jinbonet-slogan .slogan').addClass('flip');
			title.find('#jinbonet-title .letter').addClass('flip');
			video.addClass('hidden');
			bgimg.removeClass('hidden');
			if(Modernizr.canvas) {
				if(transitionEnd) {
					title.find('#jinbonet-title .letter8').bind(transitionEnd,function(e) {
						initHeader();
						initAnimation();
						addListeners();
						jQuery(this).unbind(transitionEnd);
					});
				} else {
					setTimeout(function() {
						initHeader();
						initAnimation();
						addListeners();
					}, 800);
				}
			}
		};
	} else {
		title.addClass('show');
		title.find('#jinbonet-slogan .slogan').addClass('flip');
		title.find('#jinbonet-title .letter').addClass('flip');
		video.addClass('hidden');
		if(Modernizr.canvas) {
			if(transitionEnd) {
				title.find('#jinbonet-title .letter8').bind(transitionEnd,function(e) {
					initHeader();
					initAnimation();
					addListeners();
					jQuery(this).unbind(transitionEnd);
				});
			} else {
				setTimeout(function() {
					initHeader();
					initAnimation();
					addListeners();
				}, 800);
			}
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
        window.addEventListener('resize', large_header_resize);
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
