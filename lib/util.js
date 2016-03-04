var util = window.util || {

	serialize: function(obj){
		if(!obj){
			return '';
		}
		if(obj instanceof Array){
			return  '';
		}
		var str = '';
		for(var i in obj){
			str += i + '=' + obj[i] + '&';
		}
		return str.slice(0, -1);
	}
	
};