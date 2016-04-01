dojo.require("esri.arcgis.utils",  "esri.layers.graphics", "esri.layers.FeatureLayer");
dojo.require("esri.config", "esri.tasks.geometry");

var COLOR_SCHEMES = [
	{name:"blue",iconDir:"blue",iconPrefix:"NumberIconb",color:"#177ff1"},
	{name:"red",iconDir:"red",iconPrefix:"NumberIconr",color:"#fd2d29"},
	{name:"green",iconDir:"green",iconPrefix:"NumberIcong",color:"#22880d"},
	{name:"purple",iconDir:"purple",iconPrefix:"NumberIconp",color:"#9c46fd"},
	{name:"black",iconDir:"black",iconPrefix:"NumberIconK",color:"#000000"}
];

var COLOR_DIM = "#E7E7E7";
var COLOR_FULL = "#FFFFFF";

var LEFT_PANE_WIDTH_TWO_COLUMN = 327;
var LEFT_PANE_WIDTH_THREE_COLUMN = 485;

var TWO_COLUMN_THRESHOLD = 960;

var FIELDNAME_NUMBER = ["Number"];
var FIELDNAME_TITLE = ["Title"];
var FIELDNAME_SHORTDESC = ["Short_desc"];
var FIELDNAME_IMAGEURL = ["Image_URL"];
var FIELDNAME_ADDRESS = ["Address"];
var FIELDNAME_HOURS = ["Hours"];
var FIELDNAME_WEBSITE = ["Website"];
var FIELDNAME_DESC1 = ["Desc1"];
var FIELDNAME_DESC2 = ["Desc2"];
var FIELDNAME_DESC3 = ["Desc3"];
var FIELDNAME_DESC4 = ["Desc4"];
var FIELDNAME_DESC5 = ["Desc5"];
var FIELDNAME_ID = ["Shortlist_ID"];
var FIELDNAME_TAB = ["Tab_Name"];

var _lutIconSpecs = {
	tiny:new IconSpecs(22,28,3,8),
	medium:new IconSpecs(24,30,3,8),
	large:new IconSpecs(32,40,3,11)
};

var _contentLayers = [];
var _newLayersAdded = false;
var _newAliasAssigned = false;

var _isMobile = isMobile();
var _isIE = (navigator.appVersion.indexOf("MSIE") > -1) || (navigator.userAgent.match(/Trident.*rv\:11\./));
var _filterMouseHoverEvent = false;
var _isIE8 = false;

if(_isIE) {
	_isIE8 = parseInt(navigator.userAgent.toLowerCase().split('msie')[1])<9;
}

var _map;

var _layout = null;

var _bookmarks;

var _layerCurrent;

var _selected;

var _initExtent;

var _locateLayer;
var _locateSymobol;

var _mobileThemeSwiper;
var _mobileFeatureSwiper;
var _firstLoad = true;

var _dojoReady = false;
var _jqueryReady = false;

var _featureService = false;
var _pointsInOneLayer = null;
var _newThemes = [];

var _geomServiceUrl = null;

var _tileClick = true;

/******************************************************
************************* init ************************
*******************************************************/

dojo.addOnLoad(function() {_dojoReady = true;init();});
jQuery(document).ready(function() {_jqueryReady = true;init();});

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

	if (queryString["webmap"] && AUTHORIZED_OWNERS.length === 0) {
		initError("Map owner not authorized.");
		return;
	}
	WEBMAP_ID = queryString["webmap"] ? queryString["webmap"] : WEBMAP_ID;
	BOOKMARKS_ALIAS = queryString["bookmarks_alias"] ? queryString["bookmarks_alias"] : BOOKMARKS_ALIAS;
	COLOR_ORDER = queryString["color_order"] ? queryString["color_order"] : COLOR_ORDER;
	var tempTabOrder = queryString["tab_order"] ? queryString["tab_order"] : TAB_ORDER;
	TAB_ORDER = [];
	$.each(tempTabOrder, function(index, tab){
		TAB_ORDER.push(tab.toLowerCase());
	});
	DETAILS_PANEL = queryString["details_panel"] ? $.trim((queryString["details_panel"])).toLowerCase() == "true" : DETAILS_PANEL;
	POINT_LAYERS_NOT_TO_BE_SHOWN_AS_TABS = queryString["point_layers_not_to_be_shown_as_tabs"] ?
											queryString["point_layers_not_to_be_shown_as_tabs"] :
											POINT_LAYERS_NOT_TO_BE_SHOWN_AS_TABS;
	SUPPORTING_LAYERS_THAT_ARE_CLICKABLE = queryString["supporting_layers_that_are_clickable"] ?
											queryString["supporting_layers_that_are_clickable"] :
											SUPPORTING_LAYERS_THAT_ARE_CLICKABLE;
	GEOLOCATOR = queryString["geolocator"] ? queryString["geolocator"] : GEOLOCATOR;

	_geomServiceUrl = new esri.tasks.GeometryService('http://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer');
	esriConfig.defaults.geometryService = _geomServiceUrl;

	$("#bookmarksTogText").html(BOOKMARKS_ALIAS+' &#x25BC;');

	handleWindowResize();
	$(this).resize(handleWindowResize);

	$("#zoomIn").click(function(e) {
        _map.setLevel(_map.getLevel()+1);
		hideBookmarks();
    });
	$("#zoomOut").click(function(e) {
        _map.setLevel(_map.getLevel()-1);
		hideBookmarks();
    });
	$("#zoomExtent").click(function(e) {
        _map.setExtent(_initExtent);
		hideBookmarks();
    });

	$(document).bind('cbox_complete', function(){
		$(".details .rightDiv").height($(".details").height() - $(".detailsTitle").height() - 50);
	});

	$('.noFeatureText').html('None of these places are in your current map extent.  Zoom out to see places.');

	$("#bookmarksToggle").click(function(){
		if ($("#bookmarksDiv").css('display')=='none'){
		  $("#bookmarksTogText").html(BOOKMARKS_ALIAS+' &#x25B2;');
		}
		else{
		  $("#bookmarksTogText").html(BOOKMARKS_ALIAS+' &#x25BC;');
		}
		$("#bookmarksDiv").slideToggle();
	});
	$("#mobileBookmarksTogText").html(BOOKMARKS_ALIAS+' &#x25BC;');
	$("#mobileBookmarksToggle").click(function(){
		if ($("#mobileBookmarksDiv").css('display')=='none'){
		  $("#mobileBookmarksTogText").html(BOOKMARKS_ALIAS+' &#x25B2;');
		}
		else{
		  $("#mobileBookmarksTogText").html(BOOKMARKS_ALIAS+' &#x25BC;');
		}
		$("#mobileBookmarksDiv").slideToggle();
	});

	if (DEFAULT_SHARING_URL)
		esri.arcgis.utils.arcgisUrl = DEFAULT_SHARING_URL;

	if (DEFAULT_PROXY_URL)
		esri.config.defaults.io.proxyUrl = DEFAULT_PROXY_URL;

	var mapDeferred = esri.arcgis.utils.createMap(WEBMAP_ID, "map", {
		mapOptions: {
			slider: false,
			wrapAround180:false
		},
		ignorePopups: true
	});

	mapDeferred.addCallback(function(response) {
		if( AUTHORIZED_OWNERS && AUTHORIZED_OWNERS.length > 0 && AUTHORIZED_OWNERS[0] ) {
			var owner = response.itemInfo.item.owner,
				ownerFound = false;
			if( owner )
				ownerFound = $.inArray(owner, AUTHORIZED_OWNERS) != -1;

			if ( ! ownerFound ) {
				initError("Map owner not authorized.");
				return;
			}
		}

		var title = response.itemInfo.item.title;
		var subtitle = response.itemInfo.item.snippet;

		var overRideError = false;

		if(subtitle){
			$('#subtitle').attr('tabIndex', '0');
		}

		document.title = title;
		$("#title").html(title);
		$("#subtitle").html(subtitle);

		$('#mobileTitlePage').append('<div class="mobileTitle">'+title+"</div>");
		$('#mobileTitlePage').append('<div class="mobileSnippet"></div>');
		if(subtitle)
			$('.mobileSnippet').html(subtitle);

		window._response = response;
		_map = response.map;

		if(SUPPORTING_LAYERS_THAT_ARE_CLICKABLE){
			$.each(_map.graphicsLayerIds, function(i,lid){
				var match =  $.grep(_response.itemInfo.itemData.operationalLayers, function(v){
					return v.id==lid.split('_')[0]; });
				if(match && match.length){
					if(match[0].title.toLowerCase() == SUPPORTING_LAYERS_THAT_ARE_CLICKABLE.toLowerCase()){
						SUPPORTING_LAYERS_THAT_ARE_CLICKABLE = _map.getLayer(lid).name;
						return false;
					}
				}
			});
		}

		dojo.connect(_map, 'onExtentChange', function(){
			setTimeout(function(){
				refreshList();
			}, 0);
		});

		// click action on the map where there's no graphic
		// causes a deselect.

		dojo.connect(_map, 'onClick', function(event){
			_tileClick = true;
			if (event.graphic == null && $('#header').css('display') == 'block') {
				unselect();
			}
			$('#mobileTitlePage').css('display', 'none');
			hideBookmarks();
		});

		dojo.connect(_map, 'onZoomEnd', function(){
			var level = _map.getLevel();
			if (level > -1 && level === _map.getMaxZoom()) {
				$('#zoomIn').addClass('disableControls');
			}
			else
				if (level > -1 && level === _map.getMinZoom()) {
					$('#zoomOut').addClass('disableControls');
				}
				else {
					$('#zoomIn').removeClass('disableControls');
					$('#zoomOut').removeClass('disableControls');
				}
		});

		_bookmarks = response.itemInfo.itemData.bookmarks;
		if (_bookmarks) {
			loadBookmarks();
			$("#bookmarksCon").show();
			$("#mobileBookmarksCon").show();
			handleWindowResize(); // additional call to re-size tab bar
		}
		var layers = [];
		$.each(_map.graphicsLayerIds, function(i, id){
			layers.push(_map.getLayer(id));
		});
		var newLayers = [];
		var featServUrl = [];
		var featServLayerIndex = [];

		var featServLayerID = null;
		var layerType;

		$.each(layers, function(index, layer){
			if(layer.layerType){
				layerType = layer.layerType;
			}else{
				layerType = layer.type;
			}
			if (layer.url && (layerType === 'ArcGISFeatureLayer' || layerType === 'Feature Layer') && !layer.id.match(/^csv_/)) {
				_featureService = true;
				featServLayerID = layer;
				featServUrl.push(layer.url);
				featServLayerIndex.push(index);
			}

			if(layer.graphics && layer.geometryType === 'esriGeometryPoint'){
				if(layer.graphics.length < 1){
					dojo.connect(layer, 'onUpdateEnd', function(){
						buildLayers(layer, featServLayerIndex);
					});
				}else{
					buildLayers(layer, featServLayerIndex);
				}
			}
		});

		function buildLayers(layer, featServLayerIndex){
			var atts = layer.graphics[0].attributes;
			atts.getValueCI = getValueCI;
			if(atts.getValueCI(FIELDNAME_TAB)){
				if(!_pointsInOneLayer)
					_pointsInOneLayer = layer;
				else
					return;

				var fields = layer.fields;
				var themes = [];
				$.each(layer.graphics, function(index, graphic){
					var featAtts = graphic.attributes;
					featAtts.getValueCI = getValueCI;
					if(themes.indexOf(featAtts.getValueCI(FIELDNAME_TAB)) < 0) {
						themes.push(featAtts.getValueCI(FIELDNAME_TAB));
						var newObject = {id: featAtts.getValueCI(FIELDNAME_TAB), features: []};
						_newThemes.push(newObject);
					}

					$.grep(_newThemes, function(theme, index){
						if(theme.id === featAtts.getValueCI(FIELDNAME_TAB)){
							theme.features.push(graphic);
						}
					});

				});

				if(!_newLayersAdded){
					$.each(_newThemes, function(index, theme){
						var featServiceFeatureSet = new esri.tasks.FeatureSet();
						featServiceFeatureSet.features = theme.features;
						//create a feature collection
				        var featureCollection = {
				          "layers":[{
				          		"id": String(theme.id),
								"layerDefinition": null,
								"featureSet": featServiceFeatureSet
					       }]
				        };

			        	featServiceFeatureSet.geometryType = "esriGeometryPoint";
			        	featureCollection.layers[0].layerDefinition = createLayerDefinition(fields);

						var newLayer = new esri.layers.GraphicsLayer({id: String(theme.id)});
						newLayer.title = String(theme.id);
						newLayer.featureCollection = featureCollection;
						newLayers.push(newLayer);
					});
				}
				_newLayersAdded = true;
				var newTabsAlias = [];
				if(TAB_NAMES){
					$.each(TAB_NAMES, function(i, tab){
						for(var key in tab){
							newTabsAlias.push(tab[key]);
						}
					});
				};
				var tabOrder = [];
				if(TAB_ORDER.length){
					$.each(newLayers, function(i, layer){
						var layerIdLC = layer.id.toLowerCase();
						if(TAB_NAMES){
							layer.alias = newTabsAlias[TAB_ORDER.indexOf(layerIdLC)];
							if(TAB_ORDER.indexOf(layerIdLC) != -1){
								tabOrder[TAB_ORDER.indexOf(layerIdLC)] = layer;
							}else{
								overRideError = true;
							}
						}else{
							if(TAB_ORDER.indexOf(layerIdLC) != -1){
								tabOrder[TAB_ORDER.indexOf(layerIdLC)] = layer;
							}else{
								overRideError = true;
							}
						}
					});

					$.each(tabOrder, function(i, tab){
						layers.push(tab);
						_map.addLayer(tab);
					});
					_newAliasAssigned = true;

				}else{
					$.each(newLayers, function(i,layer){
						layers.push(layer);
						_map.addLayer(layer);
					});
				}
			}
		}

		var featServRequests = 0;

		if(_featureService){

			var fields = [];
			var features = [];
			var featServiceFeatureSet = new esri.tasks.FeatureSet();
			var oldLayers = [];
			var requestIndex = -1;
			var requests = [];

			function qCallback(graphics){
				var atts = graphics.features[0].attributes;
					atts.getValueCI = getValueCI;
					var featureCollection;

					if(!atts.getValueCI(FIELDNAME_TAB)){
						$.each(graphics.features, function(i, feature){
							features.push(feature);
						});
						$.each(graphics.fields, function(i, field){
							fields.push(field);
						});
						featServiceFeatureSet.features = features;
						//create a feature collection
				        featureCollection = {
				          "layerDefinition": null,
				          "featureSet": featServiceFeatureSet
				        };
				        if(graphics.geometryType === "esriGeometryPoint"){
				        	featServiceFeatureSet.geometryType = "esriGeometryPoint";
					      	featureCollection.layerDefinition = createLayerDefinition(fields);

					    }
					    else if(graphics.geometryType === "esriGeometryPolyline"){
					    	featServiceFeatureSet.geometryType = "esriGeometryPolyline";
					        featureCollection.layerDefinition = {
					          "geometryType": "esriGeometryPolyLine",
					          "drawingInfo": {
					            "renderer": {
									"type": "esriSLS",
									"style": "esriSLSDot",
									"color": [115,76,0,255],
									"width": 1
					              }
					          },
					          "fields": fields
					        };
					    }
					}
					else{
						if(!_pointsInOneLayer){
							_pointsInOneLayer = true;
							var themes = [];
							$.each(graphics.features, function(i, feature){
								var featAtts = feature.attributes;
								featAtts.getValueCI = getValueCI;
								if(themes.indexOf(featAtts.getValueCI(FIELDNAME_TAB)) < 0) {
									themes.push(featAtts.getValueCI(FIELDNAME_TAB));
									var newObject = {id: featAtts.getValueCI(FIELDNAME_TAB), features: []};
									_newThemes.push(newObject);
								}

								$.grep(_newThemes, function(theme, i){
									if(theme.id === featAtts.getValueCI(FIELDNAME_TAB))
									theme.features.push(feature);
								});

							});
							$.each(graphics.features[0].attributes, function(i, field){
								fields.push(field);
							});

							$.each(_newThemes, function(i, theme){
								var featServiceFeatureSet = new esri.tasks.FeatureSet();
								featServiceFeatureSet.features = theme.features;
								//create a feature collection
						        featureCollection = {
						          "layers":[{
						          		"id": String(theme.id),
										"layerDefinition": null,
										"featureSet": featServiceFeatureSet
							       }]
						        };

					        	featServiceFeatureSet.geometryType = "esriGeometryPoint";
					        	createLayerDefinition(fields);
					        	featureCollection.layers[0].layerDefinition = createLayerDefinition(fields);

								var newLayer = new esri.layers.GraphicsLayer({id: String(theme.id)});
								newLayer.title = String(theme.id);
								newLayer.featureCollection = featureCollection;
								newLayers.push(newLayer);
							});
						}
					}
					//Add feature collection to the appropriate layer
					if(!_pointsInOneLayer)
						layers[featServLayerIndex[requestIndex]].featureCollection = featureCollection;
			}
			function qErrback(error){
				console.log("feature layer query error: ", error);
			}

			$.each(layers, function(index, layer){
				if(layer.url && (layer.type == "Feature Layer" || layer.layerType == "ArcGISFeatureLayer") && layer.geometryType == 'esriGeometryPoint'){
					var query = new esri.tasks.Query();
					query.outFields = ['*'];
					query.where = "1=1";
					requestIndex++;
					requests.push(layer.queryFeatures(query, qCallback, qErrback));
				}
			});

			var list = new dojo.DeferredList(requests);
			list.then(function(results){
				if (_map.loaded ) {
					organizeLayers(results);
				}
			});

        };

        function organizeLayers(results) {
        	if(_pointsInOneLayer){
				var newTabsAlias = [];
				if(TAB_NAMES){
					$.each(TAB_NAMES, function(i, tab){
						for(var key in tab){
							newTabsAlias.push(tab[key]);
						}
					});
				}
				var tabOrder = [];
				if(TAB_ORDER.length){
					$.each(newLayers, function(i, layer){
						var layerIdLC = layer.id.toLowerCase();
						if(TAB_NAMES){
							layer.alias = newTabsAlias[TAB_ORDER.indexOf(layerIdLC)];
							if(TAB_ORDER.indexOf(layerIdLC) != -1){
								tabOrder[TAB_ORDER.indexOf(layerIdLC)] = layer;
							}else{
								overRideError = true;
							}
						}else{
							if(TAB_ORDER.indexOf(layerIdLC) != -1){
								tabOrder[TAB_ORDER.indexOf(layerIdLC)] = layer;
							}else{
								overRideError = true;
							}
						}
					});
					$.each(tabOrder, function(i, tab){
						if(!_newAliasAssigned){
							layers.push(tab);
							_map.addLayer(tab);
						}
					});
				}else{
					if(!_newLayersAdded){
						$.each(newLayers, function(i,layer){
							layers.push(layer);
							_map.addLayer(layer);
						});
					}
					_newLayersAdded = true;
				}
				$.each(results, function(i, result){
					var index = layers.indexOf(result[1].features[0]._layer);
					if(index > -1 ){
						layers.splice(index, 1);
					}
					_map.removeLayer(_map.getLayer(result[1].features[0]._layer.id));
				});
			}
			initMap(layers);
		}

		if(overRideError){
			var errorTitle = 'Invalid layer name in configuration override.';
			var errorMessage = 'Please check the TAB_ORDER configuration to ensure the layer names match the layer field names.';
			initError(errorTitle, errorMessage);
			return false;
		}
		if(_map.loaded && !_featureService){
			initMap(layers);
		} else if(!_featureService){
			dojo.connect(_map,"onLoad",function(){
				initMap(layers);
			});
		}
	});

	mapDeferred.addErrback(function(error) {
		var errorTitle = "Map creation failed";
		initError(errorTitle, error.message);
		return false;
	});

	dojo.connect(dojo.byId('returnIcon'), 'onclick', showMobileList);

	dojo.connect(dojo.byId('returnHiddenBar'), 'onclick', showMobileList);

	dojo.connect(dojo.byId('centerMapIconContainer'), 'onclick', centerMapOnFeature);

	dojo.connect(dojo.byId('locateButton'), 'onclick', getDeviceLocation);

	$(document).on("click", function(src) {
		if(src.target.id != 'bitlyIcon' && src.target.id != 'bitlyContent' && src.target.id != 'bitlyInput' ){
			 $(".popover").hide();
		}
	});

	$('#navThemeRight').on('click', function(){
		_mobileThemeSwiper.swipeNext();
	});
	$('#navThemeLeft').on('click', function(){
		_mobileThemeSwiper.swipePrev();
	});
	$('#mobileThemeBar').on('click', function(){
		hideBookmarks();
	});

	_mobileThemeSwiper = new Swiper('#mobileThemeBar .swiper-container',{
		mode:'horizontal',
		onSlideChangeEnd : function(){
			activateLayer(_contentLayers[_mobileThemeSwiper.activeLoopIndex]);
		}
	});

	_mobileFeatureSwiper = new Swiper('#mobileFeature .swiper-container',{
		mode:'horizontal',
		keyboardControl: true,
		onSlideNext: function(){
			swipeFeature();
		},
		onSlidePrev: function(){
			swipeFeature();
		},
		onSlideReset: function(evt){
			if ((_mobileFeatureSwiper.previousIndex == 0 || _mobileFeatureSwiper.previousIndex == -0) && evt.touches.diff > 0) {
				loopFeatureSlides('left');
			}
			if ((_mobileFeatureSwiper.previousIndex == (_mobileFeatureSwiper.slides.length - 1)) && (evt.touches.diff < 0)) {
				loopFeatureSlides('right');
			}
		}
	});
	if(GEOLOCATOR == 'true' || GEOLOCATOR == true)
		$('#locateButton').css('display', 'block');

}

function initMap(layers) {
	_map.resize();
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

	var graphicTitle;

	$.each(layers, function(index,value){
		if(!value.visibleAtMapScale && value.type == "Feature Layer" && value.url)
			return;
		if(value.id === 'labels'){
			setTimeout(function(){
				if(value.featureLayers[0].graphics[0].attributes.getValueCI && value.featureLayers[0].graphics[0].attributes.getValueCI(FIELDNAME_TAB))
					_map.removeLayer(_map.getLayer(value.id));
				else
					return;
			}, 950);
		}
		var graphicAtts;
		var geomType;

		if(value.graphics.length > 0){
			graphicAtts = value.graphics[0].attributes;
			graphicTitle = value.name;
			geomType = value.geometryType;
		}else{
			if(value.visible && value.featureCollection){
				graphicAtts = getFeatureSet(value).features[0].attributes;
				graphicTitle = String(value.title);
				geomType = value.featureCollection.layers[0].featureSet.geometryType;
			}else{
				return;
			}
		}

		$.grep(_map.graphicsLayerIds, function(n,i){
			if(_map.getLayer(n) && _map.getLayer(n).id){
				if(_map.getLayer(n).id == getID(value)){
					var mapLayerId = null;
					if(_map.getLayer(n).id.split('_').length > 2){
						mapLayerId = _map.getLayer(n).id.split('_').slice(0,-1).join('_');
					}
					else if(_map.getLayer(n).id.split('_').length == 2 && _map.getLayer(n).id.indexOf('csv') == -1){
						mapLayerId = _map.getLayer(n).id.split('_').slice(0,-1)[0];
					} else {
						mapLayerId = _map.getLayer(n).id;
					}
					var match =  $.grep(_response.itemInfo.itemData.operationalLayers, function(v){
						return v.id==mapLayerId;
					});
					if(match && match.length) {
						graphicTitle = match[0].title;
					}
				}
			}else{
				return;
			}
		});

		if(!graphicAtts)
			return;
		if (value.id.indexOf('mapNotes') == -1 && (value.url == null || value.type == "CSV" || value.type == "Feature Layer" || value.layerType == "ArcGISFeatureLayer")) {
			if(!value.graphics){
				_map.removeLayer(_map.getLayer(value.id));
				return;
			}
			else if (
				geomType == "esriGeometryPoint" &&
				$.inArray(graphicTitle.toLowerCase(), arrExemptions) == -1
				) {
					if($.inArray("Name", FIELDNAME_TITLE) == -1 && graphicAtts.NAME || graphicAtts.Name || graphicAtts.name)
						FIELDNAME_TITLE.push("Name");
					if($.inArray("PIC_URL", FIELDNAME_IMAGEURL) == -1 && graphicAtts.PIC_URL || graphicAtts.Pic_URL || graphicAtts.Pic_Url || graphicAtts.pic_url)
						FIELDNAME_IMAGEURL.push("PIC_URL");
					if($.inArray("THUMB_URL", FIELDNAME_IMAGEURL) == -1 && graphicAtts.THUMB_URL || graphicAtts.Thumb_URL ||graphicAtts.Thumb_Url || graphicAtts.thumb_url)
						FIELDNAME_IMAGEURL.push("THUMB_URL");
					if($.inArray("PICTURE", FIELDNAME_IMAGEURL) == -1 && graphicAtts.PICTURE || graphicAtts.Picture || graphicAtts.picture)
						FIELDNAME_IMAGEURL.push("PICTURE");
					if($.inArray("DESCRIPTION", FIELDNAME_DESC1) == -1 && graphicAtts.DESCRIPTION || graphicAtts.Description || graphicAtts.description)
						FIELDNAME_DESC1.push("Description");
					if($.inArray("Caption", FIELDNAME_DESC1) == -1 && graphicAtts.CAPTION || graphicAtts.Caption || graphicAtts.caption)
						FIELDNAME_DESC1.push("Caption");
					pointLayers.push(value);
			} else {
				if($.inArray("Name", FIELDNAME_TITLE) == -1 && graphicAtts.NAME || graphicAtts.Name || graphicAtts.name)
					FIELDNAME_TITLE.push("Name");
				if($.inArray("PIC_URL", FIELDNAME_IMAGEURL) == -1 && graphicAtts.PIC_URL || graphicAtts.Pic_URL ||graphicAtts.Pic_Url || graphicAtts.pic_url)
					FIELDNAME_IMAGEURL.push("PIC_URL");
				if($.inArray("THUMB_URL", FIELDNAME_IMAGEURL) == -1 && graphicAtts.THUMB_URL || graphicAtts.Thumb_URL || graphicAtts.Thumb_Url || graphicAtts.thumb_url)
					FIELDNAME_IMAGEURL.push("THUMB_URL");
				if($.inArray("PICTURE", FIELDNAME_IMAGEURL) == -1 && graphicAtts.PICTURE || graphicAtts.Picture || graphicAtts.picture)
					FIELDNAME_IMAGEURL.push("PICTURE");
				if($.inArray("DESCRIPTION", FIELDNAME_DESC1) == -1 && graphicAtts.DESCRIPTION || graphicAtts.Description || graphicAtts.description)
					FIELDNAME_DESC1.push("Description");
				if($.inArray("Caption", FIELDNAME_DESC1) == -1 && graphicAtts.CAPTION || graphicAtts.Caption || graphicAtts.caption)
					FIELDNAME_DESC1.push("Caption");
				supportLayers.push(value);
			}
		}
		else {
			// if the layer has an url property (meaning that it comes from a service), just
			// keep going...it will remain in the map, but won't be query-able.
		}
	});

	_initExtent = _map.extent;

	_locateSymbol = new esri.symbol.PictureMarkerSymbol('resources/images/mapcommand-location-marker.png', 21, 21);
	_locateLayer = new esri.layers.GraphicsLayer({id: 'locateLayer'});
	_map.addLayer(_locateLayer);

	var supportLayer;
	$.each(supportLayers,function(index,value) {
		supportLayer = _map.getLayer($.grep(_map.graphicsLayerIds, function(n,i){return _map.getLayer(n).id == getID(value);})[0]);
		if (supportLayer == null) return;
		$.each(supportLayer.graphics,function(index,value) {
			// assign extra method to handle case sensitivity
			value.attributes.getValueCI = getValueCI;
		});

		var supportLayerName = supportLayer.name;

		if ($.inArray(supportLayer.name.toLowerCase(), supportingLayersThatAreClickable) > -1) {
			dojo.connect(supportLayer, "onMouseOver", baselayer_onMouseOver);
			dojo.connect(supportLayer, "onMouseOut", baselayer_onMouseOut);
			dojo.connect(supportLayer, "onClick", baselayer_onClick);
		} else {
			dojo.connect(supportLayer, "onClick", function(){unselect();});
		}
	});

	var contentLayer;
	var colorScheme;
	var colorOrder = COLOR_ORDER.split(",");
	var colorIndex;
	var newLayers = [];

	$.each(pointLayers,function(index,value) {
		var title = value.alias || value.title || value.name;

		$.grep(_map.graphicsLayerIds, function(n,i){
			if(_map.getLayer(n) && _map.getLayer(n).id){
				if(_map.getLayer(n).id == getID(value)){
					_map.getLayer(n).setVisibility(false);
					var mapLayerId = null;
					if(_map.getLayer(n).id.split('_').length > 2){
						mapLayerId = _map.getLayer(n).id.split('_').slice(0,-1).join('_');
					}
					else if(_map.getLayer(n).id.split('_').length == 2 && _map.getLayer(n).id.indexOf('csv') == -1){
						mapLayerId = _map.getLayer(n).id.split('_').slice(0,-1)[0];
					} else {
						mapLayerId = _map.getLayer(n).id;
					}
					var match =  $.grep(_response.itemInfo.itemData.operationalLayers, function(v){
						return v.id==mapLayerId;
					});
					if(match && match.length) {
						title = match[0].title;
					}
				}
			}else{
				return;
			}
		});

		var layerId;
		if(value.graphics.length > 0){
			layerId = value.name;
		}else{
			layerId = value.id;
		}
		if(_pointsInOneLayer){
				$.each(_newThemes, function(index, theme){
					if(layerId === String(theme.id)){
						newLayers.push(value);
						return false;
					}
				});
				var index = newLayers.indexOf(value);
				if(index < 0 )
					return true;
		}

		var features;
		if(value.graphics.length > 0){
			features = value.graphics;
		}else{
			features = getFeatureSet(value).features;
		}

		$.each(features, function(index,value) {
			value.attributes.getValueCI = getValueCI; // assign extra method to handle case sensitivity
			value.attributes[FIELDNAME_ID] = index + 1; // assign internal shortlist id
			if(index === 0){
				if(!value.attributes[FIELDNAME_NUMBER] && !value.attributes.NUMBER && !value.attributes.number)
					FIELDNAME_NUMBER = FIELDNAME_ID;
			}
		});
		/* color index assignment is a weird bit of voodoo.  first thing to consider
		   is that layers names actually appear in tabs in reverse order (i.e. last layer in
		   is leftmost tab).  this means that we have to invert the color index for things to match
		   right.  also, using modulus to handle overflow -- when there are more layers
		   than colors.  so, we end up re-using colors but keeping the sequence. */
		if(_pointsInOneLayer)
			colorIndex = (index ) % colorOrder.length;
		else
			colorIndex = (pointLayers.length - index - 1) % colorOrder.length;

		colorScheme = $.grep(COLOR_SCHEMES, function(n,i){
			return n.name.toLowerCase() == $.trim(colorOrder[colorIndex].toLowerCase());
		})[0];
		contentLayer = buildLayer(
					features.sort(SortByNumber),
					colorScheme.iconDir,
					colorScheme.iconPrefix
					);
		contentLayer.color = colorScheme.color;
		contentLayer.title = title;

		//contentLayer.title = value.alias || value.title || value.name;
		dojo.connect(contentLayer, "onMouseOver", layer_onMouseOver);
		dojo.connect(contentLayer, "onMouseOut", layer_onMouseOut);
		dojo.connect(contentLayer, "onClick", layer_onClick);

		_map.addLayer(contentLayer);
		_contentLayers.push(contentLayer);
	});

	if(!_pointsInOneLayer)
		_contentLayers.reverse();

	if (_contentLayers.length > 1) {
	 	$('#mobileTitlePage').append('<ul id="mobileThemeList" style=" height: 80px; line-height: 80px;" class="mobileTileList introList">');
		$.each(_contentLayers, function(index, value){
			$("#tabs").append('<div class="tab" tabindex="0" onclick="activateLayer(_contentLayers[' + index + ']), hideBookmarks()">' + value.title + '</div>', true);
			var newSlide = _mobileThemeSwiper.createSlide('<p>' + value.title + '</p>');
			newSlide.append();
			var introList = $('<li class="mobileTitleThemes" onclick="selectMobileTheme(' + index + ')">').append('<span style="margin-left: 30px; margin-right: 30px; vertical-align: middle; line-height: 20px; display: inline-block;">' + value.title + '</span>');
			if(index == 0)
				$(introList).css('border-width', '2px 0px 1px 0px');
			if(index == (_contentLayers.length - 1))
				$(introList).css('border-width', '1px 0px 2px 0px');
			$('#mobileThemeList').append(introList);

		});
	}
	else if(_contentLayers.length < 1) {
		var errorMsg = "NO VALID SHORTLIST POINT LAYERS";
		initError(null, errorMsg);
		return false;
	}
	else {
		$(".tab").css("display", "none");
		$('#mobileThemeBar .swiper-container').css('display', 'none');
		$('#mobileTitlePage').append("<br><hr></hr>");
		$('#mobileTitlePage').append('<ul id="mobileThemeList" class="mobileTileList">');
		var introList = $('<li class="mobileTitleTheme" onclick="selectMobileTheme(' + 0 + ')">').append('<div class="startButton"> Start </div>');
		$('#mobileThemeList').append(introList);
	}

	if(!_layout == 'normal'){
		_mobileThemeSwiper.enableKeyboardControl();
	}

	activateLayer(_contentLayers[0], false);
	dojo.connect(_map.infoWindow,"onHide",infoWindow_onHide);
	dojo.connect($(".esriPopup .titleButton.close")[0],"onclick",function(){
		_lastFocus = null;
	});
	$("#paneLeft").height($("#mainWindow").height() - $('#tabs').height());
	$("#zoomToggle").css("visibility","visible");
	$("#whiteOut").fadeOut("slow");

	$(".share_facebook").click(shareFacebook);
	$(".share_twitter").click(shareTwitter);
	$(".share_bitly").click(requestBitly);
	$("#map").height($("#mainWindow").height() - $('#divStrip').height());
	$("#map").css('top',$('#divStrip').height());
	$(".tilelist").height($("#paneLeft").height() - 18);

/******************************************************
 ****************** 508 *******************************
 ******************************************************/

	// Prevent focus on mousedown
	// Focus stay allowed with keyboard with 508
	$("body").on("mousedown", "*", function(e) {
		_lastFocus = null;

		if (($(this).is(":focus") || $(this).is(e.target)) && $(this).css("outline-style") == "none") {
			$(this).css("outline", "none").on("blur", function() {
				$(this).off("blur").css("outline", "");
			});

			// Prevent outline over bookmarks button - Unsure why needed
			if ($(this).parents("#bookmarksToggle").length) {
				$(this).parents("#bookmarksToggle").css("outline", "none").on("blur", function() {
					$(this).off("blur").css("outline", "");
				});
			}
			if ($(this).parents("#tabs").length) {
				$(this).parents("#tabs").css("outline", "none").on("blur", function() {
					$(this).off("blur").css("outline", "");
				});
			}
		}
	});

	_map.disableKeyboardNavigation();

	//Use enter/return key on focused element to trigger click event
    //Use +/- keys to zoom in/out of map
    $('body').keypress(function(e){
        if(e.which == 13){ //enter/return
            $(document.activeElement).click();
        }
        if(e.which == 43) { //'+'
            _map.setLevel(_map.getLevel()+1);
            $("#zoomIn").focus();
            hideBookmarks();
        }
        if(e.which == 45) { //'-'
            _map.setLevel(_map.getLevel()-1);
            $("#zoomOut").focus();
            hideBookmarks();
        }
    });

	$('#subtitle').keydown(function(e){
		if(e.which == '9'){
			$('.tab')[0].click();
		}
	});

    $('#myList').keydown(function(e){
        if (e.which == 27) {
			leaveTileGroup();
        }
    });

    $('#tabs .tab').keypress(function(e){
        if (e.which == 13 ) {
			var tabIndex = $("#tabs .tab").index(this);
			var layer = _contentLayers[tabIndex];
			enterTileGroup(layer);
			e.stopPropagation();
		}
    });

	$('#tabs div.tab').keydown(function(e){
		var tabIndex = $("#tabs .tab-selected").index();
		if (e.which == 37) {
			if ($(this).is( ":first-child" ))  {
				$('#tabs div:last-child').focus();
				$('.tab')[$('.tab').length - 1].click();
			}
			else {
				$(this).prev().focus();
				$('.tab')[tabIndex - 1].click();
			}
		}
		if (e.which == 39) {
			if ($(this).is( ":last-child" )) {
				$('#tabs div:first-child').focus();
				$('.tab')[0].click();
			} else {
				$(this).next().focus();
				$('.tab')[tabIndex + 1].click();
			}
		}
		if (e.which == 40 || e.which == 9) {
			if(e.shiftKey){
				return;
			}
			var tabIndex = $("#tabs .tab").index(this);
			var layer = _contentLayers[tabIndex];
			if($("ul#myList.tilelist li:visible").length > 0){
				enterTileGroup(layer);
			} else{
				if ($(this).is( ":last-child" )) {
					$('.tab')[0].click();
					setTimeout(function(){
						$('#tabs div:first-child').focus();
					}, 0);
				} else {
					$('.tab')[tabIndex + 1].click();
					setTimeout(function(){
						$(this).next().focus();
						$('.tab')[tabIndex + 1].focus();
					}, 0);
				}
			}

		}
	});

	$('.tab').keydown(function(e){
		if($(this).index() == 0){
			if (e.which == 9) {
				if(e.shiftKey){
					if($('#subtitle')){
						setTimeout(function(){
							$('#subtitle')[0].focus();
						}, 0);
					}else{
						$('#title')[0].focus();
					}
				}
			}
		}
	});

	$('.headerLink a').keydown(function(e){
		if (e.which == 9) {
			setTimeout(function(){
				$('.headerLink a').attr("tabindex", "-1");
				$('.share_facebook').attr("tabindex", "0")[0].focus();
			}, 100);
		}
	});

	$('.share_facebook').keydown(function(e){
		if (e.which == 9) {
			setTimeout(function(){
				$('.share_facebook').attr("tabindex", "-1");
				$('.share_twitter').attr("tabindex", "0")[0].focus();
			}, 100);
		}
	});

	$('.share_twitter').keydown(function(e){
		if (e.which == 9) {
			setTimeout(function(){
				$('.share_twitter').attr("tabindex", "-1");
				$('.share_bitly').attr("tabindex", "0")[0].focus();
			}, 100);
		}
	});

	$('.share_bitly').keydown(function(e){
		if (e.which == 9) {
			setTimeout(function(){
				$('.share_bitly').attr("tabindex", "-1");
				$('#logoLink').attr("tabindex", "0").focus();
			}, 100);
		}
	});

	$('#logo').keydown(function(e){
		if (e.which == 9) {
			setTimeout(function(){
				$('#logoLink').attr("tabindex", "-1");
				$('#title').focus();
			}, 100);
		}
	});

	modal_InfoWindow_Init();
}

/******************************************************
******************** event handlers *******************
*******************************************************/

function tile_onMouseOver(e) {
	 $(this).stop().animate({'background-color' : COLOR_FULL});
}

function tile_onMouseOut(e) {

	if (_selected != null) {
		var id = parseInt($(this).attr("id").substring(4));
		if (_selected.attributes.getValueCI(FIELDNAME_ID) == id) {
			return;
		}
	}

	$(this).stop().animate({'background-color' : COLOR_DIM});
}

function tile_onClick(e) {
	if(e.which == 1 || e.which == 2 || e.which == 3){
		_tileClick = true;
	}else{
		_tileClick = false;
	}

	var id = parseInt($(this).attr("id").substring(4));
	preSelection();
	_selected = $.grep(_layerCurrent.graphics,function(n,i){return n.attributes.getValueCI(FIELDNAME_ID) == id;})[0];
	postSelection();
	$('#mobileTitlePage').css('display', 'none');
	hideBookmarks();
}

/*function infoWindow_onHide(event) {
	unselect();
}*/

function baselayer_onMouseOver(event)
{
	if (_isMobile) return;
	_map.setMapCursor("pointer");
	var graphic = event.graphic;
	if(!graphic.attributes.getValueCI)
		graphic.attributes.getValueCI = getValueCI;
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
	buildPopup(event.graphic, event.mapPoint, "true");
	$("#hoverInfo").hide();
	$('#mobileTitlePage').css('display', 'none');
}

function layer_onClick(event)
{
	// IE fire an extra event after the renderer is updated that we need to filter
	_filterMouseHoverEvent = true;

	preSelection();
	_selected = event.graphic;
	postSelection();
	$('#mobileTitlePage').css('display', 'none');

	// IE
	setTimeout(function(){
		_filterMouseHoverEvent = false;
	}, 500);
}

function layer_onMouseOver(event)
{
	if (_filterMouseHoverEvent)
		return;

	if (_isMobile) return;
	_map.setMapCursor("pointer");
	var graphic = event.graphic;
	if (graphic == _selected && $('#header').css('display') == 'block')
		return;
	else
		if (graphic == _selected && $('#header').css('display') == 'none') {
			if(!graphic.attributes.getValueCI)
				graphic.attributes.getValueCI = getValueCI;
			$("#hoverInfo").html(graphic.attributes.getValueCI(FIELDNAME_TITLE));
			var pt = _map.toScreen(graphic.geometry);
			hoverInfoPos(pt.x, pt.y);
		}
		else {
			graphic.symbol.setWidth(_lutIconSpecs["medium"].getWidth());
			graphic.symbol.setHeight(_lutIconSpecs["medium"].getHeight());
			graphic.symbol.setOffset(_lutIconSpecs["medium"].getOffsetX(), _lutIconSpecs["medium"].getOffsetY());
			graphic.draw();

			if (!_isIE)
				moveGraphicToFront(graphic);
			if(!graphic.attributes.getValueCI)
				graphic.attributes.getValueCI = getValueCI;
			$("#hoverInfo").html(graphic.attributes.getValueCI(FIELDNAME_TITLE));
			var pt = _map.toScreen(graphic.geometry);
			hoverInfoPos(pt.x, pt.y);
		}
}

function layer_onMouseOut(event)
{
	if (_isMobile) return;
	_map.setMapCursor("default");
	var graphic = event.graphic;
	if (graphic != _selected) {
		graphic.symbol.setWidth(_lutIconSpecs["tiny"].getWidth());
		graphic.symbol.setHeight(_lutIconSpecs["tiny"].getHeight());
		graphic.symbol.setOffset(_lutIconSpecs["tiny"].getOffsetX(), _lutIconSpecs["tiny"].getOffsetY());
		graphic.draw();
	}
	$("#hoverInfo").hide();
}

/******************************************************
 ****************** 508 *******************************
 ******************************************************/

function tile_keydown(e) {
	if (e.which == 9) {
		var tiles = $('ul#myList.tilelist li:visible');
		if(e.shiftKey){
			setTimeout(function(){
				$('#tabs .tab-selected')[0].focus();
			}, 0);
			return;
		}
		if(tiles.index(this) == tiles.length - 1){
			var selectedTabIndex = $('#tabs .tab-selected').index();
			var tabLength = $('.tab').length;
			if(selectedTabIndex < tabLength -1){
				leaveTileGroup();
			}
			else{
				enterHeaderSocial();
			}
		}
	}
	if (e.which == 37) {
		var tiles = $('ul#myList.tilelist li:visible');
		if (tiles.index(this) == 0)  {
			tiles.get(-1).focus();
		}
		else {
			tiles[tiles.index(this)-1].focus();
		}
	}
	if (e.which == 39) {
		var tiles = $('ul#myList.tilelist li:visible');
		if (tiles.index(this) == (tiles.size() - 1)) {
			tiles.get(0).focus();
		} else {
			tiles[tiles.index(this)+1].focus();
		}
	}
	if (e.which == 38) {
		var w1 = $('ul#myList.tilelist').width();
		var w2 = $('ul#myList.tilelist li:first-child').width();
		var tiles_per_row = Math.floor(w1/w2);
		var tiles = $('ul#myList.tilelist li:visible');
		var myIndex = tiles.index(this);
		var newIndex = myIndex - tiles_per_row;
		if (newIndex < 0) {
			var tilecount = tiles.size();
			var gridcount = tilecount + tiles_per_row - (tilecount % tiles_per_row);
			newIndex = gridcount + newIndex;
			if (tilecount <= newIndex) {
				newIndex = newIndex - tiles_per_row;
			}
		}
		tiles.get(newIndex).focus();
	}
	if (e.which == 40) {
		var w1 = $('ul#myList.tilelist').width();
		var w2 = $('ul#myList.tilelist li:first-child').width();
		var tiles_per_row = Math.floor(w1/w2);
		var tiles = $('ul#myList.tilelist li:visible');
		var myIndex = tiles.index(this);
		var newIndex = myIndex + tiles_per_row;
		var tilecount = tiles.size();
		if (tilecount <= newIndex) {
			newIndex = newIndex % tiles_per_row;
		}
		tiles[newIndex].focus();
	}
}

function enterTileGroup(layer) {
    //move keyboard focus into a group of tiles
	hideBookmarks();
	setTimeout(function(){
		$("ul#myList.tilelist li:visible")[0].focus();
	}, 0);
}

function leaveTileGroup() {
    //move the keyboard focus out of a group of tile and back to the tab
    $("#tabs .tab-selected").focus();
	var tabIndex = $("#tabs .tab-selected").index();
	var layer = _contentLayers[tabIndex+1];
    activateLayer(layer);
 }

 function enterHeaderSocial(){
 	setTimeout(function(){
		$('.headerLink a').attr("tabindex", "0")[0].focus();
	}, 0);
 }

/******************************************************
 ****************** Modal Info Window *****************
 ******************************************************/

 // based on http://www.smashingmagazine.com/2014/09/15/making-modal-windows-better-for-everyone/

var _lastFocus;
var _infoWindowCloseButton;
var _infowWindowDom;
var _showingDetails;

function infoWindow_onShow(event) {
	_lastFocus = document.activeElement;
	setTimeout(function(){
		if(!_tileClick){
			$('.description')[0].setAttribute('tabIndex', '0');
			$('.description')[0].focus();
		}
	}, 500);
}

function infoWindow_onHide(event) {
	unselect();
	_modalOpen = false;
	// place focus on the saved element
	setTimeout(function(){
		if(_lastFocus)
			_lastFocus.focus();
	}, 0);
}

function focusRestrict ( event ) {
	document.addEventListener('focus', function( event ) {
		if (_map.infoWindow.isShowing &&
			!_infowWindowDom.contains( event.target) &&
			!_showingDetails) {
			event.stopPropagation();
			_infoWindowCloseButton.focus();
		}
	}, true);
}

function infoWindow_Close() {
	_map.infoWindow.hide();
}

function modalClose ( e ) {
	if ( !e.keyCode || e.keyCode === 27 ) {
		if (_map.infoWindow.isShowing && !_showingDetails) {
			infoWindow_Close();
		}
	}
}

function modal_InfoWindow_Init() {
	dojo.connect(_map.infoWindow,"onHide",infoWindow_onHide);
	dojo.connect(_map.infoWindow,"onShow",infoWindow_onShow);
	_infoWindowCloseButton = $(".esriPopup .titleButton.close")[0];
	_infowWindowDom = _map.infoWindow.domNode;
	if(!_isIE8){
		document.addEventListener('keydown', modalClose);
		focusRestrict();
	}
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
	return layer.url ? layer.id : layer.id;
}

function unselect() {
	preSelection();
	_selected = null;
	postSelection();
}

function SortByNumber(a, b){
  var aNumber = a.attributes.getValueCI(FIELDNAME_NUMBER) || a.attributes.Shortlist_ID;
  var bNumber = b.attributes.getValueCI(FIELDNAME_NUMBER) || b.attributes.Shortlist_ID;
  return ((aNumber < bNumber) ? -1 : ((aNumber > bNumber) ? 1 : 0));
}

function createLayerDefinition(fields){
	return layerDefinition = {
      "objectIdField": "__OBJECTID",
      "geometryType": "esriGeometryPoint",
      "drawingInfo": {
        "renderer": {
          "type": "simple",
          "symbol": {
            "type": "esriPMS",
            "url": "http://static.arcgis.com/images/Symbols/Shapes/GreenDiamondLargeB.png",
            "width": 15,
            "height": 15
          }
        }
      },
      "fields": fields
    };
}

function loadBookmarks() {

	$.each(_bookmarks,function(index,value){
			$("#bookmarksDiv").append("<p><a tabindex='0'>"+value.name+"</a></p>");
			$("#mobileBookmarksDiv").append("<p><a>"+value.name+"</a></p>");
	});

	$("#bookmarksDiv a").click(function(e) {
		var name = $(this).html();
		var extent = new esri.geometry.Extent($.grep(_bookmarks,function(n,i){return n.name == name;})[0].extent);
		_map.setExtent(extent);
		$("#bookmarksTogText").html(BOOKMARKS_ALIAS+' &#x25BC;');
		$("#bookmarksDiv").slideToggle();
    });

	$("#mobileBookmarksDiv a").click(function(e) {
		var name = $(this).html();
		var extent = new esri.geometry.Extent($.grep(_bookmarks,function(n,i){return n.name == name;})[0].extent);
		_map.setExtent(extent);
		$("#mobileBookmarksTogText").html(BOOKMARKS_ALIAS+' &#x25BC;');
		$("#mobileBookmarksDiv").slideToggle();
    });

}

function hideBookmarks(){
	if ($("#mobileBookmarksDiv").css('display') === 'block') {
		$("#mobileBookmarksDiv").slideToggle();
		$("#mobileBookmarksTogText").html(BOOKMARKS_ALIAS + ' &#x25BC;');
	}
	if ($("#bookmarksDiv").css('display') === 'block') {
		$("#bookmarksDiv").slideToggle();
		$("#bookmarksTogText").html(BOOKMARKS_ALIAS + ' &#x25BC;');
	}
	else
		return;
}

function activateLayer(layer) {
	preSelection();
	_selected = null;
	postSelection();
	_layerCurrent = layer;

	var tab = $.grep($(".tab"), function(n,i){return $(n).text() == _layerCurrent.title;})[0];
	$(".tab").removeClass("tab-selected");
	$(tab).addClass("tab-selected");
	var themeIndex = $('.tab-selected').index();


	if (themeIndex == 0 && _mobileThemeSwiper.slides.length > 1) {
		$('#navThemeLeft').css('display', 'none');
		$('#navThemeRight').css('display', 'block');
	}
	else
		if (themeIndex == (_mobileThemeSwiper.slides.length - 1)) {
			$('#navThemeRight').css('display', 'none');
			$('#navThemeLeft').css('display', 'block');
		}
	else {
		$('#navThemeLeft').css('display', 'block');
		$('#navThemeRight').css('display', 'block');
	}

	if(_mobileThemeSwiper.slides.length == 0){
		$('#navThemeLeft').css('display', 'none');
		$('#navThemeRight').css('display', 'none');
	}

	if (_firstLoad) {
		_mobileThemeSwiper.swipeTo(themeIndex, 300, false);
	}
	else {
		_mobileThemeSwiper.swipeTo(themeIndex);
		$('#mobileTitlePage').css('display', 'none');

	}
	_firstLoad = false;


	$.each(_contentLayers,function(index,value){
		value.setVisibility(value == _layerCurrent);
	});

	$("#myList").empty();
	$('#mobileList').empty();

	var display;
	var tile;
	var img;
	var mobileImg;
	var footer;
	var num;
	var title;
	var mobileTile;
	var visibleFeatures = false;

	$.each(_layerCurrent.graphics,function(index,value){
		if (_map.extent.contains(value.geometry)) {
			display = "visible";
			visibleFeatures = true;
		} else {
			display = "none";
		}
		tile = $('<li tabindex="0" id="item'+value.attributes.getValueCI(FIELDNAME_ID)+'" style="display:'+display+'">');
		img = $('<img src="'+value.attributes.getValueCI(FIELDNAME_IMAGEURL)+'"alt>');
		mobileImg = $('<div style="height: 75px; margin-bottom: 8px;"><img src="'+value.attributes.getValueCI(FIELDNAME_IMAGEURL)+'"></div>');
		footer = $('<div class="footer"></div>');
		if(value.attributes.getValueCI(FIELDNAME_NUMBER) < 100){
			num = $('<div class="num" style="background-color:'+_layerCurrent.color+'">'+value.attributes.getValueCI(FIELDNAME_NUMBER)+'</div>');
			title = $('<div class="blurb">'+value.attributes.getValueCI(FIELDNAME_TITLE)+'</div>');
		}
		else{
			num = $('<div class="num longNum" style="background-color:'+_layerCurrent.color+'">'+value.attributes.getValueCI(FIELDNAME_NUMBER)+'</div>');
			title = $('<div class="blurb longNumBlurb">'+value.attributes.getValueCI(FIELDNAME_TITLE)+'</div>');
		}
		$(footer).append(num);
		$(footer).append(title);
		$(tile).append(footer);
		mobileTile = $(tile).clone();
		$(tile).append(img);
		$(mobileTile).append(mobileImg);
		$("#myList").append(tile);
		$('#mobileList').append(mobileTile);
	});

	// event handlers have to be re-assigned every time you load the list...
	$("ul.tilelist li").mouseover(tile_onMouseOver);
	$("ul.tilelist li").mouseout(tile_onMouseOut);
	$("ul.tilelist li").click(tile_onClick);
	$("ul.tilelist li").keydown(tile_keydown);
	$("#mobilePaneList ul.mobileTileList li").click(tile_onClick);

	$("ul.tilelist").animate({ scrollTop: 0 }, { duration: 200 } ); //Does this work?
	$('#mobilePaneList').scrollTop(0);
	if(!visibleFeatures)
		$('.noFeature').css('display', 'block');
	else
		$('.noFeature').css('display', 'none')	;
}

function refreshList() {
	var tile;
	var mobileTile;
	var visibleFeatures = false;
	setTimeout(function(){
		$.each(_layerCurrent.graphics,function(index,value){
			//find the corresponding tile
			tile = findTile(value.attributes.getValueCI(FIELDNAME_ID));
			mobileTile = findMobileTile(value.attributes.getValueCI(FIELDNAME_ID));
			if (_map.extent.contains(value.geometry)) {
				if ($(tile).css("display") == "none") $(tile).stop().fadeIn();
				if ($(mobileTile).css("display") == "none") $(mobileTile).css("display", "block") ;
				visibleFeatures = true;
			} else {
				if ($(tile).css("display") != "none") $(tile).stop().fadeOut(1000);
				if ($(mobileTile).css("display") != "none") $(mobileTile).css("display", "none");
			}
		});

		$('#mobilePaneList').scrollTop(0);

		if(!visibleFeatures)
			$('.noFeature').css('display', 'block');
		else
			$('.noFeature').css('display', 'none');
	}, 100);
}

function buildLayer(arr,iconDir,root) {
	var layer = new esri.layers.GraphicsLayer();
	var pt;
	var sym;
	var spec = _lutIconSpecs["tiny"];
	$.each(arr,function(index,value){
		pt = new esri.geometry.Point(value.geometry.x,value.geometry.y,value.geometry.spatialReference);
		sym = createPictureMarkerSymbol("resources/images/icons/"+iconDir+"/"+root+value.attributes.getValueCI(FIELDNAME_NUMBER)+".png", _lutIconSpecs["tiny"]);
		layer.add(new esri.Graphic(pt,sym,value.attributes));
	});
	return layer;
}

function getValueCI(fields) {
	// this function provides a uniform method for reading an
	// attribute property.  it performs two duties:

	// 1) case insensitive access

	var found;
	var value;
	$.each(this,function(index,value){
		var attName = index;
		$.grep(fields, function(field, index){
			if(attName.toUpperCase() == field.toUpperCase())
				found = attName;
		});

	});

	value = this[found];

	// NOTE:  once we adopt ECMAScript 5, ALL of the above can
	// be accomplished with this one line:
	//var value = this[$.grep(Object.keys(this), function(n, i) {return n.toLowerCase() == field.toLowerCase()})[0]];

	// 2) treat any blank entries as null

	if ($.trim(value).length == 0) value = null;

	return value;

}

function handleWindowResize() {
	if(!_firstLoad && _layout == 'normal')
		$('#mobileTitlePage').css('display', 'none');
	if ($('#header').css('display') != 'none') {
		if(_layout == 'responsive'){
			preSelection();
			_map.infoWindow.hide();
			_selected = null;
		}

		_layout = 'normal';
		//_mobileThemeSwiper.disableKeyboardControl();
		$("#mainWindow").height($("body").height() - ($("#header").height()));

		if (_bookmarks) {
			$("#tabs").width($("body").width() - ($("#bookmarksCon").width() + parseInt($("#tabs").css("padding-left"))));
		}
		else {
			$("#tabs").width($("body").width());
		}

		$("#paneLeft").height($("#mainWindow").height() - $('#tabs').height());

		if($("body").width() <= TWO_COLUMN_THRESHOLD || ($("body").width() <= 1024 && $("body").height() <= 768))
			$("#paneLeft").width(LEFT_PANE_WIDTH_TWO_COLUMN);
		else
			$("#paneLeft").width(LEFT_PANE_WIDTH_THREE_COLUMN);

		$(".tilelist").height($("#paneLeft").height() - 18);
		$(".tilelist").width($("#paneLeft").width() + 7);
		$("#paneLeft .noFeature").width($('#paneLeft').width());
		$("#paneLeft").width() == LEFT_PANE_WIDTH_TWO_COLUMN ? $('#paneLeft .noFeatureText').css('margin-left', '50px') : $('#paneLeft .noFeatureText').css('margin-left', '150px');

		$("#map").css("left", $("#paneLeft").outerWidth());
		$("#map").height($("#mainWindow").height() - $('#divStrip').height());
		$("#map").css('top',$('#divStrip').height());
		$("#map").width($("#mainWindow").width() - $("#paneLeft").outerWidth());

		$('#header').width($('body').width());
		$("#headerText").css("max-width", $("#header").width() - ($("#logoArea").width() + 100));
	}
	else{
		resizeMobileElements();
		if(_layout == 'normal'){
			preSelection();
			_selected = null;
			showMobileList();
			postSelection();
		}

		_layout = 'responsive';
		$("#mobileList").width($("body").width());
		if(!_firstLoad){
			_mobileThemeSwiper.reInit();
			if(_layout == 'normal'){
				_mobileThemeSwiper.disableKeyboardControl();
			}else{
				_mobileThemeSwiper.enableKeyboardControl();
			}
		}
	}

	if (_map) _map.resize();
}

function preSelection()
{
	// return the soon-to-be formerly selected graphic icon to normal
	// size & dim the corresponding tile.

	if (_selected) {
		_selected.symbol.setWidth(_lutIconSpecs["tiny"].getWidth());
		_selected.symbol.setHeight(_lutIconSpecs["tiny"].getHeight());
		_selected.symbol.setOffset(_lutIconSpecs["tiny"].getOffsetX(), _lutIconSpecs["tiny"].getOffsetY());
		_selected.draw();
		var tile = findTile(_selected.attributes.getValueCI(FIELDNAME_ID));
		if ($(tile).attr("id") != $(this).attr("id")) $(tile).stop().animate({'background-color' : COLOR_DIM});
	}

}

function postSelection(skipPopup) {

	if (_selected == null) {
		_map.infoWindow.hide();
	} else {

		// make the selected location's icon LARGE
		_selected.symbol.setWidth(_lutIconSpecs["large"].getWidth());
		_selected.symbol.setHeight(_lutIconSpecs["large"].getHeight());
		_selected.symbol.setOffset(_lutIconSpecs["large"].getOffsetX(), _lutIconSpecs["large"].getOffsetY());
		_selected.draw();

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

		if(!skipPopup)
			buildPopup(_selected, _selected.geometry);

		// light up the corresponding tile.
		var tile = findTile(_selected.attributes.getValueCI(FIELDNAME_ID));
		$(tile).stop().animate({'background-color' : COLOR_FULL});
	}

	$("#hoverInfo").hide();

}

function buildPopup(feature, geometry, baseLayerClick)
{
	$('#mobileSupportedLayersView').html('');
	$('#mobileThemeBar .swiper-container').css('display', 'none');
	$('#navThemeLeft').css('visibility', 'hidden');
	$('#navThemeRight').css('visibility', 'hidden');
	var atts = feature.attributes;

	var mobile = $('#header').css('display') == 'none';

	if (!baseLayerClick && mobile) {
		buildMobileSlideView();
		return;
	}

	if(!atts.getValueCI)
		atts.getValueCI = getValueCI;

	var title =  atts.getValueCI(FIELDNAME_TITLE);

	var shortDesc = atts.getValueCI(FIELDNAME_SHORTDESC);
	var picture = atts.getValueCI(FIELDNAME_IMAGEURL);
	var website = prependURLHTTP(atts.getValueCI(FIELDNAME_WEBSITE));

	var contentDiv = $("<div></div>");
	if (baseLayerClick && mobile)
			$('#mobileSupportedLayersView').append($("<div style='padding-left: 20px;' class='mobileFeatureTitle'></div>").html(title));
	if (shortDesc) {
		$(contentDiv).append($("<div class='description' tabindex='0'></div>").html(shortDesc));
		if (baseLayerClick && mobile) {
			$('#mobileSupportedLayersView').append($('<hr style="margin-left: 20px; margin-right: 20px;">'));
			$('#mobileSupportedLayersView').append($("<div class='mobileFeatureSubtitle'></div>").html(shortDesc));
		}
	}
	if (picture) {
		var pDiv = $("<div></div>").addClass("infoWindowPictureDiv");
		var mobilePDiv = $("<div></div>").addClass("mobilePictureDiv");
		if (DETAILS_PANEL && !mobile) {
			$(pDiv).append($(new Image()).attr("src", picture));
			$(pDiv).css("cursor", "pointer");
		}
		else if (DETAILS_PANEL && mobile) {
			if (website) {
				var mobileA = $("<a></a>").attr("href", website).attr("target","_blank");
				$(mobileA).append($(new Image()).attr("src", picture));
				$(mobilePDiv).append(mobileA);
			} else {
				$(mobilePDiv).append($(new Image()).attr("src", picture));
			}
		} else { // no details panel
			if (website) {
				var a = $("<a tabindex='-1'></a>").attr("href", website).attr("target","_blank");
				var mobileA = $("<a></a>").attr("href", website).attr("target","_blank");
				var newImage = $(new Image()).attr("src", picture);
				$(newImage).attr('alt', '');
				$(a).append($(newImage));
				$(mobileA).append($(new Image()).attr("src", picture));
				$(pDiv).append(a);
				$(mobilePDiv).append(mobileA);
			} else {
				$(pDiv).append($(new Image()).attr("src", picture));
				$(mobilePDiv).append($(new Image()).attr("src", picture));
			}
		}
		$(contentDiv).append(pDiv);
		if(baseLayerClick && mobile)
			$('#mobileSupportedLayersView').append(mobilePDiv);
	}

	if (!picture) {
		$(contentDiv).append("<br>");
		if(baseLayerClick && mobile)
			$('#mobileSupportedLayersView').append("<br>");
	}

	if (!DETAILS_PANEL) {
		if(!shortDesc)
			$('.mobileFeatureTitle').after($('<hr style="margin-left: 20px; margin-right: 20px;">'));
		var desc1 = atts.getValueCI(FIELDNAME_DESC1);
		if (desc1) {
			$(contentDiv).append($("<div class='description' tabindex='0'></div>").html(desc1));
			if(baseLayerClick)
				$('#mobileSupportedLayersView').append($("<div class='mobileFeatureDesc'></div>").html(desc1));
		}

		if (website) {
			$(contentDiv).append($('<div class="address"><a href="'+website+'" target="_blank">Website</a></div>').css("padding-top", 10));
			if(baseLayerClick && mobile)
				$('#mobileSupportedLayersView').append($('<div class="mobileFeatureAddress"><a href="'+website+'" target="_blank">Website</a></div>').css("padding-top", 10));
		}

	}
	else if (DETAILS_PANEL && mobile){
		$(contentDiv).prepend($('<div style="margin-left: -50px" class="mobileFeatureTitle" tabindex="0">'+title+'</div>'));
		if(!shortDesc)
			$('.mobileFeatureTitle').after($('<hr style="margin-left: 20px; margin-right: 20px;">'));

		var descFields = [FIELDNAME_DESC1, FIELDNAME_DESC2, FIELDNAME_DESC3, FIELDNAME_DESC4, FIELDNAME_DESC5];
		var value;
		$.each(descFields, function(index, field){
			value = atts.getValueCI(field);
			if (value) {
				$(contentDiv).append('<div class="mobileFeatureDesc">'+value+'</div>');
				if ($(contentDiv).children().length > 0 && index < descFields.length -1){
					$(contentDiv).append('<p>');
				}
				if(baseLayerClick && mobile){
					$('#mobileSupportedLayersView').append('<div class="mobileFeatureDesc">'+value+'</div>');
				}
				if(descFields.length > 1/* && index*/)
					$('#mobileSupportedLayersView').append('<p>');
			}
		});
		$(contentDiv).append($('<hr style="margin-left: 20px; margin-right: 20px;">'));
		if(baseLayerClick && mobile){
			$('#mobileSupportedLayersView').append($('<hr style="margin-left: 20px; margin-right: 20px;">'));
		}
		var address = atts.getValueCI(FIELDNAME_ADDRESS);
		if (address) {
			$(contentDiv).append($('<div class="mobileFeatureAddress" tabindex="0">'+address+'</div>'));
			if(baseLayerClick && mobile){
				$('#mobileSupportedLayersView').append($('<div class="mobileFeatureAddress">'+address+'</div>'));
			}
		}

		var hours = atts.getValueCI(FIELDNAME_HOURS);
		if (hours) {
			$(contentDiv).append($('<div class="mobileFeatureAddress" tabindex="0">'+hours+'</div>'));
			if(baseLayerClick && mobile){
				$('#mobileSupportedLayersView').append($('<div class="mobileFeatureAddress">'+hours+'</div>'));
			}
		}

		var website = prependURLHTTP(atts.getValueCI(FIELDNAME_WEBSITE));
		if (website) {
			$(contentDiv).append('<div class="mobileFeatureAddress" tabindex="0"><a href="'+website+'" target="_blank">Website</a></div>');
			if(baseLayerClick && mobile){
				$('#mobileSupportedLayersView').append('<div class="mobileFeatureAddress"><a href="'+website+'" target="_blank">Website</a></div>');
			}
		}
		$(contentDiv).append('<div style="margin-bottom: 20px;" ></div>');
		if(baseLayerClick && mobile){
			$('#mobileSupportedLayersView').append('<div style="margin-bottom: 20px;"></div>');
		}
	} else {
		$(contentDiv).append($("<div></div>").addClass("infoWindowLink").attr("tabindex","0").html("Details"));

	}

	// note: what we really want is the entire contentDiv html in
	//       this popup.  since contentDiv.html() only gives us the
	//       inner html for the div, i am re-adding the wrapper div.
	//       there's got to be a more elegant way to do this, but it
	//       eludes me at the moment.
	_map.infoWindow.setContent("<div>"+contentDiv.html()+"</div>");
	$('.infoWindowLink').last().append($("<span aria-hidden='true' ></span>").html(">>"));
	_map.infoWindow.setTitle(title);
	_map.infoWindow.show(geometry);

	$('#mobilePaneList').css('visibility', 'hidden');
	$('#mobileFeature').css('visibility', 'hidden');
	$('#returnIcon').css('display', 'block');
	$('#returnHiddenBar').css('display', 'block');
	$('#centerMapIconContainer').css('display', 'none');
	$('#mobileSupportedLayersView').css('visibility', 'visible');
	preSelection();

	$(".esriPopup .contentPane").scrollTop(0);
	$(".infoWindowLink").click(function(e) {
        showDetails(feature, e);
    });

	if (DETAILS_PANEL && $('#header').css('display') == 'block') {
		$(".infoWindowPictureDiv").click(function(e) {
			showDetails(feature, e);
		});
		$(".infoWindowPictureDiv").keypress(function(e){
			if(e.which == 13){
				_tileClick = false;
			}
		});
	}
}

/*
 * Builds swipe-able slides that display feature information
 */
function buildMobileSlideView(featureNumber){
	_mobileFeatureSwiper.removeAllSlides();
	var themeIndex = $('.tab-selected').index();
	if(themeIndex<0)
		themeIndex = 0;
	var currentTheme = _contentLayers[themeIndex];
	var features = currentTheme.graphics;

	$.each(features, function(index, feature){
		if(!_map.extent.contains(feature.geometry))
			return;
		var atts = feature.attributes;

		if(!atts.getValueCI)
			atts.getValueCI = getValueCI;

		var title =  atts.getValueCI(FIELDNAME_TITLE);

		var shortDesc = atts.getValueCI(FIELDNAME_SHORTDESC);
		var picture = atts.getValueCI(FIELDNAME_IMAGEURL);
		var website = prependURLHTTP(atts.getValueCI(FIELDNAME_WEBSITE));

		var num = $('<div class="mobileFeatureNum" style="background-color:'+_layerCurrent.color+'">'+ atts.getValueCI(FIELDNAME_NUMBER)+'</div>');

		var mobileContentDiv = $("<div'></div");
		$(mobileContentDiv).append(num);
		if(title){
			$(mobileContentDiv).append($("<div class='mobileFeatureTitle'></div>").html(title));
		}
		$(mobileContentDiv).append("<hr style='margin-left: 20px; margin-right: 20px;'>");

		if (shortDesc) {
			$(mobileContentDiv).append($("<div class='mobileFeatureSubtitle'></div>").html(shortDesc));
		}
		if (picture) {
			var mobilePDiv = $("<div></div>").addClass("mobilePictureDiv");
			$(mobilePDiv).append($(new Image()).attr("src", picture));

			$(mobileContentDiv).append(mobilePDiv);
		}

		if (!DETAILS_PANEL) {
			var desc1 = atts.getValueCI(FIELDNAME_DESC1);
			if (desc1) {
				$(mobileContentDiv).append($("<div class='mobileFeatureDesc'></div>").html(desc1));
			}

			if (website) {
				$(mobileContentDiv).append($('<div class="mobileFeatureDesc"><a href="'+website+'" target="_blank">Website</a></div>').css("padding-top", 10));
			}

		} else {
			var descFields = [FIELDNAME_DESC1, FIELDNAME_DESC2, FIELDNAME_DESC3, FIELDNAME_DESC4, FIELDNAME_DESC5];
			var value;
			$.each(descFields, function(index, field){
				value = atts.getValueCI(field);
				if (value) {
					$(mobileContentDiv).append('<div class="mobileFeatureDesc">'+value+'</div>');
					if ($(mobileContentDiv).children().length > 0){
						$(mobileContentDiv).append('<br>');
					}
				}
			});
			$(mobileContentDiv).append("<hr style='margin-left: 20px; margin-right: 20px;'>");
			var address = atts.getValueCI(FIELDNAME_ADDRESS);
			if (address) {
				$(mobileContentDiv).append($('<div class="mobileFeatureAddress">'+address+'</div>'));
			}

			var hours = atts.getValueCI(FIELDNAME_HOURS);
			if (hours) {
				$(mobileContentDiv).append($('<div class="mobileFeatureAddress">'+hours+'</div>'));
			}

			var website = prependURLHTTP(atts.getValueCI(FIELDNAME_WEBSITE));
			if (website) {
				$(mobileContentDiv).append('<div class="mobileFeatureAddress"><a href="'+website+'" target="_blank">Website</a></div>');
			}
			$(mobileContentDiv).append('<div style="margin-bottom: 20px;"></div>');
		}

		var featureSlide = _mobileFeatureSwiper.createSlide(mobileContentDiv.html());
		$(featureSlide).attr('data-number', atts.getValueCI(FIELDNAME_NUMBER));
		$(featureSlide).css('overflowY', 'auto');
		featureSlide.append();
	});

	 var selectedSlideIndex = null;

	 $.each(_mobileFeatureSwiper.slides, function(index, slide){
		 if (parseInt($(slide).data('number')) == _selected.attributes.getValueCI(FIELDNAME_NUMBER))
		 	selectedSlideIndex = index;
	 });
	 _mobileFeatureSwiper.swipeTo(selectedSlideIndex);
	 $('.swiper-slide-active').scrollTop(0);
	 $('#mobileFeature').css('visibility', 'visible');
	 $('#returnIcon').css('display', 'block');
	 $('#returnHiddenBar').css('display', 'block');
	 $('#centerMapIconContainer').css('display', 'block');
}

function showDetails(graphic, e) {
	if(!graphic.attributes.getValueCI)
		graphic.attributes.getValueCI = getValueCI;

	var mainDiv = $('<div class="details"></div>');
	var titleDiv = $('<div class="detailsTitle">'+graphic.attributes.getValueCI(FIELDNAME_TITLE)+'</div>');
	var leftDiv = $('<div class="leftDiv"></div>');
	var rightDiv = $('<div class="rightDiv"></div>');

	var imageDiv = $('<img alt="" tabindex="-1" src="'+graphic.attributes.getValueCI(FIELDNAME_IMAGEURL)+'">');
	var pictureFrame = $('<div class="pictureFrame" tabindex="-1"></div>');
	$(pictureFrame).append(imageDiv);
	$(leftDiv).append(pictureFrame);

	var address = graphic.attributes.getValueCI(FIELDNAME_ADDRESS);
	if (address) {
		$(leftDiv).append($('<div class="address" tabindex="0">'+address+'</div>'));
	}

	var hours = graphic.attributes.getValueCI(FIELDNAME_HOURS);
	if (hours) {
		$(leftDiv).append($('<div class="address" tabindex="0">'+hours+'</div>'));
	}

	var website = prependURLHTTP(graphic.attributes.getValueCI(FIELDNAME_WEBSITE));
	if (website) {
		$(leftDiv).append('<div class="address" tabindex="-1"><a href="'+website+'" target="_blank">Website</a></div>');
		$(pictureFrame).wrapInner('<a tabindex="-1" href="' + website +'" target="_blank"></a>');
	}

	var descFields = [FIELDNAME_DESC1, FIELDNAME_DESC2, FIELDNAME_DESC3, FIELDNAME_DESC4, FIELDNAME_DESC5];
	var value;
	$.each(descFields, function(index, field){
		value = graphic.attributes.getValueCI(field);
		if (value) {
			$(rightDiv).append('<div class="desc" tabindex="0">'+value+'</div>');
			if ($(rightDiv).children().length > 0 && index <= descFields.length -1){
				$(rightDiv).append('<p>');
			}
		}
	});

	$(mainDiv).append(titleDiv);
	$(mainDiv).append("<hr>");
	$(mainDiv).append(leftDiv);
	$(mainDiv).append(rightDiv);

  	var activeElement = $(document.activeElement);
	_showingDetails = true;
	$.colorbox({
		html:mainDiv,
		open:true,
		maxHeight:$(document).height() - 100,
		maxWidth:"575px",
		scrolling:false,
		onComplete: function(){
			_tileClick ? null : $('.address')[0].focus();
		},
		onClosed:function(){_showingDetails = false; activeElement.focus();}
	});

	$('.rightDiv').find('p').last().css('display', 'none');

	_tileClick ? $('.infoWindowLink').css('outline', 'none') : $('.infoWindowLink').focus();
}

function findTile(id)
{
	return $.grep($("ul.tilelist li"),function(n,i){return n.id == "item"+id;})[0];
}

function findMobileTile(id)
{
	return $.grep($("ul.mobileTileList li"),function(n,i){return n.id == "item"+id;})[0];
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

function swipeFeature(){
	preSelection();
	var themeIndex = $('.tab-selected').index();
	if(themeIndex<0)
		themeIndex = 0;
	var currentTheme = _contentLayers[themeIndex];
	var features = currentTheme.graphics;
	var nextFeatureId = $(_mobileFeatureSwiper.activeSlide()).data('number');
	var feature = currentTheme.graphics.filter(function(feat){
		if(feat.attributes.Number){
			return feat.attributes.Number == nextFeatureId;
		} else if(feat.attributes.NUMBER){
			return feat.attributes.NUMBER == nextFeatureId;
		} else if(feat.attributes.number){
			return feat.attributes.number == nextFeatureId;
		} else {
			return feat.attributes.Shortlist_ID == nextFeatureId;
		}
	});
	_selected = feature[0];
	$('.swiper-slide-active').scrollTop(0);
	postSelection(true);
}

function showMobileList(){
	$('#mobileFeature').css('visibility', 'hidden');
	$('#mobileSupportedLayersView').css('visibility', 'hidden');
	$('.swiper-container').css('display', 'block');
	$('#mobilePaneList').css('visibility', 'visible');
	$('#returnIcon').css('display', 'none');
	$('#returnHiddenBar').css('display', 'none');
	$('#centerMapIconContainer').css('display', 'none');
	$('#navThemeLeft').css('visibility', 'visible');
	$('#navThemeRight').css('visibility', 'visible');
	if (_selected) {
		_selected.symbol.setWidth(_lutIconSpecs["tiny"].getWidth());
		_selected.symbol.setHeight(_lutIconSpecs["tiny"].getHeight());
		_selected.symbol.setOffset(_lutIconSpecs["tiny"].getOffsetX(), _lutIconSpecs["tiny"].getOffsetY());
		_selected.draw();
	}
	if (_mobileThemeSwiper.activeIndex > 0 || _mobileThemeSwiper.activeIndex == -0) {
		_mobileThemeSwiper.reInit();
		_mobileThemeSwiper.swipeTo(_mobileThemeSwiper.activeIndex);
	}
}

function centerMapOnFeature(){
	_map.centerAt(_selected.geometry);
}

/*
 * Workaround for looping slides from iDanergous swipe component because of inconsistent
 * behavior when using 'loop' property of component and getting correct slide index.
 */
function loopFeatureSlides(direction){
	if(direction == 'left'){
		var slidesLength = _mobileFeatureSwiper.slides.length;
		_mobileFeatureSwiper.swipeTo(slidesLength-1, 50);
		swipeFeature();
	}
	if (direction == 'right') {
		_mobileFeatureSwiper.swipeTo(0, 50);
		swipeFeature();
	}
}

function selectMobileTheme(index){
	if(index != 0)
		activateLayer(_contentLayers[index]);
	$('#mobileTitlePage').css('display', 'none');
	$('#map').css('height', '100%').css('height', '48%').css('height', '-=20px');
	_map.resize();
}

function getDeviceLocation(){
	navigator.geolocation.getCurrentPosition(
		function(e){
			var geom = new esri.geometry.Point(e.coords.longitude, e.coords.latitude);
			var locationPoint = esri.geometry.geographicToWebMercator(geom);
			_map.centerAt(locationPoint);
			displayLocationPin(locationPoint);
		}
	);
	$('#mobileTitlePage').css('display', 'none');
}

function getDeviceLocationError(error){
	locationButtonCallback(false, error);
}

function displayLocationPin(point)
{
	_locateLayer.clear();
	_locateLayer.add(new esri.Graphic( point, _locateSymbol ));
	setTimeout(function(){
		$('#locateLayer_layer image').hide();
	}, 10000);
}

function shareFacebook()
{
	var options = '&p[title]=' + encodeURIComponent($('#title').text())
					+ '&p[summary]=' + encodeURIComponent($('#subtitle').text())
					+ '&p[url]=' + encodeURIComponent(document.location.href)
					+ '&p[images][0]=' + encodeURIComponent($("meta[property='og:image']").attr("content"));

	window.open(
		'http://www.facebook.com/sharer.php?s=100' + options,
		'',
		'toolbar=0,status=0,width=626,height=436'
	);
}

function shareTwitter()
{
	var options = 'text=' + encodeURIComponent($('#title').text())
					+ '&url=' + encodeURIComponent(document.location.href)
					+ '&related=EsriStoryMaps'
					+ '&hashtags=storymap';

	window.open(
		'https://twitter.com/intent/tweet?' + options,
		'Tweet',
		'toolbar=0,status=0,width=626,height=436'
	);
}

function requestBitly()
{
	var bitlyUrls = [
		"http://api.bitly.com/v3/shorten?callback=?",
		"https://api-ssl.bitly.com/v3/shorten?callback=?"
	];
	var bitlyUrl = location.protocol == 'http:' ? bitlyUrls[0] : bitlyUrls[1];

	var urlParams = esri.urlToObject(document.location.href).query || {};
	var targetUrl = document.location.href;

	$.getJSON(
		bitlyUrl,
		{
			"format": "json",
			"login": "esristorymaps",
			"apiKey": "R_14fc9f92e48f7c78c21db32bd01f7014",
			"longUrl": targetUrl
		},
		function(response)
		{
			if( ! response || ! response || ! response.data.url )
				return;

			$("#bitlyLoad").fadeOut();
			$("#bitlyInput").fadeIn();
			$("#bitlyInput").val(response.data.url);
			$("#bitlyInput").select();
		}
	);
	$(".popover").show();
}

// Necessary as css calc() method does not work in older android
function resizeMobileElements(){
	$('#mobilePaneList').css('height', '52%').css('height', '-=20px');
	$('#mobileFeature').css('height', '52%').css('height', '-=20px');
	$('#mobileSupportedLayersView').css('height', '52%').css('height', '-=20px');
	$('#mobileThemeBar').css('top', '48%').css('top', $('#mobileThemeBar').position().top -20 +'px');
	$('#returnHiddenBar').css('width', '100%').css('width', '-=80px');
	$('#mobilePaneList').css('height', '52%').css('height', '-=20px');
	$('.mobileTileList.blurb').css('width', '100%').css('width', '-=125px');
	if($('#header').css('display') == 'none')
		$('#map').css('height', '48%').css('height', '-=20px');
}

function initError(errorTitle, errorMessage){
	$('#loader').hide();
	$("#fatalError .error-title").html(errorTitle);
	$("#fatalError .error-msg").html(errorMessage);
	$("#fatalError").show();
}

function prependURLHTTP(url)
{
	if ( ! url || url === "" || url.match(/^mailto:/) )
		return url;

	if ( ! /^(https?:\/\/)|^(\/\/)/i.test(url) )
		return 'http://' + url;

	return url;
}
