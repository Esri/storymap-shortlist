define(["esri/geometry/screenUtils",
		"../../core/Helper",
		"storymaps/common/utils/CommonHelper",
		"lib-build/tpl!./TilePanel",
		"lib-build/css!./TilePanel",
		"../../core/WebApplicationData"],
	function(screenUtils, Helper, CommonHelper, tilePanel){
		return function TilePanel(container, mainView, WebApplicationData)
		{
			var _this = this;
			var _mainView = mainView;
			var _helper = new Helper();
			var _iOS = /iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
			var _scroll = false;

			this.tileClick = true;

			$(document).bind('cbox_complete', function(){
				$(".details .rightDiv").height($(".details").height() - $(".detailsTitle").height() - 20);
			});

			this.init = function(){
				$(container).prepend(tilePanel({
					noPlaces: i18n.viewer.general.noPlaces
				}));
				$('#mainStagePanel').width($('#contentPanel').width() - $('#paneLeft').width());
				$('#mainStagePanel').css({'left': $('#paneLeft').width()});
			};

			this.resize = function(newWidth)
			{
				$("#paneLeft").width(newWidth);
				$(".tilelist").width(newWidth);
			};

			this.createTab = function(index, layer){
				$("#tabs").append('<div class="tab" tabindex="0">' + layer.title + '</div>');
			};

			this.setTabClick = function(){
				$.each($('.entry.visible'), function(index){
					$(this).click(function(){
						_mainView.selected = null;
						_mainView.activateLayer(index);
						$('.detailContainer').hide();
						if(app.mapTips)
							app.mapTips.clean();
					});
				});
			};

			this.clearTilePanel = function()
			{
				if(_iOS){
					$.each($('#mobileList').find('img'), function(i, tile){
						$(tile).attr('src', 'data:image/gif;base64,' + 'R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=');
					});
					$("#mobileList").empty();
				}
				$("#myList").empty();
			};

			//TODO seperate mobile to appropriate component?
			this.buildTilePanel = function(){
				_this.clearTilePanel();

				var display;
				var tile;
				var img;
				var footer;
				var num;
				var title;
				var visibleFeatures = false;

				if(!app.layerCurrent || !app.layerCurrent.graphics || !app.layerCurrent.graphics.length)
					return;
				var atts = app.layerCurrent.graphics[0].attributes;

				var numberAttribute = atts.number ? 'number' : atts.Number ? 'Number' : atts.NUMBER ? 'NUMBER' : atts.PLACENUMSL ? 'PLACENUMSL' : null;

				if(numberAttribute){
					app.layerCurrent.graphics.sort(function(a,b){
						return parseInt(a.attributes[numberAttribute]) - parseInt(b.attributes[numberAttribute]);
					});
				}

				$.each(app.layerCurrent.graphics,function(index,value){
					if (app.map.extent.contains(value.geometry)) {
						display = "block";
						visibleFeatures = true;
					} else {
						if(app.data.getWebAppData().getGeneralOptions().filterByExtent  && !app.isInBuilder)
							display = "none";
					}
					tile = $('<li tabindex="0" id="item'+value.attributes.shortlist_id+'" style="display:'+display+'">');
					img = $('<div class="tileImage"></div>');
					var atts = value.attributes;
					var thumbUrl = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'thumb_url';})[0]];
					var picUrl = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'pic_url';})[0]];
					if(thumbUrl){
						if(thumbUrl.indexOf("sharing/rest/content/items/") > -1)
							thumbUrl = CommonHelper.possiblyAddToken(thumbUrl);
						$(img).css('background-image', 'url(' + thumbUrl + ')');
						$(img).find('i').hide();
					}
					else if(picUrl) {
						thumbUrl = picUrl;
						if(thumbUrl.indexOf("sharing/rest/content/items/") > -1)
							thumbUrl = CommonHelper.possiblyAddToken(thumbUrl);
						$(img).css('background-image', 'url(' + thumbUrl + ')');
						$(img).find('i').hide();
					} else{
						$(img).append('<i class=" fa fa-camera" aria-hidden="true"></i>');
					}
					footer = $('<div class="footer"></div>');
					var name = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'name';})[0]];
					var titleText = name || 'Unnamed Place';
					title = $('<div class="blurb">'+ titleText +'</div>');
					if(WebApplicationData.getGeneralOptions().numberedIcons){
						var featNumber = app.layerCurrent.graphics[index].attributes.number || app.layerCurrent.graphics[index].attributes.Number || app.layerCurrent.graphics[index].attributes.NUMBER || app.layerCurrent.graphics[index].attributes.PLACENUMSL;
						if(value.attributes.number < 100){
							num = $('<div class="num" style="background-color:'+app.layerCurrent.color+'">'+featNumber+'</div>');
						}
						else{
							num = $('<div class="num longNum" style="background-color:'+app.layerCurrent.color+'">'+featNumber+'</div>');
							title = $('<div class="blurb longNumBlurb">'+name+'</div>');
						}
						$(footer).append(num);
					}
					$(footer).append(title);
					$(tile).append(footer);
					$(tile).data('shortlist-id', value.attributes.shortlist_id);
					app.ui.mobileFeatureList.buildList(index, value, tile);
					$(tile).append(img);
					if(app.isInBuilder){
						if(value.attributes.locationSet || app.data.getWebAppData().getIsExternalData())
							$(tile).addClass('located');
						else{
							$(tile).find('.tileImage').append('<div class="unlocated" style="outline: none;"></div>');
						}
					}
					$("#myList").append(tile);
				});

				// event handlers have to be re-assigned every time you load the list...
				_this.setTileEvents();
				/*$("ul.tilelist li").mouseover(_this.tile_onMouseOver);
				$("ul.tilelist li").mouseout(_this.tile_onMouseOut);
				$("ul.tilelist li").click(_this.tile_onClick);
				$("ul.tilelist li").keydown(_this.tile_keydown);
				$("#mobilePaneList ul.mobileTileList li").click(_this.tile_onClick);*/

				$("ul.tilelist").animate({ scrollTop: 0 }, { duration: 200 } ); //Does this work?
				//$('#mobilePaneList').scrollTop(0);
				if(!visibleFeatures && app.data.getWebAppData().getGeneralOptions().filterByExtent  && !app.isInBuilder)
					$('.noFeature').css('display', 'block');
				else
					$('.noFeature').css('display', 'none')	;

				if(!WebApplicationData.getGeneralOptions().numberedIcons){
					$('ul.tilelist .blurb').addClass('unNumBlurb');
				}
			};

			this.findTile = function(id)
			{
				return $.grep($(container).find($("ul.tilelist li")),function(n){return $(n).data('shortlist-id') == id;})[0];
			};

			this.findMobileTile = function(id)
			{
				return $.grep($("ul.mobileTileList li"),function(n){return $(n).data('shortlist-id') == id;})[0];
			};

			this.setTileEvents = function()
			{
				$("ul.tilelist li").mouseover(_this.tile_onMouseOver);
				$("ul.tilelist li").mouseout(_this.tile_onMouseOut);
				$("ul.tilelist li").click(_this.tile_onClick);
				$("ul.tilelist li").on('touchmove', function(){
					_scroll = true;
				});
				$("ul.tilelist li").on('touchend', _this.tile_onClick);
			};

			this.refreshList = function() {
				var tile;
				var mobileTile;
				var visibleFeatures = false;
				if(app.layerCurrent && app.layerCurrent.graphics.length){
					setTimeout(function(){
						$.each(app.layerCurrent.graphics,function(index,value){
							//find the corresponding tile
							tile = _this.findTile(value.attributes.shortlist_id);
							//TODO in mobileFeatureList
							mobileTile = _this.findMobileTile(value.attributes.shortlist_id);
							if(app.data.getWebAppData().getGeneralOptions().filterByExtent  && !app.isInBuilder){
								if (app.map.extent.contains(value.geometry)) {
									if ($(tile).css("display") == "none") $(tile).stop().fadeIn();
									//if ($(mobileTile).css("display") == "none") $(mobileTile).stop().fadeIn();
									visibleFeatures = true;
								} else {
									if ($(tile).css("display") != "none") $(tile).stop().fadeOut(1000);
									//if ($(mobileTile).css("display") != "none") $(mobileTile).stop().fadeOut(1000);
								}
							}
						});

						if(!visibleFeatures && app.data.getWebAppData().getGeneralOptions().filterByExtent  && !app.isInBuilder)
							$('.noFeature').css('display', 'block');
						else
							$('.noFeature').css('display', 'none');
					}, 100);
				}
			};

			this.initSortable = function()
			{
				$('#myList').sortable({
					update:function() {
						app.addFeatureBar.updateNumber();
					}
				});
				//$('#myList').css('background-color', '#8e4141');
				$('#myList').addClass('organize');
			};

			this.destroySortable = function()
			{
				$('#myList').sortable('destroy');
				$('#myList').css('background-color', '#C7C7C7');
				$('body').removeClass('organizeFeatures');
				$('#myList').removeClass('organize');
			};

			this.tile_onMouseOver = function() {
				//if(app.isInBuilder)
					//return;
				var _this = this;
				var match = $.grep(app.layerCurrent.graphics, function(v){
					return v.attributes.shortlist_id==$(_this).data('shortlist-id');
				});
				if(match[0]){
					match[0].symbol.setWidth(_mainView.lutIconSpecs.medium.getWidth());
					match[0].symbol.setHeight(_mainView.lutIconSpecs.medium.getHeight());
					match[0].symbol.setOffset(_mainView.lutIconSpecs.medium.getOffsetX(), _mainView.lutIconSpecs.medium.getOffsetY());
					match[0].draw();
					if (!_helper.isIE())
						_mainView.moveGraphicToFront(match[0]);
					var atts = match[0].attributes;
					var name = atts[$.grep(Object.keys(atts), function(n) {return n.toLowerCase() == 'name';})[0]];
					_mainView.buildMapHoverTips(name, match[0]);
				}
			};

			this.tile_onMouseOut = function() {
				//if(app.isInBuilder)
					//return;
				if (_mainView.selected != null) {
					var id = parseInt($(this).attr("id").substring(4));
					if (_mainView.selected.attributes.shortlist_id == id) {
						return;
					}
				}

				var _this = this;
				var match = $.grep(app.layerCurrent.graphics, function(v){
					return v.attributes.shortlist_id==$(_this).data('shortlist-id');
				});
				if(match[0]){
					match[0].symbol.setWidth(_mainView.lutIconSpecs.tiny.getWidth());
					match[0].symbol.setHeight(_mainView.lutIconSpecs.tiny.getHeight());
					match[0].symbol.setOffset(_mainView.lutIconSpecs.tiny.getOffsetX(), _mainView.lutIconSpecs.tiny.getOffsetY());
					match[0].draw();
				}
				if(app.mapTips)
					app.mapTips.clean(true);
			};

			this.tile_onClick = function(e) {
				if($('body').hasClass('organizeFeatures'))
					return;
				if(_scroll){
					_scroll = false;
					return;
				}
				if(e.which == 1 || e.which == 2 || e.which == 3){
					_this.tileClick = true;
				}else{
					_this.tileClick = false;
				}

				var id = $(this).data('shortlist-id');
				_mainView.preSelection();
				_mainView.selected = $.grep(app.layerCurrent.graphics,function(n){return n.attributes.shortlist_id == id;})[0];

				_mainView.postSelection();
				$('#mobileTitlePage').css('display', 'none');
				//_mainView.hideBookmarks();
				//app.ui.detailPanel.loaded = true;
				if(!_mainView.themeSelected)
					app.ui.mobileFeatureList.selectTheme(0);
				_mainView.themeSelected = true;
			};

			/******************************************************
			****************** 508 *******************************
			******************************************************/

			/*this.set508 = function(){
				$('#myList').keydown(function(e){
					if (e.which == 27) {
						_this.leaveTileGroup();
					}
				});

				$('#tabs .tab').keypress(function(e){
					if (e.which == 13 ) {
						var tabIndex = $("#tabs .tab").index(this);
						var layer = contentLayers[tabIndex];
						_this.enterTileGroup(layer);
						e.stopPropagation();
					}
				});

				$('#tabs div.tab').keydown(function(e){
					var tabIndex = $("#tabs .tab-selected").index();
					if (e.which == 37) {
						if ($(this).is( ":first-child" ))  {
							$('#tabs div:last-child').focus();
							$('.tab')[$('.tab').length - 1].click();
						}
						else {
							$(this).prev().focus();
							$('.tab')[tabIndex - 1].click();
						}
					}
					if (e.which == 39) {
						if ($(this).is( ":last-child" )) {
							$('#tabs div:first-child').focus();
							$('.tab')[0].click();
						} else {
							$(this).next().focus();
							$('.tab')[tabIndex + 1].click();
						}
					}
					if (e.which == 40 || e.which == 9) {
						if(e.shiftKey){
							return;
						}
						var tabIndex = $("#tabs .tab").index(this);
						var layer = contentLayers[tabIndex];

						if($("ul#myList.tilelist li:visible").length > 0){
							_this.enterTileGroup(layer);
						} else{
							if ($(this).is( ":last-child" )) {
								$('.tab')[0].click();
								setTimeout(function(){
									$('#tabs div:first-child').focus();
								}, 0);
							} else {
								$('.tab')[tabIndex + 1].click();
								setTimeout(function(){
									$(this).next().focus();
									$('.tab')[tabIndex + 1].focus();
								}, 0);
							}
						}
					}
				});

				$('.tab').keydown(function(e){
					if($(this).index() == 0){
						if (e.which == 9) {
							if(e.shiftKey){
								if($('#subtitle')){
									setTimeout(function(){
										$('#subtitle')[0].focus();
									}, 0);
								}else{
									$('#title')[0].focus();
								}
							}
						}
					}
				});
			}
			function tile_keydown(e)
			{
				if (e.which == 9) {
					var tiles = $('ul#myList.tilelist li:visible');
					if(e.shiftKey){
						setTimeout(function(){
							$('#tabs .tab-selected')[0].focus();
						}, 0);
						return;
					}
					if(tiles.index(this) == tiles.length - 1){
						var selectedTabIndex = $('#tabs .tab-selected').index();
						var tabLength = $('.tab').length;
						if(selectedTabIndex < tabLength -1){
							leaveTileGroup();
						}
						else{
							enterHeaderSocial();
						}
					}
				}
				if (e.which == 37) {
					var tiles = $('ul#myList.tilelist li:visible');
					if (tiles.index(this) == 0)  {
						tiles.get(-1).focus();
					}
					else {
						tiles[tiles.index(this)-1].focus();
					}
				}
				if (e.which == 39) {
					var tiles = $('ul#myList.tilelist li:visible');
					if (tiles.index(this) == (tiles.size() - 1)) {
						tiles.get(0).focus();
					} else {
						tiles[tiles.index(this)+1].focus();
					}
				}
				if (e.which == 38) {
					var w1 = $('ul#myList.tilelist').width();
					var w2 = $('ul#myList.tilelist li:first-child').width();
					var tiles_per_row = Math.floor(w1/w2);
					var tiles = $('ul#myList.tilelist li:visible');
					var myIndex = tiles.index(this);
					var newIndex = myIndex - tiles_per_row;
					if (newIndex < 0) {
						var tilecount = tiles.size();
						var gridcount = tilecount + tiles_per_row - (tilecount % tiles_per_row);
						newIndex = gridcount + newIndex;
						if (tilecount <= newIndex) {
							newIndex = newIndex - tiles_per_row;
						}
					}
					tiles.get(newIndex).focus();
				}
				if (e.which == 40) {
					var w1 = $('ul#myList.tilelist').width();
					var w2 = $('ul#myList.tilelist li:first-child').width();
					var tiles_per_row = Math.floor(w1/w2);
					var tiles = $('ul#myList.tilelist li:visible');
					var myIndex = tiles.index(this);
					var newIndex = myIndex + tiles_per_row;
					var tilecount = tiles.size();
					if (tilecount <= newIndex) {
						newIndex = newIndex % tiles_per_row;
					}
					tiles[newIndex].focus();
				}
			};

			this.enterTileGroup = function(layer) {
				//move keyboard focus into a group of tiles
				mainView.hideBookmarks();
				setTimeout(function(){
					$(container + " li:visible")[0].focus();
				}, 0);
			};

			this.leaveTileGroup = function() {
				//move the keyboard focus out of a group of tile and back to the tab
				$("#tabs .tab-selected").focus();
				var tabIndex = $("#tabs .tab-selected").index();
				_mainView.activateLayer(tabIndex+1);
			};

			this.tile_keydown = function(e) {
				if (e.which == 9) {
					var tiles = $(container + ' li:visible');
					if(e.shiftKey){
						setTimeout(function(){
							$('#tabs .tab-selected')[0].focus();
						}, 0);
						return;
					}
					if(tiles.index(this) == tiles.length - 1){
						var selectedTabIndex = $('#tabs .tab-selected').index();
						var tabLength = $('.tab').length;
						if(selectedTabIndex < tabLength -1){
							_this.leaveTileGroup();
						}
						else{
							_mainView.navToHeaderSocial();

						}
					}
				}
				if (e.which == 37) {
					var tiles = $(container + ' li:visible');
					if (tiles.index(this) == 0)  {
						tiles.get(-1).focus();
					}
					else {
						tiles[tiles.index(this)-1].focus();
					}
				}
				if (e.which == 39) {
					var tiles = $(container + ' li:visible');
					if (tiles.index(this) == (tiles.size() - 1)) {
						tiles.get(0).focus();
					} else {
						tiles[tiles.index(this)+1].focus();
					}
				}
				if (e.which == 38) {
					var w1 = $(container).width();
					var w2 = $(container + ' li:first-child').width();
					var tiles_per_row = Math.floor(w1/w2);
					var tiles = $(container + ' li:visible');
					var myIndex = tiles.index(this);
					var newIndex = myIndex - tiles_per_row;
					if (newIndex < 0) {
						var tilecount = tiles.size();
						var gridcount = tilecount + tiles_per_row - (tilecount % tiles_per_row);
						newIndex = gridcount + newIndex;
						if (tilecount <= newIndex) {
							newIndex = newIndex - tiles_per_row;
						}
					}
					tiles.get(newIndex).focus();
				}
				if (e.which == 40) {
					var w1 = $(container).width();
					var w2 = $(container + ' li:first-child').width();
					var tiles_per_row = Math.floor(w1/w2);
					var tiles = $(container + ' li:visible');
					var myIndex = tiles.index(this);
					var newIndex = myIndex + tiles_per_row;
					var tilecount = tiles.size();
					if (tilecount <= newIndex) {
						newIndex = newIndex % tiles_per_row;
					}
					tiles[newIndex].focus();
				}
			};*/

		};
});
