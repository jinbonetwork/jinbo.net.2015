<?php
$Acl = "administrator";
class admin_front extends Controller {
	public function index() {
		$context = Model_Context::instance();

		$section = Section::instance();
		$this->content = $section->buildPage('front',2,'edit');
		if(!$this->themes) $this->themes = $context->getProperty('service.themes');
	}
}
?>
