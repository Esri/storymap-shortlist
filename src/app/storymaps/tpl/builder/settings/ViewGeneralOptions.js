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
					numberedPlaces: i18n.builder.settings.numberedPlaces,
					extentSensitive: i18n.builder.settings.extentSensitive,
					extentSensitiveTooltip: i18n.builder.settings.extentSensitiveTooltip
				}));

				_contentContainer.find('.extentSensitiveTooltip').tooltip({
					trigger: 'hover'
				});
			};

			this.present = function(settings)
			{
				_contentContainer.find(".opt-checkbox-numbered-icons").prop("checked", settings.numberedIcons);
				_contentContainer.find(".opt-checkbox-filter-by-extent").prop("checked", settings.filterByExtent);

				_settings = settings;
			};

			this.show = function()
			{
				//
			};

			this.save = function()
			{
				return {
					numberedIcons: _contentContainer.find(".opt-checkbox-numbered-icons").prop("checked"),
					filterByExtent: _contentContainer.find(".opt-checkbox-filter-by-extent").prop("checked"),
				};
			};

			this.initLocalization = function()
			{
				//_titleContainer.html(i18n.builder.settingsMapOptions.title);
				_titleContainer.html('General options');
			};
		};
	}
);
