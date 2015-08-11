<?php
$Acl = "anonymous";
class privacy_index extends Controller {
	public function index() {
		$context = Model_Context::instance();

		$section = Section::instance();
		$this->content = $section->buildPage('privacy',2);
	}
}
?>
