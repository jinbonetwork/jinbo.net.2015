<?php
$Acl = "anonymous";
class privacy_v2 extends Controller {
	public function index() {
		$context = Model_Context::instance();

		$section = Section::instance();
		$this->content = $section->buildPage('privacy.v2',2);
	}
}
?>
