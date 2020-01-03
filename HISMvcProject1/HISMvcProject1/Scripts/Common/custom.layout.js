/*
  custom.layout.js?date=20170820-1000

    layout-specific scripts.
*/

// his validation class
var hisValidation = function()
{
  this._member = null; // member
};

$.extend(hisValidation.prototype,
{
  getValRequiredMessage: function(input)
  {
    // 傳回必要提示字串
    // .input, Html.EditorFor 轉換輸入元素.
    var result;
    //
    result = $(input).attr("data-val-required"); // [Required] 預設提示屬性
    if (isEmpty(result)) // 防呆
      result = $(input).attr("id") + "必須輸入.";
    //
    return result;
  },

  oldPrimaryKeys: function()
  {
    // 取得主要鍵值(原值)
    var result = {};
    var column, alias;
    var querys;
    //
    querys = $(".key-primary");
    for (var I = 0; I < querys.length; I++)
    {
      alias = $(querys[I]).attr("data-alias"); // Action 參數名稱(參數別名), 自訂屬性
      column = $(querys[I]).attr("data-valmsg-for"); // ex. Column1
      column = (!isEmpty(alias)) ? alias : column;
      oldValue = $(querys[I]).attr("old-value"); // 主要鍵值原值
      if (isEmpty(oldValue)) // 防呆(空值使用空白)
        oldValue = "";
      result[column] = oldValue;
    }
    //
    return result;
  },

  showValidationError: function(input, columnName, message)
  {
    // 顯示欄位驗證錯誤
    // .input, Html.EditorFor 轉換輸入元素.
    // .columnName, 欄位名稱
    // .message, 欄位錯誤提示.
    // *此方法對應 Html.ValidationMessageFor 驗證功能.
    var validation;
    //
    try
    {
      validation = $("[data-valmsg-for='" + columnName + "']"); // ex. data-valmsg-for="Column1"
      $(input).addClass("input-validation-error"); // 輸入元素驗證樣式 - error
      $(validation).addClass("field-validation-error"); // 轉換驗證樣式 valid -> error
      $(validation).removeClass("field-validation-valid");
      $(validation).text(message);
    }
    catch (err)
    {
      // Ignore
    }
  },

  showValidationSummary: function(message)
  {
    // 顯示驗證彙總錯誤
    // .message, 彙總錯誤提示.
    // *此方法對應 Html.ValidationSummary 驗證功能.
    var summary;
    var html;
    //
    try
    {
      html = "<ul><li>" + message + "</li></ul>";
      //
      summary = $(".validation-summary-valid"); // 驗證彙總元素(依前次驗證狀態可能為 valid 或 errors)
      if ($(summary).length <= 0) // 若找不到驗證彙總元素表示前次驗證錯誤
        summary = $(".validation-summary-errors");
      $(summary).addClass("validation-summary-errors"); // 轉換驗證樣式 valid -> errors
      $(summary).removeClass("validation-summary-valid");
      $(summary).html(html);
    }
    catch (err)
    {
      // Ignore
    }
  },

  showQueryDialogSample: function(keys, callback, options)
  {
    // 顯示查詢對話盒
    // .program, 程式代碼
    // .keys, 使用者輸入查詢鍵值
    // .callback, Callback 函數(記錄主要鍵值)
    // .options, 選項內容
    //  -program, 啟始程式代嗎
    // *傳回查詢記錄的主要鍵值.
    var result = { diaCode: "", chinName: "" };
    //
    result.diaCode = parseValue(keys, "DiaCode");
    result.chinName = parseValue(keys, "chinName");
    if (true)
      callback(result);
    //
    return result;
  },

  validateKey: function(selector, required)
  {
    // 驗證查詢條件
    // .selector, 查詢條件元素 Selector
    // .required, 若為 true 表示為必要條件驗證(所有條件有值表示合法), 否則為 false 表示為多條件驗證(任一條件有值表示合法).
    // *尋找欄位的驗證元素後設定驗證提示的樣式及文字(若驗證不合法).
    // *此方法對應 Visual Studio MVC 5 Controller 範本的 Html.ValidationSummary, Html.ValidationMessageFor 驗證功能.
    // *注意 : 傳回的 Url 參數的組成必須忽略空值, 因為 Url 參數將覆蓋 View 的 Model 的同名欄位值(即使 Action 傳回 View(model) 的該欄位存在有效值).
    //         ex. http://.../controller/action?code=xxx&name= (View 的 Model 欄位 name 將顯示空值)
    var result;
    var querys = $(selector);
    var input;
    var items = new Array();
    var item;
    var column, error, errors = "";
    var count = querys.length;
    //
    result = { legal: true, query: "", keys: {}, count: count }; // 初始傳回值(是否驗證合法/Url 參數/條件個數)
    for (var I = 0; I < querys.length; I++)
    {
      column = $(querys[I]).attr("data-valmsg-for"); // ex. Column1
      input = $("#" + column);
      value = $(input).val();
      if (isEmpty(value))
      {
        value = ""; // 防呆(undefined), 空值皆使用空白(for Url)
        error = this.getValRequiredMessage(input);
        items.push({ input: input, column: column, error: error });
        count = count - 1; // 扣點
        continue;
      }
      //
      result.keys[column] = value; // 加入查詢鍵值
      if (result.query != "")
        result.query = result.query + "&";
      result.query = result.query + column + "=" + value; // Url 參數組成
    }
    // 驗證必要條件, 若扣點表示必要條件遺漏
    if (required && count != querys.length)
    {
      result.legal = false;
      for (var index in items)
        errors = errors + items[index].error + "<br/>";
      this.showValidationSummary(errors);
    }
    // 驗證任一條件, 若完全扣點表示全部條件遺漏
    if (!required && count <= 0)
    {
      result.legal = false;
      this.showValidationSummary("請輸入查詢條件(至少一個).");
    }
    // 顯示驗證提示(若驗證不合法)
    if (!result.legal)
    {
      for (var index in items)
      {
        input = items[index].input;
        column = items[index].column;
        error = items[index].error;
        this.showValidationError(input, column, error);
        if (index == 0)
          $(input).focus();
      }
    }
    //
    return result;
  },

  validateKeyRequired: function()
  {
    // 必要條件驗證(主要鍵值使用)
    var result = hisValidation.validateKey(".key-query-required", true);
    return result;
  }
});

// his layout class - Layout
var hisLayout = function()
{
  this._member = null; // member
};

$.extend(hisLayout.prototype,
{
  deleteForm: function(e)
  {
    // 刪除 Form
    // .e, 按鈕 Click 事件參數, 目前保留使用.
    var DeleteButton;
    //
    DeleteButton = $("button[ondelete]"); // 異動按鈕
    if (isValidObject(DeleteButton))
      $(DeleteButton).click();
  },

  saveForm: function(e)
  {
    // 儲存 Form
    // .e, 按鈕 Click 事件參數, 目前保留使用.
    var InsertButton, SaveButton;
    //
    InsertButton = $("button[oncreate]"); // 異動按鈕, 新增/儲存按鈕互斥(同時僅存在其一按鈕)
    SaveButton = $("button[onsave]");
    if (isValidObject(InsertButton))
      $(InsertButton).click();
    else
      $(SaveButton).click();
  }
});

// his layout class - HISGridDataLayout
var hisGridDataLayout = function()
{
  this._member = null; // member
};

$.extend(hisGridDataLayout.prototype,
{
  execChangeCallback: function(controller, action, data, e)
  {
    // 異動 callback
    // *此函式為新增, 刪除, 儲存等共用.
    var input;
    //
    input = $("input[type='submit'][formaction='" + action + "']"); // ex. ＜input type="submit" formaction="..." ... ／＞
    $(input).click();
  },

  execChangeDialog: function(onchangedialog, callback, keys, controller, options, e)
  {
    // ** 內部使用 **
    // 執行異動對話盒
    // .onchangedialog, 異動對話盒函式(函式字串表示式), 支援獨立函式(如 function1)或類別函式(如 class1.function1).
    // .callback, 儲存 Callback, 確定儲存時呼叫執行.
    // .keys, 異動鍵值.
    // *此函式為新增, 刪除, 儲存等共用.
    var arr;
    var changedialog;
    //
    arr = onchangedialog.split(".");
    if (onchangedialog.indexOf(".") == -1)
      changedialog = window[onchangedialog]; // 獨立函式
    else
      changedialog = window[arr[0]][arr[1]]; // 類別函式
    changedialog(keys, callback, options);
    //
    return true;
  },

  execCancel: function(controller, options, e)
  {
    // 取消
    // *取消 = 重新查詢(主要鍵值原值).
    var keys;
    //
    keys = hisValidation.oldPrimaryKeys();
    hisQueryDataLayout.execQueryCallback(controller, keys, e);
    //
    return true;
  },

  execClear: function(controller, options, e)
  {
    // 清除
    runAction(controller, "Index", ""); // 參數空白, ex. /controller1/Index
    //
    return true;
  },

  execQuery: function(controller, options, e)
  {
    // 查詢
    // 驗證類型樣式 :
    // －任一條件 key-query key-query-1
    // －必要條件 key-query-required key-query-1
    // *開啟網址必須為 /controller/action 格式(即明確包含 Action 名稱), 否則將導致接續 View 網頁的 submit formaction="xxxxx" 執行將發生例外 - 'http://localhost/xxxxx 找不到資源。'.
    //  如 http://localhost:nnnnn/Controller1?... -> submit action="xxxxx" -> http://localhost:nnnnn/xxxxx (Controller 名稱遺失)
    // *驗證類型樣式因為 input 受 /Views/Shared/EditorTemplates 影響導致 class 覆蓋而遺失因此改套用驗證類型樣式至 Html.ValidationMessageFor 元件.
    //  ex. Html.ValidationMessageFor(model => model.Column1, "", new { ＠class = "text-danger key-query-required key-query-1" })
    //      -> ＜span class=＂field-validation-error text-danger key-query-required key-query-1＂ data-valmsg-for=＂Column1＂ data-valmsg-replace=＂true＂＞... 欄位是必要項。＜／span＞
    // *若傳回 true 表示確定查詢, 否則傳回 false 表示中止查詢(如查詢條件不足).
    var validate;
    //
    validate = hisValidation.validateKey(".key-query-required", true); // 必要條件驗證
    if (validate.legal && validate.count <= 0) // 任一條件驗證(若無必要條件)
      validate = hisValidation.validateKey(".key-query", false);
    if (!validate.legal) // 中止查詢(驗證不合法)
      return false;
    //
    var callback = function(keys)
    {
      hisQueryDataLayout.execQueryCallback(controller, keys, e); // Callback, this ＝ Window object.
    };
    var onquerydialog = $(e.sender.element).attr("onquery"); // 對話盒函式名稱(按鈕自訂事件屬性)
    if (isEmpty(onquerydialog))
      callback(validate.keys); // 直接執行(若無對話盒)
    else
      hisQueryDataLayout.execQueryDialog(onquerydialog, callback, validate.keys, controller, options, e); // 執行查詢對話盒
    //
    return true;
  },

  execSave: function(controller, options, e)
  {
    // 儲存
    // *若傳回 true 表示確定儲存, 否則傳回 false 表示中止儲存(如驗證不合法).
    var keys = {};
    var callback = function(data)
    {
      hisGridDataLayout.execChangeCallback(controller, options.action, data, e); // Callback, this ＝ Window object.
    };
    var onchange = $(e.sender.element).attr("onsave"); // 對話盒函式名稱(按鈕自訂事件屬性)
    if (isEmpty(onchange))
      callback(keys); // 直接執行(若無對話盒)
    else
      hisGridDataLayout.execChangeDialog(onchange, callback, keys, controller, options, e); // 執行對話盒
    //
    return true;
  }
});

// his layout class - HISQueryDataLayout
var hisQueryDataLayout = function()
{
  this._member = null; // member
};

$.extend(hisQueryDataLayout.prototype,
{
  execQueryCallback: function(controller, keys, e)
  {
    // 查詢 callback
    // *作業若查詢符合記錄存在多筆則開啟子視窗選擇記錄後執行記錄查詢程序.
    runAction(controller, "Index", keys); // custom.utils
  },

  execQueryDialog: function(onquerydialog, callback, keys, controller, options, e)
  {
    // ** 內部使用 **
    // 執行查詢對話盒
    // .onquerydialog, 查詢對話盒函式(函式字串表示式), 支援獨立函式(如 function1)或類別函式(如 class1.function1).
    // .callback, 查詢 Callback, 確定查詢時呼叫執行.
    // .keys, 查詢鍵值.
    var arr;
    var querydialog;
    //
    arr = onquerydialog.split(".");
    if (onquerydialog.indexOf(".") == -1)
      querydialog = window[onquerydialog]; // 獨立函式
    else
      querydialog = window[arr[0]][arr[1]]; // 類別函式
    querydialog(keys, callback, options);
    //
    return true;
  },

  execClear: function(controller, options, e)
  {
    // 清除
    runAction(controller, "Index", ""); // 參數空白, ex. /controller1/Index
    //
    return true;
  },

  execQuery: function(controller, options, e)
  {
    // 查詢
    var validate;
    //
    validate = hisValidation.validateKey(".key-query-required", true); // 必要條件驗證
    if (validate.legal && validate.count <= 0) // 任一條件驗證(若無必要條件)
      validate = hisValidation.validateKey(".key-query", false);
    if (!validate.legal) // 中止查詢(驗證不合法)
      return false;
    //
    var callback = function(keys)
    {
      hisQueryDataLayout.execQueryCallback(controller, keys, e); // Callback, this ＝ Window object.
    };
    onquerydialog = $(e.sender.element).attr("onquery"); // 對話盒函式名稱(按鈕自訂事件屬性)
    if (isEmpty(onquerydialog))
      callback(validate.keys); // 直接執行(若無對話盒)
    else
      hisQueryDataLayout.execQueryDialog(onquerydialog, callback, validate.keys, controller, options, e); // 執行查詢對話盒
    //
    return true;
  }
});

// his layout class - HISRowDataLayout
var hisRowDataLayout = function()
{
  this._member = null; // member
};

$.extend(hisRowDataLayout.prototype,
{
  execChangeCallback: function(controller, action, data, e)
  {
    // 異動 callback
    // *此函式為新增, 刪除, 儲存等共用.
    var input;
    //
    input = $("input[type='submit'][formaction='" + action + "']"); // ex. ＜input type="submit" formaction="..." ... ／＞
    $(input).click();
  },

  execChangeDialog: function(onchangedialog, callback, keys, controller, options, e)
  {
    // ** 內部使用 **
    // 執行異動對話盒
    // .onchangedialog, 異動對話盒函式(函式字串表示式), 支援獨立函式(如 function1)或類別函式(如 class1.function1).
    // .callback, 儲存 Callback, 確定儲存時呼叫執行.
    // .keys, 異動鍵值.
    // *此函式為新增, 刪除, 儲存等共用.
    var arr;
    var changedialog;
    //
    arr = onchangedialog.split(".");
    if (onchangedialog.indexOf(".") == -1)
      changedialog = window[onchangedialog]; // 獨立函式
    else
      changedialog = window[arr[0]][arr[1]]; // 類別函式
    changedialog(keys, callback, options);
    //
    return true;
  },

  execCancel: function(controller, options, e)
  {
    // 取消
    // *取消 = 重新查詢(主要鍵值原值).
    var keys;
    //
    keys = hisValidation.oldPrimaryKeys();
    hisQueryDataLayout.execQueryCallback(controller, keys, e);
    //
    return true;
  },

  execClear: function(controller, options, e)
  {
    // 清除
    runAction(controller, "Index", ""); // 參數空白, ex. /controller1/Index
    //
    return true;
  },

  execCreate: function(controller, options, e)
  {
    // 新增
    // *若傳回 true 表示確定, 否則傳回 false 表示中止(如驗證不合法).
    var keys = {};
    var callback = function(data)
    {
      hisRowDataLayout.execChangeCallback(controller, options.action, data, e); // Callback, this ＝ Window object.
    };
    var onchange = $(e.sender.element).attr("oncreate"); // 對話盒函式名稱(按鈕自訂事件屬性)
    if (isEmpty(onchange))
      callback(keys); // 直接執行(若無對話盒)
    else
      hisRowDataLayout.execChangeDialog(onchange, callback, keys, controller, options, e); // 執行對話盒
    //
    return true;
  },

  execDelete: function(controller, options, e)
  {
    // 刪除
    // *若傳回 true 表示確定, 否則傳回 false 表示中止(如驗證不合法).
    var keys = {};
    //
    keys = hisValidation.oldPrimaryKeys();
    var callback = function(data)
    {
      hisRowDataLayout.execChangeCallback(controller, options.action, data, e); // Callback, this ＝ Window object.
    };
    var onchange = $(e.sender.element).attr("ondelete"); // 對話盒函式名稱(按鈕自訂事件屬性)
    if (isEmpty(onchange))
      callback(keys); // 直接執行(若無對話盒)
    else
      hisRowDataLayout.execChangeDialog(onchange, callback, keys, controller, options, e); // 執行對話盒
    //
    return true;
  },

  execQuery: function(controller, options, e)
  {
    // 查詢
    // 驗證類型樣式 :
    // －任一條件 key-query key-query-1
    // －必要條件 key-query-required key-query-1
    // *開啟網址必須為 /controller/action 格式(即明確包含 Action 名稱), 否則將導致接續 View 網頁的 submit formaction="xxxxx" 執行將發生例外 - 'http://localhost/xxxxx 找不到資源。'.
    //  如 http://localhost:nnnnn/Controller1?... -> submit action="xxxxx" -> http://localhost:nnnnn/xxxxx (Controller 名稱遺失)
    // *驗證類型樣式因為 input 受 /Views/Shared/EditorTemplates 影響導致 class 覆蓋而遺失因此改套用驗證類型樣式至 Html.ValidationMessageFor 元件.
    //  ex. Html.ValidationMessageFor(model => model.Column1, "", new { ＠class = "text-danger key-query-required key-query-1" })
    //      -> ＜span class=＂field-validation-error text-danger key-query-required key-query-1＂ data-valmsg-for=＂Column1＂ data-valmsg-replace=＂true＂＞... 欄位是必要項。＜／span＞
    // *若傳回 true 表示確定查詢, 否則傳回 false 表示中止查詢(如查詢條件不足).
    var validate;
    //
    validate = hisValidation.validateKey(".key-query-required", true); // 必要條件驗證
    if (validate.legal && validate.count <= 0) // 任一條件驗證(若無必要條件)
      validate = hisValidation.validateKey(".key-query", false);
    if (!validate.legal) // 中止查詢(驗證不合法)
      return false;
    //
    var callback = function(keys)
    {
      hisQueryDataLayout.execQueryCallback(controller, keys, e); // Callback, this ＝ Window object.
    };
    var onquerydialog = $(e.sender.element).attr("onquery"); // 對話盒函式名稱(按鈕自訂事件屬性)
    if (isEmpty(onquerydialog))
      callback(validate.keys); // 直接執行(若無對話盒)
    else
      hisQueryDataLayout.execQueryDialog(onquerydialog, callback, validate.keys, controller, options, e); // 執行查詢對話盒
    //
    return true;
  },

  execSave: function(controller, options, e)
  {
    // 儲存
    // *若傳回 true 表示確定儲存, 否則傳回 false 表示中止儲存(如驗證不合法).
    var keys = {};
    var callback = function(data)
    {
      hisRowDataLayout.execChangeCallback(controller, options.action, data, e); // Callback, this ＝ Window object.
    };
    var onchange = $(e.sender.element).attr("onsave"); // 對話盒函式名稱(按鈕自訂事件屬性)
    if (isEmpty(onchange))
      callback(keys); // 直接執行(若無對話盒)
    else
      hisRowDataLayout.execChangeDialog(onchange, callback, keys, controller, options, e); // 執行對話盒
    //
    return true;
  }
});

$(function()
{
  // Initialize his layout instance
  hisValidation = new hisValidation();
  hisLayout = new hisLayout();
  hisGridDataLayout = new hisGridDataLayout();
  hisQueryDataLayout = new hisQueryDataLayout();
  hisRowDataLayout = new hisRowDataLayout();
});
