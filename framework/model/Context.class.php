<?php

class Model_Context extends Objects {
	private $__property;

	public static function instance() {
		return self::_instance(__CLASS__);
	}

	function __construct() {
	}

	public function setProperty($key,$value) {
		$this->__property[$key] = $value;
	}

	public function getProperty($key,$defaultValue = null) {
		if($ae = strpos($key,".*")) {
			$p_type = substr($key,0,$ae);
			foreach($this->__property as $key => $value) {
				if(!strncmp($key,$p_type.".",$ae+1))
					$returnValue[substr($key,$ae+1)] = $value;
			}
			return $returnValue;
		}
		else if(isset($this->__property[$key])) return $this->__property[$key];
		else return $defaultValue;
	}

	public function getOptions($key='') {
		if(!$this->getProperty('options.*')) {
			$config = Model_Config::instance();
			$config->readOption();
		}
		if($key) {
			return $this->getProperty('options.'.$key);
		} else {
			return $this->getProperty('options.*');
		}
	}

	public function getAll() {
		return $this->__property;
	}

	function __destruct() {
	}
}
