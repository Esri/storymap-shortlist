define(["lib-build/css!./Header"
	],
	function(
	){
		return function Header(container)
		{
			this.init = function(params)
			{
				params = params || {};

				container.find('.title').html(params.title);
			};

			this.update = function()
			{
				//
			};

			function initEvents()
			{
				//
			}

			initEvents();
		};
	}
);
