function _go_login(v,login_url) {
	var obj = jQuery('#login_box');
	var login_url = location.host+location.search;
	obj.slideToggle();
}

function addAlertMessage(element,message) {
	var e = jQuery(element);
	e.focus();
	var o = e.parent();
	o.addClass('alert');
	e.jfTooltip({
		'placement':'bottom',
		'title': message,
		'class': 'danger',
		'trigger': 'manual'
	});
	e.jfTooltip('show');
	e.addClass('shake');
	setTimeout(function() { e.removeClass('shake'); }, 1000);
}

function removeAlertMessage(element,opt) {
	var e = jQuery(element);
	var o = e.parent();

	if(!opt) {
		o.removeClass('alert');
	}
	e.jfTooltip('destroy');
}

function check_login(TheForm) {
	if(TheForm.user_id.value == "") {
		addAlertMessage(TheForm.user_id,"아이디를 입력하세요.");
		TheForm.user_id.focus();
		return false;
	} else {
		removeAlertMessage(TheForm.user_id,0);
	}
	if(TheForm.passwd.value == "") {
		addAlertMessage(TheForm.passwd,"비밀번호를 입력하세요.");
		TheForm.passwd.focus();
		return false;
	} else {
		removeAlertMessage(TheForm.passwd,0);
	}

//	var url = "https://"+location.host+"/login/proc/";
	var url = TheForm.action;
	var params = "user_id="+TheForm.user_id.value+"&passwd="+encodeURIComponent(TheForm.passwd.value)+"&return_url="+TheForm.return_url.value+"&output=json";
	console.log(url);
	console.log(params);

	jQuery.ajax({
		type: 'POST',
		url: url,
		data: params,
		dataType: 'json',
		beforeSend: function() {
			jQuery('body').jfLoading({
				'position':'overlay'
			});
		},
		success: function(json) {
			jQuery('body').jfLoading('hide');
			var t = parseInt(json.error);
			var d = json.message;
			switch(t) {
				case -1:
					addAlertMessage('#user_id',d);
					break;
				case -2:
					addAlertMessage('#passwd',d);
					break;
				case 0:
					if(!d.match(/^http/) || d.match(/^https/)) {
						d = "http://"+location.host+d;
					}
					if(d) {
						document.location.href = d;
					} else {
						document.location.href = '/';
					}
					break;
				default:
					break;
			}
		},
		error:function(xhr, status, errors) {
			jQuery('body').jfLoading('hide');
			alert(errros);
		}
	});

	return false;
}

function logout(login_url) {
	document.location.href='/login/logout/?return_url='+login_url
}


//진보 메뉴 팝 //
function popmenu(a){
	var obj = document.getElementById('jinbomenu_box');
	obj = obj.style;
	v = obj.display
	var li = a.parentNode;
	if(!v || v == 'none') {
		obj.display='block';
		li.setAttribute("className","jinbomenu_");
		li.setAttribute("class","jinbomenu_");
	}
	else {
		obj.display='none';
		li.setAttribute("className","jinbomenu");
		li.setAttribute("class","jinbomenu");
	}
}

function check_search(TheForm) {
	if(TheForm.search.value == "") {
		alert("검색어를 입력하세요.");
		TheForm.search.focus();
		return false;
	}
	return true;
}

function find_passwd(URL) {
	window.open(URL,'_j_find_passwd','width=400,height=260,scrollbars=no');
}

jQuery(function() {
	jQuery('#loginForm #user_id').focusin(function(e) {
		jQuery(this).parent().addClass('focus');
	})
	.focusout(function(e) {
		jQuery(this).parent().removeClass('focus');
		removeAlertMessage(this,1);
	});
	jQuery('#loginForm #passwd').focusin(function(e) {
		jQuery(this).parent().addClass('focus');
	})
	.focusout(function(e) {
		jQuery(this).parent().removeClass('focus');
		removeAlertMessage(this,1);
	});
	jQuery('#loginForm #user_id').focus();
});
