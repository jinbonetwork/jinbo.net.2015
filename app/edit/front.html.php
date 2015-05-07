<div id="front-editor-toolbar">
	<input id="edop-section" type="radio" name="edit-option" value="edop-section">
	<label for="edop-section">섹션 편집</label>
	<input id="edop-item" type="radio" name="edit-option" value="edop-item">
	<label for="edop-item">아이템 편집</label>
	<input id="bt-publish" type="button" value="완료">
	<input id="bt-preview" type="button" value="미리보기">
</div>
<?php
if(file_exists(JFE_PATH."/themes/".$themes."/front/index.html.php")) {
	include_once JFE_PATH."/themes/".$themes."/front/index.html.php";
} else {
	print $content;
}
?>
