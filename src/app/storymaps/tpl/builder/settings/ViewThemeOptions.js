define(["lib-build/tpl!./ViewThemeOptions",
		"lib-build/css!./ViewThemeOptions",
		"lib-build/css!lib-app/spectrum/spectrum",
		"lib-app/spectrum/spectrum"
	],
	function (
		viewTpl,
		spectrumCssOverrides,
		spectrumCss,
		spectrum
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
					headerColor: i18n.builder.settings.headerColor
				}));

			};

			this.present = function(settings)
			{
				if($('#headerColorpicker').spectrum())
					$('#headerColorpicker').spectrum('destroy');
				$('#headerColorpicker').spectrum({
					color: settings.headerColor || '#444',
					showInput: true,
					preferredFormat: "hex",
					showPalette: true,
					palette: ["#444", "000", "07194d", "#541416", "#76401d", "#673d22", "#6a5b24", "#274620", "#314069", "#3e2544"],
					chooseText: i18n.builder.settings.choose,
					cancelText: i18n.builder.detailPanelBuilder.cancel,
				});

				_settings = settings;
			};

			this.show = function()
			{
				//
			};

			this.save = function()
			{
				var headerColor = '#' + $('#headerColorpicker').spectrum('get').toHex();
				updateHeaderColor(headerColor);
				return {
					headerColor: headerColor
				};
			};

			this.initLocalization = function()
			{
				_titleContainer.html(i18n.commonCore.settingsTheme.title);
			};

			function updateHeaderColor(color)
			{
				$('#header').css('background-color', color);
				$('#nav-bar').css('background-color', color);
			}
		};
	}
);
