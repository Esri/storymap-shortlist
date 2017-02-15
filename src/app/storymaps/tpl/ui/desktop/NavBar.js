define(["lib-build/tpl!./NavBar",
		"lib-build/css!./NavBar",
		"lib-build/tpl!./NavBarEntry",
		"lib-build/tpl!./NavBarEntryMore",
		"storymaps/common/utils/CommonHelper",
		"esri/graphicsUtils",
		"esri/layers/GraphicsLayer",
		"esri/geometry/webMercatorUtils",
		"esri/geometry/Extent",
		"dojo/topic",
		"dojo/has"
	],
	function(
		viewTpl,
		viewCss,
		viewEntryTpl,
		viewEntryMoreTpl,
		CommonHelper,
		graphicsUtils,
		GraphicsLayer,
		webMercatorUtils,
		Extent,
		topic,
		has
	){
		return function NavBarTab(container, isInBuilder, navigationCallback, builderView)
		{
			var _this = this,
				_entries = null,
				_entryIndex = null,
				_builderView = builderView,
				_webApplicationData = null;

			container.html(viewTpl({}));

			this.init = function(entries, entryIndex, colors, WebApplicationData)
			{
				_entries = entries;
				_entryIndex = null;
				_webApplicationData = WebApplicationData;
				render(colors, entryIndex);
				this.showEntryIndex(entryIndex);

				if(_entries.length == 1)
					app.ui.navBar.disableOrganize();

				initEvents();
				isInBuilder && initBuilder();

				//app.addFeatureBar.addLayer();
			};

			this.update = function(colors)
			{
				render(colors);
				this.showEntryIndex(_entryIndex);
			};

			this.resize = function()
			{
				container.find(".nav-tabs > li").addClass("visible");
				container.find(".nav-tabs .dropdown").removeClass("visible");
				container.find(".nav-tabs .dropdown-menu li").removeClass("visible");

				var widthCounter = 0,
					index = 0,
					displayMoreButton = false,
					entries = container.find(".nav-tabs > li:not(.dropdown)"),
					moreButtonSize = container.find("li.dropdown").outerWidth(),
					// Width - builder - marginof navBar - magic
					availableWidthForTabs = container.width() - container.find('.builder-content-panel:visible').outerWidth() - 30 - 4;

				entries.each(function() {
					index++;
					widthCounter += $(this).outerWidth();

					// If adding the button would overflow
					//  or if adding the button and the more button would overflow and there is more entries to come
					if (widthCounter > availableWidthForTabs
							|| (widthCounter + moreButtonSize > availableWidthForTabs && index < entries.length) )
					{
						displayMoreButton = true;
						$(this).removeClass("visible");
						container.find(".nav-tabs .dropdown-menu li").eq($(this).index()).addClass("visible");
					}
				});

				var activeEntry = container.find(".nav-tabs > .entry.active"),
					activeEntryDropdown = container.find(".nav-tabs .dropdown-menu li.active");

				// The active entry is not visible -> the active entry is now in the dropdown list
				if ( activeEntry.length && ! activeEntry.hasClass("visible") ) {
					activeEntry.removeClass("active");
					container.find(".nav-tabs .dropdown-menu li").eq(activeEntry.index()).addClass("active");
					container.find(".nav-tabs > .dropdown").addClass("active");
				}
				// The active entry in the dropdown is not visible -> the active entry is now visible in the main list
				else if ( activeEntryDropdown.length && ! activeEntryDropdown.hasClass("visible") ) {
					activeEntryDropdown.removeClass("active");
					container.find(".nav-tabs > .entry").eq(activeEntryDropdown.index()).addClass("active");
					container.find(".nav-tabs > .dropdown").removeClass("active");
				}

				if ( displayMoreButton )
					container.find(".nav-tabs .dropdown").addClass("visible");
			};

			this.showEntryIndex = function(index)
			{
				var nbEntryVisible = container.find('.nav-tabs > .entry.visible').length;

				container.find('li').removeClass('active');

				// The entry is visible
				if ( index < nbEntryVisible ) {
					container.find('.entry').eq(index).addClass('active');

					if ( ! app.isLoading ) {
						container.find('.entry').eq(index).find('.entryLbl').focus();
						// Close the dropdown if open
						if ( container.find('.dropdown').hasClass("open") )
							container.find('.dropdown-toggle').click();
					}
				}
				// The entry is in the more list
				else {
					container.find('.dropdown').addClass('active');
					container.find('.dropdown .entry').eq(index).addClass('active');

					if ( ! app.isLoading ) {
						// Open the dropdown if not open
						if ( ! container.find('.dropdown').hasClass("open") )
							container.find('.dropdown-toggle').click();

						// Focus on the dropdown entry
						container.find('.dropdown .entry').eq(index).focus();
					}
				}

				if(app.isInBuilder)
					setTimeout(function(){
						_this.resize();
					}, 50);

				_entryIndex = index;
			};

			this.getEntryIndex = function()
			{
				return _entryIndex;
			};

			this.destroy = function()
			{
				container.hide();
			};

			this.bookmarksLoaded = false;

			this.initBookmarks = function(){
				var bookmarks = app.data.getResponse() ? app.data.getResponse().itemInfo.itemData.bookmarks : app.maps[app.data.getWebAppData().getWebmap()].response.itemInfo.itemData.bookmarks;
				if(bookmarks.length  && app.data.getWebAppData().getGeneralOptions().bookmarks){
					$("#bookmarksCon").show();
					$("#bookmarksTogText").html(app.data.getWebAppData().getGeneralOptions().bookmarksAlias + ' &#x25BC;');
					$("#mobileBookmarksTogText").html(app.data.getWebAppData().getGeneralOptions().bookmarksAlias + ' &#x25BC;');
					$("#bookmarksToggle").addClass('closed');
					$("#mobileBookmarksToggle").addClass('closed');
					$("#bookmarksToggle").click(function(){
						if ($("#bookmarksDiv").css('display')=='none'){
							$("#bookmarksTogText").html(app.data.getWebAppData().getGeneralOptions().bookmarksAlias + ' &#x25B2;');
							$("#bookmarksDiv").css('display', 'inline-block');
							$("#bookmarksToggle").removeClass('closed');
							$("#bookmarksToggle").addClass('open');
						}
						else{
							$("#bookmarksTogText").html(app.data.getWebAppData().getGeneralOptions().bookmarksAlias +' &#x25BC;');
							$("#bookmarksDiv").css('display', 'none');
							$("#bookmarksToggle").removeClass('open');
							$("#bookmarksToggle").addClass('closed');

						}
						$("#mobileBookmarksTogText").html(app.data.getWebAppData().getGeneralOptions().bookmarksAlias + ' &#x25BC;');
					});
					$("#mobileBookmarksToggle").click(function(){
						if ($("#mobileBookmarksDiv").css('display')=='none'){
							$("#mobileBookmarksDiv").css('display', 'inline-block');
							$("#mobileBookmarksTogText").html(app.data.getWebAppData().getGeneralOptions().bookmarksAlias + ' &#x25B2;');
							$("#mobileBookmarksToggle").removeClass('closed');
							$("#mobileBookmarksToggle").addClass('open');
						}
						else{
							$("#mobileBookmarksDiv").css('display', 'none');
							$("#mobileBookmarksTogText").html(app.data.getWebAppData().getGeneralOptions().bookmarksAlias + ' &#x25BC;');
							$("#mobileBookmarksToggle").removeClass('open');
							$("#mobileBookmarksToggle").addClass('closed');
						}
					});
					$.each(bookmarks,function(index,value){
						$("#bookmarksDiv").append("<p><a tabindex='0'>"+value.name+"</a></p>");
						$("#mobileBookmarksDiv").append("<p><a>"+value.name+"</a></p>");
					});

					$("#bookmarksDiv a").click(function() {
						var name = $(this).html();
						var extent = new esri.geometry.Extent($.grep(bookmarks,function(n){return n.name == name;})[0].extent);
						app.map.setExtent(extent);
						$("#bookmarksTogText").html(app.data.getWebAppData().getGeneralOptions().bookmarksAlias+' &#x25BC;');
						$("#bookmarksDiv").css('display', 'none');
						$("#bookmarksToggle").removeClass('open');
						$("#bookmarksToggle").addClass('closed');
					});

					$("#mobileBookmarksDiv a").click(function() {
						var name = $(this).html();
						var extent = new esri.geometry.Extent($.grep(bookmarks,function(n){return n.name == name;})[0].extent);
						app.map.setExtent(extent);
						$("#mobileBookmarksTogText").html(app.data.getWebAppData().getGeneralOptions().bookmarksAlias+' &#x25BC;');
						$("#mobileBookmarksToggle").removeClass('open');
						$("#mobileBookmarksToggle").addClass('closed');
						$("#mobileBookmarksDiv").css('display', 'none');
					});
					if(!app.isInBuilder && app.data.getWebAppData().getTabs() && Object.keys(app.data.getWebAppData().getTabs()).length == 1)
						$('#bookmarksCon').css({'top': '10px'});
				}

				$('#nav-bar').show();
				$('#bookmarksDiv').show();
				$('#bookmarksCon').width($('#bookmarksDiv').outerWidth());
				$('#bookmarksDiv').hide();
				_this.bookmarksLoaded = true;
			};

			this.hideBookmarks = function()
			{
				$("#bookmarksCon").hide();
			};

			this.showBookmarks = function()
			{
				$("#bookmarksCon").show();
			};

			this.updateBookmarksAlias = function(value)
			{
				$("#bookmarksTogText").html(value + ' &#x25BC;');
				$("#mobileBookmarksTogText").html(value + ' &#x25BC;');
			};

			function render(colors, entryIndex)
			{
				_entries = _entries || [];
				setColor(colors);
				$('.nav-bar').addClass('isTab');
				//$('#nav-bar').css('background', '#444');
				var nbEntries = _entries.length,
					entriesHTML = "";

				$.each(_entries, function(i, entry) {
					var value = entry.title;

					// Can happen when switching from bullet where title isn't mandatory
					//if ( ! value )
						//value = isInBuilder ? ('<span style="color: red;">' + i18n.commonCore.inlineFieldEdit.editMe + '</span>') : '&nbsp;';

					entriesHTML += viewEntryTpl({
						value: value,
						tooltip: "",
						optHtmlClass: ''//entry.status != "PUBLISHED" ? "hidden-entry" : ""
					});

				});

				container.find('.nav-tabs').html(
					entriesHTML
					+ viewEntryMoreTpl({ entries: entriesHTML })
				);

				container.find('.entry').click(onTitleClick);

				// Tab navigation
				container.find('.entryLbl').on('keydown', function(e) {
					if( e.keyCode === 9 ) {
						topic.publish("story-tab-navigation", {
							from: "nav",
							direction: e.shiftKey ? "backward" : "forward"
						});
						return false;
					}
				});

				// Fire a click event when focusing through keyboard and prevent double event when clicking with mouse
				container.find('.entryLbl').eq(0)
					.focus(function(){
						if (!$(this).data("mouseDown") && ! $(this).parent('.entry').hasClass("active")){
							$(this).parent('.entry').click();
						}
					})
					.mousedown(function(){
						$(this).data("mouseDown", true);
					})
					.mouseup(function(){
						$(this).removeData("mouseDown");
					});

				$('#nav-bar').show();
				if(app.isInBuilder)
					app.addFeatureBar.updateLocatedFeatures(entryIndex);
				_this.resize();
			}

			/*function setLayout(layout, layoutOptions)
			{
				container.find('.nav-bar')
					//TODO may need to call this
					.toggleClass("isTab", layout == "tab")
					.toggleClass("isBullet", layout == "bullet");
			}*/

			function setColor(colors)
			{
				container.css('background-color', colors.header);

				// Background
				CommonHelper.addCSSRule(
					".nav-bar .nav > .entry .entryLbl, \
					.nav-bar .dropdown-toggle { \
						color: " + colors.tabText  + "; \
						background-color: " + colors.tab  + " !important; \
					}",
					"NavBarTab"
				);

				// Active entry
				CommonHelper.addCSSRule(
					".nav-bar .entry.active > .entryLbl, \
					.nav-bar .dropdown.active .dropdown-toggle { \
						color: " + colors.tabTextActive  + "; \
						background-color: " + colors.tabActive  + " !important; \
					}",
					"NavBarActive"
				);

				// Hover
				CommonHelper.addCSSRule(
					".nav-bar .dropdown:not(.active):hover .dropdown-toggle, \
					.nav-bar li:not(.active) .entryLbl:hover { \
						color: " + colors.tabTextHover  + "; \
						background-color: " + colors.tabHover  + " !important; \
					}",
					"NavBarHover"
				);

				// More list
				CommonHelper.addCSSRule(
					".nav-bar .dropdown-menu, \
					.nav-bar .dropdown-menu .entryLbl { \
						color: " + colors.tabText  + " !important; \
						background-color: " + colors.header  + " !important; \
					}",
					"NavBarMore"
				);

			}

			/*
			 * Story navigation
			 */

			function onTitleClick()
			{
				if($('body').hasClass('organizeFeatures'))
					return;
				var index = $(this).index();

				navigationCallback(index);
				if(app.isInBuilder){
					app.addFeatureBar.updateLocatedFeatures();
					app.addFeatureBar.exitOrganizeMode();
				}
			}


			/*
			 * Builder
			 */

			function initBuilder()
			{
				container.find('.builder-content-panel').css('display', 'inline-block');

				container.find('.builder-edit')
					.off('click')
					.click(onClickEdit)
					.find(".builder-lbl").html('Edit Tab');
					//.find(".builder-lbl").html(i18n.builder.addEditPopup.edit);

				container.find('.builder-add')
					.off('click')
					.click(_this.onClickAdd)
					.find(".builder-lbl").html('Add tab');
					//.find(".builder-lbl").html(i18n.builder.addEditPopup.add);
			}

			function onClickEdit()
			{
				if($('body').hasClass('organizeFeatures'))
					return;
				app.builder.openEditPopup({
					entryIndex: _this.getEntryIndex()
				});
			}

			this.disableOrganize = function()
			{
				container.find('.builder-organize').attr('disabled', true);
				container.find('.builder-organize').addClass('disabled');
				$.each(container.find('.builder-organize').children(), function(index, child){
					$(child).addClass('disabled');
				});
			};

			this.enableOrganize = function()
			{
				container.find('.builder-organize').attr('disabled', false);
				container.find('.builder-organize').removeClass('disabled');
				$.each(container.find('.builder-organize').children(), function(index, child){
					$(child).removeClass('disabled');
				});
			};

			this.onClickAdd = function(event, themeTitle)
			{
				if($('body').hasClass('organizeFeatures'))
					return;

				app.detailPanelBuilder.hideSearch();
				var index = container.find(".nav-tabs .entry.visible").length;
				var extent = app.data.getWebAppData().getGeneralOptions().extentMode == "customHome" ? app.data.getWebAppData().getMapExtent() : null;
				var newTab = {
					id: index,
					title: themeTitle ? themeTitle : "Tab " + (index + 1),
					features: [],
					extent: extent
				};

				//newTab.id = index;
				//newTab.title = "Tab " + (index + 1);
				if(!hasValue(_entries, "id", index)){
					_entries[index] = newTab;
				}
				var colorOrder = app.cfg.COLOR_ORDER.split(",");
				var colorIndex = index;
				if(colorIndex > 7)
					colorIndex = colorIndex % 7;
				var activeColor = $.grep(app.cfg.COLOR_SCHEMES, function(e){ return e.name == colorOrder[colorIndex]; });
				newTab.color = activeColor;
				$('#contentPanel').css('border-top-color', activeColor[0].color);

				app.ui.tilePanel.clearTilePanel();
				var colors = {
					header: '#444',
					tabText: '#d8d8d8',
					tab: '#666',
					tabTextActive: '#fff',
					tabActive: activeColor[0].color,
					tabTextHover: '#fff',
					tabHover: '#666'
				};

				if(app.isGalleryCreation && app.data.getStory()[0].title)
					_entries[0].title = app.data.getStory()[0].title;
				_this.init(_entries, container.find(".nav-tabs .entry.visible").length, colors, _webApplicationData);
				//app.addFeatureBar.addLayer();

				/*var shortlistLayerId = $.grep(app.map.graphicsLayerIds, function(e){
					if(e.split('_').slice(0,-1).join('_') == _webApplicationData.getShortlistLayerId())
						return e;
				});*/
				var shortlistLayer = app.map.getLayer(app.data.getShortlistLayerId());

				$.each(shortlistLayer.graphics,function(i,graphic){
					graphic.hide();
				});
				var layer = new esri.layers.GraphicsLayer();

				//Need to do for each tab/swiper, not here
				var tabColor = activeColor[0].color;
				layer.color = tabColor;
				app.layerCurrent = layer;
				app.detailPanelBuilder.addDetailPanelSwiper(index);
				app.addFeatureBar.exitOrganizeMode();

				app.data.setStory(index, newTab.title, tabColor, extent);

				navigationCallback(index);

				_this.enableOrganize();

				if(_webApplicationData.getTitle())
					topic.publish("BUILDER_INCREMENT_COUNTER");
			};

			function hasValue(obj, key, value) {
				return obj.hasOwnProperty(key) && obj[key] === value;
			}

			/*
			 * Init events
			 * Performed once at component creation
			 */

			function initEvents()
			{
				//
			}
		};
	}
);
