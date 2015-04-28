/* front theme */
jQuery(document).ready(function(e){
	function front_resize() {
		w = jQuery(window).width();
		h = jQuery(window).height();
		jQuery('#jinbo-section-1').height(h);
	}

	jQuery(window).resize(function(e) {
		front_resize();
	});
	front_resize();
});
