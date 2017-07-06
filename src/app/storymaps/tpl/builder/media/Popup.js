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
				btnBack: i18n.commonCore.common.back,
				selectAll: i18n.builder.detailPanelBuilder.selectAll
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
					container.find(".modal-title").text(i18n.builder.detailPanelBuilder.importImages);
					container.find('.btnSubmit')
						.html(i18n.builder.detailPanelBuilder.import)
						.show();
					container.find('.btnCancel').show();
				}
				else if(_mode == "add"){
					container.find(".modal-title").text(i18n.builder.detailPanelBuilder.chooseImage);
					container.find('.btnSubmit')
						.html(i18n.builder.addEditPopup.add)
						.hide();
					container.find('.btnCancel').hide();
					container.find('.opt-select-all-container').hide();
				}

				_viewMediaSelector.present({
					mode: cfg.mode,
					webmaps: null,
					media: cfg.mode == "edit" ? cfg.edit.media : cfg.media,
					keepLastDataSource: true
				}, function(){});

				container.find(".modal-content").css("min-height", contentHeight);

				container.modal({keyboard: true});
				return _dialogDeferred;
			};

			function updateSubmitButton(mode)
			{
				if(mode && mode != 'image')
					_mode = mode;
				if($(container).find('.opt-select-all-container').css('display') == 'none' && $(container).find('.mediaSelectorConfigureContainer').css('display') == 'none')
					_mode = 'add';
				var imageSelected = false;
				var data = _viewMediaSelector.getData();

				if (data && data.media && data.media.image && data.media.image.url && data.media.image.thumb_url) {
					imageSelected = true;
				}
				else if (data && data.length) {
					imageSelected = true;
				}

				container.find(".btnSubmit").attr(
					"disabled",
					! imageSelected
				);
				// TODO need to know the view, if URL, dont onClickSubmit()
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
