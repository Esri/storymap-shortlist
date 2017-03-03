define({
  "builder": {
    "initPopup": {
      "title": "歡迎使用",
      "startBtn": "起始值"
    },
    "addEditPopup": {
      "test": "測試",
      "add": "新增",
      "edit": "編輯"
    },
    "landing": {
      "lblAdd": "您的候選名單要取什麼名稱?",
      "phAdd": "輸入標題...",
      "lblOR": "或者",
      "lblHelp": "進行導覽"
    },
    "organizePopup": {
      "title": "組織",
      "tab": "頁籤"
    },
    "settingsLayoutOptions": {
      "title": "版面設定選項",
      "lblDescription": "說明"
    },
    "addFeatureBar": {
      "add": "新增",
      "import": "匯入",
      "done": "完成",
      "deleteFeature": "刪除",
      "move": "移動",
      "locateFeaturesTooltip": "部分地點需要定位。按一下此選項以查看它們"
    },
    "detailPanelBuilder": {
      "changeLocation": "變更位置",
      "setLocation": "設定位置",
      "cancel": "取消",
      "addImage": "按一下或拖放以新增圖片",
      "enterPlaceName": "輸入地點名稱",
      "enterPlaceDescription": "輸入地點描述",
      "unnamedPlace": "未指定的地點"
    },
    "settings": {
      "numberedPlaces": "顯示包含號碼的地點",
      "extentSensitive": "僅顯示地圖上可見的頁籤中地點 (僅限檢視器)",
      "extentSensitiveTooltip": "只有在檢視候選名單時才適用此選項。在「候選名單建立器」中，頁籤一律會顯示所有地點，即使在地圖上看不到地點也是如此。若要在檢視候選名單時，讓頁籤一律顯示所有地點，請取消勾選此選項。",
      "locateButton": "定位按鈕",
      "locateButtonTooltip": "可讓您的讀者查看其在地圖上的目前位置。大多數裝置和瀏覽器都支援此功能，但只有當您分享故事作為 HTTPS 連結，並且未嵌入故事時才會出現按鈕。",
      "geocoder": "地址、地點和圖徵尋找工具",
      "bookmarks": "書簽",
      "bookmarksMenuName": "功能表名稱",
      "defaultMapLocation": "預設地圖位置",
      "auto": "自動",
      "autoTooltip": "會自動管理位置以顯示您的所有地點",
      "custom": "自訂",
      "customTooltip": "使用地圖縮放控制項中將出現的按鈕來設定位置",
      "mapLocationTooltip": "當使用者開啟您的候選名單時所看到的位置",
      "bookmarksHelp": "若要在候選名單中啟用書籤，請在 Web 地圖檢視器中新增和管理 Web 地圖的書籤"
    },
    "help": {
      "title": "說明",
      "shortlistHelp1": "歡迎使用故事地圖候選名單。此應用程式可讓您顯示組織成頁籤的感興趣地點，讓訪客輕鬆地探索區域中的內容。您可以在此建立器中，以互動方式創作您的地點。",
      "shortlistHelp2": "您也可以從現有的 ArcGIS Web 地圖建立候選名單，包含能在地圖中將現有的點資料作為地點的選項。",
      "shortlistHelp3": "若要從 Web 地圖建立候選名單，請前往",
      "shortlistHelp4": "開啟 Web 地圖、從中建立 Web 應用程式，並從應用程式的圖庫中選擇「故事地圖候選名單」。如果 Web 地圖包含任何點圖層，候選名單建立器將提示您選擇要作為地點的圖層。若要使用原始、非託管版本的應用程式來建立候選名單，可以使用相同的步驟，將候選名單移轉至此託管版本的應用程式。",
      "shortlistHelp5": "如需詳細資訊",
      "shortlistHelp6": "造訪 Esri Story Maps 網站的「候選名單」部分",
      "shortlistFAQ": "候選名單常見問題集",
      "shortlistBetaFeedback": "Beta 回饋意見",
      "shortlistBetaFeedback2": "我們很希望聽到您的意見! 請造訪",
      "geonetForum": "GeoNet 上的 Story Maps 論壇，告訴我們問題和您需要的新功能"
    },
    "migration": {
      "migrationPattern": {
        "welcome": "歡迎使用候選名單建立器",
        "importQuestion": "您的 Web 地圖包含點資料。您是否要將那些點作為候選名單中的地點?",
        "importExplainYes": "您能夠在「候選名單建立器」中編輯、管理和新增至您的地點。會自動建立 Web 地圖的副本，以便不修改原始資料。",
        "importExplainNo": "您的點將顯示於候選名單地圖，但不會作為地點。反之，您會在建立器中，將地點新增至候選名單。",
        "no": "否",
        "importOption": "是，匯入它們",
        "asIsOption": "是，依原狀使用它們",
        "asIsText": "您會繼續在 Web 地圖 (非候選名單建立器) 中編輯和管理地點。您對該資料所做的更新會自動反映在候選名單中。此選項會要求您的資料使用此樣板。",
        "badData": "包含您地點的點圖層不會使用必要的資料樣板。請檢閱樣板需求。",
        "downloadTemplate": "下載樣板"
      },
      "fieldPicker": {
        "nameField": "包含每個地點名稱的欄位: ",
        "descriptionField": "每個地點及其順序的描述中將出現的欄位: ",
        "urlField": "包含每個地點相關的「更多資訊」之 URL 的欄位 (選用): ",
        "none": "無",
        "imageFields": "包含每個地點圖片之 URL 的欄位 (選用): ",
        "mainImageField": "主圖片: ",
        "thumbImageField": "縮略圖: ",
        "noImageFields": "若要在建立器中將圖片新增至地點，請將這些選項設為無",
        "tabField": "如果具有將圖層中的地點分割成不同主題的欄位名稱，請選擇下列適合的欄位名稱。"
      },
      "layerPicker": {
        "pointLayers": "在 Web 地圖中選擇要作為地點的點圖層: ",
        "layerInfo": "如果選擇多個圖層，它們必須擁有相同的欄位集。每個選擇的圖層將成為候選名單中的頁籤。"
      }
    }
  }
});