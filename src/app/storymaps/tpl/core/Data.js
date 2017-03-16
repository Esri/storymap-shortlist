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

			/*
			 * Map Series
			 */

			var _storyStorage = null,
				_currentStoryIndex = null;

			/*
			 * Storage type
			 */

			this.getStoryStorage = function()
			{
				return _storyStorage;
			};

			this.setStoryStorage = function(storyStorage)
			{
				_storyStorage = storyStorage;
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
			};

			/**
			 * Get story entries:
			 *  - in user defined order
			 *  - in builder: get all entries
			 *  - in viewer: get only published section with a past publication date
			 */
			this.getStoryEntries = function()
			{
				var allEntries = [],
					filteredEntries = [];

				if ( _storyStorage == "WEBAPP" )
					allEntries = WebApplicationData.getStoryEntries();

				// Apply maximum number of entries limitation
				allEntries = allEntries.slice(0, app.cfg.MAX_NB_ENTRIES);

				if ( app.isInBuilder )
					return allEntries || [];

				// Filter by status
				$.each(allEntries || [], function(i, entry){
					if ( entry.status == "PUBLISHED" )
						filteredEntries.push(entry);
				});

				return filteredEntries;
			};

			// TODO those three functions should be refactored
			this.getImages = function()
			{
				// Story Main Stage images
				var images = $.map(this.getStoryEntries(), function(section){
					return section.media && section.media.type == "image" && section.media.image ? section.media.image.url : null;
				});

				// Make the array unique
				images = $.grep(images, function(image, index) {
					return index == $.inArray(image, images);
				});

				return images;
			};

			this.getAllImageUrls = function() {
				return _.map(this.getImages().concat(this.getSidebarImages().concat([WebApplicationData.getLogoURL()])), this.getNonProtocolNonDoubleSlashUrl);
			};

			this.getSidebarImages = function() {
				var entries = this.getStoryEntries();
				var imgUrls = [];
				_.each(entries, function(section) {
					var jqSection = $(section.description);
					_.each(jqSection.find('img'), function(img) {
						imgUrls.push(CommonHelper.possiblyRemoveToken(img.src));
					});
				});
				return imgUrls;
			};

			this.getNonProtocolNonDoubleSlashUrl = function(url) {
				return url.replace(/http[s]?\:\/\//, '').replace('//', '/');
			};
		};
	}
);
