(function($) {
	function twoColumnGallery(element,options) {
		var self = this;

		this.settings = jQuery.extend({}, options);
		this.root = jQuery(element);
		this.slider = this.root.find('.two-column-gallery');
		this.sliders = [];
		this.swiper = false;
		this.slider.find('.swiper-slide').each(function(i) {
			var obj = {};
			obj.item = jQuery(this);
			obj.filled = false;
			self.sliders.push(obj);
		});

		if(Modernizr.touch) {
			this.root.addClass('is-touch');
		} else {
			this.root.addClass('is-pc');
		}

		jQuery(window).resize(function(e) {
			self.resize();
		});
		this.resize();
	}

	twoColumnGallery.prototype = {
		resize: function() {
			var self = this;
			this.width = jQuery(window).width();
			this.height = jQuery(window).height();

			if(this.width > this.settings.breakpoint) {
				this.article_width = parseInt(this.root.innerWidth() / 2);
				this.article_height = 320;
			} else {
				this.article_width = parseInt(this.root.innerWidth() * 2 / 3);
				this.article_height = 300;
			}
			for(var i=0; i<this.sliders.length; i++) {
				var item = this.sliders[i].item;
				item.css({
					'width': self.article_width+'px',
					'height': self.article_height+'px'
				});
				if(this.sliders[i].filled === false) {
					item.find('.featured').imagefill();
					this.sliders[i].filled = true;
				}
			}
			this.initswiper()
		},

		initswiper: function() {
			var self = this;
			if(this.width > this.settings.breakpoint) {
				var $slidesPerView = '2';
			} else {
				var $slidesPerView = 'auto';
			}
			if(this.swiper === false) {
				this.swiper = this.slider.swiper({
					mode: 'horizontal',
					loop: true,
					slidesPerView: $slidesPerView,
					loopedSlides: 1,
					nextButton: '.two-column-gallery .swiper-button-next',
					prevButton: '.two-column-gallery .swiper-button-prev'
				});
			} else {
				this.swiper.params.slidesPerView = $slidesPerView;
			}
		}
	}

	jQuery.fn.two_gallery = function(options) {
		return this.each(function() {
			var tg = new twoColumnGallery(jQuery(this),options);
		});;
	}
})(jQuery);

jQuery(function(){
	jQuery('.two-column-slider-wrapper').two_gallery({
		breakpoint: 768	
	});
});
