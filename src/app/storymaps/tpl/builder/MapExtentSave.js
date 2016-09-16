define([
	"lib-build/tpl!./MapExtentSave",
	"lib-build/css!./MapExtentSave",
	"storymaps/common/utils/CommonHelper",
	"esri/geometry/Extent",
	"dojo/topic"],
	function (
		viewTpl,
		viewCss,
		CommonHelper,
		Extent,
		topic
	) {
		return function MapExtentSave(container, builderView)
		{
			var _this = this;
			var _commonHelper = CommonHelper;
			var _builderView = builderView;

			this.init = function()
			{
				$('#map_zoom_slider').append(viewTpl());
				initUI();
			};

			this.initDone = false;

			this.present = function()
			{
				//container.find('.modal-body').empty();
				//container.find('.modal-body').append(viewTpl());
				initUI();
			};

			this.show = function()
			{
				$('.home-location-save-btn').show();
			};

			this.reinit = function()
			{
				$('.home-location-save-btn').css('visibility', 'visible');
				$('.home-location-save-btn').show();
			};

			this.hide = function()
			{
				$('.home-location-save-btn').hide();
			};

			this.hideAlways = function()
			{
				$('.home-location-save-btn').css('visibility', 'hidden');
			};

			function onClickApply()
			{
				_this.hide();
				app.data.getWebMap().item.extent = _builderView.serializeExtentToItem(app.map.extent);
				//app.map._params.extent = new Extent(JSON.parse(JSON.stringify(app.map.extent.toJson())));
				app.data.getWebAppData().setMapExtent(app.map.extent);
				$.each(app.data.getStory(), function(index){
					app.data.setStory(index, null, null, app.map.extent);
				});
				//app.map.setExtent(app.map.extent, true);
				topic.publish("BUILDER_INCREMENT_COUNTER", 1);
			}

			function initUI()
			{
				//container.find('.btnNext').attr('disabled');
				$('.home-location-save-btn').click(onClickApply);

				app.map.on('extent-change', function(){
					var currentExtent = _commonHelper.serializeExtentToItem(app.map.extent);
					if(!_commonHelper.serializedExtentEquals(currentExtent, app.data.getWebMap().item.extent))
						setTimeout(function(){
							_this.show();
						}, 250);
					else{
						_this.hide();
					}
				});

				_this.initDone = true;
			}
		};
	}
);
