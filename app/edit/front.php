<?php
$Acl = "administrator";
class edit_front extends Controller {
	public function index() {
		$mode = $this->params['mode'];
		
		if($mode == 'read' || $mode == 'write'){
			$dbm = DBM::instance();
			$which = $this->params['which'];
			if($mode == 'write'){
				$data = $this->params['data'];
				$data = json_encode($data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);

				$path = JFE_CACHE_PATH.'/front_'.(($which == 'item') ? 'items' : $which).'.json';
				$file = fopen($path, 'w');
				if($file){
					if(!fwrite($file, $data)){ echo false; exit; };
					fclose($file);
				} else { echo false; exit; };
				$data = preg_replace('/\\\"/', '\\\\\\"', $data);
				$data = preg_replace('/\'/', '\\\'', $data);

				$que = 'UPDATE {'.$which.'} SET `data`=? WHERE `version`=?';
				$dbm->execute($que, array('sd', $data, 1));
				echo true;
			}
			else if($mode == 'read'){
				$que = 'SELECT data FROM {'.$which.'}';
				$row = $dbm->getFetchArray($que);
				if($row) echo $row['data'];
				else echo false;
			}
			exit;
		}
		else if($mode == 'cacheToDB'){
			$dbm = DBM::instance();
			$which = $this->params['which'];
			$path = JFE_CACHE_PATH.'/front_'.(($which == 'item') ? 'items' : $which).'.json';
			$file = fopen($path, 'r');
			if($file){
				$data = stream_get_contents($file);
				$data = preg_replace('/\\\"/', '\\\\\\"', $data);
				$data = preg_replace('/\'/', '\\\'', $data);
				$que = 'UPDATE {'.$which.'} SET `data`=? WHERE `version`=?';
				$dbm->execute($que, array('sd', $data, 1));
				echo 'Scuccess!'; 
			} else {
				echo 'Failure!';
			}
			exit;
		}
		else if($mode == 'config'){
			echo	'{
						"app-url": "'.JFE_URI.'",
						"rh-url": "'.JFE_REGHEIGHT_CONFIG_URL.'"
					}';
			exit;
		}
		else if($mode == 'profile'){
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
				echo json_encode($profiles, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
				exit;
			}	
		}
		else {
			$this->layout = 'admin';
			importResource('app-edit-front');
		}
	}
}
?>
