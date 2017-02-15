app.cfg = {
	//
	// General UI
	//

	TIMEOUT_VIEWER_LOAD: 5000,
	TIMEOUT_VIEWER_REQUEST: 12000,
	TIMEOUT_BUILDER_REQUEST: 20000,

	// Control the social button configuration in builder
	// If disabled author won't be able to activate them
	// if disabled after the app has been created, this will override the settings
	HEADER_SOCIAL: {
		facebook: true,
		twitter: true,
		bitly: {
			enable: true,
			login: "arcgis",
			key: "R_b8a169f3a8b978b9697f64613bf1db6d"
		}
	},

	//
	// Shortlist
	//
	BOOKMARKS: false,
	BOOKMARKS_ALIAS: "Zoom",
	COLOR_ORDER: "green,red,blue,purple,black,brown,orange,yellow",

	COLOR_SCHEMES: [
			{name:"blue",color:"#425dac"},
			{name:"red",color:"#b82323"},
			{name:"green",color:"#37921e"},
			{name:"purple",color:"#874094"},
			{name:"black",color:"#000000"},
			{name:"orange",color:"#dc6800"},
			{name:"yellow",color:"#dab70c"},
			{name:"brown",color:"#A67455"}
	],
	NUMBERED: true,
	FILTER_BY_EXTENT: false, //When false, bad on iPhone

	ICON_SRC: "resources/tpl/viewer/icons/staticIcon/Banner.png",

	// Map popup colors
	POPUP_BACKGROUND_COLOR: "#666666",
	POPUP_BORDER_COLOR: "#666666",
	POPUP_ARROW_COLOR: "#666666",

	SELECTED_POPUP_BACKGROUND_COLOR: "#444444",
	SELECTED_POPUP_BORDER_COLOR: "#444444",
	SELECTED_POPUP_ARROW_COLOR: "#444444",

	LEFT_PANE_WIDTH_TWO_COLUMN: 335,
	LEFT_PANE_WIDTH_THREE_COLUMN: 490,
	LEFT_PANE_WIDTH_FOUR_COLUMN: 645,

	TWO_COLUMN_THRESHOLD: 1000,
	THREE_COLUMN_THRESHOLD: 1450,

	//
	// Layouts
	//

	LAYOUTS: [
		{
			id: "foo",
		}
	],

	/*
	 * Builder
	 */

	HELP_URL: "http://storymaps.arcgis.com/en/app-list/shortlist/",
	HELP_URL_PORTAL: "http://storymaps.arcgis.com",

	// Control the authorized data source (for initialization and import screen)
	AUTHORIZED_IMPORT_SOURCE: {
		flickr: true,
		picasa: true
	},

	// Online photo sharing services connection parameters
	FLICKR_API_KEY: "750b36a2ac65a72e03cf9cef06d79f45",

	//
	// Builder direct creation
	//

	// Text to be used as the browser page title during app creation
	TPL_NAME: "Shortlist",
	TPL_ID: "shortlist",
	WEBAPP_TAG: ["Story Map", "Shortlist"],
	WEBAPP_KEYWORD_GENERIC: ["JavaScript", "Map", "Mapping Site", "Online Map", "Ready To Use", "selfConfigured", "Web Map"],
	WEBAPP_KEYWORD_APP: ["Story Map", "Story Maps", "Shortlist"],

	//
	// Portal configuration
	//

	// Optional array of server that will leverage CORS (for developement or specific cross domain deployment)
	CORS_SERVER: [],

	BING_MAPS_KEY: "",
	HELPER_SERVICES: {
		geometry: {
			//url: location.protocol + "//utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
		},
		geocode: [
			/*
			{
				url: location.protocol + "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
				name: "My Geocoder"
			}
			*/
		]
	},

	// Edit those to set a custom sharing or proxy URL
	// You have to edit those only if your webmap is deployed on Portal for ArcGIS instance and if you are not deploying the template on the Portal webserver
	// If you are using ArcGIS Online or deploying the template on a Portal instance, you don't have to edit those URL
	DEFAULT_SHARING_URL: "//www.arcgis.com/sharing/content/items",
	//DEFAULT_SHARING_URL: "//portal.internal.com/arcgis/sharing/content/items",
	DEFAULT_PROXY_URL: "//www.arcgis.com/sharing/proxy"
	//DEFAULT_PROXY_URL: "//portal.internal.com/arcgis/sharing/proxy"
};
