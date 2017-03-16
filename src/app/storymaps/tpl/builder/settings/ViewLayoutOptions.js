define(["lib-build/tpl!./ViewLayoutOptions",
		"lib-build/css!./ViewLayoutOptions"
	],
	function (
		viewTpl
	){
		return function ViewLayoutOptions() 
		{			
			var _titleContainer = null,
				_contentContainer = null;
			
			this.init = function(titleContainer, contentContainer)
			{
				_titleContainer = titleContainer;
				_contentContainer = contentContainer;
				
				_contentContainer.append(viewTpl({
					// Description
					lblDescription: i18n.builder.settingsLayoutOptions.lblDescription
				}));
				
				initEvents();
			};
			
			this.present = function(settings) 
			{	
				settings = settings || {};
				
				_contentContainer.find('.opt-checkbox-description').prop('checked', settings.description === true);
				
				updateUI();
			};
			
			this.show = function()
			{
				//
			};
			
			this.save = function()
			{			
				var data = {};
				
				data.description = _contentContainer.find('.opt-checkbox-description').prop('checked');
				
				return data;
			};
			
			function updateUI()
			{
				//
			}
			
			function initEvents()
			{
				
			}
			
			this.initLocalization = function()
			{
				_titleContainer.html(i18n.builder.settingsLayoutOptions.title);
			};
		};
	}
);