jQuery(function(){
	jQuery('.member-slider').each(function(i) {
		var $element = jQuery(this);
		$element.find('.swiper-slide').each(function(j) {
			var indicator = $element.find('.slider-indicator ul.swiper-wrapper');
			var title = jQuery(this).find('h3').text();
			indicator.append('<li class="swiper-slide" data-index="'+(j+1)+'"><span>'+title+'</span></li>');
		});
	});
	var jGallerySwiper = jQuery('.swiper-container.slider-gallery').swiper({
		mode:'horizontal',
		nextButton: '.swiper-button-next',
		prevButton: '.swiper-button-prev'
	});
	var indicatorSwiper = jQuery('.swiper-container.slider-indicator').swiper({
		centeredSlides: true,
		slidesPerView: 'auto',
		touchRatio: 0.2,
		slideToClickedSlide: true
	});
	if(typeof(jGallerySwiper) !== 'undefined' && typeof(indicatorSwiper) !== 'undefined') {
		jGallerySwiper.params.control = indicatorSwiper;
		indicatorSwiper.params.control = jGallerySwiper;
	}
});
