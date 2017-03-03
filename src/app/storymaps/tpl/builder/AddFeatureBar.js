define([
	"lib-build/tpl!./AddFeatureBar",
	"lib-build/css!./AddFeatureBar",
	"../core/WebApplicationData",
	"../core/Helper",
	"./BuilderHelper",
	"storymaps/common/builder/media/image/FileUploadHelper",
	"esri/geometry/Point",
	"esri/geometry/Extent",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/layers/GraphicsLayer",
	"esri/SpatialReference",
	"esri/geometry/webMercatorUtils",
	"esri/graphicsUtils",
	"esri/layers/FeatureLayer",
	"esri/graphic",
	"dojo/topic",
	"dojo/_base/lang"],
	function (
		viewTpl,
		viewCss,
		WebApplicationData,
		Helper,
		BuilderHelper,
		FileUploadHelper,
		Point,
		Extent,
		SimpleMarkerSymbol,
		GraphicsLayer,
		SpatialReference,
		webMercatorUtils,
		graphicsUtils,
		FeatureLayer,
		Graphic,
		topic,
		lang
	){
		return function AddFeatureBar(container, imagePicker)
		{
			var _initDone = false;
			var _this = this;
			var _mainView;
			var _imagePicker = imagePicker;
			var _helper = new Helper();
			/*var _icon;
			var _myCanvas;
			var _context;*/
			var _builderView;

			this.loaded = false;

			this.init = function(mainView, builderView)
			{
				_this.loaded = true;
				_mainView = mainView;
				_builderView = builderView;
				// Use timeout as have to wait for TilePanel component to construct paneLeft
				setTimeout(function(){
					container.find('#paneLeft').prepend(viewTpl({
						add: i18n.builder.addFeatureBar.add,
						importFeatures: i18n.builder.addFeatureBar.import,
						organize: i18n.builder.organizePopup.title,
						done: i18n.builder.addFeatureBar.done,
						deleteFeature: i18n.builder.addFeatureBar.deleteFeature,
						move: i18n.builder.addFeatureBar.move,
						locateFeaturesTooltip: i18n.builder.addFeatureBar.locateFeaturesTooltip
					}));
					initUI();
					initEvents();
					_this.updateLocatedFeatures();
				},  0);
				$('#importFeature').prop('disabled', true);

				/*_myCanvas = document.createElement('canvas');
				_context = _myCanvas.getContext('2d');
				_icon = new Image();
				_icon.src = app.cfg.ICON_SRC;

				_icon.onload = function(){
					_context.drawImage(_icon, 0, 0);
					_context.font = _myCanvas.width/2 + "pt";
				};*/
				$('#myList').addClass('builder');
			};

			this.close = function()
			{

			};

			this.addLayer = function(fromWebMap)
			{
				if(app.data.getWebAppData().getShortlistLayerId())
					return;
				//var shortlistLayer = new esri.layers.GraphicsLayer();
				var newLayer = BuilderHelper.getNewLayerJSON(BuilderHelper.getFeatureCollectionTemplate(true));
				app.data.getWebMap().itemData.operationalLayers.push(newLayer);
				WebApplicationData.setShortlistLayerId(newLayer.id);
				var shortlistLayer = new FeatureLayer(newLayer.featureCollection.layers[0]);
				shortlistLayer.id = newLayer.id;
				if(!app.map){
					setTimeout(function(){
						app.map.addLayer(shortlistLayer);
						//app.map.addLayer(newLayer);
					}, 500);
				} else{
					app.map.addLayer(shortlistLayer);
					//app.map.addLayer(newLayer);
				}
				app.data.setShortlistLayerId(newLayer.id);
				app.layerCurrent = shortlistLayer;
				shortlistLayer.on("mouse-over", app.ui.mainView.layer_onMouseOver);
				shortlistLayer.on("mouse-out", app.ui.mainView.layer_onMouseOut);
				shortlistLayer.on("click", app.ui.mainView.layer_onClick);

				if(app.isInBuilder && (app.isDirectCreationFirstSave || fromWebMap || app.isGalleryCreation)){
					app.detailPanelBuilder.addDetailPanelSwiper(0);
					var colorOrder = app.cfg.COLOR_ORDER.split(",");
					var colorScheme = $.grep(app.cfg.COLOR_SCHEMES, function(n){
						return n.name.toLowerCase() == $.trim(colorOrder[0].toLowerCase());
					})[0];
					app.data.setStory(0, 'Tab 1', colorScheme.color);
					WebApplicationData.setTabs(app.data.getStory());
					app.ui.mainView.activateLayer(0);
				}

				//WebApplicationData.setContentLayers(_shortlistLayers[themeIndex], themeIndex);

			};

			this.addFeature = function(params, updateLocate, geometry, hideSlide)
			{
				if(params && params.type == 'click')
					params = null;
				var themeIndex = $('.entry.active').index();
				if(themeIndex < 0)
					themeIndex = 0;

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
				var maxShortlistLayerObjectId = -1;
				if(shortlistLayer.graphics.length)
					maxShortlistLayerObjectId = Math.max.apply(Math,shortlistLayer.graphics.map(function(o){return o.attributes.__OBJECTID;}));
				var newShortlistID = shortlistLayer.graphics.length+1;
				var tabFeatures = $.grep(shortlistLayer.graphics, function(e){ return e.attributes.tab_id == themeIndex; });
				app.detailPanelBuilder.addSlide(tabFeatures.length + 1, newShortlistID, params);

				var tabFeaturesLength = tabFeatures.length;
				var colorIndex = themeIndex;
				if(colorIndex > 7)
					colorIndex = colorIndex % 7;
				//Need to do for each tab/swiper, not here
				var tabColor = app.data.getStory()[colorIndex].color;
				var placeName = params && params.name ? params.name : 'Unnamed Place';
				var picUrl = params && params.thumb_url ? params.thumb_url : null;
				var newTile;
				if(!picUrl)
					 picUrl = params && params.pic_url ? params.pic_url : null;
				if(picUrl)
					newTile = $('<li tabindex="0" id="item'+ (tabFeaturesLength + 1) + '" style="display:block"><div class="footer"><div class="blurb  ">' + placeName + '</div></div><div class="tileImage" style="outline: none; background-image: url(' + picUrl + ');"></div></li>');
				if(!picUrl)
					newTile = $('<li tabindex="0" id="item'+ (tabFeaturesLength + 1) + '" style="display:block"><div class="footer"><div class="blurb  ">' + placeName + '</div></div><div class="tileImage" style="outline: none;" ><i class=" fa fa-camera" aria-hidden="true"></i></div></li>');
				if(WebApplicationData.getGeneralOptions().numberedIcons){
					$(newTile).find('.footer').prepend($('<div class="num" style="background-color:'+tabColor+'">'+(tabFeaturesLength + 1)+'</div>'));

					/*if(value.attributes.getValueCI(app.cfg.FIELDNAME_NUMBER) < 100){
						num = $('<div class="num" style="background-color:'+app.layerCurrent.color+'">'+value.attributes.getValueCI(app.cfg.FIELDNAME_NUMBER)+'</div>');
					}
					else{
						num = $('<div class="num longNum" style="background-color:'+app.layerCurrent.color+'">'+value.attributes.getValueCI(app.cfg.FIELDNAME_NUMBER)+'</div>');
						title = $('<div class="blurb longNumBlurb">'+value.attributes.getValueCI(app.cfg.FIELDNAME_TITLE)+'</div>');
					}*/
				}
				container.find('#myList').append(newTile);
				$(newTile).data('shortlist-id', newShortlistID);
				$(newTile).on('click', function(){
					var thisTile = this;
					if($('body').hasClass('organizeFeatures'))
						return;
					app.detailPanelBuilder.showSlide($(this).data('shortlist-id'));
					app.ui.mainView.preSelection();
					app.ui.mainView.selected = $.grep(shortlistLayer.graphics,function(n){return n.attributes.shortlist_id == $(thisTile).data('shortlist-id');})[0];
					app.ui.mainView.postSelection();
				});

				$(newTile).on('mouseover', app.ui.tilePanel.tile_onMouseOver);

				$(newTile).on('mouseout', app.ui.tilePanel.tile_onMouseOut);

				if(!hideSlide)
					app.detailPanelBuilder.showSlide(newShortlistID);


				var geom;
				var atts = {
					__OBJECTID: maxShortlistLayerObjectId + 1,
					name: params && params.name ? params.name : '',
					description: params && params.description ? params.description: '',
					pic_url: params && params.pic_url ? params.pic_url : '',
					thumb_url: params && params.thumb_url ? params.thumb_url : '',
					shortlist_id: newShortlistID,
					number: (tabFeatures.length+1),
					tab_id: themeIndex,
					locationSet: geometry ? 1 : 0
				};

				if(!geometry){
					var long = 45;
					var lat = 45;

					var locationSet = 0;

					if(params && params.lng && params.lat){
						long = params.lng;
						lat = params.lat;
						locationSet = 1;
						$(newTile).addClass('located');
					} else{
						$(newTile).find('.tileImage').append('<div class="unlocated" style="outline: none;"></div>');
					}

					var newPt = new Point(long, lat, new SpatialReference({ wkid: 4326 }));
					geom = webMercatorUtils.geographicToWebMercator(newPt);
					atts.locationSet = locationSet;
				}else{
					$(newTile).addClass('located');
					geom = geometry;
				}

				var sms = new SimpleMarkerSymbol();
				var newGraphic = new Graphic(geom, sms, atts);
				var c = _builderView.addMapIcon(newGraphic, app.data.getStory()[themeIndex].color);

				shortlistLayer.add(c);
				app.layerCurrent.add(c);
				tabFeatures.push(c);

				if(!atts.locationSet)
					c.hide();

				_this.updateLocatedFeatures();

				if(WebApplicationData.getTitle())
					topic.publish("BUILDER_INCREMENT_COUNTER");
			};

			this.exitOrganizeMode = function(buildAllSlides)
			{
				if($('body').hasClass('organizeFeatures'))
					app.ui.tilePanel.destroySortable();
				$('#myList').find('li').removeClass('selected');
				$('.builder-content-panel .builder-content-panel-group').removeClass('disabled');
				$('.builder-lbl').removeClass('disabled');
				$('.builder-content-panel.inline .builder-btn').removeClass('disabled');
				$('.located').show();
				$('#addFeature').show();
				$('#importFeature').show();
				$('#organizeFeatures').show();
				$('body').removeClass('locateFeatures');
				_this.updateLocatedFeatures();

				$('#completeOrganization').hide();
				$('#deleteFeatures').hide();
				$('#moveFeaturesContainer').hide();

				$('#myList').find('li').off();


				$('#myList').find('li').click(app.ui.tilePanel.tile_onClick);
				$('#myList').find('li').mouseover(app.ui.tilePanel.tile_onMouseOver);
				$('#myList').find('li').mouseout(app.ui.tilePanel.tile_onMouseOut);

				if(!app.layerCurrent.graphics.length){
					$('#locateFeatures').hide();
					$('#organizeFeatures').hide();
				} else{
					if(buildAllSlides)
						app.detailPanelBuilder.buildAllSlides();
					else{
						app.detailPanelBuilder.buildSlides();
					}
				}
			};

			this.updateLocatedFeatures = function(index)
			{
				var features = [];
				if(app.layerCurrent)
					features = app.layerCurrent.graphics;

				var themeIndex = index || $('.entry.active').index();
				if(themeIndex < 0)
					themeIndex = 0;

				var tabFeatures = $.grep(features, function(e){ return e.attributes.tab_id == themeIndex; });
				setTimeout(function(){
					if(tabFeatures.length && !$('body').hasClass('organizeFeatures') && !$('body').hasClass('locateFeatures'))
						$('#organizeFeatures').show();
					else{
						$('#organizeFeatures').hide();
					}
				}, 50);
				var unlocatedFeatures = $.grep(tabFeatures, function(e){ return !e.attributes.locationSet; });

				$('.unlocatedFeatures').text(unlocatedFeatures.length);

				if(unlocatedFeatures.length > 0 && !$('body').hasClass('organizeFeatures') && !$('body').hasClass('locateFeatures')){
					$('#locateFeatures').show();
					//_this.exitOrganizeMode();
				}
				else{
					if(app.isLoading)
						return;
					$('#locateFeatures').hide();
					//_this.exitOrganizeMode();
				}

				if(unlocatedFeatures.length === 0)
					$('#locateFeatures').hide();
				if(features.length === 0)
					$('#organizeFeatures').hide();
				/*else{
					$('#organizeFeatures').show();
				}*/
				//topic.publish("BUILDER_INCREMENT_COUNTER");
			};

			this.updateNumber = function()
			{
				$.each($(".tilelist li"),function(index,value) {
					var changedGraphic = $.grep(app.layerCurrent.graphics, function(n){ return n.attributes.shortlist_id == $(value).data('shortlist-id');});
					changedGraphic[0].attributes.number = index + 1;
					$(value).attr('id', 'item'+index);
					$(value).find('.num').text((index+1));
					app.layerCurrent.graphics.sort(function(a,b){
						return a.attributes.number - b.attributes.number;
					});
				});
				var themeIndex = $('.entry.active').index();
				var color = app.data.getStory()[themeIndex].color;
				$.each(app.layerCurrent.graphics, function(index, graphic){
					_builderView.addMapIcon(graphic, color, true);
				});
				var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
				shortlistLayer.redraw();

				//TODO only after exting organize mode
				setTimeout(function(){
					app.detailPanelBuilder.buildSlides();
				}, 500);
				if(WebApplicationData.getTitle())
					topic.publish("BUILDER_INCREMENT_COUNTER");
			};

			function importFeature()
			{
				var cfg = {};
				cfg.mode='import';

				_imagePicker.present(cfg).then(function(data) {
					$('body').addClass('loadingPlaces');

					if (! data) {
						return;
					}

					var extentChange = false;
					var tempGraphicsLayer = new GraphicsLayer();
					$.each(data, function(i, feat){
						_this.addFeature(feat, false, null, true);


						if(feat.lng && feat.lat) {
							var pt = new Point(feat.lng, feat.lat, new SpatialReference({ wkid:4326 }));
							var newGraphic = new Graphic(pt);
							tempGraphicsLayer.graphics.push(newGraphic);
							extentChange = true;
						}

					});

					var newExtent;
					if(tempGraphicsLayer.graphics.length > 1)
						newExtent = graphicsUtils.graphicsExtent(tempGraphicsLayer.graphics);

					setTimeout(function(){
						if(app.data.getWebAppData().getGeneralOptions().extentMode == "default")
							_builderView.updateShortlistExtent();

						if(data.length > 1 && extentChange){
							var projectExtent = webMercatorUtils.project(newExtent, app.map);
							app.map.setExtent(projectExtent, true);
							app.map.getLayer(app.data.getShortlistLayerId()).redraw();
						}
					}, 500);

					$('#editorDialogInlineMedia').hide();

					_this.updateLocatedFeatures();
					setTimeout(function(){
						var themeIndex = $('.entry.active').index();
						var currentDetailContainer = $('.detailContainer')[themeIndex];
						$(currentDetailContainer).hide();
						$('body').removeClass('loadingPlaces');
					}, 0);
				});
			}

			function organizeFeatures()
			{
				$('body').addClass('organizeFeatures');
				$('.builder-content-panel .builder-content-panel-group').addClass('disabled');
				$('.builder-lbl').addClass('disabled');
				$('.builder-content-panel.inline .builder-btn').addClass('disabled');
				app.ui.tilePanel.initSortable();
				$('#addFeature').hide();
				$('#importFeature').hide();
				$('#organizeFeatures').hide();
				$('#locateFeatures').hide();
				$('#deleteFeatures').addClass('disabled');
				$('#deleteFeatures').prop('disabled', true);
				$('#moveFeaturesDropdownMenu').addClass('disabled');

				$('#completeOrganization').show();
				$('#deleteFeatures').show();
				var themeIndex = $('.entry.active').index();
				// Need to divide by two as the tabs are duplicated in the dropdown control for small screens
				// TODO reflect actual tab names and order
				if($('.dropdown-menu .entry').length > 1){
					$('#tabSelector').empty();
					$.each($('.dropdown-menu .entry'), function(index){
						var title = app.data.getStory()[index].title;
						if(index == themeIndex)
							$('#tabSelector').append($('<li class="disabledTab"><a href="#">' + (title) + '</a></li>'));
							//$('#tabSelector').append($('<option disabled = true; value='+index+'>tab '+(index+1)+'</option>'));
						else{
							$('#tabSelector').append($('<li class="enabledTab"><a href="#">' + (title) + '</a></li>'));
							//$('#tabSelector').append($('<option value='+index+'>tab '+(index+1)+'</option>'));
						}
					});
					if(themeIndex === 0)
						$('#tabSelector option:eq(1)');
					$('#moveFeaturesContainer').css('display', 'inline-block');
				}
				container.find('#moveFeaturesContainer li.enabledTab').on('click', moveFeatures);
				//$('#myList').find('li').off();

				$('#myList').find('li').on('click', function(){
					if($('body').hasClass('organizeFeatures')){
						$(this).toggleClass('selected');
						if($('#myList').find('li.selected').length){
							$('#deleteFeatures').removeClass('disabled');
							$('#deleteFeatures').prop('disabled', false);
							$('#moveFeaturesDropdownMenu').removeClass('disabled');
						} else{
							$('#deleteFeatures').addClass('disabled');
							$('#moveFeaturesDropdownMenu').addClass('disabled');
						}
					}
				});
			}

			function deleteFeatures()
			{
				var selectedTiles = $('#myList').find('li.selected');
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
				$.each(selectedTiles, function(index, value){
					var featureToDelete = $.grep(shortlistLayer.graphics, function(e){ return e.attributes.shortlist_id == $(value).data('shortlist-id'); });
					if(featureToDelete[0].attributes.resource){
						FileUploadHelper.removeResources(featureToDelete[0].attributes.resource);
					}
					shortlistLayer.remove(featureToDelete[0]);
				});

				var themeIndex = $('.entry.active').index();
				var tabFeatures =[];
				$.each(shortlistLayer.graphics,function(i,graphic){
					if(graphic.attributes.tab_id == themeIndex ){
						tabFeatures.push(graphic);
						if(graphic.attributes.locationSet)
							graphic.show();
					}
					else{
						graphic.hide();
					}
				});
				app.layerCurrent.graphics = tabFeatures;
				// TODO update shortlist ids for all features
				// Update display number/order for all features as tab contents have changed
				//WebApplicationData.setContentLayers(_shortlistLayers[themeIndex], themeIndex, true);

				_builderView.updateAllFeatures();

				_builderView.updateShortlistExtent();

				app.ui.tilePanel.buildTilePanel();
				app.detailPanelBuilder.buildSlides();
				//_this.updateNumber();
				_this.updateLocatedFeatures();
				$('#myList').find('li').on('click', function(){
					if($('body').hasClass('organizeFeatures'))
						$(this).toggleClass('selected');
				});
				$('#deleteFeatures').addClass('disabled');
				$('#moveFeaturesDropdownMenu').addClass('disabled');
				_this.exitOrganizeMode();
			}

			function moveFeatures()
			{
				var tabDestination = $(this).index();
				var selectedTiles = $('#myList').find('li.selected');
				// TODO MAKE FUNCTION OR GLOBAL data.get/set shortlistLayerId
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
				// High number to put feature at bottom of new tab tile list
				var newNumber = 900;
				$.each(selectedTiles, function(index, value){
					var featureToDelete = $.grep(shortlistLayer.graphics, function(e){ return e.attributes.shortlist_id == $(value).data('shortlist-id'); });

					featureToDelete[0].attributes.tab_id = tabDestination;
					featureToDelete[0].attributes.number = newNumber;
					featureToDelete[0].attr('number', newNumber);
					newNumber++;
				});

				_builderView.updateAllFeatures();

				var themeIndex = $('.entry.active').index();
				var tabFeatures =[];
				$.each(shortlistLayer.graphics,function(i,graphic){
					if(graphic.attributes.tab_id == themeIndex){
						graphic.show();
						tabFeatures.push(graphic);
					}
					else{
						graphic.hide();
					}
				});
				app.layerCurrent.graphics = tabFeatures;

				app.ui.tilePanel.buildTilePanel();

				_this.updateLocatedFeatures(true);
				$('#deleteFeatures').addClass('disabled');
				$('#moveFeaturesDropdownMenu').addClass('disabled');
				_this.exitOrganizeMode(true);
				if(WebApplicationData.getTitle())
					topic.publish("BUILDER_INCREMENT_COUNTER");
			}

			function showUnlocatedFeatures()
			{
				$('body').addClass('locateFeatures');
				$('.located').hide();
				$('#addFeature').hide();
				$('#importFeature').hide();
				$('#organizeFeatures').hide();
				$('#completeOrganization').show();
				$('#locateFeatures').hide();
				app.detailPanelBuilder.buildUnlocatedSlides();
			}

			function initUI()
			{
				_initDone = true;
			}

			function initEvents()
			{
				container.find('#addFeature').on('click', _this.addFeature);
				container.find('#importFeature').on('click', importFeature);
				container.find('#organizeFeatures').on('click', organizeFeatures);
				container.find('#locateFeatures').on('click', showUnlocatedFeatures);
				container.find('#completeOrganization').on('click', _this.exitOrganizeMode);
				container.find('#deleteFeatures').on('click', deleteFeatures);
				container.find('#locateFeatures').tooltip({
					html: true,
					trigger: 'hover'
				});
			}
		};
	}
);
