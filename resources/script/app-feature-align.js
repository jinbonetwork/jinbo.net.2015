(function($) {
	function FeaturedAlign(element) {
		var self = this;

		this.element = jQuery(element);
		var $im = this.element.find('img');
		this.waitautoHeightSize();
		if($im.length > 0) {
			$im.imagesLoaded( function(instance) {
				jQuery(instance.elements).each(function(i) {
					self.waitalignElement(jQuery(this));
				});
			});
		} else {
			this.waitalignElement(this.element.children().first());
		}

		jQuery(window).resize(function(e) {
			self.reFeaturedAlign();
		});
	}

	FeaturedAlign.prototype= {

		reFeaturedAlign: function() {
			var self = this;
			var $im = this.element.find('img');
			this.waitautoHeightSize();
			if($im.length > 0) {
				$im.each(function(i) {
					self.waitalignElement(jQuery(this));
				});
			} else {
				this.waitalignElement(this.element.children().first());
			}
		},

		waitautoHeightSize: function() {
			var self = this;
			if(window.respond && window.respond.queue.length != 0) {
				setTimeout(function() { self.waitautoHeightSize(); }, 50);
			} else {
				setTimeout(function() { self.autoHeightSize(); }, 200);
			}
		},

		autoHeightSize: function() {
			if(this.element.hasClass('auto-size')) {
				var totalHeight = this.element.parent().innerHeight();
				var otherHeight = 0;
				this.element.parent().children().each(function(i) {
					if( jQuery(this) != self.element ) {
						if( jQuery(this).css('position') != 'absolute' ) {
							otherHeight += jQuery(this).outerHeight(true);
						}
					}
				});
				this.element.height( totalHeight - otherHeight );
			}
		},

		waitalignElement: function($media) {
			var self = this;
			if(window.respond && window.respond.queue.length != 0) {
				setTimeout( function() { self.waitalignElement($media); }, 50 );
			} else {
				setTimeout( function() { self.alignElement($media); }, 200 );
			}
		},

		alignElement: function($media) {
			var $container = this.element;
			var align = $container.attr('data-align');
			$media.addClass('jfe-featured-align');
			if(align.match(/fill/g)) {
				$container.imagefill();
			} else {
				$container.css({
					'position' : 'relative',
					'overflow' : 'hidden'
				});
				var c_width = $container.innerWidth();
				var c_height = $container.innerHeight();
				var m_width = $media.innerWidth();
				var m_height = $media.innerHeight();
				var _align = align.split(" ");
				for(var i=0; i<_align.length; i++) {
					switch(_align[i]) {
						case 'center':
							$media.css({
								'position': 'absolute',
								'left': parseInt( ( c_width - m_width ) / 2)+'px',
								'right': 'auto'
							});
							break;
						case 'left':
							$media.css({
								'position': 'absolute',
								'left': 0,
								'right': 'auto'
							});
							break;
						case 'right':
							$media.css({
								'position': 'absolute',
								'right': 0,
								'left': 'auto'
							});
							break;
						case 'middle':
							$media.css({
								'position': 'absolute',
								'top': parseInt( ( c_height - m_height ) / 2 )+'px',
								'bottom': 'auto'
							});
							break;
						case 'top':
							$media.css({
								'position': 'absolute',
								'top': 0,
								'bottom': 'auto'
							});
							break;
						case 'bottom':
							$media.css({
								'position': 'absolute',
								'top': 'auto',
								'bottom': 0
							});
							break;
						default:
							if(i == 0) {
								if(_align[0].match(/%/)) {
									var _l = ( c_width * parseInt( _align[0].replace(/%/,'') ) / 100 );
								} else if(_align[0].match(/px/)) {
									var _l = parseInt( _align[0].replace(/px/,'') );
								} else {
									var _l = parseInt( _align[0] );
								}
								$media.css({
									'position' : 'absolute',
									'left': _l+'px',
									'right': 'auto'
								});
							} else if(i == 1) {
								if(_align[1].match(/%/)) {
									var _t = ( c_height * parseInt( _align[1].replace(/%/,'') ) / 100 );
								} else if(_align[0].match(/px/)) {
									var _t = parseInt( _align[1].replace(/px/,'') );
								} else {
									var _t = parseInt( _align[1] );
								}
								$media.css({
									'position' : 'absolute',
									'top': _t+'px',
									'bottom': 'auto'
								});
							}
							break;
					}
				}
			}
		}
	}

	jQuery.fn.featureAlign = function() {
		return this.each(function() {
			var featureAlign = new FeaturedAlign(jQuery(this));
			jQuery(this).data('featureAlign',featureAlign);
		});
	}
})(jQuery);

jQuery(function() {
	jQuery('.featured-align').featureAlign();
});
