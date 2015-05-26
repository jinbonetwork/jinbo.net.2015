<?php
class Component extends Objects {
	public static $instances;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function get($path,$args,$priority=0) {
		$context = Model_Context::instance();

		if(!(self::$instances[$path])) self::$instances[$path] = 0;
		$instance = self::$instances[$path];
		$real_path = JFE_PATH."/component/".$path."/index.html.php";
		if(is_array($args)) {
			extract($args);
		}
		$browser = new Browser();
		if(file_exists(JFE_PATH."/component/".$path."/style.css")) {
			View_Resource::addCssURI(JFE_URI."component/".$path."/style.css");
		}
		if( ($browser->getBrowser() == Browser::BROWSER_IE && $browser->getVersion() <= 9) &&
			file_exists(JFE_PATH."/component/".$path."/style.ie.css")
		) {
			View_Resource::addCssURI(JFE_URI."component/".$path."/style.ie.css");
		}
		if($classes) {
			if(is_array($classes)) {
				$classes = implode(" ",$classes);
			}
		}
		if($styles) {
			foreach($styles as $k => $v) {
				$style .= $k.": ".$v.";";
			}
		}
		if( ($browser->getBrowser() == Browser::BROWSER_IE && $browser->getVersion() <= 9) &&
			file_exists(JFE_PATH."/component/".$path."/script.ie.js")
		) {
			View_Resource::addJsURI(JFE_URI."component/".$path."/script.ie.js",$priority);
		} else if(file_exists(JFE_PATH."/component/".$path."/script.js")) {
			View_Resource::addJsURI(JFE_URI."component/".$path."/script.js",$priority);
		}
		if(file_exists($real_path)) {
			ob_start();
			include $real_path;
			$markup = ob_get_contents();
			ob_end_clean();
		}

		self::$instances[$path]++;

		return $markup;
	}
}
?>
