/*
  custom.kendo.treeview.js?date=20170820-1000

    Custom kendo-treeview relative method.
   
    depends : jquery-ui.css (for dialog, etc)
              custom.utils.js
              custom.jquery.utils.js
              custom.widget.css
*/

var TreeViews = function()
{
  this._member = null; // member
};

$.extend(TreeViews.prototype,
{
  removeByUid: function(treeview, uid)
  {
    // treeview, TreeView 元件(Widget).
    // uid(string), 節點唯一代號(數值來源為 TreeView 節點物件內建 uid 屬性).
    var found;
    //
    found = treeview.findByUid(uid);
    treeview.remove(found);
  },

  method1: function()
  {
  }
});

$(function()
{
  // Initialize instance
  TreeViews = new TreeViews();
});

/* end */
