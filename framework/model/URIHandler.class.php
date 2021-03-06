<?php
final class Model_URIHandler extends Objects {
	public $uri, $params, $appPath;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	protected function __construct() {
		$this->__URIinterpreter();
	}

	public function URIParser() {
		$this->__URIParser();
	}

	private function __URIinterpreter() {
		global $context;

		$uri = parse_url(($_SERVER['HTTPS'] == 'on' ? "https" : "http")."://".$_SERVER['HTTP_HOST'].str_replace('index.php', '', $_SERVER['REQUEST_URI']));
		if($uri) {
			$uri += array (
				'fullpath'  => str_replace('index.php', '', $_SERVER["REQUEST_URI"]),
				'root'      => rtrim(str_replace('index.php', '', $_SERVER["SCRIPT_NAME"]), 'index.php')
			);
		}
//		if (strpos($uri['fullpath'],$uri['root']) !== 0) {
			$uri['fullpath'] = $uri['root'].substr($uri['fullpath'], strlen($uri['root']) - 1);
//		}
		if($uri['fullpath'] == "/") {
			$uri['fullpath'] .= "front";
		}
		$uri['fullpath'] = rtrim($uri['fullpath'],"/");
		$uri['input'] = ltrim(substr($uri['fullpath'],strlen($uri['root'])));
		$path = strtok($uri['input'], '/');
		if(in_array($path,array('resources','contribute','themes','files'))) {
			$use_filehandler = $context->getProperty('service.use_filehandler');
			if($use_filehandler) {
				include_once $use_filehandler;
				exit;
			}
			else {
				$part = ltrim(rtrim($uri['input']), '/');
				$part = (($qpos = strpos($part, '?')) !== false) ? substr($part, 0, $qpos) : $part;
				if(file_exists($part)) {
					require_once JFE_LIB_PATH.'/file.php';
					dumpWithEtag($part);
					exit;
				} else {
					header("HTTP/1.0 404 Not Found");exit;
				}
			}
		}
		$uri['input'] = $uri['input'].'/';
		unset($uri['fragment']);
		$uri['fragment'] = array_values(array_filter(explode('/',strtok($uri['input'],'?'))));
		unset($part);


		if(!count($uri['fragment'])) {
			$uri['appType'] = 'front';
			$pathPart = JFE_APP_PATH."front";
		} else {
			if (isset($uri['fragment'][0]) && file_exists(JFE_APP_PATH."/".$uri['fragment'][0])) {
				$uri['appType'] = $uri['fragment'][0];
				$pathPart = JFE_APP_PATH.ltrim(rtrim(strtok(strstr($uri['input'],'/'), '?'), '/'),'/');
			} else {
				header("HTTP/1.0 404 Not Found");exit;
			}
		}

		$pathPart = strtok($pathPart,'&');

		if(file_exists($pathPart.".php")) {
			$uri['appPath'] = dirname($pathPart);
			$uri['appFile'] = basename($pathPart);
			$uri['appClass'] = basename($uri['appPath'])."_".$uri['appFile'];
			$uri['appProcessor'] = "index";
		} else if(file_exists($pathPart."/index.php")) {
			$uri['appPath'] = $pathPart;
			$uri['appFile'] = "index";
			$uri['appClass'] = basename($uri['appPath'])."_index";
			$uri['appProcessor'] = "index";
		} else if(file_exists(dirname($pathPart)."/index.php")) {
			$uri['appPath'] = dirname($pathPart);
			$uri['appFile'] = "index";
			$uri['appClass'] = basename($uri['appPath'])."_index";
			$uri['appProcessor'] = basename($pathPart);
		}
		$this->uri = $uri;
	}

	private function __URIParser() {
		if(!isset($this->uri)) $this->__URIinterpreter();

		if(!$this->uri['appPath'] || !$this->uri['appFile']) {
			Respond::NotFoundPage();
		}
		$this->params = array_merge($_GET, $_POST);
		$this->params['appType'] = $this->uri['appType'];
		$this->params['path'] = substr($this->uri['appPath'],strlen(JFE_PATH)+1);
		$this->params['browserType'] = $this->uri['browserType'];
		$this->params['controller']['path'] = $this->uri['appPath'];
		$this->params['controller']['uri'] = rtrim($this->uri['root'].substr($this->uri['appPath'],strlen(JFE_PATH)+1),"/");
		$this->params['controller']['file'] = $this->uri['appFile'];
		$this->params['controller']['class'] = $this->uri['appClass'];
		$this->params['controller']['process'] = $this->uri['appProcessor'];
	}
}
?>
