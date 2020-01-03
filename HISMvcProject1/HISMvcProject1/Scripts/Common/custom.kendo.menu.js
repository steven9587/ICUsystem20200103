/*
  custom.kendo.menu.js?date=20170820-1200

    Custom kendo-menu relative method.
   
    depends : jquery-ui.css (for dialog, etc)
              custom.utils.js
              custom.jquery.utils.js
              custom.widget.css
*/

var MenuSelect = function(e)
{
  this.id = e.item.id; // 初始屬性值
  this.item = e.item;
  this.sender = e.sender;
  //
  this._e = e;
  this._member = null; // member
};

$.extend(MenuSelect.prototype,
{
  text: function()
  {
    // 傳回選單項目文字
    // .item, 選單項目, 如 select 等事件 e.item 屬性方式取得.
    var result = (this._e != null) ? $(this._e.item).children(".k-link").text() : ""; // 取 menuitem 文字無提供內建方法, 使用官方 Forum 建議做法.
    return result;
  }
});

var Menus = function()
{
  this._member = null; // member
};

$.extend(Menus.prototype,
{
  //
  // 示範 : 
  //
  //  var menuitem = Menus.selectMenuItem(e);
  //  var id, text;
  //  //
  //  id = menuitem.id;
  //  text = menuitem.text();
  //
  selectMenuItem: function(e)
  {
    // 傳回 MenuSelect 物件, 簡化取得選單項目文字等.
    // .e, Menu 事件參數物件, 如 select 事件等.
    // kendo.ui.Menu ＞ Events ＞ select
    // http://docs.telerik.com/kendo-ui/api/javascript/ui/menu#events-select
    var result = new MenuSelect(e);
    return result;
  },

  //
  // 示範 : 
  //
  //   Menu1_Select: function(e)
  //   {
  //     var text;
  //     //
  //     text = Menus.getMenuText(e.item);
  //     ...
  //
  getMenuText: function(item)
  {
    // 取得選單項目文字
    // .item, 選單項目, 如 select 事件 e.item 屬性.
    var result;
    var menuitem;
    //
    menuitem = Menus.selectMenuItem({ item: item, sender: item });
    result = menuitem.text();
    //
    return result;
  },

  findByText: function(sender, text)
  {
    // 尋找選單項目 - 選單文字相同
    // .sender, ContextMenu/Menu 元件 Widget.
    // .text, 選單文字.
    // *此函式為仿照 TreeView 元件 findByText() 函式, 原始 ContextMenu/Menu 元件無內建相關函式.
    // 傳回值 : 符合的選單項目元素 Html 物件(同 select 事件 e.item 屬性格式), 若無符合者將傳回空物件(undefined).
    // :contains() Selector
    // https://api.jquery.com/contains-selector/
    // Menu find() Demo
    // http://dojo.telerik.com/EfeJA
    var result = undefined;
    var items;
    //
    items = $(sender.element).find(".k-link:contains('" + text + "')"); // 符合搜尋的文字元素(s)
    $(items).each(function()
    {
      var loopElement = this; // 選單項目文字元素(span)
      var loopParent = $(loopElement).parent();
      var loopText = $(loopElement).text();
      // 防呆, 檢核選單項目的文字元素上層為選單項目元素
      if (!$(loopParent).hasClass("k-item"))
        throw new Error("Menus.findByText: 上層元素不為選單項目元素(class: k-item) - " + text + ".");
      if (result == undefined && loopText == text) // equals text
        result = $(loopParent)[0]; // 選單項目文字元素的上層元素 Html 物件(同 select 事件 e.item 屬性格式), 因為模擬 select 事件應傳入相同的元素格式(為 Html 元素非 jquery 元素物件).
    });
    //
    return result;
  },

  findById: function(sender, id)
  {
    // 尋找選單項目 - id
    // .sender, ContextMenu/Menu 元件 Widget.
    // .id, 選單項目元素 id.
    // *此函式為仿照 TreeView 元件 findByUid() 函式, 原始 ContextMenu/Menu 元件無內建相關函式.
    // 傳回值 : 符合的選單項目元素 Html 物件(同 select 事件 e.item 屬性格式), 若無符合者將傳回空物件(undefined).
    // :contains() Selector
    // https://api.jquery.com/contains-selector/
    // Menu find() Demo
    // http://dojo.telerik.com/EfeJA
    var result = undefined;
    var items;
    //
    items = $(sender.element).find("#" + id); // 符合 id 的文字元素(s)
    $(items).each(function()
    {
      var loopElement = this; // 選單項目元素
      // 防呆, 檢核選單項目的文字元素上層為選單項目元素
      if (!$(loopElement).hasClass("k-item"))
        throw new Error("Menus.findByID: 元素不為選單項目元素(id = '" + id + "'.");
      if (result == undefined)
        result = $(loopElement)[0]; // 選單項目元素 Html 物件(同 select 事件 e.item 屬性格式), 因為模擬 select 事件應傳入相同的元素格式(為 Html 元素非 jquery 元素物件).
    });
    //
    return result;
  },

  findMenu: function(item)
  {
    // 尋找選單
    // .item, 目前選單項目*1.
    // *1 目前選單項目, 如 select 事件 e.item 屬性等方式取得.
    var result = undefined;
    var currentItem;
    var counter = 0;
    //
    currentItem = item; // 初始目前 item 為傳入 item
    while (true)
    {
      currentItem = $(currentItem).parent(); // 不使用 parentElement 屬性, 因為若選單元素為 trigger select 傳入 jquery 元素則讀取 parent 使用 parentElement 屬性將出現錯誤 "", 雖然除錯時檢查屬性卻實有值(Fxxk) currentItem.parentElement; // 目前 item 的上一層 item
      if (counter >= 200)
        break;
      if ($(currentItem).hasClass("k-menu")) // menu 主要元素, 表示選單元件搜尋結束
      {
        result = $(currentItem)[0]; // 選單項目 Html 物件(同 select 事件 e.item 屬性格式)
        break;
      }
      //
      counter++;
    }
    //
    return result;
  },

  //
  // 示範 : 
  //
  //   var item;
  //   //
  //   item = findMenuItem(menu); // 尋找第一個選單項目
  //   item = findMenuItem(menu, item); // 尋找選單項目的第一個子選單項目
  //   item = findMenuItem(menu, item, 1); // 尋找選單項目的第二個子選單項目
  //
  findMenuItem: function(menu, item, index)
  {
    // 尋找選單項目
    // .menu, ContextMenu/Menu 元件(Widget).
    // .item(optional), 上層選單項目, 若未指定則尋找第一個選單項目.
    // .index(int, optional), 選單項目索引位置, 若未指定則尋找第一個選單項目.
    // Context Menu ＞ Dynamic Items
    // http://docs.telerik.com/kendo-ui/controls/navigation/menu/contextmenu
    // Menu / API
    // https://demos.telerik.com/aspnet-mvc/menu/api
    // 傳回值 : 符合的選單項目元素 Html 物件(同 select 事件 e.item 屬性格式), 若無符合者將傳回空物件(undefined).
    var result;
    //
    if (isEmpty(item)) // 若未指定選單項目由第一層開始尋找
      item = menu.element;
    index = (!isEmpty(index)) ? index : 0; // 若未指定預設第一個選單項目(index: 0)
    //
    result = $(item).children("li").eq(index); // 選單項目的子選單項目(索引)
    // 搜尋內含子選單的子選單項目(索引), 若前方查無直接子選單項目(如傳入的 item 參數未指定時)
    if (!isValidObject(result))
    {
      item = $(item).find("ul:first");
      result = $(item).children("li").eq(index);
    }
    result = (isValidObject(result)) ? result : undefined;
    //
    return result;
  },

  findParentItem: function(item)
  {
    // 尋找上層選單項目
    // .item, 目前選單項目*1.
    // *1 目前選單項目為如 select 事件 e.item 屬性等方式取得.
    // *因為尋找目前選單項目的上層選單項目, 因此不直接判斷目前選單項目必須由傳入的目前選單項目的 parent 元素開始尋找.
    var result = undefined;
    var currentItem;
    var counter = 0;
    //
    currentItem = item; // 初始目前 item 為傳入 item
    while (true)
    {
      currentItem = $(currentItem).parent(); // 不使用 parentElement 屬性, 因為若選單元素為 trigger select 傳入 jquery 元素則讀取 parent 使用 parentElement 屬性將出現錯誤 "", 雖然除錯時檢查屬性卻實有值(Fxxk) currentItem.parentElement; // 目前 item 的上一層 item
      if (counter >= 200)
        break;
      if ($(currentItem).hasClass("k-menu")) // menu 主要元素, 表示選單元件搜尋結束
        break;
      if ($(currentItem).hasClass("k-item")) // menu item, 表示找到上層選單項目
      {
        result = $(currentItem)[0]; // 選單項目 Html 物件(同 select 事件 e.item 屬性格式)
        break;
      }
      //
      counter++;
    }
    //
    return result;
  },

  getSelectedMenuItem: function(sender)
  {
    // 取得選擇選單項目
    // .sender, ContextMenu/Menu 或選單項目元素.
    // 傳回值 : 選擇選單項目, 是否存在選擇選單項目使用 isValidObject() 函式.
    var result;
    //
    result = Menus.getSelectedMenuItems(sender);
    result = $(result).first(); // 注意 : 傳回值需使用 first() 函式, 因為 elements[index] 格式將直接傳回元素物件(無 length 屬性)而若使用 isValidObject() 函式將判斷物件不存在.
    //
    return result;
  },

  getSelectedMenuItems: function(sender)
  {
    // 取得所有選擇選單項目
    // .sender, ContextMenu/Menu 或選單項目元素.
    // 傳回值 : 所有選擇選單項目, 是否存在選擇選單項目使用 isValidObject() 函式.
    var result = $(sender).find(".k-item.k-state-selected"); // 所有選擇選單項目
    return result;
  },

  markMenuItemSelected: function(menu, item, options)
  {
    // 標示選單項目選擇
    // .menu, ContextMenu/Menu 元件(Widget), 如 Menu 元件 select 事件 e.sender 屬性.
    // .item, 選單項目元素, 如 Menu 元件 select 事件 e.item 屬性.
    // .options(optional), 選項(保留使用).
    // *原始 ContextMenu/Menu 元件未提供標示選單項目選擇的相關函式因此實作此函式.
    // Menu / Events
    // http://demos.telerik.com/aspnet-mvc/menu/events
    // kendo.ui.Menu ＞ select
    // http://docs.telerik.com/kendo-ui/api/javascript/ui/menu#events-select
    // 傳回值 : 無.
    var elements;
    //
    elements = $(menu.element).find(".k-item"); // 傳入 Menu 元件的所有選單項目
    $(elements).removeClass("k-state-selected"); // 清除所有選單項目選擇
    //
    $(item).addClass("k-state-selected"); // 標示選單項目選擇
  },

  selectByItem: function(sender, item)
  {
    // 執行選單項目 - 指定選單項目
    // .sender, ContextMenu/Menu 元件 Widget.
    // .item, 指定選單項目的 Html 元素物件(同 select 事件 e.item 屬性格式).
    // 傳回值 : 符合的選單項目元素 Html 物件(同 select 事件 e.item 屬性格式), 若無符合者將傳回空物件(undefined).
    // kendo.ui.ContextMenu
    // http://docs.telerik.com/kendo-ui/api/javascript/ui/contextmenu
    // kendo.Observable ＞ trigger
    // http://docs.telerik.com/kendo-ui/api/javascript/observable#methods-trigger
    // kendo.ui.ContextMenu ＞ select
    // http://docs.telerik.com/kendo-ui/api/javascript/ui/contextmenu#events-select
    // kendo.ui.TreeView
    // http://docs.telerik.com/kendo-ui/api/javascript/ui/treeview
    var result = item;
    //
    if (!(sender)) // 防呆, 因為若元件無效將為 undefined - ＄(...).data("...") 方式
      return result;
    if (result)
      sender.trigger("select", { item: result });
    //
    return result;
  },

  selectByText: function(sender, text)
  {
    // 執行選單項目選擇 - 選單文字
    // .sender, ContextMenu/Menu 元件 Widget.
    // .item, 選單項目元素 Html 物件(同 select 事件 e.item 屬性格式).
    // .text, 選單文字.
    // 傳回值 : 符合的選單項目元素 Html 物件(同 select 事件 e.item 屬性格式), 若無符合者將傳回空物件(undefined).
    var result = undefined;
    //
    if (!(sender)) // 防呆, 若元件無效則為 undefined - ＄(...).data("...") 方式
      return result;
    //
    result = Menus.findByText(sender, text);
    if (result)
      Menus.selectByItem(sender, result);
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
  Menus = new Menus();
});

/* end */
