<?php
$Acl = "anonymous";
class sitemap_index extends Controller {
	public function index() {
		$context = Model_Context::instance();

		$section = Section::instance();
		$this->content = $section->buildPage('sitemap',2);
	}
}
?>
