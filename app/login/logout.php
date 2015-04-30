<?php
importLibrary('auth');
$IV = array(
	'GET' => array(
		'requestURI' => array('string', 'default' => null)
	),
	'POST' => array(
		'requestURI' => array('string', 'default' => null)
	)
);

class login_logout extends Controller {
	public function index() {
		logout();

		if($_GET['requestURI']) {
			RedirectURL(rawurldecode($_GET['requestURI']));
		} else {
			RedirectURL(base_uri());
		}
	}
}
?>
