define(["./WebApplicationData",
		"storymaps/common/utils/CommonHelper"
	],
	function(
		WebApplicationData,
		CommonHelper
	){
		return function Data()
		{
			// Web map item and item data
			var _webmapItem = null;
			// Web app item
			var _appItem = null;
			// Web map response
			var _response = null;
			// Shortlist Operational Layer Id
			var _shortlistLayerId = null;
			// Story data/places by theme/tab
			var _tabs = {};
			// App proxies
			var _appProxies = null;

			/*
			 * Template common get/set
			 */

			this.getWebMap = function()
			{
				return _webmapItem;
			};

			this.setWebMap = function(webmapItem)
			{
				_webmapItem = webmapItem;
			};

			this.getShortlistLayerId = function()
			{
				return _shortlistLayerId;
			};

			this.setShortlistLayerId = function(shortlistLayerId)
			{
				_shortlistLayerId = shortlistLayerId;
			};

			this.getWebAppItem = function()
			{
				return _appItem || {};
			};

			this.setWebAppItem = function(appItem)
			{
				_appItem = appItem;
			};

			this.getResponse = function()
			{
				return _response;
			};

			this.setResponse = function(response)
			{
				_response = response;
			};

			this.getWebAppData = function()
			{
				return WebApplicationData;
			};

			this.updateAfterSave = function()
			{
				WebApplicationData.updateAfterSave();
			};

			this.userIsAppOwner = function()
			{
				var portalUser = app.portal ? app.portal.getPortalUser() : null;

				return  (portalUser && portalUser.username == this.getWebAppItem().owner)
					|| (CommonHelper.getPortalUser() != null && CommonHelper.getPortalUser() == this.getWebAppItem().owner)
					// Admin privilege
					|| (portalUser && portalUser.privileges && $.inArray("portal:admin:updateItems", portalUser.privileges) > -1 )
					|| this.getWebAppItem().itemControl == "admin"
					// Group with shared ownership
					|| this.getWebAppItem().itemControl == "update";
			};

			this.userIsOrgaPublisher = function()
			{
				var user = app.portal ? app.portal.getPortalUser() : null;
				return user && user.orgId && (user.role == 'org_admin' || user.role == 'org_publisher');
			};

			this.checkUserItemPrivileges = function()
			{
				var portalUser = app.portal ? app.portal.getPortalUser() : null;

				return (portalUser && ! portalUser.orgId && ! portalUser.privileges)
						|| (portalUser && portalUser.privileges && $.inArray("portal:user:createItem", portalUser.privileges) > -1);
			};

			this.isOrga = function()
			{
				if ( ! app.portal || ! app.portal.getPortalUser() )
					return false;

				return !! app.portal.getPortalUser().orgId;
			};

			this.getAppProxies = function()
			{
				return _appProxies;
			};

			this.setAppProxies = function(appProxies)
			{
				_appProxies = appProxies;
			};

			this.debug = function()
			{
				//
			};

			this.getStory = function()
			{
				return _tabs;
			};

			this.setStory = function(index, title, color, extent)
			{
				if(index in _tabs){
					//do nothing
				} else{
					_tabs[index] = {
						title: "",
						id: index,
						color: null,
						extent: null
					};
				}
				if(title)
					_tabs[index].title = title;
				if(color)
					_tabs[index].color = color;
				if(extent)
					_tabs[index].extent = extent;


			};

			this.clearStory = function()
			{
				_tabs = {};
			};

			this.getStoryByIndex = function(index)
			{
				return _tabs[index];
			};

			this.getStoryLength = function()
			{
				// TODO
				if(app.data.getShortlistLayerId() && app.map.getLayer(app.data.getShortlistLayerId()) && app.map.getLayer(app.data.getShortlistLayerId()).graphics.length)
					return !! app.map.getLayer(app.data.getShortlistLayerId()).graphics.length;
				else {
					return 0;
				}
			};

			this.storyReadyToScan = function()
			{
				return ! app.isGalleryCreation
					|| app.data.getWebMap().item.id;
			}
		};
	}
);
