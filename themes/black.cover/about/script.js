(function ($) {
	function jinboAbout(options) {
		var self = this;

		this.settings = jQuery.extend({}, options);
		this.windowWidth = 0;
		this.windowHeight = 0;
		this.members = jQuery('.section.about-members');

		jQuery(window).resize(function(e) {
			self.about_resize();
		});
		this.about_resize();
	}

	jinboAbout.prototype = {
		about_resize: function() {
			var self = this;
			if(this.members.length > 0) {
				var h = (this.members.outerWidth() / 2) * (this.settings.ratio);
				this.members.find('.center-card .background').height(h);
			}
		}
	}

	jQuery.fn.jinbo_about = function(options) {
		var jinbo_about = new jinboAbout(options);
		return jinbo_about;
	};
})(jQuery);

jQuery(document).ready(function(e){
	jQuery.fn.jinbo_about({
		ratio: '0.2'
	});
});
