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
			title: i18n.builder.help.title,
			shortlistHelp1: i18n.builder.help.shortlistHelp1,
			shortlistHelp2: i18n.builder.help.shortlistHelp2,
			shortlistHelp3: i18n.builder.help.shortlistHelp3,
			shortlistHelp4: i18n.builder.help.shortlistHelp4,
			shortlistHelp5: i18n.builder.help.shortlistHelp5,
			shortlistHelp6: i18n.builder.help.shortlistHelp6,
			shortlistFAQ: i18n.builder.help.shortlistFAQ,
			geonetForum: i18n.builder.help.geonetForum,
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
