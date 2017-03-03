define({
  "builder": {
    "initPopup": {
      "title": "Bem-vindo a",
      "startBtn": "Iniciar"
    },
    "addEditPopup": {
      "test": "teste",
      "add": "adicionar",
      "edit": "editar"
    },
    "landing": {
      "lblAdd": "Que nome pretende dar à sua Shortlist?",
      "phAdd": "Introduza o seu título...",
      "lblOR": "Ou",
      "lblHelp": "Fazer uma visita guiada"
    },
    "organizePopup": {
      "title": "Organizar",
      "tab": "separador"
    },
    "settingsLayoutOptions": {
      "title": "Ópções de layout",
      "lblDescription": "Descrição"
    },
    "addFeatureBar": {
      "add": "Adicionar",
      "import": "Importar",
      "done": "Terminado",
      "deleteFeature": "Excluir",
      "move": "Mover",
      "locateFeaturesTooltip": "Alguns lugares têm de ser localizados. Clique aqui para visualizá-los"
    },
    "detailPanelBuilder": {
      "changeLocation": "Alterar localização",
      "setLocation": "Definir Localização",
      "cancel": "Cancelar",
      "addImage": "clique, ou arraste e solte, para adicionar uma imagem",
      "enterPlaceName": "Introduzir nome do local",
      "enterPlaceDescription": "Introduzir descrição do local",
      "unnamedPlace": "Local sem nome"
    },
    "settings": {
      "numberedPlaces": "Exibir locais com números",
      "extentSensitive": "Apenas exibir locais em separadores que se encontrem visíveis no mapa (visualizador apenas)",
      "extentSensitiveTooltip": "Esta opção apenas se aplica quando a sua Shortlist é visualizada. No Shortlist Builder, os separadores exibem sempre todos os locais, mesmo aqueles que não se encontram visíveis no mapa. Desmarque esta opção caso pretenda que os separadores exibam sempre todos os locais quando a sua Shortlist é visualizada.",
      "locateButton": "Botão Localizar",
      "locateButtonTooltip": "Permita que os seus leitores visualizem a respetiva posição atual no mapa.  Esta funcionalidade é suportada na maioria dos dispositivos e navegadores, mas o botão apenas é apresentado se partilhar a sua história como ligação HTTPS e a história não se encontrar incorporada.",
      "geocoder": "Localizador (Finder) de Endereços, Locais e Elementos",
      "bookmarks": "Marcadores",
      "bookmarksMenuName": "Nome do Menu",
      "defaultMapLocation": "Localização de mapa predefinida",
      "auto": "Auto",
      "autoTooltip": "A localização é gerida automaticamente para que todos os locais sejam visíveis",
      "custom": "Personalizar",
      "customTooltip": "Defina a localização utilizando o botão que aparece nos controlos de zoom do mapa",
      "mapLocationTooltip": "A localização que os utilizadores visualizam quando abrem a sua Shortlist",
      "bookmarksHelp": "Para ativar marcadores, adicione e efetue a gestão dos marcadores do mapa web no visualizador de mapas web"
    },
    "help": {
      "title": "AJUDA",
      "shortlistHelp1": "Bem Vindo à Story Map Shortlist Esta aplicação permite-lhe apresentar locais de interesse organizados em separadores, tornando divertida e simples a experiência de explorar aquilo que se encontra disponível numa área. Pode criar os seus locais de modo interativo com este Builder.",
      "shortlistHelp2": "Pode ainda criar uma Shortlist a partir de mapa web ArcGIS existente, incluindo a opção de utilizar dados de ponto existentes como locais no mapa.",
      "shortlistHelp3": "Para criar uma Shortlist a partir de um mapa web,",
      "shortlistHelp4": "abra o mapa web, crie uma aplicação web a partir do mesmo e selecione Story Maps Shortlist na galeria de aplicações. Caso o seu mapa web contenha quaisquer camadas de pontos, o Shortlist Builder irá instá-lo a selecionar as camadas que pretende utilizar como locais. Caso tenha criado uma Shortlist utilizando a versão original, não alojada, da aplicação, pode migrar a sua Shortlist para esta versão alojada da aplicação seguindo os mesmos passos.",
      "shortlistHelp5": "Para obter mais informações",
      "shortlistHelp6": "Visite a secção Shortlist do site web Esri Story Maps",
      "shortlistFAQ": "FAQ sobre Shortlists",
      "shortlistBetaFeedback": "Feedback beta",
      "shortlistBetaFeedback2": "Gostaríamos de ter notícias suas! Informe-nos acerca de quaisquer problemas e de novas funcionalidades de necessite visitando o",
      "geonetForum": "fórum Story Maps na GeoNet"
    },
    "migration": {
      "migrationPattern": {
        "welcome": "Bem-vindo ao Shortlist Builder",
        "importQuestion": "O seu mapa web contém dados de ponto.  Pretende utilizar esses pontos como locais na sua Shortlist?",
        "importExplainYes": "Terá a possibilidade de editar, gerir e adicionar aos seus locais no Shortlist Builder.  É automaticamente criada uma cópia do seu mapa web, portanto os seus dados iniciais não são modificados.",
        "importExplainNo": "Os seus pontos serão exibidos no mapa da sua Shortlist, mas não serão utilizados como locais.  Ao invés, irá adicionar locais à sua Shortlist no Builder.",
        "no": "Não",
        "importOption": "Sim, importar",
        "asIsOption": "Sim, utilizá-los tal como se encontram (as-is)",
        "asIsText": "Continuará a editar e gerir os seus locais no seu mapa web, não no Shortlist Builder.  As atualizações que aplicar a esses dados refletir-se-ão automaticamente na sua Shortlist.  Esta opção requer que os seus dados utilizem este modelo.",
        "badData": "A camada de pontos que contém os seus locais não utiliza o modelo de dados necessário. Por favor, reveja os requisitos do modelo.",
        "downloadTemplate": "Transferir modelo"
      },
      "fieldPicker": {
        "nameField": "Campo que contém o nome de cada local: ",
        "descriptionField": "Campo(s) a exibir na descrição de cada local e da respetiva ordem: ",
        "urlField": "Campo que contém o URL que leva a ‘Mais info’ sobre cada local (opcional): ",
        "none": "nenhum",
        "imageFields": "Campos que contêm URl para imagens para cada local (opciona): ",
        "mainImageField": "Imagem principal: ",
        "thumbImageField": "Miniatura: ",
        "noImageFields": "Deixe estas definidas para nenhum, caso pretenda adicionar imagens aos seus locais no Builder.",
        "tabField": "Caso tenha um nome de campo que divide os locais na sua camada em diferentes temas, selecione o nome de campo apropriado acima."
      },
      "layerPicker": {
        "pointLayers": "Selecione a(s) camada(s) de pontos no seu mapa que pretende utilizar como locais. ",
        "layerInfo": "Caso selecione mais do que uma camada, todas têm de ter o mesmo conjunto de campos.  Cada camada que selecionar tornar-se-á num separador na sua shortlist."
      }
    }
  }
});