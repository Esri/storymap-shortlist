define(["lib-build/tpl!./ViewGeneralOptions",
		"lib-build/css!./ViewGeneralOptions"
	],
	function (
		viewTpl
	){
		return function ViewGeneralOptions()
		{
			var _titleContainer = null,
				_contentContainer = null,
				_settings = null;

			this.init = function(titleContainer, contentContainer)
			{
				_titleContainer = titleContainer;
				_contentContainer = contentContainer;

				_contentContainer.append(viewTpl({
					/*hello: i18n.builder.settingsMapOptions.hello,
					lblOverview: i18n.builder.settingsMapOptions.lblOverview,
					tooltipOverview: i18n.builder.settingsMapOptions.tooltipOverview,
					lblLocate: i18n.builder.settingsMapOptions.lblLocate,
					tooltipLocate: i18n.builder.settingsMapOptions.tooltipLocate,
					lblGeocoder: i18n.builder.settingsMapOptions.lblGeocoder,
					tooltipGeocoder: i18n.builder.settingsMapOptions.tooltipGeocoder,
					lblSync: i18n.builder.settingsMapOptions.lblSync,
					tooltipSync: i18n.builder.settingsMapOptions.tooltipSync*/
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
				_contentContainer.find('.bookmarkTooltip').tooltip({
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
				_contentContainer.find(".opt-checkbox-numbered-icons").prop("checked", settings.numberedIcons);
				_contentContainer.find(".opt-checkbox-filter-by-extent").prop("checked", settings.filterByExtent);
				_contentContainer.find(".opt-checkbox-bookmarks").prop("checked", settings.bookmarks);
				_contentContainer.find(".opt-bookmarks-alias").val(settings.bookmarksAlias);

				_settings = settings;
			};

			this.show = function()
			{
				//
			};

			this.save = function()
			{
				return {
					extentMode: _contentContainer.find(".tab-cfg-extent-mode .btn-primary").data().value,
					numberedIcons: _contentContainer.find(".opt-checkbox-numbered-icons").prop("checked"),
					filterByExtent: _contentContainer.find(".opt-checkbox-filter-by-extent").prop("checked"),
					bookmarks: _contentContainer.find(".opt-checkbox-bookmarks").prop("checked"),
					bookmarksAlias: _contentContainer.find(".opt-bookmarks-alias").val()

				};
			};

			this.initLocalization = function()
			{
				//_titleContainer.html(i18n.builder.settingsMapOptions.title);
				_titleContainer.html('General options');
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
		};
	}
);
