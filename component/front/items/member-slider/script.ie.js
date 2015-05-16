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
		resizeReInit: true,
		onInit: function(swiper) {
			resizejGallery();
		}
	});
	
	jQuery('.swiper-container.slider-gallery .swiper-button-prev').click(function(e) {
		jGallerySwiper.swipePrev();
	});
	jQuery('.swiper-container.slider-gallery .swiper-button-next').click(function(e) {
		jGallerySwiper.swipeNext();
	});

	function resizejGallery() {
		var maxH = 0;
		jQuery('.swiper-container.slider-gallery .swiper-slide article').each(function(i) {
			var h = jQuery(this).outerHeight();
			if(h > maxH) maxH = h;
		});
		jQuery('.swiper-container.slider-gallery .swiper-wrapper').height(maxH);
		jQuery('.swiper-container.slider-gallery .swiper-wrapper .swiper-slide').height(maxH);
		jQuery('.swiper-container.slider-gallery .swiper-button-prev').css({
			'top' : parseInt( ( maxH - jQuery('.swiper-container.slider-gallery .swiper-button-prev').height() ) / 2 )+'px'
		});
		jQuery('.swiper-container.slider-gallery .swiper-button-next').css({
			'top' : parseInt( ( maxH - jQuery('.swiper-container.slider-gallery .swiper-button-next').height() ) / 2 )+'px'
		});
	}

	if(window.respond){
		var rspListen = setInterval(function(){
			if(!window.respond.queue.length){
				resizejGallery();
				clearInterval(rspListen);
			}
		}, 10);
	} else {
		resizejGallery();
	}
});
