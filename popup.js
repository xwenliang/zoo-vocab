'use strict';
//设置credentials: 'include'后会共享youdao.com下的cookie
var $msg = $('#msg').html('');
var $login = $('#login');
var $vocab = $('#vocab');
var $save = $('#save');

//登录
function login(){
	var username = $.trim($('#username').val());
	var password = $.trim($('#password').val());
	if(!username || !password){
		return showMsg('用户名或密码不能为空~~~')
	}
	fetch('https://logindict.youdao.com/login/acc/login', {
		credentials: 'include',
		method: 'post',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'X-Requested-With': 'XMLHttpRequest'
		},
		body: util.serialize({
			app: 'web',
			tp: 'urstoken',
			ru: 'http://dict.youdao.com',
			product: 'DICT',
			cf:3,
			fr:1,
			type: 1,
			um: true,
			username: username,
			password: md5(password),
			savelogin: 1
		})
	})
	.then(function(res){
		res.text().then(function(text){
			if(text.indexOf('登出') > 0){
				showAdd();
				showMsg('登录成功！');
			}
			else{
				showLogin();
				showMsg('登录失败~~~');
			}
		});
	});
};

$login.on('click', login);
$('#username, #password').on('keydown', function(ev){
	if(ev.keyCode === 13){
		login();
	}
});

//显示登录
function showLogin(){
	$('.login-box').removeClass('hide');
	$('.add-box').addClass('hide');	
};

//显示添加单词
function showAdd(){
	$('.login-box').addClass('hide');
	$('.add-box').removeClass('hide');	
};

var timer = null;
function showMsg(msg){
	$msg.html(msg).css('opacity', 1);
	clearTimeout(timer);
	timer = setTimeout(function(){
		$msg.css('opacity', 0);
	}, 1000);
};

//添加单词
function addVocab(){
	var vocab = $.trim($vocab.val());
	if(!vocab){
		return showMsg('请输入要添加的单词');
	}
	fetch('http://dict.youdao.com/wordbook/ajax?'+util.serialize({
		action: 'addword',
		date: new Date(),
		len: 'eng',
		q: vocab
	}), {
		credentials: 'include',
		method: 'get'
	})
	.then(function(res){
		res.json().then(function(ret){
			if(ret.message === 'nouser'){
				showMsg('请先登录~~~');
			}
			else if(ret.message === 'adddone'){
				showMsg('添加成功！');
			}
		});
	})
	.catch(function(err){
		showMsg(err);
	});
};

$save.on('click', addVocab);
$vocab.on('keydown', function(ev){
	if(ev.keyCode === 13){
		addVocab();
	}
});



new Promise(function(resolve, reject){
	//检测登录，通过访问生词本列表页，未登录用户会被重定向到登录
	fetch('http://dict.youdao.com/wordbook/wordlist', {
		credentials: 'include',
		method: 'get'
	})
	.then(function(res){
		res.text().then(function(text){
			var isLogin = false;
			//页面有登出二字，表示已登录，是不是很搞笑？哈哈
			if(text.indexOf('登出') > 0){
				isLogin = true;
			}
			else{
				isLogin = false;
			}
			resolve(isLogin);
		});
	})
})
.then(function(isLogin){
	if(isLogin){
		showAdd();
	}
	//否则显示登录窗
	else{
		showLogin();
	}
});

