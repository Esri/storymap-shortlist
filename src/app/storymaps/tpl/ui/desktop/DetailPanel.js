define(["../../core/Helper",
		"storymaps/common/utils/CommonHelper",
		"lib-build/tpl!./DetailPanel",
		"lib-build/tpl!./DetailSlide",
		"lib-build/css!./DetailPanel"
	],
	function(Helper, CommonHelper, detailPanel, detailSlide){
		return function DetailPanel(container, isInBuilder, saveData, mainView, WebApplicationData)
		{
			var _mainView = mainView;
			var _themes;
			var _this = this;
			var _helper = new Helper();
			var _i = 0;
			var _slideContainersLoaded = false;
			var _swipers = [];
			var _swiperSlides ={};
			var _slidesRefreshing = false;
			var _webApplicationData = WebApplicationData;
			var _iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
			var _android = /(android)/i.test(navigator.userAgent);
			var _iOSSwiper = {};

			_this.loaded = false;
			_this.viewed = false;

			this.init = function(p)
			{
				p = p || {};

				$(container).show();

				isInBuilder && initBuilder();

				initEvents();

			};

			this.buildFeatureViews = function(builtThemes)
			{
				var themeIndex = $('.entry.active').index();
				if(themeIndex<0)
					themeIndex = 0;

					var themes = builtThemes ? builtThemes : [];

					if(!themes.length){
						var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());
						$.each(app.data.getStory(), function(index, tab){
							var newThemeObject = {
								title: tab.title ? tab.title : "tab "+(themes.length+1),
								features: []
							};
							themes.push(newThemeObject);
						});

						$.each(shortlistLayer.graphics, function(index, graphic){
							if(graphic.attributes.locationSet && graphic.attributes.pic_url && graphic.attributes.name && graphic.attributes.name != "Unnamed Place")
								themes[graphic.attributes.tab_id].features.push(graphic);
							/*if(app.data.getWebAppData().getIsExternalData()){
								var tabName = graphic.attributes.tab_name  || graphic.attributes.Tab_Name || graphic.attributes.TAB_NAME;
								$.grep(themes,function(n, i){if(n.title == tabName){ graphic.attributes.tab_id = i;}});
								themes[graphic.attributes.tab_id].features.push(graphic);
								graphic.attributes.shortlist_id = themes[graphic.attributes.tab_id].features.length + 1;
							}*/
						});
					}

				if(!_slideContainersLoaded){
					if(_iOS){
						$(container).prepend(detailPanel({ }));
						var detailView = $('.detailView')[0];

						$(detailView).attr("id","detailView0");
						_iOSSwiper = new Swiper($('.detailContainer')[0], {
							speed: 0,
							setWrapperSize: true
						});
						_iOSSwiper.init();
						_slideContainersLoaded = true;
						container.find(".detailClose").click(function(){
							container.find(".detailContainer").hide();
							if(app.ui.mobileIntro.screenSize == 'small')
								app.ui.mobileFeatureList.showMobileList();
							_mainView.unselect();
						});

						container.find($(".detail-btn-left")[0]).click(function(){
							var features = app.layerCurrent.graphics;
							var nextFeature = null;
							var mapFeatures = [];
							$.each(features, function(index, feat){
								if(app.map.extent.contains(feat.geometry) || !app.data.getWebAppData().getGeneralOptions().filterByExtent){
									mapFeatures.push(feat);
								}
							});
							var featIndex = null;
							$.grep(mapFeatures,function(n, index){if(n.attributes.shortlist_id == app.ui.mainView.selected.attributes.shortlist_id){featIndex = index;}});
							if(featIndex !== 0)
								nextFeature = mapFeatures[featIndex - 1];
							else{
								nextFeature = mapFeatures[mapFeatures.length - 1];
							}
							_mainView.unselect();
							_mainView.selected = nextFeature;
							if(!app.map.extent.contains(nextFeature.geometry))
								app.map.centerAt(nextFeature.geometry);
							_mainView.selectSymbol();
							_this.buildSlide();
						});

						container.find($(".detail-btn-right")[0]).click(function(){
							var features = app.layerCurrent.graphics;
							var nextFeature = null;
							var mapFeatures = [];
							$.each(features, function(index, feat){
								if(app.map.extent.contains(feat.geometry)|| !app.data.getWebAppData().getGeneralOptions().filterByExtent){
									mapFeatures.push(feat);
								}
							});
							var featIndex = null;
							$.grep(mapFeatures,function(n, index){if(n.attributes.shortlist_id == app.ui.mainView.selected.attributes.shortlist_id){featIndex = index;}});
							if(featIndex !== mapFeatures.length - 1)
								nextFeature = mapFeatures[featIndex + 1];
							else{
								nextFeature = mapFeatures[0];
							}
							_mainView.unselect();
							_mainView.selected = nextFeature;
							if(!app.map.extent.contains(nextFeature.geometry))
								app.map.centerAt(nextFeature.geometry);
							_mainView.selectSymbol();
							_this.buildSlide();
						});

						container.find(".detailPictureDiv img").click(function(){
							var features = app.layerCurrent.graphics;
							var nextFeature = null;
							var mapFeatures = [];
							$.each(features, function(index, feat){
								if(app.map.extent.contains(feat.geometry) || !app.data.getWebAppData().getGeneralOptions().filterByExtent){
									mapFeatures.push(feat);
								}
							});
							var featIndex = null;
							$.grep(mapFeatures,function(n, index){if(n.attributes.shortlist_id == app.ui.mainView.selected.attributes.shortlist_id){featIndex = index;}});
							if(featIndex !== mapFeatures.length - 1)
								nextFeature = mapFeatures[featIndex + 1];
							else{
								nextFeature = mapFeatures[0];
							}

							_mainView.unselect();
							_mainView.selected = nextFeature;
							_mainView.selectSymbol();
							_this.buildSlide();
						});
					}else{
						$.each(themes, function(index){
							if(index === 0  && (!app.isInBuilder || app.data.getWebAppData().getIsExternalData()))
								$(container).prepend(detailPanel({ }));
							else {
								var prevDetPanel = $(container).find(' .detailContainer')[index-1];
								$(prevDetPanel).after(detailPanel({ }));
							}

							if(app.isInBuilder && app.data.getWebAppData().getIsExternalData()){
								$('.detailContainer.swiper-container').addClass('externalData');
								$('.detail-btn-add').addClass('externalData');
							}

							var detailView = $('.detailView')[index];

							$(detailView).attr("id","detailView"+index);
							_swipers[index] = {};
							_swiperSlides[String(index)] = [];
						});
					}
				}

				if(_iOS)
					return;
				_slideContainersLoaded = true;

				if(_swiperSlides[String(themeIndex)].length)
					return;
				$('.detailContainer').css('z-index', '0');

				var currentDetailContainer = $('.detailContainer')[themeIndex];

				$(currentDetailContainer).css('z-index','99');

				//$(currentDetailContainer).css('display','none');

				_i = 0;
				if(!_iOS)
					_this.buildSlides(themes);
			};

			// For iOS BS
			this.buildSlide = function()
			{
				var themeIndex = $('.entry.active').index();
				if(themeIndex < 0)
					themeIndex = 0;
				_iOSSwiper.removeAllSlides();
				container.find('#detailView0').append(detailSlide());
				var currentDetailContainer = $('.detailContainer')[0];
				var newSlide = $(currentDetailContainer).find('.swiper-slide')[0];
				$(newSlide).addClass('swiper-no-swiping');
				var atts = app.ui.mainView.selected.attributes;

				var name = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'name';})[0]];

				var description = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'description';})[0]];
				var shortDesc = '';

				if(app.data.getWebAppData().getIsExternalData()){
					shortDesc = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'short_desc';})[0]];
					var desc1 = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'desc1';})[0]];
					var desc2 = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'desc2';})[0]];
					var desc3 = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'desc3';})[0]];
					var desc4 = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'desc4';})[0]];
					var desc5 = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'desc5';})[0]];
					if(desc1){
						if(description)
							description += "<p>" + desc1 + "</p>";
						else {
							description = "<p>" + desc1 + "</p>";
						}
					}
					if(desc2){
						if(description)
							description += "<p>" + desc2 + "</p>";
						else {
							description = "<p>" + desc2 + "</p>";
						}
					}
					if(desc3)
						if(description)
							description += "<p>" + desc3 + "</p>";
						else {
							description = "<p>" + desc3 + "</p>";
						}
					if(desc4)
						if(description)
							description += "<p>" + desc4 + "</p>";
						else {
							description = "<p>" + desc4 + "</p>";
						}
					if(desc5)
						if(description)
							description += "<p>" + desc5 + "</p>";
						else {
							description = "<p>" + desc5 + "</p>";
						}
				}
				var picture = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'pic_url';})[0]];
				var thumbnail = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'thumb_url';})[0]];
				var website = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'website';})[0]];

				if(app.data.getWebAppData().getGeneralOptions().numberedIcons){
					$(newSlide).find('.detailFeatureNum').css('background-color', app.data.getStory()[themeIndex].color);
					$(newSlide).find('.detailFeatureNum').text(atts.PLACENUMSL ? atts.PLACENUMSL : atts.number);
				} else{
					$(newSlide).find('.detailFeatureNum').hide();
					$(newSlide).find('.detailFeatureTitle').addClass('notNumbered');
				}

				if(name){
					$(newSlide).find('.detailFeatureTitle').html(name);
				}

				if(picture){
					picture = thumbnail ? thumbnail : picture;
					if(picture.indexOf("sharing/rest/content/items/") > -1)
						picture = CommonHelper.possiblyAddToken(picture);
					var image = $(newSlide).find('img')[0];
					image.onload = function(){
						$(this).parent().find('.imageLoadingIndicator').css('display', 'none');
						_this.resize();
					};
					$(newSlide).find('img').attr('src', picture);
					//Fix issue with trying to scroll description and touch getting caught on image
					/*var disableTouch = /iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
					if(!disableTouch)
					{
						$(newSlide).find('img').on('touchend', function(){
							var features = app.layerCurrent.graphics;
							var nextFeature = null;
							var mapFeatures = [];
							$.each(features, function(index, feat){
								if(app.map.extent.contains(feat.geometry)){
									mapFeatures.push(feat);
								}
							});
							var featIndex = null;
							$.grep(mapFeatures,function(n, index){if(n.attributes.shortlist_id == app.ui.mainView.selected.attributes.shortlist_id){featIndex = index;}});
							if(featIndex !== mapFeatures.length - 1)
								nextFeature = mapFeatures[featIndex + 1];
							else{
								nextFeature = mapFeatures[0];
							}
							_mainView.unselect();
							_mainView.selected = nextFeature;
							_mainView.selectSymbol();
							_this.buildSlide();
						});
					}*/
				}else{
					$(newSlide).find('.imageLoadingIndicator').css('display', 'none');
				}

				if(shortDesc){
					$(newSlide).find('.shortDesc').html(shortDesc);
				}else{
					$(newSlide).find('.shortDesc').remove();
				}

				if (description) {
					$(newSlide).find('.description').html(description);
				}

				if (website) {
					$(newSlide).find('.website').empty();
					$(newSlide).find('.website').append('<a href='+ website + ' target="_blank" >More info</a>');
					$('.website').show();
				}

				$(newSlide).data('shortlist-id', atts.shortlist_id);

				var borderColor = app.data.getStory()[themeIndex].color;
				$('#detailView0').find('.detailHeader').css('border-top-color', borderColor);

				_this.resize();

				$('#mobilePaneList').hide();
				setTimeout(function(){
					$(currentDetailContainer).show();
					$(currentDetailContainer).css('z-index', 99);
				}, 0);

			};

			this.buildSlides = function(themes)
			{
				_slidesRefreshing = true;
				_this.loaded = false;
				_themes = themes;
				var themeIndex = $('.entry.active').index();
				if(themeIndex<0)
					themeIndex = 0;
				var currentTheme = _themes[themeIndex];
				var features = currentTheme.features;

				if(features[0] && features[0].attributes ){
					var numberField = features[0].attributes[$.grep(Object.keys(features[0].attributes), function(n) {return n.toLowerCase() == 'number';})[0]];
					if(numberField){
						features.sort(function(a,b){
							var aNum = a.attributes[$.grep(Object.keys(a.attributes), function(n) {return n.toLowerCase() == 'number';})[0]];
							var bNum = b.attributes[$.grep(Object.keys(b.attributes), function(n) {return n.toLowerCase() == 'number';})[0]];
							return parseInt(aNum) - parseInt(bNum);
						});
					}
				}

				for(; _i < features.length; _i++){

					var currentDetailContainer = $('.detailContainer')[themeIndex];
					container.find('#detailView' + themeIndex).append(detailSlide());
					var newSlide = $(currentDetailContainer).find('.swiper-slide')[_i];

					// Allow highlighting of text in detail panel with mouse click
					$(newSlide).on('mousedown', function(){
						$(this).addClass('swiper-no-swiping');
					});

					if(navigator.userAgent.match(/Trident.*rv\:11\./) && navigator.userAgent.match(/Trident.*rv\:11\./).length){
						$(newSlide).on('pointerdown', function(){
							$(this).addClass('swiper-no-swiping');
						});
					}

					$(newSlide).on('mouseup', function(){
						$(this).removeClass('swiper-no-swiping');
					});

					var atts = features[_i].attributes;

					var name = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'name';})[0]];

					var description = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'description';})[0]];
					var shortDesc = '';

					if(app.data.getWebAppData().getIsExternalData()){
						shortDesc = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'short_desc';})[0]];
						var desc1 = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'desc1';})[0]];
						var desc2 = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'desc2';})[0]];
						var desc3 = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'desc3';})[0]];
						var desc4 = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'desc4';})[0]];
						var desc5 = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'desc5';})[0]];

						if(desc1){
							if(description)
								description += "<p>" + desc1 + "</p>";
							else {
								description = "<p>" + desc1 + "</p>";
							}
						}
						if(desc2){
							if(description)
								description += "<p>" + desc2 + "</p>";
							else {
								description = "<p>" + desc2 + "</p>";
							}
						}
						if(desc3)
							if(description)
								description += "<p>" + desc3 + "</p>";
							else {
								description = "<p>" + desc3 + "</p>";
							}
						if(desc4)
							if(description)
								description += "<p>" + desc4 + "</p>";
							else {
								description = "<p>" + desc4 + "</p>";
							}
						if(desc5)
							if(description)
								description += "<p>" + desc5 + "</p>";
							else {
								description = "<p>" + desc5 + "</p>";
							}
					}
					var picture = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'pic_url';})[0]];
					var thumbnail = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'thumb_url';})[0]];
					var website = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'website';})[0]];
					_helper.prependURLHTTP(website);

					if(app.data.getWebAppData().getGeneralOptions().numberedIcons){
						$(newSlide).find('.detailFeatureNum').css('background-color', app.data.getStory()[themeIndex].color);
						$(newSlide).find('.detailFeatureNum').text(atts.PLACENUMSL ? atts.PLACENUMSL : atts.number);
					} else{
						$(newSlide).find('.detailFeatureNum').hide();
						$(newSlide).find('.detailFeatureTitle').addClass('notNumbered');
					}

					if(name){
						$(newSlide).find('.detailFeatureTitle').html(name);
					}

					if(picture){
						var image = $(newSlide).find('img')[0];
						image.onload = function(){
							$(this).parent().find('.imageLoadingIndicator').css('display', 'none');
						};
						if(picture.indexOf("sharing/rest/content/items/") > -1){
							if(picture.indexOf('http') > -1 && picture.indexOf('https') == 5){
								picture = picture.slice(5);
							}
							var multiHttps = (picture.match(/https/g)) || [].length

							if(multiHttps.length > 1){
								picture = picture.slice(6);
							}
						}
						if(_android){
							picture = thumbnail ? thumbnail : picture;
							if(picture.indexOf("sharing/rest/content/items/") > -1)
								picture = CommonHelper.possiblyAddToken(picture);
							$(newSlide).find('img').attr('src', picture);
						}
						else{
							if(picture.indexOf("sharing/rest/content/items/") > -1)
								picture = CommonHelper.possiblyAddToken(picture);
							$(newSlide).find('img').attr('src', picture);
						}
						if(image.complete)
							$(newSlide).find('.imageLoadingIndicator').hide();
					}else{
						$(newSlide).find('.imageLoadingIndicator').css('display', 'none');
					}

					if(shortDesc){
						$(newSlide).find('.shortDesc').html(shortDesc);
					}else{
						$(newSlide).find('.shortDesc').remove();
					}

					if (description) {
						$(newSlide).find('.description').html(description);
					}

					if (website) {
						$(newSlide).find('.website').append('<a href='+ website + ' target="_blank" >More info</a>');
						$('.website').show();
						if(app.data.getWebAppData().getIsExternalData())
							$('.website').css('margin-top', 0);
					}

					$(newSlide).data('shortlist-id', atts.shortlist_id);

					$(newSlide).find(".detailPictureDiv img").click(function(){
						var themeIndex = $('.entry.active').index();
						if(themeIndex<0)
							themeIndex = 0;
						if(!_mainView.selected){
							var nextSlideId = _swipers[themeIndex].activeIndex + 1;
							if(_swipers[themeIndex].activeIndex === _swipers[themeIndex].slides.length - 1){
								nextSlideId = 0;
							}
							var nextSlide = _swipers[themeIndex].slides[nextSlideId];
							var slideShortlistID = $(nextSlide).data('shortlist-id')
							var shortlistLayer = app.map.getLayer(app.data.getWebAppData().getShortlistLayerId());
							app.ui.mainView.selected = $.grep(shortlistLayer.graphics,function(n){return n.attributes.shortlist_id == slideShortlistID;})[0];
						}
						_mainView.selected.updated = false;
						if(_swipers[themeIndex].activeIndex == _swipers[themeIndex].slides.length - 1){
							if(isEdge || isWin10)
								$('.swiper-slide-active .detailTextContainer').css({'overflow-y': 'visible'});
							_swipers[themeIndex].slideTo(0, 0);
							if(isEdge || isWin10)
								$('.swiper-slide-active .detailTextContainer').css({'overflow-y': 'auto'});
						}
						else {
							if(isEdge || isWin10)
								$('.swiper-slide-active .detailTextContainer').css({'overflow-y': 'visible'});
							_swipers[themeIndex].slideNext();
							if(isEdge || isWin10)
								$('.swiper-slide-active .detailTextContainer').css({'overflow-y': 'auto'});
						}
					});

					_swiperSlides[String(themeIndex)].push(newSlide);

					if(_i%10===0 && _i+1 < features.length){
						setTimeout(function(){
							_i++;
							_this.buildSlides(themes);
						}, 0);
						return false;
					}


					if((_i+1) == features.length){
						//_swiperSlides[themeIndex] = (slideStorage);
						var newSwiper = new Swiper($('.detailContainer')[themeIndex], {
							speed: 0,
							setWrapperSize: true
						});

						_swipers[themeIndex] = newSwiper;

						newSwiper.init();
						newSwiper.update();

						newSwiper.on('onSlideChangeEnd', function(swiper){
							if(!_slidesRefreshing)
								_mainView.preSelection();
							else{
								return;
							}

							if(_mainView.selected.updated){
								if(_mainView.selected && !app.map.extent.contains(_mainView.selected.geometry) && !app.data.getWebAppData().getGeneralOptions().filterByExtent /*|| app.isInBuilder*/){
									app.map.centerAt(_mainView.selected.geometry);
								}
								return;
							}

							var themeIndex = $('.entry.active').index();
							if(themeIndex<0)
								themeIndex = 0;

							if(_this.viewed && !_mainView.selected.updated){
								var dv = newSwiper.slides[newSwiper.activeIndex];
								var id = $(dv).data('shortlist-id');
								var id2 = $.grep(app.layerCurrent.graphics,function(n){return n.attributes.shortlist_id == id;})[0];

								_mainView.selected = id2;

								if(_mainView.selected && !app.map.extent.contains(_mainView.selected.geometry) && !app.data.getWebAppData().getGeneralOptions().filterByExtent /*|| app.isInBuilder*/){
									app.map.centerAt(_mainView.selected.geometry);
								}
							}

							setTimeout(function(){
								_mainView.buildMapTips();
							}, 0);

							if($('.showOnce').length){
								var selectedFeatureNotInExtent = $('.showOnce')[0];
								if(!$(selectedFeatureNotInExtent).hasClass('swiper-slide-active')){
									$('.swiper-slide').removeClass('showOnce');
									_swipers[themeIndex].removeSlide(_swipers[themeIndex].previousIndex);
									_swipers[themeIndex].update();
								}
							}

							if(_swipers[themeIndex].slides.length ==1){
								$('.detail-btn-container').hide();
							} else {
								$('.detail-btn-container').show();
							}


							_this.resize();
							newSwiper.update();
							$('.esriPopup').hide();
						});

						container.find(".detail-btn-left").mouseover(function(){
							$('.detail-btn-left').css('opacity', 1);
							$('.detail-btn-right').css('opacity', 0.8);
						});

						container.find(".detail-btn-right").mouseover(function(){
							$('.detail-btn-right').css('opacity', 1);
							$('.detail-btn-left').css('opacity', 0.8);
						});

						container.find(".detail-btn-left").mouseout(function(){
							$('.detail-btn-left').css('opacity', 0.8);
						});

						container.find(".detail-btn-right").mouseout(function(){
							$('.detail-btn-right').css('opacity', 0.8);
						});

						container.find(".detailClose").click(function(){
							container.find(".detailContainer").hide();
							if(app.ui.mobileIntro.screenSize == 'small')
								app.ui.mobileFeatureList.showMobileList();
							_mainView.unselect();
						});

						var isEdge = navigator.appVersion.indexOf('Edge') > 0 ? true : false;
						var isWin10 = navigator.userAgent.indexOf('Windows NT 10.0') > 0 ? true : false;

						container.find($(".detail-btn-left")[themeIndex]).click(function(){
							if(!_mainView.selected){
								var nextSlideId = _swipers[themeIndex].activeIndex - 1;
								if(_swipers[themeIndex].activeIndex === 0){
									nextSlideId = _swipers[themeIndex].slides.length - 1;
								}
								var nextSlide = _swipers[themeIndex].slides[nextSlideId];
								var slideShortlistID = $(nextSlide).data('shortlist-id')
								var shortlistLayer = app.map.getLayer(app.data.getWebAppData().getShortlistLayerId());
								app.ui.mainView.selected = $.grep(shortlistLayer.graphics,function(n){return n.attributes.shortlist_id == slideShortlistID;})[0];
							}
							_mainView.selected.updated = false;
							if(_swipers[themeIndex].activeIndex === 0){
								//Fix/hack for text of detail panel stacking on slide change in Microsoft Edge
								if(isEdge || isWin10)
									$('.swiper-slide-active .detailTextContainer').css({'overflow-y': 'visible'});
								_swipers[themeIndex].slideTo(_swipers[themeIndex].slides.length - 1, 0);
								if(isEdge || isWin10)
									$('.swiper-slide-active .detailTextContainer').css({'overflow-y': 'auto'});
							}
							else {
								if(isEdge || isWin10)
									$('.swiper-slide-active .detailTextContainer').css({'overflow-y': 'visible'});
								_swipers[themeIndex].slidePrev();
								if(isEdge || isWin10)
									$('.swiper-slide-active .detailTextContainer').css({'overflow-y': 'auto'});
							}
						});

						container.find($(".detail-btn-right")[themeIndex]).click(function(){
							if(!_mainView.selected){
								var nextSlideId = _swipers[themeIndex].activeIndex + 1;
								if(_swipers[themeIndex].activeIndex === _swipers[themeIndex].slides.length - 1){
									nextSlideId = 0;
								}
								var nextSlide = _swipers[themeIndex].slides[nextSlideId];
								var slideShortlistID = $(nextSlide).data('shortlist-id')
								var shortlistLayer = app.map.getLayer(app.data.getWebAppData().getShortlistLayerId());
								app.ui.mainView.selected = $.grep(shortlistLayer.graphics,function(n){return n.attributes.shortlist_id == slideShortlistID;})[0];
							}
							_mainView.selected.updated = false;
							if(_swipers[themeIndex].activeIndex == _swipers[themeIndex].slides.length - 1){
								if(isEdge || isWin10)
									$('.swiper-slide-active .detailTextContainer').css({'overflow-y': 'visible'});
								_swipers[themeIndex].slideTo(0, 0);
								if(isEdge || isWin10)
									$('.swiper-slide-active .detailTextContainer').css({'overflow-y': 'auto'});
							}else {
								if(isEdge || isWin10)
									$('.swiper-slide-active .detailTextContainer').css({'overflow-y': 'visible'});
								_swipers[themeIndex].slideNext();
								if(isEdge || isWin10)
									$('.swiper-slide-active .detailTextContainer').css({'overflow-y': 'auto'});
							}
						});

						var borderColor = app.data.getStory()[themeIndex].color;
						$('#detailView'+themeIndex).find('.detailHeader').css('border-top-color', borderColor);

						//_this.refreshSlides();
						_swipers[themeIndex].update();

						prepSwiperDisplay();
						_this.resize();
					}
				}
				_this.loaded = true;
				_this.viewed = false;
				_slidesRefreshing = false;
			};

			function prepSwiperDisplay()
			{
				var themeIndex = $('.entry.active').index();
				if(themeIndex<0)
					themeIndex = 0;
				//setTimeout(function(){
					//$('.detailContainer').css('z-index', -9999);

					$('.detailContainer').show();
					_swipers[themeIndex].slideNext();
					_swipers[themeIndex].slidePrev();

					_this.resize();
					$('.detailContainer').hide();
				//}, 0);
			}

			this.showDetails = function(selected)
			{
				if(!app.data.getWebAppData().getGeneralOptions().filterByExtent){
					_mainView.selected = selected;
					_mainView.selected.updated = true;
				}
				if(selected == null)
					return;

				_this.resize();

				if(app.data.getWebAppData().getGeneralOptions().filterByExtent)
					prepSwiperDisplay();

				var themeIndex = $('.entry.active').index();
				if(themeIndex<0)
					themeIndex = 0;

				var currentDetailContainer = $('.detailContainer')[themeIndex];
				var currentSwiper = _swipers[themeIndex];
				//$(currentDetailContainer).show();
				$('#mobilePaneList').hide();
				//$('#mobilePaneList').css('visibility', 'hidden');
				var selectedSlideIndex;

				$.each($('#detailView'+themeIndex).find($('.swiper-slide')), function(index, slide){
					if(parseInt($(slide).data('shortlist-id')) == selected.attributes.shortlist_id){
						selectedSlideIndex = index;
						return false;
					}
				});
				if(!_webApplicationData.getGeneralOptions().numberedIcons){
					$('.detailFeatureTitle').addClass('notNumbered');
				}

				var isWin10 = navigator.userAgent.indexOf('Windows NT 10.0') > 0 ? true : false;
				var isEdge = navigator.appVersion.indexOf('Edge') > 0 ? true : false;

				_swipers[themeIndex].on('onSlideChangeEnd', function(){
					$(currentDetailContainer).show();
					$(currentDetailContainer).css('z-index', 99);
				});
				if(selectedSlideIndex === 0 && currentSwiper.activeIndex === 0){
					$(currentDetailContainer).show();
					if(!isEdge && isWin10 && themeIndex == 0){
						_swipers[themeIndex].slideNext();
						_swipers[themeIndex].slidePrev();
					}
					$(currentDetailContainer).hide();
					$(currentDetailContainer).show();
					$(currentDetailContainer).css('z-index', 99);

				}
				else{
					setTimeout(function(){
						_swipers[themeIndex].slideTo(selectedSlideIndex, 0);

						if(selectedSlideIndex === currentSwiper.activeIndex)
							$(currentDetailContainer).show();
					}, 0);
				}

				if(_swipers[themeIndex].slides.length == 1){
					$('.detail-btn-container').hide();
				} else {
					$('.detail-btn-container').show();
				}

				_swipers[themeIndex].update();

				/*setTimeout(function(){
					$(currentDetailContainer).show();
					$(currentDetailContainer).css('z-index', 99);
				}, 0);*/

				// Sometimes image for slide does not load properly
				// Issue #166
				if($('.swiper-slide-active img').width() === 0){
					var slideImg = $('.swiper-slide-active img')[0];
					var imgSrc = $(slideImg).attr('data-src') ? $(slideImg).attr('data-src') : $(slideImg).attr('src');
					if(imgSrc && imgSrc.indexOf("sharing/rest/content/items/") > -1)
						imgSrc = CommonHelper.possiblyAddToken(imgSrc);
					$(slideImg).attr('src', imgSrc);
				}

				_this.resize();

				_this.viewed = true;

			};

			this.refreshSlides = function()
			{
				/*if(app.isInBuilder && app.data.getWebAppData().getIsExternalData())
					return;*/
				_slidesRefreshing = true;

				if(!app.data.getWebAppData().getGeneralOptions().filterByExtent  && !app.isInBuilder){
					_slidesRefreshing = false;
					return;
				}

				var themeIndex = $('.entry.active').index();
				if(themeIndex<0)
					themeIndex = 0;

				if(!_swipers[themeIndex] || !_swipers[themeIndex].init || !_swiperSlides || !_swiperSlides[String(themeIndex)]){
					return;
					var objKeysLength = [];
					$.each(_swiperSlides[String(themeIndex)], function(k){
						objKeysLength = 1;
						return false;
					});
					if(!objKeysLength)
						return;
				}

				$('.detailContainer').css('z-index', '0');

				var currentDetailContainer = $('.detailContainer')[themeIndex];

				$(currentDetailContainer).css('z-index','99');

				if(!_themes){
					_slidesRefreshing = false;
					return;
				}
				var currentTheme = _themes[themeIndex];
				var features = currentTheme.features;

				var selectedSlideIndex = null;

				if(_swipers[themeIndex].slides)
					_swipers[themeIndex].removeAllSlides();

				$.each(features, function(index, feature){
					if(app.map.extent.contains(feature.geometry)){
						$.each(_swiperSlides[String(themeIndex)], function(index, slide){
							if(parseInt($(slide).data('shortlist-id')) == feature.attributes.shortlist_id){
								_swipers[themeIndex].appendSlide($(slide)[0]);
								if(_mainView.selected && parseInt($(slide).data('shortlist-id')) == _mainView.selected.attributes.shortlist_id)
									selectedSlideIndex = parseInt(index);
							}
						});
					}
					if(_mainView.selected && !app.map.extent.contains(_mainView.selected.geometry)){
						$.each(_swiperSlides[String(themeIndex)], function(index, slide){
							if(parseInt($(slide).data('shortlist-id')) == _mainView.selected.attributes.shortlist_id){
								_swipers[themeIndex].appendSlide($(slide)[0]);
								$(slide).addClass('showOnce');
							}
						});
					}

				});

				if(_mainView.selected){
					$.each($('#detailView'+themeIndex).find($('.swiper-slide')), function(index, slide){
						if(parseInt($(slide).data('shortlist-id')) == _mainView.selected.attributes.shortlist_id){
							selectedSlideIndex = parseInt(index);
						}
					});
				}

				_swipers[themeIndex].update();

				if(selectedSlideIndex != null){
					_swipers[themeIndex].slideTo(selectedSlideIndex, 0);
				}

				if(_swipers[themeIndex].slides.length ==1){
					$('.detail-btn-container').hide();
				}
				else {
					$('.detail-btn-container').show();
				}
				_slidesRefreshing = false;
			};

			this.update = function(p)
			{
				p = p || {};

				container.find(".detailContainer").html(p.data);
			};

			this.resize = function()
			{
				setTimeout(function(){
					var offset = 40;
					if(_iOS)
						offset = 80;
					if(app.ui.mobileIntro.screenSize == 'small'){
						$('#paneLeft').css('height', $('#contentPanel').height() - $('#map').height() + 10);
						$('#paneLeft').css('width', '100%');
						$('#paneLeft').css({'top': $('#map').height() - 10});
						offset = 20;
						if(_iOS)
							offset = 80;
					}
					var themeIndex = $('.entry.active').index();
					var currentSlide;
					if(themeIndex<0)
						themeIndex = 0;
					var currentSwiper;
					if(!$.isEmptyObject(_swipers[themeIndex])){
						currentSwiper = _swipers[themeIndex];
						currentSlide = currentSwiper.slides[currentSwiper.activeIndex];
					}
					$(currentSlide).height($('#paneLeft').outerHeight() - 5);
					var titleHeight = $(currentSlide).find('.detailHeader').outerHeight();
					$('.detailTextContainer').height($('#paneLeft').outerHeight() - titleHeight - offset + 'px');
					$('.detailPictureDiv img').css('max-width', $("#paneLeft").outerWidth());
					var imgMaxHeight = ($("#paneLeft").outerHeight() - titleHeight - 60) < ($("#paneLeft").outerHeight() * 0.6) ? $("#paneLeft").outerHeight() - titleHeight - 60 : $("#paneLeft").outerHeight() * 0.6;
					$('.detailPictureDiv img').css('max-height', parseInt(imgMaxHeight)+'px');
					$('.detailContainer').width($("#paneLeft").outerWidth());
					$('.detailContainer').height($("#paneLeft").outerHeight());

					if(currentSwiper){
						if(app.data.getWebAppData().getGeneralOptions().filterByExtent){
							setTimeout(function(){
								_swipers[themeIndex].slideTo(currentSwiper.activeIndex);
								currentSwiper.update();
								_swipers[themeIndex].slideTo(currentSwiper.activeIndex);
							}, 800);
						}
						else{
							_swipers[themeIndex].slideTo(currentSwiper.activeIndex);
							currentSwiper.update();
							_swipers[themeIndex].slideTo(currentSwiper.activeIndex);
						}

					}
				}, 0);
			};

			this.showEntryIndex = function()
			{
				//
			};

			this.destroy = function()
			{
				//
			};

			function initBuilder()
			{
				container.find(".userInput").attr("contenteditable", "true");
			}

			function initEvents()
			{
				if ( isInBuilder ) {
					container.find(".userInput").blur(function(){
						saveData($(this).html());
					});
				}
			}
		};
	}
);
