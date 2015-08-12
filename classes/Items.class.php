<?php
class Items extends Objects {
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function getMedia($url,$attr=null) {
		if($attr && is_array($attr)) {
			foreach($attr as $k => $v) {
				$attrs = " ".$k.'="'.htmlspecialchars($v).'"';
			}
		} else if($attr) {
			$attrs = " ".$attr;
		}
		if(preg_match("/\.(gif|jpg|jpeg|bmp|png)$/i",$url)) {
			return '<img src="'.url($url).'"'.$attrs.' />';
		} else {
			return $url;
		}
	}
}
?>
