define({
  "builder": {
    "initPopup": {
      "title": "Välkommen till",
      "startBtn": "Start"
    },
    "addEditPopup": {
      "test": "test",
      "add": "lägg till",
      "edit": "edit"
    },
    "landing": {
      "lblAdd": "Vad vill du kalla din snabblista?",
      "phAdd": "Ange en titel ...",
      "lblOR": "Eller",
      "lblHelp": "Ta en rundtur"
    },
    "organizePopup": {
      "title": "Organisera",
      "tab": "tab"
    },
    "settingsLayoutOptions": {
      "title": "Layoutalternativ",
      "lblDescription": "Beskrivning"
    },
    "addFeatureBar": {
      "add": "Lägg till",
      "import": "Importera",
      "done": "Klar",
      "deleteFeature": "Ta bort",
      "move": "Flytta",
      "locateFeaturesTooltip": "Vissa platser måste lokaliseras. Klicka här för att se dem."
    },
    "detailPanelBuilder": {
      "changeLocation": "Ändra plats",
      "setLocation": "Ange plats",
      "cancel": "Avbryt",
      "addImage": "lägg till en bild genom att klicka eller dra och släppa",
      "enterPlaceName": "Ange platsens namn",
      "enterPlaceDescription": "Ange platsens beskrivning",
      "unnamedPlace": "Namnlös plats"
    },
    "settings": {
      "numberedPlaces": "Visa platser med siffror",
      "extentSensitive": "Visa bara platser i flikar som syns på kartan (endast visningsprogrammet)",
      "extentSensitiveTooltip": "Det här alternativet gäller bara när din snabblista visas. I Shortlist Builder visar flikarna alltid alla platser, även platser som inte är synliga på kartan. Avmarkera alternativet om du vill att flikarna alltid ska visa alla platser när din snabblista visas.",
      "locateButton": "Sökknapp",
      "locateButtonTooltip": "Låt dina läsare se sin aktuella position på kartan. Den här funktionen stöds på de flesta enheter och webbläsare, men knappen visas endast om du delar din berättelse som en HTTPS-länk och berättelsen inte är inbäddad.",
      "geocoder": "Sökning efter adresser, platser och geoobjekt",
      "bookmarks": "Bokmärken",
      "bookmarksMenuName": "Menynamn",
      "defaultMapLocation": "Standardkartplats",
      "auto": "Auto",
      "autoTooltip": "Platsen hanteras automatiskt så att alla dina platser syns",
      "custom": "Anpassat",
      "customTooltip": "Ange platsen med knappen som visas bland kartans zoomkontroller",
      "mapLocationTooltip": "Den plats som människor ser när de öppnar din snabblista",
      "bookmarksHelp": "Om du vill aktivera bokmärken i snabblistan, lägger du till och hanterar webbkartans bokmärken i webbkartans visningsprogram"
    },
    "help": {
      "title": "HJÄLP",
      "shortlistHelp1": "Välkommen till Story Map Shortlist. Med den här appen kan du presentera intressanta platser i flikar så att det blir spännande för människor att utforska ett område. Du kan skapa dina platser interaktivt i det här byggverktyget.",
      "shortlistHelp2": "Du kan också skapa en snabblista från en befintlig ArcGIS-webbkarta, inklusive alternativet att använda befintliga punktdata på kartan som platser.",
      "shortlistHelp3": "Om du vill skapa en snabblista från en webbkarta, går du till",
      "shortlistHelp4": "öppna kartan, skapa en webbapp från den och välj Story Map Shortlist från appgalleriet. Om din webbkarta innehåller punktlager, uppmanas du av Shortlist Builder att välja vilka lager du vill använda som platser. Om du skapade en snabblista med den ursprungliga, icke-driftade versionen av appen, kan du migrera din snabblista i denna driftade version av appen med samma steg.",
      "shortlistHelp5": "Mer information",
      "shortlistHelp6": "Besök avsnittet om snabblistor på webbplatsen Esri Story Maps",
      "shortlistFAQ": "Vanliga frågor och svar om snabblistor",
      "shortlistBetaFeedback": "Beta-feedback",
      "shortlistBetaFeedback2": "Vi vill gärna höra från dig! Berätta för oss om problem och nya funktioner du behöver genom att besöka",
      "geonetForum": "Story Maps-forumet på GeoNet"
    },
    "migration": {
      "migrationPattern": {
        "welcome": "Välkommen till Shortlist Builder",
        "importQuestion": "Din webbkarta innehåller punktdata. Vill du använda punkterna som platser i din snabblista?",
        "importExplainYes": "Du kommer att kunna redigera, hantera och lägga till platser i Shortlist Builder. En kopia av din webbkarta skapas automatiskt, så dina ursprungliga data ändras inte.",
        "importExplainNo": "Dina punkter visas i din snabblistekarta, men de används inte som platser. Du lägger i stället till dina platser i snabblistan i Builder.",
        "no": "Nej",
        "importOption": "Ja, importera dem",
        "asIsOption": "Ja, använd dem som de är",
        "asIsText": "Du kommer att fortsätta att redigera och hantera dina platser i din webbkarta, inte i Shortlist Builder. Uppdateringar av dina data återspeglas automatiskt i din snabblista. Det här alternativet kräver att dina data använder denna mall.",
        "badData": "Det punktlager som innehåller dina platser använder inte den nödvändiga datamallen. Läs igenom kraven i mallen.",
        "downloadTemplate": "Hämta mall"
      },
      "fieldPicker": {
        "nameField": "Fält som innehåller namnet på varje plats: ",
        "descriptionField": "Fält som visas i beskrivningen för varje plats och deras ordningsföljd: ",
        "urlField": "Fält som innehåller URL-adressen till \"Mer info\" om varje plats (tillval): ",
        "none": "inget",
        "imageFields": "Fält som innehåller URL-adressen till bilder för varje plats (tillval): ",
        "mainImageField": "Huvudbild: ",
        "thumbImageField": "Miniatyr: ",
        "noImageFields": "Lämna dessa tomma om du vill lägga till bilder i dina platser i Builder",
        "tabField": "Om du har ett fält som delar upp platser i ditt lager efter olika teman, väljer du ett lämpligt fältnamn nedan."
      },
      "layerPicker": {
        "pointLayers": "Välj de punktlager i din webbkarta som du vill använda som platser: ",
        "layerInfo": "Om du väljer fler än ett lager måste de allihop ha samma uppsättning fält. Varje lager du väljer blir en flik i din snabblista."
      }
    }
  }
});