define([],
	function(){
		// Header default configuration
		var HEADER_LOGO_URL = "resources/tpl/viewer/icons/esri-logo-white.png",
			HEADER_LOGO_TARGET = "http://www.esri.com",
			HEADER_LINK_TEXT = "A story map",
			HEADER_LINK_URL = "http://storymaps.arcgis.com";

		app.appCfg = {
			supportWebmapPreviewAGOL: false,
			webmapStory: true,
			createWebmap: true,
			useWebmapInApp: true,
			useStandardHeader: true,
			useAppTitleAsPageTitle: true,
			headerCompactOpt: true,
			headerCompactByDefault: false,
			mapsImmediateResize: true,
			mapCommandLargerTouch: false,
			mediaPickerDisableVideo: true,
			mediaPickerDisableWebPage: true,
			mediaPickerSkipConfigure: true,
			mediaPickerConfigureForceMode: 'shortlist',
			disableAutoPlay: true,
			noAppTitleInitScreen: true,
			mapExtentFit: false,
			noFastClick: true,
			deleteProtect: true,
			noStoryLengthRequired: true,
			disableImageUpload: true
		};

		return {
			checkConfigFileIsOK: function()
			{
				app.cfg.HEADER_LOGO_URL = HEADER_LOGO_URL;
				app.cfg.HEADER_LOGO_TARGET = HEADER_LOGO_TARGET;
				app.cfg.HEADER_LINK_TEXT = HEADER_LINK_TEXT;
				app.cfg.HEADER_LINK_URL = HEADER_LINK_URL;

				return app.cfg
					&& app.cfg.HEADER_LOGO_URL !== undefined
					&& app.cfg.HEADER_LOGO_TARGET !== undefined
					&& app.cfg.HEADER_LINK_TEXT !== undefined
					&& app.cfg.HEADER_LINK_URL !== undefined
					&& app.cfg.HEADER_SOCIAL

					&& app.cfg.TIMEOUT_VIEWER_LOAD
					&& app.cfg.TIMEOUT_VIEWER_REQUEST
					&& app.cfg.TIMEOUT_BUILDER_REQUEST

					&& app.cfg.HELP_URL
					&& app.cfg.HELP_URL_PORTAL

					&& app.cfg.TPL_NAME
					&& app.cfg.WEBAPP_TAG
					&& app.cfg.WEBAPP_KEYWORD_GENERIC
					&& app.cfg.WEBAPP_KEYWORD_APP

					&& app.cfg.AUTHORIZED_IMPORT_SOURCE
					&& app.cfg.FLICKR_API_KEY

					&& app.cfg.CORS_SERVER
					&& app.cfg.DEFAULT_SHARING_URL
					&& app.cfg.DEFAULT_PROXY_URL;
			}
		};
	}
);
