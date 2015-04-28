<?php
class Dispatcher {
	private static $instances = array();

	public $uri, $interfacePath;

	protected function __construct() {
		$this->URIinterpreter();
	}

	public static function instance() {
		$className = __CLASS__;
		if (!array_key_exists($className, self::$instances)) {
			self::$instances[$className] = new $className();
		}
		return self::$instances[$className];
	}

	private function URIinterpreter() {
		global $service;

		$uri = array (
			'host'      => $_SERVER['HTTP_HOST'],
			'fullpath'  => str_replace('index.php', '', $_SERVER["REQUEST_URI"]),
			'root'      => rtrim(str_replace('entry.php', '', $_SERVER["SCRIPT_NAME"]), 'index.php')
		);
		if (strpos($uri['fullpath'],$uri['root']) !== 0)
			$uri['fullpath'] = $uri['root'].substr($uri['fullpath'], strlen($uri['root']) - 1);
		$uri['input'] = ltrim(substr($uri['fullpath'],strlen($uri['root']))).'/';
		$part = strtok($uri['input'], '/');
		if(in_array($part,array('resources','plugins','skin','files'))) {
			$part = (($qpos = strpos($part, '?')) !== false) ? substr($part, 0, $qpos) : $part;
			if(file_exists($part)) {
				require_once JFE_PATH.'/library/function/file.php';
				dumpWithEtag($part);
				exit;
			} else {
				header("HTTP/1.0 404 Not Found");exit;
			}
		}
		$uri['fragment'] = array_values(array_filter(explode('/',strtok($uri['input'],'?'))));
		unset($part);

		if(isset($uri['fragment'][0]) && $uri['fraement'][0] == 'login') {
			$uri['appType'] = 'login';
			$pathPart = "login";
		} else if(isset($uri['fragment'][0]) && $uri['fraement'][0] == 'api') {
			$uri['appType'] = 'api';
			$pathPart = ltrim(rtrim(strtok(strstr($uri['input'],'/'), '?'), '/'),'/');
			$pathPart = strtok($pathPart,'&');
		} else {
			array_splice($uri['fragment'],0,1);
			$pathPart = ltrim(rtrim(strtok(strstr($uri['input'],'/'), '?'), '/'),'/');
			$pathPart = strtok($pathPart,'&');

			if (isset($uri['fragment'][0]) && file_exists(JFE_APP_PATH."/".$uri['fragment'][0])) {
				$uri['appType'] = $uri['fragment'][0];
			} else {
				$uri['appType'] = 'front';
			}
		}

		if(file_exists(JFE_APP_PATH."/".$pathPart.".php")) {
			$uri['appPath'] = JFE_APP_PATH."/".$pathPart.".php";
		} else {
			$uri['appPath'] = JFE_APP_PATH."/".$uri['appType']."/index.php";
		}
		$this->uri = $uri;
	}
}
?>
