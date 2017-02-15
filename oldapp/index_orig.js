<!DOCTYPE html> 
<html>
<head>

<title>Shortlist</title>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=10,chrome=1">
		
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">

<link type="image/ico" rel="shortcut icon" href="//resources.esri.com/favicon.ico">
<link type="image/ico" rel="icon"  href="//resources.esri.com/favicon.ico">

<!-- 
	To correctly reference your application in search engine:
	 - create and fill out extensively an ArcGIS.com item that link to your final application
	 - edit the following four tags as well as the upper title tag on line 4
-->
<meta name="description" content="This story map was created with the Esri Shortlist application.">

<!-- Facebook sharing -->
<meta property="og:title" content="Shortlist"/>
<meta property="og:description" content="This story map was created with the Esri Shortlist application."/>
<meta property="og:image" content="images/esri-globe.png">

<link rel="stylesheet" type="text/css" href="http://js.arcgis.com/3.8/js/esri/css/esri.css" />
<link rel="stylesheet" type="text/css" href="http://js.arcgis.com/3.8/js/dojo/dijit/themes/claro/claro.css">
<link rel="stylesheet" type="text/css" href="colorbox/colorbox.css">
<link rel="stylesheet" type="text/css" href="lib/idangerous.swiper.css">
<link rel="stylesheet" type="text/css" href="css/style.css">
<link rel="stylesheet" type="text/css" href="css/responsive.css">

<script type="text/javascript" src="lib/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="lib/IconSpecs.js"></script>
<script type="text/javascript" src="lib/common/helper_functions.js"></script>
<script type="text/javascript" src="lib/jquery.animate-colors-min.js"></script>
<script type="text/javascript" src="lib/idangerous.swiper.js"></script>
<script type="text/javascript">var djConfig = {parseOnLoad: true};</script>
<script type="text/javascript" src="http://js.arcgis.com/3.8/"></script>
<script type="text/javascript" src="colorbox/jquery.colorbox-min.js"></script>
<script type="text/javascript" src="app/main.js"></script>

<!--Google Analytics Start-->
<script type="text/javascript">
  if (window.location.href.toLowerCase().indexOf("storymaps.esri.com") >= 0) {
	  var _gaq = _gaq || [];
	  _gaq.push(['_setAccount', 'UA-26529417-1']);
	  _gaq.push(['_trackPageview']);
	
	  (function() {
		 var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		   ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();
  }
</script>
<!--Google Analytics End-->

<script type="text/javascript">
var version = '1.3';
/******************************************************
********************  config section ******************
*******************************************************/
var WEBMAP_ID = "1966ef409a344d089b001df85332608f";
var BOOKMARKS_ALIAS = "Zoom";
var COLOR_ORDER = "green,red,blue,purple"; // will only use as many colors as you have tabs
var DETAILS_PANEL = false;  // specifies whether or not popups have a link to a separate Details panel
//
// Specify shapefile or CSV point layer(s) on your map that do NOT define a tab in the shortlist. 
// If there's more than one layer, use the "|" character as delimiter
var POINT_LAYERS_NOT_TO_BE_SHOWN_AS_TABS = "";
//
// Specify shapefile or CSV layer(s) in your map that will be clickable in the Shortlist
// If there's more than one layer, use the "|" character as delimiter
var SUPPORTING_LAYERS_THAT_ARE_CLICKABLE = "";
//
// Location button that locates user (on supported browsers)
var GEOLOCATOR = false;

/******************************************************
******************  end config section ****************
*******************************************************/

</script>

</head>

<body class="claro">

    <!-- Header Section-->
    <div id="header">
      <div id="headerText">
	    <h1 id="title"></h1>
	    <h2 id="subtitle"></h2>
      </div>
      <div id="logoArea">
        <!--<div id="social"><a id="msLink" href="http://storymaps.arcgis.com" target="_blank">A story map </a><span  class='st_facebook' ></span><span  class='st_twitter' ></span>
        </div> -->
		<div id="social">
			<a id="msLink" href="http://storymaps.arcgis.com" target="_blank">A story map </a>
			<i class="shareIcon share_facebook socialIcon-facebook-squared-1"></i>
			<i class="socialIcon-twitter-1 shareIcon share_twitter"></i>
			<i class="socialIcon-link shareIcon share_bitly" id="bitlyIcon" title="Get a short link to the application"></i>
			<div class="popover fade left in" style="display: none;">
				<div class="arrow"></div>
				<div class="popover-content" id="bitlyContent">
					<div style="width:150px; height:30px">  
						<input id="bitlyInput" type="text" value="" style="width: 150px;">
					</div> 
				</div>
			</div>
		</div>
        <div id="logo"><a id="logoLink" href="http://www.esri.com" target="_blank"><img id="logoImg" src="images/Logo.png" alt="Esri - Home"></a></div>
      </div>
    </div>
	
    <div id="mobileTitlePage"></div>
	
 	<div id="mainWindow">	
        <div id="divStrip">
            <div id="tabs"></div>
            <div id="bookmarksCon">
                <div id="bookmarksToggle"><p id="bookmarksTogText"></p></div>
                <div id="bookmarksDiv">
                </div>
            </div>
        </div>
		<div id="mobileBookmarksCon">
        	<div id="mobileBookmarksToggle"><p id="mobileBookmarksTogText"></p></div>
            <div id="mobileBookmarksDiv"></div>
		</div>
        
        <div id="paneLeft">
            <ul id="myList" class="tilelist"></ul>
			<div class="noFeature">
			<span class="noFeatureText">
				<!--There are no features within the current map extent.  
				Click on the home button to return to the initial extent.-->
				None of these places are in your current map extent.
				Zoom out to see places.
			</span>
			<!--<div id="homeIcon">
				<span class='icon-home'></span>
			</div>-->
		</div>
        </div>

        <div id="map">
            <div id="zoomToggle">
                <div id="zoomIn">+</div>
                <div id="zoomExtent">
					<img id="zoomExtentImg" src="images/ZoomHome.png">
				</div>
                <div id="zoomOut">-</div>
				<div id="locateButton">
					<img id="locateImage" src="images/locateButton.png">
				</div>
				
            </div><!--?zoomToggle-->    
			
            <div id="hoverInfo"></div>
			
		</div>
		
		<div id="mobileThemeBar">
			<div id="navThemeLeft">
				<span class='icon-arrow-left'></span>
			</div>
			<div id="navThemeRight">
				<span class='icon-arrow-right'></span>
			</div>
			<div class="swiper-container">
  				<div class="swiper-wrapper"></div>
			</div>
			<div id='returnIcon'>
				<i class='icon-list'></i>
			</div>
			<div id="returnHiddenBar"></div>
			<div id="centerMapIconContainer">
				<div id='centerMapIcon'>
					<i class='icon-contract'></i>
				</div>
			</div>
		</div>
		
		<div id="mobilePaneList">
            <ul id="mobileList" class="mobileTileList"></ul>
			<div class="noFeature">
			<span class="noFeatureText">
				<!--There are no features within the current map extent.  
				Click on the home button to return to the initial extent.-->
				None of these places are in your current map extent.
				Zoom out to see places.
			</span>
			<!--<div id="homeIcon">
				<span class='icon-home'></span>
			</div>-->
		</div>
        </div>
		
		<div id="mobileFeature">
			<div class="swiper-container">
  				<div class="swiper-wrapper"></div>
			</div>
		</div>
		
		<div id="mobileSupportedLayersView"></div>
		
		<div id="mobilePaneFader"></div>
       
 	</div>

    <div id="whiteOut">
        <img id="loader" src="images/loader/loader.gif"/>
    </div>
    
</body>

</html>