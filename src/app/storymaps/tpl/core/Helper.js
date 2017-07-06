define([],
	function()
{
	return function Helper(){

		this.isMobile = function() {
			var android = navigator.userAgent.match(/Android/i) ? true : false;
			var blackberry = navigator.userAgent.match(/BlackBerry/i) ? true : false;
			var ios = navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
			var windows = navigator.userAgent.match(/IEMobile/i) ? true : false;
			return (android || blackberry || ios || windows);
		};

		this.isIE = function() {
			return (navigator.appVersion.indexOf("MSIE") > -1) || (navigator.userAgent.match(/Trident.*rv\:11\./) || navigator.appVersion.indexOf('Edge'));
		};

		this.isIE8 = function() {
			return parseInt(navigator.userAgent.toLowerCase().split('msie')[1])<9;
		};

		//TODO check if in CommonHelper
		this.prependURLHTTP = function(url)
		{
			if ( ! url || url === "" || url.match(/^mailto:/) )
				return url;

			if ( ! /^(https?:\/\/)|^(\/\/)/i.test(url) )
				return 'http://' + url;

			return url;
		};
	};
});
