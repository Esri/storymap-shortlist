define([
	"lib-build/tpl!./Workflow",
	"lib-build/css!./Workflow",
	"./Data"],
	function (
		viewTpl,
		viewCss,
		Data
	) {
		return function Workflow(container)
		{
			var _initDone = false;
			var _data = new Data(container);

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
				console.log("$$$");
				_data.present();
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
