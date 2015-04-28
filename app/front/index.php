<?php
$Acl = "anonymous";
class front_index extends Controller {
	public function index() {
		$context = Model_Context::instance();

		$section = Section::instance();
		$this->content = $section->buildPage('front',2);
	}
}
?>
