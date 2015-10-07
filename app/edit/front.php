<?php
$Acl = "administrator";
class edit_front extends Controller {
	public function index() {
		$mode = $this->params['mode'];
		if($mode == 'write'){
			echo $this->write($this->params['which'], $this->params['data']);
			exit;
		}
		else if($mode == 'read'){
			echo $this->read($this->params['which']);
			exit;
		}
		else if($mode == 'publish'){
			if(!$this->publish('section')){ echo false; exit; }
			if(!$this->publish('item')){ echo false; exit; }
			echo true;
			exit;
		}
		else if($mode == 'cacheToDB'){
			if(!$this->cacheToDB('section')){ echo false; exit; }
			if(!$this->cacheToDB('item')){ echo false; exit; }
			echo true;
			exit;
		}
		else if($mode == 'config'){
			echo	'{
						"app-url": "'.JFE_URI.'",
						"rh-url": "'.JFE_REGHEIGHT_CONFIG_URL.'",
						"rfm-url": "'.JFE_CONTRIBUTE_URI.'/filemanager/filemanager/dialog.php"
					}';
			exit;
		}
		else if($mode == 'profile'){
			echo $this->profile();
			exit;
		}
		else {
			$this->layout = 'admin';
			importResource('app-edit-front');
			$_SESSION['current'] = array('mode'=>'edit-front');
		}
	}
	private function write($which, $data){
		$dbm = DBM::instance();
		$data = $this->decodeData($data);
		$data = $this->escQuot($data);
		$que = 'UPDATE {'.$which.'} SET `data`=? WHERE `version`=?';
		$dbm->execute($que, array('sd', $data, 1));
		return true;
	}
	private function decodeData($data){
		$data = preg_replace('/\\\=/', '=', $data);
		return $data;
	}
	private function escQuot($data){
		$data = preg_replace('/\\\"/', '\\\\\\"', $data);
		$data = preg_replace('/\'/', '\\\'', $data);
		return $data;
	}
	private function read($which){
		$dbm = DBM::instance();
		$que = 'SELECT data FROM {'.$which.'}';
		$row = $dbm->getFetchArray($que);
		if($row) return $row['data'];
		else return false;
	}
	private function publish($which){
		$data = $this->read($which);
		if(!$data) return false;
		$path = $this->cachePath($which);
		$file = fopen($path, 'w');
		if($file){
			if(!fwrite($file, $data)){ return false; }
			fclose($file);
		} else { return false; }
		return true;
	}
	private function cachePath($which){
		return JFE_CACHE_PATH.'/front_'.(($which == 'item') ? 'items' : $which).'.json';
	}
	private function cacheToDB($which){
		$file = fopen($this->cachePath($which), 'r');
		if($file){
			$data = stream_get_contents($file);
			$data = $this->escQuot($data);
			$dbm = DBM::instance();
			$que = 'UPDATE {'.$which.'} SET `data`=? WHERE `version`=?';
			$dbm->execute($que, array('sd', $data, 1));
			return true;
		} else {
			return false;
		}
	}
	private function profile(){
		$rPath = $this->params['url'];
		$path = JFE_PATH.$rPath;
		$url = JFE_URI.$rPath;
		$dh = opendir($path);
		$profiles = array();
		if($dh){
			for($i = 0; $compName = readdir($dh);){
				if($compName != '.' && $compName != '..'){
					$file = $path.'/'.$compName.'/profile.json';
					$fp = @fopen($file, 'r');
					if($fp){
						$profiles[$compName] = json_decode(@stream_get_contents($fp));
						if(@fopen($path.'/'.$compName.'/icon.png', 'r'))
							$profiles[$compName]->icon = $url.'/'.$compName.'/icon.png';
						else
							$profiles[$compName]->icon = '';
						fclose($fp);
						$i++;
					}
				}
			}
			closedir($dh);
			return json_encode($profiles, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
		}
	}
}
?>
