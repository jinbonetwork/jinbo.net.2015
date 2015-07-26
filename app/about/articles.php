<?php
$Acl = "anonymous";
class about_articles extends Controller {
	public function index() {
		$context = Model_Context::instance();

		$section = Section::instance();
		$this->content = $section->buildPage('about.articles',2);
	}
}
?>
