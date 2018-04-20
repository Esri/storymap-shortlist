define(["lib-build/tpl!./Geocode",
		"lib-build/css!./Geocode",
		"lib-build/css!../../Common",
		"storymaps/common/utils/CommonHelper",
		"storymaps/common/utils/MovableGraphic",
		"esri/map",
		"esri/dijit/Geocoder",
		"esri/layers/GraphicsLayer",
		"esri/graphic",
		"esri/geometry/Point",
		"esri/symbols/PictureMarkerSymbol",
		"dojo/_base/lang",
		"dojo/on",
		"dojo/Deferred"],
	function (
		viewTpl,
		viewCss,
		commonCss,
		CommonHelper,
		MovableGraphic,
		Map,
		Geocoder,
		GraphicsLayer,
		Graphic,
		Point,
		PictureMarkerSymbol,
		lang,
		on,
		Deferred
	){
		return function Geocode(container)
		{
			container.append(viewTpl({
				lblTitle: i18n.commonMedia.editorActionGeocode.lblTitle,
				mapMarkerExplain: i18n.commonMedia.editorActionGeocode.mapMarkerExplain,
				btnOk: i18n.commonCore.common.apply,
				btnCancel: i18n.commonCore.common.cancel
			}));

			var _cfg = null,
				_map = null,
				_geocoderGraphic = null,
				_dialogDeferred = null;

			initEvents();

			this.present = function(cfg, contentHeight)
			{
				_cfg = cfg;
				_dialogDeferred = new Deferred();

				initMap(_cfg.mode == "add" ? _cfg.zoom : null);

				container.find(".mapMarker").prop('checked', _cfg.mode == "add" || _cfg.edit.zoom.mapMarker);

				container.find(".modal-content").css("min-height", Math.max(contentHeight, 539));

				container.modal({keyboard: true});
				return _dialogDeferred;
			};

			function onClickSubmit()
			{
				var hasError = false;

				if ( ! hasError ) {
					_dialogDeferred.resolve({
						id: _cfg.mode == "add" ? "MJ-ACTION-" + Date.now() : null,
						text: _cfg.text,
						zoom: {
							center: _geocoderGraphic.geometry,
							level: _map.getLevel(),
							mapMarker: container.find(".mapMarker").prop('checked')
						}
					});
					container.modal('toggle');
				}
			}

			function initMap(currentZoomConfig)
			{
				if ( ! app.map || ! app.map.layerIds || ! app.map.layerIds.length )
					return;

				var startingPointInfo = currentZoomConfig ? currentZoomConfig.center : app.map.extent.getCenter();
				var marker = new PictureMarkerSymbol(app.cfg.SECTION_ACTION_ZOOM_MAP_MARKER, 32, 32);

				_geocoderGraphic = new Graphic(new Point(startingPointInfo), marker);

				if ( _map ) {
					container.find('#esri_dijit_Geocoder_0_input').val(/*value*/ '');
					var lyr = _map.getLayer('geocode-lyr');
					if (lyr) {
						lyr.clear();
						lyr.add(_geocoderGraphic);
					}
					_map.setExtent(app.map.extent);
					return;
				}

				_map = new Map(container.find(".map")[0], {
					slider: true,
					//center: _tempItemData.point,
					//zoom: app.map.getLevel(),
					extent: app.map.extent
					// iOS requirement
					//autoResize: false
				});

				// Add a basemap - copy first layer, default to light grey canvas if bing or not tile/dynamic
				_map.addLayer(CommonHelper.cloneLayer(app.map.getLayer(app.map.layerIds[0])));

				var pointLayer = new GraphicsLayer({id: 'geocode-lyr'});

				pointLayer.add(_geocoderGraphic);
				_map.addLayer(pointLayer);

				// Edit Point Location
				on.once(_map, "update-end", function() {
					_map.disableKeyboardNavigation();
					new MovableGraphic(
						_map,
						pointLayer,
						_geocoderGraphic,
						function(e){
							_geocoderGraphic.setGeometry(e.geometry);
							if( ! _map.extent.contains(e.geometry) )
								_map.centerAt(e.geometry);
						}
					);
				});

				//
				// Geocoder
				//

				CommonHelper.createGeocoder({
					map: _map,
					domNode: container.find(".geocoder")[0],
					placeHolder: i18n.commonMedia.editorActionGeocode.lblTitle
				}).then(function(geocoder) {
					on(geocoder, "select-result", function(response){
						//console.log('select', response.result)
						if( response.result && response.result.feature )
							applyGeocodeResult(response.result.feature.geometry);
					});
				});

				container.on('shown.bs.modal', function () {
					_map.resize();
				});
			}

			var applyGeocodeResult = function(geom)
			{
				_geocoderGraphic.setGeometry(geom);

				//if( ! _map.extent.contains(geom) )
				//	_map.locatePointFromMapExtent = true;
			};

			function initEvents()
			{
				container.find(".btnSubmit").click(onClickSubmit);
			}

			this.initLocalization = function()
			{
				//
			};
		};
	}
);
