(function($){
	$(document).ready(function(){
		//$('#editpage-container').makeEditor({'rhConfUrl': '//anisotropic.jinbo.net/www2015/files/cache/rh_config.json'});
		$('#editpage-container').makeEditor();
	});

})(jQuery);

(function($){
	//설명 ************************
	// 1. data-heigt-mode는 '1'로 하고 변경할 수 없도록 한다.
	// 2. data-height-[bp]의 값은 정수.
	// 3. 컬럼의 폭을 변화시킬 때, 인접한 컬럼의 폭도 함께 변화시킨다. 이때 동일한 층에 있는 컬럼들만을 고려한다.
	// 4. 아이템의 높이를 변화시킬 때는, 층을 무시하고, 인접한 아이템의 높이만 변화시킨다.
	//*****************************
	var g_totNumGrids = undefined;
	var g_conWidth = {lg: 800, md: 800, sm: 500, xs: 500}; //나중에 cache에 이 값이 저장되도록 한다.
	var g_curLevel = 1;
	var g_curBreakPoint = 'md';
	var g_sectionData = {'section1': {'attr': {'data-height-mode': '1'}, 'data': {'type': 'item'}}};
	var g_info = {};
	var g_$invisible = undefined;

	$.fn.makeEditor = function(arg){// arg = { rhConfUrl: 'regheight.js에서 사용할 config의 url' }
		g_totNumGrids = getNumGrids(arg);

		$.ajax({
			url: $(this).attr('url'),
			dataType: 'json',
			async: false,
			success: function(data){
				g_sectionData = data;
			}
		});
		var html =	'<div id="edit-region">' +
						'<div id="toolbar"></div>' + 
						'<div id="main-region"></div>' + 
						'<div id="add-section-wrap"></div>' + 
						'<div id="invisible"></div>' + 
					'</div>'
		$(this).append(html);
		$mainRegion = $(this).children('#edit-region').children('#main-region');
		$toolbar = $(this).children('#edit-region').children('#toolbar');
		$addSec = $(this).children('#edit-region').children('#add-section-wrap');
		g_$invisible = $(this).children('#edit-region').children('#invisible');
		g_$invisible.hide();
	
		$mainRegion.makeSection(g_sectionData);
		$toolbar.makeToolbar();
		$addSec.makeAddSec();

		firstRegHeight(arg);
		$mainRegion.showSections(g_curBreakPoint);
		$mainRegion.find('.con-bp-'+g_curBreakPoint).find('.level-mark').first().makeDivMenu();

		$(window).resize(function(){ $toolbar.find('#breakpoint-'+g_curBreakPoint).click();	});
		documentEvent();
	}

	documentEvent = function(){
		$(document).mousemove(function(event){
			if(g_info.flagDrag) markMouseMove(event);
		});
		$(document).mouseup(function(event){
			if(g_info.flagDrag) markMouseUp(event);
		});
	}

	$.fn.showSections = function(bp){
		var mainWidth = g_conWidth[bp] + $(this).find('.left-side').first().outerWidth();

		$(this).find('[class*="con-bp-"]').hide();
		$(this).find('.con-bp-'+bp).show();
		$(this).find('.container').outerWidth(g_conWidth[bp]);
		$(this).closest('#main-region').outerWidth(mainWidth);
		$(this).closest('#edit-region').find('#add-section-wrap').outerWidth(mainWidth);
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

		$main = $(this).parent().children('#main-region');
		$(this).find('input[name="breakpoint"]').click(function(){
			g_curBreakPoint = $(this).val();

			var $thisMark = $main.find('.level-mark.selected');
			var thisIndex = $thisMark.parent().attr('data-index');
			var $thisCon = $thisMark.closest('.container').find('.con-bp-'+g_curBreakPoint);
			var $thatObj;
			if($thisCon.is('[data-index="'+thisIndex+'"]')) $thatObj = $thisCon;
			else $thatObj = $thisCon.find('[data-index="'+thisIndex+'"]');
		
			$main.showSections(g_curBreakPoint);
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
			var newSecData = {}; newSecData[secName] = {'attr': {'data-height-mode': '1'}, 'data': {'type': 'item'}};
			g_sectionData[secName] = newSecData[secName];
			$main.makeSection(newSecData);
			g_curLevel = 1;
			$main.showSections(g_curBreakPoint);
			$main.find('.con-bp-'+g_curBreakPoint+'[data-index="'+secName+'"]').find('.level-mark').first().makeDivMenu();
			saveSectionData();
		});
	}
	makeUniqueKey = function(){
		var name = '_newsec_';
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
			var html = '';
			for(var bp in g_conWidth){
				html += '<div class="con-bp-'+bp+'" data-level="0" data-index="'+secname+'">' + 
							makeMarkup(divData[secname].data, bp, '', 0, secname) + 
						'</div>';
			}
			html =	'<div class="section-region">' +
						'<div class="left-side">' + '</div>' + 
						'<div class="container" ' + attr + '>' + '<div class="row"></div>' + html + '</div>' +
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
		for(var i = 0; i < classes.length; i++){
			if(classes[i].match('col-'+bp+'-')) return classes[i].replace('col-'+bp+'-', 'col-xs-'); 
		}
		if(bp == 'lg') return getClass(classes, 'md');
		else if(bp == 'md') return getClass(classes, 'sm');
		else if(bp == 'sm') return getClass(classes, 'xs');
		else if(bp == 'xs') return ''; 
	}
	function getAttr(attrs, bp){
		for(var key in attrs){
			if(key.match('data-height-mode')) return key + '="' + attrs[key] +'" ';
			if(key.match('data-height-'+bp)) return 'data-height-xs' + '="' + attrs[key] + '" ';
		}
		if(bp == 'lg') return getAttr(attrs, 'md');
		else if(bp == 'md') return getAttr(attrs, 'sm');
		else if(bp == 'sm') return getAttr(attrs, 'xs');
		else if(bp == 'xs') return '';
	}

	$.fn.makeLevelMark = function(level){
		$(this).find('.level-mark').remove();
		var $cons = $(this).find('.con-bp-'+g_curBreakPoint);
		if(level == 1)
			$cons.append('<div class="level-mark"></div>');
		else
			$cons.find('[data-level="' + (level-1) +'"]').append('<div class="level-mark"></div>');

		$marks = $(this).find('.level-mark');
		$marks.each(function(){
			var $div = $(this).parent();
			$(this).offset($div.offset());
			$(this).outerWidth($div.rectWidth());
			$(this).outerHeight($div.rectHeight());
		});
		$marks.mouseover(function(){
			var info = $(this).divInfo();
			$(this).addClass(cursorClass(info));
		});
		$marks.click(function(){
			$(this).makeDivMenu();
		});
		$marks.mousedown(function(){
			var info = $(this).divInfo();

			if(info.divType == '') return;
			else if(info.divType == 'row' && info.isItem == false) return;

			$main = $(this).closest('#main-region');
			$main.find('.divmenu').hide();
			$(this).addClass('cur-level-mark');

			makeRuler(info); // info.rulerPosX, info.unitH;
			g_info = info;
			g_info.flagDrag = true;
			g_info.mousePosX = event.pageX; g_info.mousePosY = event.pageY;
			g_info.curWidth = g_info.$mark.rectWidth();
			g_info.curHeight = g_info.$mark.rectHeight();
			if(g_info.divType == 'col'){
				g_info.indexPosX = whichIndex(g_info.curWidth, g_info.rulerPosX.snap);
				g_info.preIdxPosX = g_info.indexPosX;
				g_info.$adjMark = g_info.$div.adjacentMark();
				if(g_info.$adjMark){ g_info.indexSum = whichIndex(g_info.$adjMark.rectWidth(), g_info.rulerPosX.snap) + g_info.indexPosX };
			}
			if(g_info.isItem){
				g_info.dataH = Math.round(g_info.curHeight / g_info.unitH);
				g_info.preDataH = g_info.dataH;
			}
			g_$invisible.addClass(cursorClass(g_info)).show();

		});
	}//$.fn.makeLevelMark

	markMouseMove = function(event){
		var wdiff = event.pageX - g_info.mousePosX
		if(g_info.divType == 'col' && wdiff != 0){
			g_info.mousePosX = event.pageX;
			g_info.curWidth += wdiff;
			var indexPosX = whichIndex(g_info.curWidth, g_info.rulerPosX.snap);
			//g_info.indexPosX = whichIndex(g_info.curWidth, g_info.rulerPosX.snap);
			if(g_info.$adjMark){
				var adjPosX = g_info.indexSum - indexPosX;
				if(adjPosX > 0) {
					g_info.$mark.outerWidth(g_info.rulerPosX.mark[indexPosX]);
					g_info.$adjMark.offset({ left: g_info.$mark.offset().left + g_info.$mark.rectWidth() });
					g_info.$adjMark.outerWidth(g_info.rulerPosX.mark[adjPosX]);
					g_info.indexPosX = indexPosX;
				}
			} else {
				g_info.$mark.outerWidth(g_info.rulerPosX.mark[indexPosX]);
				g_info.indexPosX = indexPosX;
			}
		}

		var hdiff = event.pageY - g_info.mousePosY;
		if(g_info.isItem && hdiff != 0){
			g_info.mousePosY = event.pageY;
			g_info.curHeight += hdiff;
			g_info.dataH = calcDataHeight(g_info);
			g_info.$mark.outerHeight(g_info.dataH * g_info.unitH);
		}
	}

	markMouseUp = function(event){
		g_info.$mark.removeClass('cur-level-mark');
		var flagCh = {width: false, height: false};
		if(g_info.indexPosX != g_info.preIdxPosX){
			flagCh.width = true;
			g_info.$div.colLen(g_info.indexPosX+1);
			g_info.$div.changeCrpData('col', g_curBreakPoint, g_info.indexPosX+1);
			if(g_info.$adjMark){
				var $adjDiv = g_info.$adjMark.parent();
				var index = g_info.indexSum - g_info.indexPosX + 1;
				$adjDiv.colLen(index);
				$adjDiv.changeCrpData('col', g_curBreakPoint, index);
			}
		}
		if(g_info.dataH != g_info.preDataH){
			flagCh.height = true;
			g_info.$target.attr('data-height-xs', g_info.dataH);
			g_info.$div.changeCrpData('height', g_curBreakPoint, g_info.dataH);
			var scrTop = $(window).scrollTop();
			g_info.$div.closest('[data-height-mode]').regHeight();
			$(window).scrollTop(scrTop);
		}
		if(flagCh.width || flagCh.height){
			g_info.$div.closest('#main-region').makeLevelMark(g_curLevel);
			saveSectionData();
		}
		g_info.$div.find('.level-mark').makeDivMenu();
		g_info.flagDrag = false;
		g_$invisible.removeAttr('class').hide();
	}
	cursorClass = function(info){
		if(info.divType == 'col'){
			if(info.isItem) return 'nwse-cursor';
			else return 'ew-cursor';
		}
		else if(info.divType == 'row' && info.isItem){
			return 'ns-cursor';
		}
	}
	$.fn.divInfo = function(){
		var info = {};
		info.$mark = $(this);
		info.$div = $(this).parent();
		info.divType = '';
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
			} else {
				info.divType = 'col';
				if(info.$div.children('.item').length) info.isItem = true;
			}
		}
		return info;
	}
	$.fn.makeRulerPosX = function(){
		var pos = {}; pos.mark = []; pos.snap = [];
		var width = $(this).rectWidth();
		for(var i = 0; i < g_totNumGrids; i++){
			pos.mark[i] = width * (i+1) / g_totNumGrids;
			pos.snap[i] = width * (i+0.5) / g_totNumGrids;
		}
		pos.snap[g_totNumGrids] = pos.mark[g_totNumGrids-1];
		return pos;
	};
	whichIndex = function(val, arr){
		for(var i = 0; i < arr.length - 1; i++){
			if(arr[i] <= val && val < arr[i+1]) return i;
		}
		if(val < arr[0]) return 0;
		if(val >= arr[arr.length-1]) return arr.length-1;
	}
	calcDataHeight = function(info){
		var dh = Math.round(info.curHeight / info.unitH);
		if(dh < 1) dh = 1;
		return dh;
	}
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
	makeRuler = function(info){
		info.$div.closest('#main-region').find('.w-ruler').remove();
		info.$div.closest('#main-region').find('.h-ruler').remove();

		if(info.divType == '') return;
		else if(info.divType == 'row' && info.isItem == false) return;

		if(info.divType == 'col'){
			var rulerPosX = info.$div.dataLevel('-1').makeRulerPosX();
			var $parDiv = info.$div.dataLevel('-1');
			var $wRuler = $('<div class="w-ruler"></div>').appendTo($parDiv);
			$wRuler.offset({ top: $parDiv.offset().top - $wRuler.rectHeight(), left: $parDiv.offset().left });
			for(var i = 0; i < rulerPosX.mark.length; i++){
				var $wMark = $('<div class="w-ruler-mark"></div>').appendTo($wRuler);
				var prePos; if(i == 0) prePos = 0; else prePos = rulerPosX.mark[i-1];
				$wMark.outerWidth(rulerPosX.mark[i] - prePos);
			}
			info.rulerPosX = rulerPosX;
		}
		if(info.isItem){
			var unitH = info.$div.closest('.container').children('.row').rectWidth() / g_totNumGrids;
			var numMark = Math.round(info.$div.rectHeight() / unitH);
			var $hRuler = $('<div class="h-ruler"></div>').appendTo(info.$div);
			$hRuler.offset({ top: info.$div.offset().top, left: info.$div.offset().left - $hRuler.rectWidth() });
			for(var i = 0; i < numMark; i++){
				var $hMark = $('<div class="h-ruler-mark"></div>').appendTo($hRuler);
				$hMark.outerHeight(unitH);
			}
			info.unitH = unitH;
		}
	}
	$.fn.adjacentMark = function(){// $.fn = [data-level]
		$next = $(this).next();
		if($next.length && $next.offset().top == $(this).offset().top){
			return $next.find('.level-mark');
		}
		else return undefined;
	}

	$.fn.makeDivMenu = function(){
		var $thisMark = $(this);
		var $wrap = $(this).closest('#main-region');
		var gdm = {};
		var $divMenu;

		if($thisMark.hasClass('selected')){
			$wrap.find('.divmenu').show();
			$wrap.find('.divmenu.disabled').removeClass('disabled');
			return;
		}
		$wrap.find('.selected').removeClass('selected');
		$thisMark.addClass('selected');

		makeRuler($thisMark.divInfo());
	
		gdm.$div = $thisMark.closest('[data-level]');
		gdm.template = gdm.$div.template();
		gdm.level = parseInt(gdm.$div.attr('data-level'));
		gdm.lastLevel = gdm.$div.lastLevel() + 1;
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
		$divMenu.scrollForThis();
		if(gdm.template == 'row') $divMenu.find('input[name="add-column"]').prop('disabled', true);
		else if(gdm.template == 'col') $divMenu.find('input[name="add-row"]').prop('disabled', true);
		if(g_curLevel <= 1){
			$divMenu.find('input[name="move-down"]').prop('disabled', true);
			if(lengthObj(g_sectionData) == 1) $divMenu.find('input[name="remove-this"]').prop('disabled', true);
		}
		if(g_curLevel >= gdm.lastLevel){
			 $divMenu.find('input[name="move-up"]').prop('disabled', true);
			 $divMenu.find('input[name="move-last"]').prop('disabled', true);
		}
		
		$divMenu.find('input[name="disabled"]').click(function(){
			$divMenu.addClass('disabled');
		});
		//층을 직접 입력했을 때
		$divMenu.find('input[name="display-level"]').keydown(function(e){
			if(e.keyCode == 13){//Enter key
				var lev = parseInt($(this).val());
				if(lev < 1) lev = 1;
				if(lev > gdm.lastLevel) lev = gdm.lastLevel;
				if(lev < g_curLevel){
					var diff = g_curLevel - lev;
					for(var i = 0; i < diff; i++)
						$wrap.find('.divmenu').find('input[name="move-down"]').click();
				}
				else if(lev > g_curLevel){
					var diff = lev - g_curLevel;
					for(var i = 0; i < diff; i++)
						$wrap.find('.divmenu').find('input[name="move-up"]').click();
				}
			}
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
					g_curLevel = gdm.lastLevel;
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
						var bp = $(this).bpOfCon();
						$(this).removeAttr('data-height-xs');
						$(this).children().remove();
						$(this).append('<div class="row"></div>');
						$(this).appendCol({colLen: halfCol[0], height: height, level: gdm.level+1, index: gdm.index+'|0'});
						$(this).appendCol({colLen: halfCol[1], height: height, level: gdm.level+1, index: gdm.index+'|1'});
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
						$(this).removeAttr('data-height-xs');
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
	$.fn.template = function(){
		var template = '';
		var $upper = $(this).find('[data-level]').first();
		if($upper.hasClass('row')) template = 'row';
		else if($upper.is('[class*=col-]')) template = 'col';
		return template
	}
	$.fn.lastLevel = function(){
		var level = 0;
		$(this).closest('[data-level="0"]').find('[data-level]').each(function(){
			if($(this).attr('data-level') > level) level = $(this).attr('data-level');
		});
		return parseInt(level); 
	}
	$.fn.scrollForThis = function(){
		var topGap = 70;
		var botGap = 20;
		var wtop = $(this).offset().top - $(window).scrollTop();
		var wbottom = $(this).offset().top + $(this).outerHeight() - $(window).scrollTop();
		if(wtop - topGap < 0){
			var newScrTop = $(window).scrollTop() + wtop - topGap;
			$(window).scrollTop(newScrTop);
		}
		if(wbottom + botGap > $(window).height()){
			var newScrTop = $(window).scrollTop() + wbottom + botGap - $(window).height();
			$(window).scrollTop(newScrTop);
		}
	}
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
	$.fn.dataLevel = function(arg){ //$.fn = [data-level]
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
		for(var key in crpData.attr){
			if(key.match('data-height-')) delete crpData.attr[key];
		}
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

	$.fn.rectWidth = function(){
		var rect = $(this)[0].getBoundingClientRect();
		return rect.right - rect.left;
	}
	$.fn.rectLeft = function(){
		var rect = $(this)[0].getBoundingClientRect();
		return rect.left;
	}
	$.fn.rectRight = function(){
		var rect = $(this)[0].getBoundingClientRect();
		return rect.right;
	}
	$.fn.rectHeight = function(){
		var rect = $(this)[0].getBoundingClientRect();
		return rect.bottom - rect.top;
	}
	$.fn.rectTop = function(){
		var rect = $(this)[0].getBoundingClientRect();
		return rect.top;
	}
	$.fn.rectBottom = function(){
		var rect = $(this)[0].getBoundingClientRect();
		return rect.bottom;
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
	getNumGrids = function(arg){
		var numGrids;
		if(arg && arg.rhConfUrl){
			$.ajax({
				url: arg.rhConfUrl,
				dataType: 'json',
				async: false,
				success: function(data){
					numGrids = data.grid_columns;
				},
				error: function(){
					alert(arg.rhConfUrl+'을 불러오는데 문제가 발생했습니다.');
					numGrids = 12;
				}
			});
		} else {
			numGrids = 12;
		}
		return numGrids;
	}
	firstRegHeight = function(arg){
		if(arg && arg.rhConfUrl){
			$('[data-height-mode]').regHeight(arg.rhConfUrl);
		}
	}

})(jQuery);
