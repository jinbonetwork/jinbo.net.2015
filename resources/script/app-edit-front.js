(function($){
	/*
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
	*/

	$.fn.edit = function(){
		this.each(function(){
			var ancestors = $(this).parents('.section-edit, .row-edit, .col-edit');
			var prevSiblings = $(this).prevAll('.section-edit, .row-edit, .col-edit');
			console.log($(this).attr('class') + ' : ' + (ancestors.length + 1) + ', ' + (prevSiblings.length + 1));
		});
	}

	$(document).ready(function(){
		//$('#front-section-container').jbPageEditor();
		$.ajax({
			url: '../files/cache/front_section.json',
			dataType: 'json',
			async: false,
			success: function(data){
				//var isec = 3;
				//var index = 
				for(var key in data){
					console.log(key + ' : ' + data[key]);
				};
			},
		});

		$('.section-edit, .row-edit, .col-edit').edit();

	});
})(jQuery);



//old code ////
/* 
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
*/
