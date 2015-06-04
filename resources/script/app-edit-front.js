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

		$(this).append('<div id="edit-region"><div id="toolbar"></div><div id="ruler-region"></div><div id="main-region"></div></div>');
		$mainRegion = $(this).children('#edit-region').children('#main-region');
		$toolbar = $(this).children('#edit-region').children('#toolbar');

		$mainRegion.makeSection(g_sectionData);
		$toolbar.makeToolbar();

		// 초기화 ////////////////
		$mainRegion.find('[class*="con-bp-"]').hide();
		$mainRegion.find('.con-bp-'+g_curBreakPoint).show();
		$mainRegion.find('.container').outerWidth(g_conWidth[g_curBreakPoint]);
		$mainRegion.find('[data-height-mode]').regHeight();
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
			var $thisCon = $thisMark.closest('.container').find('.con-bp-'+g_curBreakPoint);
			var $thatObj;
			if($thisCon.is('[data-index="'+thisIndex+'"]')) $thatObj = $thisCon;
			else $thatObj = $thisCon.find('[data-index="'+thisIndex+'"]');
			
			$wrap.find('[class*="con-bp-"]').hide();
			$wrap.find('.con-bp-'+g_curBreakPoint).show();
			$wrap.find('.container').outerWidth(g_conWidth[g_curBreakPoint]);
			$wrap.find('[data-height-mode]').regHeight();
			$wrap.makeLevelMark(g_curLevel);
			$thatObj.find('.level-mark').makeDivMenu();
		});

		$(this).find('#test-button').click(function(){
			/*
			테스트 할 코드
			*/
		});
	}

	$.fn.makeSection = function(divData){
		var $wrap = $(this);
		for(var secname in divData){
			var attr = getAttr(divData[secname].attr);
			var html =
				'<div class="section-region">' +
					'<div class="left-side">' +
					'</div>' + 
					'<div class="container" ' + attr + '>' +
						'<div class="con-bp-lg" data-level="0" data-index="'+secname+'">' + makeMarkup(divData[secname].data, 'lg', '', 0, secname) + '</div>' +
						'<div class="con-bp-md" data-level="0" data-index="'+secname+'">' + makeMarkup(divData[secname].data, 'md', '', 0, secname) + '</div>' +
						'<div class="con-bp-sm" data-level="0" data-index="'+secname+'">' + makeMarkup(divData[secname].data, 'sm', '', 0, secname) + '</div>' +
						'<div class="con-bp-xs" data-level="0" data-index="'+secname+'">' + makeMarkup(divData[secname].data, 'xs', '', 0, secname) + '</div>' +
					'</div>' +
				'</div>';
			$wrap.append(html);
		}

		$wrap.find('.item').click(function(){
			var $item = $(this);
			var $div = $item.closest('[data-level]');
			g_curLevel = parseInt($div.attr('data-level')) + 1;
			$wrap.makeLevelMark(g_curLevel);
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
							info.$div.changeCrpData('class', 'col-'+g_curBreakPoint+'-'+length, 'col-'+g_curBreakPoint+'-'+newLength);
						}
					}

					// 높이 관련 ////////////////
					if(info.isItem){
						var hinfo = info.$target.attr('data-height-xs');
						var newhinfo = Math.round($thisMark.rectHeight() / preHeight * hinfo);
						if(newhinfo < 1) newhinfo = 1;
						info.$target.attr('data-height-xs', newhinfo);
						info.$div.changeCrpData('attr', 'data-height-'+g_curBreakPoint, newhinfo);
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
				var gdm = {};
				var $divMenu;

				if($thisMark.hasClass('selected')) return;
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
				else $divMenu.find('input[name="remove-this"]').prop('disabled', true);

				var lastLevel = 0;
				gdm.$div.closest('[data-level="0"]').find('[data-level]').each(function(){
					if($(this).attr('data-level') > lastLevel) lastLevel = $(this).attr('data-level');
				});
				lastLevel++;

				if(g_curLevel <= 1) $divMenu.find('input[name="move-down"]').prop('disabled', true);
				if(g_curLevel >= lastLevel){
					 $divMenu.find('input[name="move-up"]').prop('disabled', true);
					 $divMenu.find('input[name="move-last"]').prop('disabled', true);
				}

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
					var halfCol = Math.floor(g_totNumGrids/ 2);

					//컬럼 추가 버튼을 클릭했을 때 ///////////////////////////////
					if(buttonName == 'add-column'){
						crpData.type = 'division';
						crpData.template = 'cols';

						//템플릿이 결정되지 않았을 때 ////////////////////////////
						if(gdm.template == ''){
							crpData.data = [ 
								{'type': 'item', 'class': ['col-xs-'+halfCol, 'col-sm-'+halfCol, 'col-md-'+halfCol, 'col-lg-'+halfCol], 'attr': {}},
								{'type': 'item', 'class': ['col-xs-'+halfCol, 'col-sm-'+halfCol, 'col-md-'+halfCol, 'col-lg-'+halfCol], 'attr': {}}
							];
							gdm.$allDiv.each(function(){
								var height;
								if($(this).attr('data-level') == '0') height = 1;
								else if($(this).hasClass('row')){
									height = $(this).find('[class*="col-"]').attr('data-height-xs');
								} else {
									height = $(this).attr('data-height-xs');
								}
								$(this).children().remove();
								var html = 
									'<div class="row">'+
										'<div class="col-xs-'+halfCol+'" data-height-xs="'+height+'" data-level="'+(gdm.level+1)+'" data-index="'+gdm.index+'|0">' +
											'<div class="item"></div>' +
										'</div>' +
										'<div class="col-xs-'+halfCol+'" data-height-xs="'+height+'" data-level="'+(gdm.level+1)+'" data-index="'+gdm.index+'|1">' +
											'<div class="item"></div>' +
										'</div>' +
									'</div>';
								$(this).append(html);
								var bp = $(this).getBpBelong();
								crpData.data[0].attr['data-height-'+bp] = height;
								crpData.data[1].attr['data-height-'+bp] = height;
							});
						}
						else if(gdm.template == 'row'){
							crpData.data = 
						}
						else if(gdm.template == 'col'){
						}

						$wrap.find('[data-height-mode]').regHeight();
						g_curLevel++;
						$wrap.makeLevelMark(g_curLevel);
						gdm.$div.find('[data-level="'+(g_curLevel-1)+'"]').first().find('.level-mark').makeDivMenu();
						saveSectionData();
					}
					else if(buttonName == 'add-row'){

					}
					else if(buttonName == 'remove-this'){

					}
				});//$divMenu.find('.division-menu').find('input[type="button"]').click(function(){
			}//$.fn.makeDivMenu()

			$.fn.getBpBelong = function(){
				$conBp = this.closest('[class*="con-bp-"]');
				if($conBp.hasClass('con-bp-xs')) return 'xs';
				else if($conBp.hasClass('con-bp-sm')) return 'sm';
				else if($conBp.hasClass('con-bp-md')) return 'md';
				else if($conBp.hasClass('con-bp-lg')) return 'lg';
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
