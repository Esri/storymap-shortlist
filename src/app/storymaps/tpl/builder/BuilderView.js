define(["lib-build/tpl!./BuilderView",
		"lib-build/tpl!./BasemapChooser",
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
		"./BuilderHelper",
		"storymaps/common/utils/WebMapHelper",
		"esri/dijit/BasemapGallery",
		// Web map picker
		"storymaps/common/builder/browse-dialog/js/BrowseIdDlg",
		"lib-build/css!../../common/builder/browse-dialog/css/browse-dialog",
		"lib-build/css!../../common/builder/browse-dialog/storymaps-override",
		// Settings tab
		"./settings/ViewGeneralOptions",
		"./settings/ViewMapOptions",
		"storymaps/common/builder/settings/ViewHeader",
		// gloabal map extent save (home button setting)
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
		basemapChooser,
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
		BuilderHelper,
		WebMapHelper,
		BasemapGallery,
		// Web map picker
		BrowseIdDlg,
		browseDlgCss,
		browseDlgCss2,
		// Settings tab
		ViewGeneralOptions,
		ViewMapOptions,
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
			$('#map').append(basemapChooser({ }));

			var _this = this,
				_core = Core,
				_firstLoad = true,
				_settingsPopup = null,
				//_landingUI = new Landing($("#builderLanding"), firstAdd, function(){ alert("TODO"); }),
				//_initPopup = new InitPopup($("#initPopup")),
				_helpUI = new Help($("#builderHelp")),
				_sharePopup = new SharePopup($('#sharePopup')),
				_addEditPopup = new AddEditPopup($('#addEditPopup'), _this),
				_media = new Media($('#editorDialogInlineMedia')),
				_organizePopup = new OrganizePopup($('#organizePopup')),
				_workflow = new Workflow($("#initPopup")),
				_mapExtentSave = new MapExtentSave($('#map_zoom_slider'), _this),
				_mapConfig = null,
				_browseDialog = null,
				_mainView,
				_commonHelper = CommonHelper,
				_migrationPopup;


			app.detailPanelBuilder = new DetailPanelBuilder($('#contentPanel'), _media);
			app.addFeatureBar = new AddFeatureBar($('#contentPanel'), _media);
			app.initScreenIsOpen = true;

			this.init = function(settingsPopup)
			{
				_settingsPopup = settingsPopup;
				_mainView = app.ui.mainView;

				_migrationPopup = new MigrationPopup($('#migrationPopup'), _core, _mainView, _this, WebApplicationData),

				topic.subscribe("SETTINGS_POPUP_SAVE", settingsPopupSave);
				topic.subscribe("OPEN_HELP", function(){ _helpUI.present(); });
				topic.subscribe("HEADER_EDITED", updateTitleStyle);
				topic.subscribe("UPDATE_EXTENT_MODE", updateExtentMode);

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
					.find(".builder-lbl").html('Organize Tabs');

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

				updateAddButtonStatus();
			};

			this.storyDataReady = function()
			{
				app.initScreenIsOpen = false;
				var basemapGallery = dijit.byId('basemapGallery');
				if(basemapGallery)
					basemapGallery.destroyRecursive(true);

				basemapGallery = new BasemapGallery(
					{
						showArcGISBasemaps: true,
						map: app.map
					},
					"basemapGallery"
				);
				basemapGallery.startup();

				$("#basemapChooser .dijitTitlePaneTextNode").text('Change Basemap');
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
					_this.initPopupComplete(config);
				}

			};

			this.updateUI = function(forceStoryInit)
			{
				var storyInit = forceStoryInit || app.data.getStoryLength();
				$(".builder-add, .builder-organize").removeClass("active");

				//_landingUI.toggle(! storyInit);
				//$(".builder-content-panel").toggle(!! storyInit);
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
			};

			//
			// Add
			//

			this.buildWebMap = function()
			{
				return BuilderHelper.getBlankWebmapJSON();
			};

			function firstAdd(title)
			{
				_this.updateUI(true);

				if(title)
					WebApplicationData.setTitle(title);
				topic.publish("CORE_UPDATE_UI");

				clickAdd();
				if(!_firstLoad)
					return;

				if(app.isDirectCreationFirstSave){
					//TODO populate with config colors info.  Also border for #paneLeft
					var colorOrder = app.cfg.COLOR_ORDER.split(",");
					var activeColor = $.grep(app.cfg.COLOR_SCHEMES, function(e){ return e.name == colorOrder[0]; });
					$('#contentPanel').css('border-top-color', activeColor[0].color);
					var colors = {
						header: '#444',
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

					//_mapExtentSave.show();
				}

			}

			function clickAdd()
			{
				_this.updateUI(true);

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
					entryIndex: cfg.entryIndex,
					syncMaps: WebApplicationData.getMapOptions().mapsSync ? !cfg.entryIndex : 1
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
							header: '#444',
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
						app.addFeatureBar.updateAllFeatures(result);
						app.detailPanelBuilder.buildAllSlides();

						_mainView.activateLayer(result.sectionIndex);

						topic.publish("story-update-entries");
						topic.publish("BUILDER_INCREMENT_COUNTER", 1); // TODO
					},
					function(){
						_this.updateUI();
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
					new ViewHeader({
						smallSizeOpt: app.appCfg.headerCompactOpt
					}),
				];
			};

			this.openSettingPopup = function()
			{

				var emptyHeader = $.isEmptyObject(app.data.getWebAppData().getHeader());
				if(emptyHeader){
					var settings = {};
					settings.compactSize = app.appCfg.headerCompactByDefault;
					WebApplicationData.setHeader(settings);
				}
				_settingsPopup.present(
					[
						WebApplicationData.getGeneralOptions(),
						WebApplicationData.getHeader()
					],
					null
				);
			};

			this.openMigrationPopup = function(pointLayers, layers){
				_migrationPopup.present(pointLayers, layers).then(function(obj){
					if(!obj.migrate){
						if(app.maps[app.data.getWebAppData().getWebmap()].response.itemInfo.item.owner != app.data.getWebAppItem().owner){
							cloneUnownedMap(obj.pointLayers, obj.layers);
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
							app.detailPanelBuilder.init(app.ui.mainView, _this);
							app.isWebMapFirstSave = true;
							//_this.initMapExtentSave();
							Core.appInitComplete(WebApplicationData);
						}
					}else{
						app.isWebMapFirstSave = true;
					}
				});
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

					app.data.getWebAppData().setDefaultMapOptions();
					var colorOrder = app.cfg.COLOR_ORDER.split(",");
					var activeColor = $.grep(app.cfg.COLOR_SCHEMES, function(e){ return e.name == colorOrder[0]; });
					$('#contentPanel').css('border-top-color', activeColor[0].color);
					var colors = {
						header: '#444',
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

			function appLoadingTimeout(){
				$("#loadingMessage").html(
					'<div class="mainMessage">'
					+  i18n.viewer.loading.long
					+  '<br />'
					+  i18n.viewer.loading.long2
					+ '</div>'
				).fadeIn("slow", function(){ $("#loadingMessage").addClass("loaded"); });
			}

			function settingsPopupSave(data)
			{
				var updateExtentMode = data.settings[0].extentMode != WebApplicationData.getGeneralOptions().extentMode;
				var updateIcons = data.settings[0].numberedIcons != WebApplicationData.getGeneralOptions().numberedIcons;
				var updateBookmarks = data.settings[0].bookmarks != WebApplicationData.getGeneralOptions().bookmarks;
				var updateBookmarksAlias = data.settings[0].bookmarksAlias != WebApplicationData.getGeneralOptions().bookmarksAlias;

				WebApplicationData.setGeneralOptions(data.settings[0]);
				WebApplicationData.setHeader(data.settings[1]);


				if(updateExtentMode)
					topic.publish("UPDATE_EXTENT_MODE", data.settings[0].extentMode);
				if(updateIcons){
					setTimeout(function(){
						app.addFeatureBar.updateAllFeatures();
						app.detailPanelBuilder.buildAllSlides();
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
				if(updateBookmarks){
					if(!app.ui.navBar.bookmarksLoaded && data.settings[0].bookmarks)
						app.ui.navBar.initBookmarks();
					else if(app.ui.navBar.bookmarksLoaded && data.settings[0].bookmarks){
						app.ui.navBar.showBookmarks();
					} else{
						app.ui.navBar.hideBookmarks();
					}
				}
				if(updateBookmarksAlias){
					app.ui.navBar.updateBookmarksAlias(data.settings[0].bookmarksAlias);
				}

				topic.publish("BUILDER_INCREMENT_COUNTER", 1);
				topic.publish("CORE_UPDATE_UI");
				topic.publish("CORE_RESIZE");

				updateAddButtonStatus();
			}

			//
			// Direct creation first save
			//

			function openSharePopup(isFirstSave)
			{
				_sharePopup.present(isFirstSave, Core.getHeaderUserCfg());
			}

			//
			// Init popup
			//

			this.showInitPopup = function()
			{
				Core.initPopupPrepare();
				//Core.initPopupFail();
				return

				//_initPopup.init();
				//_initPopup.initLocalization();

				/*_initPopup.present().then(
					initPopupComplete,
					function()
					{
						Core.initPopupFail();
					}
				);*/
			};

			this.initPopupComplete = function(config)
			{
				if(config.pickWebmap){
					Core.initPopupComplete();
					//_workflow.present();
					//buildBrowseDialog();
					// TODO better place for positioning web map picker?
					$('#browse-id-dialog').css({top: '25%', left: '25%'});
					$('#browse-id-dialog').show();
				} else{
					Core.displayApp();
					Core.initPopupComplete();
					app.data.getWebAppData().setDefaultLayoutOptions();

					_this.buildAddFeatureBar();

					if ( app.isDirectCreationFirstSave ) {
						app.addFeatureBar.addLayer();
						app.data.getWebAppData().setDefaultGeneralOptions();
						app.data.getWebAppData().setDefaultMapOptions();
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
						app.data.getWebAppData().setDefaultMapOptions();
						var colorOrder = app.cfg.COLOR_ORDER.split(",");
						var activeColor = $.grep(app.cfg.COLOR_SCHEMES, function(e){ return e.name == colorOrder[0]; });
						$('#contentPanel').css('border-top-color', activeColor[0].color);
						var colors = {
							header: '#444',
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

						if(!app.data.getWebAppData().getWebmap()){
							app.addFeatureBar.addLayer();
							app.data.getWebAppData().setDefaultGeneralOptions();
							app.data.getWebAppData().setDefaultMapOptions();
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
						//HERE
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
								header: '#444',
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
							app.data.getWebAppData().setDefaultMapOptions();
							setTimeout(function(){
								_this.initMapExtentSave();
							}, 2500);
							return;
						}
						app.data.setShortlistLayerId(shortlistLayerId[0]);
						var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
						//_this.initMapExtentSave();

						app.layerCurrent = shortlistLayer;
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
				if(!app.addFeatureBar.loaded){
					app.addFeatureBar.init(_mainView, _this);
				}
			};

			this.updateShortlistExtent = function()
			{
				if(app.map.getLayer(app.data.getWebAppData().getShortlistLayerId()).graphics.length == 1){
					var geom = webMercatorUtils.webMercatorToGeographic(app.map.getLayer(app.data.getWebAppData().getShortlistLayerId()).graphics[0].geometry);
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
