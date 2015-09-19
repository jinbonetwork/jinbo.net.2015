(function($){
	//설명 ************************
	// 1. data-heigt-mode는 '1'로 하고 변경할 수 없도록 한다.
	// 2. data-height-[bp]의 값은 정수.
	// 3. 컬럼의 폭을 변화시킬 때, 인접한 컬럼의 폭도 함께 변화시킨다. 이때 동일한 층에 있는 컬럼들만을 고려한다.
	// 4. 아이템의 높이를 변화시킬 때는, 층을 무시하고, 인접한 아이템의 높이만 변화시킨다.
	//*****************************
	var g_editMode = 'layout'; // or contents
	var g_totNumGrids;
	var g_rhConfig;
	var g_conWidth = {lg: 1100, md: 1100, sm: 700, xs: 500, xxs: 500}; //나중에 cache에 이 값이 저장되도록 한다.
	var g_curLevel = 1;
	var g_curBreakPoint = 'lg';
	var g_sectionData = {};
	var g_itemData = {};
	var g_presetData = {};
	var g_info;
	var g_ctrlDown = false;
	var g_$edContain;
	var g_$edReg;
	var g_$main;
	var g_preWin;
	var g_configSets = {};
	var g_config = {};

	var g_path = (function(){
		var url = $('script').last().attr('src');
		var path = {};
		path.path = url.substr(0, url.lastIndexOf('/')+1);
		path.config = path.path+'config_in_js.php';
		path.readWrite = path.path+'read_write.php';
		path.configSets = path.path+'config_sets.json';
		path.preset = path.path+'preset.json';
		path.profComponent = path.path+'prof_component.php';
		return path;
	})();

	$.fn.makeEditor = function(arg){
		g_$edContain = $(this);
		g_config = getJson(g_path.config);
		g_configSets = getConfigSets(g_path.configSets);
		g_presetData = getJson(g_path.preset);
		g_sectionData = getData(g_path.readWrite, 'section');
		g_itemData = getData(g_path.readWrite, 'item');
		if(g_sectionData === false || g_itemData === false) return false;
		var html =	'<div id="edit-region">' +
						'<div id="toolbar-wrap"><div id="toolbar"></div></div>' +
						'<div id="main-region"></div>' +
						'<div id="add-section-wrap"></div>' +
					'</div>'
		g_$edContain.append(html);
		g_$edReg = g_$edContain.children('#edit-region');
		g_$main = g_$edReg.children('#main-region');
		var $toolbar = g_$edReg.find('#toolbar');
		var $addSec = g_$edReg.children('#add-section-wrap');

		g_$main.makeSection(g_sectionData);
		g_$main.putItemContent();

		$toolbar.makeToolbar();
		$addSec.makeAddSec();

		g_rhConfig = getRhConfig();
		g_totNumGrids = g_rhConfig.grid_columns;
		g_$main.showSections(g_curBreakPoint);
		g_$main.find('.con-bp-'+g_curBreakPoint).find('.level-mark').first().makeDivMenu();

		documentEvent();
	}
	$.fn.putItemContent = function(data){
		if(this.hasClass('item') && data){
			var dIndex = $(this).closest('[data-index]').attr('data-index');
			$(this).closest('.container-wrap').find('[data-index="'+dIndex+'"]').each(function(){
				$(this).find('.item').html(htmlItemContent(data));
			});
		}
		if(data === undefined){
			this.each(function(){
				if($(this).attr('id') == 'main-region'){
					$(this).find('.container-wrap').putItemContent();
				}
				if($(this).hasClass('section-region') || $(this).hasClass('container-wrap')){
					var data = g_itemData[$(this).find('.con-bp-lg').attr('data-index')];
					$(this).find('[data-level="0"]').each(function(){
						$(this).find('.item').each(function(index){
							if(!data) data = [];
							$(this).html(htmlItemContent(data[index]));
						});
					});
				}
			});
		}
	}
	htmlItemContent = function(data){
		var subject = (data ? (data.subject || '') : '');
		var description = (data ? (data.description || '') : '');
		return '<div class="item-content"><p>'+subject+'</p><p>'+description+'</p></div>';
	}
	documentEvent = function(){
		$(document).mousemove(function(event){
			if(g_info){
				if(g_info.editMode === 'layout'){ markMouseMove(event); return false; }
				else if(g_info.editMode === 'contents'){ itemContMouseMove(event); return false; }
			}
		});
		$(document).mouseup(function(event){
			if(g_info){
				if(g_info.editMode === 'layout'){ markMouseUp(event); return false; }
			}
		});
		$(document).keydown(function(event){
			if(event.keyCode == 17) g_ctrlDown = true;
		});
		$(document).keyup(function(event){
			if(event.keyCode == 17) g_ctrlDown = false;
		});

		$(window).resize(function(){
			if(g_editMode == 'layout') g_$edReg.find('#breakpoint-'+g_curBreakPoint).click();
		});
	}
	$.fn.showSections = function(bp){ //$.fn = #main-region, .section-region, .container-wrap
		g_$edReg.outerWidth(g_conWidth[bp]);
		g_$edReg.find('#toolbar-wrap').outerWidth(g_conWidth[bp]);
		$(this).find('[class*="con-bp-"]').hide();
		$(this).find('.con-bp-'+bp).show();
		if($(this).is('[data-height-mode]')) $(this).regHeight();
		else $(this).find('.container-wrap[data-height-mode]').regHeight();
		if(g_editMode == 'layout') g_$main.makeLevelMark(g_curLevel);
	}
	$.fn.makeToolbar = function(){
		var html =	'<div class="checkbox-button edit-mode">'+
						'<input type="checkbox" id="edit-mode" name="edit-mode">'+
						'<label for="edit-mode" class="unchecked">내용 편집</label>'+
						'<label for="edit-mode" class="checked">레이아웃 편집</label>'+
					'</div>';
		var icons = {lg: 'fa-desktop', md: 'fa-laptop', sm: 'fa-tablet', xs: 'fa-mobile', xxs: 'fa-mobile'};
		for(var ki in g_conWidth){
			html += '<div class="radio-button">' +
						'<input id="breakpoint-'+ki+'" type="radio" name="breakpoint" value="'+ki+'">' +
						'<label for="breakpoint-'+ki+'" class="unchecked"><i class="fa '+icons[ki]+'"></i></label>' +
						'<label for="breakpoint-'+ki+'" class="checked"><i class="fa '+icons[ki]+'"></i></label>' +
					'</div>';
		}
		html += '<button name="preview"><i class="fa fa-eye"></i></button>';
		html += '<div class="disabled-toolbar hidden"></div>';
		$(this).html(html);
		$(this).find('input[value="'+g_curBreakPoint+'"]').prop('checked', true);

		$(this).find('input[name="breakpoint"]').change(function(){
			if(!$(this).prop('checked')) return;
			g_curBreakPoint = $(this).val();
			if(g_editMode == 'layout'){
				var $thisMark = g_$main.find('.level-mark.selected');
				var thisIndex = $thisMark.parent().attr('data-index');
				var $thisCon = $thisMark.closest('.container-wrap').find('.con-bp-'+g_curBreakPoint);
				var $thatObj;
				if($thisCon.is('[data-index="'+thisIndex+'"]')) $thatObj = $thisCon;
				else $thatObj = $thisCon.find('[data-index="'+thisIndex+'"]');
				g_$main.showSections(g_curBreakPoint);
				$thatObj.find('.level-mark').makeDivMenu();
			} else {
				var $slcItem = g_$main.find('.item.selected');
				var dIndex = $slcItem.removeClass('selected').closest('[data-index]').attr('data-index');
				var $thisItem = $slcItem.closest('.container-wrap').find('.con-bp-'+g_curBreakPoint).find('[data-index="'+dIndex+'"]').find('.item').first();
				g_$main.showSections(g_curBreakPoint);
				$thisItem.addClass('selected');
				var itemTop = $thisItem.offset().top;
				if($(window).scrollTop() > itemTop - 70 || $(window).scrollTop()+$(window).height() < itemTop) $(window).scrollTop(itemTop - 70);

			}
		});
		$(this).find('#edit-mode').change(function(){
			if($(this).prop('checked')){ prepareEditContents(); }
			else { prepareEditLayout(); }
		});
		$(this).find('button[name="preview"]').click(function(){
			if(g_config['app-dir']) preview(g_config['app-dir']);
		});
	}
	prepareEditLayout = function(){
		g_editMode = 'layout';
		g_$main.find('.disabled-preset').addClass('hidden');
		g_$edReg.find('#add-section-wrap').removeClass('hidden');
		g_$main.find('.container-wrap').find('.item').attClick(true);
		var $div = g_$main.find('.item.selected').closest('[data-level]');
		g_curLevel = parseInt($div.attr('data-level')) + 1;
		g_$main.makeLevelMark(g_curLevel);
		$div.children('.level-mark').makeDivMenu();
	}
	prepareEditContents = function(){
		g_editMode = 'contents';
		g_$main.find('.disabled-preset').removeClass('hidden');
		var $selected = g_$main.find('.level-mark.selected').closest('[data-index]').find('.item').first();
		g_$main.find('.level-mark').remove();
		g_$main.find('.divmenu').remove();
		g_$main.find('.w-ruler').remove();
		g_$main.find('.h-ruler').remove();
		g_$edReg.find('#add-section-wrap').addClass('hidden');
		g_$main.find('.container-wrap').find('.item').attClick(true);
		$selected.addClass('selected');

		g_$main.find('.container-wrap').find('[data-level="0"]').each(function(){
			var section = $(this).attr('data-index');
			$(this).find('.item').each(function(index){
				$(this).attr('data-item-index', index);
				if(g_itemData[section].length-1 < index) g_itemData[section].push(blankItem()[0]);
			});
		});
		g_$main.find('.container-wrap').find('.item').mousedown(function(){
			g_info = {};
			g_info.editMode = 'contents';
			g_info.$item = $(this);
			g_info.section = $(this).closest('[data-level="0"]').attr('data-index');
			g_info.index = $(this).attr('data-item-index');
			g_info.drag = false;
		});
		g_$main.find('.container-wrap').find('.item').mouseup(function(){
			if(g_info && g_info.editMode === 'contents' && g_info.drag){
				var section = $(this).closest('[data-level="0"]').attr('data-index');
				var index = $(this).attr('data-item-index');
				if(g_info.section === section && g_info.index !== index){
					var first = g_itemData[section][g_info.index];
					var second = g_itemData[section][index];
					var temp = {};
					copyObj(first, temp); emptyObj(first);
					copyObj(second, first); emptyObj(second);
					copyObj(temp, second);
					saveItemData();
					g_info.$item.putItemContent(first);
					$(this).putItemContent(second);
				}
				g_info = undefined;
			}
		});
	}
	itemContMouseMove = function(event){
		g_info.drag = true;
	}
	preview = function(url){
		var secname;
		if(g_editMode == 'layout') secname = g_$main.find('.level-mark.selected').closest('[data-level="0"]').attr('data-index');
		else secname = g_$main.find('.item.selected').closest('[data-level="0"]').attr('data-index');
		var anchor = '#front-'+secname;
		var winname = 'jb-preview';
		var width;
		if(g_curBreakPoint == 'xxs') width = g_rhConfig.screen_xs_min - 10;
		else if(g_curBreakPoint == 'xs') width = (parseInt(g_rhConfig.screen_sm_min) + parseInt(g_rhConfig.screen_xs_min)) / 2;
		else if(g_curBreakPoint == 'sm') width = (parseInt(g_rhConfig.screen_md_min) + parseInt(g_rhConfig.screen_sm_min)) / 2;
		else if(g_curBreakPoint == 'md') width = (parseInt(g_rhConfig.screen_lg_min) + parseInt(g_rhConfig.screen_md_min)) / 2;
		else if(g_curBreakPoint == 'lg') width = g_rhConfig.screen_lg_min;
		var height = $(window).outerHeight();
		var left = (screen.width - width)/2;
		var top = (screen.height - height)/2;
		var specs = 'left='+left+', top='+top+', width='+width+', height='+height;
		if(!g_preWin || !g_preWin.window) g_preWin = window.open(url, winname, specs);
		else {
			g_preWin.focus();
			g_preWin.moveTo(left, top);
			g_preWin.resizeTo(width, height);
		}
		var outIntv = setInterval(function(){
			var $body = $(g_preWin.document).find('body');
			var $anchored = $body.find(anchor);
			if($anchored.length){
				clearInterval(outIntv);
				var scrTop = $anchored.offset().top;
				var intv = setInterval(function(){
					var curScrTop = $anchored.offset().top;
					if(scrTop == curScrTop){
						clearInterval(intv);
						$body.scrollTop(curScrTop);
						g_preWin.location.reload();
					}
					else scrTop = curScrTop;
				}, 100);
			}
		}, 100);
	}
	$.fn.makeAddSec = function(){
		$(this).append('<input type="button" name="add-section" value="섹션 추가">').click(function(){
			var secName = makeUniqueKey();
			var newSecData = {}; newSecData[secName] = blankSection();
			g_sectionData[secName] = newSecData[secName];
			var newItemData = []; newItemData[secName] = blankItem();
			g_itemData[secName] = newItemData[secName];
			g_$main.makeSection(newSecData);
			g_$main.find('.section-region').last().putItemContent();
			g_curLevel = 1;
			g_$main.showSections(g_curBreakPoint);
			g_$main.find('.con-bp-'+g_curBreakPoint+'[data-index="'+secName+'"]').find('.level-mark').first().makeDivMenu();
			saveSectionData();
			saveItemData();
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
		var html = '<div class="disabled-preset hidden"></div>';
		for(var secname in data){
			var attr = getAttr(data[secname].attr);
			var innerHtml = '';
			for(var bp in g_conWidth){
				if(bp !== 'xxs'){
					innerHtml += '<div class="preset-bp-'+bp+'">'+makeMarkup(data[secname].data, bp, '', 0, secname)+'</div>';
				}
			}
			html += '<div class="preset-container" data-secname="'+secname+'" '+attr+'><div class="row"></div>'+innerHtml+'</div>';
		}
		$preset.html(html);
		$preset.find('.preset-container').each(function(){
			for(var bp in g_conWidth){
				if(bp !== 'xxs'){
					$(this).find('.preset-bp-'+bp).each(function(){
						$(this).find('.item').each(function(index){
							$(this).html('<div class="item-index"><span>'+String.fromCharCode(97+index)+'</span></div>');
						});
					});
				}
			}
		});
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
		$preset.find('[class*="preset-bp-"]:not(.preset-bp-lg)').hide();
		$preset.find('.preset-container').hover(
			function(){ $(this).find('[class*="preset-bp-"]').show(); },
			function(){ $(this).find('[class*="preset-bp-"]:not(.preset-bp-lg)').hide(); }
		);
		$preset.find('.preset-container').click(function(){
			//프리셋을 클릭하면 해당 섹션의 정보는, 섹션 정보를 제외하고는 모두 사라지고, 프리셋의 데이터로 바뀐다.
			if(confirm('이 레이아웃을 적용하시겠습니까?')){
				var $container = $(this).closest('.section-region').find('.container-wrap');
				var preData = g_presetData[$(this).attr('data-secname')];
				var secname = $container.children('[data-level]').first().attr('data-index');
				g_sectionData[secname].data = preData.data;
				saveSectionData();
				g_curLevel = 1;
				$container.children().remove();
				$container.append(htmlContainerWrap(g_sectionData[secname], secname));
				$container.showSections(g_curBreakPoint);
				$container.find('.item').attClick();
				$container.find('.level-mark').makeDivMenu();
			}
		});
	}
	copyObj = function(from, to, option){
		//from의 속성을 to에 덮어씌운다. from에 없고 to에 있는 것은 to에 그대로 남는다.
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
	emptyObj = function(obj){ //'obj' is an object.
		if($.type(obj) === 'object'){
			for(var key in obj){
				delete obj[key];
			}
		}
		else if($.type(obj) === 'array'){
			obj.splice(0, obj.length);
		}
	}
	$.fn.attClick = function(arg){ //$.fn = .item
		if(arg === true) $(this).off("click");
		$(this).click(function(){
			var $item = $(this);
			var $div = $item.closest('[data-level]');
			if(g_editMode == 'layout'){
				g_curLevel = parseInt($div.attr('data-level')) + 1;
				$item.closest('#main-region').makeLevelMark(g_curLevel);
				$div.find('.level-mark').makeDivMenu();
			}
			else if(g_editMode == 'contents'){
				if(!$item.hasClass('selcted')){
					g_$main.find('.item.selected').removeClass('selected');
					$item.addClass('selected');
				}
				makeConfig($(this).attr('data-item-index'), $(this).closest('[data-level="0"]').attr('data-index'));
			}
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
			var info = $(this).divInfo();
			var html = '';
			if(info.divType === 'col') html += '<i class="fa fa-columns"></i>';
			else if(info.divType === 'row') html += '<i class="fa fa-columns fa-rotate-270"></i>';
			if(info.useRegHei) html += '<i class="fa fa-arrows-v"></i>';
			$(this).append('<div class="div-type">'+html+'</div>');
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
			g_info.editMode = 'layout';
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
					'<button name="add-column"><i class="fa fa-columns"></i></button>' +
					'<button name="add-row"><i class="fa fa-columns fa-rotate-270"></i></button>' +
					'<button name="remove-this"><i class="fa fa-close"></i></button>' +
				'</div>' +
				'<div class="level-move-menu">' +
					'<button name="move-up"><i class="fa fa-arrow-up"></i></button>' +
					'<button name="move-down"><i class="fa fa-arrow-down"></i></button>' +
					'<button name="move-last"><i class="fa fa-chevron-up"></i></button>' +
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
		if(gdm.template == 'row') $divMenu.find('button[name="add-column"]').prop('disabled', true);
		else if(gdm.template == 'col') $divMenu.find('button[name="add-row"]').prop('disabled', true);
		if(g_curLevel <= 1){
			$divMenu.find('button[name="move-down"]').prop('disabled', true);
			if(lengthObj(g_sectionData) == 1) $divMenu.find('button[name="remove-this"]').prop('disabled', true);
		}
		if(g_curLevel >= gdm.lastLevel){
			 $divMenu.find('button[name="move-up"]').prop('disabled', true);
			 $divMenu.find('button[name="move-last"]').prop('disabled', true);
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
		$divMenu.find('.level-move-menu').find('button').click(function(){
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
		$divMenu.find('.division-menu').find('button').click(function(){
			var buttonName = $(this).attr('name');
			var crpData = gdm.$div.correspData();
			var targetIndex;
			var $targetDiv;
			var regHeiMode = gdm.$div.closest('.container-wrap').attr('data-height-mode');

			var halfCol = [Math.floor(g_totNumGrids/2), g_totNumGrids - Math.floor(g_totNumGrids/2)];
			var fullCol = [g_totNumGrids, g_totNumGrids];
			var colLenS = {'lg': halfCol, 'md': halfCol, 'sm': fullCol, 'xs': fullCol, 'xxs': fullCol };
			var heightS = {'lg': 1, 'md': 1, 'sm': 2, 'xs': 3, 'xxs': 3};

			if(buttonName == 'add-column'){//컬럼 추가 버튼을 클릭했을 때
				if(gdm.template == ''){//템플릿이 결정되지 않았을 때
					dataItemToDiv(crpData, 'cols', colLenS);
					gdm.$allDiv.each(function(){
						var bp = $(this).bpOfCon();
						var height;
						if(regHeiMode){
							if(g_curLevel != 1) height = $(this).calcDataHeight();
							else height = heightS[bp];
						}
						$(this).removeAttr('data-height-xxs');
						$(this).children().remove();
						$(this).append('<div class="row"></div>');
						$(this).appendCol({colLen: colLenS[bp][0], height: height, level: gdm.level+1, index: gdm.index+'|0'});
						$(this).appendCol({colLen: colLenS[bp][1], height: height, level: gdm.level+1, index: gdm.index+'|1'});
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
						var bp = $(this).bpOfCon();
						var height = [];
						if(regHeiMode){
							if(g_curLevel != 1){ height = $(this).halfHeights(); }
							else { height[0] = heightS[bp]; height[1] = heightS[bp]; }
						}
						$(this).removeAttr('data-height-xxs');
						$(this).children().remove();
						$(this).append('<div class="row"></div>');
						$(this).appendRow({height: height[0], level: gdm.level+1, index: gdm.index+'|0'});
						$(this).appendRow({height: height[1], level: gdm.level+1, index: gdm.index+'|1'});
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
					delete g_itemData[gdm.$div.attr('data-index')]; saveItemData();
					gdm.$div.closest('.section-region').remove();
				}
				else if(gdm.$div.siblings().length){
					gdm.$div.removeCrpData();
					if(gdm.$div.next().length) $targetDiv = gdm.$div.next();
					else $targetDiv = gdm.$div.prev();
					gdm.$allDiv.each(function(){
						$(this).changeAllNextIndex();
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
			$wrap.putItemContent();
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
						g_$main.find('.divmenu').find('button[name="move-down"]').click();
				}
				else if(lev > g_curLevel){
					var diff = lev - g_curLevel;
					for(var i = 0; i < diff; i++)
						g_$main.find('.divmenu').find('button[name="move-up"]').click();
				}
			}
		});
	}
	disabledForConfig = function(arg){
		if(arg === false){
			g_$edReg.find('#toolbar').find('.disabled-toolbar').addClass('hidden');
			g_$main.find('.divmenu').removeClass('disabled');
			$('body, html').removeClass('overflow-hidden');
		} else {
			g_$edReg.find('#toolbar').find('.disabled-toolbar').removeClass('hidden');
			g_$main.find('.divmenu').addClass('disabled');
			$('body, html').addClass('overflow-hidden');
		}
	}
	makeConfig = function(dIndex, arg){
		disabledForConfig();
		var html =	'<div class="config-wrap">' +
						'<div class="config">' +
							'<button name="config-close"><i class="fa fa-power-off"></i></button>' +
						'</div>' +
					'</div>';
		g_$main.append(html);
		var width;
		var $conf = g_$main.find('.config');
		if(g_editMode == 'layout') {
			if(arg === 'section'){
				$conf.attr('data-section', dIndex); width = g_configSets.width.section;
			}else {
				$conf.attr('data-index', dIndex); width = g_configSets.width.division;
			}
		} else {
			$conf.attr('data-section', arg); $conf.attr('data-index', dIndex);
			width = g_configSets.width.item;
		}
		$conf.outerWidth(width);
		$conf.offset({top: $(window).scrollTop() + 70});
		$conf.append(htmlConfig(dIndex, arg));
		// style ////
		$conf.find('.config-item').find('.config-gallery').each(function(){
			$(this).find('.conf-gal-item').each(function(){ $(this).outerHeight($(this).closest('.row').outerHeight()); });
		});
		$conf.find('.input-hide-show').hide();
		// event ////
		$conf.on('keydown', 'input[type="text"]', function(event){
			confTextKeydown($(this), event);
		});
		$conf.on('click', 'button[name="attr-obj-butn"]', function(){
			makeExtConfInput($(this).closest('.config-row').find('input[type="text"]'));
		});
		$conf.find('button[name="config-close"]').click(function(){
			saveConfig();
		});
		// event: textarea ////
		$conf.on('blur', '.ta-wrap.input-hide-show textarea', function(){
			$(this).closest('.config-content').find('input[name="ta-oneline"]').val($(this).val()).show();
			$(this).closest('.ta-wrap').hide();
		});
		$conf.on('focus', 'input[name="ta-oneline"]', function(){
			$(this).hide(); $(this).siblings('.ta-wrap').show().find('textarea').focus();
		});
		// event: gallery ////
		$conf.find('.gal-container.input-hide-show').find('label').click(function(){
			var $cont = $(this).closest('.config-content');
			$cont.find('input[name="gal-selected-name"]').val($(this).find('.gal-name').text()).show();
			$cont.find('.gal-container').hide();
		});
		$conf.find('input[name="gal-selected-name"]').focus(function(){
			$(this).hide(); $(this).siblings('.gal-container').show();
		});
		// event: #config-component & .config-subdata ////
		$conf.on('focus', '.config-subdata:not(.subd-selcted) input[type="text"]', function(){
			var $subData = $(this).closest('.config-subdata');
			$subData.siblings('.subd-selected').removeClass('subd-selected');
			$subData.addClass('subd-selected').children();
		});
		$conf.on('click', '.config-subdata:not(.subd-selected)', function(){
			$(this).find('input[type="text"]').first().focus();
		});
		$conf.on('click', '.config-subdata button[name="del-subdata"]', function(){
			if(confirm('데이터를 삭제하시겠습니까?')) delSubData($(this), $conf);
		});
		$conf.on('click', 'button[name="add-subdata"]', function(){
			addBlankSubData($(this));
		});
		$conf.find('#config-component').find('.gal-container').find('input[type="radio"]').change(function(){
			if($(this).prop('checked')){
				 changeComponent($(this), $conf);
				 $conf.find('.input-hide-show').hide();
			}
		});
	}
	changeComponent = function($radio, $conf){
		var data = g_itemData[$conf.attr('data-section')][$conf.attr('data-index')];
		var $oldSub = $conf.find('.config-subdata-wrap');
		if($oldSub.attr('data-template') == 'multiple'){
			if(!data.data) data.data = [];
			$oldSub.find('.config-subdata').each(function(index){
				if(!data.data[index]) data.data[index] = {};
				putConfItemValue($(this), data.data[index]);
			});
		} else {
			if(data.data) putConfItemValue($oldSub, data.data[0]);
			else putConfItemValue($oldSub, data);
		}
		$oldSub.after(htmlConfigSubData(data, $radio.val())).remove();
	}
	addBlankSubData = function($btn){
		$btn.siblings('.subd-selected').removeClass('subd-selected');
		var component = $btn.closest('.config-subdata-wrap').attr('data-component');
		var index = parseInt($btn.prev('.config-subdata').attr('data-index')) + 1;
		$btn.before(htmlConfigOneSubData(null, component, index, {selected: true}));
	}
	delSubData = function($btn, $conf){
		var $subd = $btn.closest('.config-subdata');
		var s = $conf.attr('data-section');
		var i = $conf.attr('data-index');
		var j = parseInt($subd.attr('data-index'));
		g_itemData[s][i].data.splice(j, 1);
		var nj; if(j >= g_itemData[s][i].data.length) nj = 0; else nj = j + 1;
		var $nextSubd = $subd.siblings('[data-index="'+nj+'"]');
		if($subd.hasClass('subd-selected')) $nextSubd.addClass('subd-selected');
		if(g_itemData[s][i].data.length == 1) $nextSubd.find('button[name="del-subdata"]').addClass('hidden');
		$subd.remove();
		$nextSubd.closest('.config-subdata-wrap').find('.config-subdata').each(function(index){
			$(this).attr('data-index', index);
		});
	}
	makeExtConfInput = function($inpTxt){
		var text = '';
		if($inpTxt.hasClass('conf-readonly'))
			text = $inpTxt.next('.ext-value').val();
		else if($inpTxt.val())
			text = keyValueToText($inpTxt.val());
		var html =	'<div class="ext-input-wrap"><div class="ext-input">' +
						'<button name="config-close"><i class="fa fa-power-off"></i></button>' +
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
		$ext.find('button[name="config-close"]').click(function(){
			var str = $ext.find('textarea').val();
			if(str){
				var data;
				try { data = $.parseJSON('{'+str+'}'); }
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
		var data;
		var error = false;
		if(g_editMode == 'layout'){ //레아아웃 편집일 경우
			if($conf.is('[data-section]')) data = g_sectionData[$conf.attr('data-section')];
			else if($conf.is('[data-index]')) data = correspData($conf.attr('data-index'));
			if(!putConfItemValue($conf, data)) return false;
			if($conf.find('input[name="use-data-height"]').length){
				ifUseDataHeightInSaveConfig($conf, data);
			}
			saveSectionData();
		}
		else{ //내용 편집일 경우
			// item 데이터는 컴포넌트에 따라 속성의 개수와 종류가 다를 수 있으므로, 완전히 비운 다음 데이터를 저장한다.
			data = g_itemData[$conf.attr('data-section')][$conf.attr('data-index')] = {};
			if($conf.find('.config-subdata-wrap').attr('data-template') == 'multiple'){
				data.template = 'multiple';
				var $subData = $conf.find('.config-subdata-wrap');
				$subData.remove();
				if(!putConfItemValue($conf, data)) return false;
				var error = false;
				data.data = [];
				$subData.find('.config-subdata').each(function(index){
					data.data[index] = {};
					if(!putConfItemValue($(this), data.data[index])){ error = true; return false; }
				});
				if(error) return false;
			} else {
				if(!putConfItemValue($conf, data)) return false;
			}
			saveItemData();
			g_$main.find('.item.selected').putItemContent(data);
		}
		g_$main.find('.config-wrap').remove();
		disabledForConfig(false);
	}
	putConfItemValue = function($conf, data){
		var error = false;
		$conf.find('.config-item').each(function(){
			var value;
			var $content = $(this).find('.config-content'); if(!$content.length) return;
			var prop = $content.attr('id').replace('config-', '');
			if($content.hasClass('config-string')){
				value = ifStringInSaveConfig($(this), $content);
			}
			else if($content.hasClass('config-array')){
				value = ifArrayInSaveConfig($(this), $content);
				if(value === false){ error = true; return false; }
			}
			else if($content.hasClass('config-object')){
				value = ifObjectInSaveConfig($(this), $content);
				if(value === false){ error = true; return false; }
			}
			if(error) return false;
			data[prop] = value;
		});
		if(error) return false; else return true;
	}
	ifStringInSaveConfig = function($confItem, $content){
		var value;
		if($content.hasClass('config-text')){
			value = $.trim($confItem.find('input[type="text"]').val());
		}
		else if($content.hasClass('config-gallery')){
			value = $confItem.find('input[type="radio"]:checked').val();
		}
		else if($content.hasClass('config-textarea')){
			value = $confItem.find('textarea').val();
		}
		if(value === undefined) value = '';
		return value;
	}
	ifArrayInSaveConfig = function($confItem, $content){
		var value = {};
		var error = false;
		if($content.hasClass('config-text')){
			value = [];
			$confItem.find('input[type="text"]').each(function(){
				var val = $.trim($(this).val());
				if(val){
					if(($(this).hasClass('changeable') && matchSome(val, 'col'))){
						alert(val+'은 입력할 수 없습니다.');
						$(this).val('');
						error = true; return false;
					}
					else value.push(val);
				}
			});
		}
		else if($content.hasClass('config-gallery')){
			value = [];
			$confItem.find('input[type="hidden"]').each(function(){
				value.push($(this).val());
			});
			$confItem.find('input[type="checkbox"]:checked').each(function(){
				value.push($(this).val());
			});
		}
		if(error) return false;
		return value;
	}
	ifObjectInSaveConfig = function($confItem, $content){
		var value = {};
		var error = false;
		if($content.hasClass('config-text')){
			$confItem.find('input[type="text"]').each(function(){
				if($.trim($(this).val())){
					var val = keyValueToArray($(this).val());
					if(val[0] && val[1]){
						if($(this).hasClass('changeable') && matchSome(val[0], 'height')){
							alert($(this).val()+'은 입력할 수 없습니다.');
							$(this).val('');
							error = true; return false;
						}
						if($(this).attr('data-key') && $(this).attr('data-key') != val[0]){
							alert($(this).val()+'은 입력할 수 없습니다.');
							$(this).val($(this).attr('data-key')+': ');
							error = true; return false;
						}
						if(($(this).hasClass('changeable') && !matchSome(val[0], 'height')) || $(this).hasClass('unchangeable')){
							if($(this).hasClass('conf-readonly')){
								var data = $.parseJSON('{'+$(this).next('.ext-value').val()+'}');
								value[val[0]] = data[val[0]];
							} else {
								value[val[0]] = val[1];
							}
						}
					}
				}
			});
		}
		else if($content.hasClass('config-gallery')){
			$confItem.find('input[type="hidden"]').each(function(){
				var val = keyValueToArray($(this).val());
				value[val[0]] = val[1];
			});
			$confItem.find('input[type="checkbox"]:checked').each(function(){
				value[$(this).val()] = $(this).siblings('label').find('.gal-valval').val();
			});
		}
		if(error) return false;
		return value;
	}
	ifUseDataHeightInSaveConfig = function($conf, data){
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
			if(!$text.closest('.config-content').is('.config-string') && !$text.attr('data-key') && $.trim($text.val())){
				var prop = $text.closest('.config-content').attr('id').replace('config-', '');
				var set = {};
				var isSection = false;
				if($text.closest('config').attr('data-section')) isSection = true;
				if(isSection) set = g_configSets.section; else set = g_configSets.division;
				for(var i in set){ if(set[i].property == prop){ set = set[i]; break; } }
				$text.closest('.config-row').after(htmlConfInpTxt(null, null, set));
				$text.closest('.config-row').next().find('input[type="text"]').focus();
			}
		}
		else if(event.keyCode == 9 && event.shiftKey){ // key: shfit + tab
			/* 나중에 해보자.
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
			*/
		}
		else if(event.keyCode == 9){ // key: tab
			/* 나중에 해보자.
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
			*/
		}
		else if($text.hasClass('conf-readonly') || $text.hasClass('unchangeable')){
			event.preventDefault();
		}
	}
	htmlConfig = function(dIndex, arg) {
		var data = {};
		var html = '';
		var sets = [];
		if(g_editMode == 'layout'){
			if(arg === 'section'){
				data = g_sectionData[dIndex];
				sets = g_configSets.section;
			}
			else if(arg === undefined){
				data = correspData(dIndex);
				sets = g_configSets.division;
			}
			html += htmlConfigItem(data, sets);
			html += htmlUseDataHeight(dIndex, data, arg);
		}
		else {
			data = g_itemData[arg][dIndex];
			html += htmlConfigItem(data, g_configSets.item);
			html += htmlConfigSubData(data, data.component);
		}
		return html;
	}
	htmlConfigSubData = function(data, component){
		var sets = componentSet(component);
		var html = '';
		var htmlSub = '';
		var multiple = '';
		if(sets && sets.template == 'multiple') multiple = ' data-template="multiple"';
		if(sets && sets.data) sets = sets.data;
		if(multiple){
			var opt = {};
			if(data.data) data = data.data; else data = [data];
			if(data.length == 1) opt.noDel = true;
			for(var i in data){
				if(i == 0) opt.selected = true; else opt.selected = false;
				htmlSub += htmlConfigOneSubData(data[i], sets, i, opt);
			}
			htmlSub += '<button name="add-subdata"><i class="fa fa-plus-circle"></i></button>';
		} else {
			if(data.data) data = data.data[0];
			htmlSub = htmlConfigItem(data, sets);
		}
		html +=	'<div class="config-subdata-wrap" data-component="'+component+'"'+multiple+'>'+htmlSub+'</div>';
		return html;
	}
	htmlConfigOneSubData = function(data, sets, index, opt){
		if($.type(sets) == 'string') sets = componentSet(sets).data;
		if(!data) data = {};
		var selected = ''; if(opt && opt.selected) selected= ' subd-selected';
		var delHide = ''; if(opt && opt.noDel) delHide = ' class="hidden"';
		return	'<div class="config-subdata'+selected+'" data-index="'+index+'">'+
					'<button name="del-subdata"'+delHide+'><i class="fa fa-times"></i></button>'+
					htmlConfigItem(data, sets) +
				'</div>';
	}

	componentSet = function(component){
		var compSet;
		for(var i in g_configSets.item){
			if(g_configSets.item[i].property == 'component'){
				compSet = g_configSets.item[i].input.data; break;
			}
		}
		for(var i in compSet){
			if(compSet[i].value == component){
				return compSet[i].data;
			}
		}
	}
	htmlConfigItem = function(data, sets){
		var html = '';
		for(var i in sets){
			html += '<div class="config-item">'+
						'<label>'+(sets[i].name ? sets[i].name : sets[i].property)+'</label>'+
						'<div class="config-content config-'+sets[i].valtype+' config-'+sets[i].input.type+'" id="config-'+sets[i].property+'">'+
							htmlConfigContent(data[sets[i].property], sets[i]) +
						'</div>' +
					'</div>';
		}
		return html;
	}
	htmlUseDataHeight = function(dIndex, data, arg){
		var html = '';
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
	htmlConfigContent = function(value, set){
		var html = '';
		if(set.input.type == 'text'){
			if(set.valtype == 'object' && set.input.data){
				for(var i in set.input.data){
					var key = set.input.data[i].property;
					var aVal = value ? value[key] : null;
					html += htmlConfInpTxt(key, aVal, set, {fixed: true});
				}
			}
			else if(value){
				if(set.valtype == 'string')	html = htmlConfInpTxt(null, value, set);
				else {
					for(var key in value) html += htmlConfInpTxt(key, value[key], set);
					html += htmlConfInpTxt(null, null, set);
				}
			}
			else html = htmlConfInpTxt(null, null, set);
		}
		else if(set.input.type == 'gallery'){
			html = htmlConfGallery(value, set);
		}
		else if(set.input.type == 'textarea'){
			if(set.valtype == 'string'){
				html = htmlConfTextarea(value, set);
			}
		}
		return html;
	}
	htmlConfInpTxt = function(key, value, set, option){
		var htmlVal = '';
		var extValue = '';
		var textClass = ' class="changeable';
		var disabled = '';
		var htmlButn = '';
		var htmlTextarea = '';
		var rowHidden = '';
		var dataKey = '';
		if(value){
			htmlVal = ' value="';
			if((set.property == 'class' && matchSome(value, 'col')) || (set.property == 'attr' && matchSome(key, 'height'))){
				textClass = ' class="unchangeable';
				disabled = ' disabled';
				rowHidden = ' hidden';
				if(matchSome(key, 'height') == 'mode'){
					if(option === undefined) option = {};
					option.hidden = true;
				}
			}
			if($.type(value) == 'object' || $.type(value) == 'array'){
				if(set.valtype == 'object') htmlVal += key+': ';
				htmlVal += '['+$.type(value)+']"';
				var head = '';
				if(set.valtype == 'object') head = '"'+key+'": ';
				extValue = head + JSON.stringify(value, null, '\t');
				textClass += ' conf-readonly';
			}
			else if($.type(value) == 'string' || $.type(value) == 'number'){
				if(set.valtype == 'object') htmlVal += key+': ';
				htmlVal += value.replace(/"/g, '&quot;')+'"';
			}
			else alert('error in htmlConfInpTxt()');
		}
		else if(option && option.fixed){
			htmlVal = ' value="'+key+': "';
		}
		if(set.input && set.input.extend){
			htmlButn = '<button name="attr-obj-butn"><i class="fa fa-pencil"></i></button>';
			htmlTextarea = '<textarea class="ext-value">'+extValue+'</textarea>';
		}
		if(option && option.hidden) rowHidden = ' hidden';
		if(option && option.fixed) dataKey = ' data-key="'+key+'"';
		var html =	'<div class="config-row'+rowHidden+'">'+
						'<div class="input-text-wrap">'+
							'<input'+textClass+'" type="text"'+htmlVal+dataKey+'>'+
							htmlTextarea +
						'</div>'+
						htmlButn +
					'</div>';
		return html;
	}
	htmlConfGallery = function(value, set){
		var htmlInput = '';
		var isMultiSelection = false; if(set.valtype != 'string') isMultiSelection = true;
		if(isMultiSelection){
			if(set.valtype == 'array'){
				for(var i in value){
					if(set.property == 'class' && matchSome(value[i], 'col')) htmlInput += '<input type="hidden" value="'+value[i]+'">';
				}
			}
			else if(set.valtype == 'object'){
				for(var ki in value){
					if(set.property == 'attr' && matchSome(ki, 'height')) htmlInput += '<input type="hidden" value="'+ki+':'+value[ki]+'">';
				}
			}
		}
		var galConClass = '';
		if(set.input.display == 'hide-show' && !isMultiSelection){
			value = value ? value : '';
			var sltName = '';
			for(var i in set.input.data){
				if(set.input.data[i].value == value){
					sltName = set.input.data[i].name;
					sltName = (sltName ? sltName : value);
					break;
				}
			}
			htmlInput += '<input type="text" name="gal-selected-name" value="'+sltName+'" readonly>';
			galConClass = ' input-hide-show';
		}
		var numCol = 6; if(set.input.columns) numCol = parseInt(set.input.columns);
		var appear = ''; if(set.input.appearance) appear = ' gal-'+set.input.appearance;
		var data = set.input.data;
		var numRow = parseInt((data.length - 1) / numCol) + 1;
		var htmlRowCol = '';
		var colxs = 'col-xs-'+parseInt(g_totNumGrids/numCol);
		var button = 'radio';
		if(isMultiSelection) button = 'checkbox';
		var flIcon = true; var flValVal = false; var flDesc = true;
		if(set.input.appearance == 'half'){ flIcon = false; flDesc = false; }
		if(set.valtype == 'object') flValVal = true;
		var idx = 0;
		htmlRowCol += '<div class="gal-container'+galConClass+'">';
		for(var i = 0; i < numRow; i++){
			htmlRowCol += '<div class="row">';
			for(var j = 0; (j < numCol && idx < data.length) ; j++){
				var checked = '';
				var valVal = '';
				if(!data[idx].name) data[idx].name = data[idx].value;
				if(isMultiSelection){
					if(set.valtype == 'array')
						for(var k in value) { if(data[idx].value == value[k]){ checked = ' checked'; break; }}
					else if(set.valtype == 'object'){
						for(var kk in value) { if(data[idx].value == kk){ checked = ' checked'; valVal = value[kk]; break; }}
						if(!valVal) valVal = data[idx].default;
					}
				} else {
					if(data[idx].value == value) checked = ' checked';
				}
				var content =	(flIcon && data[idx].icon ? '<p class="gal-icon"><img src="'+data[idx].icon+'" alt="" width="60" height="48"></p>' : '') +
								'<p class="gal-name">'+data[idx].name+'</p>'+
								(flValVal ? '<input type="text" class="gal-valval" value="'+valVal+'">' : '') +
								(flDesc ? '<p class="gal-desc">'+data[idx].description+'</p>' : '');
				htmlRowCol +=	'<div class="'+colxs+'">'+
									'<div class="conf-gal-item'+appear+'">'+
										'<div class="'+button+'-button">'+
											'<input type="'+button+'" id="conf-'+set.property+'-'+idx+'" name="conf-'+set.property+'" value="'+data[idx].value+'"'+checked+'>'+
											'<label for="conf-'+set.property+'-'+idx+'" class="unchecked">'+content+'</label>'+
											'<label for="conf-'+set.property+'-'+idx+'" class="checked">'+content+'</label>'+
										'</div>'+
									'</div>'+
								'</div>';
				idx++;
			}
			htmlRowCol += '</div>';
		}
		htmlRowCol += '</div>';
		return htmlInput + htmlRowCol;
	}
	htmlConfTextarea = function(value, set){
		var html = '';
		var hideShow = '';
		if(set.valtype === 'string'){
			if(set.input.display === 'hide-show'){
				hideShow = ' input-hide-show';
				html += '<input type="text" name="ta-oneline" '+(value ? 'value="'+value+'" ' : '')+'readonly>';
			}
			html += '<div class="ta-wrap'+hideShow+'"><textarea>'+(value || '')+'</textarea></div>';
		}
		return html;
	}
	keyValueToText = function(value){
		var key = value.split(':')[0];
		var value = $.trim(value.substr(key.length+1));
		value = value.replace(/\"/g, '\\"');
		return '"'+key+'": "'+value+'"';
	}
	keyValueToArray = function(value){
		var key = value.split(':')[0];
		return [key, $.trim(value.substr(key.length+1))];
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
		else if(wbottom + botGap > $(window).height()){
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
	dataItemToDiv = function(crpData, template, colLenS){
		crpData.type = 'division';
		crpData.template = template;
		for(var key in crpData.attr){
			if(key.match('data-height-')) delete crpData.attr[key];
		}
		if(template == 'cols'){
			var l = colLenS;
			crpData.data = [
				{'type': 'item', 'class': ['col-xs-'+l.xs[0], 'col-sm-'+l.sm[0], 'col-md-'+l.md[0], 'col-lg-'+l.lg[0]], 'attr': {}},
				{'type': 'item', 'class': ['col-xs-'+l.xs[1], 'col-sm-'+l.sm[1], 'col-md-'+l.md[1], 'col-lg-'+l.lg[1]], 'attr': {}}
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
		var $next = $(this).next();
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
			if(str.match(/^data-height-(?:xxs|xs|sm|md|lg)$/)) return 'bp';
			else if(str === 'data-height-mode') return 'mode';
			else return false;
		}
	}
	saveSectionData = function(){
		$.ajax({
			url: g_path.readWrite, type: 'post',
			data: { mode: 'write', which: 'section', data: g_sectionData },
			success: function(result){
				if(!result) alert('섹션정보를 저장하는데 문제가 발생했습니다.');
			},
			error: function(){
				alert('섹션정보를 저장하는데 문제가 발생했습니다.');
			}
		});
	}
	saveItemData = function(){
		$.ajax({
			url: g_path.readWrite, type: 'post',
			data: { mode: 'write', which: 'item', data: g_itemData },
			success: function(result){
				console.log(result);
				if(!result) alert('내용을 저장하는데 문제가 발생했습니다.');
			},
			error: function(){
				alert('내용을 저장하는데 문제가 발생했습니다.');
			}
		});
	}
	getConfigSets = function(arg){
		var setData;
		if(isObj(arg)) setData = arg;
		else setData = getJson(arg);
		for(var ki in setData){
			if(isObj(setData[ki])){
				getConfigSets(setData[ki]);
			}
			else if(ki == 'data' && !isObj(setData[ki])){
				var url;
				if(setData[ki].substr(0, 1) == '/' || setData[ki].substr(0, 4) == 'http')
					url = setData[ki];
				else
					url = g_path.path + setData[ki];
				setData[ki] = getConfigSets(url);
			}
			else if(ki == 'data-dir' && !isObj(setData[ki])){
				var profUrl = setData[ki];
				ki = 'data';
				$.ajax({
					url: g_path.profComponent, type: 'post', async: false,
					data: { url: profUrl },
					success: function(data){
						var profile;
						if(data){
							try {
								 profile = $.parseJSON(data);
							} catch(e){
								console.log(data);
								alert('error: $.parseJSON');
							}
							setData[ki] = convProfToSetData(profile, profUrl);
						} else alert('컴포넌트 정보를 가져오는데 문제가 발생했습니다.');
					},
					error: function(){
						alert('컴포넌트 정보를 가져오는데 문제가 발생했습니다.');
					}
				});
			}
		}
		return setData;
	}
	convProfToSetData = function(profile, profUrl){
		var data = [];
		var i = 0;
		for(ki in profile){
			data[i] = {};
			data[i].name = profile[ki].label;
			data[i].value = ki;
			data[i].description = profile[ki].description;
			data[i].icon = profile[ki].icon;
			data[i].data = {};
			data[i].data.template = profile[ki].template;
			data[i].data.data = [];
			var j = 0;
			for(kj in profile[ki].data){
				data[i].data.data[j] = {};
				data[i].data.data[j].name = profile[ki].data[kj].label;
				data[i].data.data[j].property = kj;
				data[i].data.data[j].description = profile[ki].data[kj].description;
				var valType = profile[ki].data[kj]['value-type'];
				if(valType == 'object-fixed') data[i].data.data[j].valtype = 'object';
				else data[i].data.data[j].valtype = valType;
				data[i].data.data[j].input = {};
				var inputType = profile[ki].data[kj]['input-type'];
				if(inputType == 'textarea-hide-show'){
					inputType = 'textarea';
					data[i].data.data[j].input.display = 'hide-show';
				}
				data[i].data.data[j].input.type = (inputType ? inputType : 'text');
				if(valType == 'object-fixed'){
					data[i].data.data[j].input.data = [];
					var k = 0;
					for(kk in profile[ki].data[kj].data){
						data[i].data.data[j].input.data[k] = {};
						data[i].data.data[j].input.data[k].name = profile[ki].data[kj].data[kk].label;
						data[i].data.data[j].input.data[k].property = kk;
						data[i].data.data[j].input.data[k].description = profile[ki].data[kj].data[kk].description;
						k++;
					}
				}
				j++;
			}
			i++;
		}
		return data;
	}
	getJson = function(url){
		var jsonObj;
		$.ajax({
			url: url, dataType: 'json', async: false,
			success: function(data){
				if(data) jsonObj = data;
			},
			error: function(){
				alert(url+'을 가져오는데 문제가 발생했습니다.');
			}
		});
		return jsonObj;
	}
	getData = function(url, which){
		var edData;
		var errorMsg;
		if(which == 'section'){
			edData = {'section1': blankSection()};
			errorMsg = '섹션';
		}
		else if(which == 'item'){
			edData = {'section1': blankItem()};
			errorMsg = '아이템';
		}
		errorMsg = errorMsg + '정보를 불러오는데 문제가 발생했습니다.';
		$.ajax({
			url: url, type: 'post', async: false,
			data: { mode: 'read', which: which},
			success: function(data){
				if(data){
					try {
						edData = $.parseJSON(data);
					} catch(e){
						console.log(data);
						alert('error: $.parseJSON');
						edData = false;
					}
				}
			},
			error: function(){
				alert(errorMsg);
				edData = false;
			}
		});
		return edData;
	}
	getRhConfig = function(){
		var userConfig = g_config['rh-url'];
		return g_$edReg.find('[data-height-mode]').regHeight(userConfig, false)
	}
	isObj = function(variable){
		if($.type(variable) === 'string' || $.type(variable) === 'number') return false;
		else if($.type(variable) === 'object' || $.type(variable) === 'array') return true;
		else return undefined;
	}
	blankSection = function(){
		var blank = {
			'title': '', 'description': '', 'layout': '', 'max-width': '',
			'class': [], 'attr': {'data-height-mode': '1', 'data-gutter': '0'},
			'data': {'type': 'item'}
		};
		return blank;
	}
	blankItem = function(){
		var blank = [{'subject': '', 'description': '', 'component': ''}];
		return blank;
	}

})(jQuery);
