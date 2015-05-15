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
			var path = getIndex(this);
			$(this).parents('.section-edit, .row-edit, .col-edit').each(function(){
				path = getIndex(this) + '-' + path;
			});
			//console.log(path + ' : ' + $(this).attr('class'));
		});
	}

	function getIndex(obj){
		var prevSiblings = $(obj).prevAll('.section-edit, .row-edit, .col-edit');
		return prevSiblings.length;
	}

	$(document).ready(function(){
		//$('#front-section-container').jbPageEditor();
		$.ajax({
			url: '../files/cache/front_section.json',
			dataType: 'json',
			async: false,
			success: function(divData){
				var path = '1-0-1-0-0-0';
				path = path.split('-');
				divData = getSection(divData, path[0]);
				//console.log(divData);
				
				divData = divData.data;
				//console.log(divData);

				divData = divData.data[path[2]];
				//console.log(divData);

			},
		});

		$('.section-edit, .row-edit, .col-edit').edit();

	});

	function getSection(data, index){
		var i = 0;
		for(var key in data){
			if(i == index){
				return data[key];
			}
			i++;
		};
	}
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
