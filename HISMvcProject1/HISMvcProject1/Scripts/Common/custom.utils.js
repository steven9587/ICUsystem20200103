/*
  custom.utils.js?date=20180724-1400
  
    Custom method.
*/

function _initCap(value)
{
  // 限內部使用
  var result = "";
  var sLeading = "";
  var iStart = 0, iValueLength = value.length;
  var ch;
  //
  if (value == "") // 來源字串空白直接返回
    return result;
  //
  for (var I = 0; I < iValueLength; I++)
  {
    ch = value[I];
    if (ch != ' ' && ch != '\r' && ch != '\n') // 非空白字元(含換行字元)者結束迴圈
      break;
    sLeading = sLeading + ch; // 累加前導空白字元(含換行字元)
    iStart++;
  }
  result = sLeading + value.substr(iStart, 1).toUpperCase() + value.substring(iStart + 1); // substr(start, count), substring(start, end)
  //
  return result;
}

function initCap(value)
{
  /// <summary>
  /// 首字大寫.
  /// </summary>
  /// <param name="value" type="String">來源字串</param>
  /// <returns>首字大寫字串, 如 'the soap' 首字大寫為 'The Soap' 等.</returns>
  var result = "";
  var iSpace;
  //
  do
  {
    iSpace = value.indexOf(" "); // 下一個空白字元索引位置
    if (iSpace != -1)
    {
      result = result + _initCap(value.substr(0, iSpace + 1)); // cap sub-value
      value = value.substring(iSpace + 1); // reset source value
    }
    else
    {
      result = result + _initCap(value); // cap remaining value
      value = ""; // end
    }
  } while (value != "");
  //
  return result;
}

function isEmpty(value, options)
{
  // 是否空值
  // .options, 選項 : 
  // -trim(bool, optional), 是否 trim 空白者表示空值, 預設值為 true.
  // *此方法為數值變數使用, 若值為空白, null[下拉元件無資料繫結等], 未定義等皆表示空值.
  // *字串 trim 預設使用 $.trim() 函式.
  // *傳回值 : 若傳回 true 表示值為空值, 否則傳回 false.
  var result;
  var valueType;
  //
  options = options || {};
  options = $.extend({ trim: true }, options);
  valueType = typeof value;
  //
  result = (value == "" || value == null || value == undefined);
  result = (result && valueType != "number"); // avoid moron 0 equals "" is true
  result = (result && valueType != "boolean"); // avoid moron false equals "" is true
  if (options.trim && !result) // trim, 若前方判斷不為 null/undefined
    result = result && ($.trim(value.toString() == ""));
  //
  return result;
}

function isDigit(value)
{
  // 是否為數字內容
  // .value, 來源數值.
  // *傳回值 : 若傳回 true 表示來源數值為數字內容, 否則為 false.
  // *注意 : 使用 checkValue 變數進行數值檢核, 因為直接使用參數值將改變.
  var result = true;
  var checkValue;
  var charAt;
  //
  if (isEmpty(value)) // 空值
    return false;
  //
  value = value.toString();
  checkValue = value.toString();
  for (var I = 0; I < checkValue.length; I++)
  {
    charAt = checkValue.charAt(I);
    result = result && (charAt >= '0' && charAt <= '9');
  }
  //
  return result;
}

function isInteger(value)
{
  // 是否為整數數值
  // .value, 來源數值.
  // Number.isInteger() - Internet Explorer 12 開始支援
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  // *整數數值 : 如 100, -100 等.
  // *傳回值 : 若傳回 true 表示來源數值為整數數值, 否則為 false.
  // *注意 : 若判斷來源數值為整數數值不表示該數值為整數型態, 數字運算必須明確使用 Number(value) 方式進行轉型, 否則可能造成運算錯誤結果(如 "10" + 1 = 101 等)
  var result = true;
  var checkValue;
  //
  try
  {
    checkValue = Number(value);
    if (checkValue < 0)
    {
      checkValue = checkValue.toString();
      checkValue = checkValue.substring(1, checkValue.length - 1); // 除去負號(-)
    }
    result = isDigit(checkValue);
  }
  catch (err)
  {
    result = false;
  }
  //
  return result;
}

function isNumeric(value)
{
  // 是否為數字數值
  // .value, 來源數值.
  // isNumeric()
  // https://api.jquery.com/jQuery.isNumeric/
  // NaN
  // https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/NaN
  // *傳回值 : 若傳回 true 表示來源數值為數字數值, 否則為 false.
  // *注意 : 若判斷來源數值為數字數值不表示該數值為數字型態, 數字運算必須明確使用 Number(value) 方式進行轉型, 否則可能造成運算錯誤結果(如 "10" + 1 = 101 等)
  var result = true;
  var checkValue;
  //
  try
  {
    checkValue = Number(value);
    if (isNaN(checkValue)) // 數值若不合法(如 "14s" 等)則 Number() 將無引發例外而傳回 NaN
      result = false;
  }
  catch (err)
  {
    result = false;
  }
  //
  return result;
}

function round(number, precision)
{
  // 四捨五入
  // .number, 來源數值.
  // .precision, 小數點位數.
  // *計算結果示範 : 
  //  無小數點位數
  //  -2.8  => -3
  //   2.8  =>  3
  //   1.8  =>  2
  //   1.45 =>  1
  //  小數點位數
  //  -2.859 (precision = 2) => -2.86 
  //   2.859 (precision = 2) =>  2.86 
  //   1.84  (precision = 1) =>  1.8  
  // Math.round() ＞ PHP-Like rounding Method(myNamespace.round)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
  var result;
  var factor, tempNumber, roundedTempNumber;
  //
  precision = (!isEmpty(precision)) ? precision : 0; // 防呆, 未指定小數位數預設無小數位數
  //
  factor = Math.pow(10, precision);
  tempNumber = number * factor;
  roundedTempNumber = Math.round(tempNumber);
  result = roundedTempNumber / factor;
  //
  return result;
}

function isValidObject(obj)
{
  // 是否有效物件(jquery)
  // *若傳回 true 表示有效物件, 否則傳回 false.
  var result = (obj != null && obj != undefined && obj.length > 0);
  return result;
}

//
// 示範 : 
//
//   var value;
//   //
//   value = undefined;
//   value = emptyTo(value, ""); // undefined ＞ ""
//   value = "123";
//   value = emptyTo(value, "ABC"); // "123"
//
function emptyTo(value, alt)
{
  // 空數值轉換
  // .value, 來源數值.
  // .alt, 替換數值.
  // 傳回值 : 若來源數值為空白(Trim)則傳回替換數值.
  var result;
  //
  result = value;
  if (isEmpty(result) || $.trim(result) == "")
    result = alt;
  //
  return result;
}

//
// 示範 : 
//
//   var dataItem;
//   var value;
//   //
//   dataItem = { Key1: "123", ... };
//   value = parseValue(dataItem, "Key1"); // "123"
//   value = parseValue(dataItem, "key1"); // "123"
//   value = parseValue(dataItem, "Key2"); // ""
//   value = parseValue(dataItem, "Key2", "ABC"); // "ABC"
//
function parseValue(item, name, alt)
{
  // 解析鍵值(JSON 物件)
  // .item, JSON 物件
  // .name, 鍵值(不分大小寫)
  // .alt, 替換數值(若鍵值不存在)
  // .傳回值, 若鍵值不存在將傳回替代數值或空白(含替代數值為 undefined 者).
  // *此方法應用於查詢字串(Query String)等鍵值名稱大小寫不固定者使用(如網址查詢字串, 外部來源資料等).
  // *原始 JSON 鍵值區分大小寫(若無符合大小寫鍵值將傳回 undefined).
  var result;
  // 鍵值存在直接傳回值(name)
  result = item[name];
  if (result != undefined)
    return result;
  // 鍵值比對使用大寫(key)
  result = (alt != undefined) ? alt : ""; // 若替代數值為 undefined 預設傳回空字串, 因為 js 若函式呼叫遺漏參數則參數值將為 undefined (防呆)
  name = name.toUpperCase(); // 鍵值比對使用大寫
  for (var key in item)
  {
    if (key.toUpperCase() == name) // 鍵值相同
    {
      result = item[key];
      break;
    }
  }
  //
  return result;
}

function indexOf(array, element)
{
  // IE8 未支援 Array.indexOf/lastIndexOf 方法.
  var result = -1;
  var loopValue;
  //
  for (var iIndex in array)
  {
    loopValue = array[iIndex];
    if (loopValue == element)
    {
      result = iIndex;
      break;
    }
  }
  //
  return result;
}

// #region encodeHtml/decodeHtml

//
// encodeEntities/decodeEntities 程式碼來源截取自 sanitize : 
//
//  ＄sanitize
//  https://github.com/angular/angular.js/blob/v1.3.14/src/ngSanitize/sanitize.js#L435
//

/**
  * decodes all entities into regular string
  * @param value
  * @returns {string} A string with decoded entities.
  */
function decodeEntities(value)
{
  var hiddenPre = document.createElement("pre");
  if (!value) { return ''; }

  hiddenPre.innerHTML = value.replace(/</g, "&lt;");
  // innerText depends on styling as it doesn't display hidden elements.
  // Therefore, it's better to use textContent not to cause unnecessary reflows.
  return hiddenPre.textContent;
}

/**
  * Escapes all potentially dangerous characters, so that the
  * resulting string can be safely inserted into attribute or
  * element text.
  * @param value
  * @returns {string} escaped text
  */
function encodeEntities(value)
{
  // Regular Expressions for parsing tags and attributes
  var SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  // Match everything outside of normal chars and " (quote character)
  NON_ALPHANUMERIC_REGEXP = /([^#-~ |!])/g;

  return value.
    replace(/&/g, '&amp;').
    replace(SURROGATE_PAIR_REGEXP, function(value)
    {
      var hi = value.charCodeAt(0);
      var low = value.charCodeAt(1);
      return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
    }).
    replace(NON_ALPHANUMERIC_REGEXP, function(value)
    {
      return '&#' + value.charCodeAt(0) + ';';
    }).
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;');
}

function decodeHtml(value)
{
  // Html 內容解碼
  // .encodeEntities - 
  //  ＄sanitize
  //  https://github.com/angular/angular.js/blob/v1.3.14/src/ngSanitize/sanitize.js#L435
  var result;
  //
  result = decodeEntities(value);
  result = result.replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  //
  return result;
}

function encodeHtml(value)
{
  // Html 內容編碼
  // .encodeEntities - 
  //  ＄sanitize
  //  https://github.com/angular/angular.js/blob/v1.3.14/src/ngSanitize/sanitize.js#L435
  var result;
  //
  result = encodeEntities(value);
  result = result.replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  //
  return result;
}

// #endregion

function encodeUrl(value)
{
  // Url 內容編碼
  // .value, 原始數值.
  // encodeURIComponent()
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  // *encodeURIComponent() 函式等同 C# ASP.NET Uri.EscapeDataString() 方法.
  var result;
  //
  result = encodeURIComponent(value);
  //
  return result;
}

function decodeUrl(value)
{
  // Url 內容解碼
  // .value, 已編碼數值.
  // decodeURIComponent()
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
  // *decodeURIComponent() 函式等同 C# ASP.NET HttpUtility.UrlDecode 方法.
  var result;
  //
  result = decodeURIComponent(value);
  //
  return result;
}

//
// 示範 : 
//
//   value = padStart(value, LENGTH_Value1); // ex. "1000" ＞ "    1000"
//   value = padStart(value, LENGTH_Value1, "-"); // ex. "1000" ＞ "----1000"
//
function padStart(value, targetLength, padString)
{
  // 填滿左方字元長度
  // .value(object), 原始數值.
  // .targetLength(int), 填滿結果長度.
  // .padString(string, optional), 填滿字串, 若未指定則預設使用空白字元.
  // *Moron Chrome not support string.padStart/padEnd.
  var result;
  //
  result = (!isEmpty(value)) ? value : ""; // 防呆, 空值轉換為空白字串
  padString = (isEmpty(padString)) ? " " : padString; // 無填充字元預設使用空白字元
  while (result.length < targetLength)
    result = padString + result;
  if (result.length > targetLength && result.length > value.length) // 填滿超出長度者移除, 但原始數值除外(保留原值內容)
    result = result.substr(result.length - targetLength, targetLength);
  //
  return result;
}

//
// 示範 : 
//
//   value = padEnd(value, LENGTH_Value1); // ex. "1000" ＞ "1000    "
//   value = padEnd(value, LENGTH_Value1, "-"); // ex. "1000" ＞ "1000----"
//
function padEnd(value, targetLength, padString)
{
  // 填滿右方字元長度
  // .value(object), 原始數值.
  // .targetLength(int), 填滿結果長度.
  // .padString(string, optional), 填滿字串, 若未指定則預設使用空白字元.
  // *Moron Chrome not support string.padStart/padEnd.
  var result;
  //
  result = (!isEmpty(value)) ? value : ""; // 防呆, 空值轉換為空白字串
  padString = (isEmpty(padString)) ? " " : padString; // 無填充字元預設使用空白字元
  while (result.length < targetLength)
    result = result + padString;
  if (result.length > targetLength && result.length > value.length) // 填滿超出長度者移除, 但原始數值除外(保留原值內容)
    result = result.substr(result.length - targetLength, targetLength);
  //
  return result;
}

function sleep(milliseconds, listener)
{
  // 執行序睡眠
  // .milliseconds, 延遲時間(Milliseconds).
  // .listener, Listener 函式, 若傳回 true 表示繼續睡眠程序, 否則傳回 false 表示結束睡眠程序. 若未定義則忽略.
  // *setTimeout() 函式為文件載入完成後啟動而不為立即執行函數, 因此 setTimeout() 函式不適用實作執行序睡眠.
  var end;
  //
  if (milliseconds == undefined) // 防呆
    return;
  //
  end = Date.now() + milliseconds; // 目前時間(Milliseconds) + 延遲時間(Milliseconds)
  while (true)
  {
    current = Date.now();
    if (current >= end)
      break;
    if (listener && !listener()) // Listener 函式
      break;
  }
}

function parseOriginalError(errorText)
{
  // 解析原始錯誤訊息(片斷)
  // *.NET 原始錯誤訊息(片斷), 如 [Exception: 錯誤訊息 ... ] 等.
  // *因為無論 IE, Chrome 等瀏覽器 Ａlert 時可能遇過長訊息內容將不完全顯示因此解析原始錯誤訊息(片斷)置於前方顯示.
  var result = "";
  var iExceptionStart, iExceptionEnd;
  //
  iExceptionStart = errorText.indexOf("[Exception: 錯誤訊息");
  if (iExceptionStart != -1)
  {
    iExceptionEnd = errorText.indexOf("]", iExceptionStart);
    if (iExceptionEnd != -1)
    {
      result = errorText.substr(iExceptionStart, (iExceptionEnd - iExceptionStart) + 1);
    }
  }
  //
  return result;
}

function extractAjaxError(error, options)
{
  // 取得錯誤訊息
  // .error, 錯誤訊息(error.responseText).
  // .options(optional), 選項 : 
  // -keepOriginal, 保留原始錯誤訊息內容, 預設值為 true.
  // *取得錯誤訊息為截取明確錯誤訊息文字/去除原始錯誤訊息內容(Html's <title> 等).
  // *ErrorMessage 為自訂通用錯誤訊息 Tag, 錯誤訊息格式化由共用方法進行(如 ajax 執行 Action 的 ThrowModelError() 等方法).
  var result = error;
  var tagStart, tagEnd;
  var indexStart, indexEnd;
  var handled = false;
  //
  error = emptyTo(error, "");
  if (isEmpty(result)) // 防呆(空值)
    result = "";
  //
  options = options || {};
  options = $.extend(
  {
    keepOriginal: true
  }, options);
  // A.ErrorMessage(Custom/ThrowModelError)
  // *ErrorMessage 標籤錯誤訊息 - 直接錯誤訊息格式, 因為 ErrorMessage 標籤內的錯誤訊息本身即為直接錯誤訊息內容因此不處理(無需處理) options.keepOriginal 選項.
  if (!handled)
  {
    tagStart ="&lt;ErrorMessage&gt;";
    tagEnd ="&lt;/ErrorMessage&gt;";
    indexStart = result.indexOf(tagStart);
    indexEnd = (indexStart != -1) ? result.indexOf(tagEnd, indexStart) : -1;
    if (indexStart != -1 && indexEnd != -1)
    {
      handled = true;
      result = result.substring(indexStart + tagStart.length, indexEnd);
    }
  }
  // B.ExceptionMessage(Custom/ajax/WebApi)
  // *ExceptionMessage 標籤錯誤訊息 - WebApi 自訂錯誤訊息格式.
  if (!handled)
  {
    tagStart ="ExceptionMessage:";
    tagEnd ="ExceptionType:";
    indexStart = result.indexOf(tagStart);
    indexEnd = (indexStart != -1) ? result.indexOf(tagEnd, indexStart) : -1;
    if (indexStart != -1 && indexEnd != -1)
    {
      handled = true;
      result = result.substring(indexStart + tagStart.length, indexEnd);
      result = $.trim(stringReplace(result, "<br>", ""));
      // InnerException
      tagStart = "InnerException:";
      tagEnd = "追蹤訊息";
      indexStart = error.indexOf(tagStart, indexStart);
      indexEnd = (indexStart != -1) ? error.indexOf(tagEnd, indexStart) : -1;
      indexEnd = (indexStart != -1 && indexEnd == -1) ? error.indexOf("StackTrace", indexStart) : indexEnd;
      if (indexStart != -1 && indexEnd != -1 && error.indexOf("InnerException: none") == -1)
      {
        result = result + ", " + error.substring(indexStart, indexEnd);
        result = $.trim(stringReplace(result, "<br>", ""));
      }
      //
      if (options.keepOriginal)
        result = result + "\r\n" + error;
    }
  }
  //
  return result;
}

function formatAjaxError(error, isService, options)
{
  // Ajax 執行錯誤格式化
  // .error, Error 物件.
  // .isService(bool), 是否為 Web Service 服務方法.
  // .options(optional), 選項 : 
  // -keepOriginal, 保留原始錯誤訊息內容, 預設值為 true.
  var result = "";
  //
  options = options || {};
  options = $.extend(
  {
    keepOriginal: true
  }, options);
  //
  if (isService)
  {
    // WCF/Web Api 服務錯誤格式化
    result = extractAjaxError(error.responseText, options);
    if (result == undefined || result == "")
      result = "連結服務未啟動等";
  }
  else
  {
    // WebService 錯誤格式化
    result = extractAjaxError(error.responseText, options);
    if (result == undefined || result == "")
      result = "服務方法未正確定義等";
  }
  result = parseOriginalError(result) + " - " + result + ", statusText = '" + error.statusText + "'";
  //
  return result;
}

function checkNumKey(keyCode)
{
  // 是否為數字鍵(0~9)
  // *keyCode, 字元碼(event.keyCode).
  var result = (keyCode >= 48 && keyCode <= 57);
  return result;
}

function getQueryString(keys)
{
  // 傳回組合查詢字串
  // *keys, key/value
  var result = "";
  var value;
  //
  for (var key in keys)
  {
    value = encodeURIComponent(keys[key]);
    if (result != "")
      result = result + "&";
    result = result + key + "=" + value;
  }
  //
  return result;
}

function getMethodObject(name)
{
  var result;
  var arr;
  //
  arr = name.split(".");
  if (name.indexOf(".") == -1)
    result = window[name]; // 獨立函式, ex. method1
  else
    result = window[arr[0]][arr[1]]; // 類別函式, ex. class1.method1
  //
  return result;
}

// 示範 : 
// 
//   使用方式同 redirectToAction() 函式, 唯參數順序為 Url 觀點.
//
function changeLocation(controller, action, routeValues, options)
{
  return redirectToAction(action, controller, routeValues, options)
}

// 示範 :
//
// C#
//
//   ASP.NET MVC - 目的 Action 方法必須標示 [RedirectToAction] : 
//
//   public class HomeController : ...
//   {
//     [RedirectToAction]
//     public ActionResult Action1(...)
//     {
//
// Script 方法 - 使用 redirectToAction() 函式 - hideParameters = true : 
//
//   function Method1(...)
//   {
//     var routeValues;
//     //
//     routeValues = { param1: ..., param2: ... };
//     redirectToAction("Action1", "Controller1", routeValues, true);
//   }
//
function redirectToAction(action, controller, routeValues, options)
{
  // 轉址 Controller/Action
  // .controller, Controller 名稱
  // .action, Action 名稱
  // .routeValues, 轉址參數, 支援字串及鍵值結構({...})
  // .options(optional)/hideParameters(bool, optional), 選項, 若選項直接為 true/false 表示轉址是否使用參數隱藏模式(hideParameters, 預設值為 false). 兩參數定義共存為原函式參數定義相容使用.
  // -target(string, optional), 開啟目的類型, 同 Window.open() 函式定義, 預設值為 "目前視窗(_self)". 目前僅區分新視窗開啟及目前視窗開啟.
  // -url(string, optional), 自訂完整網址, 開啟時將直接使用此網址而忽略 action, controller, routeValues 等參數.
  // -hideParameters(bool, optional), 是否使用參數隱藏模式, 預設值為 false.
  // Window.open()
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/open
  // *執行格式仿照 System.Web.Mvc.Controller.RedirectToAction() 方法.
  var url, queryString;
  var sBaseAddress;
  var hideParameters;
  //
  hideParameters = (options == true || options == false) ? options : false; // 是否使用參數隱藏模式
  options = (options == true || options == false) ? { property1: false } : options || {}; // 重置選項物件(property1 僅為識別使用無其他作用)
  options = $.extend(
  {
    target: "",
    url: "",
    hideParameters: hideParameters
  }, options);
  //
  sBaseAddress = $(".SystemBaseAddressHidden").val(); // 目前應用程式基礎位址(如 http://localhost:0000/, http://localhost/app1/ 等)
  hideParameters = options.hideParameters; // 是否使用參數隱藏模式, 使用選項, 否則將判斷不正確
  if (isEmpty(sBaseAddress))
  {
    var baseAddressError = "Error: BaseAddress unknown(acton: '" + action + "', controller: '" + controller + "').";
    alert(baseAddressError);
    throw new Error(baseAddressError);
  }
  // 轉址使用參數隱藏模式, Url 使用原始參數值, 與一般模式轉址不同為參數隱藏轉址將執行再轉址因此使用者無法得知原參數值
  if (options.hideParameters)
  {
    queryString = "ToController=" + controller + "&ToAction=" + action + "&RouteValues=" + encodeURIComponent(JSON.stringify(routeValues)); // Url 註記轉址 Controller/Action, ex. Controller=...&Action=...&...
    url = (!isEmpty(options.url)) ? options.url : sBaseAddress + "Redirect/Index?" + queryString;
    if (!isEmpty(options.target))
      window.open(url, options.target);
    else
      window.location.href = url; // 開啟網址
    return;
  }
  // 轉址使用一般模式, Url 將顯示原始參數值
  queryString = (typeof routeValues === "string") ? routeValues : getQueryString(routeValues); // 若查詢字串為字串型態則直接使用 custom.utils
  url = (!isEmpty(options.url)) ? options.url : sBaseAddress + controller + "/" + action + "?" + queryString;
  if (!isEmpty(options.target))
    window.open(url, options.target);
  else
    window.location.href = url; // 開啟網址
}

function runAction(controller, action, query)
{
  // *Layout 內部使用, 一般應用程式請不使用, 請改用 redirectToAction() 函式.
  // 執行 Controller/Action
  // .controller, Controller 名稱
  // .action, Action 名稱
  // .query, 查詢字串, 支援字串及鍵值結構({...})
  var queryString;
  var href;
  //
  queryString = (typeof query === "string") ? query : getQueryString(query); // 若查詢字串為字串型態則直接使用 custom.utils
  href = SystemData.getBaseAddress() + controller + "/" + action + "?" + queryString;
  window.location.href = href; // 開啟網址
}

/* end */