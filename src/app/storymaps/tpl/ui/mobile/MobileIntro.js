define([
		"esri/geometry/Extent",
		"lib-build/tpl!./MobileIntro",
		"lib-build/css!./MobileIntro",
		"dojo/on"
	],
	function(Extent, mobileIntro, on){
		return function MobileIntro(container, isInBuilder, saveData, mainView)
		{
			var _mainView = mainView;
			var _this = this;

			this.screenSize = 'desktop';

			this.init = function()
			{
				$(container).prepend(mobileIntro({ }));

			};

			this.hide = function()
			{
				$('#mobileIntro').hide();
			};

			this.setTitle = function()
			{
				var title = app.data.getWebAppData().getTitle(),
					subtitle = app.data.getWebAppData().getSubtitle();

				// When header is set.  can use app.data.getWebAppData().getResponse()
				$('#mobileIntro').append('<div class="mobileTitle">' + title + "</div>");
				if(app.data.getWebAppData().getSettings().header && !app.data.getWebAppData().getSettings().header.compactSize){
					$('#mobileIntro').append('<div class="mobileSnippet"></div>');
					if(subtitle)
						$('.mobileSnippet').html(subtitle);
				}
				else if(subtitle && !app.data.getWebAppData().getSettings().header){
					$('#mobileIntro').append('<div class="mobileSnippet"></div>');
					if(subtitle)
						$('.mobileSnippet').html(subtitle);
				}

				initEvents();
			};

			this.fillList = function(index, theme, themes)
			{
				// if only one layer
				if(themes.length == 1){
					if($('#mobileThemeList .mobileTitleTheme')[index])
						return;
					$('#mobileIntro').append("<br><hr></hr>");
					$('#mobileIntro').append('<ul id="mobileThemeList" class="mobileTileList">');
					var introList = $('<li class="mobileTitleTheme">').append('<div class="startButton">' + i18n.viewer.general.start + '</div>');
					introList.on('click', function(){
						_this.selectMobileTheme(0);
					});
					$('#mobileThemeList').append(introList);
				}else{
					if($('#mobileThemeList .mobileTitleThemes')[index])
						return;
					// initMap, after contentLayers are set if more than one tab layer
					if(index === 0)
						$('#mobileIntro').append('<ul id="mobileThemeList" style=" height: 80px; line-height: 80px;" class="mobileTileList introList">');

					var introList = $('<li class="mobileTitleThemes">').append('<span style="width: 100%;margin-left: 30px; margin-right: 30px; vertical-align: middle; line-height: 20px; display: inline-block;">' + theme.title + '</span>');
					introList.on('click', function(){
						_this.selectMobileTheme(index);
					});
					if(index === 0)
						$(introList).css('border-width', '2px 0px 1px 0px');
					if(index == (themes.length - 1))
						$(introList).css('border-width', '1px 0px 2px 0px');
					$('#mobileThemeList').append(introList);
				}
			};

			this.resizeMobileElements = function()
			{
				if(_this.screenSize == 'desktop' && !_mainView.selected){
					app.ui.mobileFeatureList.showMobileList();
				}
				setTimeout(function(){
					app.ui.detailPanel.resize();
				}, 50);
				$("#contentPanel").height($("body").height());
				var mapHeight = $(window).height() * 0.48 - 20;
				$("#mobileIntro").height($("body").height() - (app.embedBar && app.embedBar.initiated ? 26 : 0));
				$('#map').css('height', mapHeight);
				$('#map').css({'top': 0});
				$('#mainStagePanel').css({'left': 0});
				$('#mainStagePanel').css('width', '100%');
				$('#map').css('width', '100%');
				$('#mainStagePanel').height($('#map').height());
				// Necessary as css calc() method does not work in older android
				$('#paneLeft').css('height', '52%').css('height', '+=20px');
				var newTop = $('#paneLeft').css('top') * 0.52;
				newTop -= 20;
				$('#paneLeft').css('top', newTop);
				app.embedBar && app.embedBar.initiated ? $('#mobilePaneList').css('bottom', "26px") : null;
				$('#mobileThemeBar').css('top', '48%').css('top', $('#mobileThemeBar').position().top -20 +'px');
				var themes = $('.mobileThemeTitle').length;
				$('#mobileThemeBarSlider').width($(window).width() * themes);
				$('#returnHiddenBar').css('width', '100%').css('width', '-=80px');
				var mobileListHeight = $("body").height() * 0.52 - (app.embedBar && app.embedBar.initiated ? 41 : 20);
				$('#mobilePaneList').css('height', '52%').css('height', mobileListHeight);
				$('.mobileTileList.blurb').css('width', '100%').css('width', '-=125px');
				setTimeout(function(){
					app.ui.detailPanel.resize();
				}, 50);

				_this.screenSize = 'small';
			};

			function initEvents()
			{
				app.map.on('click', function(){
					$('#mobileIntro').css('display', 'none');
				});

				// on tile click
				//$('#mobileIntro').css('display', 'none');
			}

			// select theme from intro screen
			this.selectMobileTheme = function(index){
				if(index !== 0)
					_mainView.activateLayer(index);
				$('#contentPanel').css('display', 'block');
				$('#mobileIntro').css('display', 'none');
				$(window).resize();
				//$('#mobilePaneList').css('display', 'block');
				app.ui.mobileFeatureList.selectTheme(index);
				_mainView.themeSelected = true;
				var mapExtent = new Extent(app.data.getWebAppData().getMapExtent());
				if ( app.map.spatialReference.wkid != 102100 && app.map.spatialReference.wkid != 4326 ){
					mapExtent = esriConfig.defaults.geometryService.project([mapExtent], app.map.spatialReference, function(geom){
						mapExtent = geom[0];
						app.map.setExtent(mapExtent, true);
					});
				}else{
					app.map.setExtent(mapExtent, true);
				}
			};

		};
	}
);
