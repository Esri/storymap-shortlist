define({
	root: ({
		builder: {
			initPopup: {
				title: "Welcome to",
				startBtn: "Start"
			},
			addEditPopup: {
				test: "test",
				add: "add",
				edit: "edit"
			},
			landing: {
				lblAdd: "What do you want to call your Shortlist?",
				phAdd: "Enter your title...",
				lblOR: "Or",
				lblHelp: "Take a Tour"
			},
			organizePopup: {
				title: "Organize",
				tab: "tab"
			},
			settingsLayoutOptions: {
				title: "Layout options",
				lblDescription: "Description"
			},
			addFeatureBar: {
				add: "Add",
				import: "Import",
				done: "Done",
				deleteFeature: "Delete",
				move: "Move",
				locateFeaturesTooltip: "Some places need to be located. Click this to see them"
			},
			detailPanelBuilder: {
				changeLocation: "Change location",
				setLocation: "Set Location",
				cancel: "Cancel",
				addImage: "click, or, drag and drop, to add an image",
				enterPlaceName: "Enter place name",
				enterPlaceDescription: "Enter place description",
				unnamedPlace: "Unnamed place"
			},
			settings: {
				numberedPlaces: "Show places with numbers",
				extentSensitive: "Only show places in tabs that are visible on the map (viewer only)",
				extentSensitiveTooltip: "This option only applies when your Shortlist is viewed. In the Shortlist Builder the tabs always show all the places, even places that are not visible on the map. Uncheck this option if you want the tabs to always show all places when your Shortlist is viewed.",
				locateButton: "Locate button",
				locateButtonTooltip: "Allow your readers to see their current location on the map.  This feature is supported on most devices and browsers, but the button only appears if you share your story as an HTTPS link and the story is not embedded.",
				geocoder: "Address, Place, and Feature Finder",
				bookmarks: "Bookmarks",
				bookmarksMenuName: "Menu Name",
				defaultMapLocation: "Default map location",
				auto: "Auto",
				autoTooltip: "The location is managed automatically so that all your places are visible",
				custom: "Custom",
				customTooltip: "Set the location using the button that will appear in the map zoom controls",
				mapLocationTooltip: "The location people see when they open your Shortlist",
				bookmarksHelp: "To enable bookmarks in Shortlist, add and manage the web map's bookmarks in the web map viewer"
			},
			help: {
				title: "HELP",
				shortlistHelp1: "Welcome to the Story Map Shortlist. This app lets you present places of interest organized into tabs, making it fun for people to explore what's in an area. You can author your places interactively in this Builder.",
				shortlistHelp2: "You can also create a Shortlist from an existing ArcGIS web map, including the option to use existing point data in the map as places.",
				shortlistHelp3: "To create a Shortlist from a web map, go to",
				shortlistHelp4: "open the web map, create a web app from it, and choose Story Map Shortlist from the gallery of apps. If your web map contains any point layers, the Shortlist Builder will prompt you to select the layers you want to use as places. If you created a Shortlist using the original, non-hosted version of the app, you can migrate your Shortlist into this hosted version of the app using the same steps.",
				shortlistHelp5: "For more information",
				shortlistHelp6: "Visit the Shortlist section of the Esri Story Maps website",
				shortlistFAQ: "Shortlist FAQ",
				shortlistBetaFeedback: "Beta feedback",
				shortlistBetaFeedback2: "We would love to hear from you! Let us know about issues and new features you need by visiting the",
				geonetForum: "Story Maps forum on GeoNet"
			},
			migration: {
				migrationPattern: {
					welcome: "Welcome to the Shortlist Builder",
					importQuestion: "Your web map contains point data.  Do you want to use those points as places in your Shortlist?",
					importExplainYes: "You will be able to edit, manage and add to your places in the Shorlist Builder.  A copy of your web map is automatically created so your original data is not modified.",
					importExplainNo: "Your points will be displayed on your Shortlist map but won't be used as places.  Instead you'll add your places into your Shortlist in the Builder.",
					no: "No",
					importOption: "Yes, import them",
					asIsOption: "Yes, use them as-is",
					asIsText: "You will continue to edit and manage your places in your web map, not in the Shortlist Builder.  Updates you make to that data will be automatically reflected in your Shortlist.  This option requires that your data uses this template.",
					badData: "The point layer containing your places does not use the required data template. Please review the requirements of the template.",
					downloadTemplate: "Download template"
				},
				fieldPicker: {
					nameField: "Field containing the name of each place: ",
					descriptionField: "Field(s) that will appear in the description for each place and their order: ",
					urlField: "Field containing the URL for 'More info' about each place (optional): ",
					none: "none",
					imageFields: "Fields containing URL to images for each place (optional): ",
					mainImageField: "Main image: ",
					thumbImageField: "Thumbnail: ",
					noImageFields: "Leave these set to none if you want to add images to your places in the Builder",
					tabField: "If you have a field name that divides the places in your layer into different themes, select the appropriate field name below."
				},
				layerPicker: {
					pointLayers: "Choose the point layer(s) in your web map you want to use as places: ",
					layerInfo: "If you choose more than one layer, they must all have the same set of fields.  Each layer you choose will become a tab in your shortlist."
				}

			}
		}
	}),
	"ar": 1,
	"bs": 1,
	"cs": 1,
	"da": 1,
	"de": 1,
	"el": 1,
	"es": 1,
	"et": 1,
	"fi": 1,
	"fr": 1,
	"he": 1,
	"hi": 1,
	"hr": 1,
	"id": 1,
	"it": 1,
	"ja": 1,
	"ko": 1,
	"lt": 1,
	"lv": 1,
	"nl": 1,
	"nb": 1,
	"pl": 1,
	"pt-br": 1,
	"pt-pt": 1,
	"ro": 1,
	"ru": 1,
	"sr": 1,
	"sv": 1,
	"th": 1,
	"tr": 1,
	"vi": 1,
	"zh-cn": 1,
	"zh-hk": 1,
	"zh-tw": 1
});
