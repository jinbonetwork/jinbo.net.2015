(function($){
	$(document).ready(function(){
		$('#editpage-container').makeEditor();
	});
})(jQuery);

(function($){
	var g_totNumGrids = 12;
	var g_curLevel = 2;
	var g_lastLevel = 0;
	var g_curBreakPoint = 'md';
	var g_sectionData;

	$.fn.makeEditor = function(){
		var sectionUrl = $(this).attr('url');
		$.ajax({
			url: sectionUrl,
			dataType: 'json',
			async: false,
			success: function(data){
				g_sectionData = data;
			}
		});

		$(this).append('<div id="edit-region"><div id="toolbar"></div><div id="ruler-region"></div><div id="main-region"></div></div>');
		$mainRegion = $(this).children('#edit-region').children('#main-region');
		$toolbar = $(this).children('#edit-region').children('#toolbar');

		$mainRegion.makeSection(g_sectionData);
		$mainRegion.find('[data-height-mode]').regHeight();
		$toolbar.makeToolbar();

		// 초기화 ////////////////
		$mainRegion.find('[class^="con-bp-"]').hide();
		$mainRegion.find('.con-bp-'+g_curBreakPoint).show();
		$mainRegion.makeLevelMark(g_curLevel);
		$mainRegion.find('.con-bp-'+g_curBreakPoint).each(function(){
			if($(this).find('.level-mark').length){
				$(this).find('.level-mark').first().makeDivMenu(); return false;
			}
		}); 
	}
	
	$.fn.makeToolbar = function(){
		var html = 
			'<input id="breakpoint-lg" type="radio" name="breakpoint" value="lg"><label for="breakpoint-lg">lg</label>' +
			'<input id="breakpoint-md" type="radio" name="breakpoint" value="md" checked><label for="breakpoint-md">md</label>' +
			'<input id="breakpoint-sm" type="radio" name="breakpoint" value="sm"><label for="breakpoint-sm">sm</label>' +
			'<input id="breakpoint-xs" type="radio" name="breakpoint" value="xs"><label for="breakpoint-xs">xs</label>' +
			'<input id="save" type="button" value="저장">' +
			'<input id="test-button" type="button" value="test">';
		$(this).html(html);

		$wrap = $(this).parent();
		$(this).find('input[name="breakpoint"]').click(function(){
			g_curBreakPoint = $(this).val();

			var $thisMark = $wrap.find('.level-mark.selected');
			var thisIndex = $thisMark.parent().attr('data-index');
			var $thisCon = $thisMark.closest('.container');
			var $thatObj = $thisCon.find('.con-bp-'+g_curBreakPoint).find('[data-index="'+thisIndex+'"]');

			$wrap.find('[class^="con-bp-"]').hide();
			$wrap.find('.con-bp-'+g_curBreakPoint).show();
			$wrap.makeLevelMark(g_curLevel);

			$thatObj.find('.level-mark').makeDivMenu();
		});

		$(this).find('#test-button').click(function(){
			/*
			$.ajax({
				url: $(location).attr('href'), type: 'post',
				data: { savecache: 'yes', section_data: g_sectionData }, 
				success: function(result){
					if(result) alert('ok');
					else alert('fail');
				}
			});
			*/
		});
	}

	$.fn.makeSection = function(divData){
		for(var secname in divData){
			var attr = getAttr(divData[secname].attr);
			var html =
				'<div class="section-region">' +
					'<div class="left-side">' +
					'</div>' + 
					'<div class="container" data-sec-name="' + secname +'" ' + attr + '>' +
						'<div class="con-bp-lg" data-level="0">' + makeMarkup(divData[secname].data, 'lg', '', 0, secname) + '</div>' +
						'<div class="con-bp-md" data-level="0">' + makeMarkup(divData[secname].data, 'md', '', 0, secname) + '</div>' +
						'<div class="con-bp-sm" data-level="0">' + makeMarkup(divData[secname].data, 'sm', '', 0, secname) + '</div>' +
						'<div class="con-bp-xs" data-level="0">' + makeMarkup(divData[secname].data, 'xs', '', 0, secname) + '</div>' +
					'</div>' +
				'</div>';
			$(this).append(html);
		}
	}
	
	function makeMarkup(divData, breakpoint, template, level, index){
		var classes = getClass(divData.class, breakpoint);
		var attr = getAttr(divData.attr, breakpoint);
		var levInd = 'data-level="'+level+'" data-index="'+index+'"';
		if(g_lastLevel < level + 1) g_lastLevel = level + 1;

		if(divData.type == 'division'){
			var childDivData = ''; 
			$.each(divData.data, function(i, value){
				childDivData += makeMarkup(value, breakpoint, divData.template, level+1, index+'|'+i);
			});
			var html = '<div class="row">' + childDivData + '</div>'; 
			if(template == 'rows')
				return '<div class="row" ' + levInd + '>' + html + '</div>';
			else if(template == 'cols')
				return '<div class="' + classes + '" ' + levInd + '>' + html + '</div>';
			else if(!template)
				return html;
		} else if(divData.type == 'item'){
			if(template == 'rows')
				return '<div class="row" ' + levInd + '><div class="' + classes + '" ' + attr + '><article></article></div></div>';
			else if(template == 'cols')
				return '<div class="' + classes + '" ' + attr + ' ' + levInd + '><article></article></div>';
			else if(!template)
				return '<article></article>';
		}
	}

	function getClass(classes, bp){
		if(!classes) return '';
		if(!classes.length) return '';
		if(bp){
			var others = '';
			var classCols = [];
			for(var i = 0; i < classes.length; i++){
				if(classes[i].match('col-')) classCols.push(classes[i]);
				else others += classes[i] + ' ';
			}
			return others + getClassCol(classCols, bp);
		} else {
			return classes.join(' ');
		}
	}
	function getClassCol(classes, bp){
		if(!classes.length) return '';
		for(var i = 0; i < classes.length; i++){
			if(classes[i].match('col-'+bp+'-')) return classes[i].replace('col-'+bp+'-', 'col-xs-'); 
		}
		if(bp == 'lg') return getClassCol(classes, 'md');
		else if(bp == 'md') return getClassCol(classes, 'sm');
		else if(bp == 'sm') return getClassCol(classes, 'xs');
		else if(bp == 'xs') return ''; 
	}

	function getAttr(attrs, bp){
		if(!attrs) return '';
		if(bp){
			var others = '';
			var attrHeight = {};
			for(var key in attrs){
				if(!key.match('data-height-')) others += key + '="' + attrs[key] + '" ';
				else attrHeight.key = attrs[key];
			}
			return others + getAttrHeight(attrs, bp);
		} else {
			var attr = '';
			for(var key in attrs){
				if(!key.match('data-gutter')) attr += key + '="' + attrs[key] + '" ';
			}
			return attr;
		}
	}
	function getAttrHeight(attrs, bp){
		for(var key in attrs){
			if(key.match('data-height-'+bp)) return 'data-height-xs' + '="' + attrs[key] + '" ';
		}
		if(bp == 'lg') return getAttrHeight(attrs, 'md');
		else if(bp == 'md') return getAttrHeight(attrs, 'sm');
		else if(bp == 'sm') return getAttrHeight(attrs, 'xs');
		else if(bp == 'xs') return '';
	}

	$.fn.makeLevelMark = function(level){
		var $wrap = $(this);

		$wrap.find('.level-mark').remove();
		$wrap.find('[data-level="' + (level-1) +'"]').append('<div class="level-mark"></div>');
		$wrap.find('.level-mark').each(function(){
			//column 혹은 row와 같은 크기로 만든다 //////////////////////
			$(this).offset($(this).parent().offset());
			$(this).outerWidth($(this).parent().rectWidth());
			$(this).outerHeight($(this).parent().rectHeight());

			//클릭했을 때 column/row의 백그라운드 색깔을 변하도록 ////////////////////
			$(this).click(function(){
				$(this).makeDivMenu();
			});

			//hover일 때 마우스 포인터가 상황에 맞게 변하도록 ////////////
			$(this).mouseover(function(){
				if($(this).parent().hasClass('row')) return;
				if($(this).parent().attr('data-level') == '0') return;
				if($(this).siblings('article').length) $(this).addClass('se-cursor');
				else $(this).addClass('e-cursor');
			});

			//드래그 했을 때 폭과 높이가 변하도록. //////////////////////////////
			$(this).mousedown(function(event){
				if($(this).parent().hasClass('row')) return;
				if($(this).parent().attr('data-level') == '0') return;	

				$(this).addClass('cur-level-mark');

				var $parent = $(this).parent();
				var isItem; if($(this).siblings('article').length) isItem = true; else isItem = false;
				var flagMouseDown = true;
				var flagMouseMove = false;
				var mousePosX = event.pageX;
				var mousePosY = event.pageY;
				var preWidth = $(this).rectWidth();
				var preHeight = $(this).rectHeight();
				var $thisMark  = $(this);

				var bottoms = [];
				if(isItem){
					var items = $thisMark.closest('[class^="con-bp-"]').find('article');
					for(var i = 0; i < items.length; i++){
						var b = $(items[i]).parent().offset().top + $(items[i]).parent().rectHeight();
						var isDouble = false;
						for(var j = 0; j < i; j++){
							if(b == bottoms[j]){ isDouble = true; break; }
						}
						if(!isDouble) bottoms[i] = b;
					}
				}

				$(document).mousemove(function(event){
					if(!flagMouseDown){
						return;
					}
					flagMouseMove = true;

					// 폭에 관한 ////////////////////////
					var w = $thisMark.rectWidth();
					var nw = w + event.pageX - mousePosX;
					if(nw > 0){
						$thisMark.outerWidth(nw);
						mousePosX = event.pageX;
					}

					// 높이에 관한 //////////////////////////
					if(!isItem) return;
					var h = $thisMark.rectHeight();
					var nh = h + event.pageY - mousePosY;
					var nb = $thisMark.offset().top + nh;
					for(var i in bottoms){
						var interval = 30;
						if(bottoms[i] - interval < nb && nb  < bottoms[i] + interval){
							nh = bottoms[i] - $thisMark.offset().top;
							$thisMark.outerHeight(nh);
							return;
						}
					}
					if(nh > 0){
						$thisMark.outerHeight(nh);
						mousePosY = event.pageY;
					}
				});

				$(document).mouseup(function(){
					// 마우스를 누루지 않았거나 마우스를 움직이지 않았으면 실행하지 않는다 /////////
					if(!flagMouseDown || !flagMouseMove){
						$thisMark.removeClass('cur-level-mark');
						flagMouseDown = false; flagMouseMove = false;  return;
					}
					flagMouseDown = false; flagMouseMove = false;
					
					// 폭 관련 ////////////////
					var classes = $parent.attr('class').split(' ');
					var length;
					for(var i in classes){
						if(classes[i].match('col-xs-')){
							length = classes[i].replace('col-xs-', '');
							break;
						}
					}
					if(!length) return;

					var newLength = Math.round($thisMark.rectWidth() / preWidth * length);
					if(newLength < 1) newLength = 1;
					else if(newLength > g_totNumGrids) newLength = g_totNumGrids;
					$parent.removeClass('col-xs-'+length).addClass('col-xs-'+newLength);
					$parent.changeCrpData('class', 'col-'+g_curBreakPoint+'-'+length, 'col-'+g_curBreakPoint+'-'+newLength);
			
					// 높이 관련 ////////////////
					var hinfo = $parent.attr('data-height-xs');
					var newhinfo = $thisMark.rectHeight() / preHeight * hinfo;
					if(isItem && hinfo && newhinfo > 0){ 
						$parent.attr('data-height-xs', newhinfo);
						$parent.changeCrpData('attr', 'data-height-'+g_curBreakPoint, newhinfo);
						$parent.outerHeight($thisMark.rectHeight());
						$parent.children('article').outerHeight($thisMark.rectHeight());
					}

					//레벨 마크를 다시 그린다고 변경된 데이터를 저장 //////////////
					$wrap.makeLevelMark(level);
					saveSectionData();
					$parent.find('.level-mark').makeDivMenu();

				}); //mouseup
			}); //mousedown

			$.fn.changeCrpData = function(mode, arg1, arg2){
				var crpData = $(this).correspData();
				if(mode == 'class'){
					for(var i in crpData.class){
						if(crpData.class[i] == arg1){ crpData.class[i] = arg2; return; }
					}
					crpData.class.push(arg2);
				} else if(mode == 'attr'){
					crpData['attr'][arg1] = arg2;
				}
			}

			$.fn.correspData = function(){
				var index = $(this).attr('data-index').split('|');
				var dataLoc = g_sectionData[index[0]].data; // level 0
				for(var i = 1; i < g_curLevel; i++){
					dataLoc = dataLoc.data[index[i]];
				}
				return dataLoc;
			}

			$.fn.makeDivMenu = function(){
				var $thisMark = $(this);
				if($thisMark.hasClass('selected')) return;
				$wrap.find('.selected').removeClass('selected');
				$thisMark.addClass('selected');
				
				$wrap.find('.divmenu').remove();
				var html = 
					'<div class="divmenu">' + 
						'<input type="text" name="display-level" value="'+g_curLevel+'">' +
						'<div class="division-menu">' + 
							'<input type="button" name="add-column" value="C">' + 
							'<input type="button" name="add-row" value="R">' +
							'<input type="button" name="remove-this" value="X">' +
						'</div>' +
						'<div class="level-move-menu">' + 
							'<input type="button" name="move-up" value="U">' +
							'<input type="button" name="move-down" value="D">' +
							'<input type="button" name="move-last" value="L">' +
						'</div>' +
					'</div>'
				$thisMark.closest('.container').append(html);
				var $divMenu = $thisMark.closest('.container').find('.divmenu');
				$divMenu.offset({
					top: $thisMark.offset().top,
					left: $thisMark.offset().left + $thisMark.rectWidth()
				});
				$divMenu.find('.level-move-menu').find('input[type="button"]').click(function(){
					var buttonName = $(this).attr('name');
					var $nextMark; 
					var $parent = $thisMark.parent();	
					if(buttonName == 'move-down'){
						g_curLevel--; if(g_curLevel < 1){ g_curLevel = 1; return; }
					} else if(buttonName == 'move-up'){
						g_curLevel++;
						if(g_curLevel > g_lastLevel){ g_curLevel = g_lastLevel; return; }
					} else if(buttonName == 'move-last'){
						if(g_curLevel == g_lastLevel) return;
						else g_curLevel = g_lastLevel;
					}
					$wrap.makeLevelMark(g_curLevel);

					if(buttonName == 'move-down'){ 
						$nextMark = $parent.closest('[data-level="'+(g_curLevel-1)+'"]').find('.level-mark');
					} else if(buttonName == 'move-up' || buttonName == 'move-last'){
						if($parent.find('[data-level="'+(g_curLevel-1)+'"]').length){
							$nextMark = $parent.find('[data-level="'+(g_curLevel-1)+'"]').first().find('.level-mark');
						} else {
							var $levelZero = $parent.closest('[data-level="0"]');
							$parent = $levelZero.find('[data-level="'+(g_curLevel-1)+'"]').first();
							$nextMark = $parent.find('.level-mark');
						}
					}
					$nextMark.makeDivMenu();
				});
				$divMenu.find('.division-menu').find('input[type="button"]').click(function(){
					var buttonName = $(this).attr('name');
					if(buttonName == 'add-column'){

					} else if(buttonName == 'add-row'){

					} else if(buttonName == 'remove-this'){

					}
				});
			}
		});
	}

	$.fn.rectWidth = function(){
		var rect = $(this)[0].getBoundingClientRect();
		return rect.right - rect.left;
	}
	$.fn.rectHeight = function(){
		var rect = $(this)[0].getBoundingClientRect();
		return rect.bottom - rect.top;
	}

	function saveSectionData(){
		$.ajax({
			url: $(location).attr('href'), type: 'post',
			data: { savecache: 'yes', section_data: g_sectionData }, 
			success: function(result){
				if(!result) alert('fail to save section cache');
			}
		});
	}

})(jQuery);
