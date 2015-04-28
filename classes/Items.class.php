<?php
class Items extends Objects {
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function readJson($app) {
		$cacheFile = JFE_CACHE_PATH."/".$app."_items.json";

		if(file_exists($cacheFile)) {
			$fp = fopen($cacheFile,"r");
			$json = json_decode(fread($fp,filesize($cacheFile)),true);
			fclose($fp);
		}
		return $json;
	}
}
?>
