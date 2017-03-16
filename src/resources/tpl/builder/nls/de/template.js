define({
  "builder": {
    "initPopup": {
      "title": "Willkommen bei",
      "startBtn": "Beginnen"
    },
    "addEditPopup": {
      "test": "Test",
      "add": "Hinzufügen",
      "edit": "Bearbeiten"
    },
    "landing": {
      "lblAdd": "Welchen Namen möchten Sie Ihrer Shortlist geben?",
      "phAdd": "Geben Sie den Titel ein...",
      "lblOR": "Oder",
      "lblHelp": "Take a tour"
    },
    "organizePopup": {
      "title": "Organisieren",
      "tab": "Registerkarte"
    },
    "settingsLayoutOptions": {
      "title": "Layout-Optionen",
      "lblDescription": "Beschreibung"
    },
    "addFeatureBar": {
      "add": "Hinzufügen",
      "import": "Importieren",
      "done": "Fertig",
      "deleteFeature": "Löschen",
      "move": "Verschieben",
      "locateFeaturesTooltip": "Einige Orte müssen verortet werden. Klicken Sie darauf, um sie anzuzeigen"
    },
    "detailPanelBuilder": {
      "changeLocation": "Position ändern",
      "setLocation": "Position festlegen",
      "cancel": "Abbrechen",
      "addImage": "Klicken oder per Drag & Drop verschieben, um ein Bild hinzuzufügen",
      "enterPlaceName": "Ortsname eingeben",
      "enterPlaceDescription": "Ortsbeschreibung eingeben",
      "unnamedPlace": "Unbenannter Ort"
    },
    "settings": {
      "numberedPlaces": "Ort mit Ziffern anzeigen",
      "extentSensitive": "Orte nur auf Registerkarten anzeigen, die auf der Karte sichtbar sind (nur Viewer)",
      "extentSensitiveTooltip": "Diese Option gilt nur, wenn Ihre Shortlist angezeigt wird. In Shortlist Builder werden stets alle Orte auf allen Registerkarten angezeigt, sogar Orte, die nicht auf der Karte sichtbar sind. Deaktivieren Sie diese Option, wenn beim Anzeigen der Shortlist auf den Registerkarten immer alle Orte angezeigt werden sollen.",
      "locateButton": "Schaltfläche \"Suchen\"",
      "locateButtonTooltip": "Erlauben Sie Nutzern, ihre aktuelle Position auf der Karte anzuzeigen. Diese Funktionalität wird von den meisten Geräten und Browsern unterstützt; die Schaltfläche wird jedoch nur angezeigt, wenn Sie Ihre Story als HTTPS-Link freigeben und die Story nicht eingebettet ist.",
      "geocoder": "Adressen-, Orts- und Feature-Suche",
      "bookmarks": "Lesezeichen",
      "bookmarksMenuName": "Name des Menüs",
      "defaultMapLocation": "Standardkartenposition",
      "auto": "Automatisch",
      "autoTooltip": "Die Position wird automatisch verwaltet, sodass all Ihre Orte sichtbar sind",
      "custom": "Kundschaft",
      "customTooltip": "Legen Sie die Position mit der Schaltfläche fest, die in den Zoomsteuerelementen der Karte angezeigt wird",
      "mapLocationTooltip": "Die Position, die Benutzern angezeigt wird, wenn sie Ihre Shortlist öffnen",
      "bookmarksHelp": "Um Lesezeichen in Shortlist zu aktivieren, fügen Sie die Lesezeichen im Webkarten-Viewer der Webkarte hinzu und verwalten Sie sie"
    },
    "help": {
      "title": "HILFE",
      "shortlistHelp1": "Willkommen bei Story Map Shortlist. Mit dieser App können Sie interessante Orte präsentieren, die auf verschiedenen Registerkarten organisiert sind, die Benutzern das Erkunden eines Gebiets auf amüsante Weise ermöglichen. Sie können Orte in diesem Builder interaktiv erstellen.",
      "shortlistHelp2": "Sie können auch eine Liste aus einer vorhandenen ArcGIS-Webkarte erstellen, einschließlich der Option zum Verwenden vorhandener Punktdaten in der Karte als Orte.",
      "shortlistHelp3": "Um eine Shortlist aus einer Webkarte zu erstellen, wechseln Sie zu",
      "shortlistHelp4": "Öffnen Sie die Webkarte, erstellen Sie eine Web-App aus ihr, und wählen Sie Story Map Shortlist aus der Galerie der Apps aus. Wenn Ihre Webkarte Punkt-Layer enthält, werden Sie von Shortlist Builder aufgefordert, die Layer auszuwählen, die Sie als Orte verwenden möchten. Wenn Sie eine Shortlist mithilfe der ursprünglichen, nicht gehosteten Version der App erstellt haben, können Sie die Shortlist in dieser gehosteten Version der App migrieren, indem Sie dieselben Schritte ausführen.",
      "shortlistHelp5": "Weitere Informationen",
      "shortlistHelp6": "Besuchen Sie den Abschnitt \"Shortlist\" der Esri Story Maps-Website",
      "shortlistFAQ": "FAQ zu Shortlist",
      "shortlistBetaFeedback": "Beta-Feedback",
      "shortlistBetaFeedback2": "Wir sind an Ihrer Meinung interessiert! Melden Sie uns Probleme und neue Features, die Sie benötigen, indem Sie das",
      "geonetForum": "Story-Maps-Forum auf GeoNet besuchen"
    },
    "migration": {
      "migrationPattern": {
        "welcome": "Willkommen bei Shortlist Builder",
        "importQuestion": "Ihre Webkarte enthält Punktdaten. Möchten Sie diese Punkte als Orte in Ihrer Shortlist verwenden?",
        "importExplainYes": "Sie können die Orte in Shorlist Builder bearbeiten, verwalten und hinzufügen. Eine Kopie Ihrer Webkarte wird automatisch erstellt, sodass Ihre ursprünglichen Daten nicht geändert werden.",
        "importExplainNo": "Ihre Punkte werden auf der Shortlist-Karte angezeigt, jedoch nicht als Orte verwendet. Stattdessen fügen Sie Ihre Orte in die Shortlist des Builders ein.",
        "no": "Nein",
        "importOption": "Ja, importieren",
        "asIsOption": "Ja, unverändert verwenden",
        "asIsText": "Sie bearbeiten und verwalten Ihre Orte weiterhin in Ihrer Webkarte, nicht in Shortlist Builder. Aktualisierungen, die Sie an den Daten vornehmen, werden automatisch in der Shortlist angezeigt. Diese Option erfordert, dass Ihre Daten diese Vorlage verwenden.",
        "badData": "Der Punkt-Layer mit Ihren Orten verwendet nicht die erforderliche Datenvorlage. Überprüfen Sie die Anforderungen der Vorlage.",
        "downloadTemplate": "Vorlage herunterladen"
      },
      "fieldPicker": {
        "nameField": "Feld, das den Namen des jeweiligen Ortes enthält: ",
        "descriptionField": "Feld(er), das/die in der Beschreibung für einzelnen Orte und ihrer Reihenfolge angezeigt wird/werden: ",
        "urlField": "Feld, das die URL für 'Weitere Info' zu jedem Ort enthält (optional): ",
        "none": "keine",
        "imageFields": "Feld, das die URL zu Bildern für jeden Ort enthält (optional): ",
        "mainImageField": "Hauptbild: ",
        "thumbImageField": "Miniaturansicht: ",
        "noImageFields": "Behalten Sie die Einstellung \"keine\" bei, wenn Sie Ihren Orten Bilder in Builder hinzufügen möchten",
        "tabField": "Wenn Ihr Feldname die Orte im Layer in verschiedene Designs unterteilt, wählen Sie den entsprechenden Feldnamen unten aus."
      },
      "layerPicker": {
        "pointLayers": "Wählen Sie den/die Punkt-Layer in der Webkarte aus, die Sie als Orte verwenden möchten: ",
        "layerInfo": "Bei Auswahl mehrerer Layer müssen alle dieselben Felder aufweisen. Jeder ausgewählte Layer wird zu einer Registerkarte in Ihrer Shortlist."
      }
    }
  }
});