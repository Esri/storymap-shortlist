define({
  "builder": {
    "initPopup": {
      "title": "Dobro došli na",
      "startBtn": "Početak"
    },
    "addEditPopup": {
      "test": "test",
      "add": "dodaj",
      "edit": "izmeni"
    },
    "landing": {
      "lblAdd": "Kako želite da nazovete Shortlist?",
      "phAdd": "Unesite naslov...",
      "lblOR": "ili",
      "lblHelp": "Krenite na turu"
    },
    "organizePopup": {
      "title": "Organizujte",
      "tab": "kartica"
    },
    "settingsLayoutOptions": {
      "title": "Opcije rasporeda",
      "lblDescription": "Opis"
    },
    "addFeatureBar": {
      "add": "Dodaj",
      "import": "Uvezi",
      "done": "Završeno",
      "deleteFeature": "Izbriši",
      "move": "Premesti",
      "locateFeaturesTooltip": "Nek mesta treba da budu locirana. Kliknite ovde da biste ih videli"
    },
    "detailPanelBuilder": {
      "changeLocation": "Promeni lokaciju",
      "setLocation": "Podesi lokaciju",
      "cancel": "Otkaži",
      "addImage": "kliknite, ili prevucite i otpustite da biste dodali snimak",
      "enterPlaceName": "Unesite ime mesta",
      "enterPlaceDescription": "Unesite opis mesta",
      "unnamedPlace": "Mesto bez naziva"
    },
    "settings": {
      "numberedPlaces": "Prikaži mesta sa brojevima",
      "extentSensitive": "Prikaži samo mesta na karticama koje su vidljiv na mapi (samo preglednik)",
      "extentSensitiveTooltip": "Ova opcija se primenjuje samo kada se pregleda Shortlist. U alatki Shortlist Builder, kartice uvek prikazuju sva mesta, čak i mesta koja nisu vidljiva na mapi. Poništite izbor ove opcije ako želite da kartice uvek prikazuju sva mesa kada se pregleda Shortlist.",
      "locateButton": "Dugme „Lociraj“",
      "locateButtonTooltip": "Omogućite čitaocima da vide svoju trenutnu lokaciju na mapi. Ova funkcija je podržana na većini uređaja i pregledača, ali se dugme prikazuje samo ako podelite priču kao HTTPS link i ako priča nije ugrađena.",
      "geocoder": "Adresa, mesto i pronalazač geoobjekta",
      "bookmarks": "Obeleživači",
      "bookmarksMenuName": "Naziv menija",
      "defaultMapLocation": "Podrazumevana lokacija mape",
      "auto": "Automatski",
      "autoTooltip": "Lokacijom se upravlja automatski tako da su sva mesta vidljiva",
      "custom": "Prilagođeno",
      "customTooltip": "Postavite lokaciju korišćenjem dugmeta koje se pojavljuje u kontroli zuma mape",
      "mapLocationTooltip": "Lokacija koju ljudi vide kada otvaraju Shortlist",
      "bookmarksHelp": "Dodajte i upravljajte obeleživačima veb mape u pregledniku veb mape da biste omogućili obeleživače u Shortlist."
    },
    "help": {
      "title": "POMOĆ",
      "shortlistHelp1": "Dobrodošli u Story Map Shortlist. Ova aplikacija vam omogućava da predstavite mesta od interesa organizacijom u karticama, čineći istraživanje oblasti zabavnim za ljude. Mesta možete da kreirate interaktivno u ovoj alatki za izradu.",
      "shortlistHelp2": "Takođe, možete da kreirate Shortlist od postojeće ArcGIS veb mape, uključujući opciju korišćenja postojećih podataka iz tačaka kao mesta na mapi.",
      "shortlistHelp3": "Da biste kreirali Shortlist iz veb mape,",
      "shortlistHelp4": "otvorite veb mapu, kreirajte veb aplikaciju od nje i odaberite Story Map Shortlist iz galerije aplikacija. Ako vaša veb mapa sadrži tačkaste slojeve, Shortlist Builder će tražiti od vas da odaberete slojeve koje želite d koristite kao mesta. Ako kreirate Shortlist korišćenjem originalne, nehostovane verzije aplikacije, možete da migrirate Shortlist u ovu hostovanu verziju aplikacije korišćenjem istih koraka.",
      "shortlistHelp5": "Za više informacija.",
      "shortlistHelp6": "posetite Shortlist odeljak na veb sajtu Esri Story Maps",
      "shortlistFAQ": "Često postavljana pitanja za Shortlist",
      "shortlistBetaFeedback": "Beta povratne informacije",
      "shortlistBetaFeedback2": "Voleli bismo da vas čujemo! Obavestite nas o problemima i novim geoobjektima koji su vam potrebni posetom",
      "geonetForum": "Story Maps foruma na GeoNet stranici"
    },
    "migration": {
      "migrationPattern": {
        "welcome": "Dobrodošli u Shortlist Builder",
        "importQuestion": "Vaša veb mapa sadrži podatke iz tačaka. Želite li da koristite te tačke kao mesta u Shortlist aplikaciji?",
        "importExplainYes": "Moći ćete da uređujete, upravljate i dodajete mesta u alatki Shortlist Builder. Kopija vaše veb mape će da bude automatski kreirana tako da se izvorni podaci ne modifikuju.",
        "importExplainNo": "Tačke će da budu prikazane u Shortlist mapi ali neće da budu korišćene kao mesta. Umesto toga, mesta ćete dodati u Shortlist aplikaciju u alatku Builder.",
        "no": "Ne",
        "importOption": "Da, uvezi ih",
        "asIsOption": "Da, koristi ih kakve jesu",
        "asIsText": "Nastavićete da uređujete i upravljate mestima u veb mapi, ne u Shortlist Builder alatki. Ažuriranja koja napravite na podacima će automatski da budu primenjena u Shortlist aplikaciji. Ova opcija zahteva da vaši podaci koriste ovaj šablon.",
        "badData": "Tačkasti sloj koji sadrži vaša mesta ne koristi zahtevani obrazac podataka. Pregledajte ponovo zahteve obrasca.",
        "downloadTemplate": "Preuzmi šablon"
      },
      "fieldPicker": {
        "nameField": "Polje koje sadrži ime svakog mesta: ",
        "descriptionField": "Polje(polja) će se pojaviti u opisu za svako mesto prema njihovom redosledu: ",
        "urlField": "Polje koje sadrži URL adresu za „Više informacija“ o svakom mestu (opciono): ",
        "none": "ništa",
        "imageFields": "Polje koje sadrži URL adresu ka snimcima za svako mesto (opciono): ",
        "mainImageField": "Glavni snimak: ",
        "thumbImageField": "Sličica: ",
        "noImageFields": "Ostavite ova polja postavljena na opciju „Nijedan“ ako želite da dodate snimke u vaša mesta u alatki Builder",
        "tabField": "Ako imate naziv polja koji deli mesta u sloju na različite teme, odaberite odgovarajuće ime polja ispod."
      },
      "layerPicker": {
        "pointLayers": "Odaberite tačkasti(-e) sloj(eve)u veb mapi koji(-e) želite da koristite kao mesta: ",
        "layerInfo": "Ako odaberete više od jednog sloja, svi moraju da imaju isti ser polja. Svaki sloj koji odaberete će postati kartica na shortlist."
      }
    }
  }
});