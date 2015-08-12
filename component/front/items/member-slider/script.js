jQuery(function(){
	function getslidesPerView() {
		var w = jQuery(window).width();
		if(w >= 768) var v = 3;
		else if(w >= 480) var v = 2;
		else v = 1;

		return v;
	}
	var slidesPerView = getslidesPerView();
	var jGallerySwiper = jQuery('.member-slider .swiper-container.slider-gallery').swiper({
		mode:'horizontal',
		loop: true,
		centeredSlides: true,
		slidesPerView: slidesPerView,
		loopedSlides: 5,
		nextButton: '.swiper-container.slider-gallery .swiper-button-next',
		prevButton: '.swiper-container.slider-gallery .swiper-button-prev'
	});

	jQuery('.member-slider .swiper-container.slider-gallery .swiper-slide .portrait a').imagefill();

	jQuery(window).resize(function(e) {
		if(jQuery(window).width() < 758) {
			jGallerySwiper.params.slidesPerView = getslidesPerView();
		}
	});
});
