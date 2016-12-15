define([
	"lib-build/tpl!./DetailPanelBuilder",
	"lib-build/tpl!./DetailPanelBuilderSlide",
	"lib-build/css!../ui/desktop/DetailPanel",
	"lib-build/css!./DetailPanelBuilder",
	"./textEditor/MediumEditorWrapper",
	"lib-app/jquery-ui.min",
	"../core/WebApplicationData",
	"./MovableGraphic",
	"esri/geometry/webMercatorUtils",
	"esri/SpatialReference",
	"esri/graphic",
	"esri/geometry/Point",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/dijit/Search",
	"dojo/topic"],
	function (
		detailPanel,
		detailPanelSlide,
		detailPanelStyle,
		detailPanelBuilder,
		MediumEditorWrapper,
		jqueryUI,
		WebApplicationData,
		MovableGraphic,
		webMercatorUtils,
		SpatialReference,
		Graphic,
		Point,
		SimpleMarkerSymbol,
		Search,
		topic
	) {
		return function DetailPanelBuilder(container, imagePicker)
		{
			var _initDone = false;
			var _swiper;
			var _swipers = [];
			var _imagePicker = imagePicker;
			var _this = this;
			var _search;
			var _pointLayer;
			var _movableIcon;
			var _mainView;
			var _builderView;
			var _movedGraphic;
			var _mapClick;

			var _titleEditor;
			var _descEditor;

			this.init = function(mainView, builderView)
			{
				_mainView = mainView;
				_builderView = builderView;
				setTimeout(function(){
					_search = new Search({
						map: app.map,
						showInfoWindowOnSelect: true,
						autoNavigate: false
					}, 'search');
					_search.startup();
					_search.hide();
					_search.on('search-results', function(e){
						if(!app.map.extent.contains(e.results[0][0].feature.geometry)){

							if(app.mapTips)
								app.mapTips.clean(true);
							setTimeout(function(){
								app.map.centerAt(e.results[0][0].feature.geometry);
								app.ui.mainView.buildMapTips();
							}, 0);
						}
					});
					_search.on('select-result', function(e){
						_search.hide();
						if(_movableIcon)
							_movableIcon.clean();
						var addLocation = $('<div class="addLocationText"><a href="#">Use this location </a> </div>');
						$('.esriPopup .contentPane').append(addLocation);
						$('.esriPopup').show();
						var themeIndex = $('.entry.active').index();
						var currentSlide = $('.swiper-slide-active')[themeIndex];
						$('body').removeClass('pickLocation');
						app.map.getLayer('tempIconLayer').remove(app.map.getLayer('tempIconLayer').graphics[0]);
						_mapClick.remove();
						var changedGraphic = $.grep(app.layerCurrent.graphics, function(e){ return e.attributes.shortlist_id ==  $(currentSlide).data('shortlist-id'); });
						if(!changedGraphic[0].attributes.locationSet)
							app.map.setMapCursor("crosshair");
						$(addLocation).on('click', function(){
							changedGraphic[0].setGeometry(e.result.feature.geometry);
							changedGraphic[0].attributes.locationSet = 1;
							changedGraphic[0].show();
							_search.highlightGraphic.hide();
							$('.esriPopup').hide();

							var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
							shortlistLayer.redraw();
							if(app.mapTips)
								app.mapTips.clean(true);
							app.ui.mainView.buildMapTips();
							app.map.getLayer('tempIconLayer').remove(app.map.getLayer('tempIconLayer').graphics[0]);
							app.addFeatureBar.updateLocatedFeatures();
							updateTile(changedGraphic[0]);
							_builderView.updateShortlistExtent();
							$(currentSlide).find('.setLocation').hide();
							$(currentSlide).find('.editLocation').show();
							$(currentSlide).find('.cancelLocation').hide();
							$('body').removeClass('pickLocation');
							$('body').addClass('removeSlide');
							topic.publish("BUILDER_INCREMENT_COUNTER");
						});
						app.map.setMapCursor("auto");
						//TODO connect to updating location of feature
					});
				}, 500);

				_pointLayer = new esri.layers.GraphicsLayer();
				_pointLayer.id = "tempIconLayer";
				app.map.addLayer(_pointLayer);
				app.map.reorderLayer(_pointLayer, app.map.graphicsLayerIds.length - 1);
				// Issue #489.	Disable page up/down as it caused problem in detail panel.
				window.addEventListener("keydown", function(e) {
					// space and arrow keys
					if([33, 34].indexOf(e.keyCode) > -1) {
						e.preventDefault();
					}
				}, false);
			};

			this.buildSlides = function(filterUnlocated, i)
			{
				var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
				var themeIndex = $('.entry.active').index();
				if(themeIndex<0)
					themeIndex = 0;
				if(i > -1)
					themeIndex = i;
				_swipers[themeIndex].removeAllSlides();
				var graphics = $.grep(shortlistLayer.graphics, function(e){ return e.attributes.tab_id == themeIndex; });

				if(graphics[0] && graphics[0].attributes.number){
					graphics.sort(function(a,b){
						return parseInt(a.attributes.number) - parseInt(b.attributes.number);
					});
				}
				$('body').addClass('loadingPlaces');
				$.each(graphics, function(index, graphic){
					var atts = graphic.attributes;

					var itemNumber = index + 1;
					var params = {
						name: atts.name,
						description: atts.description,
						pic_url: atts.pic_url,
						thumb_url: atts.thumb_url,
						locationSet: atts.locationSet,
						number: atts.number
					};

					_this.addSlide(itemNumber, atts.shortlist_id, params, themeIndex);
					_swipers[themeIndex].update();
				});

				_swipers[themeIndex].update();
				prepSwiperDisplay();
				setTimeout(function(){
					$('body').removeClass('loadingPlaces');
				}, 500);
			};

			this.buildAllSlides = function()
			{
				var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
				var graphics = shortlistLayer.graphics;
				var tabs = [];
				var entries = $('#nav-bar').find(".nav-tabs > li:not(.dropdown)");
				$.each(entries, function(){
					tabs.push([]);
				});

				$.each(graphics, function(i,graphic){
					tabs[parseInt(graphic.attributes.tab_id)].push(graphic);
				});
				$.each(tabs, function(index){
					_this.buildSlides(false, index);
				});

				prepSwiperDisplay();
				_this.resize();

			};

			this.buildUnlocatedSlides = function()
			{
				var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
				var themeIndex = $('.entry.active').index();
				if(themeIndex<0)
					themeIndex = 0;
				_swipers[themeIndex].removeAllSlides();
				var graphics = $.grep(shortlistLayer.graphics, function(e){ return e.attributes.tab_id == themeIndex; });

				if(graphics[0] && graphics[0].attributes.number){
					graphics.sort(function(a,b){
						return parseInt(a.attributes.number) - parseInt(b.attributes.number);
					});
				}
				$('body').addClass('loadingPlaces');
				var index = 1;
				$.each(graphics, function(i, graphic){
					var atts = graphic.attributes;
					if(atts.locationSet)
						return;

					var itemNumber = index++;
					var params = {
						name: atts.name,
						description: atts.description,
						pic_url: atts.pic_url,
						thumb_url: atts.thumb_url,
						locationSet: atts.locationSet,
						number: atts.number
					};

					_this.addSlide(itemNumber, atts.shortlist_id, params, themeIndex);
					_swipers[themeIndex].update();
				});

				_swipers[themeIndex].update();
				prepSwiperDisplay();
				setTimeout(function(){
					$('body').removeClass('loadingPlaces');
				}, 500);
			};

			this.addDetailPanelSwiper = function(index)
			{
				var themeIndex = index;
				if(!index)
					themeIndex = 0;

				if(themeIndex == 0){
					$(container).find('#paneLeft').append(detailPanel({ }));
					$(container).find(' .detailView')[themeIndex].setAttribute('id', 'detailView' + themeIndex);
				}
				else {
					var prevDetPanel = $(container).find(' .detailContainer')[themeIndex-1];
					$(prevDetPanel).after(detailPanel({ }));
					$(container).find(' .detailView')[themeIndex].setAttribute('id', 'detailView' + themeIndex);
				}

				$('.detailContainer').hide();
				var currentDetailContainer = $('.detailContainer')[themeIndex];
				$(currentDetailContainer).show();
				var newSwiper = new Swiper($(currentDetailContainer), {
					speed: 0,
					setWrapperSize: true,
					lazyLoading: true,
					lazyLoadingInPrevNext: true,
					simulateTouch: false
				});
				_swipers[themeIndex] = newSwiper;
				_swipers[themeIndex].updating = false;

				newSwiper.init();
				$(currentDetailContainer).hide();
				newSwiper.update();
				newSwiper.on('onSlideChangeEnd', function(swiper){
					setNavControls();
					if($('body').hasClass('loadingPlaces'))
						return;
					_mainView.preSelection();
					var themeIndex = $('.entry.active').index();
					var dv = swiper.slides[swiper.activeIndex];
					var id = $(dv).data('shortlist-id');
					var id2 = $.grep(app.layerCurrent.graphics,function(n){return n.attributes.shortlist_id == id;})[0];
					if(id2 && id2.attributes && !id2.attributes.locationSet)
						$(dv).find('.editLocation').hide();
					_mainView.selected = id2;
					_swipers[themeIndex].update();

					if(_mainView.selected && _mainView.selected.attributes.locationSet && !app.map.extent.contains(_mainView.selected.geometry)){
						app.map.centerAt(_mainView.selected.geometry);
					}
					setTimeout(function(){
						_mainView.buildMapTips();
					}, 0);

					$('.esriPopup').hide();
					_this.resize();
					$(currentDetailContainer).show();
					$(currentDetailContainer).css('z-index', 99);
				});

				container.find(".detailClose").click(function(){
					if($('.arcgisSearch').css('display') == 'block'){}
						cancelLocationUpdate();
					var themeIndex = $('.entry.active').index();
					var currentSlide = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];
					var currentGraphic = $.grep(app.layerCurrent.graphics, function(e){ return e.attributes.shortlist_id ==  $(currentSlide).data('shortlist-id'); });
					var currentGraphicAtts = currentGraphic[0].attributes;

					if(currentGraphicAtts.name || currentGraphicAtts.description || currentGraphicAtts.pic_url || currentGraphicAtts.locationSet){
						//do nothing
					}else{
						var currentTile = app.ui.tilePanel.findTile($(currentSlide).data('shortlist-id'));
						$(currentTile).remove();
						app.layerCurrent.remove(currentGraphic[0]);
						_swipers[themeIndex].removeSlide(_swipers[themeIndex].activeIndex);
						app.addFeatureBar.updateLocatedFeatures();
					}
					container.find(".detailContainer").hide();
					if(app.ui.mobileIntro.screenSize == 'small')
						app.ui.mobileFeatureList.showMobileList();
					app.ui.mainView.unselect();
					if($('body').hasClass('locateFeatures removeSlide') && _swipers[themeIndex].slides.length == 1){
						_this.buildSlides();
						app.addFeatureBar.exitOrganizeMode();
					}
				});

				container.find($(".detail-btn-left")[themeIndex]).click(function(){
					var themeIndex = $('.entry.active').index();
					var currentSwiper = _swipers[themeIndex];
					if($('.arcgisSearch').css('display') == 'block'){
						if(_movableIcon)
							_movableIcon.clean();
						_search.hide();
						cancelLocationUpdate();
						app.map.getLayer('tempIconLayer').remove(app.map.getLayer('tempIconLayer').graphics[0]);
						app.map.setMapCursor("auto");
						var currentSlide = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];
						var currentGraphic = $.grep(app.layerCurrent.graphics, function(e){ return e.attributes.shortlist_id ==  ($(currentSlide).data('shortlist-id') + 1); });
						if(_search.highlightGraphic)
							_search.highlightGraphic.hide();
						$('.esriPopup').hide();
						$(currentSlide).find('.cancelLocation').hide();
						$(currentSlide).find('.updateLocation').hide();
						if(currentGraphic[0] && currentGraphic[0].attributes.locationSet){
							$(currentSlide).find('.editLocation').show();
							currentGraphic[0].show();
						}else{
							$(currentSlide).find('.setLocation').show();
						}
						var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
						shortlistLayer.redraw();
					}
					if(currentSwiper.activeIndex === 0)
						currentSwiper.slideTo(currentSwiper.slides.length - 1, 0);
					else {
						currentSwiper.slidePrev();
					}
					if($('body').hasClass('locateFeatures removeSlide')){
						var removeSlideIndex = _swipers[themeIndex].activeIndex == _swipers[themeIndex].slides.length - 1 ? 0 : _swipers[themeIndex].activeIndex + 1;
						_swipers[themeIndex].removeSlide(removeSlideIndex);
						_swipers[themeIndex].update();
						setNavControls();
						$('body').removeClass('removeSlide');
						var dv = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];
						var id = $(dv).data('shortlist-id');
						var id2 = $.grep(app.layerCurrent.graphics,function(n){return n.attributes.shortlist_id == id;})[0];
						_mainView.selected = id2;
						setTimeout(function(){
							_mainView.buildMapTips();
						}, 0);
					}

				});

				container.find($(".detail-btn-right")[themeIndex]).click(function(){
					var themeIndex = $('.entry.active').index();
					var currentSwiper = _swipers[themeIndex];
					if($('.arcgisSearch').css('display') == 'block'){
						if(_movableIcon)
							_movableIcon.clean();
						_search.hide();
						cancelLocationUpdate();
						app.map.getLayer('tempIconLayer').remove(app.map.getLayer('tempIconLayer').graphics[0]);
						app.map.setMapCursor("auto");
						var currentSlide = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];
						var currentGraphic = $.grep(app.layerCurrent.graphics, function(e){ return e.attributes.shortlist_id ==  ($(currentSlide).data('shortlist-id') - 1); });
						if(_search.highlightGraphic)
							_search.highlightGraphic.hide();
						$('.esriPopup').hide();
						$(currentSlide).find('.cancelLocation').hide();
						$(currentSlide).find('.updateLocation').hide();
						if(currentGraphic[0] && currentGraphic[0].attributes.locationSet){
							$(currentSlide).find('.editLocation').show();
							currentGraphic[0].show();
						}else{
							$(currentSlide).find('.setLocation').show();
						}
						var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
						shortlistLayer.redraw();
					}
					if(currentSwiper.activeIndex == currentSwiper.slides.length - 1)
						currentSwiper.slideTo(0, 0);
					else {
						currentSwiper.slideNext();
					}
					if($('body').hasClass('locateFeatures removeSlide')){
						var removeSlideIndex = _swipers[themeIndex].activeIndex === 0 ? _swipers[themeIndex].slides.length - 1 : _swipers[themeIndex].activeIndex - 1;
						_swipers[themeIndex].removeSlide(removeSlideIndex);
						_swipers[themeIndex].update();
						setNavControls();
						$('body').removeClass('removeSlide');
						var dv = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];
						var id = $(dv).data('shortlist-id');
						var id2 = $.grep(app.layerCurrent.graphics,function(n){return n.attributes.shortlist_id == id;})[0];
						_mainView.selected = id2;
						setTimeout(function(){
							_mainView.buildMapTips();
						}, 0);
					}
				});

				container.find($(".detail-btn-add")[themeIndex]).click(function(){
					app.addFeatureBar.addFeature();
					if($('.arcgisSearch').css('display') == 'block'){
						if(_movableIcon)
							_movableIcon.clean();
						_search.hide();
						$('body').removeClass('pickLocation');
						app.map.getLayer('tempIconLayer').remove(app.map.getLayer('tempIconLayer').graphics[0]);
						app.map.setMapCursor("auto");
						var themeIndex = $('.entry.active').index();
						var currentSlide = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];
						var currentGraphic = $.grep(app.layerCurrent.graphics, function(e){ return e.attributes.shortlist_id ==  ($(currentSlide).data('shortlist-id') -1 ); });
						if(_search.highlightGraphic)
							_search.highlightGraphic.hide();
						$('.esriPopup').hide();
						$(currentSlide).find('.cancelLocation').hide();
						$(currentSlide).find('.updateLocation').hide();
						if(currentGraphic[0] && currentGraphic[0].attributes.locationSet){
							$(currentSlide).find('.editLocation').show();
							currentGraphic[0].show();
						}else{
							$(currentSlide).find('.setLocation').show();
						}
						var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
						shortlistLayer.redraw();
					}

				});
			};

			this.present = function(cfg)
			{
				initUI();
			};

			this.addSlide = function(itemNumber, itemId, params, index)
			{
				var themeIndex = $('.entry.active').index();
				if(index > -1)
					themeIndex = index;
				var currentDetailContainer = $('.detailContainer')[themeIndex];
				container.find('#detailView' + themeIndex).append(detailPanelSlide());
				var newSlide = $(currentDetailContainer).find('.swiper-slide')[itemNumber-1];

				// replace with humber of featur
				$(newSlide).find('.detailFeatureNum').text(itemNumber);
				//Need to do for each tab/swiper, not here
				if(app.data.getWebAppData().getGeneralOptions().numberedIcons){
					$(newSlide).find('.detailFeatureNum').css('background-color', app.data.getStory()[themeIndex].color);
					$(newSlide).find('.detailFeatureNum').show();
					$(newSlide).find('.detailFeatureTitle').removeClass('notNumbered');
				} else{
					$(newSlide).find('.detailFeatureNum').hide();
					$(newSlide).find('.detailFeatureTitle').addClass('notNumbered');
				}
				$(newSlide).find('.detailPictureDiv img').click(presentImagePicker);
				$(newSlide).find('.detailPictureDiv .imagePicker').click(presentImagePicker);
				// use real shortlist id
				$(newSlide).data('shortlist-id', itemId);

				$(newSlide).find('.detailFeatureTitle').addClass('noTitle');

				if(params){
					if(params.name){
						$(newSlide).find('.detailFeatureTitle').html(params.name);
						$(newSlide).find('.detailFeatureTitle').removeClass('noTitle');
					}
					if(params.pic_url){
						$(newSlide).find('img').attr('src', params.pic_url);
						$(newSlide).find('.imagePicker').hide();
					}
					if(params.description)
						$(newSlide).find('.description').html(params.description);
					if(params.lng && params.lat || params.locationSet){
						$(newSlide).find('.setLocation').hide();
						$(newSlide).find('.editLocation').show();
					}
				}

				if(!params || ((!params.lng && !params.lat) && !params.locationSet)){
					$(newSlide).find('.setLocation').show();
					$(newSlide).find('.editLocation').hide();
				}else{
					$(newSlide).find('.editLocation').show();
					$(newSlide).find('.setLocation').hide();
				}

				_swipers[themeIndex].update();

				var onTextEditorBlur = function(e, that){
					var themeIndex = $('.entry.active').index();
					var currentSlide = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];
					var changedGraphic = $.grep(app.layerCurrent.graphics, function(e){ return e.attributes.shortlist_id ==  $(currentSlide).data('shortlist-id'); });

					if(that.selector == '.detailFeatureTitle'){
						changedGraphic[0].attributes.name = $(that).text();
						var tile = $.grep($('#myList li'), function(e){ return $(e).data('shortlist-id') ==  $(currentSlide).data('shortlist-id'); });
						$(tile).find('.blurb').text($(that).text());
						$(currentSlide).find('.detailFeatureTitle').removeClass('noTitle');
						if(app.mapTips){
							app.mapTips.clean(true);
							app.ui.mainView.buildMapTips();
						}
					}
					if(that.selector == '.description'){
						changedGraphic[0].attributes.description = $(that).html();
					}
					if(WebApplicationData.getTitle())
						topic.publish("BUILDER_INCREMENT_COUNTER");

					setTimeout(function(){
						setNavControls();
					}, 50);
				};

				_titleEditor = new MediumEditorWrapper({
					container: $(newSlide).find('.detailFeatureTitle'),
					mode: 'single-line',
					placeholder: 'Enter place name...',
					onBlur: function(e){
						onTextEditorBlur(e, $(newSlide).find('.detailFeatureTitle'));
					}
				});

				_descEditor = new MediumEditorWrapper({
					container: $(newSlide).find('.editable'),
					mode: 'standard',
					placeholder: 'Enter place description...',
					onBlur: function(e){
						onTextEditorBlur(e, $(newSlide).find('.description'));
					}
				});

				if(!params || params && !params.name){
					setTimeout(function(){
						$(newSlide).find('.detailFeatureTitleText').focus();
					}, 0);
				}

				$(newSlide).find('.setLocation, .editLocation').click(function(){
					var themeIndex = $('.entry.active').index();
					var currentSlide = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];
					var currentGraphic = $.grep(app.layerCurrent.graphics, function(e){ return e.attributes.shortlist_id ==  $(currentSlide).data('shortlist-id'); });
					openSearchWidget(currentGraphic[0].attributes.shortlist_id);
					if(_swipers[themeIndex].activeIndex == _swipers[themeIndex].slides.length -1){
						var currentDetailContainer = $('.detailContainer')[themeIndex];
						$(currentDetailContainer).find('.detail-btn-add').hide();
					}
				});
				_swipers[themeIndex].updating = false;
			};

			this.showSlide = function(slideID)
			{
				_this.resize();
				prepSwiperDisplay();
				var themeIndex = $('.entry.active').index();
				var currentDetailContainer = $('.detailContainer')[themeIndex];

				var selectedSlideIndex = null;
				$.each($('#detailView' + themeIndex).find($('.swiper-slide')), function(index, slide){
					if(parseInt($(slide).data('shortlist-id')) == (slideID)){
						selectedSlideIndex = index;
						return;
					}
				});

				_this.resize();

				if(selectedSlideIndex > -1)
				{
					setTimeout(function(){
						_swipers[themeIndex].slideTo(selectedSlideIndex, 0);
					}, 0);
				}

				if(selectedSlideIndex == _swipers[themeIndex].activeIndex){
					$(currentDetailContainer).show();
					$(currentDetailContainer).css('z-index', 99);
					setNavControls();
				}

				else if(_swipers[themeIndex].slides.length < 2){
					$(currentDetailContainer).show();
					$(currentDetailContainer).css('z-index', 99);
					setNavControls();
				}

				else{
					setTimeout(function(){
						$(currentDetailContainer).show();
						$(currentDetailContainer).css('z-index', 99);
						setNavControls();
					}, 0);
				}
			};

			this.updateSlide = function(params)
			{
				var themeIndex = $('.entry.active').index();
				_swipers[themeIndex].updating = true;
				var currentSlide = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];
				$(currentSlide).find('img').attr('src', params.url);
				$(currentSlide).find('.imagePicker').hide();
				var changedGraphic = $.grep(app.layerCurrent.graphics, function(e){ return e.attributes.shortlist_id ==  $(currentSlide).data('shortlist-id'); });

				changedGraphic[0].attributes.pic_url = params.url;
				if(params.thumb_url)
					changedGraphic[0].attributes.thumb_url = params.thumb_url;
				else{
					changedGraphic[0].attributes.thumb_url = params.url;
				}

				var tile = $.grep($('#myList li'), function(e){ return $(e).data('shortlist-id') ==  $(currentSlide).data('shortlist-id'); });

				$(tile).find('.tileImage').css('background-image', 'url('+changedGraphic[0].attributes.thumb_url+')');
				$(tile).find('i').hide();

				if($(currentSlide).find('.detailFeatureTitle').text().length <= 0 && params.name){
					changedGraphic[0].attributes.name = params.name;
					_titleEditor.setContent({
						text: params.name
					});

					$(tile).find('.blurb').text(params.name);
					$('#item'+$(currentSlide).data('shortlist-id')).find('.blurb').text(params.name);
					$(currentSlide).find('.detailFeatureTitle').removeClass('noTitle');
				}

				if($(currentSlide).find('.description').text().length <= 0 && params.description){
					changedGraphic[0].attributes.description = params.description;
					_descEditor.setContent({
						text: params.description,
						convertLine: true
					});
				}

				if(params.lat && params.lng && !changedGraphic[0].attributes.locationSet){
					var newGeom = webMercatorUtils.lngLatToXY(params.lng, params.lat);

					var newPoint = new Point(newGeom[0], newGeom[1], new SpatialReference({ wkid: app.map.spatialReference.wkid }));
					changedGraphic[0].setGeometry(newPoint);
					changedGraphic[0].attributes.locationSet = 1;

					$(tile).addClass('located');
					$(tile).find('.unlocated').removeClass('unlocated');
					$(currentSlide).find('.editLocation').show();
					$(currentSlide).find('.setLocation').hide();
					setTimeout(function(){
						_builderView.updateShortlistExtent();
					}, 1000);
				} else{
					if(!changedGraphic[0].attributes.locationSet)
						$(currentSlide).find('.setLocation').show();
				}

				if(changedGraphic[0].attributes.locationSet){
					changedGraphic[0].show();
					app.ui.mainView.selected = changedGraphic[0];
					app.ui.mainView.buildMapTips();
					var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
					shortlistLayer.redraw();
				}

				app.addFeatureBar.updateLocatedFeatures();

				//if(params.fromService)
					//_imagePicker.close();
				if(WebApplicationData.getTitle())
					topic.publish("BUILDER_INCREMENT_COUNTER");

				setTimeout(function(){
					setNavControls();
				}, 50);

				_this.resize();

				_swipers[themeIndex].updating = false;
			};

			this.updateThemeSwipers = function(result)
			{
				/*$.each($('.detailView'), function(index, detailView){
					var view = $.grep(result.entries, function(n){return "detailView"+n.id == detailView.id;});
					if(!view[0])
						$(detailView).parent().remove();
				});
				$.each($('.detailView'), function(index, detailView){
					$(detailView).attr('id', 'detailView'+index);
				});*/
				$.each($('.detailContainer'), function(index, detailContainer){
					$(detailContainer).remove();
				});
				$.each(result.entries, function(index){
					_this.addDetailPanelSwiper(index);
				});
			};

			this.hideSearch = function()
			{
				if(_search)
					_search.hide();
			};

			this.resize = function()
			{
				if(!_swipers.length)
					return;
				setTimeout(function(){
					var offset = 115;
					if(app.ui.mobileIntro.screenSize == 'small'){
						$('#paneLeft').css('height', $('#contentPanel').height() - $('#map').height() + 10);
						$('#paneLeft').css('width', '100%');
						$('#paneLeft').css({'top': $('#map').height() - 10});
						offset = 20;
					}
					var themeIndex = $('.entry.active').index();
					if(themeIndex<0)
						themeIndex = 0;
					var currentSlide = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];

					$(currentSlide).height($('#paneLeft').outerHeight() - 5);
					var titleHeight = $(currentSlide).find('.detailHeader').outerHeight();
					$('.detailTextContainer').css({'margin-top': '10px'});
					$('.detailTextContainer').height($('#paneLeft').outerHeight() - titleHeight - offset + 'px');
					$('.detailTextContainer').width('100%');
					$('.detailPictureDiv img').css('max-width', $("#paneLeft").outerWidth());
					var imgMaxHeight = ($("#paneLeft").outerHeight() - titleHeight - 60) < ($("#paneLeft").outerHeight() * 0.6) ? $("#paneLeft").outerHeight() - titleHeight - 60 : $("#paneLeft").outerHeight() * 0.6;
					$('.detailPictureDiv img').css('max-height', parseInt(imgMaxHeight)+'px');
					$('.detailContainer').width($("#paneLeft").outerWidth());
					$('.detailContainer').height($("#paneLeft").outerHeight());
					//$(window).width() <= app.cfg.TWO_COLUMN_THRESHOLD ? $('.detailContainer').css('margin-top', '-93px') : $('.detailContainer').css('margin-top', '-53px');
					_swipers[themeIndex].update();
					_swipers[themeIndex].slideTo(_swipers[themeIndex].activeIndex);
				}, 0);
			};

			this.close = function()
			{

			};

			function prepSwiperDisplay()
			{
				$('body').addClass('loadingPlaces');
				var themeIndex = $('.entry.active').index();
				if(themeIndex<0)
					themeIndex = 0;
				$('.detailContainer').css('z-index', 99999999);
				$('.detailContainer').show();
				_swipers[themeIndex].update();
				_swipers[themeIndex].slideNext();
				_swipers[themeIndex].slidePrev();
				_swipers[themeIndex].update();
				_this.resize();
				$('.detailContainer').hide();
				$('.detailContainer').css('z-index', 0);
				$('body').removeClass('loadingPlaces');
			}

			function openSearchWidget(featureId)
			{
				$('body').addClass('pickLocation');
				var currentGraphic = $.grep(app.layerCurrent.graphics, function(e){ return e.attributes.shortlist_id ==  featureId; });
				var themeIndex = $('.entry.active').index();
				var currentSlide = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];

				_search.show();

				$(currentSlide).find('.setLocation').hide();
				$(currentSlide).find('.editLocation').hide();
				$(currentSlide).find('.cancelLocation').show();

				$(currentSlide).find('.cancelLocation').click(cancelLocationChange);

				if(!currentGraphic[0].attributes.locationSet){
					app.map.setMapCursor("crosshair");
					_mapClick = app.map.on('click', function(e){

						currentGraphic[0].setGeometry(e.mapPoint);
						currentGraphic[0].symbol.setWidth(app.ui.mainView.lutIconSpecs.large.getWidth());
						currentGraphic[0].symbol.setHeight(app.ui.mainView.lutIconSpecs.large.getHeight());
						currentGraphic[0].symbol.setOffset(app.ui.mainView.lutIconSpecs.large.getOffsetX(), app.ui.mainView.lutIconSpecs.large.getOffsetY());
						app.ui.mainView.selected = currentGraphic[0];
						currentGraphic[0].attributes.locationSet = 1;
						app.ui.mainView.buildMapTips();
						currentGraphic[0].show();


						$(currentSlide).find('.editLocation').show();
						$(currentSlide).find('.updateLocation').hide();
						$(currentSlide).find('.cancelLocation').hide();

						_search.hide();
						if(_search.highlightGraphic)
							_search.highlightGraphic.hide();
						$('.esriPopup').hide();
						app.map.setMapCursor("auto");
						_mapClick.remove();
						var tile = $.grep($('#myList li'), function(e){ return $(e).data('shortlist-id') ==  featureId; });
						$(tile).find('.unlocated').removeClass('unlocated');
						app.addFeatureBar.updateLocatedFeatures();

						var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
						if(shortlistLayer.graphics.length > 1)
							_builderView.updateShortlistExtent();
						shortlistLayer.redraw();
						updateTile(currentGraphic[0]);
						$('body').removeClass('pickLocation');
						$('body').addClass('removeSlide');
						setNavControls();
						topic.publish("BUILDER_INCREMENT_COUNTER");
					});
				} else{
					currentGraphic[0].hide();
					//Make feature marker moveable
					var tempIcon = new Graphic(currentGraphic[0].geometry, currentGraphic[0].symbol, currentGraphic[0].attributes);
					_pointLayer.add(tempIcon);
					_pointLayer.graphics[0].show();
					_movableIcon = new MovableGraphic(app.map, _pointLayer, _pointLayer.graphics[0], onMoveEndCallback);
				}
			}

			function updateTile(graphic){
				var tile = $.grep($('#myList li'), function(e){ return $(e).data('shortlist-id') ==  graphic.attributes.shortlist_id; });
				$(tile).addClass('located');
				if($(tile).find('.unlocated').length)
					$(tile).find('.unlocated').removeClass('unlocated');
				if($('body').hasClass('organizeFeatures')){
					//TODO bad after moving features b/w tabs
					//_this.buildSlides(WebApplicationData.getContentLayers(), true);
				}
				if($('body').hasClass('locateFeatures')){
					$('.located').hide();
				}
			}

			function onMoveEndCallback(graphic, geometryChanged)
			{
				var themeIndex = $('.entry.active').index();
				var currentSlide = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];

				if(app.mapTips)
					app.mapTips.clean(true);

				_movedGraphic = graphic;

				if(_search.highlightGraphic)
					_search.highlightGraphic.hide();
				$('.esriPopup').hide();

				$(currentSlide).find('.updateLocation').show();
				$(currentSlide).find('.updateLocation').click(updateLocation);
				$(currentSlide).find('.cancelLocation').click(cancelLocationUpdate);
				topic.publish("BUILDER_INCREMENT_COUNTER");
			}

			function cancelLocationUpdate()
			{
				if(_movableIcon)
					_movableIcon.clean();
				_search.hide();
				$('body').removeClass('pickLocation');
				app.map.getLayer('tempIconLayer').remove(app.map.getLayer('tempIconLayer').graphics[0]);
				app.map.setMapCursor("auto");
				var themeIndex = $('.entry.active').index();
				var currentSlide = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];
				var currentGraphic = $.grep(app.layerCurrent.graphics, function(e){ return e.attributes.shortlist_id ==  $(currentSlide).data('shortlist-id'); });
				if(_search.highlightGraphic)
					_search.highlightGraphic.hide();
				$('.esriPopup').hide();
				$(currentSlide).find('.cancelLocation').hide();
				$(currentSlide).find('.updateLocation').hide();
				if(currentGraphic[0] && currentGraphic[0].attributes.locationSet){
					$(currentSlide).find('.editLocation').show();
					currentGraphic[0].show();
				}else{
					$(currentSlide).find('.setLocation').show();
				}
				if(_swipers[themeIndex].activeIndex == _swipers[themeIndex].slides.length -1){
					var currentDetailContainer = $('.detailContainer')[themeIndex];
					$(currentDetailContainer).find('.detail-btn-add').show();
				}
				var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
				shortlistLayer.redraw();
			}

			function updateLocation()
			{
				//app.mapTips.clean(true);
				if(_movableIcon)
					_movableIcon.clean();
				_mainView.buildMapTips();
				_search.hide();
				if(_search.highlightGraphic)
					_search.highlightGraphic.hide();
				$('.esriPopup').hide();
				$('body').removeClass('pickLocation');
				var themeIndex = $('.entry.active').index();
				var currentGraphic = $.grep(app.layerCurrent.graphics, function(e){ return e.attributes.shortlist_id ==  _movedGraphic.attributes.shortlist_id; });
				var currentSlide = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];
				currentGraphic[0].setGeometry(_movedGraphic.geometry);
				currentGraphic[0].show();
				app.map.getLayer('tempIconLayer').remove(app.map.getLayer('tempIconLayer').graphics[0]);

				var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
				shortlistLayer.redraw();
				app.addFeatureBar.updateLocatedFeatures();
				app.map.setMapCursor("auto");
				if(app.mapTips)
					app.mapTips.clean(true);
				app.ui.mainView.buildMapTips();

				_builderView.updateShortlistExtent();

				$(currentSlide).find('.editLocation').show();
				$(currentSlide).find('.updateLocation').hide();
				$(currentSlide).find('.cancelLocation').hide();
				setNavControls();
				topic.publish("BUILDER_INCREMENT_COUNTER");
			}

			function cancelLocationChange()
			{
				var themeIndex = $('.entry.active').index();
				var currentSlide = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];
				var currentGraphic = $.grep(app.layerCurrent.graphics, function(e){ return e.attributes.shortlist_id ==  $(currentSlide).data('shortlist-id'); });
				_this.hideSearch();
				if(app.mapTips)
					app.mapTips.clean(true);
				app.map.setMapCursor("auto");
				app.ui.mainView.buildMapTips();
				app.map.getLayer('tempIconLayer').remove(app.map.getLayer('tempIconLayer').graphics[0]);
				if(currentGraphic[0].attributes.locationSet)
					currentGraphic[0].show();
				var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
				shortlistLayer.redraw();
				if(_search.highlightGraphic)
					_search.highlightGraphic.hide();
				$('.esriPopup').hide();
				$(currentSlide).find('.cancelLocation').hide();
				if(currentGraphic[0].attributes.locationSet)
					$(currentSlide).find('.editLocation').show();
				else{
					$(currentSlide).find('.setLocation').show();
				}
				if(_swipers[themeIndex].activeIndex == _swipers[themeIndex].slides.length -1){
					var currentDetailContainer = $('.detailContainer')[themeIndex];
					$(currentDetailContainer).find('.detail-btn-add').show();
				}
			}

			function presentImagePicker()
			{
				var cfg = {};
				cfg.mode = 'add';
				var themeIndex = $('.entry.active').index();
				var currentSlide = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];
				var currentGraphic = $.grep(app.layerCurrent.graphics, function(e){ return e.attributes.shortlist_id ==  $(currentSlide).data('shortlist-id'); });

				if(currentGraphic[0].attributes && currentGraphic[0].attributes.pic_url){
					cfg = {
						media: {
							type: 'image',
							image: {

							}
						},
						mode: 'add'
					};
					cfg.media.pic_url = currentGraphic[0].attributes.pic_url;
				}
				if(currentGraphic[0].attributes && currentGraphic[0].attributes.thumb_url){
					if(!cfg.media){
						cfg = {
							media: {
								type: 'image',
								image: {

								}
							},
							mode: 'add'
						};
					}
					cfg.media.thumb_url = currentGraphic[0].attributes.thumb_url;
				}
				_imagePicker.present(cfg).then(function(media){
					_this.updateSlide(media);
				});
			}

			function setNavControls()
			{
				var themeIndex = $('.entry.active').index();
				if(_swipers[themeIndex].slides.length == 1){
					$('.detail-btn-left').hide();
					$('.detail-btn-right').hide();
				} else {
					$('.detail-btn-left').show();
					if(_swipers[themeIndex].activeIndex != _swipers[themeIndex].slides.length - 1)
						$('.detail-btn-right').show();
				}

				if(_swipers[themeIndex].activeIndex == _swipers[themeIndex].slides.length - 1 && !$('body').hasClass('locateFeatures')){
					$('.detail-btn-right').hide();

					var currentSlide = _swipers[themeIndex].slides[_swipers[themeIndex].activeIndex];
					var shortlistLayer = app.map.getLayer(app.data.getWebAppData().getShortlistLayerId()).graphics;
					var currentGraphic = $.grep(shortlistLayer, function(n){ return n.attributes.shortlist_id == $(currentSlide).data('shortlist-id');});
					if(currentGraphic[0] && currentGraphic[0].attributes && (currentGraphic[0].attributes.name || currentGraphic[0].attributes.description || currentGraphic[0].attributes.pic_url || currentGraphic[0].attributes.thumb_url || currentGraphic[0].attributes.locationSet)){
						$('.detail-btn-add').show();
					}else{
						$('.detail-btn-add').hide();
					}
				} else {
					$('.detail-btn-add').hide();
					if(_swipers[themeIndex].slides.length > 1)
						$('.detail-btn-right').show();
				}
			}

			function onClickApply()
			{
				console.log("$$$");
			}

			function initUI()
			{

				_initDone = true;
			}
		};
	}
);
