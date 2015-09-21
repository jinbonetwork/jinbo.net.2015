<?php
$Acl = "administrator";
class edit_front extends Controller {

	public function index() {
		$this->layout = 'admin';
		importResource('app-edit-front');
	}
}
?>
