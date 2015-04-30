(function (jQuery) {
	function JinboPageEditor(element,options) {
		var self = this;
		this.settings = $.extend({}, $.fn.jbPageEditor.defaults, options);

		this.Root = jQuery(element);
	};

	JinboPageEditor.prototype = {
		initEdit: function() {
			var Sections = Root.find('.section-edit');
			this.sections = [];
			Sections.each(function(idx) {
				var obj = {};
				var $this = jQuery(this); 
				obj.id = $this.attr('id');
				obj.layout = $this.attr('data-layout');
			});
		}
	};

	jQuery.fn.jbPageEditor = function(options) {
		return this.each(function() {
			var jPageEditor = new JinboPageEditor(jQuery(this),options);
		});
	};

	jQuery.fn.jbPageEditor.defaults = {
	}

	jQuery('#front-section-container').jbPageEditor();
})(jQuery);
