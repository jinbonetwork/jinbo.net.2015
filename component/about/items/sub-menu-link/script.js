jQuery(document).ready(function() {
	jQuery('.overlay-link').overlay_link({
		button: '.overlay-button',
		overlay: '.overlay-content',
		onclick: function(){
			if(jQuery('header#site-header').hasClass('fixed') && !jQuery('header#site-header').hasClass('slideUp')) {
				jQuery('header#site-header').addClass('slideUp');
			}
		}
	});
});
