<?php
class Acl extends Objects {
	private $predefinedrole;
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	protected function __construct() {
		global $AclPreDefinedRole;

		$this->predefinedrole = $AclPreDefinedRole;
	}

	public function setAcl($Acl) {
		if($Acl)
			$this->role = $this->predefinedrole[$Acl];
		else
			$this->role = BITWISE_ANONYMOUS;
	}

	function check() {
		if($this->role < BITWISE_ANONYMOUS && !$_SESSION['user']['uid']) {
			importLibrary('auth');
			requireMembership();
		}
		if($_SESSION['user']['uid'] && $this->role < $_SESSION['user']['glevel']) {
			Error('접근 권한이 없습니다');
			exit;
		}
	}

	function getCurrentPrivilege() {
		$context = Model_Context::instance();
		/* anonymouse 보다 작음 */
		switch($this->role) {
			case BITWISE_ADMINISTRATOR:
				if($_SESSION['user']['glevel'] == 1) return BITWISE_ADMINISTRATOR;
				break;
			case BITWISE_USER:
				if($_SESSION['user']['uid'] > 0 && $_SESSION['user']['glevel'] == BITWISE_USER)
					return BITWISE_USER;
				break;
			case BITWISE_ATHENTICATED:
				if($_SESSION['user']['uid']) return BITWISE_ATHENTICATED;
				break;
			case BITWISE_ANONYMOUS:
				return BITWISE_ANONYMOUS;
				break;
		}
		return BITWISE_ANONYMOUS;
	}

	public static function getIdentity($domain) {
		if( empty($_SESSION['identity'][$domain]) ) {
			return null;
		}
		return $_SESSION['identity'][$domain];
	}

	public static function imMaster() {
		if($_SESSION['user']['glevel'] == BITWISE_ADMINISTRATOR) return 1;
		else return 0;
	}

	public static function checkAcl($role,$eq='ge') {
		$permission = false;
		switch($eq) {
			case 'ge':
				if($_SESSION['user']['glevel'] >= $role)
					$permission = true;
				break;
			case 'le':
				if($_SESSION['user']['glevel'] <= $role)
				$permission = true;
				break;
			case 'eq':
				default:
				if($_SESSION['user']['glevel'] == $role)
				$permission = true;
				break;
		}
		return $permission;
	}
}
?>
