define({
  "builder": {
    "initPopup": {
      "title": "Tervetuloa",
      "startBtn": "Aloita"
    },
    "addEditPopup": {
      "test": "testaa",
      "add": "lisää",
      "edit": "muokkaa"
    },
    "landing": {
      "lblAdd": "Millä nimellä haluat kutsua Shortlistiasi?",
      "phAdd": "Anna otsikko...",
      "lblOR": "Tai",
      "lblHelp": "Käy kierroksella"
    },
    "organizePopup": {
      "title": "Järjestä",
      "tab": "välilehti"
    },
    "settingsLayoutOptions": {
      "title": "Taiton asetukset",
      "lblDescription": "Kuvaus"
    },
    "addFeatureBar": {
      "add": "Lisää",
      "import": "Tuo",
      "done": "Valmis",
      "deleteFeature": "Poista",
      "move": "Siirrä",
      "locateFeaturesTooltip": "Jotkin paikat on paikannettava. Tuo ne näkyviin napsauttamalla tätä"
    },
    "detailPanelBuilder": {
      "changeLocation": "Muuta sijaintia",
      "setLocation": "Määritä sijainti",
      "cancel": "Peruuta",
      "addImage": "lisää kuva napsauttamalla tai vetämällä ja pudottamalla",
      "enterPlaceName": "Anna paikan nimi",
      "enterPlaceDescription": "Anna paikan kuvaus",
      "unnamedPlace": "Nimetön paikka"
    },
    "settings": {
      "numberedPlaces": "Näytä paikat, joihin liittyy numeroita",
      "extentSensitive": "Näytä välilehdissä vain paikat, jotka näkyvät kartalla (vain tarkastelija)",
      "extentSensitiveTooltip": "Tämä asetus on voimassa vain, kun Shortlistiasi tarkastellaan. Shortlist-luontitoiminnossa kaikki paikat näkyvät aina välilehdissä, myös paikat, jotka eivät näy kartalla. Poista tämän vaihtoehdon valinta, jos haluat, että kaikki paikat näkyvät aina välilehdissä, kun Shortlistia tarkastellaan.",
      "locateButton": "Paikanna-painike",
      "locateButtonTooltip": "Salli lukijoiden nähdä heidän nykyinen sijaintinsa kartalla. Useimmat laitteet ja selaimet tukevat tätä ominaisuutta, mutta painike näkyy vain, jos jaat tarinasi HTTPS-linkkiä eikä tarinaa ole upotettu.",
      "geocoder": "Osoitteen, paikan ja kohteen paikannus",
      "bookmarks": "Kirjanmerkit",
      "bookmarksMenuName": "Valikon nimi",
      "defaultMapLocation": "Oletuskarttasijainti",
      "auto": "Autom",
      "autoTooltip": "Sijaintia hallitaan automaattisesti, jotta kaikki paikat näkyvät",
      "custom": "Mukautettu",
      "customTooltip": "Määritä sijainti sen painikkeen avulla, joka näkyy kartan zoomauksen ohjausobjekteissa",
      "mapLocationTooltip": "Sijainti, jonka ihmiset näkevät, kun he avaavat Shortlistisi",
      "bookmarksHelp": "Jos haluat ottaa kirjanmerkit käyttöön Shortlistissa, lisää Web-kartan kirjanmerkit Web-kartan katseluohjelmassa ja hallitse niitä siinä"
    },
    "help": {
      "title": "OHJE",
      "shortlistHelp1": "Tervetuloa Story Map Shortlististiin. Tämän sovelluksen avulla voit esittää mielenkiintoisia paikkoja välilehtiin järjestettynä, jotta alueen kohteiden tutkiminen on hauskaa. Voit luoda omia paikkoja vuorovaikutteisesti tässä luontitoiminnossa.",
      "shortlistHelp2": "Voit myös luoda Shortlistin aiemmin luodusta ArcGIS-Web-kartasta. Voit myös käyttää aiemmin luotua pisteaineistoa kartan paikkoina.",
      "shortlistHelp3": "Jos haluat luoda Shortlistin Web-kartasta, siirry",
      "shortlistHelp4": "avaa Web-kartta, luo siitä Web-sovellus ja valitse Story Map Shortlist sovellusgalleriasta. Jos Web-karttasi sisältää pistekarttatasoja, Shortlist-luontitoiminto pyytää sinua valitsemaan karttatasot, joita haluat käyttää paikkoina. Jos olet luonut Shortlistin käyttämällä sovelluksen alkuperäistä versiota, jota ei isännöidä, voit siirtää Shortlistin tähän sovelluksen isännöityyn versioon samojen vaiheiden avulla.",
      "shortlistHelp5": "Lisätietoja on kohdassa",
      "shortlistHelp6": "Tutustu Esri Story Maps -sivuston Shortlist-osioon",
      "shortlistFAQ": "Shortlist – usein kysytyt kysymykset",
      "shortlistBetaFeedback": "Palaute (beetaversio)",
      "shortlistBetaFeedback2": "Haluamme kuulla sinusta! Kerro meille ongelmista ja uusista ominaisuuksista, joita tarvitset, vierailemalla",
      "geonetForum": "GeoNetin Story Maps -foorumissa"
    },
    "migration": {
      "migrationPattern": {
        "welcome": "Tervetuloa käyttämään Shortlist-luontitoimintoa",
        "importQuestion": "Web-karttasi sisältää pisteaineistoa. Haluatko käyttää pisteitä paikkoina Shortlistissasi?",
        "importExplainYes": "Voit muokata, hallita ja lisätä omia paikkoja Shorlist-luontitoiminnossa. Web-kartan kopio luodaan automaattisesti, joten alkuperäistä aineistoa ei muokata.",
        "importExplainNo": "Pisteesi näkyvät Shortlist-kartassa, mutta niitä ei käytetä paikkoina. Sen sijaan lisäät paikat Shortlistiin luontitoiminnossa.",
        "no": "Ei",
        "importOption": "Kyllä, tuo ne",
        "asIsOption": "Kyllä, käytä niitä sellaisenaan",
        "asIsText": "Muokkaat ja hallitset edelleen omia paikkojasi Web-kartassa etkä Shortlist-luontitoiminnossa. Aineistoon tekemäsi muutokset näkyvät automaattisesti myös Shortlistissa. Tämän vaihtoehdon käyttö edellyttää, että aineistossa käytetään tätä mallia.",
        "badData": "Pistekarttasossa, joka sisältää omat paikkasi, ei käytetä vaadittua aineistomallia. Tarkista mallin vaatimukset.",
        "downloadTemplate": "Lataa malli"
      },
      "fieldPicker": {
        "nameField": "Kenttä, joka sisältää kunkin paikan nimen: ",
        "descriptionField": "Kentät, jotka näkyvät kunkin paikan kuvauksessa, ja niiden järjestys: ",
        "urlField": "Kenttä, joka sisältää kunkin paikan Lisätietoja-linkin URL-osoitteen (valinnainen): ",
        "none": "ei mitään",
        "imageFields": "Kentät, jotka sisältävät kunkin paikan kuvien URL-osoitteet (valinnainen): ",
        "mainImageField": "Pääkuva: ",
        "thumbImageField": "Pikkukuva: ",
        "noImageFields": "Jätä näiden arvoksi Ei mitään, jos haluat lisätä kuvia paikkoihin luontitoiminnossa",
        "tabField": "Jos sinulla on kentän nimi, joka jakaa karttatason paikat eri teemoihin, valitse asianmukainen kentän nimi alta."
      },
      "layerPicker": {
        "pointLayers": "Valitse Web-kartan pistekarttataso(t), jota/joita haluat käyttää paikkoina: ",
        "layerInfo": "Jos valitset useita karttatasoja, niissä on kaikissa oltava sama kenttäjoukko. Kustakin valitsemastasi karttatasosta tulee Shortlistin välilehti."
      }
    }
  }
});