/*
  custom.kendo.grid.js?date=20180724-1400

    Custom kendo-grid relative method.
   
    depends : jquery-ui.css (for dialog, etc)
              custom.utils.js
              custom.jquery.utils.js
              custom.widget.css
*/

var DateTimes = function()
{
  this._member = null; // member
  //
  this.LENGTH_Date = 8; // 西元日期, 如 20070610
  this.LENGTH_DateTime = 14; // 西元日期/時間, 如 20070610172059
  this.LENGTH_LocalDate = 7; // 民國日期(年月日), 如 0960101
  this.LENGTH_LocalDateTime = 13; // 民國日期/時間(年月日/時分秒), 如 0960610172059
  this.LENGTH_Time = 6; // 時間(時分秒), 如 235959
  this.LENGTH_ShortTime = 4; // 時間(時分), 如 2359
  // 日期格式(kendo)
  this.FORMAT_Date = "yyyyMMdd"; // 日期格式
  this.FORMAT_DateTime = "yyyyMMddHHmmss"; // 日期/時間格式
};

$.extend(DateTimes.prototype,
{
  now: function()
  {
    // 目前日期/時間(Date 型態)
    // Date
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    var result;
    var date;
    //
    date = new Date();
    result = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);
    //
    return result;
  },

  year: function(date)
  {
    // Year(ex. 2017)
    // .date, 來源數值(Date 型態).
    // 傳回值 : 西元年份(數字).
    var result = date.getFullYear();
    return result;
  },

  month: function(date)
  {
    // Month(1-12)
    // .date, 來源數值(Date 型態).
    // 傳回值 : 月份(數字).
    var result = date.getMonth() + 1; // getMonth() 是傳回月份沒錯但是由 0 開始, 火星人發明的規則
    return result;
  },

  day: function(date)
  {
    // Days(1-31)
    // .date, 來源數值(Date 型態).
    // 傳回值 : 日數(數字).
    var result = date.getDate(); // Days between 1 and 31, getDay() 為傳回當日是當週的第幾天, 不是傳回當月的日數
    return result;
  },

  hour: function(date)
  {
    // Hours(0-23)
    // .date, 來源數值(Date 型態).
    // 傳回值 : 時(數字).
    var result = date.getHours(); // Hours between 0 and 23
    return result;
  },

  minute: function(date)
  {
    // Minutes(0-59)
    // .date, 來源數值(Date 型態).
    // 傳回值 : 分(數字).
    var result = date.getMinutes(); // Minutes between 0 and 59.
    return result;
  },

  second: function(date)
  {
    // Seconds(0-59)
    // .date, 來源日期/時間.
    // 傳回值 : 秒(數字).
    var result = date.getSeconds(); // Seconds between 0 and 59.
    return result;
  },

  // NewDate = DateTimes.addDays(DateTimes.now(), 1); // 今天加 1 天
  // NewDate = DateTimes.addDays(OldDate, 1); // 日期加 1 天
  addDays: function(dateValue, days)
  {
    // 天數增減
    // .dateValue, Date 型態數值.
    // .days, 天數, 可為正/負值.
    // Date()
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    // Date ＞ setDate()
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate
    // Dates
    // https://momentjs.com/
    // toDate()
    // moment-develop\src\test\moment\create.js
    // *moment().add() 
    // return : Date
    var result = moment(dateValue).add(days, "days").toDate();
    return result;
  },

  daysDiff: function(startDate, endDate)
  {
    // 天數差異
    // .startDate, 開始日期/時間(Date 型態).
    // .endDate, 結束日期/時間(Date 型態).
    var start, end;
    //
    start = moment(startDate);
    end = moment(endDate);
    result = end.diff(start, "days"); // 結束時間距離開始時間的天數
    //
    return result;
  },

  isLocalDateTime: function(value)
  {
    // 是否為 Local 格式的日期或日期/時間數值
    // .value, 來源數值(string).
    var result = (value.length == DateTimes.LENGTH_LocalDate) || (value.length == DateTimes.LENGTH_LocalDateTime);
    return result;
  },

  isDateTime: function(value)
  {
    // 是否為西元格式的日期或日期/時間數值
    // .value, 來源數值(string).
    var result = (value.length == DateTimes.LENGTH_Date) || (value.length == DateTimes.LENGTH_DateTime);
    return result;
  },

  toDate: function(value, options)
  {
    // 日期/時間轉換
    // .value, 來源數值, 日期或日期/時間, 支援 Local 及西元格式.
    // .options(optional), 選項 : 
    // -beforeROC(bool, optional), 是否來源數值為民國前日期, 僅應用於 Local 日期, 預設值為 false.
    // kendo ＞ parseDate
    // https://docs.telerik.com/kendo-ui/api/javascript/kendo/methods/parsedate
    // Date Formatting
    // https://docs.telerik.com/kendo-ui/framework/globalization/dateformatting
    // instanceof
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof
    // 傳回值 : 日期/時間(Date), 若來源數值為 Date 型態將直接傳回來源數值, 若來源數值為空值將傳回 null.
    var result = null;
    //
    options = options || {}; // 防呆
    options = $.extend({ beforeROC: false }, options);
    //
    if (value instanceof Date) // 若為 Date 型態直接傳回
      return value;
    if (isEmpty(value))
      return result;
    //
    try
    {
      value = emptyTo(value, "").toString(); // 防呆(空值/字串)
      //
      if (DateTimes.isLocalDateTime(value)) // 民國日期或日期/時間
      {
        throw new Error("尚未支援(Local DateTime).");
      }
      else if (DateTimes.isDateTime(value)) // 西元日期或日期/時間
      {
        if (value.length == DateTimes.LENGTH_Date)
          result = kendo.parseDate(value + "000000", DateTimes.FORMAT_DateTime);
        else
          result = kendo.parseDate(value, DateTimes.FORMAT_DateTime);
      }
      else if ((value.Length == DateTimes.LENGTH_Time) || (value.Length == DateTimes.LENGTH_ShortTime)) // 時間(時分, 時分秒), 日期未指定, 使用當日日期進行日期時間轉換
      {
        throw new Error("尚未支援(Time).");
      }
      else
      {
        throw new Error("日期/時間格式不符無法識別.");
      }
      // 轉換檢核
      // *kendo.parseDate() 若轉換不合法將傳回 null 表示傳入值不合法.
      if (isEmpty(result))
        throw new Error("日期/時間格式不合法.");
    }
    catch (err)
    {
      alertError(stringFormat("日期/時間轉換有誤('{0}', {1}), " + err + ".", [value, options.beforeROC]));
    }
    //
    return result;
  },

  padStart: function(value, targetLength, padString)
  {
    // 填滿左方字元長度
    // .value, 原始數值.
    // .targetLength, 填滿結果長度.
    // .padString, 填滿字串.
    // *Moron Chrome not support string.padStart/padEnd.
    var result = value;
    //
    padString = (isEmpty(padString)) ? " " : padString; // 無填充字元預設使用空白字元
    while (result.length < targetLength)
      result = padString + result;
    if (result.length > targetLength && result.length > value.length) // 填滿超出長度者移除, 但原始數值除外(保留原值內容)
      result = result.substr(result.length - targetLength, targetLength);
    //
    return result;
  },

  localizeYear: function(year)
  {
    // Local 年份
    // .year, 年數.
    var result;
    // 
    result = Number(year) - 1911;
    result = DateTimes.padStart(result.toString(), 3, "0");
    //
    return result;
  },

  dateString: function(value, localize)
  {
    // 傳回西元日期(ex. 20180101)
    // .value, 來源數值(Date 型態).
    // .localize(bool, optional), 是否取得 Local 日期格式, 預設值為 false.
    // *取得目前日期需使用 DateTimes.dateString(new Date()) 格式.
    // *因為日期/時間元件若未輸入則值將為 null, 因此呼叫此函式若傳入 null 將不預設使用 new Date() 否則將不正確取得目前日期/時間.
    // 傳回值 : 日期字串(西元日期如 20180101, Local 日期如 1070101), 若來源數值為 undefined 則傳回目前日期, 若來源數值為 null 則傳回空白("").
    var shortTime = false;
    //
    return DateTimes._datetimeString("date", value, shortTime, localize, {})
  },

  datetimeString: function(value, shortTime, localize)
  {
    // 傳回西元日期/時間(ex. 20180101235959)
    // .value, 來源數值(Date 型態).
    // .shortTime(bool, optional), 是否時間使用時/分格式, 預設值為 false.
    // .localize(bool, optional), 是否取得 Local 日期格式, 預設值為 false.
    // *取得目前日期/時間需使用 DateTimes.datetimeString(new Date()) 格式.
    // *因為日期/時間元件若未輸入則值將為 null, 因此呼叫此函式若傳入 null 將不預設使用 new Date() 否則將不正確取得目前日期/時間.
    // 傳回值 : 日期/時間字串(西元日期/時間如 20180101235959, Local 日期/時間如 1070101235959), 若來源數值為 undefined 則傳回目前日期/時間, 若來源數值為 null 則傳回空白("").
    return DateTimes._datetimeString("datetime", value, shortTime, localize, {})
  },

  _datetimeString: function(type, value, shortTime, localize, options)
  {
    // *限內部使用.
    // .type, 傳回值類型("date" 或 "datetime").
    // .value, 日期/時間(DateTime 型態).
    // .shortTime(bool), 是否時間使用時/分格式.
    // .localize(bool), 是否日期傳回 Local 格式.
    // .options, 其他選項(目前保留)
    // undefined
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined
    // Difference between null and undefined
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null
    // Date
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/prototype
    //*因為日期/時間元件若未輸入則值將為 null, 因此呼叫此函式若傳入 null 將不預設使用 new Date() 否則將不正確取得目前日期/時間.
    var result = "";
    var year, month, day, hours, minutes, seconds;
    //
    if (value === undefined) // 若未指定則預設目前時間(模擬函式 overload, 與元件未輸入的 null 不同)
      value = new Date();
    if (isEmpty(value)) // 防呆(若為空值直接傳回空白)
      return "";
    //
    options = options || {};
    shortTime = (shortTime == true) ? true : false; // 時分(無秒)
    localize = (localize == true) ? true : false; // Local 日期格式
    value = (!isEmpty(value)) ? value : new Date(); // Date 物件
    year = value.getFullYear(); // getYear 已停用且將傳回非預期年份(2016 but 116...)
    month = value.getMonth() + 1; // getMonth 是傳回月份沒錯但是由 0 開始, 火星人發明的規則
    day = value.getDate(); // getDay 為傳回當日是當週的第幾天, 不是傳回當月的日數
    hours = value.getHours(); // getHours (0-23)
    minutes = value.getMinutes();
    seconds = value.getSeconds();
    // 日期
    if (type == "date" || type == "datetime")
    {
      yearPart = (localize) ? DateTimes.localizeYear(year) : DateTimes.padStart(year.toString(), 4, "0");
      result = yearPart + DateTimes.padStart(month.toString(), 2, "0") + DateTimes.padStart(day.toString(), 2, "0");
    }
    // 時間
    if (type == "datetime" || type == "time")
    {
      result = result + DateTimes.padStart(hours.toString(), 2, "0") + DateTimes.padStart(minutes.toString(), 2, "0");
      if (!shortTime) // 顯示秒
        result = result + DateTimes.padStart(seconds.toString(), 2, "0");
    }
    //
    return result;
  },

  formatDate: function(value)
  {
    // 顯示西元日期格式(ex. 2016/01/01)
    // .value, 日期或日期/時間, 支援 Local 及 DateTime 等數值型態.
    // *若需取得日期數值格式(ex. 20170101), 請使用 dateString(), datetimeString() 等函式.
    return DateTimes._formatDateTime("date", value, undefined, false);
  },

  formatLocalDate: function(value)
  {
    // 顯示 Local 日期格式(ex. 105/01/01)
    // .value, 日期或日期/時間, 支援 Local 及 DateTime 等數值型態.
    // *若需取得日期數值格式(ex. 20170101), 請使用 dateString(), datetimeString() 等函式.
    return DateTimes._formatDateTime("date", value, undefined, true);
  },

  formatDateTime: function(value, shortTime)
  {
    // 顯示西元日期/時間格式(ex. 2016/01/01 13:01 或 2016/01/01 13:01:59)
    // .value, 日期/時間, 支援 Local 及 DateTime 等數值型態.
    // .shortTime(bool), 是否時間使用時/分格式.
    // *若需取得日期數值格式(ex. 20170101), 請使用 dateString(), datetimeString() 等函式.
    return DateTimes._formatDateTime("datetime", value, shortTime, false);
  },

  formatLocalDateTime: function(value, shortTime)
  {
    // 顯示 Local 日期/時間格式(ex. 105/01/01 13:01 或 105/01/01 13:01:59)
    // .value, 日期/時間, 支援 Local 及 DateTime 等數值型態.
    // .shortTime(bool), 是否時間使用時/分格式.
    // *若需取得日期數值格式(ex. 20170101), 請使用 dateString(), datetimeString() 等函式.
    return DateTimes._formatDateTime("datetime", value, shortTime, true);
  },

  _formatDateTime: function(type, value, shortTime, localize, options)
  {
    // *限內部使用.
    // .type, 傳回值類型("date" 或 "datetime").
    // .value, 日期/時間, 支援 Local 及 DateTime 等數值型態.
    // .shortTime(bool), 是否時間使用時/分格式.
    // .localize(bool), 是否日期傳回 Local 格式.
    // .options, 其他選項(目前保留)
    var result = value;
    var newDate = undefined;
    var yearPart;
    var bDate, bDateTime;
    var bDateValue, bFormattedValue = false;
    //
    options = options || {};
    shortTime = (shortTime == true) ? true : false; // 時分(無秒)
    localize = (localize == true) ? true : false; // Local 日期格式
    bDate = (type == "date"); // 傳回日期
    bDateTime = (type == "datetime"); // 傳回日期/時間
    if (isEmpty(value))
      return "";
    //
    bDateValue = (value instanceof Date);
    if (bDateValue)
      newDate = value; // 來源數值已為 Date 物件
    else
      bFormattedValue = (value.indexOf(" ") != -1 || value.indexOf("/") != -1 || value.indexOf(":") != -1 || value.indexOf("UTC+") != -1); // 來源數值非 Date 物件, 如 DateTime 原始字串格式數值 "Fri Nov 4 00:00:00 UTC+0800 2016" 等
    // 
    if (bDateValue || bFormattedValue)
    {
      var newDate = (newDate != undefined) ? newDate : new Date(value); // Date 物件, 來源數值或 DateTime 原始字串格式數值轉型
      var year = newDate.getFullYear(); // getYear 已停用且將傳回非預期年份(2016 but 116...)
      var month = newDate.getMonth() + 1; // getMonth 是傳回月份沒錯但是由 0 開始, 火星人發明的規則
      var day = newDate.getDate(); // getDay 為傳回當日是當週的第幾天, 不是傳回當月的日數
      var hours = newDate.getHours(); // getHours (0-23)
      var minutes = newDate.getMinutes();
      var seconds = newDate.getSeconds();
      //
      if (year == 1 && month == 1 && day == 1) // 不可能值顯示空白, 因為 DateTime (not null) 欄位屬性在 EditorTemplates 的 Model 將非預期使用 Min 做為預設值.
        return "";
      yearPart = (localize) ? DateTimes.localizeYear(year) : DateTimes.padStart(year.toString(), 4, "0");
      result = yearPart + "/" + DateTimes.padStart(month.toString(), 2, "0") + "/" + DateTimes.padStart(day.toString(), 2, "0");
      if (bDateTime) // 顯示時間
      {
        result = result + " " + DateTimes.padStart(hours.toString(), 2, "0") + ":" + DateTimes.padStart(minutes.toString(), 2, "0");
        if (!shortTime) // 顯示秒
          result = result + ":" + DateTimes.padStart(seconds.toString(), 2, "0");
      }
    }
    else
    {
      // Date, Date/Time string, not formatted.
      if (value.length == 8)
      {
        yearPart = value.substr(0, 4);
        yearPart = (localize) ? DateTimes.localizeYear(yearPart) : DateTimes.padStart(yearPart, 4, "0");
        result = yearPart + "/" + value.substr(4, 2) + "/" + value.substr(6, 2);
      }
      else if (value.length == 14)
      {
        yearPart = value.substr(0, 4);
        yearPart = (localize) ? DateTimes.localizeYear(yearPart) : DateTimes.padStart(yearPart, 4, "0");
        result = yearPart + "/" + value.substr(4, 2) + "/" + value.substr(6, 2); // 2016 12 31 120000
        if (bDateTime) // 顯示時間
        {
          result = result + " " + value.substr(8, 2) + ":" + value.substr(10, 2);
          if (!shortTime) // 顯示秒
            result = result + ":" + value.substr(12, 2);
        }
      }
      else if (value.length == 7)
        result = value.substr(0, 3) + "/" + value.substr(3, 2) + "/" + value.substr(5, 2); // 105 12 31 
      else if (value.length == 13)
      {
        result = value.substr(0, 3) + "/" + value.substr(3, 2) + "/" + value.substr(5, 2); // 105 12 31 120000
        if (bDateTime) // 顯示時間
        {
          result = result + " " + value.substr(7, 2) + ":" + value.substr(9, 2);
          if (!shortTime) // 顯示秒
            result = result + ":" + value.substr(11, 2);
        }
      }
    }
    //
    return result;
  }
});

var Grids = function()
{
  // *限內部使用, 應用程式端請勿使用.
  this._scrollOffset = new Array(), // Grid 元件 scroll 註記
  this._member = null; // member
  //
  this.DATACHANGES_Create = "create";
  this.DATACHANGES_Update = "update";
  this.DATACHANGES_Destroy = "destroy";
  this.DATACHANGES_Current = "current";
  this.DATACHANGES_Unchanged = "unchanged";
  // 資料項目狀態, equals to HISConst.ROWSTATECODE_Add, etc.
  this.ROWSTATECODE_Add = "A";
  this.ROWSTATECODE_Delete = "D";
  this.ROWSTATECODE_NoChange = "N";
  this.ROWSTATECODE_Update = "U";
};

$.extend(Grids.prototype,
{
  showError: function(e)
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
      alert("Grid 執行發生錯誤：" + extractAjaxError(error));
  },

  requestStart: function(e)
  {
    // RequestStart 事件處理函式 - Grid 元件
    // *Read Action 時(e.type = "read")不提示.
    if (e.type == Grids.DATACHANGES_Update || e.type == Grids.DATACHANGES_Create || e.type == Grids.DATACHANGES_Destroy)
      notifyMessage("資料儲存中...");
  },

  requestEnd: function(e)
  {
    // RequestEnd 事件處理函式 - Grid 元件
    // .e.type, CRUD 正確完成時存在, 數值同 Action 類型(如 "read", "create", "update", "destroy" 等). 若 Action 執行發生錯誤 e.type 屬性將不存在(undefined).
    // .e.response.Errors, 若發生錯誤值將存在, 否則為空值(null).
    // RequestEnd(System.String)
    // http://docs.telerik.com/aspnet-mvc/api/Kendo.Mvc.UI.Fluent/DataSourceEventBuilder#methods-RequestEnd(System.String)
    // kendo.data.DataSource ＞ requestEnd
    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#events-requestEnd
    // *若 Action 執行發生錯誤亦將觸發 Grid 元件的 RequestEnd 事件, 唯 e.type 屬性將不存在(undefined).
    if (e.response && isEmpty(e.response.Errors))
    {
      if (e.type == Grids.DATACHANGES_Update)
        notifyMessage("修改儲存完成");
      if (e.type == Grids.DATACHANGES_Create)
        notifyMessage("新增儲存完成");
      if (e.type == Grids.DATACHANGES_Destroy)
        notifyMessage("刪除儲存完成");
    }
  },

  //
  // 示範 : 
  //
  //  var grid;
  //  var addItem;
  //  //
  //  grid = $("#XXX").data("kendoGrid");
  //  addItem = { Column1: "Value1", Column2: "Value2" }; // 新增記錄內容
  //  addItem = Grids.addDataItem(grid, addItem);
  //  ...
  //
  //  注意 : 若欄位設定為 model.Id() 則該欄位必須有值, 否則將引發例外 - 'UniqueID is not defined'.
  //
  addDataItem: function(grid, dataItem)
  {
    // 新增資料項目
    // .grid, Grid 元件(Widget).
    // .dataItem, 來源資料.
    // *此函式自動填入 UniqueID (個體內建唯一鍵值屬性).
    // kendo.data.DataSource ＞ add
    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-add
    // *傳回值 : 新增的資料項目物件(元件資料格式, 與來源資料不同).
    var result;
    //
    dataItem.UniqueID = Kendos.uniqueId(); // 填入 UniqueID (個體內建唯一鍵值屬性), 否則將引發例外 - 'UniqueID is not defined'. 若使用 model.Id(m => m.UniqueID).
    result = grid.dataSource.add(dataItem);
    //result.UniqueID = ... 加入記錄後可再修改欄位值, 但若欄位設定為 model.Id() 則該欄位修改將無作用.
    //
    return result;
  },

  //
  // 示範
  //
  //   YourMethod: function(e)
  //   {
  //     var grid;
  //     var dataItem;
  //     //
  //     grid = ...;
  //     dataItem = grid.dataSource.getByUid(e.uid);
  //     //
  //     try
  //     {
  //       Grids.beginUpdate({ sender: grid });
  //       // 
  //       dataItem.set("Column1", Value1);
  //       dataItem.set("Column2", Value2);
  //     }
  //     finally
  //     {
  //       Grids.endUpdate({ sender: grid });
  //     }
  //   },
  //
  beginUpdate: function(e)
  {
    // Grid 更新開始
    // .e, 事件參數物件.
    // -sender, Grid 元件(Widget).
    // *此函式為還原 Grid 元件 scroll 等狀態使用.
    // *此函式為作業使用 model.set() 函式寫入欄位屬性值之前使用, 因為 model.set() 函式寫入欄位屬性時將同時更新 Grid 元件顯示畫面(Grid 元件原 scroll, focus 狀態皆將遺失).
    // kendo.ui.Grid ＞ set
    // http://docs.telerik.com/kendo-ui/api/javascript/data/model#methods-set
    // Restore Scroll Positions
    // https://docs.telerik.com/kendo-ui/controls/data-management/grid/appearance#restore-scroll-positions
    var grid = e.sender;
    var container;
    var scrollOffset = Grids._scrollOffset[grid];
    //
    if (isEmpty(scrollOffset)) // 防呆(空值), 若第一次執行 beginUpdate.
    {
      scrollOffset = { left: 0, top: 0 };
      Grids._scrollOffset[grid] = scrollOffset; // 加入 Grid 元件 scroll 註記
    }
    //
    container = e.sender.wrapper.children(".k-grid-content"); // or ".k-virtual-scrollable-wrap"
    scrollOffset.left = container.scrollLeft();
    scrollOffset.top = container.scrollTop(); // use only if virtual scrolling is disabled
  },

  //
  // 示範
  //
  //   YourMethod: function(e)
  //   {
  //     var grid;
  //     var dataItem;
  //     //
  //     grid = ...;
  //     dataItem = grid.dataSource.getByUid(e.uid);
  //     //
  //     try
  //     {
  //       Grids.beginUpdate({ sender: grid });
  //       // 
  //       dataItem.set("Column1", Value1);
  //       dataItem.set("Column2", Value2);
  //     }
  //     finally
  //     {
  //       Grids.endUpdate({ sender: grid });
  //     }
  //   },
  //
  endUpdate: function(e)
  {
    // Grid 更新結束
    // *此函式為還原 Grid 元件 scroll 等狀態使用.
    // *此函式為作業使用 model.set() 函式寫入欄位屬性值之後使用, 因為 model.set() 函式寫入欄位屬性時將同時更新 Grid 元件顯示畫面(Grid 元件原 scroll, focus 狀態皆將遺失).
    // kendo.ui.Grid ＞ set
    // http://docs.telerik.com/kendo-ui/api/javascript/data/model#methods-set
    // Restore Scroll Positions
    // https://docs.telerik.com/kendo-ui/controls/data-management/grid/appearance#restore-scroll-positions
    var grid = e.sender;
    var container;
    var scrollOffset = Grids._scrollOffset[grid];
    //
    if (isEmpty(scrollOffset)) // 防呆(空值), 如前方未加入 Grid 元件 scroll 註記
      return;
    //
    container = e.sender.wrapper.children(".k-grid-content"); // or ".k-virtual-scrollable-wrap"
    container.scrollLeft(scrollOffset.left);
    container.scrollTop(scrollOffset.top); // use only if virtual scrolling is disabled
  },

  clearData: function(grid)
  {
    // 清除 Grid 資料(包括刪除部份)
    // .grid, Grid 元件(Widget).
    grid.dataSource._destroyed = new Array();
    grid.dataSource.data([]);
  },

  //
  // 示範 : 
  //
  //  Grid1_Edit: function(e)
  //  {
  //    var grid = e.sender;
  //    var isNew;
  //    //
  //    Grids.edit(e); // 預設 edit 事件處理函式
  //    // 指定欄位唯讀(若為舊有記錄)
  //    isNew = Grids.isNew(e);
  //    if (isNew)
  //    {
  //      // 新記錄
  //      ...
  //    }
  //    else
  //    {
  //      // 舊有記錄
  //      Grids.closeCell(e, "Column1, Column2");
  //    }
  //  },
  //
  //  Grid2_Edit: function(e)
  //  {
  //    var allowEdit;
  //    var sKey1, sKey2;
  //    //
  //    Grids.edit(e); // 預設 edit 事件處理函式
  //    //
  //    sKey1 = "...";
  //    sKey2 = "...";
  //    allowEdit = (!isEmpty(sKey1) && !isEmpty(sKey2));
  //    if (!allowEdit)
  //    {
  //      Grids.closeCell(e); // Grid 唯讀
  //      return;
  //    }
  //    ...
  //  },
  //
  closeCell: function(e, columns)
  {
    // *限 incell 編輯模式的 edit 事件使用.
    // 停用欄位編輯(等同欄位唯讀)
    // .e, edit 事件參數物件.
    // .columns, 欄位名稱, 欄位間以逗號(,)區隔, 如 "Column1", "Column1, Column2" 等.
    // Grid ＞ Configuration ＞ Model ＞ DefaultValue(), Editable()
    // http://docs.telerik.com/aspnet-mvc/helpers/grid/configuration#model
    // kendo.ui.Grid ＞ closeCell
    // http://docs.telerik.com/kendo-ui/api/javascript/ui/grid#methods-closeCell
    // ... Stops editing the table cell which is in edit mode. Requires "incell" edit mode.
    //     When keyboard navigation is used, the Grid table must be focused programmatically after calling closeCell. ...
    // *closeCell() 函式為 Client 端動態條件設定欄位唯讀使用, 若欄位永久或固定條件唯讀則可使用 .Model(model => { model.Field(field => field.Column1).Editable(false); }) 方式.
    // *不使用 ＄（"#Column1"）.attr（"readonly", "readonly"）; 方式.
    var grid = e.sender;
    var column, fieldName;
    var columnIndex;
    var closeCell = false;
    //
    if (columns)
    {
      // 指定欄位唯讀
      columnIndex = Grids.getColumnIndex(e);
      fieldName = grid.columns[columnIndex].field;
      columns = columns.split(',');
      for (var I = 0; I < columns.length; I++)
      {
        column = $.trim(columns[I]); // trim
        closeCell = (closeCell || fieldName.toLowerCase() == column.toLowerCase());
      }
    }
    else
    {
      // 未指定欄位表示設定 Grid 唯讀
      closeCell = true;
    }
    //
    if (closeCell)
    {
      grid.closeCell();
      grid.table.focus();
    }
  },

  checkEndEditAndHasChanges: function(grid, currentData)
  {
    // 是否資料異動完成
    // .grid, Grid 元件(Widget).
    // .currentData(object, optional), 資料來源內容, 可不傳入將自動由 Grid 元件 dataSource.data() 方法取得.
    // *注意 : endEdit() 的判斷必須置於 hasChanges() 之前, 因為新增記錄未完成編輯(驗證錯誤存在)將無法由 Grid 判定為異動存在.
    // *傳回值 : 若傳回 true 表示資料異動完成, 否則為 false (資料異動未完成或無資料異動).
    var endEdit, hasChanges;
    //
    currentData = (currentData) ? currentData : grid.dataSource.data(); // 資料來源資料內容(若未傳入則自動由 Grid 元件讀取)
    endEdit = Grids.endEdit(grid, currentData);
    hasChanges = Grids.hasChanges(grid, currentData);
    if (!endEdit)
    {
      Grids.promptEndEdit();
      return false;
    }
    else if (!hasChanges)
    {
      Grids.promptHasChanges();
      return false;
    }
    //
    return true;
  },

  expandRow: function(e, options)
  {
    // 展開資料列
    var masters, detailContainers;
    var master, detail;
    var icon;
    //
    options = options || {};
    options = $.extend({ autoExpand: true, detailContainerMode: false }, options);
    //
    masters = e.sender.tbody.children(".k-master-row"); // master(s) 列元素
    for (var I = 0; I < masters.length; I++)
    {
      master = masters[I];
      // 展開 Detail, 因為若未展開則 Detail 元素將不加入而找不到(因為根本不存在, Moron Grid behaviour).
      e.sender.expandRow(master);
      // 使用 Detail Container 模式, Detail 內容必須包含於 div class = "grid-detail-container" 否則將認定 Detail 內容空白而不呈現(隱藏, 包括展開圖示等).
      if (options.detailContainerMode)
      {
        detail = $(master).nextAll(".k-detail-row:first"); // detail 列元素, nextAll() instead, Moron next() get the next master ( ... only if it matches that selector ... )
        detailContainers = $(detail).find(".grid-detail-container"); // 取得 Detail Container 元素
        if (detailContainers.length <= 0)
        {
          icon = $(master).children("td:first").children(".k-i-collapse"); // Detail Container 元素不存在則隱藏展開圖示
          $(icon).addClass("hide");
          e.sender.collapseRow(master); // 收合 Detail
        }
      }
    }
  },
  
  //
  // 示範 : 
  //
  //   Javascript
  //
  //     CheckButton_Click: function(e)
  //     {
  //       // ...
  //       var YourGrid = ...;
  //       var viewRow;
  //       //
  //       viewRow = Grids.getViewRow(YourGrid, 1);
  //       ...
  //     },
  // 
  //   *注意 : YourGrid 等元件命名僅為示範, 請自行修改為實際元件名稱.
  //
  getViewRow: function(grid, rowNumber)
  {
    // 取得顯示資料項目(Grid 顯示順序)
    // .grid, Grid 元件(Widget).
    // .rowNumber, 列號(由 1 開始), 如 1 表示第一筆.
    // 傳回值 : 顯示資料項目, 若無符合顯示資料項目將傳回空值(null).
    var result = null;
    var view;
    //
    rowNumber = Number(rowNumber);
    view = grid.dataSource.view(); // 目前頁次資料檢視物件
    if (view.length >= rowNumber)
      result = view[rowNumber - 1];
    //
    return result;
  },
  
  //
  // 示範 : 
  //
  //   Javascript
  //
  //     ProductGrid_DataBound: function(e)
  //     {
  //       // DataBound 事件 - XXXXX
  //       var DetailGrid = ...;
  //       var isDetailChanged;
  //       //
  //       Grids.dataBound(e); // 預設 dataBound 事件處理函式(必要)
  //       //
  //       isDetailChanged = Grids.hasChanges(DetailGrid);
  //       if (!isDetailChanged) // Grid Remove 指令將觸發 DataBound 事件
  //       {
  //         Grids.clearData(DetailGrid); // 防呆
  //         Grids.selectRow(e.sender, 1); // 預設選擇第一筆記錄
  //       }
  //     },
  // 
  //   *注意 : YourGrid 等元件命名僅為示範, 請自行修改為實際元件名稱.
  //
  selectRow: function(grid, rowNumbers)
  {
    // 選擇記錄列
    // .grid, Grid 元件(Widget).
    // .rowNumber, 列號(由 1 開始), 支援整數及 Array, 如 1 表示第一筆, [1, 2] 表示第一/二筆.
    // kendo.ui.Grid ＞ select
    // https://docs.telerik.com/kendo-ui/api/javascript/ui/grid/methods/select
    // *此函式為延伸 Grid 元件 select() 函式.
    var rowNumber;
    var row;
    //
    rowNumbers = (Array.isArray(rowNumbers)) ? rowNumbers : [rowNumbers];
    for (var I = 0; I < rowNumbers.length; I++)
    {
      rowNumber = Number(rowNumbers[I]);
      rowNumber = rowNumber - 1;
      row = "tr:eq(" + rowNumber + ")"; // ex. tr:eq(0), etc.
      grid.select(row);
    }
  },

  //
  // 示範 : 
  //
  //   Bound(c => c.Gender).ClientTemplate("#: Grids.findSelectText(Gender, 'Gender') #")
  //
  //   *ASP.NET MVC View : 
  //    -若無使用 ClientTemplate 自訂語法則直接使用 Bound(c => c.Gender).SelectText() 方式.
  //    -若提供編輯欄位設定選項來源則使用 SelectViewData() 方法.
  //    -若需自行組成 ClientTemplate 語法可使用 GridUtils.SelectTextClientTemplate() 方法.
  //
  findSelectText: function(value, name)
  {
    // 傳回選項代碼的文字
    // .value, 代碼值.
    // .name, 欄位名稱或選項名稱.
    // kendo.data.DataSource ＞ data
    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-data
    var result = "(" + value + ")"; // 預設傳回值(提示格式)
    var element = (name) ? $("#" + name.toLowerCase() + "selection") : undefined; // 選項元件名稱(與 Layout 內建選項元件命名規則一致), ex. Type1 = Type1Selection.
    var list = (isValidObject(element)) ? $(element).data("kendoDropDownList") : undefined;
    var data;
    var dataItem;
    //
    if (isEmpty(value)) // 空值直接傳回
      return "";
    if (!(list)) // 忽略無符合選項來源物件者
      return result;
    //
    data = list.dataSource.data();
    for (var I = 0; I < data.length; I++)
    {
      dataItem = list.dataItem(I);
      if (dataItem.Value == value) // Value 屬性 : 為 SelectListItem.Value 的屬性名稱, Text 屬性亦同.
      {
        result = dataItem.Text;
        break;
      }
    }
    //
    return result;
  },

  findGrid: function(sender)
  {
    // 取得目前元素隸屬 Grid 元件(Widget)
    // .sender, 目前元素, 如 checkbox 元素.
    // *元素階層如 : 
    //  <... class='k-widget k-grid' ... ＞
    //    <... ＞
    //      ...
    //        < 目前元素 ＜＞
    // *注意 : 目前元素必須為置於 Grid 元件內的元素, 否則將無法取得或取得非隸屬的 Grid 元件. 如動態顯示元素隱藏後即無隸屬元件.
    // *傳回值 : 目前元素隸屬 Grid 元件(Widget), 若找不到將傳回 null.
    var result = null;
    var current;
    var id;
    var counter = 1;
    //
    current = sender; // 目前元素
    //
    while (current)
    {
      if (counter >= 1000) // 防呆
        break;
      if ($(current).hasClass("k-grid")) // Grid 類別樣式表示目前元素為 Grid 元素
      {
        result = $(current).data("kendoGrid"); // 取得 Grid 元件(元素已經確定無需再由 ＃id 取得元件)
        break;
      }
      current = $(current).parent();
      counter++;
    }
    //
    return result;
  },

  parseExportColumns: function(grid)
  {
      // 取得匯出欄位屬性
      // .grid, Grid 元件(Widget).
      // .columnName, 欄位名稱(無區分大小寫).
      // 傳回值 : 匯出欄位屬性(JSON 物件, 鍵值名稱為欄位名稱小寫), 包括欄位名稱/索引/template(格式化部份) 等.
      //         匯出欄位屬性 - field(欄位名稱/原始大小寫), cellIndex(匯出欄位索引), template(格式化語法).
      var result = {};
      var thead = grid.thead; // Grid 欄位標題主要元素
      var tr = thead.children(0);
      var headers = tr.children(); // Grid 各欄位標題元素
      var template;
      var tagStart, tagEnd;
      var indexStart, indexEnd;
      var cellIndex = 0;
      //
      for (var header = 0; header < headers.length; header++)
      {
          var loopHeader = headers[header]; // 欄位標題元素
          var loopFieldName = emptyTo($(loopHeader).attr("data-field"), ""); // 欄位名稱(維持原大小寫), 若 field 屬性為空值表示非 Bound 欄位(如 Command, Hidden, Template 等)
          var visible = $(loopHeader).is(":visible"); // 欄位可見性, 若 Bound 欄位隱藏即不列入匯出欄位
          if (isEmpty(loopFieldName) || !visible) // 忽略非匯出欄位(非 Bound 欄位[含 Bound 欄位隱藏])
              continue;
          //
          template = ""; // 清除前項內容
          for (var col = 0; col < grid.columns.length; col++)
          {
              var loopColumn = grid.columns[col];
              var loopColumnField = emptyTo(loopColumn.field, ""); // 欄位名稱, 若 field 屬性為空值表示非 Bound 欄位(如 Command, Hidden, Template 等)
              var loopTemplate = emptyTo(loopColumn.template, "");
              if (loopFieldName.toLowerCase() != loopColumnField.toLowerCase()) // 忽略不同欄位名稱
                  continue;
              if (isEmpty(loopTemplate))
                  continue;
              // 下拉選項 template
              // ex. template : "#: Grids.findSelectText(CancerType, 'CancerType') #", etc.
              tagStart = "#: Grids.findSelectText(";
              tagEnd = ") #";
              if (loopTemplate.indexOf(tagStart) != -1)
              {
                  indexStart = loopTemplate.indexOf(tagStart);
                  indexEnd = loopTemplate.indexOf(tagEnd);
                  if (indexStart != -1 && indexEnd != -1)
                      template = loopTemplate.substring(indexStart, indexEnd + tagEnd.length); // 取得原欄位 Template 中格式化部份, 不含其他自訂 Html 語法部份.
              }
              // 日期格式化 template
              // ex. template : "#= DateTimes.formatDate(CreateDate, false) #", etc.
              tagStart = "#= DateTimes.formatDate(";
              tagEnd = ") #";
              if (loopTemplate.indexOf(tagStart) != -1)
              {
                  indexStart = loopTemplate.indexOf(tagStart);
                  indexEnd = loopTemplate.indexOf(tagEnd);
                  if (indexStart != -1 && indexEnd != -1)
                      template = loopTemplate.substring(indexStart, indexEnd + tagEnd.length);
              }
              // 日期/時間格式化 template
              // ex. template : "#= DateTimes.formatDateTime(CreateDateTime, false) #", etc.
              tagStart = "#= DateTimes.formatDateTime(";
              tagEnd = ") #";
              if (loopTemplate.indexOf(tagStart) != -1)
              {
                  indexStart = loopTemplate.indexOf(tagStart);
                  indexEnd = loopTemplate.indexOf(tagEnd);
                  if (indexStart != -1 && indexEnd != -1)
                      template = loopTemplate.substring(indexStart, indexEnd + tagEnd.length);
              }
          }
          //
          result[loopFieldName.toLowerCase()] = { field: loopFieldName, cellIndex: cellIndex, template: template }; // 加入匯出欄位屬性
          cellIndex++;
      }
      //
      return result;
  },

  parseExportCells: function(grid)
  {
      // 解析匯出儲存格屬性
      // 傳回值 : 匯出儲存格屬性(Array), 欄位順序同 cells 屬性索引順序.
      var result = new Array();
      var columns;
      var index = 0;
      //
      columns = Grids.parseExportColumns(grid); // 取得匯出欄位屬性
      $.each(columns, function(key, value)
      {
          result.push({}); // 加入相同個數項目
      });
      $.each(columns, function(key, value)
      {
          result[value.cellIndex] = value; // 填入項目至相同索引位置
      });
      //
      return result;
  },

  getByUid: function(grid, uid)
  {
    // 取得資料項目 - 使用 uid
    // .grid, Grid 元件(Widget).
    // .uid, 資料項目唯一代碼(Kendo UI 內建提供).
    // kendo.data.DataSource ＞ getByUid
    // https://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-getByUid
    // *此函式為 Grid.dataSource.getByUid() 函式的延伸函式(作用同原函式, 建議使用此延伸函式).
    // 傳回值 : 資料項目(使用 uid), 若不存在將傳回 null (如傳入不正確的 uid 等).
    var result = grid.dataSource.getByUid(uid);
    return result;
  },

  getUid: function(row)
  {
    // 取得資料列元素 uid (記錄唯一代碼)
    // .row, 列元素.
    // *資料項目 uid 為 Grid 元件 Client 端使用(同 Guid 每次不同).
    // *資料項目列元素 data-uid 屬性為 Grid 元件資料列元素內建屬性(值等同 model.uid 屬性值).
    // *傳回值 : 資料列元素 Uid (記錄唯一代碼).
    var result = $(row).attr("data-uid");
    return result;
  },

  getColumnIndex: function(e)
  {
    // *限內部使用.
    // *限 edit 事件使用.
    // 取得目前編輯欄位索引
    // kendo.ui.Grid ＞ edit
    // http://docs.telerik.com/kendo-ui/api/javascript/ui/grid#events-edit
    // kendo.ui.Grid ＞ columns
    // http://docs.telerik.com/kendo-ui/api/javascript/ui/grid#fields-columns
    // Programmatically setting column to editable
    // http://www.telerik.com/forums/programmatically-setting-column-to-editable
    // ... [Here] is an example ...
    // http://output.jsbin.com/ULAFABI/1
    // ... Edit in JS Bin ...
    // 注意 : 若 Grid 包含 Locked(true) 欄位則點選欄位時 e.container.index() 將傳回 "欄位索引 - locked 個數", 如第二個欄位(索引: 1) - 一個 locked = 0 而非 1.
    var result;
    var grid = e.sender;
    var context = e.container.context;
    var fieldName;
    var columnIndex = e.container.index();
    var lockedCount = 0;
    //
    result = columnIndex;
    fieldName = grid.columns[columnIndex].field;
    ////for (var I = 0; I < grid.columns.length; I++)
    ////{
    ////  var column = grid.columns[I];
    ////  if (column.locked)
    ////    lockedCount = lockedCount + 1; // 累加鎖定欄位個數
    ////}
    ////// 取得實際點選欄位名稱(若有鎖定欄位)
    ////if ((columnIndex + lockedCount) < grid.columns.length) // 防呆(官方或有修正則使用原值)
    ////{
    ////  columnIndex = columnIndex + lockedCount; // 實際欄位索引 = 欄位索引 + 鎖定欄位個數
    ////  fieldName = grid.columns[columnIndex].field;
    ////  result = columnIndex;
    ////}
    //
    return result;
  },

  getCheckValue: function(sender, checked)
  {
    // 取得勾選值
    // .sender, checkbox 元素.
    // .checked(bool), 勾選狀態, 若未傳入表示由 sender.checked 屬性取得勾選狀態.
    // *sender 必須定義 falseValue 及 trueValue 屬性.
    // *傳回值 : 勾選狀態對應的值.
    var result;
    //
    checked = (!isEmpty(checked)) ? checked : sender.checked;
    result = (checked) ? $(sender).attr("trueValue") : $(sender).attr("falseValue");
    result = (!isEmpty(result)) ? result : "";
    //
    return result;
  },

  checkAllCells: function(e)
  {
    // 全部勾選(目前 Grid 頁次)
    // e, 全部勾選元素 click 事件參數 : 
    // -element, 全部勾選元素.
    // -className, Grid 樣式類別, 作用為過濾勾選元素, 可能為空值.
    // -columnName, 欄位名稱(區分大小寫).
    // *全部勾選執行時將忽略勾選隱藏(hide), 勾選停用(disabled)等.
    // *此函式為全部勾選元素的 onclick 事件的預設使用函式.
    var grid;
    var gridElement;
    var elements;
    var selector;
    var columnName, columnNameLower;
    var isRowChecked = isChecked(e.element); // 全部勾選元素的目前勾選狀態
    //
    gridElement = findParent(e.element, "k-grid"); // 取得目前 Grid 元素
    if (!isValidObject(gridElement)) // 防呆
      alertError("Grids.checkAllCells: 找不到 Grid 元素.");
    //
    grid = $(gridElement).data("kendoGrid"); // 取得目前 Grid 元件
    grid.table.focus();
    columnName = emptyTo(e.columnName);
    columnNameLower = columnName.toLowerCase();
    //
    setTimeout(function()
    {
      if (!Grids.endEdit(grid))
      {
        Grids.promptEndEdit();
        if (isRowChecked) // 取消勾選狀態
          checked(e.element, false);
        return false;
      }
      //
      try
      {
        Grids.beginUpdate({ sender: grid });
        //
        selector = emptyTo(e.className, "");
        if (!isEmpty(selector)) // Grid Selector
          selector = "." + selector;
        selector = selector + ".grid-cell-check.grid-cell-" + columnNameLower; // Selector, 目前儲存格勾選元素, 欄位名稱樣式類別使用全小寫(同 CheckBox 欄位 Template)
        elements = $(grid.element).find(selector); // 取得目前 Grid 頁次中全部資料列勾選元素
        for (var I = 0; I < elements.length; I++)
        {
          var loopElement = elements[I];
          if ($(loopElement).hasClass("hide")) // 忽略勾選隱藏
            continue;
          if (!isEmpty($(loopElement).attr("disabled"))) // 忽略勾選停用(disabled)
            continue;
          //
          checked(loopElement, isRowChecked); // 設定勾選狀態
          Grids.keepCheckState(loopElement, { refresh: false }); // 寫入勾選註記(依目前勾選狀態)
        }
      }
      finally
      {
        grid.refresh();
        Grids.endUpdate({ sender: grid });
      }
    }, 100);
  },

  checkAllRows: function(e)
  {
    // 全部勾選(目前 Grid 頁次)
    // e, 全部勾選元素 click 事件參數 : 
    // -element, 全部勾選元素.
    // -className, 自訂樣式類別, 作用為過濾勾選元素, 可能為空值.
    // *全部勾選執行時將忽略勾選隱藏(hide), 勾選停用(disabled)等.
    // *此函式為全部勾選元素的 onclick 事件的預設使用函式.
    var grid;
    var gridElement;
    var elements;
    var selector;
    var isRowChecked = isChecked(e.element); // 全部勾選元素的目前勾選狀態
    //
    gridElement = findParent(e.element, "k-grid"); // 取得目前 Grid 元素
    if (!isValidObject(gridElement)) // 防呆
      alertError("Grids.checkAllRows: 找不到 Grid 元素.");
    //
    grid = $(gridElement).data("kendoGrid"); // 取得目前 Grid 元件
    grid.table.focus();
    //
    setTimeout(function()
    {
      if (!Grids.endEdit(grid))
      {
        Grids.promptEndEdit();
        if (isRowChecked) // 取消勾選狀態
          checked(e.element, false);
        return false;
      }
      //
      try
      {
        Grids.beginUpdate({ sender: grid });
        //
        selector = emptyTo(e.className, "");
        if (!isEmpty(selector)) // Grid Selector
          selector = "." + selector;
        selector = selector + ".grid-row-check"; // Selector, 目前 Grid 資料列勾選元素
        elements = $(grid.element).find(selector); // 取得目前 Grid 頁次中全部資料列勾選元素
        for (var I = 0; I < elements.length; I++)
        {
          var loopElement = elements[I];
          if ($(loopElement).hasClass("hide")) // 忽略勾選隱藏
            continue;
          if (!isEmpty($(loopElement).attr("disabled"))) // 忽略勾選停用(disabled)
            continue;
          //
          checked(loopElement, isRowChecked); // 設定勾選狀態
          Grids.keepCheckState(loopElement, { refresh: false }); // 寫入勾選註記(依目前勾選狀態)
        }
      }
      finally
      {
        grid.refresh();
        Grids.endUpdate({ sender: grid });
      }
    }, 0);
  },

  keepCheckState: function(sender, options)
  {
    // 保持勾選狀態
    // .sender, 記錄列勾選元素.
    // -屬性 : 
    // --grid-columnName, 欄位名稱(同 Model/ViewModel 屬性名稱, 區分大小寫), 一般欄位勾選使用(即非記錄列勾選), 若為記錄列勾選將為空值.
    // .options(optional), 選項 : 
    // -refresh, 是否立即更新顯示, 若為批次資料修改應設定為 false 並由執行端自行執行 Grid.refresh() 函式, 預設值為 true.
    // *此函式為記錄列勾選元素的 onclick 事件的預設使用函式.
    // *記錄列勾選註記屬性 - RowChecked(bool) 為共同勾選狀態 model 物件屬性, 必須於 C# Model/ViewModel 定義.
    var grid;
    var dataItem;
    var columnName, falseValue, trueValue, newValue;
    var checked;
    //
    options = options || {};
    options = $.extend({ refresh: true }, options);
    //
    columnName = emptyTo($(sender).attr("grid-columnName"), ""); // 取得欄位名稱, 一般欄位勾選使用
    falseValue = emptyTo($(sender).attr("falseValue"), ""); // false/true 數值, 一般欄位勾選使用
    trueValue = emptyTo($(sender).attr("trueValue"), "");
    if (isEmpty(falseValue) && isEmpty(trueValue)) // 預設 false/true 數值(若未自訂)
    {
      falseValue = "N";
      trueValue = "Y";
    }
    checked = isChecked(sender);
    dataItem = Grids.getCurrentItemByElement(sender);
    if (!isEmpty(columnName))
    {
      newValue = (checked == true) ? trueValue : falseValue;
      dataItem[columnName] = newValue; // dataItem.set(columnName, newValue); // 
      dataItem.dirty = true; // 明確註記已修改
    }
    else
    {
      newValue = (checked == true);
      dataItem.RowChecked = newValue; // dataItem.set("RowChecked", newValue); // dataItem.RowChecked // 
    }
    // Grid 立即更新顯示
    if (options.refresh)
    {
      grid = Grids.findGrid(sender);
      //
      try
      {
        Grids.beginUpdate({ sender: grid });
        //
        grid.refresh();
      }
      finally
      {
        Grids.endUpdate({ sender: grid });
      }
    }
  },

  parseGridClass: function(gridName)
  {
    // 解析 Grid 元件名稱為樣式類別名稱
    // *取得 Grid 已勾選資料項目元素內建使用 Grid 命名樣式類別(如 ProductsGrid 的 grid-products 等).
    var result;
    //
    result = emptyTo(gridName, "").toString().toLowerCase();
    if (result.endsWith("grid"))
      result = result.substring(0, result.length - 4); // SysM010Grid -> sysm010grid(0, 11 - 4) -> sysm010, etc.
    result = "grid-" + result;
    //
    return result;
  },

  //
  // 示範 : 
  //
  //   Javascript
  //
  //     SaveButton_Click: function(e)
  //     {
  //       var grid;
  //       var elements;
  //       var dataItem;
  //       //
  //       grid = ...;
  //       elements = Grids.getCheckedElements(grid);
  //       if (elements.length <= 0)
  //         ...
  //       //
  //       for (var I = 0; I < elements.length; I++)
  //       {
  //         dataItem = Grids.getDataItemByElement(elements[I]);
  //         ...
  //       }
  //     },
  //
  getCheckedElements: function(grid, selector)
  {
    // 取得 Grid 已勾選資料項目元素
    // .grid, Grid 元件(Widget).
    // .selector(string, optional), 限定資料列 Selector (含樣式類別符號), 如 ".grid-sysm010" 等, 搜尋 Grid 已勾選項目元素使用. 
    //  如傳入 ".grid-sysm010" 則將使用 ".grid-sysm010.grid-row-check:checked" 搜尋 Grid 已勾選項目元素等.
    //  若 Grid 內包含子階層 Grid 則應使用限定資料列 Selector, 否則將非預期連帶取得子階層 Grid 已勾選項目. 預設值為空白.
    //  *資料列 Selector 樣式類別內建使用 Grid 命名樣式類別(如 ProductsGrid 的 grid-products 等).
    // 傳回值 : Grid 已勾選資料項目元素(Element), 若不存在則傳回個數為 0.
    var result;
    //
    selector = emptyTo(selector, "." + Grids.parseGridClass($(grid.element).attr("id")));
    result = $(grid.element).find(selector + ".grid-row-check:checked"); // 目前作用中 Grid 已勾選項目元素
    //
    return result;
  },

  //
  // 示範 : 
  //
  //   Javascript
  //
  //     SaveButton_Click: function(e)
  //     {
  //       var grid;
  //       var dataItems;
  //       //
  //       grid = ...;
  //       dataItems = Grids.getCheckedDataItems(grid);
  //       for (var I = 0; I < dataItems.length; I++)
  //         ...
  //     },
  //
  getCheckedDataItems: function(grid, selector)
  {
    // 取得 Grid 已勾選資料項目
    // .grid, Grid 元件(Widget).
    // .selector(string, optional), 限定資料列 Selector (含樣式類別符號), 如 ".grid-sysm010" 等, 搜尋 Grid 已勾選項目元素使用. 
    //  如傳入 ".grid-sysm010" 則將使用 ".grid-sysm010.grid-row-check:checked" 搜尋 Grid 已勾選項目元素等.
    //  若 Grid 內包含子階層 Grid 則應使用限定資料列 Selector, 否則將非預期連帶取得子階層 Grid 已勾選項目. 預設值為空白.
    //  *資料列 Selector 樣式類別內建使用 Grid 命名樣式類別(如 ProductsGrid 的 grid-products 等).
    // 傳回值 : Grid 已勾選資料項目(model 物件), 若不存在則傳回個數為 0.
    var result;
    var elements;
    //
    elements = Grids.getCheckedElements(grid, selector); // 目前作用中 Grid 已勾選項目元素
    result = Grids.getDataItemByElements(grid, elements);
    //
    return result;
  },

  //
  // 示範 : 
  //
  //   Grid 指令欄位(Command)按下時取得該指令欄位執行時對應的記錄項目.
  //
  //   View
  //
  //     Html.Kendo().Grid(...)
  //       .Name("ProductGrid")
  //       .BasicUsage()
  //       ...
  //       .Columns(columns =>
  //       {
  //         ...
  //         columns.Command(command => { command.Custom("Detail").Click("appm010.DetailButton_Click"); }).Width(GridConst.WIDTH_Command);
  //         ...
  //       })
  //       .DataSource(dataSource => ...
  //
  //   Javascript
  //
  //     DetailButton_Click: function(e)
  //     {
  //       var grid;
  //       var dataItem;
  //       var sValue1;
  //       //
  //       grid = ...;
  //       dataItem = Grids.getCurrentItem(grid, e);
  //       sValue1 = parseValue(dataItem, "Column1");
  //       ...
  //     },
  //
  getCurrentItem: function(grid, e)
  {
    // 取得目前資料項目
    // .grid, Grid 元件.
    // *e, Command 按鈕 Click 事件函式參數等.
    // *注意 : 此 getCurrentItem() 方法為 Command 按鈕欄位按下時取得對應目前記錄項目使用, 
    //         若為取得目前選擇的記錄項目則改用 getSelectedItem() 方法.
    // *傳回值 : 目前資料項目(即 model 物件可直接取得欄位屬性值), 若不存在將傳回 null.
    var result = null;
    var command = e.currentTarget; // Click 事件函式的按鈕元件等.
    //
    result = grid.dataItem($(command).closest("tr")); // 取得記錄 Command 按鈕對應記錄項目
    if (isEmpty(result))
    {
    }
    //
    return result;
  },

  //
  // 示範 : 
  //
  //   Grid 欄位自訂語法(ClientTemplate), checkbox 按下時取得 checkbox 元素對應的記錄項目.
  //
  //   View
  //
  //     Html.Kendo().Grid(...)
  //       .Name("ProductGrid")
  //       .BasicUsage()
  //       ...
  //       .Columns(columns =>
  //       {
  //         ...
  //         columns.Bound(column => column.SaleYN)
  //           .ClientTemplate
  //           (
  //             "<input type='checkbox' falseValue='N' trueValue='Y' value='#: SaleYN #' " +
  //             " # if (SaleYN == 'Y') " +
  //             "   { # " +
  //             "     checked='checked' " +
  //             " # } # " +
  //             " onclick='appm010.setSaleYN(this)' />"
  //           )
  //           .Width(36);
  //         ...
  //       })
  //       .DataSource(dataSource => ...
  //
  //   Javascript
  //
  //     setSaleYN: function(sender)
  //     {
  //       // ...
  //       // .sender, checkbox 元素.
  //       var dataItem;
  //       var sSaleYN;
  //       //
  //       sSaleYN = Grids.getCheckValue(sender);
  //       dataItem = Grids.getCurrentItemByElement(sender);
  //       if (dataItem)
  //       {
  //         dataItem.set("SaleYN", sSaleYN);
  //         ...
  //       }
  //     },
  //
  //     *注意 : dataItem.Column1 = Value1 方式將無作用(修改資料並不會填入 Grid)
  //
  getCurrentItemByElement: function(sender)
  {
    // 取得目前元素對應的資料項目
    // .sender, 目前元素, 如 checkbox 元素.
    // kendo.ui.Grid ＞ dataItem
    // http://docs.telerik.com/kendo-ui/api/javascript/ui/grid#methods-dataItem
    // Make Selection with Checkbox Column
    // http://docs.telerik.com/kendo-ui/controls/data-management/grid/how-to/Selection/grid-selection-checkbox
    // kendo.ui.Grid ＞ set
    // http://docs.telerik.com/kendo-ui/api/javascript/data/model#methods-set
    // *注意 : 
    // -資料項目隸屬目的元素必須存在於 Grid 目前頁次, 否則將不適用(因為該元素已不存在於目前顯示畫面).
    // *傳回值 : 目前元素對應的資料項目.
    var result;
    var grid;
    var row;
    //
    row = $(sender).closest("tr"); // 靠近 input 的 tr (table row)
    grid = Grids.findGrid(sender); // 取得 input 隸屬 Grid 元件
    result = grid.dataItem(row);
    //
    return result;
  },

  //
  // 示範 : 
  //
  //   Javascript
  //
  //     method1: function(sender)
  //     {
  //       // ...
  //       var grid;
  //       var dataItem;
  //       //
  //       grid = ...;
  //       dataItem = Grids.getDataItemByElement(grid, sender);
  //     },
  //
  getDataItemByElement: function(grid, element, options)
  {
    // 取得資料項目 - 資料項目元素
    // .grid, Grid 元件(Widget).
    // .element, 目前元素(s), 如資料列內含的 checkbox 等元素.
    // .options, 選項 : 
    // -element(bool, optional), 附加元素模式, 傳回值包含傳入的目前元素(s), 預設值為 false.
    // *傳回值 : 目前元素對應的資料項目.
    var result;
    var elements;
    //
    elements = new Array();
    elements.push(element);
    result = Grids.getDataItemByElements(grid, elements, options)[0];
    //
    return result;
  },

  //
  // 示範 : 
  //
  //   Javascript
  //
  //     method1: function()
  //     {
  //       // ...
  //       var grid;
  //       var elements;
  //       var dataItems;
  //       //
  //       grid = ...;
  //       elements = ...;
  //       dataItems = Grids.getDataItemByElements(grid, elements);
  //     },
  //
  getDataItemByElements: function(grid, elements, options)
  {
    // 取得目前記錄項目
    // .grid, Grid 元件(Widget).
    // .elements, 目前元素(s), 如資料列內含的 checkbox 等元素.
    // .options, 選項 : 
    // -element(bool, optional), 附加元素模式, 傳回值包含傳入的目前元素(s), 預設值為 false.
    // *傳回值 : 目前元素(s)對應的資料項目.
    var result = new Array();
    var dataItem;
    //
    options = options || {};
    options = $.extend({ element: false }, options);
    for (var I = 0; I < elements.length; I++)
    {
      var loopElement = elements[I];
      //
      dataItem = Grids.getCurrentItemByElement(loopElement);
      if (options.element)
        result.push({ element: loopElement, dataItem: dataItem }); // element/dataItem
      else
        result.push(dataItem); // dataItem only
    }
    //
    return result;
  },

  getPopupEditDataItem: function(grid, element)
  {
    // 取得 Popup Edit 資料項目
    // .grid, Grid 元件(Widget).
    // .element, Popup Edit 的資料輸入元素.
    var result;
    var container;
    var uid;
    //
    container = findParent(element, "k-popup-edit-form"); // 取得 Popup 編輯 container 元素
    uid = $(container).attr("data-uid"); // 取得目前編輯資料項目 uid (Grid 元件 Popup 編輯元素本身提供)
    result = Grids.getByUid(grid, uid); // 取得資料項目(使用 uid)
    //
    return result;
  },

  getDataRows: function(grid, options)
  {
    // 取得資料列元素
    // .grid, Grid 元件(Widget).
    // .options(optional), 選項, 目前保留使用.
    // Iterate the Table Rows
    // https://docs.telerik.com/kendo-ui/controls/data-management/grid/how-to/Layout/style-rows-cells-based-on-data-item-values#iterate-the-table-rows
    // *取得資料項目列元素(含 data-uid 屬性者).
    // *Grid 列元素 k-master-row, k-detail-row 類別樣式僅於 ClientDetailTemplateId 使用時存在且 k-detail-row 僅展開後存在(動態建立).
    // *Grid 列元素 tr.k-detail-row 無 data-uid 屬性.
    // *傳回值 : 資料列元素(s).
    var result;
    //
    options = options || {};
    options = $.extend({}, options);
    result = grid.tbody.children("tr[data-uid]"); // 取得資料項目列元素
    //
    return result;
  },

  removeRowByDataItem: function(grid, dataItem, options)
  {
    // 移除資料項目 - 資料項目
    // .grid, Grid 元件(Widget).
    // .dataItem, 資料項目.
    // .options(optional), 選項, 目前保留使用.
    // *資料項目顯示內容格式(作業請勿自行使用, 因為元件內部可能變動) : 
    //   <tr class="..." data-uid="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" ... >
    // *注意 : 
    // -資料項目必須存在於 Grid 目前頁次, 否則將不適用(因為該資料項目已不存在於目前顯示畫面).
    // -此函式適用於移除資料項目同時更新顯示 Grid 元件, 若移除動作與元件顯示無關則直接使用 dataSource.remove(dataItem) 方式(無觸發 Grid.Change 事件).
    // -此函式移除資料項目將觸發 Grid.Change 事件.
    // -若移除資料項目無需提示請使用 BasicUsage/BatchEditing 的 GridEnum.NoDeleteConfirmation 選項.
    var tr;
    var selector;
    //
    options = options || {};
    options = $.extend({ }, options);
    //
    selector = "tr[data-uid='" + dataItem.uid + "']"; // 資料項目唯一識別條件, uid 為資料項目內建屬性
    tr = grid.element.find(selector);
    grid.removeRow(tr);
  },

  removeRowByCommand: function(grid, e, options)
  {
    // 移除資料項目 - Command Click 事件
    // .grid, Grid 元件(Widget).
    // .e, Command Click 事件參數物件.
    // -currentTarget, 目的元素, 即 Command Click 事件參數物件的內建屬性.
    // .options(optional), 選項, 目前保留使用.
    // *注意 : 
    // -資料項目隸屬目的元素必須存在於 Grid 目前頁次, 否則將不適用(因為該元素已不存在於目前顯示畫面).
    // -此函式適用於移除資料項目同時更新顯示 Grid 元件, 若移除動作與元件顯示無關則直接使用 dataSource.remove(dataItem) 方式(無觸發 Grid.Change 事件).
    // -此函式移除資料項目將觸發 Grid.Change 事件.
    // -若移除資料項目無需提示請使用 BasicUsage/BatchEditing 的 GridEnum.NoDeleteConfirmation 選項.
    options = options || {};
    options = $.extend({ }, options);
    //
    Grids.removeRowByElement(grid, e.currentTarget, options);
  },

  //
  // 示範
  //
  //   Grid 自訂按鈕移除選擇資料項目 : 
  //
  //   View
  //
  //     .Columns(columns =>
  //     {
  //       columns.Command(command => command.Custom("X").Click("app100.RemoveButton_Click").HtmlAttributes(new { style = "min-width: 30px" })).Title("Remove").Width(55);
  //       ...
  //     
  //   Javascript
  //
  //     RemoveButton_Click: function(e)
  //     {
  //       var grid;
  //       //
  //       grid = ...;
  //       Grids.removeRowByCommand(grid, e);
  //       ...
  //     }
  //
  removeRowByElement: function(grid, element, options)
  {
    // 移除資料項目 - 目的元素
    // .grid, Grid 元件(Widget).
    // .element, 資料項目隸屬目的元素.
    // .options(optional), 選項, 目前保留使用.
    // kendo.ui.Grid ＞ removeRow
    // https://docs.telerik.com/kendo-ui/api/javascript/ui/grid#methods-removeRow
    // kendo.data.DataSource ＞ view
    // https://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-view
    // kendo.data.DataSource ＞ indexOf
    // https://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-indexOf
    // kendo.data.DataSource ＞ columns.command.click
    // https://docs.telerik.com/kendo-ui/api/javascript/ui/grid#configuration-columns.command.click
    // *注意 : 
    // -資料項目隸屬目的元素必須存在於 Grid 目前頁次, 否則將不適用(因為該元素已不存在於目前顯示畫面).
    // -此函式適用於移除資料項目同時更新顯示 Grid 元件, 若移除動作與元件顯示無關則直接使用 dataSource.remove(dataItem) 方式(無觸發 Grid.Change 事件).
    // -此函式移除資料項目將觸發 Grid.Change 事件.
    // -若移除資料項目無需提示請使用 BasicUsage/BatchEditing 的 GridEnum.NoDeleteConfirmation 選項.
    var tr;
    //
    options = options || {};
    options = $.extend({ }, options);
    //
    tr = $(element).closest("tr"); // get the current table row (tr)
    grid.removeRow(tr);
  },

  _getGridText: function(grid)
  {
    // *限 Grids 內部使用, 應用程式請勿使用.
    // 取得 Grid 元件識別文字
    // *Grids 函式類別錯誤處理等提示使用.
    // 傳回值 : Grid 元件識別文字(可能為不為 id 屬性值).
    var result = $(grid.element).attr("id");
    return result;
  },

  getSchema: function(grid)
  {
    // 取得 Grid 元件的 schema 物件
    // .grid, Grid 元件(Widget).
    var result;
    var text;
    //
    text = "('" + Grids._getGridText(grid) + "')";
    result = grid.dataSource.options.schema;
    if (isEmpty(result))
      alert("Grid : getSchema() 發生錯誤 - 取得 Grid 的 schema 物件為空值" + text + ".");
    //
    return result;
  },

  getModelField: function(grid, name)
  {
    // 取得 Grid 元件的 model 欄位定義
    // .grid, Grid 元件(Widget).
    // .name, 欄位屬性名稱.
    // kendo.data.Model ＞ Fields
    // https://docs.telerik.com/kendo-ui/api/javascript/data/model#fields
    // 傳回值 : model 欄位定義.
    var result;
    var schema;
    var text;
    //
    text = "('" + Grids._getGridText(grid) + "')";
    schema = Grids.getSchema(grid);
    result = schema.model.fields[name];
    if (isEmpty(result))
      alert("Grid : getModelField() 發生錯誤 - 取得 Grid 的 field 物件為空值" + text + "('" + name + "').");
    //
    return result;
  },

  //
  // 示範一 : 
  //
  //   Grid 選擇記錄事件(Change)執行時取得目前選擇記錄項目.
  //
  //   ProductGrid_Change: function(e)
  //   {
  //     // 選擇記錄事件
  //     // .e.sender, Grid 元件.
  //     var dataItem;
  //     var sProductID;
  //     //
  //     dataItem = Grids.getSelectedItem(e.sender);
  //     if (isEmpty(dataItem)) // 防呆
  //       return;
  //     //
  //     sProductID = dataItem.ProductID;
  //     ...
  //   },
  //
  // 示範二 : 
  //
  //   功能按鈕 Click 事件執行時取得 Grid 目前選擇記錄項目.
  //
  //   DetailButton_Click: function(e)
  //   {
  //     var grid;
  //     var dataItem;
  //     var sProductID;
  //     //
  //     grid = ...;
  //     dataItem = Grids.getSelectedItem(grid);
  //     if (isEmpty(dataItem))
  //     {
  //       alert("請選擇XXX.");
  //       return;
  //     }
  //     //
  //     sProductID = parseValue(dataItem, "ProductID");
  //      ...
  //    },
  //
  getSelectedItem: function(grid)
  {
    // 取得目前選擇的記錄項目
    // .grid, Grid 元件.
    // kendo.ui.Grid ＞ view
    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-view
    // kendo.ui.Grid ＞ dataItem
    // http://docs.telerik.com/kendo-ui/api/javascript/ui/grid#methods-dataItem
    // *若目前無任何記錄則執行 grid.dataItem(grid.select()) 函式將將引發錯誤 - "Cannot read property '0' of undefined".
    // *注意 : 此 getSelectedItem() 方法為取得目前選擇的記錄項目使用, 
    //         若為 Command 按鈕欄位按下時取得對應目前記錄項目則改用 getCurrentItem() 方法.
    // 傳回值 : 記錄項目物件(即 model 物件可直接取得欄位屬性值), 若不存在將傳回 null.
    var result = null;
    var view;
    var select;
    //
    view = grid.dataSource.view(); // 目前頁次資料檢視物件
    if (view.length <= 0) // 防呆, 若目前頁次記錄筆數為 0 則直接傳回空值
      return result;
    //
    select = grid.select();
    result = grid.dataItem(select);
    //
    return result;
  },

  //
  //  示範 : 
  //
  //  ProcessButton_Click: function(e)
  //  {
  //    var grid;
  //    var dataItems;
  //    var dataItem;
  //    var sValue1;
  //    //
  //    grid = ...;
  //    dataItems = Grids.getSelectedItems(grid);
  //    for (var I = 0; I < dataItems.length; I++)
  //    {
  //      dataItem = dataItems[I];
  //      sValue1 = parseValue(dataItem, "Column1");
  //      ...
  //
  getSelectedItems: function(grid)
  {
    // 取得目前選擇的記錄項目(多筆)
    // kendo.ui.Grid ＞ change
    // http://docs.telerik.com/kendo-ui/api/javascript/ui/grid#events-change
    var result = [];
    var view;
    var selectedRows;
    var dataItem;
    //
    view = grid.dataSource.view(); // 目前頁次資料檢視物件
    if (view.length <= 0) // 防呆, 若目前頁次記錄筆數為 0 則直接傳回空值
      return result;
    //
    selectedRows = grid.select();
    for (var I = 0; I < selectedRows.length; I++)
    {
      dataItem = grid.dataItem(selectedRows[I]);
      result.push(dataItem);
    }
    //
    return result;
  },

  //
  // 示範 : 
  //
  //  currentData = grid.dataSource.data();
  //  data = { param1: value1, param2: value2 };
  //  data = Grids.makeModelParameters(grid,
  //  {
  //    CurrentModels: Grids.getCurrentChanges(grid, currentData), CreateModels: Grids.getCreateChanges(grid, currentData),
  //    UpdateModels: Grids.getUpdateChanges(grid, currentData), DeleteModels: Grids.getDeleteChanges(grid, currentData)
  //  }, data); // 加入 Model 資料
  //  data = { viewModel1: data }; // Action 參數
  //  ajaxPost("...", url, data,
  //  {
  //    success: function(response)
  //    {
  //      ...
  //    }
  //  });
  //
  getCurrentChanges: function(grid, currentData)
  {
    // 讀取 Form Post 格式資料 - 目前有效記錄
    return Grids.getPostChanges(grid, currentData, Grids.DATACHANGES_Current);
  },

  //
  // 示範 : 請參考 getCurrentChanges() 函式.
  //
  getCreateChanges: function(grid, currentData)
  {
    // 讀取 Form Post 格式資料 - 新增部份
    return Grids.getPostChanges(grid, currentData, Grids.DATACHANGES_Create);
  },

  //
  // 示範 : 請參考 getCurrentChanges() 函式.
  //
  getUpdateChanges: function(grid, currentData)
  {
    // 讀取 Form Post 格式資料 - 修改部份
    return Grids.getPostChanges(grid, currentData, Grids.DATACHANGES_Update);
  },

  //
  // 示範 : 請參考 getCurrentChanges() 函式.
  //
  getDeleteChanges: function(grid, currentData)
  {
    // 讀取 Form Post 格式資料 - 刪除部份
    return Grids.getPostChanges(grid, currentData, Grids.DATACHANGES_Destroy);
  },

  //
  // 示範 : 
  //
  //   currentData = Grids.getCurrentData(grid);
  //   for (var I = 0; I < currentData.length; I++)
  //   {
  //     var dataItem = currentData[I];
  //     if (!isEmpty(dataItem.Column1))
  //       ...
  //   }
  //
  getCurrentData: function(grid, currentData)
  {
    // 讀取 dataItem 格式資料 - 目前有效記錄
    // .grid, Grid 元件(Widget).
    // .currentData(object, optional), 資料來源內容, 可不傳入將自動由 Grid 元件 dataSource.data() 方法取得.
    // *傳回值 : dataItem 格式資料, 若無資料長度將為 0.
    currentData = (currentData) ? currentData : grid.dataSource.data();
    return Grids.getDataChanges(grid, grid.dataSource.data(), Grids.DATACHANGES_Current);
  },

  //
  // 示範 : 
  //
  //   createData = Grids.getCreateData(grid);
  //   for (var I = 0; I < createData.length; I++)
  //   {
  //     var dataItem = createData[I];
  //     if (!isEmpty(dataItem.Column1))
  //       ...
  //   }
  //
  //
  getCreateData: function(grid, currentData)
  {
    // 讀取 dataItem 格式資料 - 新增部份
    // .grid, Grid 元件(Widget).
    // .currentData(object, optional), 資料來源內容, 可不傳入將自動由 Grid 元件 dataSource.data() 方法取得.
    // *傳回值 : dataItem 格式資料, 若無資料長度將為 0.
    currentData = (currentData) ? currentData : grid.dataSource.data();
    return Grids.getDataChanges(grid, grid.dataSource.data(), Grids.DATACHANGES_Create);
  },

  //
  // 示範 : 
  //
  //   updateData = Grids.getUpdateData(grid);
  //
  getUpdateData: function(grid, currentData)
  {
    // 讀取 dataItem 格式資料 - 修改部份
    // .grid, Grid 元件(Widget).
    // .currentData(object, optional), 資料來源內容, 可不傳入將自動由 Grid 元件 dataSource.data() 方法取得.
    // *傳回值 : dataItem 格式資料, 若無資料長度將為 0.
    currentData = (currentData) ? currentData : grid.dataSource.data();
    return Grids.getDataChanges(grid, grid.dataSource.data(), Grids.DATACHANGES_Update);
  },

  //
  // 示範 : 
  //
  //   deleteData = Grids.getDeleteData(grid);
  //
  getDeleteData: function(grid, currentData)
  {
    // 讀取 dataItem 格式資料 - 刪除部份
    // .grid, Grid 元件(Widget).
    // .currentData(object, optional), 資料來源內容, 可不傳入將自動由 Grid 元件 dataSource.data() 方法取得.
    // *傳回值 : dataItem 格式資料, 若無資料長度將為 0.
    currentData = (currentData) ? currentData : grid.dataSource.data();
    return Grids.getDataChanges(grid, grid.dataSource.data(), Grids.DATACHANGES_Destroy);
  },
  
  //
  // 示範 : 
  //
  //   unchangedData = Grids.getUnchangedData(grid);
  //
  getUnchangedData: function(grid, currentData)
  {
    // 讀取 dataItem 格式資料 - 無修改記錄
    // .grid, Grid 元件(Widget).
    // .currentData(object, optional), 資料來源內容, 若無傳入將自動由 Grid 元件 dataSource.data() 方法取得.
    // *傳回值 : dataItem 格式資料, 若無資料長度將為 0.
    currentData = (currentData) ? currentData : grid.dataSource.data();
    return Grids.getDataChanges(grid, currentData, Grids.DATACHANGES_Unchanged);
  },

  //
  // 示範 : 請參考 getCurrentChanges() 函式.
  //
  //   currentData = Grids.getDataChanges(grid, grid.dataSource.data(), Grids.DATACHANGES_Current);
  //
  getDataChanges: function(grid, currentData, state, options)
  {
    // *注意 : 此函式限內部使用, 應用程式端非必要請勿使用.
    // 讀取記錄狀態資料
    // .grid, Grid 元件(Widget).
    // .currentData, Grid 資料(使用 Grid's dataSource.data() 等方法取得).
    // .state, 記錄狀態, 異動狀態常數 Grids.DATACHANGES_ 包括 "create", "destroy", "update" 等, 自訂狀態包括 "unchanged" 等.
    // -create, 新增記錄.
    // -destroy, 刪除記錄.
    // -update, 修改記錄.
    // -current, 目前有效記錄(新增/修改/未異動).
    // -unchanged, 未異動記錄.
    // .options, 選項 : 
    // -toJSON(bool), 是否傳回 JSON 格式(ajax post 等使用), 預設值為 false (預設傳回 dataItem 物件).
    // kendo.data.DataSource ＞ data
    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-data
    // Telerik Code Library / UI for ASP.NET MVC Code Library / Grid / Save all changes with one request
    // http://www.telerik.com/support/code-library/save-all-changes-with-one-request
    // ... GridSaveAllChangesWithOneRequest.zip ...
    // *異動狀態的 "create", "destroy", "update" 等為 Kendo UI 官方標準識別名稱.
    // *元件私有屬性存取僅限內部函式(底線起始命名成員, 如 dataSource._destroyed 等), 應用程式端請勿自行存取.
    // *傳回值 : 符合記錄狀態資料, 若無符合記錄則傳回個數為 0.
    // 選項, 若空值(如未傳入)則預設空白選項
    var result = [];
    //
    options = options || {};
    options = $.extend(
    {
      toJSON: false
    }, options);
    // 取得記錄狀態資料
    // *記錄狀態不符合者視同偵測模式(即不處理).
    // *以下為複製官方示範程式碼無變動, 唯 unchanged 為自訂部份.
    //get the new and the updated records
    ////var currentData = grid.dataSource.data();
    var currentRecords = [];
    var updatedRecords = [];
    var newRecords = [];
    var unchangedRecords = [];
    //
    for (var i = 0; i < currentData.length; i++)
    {
      if (currentData[i].isNew())
      {
        //this record is new
        if (options.toJSON && state == Grids.DATACHANGES_Create)
          newRecords.push(currentData[i].toJSON());
        else
          newRecords.push(currentData[i]);

        // current
        if (options.toJSON && state == Grids.DATACHANGES_Current)
          currentRecords.push(currentData[i].toJSON());
        else
          currentRecords.push(currentData[i]);

      }
      else if (currentData[i].dirty)
      {
        //this record is updated
        if (options.toJSON && state == Grids.DATACHANGES_Update)
          updatedRecords.push(currentData[i].toJSON());
        else
          updatedRecords.push(currentData[i]);

        // current
        if (options.toJSON && state == Grids.DATACHANGES_Current)
          currentRecords.push(currentData[i].toJSON());
        else
          currentRecords.push(currentData[i]);

      }
      else
      {
        //this record is unchanged
        if (options.toJSON && state == Grids.DATACHANGES_Unchanged)
          unchangedRecords.push(currentData[i].toJSON());
        else
          unchangedRecords.push(currentData[i]);

        // current
        if (options.toJSON && state == Grids.DATACHANGES_Current)
          currentRecords.push(currentData[i].toJSON());
        else
          currentRecords.push(currentData[i]);

      }
    }
    //this records are deleted
    var deletedRecords = [];
    for (var i = 0; i < grid.dataSource._destroyed.length; i++)
    {
      if (options.toJSON && state == Grids.DATACHANGES_Destroy)
        deletedRecords.push(grid.dataSource._destroyed[i].toJSON());
      else
        deletedRecords.push(grid.dataSource._destroyed[i]);
    }
    // 傳回異動資料(依記錄狀態)
    if (state == Grids.DATACHANGES_Create)
      result = newRecords;
    else if (state == Grids.DATACHANGES_Update)
      result = updatedRecords;
    else if (state == Grids.DATACHANGES_Destroy)
      result = deletedRecords;
    else if (state == Grids.DATACHANGES_Current)
      result = currentRecords;
    else if (state == Grids.DATACHANGES_Unchanged)
      result = unchangedRecords;
    else
      throw new Error("Grids.getData: 記錄狀態未支援('" + state + "').");
    //
    return result;
  },

  getPostChanges: function(grid, currentData, state)
  {
    // 傳回 Form Post 格式資料
    // .grid, Grid 元件(Widget).
    // .currentData(object, optional), 資料來源內容, 可不傳入將自動由 Grid 元件 dataSource.data() 方法取得.
    // .state, 記錄狀態, 詳細請參考 getDataChanges() 方法參數.
    // kendo.data.DataSource ＞ data
    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-data
    // Telerik Code Library / UI for ASP.NET MVC Code Library / Grid / Save all changes with one request
    // http://www.telerik.com/support/code-library/save-all-changes-with-one-request
    // ... GridSaveAllChangesWithOneRequest.zip ...
    // *注意 : 此函式為 ajax post 方式執行 Action 傳送 Model 型態參數等使用. 若需讀取 dataItem 格式則請使用 Grids.getDataChanges(grid, currentData, state) 函式.
    // *傳回值 : Form Post 格式資料.
    var newOptions;
    //
    newOptions = newOptions || {};
    newOptions = $.extend({ toJSON: true }, newOptions);
    currentData = (currentData) ? currentData : grid.dataSource.data(); // 資料來源內容(若未傳入則自動由 Grid 元件讀取)
    return Grids.getDataChanges(grid, currentData, state, newOptions);
  },

  setRowState: function(grid, dataItems, rowState)
  {
    // 設定資料狀態
    // .grid, Grid 元件(Widget).
    // .dataItems, 資料項目.
    // .rowState, 資料狀態(Grids.ROWSTATECODE/HISConst.ROWSTATECODE).
    for (var I = 0; I < dataItems.length; I++)
    {
      var loopItem = dataItems[I];
      if (isEmpty(loopItem.RowState)) // 若資料列狀態空值則填入, 因為 Form POST 若發生錯誤後傳回畫面資料的 model 狀態將遺失因此使用原資料列狀態
        loopItem.RowState = rowState;
    }
  },
  
  getDataChangesWithState: function(grid, options)
  {
    // 取得異動資料項目(包括資料狀態設定 - RowState 屬性)
    // .options(optional), 選項 : 
    // -all(bool, optional), 是否傳回全部資料項目(包括無修改), 預設值為 true (包括傳回無修改資料項目).
    // *傳回資料項目的資料狀態若為空值或 Unchanged 皆表示為無異動.
    // *此函式為 ajax 方式執行資料異動等適用, 資料異動後 Grid 應重新讀取資料以重置資料狀態.
    // 傳回值 : 異動資料項目(包括資料狀態設定), 若無異動且非傳回全部資料項目則個數將為 0.
    var result = new Array();
    var dataItems, currentItems, createItems, updateItems, deleteItems, unchangedItems;
    //
    options = options || {};
    options = $.extend({ all: true }, options);
    dataItems = grid.dataSource.data();
    //Current 不使用/因為將造成資料列狀態不正確(因為 RowState 不為空值將不再設定保持原值)// Current
    //currentItems = Grids.getCurrentData(grid, dataItems);
    //Grids.setRowState(grid, currentItems, Grids.ROWSTATECODE_NoChange); 
    // Create
    createItems = Grids.getCreateData(grid, dataItems);
    Grids.setRowState(grid, createItems, Grids.ROWSTATECODE_Add);
    // Update
    updateItems = Grids.getUpdateData(grid, dataItems);
    Grids.setRowState(grid, updateItems, Grids.ROWSTATECODE_Update);
    // Delete
    deleteItems = Grids.getDeleteData(grid, dataItems);
    Grids.setRowState(grid, deleteItems, Grids.ROWSTATECODE_Delete);
    // 傳回資料項目
    if (options.all) // Unchanged, 若傳回全部資料項目(包括無修改)
    {
      unchangedItems = Grids.getUnchangedData(grid, dataItems); 
      for (var I = 0; I < unchangedItems.length; I++)
        result.push(unchangedItems[I]);
    }
    for (var I = 0; I < createItems.length; I++) // Create
      result.push(createItems[I]);
    for (var I = 0; I < updateItems.length; I++) // Update
      result.push(updateItems[I]);
    for (var I = 0; I < deleteItems.length; I++) // Delete
      result.push(deleteItems[I]);
    //
    return result;
  },

  editInputs: function(selector, e)
  {
    // 尋找欄位的輸入元素
    // .id, 如欄位名稱等
    // .e, kendo grid 事件參數物件.
    // *e.container, 目前記錄或欄位, 視 Grid edit mode 而定.
    // *此方法為 edit 等事件使用.
    var result = e.container.find(selector);
    return result;
  },

  editInput: function(id, e)
  {
    // 尋找指定欄位的輸入元素
    // .id, 如欄位名稱等
    // .e, kendo grid 事件參數物件.
    // *e.container, 目前記錄或欄位, 視 Grid edit mode 而定.
    // *此方法為 edit 等事件使用.
    var result = e.container.find("input[id='" + id + "']"); // 尋找目前記錄項目的符合欄位名稱的 input 元素
    return result;
  },

  endEdit: function(grid, currentData)
  {
    // 是否編輯完成(即輸入驗證不存在)
    // .grid, Grid 元件(Widget).
    // .currentData(object, optional), 資料來源內容, 可不傳入將自動由 Grid 元件 dataSource.data() 方法取得.
    // *注意 : endEdit() 的判斷必須置於 hasChanges() 之前, 因為新增記錄未完成編輯(驗證錯誤存在)將無法由 Grid 判定為異動存在.
    // *傳回值 : 若傳回 true 表示編輯完成(即無輸入驗證錯誤), 否則為 false (輸入驗證錯誤存在).
    var result = true;
    var dataItem;
    var isNew;
    //
    currentData = (currentData) ? currentData : grid.dataSource.data(); // 資料來源內容(若未傳入則自動由 Grid 元件讀取)
    var fieldValidationError = $(grid.element).find(".field-validation-error222");
    fieldValidationError = $(grid.element).find(".field-validation-error");
    if (fieldValidationError.length > 0)
      result = false;
    //
    return result;
  },

  hasChanges: function(grid, currentData)
  {
    // 是否資料異動
    // .grid, Grid 元件(Widget).
    // .currentData(object, optional), 資料來源內容, 可不傳入將自動由 Grid 元件 dataSource.data() 方法取得.
    // *注意 : endEdit() 的判斷必須置於 hasChanges() 之前, 因為新增記錄未完成編輯(驗證錯誤存在)將無法由 Grid 判定為異動存在.
    // *傳回值 : 若傳回 true 表示資料異動存在, 否則為 false (無資料異動).
    var result = false;
    var dataItem;
    var isNew;
    //
    currentData = (currentData) ? currentData : grid.dataSource.data(); // 資料來源內容(若未傳入則自動由 Grid 元件讀取)
    for (var I = 0; I < currentData.length; I++)
    {
      dataItem = currentData[I];
      isNew = dataItem.isNew();
      result = (result || isNew);
      result = (result || dataItem.dirty);
    }
    result = (result || grid.dataSource._destroyed.length > 0); // deleted
    //
    return result;
  },

  // 示範 : 
  //
  //  currentData = grid.dataSource.data();
  //  data = { param1: value1, param2: value2 };
  //  data = Grids.makeModelParameters(grid,
  //  {
  //    CurrentModels: Grids.getCurrentChanges(grid, currentData), CreateModels: Grids.getCreateChanges(grid, currentData),
  //    UpdateModels: Grids.getUpdateChanges(grid, currentData), DeleteModels: Grids.getDeleteChanges(grid, currentData)
  //  }, data); // 加入 Model 資料
  //  data = { viewModel1: data }; // Action 參數
  //  ajaxPost("...", url, data,
  //  {
  //    success: function(response)
  //    {
  //      ...
  //    }
  //  });
  //
  makeModelParameters: function(grid, append, data)
  {
    // 組合 Action 的 Model 型態參數
    // .grid, Grid 元件(Widget).
    // .append, Model 資料(即 Grid's dataItem 型態物件).
    // .data, 原參數.
    // *此函式為模擬傳送 Grid 資料至 Action 的 Model 型態參數.
    // *此函式作用同 $.extend() 函式.
    // *傳回值 : 原參數與 Model 型態參數的組合參數.
    var result = data;
    var parameter;
    var parameterMap;
    //
    result = result || {};
    parameterMap = grid.dataSource.transport.parameterMap;
    $.each(append, function(key, value)
    {
      parameter = {}; // 初始空白
      parameter[key] = value;
      $.extend(result, parameterMap(parameter)); // 動態加入 parameterMap 項目(等同 $.extend(result, parameterMap({ updated: updatedRecords }), ... ); 等固定格式)
    });
    //
    return result;
  },

  saveReject: function(text)
  {
    alert(text + "\n\n" + "請確認後重試.");
  },

  saveSuccess: function()
  {
    notifyMessage("儲存完成");
  },

  promptEndEdit: function()
  {
    // 提示 - 是否編輯完成
    // *此函式為配合 endEdit() 函式一併使用.
    alert("請完成必要輸入後繼續.");
  },

  promptHasChanges: function()
  {
    // 提示 - 是否資料異動
    // *此函式為配合 hasChanges() 函式一併使用.
    alert("目前無異動資料, 請修改資料後再執行.");
  },

  findDateString: function(e)
  {
    // 尋找日期字串欄位的輸入元素
    // .e, kendo grid 事件參數物件.
    // *e.container, 目前記錄或欄位, 視 Grid edit mode 而定.
    // *此方法為 edit 等事件使用.
    var result;
    var inputs;
    var selector;
    //
    selector = "input[dateString='true']"; // dateString 屬性/值必須與 EditorTemplates 定義一致
    inputs = Grids.editInputs(selector, e);
    result = inputs;
    //
    return result;
  },

  //
  // 
  // View : 
  //
  //   @(Html.Kendo().Grid(Model.ListProperty1)
  //     .Name("YourGrid")
  //     ...
  //     .ClientDetailTemplateId("your-template")
  //     ...
  //     .HtmlAttributes(new { }))
  //
  //   <script id="your-template" type="text/kendo-tmpl">
  //
  //     <div class="grid-detail-container" data-uid="#=uid#">
  //
  //       ...
  //
  //     </div>
  //
  //   </script>
  //
  //   注意 : Detail 輸入元素的 container 元素必須使用 class="grid-detail-container" data-uid="#=uid#" 屬性(如示範).
  //
  getMasterUid: function(grid, item)
  {
    // 取得 Grid 記錄唯一記識識別(Kendo uid 定義)
    // .grid, Grid 元件(Widget).
    // .item, Detail 內含元素.
    // *取得 Grid 記錄 uid 實作限內部使用.
    // *因為 ClientDetailTemplateId() 實作產生 Grid 的 k-detail-row 雖然執行時呈現於 k-master-row 下一個元素, 
    //  但尋找父元素將中斷(Detail 輸入元素雖然存在於 k-detail-row 元素但執行時尋找該父元素將找不到),
    //  因此採自行實作 grid-detail-container 元素(內含 model uid 屬性值).
    // prev()
    // https://api.jquery.com/prev/
    // Grid / Detail template
    // http://demos.telerik.com/aspnet-mvc/grid/detailtemplate
    // *傳回值 : Grid 記錄唯一記識識別(Kendo uid 定義), 即輸入元素的 Detail 父元素的對應 Master 元素的 uid, 可使用 getByUid() 函式取得 Grid 記錄 model 物件.
    var result = "";
    var container;
    var text;
    //
    text = "name = '" + $(item).attr("name") + "'"; // 輸入元素識別提示
    // 尋找 Detail 元素
    container = findParent(item, "grid-detail-container"); // 尋找 Detail 元素, 不使用 findParent(item, "k-detail-row") 因為將看得到但找不到.
    if (isEmpty(container))
    {
      alert("getMasterUid: 找不到 Detail 輸入元素對應的記錄物件代號(uid, " + text + ").");
      return result;
    }
    //
    result = $(container).attr("data-uid"); // uid, Kendo 定義屬性值.
    //
    return result;
  },

  parseDetailProperty: function(grid, item)
  {
    // 解析輸入元素的 Model 屬性名稱
    // String.lastIndexOf()
    // https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf
    // 傳回值 : 輸入元素的 Model 屬性名稱.
    var result;
    var name;
    var lastIndexOfDot;
    //
    name = $(item).attr("data-name"); // name, 輸入元素名稱, ex. Height(Model 屬性), Patients[0].Height(Model 集合屬性的物件的屬性, 0 為記錄索引) 等.
    name = (isEmpty(name)) ? $(item).attr("name") : name;
    if (isEmpty(name)) // 防呆
      throw new Error("parseDetailProperty: name is empty.");
    //
    lastIndexOfDot = name.lastIndexOf("."); // 物件屬性符號(.)索引位置
    if (lastIndexOfDot != -1)
      result = name.substr(lastIndexOfDot + 1); // ex. Patients[0].Height -> Height.
    else
      result = name;  // ex. Height -> Height.
    //
    return result;
  },

  //
  // 示範
  //
  //   var grid;
  //   var inputs;
  //   var gridData;
  //   //
  //   grid = $("#YourGrid").data("kendoGrid");
  //   inputs = Kendos.findInputs($("#YourGrid"), ".yourDetailClass1");
  //   Grids.updateDetail(grid, inputs);
  //   //
  //   gridData = grid.dataSource.data();
  //   
  //   *注意 : 取得 Grid 的 dataSource.data() 應置於 updateDetail() 函式之後(即輸入值寫入 model 物件之後).
  //
  updateDetail: function(grid, items)
  {
    // 更新 Detail 輸入
    // .grid, Grid 元件(Widget).
    // .items, Detail 輸入元素.
    // *更新 Detail 輸入為將 Detail 輸入資料寫回實體 model 物件, 因為目前(R2 2017 SP1) Grid 的 Detail 的輸入並未自動寫回 model,
    //  導致 Grid 的 dataSource.data() 取得資料的 Detail 欄位將仍為原值.
    // *Detail 輸入元素, 請使用 Kendos.findInputs() 函式取得輸入元素並傳入此函式, 詳細請參閱函式說明.
    // *此函式表示的 Detail 為資料輸入使用 ClientDetailTemplateId() 建構的 Detail 資料輸入.
    // *Master／Detail 之間 tr 元素關聯 - detail 接續於 master 之下 : 
    //  EX. ＜tr class="k-master-row" data-uid="..." ... ＞
    //      ＜tr class="k-detail-row" ... ＞
    //      ＜td class="..." ... ＞
    //        ...
    //          ＜input ... name="Patients[0].Height" ... ＞
    // Grid / Detail template
    // http://demos.telerik.com/aspnet-mvc/grid/detailtemplate
    // kendo.data.DataSource ＞ getByUid
    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-getByUid
    // kendo.ui.Grid ＞ set
    // http://docs.telerik.com/kendo-ui/api/javascript/data/model#methods-set
    // jQuery.each()
    // http://api.jquery.com/jquery.each/
    // 傳回值 : 無.
    var model = null, detail;
    var details = {};
    var uid, prop;
    var value;
    // 取得記錄欄位輸入值
    // *取得全部記錄的欄位輸入值後再執行 model.set() 函式, 否則因為每次 model.set() 函式執行皆將觸發 Grid 元件 detailInit 事件並自動重置明細顯示內容因此導致後續取得的明細輸入資料遺失(被還原為原值).
    for (var I = 0; I < items.length; I++)
    {
      var loopItem = items[I];
      //
      uid = Grids.getMasterUid(grid, loopItem); // 記錄 uid
      if (isEmpty(uid)) // 防呆
        throw new Error("updateDetail: uid is empty.");
      //
      model = grid.dataSource.getByUid(uid);
      prop = Grids.parseDetailProperty(grid, loopItem); // model 物件屬性名稱
      value = Kendos.parseValue(loopItem); // 取得輸入值(依元件型態)
      // 填入記錄欄位輸入值
      detail = details[uid]; // 取得陣列中符合 uid 的 model 物件, 若為空值表示新加入 model 物件
      if (isEmpty(detail))
      {
        detail = { model: model, values: {} };
        details[uid] = detail;
      }
      detail.values[prop] = value;
    }
    // 批次異動, 填入各 model 物件的欄位屬性值
    $.each(details, function(uid, detail)
    {
      $.each(detail.values, function(key, value)
      {
        var field = Grids.getModelField(grid, key);
        var oldValue = detail.model[key];
        //
        detail.model[key] = value; // 填入 model 物件屬性值(由 Detail 取得輸入值填回)
        if (field.type == "number" && (detail.model[key] == null || !isNumeric(value))) // 防呆, 填入原值, 因為數字型態屬性若填入空白或非數字則屬性值將變為 null 且輸入元素將直接顯示 "null" 字串.
        {
          detail.model[key] = null; // 清除後填入原值(碓實觸發更新畫面顯示, 測試發現如原值 14 填入 "14s" 將保留原值但畫面仍顯示 "14s" 等)
          detail.model[key] = oldValue;
        }
      });
    });
  },

  //
  // 示範
  //
  //   JavaScript
  //
  //     Grid 選擇記錄事件(Change).
  //
  //     ProductGrid_Change: function(e)
  //     {
  //       // 選擇記錄事件
  //       // .e.sender, Grid 元件.
  //       var DetailGrid = ...;
  //       var dataItem;
  //       //
  //       Grids.change(e); // 預設 change 事件處理函式
  //       //
  //       dataItem = Grids.getSelectedItem(e.sender);
  //       if (isEmpty(dataItem)) // 防呆
  //         return;
  //       //
  //       if (e.selectChanged)
  //       {
  //         Grids.clearData(DetailGrid); // 預先清除資料(防呆)
  //         Grids.read(DetailGrid); // 讀取資料
  //       }
  //     },
  //   
  //   *注意 : YourGrid 等元件命名僅為示範, 請自行修改為實際元件名稱.
  //
  change: function(e, options)
  {
    // 
    // *限 change 事件使用.
    // 
    // Implement the event handler for Change
    // .e, change 事件參數物件.
    // .options, 選項(optional, 保留使用).
    // *因為目前選擇記錄的不同儲存格選擇仍將觸發 Grid 元件 Change 事件, 
    //  因此若 Grid 元件 Change 事件中需判斷選擇動作為不同記錄選擇則可使用此共同事件處理函式.
    // 傳回值 : e.selectChanged(bool), 若為 true 表示為不同記錄選擇, 否則為 false (相同記錄選擇).
    var dataItem;
    var prevId;
    //
    options = options || {};
    options = $.extend({ property1: false }, options);
    //
    e.selectChanged = true;
    //
    dataItem = Grids.getSelectedItem(e.sender);
    prevId = $(e.sender.element).attr("grid-prev-uid"); // 記錄註記(自訂內部屬性)
    if (!isEmpty(dataItem))
    {
      e.selectChanged = (prevId != dataItem.uid); // 是否為不同記錄選擇(若記錄註記與目前記錄 uid 不同)
      $(e.sender.element).attr("grid-prev-uid", dataItem.uid);
    }
  },

  //
  // 示範
  //
  //   View(Grid)
  //
  //     -- Grid --
  //
  //      @(Html.Kendo().Grid(...)
  //        ...
  //        .ClientDetailTemplateId("yourGrid-detail-template")
  //        ...
  //
  //     -- script --
  //
  //     <script id="yourGrid-detail-template" type="text/kendo-tmpl">
  //
  //       #if(...)
  //       {#
  //
  //         <div class="grid-detail-container" data-uid="#=uid#">
  //
  //           <label> ... </label>
  //
  //         </div>
  //
  //       #}#
  //
  //     </script>
  //
  //   *注意 : YourGrid 等元件命名僅為示範, 請自行修改為實際元件名稱.
  //
  dataBound: function(e, options)
  {
    //
    // *限 dataBound 事件使用.
    //
    // Implement the event handler for DataBound
    // .e, dataBound 事件參數物件.
    // -autoExpand(bool, optional), 是否自動展開全部資料列, 預設值為 false (不自動展開全部資料列, 否則若明細使用 Read 方法將一次讀取全部明細資料等).
    // -detailContainerMode(bool, optional), 是否使用 Detail Container 模式, 若為 true 表示使用 Detail Container 模式, 
    // -headerInput(bool, optional), 是否開啟 HeaderTemplate 輸入, 預設值為 true.
    //  而 Detail 內容必須置於 div class = "grid-detail-container" 元素內否則即使 Detail 內容存在將仍認定為 Detail 內容空白而不呈現.
    //  預設值為 false (無條件顯示全部資料明細列).
    options = options || {};
    options = $.extend({ autoExpand: false, detailContainerMode: false, headerInput: true }, options);
    //
    if (options.autoExpand)
      Grids.expandRow(e, options);
    // 開啟 HeaderTemplate 輸入
    // *若 Grid 使用 Navigatable 或 Sortable 等功能則自訂 HeaderTemplate 內的 TextBox 輸入元素將無法進行輸入(focus 將無作用).
    if (options.headerInput)
    {
      // 
      e.sender.thead.on("mousedown", "th input", function(e)
      {
        e.stopPropagation();
      });
    }
  },

  edit: function(e)
  {
    //
    // *限 edit 事件使用.
    //
    // Implement the event handler for Edit
    // Grid edit - 日期/時間 : 
    // 1.無論 DateTime 或 String 欄位型態, 進入/離開編輯儲存格(Cell)將各觸發一次 edit 事件.
    //   進入編輯儲存格(Cell)觸發的 edit 事件, 此時必須進行 e.model 欄位屬性值格化後填入 input 元素. 
    //   離開編輯儲存格(Cell)再觸發的 edit 事件(但此時因為欄位編輯結束因此該儲存格不會有 input 元素)
    //   並將自動以元件輸入值填入 e.model 欄位屬性, 因此有第 2 點情況.
    //   *數值顯示格式化將另外由 ClientTemplate 等處理(若有使用).
    // 2.若 DateTime 欄位型態則 e.model 欄位屬性值格式為 "Fri Dec 16 22:48:53 UTC+0800 2016 [Object, Date]",
    //   若 String 欄位型態則 e.model 欄位屬性值格式為 "Tue Mar 2 00:00:00 UTC+0800 2010 [String]".
    //   *String 欄位型態於 Controller 的 Action 取得數值將由 BaseController 自動進行日期/時間格式化(如 2017/1/1 ＞ 20170101 等).
    // 3.若 String 欄位型態, 進入編輯儲存格(Cell)將觸發 edit 事件, 但因為 String 欄位型態不為 DatePicker 元件支援,
    //   因此必須手動將 e.model 欄位屬性值填入 input 元素, 否則進入編輯時元件將顯示空白(但編輯皆正常
    //   僅無法預設/帶入 e.model 欄位屬性值至元件).
    // *注意 : 若作業應用 Grid 元件時自訂 edit 事件處理函式, 則需同時呼叫此標準 edit 事件處理函式, Grid 進入編輯模式時即可正確帶入日期數值等至欄位輸入元素.
    //  http://docs.telerik.com/kendo-ui/api/javascript/ui/grid#events-edit
    if (Grids.isNew(e))
    {
      // 新記錄填入記錄唯一識別代碼
      if (isEmpty(e.model.UniqueID))
        e.model.set("UniqueID", Kendos.uniqueId());
    }
    //
    if (e.sender.options.editable.mode == "incell")
    {
      // 日期字串, 手動帶入目前欄位值至輸入元素, 因為 kendo datepicker 無法自動帶入字串型態欄位的值至輸入元素.
      var index = Grids.getColumnIndex(e); // 因為 Grid 可能包含 Locked 欄位因此不可直接使用 e.container.index(); 方式, 否則目前輸入元素將不正確帶入前一個欄位的值.
      var name = e.sender.columns[index].field; // 目前編輯欄位名稱, 替代 ＄（input）.attr("id");
      //
      dateStringInput = Grids.findDateString(e)
      if (dateStringInput.length == 1) // 進入日期字串的編輯
      {
        var value = e.model[name]; // 目前欄位值
        var formattedValue = DateTimes.formatDate(value); // 格式化目前欄位值(datepicker 元件可識別的日期格式)
        $(dateStringInput).val(formattedValue);
      }
    }
  },

  index: function(grid, dataItem)
  {
    // 傳回資料項目的索引位置
    // .grid, Grid 名稱或元素.
    // .dataItem, 資料項目.
    var result;
    var data;
    //
    grid = (typeof grid === "string") ? $("#" + grid).data("kendoGrid") : grid.data("kendoGrid");
    data = grid.dataSource.data();
    result = data.indexOf(dataItem);
    //
    return result;
  },

  isNew: function(e)
  {
    // 傳回目前記錄是否為新記錄(for change/edit event)
    // kendo.ui.Grid ＞ edit(e) ＞ e.model
    // http://docs.telerik.com/kendo-ui/api/javascript/ui/grid#events-edit
    // kendo.data.Model ＞ isNew
    // http://docs.telerik.com/kendo-ui/api/javascript/data/model#methods-isNew
    // ... Checks if the Model is new or not. The id field is used to determine if a model instance is new or existing one. ...
    // kendo.data.Model ＞ id
    // http://docs.telerik.com/kendo-ui/api/javascript/data/model#fields-id
    // kendo.data.Model ＞ dirty
    // http://docs.telerik.com/kendo-ui/api/javascript/data/model#fields-dirty
    // *change event : e.sender.
    // *edit event: e.sender, e.model.
    var result = false;
    var dataItem;
    var isNew, dirty;
    //
    try
    {
      // edit event
      isNew = e.model.isNew();
      dirty = e.model.dirty;
      //console.log(e.model.id); // outputs 1
      //console.log(e.model.idField); // outputs "personId"
    }
    catch (err)
    {
      // change event
      dataItem = Grids.getSelectedItem(e.sender); // dataItem = model
      isNew = dataItem.isNew();
      dirty = dataItem.dirty;
    }
    // 是否為新記錄
    if (isNew)
    {
      result = true;
    }
    //
    return result;
  },

  //
  // 示範 : 
  //
  //   Javascript
  //
  //     SaveButton_Click: function(e)
  //     {
  //       // 儲存
  //       var grid = ...;
  //       var data;
  //       //
  //       data = { ..., products: Grids.getDataChangesWithState(grid) } };
  //       ajaxPost("儲存(...)", "/Controller1/Action1", data,
  //       {
  //         success: function(response)
  //         {
  //           // .response, 回覆內容.
  //           Grids.saveSuccess();
  //           Grids.read(grid);
  //         }
  //       });
  //     },
  //
  read: function(grid, options)
  {
    // Grid read()
    // .grid, Grid 元件(Widget).
    // .options(optional), 選項 : 
    // -data(object, optional), 讀取參數內容.
    // -keepPage(bool, optional), 是否維持目前頁次, 前題為目前頁次有資料, 否則將仍自動切至第一頁. 預設值為 false (重新讀取資料後自動切至第一頁).
    // kendo.ui.Pager ＞ page
    // https://docs.telerik.com/kendo-ui/api/javascript/ui/pager/methods/page
    // Promise API to track when a request finishes
    // https://docs.telerik.com/kendo-ui/api/javascript/data/datasource/methods/read
    // *Use the Promise API to track when a request finishes.
    // *此函式為封裝 Grid read() 函式 - 若目前頁次不為 1 則自動切至第一頁.
    // *因為原始 Grid read() 函式執行後, 若資料筆數(10)不足目前頁次資料筆數(2, 11-20)將仍非預期維持目前頁次(2)
    //  導致 Grid 顯示 "無顯示資料" 的情況(但第一頁或前一頁實際有資料). 之後將調整使用 "目前頁次無資料" 提示文字.
    var view;
    var page;
    //
    options = options || {};
    options = $.extend({ data: { }, keepPage: false }, options);
    //
    grid.dataSource.read().then(function()
    {
      // Promise API, 執行於 DataBound 事件之後.
      // *若 Grid Pageable(false) 則 pager 屬性將為空值(因為不存在).
      if (grid.pager)
      {
        page = grid.pager.page(); // 目前頁次
        if (options.keepPage) // 維持目前頁次
        {
          view = grid.dataSource.view(); // 取得目前頁次的資料檢視
          if (view.length <= 0) // 若目前資料檢視為 0 筆則自動切至第一頁
            grid.pager.page(1);
        }
        else if (page != 1) // 若目前頁次不為 1 則自動切至第一頁
        {
          grid.pager.page(1);
        }
      }
    });
  },

  method1: function()
  {
  }
});

$(function()
{
  // initialize
  DateTimes = new DateTimes();
  Grids = new Grids();
});

/* end */
