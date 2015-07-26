<?php
$Acl = "anonymous";
class about_index extends Controller {
	public function index() {
		$context = Model_Context::instance();

		$section = Section::instance();
		$this->content = $section->buildPage('about',2);
	}
}
?>
