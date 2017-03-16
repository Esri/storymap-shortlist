define({
  "builder": {
    "initPopup": {
      "title": "Bem-Vindo ao",
      "startBtn": "Iniciar"
    },
    "addEditPopup": {
      "test": "testar",
      "add": "adicionar",
      "edit": "editar"
    },
    "landing": {
      "lblAdd": "Como você deseja nomear sua Lista Restrita?",
      "phAdd": "Insira seu título...",
      "lblOR": "Ou",
      "lblHelp": "Obter uma Apresentação"
    },
    "organizePopup": {
      "title": "Organizar",
      "tab": "guia"
    },
    "settingsLayoutOptions": {
      "title": "Opções de layout",
      "lblDescription": "Descrição"
    },
    "addFeatureBar": {
      "add": "Adicionar",
      "import": "Importar",
      "done": "Concluir",
      "deleteFeature": "Excluir",
      "move": "Mover",
      "locateFeaturesTooltip": "Alguns lugares precisam ser localizados. Clique neste para visualizá-los"
    },
    "detailPanelBuilder": {
      "changeLocation": "Alterar localização",
      "setLocation": "Configurar Local",
      "cancel": "Cancelar",
      "addImage": "clique, ou, arraste e solte, para adicionar uma imagem",
      "enterPlaceName": "Insira o nome do local",
      "enterPlaceDescription": "Insira a descrição do local",
      "unnamedPlace": "Local sem nome"
    },
    "settings": {
      "numberedPlaces": "Mostrar lugares com números",
      "extentSensitive": "Mostrar somente os locais nas guias visíveis no mapa (visualizador somente)",
      "extentSensitiveTooltip": "Esta opção aplica-se somente quando a sua Lista Restrita é visualizada. No Construtor de Lista Restrita, as guias sempre mostram todos os locais, mesmo os que não são visíveis no mapa. Desmarque esta opção se desejar que as guias sempre mostrem todos os locais quando a sua Lista Restrita for visualizada.",
      "locateButton": "Botão Localizar",
      "locateButtonTooltip": "Permita que seus leitores visualizem sua localização atual no mapa.  Esta feição é suportada na maioria dos dispositivos e navegadores, mas o botão aparece somente se você compartilhar sua história como um link de HTTPS e a história não estiver embutida.",
      "geocoder": "Localizador de Feição, Lugar e Endereço",
      "bookmarks": "Marcadores",
      "bookmarksMenuName": "Nome do Menu",
      "defaultMapLocation": "Localização de mapa padrão",
      "auto": "Automático",
      "autoTooltip": "O local é gerenciado automaticamente para que todos os seus locais sejam visíveis",
      "custom": "Personalizar",
      "customTooltip": "Defina o local utilizando o botão que aparecerá nos controles de zoom do mapa",
      "mapLocationTooltip": "O local que as pessoas visualizam quando abrem a sua lista de favoritos",
      "bookmarksHelp": "Para habilitar os favoritos na Lista Restrita, adicione e gerencie os marcadores de mapa da web no visualizador de mapa da web"
    },
    "help": {
      "title": "AJUDA",
      "shortlistHelp1": "Bem-Vindo à Lista Restrita do Mapa Histórico. Este aplicativo permite a você apresentar os locais de interesse organizados em guias, tornando divertido para as pessoas explorarem o que está em uma área. Você pode criar seus locais interativamente neste Construtor.",
      "shortlistHelp2": "Você também pode criar uma Lista Restrita a partir de um mapa da web do ArcGIS existente, incluindo a opção para utilizar os dados de ponto existentes no mapa como locais.",
      "shortlistHelp3": "Para criar uma Lista Restrita a partir de um mapa da web, vá até",
      "shortlistHelp4": "Abra o mapa da web, crie um aplicativo da web a partir dele e escolha Lista Restrita do Mapa Histórico na galeria de aplicativos. Se o mapa da web tiver quaisquer camadas de ponto, o Construtor de Lista Restrita solicitará que você selecione as camadas que deseja utilizar como locais. Se você criou uma Lista Restrita utilizando a versão original não hospedada do aplicativo, você poderá migrar sua Lista Restrita para esta versão hospedada do aplicativo utilizando as mesmas etapas.",
      "shortlistHelp5": "Para mais informações",
      "shortlistHelp6": "Visite a seção Lista Restrita do site da web Mapas Históricos da Esri",
      "shortlistFAQ": "FAQ da Lista Restrita",
      "shortlistBetaFeedback": "Comentário do Beta",
      "shortlistBetaFeedback2": "Gostaríamos muito de ouvir sua opinião! Deixe-nos saber sobre os problemas e novos recursos que você precisa visitando o",
      "geonetForum": "forum de Mapas Históricos no GeoNet"
    },
    "migration": {
      "migrationPattern": {
        "welcome": "Bem-Vindo ao Construtor de Lista Restrita",
        "importQuestion": "Seu mapa da web contém dados de ponto.  Você deseja utilizar estes pontos como locais na sua Lista Restrita?",
        "importExplainYes": "Você poderá editar, gerenciar e adicionar em seus locais no Construtor de Lista Restrita.  Uma cópia do mapa da web é criada automaticamente para que seus dados originais não sejam modificados.",
        "importExplainNo": "Seus pontos serão exibidos no seu mapa de Lista Restrita, mas não serão utilizados como locais.  Caso contrário, você adicionará seus locais na Lista Restrita no Construtor.",
        "no": "Não",
        "importOption": "Sim, importá-los",
        "asIsOption": "Sim, utilizá-los como são",
        "asIsText": "Você continuará a editar e gerenciar seus locais no mapa da web, não no Construtor de Lista Restrita.  As atualizações realizadas nestes dados serão automaticamente refletidas na sua Lista Restrita.  Esta opção exige que seus dados utilizem este modelo.",
        "badData": "A camada de ponto que contém seus locais não utiliza o modelo de dados exigido. Revise os requisitos do modelo.",
        "downloadTemplate": "Modelo de download"
      },
      "fieldPicker": {
        "nameField": "O campo contendo o nome de cada local: ",
        "descriptionField": "Campos que aparecerão na descrição de cada local e sua ordem: ",
        "urlField": "Campo contendo a URL para 'Mais informações' sobre cada local (opcional): ",
        "none": "nenhum",
        "imageFields": "Campos contendo a URL de imagens para cada local (opcional): ",
        "mainImageField": "Imagem principal: ",
        "thumbImageField": "Miniatura: ",
        "noImageFields": "Deixe estes definidos para nenhum se você deseja adicionar imagens aos seus locais no Construtor",
        "tabField": "Se você tiver um nome de campo que divide os locais na sua camada em diferentes temas, selecione o nome de campo apropriado abaixo."
      },
      "layerPicker": {
        "pointLayers": "Escolha as camadas de ponto no mapa da web que deseja utilizar como locais: ",
        "layerInfo": "Se você escolher mais de uma camada, todos elas terão o mesmo conjunto de campos.  Cada camada que você escolher se tornará uma guia na sua lista."
      }
    }
  }
});