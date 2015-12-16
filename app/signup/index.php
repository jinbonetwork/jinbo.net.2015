<?php
$Acl = "anonymous";
importLibrary('auth');
class signup_index extends Controller {
	public function index() {
		importResource('app-signup');
		$section = Section::instance();
		$this->content = $section->buildPage('signup', 2);
	}
}
?>
