  /*
    custom.utils.js - 2015-01-25
    
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
  
  function isEmpty(value)
  {
    // 是否空值
    // *此方法為數值變數使用, 若值為空白, null[下拉元件無資料繫結等], 未定義等皆表示空值.
    // *若傳回 true 表示值不存在, 否則傳回 false.
    var result = (value == "" || value == null || value == undefined);
    return result;
  }

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

  function formatAjaxError(error, isService)
  {
    var result = "";
    //
    if (isService)
    {
      // WCF 服務錯誤格式化
      result = error.responseText;
      if (result == undefined || result == "")
        result = "連結服務未啟動等";
    }
    else
    {
      // WebService 錯誤格式化
      result = error.responseText;
      if (result == undefined || result == "")
        result = "服務方法未正確定義等";
    }
    result = result + ", statusText = '" + error.statusText + "'";
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

  /* end */