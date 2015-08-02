jQuery(document).ready(function() {
	jQuery('.about-top-menu .overlay-link').overlay_link({
		button: '.overlay-button',
		onclick: function(){
			if(jQuery('header#site-header').hasClass('fixed') && !jQuery('header#site-header').hasClass('slideUp')) {
				jQuery('header#site-header').addClass('slideUp');
			}
		}
	});
});
