define(["lib-build/tpl!./BuilderView",
		"lib-build/css!./BuilderView",
		"lib-build/css!./Common",
		"../core/WebApplicationData",
		"storymaps/common/builder/settings/SettingsPopup",
		"storymaps/common/builder/Landing",
		"./Help",
		"./InitPopup",
		"storymaps/common/builder/SharePopup",
		"../core/Helper",
		"storymaps/common/utils/CommonHelper",
		"storymaps/common/builder/media/image/FileUploadHelper",
		"./BuilderHelper",
		"storymaps/common/utils/WebMapHelper",
		"esri/arcgis/utils",
		"esri/dijit/BasemapGallery",
		// Web map picker
		"storymaps/common/builder/browse-dialog/js/BrowseIdDlg",
		"lib-build/css!../../common/builder/browse-dialog/css/browse-dialog",
		"lib-build/css!../../common/builder/browse-dialog/storymaps-override",
		// Settings tab
		"./settings/ViewGeneralOptions",
		"./settings/ViewMapOptions",
		"./settings/ViewThemeOptions",
		"storymaps/common/builder/settings/ViewHeader",
		// global map extent save (home button setting)
		"./MapExtentSave",
		// Workflow picker
		"./Workflow",
		// Add Feature bar
		"./AddFeatureBar",
		// Detail Panel builder
		"./DetailPanelBuilder",
		// Image Picker Dialogue
		"./media/Popup",
		// Template
		"./addedit/Popup",
		"./OrganizePopup",
		"./shortlistMigration/Migration",
		// Image exif data library
		'lib-app/exif-js/exif',
		// Utils
		"esri/graphicsUtils",
		"esri/layers/GraphicsLayer",
		"esri/geometry/webMercatorUtils",
		"esri/geometry/Extent",
		"esri/SpatialReference",
		"esri/config",
		"dojo/Deferred",
		"dojo/topic",
		"dojo/has",
		"dojo/on",
		"dojo/_base/lang"
	],
	function (
		viewTpl,
		viewCss,
		commonCss,
		WebApplicationData,
		SettingsPopup,
		Landing,
		Help,
		InitPopup,
		SharePopup,
		Helper,
		CommonHelper,
		FileUploadHelper,
		BuilderHelper,
		WebMapHelper,
		arcgisUtils,
		BasemapGallery,
		// Web map picker
		BrowseIdDlg,
		browseDlgCss,
		browseDlgCss2,
		// Settings tab
		ViewGeneralOptions,
		ViewMapOptions,
		ViewThemeOptions,
		ViewHeader,
		// Home button extent saveAppMapExtentSave,
		MapExtentSave,
		// Workflow
		Workflow,
		// Add feature bar
		AddFeatureBar,
		// Detail Panel Builder
		DetailPanelBuilder,
		// Image Picker,
		Media,
		// Template
		AddEditPopup,
		OrganizePopup,
		MigrationPopup,
		// Exif
		exif,
		// Utils
		graphicsUtils,
		GraphicsLayer,
		webMercatorUtils,
		Extent,
		SpatialReference,
		esriConfig,
		Deferred,
		topic,
		has,
		on,
		lang
	){
		return function BuilderView(Core)
		{

			$("#builder-views").append(viewTpl({ }));

			var _this = this,
				_core = Core,
				_firstLoad = true,
				_directCreationFirstLoad = true,
				_initPopupComplete = false,
				_settingsPopup = null,
				_landingUI = new Landing($("#builderLanding"), firstAdd, function(){ alert("TODO"); }),
				_initPopup = new InitPopup($("#initPopup")),
				_helpUI = new Help($("#builderHelp")),
				_sharePopup = new SharePopup($('#sharePopup')),
				_helper = new Helper(),
				_addEditPopup = new AddEditPopup($('#addEditPopup'), _this),
				_media = new Media($('#editorDialogInlineMedia')),
				_organizePopup = new OrganizePopup($('#organizePopup')),
				_workflow = new Workflow($("#initPopup")),
				_mapExtentSave = new MapExtentSave($('#map_zoom_slider'), _this),
				_mapConfig = null,
				_browseDialog = null,
				_mainView,
				_commonHelper = CommonHelper,
				_migrationPopup,
				_icon,
				_myCanvas,
				_context;


			app.detailPanelBuilder = new DetailPanelBuilder($('#contentPanel'), _media);
			app.addFeatureBar = new AddFeatureBar($('#contentPanel'), _media);
			app.initScreenIsOpen = true;

			this.init = function(settingsPopup)
			{
				var isEdge = navigator.appVersion.indexOf('Edge') > 0 ? true : false;
				// Or with Edge
				if( app.isInBuilder && isEdge) {
					_core.initError("noBuilderEdge");
					return false;
				}
				_settingsPopup = settingsPopup;
				_mainView = app.ui.mainView;

				_migrationPopup = new MigrationPopup($('#migrationPopup'), _core, _mainView, _this, WebApplicationData),

				topic.subscribe("SETTINGS_POPUP_SAVE", settingsPopupSave);
				topic.subscribe("OPEN_HELP", function(){ _helpUI.present(); });
				topic.subscribe("HEADER_EDITED", updateTitleStyle);
				topic.subscribe("UPDATE_EXTENT_MODE", updateExtentMode);
				topic.subscribe("DIRECT_CREATION_SAVE", hideInitPopup);

				app.builder.openSharePopup = openSharePopup;
				app.builder.openEditPopup = openEditPopup;

				// Add buttons for all layouts
				$(".builder-add")
					.click(function(){
						if (! $(this).hasClass("disabled"))
							clickAdd();
					})
					.find(".builder-lbl").html(i18n.builder.addEditPopup.lblAdd);

				// Organize buttons for all layouts
				$(".builder-organize")
					.click(openOrganizePopup)
					//.find(".builder-lbl").html(i18n.builder.organizePopup.title);
					.find(".builder-lbl").html(i18n.builder.addEditPopup.organizeTabs);

				_myCanvas = document.createElement('canvas');
				_context = _myCanvas.getContext('2d');
				_icon = new Image();
				_icon.src = app.cfg.ICON_SRC;

				_icon.onload = function(){
					_context.drawImage(_icon, 0, 0);
					_context.font = _myCanvas.width/2 + "pt";
				};

				_this.showInitPopup();
			};

			this.appInitComplete = function()
			{
				if ( ! app.isProduction && CommonHelper.getUrlParams().debug == "add" )
					clickAdd();

				if ( ! app.isProduction && CommonHelper.getUrlParams().debug == "organize" )
					openOrganizePopup();

				if ( ! app.isProduction && CommonHelper.getUrlParams().debug == "settings" )
					this.openSettingPopup();

				if ( ! app.isProduction && CommonHelper.getUrlParams().debug == "edit" )
					openEditPopup({
						displayTab: CommonHelper.getUrlParams().debugView || "content" ,
						sectionIndex: CommonHelper.getUrlParams().debugIndex || 0
					});

				if(app.data.getWebAppData().getIsExternalData()){
					$('.tab-cfg-extent-mode').remove();
					$('.settings-mapoptions').css('margin-top', '40px');
					$('.bookmarkTooltip').css({'top': '102px'});
				}

				updateAddButtonStatus();
			};

			this.storyDataReady = function()
			{
				app.initScreenIsOpen = false;
				var basemapGallery = dijit.byId('basemapGallery');
				if(basemapGallery)
					basemapGallery.destroyRecursive(true);

				var galleryConfig = {
					map: app.map,
					portalUrl: arcgisUtils.arcgisUrl.split('/sharing/')[0],
					bingMapsKey: app.portal.bingKey
				};

				// If it has the useVectorBasemaps property and its true then use the
				// vectorBasemapGalleryGroupQuery otherwise use the default
				var basemapGalleryGroupQuery = app.portal.basemapGalleryGroupQuery;
				if (app.portal.hasOwnProperty("useVectorBasemaps") && app.portal.useVectorBasemaps === true && app.portal.vectorBasemapGalleryGroupQuery) {
					basemapGalleryGroupQuery = app.portal.vectorBasemapGalleryGroupQuery;
				}

				var q = parseQuery(basemapGalleryGroupQuery);
				galleryConfig.basemapsGroup = null;
				if (q.id) {
					galleryConfig.basemapsGroup = {
						id: q.id
					};
				} else if (q.title && q.owner) {
					galleryConfig.basemapsGroup = {
						title: q.title,
						owner: q.owner
					};
				}
				else {
					galleryConfig.showArcGISBasemaps = true;
				}

				basemapGallery = new BasemapGallery(
					galleryConfig,
					"basemapGallery"
				);
				basemapGallery.startup();

				$("#basemapChooser .dijitTitlePaneTextNode").text(i18n.builder.settings.changeBasemap);
				$("#basemapChooser").show();

				var currentExtent = app.map.extent;

				// Very lame but the title isn't saved in the new map layer
				basemapGallery.on("selection-change",function(){
					currentExtent = app.map.extent;
					var basemap = basemapGallery.getSelected();
					var newBasemapJSON = [];

					$.each(basemap.layers, function(i, layer){
						var bmLayerJSON = {
							id: basemap.id + '_' + i,
							opacity: 1,
							visibility: true,
							url: layer.url
						};

						if ( layer.type == "reference" )
							bmLayerJSON.isReference = true;
						else if ( layer.type == "OpenStreetMap" ) {
							delete bmLayerJSON.url;
							bmLayerJSON.type = "OpenStreetMap";
						}
						else if ( layer.type == "VectorTileLayer" ) {
							delete bmLayerJSON.url;
							bmLayerJSON.type = "VectorTileLayer";
							bmLayerJSON.layerType = "VectorTileLayer";
							bmLayerJSON.title = basemap.title;
							bmLayerJSON.styleUrl = layer.styleUrl;
							bmLayerJSON.itemId = basemap.itemId;
						}
						else if ( layer.type == "WebTiledLayer" ) {
							delete bmLayerJSON.url;
							bmLayerJSON.templateUrl = layer.templateUrl;
							bmLayerJSON.copyright = layer.copyright;
							bmLayerJSON.fullExtent = layer.fullExtent;
							bmLayerJSON.subDomains = layer.subDomains;
							bmLayerJSON.title = basemap.title;
							bmLayerJSON.type = "WebTiledLayer";
							bmLayerJSON.layerType = "WebTiledLayer";
						}

						newBasemapJSON.push(bmLayerJSON);
					});

					app.data.getWebMap().itemData.baseMap = {
						baseMapLayers: newBasemapJSON,
						title: basemap.title
					};

					app.basemapChanged = true;
					topic.publish("BUILDER_INCREMENT_COUNTER", 1);

					$("#basemapChooser").find('.dijitTitlePaneTitle').click();
					setTimeout(function(){
						app.map.setExtent(currentExtent);
					}, 500);
				});

				firstAdd();


				if(true){ //app.isDirectCreation && _firstLoad){
					_firstLoad = false;
					var config = {};

					// To display error message for build mobile screen
					app.initScreenIsOpen = true;
					//_this.initPopupComplete(config);
				}

			};

			this.updateUI = function(forceStoryInit)
			{
				var storyInit = forceStoryInit || app.data.getStoryLength();
				$(".builder-add, .builder-organize").removeClass("active");

				//_landingUI.toggle(! storyInit);
				//$(".builder-content-panel").toggle(!! storyInit);

				if(!storyInit && app.isDirectCreation && _directCreationFirstLoad){
					_landingUI.toggle(! storyInit);
					$(".builder-content-panel").toggle(!! storyInit);
					$('.builder-title-mask').show();
					//_directCreationFirstLoad = false;
					app.isWebMapFirstSave = true;
					_this.initPopupComplete();
				} else{
					_this.initPopupComplete();
				}
				if(app.data.getWebAppData().getIsExternalData()){
					$('#myList').height($("#paneLeft").height() - 48);
					$('.builder-organize').remove();
					$('.builder-add').remove();
				}
				$('#search').hide();
			};

			//
			// Story serialization
			//

			this.preWebmapSave = function()
			{
				var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
				var operShortlistLayer = $.grep(app.data.getWebMap().itemData.operationalLayers, function(e){
					return e.id == WebApplicationData.getShortlistLayerId().split('_').slice(0,-1).join('_') || e.id ==  app.data.getShortlistLayerId().split('_').slice(0,-1).join('_');
				});
				if(!operShortlistLayer[0]){
					operShortlistLayer = $.grep(app.data.getWebMap().itemData.operationalLayers, function(e){
						return e.id == WebApplicationData.getShortlistLayerId() || e.id ==  app.data.getShortlistLayerId();
					});
				}
				operShortlistLayer[0].featureCollection = WebMapHelper.serializeGraphicsLayerToFeatureCollection(shortlistLayer);
				if(app.isWebMapFirstSave){
					/*$('.builder-title-mask').hide();
					$('#builderQuotes').css('display', 'none', '!important');
					$('#builderLanding').css('display', 'none', '!important');*/
					app.ui.mainView.activateLayer(0);
				}
				manageUploadedMedia();
			};

			//
			// Add
			//

			this.buildWebMap = function()
			{
				return BuilderHelper.getBlankWebmapJSON();
			};

			function parseQuery(queryString)
			{
				var regex = /(AND|OR)?\W*([a-z]+):/ig,
				fields = {},
				fieldName,
				fieldIndex,
				result = regex.exec(queryString);
				while (result) {
					fieldName = result && result[2];
					fieldIndex = result ? (result.index + result[0].length) : -1;

					result = regex.exec(queryString);

					fields[fieldName] = queryString.substring(fieldIndex, result ? result.index : queryString.length).replace(/^\s+|\s+$/g, "").replace(/\"/g, ""); //remove extra quotes in title
				}
				return fields;
			}

			function manageUploadedMedia()
			{
				if(app.data.getWebAppData().getIsExternalData())
					return;
				var shortlistMedia = [];
				var unusedUploads = [];
				$.each(app.map.getLayer(app.data.getWebAppData().getShortlistLayerId()).graphics, function(i, feature){
					if(feature.attributes.pic_url.indexOf("sharing/rest/content/items") > -1)
						shortlistMedia.push(feature.attributes.resource);
				});
				if(!shortlistMedia.length)
					return;

				FileUploadHelper.getStoryResources().then(function(media){
					$.each(media, function(i, image){
						var imgUrl = image.picUrl ? image.picUrl : image.sizes[0].url;
						var foundImg = $.grep(shortlistMedia, function(e){
							var featImgUrl = e.picUrl ? e.picUrl : e.sizes[0].url;
							if(featImgUrl.indexOf('%20')){

							}else{
								featImgUrl = decodeURI(featImgUrl);
							}

							return featImgUrl.slice(featImgUrl.lastIndexOf('/')) == imgUrl.slice(imgUrl.lastIndexOf('/'));
						});
						if(!foundImg.length)
							unusedUploads.push(image);
					});
					$.each(unusedUploads, function(i, media){
						FileUploadHelper.removeResources(media);
					});
				});
			}

			function firstAdd(title)
			{
				_this.updateUI();

				if(title)
					WebApplicationData.setTitle(title);
				topic.publish("CORE_UPDATE_UI");

				clickAdd();
				if(!_firstLoad)
					return;

				if(app.isDirectCreationFirstSave){
					//TODO populate with config colors info.  Also border for #paneLeft
					if($.isEmptyObject(app.data.getWebAppData().getThemeOptions()))
						app.data.getWebAppData().setDefaultThemeOptions();
					var colorOrder = app.cfg.COLOR_ORDER.split(",");
					var activeColor = $.grep(app.cfg.COLOR_SCHEMES, function(e){ return e.name == colorOrder[0]; });
					$('#contentPanel').css('border-top-color', activeColor[0].color);
					var colors = {
						header: app.data.getWebAppData().getThemeOptions().headerColor,
						tabText: '#d8d8d8',
						tab: '#666',
						tabTextActive: '#fff',
						tabActive: activeColor[0].color,
						tabTextHover: '#fff',
						tabHover: '#666'
					};
					var entryIndex = 0;
					var firstEntry = {};
					firstEntry.title = 'Tab 1';
					app.ui.navBar.init(
						[firstEntry],
						entryIndex,
						colors,
						WebApplicationData
					);

					app.data.getWebMap().item.extent = CommonHelper.serializeExtentToItem(app.map.extent);
					app.map._params.extent = new Extent(JSON.parse(JSON.stringify(app.map.extent.toJson())));

					if(_directCreationFirstLoad){
						_directCreationFirstLoad = false;
						_this.appInitComplete();
					}

					//_mapExtentSave.show();
				}

			}

			function clickAdd()
			{
				_this.updateUI();

				$("body").removeClass("isBuilderLanding");
				app.isInitializing = false;
				topic.publish("BUILDER_INCREMENT_COUNTER", 1);

				/*
				_addEditPopup.present({
					mode: "add",
					webmaps: app.data.getWebmapsInfo(),
					entry: app.data.getCurrentSection(),
					layout: WebApplicationData.getLayoutId()
				}).then(
					function(section){
						console.log('builder.BuilderView.clickAdd:', section);

						$("body").removeClass("isBuilderLanding");
						app.isInitializing = false;

						topic.publish("BUILDER_INCREMENT_COUNTER", 1);
					},
					function(){
						_this.updateUI();
					}
				);
				*/
			}

			function updateAddButtonStatus()
			{
				var disableAddButton = false;

				$(".builder-add")
					.toggleClass("disabled", disableAddButton)
					.tooltip('destroy');

				if ( disableAddButton ) {
					$(".builder-add").tooltip({
						trigger: 'hover',
						placement: 'top',
						html: true,
						title: i18n.builder.addEditPopup.disabled.replace('%LBL_LAYOUT%', app.data.getWebAppData().getLayoutProperties().itemsLbl.toLowerCase())
					});
				}
			}

			//
			// Edit
			//

			function openEditPopup(cfg)
			{
				var popupDeferred = new Deferred();

				_addEditPopup.present({
					mode: "edit",
					displayTab: cfg.displayTab,
					//webmap: app.data.getWebmap(),
					entry: app.data.getStoryByIndex(cfg.entryIndex),
					entryIndex: cfg.entryIndex
				});

				return popupDeferred;
			}

			//
			// Organize
			//

			function openOrganizePopup()
			{
				if($(".builder-organize").hasClass('disabled'))
					return;
				$(".builder-organize").addClass("active");

				_organizePopup.present({
					entries: app.data.getStory(),
					sectionIndex: $('.entry.active').index()
				}).then(
					function(result){
						console.log('builder.BuilderView.openOrganizePopup:', result);

						$(".builder-organize").removeClass("active");

						_organizePopup.close();

						var colors = {
							header: app.data.getWebAppData().getThemeOptions().headerColor,
							tabText: '#d8d8d8',
							tab: '#666',
							tabTextActive: '#fff',
							tabActive: result.entries[result.sectionIndex].color,
							tabTextHover: '#fff',
							tabHover: '#666'
						};

						app.ui.navBar.init(
							result.entries,
							result.sectionIndex,
							colors,
							WebApplicationData
						);

						app.detailPanelBuilder.updateThemeSwipers(result);
						_this.updateAllFeatures(result);
						app.detailPanelBuilder.buildAllSlides();

						_mainView.activateLayer(result.sectionIndex);

						topic.publish("story-update-entries");
						topic.publish("BUILDER_INCREMENT_COUNTER", 1); // TODO
					},
					function(){
						//_this.updateUI();
					}
				);
			}

			//
			// Settings
			//

			this.getSettingsTab = function()
			{
				return [
					new ViewGeneralOptions(),
					new ViewMapOptions(),
					new ViewThemeOptions(),
					new ViewHeader({
						smallSizeOpt: app.appCfg.headerCompactOpt
					}),
				];
			};

			this.openSettingPopup = function()
			{
				if(!app.data.getWebAppData().getHeader().compactSize){
					var settings = app.data.getWebAppData().getHeader();
					settings.compactSize = app.appCfg.headerCompactByDefault;
					WebApplicationData.setHeader(settings);
				}
				_settingsPopup.present(
					[
						WebApplicationData.getGeneralOptions(),
						WebApplicationData.getGeneralOptions(),
						WebApplicationData.getThemeOptions(),
						WebApplicationData.getHeader()
					],
					null
				);
			};

			this.openMigrationPopup = function(pointLayers, layers){

				_migrationPopup.present(pointLayers, layers).then(function(obj){
					if(!obj.migrate || obj.migrate == 'as-is'){
						app.maps[app.data.getResponse().itemInfo.item.id] = _mainView.getMapConfig(app.data.getResponse());
						if(obj.migrate == 'as-is'){
							app.data.getWebAppData().setIsExternalData(true);
							app.isGalleryCreation = false;
						}
						if(app.maps[app.data.getWebAppData().getWebmap()].response.itemInfo.item.owner != app.data.getWebAppItem().owner && !app.data.getWebAppData().getIsExternalData()){
							cloneUnownedMap(obj.pointLayers, obj.layers);
							app.detailPanelBuilder.init(app.ui.mainView, _this);
						} else{
							var itemResponse = app.maps[app.data.getWebAppData().getWebmap()].response.itemInfo.item;
							var description = itemResponse.snippet ? itemResponse.snippet : itemResponse.description;
							app.ui.headerDesktop.setTitleAndSubtitle(app.data.getWebAppItem().title, description);
							app.data.getWebAppData().setTitle(app.data.getWebAppItem().title);
							if(description){
								app.data.getWebAppData().setSubtitle(description);
							}
							if(app.data.getResponse().itemInfo.itemData.bookmarks && app.data.getResponse().itemInfo.itemData.bookmarks.length){
								var settings = {
									extentMode: "customHome",
									numberedIcons: false,
									filterByExtent: true,
									bookmarks: true,
									bookmarksAlias: app.cfg.BOOKMARKS_ALIAS
								};
								app.data.getWebAppData().setGeneralOptions(settings);
								app.ui.navBar.initBookmarks();
							}
							//var config = {};
							//_this.initPopupComplete(config);
							_this.storyDataReady();

							if(!obj.migrate){
								app.isWebMapFirstSave = true;
								app.addFeatureBar.addLayer();
								_core.appInitComplete(WebApplicationData);
								_core.displayApp();
								app.detailPanelBuilder.init(app.ui.mainView, _this);
							} else{
								//PASS THROUGH OPTION
								if (app.data.getWebAppData().getShortlistLayerId())
									app.map.removeLayer(app.map.getLayer(app.data.getWebAppData().getShortlistLayerId()));
								app.data.getWebAppData().clearTabs();
								$('.tab-cfg-extent-mode').remove();
								$('.settings-mapoptions').css('margin-top', '40px');
								$('.bookmarkTooltip').css({'top': '102px'});
								_this.openNoDataEditMode();
							}
							//_this.initMapExtentSave();
						}
					}else{
						app.isWebMapFirstSave = true;
					}
				});
			};

			this.openNoDataEditMode = function(){
				$('#addFeatureBar').remove();
				$('#myList').height($("#paneLeft").height() - 48);
				$('.builder-organize').remove();
				$('.builder-add').remove();
				_mainView.processExternalData();
			};

			function cloneUnownedMap(pointLayers, layers){
				var newWebmap = _this.buildWebMap();
				app.data.getWebAppData().setTitle(app.data.getWebAppItem().title);
				newWebmap.item.title = app.data.getResponse().itemInfo.item.title + ' - Shortlist builder';
				app.data.getResponse().itemInfo.item.title = newWebmap.item.title;
				if(app.data.getWebAppItem().description  || app.data.getWebAppItem().snippet){
					var description = app.data.getWebAppItem().snippet ? app.data.getWebAppItem().snippet : app.data.getWebAppItem().description;
					app.data.getWebAppData().setSubtitle(description);
					newWebmap.item.description = description;
				} else if(app.data.getResponse().itemInfo.item.description  || app.data.getResponse().itemInfo.item.snippet){
					var description = app.data.getResponse().itemInfo.item.snippet ? app.data.getResponse().itemInfo.item.snippet : app.data.getResponse().itemInfo.item.description;
					app.data.getWebAppData().setSubtitle(description);
					newWebmap.item.description = description;
				}
				app.ui.headerDesktop.setTitleAndSubtitle(app.data.getWebAppData().getTitle(), app.data.getWebAppData().getSubtitle());
				//TODO just use item and item data as is?
				newWebmap.item.extent = app.data.getResponse().itemInfo.item.extent;
				newWebmap.itemData.spatialReference = app.data.getResponse().itemInfo.itemData.spatialReference;
				newWebmap.itemData.baseMap = app.data.getResponse().itemInfo.itemData.baseMap;

				app.mapItem = app.data.getResponse().itemInfo;

				if(app.data.getResponse().itemInfo.itemData.bookmarks && app.data.getResponse().itemInfo.itemData.bookmarks.length)
					newWebmap.itemData.bookmarks = app.data.getResponse().itemInfo.itemData.bookmarks;

				app.data.getWebAppData().setOriginalWebmap(app.data.getWebAppData().getWebmap());

				app.map.destroy();
				app.map = null;
				var mapPromise = _mainView.loadWebmap(newWebmap, 'map');
				mapPromise.then(function(response){
					app.data.setResponse(response);
					app.map = mapPromise.results[0].map;
					var genSettings = app.data.getWebAppData().getGeneralOptions();
					genSettings.extentMode = "customHome";
					app.data.getWebAppData().setGeneralOptions(genSettings);

					_this.storyDataReady();

					var colorOrder = app.cfg.COLOR_ORDER.split(",");
					var activeColor = $.grep(app.cfg.COLOR_SCHEMES, function(e){ return e.name == colorOrder[0]; });
					$('#contentPanel').css('border-top-color', activeColor[0].color);
					var colors = {
						header: app.data.getWebAppData().getThemeOptions().headerColor,
						tabText: '#d8d8d8',
						tab: '#666',
						tabTextActive: '#fff',
						tabActive: activeColor[0].color,
						tabTextHover: '#fff',
						tabHover: '#666'
					};
					var entryIndex = 0;
					var firstEntry = {};

					firstEntry.title = 'Tab 1';
					app.ui.navBar.init(
						[firstEntry],
						entryIndex,
						colors,
						app.data.getWebAppData()
					);

					var originalOperationalLayers = [];
					$.each(layers, function(index, layer){
						var operationalLayer = $.grep(app.data.getWebMap().itemData.operationalLayers, function(n){ return n.id == layer.id.slice(0, -2); });
						var layerType;
						if(layer.layerType){
							layerType = layer.layerType;
						}else{
							layerType = layer.type;
						}
						if(layer.url && (layerType === 'ArcGISFeatureLayer' || layerType === 'Feature Layer' || layer.tileMap || layer.tileInfo) && !layer.id.match(/^csv_/)){
							operationalLayer = $.grep(app.data.getWebMap().itemData.operationalLayers, function(e){ return e.id ==  layer.id; });
						}
						if(operationalLayer[0]){
							originalOperationalLayers.push(operationalLayer[0]);
							app.map.addLayer(layer);
						}
					});

					$.each(pointLayers, function(index, layer){
						var operationalLayer = $.grep(app.data.getWebMap().itemData.operationalLayers, function(n){ return n.id == layer.id.slice(0, -2); });
						var layerType;
						if(layer.layerType){
							layerType = layer.layerType;
						}else{
							layerType = layer.type;
						}
						if(layer.url && (layerType === 'ArcGISFeatureLayer' || layerType === 'Feature Layer') && !layer.id.match(/^csv_/)){
							operationalLayer = $.grep(app.data.getWebMap().itemData.operationalLayers, function(e){ return e.id ==  layer.id; });
						}
						if(operationalLayer[0]){
							originalOperationalLayers.push(operationalLayer[0]);
							app.map.addLayer(layer);
						}
					});

					pointLayers.reverse();

					app.data.setWebMap(mapPromise.results[0].itemInfo);
					app.addFeatureBar.addLayer(true);
					$.each(originalOperationalLayers, function(index, layer){
						app.data.getWebMap().itemData.operationalLayers.push(layer);
					});

					var webMapItem = app.data.getWebMap();

					lang.mixin(
						webMapItem.item,
						{
							uploaded: Date.now(),
							modified: Date.now(),
							owner: app.data.getWebAppItem().owner,
							access: 'private'
						}
					);
					_this.updateUI();
					_core.appInitComplete(app.data.getWebAppData());

					var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());

					var baseMapLayerUpdated = false;

					var baseMapLayer = app.map.getLayer(app.data.getWebMap().itemData.baseMap.baseMapLayers[0].id);
					baseMapLayer.on('update-end', function(){
						if(baseMapLayerUpdated)
							return;
						baseMapLayerUpdated = true;
					});

					$("#loadingIndicator").show();

					if(app.data.getResponse().itemInfo.itemData.bookmarks && app.data.getResponse().itemInfo.itemData.bookmarks.length){
						var settings = {
							extentMode: 'customHome',
							numberedIcons: false,
							filterByExtent: true,
							bookmarks: true,
							bookmarksAlias: app.cfg.BOOKMARKS_ALIAS
						};
						app.data.getWebAppData().setGeneralOptions(settings);
						app.ui.navBar.initBookmarks();
					}

					//_mapExtentSave.init();

					setTimeout(function(){
						_core.displayApp();
						_mainView.activateLayer(0);
						app.map.setExtent(app.map._params.extent, true);
						topic.publish("BUILDER_INCREMENT_COUNTER", 1);
						app.data.getWebAppItem().typeKeywords.push('Shortlist-migration');
						app.maps[response.itemInfo.item.id] = _mainView.getMapConfig(response);
						// Make sure shortlist layer is above all other layers (i.e. mapnotes);
						app.map.reorderLayer(shortlistLayer, app.map.graphicsLayerIds.length - 1);
					}, 800);
				});
			}

			this.updateAllFeatures = function(result)
			{
				var newShortlistID = 0;

				/*var shortlistLayerId = $.grep(app.map.graphicsLayerIds, function(e){
					if(e.split('_').slice(0,-1).join('_') == WebApplicationData.getShortlistLayerId())
						return e;
					else if(e ==WebApplicationData.getShortlistLayerId())
						return e;
					else{
						return false;
					}
				});*/

				var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
				var graphics = shortlistLayer.graphics;
				var deletedThemes = {};

				$.each(graphics, function(index, graphic){

					if(graphic.attributes.tab_id in deletedThemes){
						//do nothing
					} else{
						deletedThemes[graphic.attributes.tab_id] = graphic.attributes.tab_id;
					}
				});

				if(result){
					$.each(result.entries, function(index, tab){
						delete deletedThemes[tab.id];
					});

					var graphicsCopy = graphics.slice(0);
					$.each(graphicsCopy, function(index, graphic){
						if(graphic.attributes.tab_id in deletedThemes){
							shortlistLayer.remove(graphic);
						}
					});

					var tabGraphics = [];
					$.each(result.entries, function(index, tab){
						tabGraphics.push($.grep(graphics, function(g){ return g.attributes.tab_id == tab.id; }));
					});

					$.each(tabGraphics, function(index, tab){
						$.each(tab, function(i, graphic){
							graphic.attributes.tab_id = index;
							/*if(result.entries[graphic.attributes.tab_id] in deletedThemes){
								Do nothing
							} else{
								deletedThemes[graphic.attributes.tab_id];
							}*/
						});

						tab.id = index;
					});
				}


				var tabs = [];
				var entries = $('#nav-bar').find(".nav-tabs > li:not(.dropdown)");

				$.each(entries, function(){
					tabs.push([]);
				});

				$.each(graphics, function(i,graphic){
					if(parseInt(graphic.attributes.tab_id) > -1)
						tabs[parseInt(graphic.attributes.tab_id)].push(graphic);
				});

				var titles = [];
				var colors = [];
				var featureNumber = null;

				if(app.data.getWebAppData().getIsExternalData()){
					if(app.data.getWebAppData().getGeneralOptions().numberedIcons){
						$('.detailFeatureTitle').removeClass('notNumbered');
						$('.detailFeatureTitle').css('margin-top', '-45px');
					}else{
						$('.detailFeatureTitle').addClass('notNumbered');
					}
					var fields = shortlistLayer.fields;

					$.each(fields, function(index, field){
						if(field.name.toLowerCase() == 'number' || field.name.toLowerCase() == 'placenumsl')
							featureNumber = field.name;
					});
				}


				$.each(tabs, function(index, tab){
					tab.sort(function(a,b){
						var aNum = a.attributes[$.grep(Object.keys(a.attributes), function(n) {return n.toLowerCase() == 'number';})[0]];
						var bNum = b.attributes[$.grep(Object.keys(b.attributes), function(n) {return n.toLowerCase() == 'number';})[0]];
						return parseInt(aNum) - parseInt(bNum);
					});

					var color = (result && result.entries[index].color) ? result.entries[index].color :  app.data.getStory()[index].color;
					var title = (result && result.entries[index].title) ? result.entries[index].title : app.data.getStory()[index].title;

					if(!app.data.getWebAppData().getIsExternalData()){
						$.each(tab, function(i, graphic){
							graphic.attributes.shortlist_id = newShortlistID;
							graphic.attributes.number = i+1;
							//$.each(WebApplicationData.getContentLayers(), function(index, value){
							var newIcon = _this.addMapIcon(graphic, color);
							graphic.symbol = newIcon.symbol;
							newShortlistID++;
						});
					}else{
						$.each(tab, function(i, graphic){
							//graphic.attributes.shortlist_id = i+1;
							graphic.attributes.number = featureNumber ? graphic.attributes[featureNumber] : i+1;
							var newIcon = _this.addMapIcon(graphic, color);
							graphic.symbol = newIcon.symbol;
						});
						$.each($('#detailView' + index + ' .swiper-slide'), function(i, slide){
							$(slide).find('.detailFeatureNum').text(i+1);
							$(slide).find('.detailFeatureNum').css('background-color', color);
							$(slide).find('.detailFeatureNum').toggle(app.data.getWebAppData().getGeneralOptions().numberedIcons);
						});
					}
					titles.push(title);
					colors.push(color);
				});

				app.data.clearStory();

				$.each(tabs, function(index){
					app.data.setStory(index, titles[index], colors[index]);
				});

				WebApplicationData.setTabs(app.data.getStory());
				var themeIndex = $('.entry.active').index();
				if(result)
					themeIndex = result.sectionIndex;

				app.ui.tilePanel.buildTilePanel();

				shortlistLayer.redraw();
				if(WebApplicationData.getTitle())
					topic.publish("BUILDER_INCREMENT_COUNTER");
			};

			this.addMapIcon = function(feature, color, updateColor)
			{
				var spec = app.ui.mainView.lutIconSpecs.tiny;
				var coloredIcon;
				var newIconColor = color;

				var newCanvas = document.createElement('canvas');
				newCanvas.width = _icon.width;
				newCanvas.height = _icon.height;
				var newContext = newCanvas.getContext('2d');
				newContext.font = newCanvas.width/3.8 + "pt open_sanssemibold, sans-serif";
				newContext.drawImage(_myCanvas, 0, 0);

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

				//if(index > 0)
					newContext.putImageData(coloredIcon,0,0);

				if(WebApplicationData.getGeneralOptions().numberedIcons){
					var label = feature.attributes.PLACENUMSL ? feature.attributes.PLACENUMSL : feature.attributes.number;//index + 1;
					newContext.textAlign = "center";
					newContext.fillStyle = 'white';
					newContext.fillText(label, newCanvas.width/3.2, newCanvas.height/2);
				}

				if(updateColor)
					feature.setSymbol(createSymbol(newCanvas, spec));
				else{
					var graphic = new esri.Graphic(new esri.geometry.Point(feature.geometry), createSymbol(newCanvas, spec), feature.attributes);
					return graphic;
				}

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

			function createSymbol(newCanvas, spec){
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

			function appLoadingTimeout(){
				$("#loadingMessage").html(
					'<div class="mainMessage">'
					+  i18n.viewer.loading.long
					+  '<br />'
					+  i18n.viewer.loading.long2
					+ '</div>'
				).fadeIn("slow", function(){ $("#loadingMessage").addClass("loaded"); });
			}

			function hideInitPopup()
			{
				$('.builder-title-mask').hide();
				$('#builderQuotes').css('display', 'none', '!important');
				$('#builderLanding').css('display', 'none', '!important');
			}

			function settingsPopupSave(data)
			{
				var updateExtentMode = data.settings[1].extentMode != app.data.getWebAppData().getGeneralOptions().extentMode;
				var updateIcons = data.settings[0].numberedIcons != app.data.getWebAppData().getGeneralOptions().numberedIcons;
				var updateLocateButton = data.settings[1].locateButton != app.data.getWebAppData().getGeneralOptions().locateButton;
				var updateGeocoder = data.settings[1].geocoder != app.data.getWebAppData().getGeneralOptions().geocoder;
				var updateBookmarks = data.settings[1].bookmarks != app.data.getWebAppData().getGeneralOptions().bookmarks;
				var updateBookmarksAlias = data.settings[1].bookmarksAlias != app.data.getWebAppData().getGeneralOptions().bookmarksAlias;

				// Combine general and map.  Necessary as we split options up after setting data model.  bleh.
				var generalOptions = data.settings[0];
				$.extend(generalOptions, data.settings[1]);
				app.data.getWebAppData().setGeneralOptions(data.settings[0]);
				app.data.getWebAppData().setThemeOptions(data.settings[2]);
				app.data.getWebAppData().setHeader(data.settings[3]);


				if(updateExtentMode)
					topic.publish("UPDATE_EXTENT_MODE", data.settings[1].extentMode);
				if(updateIcons){
					setTimeout(function(){
						_this.updateAllFeatures();
						if(!app.data.getWebAppData().getIsExternalData()){
							app.detailPanelBuilder.buildAllSlides();
						}
						else{
							//app.ui.detailPanel.buildSlides();
						}
						_mainView.activateLayer($('.entry.active').index());

						setTimeout(function(){
							if(app.ui.mainView.selected){
								app.ui.mainView.selected = null;
								if(app.mapTips)
									app.mapTips.clean(true);
							}
						}, 50);
					}, 50);
				}
				if(updateLocateButton){
					if(!app.maps[app.data.getWebAppData().getWebmap()] && app.maps[app.data.getWebAppData().getOriginalWebmap()])
						app.maps[app.data.getWebAppData().getOriginalWebmap()].mapCommand.enableLocationButton(data.settings[1].locateButton);
					else{
						app.maps[app.data.getWebAppData().getWebmap()].mapCommand.enableLocationButton(data.settings[1].locateButton);
					}
				}
				if(updateGeocoder){
					if(!app.maps[app.data.getWebAppData().getWebmap()]  && app.maps[app.data.getWebAppData().getOriginalWebmap()])
						app.maps[app.data.getWebAppData().getOriginalWebmap()].geocoder.toggle(data.settings[1].geocoder);
					else{
						if(app.maps[app.data.getWebAppData().getWebmap()])
							app.maps[app.data.getWebAppData().getWebmap()].geocoder.toggle(data.settings[1].geocoder);
						else{
							app.maps.map.geocoder.toggle(data.settings[1].geocoder);
						}
					}
				}
				if(updateBookmarks){
					if(!app.ui.navBar.bookmarksLoaded && data.settings[1].bookmarks)
						app.ui.navBar.initBookmarks();
					else if(app.ui.navBar.bookmarksLoaded && data.settings[1].bookmarks){
						app.ui.navBar.showBookmarks();
					} else{
						app.ui.navBar.hideBookmarks();
					}
				}
				if(updateBookmarksAlias){
					app.ui.navBar.updateBookmarksAlias(data.settings[1].bookmarksAlias);
				}

				topic.publish("BUILDER_INCREMENT_COUNTER", 1);
				topic.publish("CORE_UPDATE_UI");
				topic.publish("CORE_RESIZE");

				updateAddButtonStatus();
			}

			//
			// Direct creation first save
			//

			//TODO first save will now be title, so dont open share popup for that save, only after that
			function openSharePopup(isFirstSave)
			{
				_sharePopup.present(isFirstSave, Core.getHeaderUserCfg());
				if(isFirstSave && app.isDirectCreationFirstSave){
					app.maps[app.data.getWebAppData().getWebmap()] = _mainView.getMapConfig(app.data.getResponse());
					$.each($('.esriSimpleSliderIncrementButton .mapCommandHomeBtn'), function(index, button){
						if(index !== 0)
							$(button).parent().remove();
					});
				}
			}

			//
			// Init popup
			//

			this.showInitPopup = function()
			{
				Core.initPopupPrepare();

				if ( ! has("touch") )
					_landingUI.focus();
			};

			this.initPopupComplete = function(config)
			{
				if(_initPopupComplete && !app.isGalleryCreation)
					return;
				_initPopupComplete = true;
				if(config && config.pickWebmap){
					Core.initPopupComplete();
					//_workflow.present();
					//buildBrowseDialog();
					// TODO better place for positioning web map picker?
					$('#browse-id-dialog').css({top: '25%', left: '25%'});
					$('#browse-id-dialog').show();
				} else{
					//Core.displayApp();
					Core.initPopupComplete();
					app.data.getWebAppData().setDefaultLayoutOptions();

					_this.buildAddFeatureBar();


					if ( app.isDirectCreationFirstSave ) {
						app.addFeatureBar.addLayer();
						app.data.getWebAppData().setDefaultGeneralOptions();
						app.map.centerAndZoom([0,0], 3);
						//_this.initMapExtentSave();
						setTimeout(function(){
							app.data.getWebMap().item.extent = CommonHelper.serializeExtentToItem(app.map.extent);
							app.map._params.extent = new Extent(JSON.parse(JSON.stringify(app.map.extent.toJson())));
							app.data.getWebAppData().setMapExtent(app.map.extent);
							//_mapExtentSave.present();
						}, 500);
					}
					if(app.isGalleryCreation){
						var colorOrder = app.cfg.COLOR_ORDER.split(",");
						var activeColor = $.grep(app.cfg.COLOR_SCHEMES, function(e){ return e.name == colorOrder[0]; });
						$('#contentPanel').css('border-top-color', activeColor[0].color);
						var colors = {
							header: app.data.getWebAppData().getThemeOptions().headerColor,
							tabText: '#d8d8d8',
							tab: '#666',
							tabTextActive: '#fff',
							tabActive: activeColor[0].color,
							tabTextHover: '#fff',
							tabHover: '#666'
						};
						var entryIndex = 0;
						var firstEntry = {};

						firstEntry.title = 'Tab 1';
						app.ui.navBar.init(
							[firstEntry],
							entryIndex,
							colors,
							WebApplicationData
						);

						if(app.data.getWebAppData().getWebmap() == 'map'){
							app.addFeatureBar.addLayer();
							app.data.getWebAppData().setDefaultGeneralOptions();
							app.map.centerAndZoom([0,0], 3);
							//_this.initMapExtentSave();
							setTimeout(function(){
								app.data.getWebMap().item.extent = CommonHelper.serializeExtentToItem(app.map.extent);
								app.map._params.extent = new Extent(JSON.parse(JSON.stringify(app.map.extent.toJson())));
								//_mapExtentSave.present();
								app.ui.headerDesktop.setTitleAndSubtitle(app.data.getWebAppItem().title, app.data.getWebAppItem().description);
								app.data.getWebAppData().setTitle(app.data.getWebAppItem().title);
								if(app.data.getWebAppItem().description)
									app.data.getWebAppData().setSubtitle(app.data.getWebAppItem().description);
								topic.publish("BUILDER_INCREMENT_COUNTER", 1);
							}, 500);
						}

					}else{
						_directCreationFirstLoad = false;
						var shortlistLayerId = $.grep(app.map.graphicsLayerIds, function(e){
							if(e.split('_').slice(0,-1).join('_') == WebApplicationData.getShortlistLayerId())
								return e;
							else if(e ==WebApplicationData.getShortlistLayerId())
								return e;
							else{
								return false;
							}
						});

						if(!shortlistLayerId.length){
							var colorOrder = app.cfg.COLOR_ORDER.split(",");
							var activeColor = $.grep(app.cfg.COLOR_SCHEMES, function(e){ return e.name == colorOrder[0]; });
							$('#contentPanel').css('border-top-color', activeColor[0].color);
							var colors = {
								header: app.data.getWebAppData().getThemeOptions().headerColor,
								tabText: '#d8d8d8',
								tab: '#666',
								tabTextActive: '#fff',
								tabActive: activeColor[0].color,
								tabTextHover: '#fff',
								tabHover: '#666'
							};
							var entryIndex = 0;
							var firstEntry = {};
							firstEntry.title = 'Tab 1';
							app.ui.navBar.init(
								[firstEntry],
								entryIndex,
								colors,
								WebApplicationData
							);
							app.addFeatureBar.addLayer(true);
							if(!app.data.getWebAppData().getGeneralOptions() && !app.data.getWebAppData().getGeneralOptions().bookmarks)
								app.data.getWebAppData().setDefaultGeneralOptions();
							setTimeout(function(){
								_this.initMapExtentSave();
							}, 2500);
							return;
						}
						app.data.setShortlistLayerId(shortlistLayerId[0]);
						var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
						//_this.initMapExtentSave();

						if(!app.data.getWebAppData().getIsExternalData()){
							/*if (_helper.isIE() <= 0){
								Object.assign(app.layerCurrent, shortlistLayer);
								return;
							}/*else{
								app.layerCurrent = lang.clone(shortlistLayer);
							}*/
						}
						shortlistLayer.on("mouse-over", _mainView.layer_onMouseOver);
						shortlistLayer.on("mouse-out", _mainView.layer_onMouseOut);
						shortlistLayer.on("click", _mainView.layer_onClick);

						/*if(app.data.getWebAppData().getMapExtent()){
							var newExtent =  new Extent(app.data.getWebAppData().getMapExtent());
							app.map.setExtent(newExtent);
							app.map._params.extent = new Extent(JSON.parse(JSON.stringify(app.data.getWebAppData().getMapExtent())));
						}*/
					}

					topic.publish("CORE_UPDATE_UI");

					app.map.on('pan-start', function(){
						app.ui.mainView.mapIsPanning = true;
					});
					app.map.on('pan-end', function(){
						setTimeout(function(){
							app.ui.mainView.mapIsPanning = false;
						}, 800);
					});

					app.map.on('zoom-start', function(){
						app.ui.mainView.mapIsZooming = true;
					});
					app.map.on('zoom-end', function(){
						setTimeout(function(){
							app.ui.mainView.mapIsZooming = false;
						}, 800);
					});

					// Toggle off some components that would otherwise be desperately empty
					//$("body").addClass("isBuilderLanding");

					// Will trigger layout detroy/init in MainView/updateUI
					$("body").addClass("switchLayout");
					Core.appInitComplete(WebApplicationData);

					if(app.data.getWebAppData().getGeneralOptions().extentMode == 'customHome' ){
						setTimeout(function(){
							if(!_mapExtentSave.initDone)
								_this.initMapExtentSave();
						}, 500);
					}

					// Focus the landing screen title input
					// Except on iPad where the field is less sensible
					/*setTimeout(function(){
						if ( ! has("touch") )
							_landingUI.focus();
					}, 50);*/
				}

				app.detailPanelBuilder.init(_mainView, _this);
			};

			this.initMapExtentSave = function()
			{
				_mapExtentSave.init();
			};

			this.buildAddFeatureBar = function()
			{
				if(!app.addFeatureBar.loaded && !app.data.getWebAppData().getIsExternalData()){
					app.addFeatureBar.init(_mainView, _this);
				}
			};

			this.updateShortlistExtent = function()
			{
				if(app.map.getLayer(app.data.getWebAppData().getShortlistLayerId()).graphics.length == 1){
					var geom = app.map.getLayer(app.data.getWebAppData().getShortlistLayerId()).graphics[0].geometry;
					if(app.map.spatialReference.wkid != 4326)
						geom = webMercatorUtils.webMercatorToGeographic(geom);
					app.map.centerAndZoom([geom.x, geom.y], 13);
				}

				var tempGraphicsLayer = new GraphicsLayer();
				$.each(app.map.getLayer(app.data.getWebAppData().getShortlistLayerId()).graphics, function(index, graphic){
					if(graphic.attributes.locationSet)
						tempGraphicsLayer.graphics.push(graphic);
				});

				var shortlistExtent;
				var newExtent;
				if(tempGraphicsLayer.graphics.length > 1){
					shortlistExtent = graphicsUtils.graphicsExtent(tempGraphicsLayer.graphics);
					//app.map.setExtent(shortlistExtent, true);
					app.map.getLayer(app.data.getShortlistLayerId()).redraw();
					newExtent =  new Extent(JSON.parse(JSON.stringify(shortlistExtent.toJson())));
				}else if(tempGraphicsLayer.graphics.length == 1){
					newExtent =  new Extent(JSON.parse(JSON.stringify(app.map.extent.toJson())));
				}

				if(app.data.getWebAppData().getGeneralOptions().extentMode == "default"){
					app.appCfg.mapExtentFit = true;
					$.each(app.data.getStory(), function(index){
						app.data.setStory(index, null, null, newExtent);
					});
					_this.serializeExtentToItem(shortlistExtent);
					app.map._params.extent =  newExtent;
					app.data.getWebAppData().setTabs(app.data.getStory());
					app.data.getWebAppData().setMapExtent(shortlistExtent);
				}
				if(app.data.getWebAppData().getGeneralOptions().extentMode == "customTheme"){
					app.appCfg.mapExtentFit = true;
					var tabIndex = $('.entry.active').index();
					app.data.setStory(tabIndex, null, null, newExtent);
					WebApplicationData.setTabs(app.data.getStory());
					//app.map.setExtent(newExtent, true);
				}
			};

			this.serializeExtentToItem = function(extent)
			{
				if( ! extent || ! extent.spatialReference )
					return null;

				var extentWgs = extent.spatialReference.wkid == 4326 ? extent : webMercatorUtils.webMercatorToGeographic(extent);

				if(extent.spatialReference.wkid != 4326 && extent.spatialReference.wkid != 102100){
					var sr = new SpatialReference(4326);
					esriConfig.defaults.geometryService.project([extent], sr).then(function(features){
						extentWgs = features[0];
						app.data.getWebMap().item.extent = [[extentWgs.xmin, extentWgs.ymin],[extentWgs.xmax, extentWgs.ymax]];
					});
				}else{
					app.data.getWebMap().item.extent = [[extentWgs.xmin, extentWgs.ymin],[extentWgs.xmax, extentWgs.ymax]];
				}
			};

			function updateExtentMode(mode)
			{
				var generalSettings = app.data.getWebAppData().getGeneralOptions();
				generalSettings.extentMode = mode;
				app.data.getWebAppData().setGeneralOptions(generalSettings);
				if(mode == "default"){
					app.appCfg.mapExtentFit = true;
					if(_mapExtentSave.initDone)
						_mapExtentSave.hideAlways();
					_this.updateShortlistExtent();
					$('.tab-cfg-location').hide();
				}
				if(mode == "customHome"){
					app.appCfg.mapExtentFit = true;
					if(!_mapExtentSave.initDone)
						_this.initMapExtentSave();
					_mapExtentSave.reinit();
					$('.tab-cfg-location').hide();
				}
				if(mode == "customTheme"){
					if(_mapExtentSave.initDone)
						_mapExtentSave.hideAlways();
					$('.tab-cfg-location').show();
				}
			}

			function buildBrowseDialog()
			{
				_browseDialog = new BrowseIdDlg({
					portal: app.portal,
					galleryType: "webmap"
				});

				on(_browseDialog._grid, "onItemClick", function(){
					_browseDialog.onClose();
				});

				on(_browseDialog, "close", function(){
					if (_browseDialog.get("selected")) {
						Core.loadWebMap(_browseDialog.get("selected").id);
						/*container.find('.webmaps-list-btn-inner')
							.data('webmap', _browseDialog.get("selected").id)
							.html(
								'<span class="title">'
								+ _browseDialog.get("selected").title
								+ '</span>'
								+ '<span class="info">' + i18n.commonWebmap.selector.newMap + '</span>'
							);*/
						/*container.find('.selected-map-sharing-status').html(_browseDialog.get("selected").access);
						// Reset Map Config
						_mapConfig = {};
						updateStatusConfigureButton();

						onDataChangeCallback && onDataChangeCallback({
							newMedia: {
								type: 'webmap',
								webmap: {
									id: _browseDialog.get("selected").id,
									title: _browseDialog.get("selected").title
								}
							}
						});*/
					}
				});
			}

			function updateTitleStyle(){
				if($('#headerDesktop').find('.title').text().length)
					$('#headerDesktop').find('.title').removeClass('titleEmpty');
			}

			/*jshint -W098 */
			this.resize = function(cfg)
			{
				_sharePopup.updateMyStoriesPosition();
				//
			};

			this.initLocalization = function()
			{
				_settingsPopup.initLocalization();
			};
		};
	}
);
