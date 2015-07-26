(function($) {
	function autoFontSize(element,options) {
		var self = this;

		this.settings = jQuery.extend({}, options);

		if(this.settings.fontsize.match(/em$/i)) {
			this.type = 'em';
		} else if(this.settings.fontsize.match(/px$/i)) {
			this.type = 'px';
		} else {
			this.type = 'px';
		}

		this.root = jQuery(element);
		this.element = this.root.find(this.settings.selector);

		jQuery(window).resize(function(e) {
			self.waitSetSize();
		});
		this.waitSetSize();
	}

	autoFontSize.prototype = {
		waitSetSize: function() {
			var self = this;
			if(window.respond && window.respond.queue.length != 0){
				setTimeout(function() { self.waitSetSize(); }, 50);
			} else {
				setTimeout(function() { self.setSize(); },50);
			}
		},

		setSize: function() {
			var self = this;

			this.width = this.root.width();
			if(this.width < this.settings.minWidth) {
				var ratio = parseFloat( ( this.width / this.settings.minWidth ) ) * 1.2;
				var curFontSize = parseFloat( this.settings.fontsize ) * ratio;
				this.element.css({
					'font-size': curFontSize+self.type
				});
			} else {
				var curFontSize = parseFloat( this.settings.fontsize );
				this.element.css({
					'font-size': curFontSize+self.type
				})
			}
		}
	}

	jQuery.fn.auto_fontsize = function(options) {
		return this.each(function() {
			var afs = new autoFontSize(jQuery(this),options);
			jQuery(this).data('autoFontSize',afs);
		});
	}
})(jQuery);
