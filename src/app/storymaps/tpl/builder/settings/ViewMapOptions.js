define(["lib-build/tpl!./ViewMapOptions",
		"lib-build/css!./ViewMapOptions"
	],
	function (
		viewTpl
	){
		return function ViewMapOptions()
		{
			var _titleContainer = null,
				_contentContainer = null,
				_settings = null;

			this.init = function(titleContainer, contentContainer)
			{
				_titleContainer = titleContainer;
				_contentContainer = contentContainer;

				_contentContainer.append(viewTpl({
					defaultMapLocation: i18n.builder.settings.defaultMapLocation,
					auto: i18n.builder.settings.auto,
					autoTooltip: i18n.builder.settings.autoTooltip,
					custom: i18n.builder.settings.custom,
					customTooltip: i18n.builder.settings.customTooltip,
					mapLocationTooltip: i18n.builder.settings.mapLocationTooltip,
					locateButton: i18n.builder.settings.locateButton,
					locateButtonTooltip: i18n.builder.settings.locateButtonTooltip,
					geocoder: i18n.builder.settings.geocoder,
					geocoderTooltip: i18n.commonWebmap.selector.tooltipGeocoder,
					bookmarks: i18n.builder.settings.bookmarks,
					bookmarksMenuName: i18n.builder.settings.bookmarksMenuName,
					bookmarksHelp: i18n.builder.settings.bookmarksHelp
				}));

				_contentContainer.find('.extentModeTooltip').tooltip({
					trigger: 'hover'
				});
				_contentContainer.find('.defaultExtent').tooltip({
					trigger: 'hover'
				});
				_contentContainer.find('.customHomeExtent').tooltip({
					trigger: 'hover'
				});
				_contentContainer.find('.locateButtonTooltip').tooltip({
					trigger: 'hover'
				});
				_contentContainer.find('.searchWidgetTooltip').tooltip({
					trigger: 'hover'
				});
				_contentContainer.find('.bookmarkTooltip').tooltip({
					trigger: 'hover'
				});

				_contentContainer.find('.help').tooltip({
					trigger: 'hover'
				});

				initEvents();
			};

			this.present = function(settings)
			{
				if(settings.extentMode == "default"){
					$('.tab-cfg-extent-mode .btn[data-value="default"]').addClass('btn-primary');
					$('.tab-cfg-extent-mode .btn[data-value="customHome"]').removeClass('btn-primary');
					$('.tab-cfg-extent-mode .btn[data-value="customTheme"]').removeClass('btn-primary');
				}
				if(settings.extentMode == "customHome"){
					$('.tab-cfg-extent-mode .btn[data-value="customHome"]').addClass('btn-primary');
					$('.tab-cfg-extent-mode .btn[data-value="default"]').removeClass('btn-primary');
					$('.tab-cfg-extent-mode .btn[data-value="customTheme"]').removeClass('btn-primary');
				}

				var bookmarks = app.data.getResponse() ? app.data.getResponse().itemInfo.itemData.bookmarks : app.maps[app.data.getWebAppData().getWebmap()].response.itemInfo.itemData.bookmarks;
				if(bookmarks && bookmarks.length){
					_contentContainer.find('.bookmarkTooltip').tooltip({
						trigger: 'hover'
					});
				} else{
					_contentContainer.find('.bookmarksContainer').children().addClass('disabled');
					_contentContainer.find('.bookmarksContainer').children().prop('disabled', true);
					_contentContainer.find('.bookmarksContainer').children().click(false);
					_contentContainer.find('.opt-bookmarks-alias-cont input').prop('disabled', true);
					_contentContainer.find('.bookmarkTooltip').tooltip({
						trigger: 'hover'
					});
				}
				_contentContainer.find(".opt-checkbox-bookmarks").prop("checked", settings.bookmarks);
				_contentContainer.find(".opt-bookmarks-alias").val(settings.bookmarksAlias);
				_contentContainer.find(".opt-checkbox-locateBtn").prop("checked", settings.locateButton);
				_contentContainer.find(".opt-checkbox-place-finder").prop("checked", settings.geocoder);

				_settings = settings;
			};

			this.show = function()
			{
				//
			};

			this.save = function()
			{
				if(app.data.getWebAppData().getIsExternalData()){
					return {
						extentMode: 'customHome',
						locateButton: _contentContainer.find(".opt-checkbox-locateBtn").prop("checked"),
						geocoder: _contentContainer.find(".opt-checkbox-place-finder").prop("checked"),
						bookmarks: _contentContainer.find(".opt-checkbox-bookmarks").prop("checked"),
						bookmarksAlias: _contentContainer.find(".opt-bookmarks-alias").val()
					};
				}else{
					return {
						extentMode: _contentContainer.find(".tab-cfg-extent-mode .btn-primary").data().value,
						locateButton: _contentContainer.find(".opt-checkbox-locateBtn").prop("checked"),
						geocoder: _contentContainer.find(".opt-checkbox-place-finder").prop("checked"),
						bookmarks: _contentContainer.find(".opt-checkbox-bookmarks").prop("checked"),
						bookmarksAlias: _contentContainer.find(".opt-bookmarks-alias").val()
					};
				}
			};

			var initEvents = function()
			{
				$('.tab-cfg-extent-mode .btn[data-value="default"]').click(function(){
					$('.tab-cfg-extent-mode .btn[data-value="default"]').addClass('btn-primary');
					$('.tab-cfg-extent-mode .btn[data-value="customHome"]').removeClass('btn-primary');
					$('.tab-cfg-extent-mode .btn[data-value="customTheme"]').removeClass('btn-primary');
				});
				$('.tab-cfg-extent-mode .btn[data-value="customHome"]').click(function(){
					$('.tab-cfg-extent-mode .btn[data-value="customHome"]').addClass('btn-primary');
					$('.tab-cfg-extent-mode .btn[data-value="default"]').removeClass('btn-primary');
					$('.tab-cfg-extent-mode .btn[data-value="customTheme"]').removeClass('btn-primary');
				});

			};

			this.initLocalization = function()
			{
				//_titleContainer.html(i18n.builder.settingsMapOptions.title);
				_titleContainer.html('Map options');
			};
		};
	}
);
