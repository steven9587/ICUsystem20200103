/*
  custom.bootstrap.js?date=20171025-1600

    Custom bootstrap relative method.
   
    depends : jquery-ui.css (for dialog, etc)
              custom.utils.js
              custom.jquery.utils.js
              custom.widget.css
*/

var Bootstraps = function()
{
  this._member = null;
};

$.extend(Bootstraps.prototype,
{
  prompt: function(form, errors)
  {
    // 提示驗證結果
    // .form, 表單元素或 id.
    // .errors(optional), 驗證錯誤的元素, 若未傳入將由函式自行取得.
    // *此函式為表單驗證後使用, 若判斷驗證錯誤存在則將提示, 否則將無提示.
    // 傳回值 : 無.
    var errors, error;
    var title, message;
    var isValid;
    //
    form = (typeof form === "string") ? $("#" + form) : form;
    errors = (errors) ? errors : $(form).find(".has-error"); // 取得驗證內容(使用尋找類別樣式方式, , 因為驗證無提供直接方法), 如 ＜div class="form-group has-error ..."＞ ... ＜／div＞ 等
    title = $(form).attr("data-title"); // 資料標題
    isValid = (errors.length <= 0);
    //
    if (!isValid)
    {
      message = "請輸入必要資料項目.";
      error = $(errors[0]).children(".control-label"); // 第一個驗證錯誤的輸入元素的文字標籤(若存在)
      if (error.length > 0)
        message = "請輸入 '" + $(error).text() + "' 等必要資料.";
      if (!isEmpty(title))
        message = title + " : \r\n" + message;
      //
      alert(message);
    }
  },

  //
  // 示範 : 
  //
  //   對話視窗輸入驗證.
  //
  //   Html
  //
  //     <div id="SurveyForm" data-title="..." data-toggle="validator" role="form">
  //
  //     </div>
  //
  //   Javascript
  //
  //     SurveyForm_DialogOK: function()
  //     {
  //       var data;
  //       //
  //       if (!Bootstraps.validate($("#SurveyForm")))
  //         return;
  //       //
  //       data = { ... };
  //       //
  //       Dialogs.ok(data);
  //     },
  //
  validate: function(form, options)
  {
    // 表單驗證
    // .form, 表單元素或 id.
    // .options, 表單驗證選項.
    // -prompt(bool, optional), 是否提示驗證結果存在錯誤. 預設值為 true.
    // -update(bool, optional), 是否更新表單驗證, 若文件載入後動態加入元素則必須為 true. 預設值為 true. 
    // *表單驗證執行完整性必要條件, 包括 form 的 data-toggle="validator", label 的 class="control-label",
    //  input 的 class="form-control" required = "" 等, 詳細請參考 Bootstrap Validator ＞ Examples.
    // *validator() 將自動 focus 至第一個驗證錯誤的輸入元素.
    // *表單驗證必要條件 : 
    // -使用表單元素(如 div, form).
    // -輸入元素必須直屬於 form-group 之下(即 input 必須為 form-group 的第一層子元素), 否則該輸入元素將不被驗證.
    // -輸入元素需使用 class="form-control" 否則輸入提示將無提供輸入元素變色處理.
    // -標題元素需使用 class="control-label" 否則輸入提示將不含資料名稱.
    // -其他說明請參閱 "Bootstrap Validator ＞ Methods" 一節.
    // *注意 : 傳入表單元素必須為 jquery 格式(length > 0, 因為使用 isValidObject() 函式檢核), 否則將出現提示 "找不到符合表單元素(id = '...')".
    // bootstrap-validator
    // https://github.com/1000hz/bootstrap-validator
    // Bootstrap Validator ＞ Methods
    // http://1000hz.github.io/bootstrap-validator/#validator-methods
    // 傳回值 : 若傳回 true 表示驗證正確, 否則為 false (驗證結果存在錯誤).
    var result = false;
    var errors, error;
    var formId, message;
    var isValid;
    //
    formId = form;
    form = (typeof form === "string") ? $("#" + form) : form;
    if (!isValidObject(form))
    {
      alert("Bootstraps.validate: 找不到符合表單元素(id = '" + formId + "'), 若您看到此訊息表示您的實作不正確, 請檢查表單元素取得及傳入方式是否正確(參考表單驗證函式說明).");
      return result;
    }
    options = options || {};
    options = $.extend(
    {
      prompt: true,
      update: true
    }, options);
    //
    if (options.update)
      $(form).validator("update"); // 更新表單驗證(若文件載入後動態加入元素必要使用)
    $(form).validator("validate"); // 執行驗證
    errors = $(form).find(".has-error"); // 取得驗證內容(使用尋找類別樣式方式, , 因為驗證無提供直接方法), 如 ＜div class="form-group has-error ..."＞ ... ＜／div＞ 等
    isValid = (errors.length <= 0);
    result = isValid;
    // 顯示必要輸入提示(僅提示第一個輸入其他將以必要輸入色彩提示)
    if (!isValid && options.prompt)
    {
      for (var I = 0; I < $(form).length; I++)
      {
        var loopForm = $(form[I]);
        //
        errors = $(loopForm).find(".has-error"); // 取得各表單驗證內容(說明同上)
        if (errors.length <= 0) // 忽略無錯誤表單
          continue;
        //
        Bootstraps.prompt(loopForm, errors);
        break;
      }
    }
    //
    return result;
  },

  method1: function()
  {
  }
});

$(function()
{
  // Initialize instance
  Bootstraps = new Bootstraps();
});

/* end */
