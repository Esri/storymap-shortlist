define(["lib-build/css!./MainView",
		"./Config",
		"./Data",
		"./WebApplicationData",
		"./Helper",
		// Desktop UI
		"../ui/desktop/TestPanel",
		"../ui/desktop/TilePanel",
		"../ui/desktop/DetailPanel",
		"../ui/desktop/NavBar",
		"../ui/desktop/MultiTips",
		// Mobile UI
		"../ui/mobile/MobileIntro",
		"../ui/mobile/MobileFeatureList",
		// Common
		"storymaps/common/mapcontrols/command/MapCommand",
		"storymaps/common/mapcontrols/legend/Legend",
		"storymaps/common/mapcontrols/overview/Overview",
		"storymaps/common/mapcontrols/geocoder/Geocoder",
		"lib-build/css!storymaps/common/ui/Modal.css",
		"lib-build/css!storymaps/common/utils/SocialSharing.css",
		"lib-build/css!storymaps/common/ui/loadingIndicator/LoadingIndicator.css",
		// Utils
		"storymaps/common/utils/CommonHelper",
		"dojo/has",
		"dojo/topic",
		"dojo/on",
		"dojo/dom",
		"dojo/DeferredList",
		"dojo/_base/lang",
		"esri/arcgis/utils",
		"esri/geometry/Point",
		"esri/geometry/screenUtils",
		"esri/geometry/Extent",
		"esri/dijit/Search",
		"esri/SpatialReference",
		"lib-build/css!../ui/Common",
		"lib-build/css!../ui/mobile/Common",
		"lib-build/css!../ui/Responsive",
		"lib-build/css!../ui/desktop/MultiTips"
	],
	function (
		viewCss,
		Config,
		Data,
		WebApplicationData,
		Helper,
		TestPanel,
		TilePanel,
		DetailPanel,
		NavBar,
		MultiTips,
		MobileIntro,
		MobileFeatureList,
		MapCommand,
		Legend,
		Overview,
		Geocoder,
		modalCss,
		socialSharingCss,
		loadingIndicatorCss,
		CommonHelper,
		has,
		topic,
		on,
		dom,
		DeferredList,
		lang,
		arcgisUtils,
		Point,
		screenUtils,
		Extent,
		Search,
		SpatialReference
	){
		/**
		 * @preserve This application is released under the Apache License V2.0 by Esri http://www.esri.com/
		 * Checkout the project repository on GitHub to access source code, latest revision, developer documentation, FAQ and tips
		 * https://github.com/Esri/shortlist-storytelling-template-js
		 */
		return function MainView(builderView)
		{
			var _core = null;
			var _helper = new Helper();
			var _this = this;
			var _filterMouseHoverEvent = false;
			//var _tileClick = true;
			var _context;
			var _icon;
			var _myCanvas;
			var _firstMapLoad = 0;
			var _iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
			var _urlParams = CommonHelper.getUrlParams();
			var _builtThemes = null;
			_this.mapIsPanning = false;
			_this.mapIsZooming = false;

			this.init = function(core)
			{
				_core = core;

				// Do not allow builder under IE 10
				if( app.isInBuilder && has("ie") && has("ie") < 10) {
					i18n.viewer.errors.noBuilderIE = i18n.viewer.errors.noBuilderIE.replace('%VERSION%', 10).replace('%UPGRADE%', i18n.viewer.errors.upgradeBrowser);
					_core.initError("noBuilderIE");
					return false;
				}

				var isEdge = navigator.appVersion.indexOf('Edge') > 0 ? true : false;
				// Or with Edge
				if( app.isInBuilder && isEdge) {
					_core.initError("noBuilderEdge");
					return false;
				}

				// Do not allow viewer under IE 9
				else if ( has("ie") && has("ie") <= 8 ) {
					i18n.viewer.errors.noViewerIE = i18n.viewer.errors.noViewerIE.replace('%VERSION%', 9).replace('%UPGRADE%', i18n.viewer.errors.upgradeBrowser);
					_core.initError("noViewerIE");
					return false;
				}

				// Prevent iPad vertical bounce effect
				// except on few containers that needs that
				/*$(document).bind(
					'touchmove',
					function(e) {
						if( ! $(e.target).parents('#headerMobile, .settings-layout, #mobilePaneList').length )
							e.preventDefault();
					}
				);*/

				// Data Model
				app.data = new Data();

				// Canvas icons
				_myCanvas = document.createElement('canvas');

				_context = _myCanvas.getContext('2d');
				_icon = new Image();
				_icon.src = app.cfg.ICON_SRC;


				_icon.onload = function(){
					_context.drawImage(_icon, 0, 0);
					_context.font = _myCanvas.width/3.8 + "pt open_sanssemibold, sans-serif";
				};

				_this.themeSelected = false;

				/*
				 * Desktop UI
				 */

				app.ui.mainView = this;

				app.ui.tilePanel = new TilePanel($('#contentPanel'), _this, WebApplicationData, app.isInBuilder);
				setTimeout(function(){
					app.ui.detailPanel = new DetailPanel($('#paneLeft'), app.isInBuilder, WebApplicationData, _this, WebApplicationData);
					app.ui.detailPanel.init();
				}, 100);

				app.ui.navBar = new NavBar(
					$("#nav-bar"),
					app.isInBuilder,
					_this.activateLayer,
					builderView
				);

				//app.ui.testPanel.init();
				app.ui.tilePanel.init();

				/*
				 * Mobile UI
				 */

				app.ui.mobileIntro = new MobileIntro(
					$('body'),
					app.isInBuilder,
					function(){ },
					_this
				);

				app.ui.mobileFeatureList = new MobileFeatureList(
					$('#contentPanel'),
					app.isInBuilder,
					function(){ },
					_this
				);

				app.ui.mobileIntro.init();
				app.ui.mobileFeatureList.init();

				var queryString = {};
				var temp = esri.urlToObject(document.location.href).query;
				if (temp) {
					$.each(temp, function(index, value) {
						queryString[index.toLowerCase()] = value;
					});
				}

				// Prevent focus on mousedown
				// Focus stay allowed with keyboard with 508
				$("body").on("mousedown", "*", function(e) {
					if (($(this).is(":focus") || $(this).is(e.target)) && $(this).css("outline-style") == "none") {
						$(this).css("outline", "none").on("blur", function() {
							$(this).off("blur").css("outline", "");
						});
					}
				});

				return true;
			};

			this.webAppConfigLoaded = function()
			{
				//var enableSwitchBuilderBtn = _core.hasSwitchBuilderButton();
				//app.ui.sidePanel.toggleSwitchBuilderButton(enableSwitchBuilderBtn);

				// If the app has been loaded but it's blank it means user come from the gallery
				// FromScratch doesn't get here
				// From the webmap has the webmap id

				app.isGalleryCreation = ! app.data.getWebAppData().getWebmap();/*! app.data.getWebAppData().getOriginalData()
					|| ! Object.keys(app.data.getWebAppData().getOriginalData().values).length;*/
			};

			this.loadFirstWebmap = function(webmapIdOrJSON)
			{
				return this.loadWebmap(webmapIdOrJSON, $("#map")[0]);
			};

			this.loadWebmapFromData = function()
			{
				storyDataReady();
			};

			this.loadWebmap = function(webmapIdOrJSON, container, extent)
			{
				console.log("tpl.core.MainView - loadWebMap - webmapId:", webmapIdOrJSON);

				var popup = new esri.dijit.Popup({
					highlight: false
				}, dojo.create("div"));

				return arcgisUtils.createMap(webmapIdOrJSON, container, {
					mapOptions: {
						slider: true,
						autoResize: false,
						showAttribution: true,
						infoWindow: popup,
						extent: extent,
						wrapAround180: false
					},
					usePopupManager: true,
					bingMapsKey: app.cfg.BING_MAPS_KEY,
					editable: false,
					layerMixins: app.data.getAppProxies()
				});
			};

			this.firstWebmapLoaded = function()
			{
				storyDataReady();
			};

			this.startFromScratch = function()
			{
				initUI();
			};

			this.getMapConfig = function(response)
			{
				var geocoder = app.data.getWebAppData().getGeneralOptions().geocoder ? app.data.getWebAppData().getGeneralOptions().geocoder : false;
				return {
					response: response,
					mapCommand: new MapCommand(
						response.map,
						resetEntryMapExtent,
						_core.zoomToDeviceLocation,
						app.data.getWebAppData().getGeneralOptions().locateButton
					),
					geocoder: new Geocoder(
						response.map,
						app.isInBuilder,
						geocoder,
						populateSearchLayerTitles(response)
					)
				};
			};

			function populateSearchLayerTitles(response) {
				var itemData = response.itemInfo.itemData;
				var appProps = itemData.applicationProperties;
				var searchOptions = appProps && appProps.viewing && appProps.viewing.search;
				var opLyrs = itemData.operationalLayers || [];
				if (!searchOptions) {
					return;
				}

				searchOptions.layers.forEach(function(searchLyrInfo) {
					_.find(opLyrs, function(opLyrInfo) {
						if (opLyrInfo.id === searchLyrInfo.id) {
							searchLyrInfo.name = opLyrInfo.name;
							searchLyrInfo.title = opLyrInfo.title;
							return true;
						}
					});
				});
				return searchOptions;
			}

			this.processExternalData = function(){
				var layers = [];
				$.each(app.map.graphicsLayerIds, function(i, id){
					var possibleLayer = app.map.getLayer(id);
					if(possibleLayer.graphics && possibleLayer.geometryType === 'esriGeometryPoint')
						layers.push(possibleLayer);
				});
				layers.reverse();
				app.data.getWebAppData().setShortlistLayerId(layers[0].id);
				var featServUrl = [];
				var featServLayerIndex = [];

				var featServLayerID = null;
				var layerType;
				var layerFound = false;

				$.each(layers, function(index, layer){
					if(layer.layerType){
						layerType = layer.layerType;
					}else{
						layerType = layer.type;
					}
					if (layer.url && (layerType === 'ArcGISFeatureLayer' || layerType === 'Feature Layer') && !layer.id.match(/^csv_/)) {
						featServLayerID = layer;
						featServUrl.push(layer.url);
						featServLayerIndex.push(index);
					}

					if(layer.graphics.length < 1){
						on.once(layer, 'update-end', function(){
							var fields = layer.fields;
							var tabField;
							$.each(fields, function(index, field){
								if(field.name.toLowerCase() == 'tab_name')
									tabField = true;
							});
							if(tabField){
								buildThemes(layer);
								layerFound = true;
							}
							if(!tabField && index == layers.length - 1){
								var message = i18n.builder.migration.migrationPattern.badData;
								message += '  (<a href="http://links.esri.com/storymaps/shortlist_layer_template" target="_blank" download="">'+i18n.builder.migration.migrationPattern.downloadTemplate+'</a>)';
								$("#fatalError .error-msg").html(message);
								$("#fatalError").show();
								return;
							}
							var layerGraphics = layer.graphics;
							var layerFields = layer.fields;
							app.map.removeLayer(layer);
							var newLayer = new esri.layers.GraphicsLayer({id: app.data.getWebAppData().getShortlistLayerId()+"_copy"});

							newLayer.graphics = layerGraphics;
							newLayer.fields = layerFields;
							app.map.addLayer(newLayer);
							app.data.getWebAppData().setShortlistLayerId(newLayer.id);
							buildThemes(newLayer, 0);
							return;
						});
						layer.on('update-end', function(){
							/*var themeIndex = $('.entry.active').index();
							_this.activateLayer(themeIndex);*/
						});
						app.map.on('zoom-start', function(){
							layer.hide();
						});
						app.map.on('zoom-end', function(){
							layer.show();
						});
						/*dojo.connect(layer, 'onUpdateEnd', function(){
							var fields = layer.fields;
							var tabField;
							$.each(fields, function(index, field){
								if(field.name.toLowerCase() == 'tab_name')
									tabField = true;
							});
							if(tabField){
								buildThemes(layer, featServLayerIndex);
								layerFound = true;
							}
							if(!tabField && index == layers.length - 1){
								var message = i18n.builder.migration.migrationPattern.badData;
								message += '  (<a href="http://links.esri.com/storymaps/shortlist_layer_template" target="_blank" download="">'+i18n.builder.migration.migrationPattern.downloadTemplate+'</a>)';
								$("#fatalError .error-msg").html(message);
								$("#fatalError").show();
								return;
							}
						});*/
					}else{
						if(layerFound)
							return;
						var fields = layer.fields;
						var tabField;
						$.each(fields, function(index, field){
							if(field.name.toLowerCase() == 'tab_name')
								tabField = true;
						});
						if(tabField){
							var layerGraphics = layer.graphics;
							var layerFields = layer.fields;
							app.map.removeLayer(layer);
							var newLayer = new esri.layers.GraphicsLayer({id: app.data.getWebAppData().getShortlistLayerId()+"_copy"});

							newLayer.graphics = layerGraphics;
							newLayer.fields = layerFields;
							app.map.addLayer(newLayer);
							app.data.getWebAppData().setShortlistLayerId(newLayer.id);
							buildThemes(newLayer);
							layerFound = true;
						}
						if(!tabField && index == layers.length - 1){
							var message = i18n.builder.migration.migrationPattern.badData;
							message += '  (<a href="http://links.esri.com/storymaps/shortlist_layer_template" target="_blank" download="">'+i18n.builder.migration.migrationPattern.downloadTemplate+'</a>)';
							$("#fatalError .error-msg").html(message);
							$("#fatalError").show();
							return;
						}

					}
				});
				$('home-location-save-btn').remove();
			};

			function buildThemes(layer)
			{
				var themes = [];
				var newThemes = [];
				var fields = layer.fields;

				var name = false;
				var pic = false;
				var featureNumber = null;
				$.each(fields, function(index, field){
					if(field.name.toLowerCase() == 'name')
						name = true;
					if(field.name.toLowerCase() == 'pic_url')
						pic = true;
					if(field.name.toLowerCase() == 'number')
						featureNumber = field.name;
				});

				// If layer does not contain a name or pic field, we return error.
				// Since this is an existing web map, we assume location is present.
				if(!name || !pic){
					if(app.isInBuilder)
					{
						var message = i18n.builder.migration.migrationPattern.badData;
						message += '  (<a href="http://links.esri.com/storymaps/shortlist_layer_template" target="_blank" download="">'+i18n.builder.migration.migrationPattern.downloadTemplate+'</a>)';
						$("#fatalError .error-msg").html(message);
						$("#fatalError").show();
					}

					return false;
				}

				app.data.setShortlistLayerId(layer.id);
				app.data.getWebAppData().setShortlistLayerId(layer.id);
				layer.setScaleRange(0,0);
				layer.on("mouse-over", _this.layer_onMouseOver);
				layer.on("mouse-out", _this.layer_onMouseOut);
				layer.on("click", _this.layer_onClick);

				var supportingLayers = [];
				$.each(app.map.graphicsLayerIds, function(index, id){
					if(id !== layer.id)
						supportingLayers.push(app.map.getLayer(id));
				});
				$.each(supportingLayers, function(index, supportingLayer){
					supportingLayer.on('click', baselayer_onClick);
				});

				if(app.isInBuilder){
					app.map.on('pan-start', function(){
						app.ui.mainView.mapIsPanning = false;
					});
					app.map.on('pan-end', function(){
						setTimeout(function(){
							app.ui.mainView.mapIsPanning = false;
						}, 800);
					});

					app.map.on('zoom-start', function(){
						app.ui.mainView.mapIsZooming = false;
					});
					app.map.on('zoom-end', function(){
						setTimeout(function(){
							app.ui.mainView.mapIsZooming = false;
						}, 800);
					});
				}

				app.map.on('click',function(e){
					if(_this.mapIsPanning || _this.mapIsZooming)
						return;
					if(app.mapTips){
						if(!e.graphic){
							app.mapTips.clean(true);
							if(_this.selected && !app.isInBuilder)
								_this.selected.hidden = true;
						}else{
							if(_this.selected)
								_this.selected.hidden = false;
						}
					}
				});

				app.map.reorderLayer(layer, app.map.graphicsLayerIds.length);

				$.each(layer.graphics, function(index, graphic){
					var atts = layer.graphics[index].attributes;
					var tabField = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'tab_name';})[0]];
					if(!tabField)
						return;
					if(newThemes.indexOf(tabField) < 0) {
						newThemes.push(tabField);
						themes.push({
							features:[],
							extent: null,
							title: tabField
						});
						var themeIndex = themes.length - 1;
						themes[themeIndex].id = themeIndex;
						var color;
						if(!app.data.getWebAppData().getTabs()[themeIndex] || !app.data.getWebAppData().getTabs()[themeIndex].color){
							var colorIndex = themeIndex;
							if(colorIndex > 7)
								colorIndex = colorIndex % 7;

							var colorOrder = app.cfg.COLOR_ORDER.split(",");
							var colorScheme = $.grep(app.cfg.COLOR_SCHEMES, function(n){
								return n.name.toLowerCase() == $.trim(colorOrder[colorIndex].toLowerCase());
							})[0];
							color = colorScheme.color;
						} else{
							color = app.data.getWebAppData().getTabs()[themeIndex].color;
						}

						themes[themes.length - 1].color = color;
						app.data.setStory(themeIndex, tabField, color);
					}
					$.grep(themes,function(n, i){if(n.title == tabField){
						graphic.attributes.tab_id = i;
						graphic.attributes.shortlist_id = themes[i].features.length + 1;
						if(!featureNumber)
							graphic.attributes.number = themes[i].features.length + 1;
						else{
							graphic.attributes.number = graphic.attributes[featureNumber];
						}
						n.features.push(graphic);
					}});
				});
				if(featureNumber){
					//order features
					layer.graphics.sort(SortByNumber);
				}
				var colors = {
					header: app.data.getWebAppData().getThemeOptions().headerColor,
					tabText: '#d8d8d8',
					tab: '#666',
					tabTextActive: '#fff',
					tabActive: app.data.getStory()[0].color,
					tabTextHover: '#fff',
					tabHover: '#666'
				};
				app.ui.navBar.init(themes, 0, colors, app.data.getWebAppData());

				if(themes.length == 1 && !app.isInBuilder)
					$(".entries").css("display", "none");

				$.each(themes, function(index, theme){
					_this.buildLayer(
						theme.features/*.sort(SortByNumber)*/,
						theme.color
					);
					app.ui.mobileIntro.fillList(index, theme, themes);
					var oneTheme = false;
					if(themes.length == 1){
						oneTheme = true;
						$('#navThemeLeft').addClass('hideButtons');
						$('#navThemeRight').addClass('hideButtons');
					}
					app.ui.mobileFeatureList.addTheme(theme, oneTheme, index);
				});

				_this.activateLayer(0, themes);
				$('#basemapChooser').remove();
				_core.appInitComplete(WebApplicationData);
				if(app.data.getWebAppData().getIsExternalData() && app.isWebMapFirstSave){
					setTimeout(function(){
						_core.displayApp();
					}, 0);
				}


			}

			function storyDataReady()
			{
				//
				// Do stuff
				//

				/*app.ui.testPanel.update({
					data: WebApplicationData.getStoryTestPanel()
				});*/

				if($.isEmptyObject(app.data.getWebAppData().getThemeOptions()))
					app.data.getWebAppData().setDefaultThemeOptions();

				if(app.data.getWebAppData().getIsExternalData()){
					app.data.getWebAppData().setMapExtent(app.maps[app.data.getWebAppData().getWebmap()].response.map.extent);
				}

				if(app.data.getWebAppData().getGeneralOptions().bookmarks && app.maps[app.data.getWebAppData().getWebmap()].response.itemInfo.itemData.bookmarks && app.maps[app.data.getWebAppData().getWebmap()].response.itemInfo.itemData.bookmarks.length)
					app.ui.navBar.initBookmarks();

				if (app.data.getWebAppData().getWebmap()) {
					app.mapItem = app.maps[app.data.getWebAppData().getWebmap()].response.itemInfo;
				}

				//TODO add ORG geocoders
				if(app.data.getWebAppData().getGeneralOptions().geocoder && !app.isInBuilder){
					app.maps[app.data.getWebAppData().getWebmap()].geocoder.toggle(true);
				}

				if(!app.map)
					return;

					setTimeout(function(){
						// HERE-EXTENT
						/*if(app.data.getWebAppData().getTabs() && app.data.getWebAppData().getTabs()[0] && app.data.getWebAppData().getTabs()[0].extent){
							var tabExtent = new Extent(app.data.getWebAppData().getTabs()[0].extent);
							var fitExtent = true;//app.data.getWebAppData().getSettings().generalOptions.extentMode == 'default' ? true : false;
							if(fitExtent)
								app.appCfg.mapExtentFit = true;
							setTimeout(function(){
								app.map.setExtent(tabExtent, fitExtent);
							}, 500);
						}*/
						if(app.data.getWebAppData().getMapExtent()){
							setTimeout(function(){
								var handle = app.map.on('extent-change', function(){
									handle.remove();
									_core.displayApp();
								});
								var mapExtent = new Extent(app.data.getWebAppData().getMapExtent());
								if ( app.map.spatialReference.wkid != 102100 && app.map.spatialReference.wkid != 4326 ){
									mapExtent = esriConfig.defaults.geometryService.project([mapExtent], app.map.spatialReference, function(geom){
										mapExtent = geom[0];
										app.map.setExtent(mapExtent, true);
									});
								}else{
									app.map.setExtent(mapExtent, true);
								}
							}, 500);
						}
						else if(app.data.getWebAppData().getTabs() && app.data.getWebAppData().getTabs()[0] && app.data.getWebAppData().getTabs()[0].extent){
							var tabExtent = new Extent(app.data.getWebAppData().getTabs()[0].extent);
							var fitExtent = true;//app.data.getWebAppData().getSettings().generalOptions.extentMode == 'default' ? true : false;
							if(fitExtent)
								app.appCfg.mapExtentFit = true;
							var handle = app.map.on('extent-change', function(){
								handle.remove();
								_core.displayApp();
							});
							setTimeout(function(){
								if ( app.map.spatialReference.wkid != 102100 && app.map.spatialReference.wkid != 4326 ){
									tabExtent = esriConfig.defaults.geometryService.project([tabExtent], app.map.spatialReference, function(geom){
										tabExtent = geom[0];
										app.map.setExtent(tabExtent, fitExtent);
									});
								}else{
									app.map.setExtent(tabExtent, fitExtent);
								}
							}, 500);
						}
						else if(app.isDirectCreationFirstSave){
							var handle = app.map.on('extent-change', function(){
								handle.remove();
								_core.displayApp();
							});
							app.map.centerAndZoom([0,0], 3);
						}
						else{
							var handle = app.map.on('extent-change', function(){
								handle.remove();
								_core.displayApp();
							});
							setTimeout(function(){
								app.map.setExtent(app.map._params.extent);
							}, 500);
						}

						// TODO place after app is done loading and changing extents
						app.map.on('extent-change', function(){
							setTimeout(function(){
								if(app.data.getWebAppData().getGeneralOptions().filterByExtent  && !app.isInBuilder){
									app.ui.tilePanel.refreshList();
									app.ui.mobileFeatureList.refreshMobileList();
									if(app.ui.detailPanel.loaded){
										//TODO issue #164.  Could be map is not done changing
										//setTimeout(function(){
											app.ui.detailPanel.refreshSlides();
										//}, 5000)

										/*if(_this.selected){
											setTimeout(function(){
												if(app.ui.detailPanel.loaded)
													app.ui.detailPanel.showDetails(_this.selected);
											}, 0);
										}*/
									}
								} else {
									/*if(app.ui.detailPanel.loaded){
										if(_this.selected){
											setTimeout(function(){
												if(app.ui.detailPanel.loaded)
													app.ui.detailPanel.showDetails(_this.selected);
											}, 0);
										}
									}*/
								}
							}, 0);
						});
						/*if ( ! app.isDirectCreation )
							setTimeout(function(){
								_core.displayApp();
							}, 500);*/
					}, 750);

				app.ui.mobileIntro.setTitle();

				var headerColor = app.data.getWebAppData().getThemeOptions().headerColor;
				$('#header').css('background-color', headerColor);
				$('#mobileIntro').css('background-color', headerColor);

				if(WebApplicationData.getTabs()){
					$.each(WebApplicationData.getTabs(), function(i, tab){
						app.data.setStory(i, tab.title, tab.color, tab.extent);
					});
				}

				var shortlistLayerId = $.grep(app.map.graphicsLayerIds, function(e){
					if(e.split('_').slice(0,-1).join('_') == WebApplicationData.getShortlistLayerId())
						return e;
					else if(e ==WebApplicationData.getShortlistLayerId())
						return e;
					else{
						return false;
					}
				});
				app.data.setShortlistLayerId(shortlistLayerId[0]);

				if(app.map.loaded){
					initMap();
				} else{
					app.map.on("load",function(){
						initMap();
					});
				}

				if (builderView) {
					builderView.storyDataReady();
				}
			}

			function initMap() {
				if(app.data.getWebAppData().getIsExternalData()){
					_this.processExternalData();
					return;
				}
				app.map.resize();

				app.map.on('click',function(e){
					if(_this.mapIsPanning || _this.mapIsZooming)
						return;
					if(app.mapTips){
						if(!e.graphic){
							app.mapTips.clean(true);
							if(_this.selected && !app.isInBuilder)
								_this.selected.hidden = true;
						}else{
							if(_this.selected)
								_this.selected.hidden = false;
						}
					}
				});

				var themes = [];

				$.each(WebApplicationData.getTabs(), function(index, tab){
					themes.push({
						features:[],
						title: tab.title,
						color: tab.color,
						extent: tab.extent
					});
				});

				if(!app.data.getWebAppData().getIsExternalData()){
					var shortlistLayerId = app.map.getLayer(app.data.getWebAppData().getShortlistLayerId()) ?
						app.data.getWebAppData().getShortlistLayerId()
						: app.data.getWebAppData().getShortlistLayerId()+"_0";
					app.data.getWebAppData().setShortlistLayerId(shortlistLayerId);
				}
				var shortlistLayer = app.map.getLayer(app.data.getWebAppData().getShortlistLayerId());
				shortlistLayer.setScaleRange(0,0);

				$.each(shortlistLayer.graphics, function(index, graphic){
					if(graphic.attributes.locationSet && graphic.attributes.name && graphic.attributes.name != "Unnamed Place" && graphic.attributes.pic_url && !app.isInBuilder){
						themes[graphic.attributes.tab_id].features.push(graphic);
					}
					if(app.data.getWebAppData().getIsExternalData()){
						var atts = graphic.attributes;
						var tabName = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'tab_name';})[0]];
						$.grep(themes,function(n, i){if(n.title == tabName){ graphic.attributes.tab_id = i;}});
						themes[graphic.attributes.tab_id].features.push(graphic);
						graphic.attributes.shortlist_id = themes[graphic.attributes.tab_id].features.length/* + 1*/;
					}else if(app.isInBuilder){
						themes[graphic.attributes.tab_id].features.push(graphic);
					}
				});

				shortlistLayer.on("click", _this.layer_onClick);
				shortlistLayer.on("mouse-over", _this.layer_onMouseOver);
				shortlistLayer.on("mouse-out", _this.layer_onMouseOut);

				var supportingLayers = [];
				$.each(app.map.graphicsLayerIds, function(index, id){
					if(id !== shortlistLayer.id)
						supportingLayers.push(app.map.getLayer(id));
				});
				$.each(supportingLayers, function(index, layer){
					layer.on('click', baselayer_onClick);
				});
				if (themes.length > 1 || (app.isInBuilder && !app.isDirectCreationFirstSave)) {
					$('#divStrip').height('35px');

					$.each(themes, function(index, theme){
						app.ui.tilePanel.createTab(index, theme);
						app.ui.mobileIntro.fillList(index, theme, themes);
						app.ui.mobileFeatureList.addTheme(theme, null, index);

						var colorIndex = index;
						if(colorIndex > 7)
							colorIndex = colorIndex % 7;

						var colorOrder = app.cfg.COLOR_ORDER.split(",");
						var colorScheme = $.grep(app.cfg.COLOR_SCHEMES, function(n){
							return n.name.toLowerCase() == $.trim(colorOrder[colorIndex].toLowerCase());
						})[0];
						var color = theme.color || colorScheme.color;

						_this.buildLayer(
							theme.features.sort(SortByNumber),
							color
						);

						if(app.isInBuilder){
							app.data.setStory(index, theme.title, colorScheme.color, theme.extent);
							var tabSettings = lang.clone(app.data.getStory());
							$.each(tabSettings, function(index, tab){
								tab.title = theme.title;
								tab.color = color;
							});
							//WebApplicationData.setTabs(tabSettings);
							app.detailPanelBuilder.addDetailPanelSwiper(index);
						}

						app.data.setStory(index, theme.title, theme.color);
					});
					if(!app.isDirectCreationFirstSave && !app.data.getWebAppData().getIsExternalData()){
						var colors = {
							header: app.data.getWebAppData().getThemeOptions().headerColor,
							tabText: '#d8d8d8',
							tab: '#666',
							tabTextActive: '#fff',
							tabActive: '#999',
							tabTextHover: '#fff',
							tabHover: '#666'
						};
						var entryIndex = 0;
						app.ui.navBar.init(
							themes,
							entryIndex,
							colors,
							WebApplicationData
						);
						app.ui.tilePanel.setTabClick();
					}
				}
				else if(themes.length < 1) {
					//var errorMsg = "NO VALID SHORTLIST POINT LAYERS";
					//initError(null, errorMsg);
					return false;
				}
				else {
					$.each(themes, function(index, theme){
						app.ui.tilePanel.createTab(index, theme);
						//app.ui.mobileTileList.createSlide(value.title);
						//app.ui.mobileIntro.fillList(index, value);
						app.ui.mobileFeatureList.addTheme(theme, true, index);

						var colorOrder = app.cfg.COLOR_ORDER.split(",");
						var colorScheme = $.grep(app.cfg.COLOR_SCHEMES, function(n){
							return n.name.toLowerCase() == $.trim(colorOrder[index].toLowerCase());
						})[0];
						var color = theme.color || colorScheme.color;

						_this.buildLayer(
							theme.features.sort(SortByNumber),
							color
						);

						if(app.isInBuilder){
							app.data.setStory(index, theme.title, colorScheme.color);
							var tabSettings = lang.clone(app.data.getStory());
							$.each(tabSettings, function(index, tab){
								tab.title = theme.title;
								tab.color = color;
							});
							//WebApplicationData.setTabs(tabSettings);
							app.detailPanelBuilder.addDetailPanelSwiper(index);
						}
					});
					$(".tab").css("display", "none");
					$('#mobileIntro').append("<br><hr></hr>");
					$('#mobileIntro').append('<ul id="mobileThemeList" class="mobileTileList">');
					var introList = $('<li class="mobileTitleTheme" onclick="app.ui.mobileIntro.selectMobileTheme(' + 0 + ')">').append('<div class="startButton"> ' + i18n.viewer.general.start + '</div>');
					$('#mobileThemeList').append(introList);
					$('#navThemeLeft').addClass('hideButtons');
					$('#navThemeRight').addClass('hideButtons');
					$('#nav-bar').show();
					$('#nav-bar .entries').hide();
				}

				_core.handleWindowResize();

				_this.activateLayer(0);
				if(app.isInBuilder){
					app.detailPanelBuilder.buildSlides();
				}
				$('.entryLbl').css("outline-style", 'none');

				//app.map.infoWindow.on("hide",infoWindow_onHide);
				//TODO on event correct?
				/*on($(".esriPopup .titleButton.close")[0],"onclick",function(){
					_lastFocus = null;
				});*/
				$("#zoomToggle").css("visibility","visible");
				$("#whiteOut").fadeOut("slow");
				if($("body").width() > 768){
					$("#paneLeft").height($("#contentPanel").height() - $('#tabs').height());
					$("#paneLeft").css('top',$('#divStrip').height());
					$("#map").height($("#contentPanel").height());
					$("#map").css('top', 0);
					$(".tilelist").height($("#paneLeft").height() - 25);
				} else{
					app.ui.mobileIntro.resizeMobileElements();
				}

				_core.appInitComplete(WebApplicationData);

				/******************************************************
				 ****************** 508 *******************************
				 ******************************************************/

				// Prevent focus on mousedown
				// Focus stay allowed with keyboard with 508
				$("body").on("mousedown", "*", function(e) {
					//_lastFocus = null;
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
					}
				});

				app.map.disableKeyboardNavigation();

				//Use enter/return key on focused element to trigger click event
				//Use +/- keys to zoom in/out of map
				$('body').keypress(function(e){
					if(e.which == 13){ //enter/return
						$(document.activeElement).click();
					}
					if(e.which == 43) { //'+'
					app.map.setLevel(app.map.getLevel()+1);
						$("#zoomIn").focus();
						_this.hideBookmarks();
					}
					if(e.which == 45) { //'-'
						app.map.setLevel(app.map.getLevel()-1);
						$("#zoomOut").focus();
						_this.hideBookmarks();
					}
				});

				// Make sure shortlist layer is above all other layers (i.e. mapnotes);
				app.map.reorderLayer(app.data.getWebAppData().getShortlistLayerId(), app.map.graphicsLayerIds.length - 1);
			}

			this.activateLayer = function(index, builtThemes) {
				var tabFeatures = [];
				if(builtThemes)
					_builtThemes = builtThemes;
				var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());

				if(app.isInBuilder)
					app.detailPanelBuilder.checkTempLayer();

				$.each(shortlistLayer.graphics,function(i,graphic){
					var atts = graphic.attributes;
					var tabName = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'tab_name';})[0]];
					if(!app.data.getWebAppData().getIsExternalData() && atts.tab_id != index){
						graphic.hide();
					}else if(app.data.getWebAppData().getIsExternalData() && tabName != app.data.getStory()[index].title){
						graphic.hide();
					}else{
						if(app.data.getWebAppData().getIsExternalData()){
							if(app.isInBuilder){
								graphic.show();
								tabFeatures.push(graphic);
							}else{
								var name = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'name';})[0]];
								var picURL = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'name';})[0]];
								if(name && picURL){
									graphic.show();
									tabFeatures.push(graphic);
								}
							}
						}else{
							if(!app.isInBuilder && graphic.attributes.locationSet && graphic.attributes.name && graphic.attributes.name != "Unnamed Place" && graphic.attributes.pic_url){
								graphic.show();
								tabFeatures.push(graphic);
							}
							else if(app.isInBuilder){
								tabFeatures.push(graphic);
								if(graphic.attributes.locationSet)
									graphic.show();
								else{
									graphic.hide();
								}
							}else{
								graphic.hide();
							}
						}
					}
				});

				var layer = new esri.layers.GraphicsLayer();
				layer.graphics = tabFeatures;

				//Need to do for each tab/swiper, not here
				var tabColor = app.data.getStory()[index].color;
				layer.color = tabColor;

				app.layerCurrent = layer;
				app.layerCurrent.color = app.data.getStory()[index].color;

				shortlistLayer.redraw();

				app.ui.mobileFeatureList.setColor();

				if(app.mapTips)
					app.mapTips.clean(true);
				_this.preSelection();
				_this.selected = null;
				_this.postSelection();

				if(!($.isEmptyObject(app.cfg.TAB_SPECIFIC_SUPPORT_LAYERS))){
					var supportLayers = WebApplicationData.getSupportLayers();
					var tab = 'tab' + String(index + 1);
					var tabSpecificSupportLayers = app.cfg.TAB_SPECIFIC_SUPPORT_LAYERS[tab];
					$.each(supportLayers, function(index, layer){
						if(tabSpecificSupportLayers && tabSpecificSupportLayers.indexOf(layer.name) > -1){
							layer.setVisibility(true);
						} else{
							layer.setVisibility(false);
						}
					});
				}

				$(".detailContainer").hide();

				app.ui.tilePanel.buildTilePanel(/*WebApplicationData.getContentLayers()*/);

				app.ui.navBar.showEntryIndex(index);

				// Active entry
				setTimeout(function(){
					CommonHelper.addCSSRule(
						".nav-bar .entry.active > .entryLbl, \
						.nav-bar .dropdown.active .dropdown-toggle { \
							background-color: " + app.data.getStory()[index].color  + " !important; \
						}",
						"NavBarActive"
					);
				}, 0);

				$('#contentPanel').css('border-top-color', app.data.getStory()[index].color);
				$('.detailHeader').css('border-top-color', app.data.getStory()[index].color);

				var timeoutTime = index === 0 ? 500 : 100;
				setTimeout(function(){

					if(app.isInBuilder && !app.data.getWebAppData().getIsExternalData()){
						//TODO if in builder mode, build slides in builder detail panel
					} else {
						app.ui.detailPanel.buildFeatureViews(_builtThemes);
					}

				}, timeoutTime);

				if(app.isInBuilder && !app.data.getWebAppData().getIsExternalData())
					app.addFeatureBar.updateLocatedFeatures();
				else{
					app.ui.detailPanel.refreshSlides();
				}
			};

			this.unselect = function()
			{
				_this.preSelection();
				_this.selected = null;
				_this.postSelection();
			};

			this.preSelection = function()
			{
				// return the soon-to-be formerly selected graphic icon to normal
				// size & dim the corresponding tile.
				if (_this.selected  && _this.selected.symbol && _this.selected.symbol.setWidth) {
					_this.selected.symbol.setWidth(_this.lutIconSpecs.tiny.getWidth());
					_this.selected.symbol.setHeight(_this.lutIconSpecs.tiny.getHeight());
					_this.selected.symbol.setOffset(_this.lutIconSpecs.tiny.getOffsetX(), _this.lutIconSpecs.tiny.getOffsetY());
					_this.selected.draw();
					if(app.mapTips)
						app.mapTips.clean(true);
				}

			};

			this.postSelection = function()
			{
				if (_this.selected == null) {
					app.map.infoWindow.hide();
				} else {
					if(!_this.selected.attributes.locationSet && !app.isInBuilder && !app.data.getWebAppData().getIsExternalData())
						return;
					if(!app.map.extent.contains(_this.selected.geometry) && (_this.selected.attributes.locationSet || app.data.getWebAppData().getIsExternalData())){
						app.map.centerAt(_this.selected.geometry);
					}
					setTimeout(function(){
						_this.buildMapTips();
					}, 250);
					if(app.isInBuilder && !app.data.getWebAppData().getIsExternalData())
						app.detailPanelBuilder.showSlide(_this.selected.attributes.shortlist_id);
					else {
						if(_iOS)
							app.ui.detailPanel.buildSlide(_this.selected);
						else{
							app.ui.detailPanel.showDetails(_this.selected);
						}
					}

					app.ui.mobileIntro.hide();
					app.ui.mobileFeatureList.setColor();
				}

			};

			this.buildMapTips = function(content){
				setTimeout(function(){
					if(!_this.selected || !_this.selected.attributes || _this.selected.hidden || (!_this.selected.attributes.locationSet && !app.data.getWebAppData().getIsExternalData())/*|| !_this.selected.visible*/){
						if(app.mapTips)
							app.mapTips.clean(true);
						return;
					}
					if(app.mapTips){
						if((!app.map.extent.contains(_this.selected.geometry) && app.data.getWebAppData().getGeneralOptions().filterByExtent && !app.isInBuilder)){
							app.mapTips.clean(true);
							return;
						}
					}
					if($('body').hasClass('mobile-view')){
						if(app.mapTips)
							app.mapTips.clean(true);
						if(_this.selected)
							_this.selectSymbol();
						return;
					}

					if(content)
						app.mapTips.clean(true);
					var atts = _this.selected.attributes;
					var name = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'name';})[0]];
					if(!name)
						_this.selected.attributes.name = 'Unnamed Place';
					var labelContent = content ? content : name;
					app.mapTips = new MultiTips({
						map: app.map,
						content: labelContent,
						selected: _this.selected && _this.selected.hidden !== true ? _this.selected : null,
						pointArray: [_this.selected],
						labelDirection: "auto",
						backgroundColor: app.cfg.SELECTED_POPUP_BACKGROUND_COLOR,
						borderColor: app.cfg.SELECTED_POPUP_BORDER_COLOR,
						pointerColor: app.cfg.SELECTED_POPUP_ARROW_COLOR,
						textColor: "#ffffff",
						offsetTop: 44,
						topLeftNotAuthorizedArea: [40, 180],
						mapAuthorizedMinWidth: -1,
						mapAuthorizedWidth: -1,
						mapAuthorizedHeight: -1,
						visible: true
					});

					_this.selectSymbol();
				}, 100);
			};

			this.selectSymbol = function()
			{
				// make the selected location's icon LARGE
				if(_this.selected.symbol.width == _this.lutIconSpecs.large.getWidth())
					return;
				_this.selected.symbol.setWidth(_this.lutIconSpecs.large.getWidth());
				_this.selected.symbol.setHeight(_this.lutIconSpecs.large.getHeight());
				_this.selected.symbol.setOffset(_this.lutIconSpecs.large.getOffsetX(), _this.lutIconSpecs.large.getOffsetY());
				_this.selected.draw();
				app.map.getLayer(app.data.getWebAppData().getShortlistLayerId()).redraw();

				// calling moveToFront directly after messing
				// with the symbol causes problems, so I
				// put it on a delay and put it in a try/catch
				// just to be safe...
				setTimeout(function(){
					try {
						_this.selected.getShape().moveToFront();
					} catch (err) {
						console.log("problem with 'moveToFront()'...");
					}
				},10);
			};

			this.buildMapHoverTips = function(content, point){
				if(app.mapTips && ($('body').hasClass('mobile-view') || (!point.attributes.locationSet && !app.data.getWebAppData().getIsExternalData()))){
					app.mapTips.clean(true);
					return;
				}
				/*if(app.mapTips)
					app.mapTips.clean(true);*/
				var offsetTop = point == _this.selected ? 44 : 33;
				var atts = point.attributes;
				var name = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'name';})[0]];
				if(!name)
					point.attributes.name = 'Unnamed Place';
				app.mapTips = new MultiTips({
					map: app.map,
					content: content,
					selected: _this.selected && _this.selected.hidden !== true ? _this.selected : null,
					pointArray: [point],
					labelDirection: "auto",
					backgroundColor: app.cfg.POPUP_BACKGROUND_COLOR,
					borderColor: app.cfg.POPUP_BORDER_COLOR,
					pointerColor: app.cfg.POPUP_ARROW_COLOR,
					textColor: "#ffffff",
					offsetTop: offsetTop,
					topLeftNotAuthorizedArea: [40, 180],
					mapAuthorizedMinWidth: -1,
					mapAuthorizedWidth: -1,
					mapAuthorizedHeight: -1,
					visible: true
				});
			};

			this.buildMapSupportHoverTips = function(content, point){
				if(app.mapTips && $('body').hasClass('mobile-view')){
					app.mapTips.clean(true);
					return;
				}
				/*if(app.mapTips)
					app.mapTips.clean(true);*/
				app.mapTips = new MultiTips({
					map: app.map,
					content: content,
					selected: _this.selected && _this.selected.hidden !== true ? _this.selected : null,
					pointArray: [point],
					labelDirection: "auto",
					backgroundColor: app.cfg.POPUP_BACKGROUND_COLOR,
					borderColor: app.cfg.POPUP_BORDER_COLOR,
					pointerColor: app.cfg.POPUP_ARROW_COLOR,
					textColor: "#ffffff",
					offsetTop: 5,
					topLeftNotAuthorizedArea: [40, 180],
					mapAuthorizedMinWidth: -1,
					mapAuthorizedWidth: -1,
					mapAuthorizedHeight: -1,
					visible: true
				});
			};

			this.moveGraphicToFront = function(graphic)
			{
				//IE Edge issue with icons not being selectible
				if(!graphic)
					return;
				var dojoShape = graphic.getDojoShape();
				if (dojoShape) dojoShape.moveToFront();
			};

			this.buildLayer = function(arr,color) {
				var spec = _this.lutIconSpecs.tiny;
				var coloredIcon;
				var newCanvas = document.createElement('canvas');
				newCanvas.width = _icon.width;
				newCanvas.height = _icon.height;
				var newContext = newCanvas.getContext('2d');
				newContext.font = newCanvas.width/3.8 + "pt pt open_sanssemibold, sans-serif";
				newContext.drawImage(_myCanvas, 0, 0);
				var newIconColor = color;

				// examine every pixel,
				// change any old rgb to the new-rgb
				if(!coloredIcon){
					// pull the entire image into an array of pixel data
					var imageData = newContext.getImageData(0, 0, _myCanvas.width, _myCanvas.height);
					// Due to browser iconsistency, we need to find the value the browser interprets
					// for a pixel we know contains the color we will look to replace.
					var iconColor = getPixel(imageData, 4804);
					if(!(iconColor[0] == hexToRgb(newIconColor).r && iconColor[1] == hexToRgb(newIconColor).g && iconColor[2] == hexToRgb(newIconColor).b))
					{
						for (var i=0;i<imageData.data.length;i+=4)
						{
							// is this pixel the old rgb?
							if(imageData.data[i]==iconColor[0] &&
								imageData.data[i+1]==iconColor[1] &&
								imageData.data[i+2]==iconColor[2]
							){
								// change to your new rgb
								imageData.data[i]=hexToRgb(newIconColor).r;
								imageData.data[i+1]=hexToRgb(newIconColor).g;
								imageData.data[i+2]=hexToRgb(newIconColor).b;
							}
						}
						// put the altered data back on the canvas
						newContext.putImageData(imageData,0,0);
					}
					coloredIcon = imageData;
				}
				$.each(arr, function(index, point) {


					if(index > 0)
						newContext.putImageData(coloredIcon,0,0);

					if(WebApplicationData.getGeneralOptions().numberedIcons){
						var label = point.attributes.number;//index + 1;
						newContext.textAlign = "center";
						newContext.fillStyle = 'white';
						newContext.fillText(label, newCanvas.width/3.2, newCanvas.height/2);
					}

					point.setSymbol(createSymbol(index, newCanvas, spec));
				});
				app.map.getLayer(app.data.getWebAppData().getShortlistLayerId()).show();
			};

			function getPixel(imgData, index) {
				var i = index*4, d = imgData.data;
				return [d[i],d[i+1],d[i+2],d[i+3]]; // returns array [R,G,B,A]
			}

			function hexToRgb(hex) {
				// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
				var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
				hex = hex.replace(shorthandRegex, function(m, r, g, b) {
					return r + r + g + g + b + b;
				});

				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				} : null;
			}

			function createSymbol(index, newCanvas, spec){
				var markerSymbol = new esri.symbol.PictureMarkerSymbol(
					newCanvas.toDataURL(),
					spec.getWidth(),
					spec.getHeight()
				).setOffset(
					spec.getOffsetX(),
					spec.getOffsetY()
				);
				return markerSymbol;
			}

			function baselayer_onMouseOver(event)
			{
				if (_helper.isMobile())
					return;
				app.map.setMapCursor("pointer");
				var graphic = event.graphic;
				//TODO map tips for support layers
				var point = {};
				point.geometry = screenUtils.toMapPoint(app.map.extent, app.map.width, app.map.height, event.screenPoint);
				_this.buildMapSupportHoverTips(graphic.attributes.name, point);
			}

			function baselayer_onMouseOut()
			{
				if (_helper.isMobile())
					return;
				app.map.setMapCursor("default");
				app.mapTips.clean();
			}

			function baselayer_onClick(event) {
				_this.selected = null;
				$('#mobileTitlePage').css('display', 'none');
				var popup = $('.esriPopup')[0];

				app.map.infoWindow.on('set-features', function(){
					if(app.ui.mainView.selected)
						return;
					$('.esriPopup').removeClass('app-hidden');
					$(popup).show();
				});
				if(app.ui.mobileIntro.screenSize != 'small'){
					if(app.mapTips)
						app.mapTips.clean();
				}
				else {
					/*$(popup).hide();
					var graphic = event.graphic;
					//TODO map tips for support layers
					var point = {};
					point.geometry = screenUtils.toMapPoint(app.map.extent, app.map.width, app.map.height, event.screenPoint);
					_this.buildMapSupportHoverTips(graphic.attributes.name, point);*/
				}

			}

			this.layer_onClick = function(event)
			{
				if ($('body').hasClass('pickLocation') || _this.mapIsZooming || _this.mapIsPanning)
					return;
				// IE fire an extra event after the renderer is updated that we need to filter
				_filterMouseHoverEvent = true;
				_this.preSelection();
				_this.selected = null;
				_this.selected = event.graphic;
				_this.postSelection();

				$('#mobileTitlePage').css('display', 'none');
				var popup = $('.esriPopup');
				//$(popup).hide();
				$(popup).addClass('app-hidden');

				// IE
				setTimeout(function(){
					_filterMouseHoverEvent = false;
				}, 500);

				if(!_this.themeSelected)
					app.ui.mobileFeatureList.selectTheme(0);
				_this.themeSelected = true;
			};

			this.layer_onMouseOver = function(event)
			{
				if (_filterMouseHoverEvent || $('body').hasClass('pickLocation') || _this.mapIsZooming || _this.mapIsPanning)
					return;
				if (_helper.isMobile()) return;
				app.map.setMapCursor("pointer");
				var graphic = event.graphic;
				var pt = app.map.toScreen(graphic.geometry);
				if (graphic == _this.selected && _this.selected.hidden !== true && $('#header').css('display') == 'block')
					return;
				else{
					if (graphic == _this.selected && _this.selected.hidden === true) {
						if(app.isInBuilder)
							return;
						//do nothing
					}
					else {
						graphic.symbol.setWidth(_this.lutIconSpecs.medium.getWidth());
						graphic.symbol.setHeight(_this.lutIconSpecs.medium.getHeight());
						graphic.symbol.setOffset(_this.lutIconSpecs.medium.getOffsetX(), _this.lutIconSpecs.medium.getOffsetY());
						graphic.draw();

						if (!_helper.isIE()){
							_this.moveGraphicToFront(graphic);
						}
					}
					var atts = graphic.attributes;
					var name = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'name';})[0]];
					_this.buildMapHoverTips(name, graphic);
				}
			};

			this.layer_onMouseOut = function(event)
			{
				if ($('body').hasClass('pickLocation')  || _this.mapIsZooming || _this.mapIsPanning)
					return;
				var graphic = event.graphic;
				if(graphic == _this.selected && app.isInBuilder)
					return;
				if (_helper.isMobile()) return;
				app.map.setMapCursor("default");

				if (graphic != _this.selected) {
					graphic.symbol.setWidth(_this.lutIconSpecs.tiny.getWidth());
					graphic.symbol.setHeight(_this.lutIconSpecs.tiny.getHeight());
					graphic.symbol.setOffset(_this.lutIconSpecs.tiny.getOffsetX(), _this.lutIconSpecs.tiny.getOffsetY());
					graphic.draw();
				}

				if(app.mapTips)
					app.mapTips.clean();
			};

			function processExistingLayers()
			{
				var layers = [];
				var potentialShortlistLayers = [];

				$.each(app.map.graphicsLayerIds, function(i, id){
					layers.push(app.map.getLayer(id));
				});

				var values = {
					bookmarks: false,
					bookmarksAlias: app.cfg.BOOKMARKS_ALIAS,
					extentMode: "customHome",
					filterByExtent: true,
					numberedIcons: false,
					geocoder: false,
					locateButton: false
				};

				app.data.getWebAppData().setGeneralOptions(values);

				$.each(app.map.layerIds, function(i, id){
					var baseMapLayers = app.data.getResponse().itemInfo.itemData.baseMap.baseMapLayers;
					var baseMapLayerIds = $.grep(baseMapLayers, function(n){ return n.id == id;});
					if(!baseMapLayerIds[0])
						layers.push(app.map.getLayer(id));
				});
				var featServLayer = [];
				var featServLayerIndex = [];
				var featureService;

				var featServLayerID = null;
				var layerType;

				$.each(layers, function(index, layer){
					if(layer.layerType){
						layerType = layer.layerType;
					}else{
						layerType = layer.type;
					}

					if(layer.geometryType == 'esriGeometryPoint' && layer.id.toLowerCase().indexOf("mapnotes") == -1  && layer.graphics.length){
						potentialShortlistLayers.push(layer);
					}

					//TODO account for feature service and layer/graphics load
					if (layer.geometryType == 'esriGeometryPoint' && layer.url && (layerType === 'ArcGISFeatureLayer' || layerType === 'Feature Layer') /*&& !layer.id.match(/^csv_/)*/) {
						featureService = true;
						featServLayerID = layer;
						featServLayer.push(layer);
						featServLayerIndex.push(index);
					}
				});

				var layersChecked = false;
				var mapConfigSet = false;
				var layersManaged = false;
				if(!layersChecked){
					layersChecked = true;
					if(featServLayer.length){
					}

					var mapUpdated = false;
					app.map.on('update-end', function(){
						if(mapUpdated)
							return;
						mapUpdated = true;
						checkPointLayers();
					});
					var baseMapLayer = app.map.getLayer(app.data.getWebMap().itemData.baseMap.baseMapLayers[0].id);
					if(baseMapLayer.tileIndexUrl && baseMapLayer.loaded){
						if(mapUpdated)
							return;
						mapUpdated = true;
						checkPointLayers();
					}
				}
				function checkPointLayers()
				{
					$.each(featServLayer, function(i, layer){
						if(layer.geometryType == 'esriGeometryPoint' && layer.id.toLowerCase().indexOf("mapnotes") == -1  && layer.graphics.length){
							potentialShortlistLayers.push(layer);
						}
					});
					if(!potentialShortlistLayers.length){
						var config = {};
						builderView.initPopupComplete(config);
						//builderView.initMapExtentSave();
						app.detailPanelBuilder.init(app.ui.mainView, builderView);
						app.data.getWebAppData().setTitle(app.data.getResponse().itemInfo.item.title);
						app.data.getWebAppData().setSubtitle(app.data.getResponse().itemInfo.item.description);
						//app.data.getWebMap().item.extent = builderView.serializeExtentToItem(app.map.extent);
						//app.map._params.extent = new Extent(JSON.parse(JSON.stringify(app.map.extent.toJson())));
						//app.data.getWebAppData().setMapExtent(app.map.extent);
						app.ui.headerDesktop.setTitleAndSubtitle(app.data.getWebAppData().getTitle(), app.data.getWebAppData().getSubtitle());
						app.data.getWebAppData().setDefaultThemeOptions();
						if(app.data.getResponse().itemInfo.itemData.bookmarks && app.data.getResponse().itemInfo.itemData.bookmarks.length){
							var settings = {
								extentMode: "default",
								numberedIcons: false,
								filterByExtent: true,
								bookmarks: true,
								bookmarksAlias: 'Zoom'
							};
							app.data.getWebAppData().setGeneralOptions(settings);
							app.ui.navBar.initBookmarks();
						}
						app.addFeatureBar.addLayer();
						builderView.storyDataReady();
						_core.appInitComplete(WebApplicationData);
						_core.displayApp();
						/*setTimeout(function(){
							console.log("***");
							app.maps[app.data.getResponse().itemInfo.item.id] = _this.getMapConfig(app.data.getResponse());
							mapConfigSet = true;
						}, app.data.getWebAppData().getAppGeocoders() ? 0 : 1000);*/
					}else{
						if(layersManaged)
							return;
						$.each(potentialShortlistLayers, function(i, layer){
							var index = layers.indexOf(layer);
							layers.splice(index, 1);
						});
						builderView.openMigrationPopup(potentialShortlistLayers, layers);
						$("#loadingIndicator").hide();
						clearTimeout(app.loadingTimeout);
						app.loadingTimeout = null;
					}
				}

				var webmapExtent = app.data.getWebMap().item.extent;
				var newExtent = new Extent(webmapExtent[0][0], webmapExtent[0][1], webmapExtent[1][0], webmapExtent[1][1], new SpatialReference({ wkid:4326 }));
				app.map.setExtent(newExtent, true);
				app.map._params.extent = new Extent(JSON.parse(JSON.stringify(app.map.extent.toJson())));
				app.data.getWebAppData().setMapExtent(newExtent);

				$('.builder-share').toggleClass('disabled', true);

				app.isWebMapFirstSave = true;

				var pointFeatServLayer = $.grep(featServLayer, function(n){ return n.geometryType == 'esriGeometryPoint'; });

				if(!potentialShortlistLayers.length && !pointFeatServLayer.length){
					var config = {};
					builderView.initPopupComplete(config);
					//builderView.initMapExtentSave();
					app.detailPanelBuilder.init(app.ui.mainView, builderView);
					app.data.getWebAppData().setTitle(app.data.getResponse().itemInfo.item.title);
					app.data.getWebAppData().setSubtitle(app.data.getResponse().itemInfo.item.description);
					//app.data.getWebMap().item.extent = builderView.serializeExtentToItem(app.map.extent);
					//app.map._params.extent = new Extent(JSON.parse(JSON.stringify(app.map.extent.toJson())));
					//app.data.getWebAppData().setMapExtent(app.map.extent);
					app.ui.headerDesktop.setTitleAndSubtitle(app.data.getWebAppData().getTitle(), app.data.getWebAppData().getSubtitle());
					if(parseInt(app.data.getWebMap().itemData.version) < 2.9){
						app.data.getWebMap().itemData.version = "2.9";
					}
					app.data.getWebMap().itemData.authoringApp = "StoryMapShortlist";
					app.data.getWebMap().itemData.authoringAppVersion = app.version;
					if(app.data.getResponse().itemInfo.itemData.bookmarks && app.data.getResponse().itemInfo.itemData.bookmarks.length){
						var settings = {
							extentMode: "default",
							numberedIcons: false,
							filterByExtent: true,
							bookmarks: true,
							bookmarksAlias: 'Zoom'
						};
						app.data.getWebAppData().setGeneralOptions(settings);
						app.ui.navBar.initBookmarks();
					}
					_core.appInitComplete(WebApplicationData);
					setTimeout(function(){
						if(!mapConfigSet)
							app.maps[app.data.getResponse().itemInfo.item.id] = _this.getMapConfig(app.data.getResponse());
						mapConfigSet = true;
					}, app.data.getWebAppData().getAppGeocoders() ? 0 : 1000);
				}else if(!featServLayer.length && !layersManaged){
					layersManaged = true;
					$.each(potentialShortlistLayers, function(i, layer){
						var index = layers.indexOf(layer);
						layers.splice(index, 1);
					});
					builderView.openMigrationPopup(potentialShortlistLayers, layers);
					$("#loadingIndicator").hide();
					clearTimeout(app.loadingTimeout);
					app.loadingTimeout = null;
				}
			}

			function initUI()
			{
				// App has been configured
				if ( ! WebApplicationData.isBlank() && WebApplicationData.getWebmap() ){
					_core.appInitComplete(WebApplicationData);
				}
				// No data and in builder mode -> open migration
				else if ( app.isInBuilder && app.data.getWebAppData().getWebmap() ) {

					app.isGalleryCreation = true;
					var mapPromise = _this.loadWebmap(app.data.getWebAppData().getWebmap(), 'map');
					mapPromise.then(function(response){
						app.data.setResponse(response);
						app.map = mapPromise.results[0].map;
						app.data.setWebMap(mapPromise.results[0].itemInfo);
						builderView.updateUI();
						//_core.appInitComplete(WebApplicationData);
						processExistingLayers();
					});
					if( _core.isProd() ){
						builderView.showInitPopup();
					}
					else
						_core.portalLogin().then(
							/*builderView.showInitPopup,
							function(){
								_core.initError("noLayerNoHostedFS");
							}*/
						);
				}
				// No data in view mode
				else if( CommonHelper.getAppID(_core.isProd()) ) {
					if( app.data.userIsAppOwner()){
						//app.ui.loadingIndicator.setMessage(i18n.viewer.loading.loadBuilder);
						if(!app.isInBuilder){
							setTimeout(function(){
								CommonHelper.switchToBuilder();
							}, 1200);
						}
					}
					else
						_core.initError("notConfiguredDesktop");
				}
				// No data in preview mode (should not happen)
				else {
					if(!app.isInBuilder)
						_core.initError("noLayer");
				}

				// gallery creation
				if ( builderView && !app.data.getWebAppData().getWebmap() ){
					// call function to create a blank web map to add feature class to
					if($.isEmptyObject(app.data.getWebAppData().getThemeOptions()))
						app.data.getWebAppData().setDefaultThemeOptions();
					var mapPromise = _this.loadWebmap(builderView.buildWebMap(), 'map');
					mapPromise.then(function(response){
						app.data.setResponse(response);
						app.map = mapPromise.results[0].map;
						app.data.setWebMap(mapPromise.results[0].itemInfo);

						var mapId = response.itemInfo.item.id.length ? response.itemInfo.item.id : response.map.id;

						builderView.updateUI();
						_core.appInitComplete(WebApplicationData);

						//storyDataReady();
						if(!app.data.getWebAppData().getWebmap() && app.data.getWebAppItem().id){
							app.data.getWebAppData().setWebmap(mapId);
							setTimeout(function(){
								app.maps[mapId] = _this.getMapConfig(response);
							}, app.data.getWebAppData().getAppGeocoders() ? 0 : 1000);
						}
						builderView.storyDataReady();

						_core.displayApp();


					});
				}
			}

			function createLayerDefinition (fields){
				var layerDefinition = {
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
				return layerDefinition;
			}

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

			function SortByNumber(a, b)
			{
				var aNumber = a.attributes.number || a.attributes.shortlist_id;
				var bNumber = b.attributes.number || b.attributes.shortlist_id;
				return ((aNumber < bNumber) ? -1 : ((aNumber > bNumber) ? 1 : 0));
			}

			/*
			function hasMobileView()
			{
				return has("ie") === undefined || has("ie") > 8;
			}
			*/

			// Layout only
			this.updateUI = function()
			{

			};

			this.resize = function(cfg)
			{
				if(app.isInBuilder)
					app.initScreenIsOpen = true;
				//TODO give error message if in builder and port is less than 900 px wide.
				// 'Story isn't saved yet' text turns to totem text
				var themeIndex = $('.entry.active').index();
				if(!cfg.isMobileView){
					if(app.isInBuilder  && $('#mobileBuilderOverlay').css('display') == 'block' && (app.addFeatureBar.loaded || app.data.getWebAppData().getIsExternalData()))
						$('#mobileBuilderOverlay').attr('style','display: none !important');
					//TODO in components
					app.ui.mobileIntro.screenSize = 'desktop';
					$('#mobilePaneList').hide();
					$('#navThemeLeft').css('visibility', 'hidden');
					$('#navThemeRight').css('visibility', 'hidden');
					$("#mobileBookmarksCon").hide();

					if(app.data.getStory()[themeIndex] && app.data.getStory()[themeIndex].color){
						$('#contentPanel').css({'border-top-width': '10px',
												'border-top-style': 'solid',
												'border-top-color': app.data.getStory()[themeIndex].color});
						$('.detailHeader').css('border-top', '0px');
						$('.notNumbered').css('margin-top', '20px');
					}

					var heightViewport = $("body").height();
					var heightAroundMap = 0;
					$('.mainViewAboveMap, .mainViewBelowMap').each(function(i, item){
						var itemObj = $(item);
						heightAroundMap += itemObj.is(':visible') ? itemObj.outerHeight() : 0;
					});
					$("#contentPanel").height(heightViewport - heightAroundMap + 10);
					$("#paneLeft").height($("#contentPanel").height() - $('#tabs').height() - 20);
					if(!_urlParams.embed && _urlParams.embed !== '' && !app.cfg.embed && !_urlParams.forceEmbed && !app.indexCfg.forceEmbed){
						var headerHeight = app.data.getWebAppData().getHeader().compactSize ? '60px' : '110px';
						$('#header').height(headerHeight);
					}
					$(".tilelist").height($("#paneLeft").height() - ((app.isInBuilder && !app.data.getWebAppData().getIsExternalData()) ? 70 : 48));
					$(".tilelist").css('top', app.isInBuilder && !app.data.getWebAppData().getIsExternalData() ? 50 : 28);
					$("#paneLeft .noFeature").width($('#paneLeft').width());
					$("#paneLeft").width() == app.cfg.LEFT_PANE_WIDTH_TWO_COLUMN ? $('#paneLeft .noFeatureText').css('margin-left', '20px') : $('#paneLeft .noFeatureText').css('margin-left', '100px');
					$("#map").height(cfg.height - 10);
					$("#map").css('top', 0);
					app.ui.navBar.resize();

					if(cfg.width <= app.cfg.TWO_COLUMN_THRESHOLD || (cfg.width <= 1024 && cfg.height <= 768)){
						setTimeout(function(){
							$("#mainStagePanel").width(cfg.width - (app.cfg.LEFT_PANE_WIDTH_TWO_COLUMN + 16));
							$("#mainStagePanel").css("left", (app.cfg.LEFT_PANE_WIDTH_TWO_COLUMN + 16));
							if(app.map)
								app.map.resize();
							if(_this.selected && !app.map.extent.contains(_this.selected.geometry) && app.mapTips)
								app.mapTips.clean(true);
						}, 0);
						$('#paneLeft .noFeatureText').css('margin-left', '20px');
						app.ui.tilePanel.resize(app.cfg.LEFT_PANE_WIDTH_TWO_COLUMN);
						if(app.isInBuilder && !app.data.getWebAppData().getIsExternalData())
							app.detailPanelBuilder.resize();
						else {
							app.ui.detailPanel.resize();
						}
					}
					else if(cfg.width <= app.cfg.THREE_COLUMN_THRESHOLD && cfg.width >= app.cfg.TWO_COLUMN_THRESHOLD){
						setTimeout(function(){
							$("#mainStagePanel").width(cfg.width - (app.cfg.LEFT_PANE_WIDTH_THREE_COLUMN + 16));
							$("#mainStagePanel").css("left", (app.cfg.LEFT_PANE_WIDTH_THREE_COLUMN + 16));
							if(app.map)
								app.map.resize();
						}, 0);
						$('#paneLeft .noFeatureText').css('margin-left', '100px');
						app.ui.tilePanel.resize(app.cfg.LEFT_PANE_WIDTH_THREE_COLUMN);
						if(app.isInBuilder && !app.data.getWebAppData().getIsExternalData())
							app.detailPanelBuilder.resize();
						else{
							app.ui.detailPanel.resize();
						}
					}
					else{
						setTimeout(function(){
							$("#mainStagePanel").width(cfg.width - (app.cfg.LEFT_PANE_WIDTH_FOUR_COLUMN + 16));
							$("#mainStagePanel").css("left", (app.cfg.LEFT_PANE_WIDTH_FOUR_COLUMN + 16));
							if(app.map)
								app.map.resize();
						}, 0);
						$('#paneLeft .noFeatureText').css('margin-left', '170px');
						app.ui.tilePanel.resize(app.cfg.LEFT_PANE_WIDTH_FOUR_COLUMN);
						if(app.isInBuilder && !app.data.getWebAppData().getIsExternalData())
							app.detailPanelBuilder.resize();
						else{
							app.ui.detailPanel.resize();
						}
					}
				} else {
					if(app.isInBuilder)
						$('#mobileBuilderOverlay').attr('style','display: block !important');

					app.ui.mobileIntro.resizeMobileElements();

					if(app.data.getStory()[themeIndex] && app.data.getStory()[themeIndex].color){
						$('.detailHeader').css({'border-top-width': '10px',
												'border-top-style': 'solid',
												'border-top-color': app.data.getStory()[themeIndex].color});
						$('#contentPanel').css('border-top', '0px');
						$('.notNumbered').css('margin-top', '10px');
					}

					if(app.data.getWebAppData().getSettings().generalOptions && app.data.getWebAppData().getSettings().generalOptions.bookmarks)
						$("#mobileBookmarksCon").show();
					$('#header').height('0');
					if( app.mapTips )
						app.mapTips.hide();
					// resize is called twice in app initialization
					if(_firstMapLoad < 2 || $('#mobileIntro').css('display') == 'block')
						resetEntryMapExtent();
				}
				_firstMapLoad++;
			};

			this.setMapExtent = function(extent, map)
			{
				return _core.setMapExtent(extent, map);
			};

			this.getLayoutExtent = function(extent)
			{
				return extent;
			};

			//
			// Initialization
			//

			this.checkConfigFileIsOK = function()
			{
				return Config.checkConfigFileIsOK();
			};

			this.appInitComplete = function()
			{
				this.updateUI();
				_core.cleanLoadingTimeout();

				$(window).resize();

				// Need to save to create web map for map command and search
				if(app.isGalleryCreation){

				}

				var disableSharingLinks =  app.data.getWebAppData().isBlank() || app.data.getWebAppItem().access == "private";
				if ( app.ui.headerDesktop )
					app.ui.headerDesktop.toggleSocialBtnAppSharing(disableSharingLinks);

				topic.publish("tpl-ready");
			};

			//
			// Story events
			//

			this.onHashChange = function()
			{
				//var view = location.hash ? location.hash.substring(1) : "";
				//app.ui.mobileView.setView(view);
			};

			//
			// User events
			//

			function resetEntryMapExtent()
			{
				var extent = app.data.getWebAppData().getMapExtent() ? app.data.getWebAppData().getMapExtent() : app.data.getWebAppData().getTabs() && app.data.getWebAppData().getTabs()[0].extent ? app.data.getWebAppData().getTabs()[0].extent : null;
				topic.publish("CORE_UPDATE_EXTENT", new Extent(extent));
			}

			function iconSpecs(width,height,offset_x,offset_y)
			{

				var _width = width;
				var _height = height;
				var _offset_x = offset_x;
				var _offset_y = offset_y;

				this.getWidth = function() {
					return _width;
				};

				this.getHeight = function() {
					return _height;
				};

				this.getOffsetX = function() {
					return _offset_x;
				};

				this.getOffsetY = function() {
					return _offset_y;
				};

			}

			this.lutIconSpecs= {
				tiny: new iconSpecs(31,34,6,13),
				medium: new iconSpecs(34,38,7,15),
				large: new iconSpecs(44,48,9,20)
			},

			this.prepareMobileViewSwitch = function()
			{
				//
			};

			this.initLocalization = function()
			{
				//
			};
		};
	}
);
