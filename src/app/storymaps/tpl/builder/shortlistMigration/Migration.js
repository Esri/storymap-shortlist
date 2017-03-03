define(["lib-build/tpl!./Migration",
		"lib-build/css!./Migration",
		"lib-build/tpl!./layerPicker",
		"lib-build/css!./layerPicker",
		"lib-build/tpl!./tabFieldPicker",
		"lib-build/tpl!./fieldPicker",
		"lib-build/css!./fieldPicker",
		"../../core/Helper",
		// gloabal map extent save (home button setting)
		"../MapExtentSave",
		"esri/symbols/SimpleMarkerSymbol",
		"esri/graphic",
		"esri/layers/FeatureLayer",
		"dojo/topic",
		"dojo/Deferred"
	],
	function (
		viewTpl,
		viewCss,
		layerPicker,
		layerPickerCss,
		tabFieldPicker,
		fieldPicker,
		fieldPickerCss,
		Helper,
		MapExtentSave,
		SimpleMarkerSymbol,
		Graphic,
		FeatureLayer,
		topic,
		Deferred
	){
		return function Migration(container, core, mainView, builderView, webApplicationData)
		{
			var downloadLink = '  (<a href="http://links.esri.com/storymaps/shortlist_layer_template" target="_blank" download="">'+i18n.builder.migration.migrationPattern.downloadTemplate+'</a>)';
			container.append(viewTpl({
				welcome: i18n.builder.migration.migrationPattern.welcome,
				importQuestion: i18n.builder.migration.migrationPattern.importQuestion,
				importExplainYes: i18n.builder.migration.migrationPattern.importExplainYes,
				importExplainNo: i18n.builder.migration.migrationPattern.importExplainNo,
				no: i18n.builder.migration.migrationPattern.no,
				importOption: i18n.builder.migration.migrationPattern.importOption,
				asIsOption: i18n.builder.migration.migrationPattern.asIsOption,
				asIsText: i18n.builder.migration.migrationPattern.asIsText + downloadLink,
				btnCancel: i18n.commonCore.common.cancel,
				btnBack: i18n.commonCore.common.back
			}));

			var _core = core;
			var _mainView = mainView;
			var _builderView = builderView;
			var _webApplicationData = webApplicationData;
			//var _mapExtentSave = new MapExtentSave($('#map_zoom_slider'));

			var _popupDeferred = null,
				_pointLayers = null,
				_selectedLayers = null,
				_layers = null,
				_nonSLPointLayers = null,
				_fields = [],
				_btnSubmit = container.find(".btnSubmit"),
				_btnBack = container.find(".btn-back"),
				_isTemporaryHide = null,
				_helper = new Helper();

			initEvents();

			this.present = function(pointLayers, layers)
			{
				_popupDeferred = new Deferred();
				_pointLayers = pointLayers;

				_layers = layers;

				// Submit
				updateSubmitButton();

				container.modal({keyboard: true});
				return _popupDeferred;
			};

			this.close = function()
			{
				container.modal('hide');
				_popupDeferred.reject();
			};

			function initEvents()
			{
				container.find('.btnCancel').click(function () {
					container.modal('hide');
					_popupDeferred.reject();
				});

				container.on('shown.bs.modal', function () {
					postDisplay();
				});

				_btnSubmit.click(onClickSubmit);

				_btnBack.click(onClickBack);

				container.find('.viewMigrationSelectorContainer input').on('change', function() {
					updateSubmitButton();
				});
			}

			function postDisplay()
			{
				updateSubmitButton();
			}

			function toggle()
			{
				if ( container.hasClass("in") ){
					_isTemporaryHide = true;
					container.addClass("temporaryHide");
				}
				else {
					container.removeClass("temporaryHide");
				}

				container.modal('toggle');
			}

			function presentFieldPicker()
			{
				setTimeout(function(){
					container.find('.modal-body').addClass('migrateWebmap');
					container.find('.modal-body').removeClass('layerSelector');
					container.find('.modal-body').removeClass('migrationQuestion');
					container.find('.modal-body').removeClass('tabFieldSelector');
				}, 500);

				var selected = [];
				container.find('.layer-picker .opt-checkbox:checkbox:checked').each(function() {
					selected.push($(this).attr('name'));
				});
				_selectedLayers = [];
				_fields = [];
				$.each(selected, function(index, layerId){
					var shortlistLayer = ($.grep(_pointLayers, function(e){ return e.id ==  layerId; }));
					_selectedLayers.push(shortlistLayer[0]);
				});
				// Add unused point layers to _layers to be added to map
				_nonSLPointLayers = [];
				$.each(_pointLayers, function(index, layer){
					var shortlistLayer = ($.grep(_selectedLayers, function(e){ return e.id ==  layer.id; }));
					if(!shortlistLayer[0])
						_nonSLPointLayers.push(layer);
				});
				if(_selectedLayers.length > 1){
					var fieldsToCheck = [];
					$.each(_selectedLayers[0].graphics[0].attributes, function(field){
						fieldsToCheck.push(field);
					});
					$.each(_selectedLayers, function(index, layer){
						var fieldsToRemove = [];
						$.each(fieldsToCheck, function(index, field){
							var layerFields = [];
							$.each(layer.graphics[0].attributes, function(field){
								layerFields.push(field);
							});
							var newField = $.grep(layerFields, function(e){ return e.toLowerCase() ===  field.toLowerCase(); });
							if(!newField.length){
								var fieldIndex = fieldsToCheck.indexOf(field);
								fieldsToRemove.push(fieldIndex);
							}
						});
						$.each(fieldsToRemove, function(i, index){
							fieldsToCheck.splice(index, 1);
						});
					});
					$.each(fieldsToCheck, function(i, field){
						if(field != '__OBJECTID'){
							_fields.push(field);
							$('#fieldSelect')
								.append($("<option></option>")
									.attr("value",field)
									.text(field));
						}
					});
				}else{
					$.each(_selectedLayers[0].graphics[0].attributes, function(field){
						if(field != '__OBJECTID'){
							_fields.push(field);
							$('#fieldSelect')
								.append($("<option></option>")
									.attr("value",field)
									.text(field));
						}
					});

					if(container.find('.layer-picker .opt-checkbox:checkbox:checked').length == 1 && container.find('#tabFieldSelect').val() != 'none'){
						var tabName = container.find('#tabFieldSelect').val();
						var temporaryTabLayers = [];
						var tabNames = [];
						$.each(_selectedLayers[0].graphics, function(index, graphic){
							if(tabNames.indexOf(graphic.attributes[tabName]) < 0){
								tabNames.push(graphic.attributes[tabName]);
								temporaryTabLayers.push({name: graphic.attributes[tabName], graphics: [], alias: graphic.attributes[tabName]});
							}
						});
						$.each(_selectedLayers[0].graphics, function(index, graphic){
							var tab = $.grep(tabNames, function(e){ return e ==  graphic.attributes[tabName]; });
							$.map(temporaryTabLayers, function(obj, index) {
								if(obj.name == tab[0]) {
									temporaryTabLayers[index].graphics.push(graphic);
								}
							});
						});
						_selectedLayers = temporaryTabLayers;
					}

				}


				container.find('.modal-title').text('Choose the fields the Shortlist should use');
				container.find('.viewMigrationLayerSelectorContainer').hide();
				if($('.viewMigrationFieldSelectorContainer').length){
					$('.viewMigrationFieldSelectorContainer').show();
				}else{
					container.find('.modal-body').append(fieldPicker({
						nameField: i18n.builder.migration.fieldPicker.nameField,
						descriptionField: i18n.builder.migration.fieldPicker.descriptionField,
						urlField: i18n.builder.migration.fieldPicker.urlField,
						none: i18n.builder.migration.fieldPicker.none,
						imageFields: i18n.builder.migration.fieldPicker.imageFields,
						mainImageField: i18n.builder.migration.fieldPicker.mainImageField,
						thumbImageField: i18n.builder.migration.fieldPicker.thumbImageField,
						noImageFields: i18n.builder.migration.fieldPicker.noImageFields,
						tabField: i18n.builder.migration.fieldPicker.tabField
					}));
					container.find('.viewMigrationFieldSelector fieldNameSelect').on('change', function() {
						updateSubmitButton();
					});
				}
				$('#fieldNameSelect').empty();
				$('#fieldUrlSelect').empty();
				$('#fieldPicUrlSelect').empty();
				$('#fieldThumbUrlSelect').empty();
				container.find('.description-picker').empty();
				$('#fieldNameSelect')
					.append($("<option></option>")
						.attr("value",'none')
						.text('none'));
				$('#fieldUrlSelect')
					.append($("<option></option>")
						.attr("value",'none')
						.text('none'));
				$('#fieldPicUrlSelect')
					.append($("<option></option>")
						.attr("value",'none')
						.text('none'));
				$('#fieldThumbUrlSelect')
					.append($("<option></option>")
						.attr("value",'none')
						.text('none'));
				var sortDescriptionFields = false;
				$.each(_fields, function(index, field){
					$('#fieldNameSelect')
						.append($("<option></option>")
							.attr("value",field)
							.text(field));
					$('#fieldUrlSelect')
						.append($("<option></option>")
							.attr("value",field)
							.text(field));
					$('#fieldPicUrlSelect')
						.append($("<option></option>")
							.attr("value",field)
							.text(field));
					$('#fieldThumbUrlSelect')
						.append($("<option></option>")
							.attr("value",field)
							.text(field));
					var sortValue = null;
					if(field.toLowerCase() == 'short_desc')
						sortValue = 1;
					if(field.toLowerCase() == 'desc1')
						sortValue = 2;
					if(field.toLowerCase() == 'description')
						sortValue = 2;
					if(field.toLowerCase() == 'caption')
						sortValue = 2;
					if(field.toLowerCase() == 'desc2')
						sortValue = 3;
					if(field.toLowerCase() == 'desc3')
						sortValue = 4;
					if(field.toLowerCase() == 'desc4')
						sortValue = 5;
					if(field.toLowerCase() == 'desc5')
						sortValue = 6;
					if(field.toLowerCase() == 'address')
						sortValue = 7;
					if(field.toLowerCase() == 'hours')
						sortValue = 8;
					if(sortValue){
						container.find('.description-picker').append('<div class="checkbox"><label><input type="checkbox" class="opt-checkbox" value=' + sortValue + '/>' + field + '</label></div>');
						sortDescriptionFields = true;
					}else{
						container.find('.description-picker').append('<div class="checkbox"><label><input type="checkbox" class="opt-checkbox" />' + field + '</label></div>');
					}
				});
				//container.find('.description-picker label')
				if(sortDescriptionFields){
					container.find('.description-picker .checkbox').sort(function(a,b){
						var $a = $(a).find(':checkbox'),
						$b = $(b).find(':checkbox');
						if ($a.val() < $b.val())
							return -1;
						else if ($a.val() > $b.val())
							return 1;

						return 0;
					}).appendTo('.description-picker');
				}
				selectBestDefaults();
			}

			function selectBestDefaults()
			{
				$.each($('#fieldNameSelect option'), function(index, option){
					if(option.value.toLowerCase() == "name"){
						$(this).prop('selected', true);
						return false;
					}
					if(option.value.toLowerCase() == "title")
						$(this).prop('selected', true);
				});

				$.each(container.find('.description-picker .opt-checkbox'), function(index, option){
					if($(option).parent().text().toLowerCase() == "short_desc")
						$(this).prop('checked', true);
					if($(option).parent().text().toLowerCase() == "desc1")
						$(this).prop('checked', true);
					if($(option).parent().text().toLowerCase() == "description")
						$(this).prop('checked', true);
					if($(option).parent().text().toLowerCase() == "caption")
						$(this).prop('checked', true);
					if($(option).parent().text().toLowerCase() == "desc2")
						$(this).prop('checked', true);
					if($(option).parent().text().toLowerCase() == "desc3")
						$(this).prop('checked', true);
					if($(option).parent().text().toLowerCase() == "desc4")
						$(this).prop('checked', true);
					if($(option).parent().text().toLowerCase() == "desc5")
						$(this).prop('checked', true);
					if($(option).parent().text().toLowerCase() == "hours")
						$(this).prop('checked', true);
					if($(option).parent().text().toLowerCase() == "address")
						$(this).prop('checked', true);
				});
				$.each($('#fieldUrlSelect option'), function(index, option){
					if(option.value.toLowerCase() == "website"){
						$(this).prop('selected', true);
						return false;
					}
				});
				$.each($('#fieldPicUrlSelect option'), function(index, option){
					if(option.value.toLowerCase() == "pic_url"){
						$(this).prop('selected', true);
						return false;
					}
					if(option.value.toLowerCase() == "picture"){
						$(this).prop('selected', true);
					}
					if(option.value.toLowerCase() == "image_url"){
						$(this).prop('selected', true);
					}
				});
				$.each($('#fieldThumbUrlSelect option'), function(index, option){
					if(option.value.toLowerCase() == "thumb_url"){
						$(this).prop('selected', true);
						return false;
					}
					if(option.value.toLowerCase() == "pic_url"){
						$(this).prop('selected', true);
					}
					if(option.value.toLowerCase() == "picture"){
						$(this).prop('selected', true);
					}
					if(option.value.toLowerCase() == "image_url"){
						$(this).prop('selected', true);
					}
				});

				setTimeout(function(){
					updateSubmitButton();
				}, 500);

				container.find('.description-picker .opt-checkbox').on('click', function(){
					updateSubmitButton();
				});
				container.find('#fieldNameSelect').on('change', function(){
					updateSubmitButton();
				});

				$('.description-picker').sortable();
			}

			function presentLayerPicker()
			{
				var migrate = $('input[name=optradio]:checked', '.viewMigrationSelectorContainer').val();
				if(migrate == 0)
					migrate = parseInt(migrate);
				var obj = {};

				obj.migrate = migrate;
				obj.pointLayers = _pointLayers;
				obj.layers = _layers;
				if(!obj.migrate || obj.migrate == 'as-is'){
					_popupDeferred.resolve(
						obj
					);
					container.modal('hide');
				}else{
					container.find('.modal-title').text('Choose your point Data');
					_btnBack.show();
					container.find('.viewMigrationSelectorContainer').hide();
					if($('.viewMigrationLayerSelectorContainer').length){

						$('.viewMigrationLayerSelectorContainer').show();
						setTimeout(function(){
							container.find('.modal-body').addClass('layerSelector');
							container.find('.modal-body').removeClass('migrateWebmap');
							container.find('.modal-body').removeClass('migrationQuestion');
						}, 500);
						return;
					}
					container.find('.modal-body').append(layerPicker({
						pointLayers: i18n.builder.migration.layerPicker.pointLayers,
						layerInfo: i18n.builder.migration.layerPicker.layerInfo
					}));

					_pointLayers.reverse();

					if(_pointLayers.length == 1)
						$('.layer-info').hide();

					var pointLayers = [];

					$.each(_pointLayers, function(index, layer){
						if(layer.graphics.length)
							pointLayers.push(layer);
					});
					_pointLayers = pointLayers;

					$.each(_pointLayers, function(index, layer){
						var layerName = $.grep(app.data.getWebMap().itemData.operationalLayers, function(e){ return e.id ==  layer.id.slice(0, -2); });

						var layerType;
						if(layer.layerType){
							layerType = layer.layerType;
						}else{
							layerType = layer.type;
						}
						if(layer.url && (layerType === 'ArcGISFeatureLayer' || layerType === 'Feature Layer') && !layer.id.match(/^csv_/)){
							layerName = $.grep(app.data.getWebMap().itemData.operationalLayers, function(e){ return e.id ==  layer.id; });
						}
						layerName = layerName[0] ? layerName[0].title : layer.id;
						layer.alias = layerName;

						container.find('.layer-picker').append('<div class="checkbox"><label><input type="checkbox" class="opt-checkbox" name=' + layer.id + ' />' + layerName + '</label></div>');
					});

					container.find('.layer-picker .opt-checkbox').eq(0).prop("checked", true);
				}

				container.find('.layer-picker .opt-checkbox').on('change', function(){
					updateSubmitButton();
				});
				setTimeout(function(){
					updateSubmitButton();
				}, 500);
			}

			function presentTabFieldPicker()
			{
				container.find('.modal-title').text('Does your layer contain multiple themes?');

				if(!$('.viewMigrationTabFieldSelectorContainer').length)
					container.find('.modal-body').append(tabFieldPicker({
						tabField: i18n.builder.migration.fieldPicker.tabField,
						none: i18n.builder.migration.fieldPicker.none
					}));

				$('.viewMigrationTabFieldSelectorContainer').show();

				container.find('.modal-body').addClass('tabFieldSelector');

				var layerId = $('.layer-picker .opt-checkbox:checkbox:checked').attr('name');
				var selectedLayer = ($.grep(_pointLayers, function(e){ return e.id ==  layerId; }));

				$('#tabFieldSelect').empty();
				$('#tabFieldSelect')
					.append($("<option></option>")
						.attr("value",'none')
						.text('none'));
				$.each(selectedLayer[0].graphics[0].attributes, function(field){
					if(field != '__OBJECTID'){
						$('#tabFieldSelect')
							.append($("<option></option>")
								.attr("value",field)
								.text(field));
					}
				});
				$.each($('#tabFieldSelect option'), function(index, option){
					if(option.value.toLowerCase() == "tabname" || option.value.toLowerCase() == "tab_name"){
						$(this).prop('selected', true);
						return false;
					}
					if(option.value.toLowerCase() == "tabname" || option.value.toLowerCase() == "tab_id"){
						$(this).prop('selected', true);
						return false;
					}
				});

				setTimeout(function(){
					container.find('.modal-body').removeClass('layerSelector');
					container.find('.modal-body').removeClass('migrateWebmap');
					container.find('.modal-body').removeClass('migrationQuestion');
					container.find('.modal-body').addClass('fieldSelector');
					updateSubmitButton();
				}, 500);
			}

			function migrateWebmap(title, descFields, link, imageUrl, thumbUrl)
			{
				container.modal('hide');
				//Using isGalleryCreation as it saves a new web map for us
				app.isGalleryCreation = true;
				_builderView.buildAddFeatureBar();

				app.data.getWebAppData().setDefaultGeneralOptions();

				var newWebmap = _builderView.buildWebMap();
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

				if(link != "none"){
					var options = app.data.getWebAppData().getGeneralOptions();
					options.moreInfoLink = true;
					app.data.getWebAppData().setGeneralOptions(options);
				}

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
					var mapId = response.itemInfo.item.id ? response.itemInfo.item.id : response.map.id;
					app.maps[mapId] = _mainView.getMapConfig(response);
					var pointLayer = new esri.layers.GraphicsLayer();
					pointLayer.id = "tempIconLayer";
					app.map.addLayer(pointLayer);
					app.map.reorderLayer(pointLayer, app.map.graphicsLayerIds.length - 1);

					_builderView.storyDataReady();

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
					$.each(_layers, function(index, layer){
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

					$.each(_nonSLPointLayers, function(index, layer){
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

					app.data.setWebMap(mapPromise.results[0].itemInfo);
					app.addFeatureBar.addLayer(true);
					$.each(originalOperationalLayers, function(index, layer){
						app.data.getWebMap().itemData.operationalLayers.push(layer);
					});

					_builderView.updateUI();
					_core.appInitComplete(_webApplicationData);

					var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());

					var baseMapLayerUpdated = false;

					var baseMapLayer = app.map.getLayer(app.data.getWebMap().itemData.baseMap.baseMapLayers[0].id);
					baseMapLayer.on('update-end', function(){
						if(baseMapLayerUpdated)
							return;
						baseMapLayerUpdated = true;
						$.each(_selectedLayers, function(index, layer){

							$('body').addClass('loadingPlaces');

							if(index === 0){
								$('.entryLbl').eq(0).text(layer.alias);
								app.data.setStory(0, layer.alias);
								app.data.getWebAppData().setTabs(app.data.getStory());
							}
							if(index > 0){
								app.ui.navBar.onClickAdd(null, layer.alias);
							}

							$.each(layer.graphics, function(i, graphic){
								var locationSet = graphic.geometry && graphic.geometry.x && graphic.geometry.y ? parseInt(1) : 0;
								var newAttributes = {
									__OBJECTID: shortlistLayer.graphics.length+1,
									name: '',
									description: '',
									pic_url: '',
									thumb_url: '',
									shortlist_id: shortlistLayer.graphics.length+1,
									number: i+1,
									tab_id: index,
									locationSet: locationSet
								};
								if(graphic.attributes.number)
									newAttributes.number = graphic.attributes.number;
								if(graphic.attributes.Number)
									newAttributes.number = graphic.attributes.Number;
								if(graphic.attributes.NUMBER)
									newAttributes.number = graphic.attributes.NUMBER;
								newAttributes.name = graphic.attributes[title];
								$.each(descFields, function(ind, field){
									//newAttributes.description += '<div class="detailFeatureDesc" style="min-height: 0;" >' + graphic.attributes[field] + '</div>';
									if(graphic.attributes[field])
										newAttributes.description +=  ('<p>' + graphic.attributes[field] + '</p>');
								});
								if(link != "none"){
									if(graphic.attributes[link])
										newAttributes.description += '<p><a href=' + graphic.attributes[link] + ' target="_blank">More info</a></p>';
								}
								if(imageUrl != "none")
									newAttributes.pic_url = encodeURI(graphic.attributes[imageUrl]);
								if(thumbUrl != "none")
									newAttributes.thumb_url = encodeURI(graphic.attributes[thumbUrl]);
								if(thumbUrl == "none" && imageUrl != "none")
									newAttributes.thumb_url = encodeURI(graphic.attributes[imageUrl]);
								if(graphic.geometry == null)
									newAttributes.locationSet = 0;

								var sms = new SimpleMarkerSymbol();
								var newGraphic = new Graphic(graphic.geometry, sms, newAttributes);
								var c = _builderView.addMapIcon(newGraphic, app.data.getStory()[index].color);
								shortlistLayer.add(c);
								//app.addFeatureBar.addFeature(newAttributes, false, graphic.geometry);
							});
						});
					});

					$("#loadingIndicator").show();

					if(app.data.getResponse().itemInfo.itemData.bookmarks && app.data.getResponse().itemInfo.itemData.bookmarks.length){
						var settings = {
							extentMode: 'customHome',
							numberedIcons: false,
							filterByExtent: true,
							bookmarks: true,
							bookmarksAlias: app.cfg.BOOKMARKS_ALIAS,
							locateButton: false,
							geocoder: false
						};
						app.data.getWebAppData().setGeneralOptions(settings);
						app.ui.navBar.initBookmarks();
					}

					//_mapExtentSave.init();

					setTimeout(function(){
						app.detailPanelBuilder.buildAllSlides();
						$('body').removeClass('loadingPlaces');
						core.displayApp();
						_mainView.activateLayer(0);
						app.map.setExtent(app.map._params.extent, true);
						topic.publish("BUILDER_INCREMENT_COUNTER", 1);
						app.data.getWebAppItem().typeKeywords.push('Shortlist-migration');
						// Except for movable graphic layer for editing location
						//app.map.reorderLayer(app.map.getLayer('tempIconLayer'), app.map.graphicsLayerIds.length - 1);
						// Make sure shortlist layer is above all other layers (i.e. mapnotes);
						var graphicsLayerLength = app.map.graphicsLayerIds.length - 1;
						app.map.reorderLayer(shortlistLayer, graphicsLayerLength);
					}, 800);
				});

			}

			function getNewLayerJSON (layer)
			{
				return {
					id: layer.id,
					title: layer.title,
					visibility: true,
					opacity: 1,
					featureCollection: {
						layers: [
							layer.featureCollection
						],
						showLegend: true
					}
				};
			}

			function updateSubmitButton()
			{
				var disableButton = true;

				if ( container.find('input[name=optradio]:checked', '.viewMigrationSelectorContainer').length && container.find('.viewMigrationSelectorContainer').css('display') != "none" ){
					disableButton = false;
					container.find('.modal-body').addClass('migrationQuestion');
					container.find('.modal-body').removeClass('layerSelector');
					container.find('.modal-body').removeClass('tabFieldSelector');
					container.find('.modal-body').removeClass('fieldSelector');
					container.find('.modal-body').removeClass('migrateWebmap');
				}
				if( container.find('.layer-picker .opt-checkbox:checkbox:checked').length > 0 && container.find('.viewMigrationLayerSelectorContainer').css('display') != "none"){
					disableButton = false;
					container.find('.modal-body').addClass('layerSelector');
					container.find('.modal-body').removeClass('tabFieldSelector');
					container.find('.modal-body').removeClass('fieldSelector');
					container.find('.modal-body').removeClass('migrateWebmap');
					container.find('.modal-body').removeClass('migrationQuestion');
				}
				if(container.find('#fieldNameSelect').val() != 'none' &&
					container.find('.viewMigrationFieldSelectorContainer').css('display') == "block"){
						disableButton = false;
						container.find('.modal-body').addClass('migrateWebmap');
						container.find('.modal-body').removeClass('layerSelector');
						container.find('.modal-body').removeClass('tabFieldSelector');
						container.find('.modal-body').removeClass('migrationQuestion');
					}
				if(container.find('.modal-body').hasClass('tabFieldSelector'))
					disableButton = false;

				_btnSubmit.html('Next');

				_btnSubmit.attr("disabled", disableButton);

			}

			function onClickSubmit()
			{
				if(container.find('.modal-body').hasClass('migrationQuestion')){
					presentLayerPicker();
					if(!container.find('.layer-picker .opt-checkbox:checkbox:checked').length)
						updateSubmitButton();
					return;
				}

				if(container.find('.modal-body').hasClass('layerSelector')){
					container.find('.viewMigrationLayerSelectorContainer').hide();
					if(container.find('.layer-picker .opt-checkbox:checkbox:checked').length == 1){
						presentTabFieldPicker();
						setTimeout(function(){
							updateSubmitButton();
						}, 50);
					} else {
						presentFieldPicker();
						setTimeout(function(){
							updateSubmitButton();
						}, 50);
					}
					return;
				}

				if(container.find('.modal-body').hasClass('tabFieldSelector')){
					container.find('.viewMigrationTabFieldSelectorContainer').hide();
					presentFieldPicker();
					setTimeout(function(){
						updateSubmitButton();
					}, 50);
					return;
				}

				if(container.find('.modal-body').hasClass('migrateWebmap')){
					var title = container.find('#fieldNameSelect').val();
					var descFields =[];
					$.each(container.find('.description-picker .opt-checkbox:checkbox:checked'), function(index, field){
						descFields.push($(field).parent().text());
					});
					var link = container.find('#fieldUrlSelect').val();
					var imageUrl = container.find('#fieldPicUrlSelect').val();
					var thumbUrl = container.find('#fieldThumbUrlSelect').val();

					migrateWebmap(title, descFields, link, imageUrl, thumbUrl);
				}

				//container.modal('hide');
			}

			function onClickBack()
			{
				if(container.find('.modal-body').hasClass('layerSelector')){
					container.find('.modal-body').removeClass('layerSelector');
					container.find('.modal-body').addClass('migrationQuestion');
					container.find('.viewMigrationLayerSelectorContainer').hide();
					container.find('.viewMigrationSelectorContainer').show();
					_btnBack.hide();
					updateSubmitButton();
				}

				if(container.find('.modal-body').hasClass('tabFieldSelector')){
					$('.viewMigrationTabFieldSelectorContainer').hide();
					container.find('.modal-body').removeClass('tabFieldSelector');
					presentLayerPicker();
					updateSubmitButton();
				}


				if(container.find('.modal-body').hasClass('migrateWebmap')){
					$('.viewMigrationFieldSelectorContainer').hide();
					if(container.find('.layer-picker .opt-checkbox:checkbox:checked').length == 1)
						presentTabFieldPicker();
					else {
						presentLayerPicker();
					}
					updateSubmitButton();
				}
			}

			this.initLocalization = function()
			{
				//
			};
		};
	}
);
