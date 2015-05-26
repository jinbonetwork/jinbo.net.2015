jQuery(function(){
	jQuery('.slider-gallery .swiper-slide').each(function(j) {
		var indicator = jQuery(this).parents('.member-slider').find('.slider-indicator ul.swiper-wrapper');
		var title = jQuery(this).find('h3').text();
		indicator.append('<li class="swiper-slide" data-index="'+(j+1)+'"><span>'+title+'</span></li>');
	});
	var jGallerySwiper = jQuery('.member-slider .swiper-container.slider-gallery').swiper({
		mode:'horizontal',
		nextButton: '.swiper-container.slider-gallery .swiper-button-next',
		prevButton: '.swiper-container.slider-gallery .swiper-button-prev'
	});
	var indicatorSwiper = jQuery('.member-slider .swiper-container.slider-indicator').swiper({
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
