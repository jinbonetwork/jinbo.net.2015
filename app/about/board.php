<?php
$Acl = "anonymous";
class about_board extends Controller {
	public function index() {
		$context = Model_Context::instance();

		$section = Section::instance();
		$this->content = $section->buildPage('about.board',2);
	}
}
?>
