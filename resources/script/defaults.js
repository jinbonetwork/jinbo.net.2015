jQuery(document).ready(function(e){
	jQuery('[data-height-mode]').resizeAny(function(element){
		jQuery(element).regHeight({
			"grid_columns": 12,
			"screen_xs_min": 320,
			"screen_sm_min": 480,
			"screen_md_min": 768,
			"screen_lg_min": 1024 
		});
	});
});

