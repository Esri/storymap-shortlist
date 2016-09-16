define([
		"lib-build/tpl!./MobileIntro",
		"lib-build/css!./MobileIntro",
		"dojo/on"
	],
	function(mobileIntro){
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
					$('#mobileIntro').append('<div class="mobileSnippet"></div>');
					if(subtitle)
						$('.mobileSnippet').html(subtitle);

				initEvents();
			};

			this.fillList = function(index, theme, themes)
			{
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

				// if only one layer
				/*$('#mobileIntro').append("<br><hr></hr>");
				$('#mobileIntro').append('<ul id="mobileThemeList" class="mobileTileList">');
				var introList = $('<li class="mobileTitleTheme" onclick="selectMobileTheme(' + 0 + ')">').append('<div class="startButton"> Start </div>');
				$('#mobileThemeList').append(introList);*/
			};

			this.resizeMobileElements = function()
			{
				if(_this.screenSize == 'desktop' && !_mainView.selected){
					app.ui.mobileFeatureList.showMobileList();
				}
				var mapHeight = $(window).height() * 0.48 - 20;
				$('#map').css('height', mapHeight);
				$('#map').css({'top': 0});
				$('#mainStagePanel').css({'left': 0});
				$('#mainStagePanel').css('width', '100%');
				$('#map').css('width', '100%');
				$('#mainStagePanel').height($('#map').height());
				// Necessary as css calc() method does not work in older android
				$('#paneLeft').css('height', '52%').css('height', '+=20px');
				$('#paneLeft').css('top', '52%').css('top', '-=20px');
				$('#mobileThemeBar').css('top', '48%').css('top', $('#mobileThemeBar').position().top -20 +'px');
				var themes = $('.mobileThemeTitle').length;
				$('#mobileThemeBarSlider').width($(window).width() * themes);
				$('#returnHiddenBar').css('width', '100%').css('width', '-=80px');
				$('#mobilePaneList').css('height', '52%').css('height', '-=20px');
				$('.mobileTileList.blurb').css('width', '100%').css('width', '-=125px');

				_this.screenSize = 'small';
				setTimeout(function(){
					//app.ui.detailPanel.resize();
				}, 0);

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
			};

			/*


			// if bookmarks, load and show
			$("#mobileBookmarksCon").show();*/

			// part of load bookmarks
			/*$("#mobileBookmarksDiv a").click(function(e) {
				var name = $(this).html();
				var extent = new esri.geometry.Extent($.grep(_bookmarks,function(n,i){return n.name == name;})[0].extent);
				app.map.setExtent(extent);
				$("#mobileBookmarksTogText").html(BOOKMARKS_ALIAS+' &#x25BC;');
				$("#mobileBookmarksDiv").slideToggle();
			});

			// hide BOOKMARKS
			if ($("#mobileBookmarksDiv").css('display') === 'block') {
				$("#mobileBookmarksDiv").slideToggle();
				$("#mobileBookmarksTogText").html(BOOKMARKS_ALIAS + ' &#x25BC;');
			}*/

/*
			// handleWindowResize()
			if(!_firstLoad && _layout == 'normal')
				$('#mobileIntro').css('display', 'none');
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
			}*/
		};
	}
);
