define(["../../core/Helper",
		"lib-build/tpl!./DetailPanel",
		"lib-build/tpl!./DetailSlide",
		"lib-build/css!./DetailPanel"
	],
	function(Helper, detailPanel, detailSlide){
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

			this.buildFeatureViews = function()
			{
				var themeIndex = $('.entry.active').index();
				if(themeIndex<0)
					themeIndex = 0;

					var themes = [];

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
						else{
							//graphic.hide();
						}
					});


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
								if(app.map.extent.contains(feat.geometry)){
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
							_mainView.selectSymbol();
							_this.buildSlide();
						});

						container.find($(".detail-btn-right")[0]).click(function(){
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

						container.find(".detailPictureDiv img").click(function(){
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
					}else{
						$.each(themes, function(index){
							if(index === 0)
								$(container).prepend(detailPanel({ }));
							else {
								var prevDetPanel = $(container).find(' .detailContainer')[index-1];
								$(prevDetPanel).after(detailPanel({ }));
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

				var name =  atts.name;

				var description = atts.description;
				var picture = atts.pic_url;
				var website = _helper.prependURLHTTP(atts.website);

				if(app.data.getWebAppData().getGeneralOptions().numberedIcons){
					$(newSlide).find('.detailFeatureNum').css('background-color', app.data.getStory()[themeIndex].color);
					$(newSlide).find('.detailFeatureNum').text(atts.number);
				} else{
					$(newSlide).find('.detailFeatureNum').hide();
					$(newSlide).find('.detailFeatureTitle').addClass('notNumbered');
				}

				if(name){
					$(newSlide).find('.detailFeatureTitle').html(name);
				}

				if(picture){
					picture = atts.thumb_url ? atts.thumb_url : atts.pic_url;
					$(newSlide).find('img').attr('src', picture);
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
				}

				if (description) {
					$(newSlide).find('.description').html(description);
				}

				if (website) {
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
				if(features[0] && features[0].attributes && features[0].attributes.number){
					features.sort(function(a,b){
						return parseInt(a.attributes.number) - parseInt(b.attributes.number);
					});
				}

				for(; _i < features.length; _i++){

					var currentDetailContainer = $('.detailContainer')[themeIndex];
					container.find('#detailView' + themeIndex).append(detailSlide());
					var newSlide = $(currentDetailContainer).find('.swiper-slide')[_i];

					// Allow highlighting of text in detail panel with mouse click
					$(newSlide).on('mousedown', function(){
						$(this).addClass('swiper-no-swiping');
					});

					$(newSlide).on('mouseup', function(){
						$(this).removeClass('swiper-no-swiping');
					});

					var atts = features[_i].attributes;

					var name =  atts.name;

					var description = atts.description;
					var picture = atts.pic_url;
					var website = _helper.prependURLHTTP(atts.website);

					if(app.data.getWebAppData().getGeneralOptions().numberedIcons){
						$(newSlide).find('.detailFeatureNum').css('background-color', app.data.getStory()[themeIndex].color);
						$(newSlide).find('.detailFeatureNum').text(atts.number);
					} else{
						$(newSlide).find('.detailFeatureNum').hide();
						$(newSlide).find('.detailFeatureTitle').addClass('notNumbered');
					}

					if(name){
						$(newSlide).find('.detailFeatureTitle').html(name);
					}

					if(picture){
						if(_android){
							picture = atts.thumb_url ? atts.thumb_url : atts.pic_url;
							$(newSlide).find('img').attr('src', picture);
						}
						else{
							$(newSlide).find('img').attr('src', picture);
						}
					}

					if (description) {
						$(newSlide).find('.description').html(description);
					}

					if (website) {
						$(newSlide).find('.website').append('<a href='+ website + ' target="_blank" >More info</a>');
						$('.website').show();
					}

					$(newSlide).data('shortlist-id', atts.shortlist_id);

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

							var themeIndex = $('.entry.active').index();
							if(themeIndex<0)
								themeIndex = 0;

							if(_this.viewed){
								var dv = newSwiper.slides[newSwiper.activeIndex];
								var id = $(dv).data('shortlist-id');
								var id2 = $.grep(app.layerCurrent.graphics,function(n){return n.attributes.shortlist_id == id;})[0];

								_mainView.selected = id2;

								if(_mainView.selected && !app.map.extent.contains(_mainView.selected.geometry) && !app.data.getWebAppData().getGeneralOptions().filterByExtent || app.isInBuilder){
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

						container.find($(".detail-btn-left")[themeIndex]).click(function(){
							if(_swipers[themeIndex].activeIndex === 0)
								_swipers[themeIndex].slideTo(_swipers[themeIndex].slides.length - 1, 0);
							else {
								_swipers[themeIndex].slidePrev();
							}
						});

						container.find($(".detail-btn-right")[themeIndex]).click(function(){
							if(_swipers[themeIndex].activeIndex == _swipers[themeIndex].slides.length - 1)
								_swipers[themeIndex].slideTo(0, 0);
							else {
								_swipers[themeIndex].slideNext();
							}
						});

						var borderColor = app.data.getStory()[themeIndex].color
						$('#detailView'+themeIndex).find('.detailHeader').css('border-top-color', borderColor);

						container.find(".detailPictureDiv img").click(function(){
							if(_swipers[themeIndex].activeIndex == _swipers[themeIndex].slides.length - 1)
								_swipers[themeIndex].slideTo(0, 0);
							else {
								_swipers[themeIndex].slideNext();
							}
						});

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
				_this.resize();
				if(selected == null)
					return;

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
					}
				});
				if(!_webApplicationData.getGeneralOptions().numberedIcons){
					$('.detailFeatureTitle').addClass('notNumbered');
				}

				_swipers[themeIndex].on('onSlideChangeEnd', function(){
					$(currentDetailContainer).show();
					$(currentDetailContainer).css('z-index', 99);
				});
				if(selectedSlideIndex === 0 && currentSwiper.activeIndex === 0){
					$(currentDetailContainer).show();
					$(currentDetailContainer).css('z-index', 99);
				}
				else{
					setTimeout(function(){
						_swipers[themeIndex].slideTo(selectedSlideIndex, 0);
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
					var imgSrc = $(slideImg).attr('data-src');
					$(slideImg).attr('src', imgSrc);
				}

				_this.viewed = true;
			};

			this.refreshSlides = function()
			{
				_slidesRefreshing = true;
				if(!app.data.getWebAppData().getGeneralOptions().filterByExtent  && !app.isInBuilder){
					_slidesRefreshing = false;
					return;
				}

				var themeIndex = $('.entry.active').index();
				if(themeIndex<0)
					themeIndex = 0;
				if(!_swipers[themeIndex] || !_swipers[themeIndex].init || !_swiperSlides || !_swiperSlides[String(themeIndex)] || !Object.keys(_swiperSlides[String(themeIndex)].length))
					return;

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
					if(app.ui.mobileIntro.screenSize == 'small'){
						$('#paneLeft').css('height', $('#contentPanel').height() - $('#map').height() + 10);
						$('#paneLeft').css('width', '100%');
						$('#paneLeft').css({'top': $('#map').height() - 10});
						offset = 20;
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
						setTimeout(function(){
							_swipers[themeIndex].slideTo(currentSwiper.activeIndex);
							currentSwiper.update();
							_swipers[themeIndex].slideTo(currentSwiper.activeIndex);
						}, 800);
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
