dojo.require("esri.arcgis.utils");

var COLOR_SCHEMES = [
					{name:"blue",iconDir:"blue",iconPrefix:"NumberIconb",color:"#177ff1"},
					{name:"red",iconDir:"red",iconPrefix:"NumberIcon",color:"#fd2d29"},
					{name:"green",iconDir:"green",iconPrefix:"NumberIcong",color:"#22880d"},
					{name:"purple",iconDir:"purple",iconPrefix:"IconPurple",color:"#9c46fd"}
					];
					
var COLOR_DIM = "#E7E7E7";
var COLOR_FULL = "#FFFFFF";

var LEFT_PANE_WIDTH_TWO_COLUMN = 327;
var LEFT_PANE_WIDTH_THREE_COLUMN = 485;

var TWO_COLUMN_THRESHOLD = 600;

var FIELDNAME_NUMBER = "Number";
var FIELDNAME_TITLE = "Title";
var FIELDNAME_SHORTDESC = "Short_desc";
var FIELDNAME_IMAGEURL = "Image_URL";
var FIELDNAME_ADDRESS = "Address";
var FIELDNAME_HOURS = "Hours";
var FIELDNAME_WEBSITE = "Website";
var FIELDNAME_DESC1 = "Desc1";
var FIELDNAME_DESC2 = "Desc2";
var FIELDNAME_DESC3 = "Desc3";
var FIELDNAME_DESC4 = "Desc4";
var FIELDNAME_DESC5 = "Desc5";
var FIELDNAME_ID = "Shortlist-ID";

var _lutIconSpecs = {
	tiny:new IconSpecs(22,28,3,8),
	medium:new IconSpecs(24,30,3,8),
	large:new IconSpecs(32,40,3,11)
}
	
var _contentLayers = [];

var _isMobile = isMobile();
var _isIE = (navigator.appVersion.indexOf("MSIE") > -1);

var _map;

var _bookmarks;

var _layerCurrent;

var _selected;

var _initExtent;

var _dojoReady = false;
var _jqueryReady = false;

/******************************************************
************************* init ************************
*******************************************************/

dojo.addOnLoad(function() {_dojoReady = true;init()});
jQuery(document).ready(function() {_jqueryReady = true;init()});

/* init comes in two parts because of async call to 
   createMap. */

function init() {
	
	if (!_jqueryReady) return;
	if (!_dojoReady) return;
	
	var queryString = new Object();
	var temp = esri.urlToObject(document.location.href).query;
	if (temp) {
		$.each(temp, function(index, value) {
			queryString[index.toLowerCase()] = value;
		});
	}

	WEBMAP_ID = queryString["webmap"] ? queryString["webmap"] : WEBMAP_ID;
	BOOKMARKS_ALIAS = queryString["bookmarks_alias"] ? queryString["bookmarks_alias"] : BOOKMARKS_ALIAS;
	COLOR_ORDER = queryString["color_order"] ? queryString["color_order"] : COLOR_ORDER;
	DETAILS_PANEL = queryString["details_panel"] ? $.trim((queryString["details_panel"])).toLowerCase() == "true" : DETAILS_PANEL;
	POINT_LAYERS_NOT_TO_BE_SHOWN_AS_TABS = queryString["point_layers_not_to_be_shown_as_tabs"] ? 
											queryString["point_layers_not_to_be_shown_as_tabs"] : 
											POINT_LAYERS_NOT_TO_BE_SHOWN_AS_TABS;
	SUPPORTING_LAYERS_THAT_ARE_CLICKABLE = queryString["supporting_layers_that_are_clickable"] ?
											queryString["supporting_layers_that_are_clickable"] :
											SUPPORTING_LAYERS_THAT_ARE_CLICKABLE;
	// Note:  If using a proxy server (required for remove CSV access),
	//        you'll need to uncomment the following line and provide
	//        a valid proxy server url. 										
	//esri.config.defaults.io.proxyUrl = YOUR_PROXY_URL_HERE;
	
	$("#bookmarksTogText").html(BOOKMARKS_ALIAS+' &#x25BC;');

	handleWindowResize();	
	$(this).resize(handleWindowResize);	
	
	$("#zoomIn").click(function(e) {
        _map.setLevel(_map.getLevel()+1);
    });
	$("#zoomOut").click(function(e) {
        _map.setLevel(_map.getLevel()-1);
    });
	$("#zoomExtent").click(function(e) {
        _map.setExtent(_initExtent);
    });	
	
	$(document).bind('cbox_complete', function(){
		$(".details .rightDiv").height($(".details").height() - $(".details .title").height() - 40);
	});  
	
	$("#bookmarksToggle").click(function(){
		if ($("#bookmarksDiv").css('display')=='none'){
		  $("#bookmarksTogText").html(BOOKMARKS_ALIAS+' &#x25B2;');
		}
		else{
		  $("#bookmarksTogText").html(BOOKMARKS_ALIAS+' &#x25BC;');
		}
		$("#bookmarksDiv").slideToggle();
	});
			
	var mapDeferred = esri.arcgis.utils.createMap(WEBMAP_ID, "map", {
		mapOptions: {
			slider: false,
			wrapAround180:false
		},
		ignorePopups: true
	});
	
	mapDeferred.addCallback(function(response) {
		
		document.title = response.itemInfo.item.title;
		$("#title").html(response.itemInfo.item.title);
		$("#subtitle").html(response.itemInfo.item.snippet);
		
		_map = response.map;
		  
		dojo.connect(_map, 'onExtentChange', refreshList);

		// click action on the map where there's no graphic 
		// causes a deselect.

		dojo.connect(_map, 'onClick', function(event){
			if (event.graphic == null) {
				unselect();
			}
		});
		
		_bookmarks = response.itemInfo.itemData.bookmarks;
		if (_bookmarks) {
			loadBookmarks();
			$("#bookmarksCon").show();
		}
		
		var layers = response.itemInfo.itemData.operationalLayers; 
		
		if(_map.loaded){
			initMap(layers);
		} else {
			dojo.connect(_map,"onLoad",function(){
				initMap(layers);
			});
		}
		
	});
	
	mapDeferred.addErrback(function(error) {
	  console.log("Map creation failed: ", dojo.toJson(error));
	});
	
}

function initMap(layers) {
	
	var supportLayers = [];
	var pointLayers = [];
	
	var arrExemptions = [];
	$.each(POINT_LAYERS_NOT_TO_BE_SHOWN_AS_TABS.split("|"), function(index, value) {
		arrExemptions.push($.trim(value).toLowerCase());
	});
	
	var supportingLayersThatAreClickable = [];
	$.each(SUPPORTING_LAYERS_THAT_ARE_CLICKABLE.split("|"), function(index, value) {
		supportingLayersThatAreClickable.push($.trim(value).toLowerCase());
	});
		
	$.each(layers, function(index,value){
		if (value.url == null || value.type == "CSV") {
			if (
				getFeatureSet(value).geometryType == "esriGeometryPoint" && 
				$.inArray(value.title.toLowerCase(), arrExemptions) == -1
				) {
				pointLayers.push(value);
			} else {
				supportLayers.push(value);
			}
		} else {
			// if the layer has an url property (meaning that it comes from a service), just
			// keep going...it will remain in the map, but won't be query-able.
		}		
	});

	_initExtent = _map.extent;
	
	var supportLayer;
	$.each(supportLayers,function(index,value) {
		supportLayer = _map.getLayer($.grep(_map.graphicsLayerIds, function(n,i){return _map.getLayer(n).id == getID(value)})[0]);
		if (supportLayer == null) return;
		$.each(supportLayer.graphics,function(index,value) {
			value.attributes.getValueCI = getValueCI; // assign extra method to handle case sensitivity
		});
		if ($.inArray(value.title.toLowerCase(), supportingLayersThatAreClickable) > -1) {
			dojo.connect(supportLayer, "onMouseOver", baselayer_onMouseOver);
			dojo.connect(supportLayer, "onMouseOut", baselayer_onMouseOut);
			dojo.connect(supportLayer, "onClick", baselayer_onClick);
		}
	});
	
	var contentLayer;
	var colorScheme;
	var colorOrder = COLOR_ORDER.split(",");
	var colorIndex;
	$.each(pointLayers,function(index,value) {
		_map.removeLayer(_map.getLayer($.grep(_map.graphicsLayerIds, function(n,i){return _map.getLayer(n).id == getID(value)})[0]));
		$.each(getFeatureSet(value).features, function(index,value) {
			value.attributes.getValueCI = getValueCI; // assign extra method to handle case sensitivity
			value.attributes[FIELDNAME_ID] = index; // assign internal shortlist id
		});
		/* color index assignment is a weird bit of voodoo.  first thing to consider
		   is that layers names actually appear in tabs in reverse order (i.e. last layer in
		   is leftmost tab).  this means that we have to invert the color index for things to match
		   right.  also, using modulus to handle overflow -- when there are more layers
		   than colors.  so, we end up re-using colors but keeping the sequence. */
		colorIndex = (pointLayers.length - index - 1) % colorOrder.length;
		colorScheme = $.grep(COLOR_SCHEMES, function(n,i){
			return n.name.toLowerCase() == $.trim(colorOrder[colorIndex].toLowerCase())
		})[0];
		contentLayer = buildLayer(
					getFeatureSet(value).features.sort(SortByNumber),
					colorScheme.iconDir,
					colorScheme.iconPrefix
					);
		contentLayer.color = colorScheme.color;
		contentLayer.title = value.title;
		dojo.connect(contentLayer, "onMouseOver", layer_onMouseOver);
		dojo.connect(contentLayer, "onMouseOut", layer_onMouseOut);
		dojo.connect(contentLayer, "onClick", layer_onClick);
	
		_map.addLayer(contentLayer);
		_contentLayers.push(contentLayer);
	});

	_contentLayers.reverse();
	$.each(_contentLayers,function(index,value){
		$("#tabs").append('<div class="tab" onclick="activateLayer(_contentLayers['+index+'])">'+value.title+'</div>');
	});
	
	if ($(".tab").length == 1) $(".tab").css("display", "none");

	activateLayer(_contentLayers[0]);
	dojo.connect(_map.infoWindow,"onHide",infoWindow_onHide);
	$("#zoomToggle").css("visibility","visible");
	$("#whiteOut").fadeOut("slow");			

}

/******************************************************
******************** event handlers *******************
*******************************************************/

function tile_onMouseOver(e) {
	 $(this).stop().animate({'background-color' : COLOR_FULL});
}

function tile_onMouseOut(e) {
	
	if (_selected != null) {
		// does this tile represent the selected graphic?
		var id = parseInt($(this).attr("id").substring(4));
		if (_selected.attributes.getValueCI(FIELDNAME_ID) == id) {
			return;
		}
	}
	
	$(this).stop().animate({'background-color' : COLOR_DIM});
}

function tile_onClick(e) {
	var id = parseInt($(this).attr("id").substring(4));	
	preSelection();
	_selected = $.grep(_layerCurrent.graphics,function(n,i){return n.attributes.getValueCI(FIELDNAME_ID) == id})[0];
	postSelection();
}

function infoWindow_onHide(event) {
	unselect();
}

function baselayer_onMouseOver(event)
{
	if (_isMobile) return;	
	_map.setMapCursor("pointer");
	var graphic = event.graphic;
	$("#hoverInfo").html(graphic.attributes.getValueCI(FIELDNAME_TITLE));
	var pt = event.screenPoint;
	hoverInfoPos(pt.x,pt.y);
}

function baselayer_onMouseOut(event)
{
	if (_isMobile) return;	
	_map.setMapCursor("default");
	$("#hoverInfo").hide();
}

function baselayer_onClick(event) {
	var feature = event.graphic;
	_map.infoWindow.setTitle(event.graphic.attributes.getValueCI(FIELDNAME_TITLE));
	_map.infoWindow.setContent(buildPopupContentHTML(feature.attributes));
	_map.infoWindow.show(event.mapPoint);	
	$(".infoWindowLink").click(function(e) {
        showDetails(feature);
    });
	$("#hoverInfo").hide();	
}

function layer_onClick(event)
{
	preSelection();		
	_selected = event.graphic;
	postSelection();
}

function layer_onMouseOver(event)
{
	if (_isMobile) return;
	_map.setMapCursor("pointer");
	var graphic = event.graphic;
	if (graphic == _selected) return;
	graphic.setSymbol(resizePictureMarkerSymbol(graphic.symbol, _lutIconSpecs["medium"]));
	if (!_isIE) moveGraphicToFront(graphic);	
	$("#hoverInfo").html(graphic.attributes.getValueCI(FIELDNAME_TITLE));
	var pt = _map.toScreen(graphic.geometry);
	hoverInfoPos(pt.x,pt.y);
}

function layer_onMouseOut(event)
{
	if (_isMobile) return;	
	_map.setMapCursor("default");
	var graphic = event.graphic;	
	if (graphic != _selected)
		graphic.setSymbol(resizePictureMarkerSymbol(graphic.symbol, _lutIconSpecs["tiny"]));
	$("#hoverInfo").hide();
}


/******************************************************
****************** other functions ********************
*******************************************************/

//neutral way of getting featureSet
function getFeatureSet(layer)
{
	return layer.url ? layer.featureCollection.featureSet : layer.featureCollection.layers[0].featureSet;
}

//neutral way of getting layer ID
function getID(layer)
{
	return layer.url ? layer.id : layer.featureCollection.layers[0].id;
}

function unselect() {
	preSelection();		
	_selected = null;
	postSelection();
}

function SortByNumber(a, b){
  var aNumber = a.attributes.getValueCI(FIELDNAME_NUMBER);
  var bNumber = b.attributes.getValueCI(FIELDNAME_NUMBER); 
  return ((aNumber < bNumber) ? -1 : ((aNumber > bNumber) ? 1 : 0));
}

function loadBookmarks() {
	
	$.each(_bookmarks,function(index,value){$("#bookmarksDiv").append("<p><a>"+value.name+"</a></p>")});
	
	$("#bookmarksDiv a").click(function(e) {
		var name = $(this).html();
		var extent = new esri.geometry.Extent($.grep(_bookmarks,function(n,i){return n.name == name})[0].extent);
		_map.setExtent(extent);	
		$("#bookmarksTogText").html(BOOKMARKS_ALIAS+' &#x25BC;');
		$("#bookmarksDiv").slideToggle();
    });

}

function activateLayer(layer) {
	preSelection();	
	_selected = null;
	postSelection();
	_layerCurrent = layer;

	var tab = $.grep($(".tab"), function(n,i){return $(n).text() == _layerCurrent.title})[0];
	$(".tab").removeClass("tab-selected");
	$(tab).addClass("tab-selected");

	$.each(_contentLayers,function(index,value){
		value.setVisibility(value == _layerCurrent);
	});

	$("#myList").empty();
	
	var display;
	var tile;
	var img;
	var footer;
	var num;
	var title;
	
	$.each(_layerCurrent.graphics,function(index,value){
		if (_map.extent.contains(value.geometry)) {
			display = "visible"
		} else {
			display = "none";
		}
		tile = $('<li id="item'+value.attributes.getValueCI(FIELDNAME_ID)+'" style="display:'+display+'">');
		img = $('<img src="'+value.attributes.getValueCI(FIELDNAME_IMAGEURL)+'">');
		footer = $('<div class="footer"></div>');
		num = $('<div class="num" style="background-color:'+_layerCurrent.color+'">'+value.attributes.getValueCI(FIELDNAME_NUMBER)+'</div>');
		title = $('<div class="blurb">'+value.attributes.getValueCI(FIELDNAME_TITLE)+'</div>');
		$(footer).append(num);
		$(footer).append(title);
		$(tile).append(img);
		$(tile).append(footer);
		$("#myList").append(tile);
	});
	
	// event handlers have to be re-assigned every time you load the list...
	$("ul.tilelist li").mouseover(tile_onMouseOver);
	$("ul.tilelist li").mouseout(tile_onMouseOut);
	$("ul.tilelist li").click(tile_onClick);	
	
	$("ul.tilelist").animate({ scrollTop: 0 }, { duration: 200 } );
	
}

function refreshList() {
	var tile;
	$.each(_layerCurrent.graphics,function(index,value){
		//find the corresponding tile
		tile = findTile(value.attributes.getValueCI(FIELDNAME_ID));
		if (_map.extent.contains(value.geometry)) {
			if ($(tile).css("display") == "none") $(tile).stop().fadeIn();
		} else {
			if ($(tile).css("display") != "none") $(tile).stop().fadeOut(1000);
		}		
	});
}

function buildLayer(arr,iconDir,root) {
	var layer = new esri.layers.GraphicsLayer();
	var pt;
	var sym;
	var spec = _lutIconSpecs["tiny"];
	$.each(arr,function(index,value){
		pt = new esri.geometry.Point(value.geometry.x,value.geometry.y,value.geometry.spatialReference);
		sym = createPictureMarkerSymbol("images/icons/"+iconDir+"/"+root+value.attributes.getValueCI(FIELDNAME_NUMBER)+".png", _lutIconSpecs["tiny"]);
		layer.add(new esri.Graphic(pt,sym,value.attributes));
	});
	return layer;
}

function getValueCI(field) {
	
	// this function provides a uniform method for reading an 
	// attribute property.  it performs two duties:
	
	// 1) case insensitive access
	
	var found;
	var value;
	$.each(this,function(index,value){
		if (index.toUpperCase() == field.toUpperCase()) {
			found = index;
			return false;
		}
	});
	value = this[found];
	
	// NOTE:  once we adopt ECMAScript 5, ALL of the above can
	// be accomplished with this one line:
	// var value = this[$.grep(Object.keys(this), function(n, i) {return n.toLowerCase() == field.toLowerCase()})[0]];
	
	// 2) treat any blank entries as null
	
	if ($.trim(value).length == 0) value = null;
	
	return value;
		
}

function handleWindowResize() {
	
	$("#mainWindow").height($("body").height() - ($("#header").height()));
	
	if (_bookmarks) {
		$("#tabs").width($("body").width() - $("#bookmarksCon").width());
	} else {
		$("#tabs").width($("body").width());
	}
	
	$("#paneLeft").height($("#mainWindow").height() - 35);
	$("#paneLeft").width($("body").width() <= 800 ? LEFT_PANE_WIDTH_TWO_COLUMN : LEFT_PANE_WIDTH_THREE_COLUMN);
	$(".tilelist").height($("#paneLeft").height() - 18);
	$(".tilelist").width($("#paneLeft").width()+7);		

	$("#map").css("left", $("#paneLeft").outerWidth());
	$("#map").height($("#mainWindow").height() - 35);
	$("#map").width($("#mainWindow").width() - $("#paneLeft").outerWidth());

	$("#headerText").css("max-width",$("#header").width() - ($("#logoArea").width()+100));

	if (_map) _map.resize();
	
	adjustPopup();

}

function preSelection() 
{
	// return the soon-to-be formerly selected graphic icon to normal
	// size & dim the corresponding tile.
	
	if (_selected) {
		_selected.setSymbol(resizePictureMarkerSymbol(_selected.symbol, _lutIconSpecs["tiny"]));
		var tile = findTile(_selected.attributes.getValueCI(FIELDNAME_ID));
		if ($(tile).attr("id") != $(this).attr("id")) $(tile).stop().animate({'background-color' : COLOR_DIM});
	}
		
}

function postSelection() {
	
	if (_selected == null) {
		_map.infoWindow.hide();
	} else {
		
		// make the selected location's icon LARGE
		_selected.setSymbol(resizePictureMarkerSymbol(_selected.symbol, _lutIconSpecs["large"]));
		
		// calling moveToFront directly after messing
		// with the symbol causes problems, so I
		// put it on a delay and put it in a try/catch
		// just to be safe...
		setTimeout(function(){
			try {
				_selected.getDojoShape().moveToFront();
			} catch (err) {
				console.log("problem with 'moveToFront()'...");
			}
		},10);				
		
		
		
		
		_map.infoWindow.setTitle(_selected.attributes.getValueCI(FIELDNAME_TITLE));
		_map.infoWindow.setContent(buildPopupContentHTML(_selected.attributes));
		_map.infoWindow.show(_selected.geometry);	
		$(".infoWindowLink").click(function(e) {
			showDetails(_selected);
		});		
		
		// light up the corresponding tile.

		var tile = findTile(_selected.attributes.getValueCI(FIELDNAME_ID));
		$(tile).stop().animate({'background-color' : COLOR_FULL});

	}

	$("#hoverInfo").hide();
	
}

function buildPopupContentHTML(atts)
{
	var contentDiv = $("<div></div");
	var shortDesc = atts.getValueCI(FIELDNAME_SHORTDESC);
	if (shortDesc) $(contentDiv).append($("<div></div>").html(shortDesc));
	var picture = atts.getValueCI(FIELDNAME_IMAGEURL);
	if (picture) {
		var pDiv = $("<div></div>").addClass("infoWindowPictureDiv");
		$(pDiv).append($(new Image()).attr("src", picture));
		$(contentDiv).append(pDiv);
	}
	if (!DETAILS_PANEL) {
		var desc1 = atts.getValueCI(FIELDNAME_DESC1);
		if (desc1) $(contentDiv).append($("<div></div>").html(desc1));
		
		var website = atts.getValueCI(FIELDNAME_WEBSITE);
		if (website) {
			website = website.toLowerCase();
			if (!(website.indexOf("http") >= 0)) {
				website = "http://"+website;
			}
			$(contentDiv).append($('<div class="address"><a href="'+website+'" target="_blank">Website</a></div>').css("padding-top", 10));
		}
		
	} else {
		$(contentDiv).append($("<div></div>").addClass("infoWindowLink").html("Details >>"));
	}
	return contentDiv.html();
}

function showDetails(graphic) {
	
	var mainDiv = $('<div class="details"></div>');
	var titleDiv = $('<div class="title">'+graphic.attributes.getValueCI(FIELDNAME_TITLE)+'</div>');
	var leftDiv = $('<div class="leftDiv"></div>');
	var rightDiv = $('<div class="rightDiv"></div>');
  
	var imageDiv = $('<img src="'+graphic.attributes.getValueCI(FIELDNAME_IMAGEURL)+'">');	
	var pictureFrame = $('<div class="pictureFrame"></div>');	
	$(pictureFrame).append(imageDiv);
	$(leftDiv).append(pictureFrame);
  
	var address = graphic.attributes.getValueCI(FIELDNAME_ADDRESS);
	if (address) {
		$(leftDiv).append($('<div class="address">'+address+'</div>')); 
	}

	var hours = graphic.attributes.getValueCI(FIELDNAME_HOURS);
	if (hours) {
		$(leftDiv).append($('<div class="address">'+hours+'</div>'));  
	}
  
	var website = graphic.attributes.getValueCI(FIELDNAME_WEBSITE);
	if (website) {
		website = website.toLowerCase();
		if (!(website.indexOf("http") >= 0)) {
			website = "http://"+website;
		}
		$(leftDiv).append('<div class="address"><a href="'+website+'" target="_blank">Website</a></div>');
	}
	
	var descFields = [FIELDNAME_DESC1, FIELDNAME_DESC2, FIELDNAME_DESC3, FIELDNAME_DESC4, FIELDNAME_DESC5];
	var value;
	$.each(descFields, function(index, field){
		value = graphic.attributes.getValueCI(field);
		if (value) {
			$(rightDiv).append('<div class="desc">'+value+'</div>');
			if ($(rightDiv).children().length > 0) $(rightDiv).append('<p>');
		}
	});

	$(mainDiv).append(titleDiv);
	$(mainDiv).append("<hr>"); 
	$(mainDiv).append(leftDiv);
	$(mainDiv).append(rightDiv);
  
	if ($(mainDiv).find(".desc").length > 0) {
		var lastDesc = $(mainDiv).find(".desc")[$(mainDiv).find(".desc").length - 1];
		$(lastDesc).css("margin-bottom","5px");
	}
  
	$.fn.colorbox({
		html:mainDiv,
		open:true,
		maxHeight:$(document).height() - 100,
		maxWidth:"575px",
		scrolling:false
	});
  	
}

function findTile(id)
{
	return $.grep($("ul.tilelist li"),function(n,i){return n.id == "item"+id})[0];	
}

function hoverInfoPos(x,y){
	if (x <= ($("#map").width())-230){
		$("#hoverInfo").css("left",x+15);
	}
	else{
		$("#hoverInfo").css("left",x-25-($("#hoverInfo").width()));
	}
	if (y >= ($("#hoverInfo").height())+50){
		$("#hoverInfo").css("top",y-35-($("#hoverInfo").height()));
	}
	else{
		$("#hoverInfo").css("top",y-15+($("#hoverInfo").height()));
	}
	$("#hoverInfo").show();
}

function adjustPopup() {
	
	if (_map) { 

		var box = dojo.contentBox(_map.container);        
		
		var width = 270, height = 300, // defaults
		newWidth = Math.round(box.w * 0.45),             
		newHeight = Math.round(box.h * 0.40);        
		
		if (newWidth < width) {
			width = newWidth;
		}
		
		if (newHeight < height) {
			height = newHeight;
		}
		
		_map.infoWindow.resize(width, height);
		
	}
	
}

function moveGraphicToFront(graphic)
{
	var dojoShape = graphic.getDojoShape();
	if (dojoShape) dojoShape.moveToFront();
}

function createPictureMarkerSymbol(url, spec)
{
	return new esri.symbol.PictureMarkerSymbol(
			url,
			spec.getWidth(),
			spec.getHeight()
		).setOffset(
			spec.getOffsetX(),
			spec.getOffsetY()
		);
}

function resizePictureMarkerSymbol(sym, spec)
{
	return sym.setHeight(spec.getHeight()).setWidth(spec.getWidth()).setOffset(spec.getOffsetX(),spec.getOffsetY());
}

