define(["lib-build/css!./MapCommand",
		"dojo/has",
		"esri/geometry/Point",
		"dojo/on",
		"esri/symbols/PictureMarkerSymbol",
		"esri/layers/GraphicsLayer",
		"esri/graphic",
		"esri/config"
	],
	function(viewCss, has, Point, on, PictureMarkerSymbol, GraphicsLayer, Graphic, esriConfig)
	{
		/**
		 * MapCommand
		 * @class MapCommand
		 *
		 * UI component that control the map display with +/home/- buttons and optional location button
		 * On touch device button are bigger
		 */
		return function MapCommand(map, homeClickCallback, locationButtonCallback, locationButtonEnabled)
		{
			//
			// Home/wait button
			//
			var tsUpdateStart = 0;
			var homeButton = $('<div class="esriSimpleSliderIncrementButton"><div class="mapCommandHomeBtn" title="' + (i18n.viewer.mapFromCommon ? i18n.viewer.mapFromCommon.home : 'Zoom Home') + '" role="button" tabindex="0"></div></div>');
			var locateSymbol = new PictureMarkerSymbol('app/storymaps/common/_resources/icons/mapcommand-location-marker.png', 21, 21);
			var locateLayer = new GraphicsLayer({id: 'locateLayer'});

			homeButton.click(function(){
				// Prevent using the home button while it's spinning
				if( tsUpdateStart !== 0 && $("body").hasClass("mobile-view") )
					return;

				if( homeClickCallback && typeof homeClickCallback == 'function' )
					homeClickCallback(map._params.extent);
				else
					map.setExtent(map._params.extent);
			});

			$(map.container).find('.esriSimpleSlider div:nth-child(1)').after(homeButton);

			on(map, "update-start", function(){
				if (tsUpdateStart === 0)
					toggleLoadingStatus(true);
			});

			on(map, "update-end", function(){
				toggleLoadingStatus(false);
			});

			this.setMobile = function(isMobile)
			{
				$(".esriSimpleSlider, .mapCommandHomeBtn", map.container).toggleClass("touch", !! isMobile);
			};

			this.destroy = function()
			{
				$(map.container).find('.esriSimpleSliderIncrementButton').remove();
				$(map.container).find('.mapCommandLocation').remove();
			};

			this.startLoading = function()
			{
				toggleLoadingStatus(true);
			};

			this.stopLoading = function()
			{
				toggleLoadingStatus(false);
			};

			this.enableLocationButton = function(enable)
			{
				$(map.container).toggleClass("has-locator", enable);
				$(".mapCommandLocation", map.container).toggleClass("hidden", ! enable);
			};

			function toggleLoadingStatus(start)
			{
				if( start ) {
					$(map.container).find('.mapCommandHomeBtn').addClass('loading');
					tsUpdateStart = Date.now();
				}
				else {
					var elapsed = Date.now() - tsUpdateStart;
					var delay = 0;

					if( elapsed < 450 )
						delay = 450 - elapsed;

					setTimeout(function(){
						$(map.container).find('.mapCommandHomeBtn').removeClass('loading');
						tsUpdateStart = 0;
					}, delay);
				}
			}

			function getDeviceLocation()
			{
				console.log("getDeviceLocation");

				var timeout = 10000,
					hasResultOrError = false;

				// Wait to display the loading indicator so it don't flash if result is super fast
				setTimeout(function(){
					if ( ! hasResultOrError )
						$(map.container).find('.mapCommandLocation').addClass('loading');
				}, 300);

				navigator.geolocation.getCurrentPosition(
					function(e) {
						hasResultOrError = true;
						$(map.container).find('.mapCommandLocation').removeClass('loading');

						var geom = new Point(e.coords.longitude, e.coords.latitude);

						// User callback
						if ( locationButtonCallback && typeof locationButtonCallback == 'function' )
							locationButtonCallback(true, geom, e);

						if ( map.spatialReference.wkid != 102100 && map.spatialReference.wkid != 4326 ) {
							esriConfig.defaults.geometryService.project([geom], map.spatialReference, function(features){
								if( ! features || ! features[0] )
									return;

								displayLocationPin(features[0]);
							});
							return;
						}
						else
							displayLocationPin(geom);
					},
					function(error){
						hasResultOrError = true;
						getDeviceLocationError(error);
					},
					{
						enableHighAccuracy: true,
						maximumAge: 60000 * 2, // 2mn
						timeout: timeout
					}
				);

				setTimeout(function(){
					if ( ! hasResultOrError )
						getDeviceLocationError();
				}, timeout);
			}

			function displayLocationPin(point)
			{
				locateLayer.clear();
				locateLayer.add(new Graphic( point, locateSymbol ));
				setTimeout(function(){
					$('#locateLayer_layer image').fadeOut({
						duration: 800
					});
				}, 10000);
			}

			function getDeviceLocationError(error)
			{
				console.log("getDeviceLocationError", error);

				$(map.container).find('.mapCommandLocation').removeClass('loading');
				locationButtonCallback(false, null);
			}

			// Geolocate button
			if( navigator && navigator.geolocation && (window.top !== window.self ? false : window.location.protocol.search('https') >= 0) ) {
				// TODO: to be done in CSS
				$(".esriSimpleSlider", map.container).after('<div class="esriSimpleSlider esriSimpleSliderVertical mapCommandLocation"></div>');
				$(".mapCommandLocation", map.container).click(getDeviceLocation);
				this.enableLocationButton(locationButtonEnabled);
				map.addLayer(locateLayer);
			}

			// Use bigger icon on touch devices
			this.setMobile(
				app.appCfg.mapCommandLargerTouch || app.appCfg.mapCommandLargerTouch === undefined
				&& has('touch')
			);
		};
	}
);
