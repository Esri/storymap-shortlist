define(["lib-build/tpl!./TestPanel",
		"lib-build/css!./TestPanel",
		"lib-build/css!./Common"
	],
	function(viewTpl){
		return function TestPanel(container, isInBuilder, saveData)
		{
			this.init = function(p)
			{
				p = p || {};

				container.html(viewTpl({ }));

				container.show();

				isInBuilder && initBuilder();

				initEvents();
			};

			this.update = function(p)
			{
				p = p || {};

				container.find(".userInput").html(p.data);
			};

			this.resize = function()
			{
				//
			};

			this.showEntryIndex = function()
			{
				//
			};

			this.destroy = function()
			{
				//
			};

			function initBuilder()
			{
				container.find(".userInput").attr("contenteditable", "true");
			}

			function initEvents()
			{
				if ( isInBuilder ) {
					container.find(".userInput").blur(function(){
						saveData($(this).html());
					});
				}
			}
		};
	}
);
