(function ($) {
	function JinboPageEditor(element,options) {
		var self = this;
		this.settings = $.extend({}, $.fn.jbPageEditor.defaults, options);

		this.Root = $(element);
	};

	JinboPageEditor.prototype = {
		initEdit: function() {
			var Sections = this.Root.find('.section-edit');
			this.sections = [];
			Sections.each(function(idx) {
				var obj = {};
				var $this = $(this); 
				obj.id = $this.attr('id');
				obj.layout = $this.attr('data-layout');
			});
		}
	};

	$.fn.jbPageEditor = function(options) {
		return this.each(function() {
			var jPageEditor = new JinboPageEditor($(this),options);
			jPageEditor.initEdit();
			console.log(jPageEditor.sections);
		});
	};

	$.fn.jbPageEditor.defaults = {
	}

})(jQuery);

jQuery(document).ready(function(){
	$('#front-section-container').jbPageEditor();
});
