<?php
$Acl = "anonymous";
class terms_index extends Controller {
	public function index() {
		$context = Model_Context::instance();

		$section = Section::instance();
		$this->content = $section->buildPage('terms',2);
	}
}
?>
