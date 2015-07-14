(function($){
	$(document).ready(function(){
		$('#editpage-container').makeEditor({
			readWriteUrl: '/www2015/resources/editor/read_write.php',//url
			previewUrl: '/www2015',									//url
			preset: '/www2015/resources/editor/preset.json',		//url
			rhConfig: ''	//url 또는 object
		});
	});
})(jQuery);

