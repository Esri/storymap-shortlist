function isMobile() {
	var android = navigator.userAgent.match(/Android/i) ? true : false;
	var blackberry = navigator.userAgent.match(/BlackBerry/i) ? true : false;
	var ios = navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
	var windows = navigator.userAgent.match(/IEMobile/i) ? true : false;
	return (android || blackberry || ios || windows);
}

function getGraphicsExtent(graphics) {
  // accepts an array of graphic points and returns extent
  var minx = Number.MAX_VALUE;
  var miny = Number.MAX_VALUE;
  var maxx = - Number.MAX_VALUE;
  var maxy = - Number.MAX_VALUE;
  var graphic;
  for (var i = 0; i < graphics.length; i++) {
	  graphic = graphics[i];
	  if (graphic.geometry.x > maxx) maxx = graphic.geometry.x;
	  if (graphic.geometry.y > maxy) maxy = graphic.geometry.y;
	  if (graphic.geometry.x < minx) minx = graphic.geometry.x;
	  if (graphic.geometry.y < miny) miny = graphic.geometry.y;
  }
  return new esri.geometry.Extent({"xmin":minx,"ymin":miny,"xmax":maxx,"ymax":maxy,"spatialReference":{"wkid":102100}});;
}