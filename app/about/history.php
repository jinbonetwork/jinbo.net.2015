<?php
$Acl = "anonymous";
class about_history extends Controller {
	public function index() {
		$context = Model_Context::instance();

		$section = Section::instance();
		$this->content = $section->buildPage('about.history',2);
	}
}
?>
