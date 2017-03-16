define({
  "builder": {
    "initPopup": {
      "title": "Velkommen til",
      "startBtn": "Start"
    },
    "addEditPopup": {
      "test": "test",
      "add": "legg til",
      "edit": "rediger"
    },
    "landing": {
      "lblAdd": "Hva vil du kalle din Shortlist?",
      "phAdd": "Skriv inn tittelen...",
      "lblOR": "Eller",
      "lblHelp": "Få en omvisning"
    },
    "organizePopup": {
      "title": "Organiser",
      "tab": "fane"
    },
    "settingsLayoutOptions": {
      "title": "Oppsettalternativer",
      "lblDescription": "Beskrivelse"
    },
    "addFeatureBar": {
      "add": "Legg til",
      "import": "Importer",
      "done": "Ferdig",
      "deleteFeature": "Slett",
      "move": "Flytt",
      "locateFeaturesTooltip": "Enkelte steder må lokaliseres. Klikk på denne for å se dem"
    },
    "detailPanelBuilder": {
      "changeLocation": "Endre lokasjon",
      "setLocation": "Angi lokasjon",
      "cancel": "Avbryt",
      "addImage": "klikk eller dra og slipp for å legge til et bilde",
      "enterPlaceName": "Angi stedsnavn",
      "enterPlaceDescription": "Angi stedsbeskrivelse",
      "unnamedPlace": "Sted uten navn"
    },
    "settings": {
      "numberedPlaces": "Vis steder med tall",
      "extentSensitive": "Vis bare steder i faner som er synlige på kartet (bare i visningen).",
      "extentSensitiveTooltip": "Dette alternativet gjelder bare når Shortlist vises. I Shortlist Builder viser fanene alltid alle steder, også steder som ikke er synlige på kartet. Fjern merket for dette alternativet hvis du vil at fanene alltid skal vise alle steder når Shortlist vises.",
      "locateButton": "Finn-knappen",
      "locateButtonTooltip": "La leserne se deres gjeldende lokasjon på kartet. Denne funksjonen støttes på de fleste enheter og nettlesere, men knappen vises bare hvis du deler historien som en HTTPS-kobling, og historien ikke er bygget inn.",
      "geocoder": "Adresse, Sted, og Geoobjektfinner",
      "bookmarks": "Bokmerker",
      "bookmarksMenuName": "Menynavn",
      "defaultMapLocation": "Standard kartlokasjon",
      "auto": "Auto",
      "autoTooltip": "Lokasjonen styres automatisk slik at alle stedene er synlige",
      "custom": "Tilpasset",
      "customTooltip": "Angi lokasjonen ved hjelp av knappen som vises i kartets zoomkontroller",
      "mapLocationTooltip": "Lokasjonen folk ser når de åpner din Shortlist",
      "bookmarksHelp": "For å aktivere bokmerker i Shortlist legger du til og administrer webkartets bokmerker i webkartvisningen"
    },
    "help": {
      "title": "HJELP",
      "shortlistHelp1": "Velkommen til Story Map Shortlist. Med denne applikasjonen kan du presentere interessante steder ordnet i faner, noe som gjør det morsomt for brukerne å gjøre seg kjent med hva som finnes i området. Du kan interaktivt legge inn lokasjoner i dette byggeverktøyet.",
      "shortlistHelp2": "Du kan også lage en shortlist fra et eksisterende ArcGIS-webkart, inkludert muligheten til å bruke eksisterende punktdata i kartet som steder.",
      "shortlistHelp3": "For å lage en shortlist fra et webkart, går du til",
      "shortlistHelp4": "åpne webkartet, lag en webapp fra det, og velg Story Map Shortlist fra applikasjonsgalleriet. Hvis webkartet inneholder et punktlag, vil Shortlist Builder be deg om å velge de lagene du ønsker å bruke som steder. Hvis du har opprettet en shortlist med den originale, ikke-hostede versjonen av applikasjonen, kan du overføre Shortlist til denne hostede versjonen av applikasjonen med de samme trinnene.",
      "shortlistHelp5": "For mer informasjon",
      "shortlistHelp6": "Gå til Shortlistseksjonen i webområdet for Esris historiekart",
      "shortlistFAQ": "Vanlige spørsmål om Shortlist",
      "shortlistBetaFeedback": "Beta-tilbakemelding",
      "shortlistBetaFeedback2": "Vi vil gjerne høre fra deg! La oss få vite om problemer og nye funksjoner du trenger ved å gå til",
      "geonetForum": "Fortellingskart-forumet på GeoNet"
    },
    "migration": {
      "migrationPattern": {
        "welcome": "Velkommen til Shortlist-byggeverktøyet",
        "importQuestion": "Webkartet ditt inneholder punktdata. Ønsker du å bruke disse punktene som steder i din Shortlist?",
        "importExplainYes": "Du vil kunne redigere, administrere og legge til dine steder i Shorlist-byggeverktøyet. En kopi av webkartet opprettes automatisk, så de opprinnelige dataene blir ikke endret.",
        "importExplainNo": "Punktene dine vil bli vist på shortlist-kartet, men de vil ikke bli brukt som lokasjoner. I stedet legger du dine steder i din Shortlist i byggeverktøyet.",
        "no": "Nei",
        "importOption": "Ja, importer dem",
        "asIsOption": "Ja, bruk dem som de er",
        "asIsText": "Du fortsetter å redigere og administrere stedene i webkartet, ikke i Shortlist-byggeverktøyet. Oppdateringer av disse dataene gjenspeiles automatisk i din Shortlist. Dette alternativet krever at dataene dine bruker denne malen.",
        "badData": "Punktlaget som inneholder steder, bruker ikke den påkrevde datamalen. Les gjennom kravene for malen.",
        "downloadTemplate": "Last ned mal"
      },
      "fieldPicker": {
        "nameField": "Felt som inneholder navnet på hvert sted: ",
        "descriptionField": "Felt(er) som vises i beskrivelsen for hvert sted og deres rekkefølge: ",
        "urlField": "Feltet som inneholder URL-en for «Mer info» om hvert sted (valgfritt): ",
        "none": "ingen",
        "imageFields": "Felt som inneholder en URL til bilder for hvert sted (valgfritt): ",
        "mainImageField": "Hovedbilde ",
        "thumbImageField": "Miniatyrbilde: ",
        "noImageFields": "La disse være satt til ingen hvis du ønsker å legge til bilder til dine steder i byggeverktøyet",
        "tabField": "Hvis du har et feltnavn som deler stedene i laget ditt i ulike temaer, velger du det aktuelle feltnavnet nedenfor."
      },
      "layerPicker": {
        "pointLayers": "Velg punktlag(ene) i webkartet du ønsker å bruke som steder: ",
        "layerInfo": "Hvis du velger flere enn ett lag, må alle ha det samme settet av felter. Hvert lag du velger, vil bli en fane i din shortlist."
      }
    }
  }
});