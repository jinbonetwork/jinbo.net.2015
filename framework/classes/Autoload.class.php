<?php
/**
 * Autoload function
 **/
class Autoload {
	static function load($className) {
		$pos =strrpos($className,'_');
		if($pos!==false) {
			$lpos = strpos($className,'_');
			if(substr($className,0,$lpos) == "PHPExcel") $phpexcel = 1;
			if($phpexcel) {
				if( file_exists( ROOT.'/framework/'.str_replace('_','/',substr($className,0,$pos)).'/'.substr($className,$pos+1).'.php' ) )
					require_once ROOT.'/framework/'.str_replace('_','/',substr($className,0,$pos)).'/'.substr($className,$pos+1).'.php';
			} else {
				if( file_exists( ROOT.'/framework/'.str_replace('_','/',strtolower(substr($className,0,$pos))).'/'.substr($className,$pos+1).'.class.php' ) )
					require_once ROOT.'/framework/'.str_replace('_','/',strtolower(substr($className,0,$pos))).'/'.substr($className,$pos+1).'.class.php';
				else if( file_exists( ROOT.'/classes/'.str_replace('_','/',strtolower(substr($className,0,$pos))).'/'.substr($className,$pos+1).'.class.php' ) )
					require_once ROOT.'/classes/'.str_replace('_','/',strtolower(substr($className,0,$pos))).'/'.substr($className,$pos+1).'.class.php';
			}
		} else if( file_exists(ROOT.'/framework/classes/'.$className.'.class.php') ) {
			require_once ROOT.'/framework/classes/'.$className.'.class.php';
		} else {
			require_once ROOT.'/classes/'.$className.'.class.php';
		}
	}
}
?>
