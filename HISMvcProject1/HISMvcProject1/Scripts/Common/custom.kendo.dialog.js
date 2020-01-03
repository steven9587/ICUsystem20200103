/*
  custom.kendo.dialog.js?date=20180704-1600

    Custom dialog-relative method.
   
    depends : jquery-ui.css (for dialog, etc)
              custom.utils.js
              custom.jquery.utils.js
              custom.widget.css

    *此檔案為 Dialog Layout 內部引用, 非 Base Layout 或作業 Layout 直接引用.
*/

var Dialogs = function ()
{
  this._member = null; // member
  this._test = false; // true; // 
};

$.extend(Dialogs.prototype,
{
  alertTest: function (text)
  {
    // *內部使用函式.
    // 測試用 alert
    // .text, 提示文字.
    // *測試模式停用時修改 _test 類別屬性.
    // *非測試模式提示請直接使用原始 alert 函式.
    if (!Dialogs._test)
      return;
    //
    alert("(Testing) : " + text);
  },

  confirmTest: function (text, value)
  {
    // *內部使用函式.
    // 測試用 confirm
    // .text, 確認對話文字.
    // .value, 確認對話的預設值.
    // *測試模式停用時修改 _test 類別屬性.
    // *非測試模式提示請直接使用原始 confirm 函式.
    if (!Dialogs._test)
      return value;
    //
    return confirm("(Testing) : " + text);
  },

  checkCrossDomain: function ()
  {
    // *內部使用函式.
    var result = true;
    //
    try
    {
      // 測試 cross-domain 合法性(藉由存取 window.parent 的 document 等)
      // *Chrome 限制 cross-domain 使用 window.postMessage() 方法但雙方仍必須為相同 domain 才可正確使用 window.parent 否則將引發例外 : 
      //  - Uncaught DOMException: Blocked a frame with origin "http://source-site" from accessing a cross-origin frame.
      // *Same-origin policy
      //  https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
      if (window.parent.document.location)
      {
        // 
      }
    }
    catch (err)
    {
      result = false;
      //
      alert("Access window.parent.document error - " + err + "."); // 若 cross-domain 存取錯誤顯示錯誤提示
    }
    //
    return result;
  },

  getFrameUid: function(frame)
  {
    // 傳回對話視窗 frame 唯一代號(Uid)
    // .frame, 對話視窗 frame 元素, 如 window.frameElement 屬性等取得, 若為 null 表示目前對話視窗非使用 frame 開啟.
    // Window.frameElement
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/frameElement
    // *對話視窗 frame 唯一代號(Uid)為使用 Windows.openFrame()/openWindow() 函式開啟作業畫面時內建填入.
    // *請參閱 Windows.openFrame()/openWindow() 函式保持相關實作一致性.
    // 傳回值 : 對話視窗 Frame 唯一代號(Uid), 若為空值表示目前對話視窗非使用 frame 開啟.
    var result = (!isEmpty(frame)) ? $(frame).attr("frame-uid") : "";
    return result;
  },

  initEventHandlers: function ()
  {
    // *內部使用函式.
    // 初始事件
    // generic, 對話視窗按鈕通用事件.
    // *dialog-button-generic 為對話視窗按鈕的通用樣式類別.
    // *onevent 為對話視窗按鈕的 click 事件的事件處理函式名稱.
    $(".dialog-button-generic").on("click", function (e)
    {
      var method;
      var name;
      //
      name = $(this).attr("onevent"); // 事件處理函式名稱, ex. method1, clas1.method1.
      if (!(name)) // 防呆
        return;
      //
      method = getMethodObject(name); // custom.utils
      method();
    });
    // ok
    $(".dialog-button-ok").on("click", function (e)
    {
      // *注意 : 因為事件處理函式中 parent 表示事件來源物件的 parent 而非 window 的 parent, 
      //         因此必須明確標示 window.parent, 使程式碼可正確執行於任一事件處理函式, 其他依此類推(ex. this).
      // window.postMessage()
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
      var okButton = this;
      var message;
      //

      Dialogs.alertTest("dialog ok clicked a.");

      if (!Dialogs.checkCrossDomain()) // 確認 cross-domain
        return;
      //
      message = { result: "ok", frameUid: Dialogs.getFrameUid(window.frameElement), value: Dialogs.getDialogValue(okButton) };

      Dialogs.alertTest("dialog ok clicked b value='" + message.value + "', window.parent.document.location=" + window.parent.document.location);

      // 不使用可移除完整判斷程式碼
      if (Dialogs._test)
      {
        if (Dialogs.confirmTest("test return A - * ?", false))
          window.parent.postMessage({ dialog: message }, "*"); // message, origin
      }

      if (Dialogs.confirmTest("test return B - " + window.parent.document.location + " ?", true))
        window.parent.postMessage({ dialog: message }, window.parent.document.location); // message, origin

      Dialogs.alertTest("dialog ok clicked c end.");

    });
    // cancel
    $(".dialog-button-cancel").on("click", function (e)
    {
      // *注意 : 因為事件處理函式中 parent 表示事件來源物件的 parent 而非 window 的 parent, 
      //         因此必須明確標示 window.parent, 使程式碼可正確執行於任一事件處理函式, 其他依此類推(ex. this).
      var message;
      //
      if (!Dialogs.checkCrossDomain()) // 確認 cross-domain
        return;
      //
      message = { result: "cancel", frameUid: Dialogs.getFrameUid(window.frameElement), value: "" };

      // 不使用可移除完整判斷程式碼
      if (Dialogs._test)
      {
        if (Dialogs.confirmTest("test return A - * ?", false))
          window.parent.postMessage({ dialog: message }, "*"); // message, origin
      }

      if (Dialogs.confirmTest("Cancel return B - " + window.parent.document.location + " ?"), true)
        window.parent.postMessage({ dialog: message }, window.parent.document.location); // message, origin
    });
  },

  addEventListener_Message: function ()
  {
    // *內部使用函式.
    // addEventListener 提示(元素 class 定義於對話視窗 Layout)
    $(".dialog-warning-listener-init").hide();
    //
    if (window.addEventListener)
    {
      $(".dialog-warning-listener-none").hide();
      //
      window.addEventListener("message", function (e)
      {

        try
        {
          Dialogs.alertTest("dialog: selected - result='" + e.data["dialog"].result + "', value=（" + e.data["dialog"].value + "）");
        }
        catch (err)
        {
        }

      });
    }
  },

  getDialogValue: function (sender)
  {
    // .sender, 作用元素, 讀取傳回值使用.
    // *傳回值型態為 JSON 結構, 若來源值為字串則傳回預設 JSON 結構 - { value: ... }, 呼叫端取值格式即為 data.value.
    var result;
    //
    result = $(sender).attr("dialog-value");
    try
     {
      result = JSON.parse(result);
      if (typeof result === "string")
        result = { value: result };
    }
    catch (err)
    {
      // Ignore error - Keep original value.
    }
    //
    return result;
  },

  setDialogValue: function (sender, value)
  {
    // .sender, 作用元素, 暫存傳回值使用.
    // .value, 傳回值.
    $(sender).attr("dialog-value", JSON.stringify(value));
  },

  ok: function (value1, value2, options)
  {
    // 按下 OK 按鈕
    // .value1, 代碼, 若為 JSON 結構表示為自訂回覆值.
    // .value2, 數值, 若空值且 value1 為 JSON 結構表示此參數不使用.
    // .options, 回覆選項, 目前保留未使用.
    // *對話視窗按鈕 click 事件實作請參考初始事件函式(Dialogs.initEventHandlers).
    // *此函式為對話視窗端自行觸發執行.
    var button = $(".dialog-button-ok");
    var data;
    //
    data = value1;
    if (value1 != undefined && value2 != undefined) // 是否為 code/name 傳回值組合(兩參數皆不為空值)
      data = { code: value1, name: value2 };
    Dialogs.setDialogValue(button, data);
    $(button).click();
  },

  cancel: function ()
  {
    // 按下 Cancel 按鈕
    // *對話視窗按鈕 click 事件實作請參考初始事件函式(Dialogs.initEventHandlers).
    // *此函式為對話視窗端自行觸發執行.
    var button = $(".dialog-button-cancel");
    //
    $(button).click();
  }
});

$(function ()
{
  // initialize
  Dialogs = new Dialogs();
  Dialogs.initEventHandlers();
  Dialogs.addEventListener_Message();

  Dialogs.alertTest("dialog init document.domain before = " + document.domain);
  if (Windows.iisExpress())
  {
    Dialogs.alertTest("dialog iisExpress mode - set page domain to 'localhost'."); //iff (Windows.confirmTest("set page domain to 'localhost' ?", false))
    document.domain = "localhost";
  }
  Dialogs.alertTest("dialog baseaddress='" + $(".SystemBaseAddressHidden").val() + "'");
  Dialogs.alertTest("dialog init document.domain after = " + document.domain);

  window.addEventListener("load", function (e)
  {
    // load
    $(".dialog-loading").hide();

    Dialogs.alertTest("dialog load - document.domain = " + document.domain);

  }, false);

});

$(document).ready(function ()
{
  // ready
});
