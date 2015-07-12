(function($){
	$(document).ready(function(){
		$('#editpage-container').makeEditor({
			url: '//anisotropic.jinbo.net/www2015/files/cache/front_section.json',
			previewUrl: '//anisotropic.jinbo.net/www2015',
			presetUrl: '//anisotropic.jinbo.net/www2015/files/cache/edit-data/preset.json',
			rhConfig: ''
		});
	});

})(jQuery);

(function($){
	//설명 ************************
	// 1. data-heigt-mode는 '1'로 하고 변경할 수 없도록 한다.
	// 2. data-height-[bp]의 값은 정수.
	// 3. 컬럼의 폭을 변화시킬 때, 인접한 컬럼의 폭도 함께 변화시킨다. 이때 동일한 층에 있는 컬럼들만을 고려한다.
	// 4. 아이템의 높이를 변화시킬 때는, 층을 무시하고, 인접한 아이템의 높이만 변화시킨다.
	//*****************************
	var g_totNumGrids;
	var g_rhConfig;
	var g_conWidth = {lg: 1100, md: 1100, sm: 700, xs: 700, xxs: 700}; //나중에 cache에 이 값이 저장되도록 한다.
	var g_curLevel = 1;
	var g_curBreakPoint = 'lg';
	var g_sectionData = {};
	var g_presetData = {};
	var g_info;
	var g_ctrlDown = false;
	var g_$edReg;
	var g_$main;
	var g_preWin;

	$.fn.makeEditor = function(arg){
		g_presetData = getPreset(arg);
		g_sectionData = getSectionData(arg);

		var html =	'<div id="edit-region">' +
						'<div id="toolbar-wrap"><div id="toolbar"></div></div>' + 
						'<div id="main-region"></div>' + 
						'<div id="add-section-wrap"></div>' + 
					'</div>'
		$(this).append(html);
		g_$edReg = $(this).children('#edit-region');
		g_$main = g_$edReg.children('#main-region');
		var $toolbar = g_$edReg.find('#toolbar');
		var $addSec = g_$edReg.children('#add-section-wrap');
	
		g_$main.makeSection(g_sectionData);

		$toolbar.makeToolbar(arg);
		$addSec.makeAddSec();
		
		g_rhConfig = getRhConfig(arg);
		g_totNumGrids = g_rhConfig.grid_columns;
		g_$main.showSections(g_curBreakPoint);
		g_$main.find('.con-bp-'+g_curBreakPoint).find('.level-mark').first().makeDivMenu();

		documentEvent();
	}

	documentEvent = function(){
		$(document).mousemove(function(event){
			if(g_info){ markMouseMove(event); return false; }
		});
		$(document).mouseup(function(event){
			if(g_info){ markMouseUp(event); return false; }
		});
		$(document).keydown(function(event){
			if(event.keyCode == 17) g_ctrlDown = true;
		});
		$(document).keyup(function(event){
			if(event.keyCode == 17) g_ctrlDown = false;
		});
		
		$(window).resize(function(){
			g_$edReg.find('#breakpoint-'+g_curBreakPoint).click();
		});
	}

	$.fn.showSections = function(bp){ //$.fn = #main-region, .section-region, .container-wrap
		g_$edReg.outerWidth(g_conWidth[bp]);
		g_$edReg.find('#toolbar-wrap').outerWidth(g_conWidth[bp]);
		$(this).find('[class*="con-bp-"]').hide();
		$(this).find('.con-bp-'+bp).show();
		if($(this).is('[data-height-mode]')) $(this).regHeight();
		else $(this).find('.container-wrap[data-height-mode]').regHeight();
		g_$main.makeLevelMark(g_curLevel);
	}
	
	$.fn.makeToolbar = function(arg){
		var html = '';
		for(var ki in g_conWidth){
			html += '<div class="radio-button">' +
						'<input id="breakpoint-'+ki+'" type="radio" name="breakpoint" value="'+ki+'">' +
						'<label for="breakpoint-'+ki+'">'+ki+'</label>' + 
					'</div>';
		}
		html += '<input type="button" name="preview" value="미리보기">';
		$(this).html(html);
		$(this).find('input[value="'+g_curBreakPoint+'"]').prop('checked', true);

		$(this).find('input[name="breakpoint"]').click(function(){
			g_curBreakPoint = $(this).val();

			var $thisMark = g_$main.find('.level-mark.selected');
			var thisIndex = $thisMark.parent().attr('data-index');
			var $thisCon = $thisMark.closest('.container-wrap').find('.con-bp-'+g_curBreakPoint);
			var $thatObj;
			if($thisCon.is('[data-index="'+thisIndex+'"]')) $thatObj = $thisCon;
			else $thatObj = $thisCon.find('[data-index="'+thisIndex+'"]');

			g_$main.showSections(g_curBreakPoint);
			$thatObj.find('.level-mark').makeDivMenu();
		});
		$(this).find('input[name="preview"]').click(function(){
			if(arg && arg.previewUrl){
				var secname = g_$main.find('.level-mark.selected').closest('[data-level="0"]').attr('data-index');
				var url = arg.previewUrl+'#front-'+secname;
				var winname = 'jb-preview';
				var width;
				if(g_curBreakPoint == 'xxs') width = g_rhConfig.screen_xs_min - 10;
				else if(g_curBreakPoint == 'xs') width = (parseInt(g_rhConfig.screen_sm_min) + parseInt(g_rhConfig.screen_xs_min)) / 2;
				else if(g_curBreakPoint == 'sm') width = (parseInt(g_rhConfig.screen_md_min) + parseInt(g_rhConfig.screen_sm_min)) / 2;
				else if(g_curBreakPoint == 'md') width = (parseInt(g_rhConfig.screen_lg_min) + parseInt(g_rhConfig.screen_md_min)) / 2;
				else if(g_curBreakPoint == 'lg') width = g_rhConfig.scrren_lg_min;
				var height = $(window).outerHeight();
				var specs = 'left='+(screen.width - width)/2+', top='+((screen.height - height)/2-40)+', width='+width+', height='+height;
				if(g_preWin) g_preWin.close();
				g_preWin = window.open(url, winname, specs);
				/* 미리보기 창에서 강제로 스크롤 다운... 나중에 사용할 수도 있겠다.
				setTimeout(function(){
					$(g_preWin).scrollTop(500);
				}, 1000);
				*/
			}
		});
	}

	$.fn.makeAddSec = function(){
		$(this).append('<input type="button" name="add-section" value="섹션 추가">').click(function(){
			var secName = makeUniqueKey();
			var newSecData = {}; newSecData[secName] = blankSection(); 
			g_sectionData[secName] = newSecData[secName];
			g_$main.makeSection(newSecData);
			g_curLevel = 1;
			g_$main.showSections(g_curBreakPoint);
			g_$main.find('.con-bp-'+g_curBreakPoint+'[data-index="'+secName+'"]').find('.level-mark').first().makeDivMenu();
			saveSectionData();
		});
	}
	makeUniqueKey = function(){
		var name = 'section';
		var max = 0;
		for(var ki in g_sectionData){
			var num = parseInt(ki.replace(name, ''));
			if(num > max) max = num;
		}
		return name + (max + 1);
	}
	$.fn.makeSection = function(divData){ //$.fn = #main-region
		var $main = $(this);
		for(var secname in divData){
			var attr = getAttr(divData[secname].attr);
			if(!attr) attr = ''; else attr = ' '+attr;
			var html = 
				'<div class="section-region">' +
					'<div class="left-side">' + 
						'<input type="button" name="sec-config" value="설정">' +
						'<div class="preset"></div>' +
					'</div>' + 
					'<div class="container-wrap"'+attr+'>' + htmlContainerWrap(divData[secname], secname) + '</div>' +
				'</div>';
			$main.append(html);
			var $last = $main.find('.section-region').last();
			$last.find('.container-wrap').find('.item').attClick();
			$last.find('.left-side').find('input[type="button"][name="sec-config"]').click(function(){
				var secName = $(this).closest('.section-region').find('.con-bp-lg').attr('data-index');
				makeConfig(secName, 'section');
			});
			$last.find('.left-side').makePresetIcons();
			$last.find('.container-wrap').css({'min-height': $last.find('.left-side').outerHeight()});
		}
	}
	htmlContainerWrap = function(data, secname){
		var html = '<div class="row"></div>';
		for(var bp in g_conWidth){
			html += '<div class="con-bp-'+bp+'" data-level="0" data-index="'+secname+'">' + 
						makeMarkup(data.data, bp, '', 0, secname) + 
					'</div>';
		}
		return html;
	}
	$.fn.makePresetIcons = function(){ //$.fn = .left-side
		var $preset = $(this).find('.preset');
		var data = g_presetData;
		var html = '';
		for(var secname in data){
			var attr = getAttr(data[secname].attr);
			var innerHtml = '';
			for(var bp in g_conWidth){
				innerHtml += '<div class="preset-bp-'+bp+'">'+makeMarkup(data[secname].data, bp, '', 0, secname)+'</div>';
			}
			html += '<div class="preset-container" data-secname="'+secname+'" '+attr+'><div class="row"></div>'+innerHtml+'</div>';
		}
		$preset.html(html);
		$preset.find('[data-height-mode]').regHeight();

		var nh = [];
		$preset.find('[class*="col-xs-"]').each(function(idx){
			var $preCon = $(this).closest('[class*="preset-bp-"]');
			var nwh = $preCon.rectHeight();
			var wh = $preCon.children('.row').rectHeight();
			var h = $(this).rectHeight();
			nh[idx] = h * nwh / wh;
		});
		$preset.find('[class*="col-xs-"]').each(function(idx){
			$(this).outerHeight(nh[idx]);
		});
		$preset.find('[class*="preset-bp-"]').hide();
		$preset.find('.preset-bp-lg').show();
		$preset.find('.preset-container').hover(
			function(){ $(this).find('[class*="preset-bp-"]').show(); $(this).find('.preset-bp-xxs').hide(); },
			function(){ $(this).find('[class*="preset-bp-"]').hide(); $(this).find('.preset-bp-lg').show(); }
		);
		$preset.find('.preset-container').click(function(){
			//프리셋을 클릭하면 해당 섹션의 정보는, 섹션 정보를 제외하고는 모두 사라지고, 프리셋의 데이터로 바뀐다.
			var $container = $(this).closest('.section-region').find('.container-wrap');
			var preData = g_presetData[$(this).attr('data-secname')];
			var secname = $container.children('[data-level]').first().attr('data-index');
			g_sectionData[secname].data = preData.data;
			saveSectionData();
			g_curLevel = 1;
			$container.children().remove();
			$container.append(htmlContainerWrap(g_sectionData[secname], secname));
			$container.showSections(g_curBreakPoint);
			$container.find('.level-mark').makeDivMenu();
		});
	}
	copyObj = function(from, to, option){
		if($.type(from) === 'object'){
			for(ki in from){
				if(option && option.except){
					var isExcept = false;
					for(var i in option.except){
						if(option.except[i] == ki){ isExcept = true; break; }
					}
					if(isExcept) continue;
				}
				if($.type(from[ki]) === 'string'){
					to[ki] = from[ki];
				}
				else if($.type(from[ki]) === 'object'){
					if(to[ki] === undefined) to[ki] = {};
					copyObj(from[ki], to[ki], option);
				}
				else if($.type(from[ki]) === 'array'){
					if(to[ki] === undefined) to[ki] = [];
					copyObj(from[ki], to[ki], option);
				}
				else { alert('errer in copyObj()'); return false; }
			}
		}
		else if($.type(from) === 'array'){
			var len = to.length;
			for(i in from){
				if($.type(from[i]) === 'string'){
					if(option && option.same === false){
						var isDouble = false;
						for(j = 0; j < len; j++){
							if(from[i] == to[j]){ isDouble = true; break; }
						}
						if(!isDouble) to.push(from[i]);
					}
					else{ to.push(from[i]); }
				}
				else if($.type(from[i]) === 'object'){
					to.push({});
					copyObj(from[i], to[to.length-1], option);
				}
				else if($.type(from[i]) === 'array'){
					to.push([]);
					copyObj(from[i], to[to.length-1], option);
				}
				else { alert('error in copyObj()'); return false; }
			}
		}
		else return false;
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
	makeMarkup = function(divData, breakpoint, template, level, index){
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
				return '<div class="row" ' + levInd + '><div class="col-xs-12" ' + attr + '><div class="item"></div></div></div>';
			else if(template == 'cols')
				return '<div class="' + classes + '" ' + attr + ' ' + levInd + '><div class="item"></div></div>';
			else if(!template)
				return '<div class="item"></div>';
		}
	}
	getClass = function(classes, bp){
		if(!classes) return '';
		if(!classes.length) return '';
		if(bp == 'xxs') return 'col-xs-12';
		for(var i = 0; i < classes.length; i++){
			if(classes[i].match('col-'+bp+'-')) return classes[i].replace('col-'+bp+'-', 'col-xs-'); 
		}
		if(bp == 'lg') return getClass(classes, 'md');
		else if(bp == 'md') return getClass(classes, 'sm');
		else if(bp == 'sm') return getClass(classes, 'xs');
		else if(bp == 'xs') return ''; 
	}
	getAttr = function(attrs, bp){
		for(var key in attrs){
			if(key == 'data-height-mode') return key + '="' + attrs[key] +'" ';
			if(key == 'data-height-'+bp) return 'data-height-xxs' + '="' + attrs[key] + '" ';
		}
		if(bp == 'lg') return getAttr(attrs, 'md');
		else if(bp == 'md') return getAttr(attrs, 'sm');
		else if(bp == 'sm') return getAttr(attrs, 'xs');
		else if(bp == 'xs') return getAttr(attrs, 'xxs');
		else if(bp == 'xxs') return '';
	}

	$.fn.makeLevelMark = function(level){ //$.fn = #main-region
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
			var type = $(this).divInfo().divType;
			if(type == 'col') $(this).append('<div class="div-type">col</div>');
			else if(type == 'row') $(this).append('<div class="div-type">row</div>');
		});
		$marks.mouseover(function(){
			var info = $(this).divInfo();
			$(this).addClass(cursorClass(info));
		});
		$marks.click(function(){
			$(this).makeDivMenu();
		});
		$marks.mousedown(function(event){
			var info = $(this).divInfo();
			if(info.divType == '') return;
			else if(info.divType == 'row' && info.isItem == false) return;
			if(g_curBreakPoint == 'xxs' && info.isItem == false)  return;

			$(this).closest('#main-region').find('.divmenu').hide();
			$(this).addClass('cur-level-mark');

			makeRuler(info);
			g_info = info;
			g_info.flagDrag = true;
			if(g_info.divType == 'col' && g_curBreakPoint != 'xxs'){
				g_info.mousePosX = event.pageX;
				g_info.curWidth = g_info.$mark.rectWidth();
				g_info.colL = Math.round(g_info.curWidth / g_info.unitW);
				g_info.preColL = g_info.colL;
				g_info.$adjColMark = g_info.$mark.adjacentColMark();
				if(g_info.$adjColMark){
					g_info.colLenSum = g_info.colL + Math.round(g_info.$adjColMark.rectWidth() / g_info.unitW); 
				}
			}
			if(g_info.isItem && g_info.useRegHei){
				g_info.mousePosY = event.pageY;
				g_info.curHeight = g_info.$mark.rectHeight();
				g_info.dataH = Math.round(g_info.curHeight / g_info.unitH);
				g_info.preDataH = g_info.dataH;
				g_info.adjItem = g_info.$mark.adjacentItem();
			}
			return false;
		});
	}//$.fn.makeLevelMark

	markMouseMove = function(event){
		var wdiff = event.pageX - g_info.mousePosX
		if(g_info.divType == 'col' && wdiff != 0 && g_curBreakPoint != 'xxs'){
			g_info.mousePosX = event.pageX;
			g_info.curWidth += wdiff;
			var colL = Math.round(g_info.curWidth / g_info.unitW);
			if(colL < 1) colL = 1; if(colL > g_totNumGrids) colL = g_totNumGrids;
			if(g_info.$adjColMark){
				var adjColL = g_info.colLenSum - colL ;
				if(adjColL >= 1) {
					g_info.$mark.outerWidth(colL * g_info.unitW);
					g_info.$adjColMark.offset({ left: g_info.$mark.offset().left + g_info.$mark.rectWidth() });
					g_info.$adjColMark.outerWidth(adjColL * g_info.unitW);
					g_info.colL = colL;
				}
			} else {
				g_info.$mark.outerWidth(colL * g_info.unitW);
				g_info.colL = colL;
			}
		}
		var hdiff = event.pageY - g_info.mousePosY;
		if(g_info.isItem && g_info.useRegHei && hdiff != 0){
			g_info.mousePosY = event.pageY;
			g_info.curHeight += hdiff;
			var dataH = Math.round(g_info.curHeight / g_info.unitH); if(dataH < 1) dataH = 1;
			if(dataH != g_info.dataH){
				var flagChange = true;
				var diffDataH = dataH - g_info.preDataH;
				var hdivs = g_info.adjItem.divs.hor;
				for(var i = 0; i < hdivs.length; i++){
					if($(hdivs[i]).dataHeight() + diffDataH < 1){ flagChange = false; break; }
				}
				var vdivs = g_info.adjItem.divs.ver;
				for(var i = 0; i < vdivs.length; i++){
					if($(vdivs[i]).dataHeight() - diffDataH < 1){ flagChange = false; break; }
				}
				if(flagChange){
					g_info.$mark.outerHeight(dataH * g_info.unitH);
					var markDiffH = (dataH - g_info.dataH) * g_info.unitH;
					var hmarks = g_info.adjItem.marks.hor;
					for(var i = 0; i < hmarks.length; i++){
						var markH = $(hmarks[i]).rectHeight() + markDiffH;
						$(hmarks[i]).outerHeight(markH);
					}
					var vmarks = g_info.adjItem.marks.ver;
					for(var i = 0; i < vmarks.length; i++){
						var markH = $(vmarks[i]).rectHeight() - markDiffH;
						var markTop = g_info.$mark.offset().top + g_info.$mark.rectHeight();
						$(vmarks[i]).outerHeight(markH);
						$(vmarks[i]).offset({top: markTop});
					}
					g_info.dataH = dataH;
				}
			}
		}
	}//markMouseMove()

	markMouseUp = function(event){
		g_info.$mark.removeClass('cur-level-mark');
		var flagCh = {width: false, height: false};
		if(g_info.colL != g_info.preColL){
			flagCh.width = true;
			g_info.$div.colLen(g_info.colL);
			g_info.$div.changeCrpData('col', g_curBreakPoint, g_info.colL);
			if(g_info.$adjColMark){
				var $adjDiv = g_info.$adjColMark.parent();
				var adjColL = g_info.colLenSum - g_info.colL;
				$adjDiv.colLen(adjColL);
				$adjDiv.changeCrpData('col', g_curBreakPoint, adjColL);
			}
		}
		if(g_info.dataH != g_info.preDataH){
			flagCh.height = true;
			g_info.$div.dataHeight(g_info.dataH);
			g_info.$div.changeCrpData('height', g_curBreakPoint, g_info.dataH);
			changeAdjItemHeight(g_info.adjItem.divs, g_curBreakPoint, g_info.dataH - g_info.preDataH);
			var scrTop = $(window).scrollTop();
			g_info.$div.closest('[data-height-mode]').regHeight();
			$(window).scrollTop(scrTop);
		}
		if(flagCh.width || flagCh.height){
			saveSectionData();
		}
		g_info.$div.closest('#main-region').makeLevelMark(g_curLevel);
		g_info.$div.find('.level-mark').makeDivMenu();
		g_info = undefined;
	}
	cursorClass = function(info){
		if(g_curBreakPoint != 'xxs'){
			if(info.divType == 'col'){
				if(info.isItem && info.useRegHei) return 'nwse-cursor';
				else return 'ew-cursor';
			}
			else if(info.divType == 'row' && info.isItem && info.useRegHei){
				return 'ns-cursor';
			}
		}
		else {
			if(info.isItem && info.useRegHei) return 'ns-cursor';
		}
	}
	$.fn.divInfo = function(){
		var info = {};
		info.$mark = $(this);
		info.$div = $(this).parent();
		info.divType = '';
		info.$target = info.$div;
		info.isItem = false;
		info.useRegHei = false;
		if(info.$div.attr('data-level') != '0'){
			if(info.$div.hasClass('row')){
				info.divType = 'row';
				var cols = info.$div.children('[class*="col-"]');
				if(cols.length == 1 && cols.first().children('.item').length == 1){
					info.isItem = true;
					info.$target = cols.first();
					if(cols.attr('data-height-xxs')) info.useRegHei = true;
				}
			} else {
				info.divType = 'col';
				if(info.$div.children('.item').length) info.isItem = true;
				if(info.$div.attr('data-height-xxs')) info.useRegHei = true;
			}
		}
		return info;
	}
	inputObjElements = function(to, from){
		for(var key in from){
			to[key] = from[key];
		}
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
			if(arg1 == 'xs' || arg1 == 'sm' || arg1 == 'md' || arg1 == 'lg'){
				for(var i in crpData.class){
					if(crpData.class[i].match('col-'+arg1+'-')){ crpData.class[i] = 'col-'+arg1+'-'+arg2; return; }
				}
				crpData.class.push('col-'+arg1+'-'+arg2);
			}
		}
		else if(mode == 'height'){
			if(arg2){
				if(crpData.attr === undefined) crpData.attr = {};
				crpData['attr']['data-height-'+arg1] = arg2;
			}
		}
	}
	$.fn.correspData = function(){
		return correspData($(this).attr('data-index'));
	}
	correspData = function(index){
		index = index.split('|');
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

		if(info.divType == 'col' && g_curBreakPoint != 'xxs'){
			var $parDiv = info.$div.dataLevel('-1');
			var unitW = $parDiv.rectWidth() / g_totNumGrids;
			var $wRuler = $('<div class="w-ruler"></div>').appendTo($parDiv);
			$wRuler.offset({ top: info.$div.offset().top - $wRuler.rectHeight(), left: $parDiv.offset().left });
			for(var i = 0; i < g_totNumGrids; i++){
				var $wMark = $('<div class="w-ruler-mark"></div>').appendTo($wRuler);
				$wMark.outerWidth(unitW);
			}
			info.unitW = unitW;
		}
		if(info.isItem && info.useRegHei){
			var unitH = info.$div.closest('.container-wrap').children('.row').rectWidth() / g_totNumGrids;
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
	$.fn.adjacentColMark = function(){// $.fn = .level-mark
		if(g_ctrlDown) return undefined;

		$next = $(this).parent().next();
		if($next.length && $next.offset().top == $(this).offset().top){
			return $next.find('.level-mark');
		}
		else return undefined;
	}
	$.fn.adjacentItem = function(){//$.fn = .level-mark
		var adjItem = { marks: { hor: [], ver: [] }, divs: { hor: [], ver: [] }};
		if(g_ctrlDown) return adjItem;
		
		var $mark = $(this);
		var dataIndex = $mark.parent().attr('data-index');
		var itemMarks = $(this).closest('[data-level="0"]').find('.level-mark');
		var itemDivs = $(this).closest('[data-level="0"]').find('.item').closest('[data-level]');
		for(var i = 0; i < itemMarks.length; i++){
			if($mark.rectBottom() == $(itemMarks[i]).rectBottom() && $(itemMarks[i]).parent().attr('data-index') != dataIndex)
				adjItem.marks.hor.push(itemMarks[i]);
			if($mark.rectBottom() == $(itemMarks[i]).rectTop() && $(itemMarks[i]).parent().attr('data-index') != dataIndex)
				adjItem.marks.ver.push(itemMarks[i]);
		}
		for(var i = 0; i < itemDivs.length; i++){
			if($mark.rectBottom() == $(itemDivs[i]).rectBottom() && $(itemDivs[i]).attr('data-index') != dataIndex){
				adjItem.divs.hor.push(itemDivs[i]);
				var $fakeMark = $(itemDivs[i]).fakeLevelMark();
				if($fakeMark) adjItem.marks.hor.push($fakeMark);
			}
			if($mark.rectBottom() == $(itemDivs[i]).rectTop() && $(itemDivs[i]).attr('data-index') != dataIndex)
				adjItem.divs.ver.push(itemDivs[i]);
		}
		return adjItem;
	}
	$.fn.fakeLevelMark = function(){ //$.fn = [data-level]
		if(!this.closest('[data-level="'+(g_curLevel-1)+'"]').length){
			var $levMark = $('<div class="level-mark fake-level-mark"></div>').appendTo(this);
			$levMark.offset({ top: this.offset().top, left: this.offset().left });
			$levMark.outerWidth(this.rectWidth());
			$levMark.outerHeight(this.rectHeight());
			return $levMark;
		}
		else return undefined;
	}
	changeAdjItemHeight = function(adjDivs, bp, diffDH){
		for(var i = 0; i < adjDivs.hor.length; i++){
			var newDH = $(adjDivs.hor[i]).dataHeight() + diffDH;
			$(adjDivs.hor[i]).dataHeight(newDH);
			$(adjDivs.hor[i]).changeCrpData('height', bp, newDH);
		}
		for(var i = 0; i < adjDivs.ver.length; i++){
			var newDH = $(adjDivs.ver[i]).dataHeight() - diffDH;
			$(adjDivs.ver[i]).dataHeight(newDH);
			$(adjDivs.ver[i]).changeCrpData('height', bp, newDH);
		}
	}

	$.fn.makeDivMenu = function(){ // $.fn = .level-mark
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
		gdm.navLevel = getNavLevel(g_curLevel, gdm.lastLevel);
		gdm.index = gdm.$div.attr('data-index');
		gdm.$allDiv = gdm.$div.closest('.container-wrap').find('[data-index="'+gdm.index+'"]');

		//리모콘을 붙인다 //////////////////////////////////////////
		$wrap.find('.divmenu').remove();
		var html = 
			'<div class="divmenu">' + 
				'<input type="button" name="disabled" value="">' +
				'<div class="levels">'+
					htmlLevelButtons(gdm.navLevel, g_curLevel, gdm.lastLevel) +
				'</div>' +
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
				'<input type="button" name="config" value="설정">' +
			'</div>';
		$thisMark.closest('.container-wrap').append(html);
		$divMenu = $thisMark.closest('.container-wrap').find('.divmenu');
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
		$divMenu.find('.levels').find('input[value="'+g_curLevel+'"]').prop('disabled', true);
		
		$divMenu.find('input[name="disabled"]').click(function(){
			$divMenu.addClass('disabled');
		});

		//층 번호를 직접 클릭했을 때
		$divMenu.levButtClick(gdm);

		//설정버튼을 클릭했을 때
		$divMenu.find('input[name="config"]').click(function(){
			makeConfig(gdm.index);
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
			var regHeiMode = gdm.$div.closest('.container-wrap').attr('data-height-mode');
			
			if(buttonName == 'add-column'){//컬럼 추가 버튼을 클릭했을 때
				if(gdm.template == ''){//템플릿이 결정되지 않았을 때
					var halfCol = [Math.floor(g_totNumGrids/2), g_totNumGrids - Math.floor(g_totNumGrids/2)];
					dataItemToDiv(crpData, 'cols', halfCol);
					gdm.$allDiv.each(function(){
						var height; if(regHeiMode) height = $(this).calcDataHeight();
						var bp = $(this).bpOfCon();
						$(this).removeAttr('data-height-xxs');
						$(this).children().remove();
						$(this).append('<div class="row"></div>');
						if(bp == 'sm' || bp == 'xs' || bp == 'xxs'){ halfCol[0] = g_totNumGrids; halfCol[1] = g_totNumGrids };
						$(this).appendCol({colLen: halfCol[0], height: height, level: gdm.level+1, index: gdm.index+'|0'});
						$(this).appendCol({colLen: halfCol[1], height: height, level: gdm.level+1, index: gdm.index+'|1'});
						if(regHeiMode){
							crpData.data[0].attr['data-height-'+bp] = height;
							crpData.data[1].attr['data-height-'+bp] = height;
						}
					});
					targetIndex = gdm.index+'|1';
				}
				else if(gdm.template == 'col'){//템플릿이 컬럼일 때
					targetIndex = gdm.index+'|'+crpData.data.length;
					crpData.data.push({'type': 'item', 'class': [], 'attr': {}});
					var thisData = crpData.data[crpData.data.length-1];
					gdm.$allDiv.each(function(){
						var bp = $(this).bpOfCon();
						var totColLen = 0;
						var cols = $(this).find('[data-level="'+(gdm.level+1)+'"]');
						for(var i = 0; i < cols.length; i++){
							totColLen += $(cols[i]).colLen();
						}
						if(totColLen < g_totNumGrids){
							var newColLen = g_totNumGrids - totColLen;
							var height; if(regHeiMode) height = $(this).calcDataHeight();
							$(this).appendCol({colLen: newColLen, height: height, level: (gdm.level+1), index: targetIndex});
							changeData(thisData, 'col', bp, newColLen);
							changeData(thisData, 'height', bp, height);
						}
						else {
							var height; if(regHeiMode) height = 1;
							$(this).appendCol({colLen: g_totNumGrids, height: height, level: (gdm.level+1), index: targetIndex});
							changeData(thisData, 'col', bp, g_totNumGrids);
							changeData(thisData, 'height', bp, height);
						}
					});
				}
			}
			else if(buttonName == 'add-row'){//로우 추가 버튼을 클릭했을 때
				if(gdm.template == ''){//템플릿이 결정되지 않았을 때
					dataItemToDiv(crpData, 'rows');
					gdm.$allDiv.each(function(){
						var height = []; if(regHeiMode) height = $(this).halfHeights();
						$(this).removeAttr('data-height-xxs');
						$(this).children().remove();
						$(this).append('<div class="row"></div>');
						$(this).appendRow({height: height[0], level: gdm.level+1, index: gdm.index+'|0'});
						$(this).appendRow({height: height[1], level: gdm.level+1, index: gdm.index+'|1'});
						var bp = $(this).bpOfCon();
						if(regHeiMode){
							crpData.data[0].attr['data-height-'+bp] = height[0];
							crpData.data[1].attr['data-height-'+bp] = height[1];
						}
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
						var height; if(regHeiMode) height = 1;
						$(this).appendRow({height: height, level: (gdm.level+1), index: targetIndex});
						changeData(thisData, 'col', bp, g_totNumGrids);
						changeData(thisData, 'height', bp, height);
					});
				}
			}
			//디비전 삭제 버튼을 클릭했을 때 //////////////
			else if(buttonName == 'remove-this'){
				if(gdm.$div.attr('data-level') == 0){
					if(!confirm('섹션을 삭제하시겠습니까?')) return;
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
						var height; if(regHeiMode) height = $(this).calcDataHeight();
						var $div = $(this).dataLevel('-1');
						$div.children().remove();
						if($div.hasClass('row')){
							var dataHeight = '';
							if(height) dataHeight = ' data-height-xxs="'+height+'"';
							$div.append('<div class="col-xs-12"'+dataHeight+'><div class="item"></div></div>');
						}
						else if($div.is('[class*="col-xs-"]')){
							$div.append('<div class="item"></div>');
							if(height) $div.attr('data-height-xxs', height);
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
			$wrap.find('.container-wrap[data-height-mode]').regHeight();
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
		return template;
	}
	$.fn.lastLevel = function(){
		var level = 0;
		$(this).closest('[data-level="0"]').find('[data-level]').each(function(){
			var l = parseInt($(this).attr('data-level'));
			if(l > level) level = l;
		});
		return parseInt(level); 
	}
	htmlLevelButtons = function(start, cur, last){
		var html = '';
		if(last <= 6){
			for(var i = 1; i <= last; i++)
				html += '<input type="button" name="level-button" value = "'+i+'">';
		}
		else if(start == 1){
			for(var i = 1; i <= 5; i++)
				html += '<input type="button" name="level-button" value = "'+i+'">';
			html += '<input type="button" name="level-button" class="next-levels" value = ">">';
		}
		else if(last - start <= 4){
			html += '<input type="button" name="level-button" class="pre-levels" value = "<">';
			for(var i = start; i <= last; i++)
				html += '<input type="button" name="level-button" value = "'+i+'">';
		} else {
			html += '<input type="button" name="level-button" class="pre-levels" value = "<">';
			for(var i = start; i <= start + 3; i++)
				html += '<input type="button" name="level-button" value = "'+i+'">';
			html += '<input type="button" name="level-button" class="next-levels" value = ">">';
		}
		return html;
	}
	getNavLevel = function(cur, last){
		if(last <= 6) return 1;
		else if(cur <= 5) return 1;
		else return Math.floor((cur - 6) / 4) * 4 + 6;
	}
	$.fn.levButtClick = function(gdm){ //$.fn = .divmenu
		var $divMenu = this;
		$divMenu.find('input[name="level-button"]').click(function(){
			if($(this).is('.next-levels') || $(this).is('.pre-levels')){
				var navLevel;
				if($(this).is('.next-levels')){
					navLevel = parseInt($(this).prev().val()) + 1;
				}
				else if($(this).is('.pre-levels')){
					var lv = parseInt($(this).next().val());
					if(lv == 6) navLevel = 1;
					else navLevel = lv - 4;
				}
				$divMenu.find('.levels').children().remove();
				$divMenu.find('.levels').append(htmlLevelButtons(navLevel, g_curLevel, gdm.lastLevel));
				$divMenu.levButtClick(gdm);
			} else {
				var lev = parseInt($(this).val());
				if(lev < g_curLevel){
					var diff = g_curLevel - lev;
					for(var i = 0; i < diff; i++)
						g_$main.find('.divmenu').find('input[name="move-down"]').click();
				}
				else if(lev > g_curLevel){
					var diff = lev - g_curLevel;
					for(var i = 0; i < diff; i++)
						g_$main.find('.divmenu').find('input[name="move-up"]').click();
				}
			}
		});
	}
	makeConfig = function(dIndex, arg){
		var html =	'<div class="config-wrap">' +
						'<div class="config">' +
							'<input type="button" name="config-close" class="close-button" value="×">' +
						'</div>' +
					'</div>';
		g_$main.append(html);
		var $conf = g_$main.find('.config');
		$conf.offset({top: $(window).scrollTop() + 70});
		if(arg === 'section') $conf.attr('data-section', dIndex);
		else if(arg === undefined) $conf.attr('data-index', dIndex);
		$conf.append(htmlConfig(dIndex, arg));
		$conf.find('input[type="text"]').keydown(function(event){
			confTextKeydown($(this), event);
		});
		$conf.find('input[name="attr-obj-butn"]').click(function(event){
			makeExtConfInput($(this).closest('.config-row').find('input[type="text"]'));
		});
		$conf.find('input[type="button"][name="config-close"]').click(function(){
			saveConfig();
		});
	}
	makeExtConfInput = function($inpTxt){
		var text = '';
		if($inpTxt.hasClass('conf-readonly'))
			text = $inpTxt.next('.ext-value').val();
		else if($inpTxt.val()){
			var tmpTxt = $inpTxt.val().split(':');
			text = '"'+$.trim(tmpTxt[0])+'": "'+$.trim(tmpTxt[1])+'"';
		}
		var html =	'<div class="ext-input-wrap"><div class="ext-input">' +
						'<input type="button" name="ext-input-close" class="close-button" value="×">' +
						'<textarea>'+text+'</textarea>' +
					'</div></div>';
		g_$main.append(html);
		var $ext = g_$main.find('.ext-input');
		$ext.find('textarea').focus();
		$ext.find('textarea').keydown(function(event){
			if(event.keyCode == 9){ // key: tab
				event.preventDefault();
				var start = $(this).get(0).selectionStart;
				var end = $(this).get(0).selectionEnd;
				$(this).val($(this).val().substring(0, start) + '\t' + $(this).val().substring(end));
				$(this).get(0).selectionStart = start + 1;
				$(this).get(0).selectionEnd = start + 1;
			}
		});
		$ext.find('.close-button').click(function(){
			var str = $ext.find('textarea').val();
			if(str){
				var data;
				try { data = JSON.parse('{'+str+'}'); }
				catch(e) { alert('올바른 JSON 구문이 아닙니다.'); $(this).parent().find('textarea').focus(); return; }
				var key = '';
				var len = 0; for(var ki in data){ if(len == 0) key = ki; len++; }
				if(len > 1) alert("하나의 property만 유효합니다.");
				var value = '';
				if($.type(data[key]) == 'object' || $.type(data[key]) == 'array'){
					value = key+': ['+$.type(data[key])+']';
					$inpTxt.addClass('conf-readonly');
				}
				else {
					str = '';
					value = key+': '+data[key];
					$inpTxt.removeClass('conf-readonly');
				}
				$inpTxt.next('.ext-value').text(str);
				$inpTxt.val(value);
			}
			else {
				$inpTxt.next('.ext-value').text('');
				$inpTxt.val('');
				$inpTxt.removeClass('conf-readonly');
			}
			$ext.parent().remove();
		});
	}
	saveConfig = function(){
		var $conf = g_$main.find('.config');
		var data = {};
		if($conf.is('[data-section]'))
			data = g_sectionData[$conf.attr('data-section')];
		else if($conf.is('[data-index]'))
			data = correspData($conf.attr('data-index'));
		$conf.find('.config-item').each(function(){
			var value;
			var name = $(this).children('label').text();
			var $content = $(this).find('.config-content');
			if(!$content.length) return;
			else if($content.hasClass('config-string')){
				value = $.trim($(this).find('input[type="text"]').val());
			}
			else if($content.hasClass('config-array')){
				value = [];
				$(this).find('input[type="text"]').each(function(){
					var val = $.trim($(this).val());
					if(val){
						if(($(this).hasClass('changeable') && !matchSome(val, 'col')) || $(this).hasClass('unchangeable'))
							value.push(val);
						else alert(val+'은 입력할 수 없습니다.');
					}
				});
			}
			else if($content.hasClass('config-object')){
				value = {};
				$(this).find('input[type="text"]').each(function(){
					if($.trim($(this).val())){
						var val = $(this).val().split(':');
						val[0] = $.trim(val[0]); val[1] = $.trim(val[1]);
						if(val[0] && val[1]){
							if(($(this).hasClass('changeable') && !matchSome(val[0], 'height')) || $(this).hasClass('unchangeable')){
								if($(this).hasClass('conf-readonly')){
									var data = JSON.parse('{'+$(this).next('.ext-value').val()+'}');
									value[val[0]] = data[val[0]];
								} else {
									value[val[0]] = val[1];
								}
							}
							else alert($(this).val()+'은 입력할 수 없습니다.');
						}
					}
				});
			}
			data[name] = value;
		});
		if($conf.find('input[name="use-data-height"]').length){
			var isChanged = false;
			var dataIndex = ($conf.attr('data-index') ? $conf.attr('data-index') : '') + ($conf.attr('data-section') ? $conf.attr('data-section'): '');
			var $items = g_$main.find('.container-wrap').find('[data-index="'+dataIndex+'"]').find('.item').parent('[class*="col-xs-"]');

			if($conf.find('input[name="use-data-height"]').prop('checked')){// 높이 조정을 사용한다고 설정했을 때
				if($conf.is('[data-section]')){
					if(!data.attr) data.attr = {};
					if(!data.attr['data-height-mode']){
						data.attr['data-height-mode'] = '1';
						g_$main.find('[data-index="'+dataIndex+'"]').closest('.container-wrap').attr('data-height-mode', 1);
						setHeightInItems(data.data.data, 1);
						$items.attr('data-height-xxs', 1);
						isChanged = true;
					}
				}
				else if($conf.is('[data-index]')){
					var hasHeight = false;
					for(var ki in data.attr){ if(matchSome(ki, 'height')) hasHeight = true; }
					if(!hasHeight){
						for(var ki in g_conWidth) data.attr['data-height-'+ki] = '1';
						$items.attr('data-height-xxs', '1');
						isChanged = true;
					}
				}
			} else { // 높이 조정을 사용하지 않는다고 설정했을 때
				if($conf.is('[data-section]')){
					if(data.attr && data.attr['data-height-mode']){
						isChanged = true;
						delete data.attr['data-height-mode'];
						delHeightInItems(data.data.data);
						$items.removeAttr('data-height-xxs');
					}
				}
				else if($conf.is('[data-index]')){
					for(var ki in data.attr){
						if(matchSome(ki, 'height')){
							delete data.attr[ki];
							isChanged = true;
						}
					}
					if(isChanged) $items.removeAttr('data-height-xxs');
				}
			}
			if(isChanged){
				var scrTop; if($conf.is('[data-section]')) scrTop = $(window).scrollTop();
				$items.closest('[data-height-mode]').regHeight();
				var $div = g_$main.find('.level-mark.selected').parent();
				g_$main.makeLevelMark(g_curLevel);
				$div.find('.level-mark').makeDivMenu();
				if(scrTop) $(window).scrollTop(scrTop);
			}
		}
		saveSectionData();
		g_$main.find('.config-wrap').remove();
	}
	setHeightInItems = function(data, height){
		for(var i in data){
			if(data[i].type == 'item') for(var kj in g_conWidth) changeData(data[i], 'height', kj, height);
			else if(data[i].type == 'division') setHeightInItems(data[i].data, height);
		}
	}
	delHeightInItems = function(data){
		for(var i in data){
			if(data[i].type == 'item') for(var kj in g_conWidth) delete data[i].attr['data-height-'+kj];
			else if(data[i].type == 'division') delHeightInItems(data[i].data);
		}	
	}
	confTextKeydown = function($text, event){
		if(event.keyCode == 13){ // key: enter
			if(!$text.closest('.config-content').is('.config-string') && $.trim($text.val())){
				var name = $text.closest('.config-content').attr('id').replace('config-', '');
				$text.closest('.config-row').after(htmlConfigRow('', '', '', name));
				var $nextText = $text.closest('.config-row').next().find('input[type="text"]');
				$nextText.keydown(function(event){ confTextKeydown($(this), event); });
				$nextText.closest('.config-row').find('input[name="attr-obj-butn"]').click(function(){
					makeExtConfInput($nextText);
				});
				$nextText.focus();
			}
		}
		else if(event.keyCode == 9 && event.shiftKey){ // key: shfit + tab
			var isEnd = false;
			var $row = $text.closest('.config-row');
			if(!$row.prev('.config-row').length){
				if(!$row.closest('.config-item').prev('.config-item').length){
					event.preventDefault();
					isEnd = true;
				}
			}
			if(!isEnd && $row.prev('.config-row').find('input[name="attr-obj-butn"]').length)
				$row.prev('.config-row').find('input[name="attr-obj-butn"]').focus();
		}
		else if(event.keyCode == 9){ // key: tab
			var isEnd = false;
			var $row = $text.closest('.config-row');
			if(!$row.next('.config-row').length){
				if(!$row.closest('.config-item').next('.config-item').find('input[type="text"]').length){
					event.preventDefault();
					isEnd = true;
				}
			}
			if(!isEnd && $row.find('input[name="attr-obj-butn"]').length)
				$row.find('input[name="attr-obj-butn"]').focus();
		}
		else if($text.hasClass('conf-readonly') || $text.hasClass('unchangeable')){
			event.preventDefault();
		}
	}
	htmlConfig = function(dIndex, arg) {
		var data = {};
		var html = '';
		var keys = [];
		if(arg === 'section'){
			data = g_sectionData[dIndex];
			keys = [{name: 'title', kind: 'string'}, {name: 'description', kind: 'string'}, {name: 'layout', kind: 'string'},
					{name: 'max-width', kind: 'string'}, {name: 'class', kind: 'array'}, {name: 'style', kind: 'object'},
					{name: 'attr', kind: 'object'}];
		}
		else if(arg === undefined){
			data = correspData(dIndex);
			keys = [{name: 'class', kind: 'array'}, {name: 'style', kind: 'object'}, {name: 'attr', kind: 'object'}];
		}
		for(var idx in keys){
			var name = keys[idx].name;
			var kind = keys[idx].kind;
			html += '<div class="config-item"><label>'+name+'</label><div class="config-content config-'+kind+'" id="config-'+name+'">';
			var inputs = '';
			if(data[name]){
				if(kind == 'string'){
					inputs = htmlConfigRow(data[name]);
				}
				else if(kind == 'array'){
					for(var i in data[name]){
						var isChangeable = true;
						if(name == 'class' && matchSome(data[name][i], 'col')) isChangeable = false;
						inputs += htmlConfigRow(data[name][i], isChangeable);
					}
				}
				else if(kind == 'object'){
					for(var ki in data[name]){
						var isChangeable = true;
						if(name == 'attr' && matchSome(ki, 'height')) isChangeable = false;
						inputs += htmlConfigRow(data[name][ki], isChangeable, ki, name);
					}
				}
				else {alert('error in htmlConfig()'); return false;}
				html += inputs;
			} 
			if(inputs == ''){
				html += htmlConfigRow('', '', '', name);
			}
			html += '</div></div>';
		}
		if(arg == 'section' || (
			dIndex.match(/\|/) && data.type == 'item' &&
			g_sectionData[dIndex.split('|')[0]].attr && g_sectionData[dIndex.split('|')[0]].attr['data-height-mode'] 
		)){
			var checked = '';
			for(ki in data.attr){
				if(matchSome(ki, 'height')){ checked = ' checked'; break; }
			}
			html +=	'<div class="config-item">' +
						'<input type="checkbox" name="use-data-height"'+checked+'><label>높이 조절 사용</label>' + 
					'</div>';
		}
		return html;
	}
	htmlConfigRow = function(value, isChangeable, valKey, name){
		var htmlVal = '';
		var extValue = '';
		var textClass = ' class="changeable';
		var disabled = ''
		if(isChangeable === false){ textClass = ' class="unchangeable"'; disabled = ' disabled'; }
		if(value){
			if($.type(value) == 'object' || $.type(value) == 'array'){
				if(valKey) htmlVal = ' value="'+valKey+': ['+$.type(value)+']"';
				else htmlVal = ' value="['+$.type(value)+']"';
				var head = '';
				if(valKey) head = '"'+valKey+'": ';
				extValue = head + JSON.stringify(value, null, '\t');
				textClass += ' conf-readonly';
			}
			else {
				if(valKey) htmlVal = ' value="'+valKey+': '+value+'"';
				else htmlVal = ' value="'+value+'"';
			}

		}
		var html = '<div class="input-text-wrap"><input'+textClass+'" type="text"'+htmlVal+'><textarea class="ext-value">'+extValue+'</textarea></div>';
		if(name == 'attr') html += '<input type="button" name="attr-obj-butn"'+disabled+' value=">">';
		html = '<div class="config-row">'+html+'</div>';
		return html;
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
		if($conBp.hasClass('con-bp-xxs')) return 'xxs';
		else if($conBp.hasClass('con-bp-xs')) return 'xs';
		else if($conBp.hasClass('con-bp-sm')) return 'sm';
		else if($conBp.hasClass('con-bp-md')) return 'md';
		else if($conBp.hasClass('con-bp-lg')) return 'lg';
	}
	$.fn.colLen = function(arg){
		// arg: undefined, '+#', '-#', #  
		if(arg === undefined || $.isNumeric(arg)); else return false;
		 
		var classes = $(this).attr('class').split(' ');
		var length = 0;
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
	$.fn.dataHeight = function(arg){ //$.fn = [data-level] has .item
		if(arg === undefined){
			var h;
			if(this.hasClass('row')) h = this.children('[class*="col-xs-"]').attr('data-height-xxs');
			else if(this.is('[class*="col-xs-"]')) h = this.attr('data-height-xxs');
			if(!h) return false;
			else return parseInt(h);
		} 
		else if($.isNumeric(arg)){
			if(this.hasClass('row')){
				var $col = this.children('[class*="col-xs-"]');
				if($col && $col.length && $col.is('[data-height-xxs]')){
					$col.attr('data-height-xxs', arg);
				}
				else return false;
			}
			else if(this.is('[class*="col-xs-"]')) this.attr('data-height-xxs', arg);
			return true;
		}
		return false;
	}
	$.fn.calcDataHeight = function(){
		var flagShow = true;
		var $con = $(this).closest('[class*="con-bp-"]');
		if($con.hasClass('con-bp-'+g_curBreakPoint)) flagShow = false;

		var divs = $con.find('[data-height-xxs]');
		if(!divs.length) return 1;
		var $div = $(divs[0]);

		if(flagShow){
			$con.show();
			$con.closest('[data-height-mode]').regHeight();
		}

		var rH = $(this).rectHeight();
		var dh = $div.attr('data-height-xxs');
		var h = $div.rectHeight();
		var dataHeight = Math.round(dh * rH / h);

		if(flagShow){
			$con.hide();
			$con.closest('.container-wrap').find('.con-bp-'+g_curBreakPoint).show();
		}

		return dataHeight;
	}
	$.fn.dataLevel = function(arg){ //$.fn = [data-level]
		var lev = parseInt($(this).attr('data-level'));
		if(arg === undefined) return lev;
		if($.isNumeric(arg)){
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
		var dataHeight = '';
		if(arg.height) dataHeight = ' data-height-xxs="'+arg.height+'"';
		var html = 
			'<div class="col-xs-'+arg.colLen+'"'+dataHeight+' data-level="'+arg.level+'" data-index="'+arg.index+'" >' +
				'<div class="item"></div>' + 
			'</div>';
		$(this).children('.row').append(html);
		$(this).children('.row').find('.item').attClick();
	}
	$.fn.appendRow = function(arg) {
		var dataHeight = '';
		if(arg.height) dataHeight = ' data-height-xxs="'+arg.height+'"';
		var html =
			'<div class="row" data-level="'+arg.level+'" data-index="'+arg.index+'">' + 
				'<div class="col-xs-'+g_totNumGrids+'"'+dataHeight+'>' +
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
	lengthObj = function(obj){
		if(obj === undefined) return 0;
		var len = 0;
		for(var key in obj){ len++; }
		return len;
	}
	objToStr = function(obj){
		var i = 0;
		var len = lengthObj(obj);
		var str = '';
		for(var key in obj){
			str += '\'' + key + '\':\'' + obj[key] + '\'';
			if(i < len - 1) str += ', ';
			i++;
		}
		return str;
	}
	matchSome = function(str, arg){
		if(arg === 'col'){
			if(str.match(/^col-(?:xs|sm|md|lg)-[1-9][0-9]*$/)) return true;
			else return false;
		}
		else if(arg === 'height'){
			if(str.match(/^data-height-(?:xxs|xs|sm|md|lg)$/)) return true;
			if(str === 'data-height-mode') return true;
			else return false;
		}
	}
	saveSectionData = function(){
		$.ajax({
			url: $(location).attr('href'), type: 'post',
			data: { savecache: 'yes', section_data: g_sectionData }, 
			success: function(result){
				if(!result) alert('fail to save section cache');
			}
		});
	}
	getPreset = function(arg){
		var preset = undefined;
		if(!arg || !arg.presetUrl) return preset;
		$.ajax({
			url: arg.presetUrl,
			dataType: 'json',
			async: false,
			success: function(data){
				if(data) preset = data;
			},
			error: function(){
				alert(arg.presetUrl+'을 불러오는데 문제가 발생했습니다.');
			}
		});
		return preset;
	}
	getSectionData = function(arg){
		var secData = {'section1': blankSection()};
		if(!arg || !arg.url) return secData;
		$.ajax({
			url: arg.url,
			dataType: 'json',
			async: false,
			success: function(data){
				if(data) secData = data;
			},
			error: function(){
				alert(arg.url+'을 불러오는데 문제가 발생했습니다.');
			}
		});
		return secData;
	}
	getRhConfig = function(arg){
		var userConfig;
		if(arg && arg.rhConfig) userConfig = arg.rhConfig;
		return g_$edReg.find('[data-height-mode]').regHeight(userConfig, false)
	}
	blankSection = function(){
		return	{
					'title': '', 'description': '', 'layout': '', 'max-width': '', 
					'class': [], 'attr': {'data-height-mode': '1', 'data-gutter': '0'},
					'data': {'type': 'item'}
				};
	}

})(jQuery);
