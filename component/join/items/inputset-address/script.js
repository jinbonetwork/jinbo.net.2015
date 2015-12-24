(function($){
	function $ia(selector, $obj){
		if($obj){
			return $obj.closest('.inputset-address').find(selector);
		} else {
			return $('.inputset-address').find(selector);
		}
	}
	function displayZipList($list, keyword, curPage){
		if(!curPage) curPage = 1;
		$.ajax({
			url: $(location).attr('href'), type: 'post',
			data: {todo: 'zip-search', keyword: keyword, curPage: curPage},
			success: function(result){
				if(result){
					result = $.parseJSON(result);
					if(!result.error){
						if(result.lastPage > 0){
							if(curPage == 1) $list.html('');
							for(var i = 0, len = result.list.length; i < len; i++){
								$list.append('<li>[<span class="code">'+result.list[i].code+'</span>] <span class="address">'+result.list[i].addr+'</span></li>');
							}
							if(result.lastPage != curPage) displayZipList($list, keyword, ++curPage);
						} else {
							$list.html('<li class="no-result">검색결과가 없습니다.</li>');
						}
					} else {
						$list.html('<li class="no-result">'+result.error+'</li>');
					}
				}
			}
		});
	}
	$(document).ready(function(){
		var $address = $ia('textarea[name="address"]');
		var $zip = $ia('input[type="text"][name="zip"]');
		var $zipSearch = $ia('button[name="zip-search"]');
		var $keySearch = $ia('button[name="keyword-search"]');

		$ia('.zip-search-wrap').hide();

		//검색 버튼
		$zipSearch.click(function(){
			$ia('.content').hide();
			$ia('.zip-search-wrap').show();
			$ia('.zip-keyword-wrap .input-with-placeholder span').outerWidth($ia('.zip-keyword-wrap input').outerWidth());
			$ia('input[name="zipKeyword"]').focus();
		}).focus(function(){
			$(this).find('span.border').addClass('focused');
		}).blur(function(){
			$(this).find('span.border').removeClass('focused');
		});
		//주소 검색
		$ia('.address-list').hide();
		$keySearch.click(function(){
			$ia('.address-list').show();
			var keyword = $ia('.zip-search-wrap input[name="zipKeyword"]').val();
			$ia('.address-list').html('<li>검색중...</li>');
			displayZipList($ia('.address-list'), keyword);
		});
		$ia('.address-list').on('click', 'li', function(){
			if(!$(this).hasClass('no-reault')){
				$zip.val($(this).find('.code').text());
				$address.val($(this).find('.address').text());
			}
			$ia('.content').show();
			$ia('.zip-search-wrap').hide();
			$address.focus();
		});
		$ia('.zip-search-wrap input[name="zipKeyword"]').keydown(function(event){
			if(event.which == 13){
				$keySearch.click();
				event.preventDefault();
			};
		});
		//주소
		$address.blur(function(){
			$(this).removeClass('focused');
			$ia('.head', $(this)).removeClass('focused');
		}).focus(function(){
			$(this).addClass('focused');
			$ia('.head', $(this)).addClass('focused');
		});
		//우편번호
		$zip.blur(function(){
			$(this).removeClass('focused');
			$ia('.head', $(this)).removeClass('focused');
		}).focus(function(){
			$(this).addClass('focused');
			$ia('.head', $(this)).addClass('focused');
		});
	});
})(jQuery);
