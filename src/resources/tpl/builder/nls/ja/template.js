define({
  "builder": {
    "initPopup": {
      "title": "ようこそ",
      "startBtn": "開始"
    },
    "addEditPopup": {
      "test": "テスト",
      "add": "追加",
      "edit": "編集"
    },
    "landing": {
      "lblAdd": "ショートリスト名",
      "phAdd": "タイトルの入力...",
      "lblOR": "または",
      "lblHelp": "ツアーの開始"
    },
    "organizePopup": {
      "title": "整理",
      "tab": "タブ"
    },
    "settingsLayoutOptions": {
      "title": "レイアウト オプション",
      "lblDescription": "説明"
    },
    "addFeatureBar": {
      "add": "追加",
      "import": "インポート",
      "done": "完了",
      "deleteFeature": "削除",
      "move": "移動",
      "locateFeaturesTooltip": "場所を特定する必要があります。これをクリックすると表示されます。"
    },
    "detailPanelBuilder": {
      "changeLocation": "位置設定の変更",
      "setLocation": "場所の設定",
      "cancel": "キャンセル",
      "addImage": "クリックまたはドラッグ アンド ドロップして画像を追加",
      "enterPlaceName": "場所名を入力",
      "enterPlaceDescription": "場所の説明を入力",
      "unnamedPlace": "無名の場所"
    },
    "settings": {
      "numberedPlaces": "数字の付いた場所を表示",
      "extentSensitive": "マップに表示されている場所のみをタブに表示 (ビューアーのみ)",
      "extentSensitiveTooltip": "このオプションは、ショートリストを表示しているときのみ適用されます。ショートリスト ビルダーでは、タブにはマップ上に表示されない場所を含めて、すべての場所が表示されます。ショートリストを表示するときに、すべての場所をタブに常に表示するには、このオプションをオフにします。",
      "locateButton": "[場所検索] ボタン",
      "locateButtonTooltip": "ユーザーがマップ上に現在地を表示できるようにします。この機能は、ほとんどのデバイスおよびブラウザーでサポートされていますが、このボタンは、ストーリーを HTTPS リンクとして共有し、そのストーリーが埋め込まれていない場合にのみ表示されます。",
      "geocoder": "住所、場所、フィーチャの検索",
      "bookmarks": "ブックマーク",
      "bookmarksMenuName": "メニュー名",
      "defaultMapLocation": "デフォルトのマップ位置",
      "auto": "自動",
      "autoTooltip": "すべての場所が表示されるように、場所が自動的に管理されます。",
      "custom": "カスタム",
      "customTooltip": "マップ ズーム コントロールに表示されるボタンを使用して場所を設定します。",
      "mapLocationTooltip": "ショートリストを開いたときに表示される場所",
      "bookmarksHelp": "ショートリストでブックマークを有効にするには、Web マップ ビューアーで Web マップのブックマークを追加および管理します。"
    },
    "help": {
      "title": "ヘルプ",
      "shortlistHelp1": "ストーリー マップ ショートリストへようこそ。このアプリを使用すると、エリア内を楽しく探索できるように、対象の場所をタブに整理して表示できます。場所は、このビルダーで対話形式で作成できます。",
      "shortlistHelp2": "また、既存の ArcGIS Web マップからショートリストを作成することもできます。この場合、マップ内の既存のポイント データを場所として使用するオプションがあります。",
      "shortlistHelp3": "Web マップからショートリストを作成するには、",
      "shortlistHelp4": "に移動して、Web マップを開き、そこから Web アプリを作成して、アプリのギャラリーからストーリー マップ ショートリストを選択します。Web マップにポイント レイヤーが含まれている場合は、ショートリスト ビルダーから場所として使用するレイヤーを選択するように求められます。元のホストされていないバージョンのアプリを使用してショートリストを作成した場合は、ショートリストをこのホストされたバージョンのアプリに同様の手順で移行できます。",
      "shortlistHelp5": "詳細情報",
      "shortlistHelp6": "Esri ストーリー マップ Web サイトのショートリスト セクションをご覧ください。",
      "shortlistFAQ": "ショートリストの FAQ",
      "shortlistBetaFeedback": "ベータ版のフィードバック",
      "shortlistBetaFeedback2": "皆様からのフィードバックをお待ちしています。問題や必要な新機能についてのご意見を次の場所でお聞かせください。",
      "geonetForum": "GeoNet のストーリー マップ フォーラム"
    },
    "migration": {
      "migrationPattern": {
        "welcome": "ショートリスト ビルダーへようこそ",
        "importQuestion": "Web マップにポイント データが含まれています。それらのポイントをショートリストの場所として使用しますか？",
        "importExplainYes": "ショートリスト ビルダーでは、場所を編集、管理、追加できます。元のデータが変更されないように、Web マップのコピーが自動的に作成されます。",
        "importExplainNo": "ポイントはショートリスト マップに表示されますが、場所としては使用されません。代わりに、ビルダーで場所をショートリストに追加します。",
        "no": "いいえ",
        "importOption": "はい。インポートします。",
        "asIsOption": "はい。そのまま使用します。",
        "asIsText": "ショートリスト ビルダーではなく、Web マップで場所を引き続き編集および管理します。そのデータに加えた更新は、ショートリストに自動的に反映されます。このオプションでは、データがこのテンプレートを使用している必要があります。",
        "badData": "場所を含むポイント レイヤーが、必要なデータ テンプレートを使用していません。テンプレートの要件を確認してください。",
        "downloadTemplate": "テンプレートのダウンロード"
      },
      "fieldPicker": {
        "nameField": "各場所の名前を含むフィールド: ",
        "descriptionField": "各場所の説明に表示されるフィールドとその順序: ",
        "urlField": "各場所の「詳細」の URL を含むフィールド (オプション): ",
        "none": "なし",
        "imageFields": "各場所の画像の URL を含むフィールド (オプション): ",
        "mainImageField": "メイン画像: ",
        "thumbImageField": "サムネイル: ",
        "noImageFields": "ビルダーで画像を場所に追加する場合は、この設定をなしのままにしておきます。",
        "tabField": "レイヤー内の場所を複数のテーマに分割するフィールド名がある場合は、以下で適切なフィールド名を選択します。"
      },
      "layerPicker": {
        "pointLayers": "場所として使用する Web マップ内のポイント レイヤーを選択します。 ",
        "layerInfo": "複数のレイヤーを選択した場合、すべてが同じフィールド セットを持つ必要があります。選択した各レイヤーがショートリストのタブになります。"
      }
    }
  }
});