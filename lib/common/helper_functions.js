function isMobile() {
	var android = navigator.userAgent.match(/Android/i) ? true : false;
	var blackberry = navigator.userAgent.match(/BlackBerry/i) ? true : false;
	var ios = navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
	var windows = navigator.userAgent.match(/IEMobile/i) ? true : false;
	return (android || blackberry || ios || windows);
}