/*
  custom.kendo.utils.js - 2015-11-20

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

  //// 舊 Kendo Grid 資料存取例外處理程式碼(已不適用 2015 Q3 元件版本因此註解提示)
  ////if (e.errors)
  ////{
  ////  $.each(e.errors, function (key, value)
  ////  {
  ////    if ("error" in value)
  ////    {
  ////      $.each(value.errors, function ()
  ////      {
  ////        error = error + this + "\n";
  ////      });
  ////    }
  ////  });
  ////}

  error = e.errorThrown + "-" + e.toString(); // 預設錯誤訊息
  if (e.xhr)
    error = e.xhr.status + "." + e.xhr.statusText + "\r\n" + e.xhr.responseText;
  a = error.indexOf("<body");
  b = error.indexOf("</body>");
  if (a != -1 && b != -1)
    error = error.substring(a, b);
  alert(error);
  return;
  showMessageEx("information", "錯誤", error, { height: 500, width: 400 });
}

/* end */