(function(jQuery) {
	jQuery.fn.featureAlign = function() {
		jQuery(this).each(function(j) {
			var $this = jQuery(this);
			var $im = $this.find('img');
			autoHeightSize($this);
			if($im.length > 0) {
				$im.imagesLoaded( function(instance) {
					jQuery(instance.elements).each(function(i) {
						alignElement($this,jQuery(this));
					});
				});
			} else {
				alignElement($this,$this.children().first());
			}
		});
	}

	jQuery.fn.featureReAlign = function() {
		jQuery(this).each(function(j) {
			var $this = jQuery(this);
			var $im = $this.find('img');
			autoHeightSize($this);
			if($im.length > 0) {
				$im.each(function(i) {
					alignElement($this,jQuery(this));
				});
			} else {
				alignElement($this,$this.children().first());
			}
		});
	}

	function autoHeightSize($container) {
		if($container.hasClass('auto-size')) {
			var totalHeight = $container.parent().innerHeight();
			var otherHeight = 0;
			$container.parent().children().each(function(i) {
				if(jQuery(this) != $container) {
					if(jQuery(this).css('position') != 'absolute') {
						otherHeight += jQuery(this).outerHeight(true);
					}
				}
			});
			$container.height(totalHeight - otherHeight);
		}
	}

	function alignElement($container,$media) {
		var align = $container.attr('data-align');
		$media.addClass('jfe-featured-align');
		if(align.match(/fill/g)) {
			$container.imagefill();
		} else {
			$container.css({
				'position' : 'relative',
				'overflow' : 'hidden'
			});
			var c_width = $container.innerWidth();
			var c_height = $container.innerHeight();
			var m_width = $media.innerWidth();
			var m_height = $media.innerHeight();
			var _align = align.split(" ");
			for(var i=0; i<_align.length; i++) {
				switch(_align[i]) {
					case 'center':
						$media.css({
							'position': 'absolute',
							'left': parseInt( ( c_width - m_width ) / 2)+'px',
							'right': 'auto'
						});
						break;
					case 'left':
						$media.css({
							'position': 'absolute',
							'left': 0,
							'right': 'auto'
						});
						break;
					case 'right':
						$media.css({
							'position': 'absolute',
							'right': 0,
							'left': 'auto'
						});
						break;
					case 'middle':
						$media.css({
							'position': 'absolute',
							'top': parseInt( ( c_height - m_height ) / 2 )+'px',
							'bottom': 'auto'
						});
						break;
					case 'top':
						$media.css({
							'position': 'absolute',
							'top': 0,
							'bottom': 'auto'
						});
						break;
					case 'bottom':
						$media.css({
							'position': 'absolute',
							'top': 'auto',
							'bottom': 0
						});
						break;
					default:
						if(i == 0) {
							$media.css({
								'position' : 'absolute',
								'left': parseInt(_align[0])+'px',
								'right': 'auto'
							});
						} else if(i == 1) {
							$media.css({
								'position' : 'absolute',
								'top': parseInt(_align[1])+'px',
								'bottom': 'auto'
							});
						}
						break;
				}
			}
		}
	}
})(jQuery);

jQuery(function() {
	jQuery('.featured-align').featureAlign();

	jQuery(window).resize(function(e) {
		jQuery('.featured-align').featureReAlign();
	});
});
