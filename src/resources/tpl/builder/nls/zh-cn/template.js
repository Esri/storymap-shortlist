define({
  "builder": {
    "initPopup": {
      "title": "欢迎",
      "startBtn": "启动"
    },
    "addEditPopup": {
      "test": "测试",
      "add": "添加",
      "edit": "编辑"
    },
    "landing": {
      "lblAdd": "为何调用 Shortlist?",
      "phAdd": "输入标题...",
      "lblOR": "或",
      "lblHelp": "快速浏览"
    },
    "organizePopup": {
      "title": "组织",
      "tab": "选项卡"
    },
    "settingsLayoutOptions": {
      "title": "布局选项",
      "lblDescription": "说明"
    },
    "addFeatureBar": {
      "add": "添加",
      "import": "导入",
      "done": "完成",
      "deleteFeature": "删除",
      "move": "移动",
      "locateFeaturesTooltip": "需要对一些位置进行定位。单击此处查看这些位置"
    },
    "detailPanelBuilder": {
      "changeLocation": "更改位置",
      "setLocation": "设置位置",
      "cancel": "取消",
      "addImage": "单击或拖放可添加图像",
      "enterPlaceName": "输入地点名称",
      "enterPlaceDescription": "输入地点说明",
      "unnamedPlace": "未命名地点"
    },
    "settings": {
      "numberedPlaces": "显示带数字的地点",
      "extentSensitive": "仅在选项卡中显示地图中可见的地点(仅针对查看器)",
      "extentSensitiveTooltip": "仅在查看 Shortlist 时该选项才适用。在 Shortlist 构建器中，即使位置在地图中不可见，选项卡仍显示所有位置。如果希望查看 Shortlist 时选项卡始终显示所有位置，请取消选中该选项。",
      "locateButton": "定位按钮",
      "locateButtonTooltip": "允许读者在地图中查看其当前位置。大多数设备和浏览器均支持此功能，但只有在将故事共享为 HTTPS 链接且未嵌入故事时才显示该按钮。",
      "geocoder": "地址、地点和要素查找器",
      "bookmarks": "书签",
      "bookmarksMenuName": "菜单名称",
      "defaultMapLocation": "默认地图位置",
      "auto": "自动",
      "autoTooltip": "位置自动进行管理，因此所有位置均可见",
      "custom": "自定义",
      "customTooltip": "使用将显示在地图缩放控件中的按钮设置位置",
      "mapLocationTooltip": "打开 Shortlist 时用户所见位置",
      "bookmarksHelp": "要在 Shortlist 中启用书签，请在 Web 地图查看器中添加和管理 Web 地图的书签"
    },
    "help": {
      "title": "帮助",
      "shortlistHelp1": "欢迎使用 Story Map Shortlist。该应用程序将以选项卡的形式呈现感兴趣的地点，为用户提供探索区域的乐趣。可在构建器中采用交互的方式构建地点。",
      "shortlistHelp2": "您也可以从现有 ArcGIS Web 地图中创建 Shortlist，其中包括将地图中的现有点数据用作地点的选项。",
      "shortlistHelp3": "要从 Web 应用程序中创建 Shortlist，请转至",
      "shortlistHelp4": "打开 Web 地图，从中创建 Web 应用程序，从应用程序库中选择 Story Map Shortlist。如果 Web 地图包含任意点图层，则 Shortlist 构建器将提示您选择希望用作地点的图层。如果创建 Shortlist 的应用程序是原始的非托管版本，则可使用同样的步骤将 Shortlist 迁移到该托管应用程序版本。",
      "shortlistHelp5": "有关详细信息",
      "shortlistHelp6": "访问 Esri Story Maps 网站的 Shortlist 部分",
      "shortlistFAQ": "Shortlist 常见问题",
      "shortlistBetaFeedback": "Beta 反馈",
      "shortlistBetaFeedback2": "我们十分期待您的反馈! 请访问 GeoNet 上的 Story Maps 论坛，",
      "geonetForum": "告知我们您遇到的问题和需要的新功能"
    },
    "migration": {
      "migrationPattern": {
        "welcome": "欢迎使用 Shortlist 构建器",
        "importQuestion": "您的 Web 地图包含点数据。是否将这些点用作 Shortlist 中的地点?",
        "importExplainYes": "您将拥有编辑、管理 Shorlist 构建器中地点和向其中添加地点的权限。将自动创建 Web 地图的副本，因此不会修改原始数据。",
        "importExplainNo": "点将显示在 Shortlist 地图中，但是不会用作地点。您将在构建器中向 Shortlist 添加地点。",
        "no": "否",
        "importOption": "是，导入它们",
        "asIsOption": "是，原样使用它们",
        "asIsText": "您将继续在 Web 地图中编辑和管理地点，而不是在 Shortlist 构建器中进行操作。您对该数据进行的更新将自动在 Shortlist 中体现。该选项需要数据使用此模板。",
        "badData": "包含地点的点图层未使用所需数据模板。请查看模板要求。",
        "downloadTemplate": "下载模板"
      },
      "fieldPicker": {
        "nameField": "包含各个地点名称的字段： ",
        "descriptionField": "显示在各个地点及其顺序说明中的字段： ",
        "urlField": "包含关于各个地点“更多信息”URL 的字段(可选)： ",
        "none": "无",
        "imageFields": "包含各个地点图像 URL 的字段(可选)： ",
        "mainImageField": "主要图像： ",
        "thumbImageField": "缩略图： ",
        "noImageFields": "如果希望在构建器中向地点添加图像，请将这些字段集保留为空",
        "tabField": "如果您的字段名称将图层中的位置划分为不同主题，请选择下方适当的字段名称。"
      },
      "layerPicker": {
        "pointLayers": "选择 Web 地图中希望用作地点的点图层： ",
        "layerInfo": "如果选择多个图层，这些图层的字段集必须相同。所选择的每个图层都将成为 Shortlist 中的一个选项卡。"
      }
    }
  }
});