define({
  "builder": {
    "initPopup": {
      "title": "Bienvenido a",
      "startBtn": "Iniciar"
    },
    "addEditPopup": {
      "test": "prueba",
      "add": "agregar",
      "edit": "editar"
    },
    "landing": {
      "lblAdd": "¿Qué nombre desea darle a su Shortlist?",
      "phAdd": "Introduzca el título...",
      "lblOR": "O",
      "lblHelp": "Realizar un recorrido"
    },
    "organizePopup": {
      "title": "Organizar",
      "tab": "pestaña"
    },
    "settingsLayoutOptions": {
      "title": "Opciones de diseño",
      "lblDescription": "Descripción"
    },
    "addFeatureBar": {
      "add": "Agregar",
      "import": "Importar",
      "done": "Listo",
      "deleteFeature": "Eliminar",
      "move": "Mover",
      "locateFeaturesTooltip": "Es necesario localizar algunos lugares. Haga clic aquí para verlos"
    },
    "detailPanelBuilder": {
      "changeLocation": "Cambiar ubicación",
      "setLocation": "Definir ubicación",
      "cancel": "Cancelar",
      "addImage": "haga clic o arrastre y suelte para agregar una imagen",
      "enterPlaceName": "Introducir nombre de lugar",
      "enterPlaceDescription": "Introducir descripción de lugar",
      "unnamedPlace": "Lugar sin nombre"
    },
    "settings": {
      "numberedPlaces": "Mostrar lugares con números",
      "extentSensitive": "Mostrar en las pestañas solo los lugares que están visibles en el mapa (solo visor)",
      "extentSensitiveTooltip": "Esta opción solo se aplica al visualizar la Shortlist. En el Builder de Shortlist, las pestañas siempre muestran todos los lugares, incluso los que no están visibles en el mapa. Desactive esta opción si desea que las pestañas muestren siempre todos los lugares al visualizar la Shortlist.",
      "locateButton": "Botón Localizar",
      "locateButtonTooltip": "Permita que sus lectores vean su ubicación actual en el mapa. Esta característica se admite en la mayoría de los dispositivos y navegadores, pero el botón solo aparece si comparte su historia como vínculo HTTPS y la historia no se ha integrado.",
      "geocoder": "Buscador de direcciones, lugares y entidades",
      "bookmarks": "Marcadores",
      "bookmarksMenuName": "Nombre del menú",
      "defaultMapLocation": "Ubicación de mapa predeterminada",
      "auto": "Automática",
      "autoTooltip": "La ubicación se administra automáticamente para que todos los lugares estén visibles",
      "custom": "Personalizada",
      "customTooltip": "Defina la ubicación usando el botón que aparecerá en los controles de zoom del mapa",
      "mapLocationTooltip": "La ubicación que los usuarios ven cuando abren su Shortlist",
      "bookmarksHelp": "Para habilitar los marcadores en la Shortlist, agregue y administre los marcadores del mapa web en el visor de mapas web"
    },
    "help": {
      "title": "AYUDA",
      "shortlistHelp1": "Bienvenido a Story Map Shortlist. Esta aplicación le permite presentar lugares de interés organizados en pestañas para que los usuarios puedan divertirse explorando lo que hay en una zona. Puede crear los lugares de forma interactiva en este Builder.",
      "shortlistHelp2": "También puede crear una Shortlist a partir de un mapa web de ArcGIS, con la opción de usar datos de puntos existentes en el mapa como lugares.",
      "shortlistHelp3": "Para crear una Shortlist a partir de un mapa web, vaya a",
      "shortlistHelp4": "abra el mapa web, cree una aplicación web a partir de él y elija Story Map Shortlist en la galería de aplicaciones. Si el mapa web contiene capas de puntos, el Builder de Shortlist le pedirá que seleccione las capas que desea usar como lugares. Si creó una Shortlist usando la versión original no alojada de la aplicación, puede migrarla a esta versión alojada de la aplicación siguiendo los mismos pasos.",
      "shortlistHelp5": "Para obtener más información",
      "shortlistHelp6": "Visite la sección Shortlist del sitio web de Esri Story Maps",
      "shortlistFAQ": "Preguntas frecuentes sobre Shortlist",
      "shortlistBetaFeedback": "Comentarios sobre la versión beta",
      "shortlistBetaFeedback2": "Nos encantaría conocer su opinión. Infórmenos de los problemas detectados y de las características que necesita visitando el",
      "geonetForum": "Foro de Story Maps en GeoNet"
    },
    "migration": {
      "migrationPattern": {
        "welcome": "Bienvenido al Builder de Shortlist",
        "importQuestion": "Su mapa web contiene datos de puntos. ¿Desea usar esos puntos como lugares en su Shortlist?",
        "importExplainYes": "Podrá editar, administrar y agregar lugares en el Builder de Shorlist. Se crea automáticamente una copia de su mapa para que los datos originales no se modifiquen.",
        "importExplainNo": "Los puntos se mostrarán en el mapa de Shortlist, pero no se usarán como lugares. En vez de eso, agregará los lugares en su Shortlist usando el Builder.",
        "no": "No",
        "importOption": "Sí, importarlos",
        "asIsOption": "Sí, usarlos como están",
        "asIsText": "Seguirá editando y administrando sus lugares en el mapa web, no en el Builder de Shortlist. Las actualizaciones que realice en esos datos se reflejarán automáticamente en la Shortlist. Esta opción requiere que los datos usen esta plantilla.",
        "badData": "La capa de puntos que contiene sus lugares no usa la plantilla de datos requerida. Revise los requisitos en la plantilla.",
        "downloadTemplate": "Descargar plantilla"
      },
      "fieldPicker": {
        "nameField": "Campo que contiene el nombre de cada lugar ",
        "descriptionField": "Campos que aparecerán en la descripción de cada lugar y su orden: ",
        "urlField": "Campo que contiene la dirección URL para obtener \"Más información\" sobre cada lugar (opcional): ",
        "none": "ninguno",
        "imageFields": "Campos que contienen la dirección URL de las imágenes de cada lugar (opcional): ",
        "mainImageField": "Imagen principal: ",
        "thumbImageField": "Vista en miniatura: ",
        "noImageFields": "Deje estas opciones configuradas como Ninguno si desea agregar imágenes a los lugares en el Builder",
        "tabField": "Si tiene un nombre de campo que divide los lugares de la capa en distintos temas, seleccione a continuación el nombre de campo correspondiente."
      },
      "layerPicker": {
        "pointLayers": "Elija las capas de puntos del mapa web que desea usar como lugares: ",
        "layerInfo": "Si elige más de una capa, todas deben tener el mismo conjunto de campos. Cada capa que elija se convertirá en una pestaña en la shortlist."
      }
    }
  }
});