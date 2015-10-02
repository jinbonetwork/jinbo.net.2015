<?php
$www_config = array();
$www_config['www_root'] = dirname(__FILE__).'/../../../..';
require_once($www_config['www_root'].'/include/rfm_config.php');
$www_config['rfm_root'] = '../../..'; 
$www_config['attach_path'] = '/files/attach/'.$www_config['dir'];
$www_config['upload_dir'] = $www_config['root_dir'].$www_config['attach_path'].'/source/';
$www_config['current_path'] = $www_config['rfm_root'].$www_config['attach_path'].'/source/';
$www_config['thumbs_base_path'] = $www_config['rfm_root'].$www_config['attach_path'].'/thumbs/';
?>
