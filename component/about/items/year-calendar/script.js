(function($){
	jQuery.fn.year_calendar_resize = function(options) {
	    var winWidth = jQuery(window).width();

		jQuery(this).children('li.year-calendar-article').each(function(i) {
			if(winWidth >= 640) {
				var oe = ( parseInt( i / 4 ) % 2 );
				var idx = (i % 4);
				if(!idx) jQuery(this).removeClass('last').addClass('first');
				else if(idx == 3) jQuery(this).removeClass('first').addClass('last');
				else jQuery(this).removeClass('first').removeClass('last');
			} else {
				var oe = ( parseInt( i / 2 ) % 2 );
				var idx = (i % 2);
				if(!idx) jQuery(this).removeClass('last').addClass('first');
				else jQuery(this).removeClass('first').addClass('last');
			}
			if(oe == 0) {
				jQuery(this).removeClass('even').addClass('odd');
			} else {
				jQuery(this).removeClass('odd').addClass('even');
			}
		});
	};
})(jQuery);

jQuery(document).ready(function() {
	jQuery('article.year-calendar ul.year-calendar-container').year_calendar_resize();
	jQuery(window).resize(function(e) {
		jQuery('article.year-calendar ul.year-calendar-container').year_calendar_resize();
	});
});
