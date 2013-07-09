function IconSpecs(width,height,offset_x,offset_y) {
	
	var _width = width;
	var _height = height;
	var _offset_x = offset_x;
	var _offset_y = offset_y;

	this.getWidth = function() {
		return _width;
	}
		
	this.getHeight = function() {
		return _height;
	}
	
	this.getOffsetX = function() {
		return _offset_x;
	}
	
	this.getOffsetY = function() {
		return _offset_y;
	}
	
}