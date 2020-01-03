  /*
     custom.widget.js - 2015-02-02
     
       Custom widget method using jQuery.
       
       depends : jquery-ui.css (for dialog, etc)
                 custom.widget.css
                 custom.utils.js
                 custom.jquery.utils.js
  */

  var _activePrintDialog = undefined; // 目前作用中視窗(dialog, 由開啟端控制)

  function clearFrame(frame, load)
  {
    // 清除 Frame (包括 src, load 事件函式)
    if (load != undefined)
      $(frame).unbind("load", load); // 卸除自訂 load 事件處理函式, 否則後續自訂 load 事件處理函式將因為未卸除而重覆執行選擇 click (第二次 load 的 click 執行 2 份[含第一次 load 的 click])
    $(frame).attr("src", ""); // 清除網頁連結, 否則 frame 將持續連結網頁
  }
  
  function setWidgetOverlay()
  {
    // 重置 jquery overlay
    // *修正 jquery overlay 不確實問題, 因為若網頁內容較多時網頁文件將超出瀏覽器視窗大小 window.height() 
    //  但 jquery 設定 overlay 時卻仍使用瀏覽器視窗大小 window.height(), 導致超出部份於 dialog modal = true
    //  的情況下仍可點選(如 button 等)而可能衍生不正確的網頁操作行為.
    // *此方法如 dialog.open() 等事件函式中使用.
    var clientHeight, windowHeight;
    //
    clientHeight = document.body.clientHeight;
    windowHeight = $(window).height();
    if (clientHeight <= 0 || clientHeight <= windowHeight) // 防呆(0)
      return;
    //
    $(".ui-widget-overlay").css("height", clientHeight + 8);
  }

  function showPrintDialog(dialog, frame, url, postback, load)
  {
    // 列印對話盒(iframe, 支援 postback, load 等)
    var options;
    //
    options = { dialog: dialog, frame: frame, load: load, postback: postback };
    showDialogEx(undefined, url, options);
  }

  function showDialog(dialog, frame, url, postback, load)
  {
    // 顯示對話盒(iframe, 支援 postback, load 等)
    var options;
    //
    options = { dialog: dialog, frame: frame, load: load, postback: postback };
    showDialogEx(undefined, url, options);
  }
  
  //
  // 示範 :
  //
  //  function YourFunction()
  //  {
  //    var dialog, frame;
  //    var options;
  //    //
  //    dialog = $("#Your dialog id");
  //    frame = $(".Your frame class id");
  //    options =
  //    {
  //      dialog: dialog,
  //      frame: frame,
  //      close: function()
  //      {
  //        // close
  //      },
  //      load: function()
  //      {
  //        // load
  //        var docu = $(this).contents();
  //        // 註冊子視窗關閉事件函式
  //        $(docu).find(".page-close").each(function()
  //        {
  //          $(this).on("click", function()
  //          {
  //            var response;
  //            //
  //            response = $(this).attr("page-result");
  //            $(dialog).dialog("close"); // 關閉目前對話盒(讀取傳回值後)
  //            if (isEmpty(response)) // 空值返回(如取消等) custom.utils
  //              return;
  //            //
  //            ... postback, etc ...
  //          });
  //        });
  //      },
  //      postback: function()
  //      {
  //        // postback
  //      }
  //    };
  //    showDialogEx("Your dialog title", "Your url", options);
  //  }
  //
  function showDialogEx(title, url, options)
  {
    // 顯示對話盒(iframe, 支援 postback, load 等)
    // .options, 選項(JSON 格式), 包括 dialog, frame, height, width, close(), load(), postback() 及 jquery dialog 同名屬性(部份)等自訂選項, () 表示為事件函式.
    //  -close, 視窗關閉事件(清除 frame 前執行)
    //  -load, frame 載入完成事件函式
    //  -postback, 自訂 postback 事件函式(對話盒關閉時執行)
    // *視窗大小 : 預設最大 > 選項(height/width).
    var dialog, frame;
    var load, postback;
    var style, cssHeight, cssWidth;
    var hasHeight = (options.height != undefined), hasWidth = (options.width != undefined); // 是否 height/width 選項存在
    // 選項, 預設/自訂選項, $.extend() 表示若自訂選項存在(非 undefined)則使用否則使用預設選項
    options = options || {}; // 防呆(若前值為 undefined 則使用空結構, 因為存在順序性因此空結構需置於後方否則結果將皆為空結構)
    options = $.extend(
    {
      dialog: undefined,
      frame: undefined,
      load: undefined,
      postback: undefined,
      autoExpand: false, // 自動延伸大小(自訂)
      closeOnEscape: true, // jquery dialog 同名屬性
      height: $(window).height() - 40, // 視窗大小(預設最大)
      width: $(window).width() - 40,
      zIndex: undefined, // 最上層 z-index (自訂)
      buttons: {},
      close: function()
      {
        //
      }
    }, options);
    dialog = options.dialog;
    frame = options.frame;
    load = options.load;
    postback = options.postback; 
    //
    dialog = (typeof(dialog) == "string") ? $("#" + dialog) : dialog; // 對話盒元素, 支援 id 或物件
    frame = (typeof (frame) == "string") ? $("." + frame) : frame;
    title = (title != undefined) ? title : $(dialog).attr("title"); // title
    if (dialog == undefined || $(dialog).length <= 0)
    {
      alert(title + " - 對話盒元素不存在(" + dialog + ").");
      return;
    }
    //
    dialog = $(dialog).dialog(
    {
      autoOpen: false,
      closeOnEscape : options.closeOnEscape,
      modal: true,
      height: options.height,
      width: options.width,
      closeText: "關閉",
      dialogClass: "custom-dialog",
      title: title,
      buttons: options.buttons,
      create: function(event, ui)
      {
        // create
      },
      open: function(event, ui)
      {
        // open
        _activePrintDialog = this;
        setDialogFixed(this, 16);
        setDialogZIndex(this, options.zIndex); // custom.jquery.utils
        setWidgetOverlay();
        if (load != undefined)
          $(frame).load(load); // 自訂 load 事件處理函式, 因為後續需卸除該 load 事件處理函式因此使用傳入 handler 方式.
        $(frame).attr("src", url);
      },
      close: function(event, ui)
      {
        _activePrintDialog = undefined;
        // 視窗關閉事件(清除 frame 前執行, 提供讀取視窗結果等[非 PostBack 回覆方式])
        try
        {
          options.close();
        }
        catch (err)
        {
          // 忽略例外(視窗關閉函式)
        }
        //
        clearFrame(frame, load);
        if (postback != undefined)
          postback();
      },
      focus: function(event, ui)
      {
        $(dialog).focus(); // 重置 focus, 防止非預期 focus 對話盒關閉按鈕(若網頁無輸入元件者), 網頁自訂 focus 將無影響
      }
    });
    //
    $(dialog).dialog("open");
    $(dialog).dialog( "option", "position", { my: "center", at: "center", of: document } ); // 重置對話盒置中, 因為若開啟對話盒時網頁存在捲動(下方)將因為設定固定位置而導致對話盒顯示於網頁上方(top = 16 等).
  }

  function showChildDialog(title, url, options)
  {
    // 顯示對話盒(作業子畫面共用/各子畫面為獨立執行)
    // .dialog, 可自行定義(說明請參考 showDialogEx() 函式)
    // .frame, 可自行定義(說明請參考 showDialogEx() 函式)
    // .options, 選項(JSON 格式), 包括 dialog, frame, height, width, close(), load(), postback() 及 jquery dialog 同名屬性(部份)等自訂選項, () 表示為事件函式.
    //  -close, 可自行定義(說明請參考 showDialogEx() 函式)
    //  -load, frame 載入完成事件函式. 注意 : 目前顯示對話盒函式已使用非必要請勿重新定義.
    //  -postback, 可自行定義(說明請參考 showDialogEx() 函式)
    //  -其他選項請參考 showDialogEx() 函式
    // *作業子畫面關閉包含傳回值時使用, 視窗關閉/傳回值通用規範 :
    //  -關閉按鈕(.page-close), 應用於觸發視窗關閉事件函式.
    //  -傳回值(page-result), 為依附於關閉按鈕的屬性.
    var dialog, frame;
    //
    dialog = $("#ChildDialog");
    frame = $(".ChildFrame");
    options = $.extend(
    {
      dialog: dialog,
      frame: frame,
      close: function()
      {
        // close
      },
      load: function()
      {
        // load
        var docu = $(this).contents();
        // 註冊子視窗關閉事件函式
        $(docu).find(".page-close").each(function()
        {
          $(this).on("click", function()
          {
            var response;
            //
            response = $(this).attr("page-result");
            $(options.dialog).dialog("close"); // 關閉目前對話盒(讀取傳回值後)
            if (isEmpty(response)) // 空值返回(如取消等) custom.utils
              return;
            //
            options.done(response);
          });
        });
      },
      postback: function()
      {
        // postback
      }
    }, options);
    showDialogEx(title, url, options);
  }

  //
  // 示範 :
  //
  //  notifyMessage("your message");
  //
  function notifyMessage(title)
  {
    // 顯示提示(自動隱藏)
    // *應用於簡單提示內容(如 'XXX 已儲存' 等)
    // *實作使用 jQuery UI 示範(複製) :
    //  Tooltip
    //  Examples : Video Player demo
    //  http://jqueryui.com/tooltip/#video-player
    //  修改 : class: ui-corner-bottom -> ui-corner-all, position: center top -> center, 樣式直接套用.
    var html, msg = title;
    var notification = "position: absolute; display: inline-block; font-size: 1.5em; padding: .5em; box-shadow: 2px 2px 5px -2px rgba(0, 0, 0, 0.5);"; // 提示樣式(同 jQuery UI 示範)
    //
    html = "<div style='" + notification + "'>";
    $(html).appendTo(document.body)
           .text(msg)
           .addClass("notification ui-state-default ui-corner-all")
           .position({ my: "center", at: "center", of: window })
           .show({ effect: "blind" })
           .delay(2500)
           .hide({ effect: "blind", duration: "slow" }, function() { $(this).remove(); });
  }

  var __id_MessageDialog = "_MessageDialog_B51F5F35_D340_4ab7_AFD9_0FF3896B3A32"; // guid
  
  // 示範 : showMessageEx("information", "your title", "your message");
  function showMessage(type, title, message)
  {
    // 訊息對話盒(使用者手動關閉)
    showMessageEx(type, title, message, {});
  }
  
  // 示範 : showMessageEx("information", "your title", "your message", { height: [your height], width: [your width] });
  function showMessageEx(type, title, message, options)
  {
    // 訊息對話盒(使用者手動關閉)
    // .type, 對話盒類型(包括 information, warning, error 等)
    // .title, 對話盒標題
    // .message 訊息內容
    // .options, 選項(JSON 格式), 包括 id, height, width 等自訂選項
    var dialog;
    var id, html;
    var height, width;
    //
    options = options || {}; // 防呆(若前值為 undefined 則使用空結構, 因為存在順序性因此空結構需置於後方否則結果將皆為空結構)
    options = $.extend({ id: __id_MessageDialog, height: 100, width: 200 }, options); // 選項, 預設/自訂選項, $.extend() 表示若自訂選項存在(非 undefined)則使用否則使用預設選項
    //
    id = options.id;
    dialog = $("#" + id);
    if (dialog == undefined || $(dialog).length == 0) // 加入對話盒(唯一元素, 若元素不存在)
    {
      html = "<div id='" + id + "' style='display: none;'>"
           + "  <span>" + message + "</span>"
           + "</div>";
      $(html).appendTo($("body"));
    }
    dialog = $("#" + id); // 重新取對話盒
    height = options.height;
    width = options.width;
    //
    dialog = $(dialog).dialog(
    {
      autoOpen: false,
      modal: true,
      height: height,
      width: width,
      closeText: "關閉",
      title: title,
      dialogClass: "custom-dialog",
      create: function(event, ui)
      {
        // create
      },
      open: function(event, ui)
      {
        // open
        setWidgetOverlay();
      },
      close: function(event, ui)
      {
      },
      focus: function(event, ui)
      {
        $(dialog).focus(); // 重置 focus, 防止非預期 focus 對話盒關閉按鈕(若網頁無輸入元件), 不影響網頁自訂 focus
      }
    });
    //
    $(dialog).dialog("open");
  }
  
  /* 
     Upload 
  
       depends : UploadFile.aspx
  */

  var __id_UploadDialog = "_UploadDialog_F06E4BFB_5543_40B0_90DF_3BF8D53B64EA"; // guid

  // 檔案上傳示範 :
  // 
  //  function performUpload()
  //  {
  //    var options;
  //    //
  //    options =
  //    {
  //      done: function(data)
  //      {
  //        // .data.file, 上傳檔案(含路徑), 若為 undefined 表示檔案未上傳(如取消等)
  //        // .data.virtualPath, 上傳檔案虛擬路徑, 如 Folder1/ 等, 以 / 結尾
  //        // .data.options, 
  //        if (data.file == undefined)
  //          return;
  //        //
  //        // ... data.file ...
  //      }
  //    };
  //    showUpload("上傳", options); // custom.widget
  //  }
  //
  function showUpload(title, options)
  {
    // 檔案上傳
    // .title, 對話盒標題
    // .options, 選項(JSON 格式), 包括 id, height, width, params, done 等自訂選項
    // *上傳對話盒使用最上層 z-index 如 1004 同時自訂對話盒函式將判斷使用最上層者自動設定其對話盒背景元素(overlay) z-index － 1 ＝ 1003.
    var dialog;
    var load, postback, request;
    var html;
    //
    options = options || {}; // 防呆(若前值為 undefined 則使用空結構, 因為存在順序性因此空結構需置於後方否則結果將皆為空結構)
    options = $.extend(
    {
      id: __id_UploadDialog,
      height: $(window).height() * 0.6, // 視窗大小(螢幕比例)
      width: $(window).width() * 0.55,
      params: "",
      done: function(data)
      {
        //a lert("debug - showUpload done(default), file='" + data.file + "'");
      }
    }, options); // 選項, 預設/自訂選項, $.extend() 表示若自訂選項存在(非 undefined)則使用否則使用預設選項
    id = options.id;
    dialog = $("#" + id);
    if (dialog == undefined || $(dialog).length == 0) // 加入對話盒(唯一元素, 若元素不存在)
    {
      html = "<div id='{0}' title='{1}' style='display: none; overflow: visible; height: {2}px; width: {3}px'>"
           + "  <iframe id='{0}Frame' runat='server' class='{0}Frame' src='' frameborder='0' style='height: 100%; width: 100%;'></iframe>"
           + "</div>";
      html = stringFormat(html, stringFormatParams = new Array(id, title, options.height, options.width));
      $(html).appendTo($("body"));
    }
    dialog = $("#" + id); // 重新取對話盒
    //
    load = function()
    {
      var docu = $(this).contents();
      // 註冊上傳結束事件函式
      // *上傳網頁於上傳完成後觸發上傳結束事件以執行註冊的上傳結束事件函式.
      $(docu).find(".upload-close").each(function()
      {
        $(this).on("click", function()
        {
          $(dialog).dialog("close"); // 上傳完成關閉對話盒, 對話盒關閉後將接繼執行下方函式程序(即 request.close > options.done 通知作業上傳檔案結束)
        });
      });
    };
    request =
    {
      dialog: id,
      frame: id + "Frame",
      load: load,
      postback: postback,
      height: options.height,
      width: options.width,
      closeOnEscape: false,
      zIndex: 1004,
      close: function()
      {
        var frame = $("." + id + "Frame");
        var docu = $(frame).contents();
        var file, virtualPath;
        //
        $(docu).find(".upload-response").each(function()
        {
          file = $(this).attr("upload-file");
          virtualPath = $(this).attr("upload-virtual-path");
          source = $(docu).find(".upload-options").val(); // 上傳網頁查詢字串(可由呼叫端傳入後傳回上傳結束事件函式[獨立開啟上傳網頁時適用)
          options.done({ file: file, virtualPath: virtualPath, options: JSON.parse(source) });
        });
        $(dialog).remove();
      }
    };
    showDialogEx(title, "UploadFile.aspx?" + options.params, request);
  }

  /* c1editor */
  
  // 示範 : 
  //
  //  網頁設計 :
  //
  //    ＜div id="C1Editor1Header" style="display: none"＞
  //      ＜button type="button" class="ui-button ui-widget ui-state-default ui-button-text-only" title="..." onclick="...;"＞
  //        ＜span class="ui-button-text"＞Button1＜／span＞
  //      ＜／button＞
  //      ...
  //    ＜／div＞
  //
  //  呼叫方法 :
  //
  //    customSimpleRibbon(＄（"＃C1Editor1"）, { header: ＄（"＃C1Editor1Header"）.html() });
  //
  function customSimpleRibbon(container, options)
  {
    // 自訂 C1Editor Ribbon (Simple)
    // .container, C1Editor 相關元素 container, 可為 C1Editor 本身或包含 C1Editor 元件的唯一 container.
    // .options, 選項(JSON 格式), 包括 header 等.
    //  -header, Header Html, 如自訂按鈕列等.
    // *若 C1Editor Ribbon 自訂無效表示呼叫端 Script 可能存在語法錯誤等.
    // *若 header, footer 工具列找不到(length = 0), 因為網頁若包含 ＜ToolkitScriptManager＞ 載入時將使 C1 元件樣式 Selector 找不到元素, 
    //  如 C1Editor 的 ＄（".wijmo-wijeditor-header"）length = 0 等, ＄（document）.ready 事件中可使用 setTimeout(..., 1000) 方式執行.
    var id = container;
    var header, footer;
    //
    container = (typeof(container) === "string") ? $("#" + id) : container;
    header = $(".wijmo-wijeditor-header");
    header = $(container).find(".wijmo-wijeditor-header");
    footer = $(container).find(".wijmo-wijeditor-footer");
    if (container == undefined || $(container).length <= 0) // 防呆
    {
      alert("customEditorRibbon - container undefined(" + id + ").");
      return;
    }
    if (header == undefined || $(header).length <= 0)
    {
      alert("customEditorRibbon - header not found(" + id + ").");
      return;
    }
    if (footer == undefined || $(footer).length <= 0)
    {
      alert("customEditorRibbon - footer not found(" + id + ").");
      return;
    }
    //
    options = options || {}; // 防呆(若前值為 undefined 則使用空結構, 因為存在順序性因此空結構需置於後方否則結果將皆為空結構)
    options = $.extend(
    {
      firstHeader: "",
      header: ""
    }, options);
    // header (上方工具列)
    //$(header).find(".wijmo-wijribbon").find("*").hide(); // 已使用 SimpleModeCommands 縮減內建命令列因此無需隱藏
    if (options.firstHeader != "") // 新增工具列(第一位置)
      $(header).find(".wijmo-wijribbon").prepend(options.firstHeader);
    if (options.header != "") // 新增工具列(後方)
      $(header).find(".wijmo-wijribbon").append(options.header);
    $(header).find(".wijmo-wijribbon-bold").parent().attr("title", "粗體").find(".ui-button-text").text("粗體"); // Localization, 執行於 prepend/append 後否則無作用因為自訂元素等尚未加入
    $(header).find(".wijmo-wijribbon-italic").parent().attr("title", "斜體").find(".ui-button-text").text("斜體");
    $(header).find(".wijmo-wijribbon-underline").parent().attr("title", "底線").find(".ui-button-text").text("底線");
    $(header).find(".wijmo-wijribbon-insertprintpagebreak").parent().attr("title", "插入換頁符號。").find(".ui-button-text").text("換頁");
    $(header).find(".wijmo-wijribbon-imagebrowser").parent().attr("title", "插入圖片至編輯內容。" ).find(".ui-button-text").text("圖片");
    $(header).find(".wijmo-wijribbon-preview").parent().attr("title", "預覽編輯內容。").find(".ui-button-text").text("預覽");
    $(header).show(); // (還原)顯示 header, 網頁可預設隱藏避免未開放的操作
    // footer (下方工具列)
    $(footer).children("*").hide(); // 隱藏 footer 的子元素
    $(footer).children(".wijmo-wijribbon-simple").children("*").hide(); // 隱藏 footer 全螢幕按鈕存在的 container 內的所有子元素
    $(footer).children(".wijmo-wijribbon-simple").show(); // (還原)顯示 footer 全螢幕按鈕存在的 container
    $(footer).find(".wijmo-wijribbon-fullscreen").parent().show(); // (還原)顯示 footer 全螢幕按鈕
    $(footer).find(".wijmo-wijribbon-fullscreen").parent().attr("title", "全螢幕");
    $(footer).show(); // (還原)顯示 footer, 網頁可預設隱藏避免未開放的操作
    // Hover events - 因為 Ribbon 加入按鈕的 ui-button-hover 樣式非預期無作用
    $(header).find("button").on("mouseenter", function()
    {
      $(this).children('.ui-button-text').addClass('ui-state-hover');
    });
    $(header).find("button").on("mouseleave", function()
    {
      $(this).children('.ui-button-text').removeClass('ui-state-hover');
    });
  }

  function insertImageAtCursor(container, path, img)
  {
    // 加入圖片至目前游標位置
    // .container, C1Editor 相關元素 container, 可為 C1Editor 本身或包含 C1Editor 元件的唯一 container.
    // .path, 圖片檔案路徑(虛擬), 為以 / 字元結尾
    // .img, 圖片檔案名稱(不含路徑)
    img = path + encodeURIComponent(img); // 圖片檔案名稱, 處理空白字元編碼等, 如 'New Image 1.png' -> 'New%20Image%201.png' 等
    img = "<p><img alt='' src='" + img + "'></p>"; // 圖片連結 Html 語法格式 : <p><img ... alt='' src='...'></p>
    insertTextAtCursor(container, img);
  }

  function insertImageAtCursor2(container, img)
  {
    // 加入圖片至目前游標位置
    img = "<p>" + img + "</p>"; // 圖片連結 Html 語法格式 : <p><img ... alt='' src='...'></p>
    insertTextAtCursor(container, img);
  }

  function insertTextAtCursor(container, inputText)
  {
    // 加入文字至目前游標位置
    // .container, C1Editor 相關元素 container, 可為 C1Editor 本身或包含 C1Editor 元件的唯一 container.
    // .inputText, 文字內容, 支援純文字及 Html 內容
    // *C1Editor 方法 : ＄（"＃..."）.c1editor("option", "text") 讀取目前編輯內容等.
    // *Reference : Insert Text at Cursor Postion in Wijmo Editor
    //              (http://wijmo.com/insert-text-at-cursor-postion-in-wijmo-editor/)          // IE 11~ : IE 11 已無支援 .selection.createRange() 方法
    // *IE 11 實作程式碼為參考 c1editor 內建 'Image Browser' 程式碼(使用 Chrome '檢查元素' 指令取得) - ..., t.prototype._getRangeForInsertHTML = function (e, t) ...
    // *插入文字時必須執行 body.focus() 方法 focus 返回編輯元件否則任何 PostBack 或內建全螢幕按鈕按下後原插入文字將非預期遺失(無論 IE, Chrome 等)
    // get the container
    var $designView;
    var win, doc, range;
    var id = container;
    //
    container = (typeof(container) === "string") ? $("#" + id) : container;
    if (container == undefined || $(container).length <= 0)
    {
      alert("insertTextAtCursor - container undefined(" + id + ").");
      return;
    }
    $designView = $(container).find("iframe", $(".wijmo-wijeditor-container"));
    if ($designView && $designView.length > 0)
    {
      // retrieve the Window object generated by the iframe
      win = $designView[0].contentWindow;
    }

    if (win)
    {
      // access the document object
      doc = win.document;
    }

    if (doc)
    {
      try
      {
        // check if the browser is IE
        if ($.browser.msie)
        {
          // IE
          // insert the given text
          doc.body.focus();
          // IE ~10, 檢核 document.selection 是否存在, 因為 IE 11 已無支援 document.selection.createRange() 方法
          if (doc.selection)
          {
            range = doc.selection.createRange();
            range.pasteHTML(inputText);
            range.collapse(false);
            range.select();
            return;
          }
          // IE 11~ 
          var selObj = win.getSelection();
          var selRange = selObj.getRangeAt(0);
          var insertNode = selRange.createContextualFragment(inputText);
          selRange.insertNode(insertNode);
          selRange.collapse(false);
        }
        else
        {
          // Chrome, etc.
          doc.body.focus();
          doc.execCommand('insertHTML', false, inputText); // NOTE : plain text only -> doc.execCommand('insertText', false, inputText);
        }
      }
      catch (err)
      {
        alert("insertTextAtCursor error - " + err);
      }
    }
  }
  
  /* c1superpanel */
  
  function refreshSuperPanel(panel)
  {
    // 更新 Panel
    // *不使用 C1SuperPanel.AutoRefresh="true", 因為測試發現若啟用元件自動更新可能造成網頁執行問題(如 DropDownList 點選下拉後立即收回, IE8 離開瀏覽器視窗又立即提至最上層等).
    // *若程式執行時期動態設定 Panel 大小或內含元素大小變動(如 TreeView 展開/收回節點)後需手動更新元件(refresh), 元件將自動判斷隱藏/顯示捲軸.
    try
    {
      $(panel).c1superpanel("refresh");
    }
    catch (err)
    {
      // Ignore - $(window).load() - Microsoft JScript 執行階段錯誤: cannot call methods on c1superpanel prior to initialization; attempted to call method 'refresh'
    }
  }
  
  /* c1menu */

  function hideContextMenu()
  {
    // 隱藏跳出選單
    // *自動隱藏全部選單, 如按下 Escape 鍵等.
    // *主選單(Main Menu)不自動隱藏.
    var role;
    //
    $(".wijmo-wijmenu").each(function()
    {
      role = $(this).attr("role"); // role = menubar(Main Menu), menu(Context Menu).
      if (role != "menubar")
        $(this).hide();
    });
  }
  
  function resetMenuTrigger(menu)
  {
    // 重置選單 Trigger
    // *Client Script 動態建立節點時使用, 因為測試發現 c1menu.trigger 對 Client Script 動態建立的節點無作用
    //  因此重新設定 c1menu.trigger 正確套用 Trigger 功能至新節點.
    var trigger;
    //
    trigger = $(menu).c1menu("option", "trigger"); // 原 trigger
    $(menu).c1menu("option", "trigger", trigger);
  }
  
  function changeMenuItemText(item, text)
  {
    // 變更選單項目文字
    // *選單項目文字變更目前無內建方法可使用.
    // *因為選單項目為多層元素組合因此不可直接變更選單項目文字否則將導致選單項目無作用(內層元素/樣式遺失等). 選單項目內層元素個數依選單項目類型而定.
    var element;
    //
    if ($(item).length <= 0) // 防呆
      return;
    element = findDeepest(item.element); // custom.jquery.utils
    $(element).text(text);
  }
    
  /* end */