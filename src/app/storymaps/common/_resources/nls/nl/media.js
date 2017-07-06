define({
  "commonMedia": {
    "mediaSelector": {
      "lblSelect1": "Media",
      "lblSelect2": "Content",
      "lblMap": "Kaart",
      "lblImage": "Afbeelding",
      "lblVideo": "Video",
      "lblExternal": "Webpagina",
      "lblUpload": "Uploaden",
      "lblLink": "Koppeling",
      "disabled": "Deze functie is uitgeschakeld door de beheerder",
      "userLookup": "Albums laden",
      "notImplemented": "Nog niet geïmplementeerd.",
      "noData": "Geen openbaar album gevonden"
    },
    "imageSelector": {
      "lblStep1": "Kies de service",
      "lblStep2": "Selecteer uw media",
      "lblStep3": "Configureren"
    },
    "imageSelectorHome": {
      "explain": "Laad afbeeldingen vanaf sociale media, <br /> of direct vanaf een URL"
    },
    "imageSelectorUpload": {
      "lblUploadButton": "zoeken naar een afbeelding",
      "lblDrop": "Drop hier een afbeelding of",
      "infoUpload": "Afbeeldingen worden opgeslagen in uw ArcGIS-account en zijn alleen toegankelijk in uw verhaal.",
      "warningFileTypes": "Afbeelding mag .jpg, .png, .gif of .bmp zijn",
      "warningOneFile": "Eén bestand geaccepteerd per keer.",
      "warningFileSize": "Bestand is groter dan de maximaal toegestane uploadgrootte. Kies een ander bestand.",
      "tooltipRemove": "Verwijder deze ongebruikte afbeelding uit uw ArcGIS-account. <br> (U moet het opnieuw uploaden als u besluit om het later te gebruiken.)"
    },
    "imageSelectorFlickr": {
      "userInputLbl": "Gebruikersnaam",
      "signInMsg2": "Gebruiker niet gevonden",
      "loadingFailed": "Laden mislukt"
    },
    "imageSelectorFacebook": {
      "leftHeader": "Facebook-gebruiker",
      "rightHeader": "Facebook-pagina",
      "pageExplain": "Een Facebook-pagina is een openbaar merk/product of beroemdheid zoals <b>esrigis</b>. U vindt de naam van de pagina achter de eerste  '/' in de URL van de pagina.",
      "pageInputLbl": "Paginanaam",
      "lookupMsgError": "Pagina niet gevonden",
      "warning": "Facebook ondersteuning is stopgezet, ${learn}.",
      "learn": "meer informatie"
    },
    "imageSelectorPicasa": {
      "userInputLbl": "E-mail- of Google-ID",
      "signInMsg2": "Account niet gevonden",
      "howToFind": "Hoe een Picasa-ID vinden",
      "howToFind2": "Kopieer getallen tussen de eerste en tweede '/' van een pagina van Picasa"
    },
    "videoSelectorCommon": {
      "check": "Controleren",
      "notFound": "Video niet gevonden",
      "found": "Video gevonden",
      "select": "Deze video selecteren"
    },
    "videoSelectorHome": {
      "other": "Overig"
    },
    "videoSelectorYoutube": {
      "url": "YouTube-videokoppeling",
      "pageInputLbl": "Gebruikersnaam",
      "lookupMsgError": "Gebruiker niet gevonden",
      "howToFind": "Hoe een YouTube-gebruikersnaam vinden",
      "howToFind2": "Gebruikersnaam wordt weergegeven onder video's",
      "found": "Gevonden",
      "noData": "Geen openbare video's gevonden",
      "videoNotChecked": "De video is niet gecontroleerd op Youtube maar het adres ervan lijkt in orde.",
      "checkFailedAPI": "YouTube-controle mislukt, controleer de YouTube API-key."
    },
    "videoSelectorVimeo": {
      "url": "Vimeo-videokoppeling"
    },
    "videoSelectorOther": {
      "explain1": "Deze storymap kan geen raw videobestanden (bijv. avi, mpeg) afspelen maar het kan gehoste videobestanden afspelen met ingebouwde spelers (bijv. YouTube of Vimeo).",
      "explain2": "De meeste videohosting services bieden deze functie. Zoek de optie om de video in te sluiten, kopieer de opgegeven code en voeg het toe aan uw verhaal met behulp van de contentoptie %WEBPAGE%.",
      "explain3": "Als alternatief kunt u de video zelf hosten samen met een HTML-pagina die een videospeler gebruikt als %EXAMPLE%. Vervolgens voegt u de URL van die HTML-pagina toe aan uw story als een %WEBPAGE%.",
      "webpage": "Webpagina"
    },
    "webpageSelectorHome": {
      "lblUrl": "Webpaginakoppeling",
      "lblEmbed": "Code voor inbedden",
      "lblOR": "OF",
      "lblError1": "Fout: maak een van de twee velden leeg.",
      "lblError2": "Invoegcode kan maar één %IFRAMETAG% bevatten",
      "configure": "Configureren"
    },
    "mediaConfigure": {
      "lblURL": "Afbeeldingskoppeling",
      "lblURLPH": "Koppeling moet eindigen met .jpg, .png, .gif of .bmp",
      "lblURLError": "Deze afbeelding is blijkbaar niet geldig. Geef een directe koppeling naar een afbeeldingsbestand op (uw URL eindigt doorgaans op .jpg of .png). Koppelingen naar een webpagina die een afbeelding bevat, functioneren niet.",
      "lblURLCheck": "Afbeelding bekijken...",
      "lblLabel": "Bijschrift afbeelding",
      "lblLabel1": "Bijschrift",
      "lblLabel2": "Over tekst bewegen",
      "lblLabel3": "Geen",
      "lblLabelPH": "Voer wat tekst in...",
      "lblMaximize": "Voeg een knop voor maximaliseren in de hoek van de afbeelding toe",
      "lblMaximizeHelp": "Alleen aanbevolen voor foto's van hoge kwaliteit",
      "lblPosition": "Positie",
      "lblPosition1": "Centreren",
      "lblPosition2": "Vulling",
      "lblPosition3": "Passend maken",
      "lblPosition4": "Uitrekken",
      "lblPosition5": "Aangepast",
      "lblURLHelp": "Voor het beste resultaat moeten de afbeeldingen kleiner zijn dan 400 KB. Gebruik gecomprimeerde JPG-afbeeldingen op 80% kwaliteit en deze aanbevolen afbeeldingsbreedte: 2000 pixels voor het hoofdvenster of verhalende paneel met de knop maximaliseren, 1000 pixels voor verhalend paneel zonder knop maximaliseren.<br><br>Als gekoppelde afbeeldingen langzaam zijn, zullen ze sneller geladen worden als u ze uploadt naar uw verhaal.",
      "tooltipDimension": "De waarde kan in 'px' of '%' worden gespecificeerd",
      "tooltipDimension2": "De waarde moet worden opgegeven in 'px'",
      "lblPosition2Explain": "(kan worden bijgesneden)",
      "lblPosition3Explain": "(wordt niet bijgesneden)",
      "lblPosition3Explain2": "(breedte past altijd in het deelvenster)",
      "lblPosition4Explain": "(kan worden vervormd)",
      "unloadLbl": "Laden ongedaan maken als lezer weggaat",
      "unloadHelp": "Houd deze optie aangevinkt als de webpagina audio- of videomedia heeft om te voorkomen dat de content wordt afgespeeld als de lezer weggaat. Haal het vinkje weg om een soundtrack te laten doorspelen als de lezer verdergaat door het verhaal.<br />Als de webpagina een applicatie is, haal het vinkje dan weg zodat de applicatie het niet opnieuw laadt als de lezer terugkeert.",
      "embedProtocolLabel": "Pagina laden d.m.v. een beveiligde verbinding (HTTPS)",
      "embedProtocolWarning1": "Als deze pagina niet in uw verhaal geladen wordt, dan kan het niet geïnbed worden omwille van webbeveiligingsredenen. Voeg als alternatief een koppeling toe aan uw verhaal om de pagina te openen in een nieuw browsertabblad. <a href='http://links.esri.com/storymaps/blogs_mixed_content/' target='_blank'>Meer informatie</a>",
      "embedProtocolWarning2": "Als deze pagina niet in uw verhaal geladen wordt, vink deze optie dan uit en probeer nogmaals. Als de pagina nog steeds niet geladen kan worden, dan kan het niet geïnbed worden omwille van webbeveiligingsredenen. Voeg als alternatief een koppeling toe aan uw verhaal om de pagina te openen in een nieuw browsertabblad. <a href='http://links.esri.com/storymaps/blogs_mixed_content/' target='_blank'>Meer informatie</a>"
    },
    "editorActionGeocode": {
      "lblTitle": "Een adres of plaats zoeken",
      "mapMarkerExplain": "De gebruiker ziet een kaartmarkering wanneer hij/zij op de koppeling klikt"
    },
    "editorActions": {
      "remove": "Actie verwijderen",
      "preview": "Voorbeeld actie"
    },
    "editorActionMedia": {
      "lblTitle": "De content van het hoofdvenster wijzigen"
    },
    "editorInlineMedia": {
      "lblTitle": "Een afbeelding, video of webpagina invoegen"
    }
  }
});