(function($){
	function $ic(selector, $obj){
		if(selector && $obj)
			return $obj.closest('.inputset-complete').find(selector);
		else if(selector)
			return $('.inputset-complete').find(selector);
		else
			return $('.inputset-complete');
	}
	$(document).ready(function(){
		var cmsLicenseImgUrl;
		$ic().on('load-cms-license', function(event){
			$ic().removeClass('hidden');
			cmsLicenseImgUrl = event.url;
		});
		$ic('button[name="view-cms-license"]').click(function(){
			$ic('.content button').addClass('hidden');
			$ic('.cms-license').removeClass('hidden');
			$ic('#license-img').html('<img src="'+cmsLicenseImgUrl+'" width="'+$ic('.cms-license').width()+'px">');
		});
		$ic('button[name="close"]').click(function(){
			$ic('.cms-license').addClass('hidden');
			$ic('.content button').removeClass('hidden');
		});
		$ic('button[name="download"]').click(function(){
			$(location).attr('href', cmsLicenseImgUrl+'&mode=download');
		});
		$ic('button[name="back-to-home"]').click(function(){
			$(location).attr('href', $(this).attr('data-href'));
		});
	});
})(jQuery);
