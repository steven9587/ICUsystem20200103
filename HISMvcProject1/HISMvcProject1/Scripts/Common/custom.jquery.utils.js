/*
  custom.jquery.utils.js?date=20181010-1400
  
    Custom method using jQuery.
     
     depends : jquery-ui.css
               custom.utils.js

    2016-12-15

      新增 ajaxGet(), ajaxPost() 函式.

    2016-08-22

      新增 isSelected() 函式.

    2016-05-10

      修改 stringFormat() 函式可直接傳入格式化參數值 - 使用 [value1, value2, ...] 格式.
*/

function checkConflict(caller)
{
  // 檢視 jquery 衝突
  // *caller, 呼叫端名稱.
  // *此方法僅為檢視 jquery 版本測試呼叫使用(無其他作用)
  var result = $.fn.jquery; // 1.9.1 1.10.2 ...
  return result;
}

function endsWith(str, searchValue, options)
{
  // 是否來源字串以子字串結尾
  // IE11 之前未支援 string.endsWith() 函式.
  // .str, 來源字串.
  // .searchValue, 子字串.
  // .options(optional), 選項.
  // -ignoreCase(bool), 是否忽略大小寫, 預設值為 false (區分大小寫).
  // *傳回值 : 若傳回 true 表示來源字串以子字串結尾, 否則為 false.
  var result = false;
  var str2 = str;
  var searchValue2 = searchValue;
  var lastIndex;
  //
  if (isEmpty(str2) || isEmpty(searchValue2)) // 防呆(任一空值)
    return result;
  //
  options = options || {};
  options = $.extend({ ignoreCase: false }, options);
  if (options.ignoreCase)
  {
    str2 = str2.toLowerCase();
    searchValue2 = searchValue2.toLowerCase();
  }
  lastIndex = str2.lastIndexOf(searchValue2); // ex. 123[45] = 3(index).
  if (lastIndex != -1)
    result = ((lastIndex + searchValue2.length) == str2.length); // ex. (3 + 2) equals 5.
  //
  return result;
}

/// <summary>
/// stringFormat() 方法參數內容公用變數. 舊版程式相容, 新程式請不再使用.
/// </summary>
var stringFormatParams = undefined;

function stringFormat(format, params)
{
  /// <summary>
  /// 字串格式化.
  /// </summary>
  /// <param name="format" type="String">格式化內容.</param>
  /// <param name="params" type="Array">參數內容, 需使用 <i>stringFormatParams</i> 公用變數建立陣列物件.</param>
  /// <example>
  /// <code>
  /// var sValue;
  /// //
  /// sValue = stringFormat("{0}.{1}", [sID, sName]);
  /// ...
  /// </code>
  /// </example>
  /// <remarks>字串格式化規則同 C# String.Format() 方法, 參數內容需使用 <i>stringFormatParams</i> 公用變數建立陣列物件.</remarks>
  var result = String(format);
  var sIndex;
  var iStartIndex;
  //
  if (stringFormatParams != undefined) // 舊版程式相容
    params = stringFormatParams; // 重置數值陣列(使用字串格式化參數變數)
  if (params != undefined) // 若數值陣列存在
  {
    try
    {
      for (var I = 0; I < params.length; I++)
      {
        sIndex = "{" + I + "}"; // {0}, {1}, {2}, etc.
        iStartIndex = 0;
        //
        do
        {
          result = result.replace(sIndex, params[I]); // 數值取代索引位置, replace() 為單一取代若有多個需執行多次. 注意 : 參數值可能為 null.
          iStartIndex = result.indexOf(sIndex, iStartIndex);
        } while (iStartIndex != -1);
      }
    }
    finally
    {
      stringFormatParams = undefined; // 初始字串格式化參數變數(函式執行後清除避免後續字串格式化不正確使用舊有數值)
    }
  }
  //
  return result;
}

//
// 示範 : 
//
//   value = stringReplace(value, "Abc", "123");
//   value = stringReplace(value, "Abc", "123", { ignoreCase: true });
//
function stringReplace(value, searchValue, newValue, options)
{
  // 取代字串
  // .value, 來源數值.
  // .searchValue, 搜尋字串.
  // .newValue, 替代字串.
  // .options(object, optional), 選項 : 
  // -ignoreCase(bool), 是否不分大小寫, 預設 false (區分大小寫).
  // -replaceAll(bool), 是否取代全部, 預設 true (取代全部).
  // RegExp
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
  // *注意 : 原始 Javascript string replace() 函式僅取代第一個符合字串而非取代全部符合字串.
  var result;
  var regexp;
  var flags = "";
  //
  options = options || {};
  options = $.extend({ ignoreCase: false, replaceAll: true }, options);
  if (options.replaceAll)
    flags = flags + "g";
  if (options.ignoreCase)
    flags = flags + "i";
  regexp = new RegExp(searchValue, flags); // RegExp(pattern, flags)
  result = value.replace(regexp, newValue);
  //
  return result;
}

//
// 示範 : 
//
//   多行文字換行顯示
//
//     columns.Bound(c => c.TextColumn1).ClientTemplate("#= replaceNewLine(TextColumn1) #");
//
//     *注意 : ClientTemplate() 中 Html 語法轉換顯示必須使用 #= column # 格式(等號) : 
//
//      Template Syntax
//      http://docs.telerik.com/kendo-ui/framework/templates/overview#template-syntax
//
function replaceNewLine(value)
{
  // 取代全部換行符號為 Html 換行標籤(Tag)
  // .value, 來源數值.
  // *C＃ 的 ＼r＼n 在 Javascript 為 ＼n.
  var result = stringReplace(value, '\n', '<br/>');
  return result;
}

function toBase64(value)
{
  /// <summary>
  /// Base64 編碼轉換.
  /// </summary>
  /// <param name="value" type="String">原始字串.</param>
  /// <remarks>*Base64 編碼結果應使用另一變數(即非來源變數)存放, 避免後續程式碼非預期使用 Base64 編碼結果值.</remarks>
  var result = $.base64.encode(value, true); // 預設使用 UTF8 (與 .cs 程式碼一致)
  return result;
}

function fromBase64(value)
{
  /// <summary>
  /// Base64 編碼還原.
  /// </summary>
  /// <param name="value" type="String">Base64 編碼字串.</param>
  /// <remarks>若 Base64 編碼字串為空白或未定義將傳回空白.</remarks>
  var result = (value != "" && value != undefined) ? $.base64.decode(value, true) : ""; // 預設使用 UTF8 (與 .cs 程式碼一致), 空值防呆.
  return result;
}

function findParent(sender, name)
{
  // 尋找父元素
  // .sender, 目前元素物件.
  // .name, 父元素名稱(class > id, 若為 class 名稱傳入值不含 . 符號).
  // *傳回值 : 父元素, 若目前元素物件本身符合則直接傳回, 若無符合父元素將傳回 undefined.
  var result = undefined;
  var current;
  var count = 0;
  //
  current = sender;
  while (result == undefined && count < 1000)
  {
    if ($(current).hasClass(name))
    {
      result = current;
      break;
    }
    else if ($(current).attr("id") == name)
    {
      result = current;
      break;
    }
    current = $(current).parent();
    //
    count++;
  }
  //
  return result;
}

function findDeepest(element)
{
  // 尋找元素(最內層者)
  // .element, 來源元素
  // *變更多層元素的最內層元素文字等使用.
  var result = element;
  var first;
  //
  first = element; // 預設來源元素
  while ($(first).length > 0)
  {
    first = $(result).children(":first"); // 取得子元素
    if ($(first).length <= 0) // 若無子元素離開(已達元素的文字元素)
      break;
    result = first;
  }
  //
  return result;
}

//
// 示範 : 
//
//  var attributes;
//  var keys;
//  //
//  attributes = getObjectAttributes(data.Attributes);
//  keys = Object.keys(attributes);
//  for (var I = 0; I < keys.length; I++)
//  {
//    var loopKey = keys[I];
//    var loopValue = attributes[loopKey];
//    //
//    ...
//  }
//
function getObjectAttributes(obj, options)
{
  // 解析物件簡易資料屬性
  // .obj, 來源物件.
  // .options, 選項 : 
  // -emptyTo(bool, optional), 是否空值轉換為空白, 因為 undefined, null 等空值帶入元素屬性將直接為 "undefined", "null" 等字串將造成空值判斷不正確. 預設值為 true.
  // 傳回值 : 物件簡易資料屬性, 不含 function, object 等非簡易資料型態屬性.
  var result = {};
  var keys = Object.keys(obj); // object's attribute(s)
  var key, value;
  //
  options = options || {};
  options = $.extend({ emptyTo: true }, options);
  if (isEmpty(obj)) // 防呆(來源物件空值)
    return result;
  //
  for (var I = 0; I < keys.length; I++)
  {
    key = keys[I]; // 屬性名稱
    value = obj[key]; // 屬性值
    if (typeof value === "function" || typeof value === "object")
      continue;
    //
    value = (options.emptyTo) ? emptyTo(value, "") : value; // emptyTo, 空值轉換為空白, 否則 undefined, null 等空值帶入元素屬性將直接為 "undefined", "null" 等字串值.
    result[key] = value;
  }
  //
  return result;
}

function getElement(id)
{
  /// <summary>
  /// 查詢物件.
  /// </summary>
  /// <param name="id">元素 ID.</param>
  /// <returns>元素物件, 若無符合元素 ID 的元素將傳回 undefined.</returns>
  /// <example>
  /// <code>
  /// var Label1 = getElement("Label1");
  /// var sValue;
  /// //
  /// if (Label1 != undefined)
  ///   $(Label1).attr("attr1", "");
  /// ...
  /// </code>
  /// </example>
  // *部份瀏覽器(IE)未支援 MasterPage 內的 jQuery 直接 HTML 元素存取(如 $(Frame1) 等)因此需使用此方法.
  // *若網頁套用 MasterPage 該網頁中所有元素名稱將由 MasterPage 自動更名(如 Label1 -> XXXXX_Label1 等)
  //  而無法直接由元素 ID 取得元素物件, 因此若元素找不到再依元素 ID 結尾為 '_元素 ID' 方式尋找元素.
  var result = undefined;
  var sSelector, sId;
  // 一般網頁元素(無 MasterPage), 如 #element1 等.
  if (id == "" || id == undefined)
    return result;
  // MasterPage 存在元素, jQuery 物件長度為 0 表示找不到等於 ID 的元素(如網頁使用 MasterPage 等, 元素命名將依 MasterPage 變動), 使用 MasterPage 命名方式繼續尋找元素.
  sSelector = "#" + id;
  result = $(sSelector);
  if (result.length <= 0)
  {
    sSelector = "[id$='_" + id + "']"; // MasterPage 命名方式元素(如 Label1 的 ctl00_ContentPlaceHolder1_Label1 等) 或 Third Party 元件執行時期命名(如 C1Dialog1_C1Menu2 等) 的變動命名.
    result = $(sSelector);
  }
  // 找不到符合元素傳回未定義(undefined), 不使用空 jQuery 物件.
  if (result.length <= 0)
    result = undefined;
  //
  return result;
}

/// <summary>
/// checked.
/// </summary>
/// <param name="sender">對象元素.</param>
/// <param name="value">是否勾選, true/false.</param>
/// <remarks>請確認對象元素支援 checked 屬性否則將無作用, 如 input text 等.</remarks>
function checked(sender, value)
{
  // .prop()
  // http://api.jquery.com/prop/
  // *注意 : attr() 函式設定勾選狀態為 jquery 1.6 舊版方式.
  if (value == true)
  {
    $(sender).prop("checked", true);
  }
  else
  {
    $(sender).prop("checked", false);
  }
}

/// <summary>
/// disabled.
/// </summary>
/// <param name="sender">對象元素.</param>
/// <param name="disabled">disabled, true/false.</param>
/// <remarks>請確認對象物件支援 disabled 屬性否則將無作用, 如 input 等.</remarks>
function disabled(sender, disabled)
{
  if (disabled)
  {
    $(sender).attr("disabled", "disabled");
    $(sender).addClass("ui-state-disabled");
  }
  else
  {
    $(sender).removeAttr("disabled");
    $(sender).removeClass("ui-state-disabled");
  }
}

/// <summary>
/// readonly.
/// </summary>
/// <param name="sender">對象元素.</param>
/// <param name="readonly">readonly, true/false.</param>
/// <remarks>請確認對象物件支援 readonly 屬性否則將無作用, 如 input text 等.</remarks>
function readonly(sender, bReadonly)
{
  if (bReadonly)
  {
    $(sender).addClass("ui-state-disabled"); // 唯讀狀態, 元素套用唯讀樣式(仍可修改).
    $(sender).attr("readonly", "readonly"); // 唯讀屬性, 元素實際無法修改.
  }
  else
  {
    $(sender).removeClass("ui-state-disabled");
    $(sender).removeAttr("readonly");
  }
}

//
// 示範 : 
//
//   View
//
//     <input type="radio" class="data-xxxxx ..." ... value="..." />
//     <label for="...">...</label>
//
//     <input type="radio" class="data-xxxxx ..." ... value="..." />
//     <label for="...">...</label>
//
//   Javascript
// 
//     ... = getCheckedInputs(".data-xxxxx");
//
function getCheckedInputs(selector)
{
  // 取得已勾選項目元素(s)
  // .selector, 篩選表示式(CSS Selector), 如 .data-yourfieldname (類別樣式) 等.
  // *此函式為單選(input radio), 多選(input checkbox) 適用.
  // 傳回值 : 已勾選項目元素(s), 若無任何勾選項目則傳回空白 Array.
  var result = new Array();
  var inputs = $(selector); // 輸入元素(s)
  //
  for (var I = 0; I < inputs.length; I++)
  {
    var loopInput = inputs[I];
    var loopChecked = isChecked(loopInput);
    //
    if (loopChecked)
      result.push(loopInput); // 加入已勾選項目元素
  }
  //
  return result;
}

//
// 示範 : 
//
//   View
//
//     <input type="radio" class="data-xxxxx ..." ... value="..." />
//     <label for="...">...</label>
//
//     <input type="radio" class="data-xxxxx ..." ... value="..." />
//     <label for="...">...</label>
//
//   Javascript
// 
//     ... = getCheckedValue(".data-xxxxx");
//
function getCheckedValue(selector)
{
  // 取得勾選值
  // .selector, 篩選表示式(CSS Selector), 如 .data-yourfieldname (類別樣式) 等.
  // *此函式為單選(input radio)適用.
  // 傳回值 : 勾選項目值, 若無任何勾選項目則傳回空值(null, Model/ViewModel 空白屬性值格式).
  var result = null;
  var inputs = $(selector); // 輸入元素(s)
  //
  for (var I = 0; I < inputs.length; I++)
  {
    var loopInput = inputs[I];
    var loopChecked = isChecked(loopInput);
    //
    if (loopChecked)
      result = $(loopInput).val(); // 取得勾選項目值
  }
  //
  return result;
}

//
// 示範 : 
//
//   View
//
//     <input type="checkbox" class="data-xxxxx ..." ... value="..." />
//     <label for="...">...</label>
//
//     <input type="checkbox" class="data-xxxxx ..." ... value="..." />
//     <label for="...">...</label>
//
//   Javascript
// 
//     ... = getCheckedValues(".data-xxxxx");
//
function getCheckedValues(selector)
{
  // 取得勾選值
  // .selector, 篩選表示式(CSS Selector), 如 .data-yourfieldname (類別樣式) 等.
  // *此函式為多選(input checkbox)適用.
  // 傳回值 : 勾選項目值(Array), 若無任何勾選項目則傳回空白 Array.
  var result = new Array();
  var inputs = $(selector); // 輸入元素(s)
  //
  for (var I = 0; I < inputs.length; I++)
  {
    var loopInput = inputs[I];
    var loopChecked = isChecked(loopInput);
    //
    if (loopChecked)
      result.push($(loopInput).val()); // 加入勾選值
  }
  //
  return result;
}

/// <summary>
/// 取得勾選狀態.
/// </summary>
/// <param name="sender">對象物件.</param>
/// <returns>若為 true 表示已勾選否則為 false.</returns>
/// <remarks>
/// 請確認對象物件支援 checked 屬性, 如 input checkbox, ASP.NET CheckBox 等, 否則將無作用(皆傳回 false).
/// *因為 ASP.NET CheckBox 等轉換為 Html 將為 ＜span class＝...>＜input ...> 因此使用樣式類別名稱(class)將無法取得實際元素物件.
/// *此方法適用 input checkbox, ASP.NET CheckBox 等.
/// </remarks>
function isChecked(sender)
{
  var result;
  var input;
  //
  result = $(sender).is(":checked");
  input = $(sender).find("input"); // 尋找複合元素(內含的 input checkbox, radio 等)
  if ($(input).length > 0)
    result = $(input).is(":checked"); // 若為複合元素(ASP.NET CheckBox 等)必須額外取值
  //
  return result;
}

function isClassCreated(obj)
{
  // 是否作業類別已建立
  // .obj, 作業類別物件.
  // *此函式僅做為作業類別是否已建立判斷使用.
  // jQuery.type()
  // https://api.jquery.com/jQuery.type/
  var result = true;
  var type;
  //
  type = $.type(obj);
  if (isEmpty(obj))
    result = false;
  if (type == "function") // 未建立的作業類別將為 function 型態
    result = false;
  //
  return result;
}

/// <summary>
/// 取得選擇狀態.
/// </summary>
/// <param name="sender">對象物件.</param>
/// <returns>若為 true 表示已選擇否則為 false.</returns>
/// <remarks>
/// 請確認對象物件支援 selected 屬性, 如 select.option 等, 否則將無作用(皆傳回 false).
/// </remarks>
function isSelected(sender)
{
  var result = $(sender).is(":selected");
  return result;
}

function setDialogFixed(sender, top)
{
  // 固定對話盒
  // .sender, 對話盒物件
  // .top, 對話盒 top
  // *固定對話盒為背景視窗捲動時對話盒位置不變.
  // *目前僅支援 jquery dialog, 此方法一般置於 dialog open 事件函式.
  top = (top == undefined || top <= 0) ? 16 : top; // 防呆(若 top 為 undefined [如方法呼叫遺漏傳入 top 參數等] 將導致對話盒遺失而背景仍被鎖住(Local 測試可能正確但分發執行異常)
  $(sender).parent(".ui-dialog").css("top", top); // 固定對話盒(top/fixed 必須設定)
  $(sender).parent(".ui-dialog").css("position", "fixed");
}

function setDialogZIndex(sender, zIndex)
{
  // 設定對話盒 z-index (含 overlay)
  // .sender, 對話盒物件
  // .zIndex, z-index, 若為空值將忽略不處理
  if (!isEmpty(zIndex) && zIndex != "auto") // 若自訂 z-index 則套用至 dialog container
  {
    $(sender).parent(".ui-dialog").css("z-index", zIndex);
    if ($.isNumeric(zIndex))
    {
      zIndex = Number(zIndex) - 1; // 對話盒背景元素(overlay) z-index ＝ 對話盒 z-index － 1
      $(sender).parent(".ui-dialog").parent().children(".ui-widget-overlay").css("z-index", zIndex); // 設定與對話盒元素存在於相同層級的對話盒背景元素(overlay)
    }
  }
}

function setSize(sender, height, width)
{
  // 設定顯示大小
  // .height, 若為未定義預設最大畫面高度
  // .width, 若為未定義預設最大畫面寬度
  height = (height != undefined) ? height : $(window).height() - 40, // 防呆, undefined 可能導致顯示異常(元素未顯示實際存在於網頁可視範圍外)
  width = (width != undefined) ? width : $(window).width() - 40;
  $(sender).css("height", height);
  $(sender).css("width", width);
}

function initTooltip()
{
  // 初始 tooltip()
  // *工具提示設定(提示文字屬性預設使用元素的 title 屬性, 無論該元素原始是否定義 title 屬性)
  // *ready 時期使用
  $(document).tooltip({ position: { my: "left+16 top+16" }, track: true }); // tooltip position - follow the mouse(+) 
}

function resetTooltip()
{
  return; // 停用(直接返回), 若網頁物件量大將造成程式回應遲緩, 其他做法...

  // 重置 tooltip() 狀態(disabled : true -> false)
  // *tooltip() 執行時若顯示 dialog() 而 tooltip() 可能未正確隱藏而持續停滯於網頁(對話盒部份區域可能被覆蓋等).
  // *使用時機如 dialog.open 事件等(不置於 create 事件因為該事件僅執行一次).
  $(document).tooltip("option", "disabled", true);
  $(document).tooltip("option", "disabled", false);
}

/// <summary>
/// 設定元件狀態樣式.
/// </summary>
function enableControl(sControlID, bEnable)
{
  var control;
  //
  control = getElement(sControlID);
  if (control == undefined)
    return;
  //
  if (bEnable)
    $(confirm).removeClass("ui-state-disabled"); // Enable
  else
    $(control).addClass("ui-state-disabled"); // Disable
}

function alertError(message)
{
  // 提示訊息並引發錯誤
  // *引發錯誤後程序將中止, 可檢查 Chrome console 紅字得知錯誤提示訊息.
  alert(message);
  //
  throw new Error(message);
}

// 暫存訊息變數(限內部使用)
var _info = "";

function informationDlg(sMessage)
{
  /// <summary>
  //  訊息對話盒.
  /// </summary>
  if ($(document).data("_ready") != true) // 網頁未就諸(Postback 元件無應用 UpdatePanel 將存在此狀態)
  {
    _info = sMessage; // 網頁未就諸時暫存錯誤訊息至內部變數, 待網頁就緒時顯示此錯誤訊息, 因為 Postback 元件無應用 UpdatePanel 時 C# 中的 dialog() 顯示將無作用(無顯示), 因為網頁重整將導致對話盒物件初始.
    return;
  }
  customDlg(sMessage, "ui-state-default", "ui-icon ui-icon-info");
}

// 暫存錯誤訊息變數(限內部使用)
var _err = "";

function errorDlg(sMessage)
{
  /// <summary>
  //  錯誤對話盒.
  /// </summary>
  if ($(document).data("_ready") != true) // 網頁未就諸(Postback 元件無應用 UpdatePanel 將存在此狀態)
  {
    _err = sMessage; // 網頁未就諸時暫存錯誤訊息至內部變數, 待網頁就緒時顯示此錯誤訊息, 因為 Postback 元件無應用 UpdatePanel 時 C# 中的 dialog() 顯示將無作用(無顯示), 因為網頁重整將導致對話盒物件初始.
    return;
  }
  customDlg(sMessage, "ui-state-error", "ui-icon ui-icon-alert");
}

$(document).ready(function()
{
  // ready
  // *event order : this ready -> page's ready
  try
  {
    $(document).data("_ready", true); // 註記網頁就諸
    // 對話盒, 若暫存錯誤訊息存在補正顯示對話盒.
    if (_err != "" && _err != undefined)
      errorDlg(_err + "(ready)");
    if (_info != "" && _info != undefined)
      informationDlg(_info + "(ready)");
  }
  finally
  {
    _err = ""; // 清除訊息狀態
    _info = "";
  }
});

function informationBlock(sBlock, sMessage)
{
  // 訊息區塊
  customBlock("block", sBlock, sMessage, "ui-state-highlight ui-corner-all", "ui-icon ui-icon-info");
}

function errorBlock(sBlock, sMessage)
{
  // 錯誤訊息區塊
  customBlock("block", sBlock, sMessage, "ui-state-error ui-corner-all", "ui-icon ui-icon-alert");
}

function customBlock(sSource, sBlock, sMessage, sType, sIcon)
{
  var block = getElement(sBlock);
  var sHtml1;
  var sBorder = "", sMargin = "";
  //
  if (sSource == "block") // 增加 top 間隔(區塊模式)
    sMargin = "margin-top: 8px";
  if (sSource == "dialog") // 取消框線(對話盒模式) && sType.indexOf("ui-icon-info") != -1)
    sBorder = "border: 0px; ";
  // 關鍵字樣式, 如訊息內容包含 '確定按鈕' 則 '確定' 以明顯樣式呈現等.
  if (sMessage.indexOf("確定按鈕") != -1)
    sMessage = sMessage.replace("確定按鈕", "<strong>確定</strong>按鈕");
  //
  sHtml1 = "<div class='" + sType + "' style='" + sMargin + "; padding: 0 .7em; " + sBorder + "'>"
         + "  <p>"
         + "    <span class='" + sIcon + "' style='float: left; margin-right: .3em;'></span>"
         + "    " + sMessage + ""
         + "  </p>"
         + "</div>";
  sHtml1 = "<div class='" + sType + "' style='" + sMargin + "; padding: 0 .7em; " + sBorder + "'>"
         + "  <p>"

         + "    <table><tr><td valign='top'> "

         + "    <span class='" + sIcon + "' style='float: left; margin-right: .3em;'></span>"

         + "    </td> "
         + "    <td valign='top'> "

         + "    " + sMessage + ""

         + "    </td></tr></table> "

         + "  </p>"
         + "</div>";
  $(block).html(sHtml1);
}

function customDlg(sMessage, sType, sIcon)
{
  // 訊息對話盒
  // *因為若作業網頁內嵌於 <iframe> 內而作業網頁 alert() 方法顯示時將加註 '此頁於 [Web 應用程式位址] 說:' 後接訊息內容,
  //  可使用訊息對話盒排除此問題情況.
  var informationDlgForm;
  var sTitle;
  var iHeight = 200, iWidth = 600;
  //
  sTitle = (sType.indexOf("ui-state-error") != -1) ? "錯誤" : "訊息";
  if (sMessage.length <= 20) // 對話盒寬度, 依文字字數調整(length - 一個中文字長度為 1).
    iWidth = 400;
  if (sMessage.indexOf("<br/>") != -1)
    iHeight = iHeight + 20;
  //
  informationDlgForm = getElement("informationDlgForm");
  if (informationDlgForm == undefined) // 加入對話盒物件(若不存在) - 使用 getElement() 方法不存在將傳回 undefined, 非判斷物件 length <= 0).
  {
    var firstForm = $("form:first");
    var sInformationDlgForm;
    //
    sInformationDlgForm = "<div id='informationDlgForm' style='display: none'> \
                             </div>";
    $(firstForm).append($(sInformationDlgForm)); // 使用 $(document).append(...) 將發生錯誤(null)
    informationDlgForm = getElement("informationDlgForm");
  }
  //
  var openDialog = $(informationDlgForm).dialog(
  {
    autoOpen: false,
    modal: true,
    height: iHeight,
    width: iWidth,
    closeText: "關閉",
    title: sTitle,
    position:
    {
      // TODO: frame center top ?
    },
    buttons:
    [
      {
        text: "確定",
        click: function()
        {
          $(this).dialog("close");
        }
      }

  //,{
  //  text: "取消",
  //  click: function()
  //  {
  //    alert("cancel la");
  //    $(this).dialog("close");
  //  }
  //}

    ],
    create: function(event, ui)
    {
      // create
    },
    open: function(event, ui)
    {
      // open
      var sDialogBlock = $(informationDlgForm).attr("id");
      customBlock("dialog", sDialogBlock, sMessage, sType, sIcon);
    }
  });
  //
  openDialog.dialog("open");
}

//
// 示範 :
//
// ASP.NET MVC
//
// 若 ajax type 為 GET, 若傳回 Json 則 Action 傳回程序必須配合使用 Json(..., JsonRequestBehavior.AllowGet), 否則將引發例外.
// 若 ajax type 為 POST 則 Action 方法必須明確標示 [HttpPost] 屬性註記, 否則 Action 方法參數值將皆為 null : 
//
//   url 格式 : /controller/action
//
//   [HttpGet] or [HttpPost] or [AcceptVerbs(HttpVerbs.Get | HttpVerbs.Post)]
//   public ActionResult Action1(...)
//   {
//
// Script 方法 : 
//
//  action1: function(...)
//  {
//    // ...
//    // *若傳回 true 表示執行正確, 否則傳回 false.
//    var result = false;
//    var url;
//    var data;
//    //
//    url = "/controller1/action1";
//    data = { param1: value1, param2: value2 };
//    ajaxGet("...", url, data, 
//    {
//      success: function(response)
//      {
//        // ...
//        //
//        result = true;
//      }
//    }); // custom.jquery.utils
//    //
//    return result;
//  }
//
function ajaxGet(title, url, data, options)
{
  // ajax get
  // .title, 執行名稱.
  // .url, 執行位址.
  // .data, 參數內容(JSON 格式).
  // .options, ajax 選項
  // -cache, 預設不使用 Cache, 否則若參數相同等執行一次後將不重新執行 controller/action.
  // -async, 預設使用同步模式, 後續程式需等待執行完畢後才可繼續.
  // *若未指定錯誤處理函式將使用預設錯誤處理函式.
  var baseAddress = $(".SystemBaseAddressHidden").val();
  //
  if (baseAddress && url.indexOf("http") != 0)
  {
    if (url.indexOf("/") == 0)
      url = url.substr(1, url.length);
    url = baseAddress + url;
  }
  //
  options = options || {};
  options = $.extend(
  {
    type: "GET",
    async: false,
    cache: false,
    error: function(response)
    {
      alert(title + "執行有誤 - " + formatAjaxError(response, true));
    }
  }, options);
  //
  ajaxAction(url, data, options); // custom.jquery.utils
}

//
// 示範 : 使用方式請參考 ajaxGet 函式.
//
function ajaxPost(title, url, data, options)
{
  // ajax post
  // .title, 執行名稱.
  // .url, 執行位址.
  // .data, 參數內容(JSON 格式).
  // .options, ajax 選項
  // -cache, 預設不使用 Cache, 否則若參數相同等執行一次後將不重新執行 controller/action.
  // -async, 預設使用同步模式, 後續程式需等待執行完畢後才可繼續.
  // *若未指定錯誤處理函式將使用預設錯誤處理函式.
  var baseAddress = $(".SystemBaseAddressHidden").val();
  //
  if (baseAddress && url.indexOf("http") != 0)
  {
    if (url.indexOf("/") == 0)
      url = url.substr(1, url.length);
    url = baseAddress + url;
  }
  //
  if (!(typeof data === "string")) // post 必須轉型為 JSON string, 否則將執行錯誤 - "無效的 JSON 基本型別: property1。".
    data = JSON.stringify(data);
  //
  options = options || {};
  options = $.extend(
  {
    type: "POST",
    async: false,
    cache: false,
    error: function(response)
    {
      alert(title + "執行有誤 - " + formatAjaxError(response, true));
    }
  }, options);
  //
  ajaxAction(url, data, options); // custom.jquery.utils
}

function ajaxAction(url, data, options)
{
  //
  // 注意 : 請不直接使用 ajaxAction() 函式, 請使用 ajaxGet/ajaxPost 函式.
  //
  // ASP.NET MVC 使用
  // *ajax 方法簡化函式
  // *預設採同步方式執行(async: false), 即後續程式碼需等待 ajax 方法執行結束完畢.
  // *jQuery.ajax()
  //  https://api.jquery.com/jquery.ajax/

  // MVC Action 不轉換否則 get 傳入參數將皆為 null : 
  ////if (!(typeof data === "string"))
  ////  data = JSON.stringify(data);

  //
  options = options || {};
  options = $.extend(
  {
    type: "POST",
    async: false,
    cache: false,
    global: true,
    success: function(response)
    {
    },
    error: function(response)
    {
    }
  }, options);
  //
  $.ajax(
  {
    type: options.type,
    url: url,
    contentType: "application/json; charset=utf-8",
    data: data,
    // 不限制傳回型態否則若傳回型態不符將被判斷為執行錯誤 dataType: "json", ...
    async: options.async,
    cache: options.cache,
    global: options.global,
    success: function(response)
    {
      options.success(response);
    },
    error: function(response)
    {
      options.error(response);
    }
  });
}

//
// 注意 : ASP.NET MVC 請改用 ajaxGet/ajaxPost, 請勿使用 ajaxMethod 函式, 該函式為 ASP.NET AJAX 相容使用.
//
// 示範 :
//
// ASP.NET AJAX
//
// 服務方法必須為 public static 並標示 [WebMethod] : 
//
//   url 格式 : WebForm1.aspx/WebMethod1
//
//   [WebMethod]
//   public static string Method1(string ...)
//   {
//
// Script 方法 : 
//
//   function ajaxMethod1(...)
//   {
//     // ...
//     // *若傳回 true 表示執行正確, 否則傳回 false.
//     var result = false;
//     var url;
//     var data, ajaxOptions;
//     //
//     url = "WebForm1.aspx/WebMethod1";
//     data = { param1: value1, param2: value2 };
//     ajaxOptions =
//     {
//       success: function(response)
//       {
//         result = true;
//       },
//       error: function(response)
//       {
//         alert("WebMethod1 error - " + formatAjaxError(response, false));
//       }
//     };
//     ajaxMethod(url, data, ajaxOptions); // custom.jquery.utils
//     //
//     return result;
//   }
//
function ajaxMethod(url, data, options)
{
  // ajax 方法簡化函式
  // *預設採同步方式執行(async: false), 即後續程式碼需等待 ajax 方法執行結束完畢.
  if (!(typeof data === "string"))
    data = JSON.stringify(data);
  //
  options = options || {};
  options = $.extend(
  {
    type: "POST",
    async: false,
    success: function(response)
    {
    },
    error: function(response)
    {
    }
  }, options);
  //
  $.ajax(
  {
    type: options.type,
    url: url,
    contentType: "application/json; charset=utf-8",
    data: data,
    dataType: "json",
    async: options.async,
    success: function(response)
    {
      options.success(response);
    },
    error: function(response)
    {
      options.error(response);
    }
  });
}

//
// 示範 :
//
// Javascript
//
//  同步 ajax 程序開啟畫面鎖定 : 
//
//  SaveButton_Click: function(e)
//  {
//    ...
//    var callback;
//    //
//    ...
//    callback = function()
//    {
//      ...
//      ajaxPost(...,
//      {
//        success: function(response)
//        {
//          ...
//        }
//      });
//      ...
//    };
//    startBlock(callback);
//  },
//
function startBlock(callback, options)
{
  //
  // *此函式僅提供同步 ajax 執行使用. 若原實作已為非同步 ajax 執行, 因為非同步 ajax 本身已內建 blockUI 應用因此請勿使用此函式.
  //
  // 同步程序 BlockUI
  // .callback, 同步程序 Callback 函式(無參數).
  // .options(optional), 選項(保留使用).
  // -unblock(bool, optional), 是否執行結束後自動 unblockUI (無論執行正確與否), 預設值為 true (執行結束後將自動 unblockUI).
  //  *此屬性一般為作業需自行控制 Block UI 時使用, 如作業程序皆正確解除畫面鎖定否則任一錯誤發生保持畫面鎖定等.
  //   作業非必要請勿自訂此屬性.
  // *blockUI/unblockUI 函式為系統內建自訂通用函式.
  // *若同步 ajax 執行完成後需接續顯示其他視窗則請自行先行執行 unblockUI() 函式解除畫面鎖定.
  var onBlock;
  //
  options = options || {};
  options = $.extend({ unblock: true }, options);
  //
  onBlock = function()
  {
    try
    {
      callback();
    }
    finally
    {
      if (options.unblock)
        unblockUI();
    }
  };
  blockUI({ onBlock: onBlock, fadeIn: 100, css: { opacity: 0.8 } }); // fadeIn = 100 最小值則顯示等待較小(數值過小不適用, 因為將造成 Block UI 未顯示的錯覺但實際已顯示結束), opacity = 0.8 透明度較大則可識別顯示類型.
}

function setSessionState(program, data)
{
  // 設定 Session
  // .program, 程式代碼
  // .data, 資料集合(key/value, JSON 格式), 複雜數值傳遞使用(如大量編輯文字), 簡單數值可直接使用查詢字串方式.
  // *若傳回 true 表示執行正確, 否則傳回 false.
  var result = false;
  var url;
  var ajaxOptions;
  //
  url = "MethodPage.aspx/SetSessionState";
  data = JSON.stringify({ sProgramNo: program, sDataItems: JSON.stringify(data) });
  ajaxOptions =
  {
    success: function(response)
    {
      result = true;
    },
    error: function(response)
    {
      alert("setSessionState error - " + program + ", " + formatAjaxError(response, false));
    }
  };
  ajaxMethod(url, data, ajaxOptions); // custom.jquery.utils
  //
  return result;
}

/* anchor */

function getClientSize()
{
  // 取得 Client 區域大小(扣除狀態列/捲軸等)
  var result;
  var height, width;
  var heightOffset = 16, widthOffset = 16;
  //
  height = $(window).height(); // 瀏覽器程式視窗大小(已除去瀏覽器工具列/捲軸等大小)
  width = $(window).width();
  if ($.browser.msie)
  {
    heightOffset = 28; // height/width 差值 - Internet Explorer 需差值較大(狀態列)
    widthOffset = 16;
  }
  //
  height = height - heightOffset;
  width = width - widthOffset;
  result = { height: height, width: width };
  //
  return result;
}

function applyAnchor(sender)
{
  // 套用 Anchor 設定
  // *因為元素 offset 於 window.load 事件時確立因此設定元素大小必須執行於 window.load 事件或後續程式碼,
  //  而因為元素 offset 於 document.ready 事件時未確立因此不適用.
  var anchor;
  var offset;
  var height, width;
  var bottomOffset, heightOffset = 16, widthOffset = 16;
  //
  anchor = $(sender).attr("anchor");
  bottomOffset = $(sender).attr("anchor-bottom-offset");
  if (isEmpty(anchor))
    return;
  //
  offset = $(sender).position(); // 元素的左上位置(相較於文件)
  height = $(window).height(); // 瀏覽器程式視窗大小(已除去瀏覽器工具列/捲軸等大小)
  width = $(window).width();
  if ($.browser.msie)
  {
    heightOffset = 28; // height/width 差值 - Internet Explorer 需差值較大(狀態列)
    widthOffset = 16;
  }
  //
  height = ($.isNumeric(bottomOffset)) ? height - Number(bottomOffset) : height; // height 除去 bottom 差值, 如對話盒下方按鈕等.
  if (anchor == "top left bottom")
  {
    height = height - offset.top;
    $(sender).css("height", height - heightOffset);
  }
  if (anchor == "top left bottom right")
  {
    height = height - offset.top;
    width = width - offset.left;
    $(sender).css("height", height - heightOffset);
    $(sender).css("width", width - widthOffset);
  }
}

/* grid */

/* GridView 群組實作可採 GridView.ItemTemplate 內含子 GridView 方式配合使用自訂樣式/方法 :
 *
 *   toggleGroupContent()  切換顯示群組內容
 *   grid-group-header  群組標題(若 no-state-hover 表示列不使用滑鼠移動樣式)
 *   grid-group-content 群組內容, 點選展開/收回圖示時切換顯示的目的元素
 *   grid-group-item    群組項目(樣式)
 *   grid-group-link    群組項目連結(樣式)
 *
 *   enableRowHoverState() 開啟 tr 滑鼠移動樣式(主要頁面如 MasterPage 使用)
 *   grid-hover 列(tr)滑鼠移動樣式(限定套用 grid-hover 類別樣式否則將套用至文件中所有列(tr)元素)
 */

function enableRowHoverState()
{
  // 開啟列(tr)滑鼠移動樣式
  // *滑鼠移動時切換列(tr)樣式套用
  $(document).on("mouseover", ".grid-hover tr", function()
  {
    if ($(this).children().children().hasClass("no-state-hover")) // 若註記不使用則返回(如 tr 性質為標題等)
      return;
    //
    $(this).addClass("ui-state-hover"); // 套用樣式
  });
  $(document).on("mouseout", ".grid-hover tr", function()
  {
    $(this).removeClass("ui-state-hover"); // 套用樣式取消
  });
}

function toggleGroupContent(sender)
{
  // 切換顯示群組內容
  // .sender, 展開/收回圖示元素
  // *群組內容型態 1/2 - 作業可自行配置(擇一)
  var content;
  //
  content = $(sender).parent().children(".grid-group-content"); // 群組內容型態 1 : (td > content) ＜ (sender)
  if ($(content).length <= 0)
    content = $(sender).parent().parent().children(".grid-group-content"); // 群組內容型態 2 : (tr > content) ＜ (td) ＜ (sender)
  $(content).toggle(); // 切換顯示/隱藏
  $(sender).toggleClass("ui-icon-triangle-1-e", !$(content).is(":visible")); // 展開圖示(若群組內容隱藏)
  $(sender).toggleClass("ui-icon-triangle-1-se", $(content).is(":visible")); // 收回圖示(若群組內容顯示)
  //暫不使用(捲動網頁需判斷元素有超出範圍) -> 若群組內容超出網頁可視範圍自動捲動至群組內容位置 $('html, body').animate({
  //  scrollTop: $(content).offset().top
  //}, 1000);
}

function printDocument(html)
{
  // 列印網頁特定區塊，一般會以 div 標註範圍 且用 ID Naming
  // ex. <div id="printArea" ...
  //       ...
  //     </div>
  // 
  // ex. function(){
  //         var printStr = $("#printArea").html();
  //         printDocument(printArea);
  //     }
  // *注意 : 此函式將暫時變更網頁內容, 僅適用於獨立對話視窗, 主要作業不適用.
  var bodyHtml = document.body.innerHTML;
  document.body.innerHTML = html;
  window.print();
  document.body.innerHTML = bodyHtml;
}

/* end */