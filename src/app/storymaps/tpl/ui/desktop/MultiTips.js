define(["dojo/dom-style",
		"dojo/dom-construct",
		"dojo/_base/lang",
		"dojo/on",
		"dojo/_base/array",
		"dojo/query",
		"dojo/dom",
		"dojo/has"],
	function(
		domStyle,
		domConstruct,
		lang,
		on,
		array,
		query,
		dom,
		has
	) {
		/**
		 * Multi tips
		 * @class MultiTips
		 *
		 * Nice looking tootlip
		 */
		return function MultiTips(options)
		{
			var settings = null;
			var forceHidden = false;
			var events = [];

			initMultiTips(options);

			this.current = function()
			{
				return settings.pointArray;
			};

			this.clean = function(forceClean)
			{
				settings = null;
				cleanTips(forceClean);
			};

			this.hide = function()
			{
				forceHidden = true;
				hideAll();
			};

			this.show = function()
			{
				if( ! settings )
					return;

				forceHidden = false;
				settings.visible = true;
				refreshTips(settings.map.extent, true);
			};

			function initMultiTips(options)
			{
				settings = lang.mixin({
					'pointArray' : [],
					'map' : null,
					'attributeLabelField' : "",
					'content' : '',
					'selected' : false,
					'zoomToPoints' : false,
					"backgroundColor" : "#000000",
					"borderColor" : "#000000",
					"pointerColor" : "#000000",
					"textColor" : "#ffffff",
					"minWidth" : "",
					"labelDirection" : "auto",
					"offsetTop": 8,
					"offsetSide": 3,
					"offsetBottom": 8,
					"mapAuthorizedMinWidth": -1,
					"mapAuthorizedWidth": -1,
					"mapAuthorizedHeight": -1,
					"visible": true
				}, options);
				if( options.mapAuthorizedWidth == -1 )
					settings.mapAuthorizedWidth = settings.map.width;
				if( options.mapAuthorizedHeight == -1 )
					settings.mapAuthorizedHeight = settings.map.height;

				buildTips(options.map.container);
			}

			function buildTips(mapDiv, forceVisible)
			{
				cleanTips();
				var event1 = on(settings.map, "zoom-start", function()
				{
					hideAll();
				});

				var event2 = on(settings.map, "zoom-end", function(data)
				{
					if( ! forceHidden )
						refreshTips(data.extent, true);
				});

				var event3 = on(settings.map, "pan", function(data)
				{
					if( ! data || (! data.delta.x && ! data.delta.y) )
						return;

					if( ! forceHidden )
						refreshTips2(data.extent, data.delta);
				});

				var event4 = on(settings.map, "extent-change", function(data)
				{
					if( data && data.delta && data.delta.x === 0 && data.delta.y === 0 )
						return;

					if( ! forceHidden )
						refreshTips(data.extent, true);
				});

				if( forceVisible )
					settings.visible = true;

				if(settings.selected){
					settings.pointArray.push(settings.selected);
					settings.pointArray.reverse();
					if(settings.selected.geometry.x == settings.pointArray[1].geometry.x && settings.selected.geometry.y == settings.pointArray[1].geometry.y)
						settings.pointArray.splice(1, 1);
				}

				array.forEach(settings.pointArray, function(pt, i) {
					domConstruct.place("<div id='arrow"+i+"' class='mtArrow'></div><div id='multiTip"+i+"' class='multiTip'></div>", mapDiv, "last");

					query('#multiTip'+i)[0].innerHTML = (i === 0 && settings.selected) ? settings.selected.attributes.name : settings.content;

					var currentTip = $('#multiTip'+i);
					var currentArrow = $('#arrow'+i);
					(i === 0 && settings.selected) ? $(currentTip).addClass('selected') : null;
					(i === 0 && settings.selected) ? $(currentArrow).addClass('selected') : null;

					domStyle.set('multiTip' + i, {
						backgroundColor: (i === 0 && settings.selected) ? app.cfg.SELECTED_POPUP_BACKGROUND_COLOR : settings.backgroundColor,
						borderColor: (i === 0 && settings.selected) ? app.cfg.SELECTED_POPUP_BORDER_COLOR : settings.borderColor,
						color: settings.textColor,
						padding: "5px",
						position: "absolute"
					});

					if( settings.minWidth )
						domStyle.set('multiTip' + i, "minWidth", settings.minWidth + 'px');

					domStyle.set('arrow' + i, {
						pointerColor: (i === 0 && settings.selected) ? app.cfg.SELECTED_POPUP_ARROW_COLOR : settings.pointerColor,
						position: "absolute",
						width: "0px",
						height: "0px"
					});

					if (settings.map.extent.contains(pt.geometry)) {
						var scrPt = settings.map.toScreen(pt.geometry);
						displayTip(scrPt, i, settings);
					}
				});

				events = [event1, event2, event3, event4];
			}

			function cleanTips(forceClean)
			{
				forceHidden = false;

				array.forEach(events, function(event){
					event.remove();
				});

				if(!forceClean)
				{
					query(".multiTip").forEach(function(tip){
						if(!$(tip).hasClass('selected'))
							$(tip).remove();
					});
					query(".mtArrow").forEach(function(arrow){
						if(!$(arrow).hasClass('selected'))
							$(arrow).remove();
					});
				} else{
					query(".multiTip").forEach(function(tip){
						$(tip).remove();
					});
					query(".mtArrow").forEach(function(arrow){
						$(arrow).remove();
					});
					forceHidden = true;
				}
			}

			function refreshTips(extent, forceVisible)
			{
				array.forEach(settings.pointArray, function(pt, i){
					if (extent.contains(pt.geometry) && (isTipVisible(i) || forceVisible))
						displayTip(settings.map.toScreen(pt.geometry), i, settings);
					else
						hideTip(i);
				});
			}

			function refreshTips2(extent, delta)
			{
				array.forEach(settings.pointArray, function(pt, i){
					if( extent.contains(pt.geometry) ) {
						var pointScreen = settings.map.toScreen(pt.geometry);
						pointScreen.x += delta.x;
						pointScreen.y += delta.y;
						displayTip(pointScreen, i, settings);
					}
					else
						hideTip(i);
				});
			}

			function hideAll()
			{
				query(".multiTip, .mtArrow").forEach(function(node){
					if(!$(node).hasClass('selected'))
						node.style.display = "none";
				});
			}

			function hideTip(index)
			{
				if(!dom.byId('multiTip' + index))
					return
				if(domStyle.get(dom.byId('multiTip' + index), "display") == "none" )
					return;

				domStyle.set(dom.byId('multiTip' + index), "display", "none");
				domStyle.set(dom.byId('arrow' + index), "display", "none");
			}

			function isTipVisible(index)
			{
				if(dom.byId('multiTip' + index))
					return domStyle.get(dom.byId('multiTip' + index), "display") == "block";
			}

			function displayTip(scrPt, i, settings)
			{
				if(!(dom.byId('multiTip' + i)))
					return;
				if( scrPt.x > settings.mapAuthorizedWidth || scrPt.y > settings.mapAuthorizedHeight ) {
					hideTip(i);
					return;
				}

				var newOffsetTop = (i === 0 && settings.selected) ? 44 : settings.offsetTop;

				if( has('ie') > 0 || (/Trident\/7\./).test(navigator.userAgent))
					newOffsetTop += 10;

				var width  = domStyle.get("multiTip" + i, "width");
				var height = domStyle.get("multiTip" + i, "height");

				// TODO fix
				if( has("ie") == 8 ) {
					width -= 7;
					height -= 14;
				}

				if( ! width || ! height ) {
					domStyle.set(dom.byId('multiTip' + i), "display", settings.visible ? "block" : "none");
					domStyle.set(dom.byId('arrow' + i), "display", settings.visible ? "block" : "none");

					width  = domStyle.get("multiTip" + i, "width");
					height = domStyle.get("multiTip" + i, "height");
				}

				if( settings.minWidth && width < settings.minWidth )
					width = settings.minWidth;

				if (settings.labelDirection != "auto"){
					if (settings.labelDirection == "left")
						labelLeft(scrPt, i, settings, width, height);
					else if (settings.labelDirection == "right")
						labelRight(scrPt, i, settings, width, height);
					else if (settings.labelDirection == "down")
						labelDown(scrPt, i, settings, width, height);
					else
						labelUp(scrPt, i, settings, width, height, newOffsetTop);
				}
				else {
					// Manage top left not authorized space for the zoom control
					if(scrPt.x < ((width / 2) + 25 + settings.offsetSide + settings.topLeftNotAuthorizedArea[0]) && scrPt.y < settings.topLeftNotAuthorizedArea[1] + height ) {
						if(scrPt.y  < height - 15 || (scrPt.x < 25 + 10 + settings.topLeftNotAuthorizedArea[0]  && scrPt.y < settings.topLeftNotAuthorizedArea[1]) ) {
							hideTip(i);
							return;
						}
						else
							labelRight(scrPt, i, settings, width, height);
					}

					else if (scrPt.x < ((width / 2) + 25 + settings.offsetSide)) {
						if(scrPt.y  < height - 15 || scrPt.y > settings.mapAuthorizedHeight - (height/2) - 10) {
							hideTip(i);
							return;
						}
						labelRight(scrPt, i, settings, width, height);
					}
					else if (scrPt.x > (settings.mapAuthorizedWidth - (width /2) - 10)){
						if(scrPt.y  < height - 15 || scrPt.y > settings.mapAuthorizedHeight - (height/2) - 10) {
							hideTip(i);
							return;
						}
						else
							labelLeft(scrPt, i, settings, width, height);
					}
					else if (scrPt.x < (settings.mapAuthorizedMinWidth + (width /2))){
						if(scrPt.y  < height - 15 || scrPt.y > settings.mapAuthorizedHeight - (height/2) - 10 || scrPt.x < settings.mapAuthorizedMinWidth) {
							hideTip(i);
							return;
						}
						else
							labelRight(scrPt, i, settings, width, height);
					}
					else if (scrPt.y > (height + 25 + newOffsetTop))
						labelUp(scrPt, i, settings, width, height, newOffsetTop);
					else
						labelDown(scrPt, i, settings, width, height);
				}

				domStyle.set(dom.byId('multiTip' + i), "display", settings.visible ? "block" : "none");
				domStyle.set(dom.byId('arrow' + i), "display", settings.visible ? "block" : "none");
			}

			function labelDown(scrPt, i, settings, width)
			{
				domStyle.set('multiTip' + i, {
					top: (scrPt.y + 3 + settings.offsetBottom) + 'px',
					left: (scrPt.x - (width/2) - 5) + 'px'
				});

				domStyle.set('arrow' + i, {
					left: (scrPt.x - 10) + 'px',
					top: (scrPt.y + settings.offsetBottom - 5) + 'px',
					borderLeft: "10px solid transparent",
					borderRight: "10px solid transparent",
					borderBottom: "10px solid",
					borderBottomColor: (i === 0 && settings.selected) ? app.cfg.SELECTED_POPUP_ARROW_COLOR : settings.pointerColor,
					borderTop: "none"
				});
			}

			function labelUp(scrPt, i, settings, width, height, newOffsetTop)
			{
				domStyle.set('multiTip' + i, {
					top: (scrPt.y - height - 10 - newOffsetTop) + 'px',
					left: (scrPt.x - (width/2) + 0) + 'px'
				});

				if(has('ie') > 0 || (/Trident\/7\./).test(navigator.userAgent))
					newOffsetTop -= 10;

				domStyle.set('arrow' + i, {
					left: (scrPt.x - 10) + 'px',
					top: (scrPt.y - 10 - newOffsetTop) + 'px',
					borderLeft: "10px solid transparent",
					borderRight: "10px solid transparent",
					borderTop: "10px solid",
					borderTopColor: (i === 0 && settings.selected) ? app.cfg.SELECTED_POPUP_ARROW_COLOR : settings.pointerColor,
					borderBottom: "none"
				});
			}

			function labelRight(scrPt, i, settings, width, height)
			{
				var selectedTopOffset = (i === 0 && settings.selected) ? 5 : 0;
				domStyle.set('multiTip' + i, {
					top: (scrPt.y - 22 - selectedTopOffset - ((height-10) / 2)) + 'px',
					left: (scrPt.x + 17 + settings.offsetSide) + 'px'
				});

				domStyle.set('arrow' + i, {
					left: (scrPt.x + 8 +  settings.offsetSide) + 'px',
					top: (scrPt.y - 26 - selectedTopOffset) + 'px',
					borderTop: "10px solid transparent",
					borderBottom: "10px solid transparent",
					borderRight: "10px solid",
					borderRightColor: (i === 0 && settings.selected) ? app.cfg.SELECTED_POPUP_ARROW_COLOR : settings.pointerColor,
					borderLeft: "none"
				});
			}

			function labelLeft(scrPt, i, settings, width, height)
			{
				var selectedTopOffset = (i === 0 && settings.selected) ? 5 : 0;
				domStyle.set('multiTip' + i, {
					top: (scrPt.y - 22 - selectedTopOffset - ((height-10) / 2)) + 'px',
					left: (scrPt.x - 18 - width - settings.offsetSide) + 'px'
				});

				domStyle.set('arrow' + i, {
					left: (scrPt.x - 18 - settings.offsetSide) + 'px',
					top: (scrPt.y - 26 - selectedTopOffset) + 'px',
					borderTop: "10px solid transparent",
					borderBottom: "10px solid transparent",
					borderLeft: "10px solid",
					borderLeftColor: (i === 0 && settings.selected) ? app.cfg.SELECTED_POPUP_ARROW_COLOR : settings.pointerColor,
					borderRight: "none"
				});
			}
		};
	}
);
