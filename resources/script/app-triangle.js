(function($) {
	function triangleBlock(element,options) {
		var self = this;

		var slc = jQuery(element).attr('data-triangle-selector');
		this.root = jQuery(element);
		if(slc && slc !== 'undefined') {
			this.element = jQuery(element).find(slc);
		} else {
			this.element = jQuery(element);
		}
		if(!this.element.hasClass('triangle')) this.element.addClass('triangle');

		jQuery(window).resize(function(e) {
			self.waitSetSize();
		});
		this.waitSetSize();
	}

	triangleBlock.prototype = {

		waitSetSize: function() {
			var self = this;
			if(window.respond && window.respond.queue.length != 0){
				setTimeout(function() { self.waitSetSize(); }, 50);
			} else {
				self.setSize();
			}
		},

		setSize: function() {
			this.width = this.element.outerWidth();
			this.height = this.element.outerHeight();
			if(this.root.hasClass('outer-before')) {
				this.outer_before();
			}
			if(this.root.hasClass('inner-before')) {
				this.inner_before();
			}
			if(this.root.hasClass('outer-after')) {
				this.outer_after();
			}
			if(this.root.hasClass('inner-after')) {
				this.inner_after();
			}
			if(this.root.hasClass('bg-left-bottom')) {
				this.bg_left_bottom();
			}
			if(this.root.hasClass('bg-right-bottom')) {
				this.bg_right_bottom();
			}
			if(this.root.hasClass('bg-left-top')) {
				this.bg_left_top();
			}
			if(this.root.hasClass('bg-right-top')) {
				this.bg_right_top();
			}
		},

		outer_before: function() {
			var ratio = this.root.attr('data-triangle-outer-before-ratio');
			var shape = this.root.attr('data-triangle-outer-before-shape');
			var block = this.element.find('.tri-block.outer-before.'+shape);
			if(!block.length) {
				var block = jQuery('<div class="tri-block outer-before '+shape+'"></div>');
				this.element.prepend(block);
			}
			this.resize_block_size(block,this.width,Math.round(this.width * ratio),shape,'outer-before');
		},

		outer_after: function() {
			var ratio = this.root.attr('data-triangle-outer-after-ratio');
			var shape = this.root.attr('data-triangle-outer-after-shape');
			var block = this.element.find('.tri-block.outer-after');
			if(!block.length) {
				var block = jQuery('<div class="tri-block outer-after'+(shape ? ' '+shape : '')+'"></div>');
				this.element.append(block);
			}
			this.resize_block_size(block,this.width,Math.round(this.width * ratio),shape,'outer-after');
		},

		inner_before: function() {
			var ratio = this.root.attr('data-triangle-inner-before-ratio');
			var shape = this.root.attr('data-triangle-inner-before-shape');
			var block = this.element.find('.tri-block.inner-before');
			if(!block.length) {
				var block = jQuery('<div class="tri-block inner-before'+(shape ? ' '+shape : '')+'"></div>');
				this.element.prepend(block);
			}
			this.resize_block_size(block,this.width,Math.round(this.width * ratio),shape,'inner-before');
		},

		inner_after: function() {
			var ratio = this.root.attr('data-triangle-inner-after-ratio');
			var shape = this.root.attr('data-triangle-inner-after-shape');
			var block = this.element.find('.tri-block.inner-after');
			if(!block.length) {
				var block = jQuery('<div class="tri-block inner-after'+(shape ? ' '+shape : '')+'"></div>');
				this.element.append(block);
			}
			this.resize_block_size(block,this.width,Math.round(this.width * ratio),shape,'inner-after');
		},

		bg_left_bottom: function() {
			var _ratio = this.root.attr('data-triangle-bg-left-bottom-ratio');
			if(_ratio) var ratio = _ratio.split(",");
			var width = this.width * ratio[0] - (ratio[1] ? ratio[1] : 0);
			var height = this.height * ratio[2] - (ratio[3] ? ratio[3] : 0);
			var shape = 'bottom-left';
			var block = this.element.find('.tri-block.bg.bottom-left');
			if(!block.length) {
				var block = jQuery('<div class="tri-block bg bottom-left"></div>');
				this.element.append(block);
			}
			this.resize_block_size(block,width,height,shape,'bg-bottom-left');
		},

		bg_right_bottom: function() {
			var _ratio = this.root.attr('data-triangle-bg-right-bottom-ratio');
			if(_ratio) var ratio = _ratio.split(",");
			var width = this.width * ratio[0] - (ratio[1] ? ratio[1] : 0);
			var height = this.height * ratio[2] - (ratio[3] ? ratio[3] : 0);
			var shape = 'bottom-right';
			var block = this.element.find('.tri-block.bg.bottom-right');
			if(!block.length) {
				var block = jQuery('<div class="tri-block bg bottom-right"></div>');
				this.element.append(block);
			}
			this.resize_block_size(block,width,height,shape,'bg-bottom-right');
		},

		bg_left_top: function() {
			var _ratio = this.root.attr('data-triangle-bg-left-top-ratio');
			if(_ratio) var ratio = _ratio.split(",");
			var width = this.width * ratio[0] - (ratio[1] ? ratio[1] : 0);
			var height = this.height * ratio[2] - (ratio[3] ? ratio[3] : 0);
			var shape = 'top-left';
			var block = this.element.find('.tri-block.bg.top-left');
			if(!block.length) {
				var block = jQuery('<div class="tri-block bg top-left"></div>');
				this.element.append(block);
			}
			this.resize_block_size(block,width,height,shape,'bg-top-left');
		},

		bg_right_top: function() {
			var _ratio = this.root.attr('data-triangle-bg-right-top-ratio');
			if(_ratio) var ratio = _ratio.split(",");
			var width = this.width * ratio[0] - (ratio[1] ? ratio[1] : 0);
			var height = this.height * ratio[2] - (ratio[3] ? ratio[3] : 0);
			var shape = 'top-right';
			var block = this.element.find('.tri-block.bg.top-right');
			if(!block.length) {
				var block = jQuery('<div class="tri-block bg top-right"></div>');
				this.element.append(block);
			}
			this.resize_block_size(block,width,height,shape,'bg-top-right');
		},

		resize_block_size: function(block,width,height,shape,outer) {
			switch(shape) {
				case 'top-left':
					block.css({
						'border-top-width': height+'px',
						'border-right-width': width+'px'
					});
					break;
				case 'bottom-left':
					block.css({
						'border-top-width': height+'px',
						'border-left-width': width+'px'
					});
					break;
				case 'bottom-right':
					block.css({
						'border-bottom-width': height+'px',
						'border-left-width': width+'px'
					});
					break;
				case 'top-right':
					block.css({
						'border-bottom-width': height+'px',
						'border-right-width': width+'px'
					});
					break;
				case 'top':
					block.css({
						'border-left-width': ( width / 2 )+'px',
						'border-bottom-width': height+'px',
						'border-right-width': ( width / 2 )+'px'
					});
					break;
				case 'left':
					block.css({
						'border-top-width': ( height / 2 )+'px',
						'border-right-width': width+'px',
						'border-bottom-width': ( height / 2 )+'px'
					});
					break;
				case 'bottom':
					block.css({
						'border-top-width': height+'px',
						'border-right-width': ( width / 2 )+'px',
						'border-left-width': ( width / 2 )+'px'
					});
					break;
				case 'right':
					block.css({
						'border-top-width': ( height / 2 )+'px',
						'border-bottom-width': ( height / 2 )+'px',
						'border-left-width': width+'px'
					});
					break;
				default:
					break;
			}
			switch(outer) {
				case 'outer-before':
					block.css({
						'top': '-'+height+'px'
					});
					break;
				case 'outer-after':
					block.css({
						'bottom': '-'+height+'px'
					});
					break;
				default:
					break;
			}
		}
	}

	jQuery.fn.triangle = function(options) {
		return this.each(function() {
			var triangle = new triangleBlock(jQuery(this),options);
			jQuery(this).data('triangle',triangle);
		});
	}
})(jQuery);

jQuery(function() {
	jQuery('.triangle').triangle({});
});
