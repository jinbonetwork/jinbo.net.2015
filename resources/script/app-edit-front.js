(function($){
	$(document).ready(function(){
		$('#editpage-container').editPage();
	});
})(jQuery);

(function($){
	$.fn.editPage = function(url){
		var $container = $(this);
		var url = $(this).attr('url');
		jQuery.ajax({
			url: url,
			dataType: 'json',
			//async: false,
			success: function(divData){
				//console.log(divData);
				//console.log(divData.section2.data.data[0].class.join(' '));
				console.log(makeMarkup(divData.section2.data, 'rows'));
			}
		});
	}
	
	function makeMarkup(divData, template){
		if(divData.type == 'division'){
			var classes = ''; if(divData.class){ classes = ' ' + divData.class.join(' '); }
			var childDivData = ''; 
			$.each(divData.data, function(i, vale){
				childDivData += makeMarkup(value, divData.template);
			});
			var html;
			if(template == 'rows') html = '<div class="row">' + childDivData + '</div>';
			else if(template == 'cols') html = '<div class="' + classes + '">' + childDivData + '</div>';
			return '<div class="row">' + html + '</div>';
		} else if(divData.type == 'item'){
			var classes = '';  if(divData.class){ classes = ' ' + divData.class.join(' '); }
			var attr = ''; $.each(divData.attr, function(key, value){ attr += key + ' = "' + value + '" '; });
			var html = '<div class="' + class + '"></div>';
			if(template == 'rows'){
				return '<div class="row">' + html + '</div>';
			} else if(template == 'cols'){
				return html;
			}
		}
	}
})(jQuery);
