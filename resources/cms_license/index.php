<?php
class CmsAgreement {
	private $__font;
	private $__fsize;
	private $mode;

	public function CmsAgreement($mode) {
		$this->__fsize = 10;
		$this->mode = $mode;
		$this->__font = 'dotum.ttf';
	}

	public function make($name,$request_fee,$phone,$hand_phone,$bank,$acct_id,$acct_name,$acct_personal_id,$request_date) {
		list($year,$mon,$day) = explode("-",$request_date);
		if(trim($name) == trim($acct_name) || preg_match("/".$acct_name."/i",$name)) {
			$self = "본인";
		} else {
			$self = "대표계좌";
		}
		$img = imageCreateFromPNG("cms_application_form.png");
		$black = ImageColorAllocate($img, 0,0,0);
		ImageTTFText($img,$this->__fsize,0,155,275,$black,$this->__font,$name);
		ImageTTFText($img,$this->__fsize,0,465,275,$black,$this->__font,$request_fee);
		ImageTTFText($img,$this->__fsize,0,155,308,$black,$this->__font,$phone);
		ImageTTFText($img,$this->__fsize,0,465,308,$black,$this->__font,$hand_phone);
		ImageTTFText($img,$this->__fsize,0,155,338,$black,$this->__font,$bank);
		ImageTTFText($img,$this->__fsize,0,465,338,$black,$this->__font,$acct_id);
		ImageTTFText($img,$this->__fsize,0,155,370,$black,$this->__font,$acct_name);
		ImageTTFText($img,$this->__fsize,0,465,370,$black,$this->__font,$acct_personal_id);
		ImageTTFText($img,$this->__fsize,0,155,403,$black,$this->__font,$self);
		ImageTTFText($img,$this->__fsize,0,240,765,$black,$this->__font,$year);
		ImageTTFText($img,$this->__fsize,0,315,765,$black,$this->__font,$mon);
		ImageTTFText($img,$this->__fsize,0,370,765,$black,$this->__font,$day);
		ImageTTFText($img,$this->__fsize,0,420,800,$black,$this->__font,$name);
		if(trim($name) != trim($acct_name) && !preg_match("/".$acct_name."/i",$name)) {
			ImageTTFText($img,$this->__fsize,0,420,830,$black,$this->__font,$acct_name);
		}

		header("HTTP/1.1 200 OK");
		header("Status: 200 OK");
		header("Cache-control: private");
		header("Pragma: private");
		if($this->mode == 'download') {
			header("Content-type: application/octet-stream");
			header("Content-Disposition: attachment; filename=Cms_Agreement.png");
		} else {
			header("Content-type: image/png");
			header("Content-Disposition: inline; filename=Cms_Agreement.png");
		}
		ImagePng($img);
		ImageDestroy($img);
	}
}
extract($_GET);
$ca = new CmsAgreement($mode);
$ca->make($name,$request_fee,$phone,$hand_phone,$bank,$acct_id,$acct_name,$acct_personal_id,$request_date);
?>
