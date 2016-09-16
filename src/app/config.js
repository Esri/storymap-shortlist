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
	COLOR_ORDER: "green,red,blue,purple,black,brown,orange,yellow,green,red,blue,purple,black,brown,orange,yellow", // will only use as many colors as you have tabs
	/*COLOR_SCHEMES: [
			{name:"blue",iconDir:"blue",iconPrefix:"NumberIconb",color:"#177ff1"},
			{name:"red2",iconDir:"red",iconPrefix:"NumberIconr",color:"#fd2d29"},
			{name:"green2",iconDir:"green",iconPrefix:"NumberIcong",color:"#22880d"},
			{name:"purple",iconDir:"purple",iconPrefix:"NumberIconp",color:"#9c46fd"},
			{name:"black",iconDir:"black",iconPrefix:"NumberIconK",color:"#000000"}
	],*/

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
	//
	// Specify point feature layers on your map that do NOT define a tab in the Shortlist.
	// These point layers will be displayed as supporting layers.
	// If there's more than one layer, use the "|" character as delimiter
	POINT_LAYERS_NOT_TO_BE_SHOWN_AS_TABS: "TrolleyStations",
	//
	// Specify supporting feature layers in your map that will be clickable in the Shortlist.
	// These layers must use the Shortlist attribute schema for their popups to appear.
	// If there's more than one layer, use the "|" character as delimiter
	SUPPORTING_LAYERS_THAT_ARE_CLICKABLE: "TrolleyLines"/*"Neighborhoods|Beaches|Parks|Ferries|TrolleyStations|TrolleyLines"*/,
	//
	// Specify tab specific supporting layers to be shown for an individual tab.
	TAB_SPECIFIC_SUPPORT_LAYERS: {
		/*tab1: ['Neighborhoods', 'Beaches', 'TrolleyStations'],
		tab2: ['Parks', 'Ferries','TrolleyLines']*/
	},
	// Location button that locates user (on supported browsers)
	GEOLOCATOR: false,
	//
	// If the tabs are defined using a single layer, you can optionally use these parameters to
	// override the tab order and names defined in that layer without editing the layer.
	// If you specify TAB_NAMES: a) all tabs must be included in TAB_NAMES, whether or not
	// you want to rename them, b) TAB_ORDER must be specified too,
	// c) TAB_NAMES order must correspond with TAB_ORDER. For example:
	// var TAB_ORDER = ['Design', 'Fun', 'Food'];
	// var TAB_NAMES = [
		// {'Design': 'Design'},
		// {'Fun': 'Activities'},
		// {'Food': 'Snacks'}
	// ];
	TAB_ORDER: [],
	TAB_NAMES: [],
	//

	/*lutIconSpecs: {
		tiny: new iconSpecs(28,31,5,12),
		medium: new iconSpecs(31,35,5,13),
		large: new iconSpecs(40,44,7,18)
	},*/

	lutIconSpecs: {
		tiny: new iconSpecs(31,34,6,13),
		medium: new iconSpecs(34,38,7,15),
		large: new iconSpecs(44,48,9,20)
	},

	ICON_SRC: "resources/tpl/viewer/icons/staticIcon/BannerRed.png",

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
		facebook: true,
		picasa: true,
		youtube: true
	},

	// Online photo sharing services connection parameters
	FLICKR_API_KEY: "750b36a2ac65a72e03cf9cef06d79f45",
	// The Facebook ID is only valid on arcgis.com domain
	// If used on another domain, user will have an error in the Facebook popup after login
	// To use Facebook import on Portal for ArcGIS, create your own ID at https://developers.facebook.com/
	// or set AUTHORIZED_IMPORT_SOURCE.facebook to false
	//FACEBOOK_APP_ID: "1403302059961274",
	// TODO
	FACEBOOK_APP_ID: "136455649889009",
	// This Youtube key is valid for application running on arcgis.com and esri.com domains
	// If the application is deployed on Portal for ArcGIS or your own server, the Youtube api call
	//  won't be perfomed until you set the following flag and provide your own key
	YOUTUBE_DISABLE_ON_PORTAL: true,
	YOUTUBE_API_KEY: "AIzaSyDevTFP16nz6sA-akiOVi6wWXiplJnQ4qw",

	//
	// Builder direct creation
	//

	// Text to be used as the browser page title during app creation
	TPL_NAME: "Shortlist",
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

function iconSpecs (width,height,offset_x,offset_y)
{

	var _width = width;
	var _height = height;
	var _offset_x = offset_x;
	var _offset_y = offset_y;

	this.getWidth = function() {
		return _width;
	};

	this.getHeight = function() {
		return _height;
	};

	this.getOffsetX = function() {
		return _offset_x;
	};

	this.getOffsetY = function() {
		return _offset_y;
	};

};
