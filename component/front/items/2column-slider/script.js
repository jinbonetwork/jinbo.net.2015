jQuery(function(){
	var article_width = parseInt(jQuery('.two-column-slider-wrapper').innerWidth() / 2);
	var article_height = parseInt( ( article_width * 3 ) / 5 );
	jQuery('.two-column-gallery .swiper-slide').each(function(i) {
		var $this = jQuery(this);
		$this.css({
			'width': article_width+'px',
			'height': article_height+'px'
		});
		var $im  = $this.find('.featured img');
		if($im.length) {
			var t_img = new Image();
			t_img.onload = function() {
				$im.css({
					'left': parseInt( ( article_width - this.width ) / 2)+'px',
					'top': parseInt( ( article_height - this.height ) / 2)+'px'
				});
			}
			t_img.src = $im.attr('src');
		}
	});
	jQuery('.swiper-container.two-column-gallery').swiper({
		mode: 'horizontal',
		loop: true,
		slidesPerView: 2,
		nextButton: '.two-column-gallery .swiper-button-next',
		prevButton: '.two-column-gallery .swiper-button-prev'
	});
});
