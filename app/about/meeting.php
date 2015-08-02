<?php
$Acl = "anonymous";
class about_meeting extends Controller {
	public function index() {
		$context = Model_Context::instance();

		$section = Section::instance();
		$this->content = $section->buildPage('about.meeting',2);
	}
}
?>
