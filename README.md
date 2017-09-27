Story Map Shortlist
================

The Story Map Shortlist app lets you organize points of interest into tabs that make it fun for users to explore what's in an area. Your users can click on the places either in the tabs or on the map to find out about them. The tabs automatically update as users navigate around the map to show them what's interesting in their current map extent.

![App](storytelling-shortlist-template-js.jpg)

[View it live:](http://story.maps.arcgis.com/apps/Shortlist/index.html?appid=d3b1ce838fd14312836166443c5314f4)


[Download](http://links.esri.com/storymaps/shortlist_template_zip) |
[Shortlist page on Esri Story Maps website](http://storymaps.arcgis.com/en/app-list/shortlist/)

**Latest release is version 2.4.3**, if you want to be informed of new releases, we recommend you to watch this repository ([see GitHub help](https://help.github.com/articles/watching-repositories)). See the [release page](https://github.com/Esri/shortlist-storytelling-template-js/releases) for release notes.

For more infomation about using and customizing Esri's Storytelling Apps follow the [Story Maps Developers' Corner](https://developerscorner.storymaps.arcgis.com).

## Help content

 * [Introduction](#introduction)
 * [Instructions](#instructions)
 * [Feedback / support](#feedback--support)
 * [FAQ](#faq)
 * [Configuration](#configuration)
 * [Issues](#issues)
 * [Contributing](#contributing)
 * [Licensing](#licensing)

## Introduction
A Shortlist application can be created from [ArcGIS Online](http://arcgis.com) or from the [Esri Story Maps website](http://storymaps.arcgis.com/). The Shortlist's data are stored in a Web Map (Places and their associated location, name, description, and picture information), and in a Web Application Item (Tab names and colors, application and header settings).
This repository provides the application source code for developers that want to customize Shortlist.

For more information about Shortlist, including a gallery of examples and a step-by-step tutorial, please see the [Shortlist](http://links.esri.com/storymaps/shortlist_app) page on the [Esri Story Maps website](http://storymaps.arcgis.com/).

## Instructions
First create your Shortlist in ArcGIS Online using the [step-by-step tutorial](http://storymaps.arcgis.com/en/app-list/shortlist/tutorial/).
Once your story is ready, you have to find its ID in ArcGIS Online. The ID is a 32 character string that you will find in your web browser's address bar when you are viewing your Shortlist.

![App ID](shortlist-help-application-id.png)

1. [Download the application](http://links.esri.com/storymaps/shortlist_template_zip)
2. Deploy the application on your webserver. See [FAQ](#how-to-deploy-the-application-on-a-web-server) for details
3. Edit index.html, find the configuration section on line 38 and paste in your application ID
4. Navigate to index.html (e.g., `http://127.0.0.1/Shortlist/index.html`)

Enjoy!
You can continue to use the builder in ArcGIS Online to modify your story.

## Feedback / support
We would love to hear from you!
* [StoryMaps Website](https://storymaps.arcgis.com/)
* [Story Maps community forum](http://links.esri.com/storymaps/story_maps_geonet)
* [Let us know about your story](https://storymaps.arcgis.com/en/gallery/submission-form/)
* [Story Maps Developers' Corner](https://developerscorner.storymaps.arcgis.com)
* [@EsriStoryMaps](https://twitter.com/EsriStoryMaps)
* [ArcGIS Blog](https://blogs.esri.com/esri/arcgis/)

When you contact us, don't hesitate to include a link to your application to make it easier for us to understand what you are working on.

## FAQ

### What are the supported browsers?
Shortlist is supported on Internet Explorer 9 and above, Chrome, Firefox, Safari and the most recent tablet and smartphone devices.
Shortlist authoring is supported on Internet Explorer 10 and above, on the most recent tablet but not on smartphone.

We actively test the application in all major browsers but if you experience difficulties especially with the builder, we recommend that you use [Chrome](https://www.google.com/intl/en_us/chrome/browser/).

### Tips for your content
Although any size is supported, a good size and shape for an image referenced via a URL is approximately 800 pixels wide by 600 pixels. Our recommended image size for Story Map Tours (approximately 1000x750 pixels) also works fine. We also recommend JPG format instead of PNG format for smaller overall file size, but both formats are supported. For thumbnail images referenced via URLs we recommend 280 pixels wide by 210 pixels tall.  [More info] (http://storymaps.arcgis.com/en/faq/#question49b)


### Security

#### Can I keep my Shortlist private?
Yes, the regular ArcGIS Online security model applies. 
By default your Shortlist is private, you can share it through Shortlist builder or ArcGIS Online. 
When you share your Shortlist, it is your responsibility to make sure that all the resources of your Shortlist (webmaps, imagess) are accessible to your audience.

#### Can I use private web map or layer?
Yes. 

When the Shortlist is hosted in ArcGIS Online, users that don't have access to the Shortlist or a webmap used in the Shortlist will be redirected to the ArcGIS Online sign-in page. It is not possible to display an authentication dialog in the Shortlist when the Shortlist is hosted in ArcGIS Online.

When the Shortlist is hosted on your web server, an authentication dialog will appear inside the application. 

Note that for that authentication to work on some older browser (Internet Explorer 9) you need to install a proxy server on your web server to make sure the login credentials can be passed securely to ArcGIS Online. For more information, see the [Using the proxy](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html) in the ArcGIS API for JavaScript documentation.

Because of that limitation, we recommend that you configure the application to use OAuth. OAuth 2.0 based authentication is available for ArcGIS Online and Portal for ArcGIS users with developer or organizational accounts. Follow the procedure to [add an application](http://doc.arcgis.com/en/arcgis-online/share-maps/add-items.htm#ESRI_SECTION1_55703F1EE9C845C3B07BBD85221FB074) and [register an application](http://doc.arcgis.com/en/arcgis-online/share-maps/add-items.htm#ESRI_SECTION2_20AF85308FD548B5ADBAE28836F66D3F) to get an OAuth application ID. Once you have that application, open `index.html`, locate the `configOptions` section and fill the `oAuthAppId` property.

If you are using secured services but don't want users to have to authenticate, you can use a proxy to store the username/password to be used, see [Working with Proxy Services](https://developers.arcgis.com/authentication/working-with-proxies/#selfhosted-proxy-service), and add a proxy rules to specify what services need to use the proxy by editing `PROXY_RULES` in `app/config.js`.

### Deployment
Deploying a Shortlist require to use ArcGIS Online. The Shortlist content have to be created using the Shortlist builder and will live in a Web Map and Web Application Item.

#### Can I use the template without ArcGIS Online?
This is not a supported use case at that time.

#### Where is the data stored?
The Shortlist data are stored in a Web Application Item in ArcGIS Online and its associated Web Map. This include the narrative content, reference to the webmap, reference to picture(s), and the settings.

The image that you include in your Shortlist using the builder are not copied in ArcGIS Online. You have to make sure that those medias as well as the webmap you are using are and will remain accessible to your audience.

#### Can I use the builder with the downloadable?
Yes, when the template is configured with an application ID, adding the URL parameter 'edit' will open the builder. You will be prompted for user authentication through the Identity Manager.

#### How to deploy the application on a web server?
If you are not familiar with web servers here are two solutions:
 * Use the web server that comes with your server Operating System. On Windows this is Internet Information Services (IIS), if you have a `C:\inetpub\wwwroot` folder on your computer, you should be able to access it's content using `http://localhost`
 * On Windows or Mac OS, use a simple web server like [Mongoose](https://code.google.com/p/mongoose/) (not recommended for production)

If you are experiencing some rendering issues like improper symbol appearing instead of icons, you will have an extra configuration to perform. Some servers require to configure a new mime type to be able to serve Shortlist fonts correctly. See the following links for more information:

 * [IIS Mime types](http://codingstill.com/2013/01/set-mime-types-for-web-fonts-in-iis/)
 * [Properly serve webfonts](http://blog.symbolset.com/properly-serve-webfonts)

#### Can I use a single deployment of Shortlist for multiple stories?
Yes. 
If you have customized the application and deployed it on your server, you don't need to copy it multiple times, edit index.html and paste a different application ID for each story you want to publish. 

Instead edit `index.html`, locate the `configOptions` section and fill the `authorizedOwners` property with the ArcGIS Online login of the owner(s) of the Shortlist you want to use. This make possible for the application to display any of the Shortlist created by the specified user(s) through an URL parameter.

Example of the same application displaying two stories:
 * http://myserver.com/Shortlist/index.html?appid=c7ad1a55de0247a68454a76f251225a4
 * http://myserver.com/Shortlist/index.html?appid=c7ad1a55de0247a68454a76f251225a5

### Additional FAQ can be found on the [StoryMaps Website](http://links.esri.com/storymaps/faq_shortlist)

## Configuration
In addition to the configuration offered by the builder, the file `app/config.js` provide various additional settings. This is for example the place where you can override some settings like the list of Geocoder services to be used (changes override ArcGIS Online or your Organization default settings). See the documentation provided in that file for more details. 

### Environment setup

Clone the repository or download a [copy of the repository as a zip file](https://github.com/Esri/shortlist-storytelling-template-js/archive/master.zip).

To build a production version of the application from the source code, you first need to install [Node.js](http://nodejs.org/).

Then initialize the environment by running the following commands **in the Shortlist folder**:
 * `npm install`
 * `npm install –g grunt-cli`

This will create a new `node-modules` folder in your project root with all the tools required to build the application. If you have trouble running the second command, [see this documentation on how to install grunt-cli locally](https://github.com/gruntjs/grunt-cli#installing-grunt-cli-locally).

### How to use the application from the source code
 * Make accessible the Shortlist folder on a web server. Use your favorite server or run one with `grunt server`, this will start a server on port `8080`
 * Use the URL parameter `appid` to specify the web item to be loaded, e.g.: http://localhost:8080/?appid=ABCD (configuring index.html > configOptions.appid is not supported in development mode)

### How to build application from the source code
  * Open a terminal and navigate to the Shortlist folder 
  * Run the following command: `grunt`

The deploy folder now contains the built application that you can deploy to your web server.

### Issues building the application

The build script perform code validation through [JSHint](http://www.jshint.com/), you can disable those validations by editing Gruntfile.js and look for the following comments `/* Comment out to disable code linting */`.

### Design
Shortlist relies on AMD and Dojo loader [AMD](http://help.arcgis.com/en/webapi/javascript/arcgis/jshelp/#inside_dojo_amd) for application structure.

The application is structured as this:

| Path          			                  	| Contains																						|
| ---------------------------------------------	|  -------------------------------------------------------------------------------------------- |
| Gruntfile.js									| Build configuration																			|
| src/											| Main source code folder with index.html and the Eclipse project configuration					|
| src/app/										| Javascript and CSS source code 																|
| src/app/config.js			            		| App configuration file (loaded at execution time) 											|
| **src/app/storymaps/common/**					| Modules common across storymaps templates (main module is Core.js)							|
| src/app/storymaps/common/builder/				| Builder modules (main module is Builder.js)													|
| src/app/storymaps/common/mapcontrols/			| Map UI components (Overview, Legend)															|
| src/app/storymaps/common/ui/					| UI components																					|
| src/app/storymaps/common/utils/				| Utils, connector,...																			|
| src/app/storymaps/common/_resources			| Static resources																				|
| **src/app/storymaps/tpl/**					| Shortlist modules (build configuration files in the root)									|
| src/app/storymaps/tpl/builder/				| Builder modules (main module is BuilderView.js)												|
| src/app/storymaps/tpl/core/					| Core modules (main module is MainView.js) 													|
| src/app/storymaps/tpl/ui/						| UI components of the viewer grouped by target device											|
| src/lib-app/									| Dependencies (included in the final app)														|
| src/lib-build/								| Dependencies used by the build (not included in final app)									|
| src/resources/								| Static resources																				|


The main dependencies are:
 * [jQuery](http://jquery.com/)
 * [Bootstrap](http://twitter.github.com/bootstrap/)
 * [CKEditor](http://ckeditor.com/)
 * [iDangero.us Swiper](http://www.idangero.us/sliders/swiper/)

The application Javascript and CSS are minified into four files:

| File			        |										                                        |
| --------------------- | ----------------------------------------------------------------------------- |
| app/viewer-min.css	| Compressed CSS loaded when accessing the Shortlist as a viewer		        |
| app/viewer-min.js	    | Compressed Javascript loaded when accessing the Shortlist as a viewer	    |
| app/builder-min.css	| Compressed CSS loaded when accessing the Shortlist as an author		        |
| app/builder-min.js	| Compressed Javascript loaded when accessing the Shortlist as an author	    |

Depending on the URL parameters, index.html will load the corresponding files.

## Issues
Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing
Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2016, 2017 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE.txt](LICENSE.txt) file.

Some open-source components of this project are licensed under other License terms, see `src/lib-app/` folder for respective licence files.

| Library               | License   |
| --------------------- | --------- |
| Bootstrap 			| MIT 		|
| CKEditor 				| LGPL		|
| Medium Editor 		| MIT		|
| jQuery 				| MIT 		|
| iDangero.us swiper 	| MIT 		|
| Clipboard 		| MIT 		|
| History.js			| BSD 		|
| jQuery UI 			| MIT 		|
| FastClick 			| MIT 		|
| jQuery UI Touch Punch | MIT 		|
| spectrum              | MIT 		|
| LazySizes             | MIT 		|
| exif-js               | MIT   |
