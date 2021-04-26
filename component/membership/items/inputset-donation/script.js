(function($){
	function $id(selector, $obj){
		if($obj)
			return $obj.closest('.inputset-donation').find(selector);
		else
			return $('.inputset-donation').find(selector);
	}
	$(document).ready(function(){
		correctDonate();

		$id('input[type="text"][name="donation"]').blur(function(){
			$(this).parent().removeClass('focused');
			$id('.head', $(this)).removeClass('focused');
			correctDonate();
		}).focus(function(){
			$(this).parent().addClass('focused');
			$id('.head', $(this)).addClass('focused');
		}).keydown(function(event){
			if((48 <= event.which && event.which <= 57) || (96 <= event.which && event.which <= 105) || event.which == 8 ||
				event.which == 9 || event.which == 13 || event.which == 37 || event.which == 39){
				;//to do nothing
			} else {
				event.preventDefault();
			}
		}).keyup(function(event){
			if(event.which == 9 || event.which == 13 || event.which == 37 || event.which == 39){
				;//to do nothing
			} else {
				correctDonate();
			}
		});
		$id('span.read-money').click(function(){
			$id('input[name="donation"]').focus();
		});
	});
	function correctDonate(){
		var donation = $id('input[name="donation"]').val();
		donation = donation.replace(/[^\d]/g, '');

		for(var i = 0; i < donation.length; i++){
			if(donation[i] != '0'){
				donation = donation.substring(i);
				break;
			}
			else donation = donation.substring(i+1);
		}
		var viewDonate = '';
		var j = 0;
		for(var i = donation.length-1; i >= 0; i--){
			viewDonate = donation[i] + viewDonate;
			if((j+1) % 3 == 0 && i != 0) viewDonate = ',' + viewDonate;
			j++;
		}

		var $dummy = $('<span style="position: absolute; z-index: -100;"></span>').insertAfter('input[name="donation"]');
		var inputWidth = $dummy.css('font-size', $id('input[name="donation"]').css('font-size')).text(viewDonate).width() + 10;
		$id('input[name="donation"]').val(viewDonate).width(inputWidth);
		$dummy.remove();

		$id('span.read-money').text(readMoney(donation));
		var inputW = $id('input[name="donation"]').outerWidth();
		var spanW = $id('span.read-money').outerWidth();
		var wrapW = $id('.input-with-placeholder').width();
		var wDiff = wrapW - (inputW + spanW);
		$id('span.read-money').outerWidth(spanW + wDiff);
	}
	function readMoney(money){
		if(!money) return '';
		var units = ["원", "십", "백", "천", "만", "십", "백", "천", "억", "십", "백", "천", "조", "십", "백", "천"];
		if(money.length <= units.length){
			var read = "";
			var j = 0;
			for(var i = money.length-1; i >= 0; i--){
				read = money[i] + units[j] + read;
				j++;
			}

			var temp = "";
			var flags = "";
			j = -1;
			for(i = read.length-2; i >= 0; i -= 2){
				j++;
				if(read[i] == "0"){
				   if(j % 4 == 0){
					   temp = read[i+1] + temp;
					   if(j == 0) flags = "1" + flags;
					   else flags = "2" + flags;
				   }
				   continue;
			   }
			   if(i > read.length-1) break;
			   temp = read[i] + read[i+1] + temp;
			   if(j != 0 && j % 4 == 0) flags = "02" + flags;
			   else flags = "01" + flags;
		   }
		   read = temp;
		   temp = read[0];
		   for(i = 1; i < read.length; i++){
			   if(flags[i] == "2" && flags[i-1] == "2") continue;
			   temp = temp + read[i];
		   }
			read = temp;
		}// end: if
		else read = '';

		return read;
	}
})(jQuery);
