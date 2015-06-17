<?php
final class Model_Config extends Objects {
	public $database, $service, $session;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	protected function __construct() {
		$this->ConfigLoader();
	}

	private function ConfigLoader() {
		global $database, $service, $session;
		$this->settings = array();
		if(file_exists(JFE_PATH."/config/settings.php")) {
			@include(JFE_PATH."/config/settings.php");
			$this->userdatabase = $userdatabase;
			$this->database = $database;
			$this->service = $service;
			$this->timeline = $timeline;
			$this->session = $session;
		}
		$this->updateContext();
	}

	public function updateContext() {
		$context = Model_Context::instance();
		$configs = array('database','service','session');
		foreach($configs as $namespace) {
			if($namespace) {
				foreach($this->$namespace as $k => $v) {
					$context->setProperty($namespace.".".$k,$v);
				}
			}
		}
	}

	public function readOption() {
		$context = Model_Context::instance();
		$options = $context->getProperty('options.*');
		if(!$options) {
			if(file_exists(JFE_PATH."/config/options.php")) {
				@include(JFE_PATH."/config/options.php");
				if($options && is_array($options)) {
					foreach($options as $k => $v) {
						$context->setProperty('options.'.$k,$v);
					}
				}
			}
		}
	}

	public function readResourceMap() {
		if(!$this->resoure_map) {
			$context = Model_Context::instance();
			$map_file = JFE_PATH."/config/resources.map.json";
			if(file_exists($map_file)) {
				$fp = fopen($map_file,"r");
				$json = trim(fread($fp,filesize($map_file)));
				fclose($fp);
				$this->resource_map = json_decode($json,true);
			}
			$jframework = $context->getProperty('service.useJframework');
			if($jframework) {
				define("JFRAMEWORK_PATH", JFE_RESOURCE_PATH."/jframework");
				$map_file = $jframework."/data/resources.map.json";
				$this->mergeMap($jframework,$map_file);
				$browser = new Browser();
				if($browser->getBrowser() == Browser::BROWSER_IE && $browser->getVersion() <= 9) {
					$map_file = $jframework."/data/resources.map.fallback.json";
					$this->mergeMap($jframework,$map_file);
				}
			}
		}
		return $this->resource_map;
	}

	public function mergeMap($uri,$map_file) {
		if(file_exists($map_file)) {
			$fp = fopen($map_file,"r");
			$maps = json_decode(trim(fread($fp,filesize($map_file))),true);
			fclose($fp);
			if($maps) {
				foreach($maps as $k => $r) {
					for($i=0; $i<@count($r['css']); $i++) {
						$r['css'][$i] = $uri."/".$r['css'][$i];
					}
					for($i=0; $i<@count($r['js']); $i++) {
						$r['js'][$i] = $uri."/".$r['js'][$i];
					}
					$this->resource_map[$k] = $r;
				}
			}
		}
	}
}
?>
