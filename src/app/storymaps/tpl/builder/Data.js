define([
	"lib-build/tpl!./Data",
	"lib-build/css!./Data"],
	function (
		viewTpl,
		viewCss
	) {
		return function Workflow(container)
		{
			var _initDone = false;

			this.present = function(cfg)
			{
				container.find('.modal-body').empty();
				container.find('.modal-body').append(viewTpl());
				initUI();
			};

			this.close = function()
			{

			};

			function onClickApply()
			{
				console.log("$$$")
			}

			function initUI()
			{
				container.find('.btnNext').attr('disabled');
				container.find('.btnNext').click(onClickApply);

				_initDone = true;
			}
		};
	}
);
