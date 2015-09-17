(function($) {
	function triangleSectionBlock(element,options) {
		var self = this;

		var slc = jQuery(element).attr('data-triangle-selector');
		this.root = jQuery(element);
		var map_url = jQuery(element).attr('data-triangle-map');
		if(typeof map_url === 'undefined') {
			return;
		}
		map_url = site_base_uri+map_url;
		var theme = jQuery(element).attr('data-triangle-theme');
		jQuery.getJSON(map_url, function(data) {
			self.size = data['size-map'];
			self.map = data.theme[theme];
			self.items = [];
			self.root.find(slc).each(function(idx) {
				var obj = {};
				obj.item = jQuery(this);
				obj.item.addClass('triangles');
				obj.idx = idx;
				self.items.push(obj);
			});

			jQuery(window).resize(function(e) {
				self.waitSetSize();
			});
			self.waitSetSize();
		});
	}

	triangleSectionBlock.prototype = {

		waitSetSize: function() {
			var self = this;
			if(window.respond && window.respond.queue.length != 0){
				setTimeout(function() { self.waitSetSize(); }, 50);
			} else {
				setTimeout(function() { self.setSize(); },50);
			}
		},

		setSize: function() {
			var self = this;
			this.width = jQuery(window).width();
			for(var i=0; i<this.items.length; i++) {
				var item = self.items[i];
				item.width = item.item.width();
				item.height = item.item.height();
				var cur_map = [];
				var cur_size = '';
				if(self.width >= parseInt(self.size['lg']) && typeof(self.map[i]['lg']) != 'undefined') {
					cur_size = 'lg';
					cur_map = self.map[i]['lg'];
				} else if(self.width >= parseInt(self.size['md']) && typeof(self.map[i]['md']) != 'undefined') {
					cur_size = 'md';
					cur_map = self.map[i]['md'];
				} else if(self.width >= parseInt(self.size['sm']) && typeof(self.map[i]['sm']) != 'undefined') {
					cur_size = 'sm';
					cur_map = self.map[i]['sm'];
				} else if(typeof(self.map[i]['xs']) != 'undefined') {
					cur_size = 'xs';
					cur_map = self.map[i]['xs'];
				}
				if(cur_size) {
					item.item.find('.tri-sec-block').each(function() {
						if(!jQuery(this).hasClass(cur_size)) {
							jQuery(this).remove();
						}
					});
					for(var j=0; j<cur_map.length; j++) {
						var sz = cur_map[j];
						sz['r_width'] = ( ( typeof(sz['width']) == "string" && sz['width'].match(/px/g) ) ? parseInt(sz['width']) : ( item.width * parseFloat( sz['width'] ) ) );
						sz['r_height'] = ( ( typeof(sz['height']) == 'string' && sz['height'].match(/px/g) ) ? parseInt(sz['height']) : ( item.height * parseFloat( sz['height'] ) ) );
						switch(sz['position']) {
							case 'bg-bottom-left':
								self.bg_bottom_left(item,cur_size,sz);
								break;
							case 'bg-bottom-right':
								self.bg_bottom_right(item,cur_size,sz);
								break;
							case 'bg-top-left':
								self.bg_top_left(item,cur_size,sz);
								break;
							case 'bg-top-right':
								self.bg_top_right(item,cur_size,sz);
								break;
						} /* end of switch */
					} /* end of for(cur_map.length) */
				} /* end of if(cur_size) */
			} /* end of for(items.length) */
		},

		bg_bottom_left: function(item,cur_size,attr) {
			var border_width = item.width * attr['border-width'] - (attr['border-width-gutter'] ? parseInt(attr['border-width-gutter']) : 0);
			var border_height = item.height * attr['border-height'] - (attr['border-height-gutter'] ? parseInt(attr['border-height-gutter']) : 0);
			var shape = 'bottom-left';

			if(attr['r_width']) {
				var left_block = this.getBlock(item.item,cur_size+' bg bottom-left-block','background',attr['background']);
				this.resize_block_trail_size(left_block,attr['r_width'],border_height);
				border_width = border_width - attr['r_width'];
			}

			if(attr['r_height']) {
				var bottom_block = this.getBlock(item.item,cur_size+' bg left-bottom-block','background',attr['background']);
				this.resize_block_trail_size(bottom_block,border_width,attr['r_height']);
				border_height = border_height - attr['r_height'];
			}

			var block = this.getBlock(item.item,cur_size+' bg bottom-left','border-left-color',attr['background']);
			this.resize_block_size(block,attr['r_width'],attr['r_height'],border_width,border_height,shape);
		},

		bg_bottom_right: function(item,cur_size,attr) {
			var border_width = item.width * attr['border-width'] - (attr['border-width-gutter'] ? parseInt(attr['border-width-gutter']) : 0);
			var border_height = item.height * attr['border-height'] - (attr['border-height-gutter'] ? parseInt(attr['border-height-gutter']) : 0);
			var shape = 'bottom-right';

			if(attr['r_width']) {
				var right_block = this.getBlock(item.item,cur_size+' bg bottom-right-block','background',attr['background']);
				this.resize_block_trail_size(right_block,attr['r_width'],border_height);
				border_width = border_width - attr['r_width'];
			}

			if(attr['r_height']) {
				var bottom_block = this.getBlock(item.item,cur_size+' bg right-bottom-block','background',attr['background']);
				this.resize_block_trail_size(bottom_block,border_width,attr['r_height']);
				border_height = border_height - attr['r_height'];
			}

			var block = this.getBlock(item.item,cur_size+' bg bottom-right','border-bottom-color',attr['background']);
			this.resize_block_size(block,attr['r_width'],attr['r_height'],border_width,border_height,shape);
		},

		bg_top_left: function(item,cur_size,attr) {
			var border_width = item.width * attr['border-width'] - (attr['border-width-gutter'] ? parseInt(attr['border-width-gutter']) : 0);
			var border_height = item.height * attr['border-height'] - (attr['border-height-gutter'] ? parseInt(attr['border-height-gutter']) : 0);
			var shape = 'top-left';

			if(attr['r_width']) {
				var left_block = this.getBlock(item.item,cur_size+' bg top-left-block','background',attr['background']);
				this.resize_block_trail_size(left_block,attr['r_width'],border_height);
				border_width = border_width - attr['r_width'];
			}
			
			if(attr['r_height']) {
				var top_block = this.getBlock(item.item,cur_size+' bg left-top-block','background',attr['background']);
				this.resize_block_trail_size(top_block,border_width,attr['r_height']);
				border_height = border_height - attr['r_height'];
			}

			var block = this.getBlock(item.item,cur_size+' bg top-left','border-top-color',attr['background']);
			this.resize_block_size(block,attr['r_width'],attr['r_height'],border_width,border_height,shape);
		},

		bg_top_right: function(item,cur_size,attr) {
			var border_width = item.width * attr['border-width'] - (attr['border-width-gutter'] ? parseInt(attr['border-width-gutter']) : 0);
			var border_height = item.height * attr['border-height'] - (attr['border-height-gutter'] ? parseInt(attr['border-height-gutter']) : 0);
			var shape = 'top-right';

			if(attr['r_width']) {
				var right_block = this.getBlock(item.item,cur_size+' bg top-right-block','background',attr['background']);
				this.resize_block_trail_size(right_block,attr['r_width'],border_height);
				border_width = border_width - attr['r_width'];
			}
			
			if(attr['r_height']) {
				var top_block = this.getBlock(item.item,cur_size+' bg right-top-block','background',attr['background']);
				this.resize_block_trail_size(top_block,border_width,attr['r_height']);
				border_height = border_height - attr['r_height'];
			}

			var block = this.getBlock(item.item,cur_size+' bg top-right','border-right-color',attr['background']);
			this.resize_block_size(block,attr['r_width'],attr['r_height'],border_width,border_height,shape);
		},

		getBlock: function(item,block_class,bgblock,bgcolor) {
			var block = item.find('.tri-sec-block.'+block_class.replace(/ /g,'.'));
			if(!block.length) {
				var block = jQuery('<div class="tri-sec-block '+block_class+'"></div>');
				if(bgblock) {
					var bgelement = {};
					bgelement[bgblock] = bgcolor;
					block.css(bgelement);
				}
				item.append(block);
			}
			return block;
		},

		resize_block_trail_size: function(block,width,height) {
			block.css({
				'width': width+'px',
				'height': height+'px'
			});
		},

		resize_block_size: function(block,width,height,border_width,border_height,shape) {
			switch(shape) {
				case 'top-left':
					block.css({
						'left': width+'px',
						'top': height+'px',
						'border-top-width': border_height+'px',
						'border-right-width': border_width+'px'
					});
					break;
				case 'bottom-left':
					block.css({
						'left': width+'px',
						'bottom': height+'px',
						'border-top-width': border_height+'px',
						'border-left-width': border_width+'px'
					});
					break;
				case 'bottom-right':
					block.css({
						'right': width+'px',
						'bottom': height+'px',
						'border-bottom-width': border_height+'px',
						'border-left-width': border_width+'px'
					});
					break;
				case 'top-right':
					block.css({
						'right': width+'px',
						'top': height+'px',
						'border-bottom-width': border_height+'px',
						'border-right-width': border_width+'px'
					});
					break;
				case 'top':
					block.css({
						'top': height+'px',
						'border-left-width': ( border_width / 2 )+'px',
						'border-bottom-width': border_height+'px',
						'border-right-width': ( border_width / 2 )+'px'
					});
					break;
				case 'left':
					block.css({
						'left': width+'px',
						'border-top-width': ( border_height / 2 )+'px',
						'border-right-width': border_width+'px',
						'border-bottom-width': ( border_height / 2 )+'px'
					});
					break;
				case 'bottom':
					block.css({
						'bottom': height+'px',
						'border-top-width': border_height+'px',
						'border-right-width': ( border_width / 2 )+'px',
						'border-left-width': ( border_width / 2 )+'px'
					});
					break;
				case 'right':
					block.css({
						'right': width+'px',
						'border-top-width': ( border_height / 2 )+'px',
						'border-bottom-width': ( border_height / 2 )+'px',
						'border-left-width': border_width+'px'
					});
					break;
				default:
					break;
			}
		}
	}

	jQuery.fn.triangleSection = function(options) {
		return this.each(function() {
			var triangle = new triangleSectionBlock(jQuery(this),options);
			jQuery(this).data('triangle-section',triangle);
		});
	}
})(jQuery);

jQuery(function() {
	jQuery('.triangle-section').triangleSection({});
});
