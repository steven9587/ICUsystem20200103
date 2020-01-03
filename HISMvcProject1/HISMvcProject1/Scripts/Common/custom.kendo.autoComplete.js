/*
  custom.kendo.autoComplete.js?date=20170820-1000

    Custom autoComplet-relative method.
   
    depends : jquery-ui.css (for dialog, etc)
              custom.utils.js
              custom.jquery.utils.js
              custom.widget.css
*/

var AutoCompletes = function()
{
  this._member = null; // member
};

$.extend(AutoCompletes.prototype,
{
  //
  // 示範 :
  //
  //   YourAutoComplete_Close: function(e)
  //   {
  //     AutoCompletes.clearText(e.sender); // 清除搜尋文字
  //     ...
  //   },
  //
  clearText: function(sender, focus)
  {
    // 清除文字(含自行輸入及選擇項目後自動帶入欄位值)
    // .sender, 元件 Widget
    // .focus, 是否清除後自動 focus, 預設值為 true.
    // *元件選擇項目後將自動帶入 DataTextField 指定欄位的值至元件, 若不自動帶入則需實作 Close 事件清除文字.
    // *此函式一般為 Close 事件等使用, 若為 Select 事件使用將無作用, 因為選擇項目後元件將自動帶入 DataTextField 指定欄位的值.
    focus = (!isEmpty(focus)) ? focus : true; // 清除後預設 focus
    sender.value(""); // 清除搜尋文字(實際為選擇項目顯示文字)
    if (focus)
      sender.focus();
  },

  //
  // 示範 :
  //
  //   YourAutoComplete_Select: function(e)
  //   {
  //     var dataItem;
  //     var sValue1;
  //     //
  //     dataItem = AutoCompletes.getSelectedItem(e);
  //     sValue1 = parseValue(dataItem, "Value1");
  //     ...
  //   },
  //
  //   *注意 : 此函式為 select 事件中使用.
  //
  getSelectedItem: function(e)
  {
    // 取得選擇的資料項目
    // .e.sender, 元件 Widget.
    // AutoComplete / Events
    // http://demos.telerik.com/aspnet-mvc/autocomplete/events
    // *注意 : select 事件的描述是錯的, 實際並無 e.dataItem 屬性.
    //  http://docs.telerik.com/kendo-ui/api/javascript/ui/autocomplete#events-select
    //  EVENT DATA > e.dataItem Object
    // *傳回記錄項目物件(即 model 物件可直接取得欄位屬性值), 若不存在將傳回 null.
    var result;
    var index;
    //
    index = e.item.index();
    result = e.sender.dataItem(index); // 若超出索引範圍將為 undefined
    if (isEmpty(result))
      result = null;
    //
    return result;
  },

  //
  // 示範 :
  //
  //   yourAutoComplete_Open: function(e)
  //   {
  //     AutoCompletes.setDropDownWidth(e, 300); // 設定 DropDownList 寬度
  //   },
  //
  //   *注意 : 此函式為 open 事件中使用.
  //
  setDropDownWidth: function(e, width)
  {
    // 設定 DropDownList 寬度(開啟清單時, 因為目前元件無直接提供 Fluent API)
    // .e.sender, 元件 Widget.
    // .width(int), 下拉寬度.
    // kendo.ui.AutoComplete ＞ open
    // http://docs.telerik.com/kendo-ui/api/javascript/ui/autocomplete#events-open
    e.sender.list.width(width);
  },

  showError: function(e)
  {
    // Error 事件通用處理函式
    Kendos.showError("AutoComplete", e);
  }
});

$(function()
{
  // initialize
  AutoCompletes = new AutoCompletes();
});

var ComboBoxes = function()
{
  this._member = null; // member
};

$.extend(ComboBoxes.prototype,
{
  //
  // 示範 :
  //
  //   yourCombox_Open: function(e)
  //   {
  //     ComboBoxes.setDropDownWidth(e, 300); // 設定 Combox 下拉寬度
  //   },
  //
  //   *注意 : 此函式為 open 事件中使用.
  //
  setDropDownWidth: function(e, width)
  {
    // 設定 Combox 下拉寬度(開啟清單時, 因為目前元件無直接提供 Fluent API)
    // .e.sender, 元件 Widget.
    // .width(int), 下拉寬度.
    // kendo.ui.AutoComplete ＞ open
    // http://docs.telerik.com/kendo-ui/api/javascript/ui/autocomplete#events-open
    e.sender.list.width(width);
  },

  showError: function(e)
  {
    // Error 事件通用處理函式
    Kendos.showError("ComboBox", e);
  },

  //
  // 示範 :
  //
  //   yourCombox_Open: function(e)
  //   {
  //     ComboBoxes.open(e); // 預設 Open 事件處理函式
  //     ...
  //   },
  //
  //   *注意 : 此函式為 open 事件中使用. 若元件自訂 Open 事件處理函式則需自行呼叫預設 Open 事件處理函式.
  //
  open: function(e)
  {
    // 預設 Open 事件處理函式
    // .dropDownWidth(int), 下拉寬度屬性(自訂), 由元件 HtmlAttributes 自行設定, 不含 'px' 單位字串.
    // *此函式為 BasicUsage() 方法預設 Open 事件處理函式. 若元件自訂 Open 事件處理函式則需自行呼叫此函式否則下拉寬度設定將因為事件覆蓋而無效, 否則無需自行呼叫此函式.
    var dropDownWidth;
    //
    try
    {
      dropDownWidth = $(e.sender.element).attr("dropDownWidth"); // 下拉寬度屬性(自訂), 由元件 HtmlAttributes 自行設定
      if (dropDownWidth)
      {
        dropDownWidth = Number(dropDownWidth); // 數字轉換(等同自動數字檢核)
        if (dropDownWidth >= 50) // 防呆(最小下拉寬度)
          ComboBoxes.setDropDownWidth(e, dropDownWidth);
      }
    }
    catch (err)
    {
      // 忽略任何例外(如下拉寬度屬性值非整數等)
    }
  }
});

$(function()
{
  // initialize
  ComboBoxes = new ComboBoxes();
});

var DropDownLists = function()
{
  this._member = null; // member
};

$.extend(DropDownLists.prototype,
{
  //
  // 示範 :
  //
  //   yourDropDownList_Open: function(e)
  //   {
  //     DropDownLists.setDropDownWidth(e, 300); // 設定 DropDownList 寬度
  //   },
  //
  //   *注意 : 此函式為 open 事件中使用.
  //
  setDropDownWidth: function(e, width)
  {
    // 設定 DropDownList 寬度(開啟清單時, 因為目前元件無直接提供 Fluent API)
    // .e.sender, 元件 Widget.
    // .width(int), 下拉寬度.
    // kendo.ui.AutoComplete ＞ open
    // http://docs.telerik.com/kendo-ui/api/javascript/ui/autocomplete#events-open
    e.sender.list.width(width);
  },

  showError: function(e)
  {
    // Error 事件通用處理函式
    Kendos.showError("DropDownList", e);
  },

  //
  // 示範 :
  //
  //   yourDropDownList_Open: function(e)
  //   {
  //     DropDownLists.open(e); // 預設 Open 事件處理函式
  //     ...
  //   },
  //
  //   *注意 : 此函式為 open 事件中使用. 若元件自訂 Open 事件處理函式則需自行呼叫預設 Open 事件處理函式.
  //
  open: function(e)
  {
    // 預設 Open 事件處理函式
    // .dropDownWidth(int), 下拉寬度屬性(自訂), 由元件 HtmlAttributes 自行設定, 不含 'px' 單位字串.
    // *此函式為 BasicUsage() 方法預設 Open 事件處理函式. 若元件自訂 Open 事件處理函式則需自行呼叫此函式, 否則無需需自行呼叫此函式.
    var dropDownWidth;
    //
    try
    {
      dropDownWidth = $(e.sender.element).attr("dropDownWidth"); // 下拉寬度屬性(自訂), 由元件 HtmlAttributes 自行設定
      if (dropDownWidth)
      {
        dropDownWidth = Number(dropDownWidth); // 數字轉換(等同自動數字檢核)
        if (dropDownWidth >= 50) // 防呆(最小下拉寬度)
          DropDownLists.setDropDownWidth(e, dropDownWidth);
      }
    }
    catch (err)
    {
      // 忽略任何例外(如下拉寬度屬性值非整數等)
    }
  }
});

$(function()
{
  // initialize
  DropDownLists = new DropDownLists();
});

$(document).ready(function()
{
  // ready
});
