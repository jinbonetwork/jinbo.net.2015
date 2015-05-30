<?php
$filename = '/front_section.json';

if($_POST['savecache']){
    $path = JFE_DATA_PATH.'/cache'.$filename;
    $data = $_POST['section_data'];

    $section_data = json_encode($data, JSON_UNESCAPED_UNICODE);
    $file = @fopen($path, 'w');
    if($file){
        if(@fwrite($file, $section_data)) echo true;
        else echo false;
        fclose($file);
    } else echo false;

    exit;
}

$url = JFE_DATA_URI.'/cache'.$filename;
?>
<div id="editpage-container" url="<?php echo $url; ?>"></div>
