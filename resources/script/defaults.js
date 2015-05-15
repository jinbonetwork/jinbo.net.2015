jQuery(document).ready(function(e){
	jQuery('[data-height-mode]').resizeAny(function(element){
		jQuery(element).regHeight();
	});
});
