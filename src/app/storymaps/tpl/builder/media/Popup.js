define(["lib-build/tpl!./Popup",
		"lib-build/css!./Popup",
		"storymaps/common/builder/media/MediaSelector",
		"dojo/Deferred"],
	function (
		viewTpl,
		viewCss,
		MediaSelector,
		Deferred
	){
		return function Media(container)
		{
			container.append(viewTpl({
				lblTitle: "",
				btnCancel: i18n.commonCore.common.cancel,
				btnBack: i18n.commonCore.common.back
			}));

			var _cfg = null,
				_dialogDeferred = null,
				_mode = null,
				_viewMediaSelector = new MediaSelector(
					container.find('.viewMediaSelectorContainer'),
					null,
					true,
					updateSubmitButton,
					container.find('.btn-back')
				);

			initEvents();

			this.present = function(cfg, contentHeight)
			{
				_cfg = cfg;
				_dialogDeferred = new Deferred();
				_mode = _cfg.mode;

				if(_mode == "import"){
					container.find(".modal-title").text("Import images");
					container.find('.btnSubmit')
						.html("Import")
						.show();
					container.find('.btnCancel').show();
				}
				else if(_mode == "add"){
					container.find(".modal-title").text("Insert an image");
					container.find('.btnSubmit')
						.html("Add")
						.hide();
					container.find('.btnCancel').hide();
					container.find('.opt-select-all-container').hide();
				}

				_viewMediaSelector.present({
					mode: cfg.mode,
					webmaps: null,
					media: cfg.mode == "edit" ? cfg.edit.media : null,
					keepLastDataSource: true
				}, function(){});

				container.find(".modal-content").css("min-height", contentHeight);

				container.modal({keyboard: true});
				return _dialogDeferred;
			};

			function updateSubmitButton()
			{
				var imageSelected;
				var data = _viewMediaSelector.getData();
					imageSelected = false;

				if (data && data.media && data.media.image) {
					imageSelected = true;
				}
				else if (data && data.length) {
					imageSelected = true;
				}

				container.find(".btnSubmit").attr(
					"disabled",
					! imageSelected
				);

				if (imageSelected && _mode == 'add') {
					onClickSubmit();
				}
			}

			function onClickSubmit()
			{
				var hasError = _viewMediaSelector.checkError(container.find(".btnSubmit"));

				var postErrorCheck = function()
				{
					var data = _viewMediaSelector.getData();

					if (_mode == "import") {
						_dialogDeferred.resolve(data);
					}
					else {
						_dialogDeferred.resolve(data.media[data.media.type]);
					}

					container.modal('toggle');
				};

				if ( hasError instanceof Deferred ) {
					hasError.then(function(hasError){
						if ( ! hasError )
							postErrorCheck();
					});
				}
				else if ( ! hasError )
					postErrorCheck();
			}

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
