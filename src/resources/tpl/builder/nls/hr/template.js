define({
  "builder": {
    "initPopup": {
      "title": "Dobro došli u",
      "startBtn": "Pokreni"
    },
    "addEditPopup": {
      "test": "test",
      "add": "dodaj",
      "edit": "uredi"
    },
    "landing": {
      "lblAdd": "Kako želite nazvati svoj Shortlist?",
      "phAdd": "Unesite naslov...",
      "lblOR": "ili",
      "lblHelp": "Krenite na obilazak"
    },
    "organizePopup": {
      "title": "Organiziraj",
      "tab": "kartica"
    },
    "settingsLayoutOptions": {
      "title": "Opcije izgleda",
      "lblDescription": "Opis"
    },
    "addFeatureBar": {
      "add": "Dodaj",
      "import": "Uvoz",
      "done": "Gotovo",
      "deleteFeature": "Izbriši",
      "move": "Premjesti",
      "locateFeaturesTooltip": "Treba pronaći neka mjesta. Kliknite ovdje da bi se prikazala"
    },
    "detailPanelBuilder": {
      "changeLocation": "Promijeni lokaciju",
      "setLocation": "Postavi lokaciju",
      "cancel": "Odustani",
      "addImage": "kliknite ili povucite i ispustite za dodavanje slike",
      "enterPlaceName": "Unesite naziv mjesta",
      "enterPlaceDescription": "Unesite opis mjesta",
      "unnamedPlace": "Neimenovano mjesto"
    },
    "settings": {
      "numberedPlaces": "Prikaži mjesta s brojevima",
      "extentSensitive": "Samo prikaži mjesta na karticama koja su vidljiva na karti (samo preglednik)",
      "extentSensitiveTooltip": "Ova opcija vrijedi kada se prikazuje vaš Shortlist. U sastavljaču Shortlist Builder na karticama su uvijek prikazana sva mjesta, čak i mjesta koja nisu vidljiva na karti. Odznačite ovu opciju ako želite da se na karticama uvijek prikazuju sva mjesta kad se prikazuje vaš Shortlist.",
      "locateButton": "Gumb za lociranje",
      "locateButtonTooltip": "Omogućite čitateljima da vide svoju trenutačnu lokaciju na karti. Ova je značajka podržana na većini uređaja i preglednika, no gumb se pojavljuje samo ako svoju priču podijelite kao HTTPS poveznicu i ako priča nije umetnuta.",
      "geocoder": "Tražilo adrese, mjesta i geoobjekata",
      "bookmarks": "Knjižne oznake",
      "bookmarksMenuName": "Naziv izbornika",
      "defaultMapLocation": "Zadana lokacija karte",
      "auto": "Automatski",
      "autoTooltip": "Lokacijom se upravlja automatski tako da su vidljiva sva mjesta",
      "custom": "Prilagođeno",
      "customTooltip": "Postavite lokaciju gumbom koji će se pojaviti u kontrolama za uvećanje karte",
      "mapLocationTooltip": "Lokacija koju ljudi vide kada otvore vaš Shortlist",
      "bookmarksHelp": "Za omogućivanje knjižnih oznaka u Shortlistu dodajte i upravljajte knjižnim oznakama web-karte u pregledniku web-karte"
    },
    "help": {
      "title": "POMOĆ",
      "shortlistHelp1": "Dobrodošli u Story Map Shortlist. Ovaj vam app omogućuje prikazivanje zanimljivih mjesta organiziranih u kartice, što ih čini istraživanje područja zabavnim. Možete interaktivno postaviti svoja mjesta u ovom sastavljaču.",
      "shortlistHelp2": "Također možete izraditi Shortlist iz potojeće ArcGIS web-karte, uključujući opciju za korištenje postojećih točkastih podataka na karti kao mjesta.",
      "shortlistHelp3": "Za stvaranje Shortlista iz web-karte idite na",
      "shortlistHelp4": "otvorite web-kartu, izradite web-app od nje i odaberite Story Map Shortlist u galeriji appova. Ako vaša web-karta sadrži točkaste slojeve, sastavljač Shortlist Builder od vas će zatražiti da odaberete slojeve koje želite koristiti kao mjesta. Ako ste izradili Shortlist upotrebom izvorne, nehostirane verzije appa, možete premjestiti svoj Shortlist u ovu hostiranu verziju appa upotrebom istih koraka.",
      "shortlistHelp5": "Za više informacija",
      "shortlistHelp6": "Posjetite dio Shortlist na web-mjestu Esri Story Maps",
      "shortlistFAQ": "Najčešća pitanja za Shortlist",
      "shortlistBetaFeedback": "Povratne informacije za beta verziju",
      "shortlistBetaFeedback2": "Rado bismo vas čuli! Recite nam o problemima i novim značajkama koje vam trebaju tako da posjetite",
      "geonetForum": "Story Maps Forum na GeoNetu"
    },
    "migration": {
      "migrationPattern": {
        "welcome": "Dobrodošli u Shortlist Builder",
        "importQuestion": "Vaša web-karta sadrži točkaste podatke. Želite li upotrijebiti te točke kao mjesta u Shortlistu?",
        "importExplainYes": "Moći ćete uređivati, upravljati i dodavati mjesta u sastavljaču Shortlist Builder. Primjerak vaše web-karte automatski se izrađuje tako da se vaši izvorni podaci neće mijenjati.",
        "importExplainNo": "Vaše će se točke prikazati na karti Shortlista, ali neće se koristiti kao mjesta. Umjesto toga, dodat ćete svoja mjesta u svoj Shortlist u sastavljaču.",
        "no": "Ne",
        "importOption": "Da, uvezi",
        "asIsOption": "Da, koristi kakvo jest",
        "asIsText": "Nastavit ćete uređivati i upravljati svojim mjestima na web-karti, ne u sastavljaču Shortlist Builder. Ažuriranja tih podataka automatski će se prikazati na vašem Shortlistu. Ova opcija zahtijeva korištenje ovog predloška za vaše podatke.",
        "badData": "Točkasti sloj koji sadrži vaša mjesta ne koristi potrebni predložak za podatke. Pregledajte uvjete predloška.",
        "downloadTemplate": "Preuzmi predložak"
      },
      "fieldPicker": {
        "nameField": "Polja koja sadrže naziv pojedinih mjesta: ",
        "descriptionField": "Polja koja će se pojaviti u opisu za pojedino mjesto i njihov redoslijed: ",
        "urlField": "Polja koja sadrže URL za „Više informacija” o svakom mjestu (dodatno): ",
        "none": "nema",
        "imageFields": "Polja koja sadrže URL za slike za pojedina mjesta (dodatno): ",
        "mainImageField": "Glavna slika: ",
        "thumbImageField": "Sličica: ",
        "noImageFields": "Ostavite ovo nepostavljeno ako želite dodavati slike svojim mjestima u sastavljaču",
        "tabField": "Ako imate naziv polja koji dijeli mjesta na vašem sloju u različite teme, odaberite prikladni naziv polja u nastavku."
      },
      "layerPicker": {
        "pointLayers": "Odaberite točkaste slojeve na vašoj web-karti koje želite koristiti kao mjesta: ",
        "layerInfo": "Ako odaberete više od jednog sloja, sva moraju imati isti skup polja. Svaki sloj koji odaberete postat će kartica na vašem Shortlistu."
      }
    }
  }
});