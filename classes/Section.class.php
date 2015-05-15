<?php
class Section extends Objects {
	public $section;
	public $items;
	private $index;
	private $tabs;
	private $mode;
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public function readSectionJson($app) {
		$cacheFile = JFE_CACHE_PATH."/".$app."_section.json";

		if(file_exists($cacheFile)) {
			$fp = fopen($cacheFile,"r");
			$this->section[$app] = json_decode(fread($fp,filesize($cacheFile)),true);
			fclose($fp);
		}
		return $this->section[$app];
	}

	public function readItemsJson($app) {
		$cacheFile = JFE_CACHE_PATH."/".$app."_items.json";

		if(file_exists($cacheFile)) {
			$fp = fopen($cacheFile,"r");
			$this->items[$app] = json_decode(fread($fp,filesize($cacheFile)),true);
			fclose($fp);
		}
		return $this->items[$app];
	}

	public function readJson($app) {
		$this->readSectionJson($app);
		$this->readItemsJson($app);
	}

	public function buildPage($app,$tabs,$mode='') {
		$this->readJson($app);
		$this->tabs = $tabs;
		$this->mode = $mode;
		if($this->section[$app] && is_array($this->section[$app])) {
			foreach($this->section[$app] as $s => $data) {
				$markup .= $this->buildSection($app,$s);
			}
		}
		return $markup;
	}

	public function buildSection($app,$section) {
		$s = $this->section[$app][$section];
		$data['id'] = $app."-".$section;
		$data['title'] = $s['title'];
		$data['class'] = 'section';
		if($this->mode) $data['class'] .= ' section-'.$this->mode;
		if($s['class'] && is_array($s['class'])) {
			$data['class'] .= ' '.implode(" ",$s['class']);
		}
		if($s['style'] && is_array($s['style'])) {
			$data['style'] .= 'style="';
			foreach($s['style'] as $k=>$v) {
				$data['style'] .= $k.":".$v.";";
			}
			$data['style'] .= '"';
		}
		if($s['attr'] && is_array($s['attr'])) {
			foreach($s['attr'] as $k=>$v) {
				$data['attr'] .= ' '.$k.'="'.$v.'"';
			}
		}
		if($this->mode) {
			$data['attr'] .= ($data['attr'] ? ' ' : '').'data-layout="'.$s['layout'].'"';
		}
		$data['content'] = $this->buildBlock($app,$section,$s['data'],$this->tabs);
		$markup = Component::get($app.'/section/'.$s['layout'],array('section'=>$data));
		if($this->tabs) {
			$markup = rtrim(str_repeat("\t",$this->tabs).preg_replace("/\n/i","\n".str_repeat("\t",$this->tabs),$markup),"\t");
		}
		return $markup;
	}

	public function buildBlock($app,$section,$item,$tabs) {
		$markup = '';
		if($this->mode) $class = " row-".$this->mode;
		if($item['class']) {
			for($i=0; $i<@count($item['class']); $i++) {
				if(preg_match("/^col\-/i",$item['class'][$i])) continue;
				$class .= " ".$item['class'][$i];
			}
		}
		$wrap_header = str_repeat("\t",($tabs ? $tabs : 0)).'<div class="row'.$class.'">'."\n";
		$wrap_footer = str_repeat("\t",($tabs ? $tabs : 0)).'</div>'."\n";
		if($item['type'] == 'division' && @count($item['data'])) {
			$markup .= $wrap_header;
			foreach($item['data'] as $i => $g) {
				$markup .= $this->buildCol($app,$section,$g,($tabs+1),$item['template']);
			}
			$markup .= $wrap_footer;
		} else if($item['type'] == 'item') {
			$markup .= $this->buildItem($app,$section,($tabs+1));
		}
		return $markup;
	}

	private function buildCol($app,$section,$col,$tabs,$template="col") {
		$tab = $tabs;
		$markup = '';
		if($template == 'rows') {
			$markup .= str_repeat("\t",$tabs).'<div class="row'.($this->mode ? ' row-'.$this->mode : '').'">'."\n";
			$tab = $tabs+1;
		}
		$markup .= str_repeat("\t",$tab).'<div'.$this->buildAttr($col).">\n";
		switch($col['type']) {
			case 'division':
				$markup .= $this->buildBlock($app,$section,$col,($tab+1));
				break;
			case 'item':
			default:
				$markup .= $this->buildItem($app,$section,($tabs+1));
				break;
		}
		$markup .= str_repeat("\t",$tab)."</div>\n";
		if($template == 'rows') {
			$markup .= str_repeat("\t",$tabs).'</div>'."\n";
		}
		return $markup;
	}

	private function buildAttr($g) {
		if($g['class'] && is_array($g['class'])) {
			$markup .= ' class="'.implode(" ",$g['class']).($this->mode ? ' col-'.$this->mode : '').'"';
		} else if($this->mode) {
			$markup .= ' class="col-'.$this->mode.'"';
		}
		if($g['style'] && is_array($g['style'])) {
			$markup .= ' style="';
			foreach($g['style'] as $k=>$v) {
				$markup .= $k.":".$v.";";
			}
			$markup .= '"';
		}
		if($g['attr'] && is_array($g['attr'])) {
			foreach($g['attr'] as $k=>$v) {
				$markup .= ' '.$k.'="'.$v.'"';
			}
		}
		return $markup;
	}

	private function buildItem($app,$section,$tabs=0) {
		if(!$this->index[$app][$section])
			$this->index[$app][$section] = 0;
		$item = $this->items[$app][$section][$this->index[$app][$section]];
		if($item) {
			$markup = Component::get($app."/items/".$item['component'],array('data'=>$item));
			$this->index[$app][$section]++;
		}
		$markup = rtrim(str_repeat("\t",$tabs).preg_replace("/\n/i","\n".str_repeat("\t",$tabs),$markup),"\t");
		return $markup;
	}
}
?>
