<?php
$Acl = "administrator";
class edit_front extends Controller {
	public function index() {
		$context = Model_Context::instance();

		$section = Section::instance();
		$this->content = $section->buildPage('front',2,'edit');
		if(!$this->themes) $this->themes = $context->getProperty('service.themes');
		importResource('app-admin-front');
	}
}
?>
