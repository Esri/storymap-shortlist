(function( $ ) {
	
	$.fn.multiTips = function( method ) {
			
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist in MultiTips' );
		}
	};
	
	var settings;
		
	var methods = {
			
		init : function( options ){
			initMultiTips($(this),options);
		},
		
		update : function(){
			makePoints($(this));
		}
	}
	
	var initMultiTips = function(mapDiv,options){
		
		//Default Options
		settings = $.extend({
			'pointArray' : [],
			'mapVariable' : null,
			'attributeLabelField' : "",
			'zoomToPoints' : false,
			"backgroundColor" : "#000000",
			"pointerColor" : "#000000",
			"textColor" : "#ffffff",
			"labelDirection" : "auto"
		},options);
		
		makePoints(mapDiv);
		
	}
	
	var makePoints = function(mapDiv){
		
		$(".multiTip").remove();
		$(".mtArrow").remove();
		
		var textAreaPos = [];
		var arrowPos = [];
		var _firstPan = false;	

		if (settings.zoomToPoints == true){
			settings.mapVariable.setExtent(getGraphicsExtent(settings.pointArray));
		}

		dojo.connect(settings.mapVariable,"onZoomStart",function(){
			$(".mtArrow").hide();
			$(".multiTip").hide();
		});
		dojo.connect(settings.mapVariable,"onZoomEnd",function(){
			$(".mtArrow").show();
			$(".multiTip").show();
		});
		
		dojo.connect(settings.mapVariable,"onPanStart",function(){
			textAreaPos = [];
			arrowPos = [];
			$(".mtArrow").each(function() {
                arrowPos.push($(this).position());
            });
			$(".multiTip").each(function() {
                textAreaPos.push($(this).position());
            });
		});
		
		dojo.connect(settings.mapVariable,"onPan",function(extent,delta){
			if (_firstPan == false){
				$(".mtArrow").each(function(i) {
					$(this).css("top",arrowPos[i].top+delta.y).css("left",arrowPos[i].left+delta.x);
				});
				$(".multiTip").each(function(i) {
					$(this).css("top",textAreaPos[i].top+delta.y).css("left",textAreaPos[i].left+delta.x);
				});
			}
			else{
				$(".mtArrow").hide();
				$(".multiTip").hide();
			}			
		});
		
		dojo.connect(settings.mapVariable,"onExtentChange",function(){
			if(_firstPan == true){
				$(".mtArrow").show();
				$(".multiTip").show();
				_firstPan = false;
			}
			$.each(settings.pointArray,function(i,pt){
				var scrPt = settings.mapVariable.toScreen(pt.geometry);
				displayMultiTips(scrPt,i,settings);
			});
		});
			
		$.each(settings.pointArray,function(i,pt){
			mapDiv.append("<div id='arrow"+i+"' class='mtArrow'></div>").append("<div id='multiTip"+i+"' class='multiTip'></div>");
			$('#multiTip'+i).html(pt.attributes[settings.attributeLabelField]);
			$('#multiTip'+i).css("background-color",settings.backgroundColor);
			$('#multiTip'+i).css("color",settings.textColor);
			$('#multiTip'+i).css("white-space","nowrap");
			$('#multiTip'+i).css("padding","5px");
			$('#multiTip'+i).css("position","absolute");
			$('#multiTip'+i).css("z-index","1000");			
			$("#arrow"+i).css("position","absolute");
			$("#arrow"+i).css("width","0");
			$("#arrow"+i).css("height","0");			
			$("#arrow"+i).css("z-index","1000");
			var scrPt = settings.mapVariable.toScreen(pt.geometry);
			displayMultiTips(scrPt,i,settings);
		});
	}
	
	var displayMultiTips = function (scrPt,i,settings){
		if (settings.labelDirection != "auto"){
			if (settings.labelDirection == "left"){
				labelLeft(scrPt,i,settings);
			}
			else if (settings.labelDirection == "right"){
				labelRight(scrPt,i,settings);
			}
			else if (settings.labelDirection == "down"){
				labelDown(scrPt,i,settings);
			}
			else{
				labelUp(scrPt,i,settings);
			}
		}
		else{
			$.each(settings.pointArray,function(index,gr){
				if(chkVrtDst(settings,gr) > ($(".multiTip").height()+25) && settings.mapVariable.toScreen(gr.geometry).y > ($(".multiTip").height()+25)){
					labelUp(scrPt,index,settings);
				}
				else{
					labelLeft(scrPt,index,settings);
				}
			});
		}
		//labelUp(scrPt,i,settings);
		//labelDown(scrPt,i,settings);
		//labelRight(scrPt,i,settings);
		//labelLeft(scrPt,i,settings);
	}
	
	var chkVrtDst = function(settings,curPt){
		var curTop = settings.mapVariable.toScreen(curPt.geometry).y;
		var checkNum = Number.MAX_VALUE;
		var verDst;
		$.each(settings.pointArray,function(i,pt){
			if (pt != curPt){
				if (Math.abs(settings.mapVariable.toScreen(pt.geometry).y - curTop) < checkNum){
					checkNum = Math.abs(settings.mapVariable.toScreen(pt.geometry).y - curTop);
					verDst = settings.mapVariable.toScreen(pt.geometry).y - curTop;
				}
			}
		});
		return verDst;
	}
	
	var labelDown = function (scrPt,i,settings){
		$('#multiTip'+i).css("top",scrPt.y + 10);
		$('#multiTip'+i).css("left",scrPt.x - ($('#multiTip'+i).width()/2)-5);
		$("#arrow"+i).css("left",scrPt.x - 10);
		$("#arrow"+i).css("top",scrPt.y);
		$("#arrow"+i).css("border-left","10px solid transparent");
		$("#arrow"+i).css("border-right","10px solid transparent");
		$("#arrow"+i).css("border-bottom","10px solid");
		$("#arrow"+i).css("border-bottom-color",settings.pointerColor);
	}
	
	var labelUp = function (scrPt,i,settings){
		$('#multiTip'+i).css("top",scrPt.y - $('#multiTip'+i).height()-20);
		$('#multiTip'+i).css("left",scrPt.x - ($('#multiTip'+i).width()/2)-5);
		$("#arrow"+i).css("left",scrPt.x - 10);
		$("#arrow"+i).css("top",scrPt.y - 10);
		$("#arrow"+i).css("border-left","10px solid transparent");
		$("#arrow"+i).css("border-right","10px solid transparent");
		$("#arrow"+i).css("border-top","10px solid");
		$("#arrow"+i).css("border-top-color",settings.pointerColor);
	}
	
	var labelRight = function (scrPt,i,settings){
		$('#multiTip'+i).css("top",scrPt.y - 10 - (($('#multiTip'+i).height()-10)/2));
		$('#multiTip'+i).css("left",scrPt.x + 10);
		$("#arrow"+i).css("left",scrPt.x);
		$("#arrow"+i).css("top",scrPt.y - 10);
		$("#arrow"+i).css("border-top","10px solid transparent");
		$("#arrow"+i).css("border-bottom","10px solid transparent");
		$("#arrow"+i).css("border-right","10px solid");
		$("#arrow"+i).css("border-right-color",settings.pointerColor);
	}
	
	var labelLeft = function (scrPt,i,settings){
		$('#multiTip'+i).css("top",scrPt.y - 10 - (($('#multiTip'+i).height()-10)/2));
		$('#multiTip'+i).css("left",scrPt.x - 20 - ($('#multiTip'+i).width()));
		$("#arrow"+i).css("left",scrPt.x-10);
		$("#arrow"+i).css("top",scrPt.y - 10);
		$("#arrow"+i).css("border-top","10px solid transparent");
		$("#arrow"+i).css("border-bottom","10px solid transparent");
		$("#arrow"+i).css("border-left","10px solid");
		$("#arrow"+i).css("border-left-color",settings.pointerColor);
	}
	
	var getGraphicsExtent = function( graphics ) {
		_firstPan = true;
		// accepts an array of graphic points and returns extent
		var minx = Number.MAX_VALUE;
		var miny = Number.MAX_VALUE;
		var maxx = -Number.MAX_VALUE;
		var maxy = -Number.MAX_VALUE;
		var graphic;
		for (var i = 0; i < graphics.length; i++) {
			graphic = graphics[i];
			if (graphic.geometry.x > maxx) maxx = graphic.geometry.x;
			if (graphic.geometry.y > maxy) maxy = graphic.geometry.y;
			if (graphic.geometry.x < minx) minx = graphic.geometry.x;
			if (graphic.geometry.y < miny) miny = graphic.geometry.y;
		}
	
	
		var extent = new esri.geometry.Extent({"xmin":minx,"ymin":miny,"xmax":maxx,"ymax":maxy,"spatialReference":{"wkid":102100}});
		return extent.expand(1.8);
	}

})( jQuery );