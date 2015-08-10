(function($){
	var winWidth = jQuery(window).width();
	jQuery.fn.article_gallery_resize = function(options) {
		var maxHeight = 0;
		jQuery(this).children('li.article-gallery-article').each(function(i) {
			var h = jQuery(this).find('.article-gallery-article-content').height();
			if(h > maxHeight) maxHeight = h;
			if(winWidth >= 960) {
				var oe = ( parseInt( i / 4 ) % 2 );
			} else if(winWidth >= 768) {
				var oe = ( parseInt( i / 3 ) % 2 );
			} else if(winWidth >= 640) {
				var oe = ( parseInt( i / 2 ) % 2 );
			} else {
				var oe = ( i % 2 );
			}
			console.log(i);
			console.log(oe);
			if(oe == 0) {
				jQuery(this).removeClass('even').addClass('odd');
			} else {
				jQuery(this).removeClass('odd').addClass('even');
			}
		});
		jQuery(this).find('li.article-gallery-article .article-gallery-article-content').height(maxHeight);
	};
})(jQuery);

jQuery(document).ready(function() {
	jQuery('article.article-gallery ul.article-gallery-container').article_gallery_resize();
	jQuery(window).resize(function(e) {
		jQuery('article.article-gallery ul.article-gallery-container').article_gallery_resize();
	});
});
