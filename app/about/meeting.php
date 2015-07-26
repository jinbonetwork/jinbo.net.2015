<?php
$Acl = "anonymous";
class about_metting extends Controller {
	public function index() {
		$context = Model_Context::instance();

		$section = Section::instance();
		$this->content = $section->buildPage('about.metting',2);
	}
}
?>
