<?php
$Acl = "anonymous";
class about_purpose extends Controller {
	public function index() {
		$context = Model_Context::instance();

		$section = Section::instance();
		$this->content = $section->buildPage('about.purpose',2);
	}
}
?>
