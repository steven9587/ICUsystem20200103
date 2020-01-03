/*
  custom.kendo.utils.js?date=20180724-1400

    Custom kendo-relative method.
   
    depends : jquery-ui.css (for dialog, etc)
              custom.utils.js
              custom.jquery.utils.js
              custom.widget.css
*/

function gridError(e)
{
  // Implement the event handler for Error
  // *e.xhr 例外物件為完整網頁內容(html/head/body), 而因為該完整網頁內容包含自訂 css 樣式定義
  //  使用 jquery dialog 直接顯示將影響目前作業網頁 css 樣式定義呈現(如字型大小縮小等)
  //  因此顯示內容僅截取 body 部份.
  //  e.xhr.status = 404
  //  e.xhr.statusText = "Not Found"
  //  e.xhr.responseText = "... html ..."
  //  e.errorThrown = "Not Found"
  var error = "";
  var a, b;
  //

  // Grid 欄位驗證訊息
  // Grid / Custom validator editing
  // http://demos.telerik.com/aspnet-mvc/grid/editing-custom-validation
  if (e.errors)
  {
    var message = "Grid 編輯發生錯誤:\n\n";
    $.each(e.errors, function(key, value)
    {
      if ('errors' in value)
      {
        $.each(value.errors, function()
        {
          message += this + "\n";
        });
      }
    });
    alert(message);
    return;
  }

  // Action 相關錯誤處理
  error = e.errorThrown + "-" + e.toString(); // 預設錯誤訊息
  if (e.xhr)
    error = e.xhr.status + "." + e.xhr.statusText + "\r\n" + e.xhr.responseText;
  a = error.indexOf("<body");
  b = error.indexOf("</body>");
  if (a != -1 && b != -1)
    error = error.substring(a, b);
  // 錯誤提示(若自行中斷 Action 執行 e.xhr.status/e.xhr.statusText 為 '0.error ...' 者不提示)
  if (error.indexOf("0.error") != 0)
    alert("Grid 執行發生錯誤: " + extractAjaxError(error));
}

var Kendos = function()
{
  this._member = null; // member
};

$.extend(Kendos.prototype,
{
  uniqueId: function()
  {
    // 取得 Guid (大寫)
    // *藉由建立暫時 Kendo UI DropDownList 再由項目物件取得, uid 為 Kendo UI 內建物件屬性)
    //  kendo.ui.DropDownList > dataItem
    //  http://docs.telerik.com/kendo-ui/api/javascript/ui/dropdownlist#methods-dataItem
    // *jquery ui 的 $(element).uniqueId() 取得格式為 ui-id-1 非 Guid 格式.
    var result;
    var element;
    var widget;
    var dataItem;
    //
    element = $("<input id='input1' />"); // 暫時物件
    $(element).kendoDropDownList(
    {
      dataSource:
      [
        { id: 1, name: "first" },
        { id: 2, name: "second" }
      ]
    });
    widget = $(element).data("kendoDropDownList");
    dataItem = widget.dataItem(0); // 項目物件
    result = dataItem.uid.toUpperCase(); // 項目物件唯一識別代碼(uid)
    //
    return result;
  },

  //
  // 示範
  //
  //   View
  //
  //   ＠(Html.Kendo().CheckBox()
  //     .Name("Column1Check")
  //     .Label("...")
  //     .Checked(Model.XXXXX == "...")
  //     .HtmlAttributes(new { ＠check_for = "Column1", ＠keyColumn1 = Model.KeyColumn1, ＠falseValue = "N", ＠trueValue = "Y", ＠onchange = "Column1_Change(this)" }))
  //
  //   ＠Html.HiddenFor(model => model.Column1, new { ＠class = "...", ＠keyColumn1 = Model.KeyColumn1 })
  //
  //   Js
  //
  //   Column1Check_Change: function(sender)
  //   {
  //     // ...
  //     // .sender, CheckBox 物件.
  //     Kendos.checkedChanged(sender, "keyColumn1");
  //   },
  //
  //   *Column1 為實體數值欄位.
  //   *KeyColumn1 為唯一識別數值欄位.
  //   *check_for(CheckBox 元件對應欄位), falseValue(false 值), trueValue(true 值).
  //   *onchange(勾選狀態變更事件), 事件函式格式為 "Column1_Change(this)" 格式, 其中 this 為 CheckBox 元件物件.
  //
  //   注意 : 示範程式碼中 ＠ 符號因為語法衝突問題因此使用全形, 複製程式碼請自行修正.
  //
  checkedChanged: function(sender, key, options)
  {
    // CheckBox 元件勾選狀態變更事件處理函式
    // .sender, CheckBox 元件, onchange 事件來源物件.
    // .key, 唯一識別數值屬性, CheckBox 元件用於取得搜尋對應 hidden 欄位時使用的唯一識別數值. (目前僅提供單一鍵值欄位, 複合鍵值待新增)
    // .options(optional), 選項(目前保留使用).
    // *因為 CheckBox 元件無支援字串型態欄位屬性, 因此採用 CheckBox 元件變更狀態時同時修改 Hidden 欄位數值方式.
    var check;
    var checked = isChecked(sender); // 是否 CheckBox 元件已勾選
    var falseValue = $(sender).attr("falseValue"); // false 值
    var trueValue = $(sender).attr("trueValue"); // true 值
    var attr1 = "[name='" + $(sender).attr("check-for") + "']"; // 資料名稱屬性 Selector, ex. [name='Column1'], etc.
    var attr2 = "[" + key + "='" + $(sender).attr(key) + "']"; // 唯一識別數值屬性 Selector, ex. [Key1='KeyValue1'], etc.
    // 變更 CheckBox 元件對應 hidden 欄位值
    // *CheckBox 元件對應 hidden 欄位 - 搜尋父元素下符合 Selector 的 hidden 欄位元素.
    check = $(sender).parent().find("input" + attr1 + attr2); // CheckBox 元件對應 hidden 欄位, ex. input[name='Column1'][Key1='KeyValue1'], etc.
    if (checked)
      $(check).val(trueValue);
    else
      $(check).val(falseValue);
  },

  findInputs: function(container, selector, options)
  {
    // 尋找符合 selector 的輸入元素
    // .container, 包含輸入元素的 container 元素.
    // .selector, 完整 Selector 表示式(如 .class1 等).
    // .options, 選項(保留使用).
    // *因為如 DatePicker, DropDownList 等元件, 若自訂 class 則將同時套用該 class 至主要元素及內部 input 元素,
    //  因此使用共同樣式類別取得元素將同時取得主要元素及內部 input 元素, 因此傳回輸入元素將重疊.
    // 傳回值 : 符合 selector 的輸入元素(預設不含元素主要元素[k-widget]).
    var result = [];
    var matchs;
    //
    options = options || {};
    options = $.extend(
    {
    }, options);
    //
    matchs = $(container).find(selector);
    for (var I = 0; I < matchs.length; I++)
    {
      if ($(matchs[I]).hasClass("k-widget")) // 忽略元素主要元素[k-widget], 因為若元件自訂 class 將同時套用至 input 及其 Widget.
        continue;
      //
      result.push(matchs[I]);
    }
    //
    return result;
  },

  _getInput: function(element, options)
  {
    //
    // *限內部使用.
    //
    // 取得輸入元素
    // .element, 資料輸入元素.
    // .options(optional), 選項 : 
    // -container(element, optional), 輸入元素 container 元素, 限制尋找符合 input 元素的範圍使用, 否則將尋找整份文件中符合的 input 元素.
    var result;
    var container;
    var inputId;
    //
    options = options || {};
    options = $.extend({ container: undefined }, options);
    //
    inputId = $(element).attr("id");
    if (!isEmpty(options.container))
      result = $(options.container).find("#" + inputId);
    else
      result = $("#" + inputId);
    //
    return result;
  },

  isDatePicker: function(input, options)
  {
    // 是否輸入元素為 DatePicker
    // .element, 資料輸入元素.
    // .options(optional), 選項 : 
    // -container(element, optional), 輸入元素 container 元素, 限制尋找符合 input 元素的範圍使用, 否則將尋找整份文件中符合的 input 元素.
    var result;
    var widget;
    //
    options = options || {};
    options = $.extend({ container: undefined }, options);
    widget = $(Kendos._getInput(input, options)).data("kendoDatePicker");
    result = (!isEmpty(widget));
    //
    return result;
  },

  isDateTimePicker: function(input, options)
  {
    // 是否輸入元素為 DateTimePicker
    // .element, 資料輸入元素.
    // .options(optional), 選項 : 
    // -container(element, optional), 輸入元素 container 元素, 限制尋找符合 input 元素的範圍使用, 否則將尋找整份文件中符合的 input 元素.
    var result;
    var widget;
    //
    options = options || {};
    options = $.extend({ container: undefined }, options);
    widget = $(Kendos._getInput(input, options)).data("kendoDateTimePicker");
    result = (!isEmpty(widget));
    //
    return result;
  },

  isComboBox: function(input, options)
  {
    // 是否輸入元素為 ComboBox
    // .element, 資料輸入元素.
    // .options(optional), 選項 : 
    // -container(element, optional), 輸入元素 container 元素, 限制尋找符合 input 元素的範圍使用, 否則將尋找整份文件中符合的 input 元素.
    var result;
    var widget;
    //
    options = options || {};
    options = $.extend({ container: undefined }, options);
    widget = $(Kendos._getInput(input, options)).data("kendoComboBox");
    result = (!isEmpty(widget));
    //
    return result;
  },

  isDropDownList: function(input, options)
  {
    // 是否輸入元素為 DropDownList
    // .element, 資料輸入元素.
    // .options(optional), 選項 : 
    // -container(element, optional), 輸入元素 container 元素, 限制尋找符合 input 元素的範圍使用, 否則將尋找整份文件中符合的 input 元素.
    var result;
    var widget;
    //
    options = options || {};
    options = $.extend({ container: undefined }, options);
    widget = $(Kendos._getInput(input, options)).data("kendoDropDownList");
    result = (!isEmpty(widget));
    //
    return result;
  },

  isNumericTextBox: function(input, options)
  {
    // 是否輸入元素為 NumericTextBox
    // .element, 資料輸入元素.
    // .options(optional), 選項 : 
    // -container(element, optional), 輸入元素 container 元素, 限制尋找符合 input 元素的範圍使用, 否則將尋找整份文件中符合的 input 元素.
    var result;
    var widget;
    //
    options = options || {};
    options = $.extend({ container: undefined }, options);
    widget = $(Kendos._getInput(input, options)).data("kendoNumericTextBox");
    result = (!isEmpty(widget));
    //
    return result;
  },

  // 
  // 示範
  //
  //   View
  //
  //     @Html.HiddenFor(model => model.ProductID, new { @class = "dataClass1", ... })
  //
  //     @Html.EditorFor(model => model.Price, new { @class = "dataClass1", ... })
  //
  //   Js
  //
  //     getInputData: function(container)
  //     {
  //       var result = [];
  //       var items;
  //       var value;
  //       //
  //       items = $(container).find(".dataClass1");
  //       for (var I = 0; I < items.length; I++)
  //       {
  //         value = Kendos.parseValue(items[I]);
  //         ...
  //       }
  //
  //   *輸入元件使用共同 class 樣式類別名稱進行識別, 並依輸入元件類型取得輸入資料數值. 樣式類別 dataClass1 僅為示範請以實際為準.
  //
  parseValue: function(element, options)
  {
    // 解析資料名稱/數值
    // .element, 資料輸入元素.
    // .options(optional), 選項 : 
    // -container(element, optional), 輸入元素 container 元素, 限制尋找符合 input 元素的範圍使用, 否則將尋找整份文件中符合的 input 元素.
    // -names(bool, optional), 是否傳回 name/value 格式, 預設值為 false (即預設傳回數值).
    // *資料輸入元素, 請使用 Kendos.findInputs() 函式取得輸入元素並傳入此函式, 詳細請參閱函式說明.
    // *一般 input 元素使用 val() 取得輸入值, 若為元件需取得元件 Widget 的 value() 函式取得實際元件輸入值.
    // 傳回值 : 輸入值, 若無符合 input 元素將傳回 undefined. 若 names 選項為 true 則傳回 name/value 格式.
    var result = null;
    var widget, input;
    var name, value;
    //
    options = options || {};
    options = $.extend(
    {
      container: undefined,
      names: false
    }, options);
    //
    name = $(element).attr("name"); // 初始讀取一般 input 元素(非元件, 如 Hidden/HiddenFor, 一般 input 等), name 僅做為提示識別使用非必要屬性.
    value = $(element).val();
    isWidget = (!$(element).hasClass("k-textbox")); // 是否為 Widget 元件, 即非一般 TextBox 輸入者表示, 使用此判斷是否為純 TextBox 可減少後續元件型態判斷.
    if (isWidget)
    {

      //    var widget = kendo.widgetInstance($(element));
      //    name = $(element)[0].kendoBindingTarget.source;
      //    value = widget.value();

      input = ($(element)[0].tagName.toLowerCase() == "input") ? element : $(element).find("input[name]"); // 元件內部 input 元素(包含 name 屬性者), 取得元件 Widget 及 Model 屬性名稱等使用
      if (Kendos.isDatePicker(input, options))
      {
        widget = $(Kendos._getInput(input, options)).data("kendoDatePicker");
        name = $(input).attr("name");
        value = widget.value();
        if ($(input).attr("dateString") == "true") // Date 轉換為日期字串(西元), dateString = "true" (小寫, 同 EditorTemplate)
          value = DateTimes.dateString(value);
      }
      else if (Kendos.isDateTimePicker(input, options))
      {
        widget = $(Kendos._getInput(input, options)).data("kendoDateTimePicker");
        name = $(input).attr("name");
        value = widget.value();
        if ($(input).attr("datetimeString") == "true") // Date 轉換為日期/時間字串(西元), datetimeString = "true" (小寫, 同 EditorTemplate)
          value = DateTimes.datetimeString(value);
      }
      else if (Kendos.isComboBox(input, options))
      {
        widget = $(Kendos._getInput(input, options)).data("kendoComboBox");
        name = $(input).attr("name");
        value = widget.value();
      }
      else if (Kendos.isDropDownList(input, options))
      {
        widget = $(Kendos._getInput(input, options)).data("kendoDropDownList");
        name = $(input).attr("name");
        value = widget.value();
      }
      else if (Kendos.isNumericTextBox(input, options))
      {
        widget = $(Kendos._getInput(input, options)).data("kendoNumericTextBox");
        name = $(input).attr("name");
        value = widget.value();
      }
      else
      {
        var error = "parseValue() : 資料元素型態未支援(id='" + $(element).attr("id") + "', name='" + $(element).attr("name") + "', class='" + $(element).attr("class") + "', data-name='" + $(element).attr("data-name") + "')."; // data-name - 因為函式可能應用於 Detail 輸入相關處理因此使用此屬性.
        //
        alert(error);
        throw new Error(error);
      }
    }
    result = value;
    if (options.names) // 傳回 name/value 格式
      result = { name: name, value: value };
    //
    return result;
  },

  // 
  // 示範
  //
  //   View
  //
  //     @Html.HiddenFor(model => model.ProductID, new { @class = "dataClass1", ... })
  //
  //     @Html.EditorFor(model => model.Price, new { @class = "dataClass1", ... })
  //
  //   Javascript
  //
  //     getInputData: function(container)
  //     {
  //       var result = [];
  //       var items;
  //       var content, nameValue;
  //       //
  //       items = $(container).find(".dataClass1");
  //       content = {};
  //       for (var I = 0; I < items.length; I++)
  //       {
  //         var loopItem = items[I];
  //         //
  //         nameValue = Kendos.parseNameValue(loopItem);
  //         if (!isEmpty(nameValue) && isEmpty(content[nameValue.name]))
  //           content[nameValue.name] = nameValue.value;
  //       }
  //       //
  //       result.push(content);
  //
  //   *輸入元件使用共同 class 樣式類別名稱進行識別, 並依輸入元件類型取得輸入資料數值. 樣式類別 dataClass1 僅為示範請以實際為準.
  //
  parseNameValue: function(element)
  {
    // *此為舊版相容函式, 請改用 Kendo.parseValue() 函式.
    //
    // 解析資料名稱/數值
    // .element, 資料輸入元素.
    // 傳回值 : 輸入資料 {name, value}, 若無符合 input 元素將傳回 null.
    var result = null;
    var widget, input;
    var name, value;
    //
    name = $(element).attr("name"); // 初始讀取一般 input 元素(非元件, 如 Hidden/HiddenFor, 一般 input 等)
    value = $(element).val();
    if (isEmpty(name) && $(element).hasClass("k-widget")) // Widget 元素(因為若元件自訂 class 將同時套用至 input 及其 Widget)
    {

      //    var widget = kendo.widgetInstance($(element));
      //    name = $(element)[0].kendoBindingTarget.source;
      //    value = widget.value();

      input = $(element).find("input[name]"); // 元件 input 元素(包含 name 屬性者), 取得元件 Widget 及 Model 屬性名稱等使用
      if ($(element).hasClass("k-datepicker"))
      {
        widget = $(input).data("kendoDatePicker");
        name = $(input).attr("name");
        value = widget.value();
        // Date 轉換為日期字串(西元), dateString = "true" (小寫, 同 EditorTemplate)
        if ($(input).attr("dateString") == "true")
          value = DateTimes.dateString(value);
      }
      else if ($(element).hasClass("k-datetimepicker"))
      {
        widget = $(input).data("kendoDateTimePicker");
        name = $(input).attr("name");
        value = widget.value();
        // Date 轉換為日期/時間字串(西元), datetimeString = "true" (小寫, 同 EditorTemplate)
        if ($(input).attr("datetimeString") == "true")
          value = DateTimes.datetimeString(value);
      }
      else if ($(element).hasClass("k-dropdown"))
      {
        widget = $(input).data("kendoDropDownList");
        name = $(input).attr("name");
        value = widget.value();
      }
      else if ($(element).hasClass("k-numerictextbox"))
      {
        widget = $(input).data("kendoNumericTextBox");
        name = $(input).attr("name");
        value = widget.value();
      }
      else
      {
        var error = "parseNameValue() : 資料元素型態未支援 - '" + $(element).attr("class") + "'";
        //
        alert(error);
        throw new Error(error);
      }
    }
    result = { name: name, value: value };
    //
    return result;
  },

  parseTransportReadUrl: function(e)
  {
    // 解析 Read 的 Url
    // .e, 元件 DataSource 的 Error 事件參數物件.
    // 傳回值 : Read 的 Url, 如 "/FormM050/SearchSelectionName" 等, 若相關屬性不存在等將傳回空白.
    var result;
    var transport;
    var transportOptions;
    var read;
    //
    transport = (!isEmpty(e.sender)) ? e.sender.transport : null;
    transportOptions = (!isEmpty(transport)) ? transport.options : null;
    read = (!isEmpty(transportOptions)) ? transportOptions.read : null;
    result = (!isEmpty(read)) ? emptyTo(read.url, "") : "";
    //
    return result;
  },

  showError: function(type, e)
  {
    // 元件 Error 事件通用處理函式
    // .type, 元件類型(同元件型態名稱, 如 ComboBox, DropDownList, Grid 等), 識別錯誤發生元件類型使用.
    // .e, Error 事件參數物件, 由元件 Error 事件取得/傳入.
    // *若元件存在專屬事件處理函式, 其不為專屬判斷處理部份可轉呼叫此 Error 事件通用處理函式.
    // Implement the event handler for Error
    // *e.xhr 例外物件為完整網頁內容(html/head/body), 而因為該完整網頁內容包含自訂 css 樣式定義
    //  使用 jquery dialog 直接顯示將影響目前作業網頁 css 樣式定義呈現(如字型大小縮小等)
    //  因此顯示內容僅截取 body 部份.
    //  e.xhr.status = 404
    //  e.xhr.statusText = "Not Found"
    //  e.xhr.responseText = "... html ..."
    //  e.errorThrown = "Not Found"
    var error = "";
    var a, b;
    // Action 相關錯誤處理
    error = e.errorThrown + "-" + e.toString(); // 預設錯誤訊息
    if (e.xhr)
      error = e.xhr.status + "." + e.xhr.statusText + "\r\n" + e.xhr.responseText;
    a = error.indexOf("<body");
    b = error.indexOf("</body>");
    if (a != -1 && b != -1)
      error = error.substring(a, b);
    // 錯誤提示(若自行中斷 Action 執行 e.xhr.status/e.xhr.statusText 為 '0.error ...' 者不提示)
    if (error.indexOf("0.error") != 0)
      alert(type + " 執行發生錯誤: " + error);
    else if (e.xhr && e.status == "error" && e.xhr.readyState == 0 && e.sender)
    {
      // 連結服務執行錯誤提示
      // XMLHttpRequest.readyState
      // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
      // e.status : "error"
      // e.xhr.status : 0
      // e.xhr.statusText : "error"
      // e.xhr.readyState : 0 (UNSET)
      alert(type + " 執行發生錯誤：" + "連結服務未啟動等 － " + Kendos.parseTransportReadUrl(e) + "。");
    }
  },

  method1: function()
  {
  }
});

var PanelBars = function()
{
  this._member = null; // member
};

$.extend(PanelBars.prototype,
{
  // 
  // 示範
  //
  //   Javascript
  //
  //     YourPanelBar_Select: function(e)
  //     {
  //       // PanelBar 選擇事件
  //       // .e.item, 項目元素.
  //       var parentItem;
  //       var attribute1;
  //       //
  //       parentItem = PanelBars.getParentItem(e.item); // 取得父項目元素
  //       attribute1 = (parentItem) ? emptyTo($(parentItem).attr("attribute1"), "") : ""; // 取得屬性值
  //       ...
  //
  getParentItem: function(item)
  {
    // 取得 PanelBar 項目父元素
    // .item, PanelBar 項目元素, 如 PanelBar 的 Select 事件參數 e.item 屬性.
    // *PanelBar 元表階層示範 : 
    //  ul .k-panelbar
    //    li .k-item
    //      ul .k-group
    //        li .k-item
    // PanelBar / Events
    // https://demos.telerik.com/aspnet-mvc/panelbar/events
    // 傳回值 : PanelBar 項目父元素, 若不存在則傳回空值, 可應用於取得父元素後讀取自訂屬性等.
    var result = findParent($(item).parent(), "k-item");
    return result;
  },

  getItemText: function(item)
  {
    // 取得 PanelBar 項目文字
    // .item, PanelBar 項目元素, 如 PanelBar 的 Select 事件參數 e.item 屬性.
    // PanelBar / Events
    // https://demos.telerik.com/aspnet-mvc/panelbar/events
    var result = $(item).find("> .k-link").text();
    return result;
  },

  method1: function()
  {
  }
});

var ToolBars = function()
{
  this._member = null; // member
};

$.extend(ToolBars.prototype,
{
  //
  // 示範
  //
  //  Javascript
  //
  //     取得 SplitButton - 使用類別樣式(唯一), 加入新按鈕.
  //
  //     var toolBar = ...;
  //     var button;
  //     //
  //     button = { type: "button", text: "...", icon: "", attributes: { command: "..." } };
  //     ToolBars.appendButton(toolBar, button);
  //
  appendButton: function(sender, button)
  {
    // ToolBar 新增按鈕(Button)
    // .sender, ToolBar 元件 Widget, 如 ToolBar's Click 事件中使用 e.sender 屬性取得.
    // .button, 新增按鈕屬性內容, 屬性內容格式參考 ToolBar 的 Command Types, 如 { text: "xxx", icon: "", attributes: { command: "..." } } 等.
    // ToolBar ＞ click
    // https://docs.telerik.com/kendo-ui/api/javascript/ui/toolbar/events/click
    // ToolBar ＞ toggle
    // https://docs.telerik.com/kendo-ui/api/javascript/ui/toolbar/events/toggle
    // ToolBar / Events
    // https://demos.telerik.com/aspnet-mvc/toolbar/events
    // ToolBar ＞ add
    // https://docs.telerik.com/kendo-ui/api/javascript/ui/toolbar/methods/add
    // ToolBar ＞ items.attributes
    // https://docs.telerik.com/kendo-ui/api/javascript/ui/toolbar/configuration/items.attributes
    // ToolBar Overview ＞ Command Types
    // https://docs.telerik.com/kendo-ui/controls/navigation/toolbar/overview#command-types
    sender.add(button);
  },

  //
  // 示範
  //
  //   View
  //
  //     ToolBar 加入的 SplitButton 設定類別樣式(唯一).
  //
  //     @(Html.Kendo().ToolBar()
  //       .Name("PageToolBar")
  //       .Items(items =>
  //       {
  //         items.Add().Type(CommandType.SplitButton).Text("...").MenuButtons(menuButtons =>
  //         {
  //           menuButtons.Add().Text("...").Icon("").HtmlAttributes(new { command = "..." });
  //           ...
  //         })
  //         .HtmlAttributes(new { @class = "split-button-splitbutton1" });
  //       })
  //       .Events(events =>
  //       {
  //         events.Click("...");
  //         events.Toggle("...");
  //       })
  //       .HtmlAttributes(new { @class = "" }))
  //
  //  Javascript
  //
  //     取得 SplitButton - 使用類別樣式(唯一), 加入新按鈕.
  //
  //     var splitButton = $(".split-button-splitbutton1");
  //     //
  //     Toolbars.appendMenuButton(splitButton, { text: "...", attributes: { command: "..." } });
  //
  //  *注意 : 以上 PageToolBar, split-button-splitbutton1, 等命名僅為示範, 實作時請依實際命名, 如 split-button-category 等.
  //
  appendMenuButton: function(element, menuButton)
  {
    // SplitButton 新增按鈕(MenuButton)
    // .element, SplitButton 元素.
    // .menuButton, 新增按鈕屬性內容, 屬性內容格式參考 ToolBar 的 Command Types, 如 { text: "xxx", icon: "", attributes: { command: "..." } } 等.
    // ToolBar ＞ add
    // https://docs.telerik.com/kendo-ui/api/javascript/ui/toolbar/methods/add
    // ToolBar ＞ items.attributes
    // https://docs.telerik.com/kendo-ui/api/javascript/ui/toolbar/configuration/items.attributes
    // ToolBar Overview ＞ Command Types
    // https://docs.telerik.com/kendo-ui/controls/navigation/toolbar/overview#command-types
    var elements = element; // SplitButton 類別樣式將套用至多個元素(2 個元件內部元素), 因此使用類別樣式將取得多個元素
    var splitButton;
    var splitButtonElement;
    // 取得 SplitButton 主要元素
    for (var I = 0; I < elements.length; I++)
    {
      var loopElement = elements[I]; // SplitButton 相關元素
      var loopElementParent = $(loopElement).parent(); // 上層元素, 預期 k-split-button 表示為 SplitButton 主要元素
      if ($(loopElement).hasClass("k-overflow-button")) // 忽略非 SplitButton 主要元素
        continue;
      //
      if ($(loopElementParent).hasClass("k-split-button")) // SplitButton 主要元素
        splitButtonElement = loopElementParent;
    }
    // 建立 SplitButton 的選單按鈕(MenuButton)
    splitButton = $(splitButtonElement).data("splitButton");
    splitButton.options.menuButtons = [menuButton];
    splitButton.createMenuButtons();
  },

  method1: function()
  {
  }
});

var SystemDatas = null; // 相容使用, 應用程式使用時請改用 SystemData.

var SystemData = function()
{
  this._member = null; // member
};

$.extend(SystemData.prototype,
{
  getData: function(selector)
  {
    // *限內部使用.
    var result;
    var element;
    //
    element = $("." + selector);
    if (!isValidObject(element))
      throw new Error("指定資料不存在('" + selector + "').");
    result = $(element).val();
    //
    return result;
  },

  getUserID: function()
  {
    // 取得目前登入使用者代碼.
    var result = SystemData.getData("SystemUserIDHidden");
    return result;
  },

  getUserName: function()
  {
    // 取得目前登入使用者名稱.
    var result = SystemData.getData("SystemUserNameHidden");
    return result;
  },

  getSystemID: function()
  {
    // 取得目前系統代碼(大寫), 如 "APP" 等.
    var result = SystemData.getData("SystemSystemIDHidden");
    return result;
  },

  getControllerName: function()
  {
    var result = SystemData.getData("SystemControllerNameHidden");
    return result;
  },

  getBaseAddress: function()
  {
    // 取得目前應用程式位址, 如 http://localhost:10000/ (測試), http://localhost/App1/ (正式) 等.
    // *傳回目前應用程式位址以 '/' 字元結尾.
    var result = SystemData.getData("SystemBaseAddressHidden");
    return result;
  },

  getClientIPAddress: function()
  {
    // 取得目前使用者操作的 IP 位址, 如 127.0.0.1, 10.10.10.1 等.
    var result = SystemData.getData("SystemClientIPAddressHidden");
    return result;
  },

  method1: function()
  {
  }
});

$(function()
{
  // initialize
  Kendos = new Kendos();
  PanelBars = new PanelBars();
  ToolBars = new ToolBars();
  SystemData = new SystemData();
  //
  SystemDatas = SystemData; // 相容使用, 應用程式請不使用/請改用 SystemData.
});

/* end */
