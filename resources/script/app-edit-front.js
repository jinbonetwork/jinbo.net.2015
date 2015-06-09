(function($){
	$(document).ready(function(){
		$('#editpage-container').makeEditor();
	});
})(jQuery);

(function($){
	//설명 ************************
	// 1. data-heigt-mode는 '1'로 하고 변경할 수 없도록 한다.
	// 2. data-height-[bp]의 값은 정수.
	//*****************************
	var g_totNumGrids = 12; //나중에 jframework에서 값을 가져온다.
	var g_curLevel = 1;
	var g_conWidth = {lg: 800, md: 800, sm: 400, xs: 400};
	var g_curBreakPoint = 'md';
	var g_sectionData = {'section1': {'attr': {'data-height-mode': '1'}, 'data': {'type': 'item'}}};

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

		$(this).append('<div id="edit-region"><div id="toolbar"></div><div id="ruler-region"></div><div id="main-region"></div><div id="add-section-wrap"></div></div>');
		$mainRegion = $(this).children('#edit-region').children('#main-region');
		$toolbar = $(this).children('#edit-region').children('#toolbar');
		$addSec = $(this).children('#edit-region').children('#add-section-wrap');

		$mainRegion.makeSection(g_sectionData);
		$toolbar.makeToolbar();
		$addSec.makeAddSec();

		// 초기화 ////////////////
		$mainRegion.showSections(g_curBreakPoint);
		$mainRegion.find('.con-bp-'+g_curBreakPoint).find('.level-mark').first().makeDivMenu();
	}

	$.fn.showSections = function(bp){
		$(this).find('[class*="con-bp-"]').hide();
		$(this).find('.con-bp-'+bp).show();
		$(this).find('.container').outerWidth(g_conWidth[bp]);
		$(this).find('[data-height-mode]').regHeight();
		$(this).makeLevelMark(g_curLevel);
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
			var $thisCon = $thisMark.closest('.container').find('.con-bp-'+g_curBreakPoint);
			var $thatObj;
			if($thisCon.is('[data-index="'+thisIndex+'"]')) $thatObj = $thisCon;
			else $thatObj = $thisCon.find('[data-index="'+thisIndex+'"]');
		
			$wrap.showSections(g_curBreakPoint);
			$thatObj.find('.level-mark').makeDivMenu();
		});

		$(this).find('#test-button').click(function(){
			//테스트 할 코드
		});
	}

	$.fn.makeAddSec = function(){
		$main = this.parent().children('#main-region');
		$(this).append('<input type="button" name="add-section" value="섹션 추가">').click(function(){
			var secName = makeUniqueKey();
			console.log(secName);

			var newSecData = {}; newSecData[secName] = {'attr': {'data-height-mode': '1'}, 'data': {'type': 'item'}};
			g_sectionData[secName] = newSecData[secName];
			$main.makeSection(newSecData);
			g_curLevel = 1;
			var $secDiv = $main.find('[data-index="'+secName+'"]').closest('.section-region');
			$main.showSections(g_curBreakPoint);
			$secDiv.find('.con-bp-'+g_curBreakPoint).find('.level-mark').first().makeDivMenu();
			saveSectionData();
		});
	}
	makeUniqueKey = function(){
		var name = '_newsecname_';
		while(true){
			if(isUsedKey(name, g_sectionData)){
				var rand = Math.round(Math.random() * 10000);
				name = name+rand;
			}
			else break;
		}
		return name;
	}
	isUsedKey = function(thisKey, obj){
		for(var key in obj){
			if(key == thisKey) return true;
		}
		return false;
	}

	$.fn.makeSection = function(divData){
		var $wrap = $(this);
		for(var secname in divData){
			var attr = getAttr(divData[secname].attr);
			var html =
				'<div class="section-region">' +
					'<div class="left-side">' +
					'</div>' + 
					'<div class="container" ' + attr + '>' + '<div class="row"></div>'+
						'<div class="con-bp-lg" data-level="0" data-index="'+secname+'">' + makeMarkup(divData[secname].data, 'lg', '', 0, secname) + '</div>' +
						'<div class="con-bp-md" data-level="0" data-index="'+secname+'">' + makeMarkup(divData[secname].data, 'md', '', 0, secname) + '</div>' +
						'<div class="con-bp-sm" data-level="0" data-index="'+secname+'">' + makeMarkup(divData[secname].data, 'sm', '', 0, secname) + '</div>' +
						'<div class="con-bp-xs" data-level="0" data-index="'+secname+'">' + makeMarkup(divData[secname].data, 'xs', '', 0, secname) + '</div>' +
					'</div>' +
				'</div>';
			$wrap.append(html);
		}
		$wrap.find('.item').each(function(){
			$(this).attClick();
		});
	}

	$.fn.attClick = function(){
		$(this).click(function(){
			var $item = $(this);
			var $div = $item.closest('[data-level]');
			g_curLevel = parseInt($div.attr('data-level')) + 1;
			$item.closest('#main-region').makeLevelMark(g_curLevel);
			$div.find('.level-mark').makeDivMenu();
		});
	}
	function makeMarkup(divData, breakpoint, template, level, index){
		var classes = getClass(divData.class, breakpoint);
		var attr = getAttr(divData.attr, breakpoint);
		var levInd = 'data-level="'+level+'" data-index="'+index+'"';

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
				return '<div class="row" ' + levInd + '><div class="' + classes + '" ' + attr + '><div class="item"></div></div></div>';
			else if(template == 'cols')
				return '<div class="' + classes + '" ' + attr + ' ' + levInd + '><div class="item"></div></div>';
			else if(!template)
				return '<div class="item"></div>';
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
			//변수들 //////////////
			var $thisMark = $(this);
			var info = {};
			info.$div = $(this).parent();
			info.divType = ''
			info.$target = info.$div;
			info.isItem = false;
			if(info.$div.attr('data-level') != '0'){
				if(info.$div.hasClass('row')){
					info.divType = 'row';
					var cols = info.$div.children('[class*="col-"]');
					if(cols.length == 1 && cols.first().children('.item').length == 1){
						info.isItem = true;
						info.$target = cols.first();
					}
				}
				else {
					info.divType = 'col';
					if(info.$div.children('.item').length) info.isItem = true;
				}
			}
			 
			//해당 디비전과 같은 크기로 만든다 //////////////////////
			$thisMark.offset(info.$div.offset());
			$thisMark.outerWidth(info.$div.rectWidth());
			$thisMark.outerHeight(info.$div.rectHeight());

			//클릭했을 때 리모콘을 붙인다 ////////////////////
			$thisMark.click(function(){
				$thisMark.makeDivMenu();
			});

			//hover일 때 마우스 포인터가 상황에 맞게 변하도록 ////////////
			$thisMark.mouseover(function(){
				if(info.divType == 'col'){
					if(info.isItem) $thisMark.addClass('se-cursor');
					else $thisMark.addClass('e-cursor');
				}
				else if(info.divType == 'row' && info.isItem){
					$thisMark.addClass('s-cursor');
				}
			});

			//드래그 했을 때 폭과 높이가 변하도록. //////////////////////////////
			$thisMark.mousedown(function(event){
				var $thisMark = $(this);

				if(info.divType == '') return;
				else if(info.divType == 'row' && info.isItem == false) return;
				else $thisMark.addClass('cur-level-mark');

				var flagMouseDown = true;
				var flagMouseMove = false;
				var mousePosX = event.pageX;
				var mousePosY = event.pageY;
				var preWidth = $thisMark.rectWidth();
				var preHeight = $thisMark.rectHeight();

				var bottoms = [];
				if(info.isItem){
					var items = $thisMark.closest('.con-bp-'+g_curBreakPoint).find('.item');
					for(var i = 0; i < items.length; i++){
						var b = $(items[i]).offset().top + $(items[i]).rectHeight();
						var isDouble = false;
						for(var j = 0; j < i; j++){
							if(b == bottoms[j]){ isDouble = true; break; }
						}
						if(!isDouble) bottoms.push(b);
					}
				}

				$(document).mousemove(function(event){
					if(!flagMouseDown) return;
					flagMouseMove = true;

					// 폭에 관한 ////////////////////////
					if(info.divType == 'col'){
						var w = $thisMark.rectWidth();
						var nw = w + event.pageX - mousePosX;
						if(nw > 0){
							$thisMark.outerWidth(nw);
							mousePosX = event.pageX;
						}
					}

					// 높이에 관한 //////////////////////////
					if(info.isItem){
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
					if(info.divType == 'col'){
						var classes = info.$div.attr('class').split(' ');
						var length;
						for(var i in classes){
							if(classes[i].match('col-xs-')){
								length = classes[i].replace('col-xs-', '');
								break;
							}
						}
						if(length){
							var newLength = Math.round($thisMark.rectWidth() / preWidth * length);
							if(newLength < 1) newLength = 1;
							else if(newLength > g_totNumGrids) newLength = g_totNumGrids;
							info.$div.removeClass('col-xs-'+length).addClass('col-xs-'+newLength);
							info.$div.changeCrpData('col', g_curBreakPoint, newLength);
						}
					}

					// 높이 관련 ////////////////
					if(info.isItem){
						var hinfo = info.$target.attr('data-height-xs');
						var newhinfo = Math.round($thisMark.rectHeight() / preHeight * hinfo);
						if(newhinfo < 1) newhinfo = 1;
						info.$target.attr('data-height-xs', newhinfo);
						info.$div.changeCrpData('height', g_curBreakPoint, newhinfo);
						info.$target.outerHeight($thisMark.rectHeight());
						$wrap.find('[data-height-mode]').regHeight();
					}

					//레벨 마크를 다시 그린다고 변경된 데이터를 저장 //////////////
					$wrap.makeLevelMark(level);
					saveSectionData();
					info.$div.find('.level-mark').makeDivMenu();

				}); //mouseup
			}); //mousedown

			$.fn.changeCrpData = function(mode, arg1, arg2){
				changeData($(this).correspData(), mode, arg1, arg2);
			}
			changeData = function(crpData, mode, arg1, arg2){
				if(mode == 'class'){
					if(!arg1){ crpData.class.push(arg2); return; }
					for(var i in crpData.class){
						if(crpData.class[i] == arg1){ crpData.class[i] = arg2; return; }
					}
					crpData.class.push(arg2);
				}
				else if(mode == 'attr'){
					if(crpData.attr === undefined) crpData.attr = {};
					crpData['attr'][arg1] = arg2;
				}
				else if(mode == 'col'){
					for(var i in crpData.class){
						if(crpData.class[i].match('col-'+arg1+'-')){ crpData.class[i] = 'col-'+arg1+'-'+arg2; return; }
					}
					crpData.class.push('col-'+arg1+'-'+arg2);
				}
				else if(mode == 'height'){
					if(crpData.attr === undefined) crpData.attr = {};
					crpData['attr']['data-height-'+arg1] = arg2;
				}
			}
			$.fn.correspData = function(){
				var index = $(this).attr('data-index').split('|');
				var dataLoc = g_sectionData[index[0]].data; // level 0
				for(var i = 1; i < index.length; i++){
					dataLoc = dataLoc.data[index[i]];
				}
				return dataLoc;
			}
		
			$.fn.makeDivMenu = function(){
				var $thisMark = $(this);
				var gdm = {};
				var $divMenu;

				if($thisMark.hasClass('selected')){
					$wrap.find('.divmenu.disabled').removeClass('disabled');
					return;
				}
				$wrap.find('.selected').removeClass('selected');
				$thisMark.addClass('selected');
			
				gdm.$div = $thisMark.closest('[data-level]');
				var $upper = gdm.$div.find('[data-level]').first();
				if($upper.hasClass('row')) gdm.template = 'row';
				else if($upper.is('[class*=col-]'))gdm.template = 'col';
				else gdm.template = '';
				gdm.level = parseInt(gdm.$div.attr('data-level'));
				gdm.index = gdm.$div.attr('data-index');
				gdm.$allDiv = gdm.$div.closest('.container').find('[data-index="'+gdm.index+'"]');

				//리모콘을 붙인다 //////////////////////////////////////////
				$wrap.find('.divmenu').remove();
				var html = 
					'<div class="divmenu">' + 
						'<input type="button" name="disabled" value="">' +
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
					'</div>';
				$thisMark.closest('.container').append(html);
				$divMenu = $thisMark.closest('.container').find('.divmenu');
				$divMenu.offset({
					top: $thisMark.offset().top,
					left: $thisMark.offset().left + $thisMark.rectWidth()
				});
				if(gdm.template == 'row') $divMenu.find('input[name="add-column"]').prop('disabled', true);
				else if(gdm.template == 'col') $divMenu.find('input[name="add-row"]').prop('disabled', true);

				var lastLevel = 0;
				gdm.$div.closest('[data-level="0"]').find('[data-level]').each(function(){
					if($(this).attr('data-level') > lastLevel) lastLevel = $(this).attr('data-level');
				});
				lastLevel++;

				if(g_curLevel <= 1){
					$divMenu.find('input[name="move-down"]').prop('disabled', true);
					if(lengthObj(g_sectionData) == 1) $divMenu.find('input[name="remove-this"]').prop('disabled', true);
				}
				if(g_curLevel >= lastLevel){
					 $divMenu.find('input[name="move-up"]').prop('disabled', true);
					 $divMenu.find('input[name="move-last"]').prop('disabled', true);
				}
				
				$divMenu.find('input[name="disabled"]').click(function(){
					$divMenu.addClass('disabled');
				});

				//리모콘 버튼 중 층을 이동시키는 버튼들을 클릭했을 때 //////////////////////////////////////
				$divMenu.find('.level-move-menu').find('input[type="button"]').click(function(){
					var buttonName = $(this).attr('name');
					var $nextMark; 
					if(buttonName == 'move-down'){
						g_curLevel--;
					} else if(buttonName == 'move-up' || buttonName == 'move-last'){
						if(buttonName == 'move-up'){
							g_curLevel++;
						} else  {
							g_curLevel = lastLevel;
						}
					}
					$wrap.makeLevelMark(g_curLevel);

					if(buttonName == 'move-down'){ 
						$nextMark = gdm.$div.closest('[data-level="'+(g_curLevel-1)+'"]').find('.level-mark');
					} else if(buttonName == 'move-up' || buttonName == 'move-last'){
						if(gdm.$div.find('[data-level="'+(g_curLevel-1)+'"]').length){
							$nextMark = gdm.$div.find('[data-level="'+(g_curLevel-1)+'"]').first().find('.level-mark');
						} else {
							var $levelZero = gdm.$div.closest('[data-level="0"]');
							gdm.$div = $levelZero.find('[data-level="'+(g_curLevel-1)+'"]').first();
							$nextMark = gdm.$div.find('.level-mark');
						}
					}
					$nextMark.makeDivMenu();
				});

				//리모콘 버튼들 중 디비전에 관한 버튼들을 클릭했을 때 /////////////////////////////////////////
				$divMenu.find('.division-menu').find('input[type="button"]').click(function(){
					var buttonName = $(this).attr('name');
					var crpData = gdm.$div.correspData();
					var targetIndex;
					var $targetDiv;

					//컬럼 추가 버튼을 클릭했을 때 ///////////////////////////////
					if(buttonName == 'add-column'){
						//템플릿이 결정되지 않았을 때 ////////////////////////////
						if(gdm.template == ''){
							var halfCol = [Math.floor(g_totNumGrids/2), g_totNumGrids - Math.floor(g_totNumGrids/2)];
							dataItemToDiv(crpData, 'cols', halfCol);
							gdm.$allDiv.each(function(){
								var height = $(this).calcDataHeight();
								$(this).children().remove();
								$(this).append('<div class="row"></div>');
								$(this).appendCol({colLen: halfCol[0], height: height, level: gdm.level+1, index: gdm.index+'|0'});
								$(this).appendCol({colLen: halfCol[1], height: height, level: gdm.level+1, index: gdm.index+'|1'});
								var bp = $(this).bpOfCon();
								crpData.data[0].attr['data-height-'+bp] = height;
								crpData.data[1].attr['data-height-'+bp] = height;
							});
							targetIndex = gdm.index+'|1';
						}
						//템플릿이 컬럼일 때 /////////////////////////
						else if(gdm.template == 'col'){
							targetIndex = gdm.index+'|'+crpData.data.length;
							crpData.data.push({'type': 'item', 'class': [], 'attr': {}});
							var thisData = crpData.data[crpData.data.length-1];
							gdm.$allDiv.each(function(){
								var totColLen = 0;
								var bp = $(this).bpOfCon();
								var cols = $(this).find('[data-level="'+(gdm.level+1)+'"]');
								for(var i = 0; i < cols.length; i++){
									totColLen += $(cols[i]).colLen();
								}
								if(totColLen < g_totNumGrids){
									newColLen = g_totNumGrids - totColLen;
									height = $(this).calcDataHeight();
									$(this).appendCol({colLen: newColLen, height: height, level: (gdm.level+1), index: targetIndex});
									changeData(thisData, 'col', bp, newColLen);
									changeData(thisData, 'height', bp, height);
								}
								else {
									$(this).appendCol({colLen: g_totNumGrids, height: 1, level: (gdm.level+1), index: targetIndex});
									changeData(thisData, 'col', bp, g_totNumGrids);
									changeData(thisData, 'height', bp, 1);
								}
							});
						}
					}
					//로우 추가 버튼을 클릭했을 때 //////////////
					else if(buttonName == 'add-row'){
						if(gdm.template == ''){
							dataItemToDiv(crpData, 'rows');
							gdm.$allDiv.each(function(){
								var height = $(this).halfHeights();
								$(this).children().remove();
								$(this).append('<div class="row"></div>');
								$(this).appendRow({height: height[0], level: gdm.level+1, index: gdm.index+'|0'});
								$(this).appendRow({height: height[1], level: gdm.level+1, index: gdm.index+'|1'});
								var bp = $(this).bpOfCon();
								crpData.data[0].attr['data-height-'+bp] = height[0];
								crpData.data[1].attr['data-height-'+bp] = height[1];
							});
							targetIndex = gdm.index+'|1';
						}
						else if(gdm.template == 'row'){
							var numRow = crpData.data.length;
							targetIndex = gdm.index+'|'+numRow;
							crpData.data.push({'type': 'item', 'class': [], 'attr': {}});
							var thisData = crpData.data[numRow];
							gdm.$allDiv.each(function(){
								var bp = $(this).bpOfCon();
								changeData(thisData, 'col', bp, g_totNumGrids);
								$(this).appendRow({height: 1, level: (gdm.level+1), index: targetIndex});
								changeData(thisData, 'col', bp, g_totNumGrids);
								changeData(thisData, 'height', bp, 1);
							});
						}
					}
					//디비전 삭제 버튼을 클릭했을 때 //////////////
					else if(buttonName == 'remove-this'){
						if(gdm.$div.attr('data-level') == 0){
							$targetDiv = gdm.$div.closest('.section-region').nextDiv().find('.con-bp-'+g_curBreakPoint);
							delete g_sectionData[gdm.$div.attr('data-index')];
							gdm.$div.closest('.section-region').remove();
						}
						else if(gdm.$div.siblings().length){
							gdm.$div.removeCrpData();
							$targetDiv = gdm.$div.changeAllNextIndex();
							gdm.$allDiv.each(function(){
								$(this).remove();
							});
						} else {
							gdm.$div.removeCrpData();
							$targetDiv = gdm.$div.dataLevel('-1');
							var thisData = $targetDiv.correspData();
							thisData.type = 'item';
							delete thisData.data;
						
							gdm.$allDiv.each(function(){
								var bp = $(this).bpOfCon();
								var height = $(this).calcDataHeight();
								var $div = $(this).dataLevel('-1');
								$div.children().remove();
								if($div.hasClass('row')){
									$div.append('<div class="col-xs-12" data-height-xs="'+height+'"><div class="item"></div></div>');
								}
								else if($div.is('[class*="col-xs-"]')){
									$div.append('<div class="item"></div>');
									$div.attr('data-height-xs', height);
								} else {
									$div.append('<div class="item"></div>');
								}
								$div.find('.item').attClick();
								changeData(thisData, 'height', bp, height);
							});
							g_curLevel--;
						}
					}
					else return;

					//수정된 사항을 반영 ////////////////////////////////
					if(buttonName == 'add-column' || buttonName == 'add-row'){
						$targetDiv = gdm.$div.find('[data-index="'+targetIndex+'"]');
						g_curLevel++;
					}
					$wrap.find('[data-height-mode]').regHeight();
					$wrap.makeLevelMark(g_curLevel); 
					$targetDiv.find('.level-mark').makeDivMenu();
					saveSectionData();
				});//$divMenu.find('.division-menu').find('input[type="button"]').click(function(){
			}//$.fn.makeDivMenu()

			$.fn.bpOfCon = function(){
				var $conBp = this.closest('[class*="con-bp-"]');
				if($conBp.hasClass('con-bp-xs')) return 'xs';
				else if($conBp.hasClass('con-bp-sm')) return 'sm';
				else if($conBp.hasClass('con-bp-md')) return 'md';
				else if($conBp.hasClass('con-bp-lg')) return 'lg';
			}
			$.fn.colLen = function(arg){
				// arg: undefined, '+#', '-#', #  
				if(arg === undefined || $.isNumeric(arg)); else return false;
				 
				var classes = $(this).attr('class').split(' ');
				var length = '';
				var index = 0;
				for(var i in classes){
					if(classes[i].match('col-xs-')){
						length = parseInt(classes[i].replace('col-xs-', ''));
						index = i;
						break;
					}
				}
				if(length == '') return false; 
				if(arg === undefined) return length;

				if(arg[0] == '+' || arg[0] == '-'){
					var diff = parseInt(arg);
					var newLen = length + diff;
					if(newLen < 1) return false;
					else if(newLen > g_totNumGrids) return false;
					classes[index] = 'col-xs-'+newLen;
					$(this).attr('class', classes.join(' '));
					return newLen;
				} else {
					if(arg < 1) return false;
					else if(arg > g_totNumGrids) return false;
					classes[index] = 'col-xs-'+arg;
					$(this).attr('class', classes.join(' '));
					return parseInt(arg);
				}
			}//$.fn.colLen()
			$.fn.dataHeight = function(arg){
				if(arg === undefined){
					var h;
					if(this.hasClass('row')) h = this.children('[class*="col-xs-"]').attr('data-height-xs');
					else if(this.is('[class*="col-xs-"]')) h = this.attr('data-height-xs');
					if(!h) return false;
					else return parseInt(h);
				}
			}
			$.fn.calcDataHeight = function(){
				var flagShow = true;
				var $con = $(this).closest('[class*="con-bp-"]');
				if($con.hasClass('con-bp-'+g_curBreakPoint)) flagShow = false;

				var divs = $con.find('[data-height-xs]');
				if(!divs.length) return 1;
				var $div = $(divs[0]);

				if(flagShow){
					$con.show();
					$con.closest('[data-height-mode]').regHeight();
				}

				var rH = $(this).rectHeight();
				var dh = $div.attr('data-height-xs');
				var h = $div.rectHeight();
				var dataHeight = Math.round(dh * rH / h);

				if(flagShow){
					$con.hide();
					$con.closest('.container').find('.con-bp-'+g_curBreakPoint).show();
				}

				return dataHeight;
			}
			$.fn.dataLevel = function(arg){
				if(arg === undefined) return $(this).attr('data-level');
				if($.isNumeric(arg)){
					var lev = parseInt($(this).attr('data-level'));
					var divs;
					if(arg[0] == '+'){
						divs = $(this).find('[data-level="'+(lev + parseInt(arg))+'"]');
					} else if(arg[0] == '-') {
						divs = $(this).parent().closest('[data-level="'+(lev + parseInt(arg))+'"]');
					} else {
						if(arg > lev) divs = $(this).find('[data-level="'+arg+'"]');
						else if(arg < lev) divs = $(this).closest('[data-level="'+arg+'"]');
						else divs = $(this);
					}
					if(divs.length) return divs;
					else return false;
				}
			}
			$.fn.appendCol = function(arg) {
				var html = 
					'<div class="col-xs-'+arg.colLen+'" data-height-xs="'+arg.height+'" data-level="'+arg.level+'" data-index="'+arg.index+'" >' +
						'<div class="item"></div>' + 
					'</div>';
				$(this).children('.row').append(html);
				$(this).children('.row').find('.item').attClick();
			}
			$.fn.appendRow = function(arg) {
				var html =
					'<div class="row" data-level="'+arg.level+'" data-index="'+arg.index+'">' + 
						'<div class="col-xs-'+g_totNumGrids+'" data-height-xs="'+arg.height+'">' +
							'<div class="item"></div>' + 
						'</div>' +
					'</div>';
				$(this).children('.row').append(html);
				$(this).children('.row').find('.item').attClick();
			}
			dataItemToDiv = function(crpData, template, colLen){
				crpData.type = 'division';
				crpData.template = template;
				if(template == 'cols'){
					var l = colLen;
					crpData.data = [ 
						{'type': 'item', 'class': ['col-xs-'+l[0], 'col-sm-'+l[0], 'col-md-'+l[0], 'col-lg-'+l[0]], 'attr': {}},
						{'type': 'item', 'class': ['col-xs-'+l[1], 'col-sm-'+l[1], 'col-md-'+l[1], 'col-lg-'+l[1]], 'attr': {}}
					];
				}
				else if(template == 'rows'){
					var l = g_totNumGrids;
					crpData.data = [ 
						{'type': 'item', 'class': ['col-xs-'+l, 'col-sm-'+l, 'col-md-'+l, 'col-lg-'+l], 'attr': {}},
						{'type': 'item', 'class': ['col-xs-'+l, 'col-sm-'+l, 'col-md-'+l, 'col-lg-'+l], 'attr': {}}
					];
				}
			}
			$.fn.halfHeights = function(){
				var height = $(this).calcDataHeight();
				var hs;
				if(height < 2){ hs = [1, 1]; }
				else { 
					var h0 = Math.floor(height/2);
					var h1 = height - h0;
					hs = [h0, h1];
				}
				return hs;
			}
			$.fn.changeAllNextIndex = function(){
				var $next = $(this).next()
				if(!$next.length) return $(this).prev();
				while(true){
					var index = $next.attr('data-index').split('|');
					index[index.length-1] = parseInt(index[index.length-1]) - 1;
					index = index.join('|');
					$next.attr('data-index', index);

					$next = $next.next();
					if(!$next.length) return $(this).next();
				}
			}
			$.fn.nextDiv = function(){
				var $next = $(this).next();
				if(!$next.length) return $(this).prev();
				return $next;
			}
			$.fn.removeCrpData = function(){
				var index = $(this).attr('data-index').split('|');
				var nth = parseInt(index[index.length-1]);
				$(this).dataLevel('-1').correspData().data.splice(nth, 1);
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
	function lengthObj(obj){
		var len = 0;
		for(var key in obj){ len++; }
		return len;
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
