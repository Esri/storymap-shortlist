define(["lib-build/tpl!./InitPopup",
		"lib-build/css!./InitPopup",
		"dojo/Deferred"
	],
	function (
		viewTpl,
		viewCss,
		Deferred
	){
		return function InitPopup(container)
		{
			container.append(viewTpl({
				title: i18n.builder.initPopup.title + '<span class="builder-logo"></span>'
			}));

			var _initCompleteDeferred = null,
				_btnNext = container.find(".btnNext");

			initEvents();

			this.init = function()
			{
				//
			};

			this.present = function()
			{
				_initCompleteDeferred = new Deferred();

				_btnNext.removeAttr("disabled");
				_btnNext.html(i18n.builder.initPopup.startBtn).show();
				_btnNext.click(showNextView);

				container.modal({keyboard: false});
				showNextView();

				return _initCompleteDeferred;
			};

			function showNextView()
			{
				if(_initCompleteDeferred){
					_initCompleteDeferred.resolve({
						ok: true,
						pickWebmap: false
					});
				}		
			}

			function enterEvent(e)
			{
				e.keyCode == 13 && showNextView();
			}

			function initEvents()
			{
				$("body").bind("keydown", enterEvent);
			}

			this.initLocalization = function()
			{
				//
			};
		};
	}
);
