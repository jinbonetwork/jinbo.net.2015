(function($) {
	function centerIconHeaderOverLink(element) {
		var self = this;

		this.root = jQuery(element);
		this.element = this.root.find('.feature .inner');
		this.header = this.element.find('.header');
		this.h3 = this.element.find('.header h3');
		this.overlink = this.element.find('.overlink');
		this.isHover = false;
		this.hoverAnimating = false;

		if(Modernizr.touch) {
			this.root.addClass('is-touch');
		} else {
			this.root.addClass('is-pc');
		}

		jQuery(window).resize(function(e) {
			self.resize();
		});
		this.resize();

		if(this.root.hasClass('is-touch')) {
			this.header.find('a').bind('click',function(e) {
				e.preventDefault();
			});
			this.overlink.find('p a').bind('click',function(e) {
				e.preventDefault();
			});
		} else {
			this.root.mouseenter(function(e) {
				self.hover();
			});
			this.root.mouseleave(function(e) {
				self.unhover();
			});
		}
		var fs = this.header.find('i').css('font-size');
		this.root.auto_fontsize({
			selector: '.header i',
			minWidth: 300,
			fontsize: fs
		});
	}

	centerIconHeaderOverLink.prototype = {
		resize: function() {
			this.root_height = this.root.innerHeight();
			this.height = this.element.outerHeight();
			this.header_height = this.header.outerHeight();
			this.h3_height = this.h3.outerHeight();
			this.overlink_height = this.overlink.outerHeight();
			if(this.root.hasClass('is-touch')) {
				this.marginTop = 0;
			} else {
				this.marginTop = parseInt( ( this.height - this.header_height ) / 2 );
			}

			this.element.css({
				'top': this.marginTop+'px'
			});
		},

		hover: function() {
			var self = this;
			this.hoverAnimating = true;
			var pos = parseInt( ( this.overlink_height - this.h3_height ) / 2)
			if( Modernizr.csstransitions ) {
				this.element.css({
					'transform': 'translateY(-'+pos+'px)',
					'-webkit-transform': 'translateY(-'+pos+'px)',
					'-moz-transform': 'translateY(-'+pos+'px)',
					'-ms-transform': 'translateY(-'+pos+'px)',
					'-o-transform': 'translateY(-'+pos+'px)'
				});
				this.overlink.css({
					'transform': 'translateY(-'+this.h3_height+'px)',
					'-webkit-transform': 'translateY(-'+this.h3_height+'px)',
					'-moz-transform': 'translateY(-'+this.h3_height+'px)',
					'-ms-transform': 'translateY(-'+this.h3_height+'px)',
					'-o-transform': 'translateY(-'+this.h3_height+'px)'
				});
				setTimeout(function() {
					self.hoverAnimating = false;
					self.isHover = true;
				},800);
			} else {
				this.element.css({
					'top': ( this.marginTop - pos )+'px'
				});
				this.overlink.css({
					'top': '-'+this.h3_height+'px'
				});
				this.hoverAnimating = false;
				this.isHover = true;
			}
		},

		unhover: function() {
			var self = this;
			this.hoverAnimating = true;
			if( Modernizr.csstransitions ) {
				this.element.css({
					'transform': 'translateY(0)',
					'-webkit-transform': 'translateY(0)',
					'-moz-transform': 'translateY(0)',
					'-ms-transform': 'translateY(0)',
					'-o-transform': 'translateY(0)'
				});
				this.overlink.css({
					'transform': 'translateY(0)',
					'-webkit-transform': 'translateY(0)',
					'-moz-transform': 'translateY(0)',
					'-ms-transform': 'translateY(0)',
					'-o-transform': 'translateY(0)'
				});
				setTimeout(function() {
					self.hoverAnimating = false;
					self.isHover = true;
				},800);
			} else {
				this.element.css({
					'top': '0'
				});
				this.overlink.css({
					'top': '0'
				});
				this.hoverAnimating = false;
				this.isHover = false;
			}
		}
	}

	jQuery.fn.center_Icon_Header_OverLink = function() {
		return this.each(function() {
			var center_Icon_Header_OverLink = new centerIconHeaderOverLink(jQuery(this));
			jQuery(this).data('center_Icon_Header_OverLink',center_Icon_Header_OverLink);
		});
	}
})(jQuery);

jQuery(function() {
	jQuery('.center-icon-headline-overlink').center_Icon_Header_OverLink();
});
