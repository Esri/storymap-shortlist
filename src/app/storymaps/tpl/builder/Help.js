define([
	"lib-build/tpl!./Help",
	"lib-build/css!./Help"
],
function (
	viewTpl,
	viewCss
) {
	return function Help(container)
	{
		container.append(viewTpl({
			title: 'Help',
			btnClose: i18n.commonCore.common.close
		}));

		this.present = function()
		{
			container.modal({
				keyboard: true
			});
		};
	};
});
