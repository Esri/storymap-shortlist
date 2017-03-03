define(["dojo/_base/lang"],
	function(lang)
	{
		/**
		 * WebApplicationData
		 * @class WebApplicationData
		 *
		 * R/W of the Web mapping Application data
		 */

		var _originalData = {};
		var _data = {
			values: {
				tabs:[]
			}
		};

		return {
			set: function(data)
			{
				_originalData = lang.clone(data);

				if( ! data || ! data.values )
					return;
				_data = data;
			},
			get: function()
			{
				var data = lang.clone(_data);

				data.values.template = data.values.template || {};
				data.values.template = {
					name: data.values.template.name || app.cfg.TPL_NAME,
					createdWith: data.values.template.createdWith || app.version,
					editedWith: app.version
				};

				return data;
			},
			getOriginalData: function()
			{
				return _originalData;
			},
			isBlank: function()
			{
				return Object.keys(_data.values).length <= 2;
			},
			getBlank: function()
			{
				return {
					values: {
						webmap: _originalData.values.webmap
					}
				};
			},
			// The eventual webmap the template has been created with (Start from a webmap in AGOL Map Viewer)
			getSourceWebmap: function()
			{
				return _originalData && _originalData.values ? _originalData.values.webmap : null;
			},
			cleanWebAppAfterInitialization: function()
			{
				return false;
			},
			restoreOriginalData: function()
			{
				this.set(_originalData);
			},
			updateAfterSave: function()
			{
				_originalData = lang.clone(_data);
			},

			/*
			 * Versioning
			 */

			// Last saved template version
			getTemplateVersion: function()
			{
				return _data.values.template ? _data.values.template.editedWith : null;
			},
			// First saved template version
			getTemplateCreation: function()
			{
				return _data.values.template ? _data.values.template.creaedWith : null;
			},

			/*
			 * Warning when item and story title differ
			 */
			getDoNotWarnTitle: function()
			{
				return _data.values.doNotWarnTitle || false;
			},

			setDoNotWarnTitle: function(value)
			{
				_data.values.doNotWarnTitle = value;
			},

			/*
			* Set data source to external for pass-through/GIS pro
			* workflow.  All data managed outside of builder
			 */

			 getIsExternalData: function()
			 {
				return _data.values.isExternalData;
			},

			setIsExternalData: function(isExternalData)
			{
				_data.values.isExternalData = isExternalData;
			},

			/*
			 * Webmap id
			 */
			getWebmap: function()
			{
				return _data.values.webmap;
			},
			setWebmap: function(webmap)
			{
				_data.values.webmap = webmap;
			},

			/*
			* Webmap item response
			*/

			getResponse: function()
			{
				return _data.values.response;
			},

			setResponse: function(response)
			{
				_data.values.response = response;
			},

			/*
			 * Original webmap id is id of web map that was used to
			 * migrate to current web map (version 1.x shortlist)
			 */
			getOriginalWebmap: function()
			{
				return _data.values.originalWebmap;
			},
			setOriginalWebmap: function(webmap)
			{
				_data.values.originalWebmap = webmap;
			},

			getMapExtent: function()
			{
				return _data.values.mapExtent;
			},
			setMapExtent: function(extent)
			{
				_data.values.mapExtent = extent;
			},

			/*
			 * Header
			 */
			getTitle: function()
			{
				// If it's the first entry - reuse the title as app title
				// TODO shoudn't be done here
				//if ( app.isDirectCreationFirstSave && this.getStoryEntries().length > 0 )
					//this.setTitle($("<div>" + this.getStoryEntries()[0].title + "</div>").text());

				return _data.values.title;
			},
			setTitle: function(title)
			{
				_data.values.title = title;
			},
			getSubtitle: function()
			{
				return _data.values.subtitle;
			},
			setSubtitle: function(subtitle)
			{
				_data.values.subtitle = subtitle;
			},

			/*
			 * Settings
			 */

			getSettings: function()
			{
				return _data.values.settings || {};
			},

			getLayoutId: function()
			{
				return "shortlist-classic";
			},

				/*
			 * organizational geocoders
			 */
			getAppGeocoders: function() {
				return this.getSettings().appGeocoders;
			},
			setAppGeocoders: function(geocoders) {
				_data.values.settings = _data.values.settings || {};
				_data.values.settings.appGeocoders = geocoders;
			},

			/*
			 * Shortlist
			 */

			getLayers: function()
			{
				return _data.values.layers;
			},

			setLayers: function(layer)
			{
				if(!_data.values.layers)
					_data.values.layers = [];
				_data.values.layers.push(layer);
			},

			getShortlistLayerId: function()
			{
				return _data.values.shortlistLayerId;
			},

			setShortlistLayerId: function(shortlistLayerId)
			{
				_data.values.shortlistLayerId = shortlistLayerId;
			},

			getTabs: function()
			{
				return _data.values.tabs;
			},

			setTabs: function(tabs)
			{
				_data.values.tabs = tabs;
			},

			clearTabs: function()
			{
				_data.values.tabs = {};
			},

			clearLayers: function()
			{
				_data.values.layers = [];
			},

			reverseContentLayers : function()
			{
				_data.values.contentLayers.reverse();
			},

			getSupportLayers: function()
			{
				return _data.values.supportLayers;
			},

			setSupportLayers: function(layer)
			{
				if(!_data.values.supportLayers)
					_data.values.supportLayers = [];
				_data.values.supportLayers.push(layer);
			},

			getStoryTestPanel: function()
			{
				return _data.values.testPanel;
			},

			setStoryTestPanel: function(testPanel)
			{
				_data.values.testPanel = testPanel;
			},

			getLocateButton: function()
			{
				return true;
			},

			getGeneralOptions: function()
			{
				var generalOptions = lang.clone(this.getSettings().generalOptions) || {};
				//generalOptions.moreInfoLink = true;
				return generalOptions;
			},
			setGeneralOptions: function(mapOptions)
			{
				_data.values.settings = _data.values.settings || {};
				_data.values.settings.generalOptions = mapOptions;
			},
			setDefaultGeneralOptions: function()
			{
				this.setGeneralOptions({
					extentMode: 'default',
					numberedIcons: false,
					filterByExtent: true,
					bookmarks: false,
					bookmarksAlias: app.cfg.BOOKMARKS_ALIAS,
					geocoder: false,
					locateButton: false
				});
			},

			getLayoutOptions: function()
			{
				var layoutOptions = lang.clone(this.getSettings().layoutOptions) || {};
				return layoutOptions;
			},
			setLayoutOptions: function(layoutOptions)
			{
				_data.values.settings = _data.values.settings || {};
				_data.values.settings.layoutOptions = layoutOptions;
			},
			setDefaultLayoutOptions: function()
			{
				this.setLayoutOptions({
					description: true
				});
			},


			getColors: function()
			{
				return {
					//
				};
			},

			/*
			 * Header
			 */
			 //TODO figure out how to save without author touching header settings
			getHeader: function()
			{
				return this.getSettings().header || {};
			},
			setHeader: function(header)
			{
				_data.values.settings = _data.values.settings || {};
				_data.values.settings.header = header;
			},
			getHeaderLinkText: function()
			{
				return this.getHeader().linkText === undefined ? app.cfg.HEADER_LINK_TEXT : this.getHeader().linkText;
			},
			getHeaderLinkURL: function()
			{
				return this.getHeader().linkURL === undefined ? app.cfg.HEADER_LINK_URL : this.getHeader().linkURL;
			},
			getLogoURL: function(useMobileLogo)
			{
				var logoURL = ! this.getHeader().logoURL ? app.cfg.HEADER_LOGO_URL : this.getHeader().logoURL;

				if ( logoURL == app.cfg.HEADER_LOGO_URL && this.getColors() ) {
					if ( useMobileLogo ) {
						if ( this.getColors().esriLogoMobile == "white" )
							logoURL = "resources/tpl/viewer/icons/esri-logo-white.png";
					}
					else if ( this.getColors().esriLogo == "white" )
						logoURL = "resources/tpl/viewer/icons/esri-logo-white.png";
				}

				return logoURL;
			},
			getLogoTarget: function()
			{
				return ! this.getHeader().logoURL || this.getHeader().logoURL == app.cfg.HEADER_LOGO_URL
					? app.cfg.HEADER_LOGO_TARGET
					: this.getHeader().logoTarget;
			},
			getSocial: function()
			{
				return this.getHeader().social;
			},
			getHeaderCompactSize: function()
			{
				return this.getHeader().compactSize;
			}
		};
	}
);
