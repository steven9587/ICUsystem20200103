/*
  custom.kendo.window.js?date=20180724-1500

    Custom kendo-window relative method.
   
    depends : jquery-ui.css (for dialog, etc)
              custom.utils.js
              custom.jquery.utils.js
              custom.widget.css
*/

var Windows = function()
{
  this._member = null; // member
  this._test = false; // true; // 
  this._windows = {}; // Window 暫存項目, 內部存取時使用 Ｗｉｎｄｏｗｓ._windows 方式, 不使用 ｔｈｉｓ 方式.
  this._frames = {}; // Frame 暫存項目, 內部存取時使用 Ｗｉｎｄｏｗｓ._frames 方式, 不使用 ｔｈｉｓ 方式.
  //
  this.frameDialog = undefined; // 對話視窗處理函式(由系統指定通用函式) - func(frame, data).
  this.sendOpenDialog = undefined; // 傳送開啟對話視窗(由系統指定通用函式) - func().
  this.sendCloseDialog = undefined; // 傳送關閉對話視窗(由系統指定通用函式) - func().
};

$.extend(Windows.prototype,
{
  alertTest: function(text)
  {
    // *內部使用函式.
    // 測試用 alert
    // .text, 提示文字.
    // *測試模式停用時修改 _test 類別屬性.
    // *非測試模式提示請直接使用原始 alert 函式.
    if (!Windows._test)
      return;
    //
    alert("(Testing) : " + text);
  },

  confirmTest: function(text, value)
  {
    // *內部使用函式.
    // 測試用 confirm
    // .text, 確認對話文字.
    // .value, 確認對話的預設值.
    // *測試模式停用時修改 _test 類別屬性.
    // *非測試模式提示請直接使用原始 confirm 函式.
    if (!Windows._test)
      return value;
    //
    return confirm("(Testing) : " + text);
  },

  iisExpress: function()
  {
    // *內部使用函式.
    // 是否為 Local 的 IIS Express 開發測試.
    // *若為是則傳回 'Y', 否則為 'N'. 
    /// *IIS Express 開發測試為開發端測試時期使用.
    var hidden = $(".SystemIISExpressYNHidden");
    //
    value = (isValidObject(hidden)) ? $(hidden).val() : "N"; // 判斷 IIS Express 開發測試, 值為由 C# 端程式碼設定.
    result = (value == "Y");
    //
    return result;
  },

  findObjects: function(id, tag)
  {
    // *內部使用函式.
    // Widgets Are Unavailable or Undefined
    // http://docs.telerik.com/kendo-ui/troubleshoot/troubleshooting-common-issues#widgets-are-unavailable-or-undefined
    var result = { control: undefined, element: undefined, frameSelector: undefined, frame: undefined, found: false };
    var reason1, reason2, reason3;
    //
    result.element = $("#" + id); // Window 元素
    result.control = (isValidObject(result.element)) ? result.element.data("kendoWindow") : undefined; // Window 元件
    result.frameSelector = ".custom-frame-" + id; // Window's frame, selector - "custom-frame-{id}", 格式必須與 HIS.Mvc WindowBuilder 輔助方法相同.
    result.frame = (isValidObject(result.element)) ? result.element.find(result.frameSelector) : undefined; // frame 元素
    if (!isValidObject(result.element)) // 防呆(傳錯 id)
    {
      alert("Windows." + tag + " : Window element not found(找不到符合名稱的 Window 元件 - '" + id + "').");
      return result;
    }
    if (!(result.control)) // 防呆
    {
      reason1 = "1.目前作業存在多個 View 套用的 Layout 皆包含 jquery/kendo 載入, 而因為多次載入 jquery/kendo 導致前面已初始的 jquery/kendo 元件失效, 請確認元件名稱是否正確並檢視 View 套用的 Layout 是否合適(無重覆載入 jquery/kendo).";
      reason2 = "2.事件名稱指定不正確包含括號, 如 events.Click(\"xxxxx.XXXButton_Click()\") 等, 事件名稱括號表示開啟 Window 的執行程序將被立即執行, 但該 Window 元件並未初始完成無法使用.";
      reason3 = "3.Window 元件前方初始程序發生錯誤(紅字), 造成該 Window 元件並未初始完成無法使用.";
      alert("Windows." + tag + " : Invalid Window Control(無效的 Window 控制項 - '" + id + "'), 若您看到此訊息表示 : \n" + reason1 + "\n" + reason2 + "\n" + reason3 + "");
      return result;
    }
    if (!isValidObject(result.frame))
    {
      alert("Windows." + tag + " : Window frame not found(找不到 Window 內部 frame 元素 - '" + result.frameSelector + "', 若您看到此訊息表示您的 Window 實作不正確(即未使用 Window 元件及 BasicUsage() 方法).");
      return result;
    }
    //
    result.found = true;
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

  //
  // 示範 : 
  //
  //   method1: function(...)
  //   {
  //     var result = {};
  //     var data;
  //     //
  //     data = { ... };
  //     ajaxPost("...", "/Controller1/Action1", data,
  //     {
  //       success: function(response)
  //       {
  //         ...
  //         result = Windows.makeMessage({ ok: true, value: response }); // 組合對話視窗結果
  //       }
  //     });
  //     //
  //     return result;
  //   },
  //
  makeMessage: function(data)
  {
    // 組合對話視窗結果.
    // .data, 對話視窗結果簡化資料格式.
    // -ok(bool, optional), 若為 true 表示對話視窗按下確定.
    // -value(any), 對話視窗傳回結果.
    // *此函式為非標準對話視窗等使用, 可簡化自行組合對話視窗結果以符合 Windows.openWindow 接收事件物件的要求, 減少不正確的對話視窗結果格式造成的錯誤.
    // 傳回值 : 通用對話視窗結果.
    var result = { result: "", value: "" };
    //
    if (data.ok)
    {
      result.result = "ok";
      result.value = data.value;
    }
    else
    {
      result.result = "cancel";
      result.value = "";
    }
    //
    return result;
  },

  isFrameDialog: function(win)
  {
    // 是否目前視窗為 frame 開啟對話視窗處理
    // .win, window 物件.
    // 傳回值 : 若為 true 表示目前視窗為 frame 開啟對話視窗處理, 否則為 false.
    var result = false;
    var frameElement;
    //
    try
    {
      frameElement = win.frameElement; // 目前視窗隸屬 frame, 若不為 frame 開啟將為 null
      result = (!isEmpty(frameElement) && $(frameElement).hasClass("frame-framedialog"));
    }
    catch (err)
    {
      // 防呆(忽略其他非預期例外)
    }
    //
    return result;
  },

  openWindow: function(id, options)
  {
    // 開啟視窗
    // .id, 視窗元件代號, 即 Window.Name() 設定值.
    // .options, 視窗開啟選項 : 
    // -title, 自訂標題, Window 動態標題設定使用. 若固定標題請使用 Window 的 Title() 方法.
    // -url, 視窗內容位址, 如 /controller/action 格式.
    // -data, Url 查詢字串內容, 仿照 jquery ajax 參數格式, 支援字串, JSON 結構.
    // -closeOnEscape(bool, optional), 按下 Escape 鍵自動關閉視窗. 仿照 jquery-ui dialog 參數格式, 預設值為 true. 若視窗應用為資料編輯建議使用 closeOnEscape: false 避免非預期關閉視窗造成編輯資料未儲存而遺失.
    // -dialogMode(bool, optional), 是否開啟作業使用對話盒模式(即無主選單等), 此選項為作業可能為主作業或子畫面時使用, 若作業固定為子畫面則無需使用(即作業 Layout 固定為對話視窗類型). 預設值為 false.
    // -fullScreen(bool, optional), 是否視窗全螢幕顯示(螢幕寬度 100%), 預設值為 false (最大化使用螢幕寬度 95%), 此屬性需配合 maximize: true 屬性設定一併使用.
    // -maximize(bool, optional), 是否視窗最大化顯示, 預設值為 false (表示作業使用 Window 的 Width() 方法設定).
    // -modal(bool, optional), 是否視窗獨佔模式(Modal), 預設值為 true (使用獨佔視窗模式 - BasicUsage() 方法). 若視窗固定使用非獨佔模式(Modeless), 亦可不使用此選項並於 BasicUsage() 之後直接使用 Modal(false) 設定.
    // -scrolling, 捲軸功能, 屬性值/作用定義同 iframe.scrolling, 預設關閉捲軸功能(因為對話視窗已由對話視窗內容區域處理). 若作業停用捲軸功能(scrolling = "no")並自行處理可避免網頁非預期同時出現多條垂直捲軸等情況.
    // -事件處理函式 : 
    // -ok, 確定事件, 對話視窗執行 Dialogs.ok() 函式.
    // -cancel 等, 對話視窗執行 Dialogs.cancel() 函式.
    // -listener, 自訂接收事件, 對話視窗傳回的接收事件物件的 data 屬性值非通用對話視窗格式時使用, 可由對話視窗開啟端自行處理非通用對話視窗格式的傳回值.
    // *ok/cancel 等事件處理函式組合依窗對話視窗類型而定.
    // *自訂 frame 元素為由 HIS Mvc Window 的 BasicUsage() 方法內建加入(非由此函式中加入).
    // *注意 : Url 使用將受限於 Cross-domain 限制, 若兩方應用程式存在於同一 Domain 可正常傳遞訊息.
    // Reference : 
    // HTML DOM addEventListener() Method
    // http://www.w3schools.com/jsref/met_element_addeventlistener.asp
    // HTML DOM Events
    // - Server-Sent Events
    // http://www.w3schools.com/jsref/dom_obj_event.asp
    // HTML <iframe> scrolling Attribute
    // https://www.w3schools.com/tags/att_iframe_scrolling.asp

    Windows.alertTest("Windows.openWindow() - page document.domain = " + document.domain);

    var objects;
    var element, control, frame;
    var src, queryString;
    var uid;
    var isFrameDialog = Windows.isFrameDialog(window);
    //
    objects = Windows.findObjects(id, "openWindow()");
    if (!objects.found)
      return;
    //
    element = objects.element;
    control = objects.control;
    frame = objects.frame;
    options = options || {};
    options = $.extend(
    {
      title: "",
      data: {},
      closeOnEscape: true,
      dialogMode: false,
      fullScreen: false,
      maximize: false,
      modal: true,
      scrolling: "no"
    }, options);
    //
    uid = Kendos.uniqueId();
    //
    $(frame).addClass("frame-openwindow"); // 註記 frame 為 openWindow 方式開啟
    $(frame).attr("frame-uid", uid); // 註記唯一代號(清除 listener 等識別使用), openFrame/openWindow 函式之間將共同判斷此屬性(因為同一畫面可能同時開啟多個 frame/Window)
    $(frame).attr("src", ""); // 防呆(清除前次連結內容)
    $(frame).attr("scrolling", options.scrolling); // 捲軸功能, 若作業停用捲軸功能(scrolling = "no")並自行處理可避免網頁非預期同時出現多條垂直捲軸或些微高度差異仍顯示捲軸等情況且 frame 內容捲軸應由該內容元素自行處理.
    //
    var messgeListener = function(e)
    {

      Windows.alertTest("messgeListener, " + id + " (1/4) e.origin = " + e.origin);

      // 對話視窗 : 
      // .dialog
      // -result, 對話結果類型(仿照 System.Windows.Forms.DialogResult), 使用小寫表示.
      // -value, 對話結果數值, 數值內容由對話視窗自行組合.
      var message = e.data["dialog"]; // 對話視窗回覆物件 - { dialog： { result： ..., value： ... } }
      var sourceUid;
      var doClose = true, isTargetFrame;
      //

      Windows.alertTest("messgeListener, " + id + " (2/4) result = " + message);

      // kendo_devtools 直接忽略避免自訂 listener(接收事件) 執行非必要判斷(使用 Chrome 進行除錯開啟 Console 時將自動發生 kendo_devtools 訊息, 無與對話視窗等同時發生)
      if (!isEmpty(e.data["kendo_devtools"]))
        return;
      // 是否為非標準對話視窗結果且自訂存在
      if (!(message) && options.listener)
      {
        message = options.listener(e);
      }
      //
      if (message)
      {
        message.result = (message.result) ? message.result.toLowerCase() : ""; // 對話結果類型使用小寫表示
        sourceUid = Windows.getFrameUid(e.source.frameElement); // 來源訊息唯一代號
        isTargetFrame = (isEmpty(uid) || isEmpty(sourceUid)) ? true : (uid == sourceUid); // 是否符合訊息目的物件(若任一為空值表示無有效比對值直接表示符合即不比對), 詳細請參考前方 "來源訊息比對" 說明.
        //
        if (isTargetFrame && message.result == "ok")
        {
          Windows.alertTest("messgeListener, " + id + " (31/4) ok, value = " + message.value);

          // 執行事件(若呼叫端有定義)
          if (options.ok)
          {
            try
            {
              doClose = options.ok(message.value, { frameUid: sourceUid }); // 第二參數(args) - 若有需要傳回系統/作業相關參數值
            }
            catch (err)
            {
              doClose = false;
              alert("執行發生錯誤(確定) - '" + err + "'.");
            }
          }
        }
        else if (isTargetFrame && message.result == "cancel")
        {

          Windows.alertTest("messgeListener, " + id + " (32/4) cancel.");

          // 執行事件(若呼叫端有定義)
          if (options.cancel)
          {
            try
            {
              doClose = options.cancel(message.value, { frameUid: sourceUid }); // 第二參數(args) - 若有需要傳回系統/作業相關參數值
            }
            catch (err)
            {
              doClose = false;
              alert("執行發生錯誤(取消) - '" + err + "'.");
            }
          }
        }

        // TODO: //else if (message.result)
        ////{
        ////  // Other custom function
        ////  var customFunction = options[message.result];
        ////  //
        ////  if (customFunction)
        ////    doClose = customFunction(message);
        ////}

        if (isTargetFrame)
        {
          // 是否自動關閉視窗自動 - 呼叫端實作的 ok, cancel 等事件處理函式若傳回 false 則表示視窗保留不自動關閉(如呼叫端實作判斷值不合法等)
          if (doClose == true || doClose == undefined)
            Windows.closeWindow(id, objects);
        }
      }

      Windows.alertTest("messgeListener " + id + " (4/4) end");

    };
    window.addEventListener("message", messgeListener, false); // 目前視窗加入 'message' 監聽事件
    // 加入內建 close 事件處理函式至視窗
    // *加入內建 close 事件不影響元件的自訂事件處理函式, 相同事件的事件處理函式同時可多個, 唯事件處理函式執行順序為加入順序.
    var iconClose = $(element).parent().find(".k-i-close"); // 視窗關閉圖示元素
    var bIconClose = false;
    var onClose = function(e)
    {
      var bClose = true;
      //

      Windows.alertTest("Built-in onclose invoked.");

      // 若停用 Escape 鍵關閉對話視窗
      // *視窗關閉使用者觸發(userTriggered), 其定義包括使用者按下 Escape 鍵及按下關閉圖示兩者. 因為 element's keydown 事件觸發順序為 Window's close 之後因此無法作用不使用.
      // Window － Events － close
      // http://docs.telerik.com/kendo-ui/api/javascript/ui/window#events-close
      if (options.closeOnEscape == false && e.userTriggered && !bIconClose)
      {
        e.preventDefault(); // 中止 close 事件必須使用 preventDefault() 方法(下一行事件傳回 false 僅保留實際無作用)
        return false;
      }
      objects.control.unbind("close", onClose); // 清除 Window 元件的內部 close 事件連結
      iconClose.unbind("click", onIconClose);
      Windows.clearWindow(id, objects); // 清除視窗, 因為呼叫端可能直接關閉視窗(右上角 X 圖示, 即無按下對話視窗 ok, cancel 等按鈕)
      //
      if (isFrameDialog && (typeof Windows.sendCloseDialog == "function"))
        Windows.sendCloseDialog();
    };
    var onIconClose = function(e)
    {
      bIconClose = true; // 註記按下關閉圖示
    };
    control.bind("close", onClose);
    iconClose.bind("click", onIconClose);
    // 暫存視窗狀態
    // *使用 Window 元件 id 做為唯一識別 Key.
    // *簡化實作不使用 Object.defineProperty() 方式.
    Windows._windows[id] = { id: id, listener: messgeListener };
    // 開啟視窗(Open Kendo Window)
    // title
    // *無法藉由 control.element 設定 title, height, width 等屬性, 必須使用元件提供的函式.
    if (options.title != "")
      control.title(options.title);
    // maximize
    var print = (options.url.indexOf("/Print") != -1 || options.url.indexOf("Print?") != -1 || endsWith(options.url, "Print", { ignoreCase: true })); // 是否為預覽列印(Action 名稱包含 'Print' 文字者)
    if ((options.url) && print) // 預覽列印預設使用最大寬度
      options.maximize = true;
    //
    if (options.maximize == true && options.fullScreen == true)
    {
      // 最大寬度(全畫面, 即 Windows 預設最大化)
      control.maximize();
    }
    else if (options.maximize == true)
    {
      // 最大寬度(百分比)
      // *注意 : 因為測試發現 setOptions(width: ...) 方式將導致 Windows 視窗 [X] 按鈕無作用(按下無法關閉視窗)因此不使用 setOptions() 方式 - Q2 2016.
      var mainElement = $(control.element).parent(); // Window 主要元素(因為 element 屬性非 Window 主要元素 - 與其他元件不同)
      //
      sMaximum = "95%"; // 預設最大寬度百分比
      if (typeof options.maximize === "string" && options.maximize.toString().indexOf("%") != -1) // 自訂最大寬度百分比(若有)
        sMaximum = options.maximize;
      if ($(mainElement).hasClass("k-window")) // 防呆(Window 主要元素)
      {
        $(mainElement).css("width", sMaximum);
        $(mainElement).css("height", "85%");
      }
    }
    else
    {
      // 手動限制視窗最大大小, 因為若 Window 元件 Height(), Width() 設定值過大則如子視窗標題列將顯示超出父視窗(即子視窗標題列將抓不到, 雖然 Resize 父視窗可重置顯示子視窗標題但點擊子視窗標題後將又回復原狀)
      var _resetWindowMaxSize = function()
      {
        var mainElement = $(control.element).parent(); // Window 主要元素(因為 element 屬性非 Window 主要元素 - 與其他元件不同)
        var noResetMaxSize = ($(control.element).attr("no-resetMaxSize") == "true"); // 是否不重置視窗最大大小
        //
        if (!noResetMaxSize)
        {
          $(mainElement).css("max-width", window.innerWidth + "px");
          $(mainElement).css("max-height", (window.innerHeight - 37 - 1 - 1) + "px"); // 37 - Window margin-top is -37, window.innerHeight 為整個視窗(含標題列)的寬度
          $(mainElement).attr("_resetWindowMaxSize", ""); // 註記手動限制視窗最大大小(僅識別使用)
        }
      };
      $(window).on("resize", function()
      {
        _resetWindowMaxSize();
      });
      _resetWindowMaxSize(); // resize 視窗已開啟, 手動執行一次
    }
    // open()
    if (!options.modal)
      control.setOptions({ modal: false });
    control.open().center(true);
    // 重置 center - 對話視窗處理
    if (isFrameDialog)
    {
      setTimeout(function()
      {
        var oldTop = control.options.position.top; // 前次 top 位置(center)
        //
        control.center(true); // 重置 center
        setTimeout(function()
        {
          control.setOptions({ position: { top: oldTop, left: control.options.position.left } });
        }, 1);
      }, 100);
    }
    // 連結視窗內容
    var baseAddress = SystemData.getBaseAddress();
    var url = options.url;
    // 組成 Url, 若未包含完整位圵則補入目前應用程式基礎位址, 若已包含完整位圵則直接使用該位址
    if (baseAddress && url.indexOf("http") != 0)
    {
      // 若原位址為 /controller1/action1 格式則移除起始 '/' 字元後補入目前應用程式基礎位址(因為應用程式基礎位址以 '/' 字元結尾)
      if (url.indexOf("/") == 0)
        url = url.substr(1, url.length);
      url = baseAddress + url;
    }
    queryString = (typeof options.data === "string") ? options.data : getQueryString(options.data); // 若查詢字串為字串型態則直接使用 custom.utils
    src = (options.url.indexOf("?") == -1) ? url + "?" + queryString : url + "&" + queryString; // 若原始 url 無查詢字串符號則 "?查詢字串", 否則僅加入查詢字串內容.
    if (options.dialogMode && src.toLowerCase().indexOf("DialogMode=Y".toLowerCase()) == -1)
      src = src + "&" + "DialogMode=Y";
    //
    $(frame).attr("src", src);
    if (isFrameDialog && (typeof Windows.sendOpenDialog == "function"))
      Windows.sendOpenDialog();
  },

  clearWindow: function(id, objects)
  {
    // 清除視窗狀態暫存
    // .id, Window id - Name() 設定值.
    // .objects, 視窗相關物件, Windows 類別內部方法傳入使用, 外部請不傳入.
    // *若傳回 true 表示執行清除, 否則為 false.
    var element, frame;
    var state = Windows._windows[id];
    //
    objects = (objects) ? objects : Windows.findObjects(id, "clearWindow()");
    if (!objects.found)
      return;
    //
    element = objects.element;
    frame = objects.frame;
    if (!(state)) // 忽略視窗狀態不存在(如前方已清除等)
      return false;
    // 清除視窗狀態暫存
    window.removeEventListener("message", state.listener, false);
    Windows._windows[id] = null;
    // 清除連結內容
    // *使用後必須清除否則 frame 將持續連結 Url 文件內容.
    clearFrame(frame); // custom.widget
    //
    return true;
  },

  closeWindow: function(id, objects)
  {
    // 關閉視窗(含清除視窗狀態暫存)
    // .id, Window id - Name() 設定值.
    // .objects, 視窗相關物件, Windows 類別內部方法傳入使用, 外部請不傳入.
    objects = (objects) ? objects : Windows.findObjects(id, "closeWindow()");
    if (!objects.found)
      return;
    // 清除視窗狀態暫存
    this.clearWindow(id, objects);
    // 關閉視窗(Close Kendo Window)
    objects.control.close();
  },

  openFrame: function(frame, options)
  {
    // 開啟視窗
    // .frame, Frame 元素.
    // .options, 視窗開啟選項 : 
    // -url, 視窗內容位址, 如 /controller/action 格式.
    // -data, Url 查詢字串內容, 仿照 jquery ajax 參數格式, 支援字串, JSON 結構.
    // -scrolling, 捲軸功能, 屬性值/作用定義同 iframe.scrolling, 預設關閉捲軸功能(因為對話視窗已由對話視窗內容區域處理). 若作業停用捲軸功能(scrolling = "no")並自行處理可避免網頁非預期同時出現多條垂直捲軸等情況.
    // -事件處理函式, 如 ok, cancel 等, 視窗對話視窗類型而定.
    // *來源訊息比對 - 因為對話視窗傳送訊息的接收對象為目前 window 物件(作業可能同時開啟多個 frame 皆將接收到傳送訊息), 
    //  因此觸發執行 ok/cancel 事件函式前必須比對該 frame 是否符合來源訊息的 frame 唯一代碼, 
    //  否則將不正確觸發執行其他 frame 的 ok/cancel 事件函式.
    // *注意 : Url 使用將受限於 Cross-domain 限制, 若兩方應用程式存在於同一 Domain 可正常傳遞訊息.
    // Reference : 
    // HTML DOM addEventListener() Method
    // http://www.w3schools.com/jsref/met_element_addeventlistener.asp
    // HTML DOM Events
    // - Server-Sent Events
    // http://www.w3schools.com/jsref/dom_obj_event.asp
    // HTML <iframe> scrolling Attribute
    // https://www.w3schools.com/tags/att_iframe_scrolling.asp
    Windows.alertTest("Windows.openFrame() - page document.domain = " + document.domain);

    var src, queryString;
    var id, uid;
    var isFrameDialog;
    //
    options = options || {};
    options = $.extend(
    {
      title: "",
      data: {},
      //closeOnEscape: true, ＜＜＜ frame 不適用選項 ＞＞＞
      //fullScreen: false,
      //maximize: false,
      scrolling: "no"
    }, options);
    //
    uid = Kendos.uniqueId();
    id = uid; // 視窗識別代碼, frame 模式僅做為提示使用
    isFrameDialog = (options.frameDialog == true || (typeof options.frameDialog == "function")); // 是否開啟對話視窗處理(true 表示開啟且使用預設函式, 函式表示使用自訂函式)
    //
    $(frame).addClass("frame-openframe"); // 註記 frame 為 openFrame 方式開啟
    if (isFrameDialog)
      $(frame).addClass("frame-framedialog"); // 註記 frame 開啟對話視窗處理, 被開啟視窗中的 Windows.openWindow() 執行時將判斷此註記並同時內建呼叫 "傳送開啟對話視窗" 函式.
    $(frame).attr("frame-uid", uid); // 註記唯一代號(清除 listener 等識別使用), openFrame/openWindow 函式之間將共同判斷此屬性(因為同一畫面可能同時開啟多個 frame/Window)
    $(frame).attr("src", ""); // 防呆(清除前次連結內容)
    $(frame).attr("scrolling", options.scrolling); // 捲軸功能, 若作業停用捲軸功能(scrolling = "no")並自行處理可避免網頁非預期同時出現多條垂直捲軸或些微高度差異仍顯示捲軸等情況且 frame 內容捲軸應由該內容元素自行處理.
    //
    var messgeListener = function(e)
    {

      Windows.alertTest("messgeListener(frame), " + id + " (1/4) e.origin = " + e.origin);

      // 對話視窗 : 
      // .dialog
      // -result, 對話結果類型(仿照 System.Windows.Forms.DialogResult), 使用小寫表示.
      // -frameUid, 來源訊息的 frame 唯一代碼.
      // -value, 對話結果數值, 數值內容由對話視窗自行組合.
      var message = e.data["dialog"]; // 對話視窗回覆物件 - { dialog： { result： ..., value： ... } }
      var frameDialogMethod;
      var sourceUid;
      var doClose = true, isTargetFrame;
      //

      Windows.alertTest("messgeListener(frame), " + id + " (2/4) result = " + message);

      // kendo_devtools 直接忽略避免自訂 listener 執行非必要判斷(使用 Chrome 進行除錯開啟 Console 時將自動發生 kendo_devtools 訊息, 無與對話視窗等同時發生)
      if (!isEmpty(e.data["kendo_devtools"]))
        return;
      // 是否為非標準對話視窗結果且自訂存在
      if (!(message) && options.listener)
      {
        message = options.listener(e);
      }
      //
      if (message)
      {
        message.result = (message.result) ? message.result.toLowerCase() : ""; // 對話結果類型使用小寫表示.
        frameDialogMethod = (typeof options.frameDialog == "function") ? options.frameDialog : Windows.frameDialog; // 對話視窗處理函式, 若作業選項自訂則使用, 否則使用預設函式(若系統指定通用函式).
        sourceUid = Windows.getFrameUid(e.source.frameElement); // 來源訊息唯一代號
        isTargetFrame = (isEmpty(uid) || isEmpty(sourceUid)) ? true : (uid == sourceUid); // 是否符合訊息目的物件(若任一為空值表示無有效比對值直接表示符合即不比對), 詳細請參考前方 "來源訊息比對" 說明.
        //
        if (isTargetFrame && (typeof frameDialogMethod == "function") && frameDialogMethod(frame, message.value) == true)
        {
          // 對話視窗處理(即非傳回資料)
        }
        else if (isTargetFrame && message.result == "ok")
        {

          Windows.alertTest("messgeListener(frame), " + id + " (31/4) ok, value = " + message.value);

          // 執行事件(若呼叫端有定義)
          if (options.ok)
          {
            try
            {
              doClose = options.ok(message.value, { frameUid: sourceUid }); // 第二參數(args) - 若有需要傳回系統/作業相關參數值
            }
            catch (err)
            {
              doClose = false;
              alert("執行發生錯誤(確定) - '" + err + "'.");
            }
          }
        }
        else if (isTargetFrame && message.result == "cancel")
        {

          Windows.alertTest("messgeListener(frame), " + id + " (32/4) cancel.");

          // 執行事件(若呼叫端有定義)
          if (options.cancel)
          {
            try
            {
              doClose = options.cancel(message.value, { frameUid: sourceUid }); // 第二參數(args) - 若有需要傳回系統/作業相關參數值
            }
            catch (err)
            {
              doClose = false;
              alert("執行發生錯誤(取消) - '" + err + "'.");
            }
          }
        }

        //frame 無需關閉, 是否隱藏由作業自行處理
        //// 是否自動關閉視窗自動 - 呼叫端實作的 ok, cancel 等事件處理函式若傳回 false 則表示視窗保留不自動關閉(如呼叫端實作判斷值不合法等)
        //if (doClose == true || doClose == undefined)
        //  Windows.closeWindow(id, objects);

      }

      Windows.alertTest("messgeListener(frame) " + id + " (4/4) end");

    };
    window.addEventListener("message", messgeListener, false); // 目前視窗加入 'message' 監聽事件

    // 暫存 frame 狀態
    // *使用 uid 做為唯一識別 Key.
    // *簡化實作不使用 Object.defineProperty() 方式.
    Windows._frames[uid] = { uid: uid, listener: messgeListener };

    // 連結視窗內容
    var baseAddress = SystemData.getBaseAddress();
    var url = options.url;
    // 組成 Url, 若未包含完整位圵則補入目前應用程式基礎位址, 若已包含完整位圵則直接使用該位址
    if (baseAddress && url.indexOf("http") != 0)
    {
      // 若原位址為 /controller1/action1 格式則移除起始 '/' 字元後補入目前應用程式基礎位址(因為應用程式基礎位址以 '/' 字元結尾)
      if (url.indexOf("/") == 0)
        url = url.substr(1, url.length);
      url = baseAddress + url;
    }
    queryString = (typeof options.data === "string") ? options.data : getQueryString(options.data); // 若查詢字串為字串型態則直接使用 custom.utils
    src = (options.url.indexOf("?") == -1) ? url + "?" + queryString : url + "&" + queryString; // 若原始 url 無查詢字串符號則 "?查詢字串", 否則僅加入查詢字串內容.
    $(frame).attr("src", src);
  },

  clearFrame: function(frame)
  {
    // 清除 frame 狀態暫存
    // .frame, Frame 元素.
    // *若傳回 true 表示執行清除, 否則為 false.
    // Working with objects
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
    // delete operator
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete
    var element, frame;
    var uid = $(frame).attr("frame-uid");
    var state;
    //
    state = Windows._frames[uid];
    if (!(state)) // 忽略視窗狀態不存在(如前方已清除等)
      return false;
    // 清除視窗狀態暫存
    window.removeEventListener("message", state.listener, false);
    delete Windows._frames[uid];
    // 清除連結內容
    // *使用後必須清除否則 frame 將持續連結 Url 文件內容.
    clearFrame(frame); // custom.widget
    //
    return true;
  },

  alertInput: function(element, text)
  {
    // 輸入提示/Focus
    alert("請輸入" + text + ".");
    element = (typeof element === "string") ? $("#" + element) : element;
    $(element).focus();
  },

  alertSelect: function(element, text)
  {
    // 選擇提示/Focus
    alert("請選擇" + text + ".");
    element = (typeof element === "string") ? $("#" + element) : element;
    $(element).focus();
  }
});

$(function()
{
  // initialize
  Windows = new Windows();

  Windows.alertTest("page init document.domain before = " + document.domain);
  if (Windows.iisExpress())
  {
    Windows.alertTest("page iisExpress mode - set page domain to 'localhost'."); //iff (Windows.confirmTest("set page domain to 'localhost' ?", false))
    document.domain = "localhost";
  }
  Windows.alertTest("page baseaddress='" + $(".SystemBaseAddressHidden").val() + "'");
  Windows.alertTest("page init document.domain after = " + document.domain);

});

/* end */
