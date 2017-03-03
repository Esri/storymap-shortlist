define({
  "builder": {
    "initPopup": {
      "title": "Bienvenue dans",
      "startBtn": "Démarrer"
    },
    "addEditPopup": {
      "test": "test",
      "add": "ajouter",
      "edit": "éditer"
    },
    "landing": {
      "lblAdd": "Comment voulez-vous appeler votre Shortlist ?",
      "phAdd": "Entrez votre titre...",
      "lblOR": "Ou",
      "lblHelp": "Suivre une visite"
    },
    "organizePopup": {
      "title": "Organiser",
      "tab": "tab"
    },
    "settingsLayoutOptions": {
      "title": "Options de mise en page",
      "lblDescription": "Description"
    },
    "addFeatureBar": {
      "add": "Ajouter",
      "import": "Importer",
      "done": "Terminé",
      "deleteFeature": "Effacer",
      "move": "Déplacer",
      "locateFeaturesTooltip": "Certains endroits doivent être localisés. Cliquez ici pour les voir"
    },
    "detailPanelBuilder": {
      "changeLocation": "Modifier l'emplacement",
      "setLocation": "Définir l'emplacement",
      "cancel": "Annuler",
      "addImage": "cliquez, ou faites un glisser-déplacer, pour ajouter une image",
      "enterPlaceName": "Entrer le nom du lieu",
      "enterPlaceDescription": "Entrer la description du lieu",
      "unnamedPlace": "Lieu sans nom"
    },
    "settings": {
      "numberedPlaces": "Afficher des endroits avec des chiffres",
      "extentSensitive": "Afficher uniquement les endroits dans des onglets visibles sur la carte (visionneuse uniquement)",
      "extentSensitiveTooltip": "Cette option est visible uniquement lors de l’affichage de votre Shortlist. Dans le générateur Shortlist, les onglets présentent toujours tous les endroits, même ceux qui ne sont pas visibles sur la carte. Désactivez cette option si vous souhaitez que les onglets présentent toujours tous les endroits à l’affichage de votre Shortlist.",
      "locateButton": "Bouton Localiser",
      "locateButtonTooltip": "Permettez à vos lecteurs de visualiser leur localisation sur la carte. La plupart des appareils et navigateurs prennent en charge cette entité, mais le bouton ne s'affiche que si vous partagez votre récit sous forme de lien HTTPS et si le récit n'est pas incorporé.",
      "geocoder": "Outil de recherche d’adresses, d’endroits et d’entités",
      "bookmarks": "Géosignets",
      "bookmarksMenuName": "Nom du menu",
      "defaultMapLocation": "Emplacement de la carte par défaut",
      "auto": "Automatique",
      "autoTooltip": "L’emplacement est géré automatiquement pour que tous vos endroits soient visibles",
      "custom": "Personnalisé",
      "customTooltip": "Définissez l’emplacement grâce au bouton qui apparaît dans les commandes de zoom de la carte",
      "mapLocationTooltip": "Emplacement que les utilisateurs voient lorsqu'ils ouvrent votre Shortlist",
      "bookmarksHelp": "Pour activer les géosignets dans Shortlist, ajoutez et gérez les géosignets de la carte web dans la visionneuse de carte web"
    },
    "help": {
      "title": "AIDE",
      "shortlistHelp1": "Bienvenue dans Story Map Shortlist. Cette application permet de présenter des lieux d'intérêt, organisés dans des onglets pour permettre aux utilisateurs d’explorer une zone. Vous pouvez créer les endroits de manière interactive dans ce Générateur.",
      "shortlistHelp2": "Vous pouvez également créer une Shortlist à partir d’une carte web ArcGIS existante, notamment l’option d’utilisation de points de données existants dans la carte en tant qu’emplacements.",
      "shortlistHelp3": "Pour créer une Shortlist à partir d'une carte web, allez dans",
      "shortlistHelp4": "ouvrez la carte web, créez une application web à partir de cette carte, puis sélectionnez Story Map Shortlist dans la galerie d’applications. Si votre carte web contient des couches ponctuelles, le générateur Shortlist vous invite à sélectionner les couches à utiliser comme emplacements. Si vous avez créé une Shortlist avec la version non hébergée d’origine de l’application, vous pouvez migrer votre Shortlist vers cette version hébergée de l’application en procédant de la même manière.",
      "shortlistHelp5": "Pour plus d’informations",
      "shortlistHelp6": "Consultez la section Shortlist du site web Esri Story Maps",
      "shortlistFAQ": "FAQ Shortlist",
      "shortlistBetaFeedback": "Retour sur la version bêta",
      "shortlistBetaFeedback2": "Nous aimerions connaître votre opinion ! Faites-nous part d’éventuels problèmes et communiquez-nous des suggestions de nouvelles fonctionnalités sur le",
      "geonetForum": "forum concernant les Story Maps sur GeoNet"
    },
    "migration": {
      "migrationPattern": {
        "welcome": "Bienvenue dans Shortlist Builder",
        "importQuestion": "Votre carte web contient des données ponctuelles. Voulez-vous utiliser ces points comme des endroits dans votre Shortlist ?",
        "importExplainYes": "Vous pourrez ainsi modifier, gérer et ajouter des éléments à vos emplacements dans le générateur Shorlist. Une copie de votre carte web est créée automatiquement, afin que vos données initiales ne soient pas modifiées.",
        "importExplainNo": "Vos points s’afficheront dans votre carte Shortlist, mais ils ne seront pas utilisés comme des emplacements. Vous ajouterez vos emplacements dans votre Shortlist dans le Générateur.",
        "no": "Non",
        "importOption": "Oui, les importer",
        "asIsOption": "Oui, les utiliser tels quels",
        "asIsText": "Vous continuerez à modifier et à gérer vos emplacements dans votre carte web, pas dans le générateur Shortlist. Les mises à jour que vous effectuez sur les données seront automatiquement répercutées dans votre Shortlist. Cette option nécessite que vos données utilisent ce modèle.",
        "badData": "La couche ponctuelle contenant vos emplacements n’utilise pas le modèle de données requis. Consultez les conditions d'utilisation du modèle.",
        "downloadTemplate": "Télécharger le modèle"
      },
      "fieldPicker": {
        "nameField": "Champ contenant le nom de chaque endroit : ",
        "descriptionField": "Champs qui apparaîtront dans la description de chaque endroit et leur ordre : ",
        "urlField": "Champ contenant l’URL pour plus d'informations concernant chaque endroit (facultatif) : ",
        "none": "aucun",
        "imageFields": "Champ contenant l’URL des images correspondant à chaque endroit (facultatif) : ",
        "mainImageField": "Image principale : ",
        "thumbImageField": "Miniature : ",
        "noImageFields": "Laissez cette option définie à la valeur « aucun » si vous souhaitez ajouter des images à vos emplacements dans le Générateur",
        "tabField": "Si vous avez un nom de champ qui répartit les emplacements dans votre couche dans des thèmes différents, sélectionnez le nom de champ correspondant ci-après."
      },
      "layerPicker": {
        "pointLayers": "Sélectionnez les couches ponctuelles dans votre carte web à utiliser en tant qu’emplacements : ",
        "layerInfo": "Si vous sélectionnez plusieurs couches, elles doivent toutes posséder le même ensemble de champs. Chaque couche choisie deviendra un onglet dans votre Shortlist."
      }
    }
  }
});