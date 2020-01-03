/*
  Start Page

    Author : USER
    Date   : 2017/04/20 10:00

    實作事項

    ．起始頁面

      目前系統起始頁面, 由起始頁面重新導向至系統首頁.
*/

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using HIS.Entity.Models;
using HIS.Mvc;
using HIS.Mvc.ComponentModel.DataAnnotations;
using HIS.Mvc.Controller;
using HIS.Systems;
using Kendo.Mvc.Extensions;

namespace HISMvcProject1.Controllers
{
  public class StartPageController : HISLayoutController
  {
    public StartPageController()
    {
    }

    [RedirectToAction]
    public ActionResult Index()
    {
      // 重新導向至系統首頁
      return RedirectToAction("Contact", "Home"); // TODO: Your real system start page
    }
  }
}
